import React from 'react';
import { color, font, space, radius, transition } from '../../design-system/tokens';
import type { GuidanceState, ScanStage, FrameEdge, GuidanceDirection, ScanRegion } from './types';

interface GuidanceOverlayProps {
  guidance: GuidanceState;
  elapsedSeconds: number;
  pointerNDC: { x: number; y: number };
  flashActive: boolean;
  containerSize: { width: number; height: number };
}

const ARROW_RED   = '#E74C3C';
const ARROW_GREEN = '#16A34A';
// Coverage threshold at which the target side is considered "done" → go green
const SIDE_DONE_THRESHOLD = 0.62;

// ─── Target rect + sweeping arrow (positioned beside the scanning frame) ──────

function TargetIndicator({ modelRotation, pointerNDC, regions, direction }: {
  modelRotation: { x: number; y: number };
  pointerNDC: { x: number; y: number };
  regions: ScanRegion[];
  direction: GuidanceDirection;
}) {
  // Use the engine's direction to determine which side needs scanning.
  // When one side is done the engine naturally flips to the other side.
  const side: 'left' | 'right' =
    (direction === 'left' || direction === 'rotate-left') ? 'left' : 'right';

  // ── Per-side coverage ──
  // Due to BASE_ROT_Z = PI (X-axis flip):
  //   screen-left  = texture X right half (xMin >= 0.5)
  //   screen-right = texture X left half  (xMax <= 0.5)
  const targetRegions = regions.filter(r =>
    side === 'left' ? r.xMin >= 0.5 : r.xMax <= 0.5,
  );
  const sideCoverage = targetRegions.length > 0
    ? targetRegions.reduce((s, r) => s + r.coverage, 0) / targetRegions.length
    : 0;
  const isDone = sideCoverage >= SIDE_DONE_THRESHOLD;
  const accentColor = isDone ? ARROW_GREEN : ARROW_RED;
  const glowColor   = isDone ? 'rgba(22,163,74,0.25)' : 'rgba(231,76,60,0.18)';
  const arrowAnim   = isDone ? 'arrow-breathe-fast 0.8s ease-in-out infinite' : 'arrow-breathe 2s ease-in-out infinite';
  const rectAnim    = isDone ? 'target-pulse-fast 0.7s ease-in-out infinite' : 'target-pulse 2s ease-in-out infinite';

  // Flip perspective based on side — mirror the rotation so it recedes in the correct direction
  const flip = side === 'right' ? -1 : 1;
  const rotY = (modelRotation.y * (180 / Math.PI) * 1.8 + pointerNDC.x * 18) * flip;
  const rotX = modelRotation.x * (180 / Math.PI) * 1.5 + pointerNDC.y * -10;

  return (
    <>
      {/* Target rect */}
      <div style={{
        position: 'absolute',
        top: '0',
        [side === 'left' ? 'right' : 'left']: 'calc(100% + 12px)',
        width: '55%',
        height: '100%',
        perspective: '350px',
        pointerEvents: 'none',
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          border: `3px solid ${accentColor}`,
          borderRadius: '12px',
          opacity: 0.8,
          boxShadow: `0 0 14px 3px ${glowColor}`,
          animation: rectAnim,
          transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`,
          transition: 'transform 0.12s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }} />
        {/* Checkmark badge when done */}
        {isDone && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) rotateY(${rotY}deg) rotateX(${rotX}deg)`,
            transition: 'transform 0.12s ease',
            pointerEvents: 'none',
          }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16" fill="rgba(22,163,74,0.15)" stroke={ARROW_GREEN} strokeWidth="2" />
              <polyline points="10,18 15,24 26,12" stroke={ARROW_GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
        )}
      </div>

      {/* Sweeping arrow from scanning frame toward target rect */}
      <div style={{
        position: 'absolute',
        top: '-70px',
        [side === 'left' ? 'right' : 'left']: '10%',
        pointerEvents: 'none',
        animation: arrowAnim,
      }}>
        <svg
          width="280" height="220" viewBox="0 0 280 220" fill="none"
          style={side === 'right' ? { transform: 'scaleX(-1)' } : undefined}
        >
          <path
            d="M 260 30 C 230 5, 50 5, 20 180"
            stroke={accentColor}
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          <polygon points="20,180 8,152 34,158" fill={accentColor} />
        </svg>
      </div>
    </>
  );
}

// ─── Scanning Frame (blue, flat, follows cursor) ─────────────────────────────

function ScanFrame({ pointerNDC, glowEdge, isScanning, flashActive, direction, modelRotation, regions }: {
  pointerNDC: { x: number; y: number };
  glowEdge: FrameEdge;
  isScanning: boolean;
  flashActive: boolean;
  direction: GuidanceDirection | null;
  modelRotation: { x: number; y: number };
  regions: ScanRegion[];
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
      {/* Target rect — tracks engine direction, flips when side is done */}
      {direction && <TargetIndicator modelRotation={modelRotation} pointerNDC={pointerNDC} regions={regions} direction={direction} />}
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
        @keyframes arrow-breathe-fast {
          0%, 100% { opacity: 1; transform: scale(1.04); }
          50% { opacity: 0.7; transform: scale(0.97); }
        }
        @keyframes target-pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }
        @keyframes target-pulse-fast {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.55; }
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
        modelRotation={guidance.modelRotation}
        regions={guidance.regions}
      />
    </div>
  );
}
