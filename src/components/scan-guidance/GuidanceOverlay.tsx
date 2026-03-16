import React from 'react';
import { color, font, space, radius, shadow, transition } from '../../design-system/tokens';
import type { GuidanceState, ScanStage, FrameEdge } from './types';

interface GuidanceOverlayProps {
  guidance: GuidanceState;
  elapsedSeconds: number;
  pointerNDC: { x: number; y: number };
  flashActive: boolean;
}

// ─── Roll Arrow (large, beside the frame) ────────────────────────────────────

function RollArrow({ side, visible }: { side: 'left' | 'right'; visible: boolean }) {
  const isLeft = side === 'left';

  return (
    <div style={{
      position: 'absolute',
      [isLeft ? 'right' : 'left']: 'calc(100% + 8px)',
      top: '10%',
      opacity: visible ? 1 : 0,
      transition: `opacity 0.3s ease`,
      animation: visible ? 'arrow-breathe 2s ease-in-out infinite' : undefined,
      pointerEvents: 'none',
    }}>
      <svg width="80" height="200" viewBox="0 0 80 200" fill="none">
        {isLeft ? (
          <>
            <path
              d="M 68 10 C 55 10, 8 75, 10 178"
              stroke={color.primary}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <polygon
              points="10,178 0,155 22,160"
              fill={color.primary}
            />
          </>
        ) : (
          <>
            <path
              d="M 12 10 C 25 10, 72 75, 70 178"
              stroke={color.primary}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <polygon
              points="70,178 80,155 58,160"
              fill={color.primary}
            />
          </>
        )}
      </svg>

      <div style={{
        position: 'absolute',
        top: '50%',
        [isLeft ? 'right' : 'left']: '88px',
        transform: 'translateY(-50%)',
        whiteSpace: 'nowrap',
        fontSize: font.size.xs,
        fontWeight: font.weight.semibold,
        color: color.primary,
        backgroundColor: 'rgba(255,255,255,0.92)',
        padding: `4px ${space[2]}`,
        borderRadius: radius.full,
        boxShadow: shadow.sm,
        border: `1px solid rgba(0,154,206,0.25)`,
      }}>
        {isLeft ? '← Roll toward cheek' : 'Roll toward tongue →'}
      </div>
    </div>
  );
}

// ─── Scanning Frame ───────────────────────────────────────────────────────────

interface ScanFrameProps {
  pointerNDC: { x: number; y: number };
  glowEdge: FrameEdge;
  isScanning: boolean;
  flashActive: boolean;
  direction: string | null;
  phase: string;
}

function ScanFrame({ pointerNDC, glowEdge, isScanning, flashActive, direction, phase }: ScanFrameProps) {
  const offsetX = pointerNDC.x * 8;
  const offsetY = pointerNDC.y * -6;
  const tiltDeg = pointerNDC.x * 3;

  const activeColor = flashActive ? '#16A34A' : color.primary;
  const cornerColor = isScanning ? activeColor : 'rgba(0,154,206,0.55)';
  const cornerGlow = flashActive
    ? '0 0 10px 3px rgba(22,163,74,0.65)'
    : isScanning
    ? `0 0 8px 3px rgba(0,154,206,0.55)`
    : 'none';

  const cornerStyle = (pos: 'tl' | 'tr' | 'bl' | 'br'): React.CSSProperties => {
    const positions: Record<typeof pos, React.CSSProperties> = {
      tl: { top: 0,    left: 0,    borderWidth: '3px 0 0 3px' },
      tr: { top: 0,    right: 0,   borderWidth: '3px 3px 0 0' },
      bl: { bottom: 0, left: 0,    borderWidth: '0 0 3px 3px' },
      br: { bottom: 0, right: 0,   borderWidth: '0 3px 3px 0' },
    };
    return {
      position: 'absolute',
      width: '20px',
      height: '20px',
      borderStyle: 'solid',
      borderColor: cornerColor,
      boxShadow: cornerGlow,
      transition: `border-color ${transition.base}, box-shadow ${transition.base}`,
      ...positions[pos],
    };
  };

  const edgeStyle = (edge: 'top' | 'right' | 'bottom' | 'left'): React.CSSProperties => {
    const isActive = glowEdge === edge;
    const isHoriz = edge === 'top' || edge === 'bottom';

    const fullPositions: Record<typeof edge, React.CSSProperties> = {
      top:    { top: 0,    left: 0,    right: 0,   height: isActive ? '3px' : '2px' },
      bottom: { bottom: 0, left: 0,    right: 0,   height: isActive ? '3px' : '2px' },
      left:   { left: 0,  top: 0,     bottom: 0,  width:  isActive ? '3px' : '2px' },
      right:  { right: 0, top: 0,     bottom: 0,  width:  isActive ? '3px' : '2px' },
    };

    const bgColor = flashActive
      ? '#16A34A'
      : isActive
      ? color.primary
      : isScanning
      ? 'rgba(0,154,206,0.3)'
      : 'rgba(0,154,206,0.15)';

    const edgeGlow = flashActive
      ? '0 0 14px 6px rgba(22,163,74,0.55)'
      : isActive
      ? isHoriz
        ? `0 ${edge === 'top' ? '-' : ''}8px 14px 4px rgba(0,154,206,0.6)`
        : `${edge === 'left' ? '-' : ''}8px 0 14px 4px rgba(0,154,206,0.6)`
      : 'none';

    return {
      position: 'absolute',
      backgroundColor: bgColor,
      boxShadow: edgeGlow,
      opacity: isActive || flashActive ? 1 : isScanning ? 0.6 : 0.35,
      transition: `opacity ${transition.base}, background-color ${transition.base}, box-shadow ${transition.base}, width ${transition.fast}, height ${transition.fast}`,
      zIndex: isActive ? 2 : 1,
      ...fullPositions[edge],
    };
  };

  const arrowSide: 'left' | 'right' | null =
    direction === 'rotate-left'  ? 'left'  :
    direction === 'rotate-right' ? 'right' :
    null;
  const arrowVisible = arrowSide !== null && phase !== 'scanning';

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 'clamp(160px, 14vw, 200px)',
      height: 'clamp(250px, 22vw, 300px)',
      transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) rotateZ(${tiltDeg}deg)`,
      transition: `transform 0.12s ease`,
      pointerEvents: 'none',
    }}>
      {arrowSide === 'left'  && <RollArrow side="left"  visible={arrowVisible} />}
      {arrowSide === 'right' && <RollArrow side="right" visible={arrowVisible} />}

      <div style={cornerStyle('tl')} />
      <div style={cornerStyle('tr')} />
      <div style={cornerStyle('bl')} />
      <div style={cornerStyle('br')} />

      <div style={edgeStyle('top')} />
      <div style={edgeStyle('bottom')} />
      <div style={edgeStyle('left')} />
      <div style={edgeStyle('right')} />
    </div>
  );
}

// ─── Stage Pill ───────────────────────────────────────────────────────────────

const STAGE_CONFIGS: Record<ScanStage | 'complete', {
  label: string;
  stepLabel: string;
  instruction: string;
  detail: string;
  nextHint: string;
  bg: string;
  textColor: string;
  dot: string;
}> = {
  occlusal: {
    label: 'Occlusal',
    stepLabel: 'Step 1 of 3',
    instruction: 'Scan the bite surfaces',
    detail: 'Move your cursor slowly across all tooth tops. The model builds as you scan.',
    nextHint: 'Continue until 40% coverage to advance to Buccal',
    bg: color.neutral100,
    textColor: color.textSubtle,
    dot: color.neutral400,
  },
  buccal: {
    label: 'Buccal',
    stepLabel: 'Step 2 of 3',
    instruction: 'Tilt toward cheek',
    detail: 'Roll the scanner outward to capture the outer surfaces of the teeth.',
    nextHint: 'Continue to 70% coverage to advance to Lingual',
    bg: 'rgba(0,154,206,0.12)',
    textColor: color.primary,
    dot: color.primary,
  },
  lingual: {
    label: 'Lingual',
    stepLabel: 'Step 3 of 3',
    instruction: 'Tilt toward tongue',
    detail: 'Roll the scanner inward to capture the inner surfaces of the teeth.',
    nextHint: 'Almost done — scan to 95% to complete',
    bg: 'rgba(0,154,206,0.12)',
    textColor: color.primary,
    dot: color.primary,
  },
  complete: {
    label: 'Complete',
    stepLabel: 'Done',
    instruction: 'Scan finished',
    detail: 'All surfaces captured successfully.',
    nextHint: '',
    bg: 'rgba(22,163,74,0.1)',
    textColor: '#16A34A',
    dot: '#16A34A',
  },
};

function StagePill({ stage, phase }: { stage: ScanStage; phase: string }) {
  const key = phase === 'complete' ? 'complete' : stage;
  const cfg = STAGE_CONFIGS[key];
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: `${space[1]} ${space[3]}`,
      borderRadius: radius.full,
      backgroundColor: cfg.bg,
      fontSize: font.size.xs,
      fontWeight: font.weight.semibold,
      color: cfg.textColor,
      transition: `background-color ${transition.base}, color ${transition.base}`,
    }}>
      <div style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: cfg.dot,
        animation: phase === 'scanning' ? 'pulse-dot 1s infinite' : undefined,
        transition: `background-color ${transition.base}`,
      }} />
      {cfg.label}
    </div>
  );
}

// ─── Control Hint Chip ────────────────────────────────────────────────────────

function ControlChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: font.size.xs,
      color: color.textSubtle,
    }}>
      <span style={{ color: color.textPlaceholder }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

// ─── Idle Panel ───────────────────────────────────────────────────────────────

function IdlePanel() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 'calc(50% - 190px)',
      left: '50%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      width: 'clamp(260px, 22vw, 320px)',
    }}>
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.93)',
        backdropFilter: 'blur(6px)',
        borderRadius: radius.xl,
        boxShadow: shadow.md,
        overflow: 'hidden',
        border: `1px solid ${color.borderDefault}`,
      }}>
        {/* How to start */}
        <div style={{ padding: `${space[3]} ${space[4]}` }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: space[2],
            marginBottom: space[2],
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: color.primary,
              animation: 'pulse-dot 1.5s ease-in-out infinite',
            }} />
            <span style={{
              fontSize: font.size.sm,
              fontWeight: font.weight.bold,
              color: color.textHeading,
            }}>
              Ready to scan
            </span>
          </div>
          <p style={{
            margin: 0,
            fontSize: font.size.xs,
            color: color.textDefault,
            lineHeight: '1.5',
          }}>
            Move your cursor over the 3D model to begin scanning automatically.
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: color.borderDefault }} />

        {/* Controls reference */}
        <div style={{
          padding: `${space[2]} ${space[4]}`,
          display: 'flex',
          flexDirection: 'column',
          gap: space[1],
        }}>
          <span style={{
            fontSize: '10px',
            fontWeight: font.weight.semibold,
            color: color.textPlaceholder,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '2px',
          }}>
            Controls
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <ControlChip
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a4 4 0 0 1 4 4v8a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/>
                  <path d="M12 14v4"/>
                </svg>
              }
              label="Drag to rotate"
            />
            <ControlChip
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
                </svg>
              }
              label="Right-drag to pan"
            />
            <ControlChip
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              }
              label="Scroll to zoom in / out"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stage Guidance Card ──────────────────────────────────────────────────────

function StageCard({ stage, phase, coveragePercent }: { stage: ScanStage; phase: string; coveragePercent: number }) {
  const key = phase === 'complete' ? 'complete' : stage;
  const cfg = STAGE_CONFIGS[key];
  const pct = Math.round(coveragePercent * 100);

  return (
    <div style={{
      position: 'absolute',
      bottom: 'calc(50% - 195px)',
      left: '50%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      width: 'clamp(240px, 20vw, 300px)',
    }}>
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.93)',
        backdropFilter: 'blur(6px)',
        borderRadius: radius.xl,
        boxShadow: shadow.md,
        border: `1px solid ${color.borderDefault}`,
        overflow: 'hidden',
      }}>
        {/* Stage header */}
        <div style={{
          padding: `${space[2]} ${space[3]}`,
          backgroundColor: key === 'complete' ? 'rgba(22,163,74,0.06)' : 'rgba(0,154,206,0.06)',
          borderBottom: `1px solid ${color.borderDefault}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: space[2] }}>
            <div style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: cfg.dot,
              animation: phase === 'scanning' ? 'pulse-dot 1s infinite' : undefined,
            }} />
            <span style={{
              fontSize: font.size.xs,
              fontWeight: font.weight.bold,
              color: cfg.textColor,
            }}>
              {cfg.label}
            </span>
            <span style={{
              fontSize: '10px',
              color: color.textPlaceholder,
              fontWeight: font.weight.medium,
            }}>
              {cfg.stepLabel}
            </span>
          </div>
          <span style={{
            fontSize: font.size.xs,
            fontWeight: font.weight.semibold,
            color: key === 'complete' ? '#16A34A' : color.primary,
          }}>
            {pct}%
          </span>
        </div>

        {/* Instruction */}
        <div style={{ padding: `${space[2]} ${space[3]}` }}>
          <div style={{
            fontSize: font.size.sm,
            fontWeight: font.weight.semibold,
            color: color.textHeading,
            marginBottom: '3px',
          }}>
            {cfg.instruction}
          </div>
          <div style={{
            fontSize: font.size.xs,
            color: color.textSubtle,
            lineHeight: '1.45',
          }}>
            {cfg.detail}
          </div>
          {cfg.nextHint && (
            <div style={{
              marginTop: space[2],
              fontSize: '10px',
              color: color.textPlaceholder,
              fontStyle: 'italic',
            }}>
              {cfg.nextHint}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Complete Banner ──────────────────────────────────────────────────────────

function CompleteBanner() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 'calc(50% - 195px)',
      left: '50%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: space[2],
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: `${space[2]} ${space[4]}`,
        borderRadius: radius.xl,
        boxShadow: shadow.md,
        border: '1px solid rgba(22,163,74,0.3)',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span style={{ fontSize: font.size.sm, fontWeight: font.weight.semibold, color: '#16A34A' }}>
          Scan complete — all surfaces captured
        </span>
      </div>
    </div>
  );
}

// ─── Main Overlay ─────────────────────────────────────────────────────────────

export default function GuidanceOverlay({ guidance, elapsedSeconds, pointerNDC, flashActive }: GuidanceOverlayProps) {
  const pct = Math.round(guidance.coveragePercent * 100);

  const glowEdge: FrameEdge =
    guidance.direction === 'rotate-left'  ? 'left'  :
    guidance.direction === 'rotate-right' ? 'right' :
    guidance.activeEdge;

  const stageKey = guidance.phase === 'complete' ? 'complete' : guidance.stage;
  const instruction = STAGE_CONFIGS[stageKey].instruction;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: font.family,
    }}>
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes arrow-breathe {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* ── Top bar ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${space[3]} ${space[4]}`,
        gap: space[3],
      }}>
        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: space[3], flex: 1, maxWidth: '320px' }}>
          <div style={{
            flex: 1,
            height: '5px',
            backgroundColor: color.neutral200,
            borderRadius: radius.full,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              backgroundColor: guidance.phase === 'complete' ? '#16A34A' : color.primary,
              borderRadius: radius.full,
              transition: `width ${transition.base}`,
            }} />
          </div>
          <span style={{
            fontSize: font.size.xs,
            fontWeight: font.weight.semibold,
            color: color.textHeading,
            minWidth: '30px',
          }}>{pct}%</span>
        </div>

        {/* Stage pill + instruction */}
        <div style={{ display: 'flex', alignItems: 'center', gap: space[2] }}>
          <span style={{ fontSize: font.size.xs, color: color.textSubtle, fontWeight: font.weight.medium }}>
            {instruction}
          </span>
          <StagePill stage={guidance.stage} phase={guidance.phase} />
        </div>
      </div>

      {/* ── Scanning frame ── */}
      <ScanFrame
        pointerNDC={pointerNDC}
        glowEdge={glowEdge}
        isScanning={guidance.phase === 'scanning'}
        flashActive={flashActive}
        direction={guidance.direction}
        phase={guidance.phase}
      />

      {/* ── Idle panel ── */}
      {guidance.phase === 'idle' && <IdlePanel />}

      {/* ── Stage guidance card (shown once scanning starts) ── */}
      {guidance.phase !== 'idle' && guidance.phase !== 'complete' && (
        <StageCard
          stage={guidance.stage}
          phase={guidance.phase}
          coveragePercent={guidance.coveragePercent}
        />
      )}

      {/* ── Complete banner ── */}
      {guidance.phase === 'complete' && <CompleteBanner />}
    </div>
  );
}
