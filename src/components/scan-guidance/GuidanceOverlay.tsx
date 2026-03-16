import React from 'react';
import { color, font, space, radius, transition } from '../../design-system/tokens';
import type { GuidanceState, ScanStage, FrameEdge } from './types';

interface GuidanceOverlayProps {
  guidance: GuidanceState;
  elapsedSeconds: number;
  pointerNDC: { x: number; y: number };
  flashActive: boolean;
}

const ARROW_COLOR = '#E74C3C';

// ─── Big Curved Scan-Direction Arrow ──────────────────────────────────────────

function ScanDirectionArrow({ coverage, phase }: { coverage: number; phase: string }) {
  const show = phase === 'idle' || (coverage < 0.50 && phase !== 'complete');
  const opacity = show ? Math.max(0, 1 - coverage * 2.5) : 0;

  return (
    <div style={{
      position: 'absolute',
      top: 'calc(50% - 280px)',
      left: '50%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      opacity,
      transition: 'opacity 0.5s ease',
      animation: show ? 'arrow-breathe 2.5s ease-in-out infinite' : undefined,
    }}>
      <svg width="440" height="140" viewBox="0 0 440 140" fill="none">
        <path
          d="M 400 115 C 380 15, 60 15, 40 115"
          stroke={ARROW_COLOR}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <polygon points="40,115 16,85 52,92" fill={ARROW_COLOR} />
        <path
          d="M 400 115 C 408 85, 412 55, 400 30"
          stroke={ARROW_COLOR}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="8 8"
          opacity="0.4"
          fill="none"
        />
      </svg>
    </div>
  );
}

// ─── Direction Arrow (points toward low-coverage area) ────────────────────────
// Positioned beside/above/below the frame depending on direction.

function DirectionArrow({ direction, visible }: {
  direction: 'left' | 'right' | 'up' | 'down';
  visible: boolean;
}) {
  const isHorizontal = direction === 'left' || direction === 'right';

  // Arrow positioning relative to the frame
  const positionStyle: React.CSSProperties = (() => {
    switch (direction) {
      case 'left':
        return { right: 'calc(100% + 16px)', top: '50%', transform: 'translateY(-50%)' };
      case 'right':
        return { left: 'calc(100% + 16px)', top: '50%', transform: 'translateY(-50%)' };
      case 'up':
        return { bottom: 'calc(100% + 16px)', left: '50%', transform: 'translateX(-50%)' };
      case 'down':
        return { top: 'calc(100% + 16px)', left: '50%', transform: 'translateX(-50%)' };
    }
  })();

  // SVG arrow pointing in the right direction
  const arrowSvg = (() => {
    if (isHorizontal) {
      const flip = direction === 'right';
      return (
        <svg
          width="60" height="120" viewBox="0 0 60 120" fill="none"
          style={{ transform: flip ? 'scaleX(-1)' : undefined }}
        >
          {/* Curved path sweeping downward */}
          <path
            d="M 50 10 C 40 10, 10 40, 12 100"
            stroke={ARROW_COLOR}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Arrowhead */}
          <polygon points="12,100 2,78 24,84" fill={ARROW_COLOR} />
        </svg>
      );
    } else {
      const flip = direction === 'down';
      return (
        <svg
          width="120" height="50" viewBox="0 0 120 50" fill="none"
          style={{ transform: flip ? 'scaleY(-1)' : undefined }}
        >
          {/* Curved path sweeping sideways */}
          <path
            d="M 10 40 C 10 30, 40 8, 100 12"
            stroke={ARROW_COLOR}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Arrowhead */}
          <polygon points="100,12 78,2 84,24" fill={ARROW_COLOR} />
        </svg>
      );
    }
  })();

  return (
    <div style={{
      position: 'absolute',
      ...positionStyle,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease',
      animation: visible ? 'arrow-breathe 2s ease-in-out infinite' : undefined,
      pointerEvents: 'none',
    }}>
      {arrowSvg}
    </div>
  );
}

// ─── Scanning Frame ──────────────────────────────────────────────────────────

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

  const borderCol = flashActive
    ? '#16A34A'
    : isScanning
    ? color.primary
    : 'rgba(0,154,206,0.5)';

  const glowShadow = flashActive
    ? '0 0 24px 8px rgba(22,163,74,0.4), inset 0 0 12px 2px rgba(22,163,74,0.15)'
    : isScanning
    ? '0 0 20px 6px rgba(0,154,206,0.35), inset 0 0 10px 2px rgba(0,154,206,0.1)'
    : 'none';

  const bw = (edge: 'top' | 'right' | 'bottom' | 'left') =>
    glowEdge === edge ? '5px' : '3px';

  // Map direction to arrow props
  const arrowDir: 'left' | 'right' | 'up' | 'down' | null =
    direction === 'left' || direction === 'rotate-left'   ? 'left'  :
    direction === 'right' || direction === 'rotate-right'  ? 'right' :
    direction === 'up'    ? 'up'    :
    direction === 'down'  ? 'down'  :
    null;

  const arrowVisible = arrowDir !== null;

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 'clamp(220px, 20vw, 300px)',
      height: 'clamp(340px, 32vw, 450px)',
      transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
      transition: 'transform 0.12s ease, border-color 0.2s ease, box-shadow 0.2s ease',
      pointerEvents: 'none',
      borderStyle: 'solid',
      borderColor: borderCol,
      borderTopWidth: bw('top'),
      borderRightWidth: bw('right'),
      borderBottomWidth: bw('bottom'),
      borderLeftWidth: bw('left'),
      borderRadius: '14px',
      boxShadow: glowShadow,
    }}>
      {arrowDir && <DirectionArrow direction={arrowDir} visible={arrowVisible} />}
    </div>
  );
}

// ─── Stage Pill ───────────────────────────────────────────────────────────────

const STAGE_META: Record<ScanStage | 'complete', { label: string; bg: string; textColor: string; dot: string }> = {
  occlusal: { label: 'Occlusal', bg: color.neutral100,        textColor: color.textSubtle, dot: color.neutral400 },
  buccal:   { label: 'Buccal',   bg: 'rgba(0,154,206,0.12)',  textColor: color.primary,    dot: color.primary    },
  lingual:  { label: 'Lingual',  bg: 'rgba(0,154,206,0.12)',  textColor: color.primary,    dot: color.primary    },
  complete: { label: 'Complete', bg: 'rgba(22,163,74,0.1)',   textColor: '#16A34A',        dot: '#16A34A'        },
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

  const glowEdge: FrameEdge = guidance.activeEdge;

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
              transition: 'width 0.3s ease',
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

      {/* ── Scan direction arrow (fades as coverage grows) ── */}
      <ScanDirectionArrow
        coverage={guidance.coveragePercent}
        phase={guidance.phase}
      />

      {/* ── Scanning frame + directional arrows ── */}
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
