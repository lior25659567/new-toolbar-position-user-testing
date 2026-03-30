import React, { useState, useCallback, useEffect } from 'react';
import { color, font, space, radius, transition } from '../../design-system/tokens';
import { PrimaryButton, SecondaryButton, IconButton, Toggle } from '../../design-system';
import UndercutViewer from './UndercutViewer';
import StatsPanel from './StatsPanel';
import { useUndercutAnalysis } from './useUndercutAnalysis';
import type { UndercutStage, EntryContext, ArchType } from './types';
import { DEFAULT_ENTRY_CONTEXT } from './types';

interface UndercutPageProps {
  onBackToHome: () => void;
  entryContext?: EntryContext;
}

// ─── Procedure Mode ─────────────────────────────────────────────────────────

type ProcedureMode = 'crown' | 'bridge' | 'bridge-2' | 'full-arch';

// ─── Heatmap Legend ─────────────────────────────────────────────────────────

const HEATMAP_COLORS = [
  '#0066FF', '#0197EC', '#3FBAFF', '#0FF4FC', '#2CE9C6', '#54BF00',
  '#FFE600', '#FFD600', '#FFA008', '#F7771A', '#FF0000', '#C61313',
];
const HEATMAP_LABELS = ['0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9','1.0','1.1','1.2','1.3','1.4','1.5','1.6'];

function HeatmapLegend() {
  return (
    <div style={{ width: '802px', height: '68px', position: 'relative', margin: '0 auto' }}>
      <div style={{ position: 'absolute', top: '13.24%', left: 0, right: 0, display: 'flex', height: '22px' }}>
        {HEATMAP_COLORS.map((c, i) => (
          <div key={i} style={{ width: `${802 / 12}px`, height: '20px', backgroundColor: c, flexShrink: 0 }} />
        ))}
      </div>
      <div style={{ position: 'absolute', top: '52.94%', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '802px', gap: '29px' }}>
        {HEATMAP_LABELS.map((l, i) => (
          <span key={i} style={{
            width: '28px', height: '32px', fontFamily: 'Avenir, sans-serif', fontSize: '16px',
            fontWeight: 400, lineHeight: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#000',
          }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Small Icons ────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12 4L4 12M4 4L12 12" stroke={color.neutral600} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 1 9 9" /><polyline points="3 3 3 12 12 12" />
    </svg>
  );
}

// ─── Procedure Mode Pills ───────────────────────────────────────────────────

function ModePills({ mode, onChange, disabled }: {
  mode: ProcedureMode;
  onChange: (m: ProcedureMode) => void;
  disabled: boolean;
}) {
  const options: { value: ProcedureMode; label: string }[] = [
    { value: 'crown', label: 'Crown' },
    { value: 'bridge', label: 'Bridge' },
    { value: 'bridge-2', label: 'Bridge 2' },
    { value: 'full-arch', label: 'Full Arch' },
  ];
  return (
    <div style={{
      display: 'flex', gap: '4px',
      padding: '3px', borderRadius: radius.md,
      backgroundColor: color.neutral50,
    }}>
      {options.map(opt => {
        const active = opt.value === mode;
        return (
          <button
            key={opt.value}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1, padding: '5px 0', border: 'none', cursor: disabled ? 'default' : 'pointer',
              borderRadius: '6px',
              fontSize: '11px', fontWeight: active ? 600 : 400, lineHeight: '16px',
              color: active ? color.white : color.textSubtle,
              backgroundColor: active ? color.primary : 'transparent',
              boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: `all 0.15s ease`,
              opacity: disabled ? 0.5 : 1,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Arch Navigator ─────────────────────────────────────────────────────────

function ArchNav({ activeArch, onSwitch, show }: {
  activeArch: ArchType;
  onSwitch: (arch: ArchType) => void;
  show: boolean;
}) {
  if (!show) return null;
  const other: ArchType = activeArch === 'upper' ? 'lower' : 'upper';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: space[3],
    }}>
      <button onClick={() => onSwitch(other)} style={navBtnStyle}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <span style={{ fontSize: '11px', fontWeight: 600, color: color.textHeading, minWidth: '70px', textAlign: 'center' }}>
        {activeArch === 'upper' ? 'Upper Jaw' : 'Lower Jaw'}
      </span>
      <button onClick={() => onSwitch(other)} style={navBtnStyle}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 6 15 12 9 18" /></svg>
      </button>
    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  padding: '4px', display: 'flex', alignItems: 'center',
  color: color.textSubtle, borderRadius: '4px',
};

// ─── Toast messages ─────────────────────────────────────────────────────────

function getToast(stage: UndercutStage, count: number, mode: ProcedureMode, linked: boolean, accepted: boolean = true): string {
  if (stage === 'confirm') return 'Insertion path confirmed. Undercuts and path are locked.';

  if (mode === 'full-arch') {
    return count === 0
      ? 'Loading full arch analysis...'
      : 'Full arch \u2014 drag the arrow to adjust the shared insertion path.';
  }

  if (mode === 'bridge-2') {
    if (count === 0) return 'Tap teeth on the model to define bridge span.';
    if (count === 1) return 'Tap at least one more tooth.';
    if (!accepted) return `${count} teeth selected \u2014 accept selection to begin analysis.`;
    return linked
      ? 'Bridge linked \u2014 drag the arrow to adjust the shared insertion path.'
      : 'Bridge unlinked \u2014 each tooth has an independent insertion path.';
  }

  if (mode === 'bridge') {
    if (count === 0) return 'Tap 2 or more adjacent teeth to define the bridge span.';
    if (count === 1) return 'Tap at least one more tooth to complete the bridge.';
    return linked
      ? 'Bridge linked \u2014 drag the arrow to adjust the shared insertion path.'
      : 'Bridge unlinked \u2014 each tooth has an independent insertion path.';
  }

  if (count === 0) return 'Tap a tooth on the model to analyze its insertion path.';
  if (count === 1) return 'Drag the arrow to adjust. Tap more teeth to add crowns.';
  return `${count} crowns \u2014 each has its own insertion path. Drag arrows independently.`;
}

// ─── Error Notification ─────────────────────────────────────────────────────

function ErrorNotification({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div style={{
      position: 'absolute', top: '60px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 20, maxWidth: '440px',
      padding: '10px 20px', borderRadius: radius.md,
      backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
      backdropFilter: 'blur(8px)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      fontSize: font.size.sm, fontWeight: 500, color: '#DC2626',
      textAlign: 'center', lineHeight: '20px',
      display: 'flex', alignItems: 'center', gap: space[2],
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', marginLeft: 'auto', color: '#DC2626' }}>
        <CloseIcon />
      </button>
    </div>
  );
}

// ─── Floating Panel ─────────────────────────────────────────────────────────

interface PanelProps {
  stage: UndercutStage;
  procedureMode: ProcedureMode;
  selectedTeeth: number[];
  sharedPath: boolean;
  isCustomPath: boolean;
  hasMarginLine: boolean;
  activeArch: ArchType;
  availableArches: ArchType[];
  selectionAccepted: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onRestart: () => void;
  onResetToOptimal: () => void;
  onToggleSharedPath: (shared: boolean) => void;
  onClearSelection: () => void;
  onSwitchArch: (arch: ArchType) => void;
  onAcceptSelection: () => void;
  onEditSelection: () => void;
}

function UndercutPanel({
  stage, procedureMode, selectedTeeth, sharedPath, isCustomPath,
  hasMarginLine, activeArch, availableArches, selectionAccepted,
  onClose, onConfirm, onRestart,
  onResetToOptimal, onToggleSharedPath, onClearSelection,
  onSwitchArch, onAcceptSelection, onEditSelection,
}: PanelProps) {
  const count = selectedTeeth.length;
  const isBridge2 = procedureMode === 'bridge-2';
  const bridge2Selecting = isBridge2 && !selectionAccepted;
  const canConfirm = procedureMode === 'bridge' ? count >= 2
    : isBridge2 ? count >= 2 && selectionAccepted
    : count > 0;

  return (
    <div style={{
      width: '248px',
      borderRadius: radius.md, backgroundColor: color.bgSurface,
      boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
      fontFamily: font.family, overflow: 'hidden',
    }}>
      {/* ── Header ── */}
      <div style={{
        height: '40px', padding: `0 ${space[3]}`,
        borderBottom: `1px solid ${color.borderDefault}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: color.textHeading }}>
          Undercuts & Path
        </span>
        <IconButton aria-label="Close" onClick={onClose} style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }}>
          <CloseIcon />
        </IconButton>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: space[3], display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Arch navigator */}
        <ArchNav activeArch={activeArch} onSwitch={onSwitchArch} show={availableArches.length >= 2} />

        {/* ML badge */}
        {hasMarginLine && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '5px 8px', borderRadius: '6px',
            backgroundColor: '#EFF6FF', fontSize: '11px', color: '#2563EB', fontWeight: 500,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Margin line detected
          </div>
        )}

        {/* ── Selection area ── */}
        {count === 0 && stage !== 'confirm' && procedureMode !== 'full-arch' && (
          <div style={{ fontSize: '12px', color: color.textSubtle, lineHeight: '18px' }}>
            {(procedureMode === 'bridge' || isBridge2)
              ? 'Tap 2+ adjacent teeth on the model.'
              : 'Tap teeth on the model to begin.'}
          </div>
        )}

        {count > 0 && (
          <>
            {/* Count row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: color.textDefault }}>
                  {count} {count === 1 ? 'tooth' : 'teeth'}
                </span>
                <span style={{
                  fontSize: '10px', fontWeight: 600,
                  padding: '1px 6px', borderRadius: radius.full, lineHeight: '16px',
                  color: color.primary, backgroundColor: color.primaryLight,
                }}>
                  {procedureMode === 'crown'
                    ? (count === 1 ? 'Crown' : `${count} Crowns`)
                    : (procedureMode === 'bridge' || isBridge2)
                      ? `Bridge ${count}-unit`
                      : 'Full Arch'}
                </span>
              </div>
              {stage !== 'confirm' && procedureMode !== 'full-arch' && (
                <button onClick={onClearSelection} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '11px', fontWeight: 500, color: color.primary, padding: 0,
                }}>
                  Clear
                </button>
              )}
            </div>

            {/* ── Bridge: linked toggle ── */}
            {(procedureMode === 'bridge' || (isBridge2 && selectionAccepted)) && count >= 2 && stage !== 'confirm' && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 10px', borderRadius: '8px',
                backgroundColor: sharedPath ? '#F0FDF4' : color.neutral50,
                transition: 'background-color 0.15s ease',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: color.textDefault }}>
                    Linked insertion path
                  </span>
                  <span style={{ fontSize: '10px', color: color.textPlaceholder }}>
                    {sharedPath ? 'All teeth share one path' : 'Each tooth has its own path'}
                  </span>
                </div>
                <Toggle
                  checked={sharedPath}
                  onChange={() => onToggleSharedPath(!sharedPath)}
                />
              </div>
            )}

            {/* Bridge: 1-tooth warning */}
            {(procedureMode === 'bridge' || isBridge2) && count === 1 && stage !== 'confirm' && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '5px 8px', borderRadius: '6px',
                backgroundColor: '#FEF3C7', fontSize: '11px', color: '#92400E', fontWeight: 500,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5">
                  <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                Select at least one more tooth
              </div>
            )}

            {/* Crown: always individual paths — info line */}
            {procedureMode === 'crown' && count >= 2 && stage !== 'confirm' && (
              <div style={{ fontSize: '11px', color: color.textSubtle, lineHeight: '16px' }}>
                Each crown has its own individual insertion path.
              </div>
            )}
          </>
        )}

        {/* ── Bridge 2: accept selection ── */}
        {bridge2Selecting && count >= 2 && stage !== 'confirm' && (
          <PrimaryButton size={36} fullWidth onClick={onAcceptSelection}>
            Accept Selection ({count} teeth)
          </PrimaryButton>
        )}

        {/* ── Bridge 2: edit selection after accepted ── */}
        {isBridge2 && selectionAccepted && stage !== 'confirm' && (
          <button onClick={onEditSelection} style={{
            background: 'none', border: `1px dashed ${color.borderDefault}`, cursor: 'pointer',
            borderRadius: '6px', padding: '5px 0',
            fontSize: '11px', fontWeight: 500, color: color.textSubtle,
            transition: 'all 0.15s ease',
          }}>
            Edit Selection
          </button>
        )}

        {/* ── Divider ── */}
        {count > 0 && stage !== 'confirm' && !bridge2Selecting && (
          <div style={{ height: '1px', backgroundColor: color.borderDefault, margin: '2px 0' }} />
        )}

        {/* ── Actions ── */}
        {stage === 'analyze' && !bridge2Selecting && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {isCustomPath && (
              <SecondaryButton size={36} fullWidth onClick={onResetToOptimal}>
                <ResetIcon />
                Reset to Optimal
              </SecondaryButton>
            )}
            {canConfirm && (
              <PrimaryButton size={36} fullWidth onClick={onConfirm}>
                Confirm Path
              </PrimaryButton>
            )}
          </div>
        )}

        {stage === 'confirm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{
              borderRadius: '8px', backgroundColor: '#F0FDF4',
              fontSize: '12px', fontWeight: 600, color: '#16A34A',
              height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              Path Confirmed
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ flex: 1 }}>
                <SecondaryButton size={36} fullWidth onClick={onRestart}>
                  New Analysis
                </SecondaryButton>
              </div>
              <div style={{ flex: 1 }}>
                <PrimaryButton size={36} fullWidth onClick={onClose}>
                  Done
                </PrimaryButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function UndercutPage({ onBackToHome, entryContext = DEFAULT_ENTRY_CONTEXT }: UndercutPageProps) {
  const [stage, setStage] = useState<UndercutStage>('analyze');
  const [selectionAccepted, setSelectionAccepted] = useState(false);
  const [procedureMode, setProcedureMode] = useState<ProcedureMode>(
    entryContext.procedureType === 'bridge' ? 'bridge'
      : entryContext.procedureType === 'full-arch' ? 'full-arch'
      : 'crown'
  );

  const {
    selectedTeeth, insertionDir, setInsertionDir, analysis,
    perToothDirs, setToothDir, sharedPath, toggleSharedPath,
    toggleTooth, selectFullArch, clearSelection, resetToOptimal,
    activeArch, setActiveArch, linkedBridges, linkTeeth, unlinkBridge,
    isBridgeLinked, analysisError, toggleAnalysisError, hasMarginLine,
    isAnalyzing,
  } = useUndercutAnalysis(entryContext);

  // ─── Mode switching ───────────────────────────────────────────────────────
  const handleModeChange = useCallback((mode: ProcedureMode) => {
    setProcedureMode(mode);
    clearSelection();
    setStage('analyze');
    setSelectionAccepted(false);

    if (mode === 'full-arch') {
      selectFullArch(activeArch);
      toggleSharedPath(true);
    } else if (mode === 'bridge' || mode === 'bridge-2') {
      toggleSharedPath(true);
    } else {
      toggleSharedPath(false);
    }
  }, [clearSelection, selectFullArch, activeArch, toggleSharedPath]);

  const handleConfirm = useCallback(() => setStage('confirm'), []);

  const handleRestart = useCallback(() => {
    setStage('analyze');
    clearSelection();
    setSelectionAccepted(false);
    if (procedureMode === 'full-arch') {
      selectFullArch(activeArch);
      toggleSharedPath(true);
    }
  }, [clearSelection, procedureMode, selectFullArch, activeArch, toggleSharedPath]);

  const handleToothClick = useCallback((toothId: number, shiftKey: boolean) => {
    if (stage === 'confirm') setStage('analyze');
    if (procedureMode === 'full-arch') return;
    if (procedureMode === 'bridge-2' && selectionAccepted) return;
    toggleTooth(toothId, shiftKey);
  }, [stage, toggleTooth, procedureMode, selectionAccepted]);

  // Auto-link in bridge mode when reaching 2+ teeth
  useEffect(() => {
    const shouldLink =
      (procedureMode === 'bridge' && selectedTeeth.length >= 2) ||
      (procedureMode === 'bridge-2' && selectionAccepted && selectedTeeth.length >= 2);

    const shouldUnlink =
      ((procedureMode === 'bridge' || procedureMode === 'bridge-2') && selectedTeeth.length < 2) ||
      (procedureMode === 'bridge-2' && !selectionAccepted);

    if (shouldLink && !isBridgeLinked) {
      linkTeeth(selectedTeeth);
    }
    if (shouldUnlink && isBridgeLinked && linkedBridges.length > 0) {
      unlinkBridge(linkedBridges[0].id);
    }
  }, [procedureMode, selectedTeeth.length, selectionAccepted, isBridgeLinked, linkTeeth, unlinkBridge, linkedBridges, selectedTeeth]);

  const handleClear = useCallback(() => {
    clearSelection();
    setStage('analyze');
    setSelectionAccepted(false);
  }, [clearSelection]);

  const handleAcceptSelection = useCallback(() => {
    setSelectionAccepted(true);
  }, []);

  const handleEditSelection = useCallback(() => {
    setSelectionAccepted(false);
  }, []);

  const handleArchSwitch = useCallback((arch: ArchType) => {
    setActiveArch(arch);
    if (procedureMode === 'full-arch') {
      setTimeout(() => {
        selectFullArch(arch);
        toggleSharedPath(true);
      }, 50);
    }
  }, [setActiveArch, procedureMode, selectFullArch, toggleSharedPath]);

  const [showError, setShowError] = useState(false);
  useEffect(() => { if (analysisError) setShowError(true); }, [analysisError]);

  const bridge2Selecting = procedureMode === 'bridge-2' && !selectionAccepted;
  const showHeatmap = selectedTeeth.length > 0 && !bridge2Selecting;
  const interactiveArrow = selectedTeeth.length > 0 && stage !== 'confirm' && !bridge2Selecting;
  const isCustomPath = analysis ? !analysis.insertionPath.isOptimal : false;
  const toastMessage = getToast(stage, selectedTeeth.length, procedureMode, sharedPath, selectionAccepted);

  return (
    <div style={{
      width: '100%', height: '100vh', display: 'flex', flexDirection: 'column',
      backgroundColor: color.bgActive, fontFamily: font.family, overflow: 'hidden',
    }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <UndercutViewer
          insertionDir={insertionDir}
          onDragDir={setInsertionDir}
          showHeatmap={showHeatmap}
          interactiveArrow={interactiveArrow}
          onToothClick={handleToothClick}
          selectionMode={stage !== 'confirm' && procedureMode !== 'full-arch' && !(procedureMode === 'bridge-2' && selectionAccepted)}
          selectedTeeth={selectedTeeth}
          sharedPath={sharedPath}
          perToothDirs={perToothDirs}
          onDragToothDir={setToothDir}
          activeArch={activeArch}
        />

        {/* Back */}
        <button
          onClick={onBackToHome}
          style={{
            position: 'absolute', top: space[3], left: space[3], zIndex: 10,
            display: 'flex', alignItems: 'center', gap: space[1],
            padding: '6px 12px', borderRadius: radius.full,
            backgroundColor: 'rgba(255,255,255,0.9)', border: `1px solid ${color.borderDefault}`,
            cursor: 'pointer', fontSize: font.size.sm, fontWeight: 500, color: color.textDefault,
            backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            transition: `all ${transition.fast}`,
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = color.white; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Home
        </button>

        {/* Toast */}
        <div style={{
          position: 'absolute', top: space[3], left: '50%', transform: 'translateX(-50%)',
          zIndex: 10, maxWidth: '540px',
          padding: '7px 20px', borderRadius: radius.full,
          backgroundColor: 'rgba(255,255,255,0.92)', border: `1px solid ${color.borderDefault}`,
          backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          fontSize: font.size.sm, fontWeight: 500, color: color.textDefault,
          textAlign: 'center', lineHeight: '20px', whiteSpace: 'nowrap',
        }}>
          {toastMessage}
        </div>

        {/* Error */}
        {showError && analysisError && (
          <ErrorNotification
            message="Undercut analysis unavailable for this scan."
            onDismiss={() => { setShowError(false); toggleAnalysisError(); }}
          />
        )}

        {/* Mode switcher + Panel */}
        <div style={{
          position: 'absolute', left: space[3], bottom: space[3], zIndex: 10,
          display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          {/* Mode pills — outside the panel */}
          {stage !== 'confirm' && (
            <div style={{
              width: '248px', padding: '6px',
              borderRadius: radius.md,
              backgroundColor: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: `1px solid ${color.borderDefault}`,
            }}>
              <ModePills mode={procedureMode} onChange={handleModeChange} disabled={false} />
            </div>
          )}

          <UndercutPanel
            stage={stage}
            procedureMode={procedureMode}
            selectedTeeth={selectedTeeth}
            sharedPath={sharedPath}
            isCustomPath={isCustomPath}
            hasMarginLine={hasMarginLine}
            activeArch={activeArch}
            availableArches={entryContext.availableArches}
            selectionAccepted={selectionAccepted}
            onClose={onBackToHome}
            onConfirm={handleConfirm}
            onRestart={handleRestart}
            onResetToOptimal={resetToOptimal}
            onToggleSharedPath={toggleSharedPath}
            onClearSelection={handleClear}
            onSwitchArch={handleArchSwitch}
            onAcceptSelection={handleAcceptSelection}
            onEditSelection={handleEditSelection}
          />
        </div>

        {/* Stats */}
        {analysis && (
          <div style={{ position: 'absolute', right: space[3], bottom: space[3], zIndex: 10, width: '240px' }}>
            <StatsPanel analysis={analysis} isAnalyzing={isAnalyzing} onResetToOptimal={resetToOptimal} />
          </div>
        )}

        {/* Heatmap legend */}
        {showHeatmap && (
          <div style={{
            position: 'absolute', bottom: space[3], left: '50%', transform: 'translateX(-50%)',
            zIndex: 5, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: radius.md,
            padding: `${space[2]} ${space[4]}`, border: `1px solid ${color.borderDefault}`,
            backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <HeatmapLegend />
          </div>
        )}
      </div>
    </div>
  );
}
