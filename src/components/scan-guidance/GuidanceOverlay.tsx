import React from 'react';
import { color, font, space, radius, shadow, transition } from '../../design-system/tokens';
import type { GuidanceState, ScanStage, FrameEdge } from './types';

interface GuidanceOverlayProps {
  guidance: GuidanceState;
  elapsedSeconds: number;
  pointerNDC: { x: number; y: number };
  flashActive: boolean;
}

// ─── Curved Roll Arrow (positioned beside the frame) ─────────────────────────

function RollArrow({ side, visible }: { side: 'left' | 'right'; visible: boolean }) {
  const isLeft = side === 'left';

  return (
    <div style={{
      position: 'absolute',
      // Position to the left or right of the frame, vertically centered in top portion
      [isLeft ? 'right' : 'left']: 'calc(100% + 10px)',
      top: '5%',
      opacity: visible ? 1 : 0,
      transition: `opacity 0.3s ease`,
      animation: visible ? 'arrow-breathe 2s ease-in-out infinite' : undefined,
      pointerEvents: 'none',
    }}>
      <svg
        width="72"
        height="190"
        viewBox="0 0 72 190"
        fill="none"
      >
        {isLeft ? (
          <>
            {/* Arc from upper-right sweeping down to lower-left — roll left */}
            <path
              d="M 62 12 C 50 12, 10 70, 12 172"
              stroke={color.primary}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Arrowhead at bottom pointing downward */}
            <polyline
              points="12,172 4,152 22,155"
              stroke={color.primary}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        ) : (
          <>
            {/* Arc from upper-left sweeping down to lower-right — roll right */}
            <path
              d="M 10 12 C 22 12, 62 70, 60 172"
              stroke={color.primary}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Arrowhead at bottom pointing downward */}
            <polyline
              points="60,172 68,152 50,155"
              stroke={color.primary}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        )}
      </svg>

      {/* Label beside the arrow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        [isLeft ? 'right' : 'left']: '100%',
        transform: 'translateY(-50%)',
        whiteSpace: 'nowrap',
        fontSize: font.size.xs,
        fontWeight: font.weight.semibold,
        color: color.primary,
        backgroundColor: 'rgba(255,255,255,0.88)',
        padding: `3px ${space[2]}`,
        borderRadius: radius.full,
        boxShadow: shadow.sm,
        marginLeft: isLeft ? 0 : space[1],
        marginRight: isLeft ? space[1] : 0,
      }}>
        {isLeft ? 'Roll toward cheek' : 'Roll toward tongue'}
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
  // Subtle wand-viewport movement: translate + slight tilt
  const offsetX = pointerNDC.x * 8;
  const offsetY = pointerNDC.y * -6;
  const tiltDeg = pointerNDC.x * 3;  // ±3° rotation = feels like holding the wand

  // Color states
  const activeColor = flashActive ? '#16A34A' : color.primary;
  const cornerColor = isScanning
    ? activeColor
    : 'rgba(0,154,206,0.55)';
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

  // Edge styles — active edge is bold (4px) with strong glow, spans FULL edge
  const edgeStyle = (edge: 'top' | 'right' | 'bottom' | 'left'): React.CSSProperties => {
    const isActive = glowEdge === edge;
    const isHoriz = edge === 'top' || edge === 'bottom';

    // Full-span positions (no corner gap for active edge — it runs the full length)
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
      // Spread the glow outward on the correct axis
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

  // Arrow visibility: direction exists and not actively scanning
  const arrowSide: 'left' | 'right' | null =
    direction === 'rotate-left'  ? 'left'  :
    direction === 'rotate-right' ? 'right' :
    null;
  const arrowVisible = arrowSide !== null && phase !== 'scanning';

  return (
    // Outer wrapper carries the transform (centering + mouse follow + tilt)
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      // Portrait frame: ~185px wide × 285px tall (2:3 wand viewport ratio)
      width: 'clamp(160px, 14vw, 200px)',
      height: 'clamp(250px, 22vw, 300px)',
      transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) rotateZ(${tiltDeg}deg)`,
      transition: `transform 0.12s ease`,
      pointerEvents: 'none',
    }}>
      {/* Roll arrows beside the frame */}
      {arrowSide === 'left'  && <RollArrow side="left"  visible={arrowVisible} />}
      {arrowSide === 'right' && <RollArrow side="right" visible={arrowVisible} />}

      {/* Corner brackets */}
      <div style={cornerStyle('tl')} />
      <div style={cornerStyle('tr')} />
      <div style={cornerStyle('bl')} />
      <div style={cornerStyle('br')} />

      {/* Edge segments */}
      <div style={edgeStyle('top')} />
      <div style={edgeStyle('bottom')} />
      <div style={edgeStyle('left')} />
      <div style={edgeStyle('right')} />
    </div>
  );
}

// ─── Stage Pill ───────────────────────────────────────────────────────────────

const STAGE_CONFIGS: Record<ScanStage | 'complete', { label: string; instruction: string; bg: string; textColor: string; dot: string }> = {
  occlusal: {
    label: 'Occlusal',
    instruction: 'Scan the bite surfaces',
    bg: color.neutral100,
    textColor: color.textSubtle,
    dot: color.neutral400,
  },
  buccal: {
    label: 'Buccal',
    instruction: 'Roll toward cheek',
    bg: 'rgba(0,154,206,0.12)',
    textColor: color.primary,
    dot: color.primary,
  },
  lingual: {
    label: 'Lingual',
    instruction: 'Roll toward tongue',
    bg: 'rgba(0,154,206,0.12)',
    textColor: color.primary,
    dot: color.primary,
  },
  complete: {
    label: 'Complete',
    instruction: 'Scan finished',
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

// ─── Main Overlay ─────────────────────────────────────────────────────────────

export default function GuidanceOverlay({ guidance, elapsedSeconds, pointerNDC, flashActive }: GuidanceOverlayProps) {
  const pct = Math.round(guidance.coveragePercent * 100);

  // Combine direction-based edge with coverage-based edge
  // Direction takes priority (buccal/lingual stages)
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

      {/* ── Idle prompt ── */}
      {guidance.phase === 'idle' && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(50% - 170px)',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(4px)',
            padding: `${space[2]} ${space[4]}`,
            borderRadius: radius.lg,
            boxShadow: shadow.sm,
          }}>
            <span style={{ fontSize: font.size.sm, fontWeight: font.weight.semibold, color: color.textDefault }}>
              Hold and drag to scan
            </span>
            <span style={{ fontSize: font.size.xs, color: color.textPlaceholder }}>
              Right-click + drag to rotate · Scroll to zoom
            </span>
          </div>
        </div>
      )}

      {/* ── Complete ── */}
      {guidance.phase === 'complete' && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(50% - 170px)',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: space[2],
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: `${space[2]} ${space[4]}`,
            borderRadius: radius.lg,
            boxShadow: shadow.sm,
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
            <span style={{ fontSize: font.size.sm, fontWeight: font.weight.semibold, color: '#16A34A' }}>
              Scan complete
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
