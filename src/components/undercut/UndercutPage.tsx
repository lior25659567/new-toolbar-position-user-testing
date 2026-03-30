import React, { useState, useCallback, useEffect } from 'react';
import { color, font, space, radius, transition } from '../../design-system/tokens';
import { PrimaryButton, SecondaryButton, IconButton, Checkbox } from '../../design-system';
import UndercutViewer from './UndercutViewer';
import { useUndercutAnalysis } from './useUndercutAnalysis';
import type { UndercutStage, CaseType } from './types';
import { UPPER_TEETH } from './types';

interface UndercutPageProps {
  onBackToHome: () => void;
}

// ─── Prep QC–style Heatmap Legend ────────────────────────────────────────────

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

// ─── Icons (16px for inline, 20px for standalone — web best practice) ───────

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

// ─── Toast messages ─────────────────────────────────────────────────────────

function getToastMessage(flow: CaseType, stage: UndercutStage, teethCount: number, linkedTeeth: boolean): string {
  if (stage === 'confirm') return 'Insertion path confirmed. Undercuts and path are locked.';

  switch (flow) {
    case 'single-crown':
      return teethCount === 0
        ? 'Tap the prep tooth on the model to analyze undercuts'
        : 'Drag the arrow to test alternative insertion paths. Heatmap updates in real time.';
    case 'bridge':
      if (teethCount < 2) return 'Select the abutment teeth on the model for bridge analysis';
      return linkedTeeth
        ? 'Shared insertion path active. Drag to adjust across linked preps.'
        : 'Enable shared path for a common insertion direction, or analyze individually.';
    case 'full-arch':
      return 'Full arch analysis. Drag the arrow to optimize the common insertion path.';
  }
}

// ─── Flow Switcher ──────────────────────────────────────────────────────────

const FLOW_OPTIONS: { id: CaseType; label: string }[] = [
  { id: 'single-crown', label: 'Crown' },
  { id: 'bridge', label: 'Bridge' },
  { id: 'full-arch', label: 'Full Arch' },
];

function FlowSwitcher({ value, onChange }: { value: CaseType; onChange: (v: CaseType) => void }) {
  return (
    <div style={{
      display: 'flex', gap: '2px', padding: '3px',
      backgroundColor: color.bgActive, borderRadius: radius.md,
    }}>
      {FLOW_OPTIONS.map(opt => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            style={{
              flex: 1, padding: '5px 0', borderRadius: '6px', border: 'none',
              backgroundColor: active ? color.white : 'transparent',
              color: active ? color.primary : color.textSubtle,
              fontSize: font.size.xs, fontWeight: active ? 600 : 500,
              cursor: 'pointer',
              boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
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

// ─── Floating Panel ─────────────────────────────────────────────────────────

interface UndercutPanelProps {
  stage: UndercutStage;
  flow: CaseType;
  selectedTeeth: number[];
  linkedTeeth: boolean;
  isCustomPath: boolean;
  isAnalyzing: boolean;
  onClose: () => void;
  onFlowChange: (flow: CaseType) => void;
  onConfirm: () => void;
  onRestart: () => void;
  onResetToOptimal: () => void;
  onToggleLink: () => void;
  onClearSelection: () => void;
}

function UndercutPanel({
  stage, flow, selectedTeeth, linkedTeeth, isCustomPath, isAnalyzing,
  onClose, onFlowChange, onConfirm, onRestart,
  onResetToOptimal, onToggleLink, onClearSelection,
}: UndercutPanelProps) {
  const hasTeeth = selectedTeeth.length > 0;
  const hasMultipleTeeth = selectedTeeth.length >= 2;

  return (
    <div style={{
      width: '256px',
      borderRadius: radius.md, backgroundColor: color.bgSurface,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
      fontFamily: font.family,
    }}>
      {/* ── Header ── */}
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

      {/* ── Body ── */}
      <div style={{ padding: `${space[3]} ${space[3]}`, display: 'flex', flexDirection: 'column', gap: space[3] }}>

        {/* Case type */}
        <FlowSwitcher value={flow} onChange={onFlowChange} />

        {/* Selection + options */}
        {hasTeeth && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
            {/* Selection count */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>
                {selectedTeeth.length} {selectedTeeth.length === 1 ? 'tooth' : 'teeth'} selected
              </span>
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

            {/* Shared path checkbox */}
            {hasMultipleTeeth && (
              <Checkbox
                checked={linkedTeeth}
                onChange={() => onToggleLink()}
                size={16}
                label="Shared insertion path"
              />
            )}
          </div>
        )}

        {/* Divider */}
        {hasTeeth && <div style={{ height: '1px', backgroundColor: color.borderDefault }} />}

        {/* Actions */}
        {stage === 'analyze' && (
          <>
            {isAnalyzing ? (
              <div style={{ textAlign: 'center', padding: `${space[2]} 0` }}>
                <div style={{
                  width: '20px', height: '20px', border: `2px solid ${color.borderDefault}`,
                  borderTopColor: color.primary, borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite', margin: '0 auto 6px',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>Computing optimal path...</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {isCustomPath && (
                  <SecondaryButton size={36} fullWidth onClick={onResetToOptimal}>
                    <ResetIcon />
                    Reset to Optimal
                  </SecondaryButton>
                )}
                {hasTeeth && (
                  <PrimaryButton size={36} fullWidth onClick={onConfirm}>
                    Confirm Path
                  </PrimaryButton>
                )}
              </div>
            )}
          </>
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

export default function UndercutPage({ onBackToHome }: UndercutPageProps) {
  const [stage, setStage] = useState<UndercutStage>('analyze');
  const [flow, setFlow] = useState<CaseType>('single-crown');
  const [linkedTeeth, setLinkedTeeth] = useState(false);

  const {
    selectedTeeth, insertionDir, setInsertionDir, analysis, isAnalyzing,
    toggleTooth, selectSingleTooth, setTeeth, clearSelection, runAnalysis, resetToOptimal,
  } = useUndercutAnalysis();

  const handleFlowChange = useCallback((newFlow: CaseType) => {
    setFlow(newFlow);
    setStage('analyze');
    setLinkedTeeth(false);
    clearSelection();
    if (newFlow === 'full-arch') {
      setTimeout(() => {
        setTeeth([...UPPER_TEETH]);
        setLinkedTeeth(true);
      }, 10);
    }
  }, [clearSelection, setTeeth]);

  useEffect(() => {
    if (selectedTeeth.length > 0) {
      runAnalysis();
    }
  }, [selectedTeeth]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConfirm = useCallback(() => { setStage('confirm'); }, []);

  const handleRestart = useCallback(() => {
    setLinkedTeeth(false);
    setStage('analyze');
    clearSelection();
    if (flow === 'full-arch') {
      setTimeout(() => {
        setTeeth([...UPPER_TEETH]);
        setLinkedTeeth(true);
      }, 10);
    }
  }, [flow, clearSelection, setTeeth]);

  const handleToothClick = useCallback((toothId: number, shiftKey: boolean) => {
    if (stage === 'confirm') setStage('analyze');
    switch (flow) {
      case 'single-crown':
        selectSingleTooth(toothId);
        break;
      case 'bridge':
      case 'full-arch':
        toggleTooth(toothId, shiftKey);
        break;
    }
  }, [flow, stage, selectSingleTooth, toggleTooth]);

  const handleClear = useCallback(() => {
    clearSelection();
    setLinkedTeeth(false);
    setStage('analyze');
  }, [clearSelection]);

  const showHeatmap = selectedTeeth.length > 0;
  const interactiveArrow = selectedTeeth.length > 0 && stage !== 'confirm';
  const isCustomPath = analysis ? !analysis.insertionPath.isOptimal : false;
  const toastMessage = getToastMessage(flow, stage, selectedTeeth.length, linkedTeeth);

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
          selectionMode={stage !== 'confirm'}
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

        {/* Panel */}
        <div style={{ position: 'absolute', left: space[3], bottom: space[3], zIndex: 10 }}>
          <UndercutPanel
            stage={stage}
            flow={flow}
            selectedTeeth={selectedTeeth}
            linkedTeeth={linkedTeeth}
            isCustomPath={isCustomPath}
            isAnalyzing={isAnalyzing}
            onClose={onBackToHome}
            onFlowChange={handleFlowChange}
            onConfirm={handleConfirm}
            onRestart={handleRestart}
            onResetToOptimal={resetToOptimal}
            onToggleLink={() => { setLinkedTeeth(p => !p); }}
            onClearSelection={handleClear}
          />
        </div>

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
