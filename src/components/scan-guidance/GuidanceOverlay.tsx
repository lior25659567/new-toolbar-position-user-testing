import React from 'react';
import { color, font, space, radius, transition } from '../../design-system/tokens';
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
      top: '8%',
      opacity: visible ? 1 : 0,
      transition: `opacity 0.3s ease`,
      animation: visible ? 'arrow-breathe 2s ease-in-out infinite' : undefined,
      pointerEvents: 'none',
    }}>
      <svg width="80" height="210" viewBox="0 0 80 210" fill="none">
        {isLeft ? (
          <>
            <path
              d="M 68 10 C 55 10, 6 80, 8 190"
              stroke={color.primary}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <polygon points="8,190 0,165 22,172" fill={color.primary} />
          </>
        ) : (
          <>
            <path
              d="M 12 10 C 25 10, 74 80, 72 190"
              stroke={color.primary}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <polygon points="72,190 80,165 58,172" fill={color.primary} />
          </>
        )}
      </svg>
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
  const cornerGlow  = flashActive
    ? '0 0 10px 3px rgba(22,163,74,0.65)'
    : isScanning
    ? '0 0 8px 3px rgba(0,154,206,0.55)'
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
      width: '22px',
      height: '22px',
      borderStyle: 'solid',
      borderColor: cornerColor,
      boxShadow: cornerGlow,
      transition: `border-color ${transition.base}, box-shadow ${transition.base}`,
      ...positions[pos],
    };
  };

  const edgeStyle = (edge: 'top' | 'right' | 'bottom' | 'left'): React.CSSProperties => {
    const isActive = glowEdge === edge;
    const isHoriz  = edge === 'top' || edge === 'bottom';

    const fullPositions: Record<typeof edge, React.CSSProperties> = {
      top:    { top: 0,    left: 0,    right: 0,   height: isActive ? '4px' : '2px' },
      bottom: { bottom: 0, left: 0,    right: 0,   height: isActive ? '4px' : '2px' },
      left:   { left: 0,  top: 0,     bottom: 0,  width:  isActive ? '4px' : '2px' },
      right:  { right: 0, top: 0,     bottom: 0,  width:  isActive ? '4px' : '2px' },
    };

    const bgColor = flashActive
      ? '#16A34A'
      : isActive
      ? color.primary
      : isScanning
      ? 'rgba(0,154,206,0.35)'
      : 'rgba(0,154,206,0.18)';

    const edgeGlow = flashActive
      ? '0 0 18px 8px rgba(22,163,74,0.6)'
      : isActive
      ? isHoriz
        ? `0 ${edge === 'top' ? '-' : ''}10px 18px 5px rgba(0,154,206,0.65)`
        : `${edge === 'left' ? '-' : ''}10px 0 18px 5px rgba(0,154,206,0.65)`
      : 'none';

    return {
      position: 'absolute',
      backgroundColor: bgColor,
      boxShadow: edgeGlow,
      opacity: isActive || flashActive ? 1 : isScanning ? 0.7 : 0.4,
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

const STAGE_META: Record<ScanStage | 'complete', { label: string; bg: string; textColor: string; dot: string }> = {
  occlusal: { label: 'Occlusal', bg: color.neutral100,              textColor: color.textSubtle, dot: color.neutral400 },
  buccal:   { label: 'Buccal',   bg: 'rgba(0,154,206,0.12)',        textColor: color.primary,    dot: color.primary    },
  lingual:  { label: 'Lingual',  bg: 'rgba(0,154,206,0.12)',        textColor: color.primary,    dot: color.primary    },
  complete: { label: 'Complete', bg: 'rgba(22,163,74,0.1)',         textColor: '#16A34A',         dot: '#16A34A'        },
};

function StagePill({ stage, phase }: { stage: ScanStage; phase: string }) {
  const key = phase === 'complete' ? 'complete' : stage;
  const cfg = STAGE_META[key];
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

export default function GuidanceOverlay({ guidance, pointerNDC, flashActive }: GuidanceOverlayProps) {
  const pct = Math.round(guidance.coveragePercent * 100);

  const glowEdge: FrameEdge =
    guidance.direction === 'rotate-left'  ? 'left'  :
    guidance.direction === 'rotate-right' ? 'right' :
    guidance.activeEdge;

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
          50% { opacity: 0.45; }
        }
      `}</style>

      {/* ── Top bar: progress + stage pill ── */}
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
              transition: `width 0.3s ease`,
            }} />
          </div>
          <span style={{
            fontSize: font.size.xs,
            fontWeight: font.weight.semibold,
            color: color.textHeading,
            minWidth: '30px',
          }}>{pct}%</span>
        </div>

        <StagePill stage={guidance.stage} phase={guidance.phase} />
      </div>

      {/* ── Scanning frame with edge glows + roll arrows ── */}
      <ScanFrame
        pointerNDC={pointerNDC}
        glowEdge={glowEdge}
        isScanning={guidance.phase === 'scanning'}
        flashActive={flashActive}
        direction={guidance.direction}
        phase={guidance.phase}
      />
    </div>
  );
}
