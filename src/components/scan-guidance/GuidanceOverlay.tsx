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

// ─── Target offsets in 3D space (translateX, translateY, translateZ) ──────────

const TARGET_3D: Record<string, { tx: number; ty: number; tz: number }> = {
  left:           { tx: -300, ty: 0, tz: -150 },
  right:          { tx: 300,  ty: 0, tz: -150 },
  up:             { tx: 0,    ty: -300, tz: -150 },
  down:           { tx: 0,    ty: 300,  tz: -150 },
  'rotate-left':  { tx: -300, ty: 0, tz: -150 },
  'rotate-right': { tx: 300,  ty: 0, tz: -150 },
};

// ─── Arrow SVG configs ────────────────────────────────────────────────────────

function GuidanceArrowSvg({ direction }: { direction: GuidanceDirection }) {
  const configs: Record<string, {
    style: React.CSSProperties;
    viewBox: string;
    w: number; h: number;
    path: string;
    head: string;
  }> = {
    left: {
      style: { position: 'absolute', right: '100%', top: '-50px', marginRight: '10px' },
      viewBox: '0 0 240 180', w: 240, h: 180,
      path: 'M 230 140 C 210 20, 30 20, 10 140',
      head: '10,140 0,110 28,118',
    },
    'rotate-left': {
      style: { position: 'absolute', right: '100%', top: '-50px', marginRight: '10px' },
      viewBox: '0 0 240 180', w: 240, h: 180,
      path: 'M 230 140 C 210 20, 30 20, 10 140',
      head: '10,140 0,110 28,118',
    },
    right: {
      style: { position: 'absolute', left: '100%', top: '-50px', marginLeft: '10px' },
      viewBox: '0 0 240 180', w: 240, h: 180,
      path: 'M 10 140 C 30 20, 210 20, 230 140',
      head: '230,140 240,110 212,118',
    },
    'rotate-right': {
      style: { position: 'absolute', left: '100%', top: '-50px', marginLeft: '10px' },
      viewBox: '0 0 240 180', w: 240, h: 180,
      path: 'M 10 140 C 30 20, 210 20, 230 140',
      head: '230,140 240,110 212,118',
    },
    up: {
      style: { position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '10px' },
      viewBox: '0 0 200 180', w: 200, h: 180,
      path: 'M 160 170 C 20 150, 20 30, 160 10',
      head: '160,10 130,0 138,28',
    },
    down: {
      style: { position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '10px' },
      viewBox: '0 0 200 180', w: 200, h: 180,
      path: 'M 160 10 C 20 30, 20 150, 160 170',
      head: '160,170 130,180 138,152',
    },
  };

  const cfg = configs[direction];
  if (!cfg) return null;

  return (
    <div style={{ ...cfg.style, pointerEvents: 'none', animation: 'arrow-breathe 2s ease-in-out infinite' }}>
      <svg width={cfg.w} height={cfg.h} viewBox={cfg.viewBox} fill="none">
        <path d={cfg.path} stroke={ARROW_RED} strokeWidth="8" strokeLinecap="round" fill="none" />
        <polygon points={cfg.head} fill={ARROW_RED} />
      </svg>
    </div>
  );
}

// ─── 3D Perspective Frame Container ───────────────────────────────────────────

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

  // 3D rotation matching the model's tilt — aggressive perspective
  const rotY = pointerNDC.x * 35;   // degrees — strong Y rotation with cursor
  const rotX = pointerNDC.y * -18;   // degrees — noticeable X tilt

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

  const target = direction ? TARGET_3D[direction] : null;

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      // Perspective container — strong 3D depth
      perspective: '500px',
      perspectiveOrigin: '50% 50%',
      transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
      pointerEvents: 'none',
    }}>
      {/* 3D-rotated inner: both frames and arrow rotate together matching the model */}
      <div style={{
        transformStyle: 'preserve-3d',
        transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`,
        transition: 'transform 0.12s ease',
      }}>
        {/* ── Scanning frame (blue) — current scanner position ── */}
        <div style={{
          width: 'clamp(220px, 20vw, 300px)',
          height: 'clamp(340px, 32vw, 450px)',
          borderStyle: 'solid',
          borderColor: borderCol,
          borderTopWidth: bw('top'),
          borderRightWidth: bw('right'),
          borderBottomWidth: bw('bottom'),
          borderLeftWidth: bw('left'),
          borderRadius: '14px',
          boxShadow: glowShadow,
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}>
          {/* ── Target frame (red) — where to scan next — in 3D perspective ── */}
          {target && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: `4px solid ${ARROW_RED}`,
              borderRadius: '14px',
              transform: `translate3d(${target.tx}px, ${target.ty}px, ${target.tz}px)`,
              opacity: 0.85,
              animation: 'target-pulse 2s ease-in-out infinite',
              pointerEvents: 'none',
              backfaceVisibility: 'hidden',
            }} />
          )}

          {/* ── Arrow connecting frames ── */}
          {direction && <GuidanceArrowSvg direction={direction} />}
        </div>
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
          0%, 100% { opacity: 0.85; }
          50% { opacity: 0.5; }
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

      {/* ── 3D perspective frames + arrow ── */}
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
