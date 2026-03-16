import React from 'react';
import { color, font, space, radius, transition } from '../../design-system/tokens';
import type { GuidanceState, ScanStage, FrameEdge, GuidanceDirection } from './types';

interface GuidanceOverlayProps {
  guidance: GuidanceState;
  elapsedSeconds: number;
  pointerNDC: { x: number; y: number };
  flashActive: boolean;
}

const ARROW_RED = '#E74C3C';

// ─── Target frame offsets (px from scanning frame origin) ─────────────────────

const TARGET_OFFSETS: Record<string, { left: string; top: string }> = {
  left:           { left: '-290px', top: '0px' },
  right:          { left: 'calc(100% + 50px)', top: '0px' },
  up:             { left: '0px', top: '-310px' },
  down:           { left: '0px', top: 'calc(100% + 50px)' },
  'rotate-left':  { left: '-290px', top: '0px' },
  'rotate-right': { left: 'calc(100% + 50px)', top: '0px' },
};

// ─── Arrow SVG between frames ─────────────────────────────────────────────────
// Each direction has a positioned SVG with a curved path + arrowhead

function GuidanceArrowSvg({ direction }: { direction: GuidanceDirection }) {
  // Arrow configs: SVG position relative to scanning frame, and path within it
  const configs: Record<string, {
    style: React.CSSProperties;
    viewBox: string;
    width: number;
    height: number;
    path: string;
    head: string; // polygon points for arrowhead
  }> = {
    left: {
      style: { position: 'absolute', right: '100%', top: '-60px', marginRight: '10px' },
      viewBox: '0 0 240 200',
      width: 240,
      height: 200,
      path: 'M 230 160 C 210 30, 30 30, 10 160',
      head: '10,160 0,130 28,138',
    },
    'rotate-left': {
      style: { position: 'absolute', right: '100%', top: '-60px', marginRight: '10px' },
      viewBox: '0 0 240 200',
      width: 240,
      height: 200,
      path: 'M 230 160 C 210 30, 30 30, 10 160',
      head: '10,160 0,130 28,138',
    },
    right: {
      style: { position: 'absolute', left: '100%', top: '-60px', marginLeft: '10px' },
      viewBox: '0 0 240 200',
      width: 240,
      height: 200,
      path: 'M 10 160 C 30 30, 210 30, 230 160',
      head: '230,160 240,130 212,138',
    },
    'rotate-right': {
      style: { position: 'absolute', left: '100%', top: '-60px', marginLeft: '10px' },
      viewBox: '0 0 240 200',
      width: 240,
      height: 200,
      path: 'M 10 160 C 30 30, 210 30, 230 160',
      head: '230,160 240,130 212,138',
    },
    up: {
      style: { position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '10px' },
      viewBox: '0 0 200 200',
      width: 200,
      height: 200,
      path: 'M 160 190 C 30 170, 30 30, 160 10',
      head: '160,10 130,0 138,28',
    },
    down: {
      style: { position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '10px' },
      viewBox: '0 0 200 200',
      width: 200,
      height: 200,
      path: 'M 160 10 C 30 30, 30 170, 160 190',
      head: '160,190 130,200 138,172',
    },
  };

  const cfg = configs[direction];
  if (!cfg) return null;

  return (
    <div style={{
      ...cfg.style,
      pointerEvents: 'none',
      animation: 'arrow-breathe 2s ease-in-out infinite',
    }}>
      <svg width={cfg.width} height={cfg.height} viewBox={cfg.viewBox} fill="none">
        <path
          d={cfg.path}
          stroke={ARROW_RED}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <polygon points={cfg.head} fill={ARROW_RED} />
      </svg>
    </div>
  );
}

// ─── Scanning Frame + Target Frame + Arrow ────────────────────────────────────

interface ScanFrameProps {
  pointerNDC: { x: number; y: number };
  glowEdge: FrameEdge;
  isScanning: boolean;
  flashActive: boolean;
  direction: GuidanceDirection | null;
}

function ScanFrame({ pointerNDC, glowEdge, isScanning, flashActive, direction }: ScanFrameProps) {
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

  const targetPos = direction ? TARGET_OFFSETS[direction] : null;

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
      {/* Target frame — "move your scanner here next" */}
      {targetPos && (
        <div style={{
          position: 'absolute',
          left: targetPos.left,
          top: targetPos.top,
          width: '100%',
          height: '100%',
          border: `4px solid ${ARROW_RED}`,
          borderRadius: '14px',
          opacity: 0.85,
          animation: 'target-pulse 2s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}

      {/* Arrow from scanning frame → target frame */}
      {direction && <GuidanceArrowSvg direction={direction} />}
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
        @keyframes arrow-breathe {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        @keyframes target-pulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(0.98); }
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

      {/* ── Scanning frame + target frame + arrow ── */}
      <ScanFrame
        pointerNDC={pointerNDC}
        glowEdge={guidance.activeEdge}
        isScanning={guidance.phase === 'scanning'}
        flashActive={flashActive}
        direction={guidance.phase !== 'complete' ? guidance.direction : null}
      />
    </div>
  );
}
