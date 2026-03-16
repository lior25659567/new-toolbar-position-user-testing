import React from 'react';
import { color, font, space, radius, transition } from '../../design-system/tokens';
import type { GuidanceState, ScanStage, FrameEdge } from './types';

interface GuidanceOverlayProps {
  guidance: GuidanceState;
  elapsedSeconds: number;
  pointerNDC: { x: number; y: number };
  flashActive: boolean;
  containerSize: { width: number; height: number };
}

const ARROW_RED = '#E74C3C';

// ─── Full-Viewport Guidance Arrow ─────────────────────────────────────────────
// Draws a thick curved bezier from scanning frame center → target frame center.

function GuidancePathArrow({ scanCenter, targetCenter }: {
  scanCenter: { x: number; y: number };
  targetCenter: { x: number; y: number };
}) {
  const dx = targetCenter.x - scanCenter.x;
  const dy = targetCenter.y - scanCenter.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 40) return null; // too close, skip

  // Control point: perpendicular offset at midpoint for a nice arc
  const mx = (scanCenter.x + targetCenter.x) / 2;
  const my = (scanCenter.y + targetCenter.y) / 2;
  const perpX = (-dy / len) * len * 0.3;
  const perpY = (dx / len) * len * 0.3;
  const cpx = mx + perpX;
  const cpy = my + perpY;

  // Arrowhead: tangent at end of curve
  const t = 0.95;
  const tx = 2 * (1 - t) * (cpx - scanCenter.x) + 2 * t * (targetCenter.x - cpx);
  const ty = 2 * (1 - t) * (cpy - scanCenter.y) + 2 * t * (targetCenter.y - cpy);
  const angle = Math.atan2(ty, tx);
  const hl = 18; // head length
  const ha = Math.PI / 5; // head angle

  return (
    <svg style={{
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none',
      overflow: 'visible',
    }}>
      {/* Curved path */}
      <path
        d={`M ${scanCenter.x} ${scanCenter.y} Q ${cpx} ${cpy} ${targetCenter.x} ${targetCenter.y}`}
        stroke={ARROW_RED}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="14 8"
        fill="none"
        opacity="0.8"
      >
        <animate attributeName="stroke-dashoffset" from="44" to="0" dur="1.5s" repeatCount="indefinite" />
      </path>

      {/* Arrowhead */}
      <polygon
        points={`
          ${targetCenter.x},${targetCenter.y}
          ${targetCenter.x - hl * Math.cos(angle - ha)},${targetCenter.y - hl * Math.sin(angle - ha)}
          ${targetCenter.x - hl * Math.cos(angle + ha)},${targetCenter.y - hl * Math.sin(angle + ha)}
        `}
        fill={ARROW_RED}
        opacity="0.85"
      />
    </svg>
  );
}

// ─── Scanning Frame (blue, follows cursor) ────────────────────────────────────

function ScanFrame({ pointerNDC, glowEdge, isScanning, flashActive }: {
  pointerNDC: { x: number; y: number };
  glowEdge: FrameEdge;
  isScanning: boolean;
  flashActive: boolean;
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
    }} />
  );
}

// ─── Target Frame (red, projected at unscanned area) ──────────────────────────

function TargetFrame({ screenPos, pointerNDC }: {
  screenPos: { x: number; y: number };
  pointerNDC: { x: number; y: number };
}) {
  // Strong perspective rotation matching the model's tilt
  const rotY = pointerNDC.x * 45;
  const rotX = pointerNDC.y * -22;

  return (
    <div style={{
      position: 'absolute',
      top: `${screenPos.y * 100}%`,
      left: `${screenPos.x * 100}%`,
      perspective: '300px',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      transition: 'top 0.25s ease, left 0.25s ease',
    }}>
      <div style={{
        transformStyle: 'preserve-3d',
        transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(-180px)`,
        transition: 'transform 0.15s ease',
      }}>
        <div style={{
          width: 'clamp(200px, 18vw, 270px)',
          height: 'clamp(310px, 28vw, 410px)',
          border: `4px solid ${ARROW_RED}`,
          borderRadius: '14px',
          animation: 'target-pulse 2s ease-in-out infinite',
        }} />
      </div>
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

export default function GuidanceOverlay({ guidance, pointerNDC, flashActive, containerSize }: GuidanceOverlayProps) {
  const pct = Math.round(guidance.coveragePercent * 100);
  const dir = guidance.phase !== 'complete' ? guidance.direction : null;
  const targetPos = guidance.targetScreenPos;

  // Compute pixel centers for the arrow SVG
  const scanCenterPx = containerSize.width > 0 ? {
    x: containerSize.width / 2 + pointerNDC.x * 8,
    y: containerSize.height / 2 + pointerNDC.y * -6,
  } : null;

  const targetCenterPx = targetPos && containerSize.width > 0 ? {
    x: targetPos.x * containerSize.width,
    y: targetPos.y * containerSize.height,
  } : null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: font.family,
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes target-pulse {
          0%, 100% { opacity: 0.9; }
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

      {/* ── Scanning frame (blue) ── */}
      <ScanFrame
        pointerNDC={pointerNDC}
        glowEdge={guidance.activeEdge}
        isScanning={guidance.phase === 'scanning'}
        flashActive={flashActive}
      />

      {/* ── Target frame (red, at projected 3D position) ── */}
      {dir && targetPos && (
        <TargetFrame screenPos={targetPos} pointerNDC={pointerNDC} />
      )}

      {/* ── Full-viewport curved arrow connecting the two frames ── */}
      {dir && scanCenterPx && targetCenterPx && (
        <GuidancePathArrow scanCenter={scanCenterPx} targetCenter={targetCenterPx} />
      )}
    </div>
  );
}
