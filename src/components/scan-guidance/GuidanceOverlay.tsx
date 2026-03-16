import React from 'react';
import { color, font, space, radius, transition } from '../../design-system/tokens';
import type { GuidanceState, ScanStage, FrameEdge, GuidanceDirection } from './types';

interface GuidanceOverlayProps {
  guidance: GuidanceState;
  elapsedSeconds: number;
  pointerNDC: { x: number; y: number };
  flashActive: boolean;
  containerSize: { width: number; height: number };
}

const ARROW_RED = '#E74C3C';

// ─── Target rect + sweeping arrow (positioned beside the scanning frame) ──────

function TargetIndicator({ direction }: { direction: GuidanceDirection }) {
  // Only show on horizontal directions (left/right)
  const isLeft  = direction === 'left' || direction === 'rotate-left' || direction === 'up' || direction === 'down';
  // Map up/down to left/right — the target rect is always horizontal beside the frame
  // up/down default to left side
  const side: 'left' | 'right' = (direction === 'right' || direction === 'rotate-right') ? 'right' : 'left';

  return (
    <>
      {/* Target rect — always horizontal, beside the scanning frame */}
      <div style={{
        position: 'absolute',
        top: '0',
        [side === 'left' ? 'right' : 'left']: 'calc(100% + 12px)',
        width: '55%',
        height: '100%',
        border: `3px solid ${ARROW_RED}`,
        borderRadius: '12px',
        opacity: 0.75,
        animation: 'target-pulse 2s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Big sweeping curved arrow */}
      {side === 'left' ? (
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '20%',
          pointerEvents: 'none',
          animation: 'arrow-breathe 2s ease-in-out infinite',
        }}>
          <svg width="320" height="260" viewBox="0 0 320 260" fill="none">
            <path
              d="M 300 40 C 260 10, 60 10, 20 200"
              stroke={ARROW_RED}
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            <polygon points="20,200 8,170 36,178" fill={ARROW_RED} />
          </svg>
        </div>
      ) : (
        <div style={{
          position: 'absolute',
          top: '-80px',
          left: '20%',
          pointerEvents: 'none',
          animation: 'arrow-breathe 2s ease-in-out infinite',
        }}>
          <svg width="320" height="260" viewBox="0 0 320 260" fill="none">
            <path
              d="M 20 40 C 60 10, 260 10, 300 200"
              stroke={ARROW_RED}
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            <polygon points="300,200 312,170 284,178" fill={ARROW_RED} />
          </svg>
        </div>
      )}
    </>
  );
}

// ─── Scanning Frame (blue, flat, follows cursor) ─────────────────────────────

function ScanFrame({ pointerNDC, glowEdge, isScanning, flashActive, direction }: {
  pointerNDC: { x: number; y: number };
  glowEdge: FrameEdge;
  isScanning: boolean;
  flashActive: boolean;
  direction: GuidanceDirection | null;
}) {
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

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 'clamp(220px, 20vw, 300px)',
      height: 'clamp(340px, 32vw, 450px)',
      transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
      pointerEvents: 'none',
      borderStyle: 'solid',
      borderColor: borderCol,
      borderTopWidth: bw('top'),
      borderRightWidth: bw('right'),
      borderBottomWidth: bw('bottom'),
      borderLeftWidth: bw('left'),
      borderRadius: '14px',
      boxShadow: glowShadow,
      transition: 'transform 0.1s ease, border-color 0.2s ease, box-shadow 0.2s ease',
    }}>
      {/* Target rect + arrow — sits beside the scanning frame */}
      {direction && <TargetIndicator direction={direction} />}
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
  const dir = guidance.phase !== 'complete' ? guidance.direction : null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: font.family,
      overflow: 'visible',
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
        @keyframes target-pulse {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 0.4; }
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
            flex: 1, height: '5px',
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

      {/* ── Scanning frame + target rect + arrow (all as one unit) ── */}
      <ScanFrame
        pointerNDC={pointerNDC}
        glowEdge={guidance.activeEdge}
        isScanning={guidance.phase === 'scanning'}
        flashActive={flashActive}
        direction={dir}
      />
    </div>
  );
}
