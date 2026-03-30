import React, { useState, useCallback, useEffect } from 'react';
import { color, font, space, radius, transition } from '../../design-system/tokens';
import { PrimaryButton, SecondaryButton, IconButton, Checkbox } from '../../design-system';
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

type ProcedureMode = 'crown' | 'bridge' | 'full-arch';

const PROCEDURE_OPTIONS: { value: ProcedureMode; label: string }[] = [
  { value: 'crown', label: 'Crown' },
  { value: 'bridge', label: 'Bridge' },
  { value: 'full-arch', label: 'Full Arch' },
];

// ─── Prep QC-style Heatmap Legend ────────────────────────────────────────────

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

// ─── Icons ──────────────────────────────────────────────────────────────────

function DragHandle() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', cursor: 'grab' }}>
      {[0,1,2].map(r => (
        <div key={r} style={{ display: 'flex', gap: '3px' }}>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: color.neutral400 }} />
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: color.neutral400 }} />
        </div>
      ))}
    </div>
  );
}

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

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

// ─── Procedure Mode Selector (segmented control) ────────────────────────────

function ProcedureSelector({ mode, onChange }: { mode: ProcedureMode; onChange: (m: ProcedureMode) => void }) {
  return (
    <div style={{
      display: 'flex', borderRadius: radius.md, overflow: 'hidden',
      border: `1px solid ${color.borderDefault}`, backgroundColor: color.neutral50,
    }}>
      {PROCEDURE_OPTIONS.map(opt => {
        const isActive = opt.value === mode;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1, padding: '6px 0', border: 'none', cursor: 'pointer',
              fontSize: '11px', fontWeight: isActive ? 600 : 400,
              color: isActive ? color.white : color.textSubtle,
              backgroundColor: isActive ? color.primary : 'transparent',
              transition: `all ${transition.fast}`,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Toast messages ─────────────────────────────────────────────────────────

function getToastMessage(stage: UndercutStage, teethCount: number, mode: ProcedureMode, sharedPath: boolean): string {
  if (stage === 'confirm') return 'Insertion path confirmed. Undercuts and path are locked.';

  if (mode === 'full-arch') {
    if (teethCount === 0) return 'Loading full arch analysis...';
    return 'Full arch \u2014 shared insertion path. Drag the arrow to adjust.';
  }

  if (mode === 'bridge') {
    if (teethCount === 0) return 'Tap 2 or more teeth on the model to define bridge span.';
    if (teethCount === 1) return 'Select at least one more tooth to form a bridge.';
    return 'Bridge \u2014 shared insertion path. Drag the arrow to adjust for all linked teeth.';
  }

  // Crown mode
  if (teethCount === 0) return 'Tap a tooth on the model to analyze individual crown insertion path.';
  if (teethCount === 1) {
    return 'Individual insertion path. Drag the arrow to adjust. Tap more teeth to add crowns.';
  }
  return sharedPath
    ? 'Multiple crowns \u2014 shared insertion path. Drag the arrow to adjust.'
    : 'Multiple crowns \u2014 individual paths. Each tooth has its own arrow.';
}

// ─── Arch Switcher ──────────────────────────────────────────────────────────

function ArchSwitcher({ activeArch, onSwitch, availableArches }: {
  activeArch: ArchType;
  onSwitch: (arch: ArchType) => void;
  availableArches: ArchType[];
}) {
  if (availableArches.length < 2) return null;
  const archLabel = activeArch === 'upper' ? 'Upper Jaw' : 'Lower Jaw';
  const otherArch = activeArch === 'upper' ? 'lower' : 'upper';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '6px 0',
    }}>
      <button
        onClick={() => onSwitch(otherArch)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '4px', display: 'flex', alignItems: 'center',
          color: color.textSubtle, borderRadius: radius.sm,
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = color.neutral100; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <ChevronLeftIcon />
      </button>
      <span style={{ fontSize: font.size.xs, fontWeight: 600, color: color.textHeading }}>
        {archLabel}
      </span>
      <button
        onClick={() => onSwitch(otherArch)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '4px', display: 'flex', alignItems: 'center',
          color: color.textSubtle, borderRadius: radius.sm,
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = color.neutral100; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
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
      <button
        onClick={onDismiss}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', marginLeft: 'auto', color: '#DC2626' }}
      >
        <CloseIcon />
      </button>
    </div>
  );
}

// ─── Floating Panel ─────────────────────────────────────────────────────────

interface UndercutPanelProps {
  stage: UndercutStage;
  procedureMode: ProcedureMode;
  selectedTeeth: number[];
  sharedPath: boolean;
  isCustomPath: boolean;
  isBridgeLinked: boolean;
  hasMarginLine: boolean;
  activeArch: ArchType;
  availableArches: ArchType[];
  onClose: () => void;
  onConfirm: () => void;
  onRestart: () => void;
  onResetToOptimal: () => void;
  onToggleSharedPath: (shared: boolean) => void;
  onClearSelection: () => void;
  onSwitchArch: (arch: ArchType) => void;
  onProcedureModeChange: (mode: ProcedureMode) => void;
}

function UndercutPanel({
  stage, procedureMode, selectedTeeth, sharedPath, isCustomPath,
  isBridgeLinked, hasMarginLine, activeArch, availableArches,
  onClose, onConfirm, onRestart,
  onResetToOptimal, onToggleSharedPath, onClearSelection,
  onSwitchArch, onProcedureModeChange,
}: UndercutPanelProps) {
  const hasTeeth = selectedTeeth.length > 0;
  const hasMultipleTeeth = selectedTeeth.length >= 2;

  // Bridge needs at least 2 teeth to confirm
  const bridgeReady = procedureMode !== 'bridge' || selectedTeeth.length >= 2;

  // Label based on mode + count
  const modeLabel = procedureMode === 'crown'
    ? (selectedTeeth.length === 1 ? 'Single Crown' : `${selectedTeeth.length} Crowns`)
    : procedureMode === 'bridge'
      ? `Bridge (${selectedTeeth.length}-unit)`
      : `Full Arch (${selectedTeeth.length})`;

  return (
    <div style={{
      width: '256px',
      borderRadius: radius.md, backgroundColor: color.bgSurface,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
      fontFamily: font.family,
    }}>
      {/* Header */}
      <div style={{
        height: '44px', padding: `0 ${space[3]}`,
        borderBottom: `1px solid ${color.borderDefault}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: space[2] }}>
          <DragHandle />
          <span style={{ fontSize: font.size.sm, fontWeight: 600, color: color.textHeading }}>
            Undercuts & Path
          </span>
        </div>
        <IconButton aria-label="Close" onClick={onClose} style={{ width: '28px', height: '28px', minWidth: '28px', minHeight: '28px' }}>
          <CloseIcon />
        </IconButton>
      </div>

      {/* Body */}
      <div style={{ padding: `${space[3]} ${space[3]}`, display: 'flex', flexDirection: 'column', gap: space[3] }}>

        {/* Procedure Mode Selector */}
        {stage !== 'confirm' && (
          <ProcedureSelector mode={procedureMode} onChange={onProcedureModeChange} />
        )}

        {/* Arch Switcher */}
        <ArchSwitcher activeArch={activeArch} onSwitch={onSwitchArch} availableArches={availableArches} />

        {/* Margin Line indicator */}
        {hasMarginLine && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: space[1],
            padding: '4px 8px', borderRadius: radius.sm,
            backgroundColor: '#EFF6FF', fontSize: '11px', color: '#2563EB',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Prep boundaries derived from margin line
          </div>
        )}
        {!hasMarginLine && hasTeeth && (
          <div style={{
            fontSize: '11px', color: color.textPlaceholder, lineHeight: '16px', fontStyle: 'italic',
          }}>
            Mark margin line for precise prep boundaries
          </div>
        )}

        {/* Prompt text when no teeth selected (Crown & Bridge modes only) */}
        {stage !== 'confirm' && !hasTeeth && procedureMode !== 'full-arch' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
            <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>
              {procedureMode === 'bridge'
                ? 'Tap 2 or more teeth on the model to define bridge span:'
                : 'Tap teeth on the model to select preps:'}
            </span>
          </div>
        )}

        {/* Selection info + case badge */}
        {hasTeeth && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: space[2] }}>
                <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>
                  {selectedTeeth.length} {selectedTeeth.length === 1 ? 'tooth' : 'teeth'}
                </span>
                <span style={{
                  fontSize: '10px', fontWeight: 600, color: color.primary,
                  backgroundColor: color.primaryLight, padding: '2px 6px',
                  borderRadius: radius.full, lineHeight: '14px',
                }}>
                  {modeLabel}
                </span>
              </div>
              {stage !== 'confirm' && (
                <button
                  onClick={onClearSelection}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: font.size.xs, fontWeight: 500, color: color.primary,
                    padding: 0,
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Bridge: linked indicator (auto-linked in bridge mode) */}
            {procedureMode === 'bridge' && hasMultipleTeeth && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '4px 8px', borderRadius: radius.sm,
                backgroundColor: '#F0FDF4', fontSize: '11px', color: '#16A34A', fontWeight: 600,
              }}>
                <LinkIcon />
                Teeth linked \u2014 shared insertion path
              </div>
            )}

            {/* Bridge: warning when only 1 tooth */}
            {procedureMode === 'bridge' && selectedTeeth.length === 1 && stage !== 'confirm' && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '4px 8px', borderRadius: radius.sm,
                backgroundColor: '#FEF3C7', fontSize: '11px', color: '#D97706',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Select at least one more tooth for bridge
              </div>
            )}

            {/* Crown mode: shared path checkbox when multiple crowns */}
            {procedureMode === 'crown' && hasMultipleTeeth && stage !== 'confirm' && (
              <Checkbox
                checked={sharedPath}
                onChange={() => onToggleSharedPath(!sharedPath)}
                size={16}
                label="Shared insertion path"
              />
            )}
          </div>
        )}

        {/* Divider */}
        {hasTeeth && <div style={{ height: '1px', backgroundColor: color.borderDefault }} />}

        {/* Path mode hint */}
        {hasTeeth && stage !== 'confirm' && (
          <div style={{
            fontSize: font.size.xs, color: color.textSubtle, lineHeight: '18px',
          }}>
            {procedureMode === 'bridge'
              ? (hasMultipleTeeth
                ? 'All linked teeth share one insertion path. Drag the arrow to adjust.'
                : 'Add more teeth to complete the bridge span.')
              : procedureMode === 'crown' && hasMultipleTeeth && !sharedPath
                ? 'Each crown has an individual insertion path. Drag arrows independently.'
                : 'Drag the arrow to adjust insertion path. Tap model to add/remove teeth.'}
          </div>
        )}

        {/* Actions */}
        {stage === 'analyze' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {isCustomPath && (
              <SecondaryButton size={36} fullWidth onClick={onResetToOptimal}>
                <ResetIcon />
                Reset to Optimal
              </SecondaryButton>
            )}
            {hasTeeth && bridgeReady && (
              <PrimaryButton size={36} fullWidth onClick={onConfirm}>
                Confirm Path
              </PrimaryButton>
            )}
          </div>
        )}

        {stage === 'confirm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{
              borderRadius: radius.md, backgroundColor: color.successLight,
              fontSize: font.size.xs, fontWeight: 600, color: color.success,
              height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {'\u2713'} Path Confirmed
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
  const [procedureMode, setProcedureMode] = useState<ProcedureMode>(
    entryContext.procedureType === 'bridge' ? 'bridge'
      : entryContext.procedureType === 'full-arch' ? 'full-arch'
      : 'crown'
  );

  const {
    selectedTeeth, insertionDir, setInsertionDir, analysis,
    perToothDirs, setToothDir, sharedPath, toggleSharedPath,
    toggleTooth, setTeeth, selectFullArch, clearSelection, resetToOptimal,
    activeArch, setActiveArch, linkedBridges, linkTeeth, unlinkBridge,
    isBridgeLinked, analysisError, toggleAnalysisError, hasMarginLine,
    isAnalyzing,
  } = useUndercutAnalysis(entryContext);

  // ─── Mode change handler ──────────────────────────────────────────────────
  const handleProcedureModeChange = useCallback((mode: ProcedureMode) => {
    setProcedureMode(mode);
    // Clear selection and reset when switching modes
    clearSelection();
    setStage('analyze');

    if (mode === 'full-arch') {
      // Auto-select entire arch
      selectFullArch(activeArch);
      toggleSharedPath(true);
    } else if (mode === 'bridge') {
      // Bridge: force shared path, user will tap teeth
      toggleSharedPath(true);
    } else {
      // Crown: default to individual paths
      toggleSharedPath(false);
    }
  }, [clearSelection, selectFullArch, activeArch, toggleSharedPath]);

  const handleConfirm = useCallback(() => { setStage('confirm'); }, []);

  const handleRestart = useCallback(() => {
    setStage('analyze');
    clearSelection();
    if (procedureMode === 'full-arch') {
      selectFullArch(activeArch);
      toggleSharedPath(true);
    }
  }, [clearSelection, procedureMode, selectFullArch, activeArch, toggleSharedPath]);

  // Tooth click behavior depends on mode
  const handleToothClick = useCallback((toothId: number, shiftKey: boolean) => {
    if (stage === 'confirm') setStage('analyze');

    if (procedureMode === 'full-arch') {
      // Full arch: don't allow individual tooth toggling
      return;
    }

    toggleTooth(toothId, shiftKey);

    // In bridge mode: auto-link when 2+ teeth
    if (procedureMode === 'bridge') {
      // We need to check after toggle — handled via effect below
    }
  }, [stage, toggleTooth, procedureMode]);

  // Auto-link teeth in bridge mode when 2+ teeth selected
  useEffect(() => {
    if (procedureMode === 'bridge' && selectedTeeth.length >= 2 && !isBridgeLinked) {
      linkTeeth(selectedTeeth);
    }
    // Unlink if we drop below 2 in bridge mode
    if (procedureMode === 'bridge' && selectedTeeth.length < 2 && isBridgeLinked && linkedBridges.length > 0) {
      unlinkBridge(linkedBridges[0].id);
    }
  }, [procedureMode, selectedTeeth.length, isBridgeLinked, linkTeeth, unlinkBridge, linkedBridges, selectedTeeth]);

  const handleClear = useCallback(() => {
    clearSelection();
    setStage('analyze');
    // In bridge mode, also unlink
    if (linkedBridges.length > 0) {
      unlinkBridge(linkedBridges[0].id);
    }
  }, [clearSelection, unlinkBridge, linkedBridges]);

  // Arch switch: clear and re-select if full arch
  const handleArchSwitch = useCallback((arch: ArchType) => {
    setActiveArch(arch);
    if (procedureMode === 'full-arch') {
      // Small delay to let state clear, then re-select
      setTimeout(() => {
        selectFullArch(arch);
        toggleSharedPath(true);
      }, 50);
    }
  }, [setActiveArch, procedureMode, selectFullArch, toggleSharedPath]);

  const [showError, setShowError] = useState(false);
  useEffect(() => {
    if (analysisError) setShowError(true);
  }, [analysisError]);

  const showHeatmap = selectedTeeth.length > 0;
  const interactiveArrow = selectedTeeth.length > 0 && stage !== 'confirm';
  const isCustomPath = analysis ? !analysis.insertionPath.isOptimal : false;
  const toastMessage = getToastMessage(stage, selectedTeeth.length, procedureMode, sharedPath);

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
          selectionMode={stage !== 'confirm' && procedureMode !== 'full-arch'}
          selectedTeeth={selectedTeeth}
          sharedPath={sharedPath}
          perToothDirs={perToothDirs}
          onDragToothDir={setToothDir}
          activeArch={activeArch}
        />

        {/* Back button */}
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

        {/* Error notification */}
        {showError && analysisError && (
          <ErrorNotification
            message="Undercut analysis unavailable for this scan."
            onDismiss={() => { setShowError(false); toggleAnalysisError(); }}
          />
        )}

        {/* Panel */}
        <div style={{ position: 'absolute', left: space[3], bottom: space[3], zIndex: 10 }}>
          <UndercutPanel
            stage={stage}
            procedureMode={procedureMode}
            selectedTeeth={selectedTeeth}
            sharedPath={sharedPath}
            isCustomPath={isCustomPath}
            isBridgeLinked={isBridgeLinked}
            hasMarginLine={hasMarginLine}
            activeArch={activeArch}
            availableArches={entryContext.availableArches}
            onClose={onBackToHome}
            onConfirm={handleConfirm}
            onRestart={handleRestart}
            onResetToOptimal={resetToOptimal}
            onToggleSharedPath={toggleSharedPath}
            onClearSelection={handleClear}
            onSwitchArch={handleArchSwitch}
            onProcedureModeChange={handleProcedureModeChange}
          />
        </div>

        {/* Stats Panel (bottom-right) */}
        {analysis && (
          <div style={{
            position: 'absolute', right: space[3], bottom: space[3], zIndex: 10,
            width: '240px',
          }}>
            <StatsPanel
              analysis={analysis}
              isAnalyzing={isAnalyzing}
              onResetToOptimal={resetToOptimal}
            />
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
