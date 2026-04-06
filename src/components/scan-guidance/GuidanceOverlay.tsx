import React from 'react';
import { color, font, space, radius, transition } from '../../design-system/tokens';
import type {
  GuidanceState, ScanStage, FrameEdge, GuidanceDirection, ScanRegion, GuidanceMode,
} from './types';

interface GuidanceOverlayProps {
  guidance: GuidanceState;
  elapsedSeconds: number;
  pointerNDC: { x: number; y: number };
  flashActive: boolean;
  containerSize: { width: number; height: number };
  mode: GuidanceMode;
}

const ARROW_RED          = '#E74C3C';
const ARROW_GREEN        = '#16A34A';
const SIDE_DONE_THRESHOLD = 0.62;

// ─── Shared helpers ────────────────────────────────────────────────────────────

function getSide(dir: GuidanceDirection | null): 'left' | 'right' | 'up' | 'down' | null {
  if (!dir) return null;
  if (dir === 'left'  || dir === 'rotate-left')  return 'left';
  if (dir === 'right' || dir === 'rotate-right') return 'right';
  if (dir === 'up')   return 'up';
  if (dir === 'down') return 'down';
  return null;
}

function sideCoverage(regions: ScanRegion[], side: 'left' | 'right' | 'up' | 'down' | null): number {
  if (!side) return 0;
  const cells = regions.filter(r =>
    side === 'left'  ? r.xMin >= 0.5 :
    side === 'right' ? r.xMax <= 0.5 :
    side === 'up'    ? r.zMin >= 0.5 :
                       r.zMax <= 0.5,
  );
  return cells.length > 0 ? cells.reduce((s, r) => s + r.coverage, 0) / cells.length : 0;
}

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KF = `
  @keyframes pulse-dot         { 0%,100%{opacity:1}  50%{opacity:0.3} }
  @keyframes arrow-breathe     { 0%,100%{opacity:1}  50%{opacity:0.45} }
  @keyframes arrow-breathe-fast{ 0%,100%{opacity:1;transform:scale(1.04)} 50%{opacity:0.7;transform:scale(0.97)} }
  @keyframes target-pulse      { 0%,100%{opacity:0.8} 50%{opacity:0.4} }
  @keyframes target-pulse-fast { 0%,100%{opacity:0.9} 50%{opacity:0.55} }
  @keyframes edge-strip-pulse  { 0%,100%{opacity:0.85} 50%{opacity:0.4} }
  @keyframes dash-flow         { to{stroke-dashoffset:-24} }
  @keyframes cursor-ping       { 0%{box-shadow:0 0 0 0 rgba(0,154,206,0.5)} 70%{box-shadow:0 0 0 12px rgba(0,154,206,0)} 100%{box-shadow:0 0 0 0 rgba(0,154,206,0)} }
  @keyframes target-float      { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.07)} }
  @keyframes target-float-fast { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.12)} }
`;

// ─── Shared top bar ────────────────────────────────────────────────────────────

const STAGE_META: Record<ScanStage | 'complete', { label: string; bg: string; textColor: string; dot: string }> = {
  occlusal: { label: 'Occlusal', bg: color.neutral100,       textColor: color.textSubtle, dot: color.neutral400 },
  buccal:   { label: 'Buccal',   bg: 'rgba(0,154,206,0.12)', textColor: color.primary,    dot: color.primary    },
  lingual:  { label: 'Lingual',  bg: 'rgba(0,154,206,0.12)', textColor: color.primary,    dot: color.primary    },
  complete: { label: 'Complete', bg: 'rgba(22,163,74,0.1)',  textColor: '#16A34A',        dot: '#16A34A'        },
};

function StagePill({ stage, phase }: { stage: ScanStage; phase: string }) {
  const key = phase === 'complete' ? 'complete' : stage;
  const cfg = STAGE_META[key];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: `${space[1]} ${space[3]}`, borderRadius: radius.full,
      backgroundColor: cfg.bg, fontSize: font.size.xs,
      fontWeight: font.weight.semibold, color: cfg.textColor,
      transition: `background-color ${transition.base}, color ${transition.base}`,
    }}>
      <div style={{
        width: '6px', height: '6px', borderRadius: '50%',
        backgroundColor: cfg.dot,
        animation: phase === 'scanning' ? 'pulse-dot 1s infinite' : undefined,
        transition: `background-color ${transition.base}`,
      }} />
      {cfg.label}
    </div>
  );
}

function TopBar({ guidance, pct }: { guidance: GuidanceState; pct: number }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: `${space[3]} ${space[4]}`, gap: space[3],
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: space[3], flex: 1, maxWidth: '320px' }}>
        <div style={{ flex: 1, height: '5px', backgroundColor: color.neutral200, borderRadius: radius.full, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            backgroundColor: guidance.phase === 'complete' ? '#16A34A' : color.primary,
            borderRadius: radius.full, transition: 'width 0.3s ease',
          }} />
        </div>
        <span style={{ fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.textHeading, minWidth: '30px' }}>
          {pct}%
        </span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MODE A — Classic  (scanning frame + target rect beside it + sweeping arrow)
// ════════════════════════════════════════════════════════════════════════════

function TargetIndicator({ modelRotation, pointerNDC, regions, direction }: {
  modelRotation: { x: number; y: number };
  pointerNDC: { x: number; y: number };
  regions: ScanRegion[];
  direction: GuidanceDirection;
}) {
  const side: 'left' | 'right' =
    (direction === 'left' || direction === 'rotate-left') ? 'left' : 'right';

  const cov    = sideCoverage(regions, side);
  const isDone = cov >= SIDE_DONE_THRESHOLD;
  const accent = isDone ? ARROW_GREEN : ARROW_RED;
  const glow   = isDone ? 'rgba(22,163,74,0.25)' : 'rgba(0,154,206,0.18)';
  const aAnim  = isDone ? 'arrow-breathe-fast 0.8s ease-in-out infinite' : 'arrow-breathe 2s ease-in-out infinite';
  const rAnim  = isDone ? 'target-pulse-fast 0.7s ease-in-out infinite'  : 'target-pulse 2s ease-in-out infinite';

  const flip = side === 'right' ? -1 : 1;
  const rotY = (modelRotation.y * (180 / Math.PI) * 1.8 + pointerNDC.x * 18) * flip;
  const rotX =  modelRotation.x * (180 / Math.PI) * 1.5 + pointerNDC.y * -10;

  return (
    <>
      {/* Target rect */}
      <div style={{
        position: 'absolute', top: '0',
        [side === 'left' ? 'right' : 'left']: 'calc(100% + 12px)',
        width: '55%', height: '100%', perspective: '350px', pointerEvents: 'none',
      }}>
        <div style={{
          width: '100%', height: '100%',
          border: `3px solid ${accent}`, borderRadius: '12px',
          opacity: 0.8, boxShadow: `0 0 14px 3px ${glow}`,
          animation: rAnim,
          transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`,
          transition: 'transform 0.12s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }} />
        {isDone && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: `translate(-50%,-50%) rotateY(${rotY}deg) rotateX(${rotX}deg)`,
            transition: 'transform 0.12s ease', pointerEvents: 'none',
          }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16" fill="rgba(22,163,74,0.15)" stroke={ARROW_GREEN} strokeWidth="2" />
              <polyline points="10,18 15,24 26,12" stroke={ARROW_GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
      {/* Sweeping arrow */}
      <div style={{
        position: 'absolute', top: '-70px',
        [side === 'left' ? 'right' : 'left']: '10%',
        pointerEvents: 'none', animation: aAnim,
      }}>
        <svg width="280" height="220" viewBox="0 0 280 220" fill="none"
          style={side === 'right' ? { transform: 'scaleX(-1)' } : undefined}>
          <path d="M 260 30 C 230 5, 50 5, 20 180" stroke={accent} strokeWidth="9" strokeLinecap="round" fill="none" />
          <polygon points="20,180 8,152 34,158" fill={accent} />
        </svg>
      </div>
    </>
  );
}

function ClassicScanFrame({ pointerNDC, glowEdge, isScanning, flashActive, direction, modelRotation, regions }: {
  pointerNDC: { x: number; y: number };
  glowEdge: FrameEdge;
  isScanning: boolean;
  flashActive: boolean;
  direction: GuidanceDirection | null;
  modelRotation: { x: number; y: number };
  regions: ScanRegion[];
}) {
  const ox = pointerNDC.x * 8;
  const oy = pointerNDC.y * -6;
  const borderCol = flashActive ? '#16A34A' : isScanning ? color.primary : 'rgba(0,154,206,0.5)';
  const glow = flashActive
    ? '0 0 24px 8px rgba(22,163,74,0.4), inset 0 0 12px 2px rgba(22,163,74,0.15)'
    : isScanning
    ? '0 0 20px 6px rgba(0,154,206,0.35), inset 0 0 10px 2px rgba(0,154,206,0.1)'
    : 'none';
  const bw = (e: 'top'|'right'|'bottom'|'left') => glowEdge === e ? '5px' : '3px';

  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      width: 'clamp(220px, 20vw, 300px)', height: 'clamp(340px, 32vw, 450px)',
      transform: `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`,
      pointerEvents: 'none', borderStyle: 'solid', borderColor: borderCol,
      borderTopWidth: bw('top'), borderRightWidth: bw('right'),
      borderBottomWidth: bw('bottom'), borderLeftWidth: bw('left'),
      borderRadius: '14px', boxShadow: glow,
      transition: 'transform 0.1s ease, border-color 0.2s ease, box-shadow 0.2s ease',
    }}>
      {direction && (
        <TargetIndicator modelRotation={modelRotation} pointerNDC={pointerNDC} regions={regions} direction={direction} />
      )}
    </div>
  );
}

function ClassicOverlay({ guidance, pointerNDC, flashActive }: {
  guidance: GuidanceState; pointerNDC: { x: number; y: number }; flashActive: boolean;
}) {
  const pct = Math.round(guidance.coveragePercent * 100);
  const dir = guidance.phase !== 'complete' ? guidance.direction : null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', fontFamily: font.family, overflow: 'visible' }}>
      <style>{KF}</style>
      <TopBar guidance={guidance} pct={pct} />
      <ClassicScanFrame
        pointerNDC={pointerNDC} glowEdge={guidance.activeEdge}
        isScanning={guidance.phase === 'scanning'} flashActive={flashActive}
        direction={dir} modelRotation={guidance.modelRotation} regions={guidance.regions}
      />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MODE B — Edge Guide  (frame edges light up + directional arrow inside)
// ════════════════════════════════════════════════════════════════════════════

function DirArrow({ side, col }: { side: 'left'|'right'|'up'|'down'; col: string }) {
  const d = {
    right: 'M5,14 L23,14 M16,7 L23,14 L16,21',
    left:  'M23,14 L5,14 M12,7 L5,14 L12,21',
    up:    'M14,23 L14,5 M7,12 L14,5 L21,12',
    down:  'M14,5 L14,23 M7,16 L14,23 L21,16',
  }[side];
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d={d} stroke={col} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EdgeGuideOverlay({ guidance, pointerNDC, flashActive }: {
  guidance: GuidanceState; pointerNDC: { x: number; y: number }; flashActive: boolean;
}) {
  const pct  = Math.round(guidance.coveragePercent * 100);
  const dir  = guidance.phase !== 'complete' ? guidance.direction : null;
  const side = getSide(dir);
  const cov  = sideCoverage(guidance.regions, side);
  const isDone   = cov >= SIDE_DONE_THRESHOLD && side !== null;
  const accent   = isDone ? ARROW_GREEN : ARROW_RED;
  const accentRGB= isDone ? '22,163,74' : '231,76,60';
  const ox = pointerNDC.x * 8, oy = pointerNDC.y * -6;
  const isScanning = guidance.phase === 'scanning';

  const outerGlow = flashActive
    ? '0 0 24px 8px rgba(22,163,74,0.4)'
    : isScanning ? '0 0 20px 6px rgba(0,154,206,0.35)' : 'none';

  const edgeInset = side ? (
    side === 'right' ? `inset -20px 0 30px -8px rgba(${accentRGB},0.7)` :
    side === 'left'  ? `inset 20px 0 30px -8px rgba(${accentRGB},0.7)` :
    side === 'up'    ? `inset 0 20px 30px -8px rgba(${accentRGB},0.7)` :
                       `inset 0 -20px 30px -8px rgba(${accentRGB},0.7)`
  ) : 'none';

  const shadows = [outerGlow, edgeInset].filter(s => s !== 'none').join(', ') || 'none';
  const borderCol = flashActive ? '#16A34A' : isScanning ? color.primary : 'rgba(0,154,206,0.5)';

  // Arrow placement inside frame
  const isHoriz = side === 'left' || side === 'right';
  const arrowStyle: React.CSSProperties = {
    position: 'absolute',
    animation: 'arrow-breathe 1.4s ease-in-out infinite',
    ...(side === 'left'  ? { left: 10,  top: '50%', transform: 'translateY(-50%)' } :
        side === 'right' ? { right: 10, top: '50%', transform: 'translateY(-50%)' } :
        side === 'up'    ? { top: 10,   left: '50%', transform: 'translateX(-50%)' } :
        side === 'down'  ? { bottom: 10, left: '50%', transform: 'translateX(-50%)' } : {}),
  };

  // Edge strip style
  const stripStyle: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: accent, opacity: 0.85,
    animation: 'edge-strip-pulse 1.2s ease-in-out infinite',
    ...(side === 'left'   ? { left: 0,   top: 0, bottom: 0, width: 4, borderRadius: '14px 0 0 14px' } :
        side === 'right'  ? { right: 0,  top: 0, bottom: 0, width: 4, borderRadius: '0 14px 14px 0' } :
        side === 'up'     ? { top: 0,    left: 0, right: 0, height: 4, borderRadius: '14px 14px 0 0' } :
        side === 'down'   ? { bottom: 0, left: 0, right: 0, height: 4, borderRadius: '0 0 14px 14px' } : {}),
  };

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', fontFamily: font.family, overflow: 'visible' }}>
      <style>{KF}</style>
      <TopBar guidance={guidance} pct={pct} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 'clamp(220px, 20vw, 300px)', height: 'clamp(340px, 32vw, 450px)',
        transform: `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`,
        pointerEvents: 'none', border: `3px solid ${borderCol}`, borderRadius: '14px',
        boxShadow: shadows,
        transition: 'transform 0.1s ease, border-color 0.2s ease, box-shadow 0.25s ease',
      }}>
        {/* Colored edge strip */}
        {side && <div style={stripStyle} />}

        {/* Directional arrow */}
        {side && !isDone && (
          <div style={arrowStyle}>
            <DirArrow side={side} col={accent} />
          </div>
        )}

        {/* Done checkmark */}
        {isDone && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'arrow-breathe-fast 0.8s ease-in-out infinite' }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="20" fill="rgba(22,163,74,0.12)" stroke={ARROW_GREEN} strokeWidth="2" />
              <polyline points="12,22 19,30 32,14" stroke={ARROW_GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MODE C — Smart Dot  (cursor ring + floating target + dashed connector)
// ════════════════════════════════════════════════════════════════════════════

function SmartDotOverlay({ guidance, pointerNDC, containerSize, flashActive }: {
  guidance: GuidanceState;
  pointerNDC: { x: number; y: number };
  containerSize: { width: number; height: number };
  flashActive: boolean;
}) {
  const pct  = Math.round(guidance.coveragePercent * 100);
  const dir  = guidance.phase !== 'complete' ? guidance.direction : null;
  const { width: cw, height: ch } = containerSize;

  const cursorPx = (pointerNDC.x + 1) / 2 * cw;
  const cursorPy = (1 - pointerNDC.y) / 2 * ch;

  const tp  = guidance.targetScreenPos;
  const tPx = tp ? tp.x * cw : null;
  const tPy = tp ? tp.y * ch : null;

  const side   = getSide(dir);
  const cov    = sideCoverage(guidance.regions, side);
  const isDone = cov >= SIDE_DONE_THRESHOLD && side !== null;
  const accent = isDone ? ARROW_GREEN : ARROW_RED;
  const isScanning  = guidance.phase === 'scanning';
  const isComplete  = guidance.phase === 'complete';

  // Quadratic bezier from cursor → target
  let svgPath = '';
  if (tPx !== null && tPy !== null && cw > 0) {
    const mx = (cursorPx + tPx) / 2;
    const my = (cursorPy + tPy) / 2;
    const dx = tPx - cursorPx, dy = tPy - cursorPy;
    svgPath = `M ${cursorPx} ${cursorPy} Q ${mx - dy * 0.28} ${my + dx * 0.28} ${tPx} ${tPy}`;
  }

  const TICK_POSITIONS = ['top', 'right', 'bottom', 'left'] as const;
  const tickStyle = (pos: typeof TICK_POSITIONS[number]): React.CSSProperties => ({
    position: 'absolute', backgroundColor: accent, opacity: 0.55,
    ...(pos === 'top'    ? { top: -5, left: '50%', width: 1.5, height: 6, transform: 'translateX(-50%)' } :
        pos === 'bottom' ? { bottom: -5, left: '50%', width: 1.5, height: 6, transform: 'translateX(-50%)' } :
        pos === 'left'   ? { left: -5, top: '50%', width: 6, height: 1.5, transform: 'translateY(-50%)' } :
                           { right: -5, top: '50%', width: 6, height: 1.5, transform: 'translateY(-50%)' }),
  });

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', fontFamily: font.family }}>
      <style>{KF}</style>
      <TopBar guidance={guidance} pct={pct} />

      {/* Dashed bezier connector */}
      {svgPath && dir && cw > 0 && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
          <path
            d={svgPath} stroke={accent} strokeWidth="2" strokeDasharray="8 6"
            fill="none" opacity="0.55"
            style={{ animation: 'dash-flow 1.2s linear infinite' }}
          />
        </svg>
      )}

      {/* Cursor viewfinder ring */}
      {cw > 0 && (
        <div style={{
          position: 'absolute',
          left: cursorPx, top: cursorPy,
          width: 18, height: 18, borderRadius: '50%',
          border: `2px solid ${isScanning ? color.primary : 'rgba(0,154,206,0.45)'}`,
          transform: 'translate(-50%,-50%)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          animation: isScanning ? 'cursor-ping 1.8s ease-out infinite' : undefined,
        }}>
          <div style={{ position: 'absolute', inset: 4, borderRadius: '50%', backgroundColor: isScanning ? color.primary : 'rgba(0,154,206,0.4)', transition: 'background-color 0.2s ease' }} />
        </div>
      )}

      {/* Floating target */}
      {tPx !== null && tPy !== null && dir && cw > 0 && (
        <div style={{
          position: 'absolute', left: tPx, top: tPy, width: 68, height: 68,
          animation: `${isDone ? 'target-float-fast 0.7s' : 'target-float 2s'} ease-in-out infinite`,
          pointerEvents: 'none',
        }}>
          {/* Outer ring */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1.5px solid ${accent}`, opacity: 0.35 }} />
          {/* Main ring */}
          <div style={{
            position: 'absolute', inset: 8, borderRadius: '50%',
            border: `2px solid ${accent}`,
            backgroundColor: isDone ? 'rgba(22,163,74,0.1)' : 'rgba(0,154,206,0.07)',
            boxShadow: `0 0 12px 2px ${isDone ? 'rgba(22,163,74,0.2)' : 'rgba(0,154,206,0.15)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'border-color 0.3s ease, background-color 0.3s ease',
          }}>
            {isDone ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <polyline points="4,10 8,14 16,6" stroke={ARROW_GREEN} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span style={{ fontSize: '10px', fontWeight: 700, color: accent, letterSpacing: '-0.3px' }}>{pct}%</span>
            )}
          </div>
          {/* Crosshair ticks */}
          {TICK_POSITIONS.map(pos => <div key={pos} style={tickStyle(pos)} />)}
        </div>
      )}

      {/* Scan complete full-screen check */}
      {isComplete && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}>
          <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
            <circle cx="44" cy="44" r="40" fill="rgba(22,163,74,0.1)" stroke="#16A34A" strokeWidth="2" />
            <polyline points="24,44 37,57 64,31" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MODE D — Glow Frame  (single frame, each border edge lights up for direction)
// ════════════════════════════════════════════════════════════════════════════

function GlowFrameOverlay({ guidance, pointerNDC, flashActive }: {
  guidance: GuidanceState; pointerNDC: { x: number; y: number }; flashActive: boolean;
}) {
  const pct  = Math.round(guidance.coveragePercent * 100);
  const dir  = guidance.phase !== 'complete' ? guidance.direction : null;
  const side = getSide(dir);
  const cov  = sideCoverage(guidance.regions, side);
  const isDone    = cov >= SIDE_DONE_THRESHOLD && side !== null;
  const accent    = isDone ? ARROW_GREEN : ARROW_RED;
  const accentRGB = isDone ? '22,163,74' : '231,76,60';
  const ox = pointerNDC.x * 8, oy = pointerNDC.y * -6;
  const isScanning = guidance.phase === 'scanning';

  // Each of the 4 borders gets its own color + width based on whether it's the active direction
  const edges = ['top', 'right', 'bottom', 'left'] as const;
  type E = typeof edges[number];

  const dirToEdge: Record<string, E> = {
    left: 'left', right: 'right', up: 'top', down: 'bottom',
    'rotate-left': 'left', 'rotate-right': 'right',
  };
  const activeEdge: E | null = dir ? dirToEdge[dir] ?? null : null;

  const edgeColor = (e: E) => {
    if (flashActive)        return '#16A34A';
    if (e === activeEdge)   return accent;
    if (isScanning)         return color.primary;
    return 'rgba(0,154,206,0.4)';
  };
  const edgeWidth = (e: E) => e === activeEdge ? '4px' : '2px';
  const edgeGlow  = (e: E): string => {
    if (e !== activeEdge || !side) return 'none';
    const dirs: Record<E, string> = {
      right:  `inset -22px 0 32px -8px rgba(${accentRGB},0.75)`,
      left:   `inset 22px 0 32px -8px rgba(${accentRGB},0.75)`,
      top:    `inset 0 22px 32px -8px rgba(${accentRGB},0.75)`,
      bottom: `inset 0 -22px 32px -8px rgba(${accentRGB},0.75)`,
    };
    return dirs[e];
  };

  // Outer scan glow
  const outerGlow = flashActive
    ? '0 0 24px 8px rgba(22,163,74,0.4)'
    : isScanning ? '0 0 20px 6px rgba(0,154,206,0.35)' : 'none';

  const insetGlow = activeEdge ? edgeGlow(activeEdge) : 'none';
  const boxShadow = [outerGlow, insetGlow].filter(s => s !== 'none').join(', ') || 'none';

  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      display: 'flex', flexDirection: 'column', fontFamily: font.family, overflow: 'visible',
    }}>
      <style>{KF + `
        @keyframes edge-glow-pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.45; }
        }
        @keyframes edge-glow-done {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.6; }
        }
      `}</style>
      <TopBar guidance={guidance} pct={pct} />

      {/* The single scanning frame */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 'clamp(220px, 20vw, 300px)', height: 'clamp(340px, 32vw, 450px)',
        transform: `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`,
        pointerEvents: 'none',
        borderStyle: 'solid', borderRadius: '14px',
        borderTopColor:    edgeColor('top'),    borderTopWidth:    edgeWidth('top'),
        borderRightColor:  edgeColor('right'),  borderRightWidth:  edgeWidth('right'),
        borderBottomColor: edgeColor('bottom'), borderBottomWidth: edgeWidth('bottom'),
        borderLeftColor:   edgeColor('left'),   borderLeftWidth:   edgeWidth('left'),
        boxShadow,
        transition: 'transform 0.1s ease, border-color 0.25s ease, box-shadow 0.25s ease, border-width 0.2s ease',
      }}>
        {/* Glowing edge overlay strip — pulses on the active edge */}
        {activeEdge && (
          <div style={{
            position: 'absolute',
            animation: `${isDone ? 'edge-glow-done 0.7s' : 'edge-glow-pulse 1.1s'} ease-in-out infinite`,
            ...(activeEdge === 'left'   ? { left: -1,   top: '8%', bottom: '8%', width: 6, borderRadius: '3px', background: `linear-gradient(180deg, transparent, ${accent}, transparent)` } :
                activeEdge === 'right'  ? { right: -1,  top: '8%', bottom: '8%', width: 6, borderRadius: '3px', background: `linear-gradient(180deg, transparent, ${accent}, transparent)` } :
                activeEdge === 'top'    ? { top: -1,    left: '8%', right: '8%', height: 6, borderRadius: '3px', background: `linear-gradient(90deg, transparent, ${accent}, transparent)` } :
                                          { bottom: -1, left: '8%', right: '8%', height: 6, borderRadius: '3px', background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }),
          }} />
        )}

        {/* Corner accent dots on the active edge ends */}
        {activeEdge === 'left' && (
          <>
            <div style={{ position: 'absolute', top: '8%',  left: -3, width: 6, height: 6, borderRadius: '50%', backgroundColor: accent, opacity: 0.9 }} />
            <div style={{ position: 'absolute', bottom: '8%', left: -3, width: 6, height: 6, borderRadius: '50%', backgroundColor: accent, opacity: 0.9 }} />
          </>
        )}
        {activeEdge === 'right' && (
          <>
            <div style={{ position: 'absolute', top: '8%',    right: -3, width: 6, height: 6, borderRadius: '50%', backgroundColor: accent, opacity: 0.9 }} />
            <div style={{ position: 'absolute', bottom: '8%', right: -3, width: 6, height: 6, borderRadius: '50%', backgroundColor: accent, opacity: 0.9 }} />
          </>
        )}
        {activeEdge === 'top' && (
          <>
            <div style={{ position: 'absolute', top: -3, left: '8%',  width: 6, height: 6, borderRadius: '50%', backgroundColor: accent, opacity: 0.9 }} />
            <div style={{ position: 'absolute', top: -3, right: '8%', width: 6, height: 6, borderRadius: '50%', backgroundColor: accent, opacity: 0.9 }} />
          </>
        )}
        {activeEdge === 'bottom' && (
          <>
            <div style={{ position: 'absolute', bottom: -3, left: '8%',  width: 6, height: 6, borderRadius: '50%', backgroundColor: accent, opacity: 0.9 }} />
            <div style={{ position: 'absolute', bottom: -3, right: '8%', width: 6, height: 6, borderRadius: '50%', backgroundColor: accent, opacity: 0.9 }} />
          </>
        )}

        {/* Done checkmark */}
        {isDone && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'edge-glow-done 0.7s ease-in-out infinite' }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="20" fill="rgba(22,163,74,0.12)" stroke={ARROW_GREEN} strokeWidth="2" />
              <polyline points="12,22 19,30 32,14" stroke={ARROW_GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 6DoF GUIDANCE MODES — Blue gradient, all SVG
// ════════════════════════════════════════════════════════════════════════════

const DOF_KF = `
  @keyframes dof-breathe     { 0%,100%{opacity:0.85} 50%{opacity:0.3} }
  @keyframes dof-slide-lr    { 0%{transform:translate(-50%,-50%) translateX(-20px)} 50%{transform:translate(-50%,-50%) translateX(20px)} 100%{transform:translate(-50%,-50%) translateX(-20px)} }
  @keyframes dof-slide-ud    { 0%{transform:translate(-50%,-50%) translateY(-16px)} 50%{transform:translate(-50%,-50%) translateY(16px)} 100%{transform:translate(-50%,-50%) translateY(-16px)} }
  @keyframes dof-scale-fb    { 0%{transform:translate(-50%,-50%) scale(0.88)} 50%{transform:translate(-50%,-50%) scale(1.12)} 100%{transform:translate(-50%,-50%) scale(0.88)} }
  @keyframes dof-roll        { 0%{transform:translate(-50%,-50%) rotate(0deg)} 100%{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes dof-pitch       { 0%{transform:translate(-50%,-50%) perspective(400px) rotateX(-14deg)} 50%{transform:translate(-50%,-50%) perspective(400px) rotateX(14deg)} 100%{transform:translate(-50%,-50%) perspective(400px) rotateX(-14deg)} }
  @keyframes dof-yaw         { 0%{transform:translate(-50%,-50%) perspective(400px) rotateY(-16deg)} 50%{transform:translate(-50%,-50%) perspective(400px) rotateY(16deg)} 100%{transform:translate(-50%,-50%) perspective(400px) rotateY(-16deg)} }
  @keyframes dof-gizmo-pulse { 0%,100%{opacity:0.55} 50%{opacity:1} }
  @keyframes pulse-drift-lr  { 0%{transform:translate(calc(-50% - 18px),-50%)} 50%{transform:translate(calc(-50% + 18px),-50%)} 100%{transform:translate(calc(-50% - 18px),-50%)} }
  @keyframes pulse-drift-ud  { 0%{transform:translate(-50%,calc(-50% - 14px))} 50%{transform:translate(-50%,calc(-50% + 14px))} 100%{transform:translate(-50%,calc(-50% - 14px))} }
  @keyframes pulse-breathe   { 0%{transform:translate(-50%,-50%) scale(0.88)} 50%{transform:translate(-50%,-50%) scale(1.12)} 100%{transform:translate(-50%,-50%) scale(0.88)} }
  @keyframes pulse-roll-f    { 0%{transform:translate(-50%,-50%) rotate(-6deg)} 50%{transform:translate(-50%,-50%) rotate(6deg)} 100%{transform:translate(-50%,-50%) rotate(-6deg)} }
  @keyframes pulse-pitch-f   { 0%{transform:translate(-50%,-50%) perspective(500px) rotateX(-10deg)} 50%{transform:translate(-50%,-50%) perspective(500px) rotateX(10deg)} 100%{transform:translate(-50%,-50%) perspective(500px) rotateX(-10deg)} }
  @keyframes pulse-yaw-f     { 0%{transform:translate(-50%,-50%) perspective(500px) rotateY(-12deg)} 50%{transform:translate(-50%,-50%) perspective(500px) rotateY(12deg)} 100%{transform:translate(-50%,-50%) perspective(500px) rotateY(-12deg)} }
  @keyframes ring-spin       { 0%{transform:translate(-50%,-50%) rotate(0deg)} 100%{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes ring-osc        { 0%,100%{stroke-dashoffset:0} 50%{stroke-dashoffset:40} }
`;

// Blue gradient SVG defs
function BlueDefs() {
  return (
    <defs>
      <linearGradient id="gb-h" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#80D4F0"/><stop offset="50%" stopColor="#009ACE"/><stop offset="100%" stopColor="#007A9E"/>
      </linearGradient>
      <linearGradient id="gb-v" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#80D4F0"/><stop offset="50%" stopColor="#009ACE"/><stop offset="100%" stopColor="#007A9E"/>
      </linearGradient>
      <linearGradient id="gb-d" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#80D4F0"/><stop offset="100%" stopColor="#006080"/>
      </linearGradient>
      <linearGradient id="gb-hl" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.4)"/><stop offset="100%" stopColor="rgba(255,255,255,0)"/>
      </linearGradient>
      <radialGradient id="gb-r" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#40B8DB"/><stop offset="100%" stopColor="#006080"/>
      </radialGradient>
    </defs>
  );
}

const BF = 'drop-shadow(0 2px 6px rgba(0,120,160,0.3))';

// ─── 3D SVG Arrows ───────────────────────────────────────────────────────────

function ArrowH({ dir, s = 56 }: { dir: 'left'|'right'; s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 56 56" fill="none" style={{ transform: dir === 'left' ? 'scaleX(-1)' : undefined, filter: BF }}>
      <BlueDefs/>
      <rect x="8" y="22" width="28" height="12" rx="6" fill="url(#gb-h)"/>
      <rect x="8" y="22" width="28" height="6" rx="6" fill="url(#gb-hl)"/>
      <path d="M34 12 L52 28 L34 44Z" fill="url(#gb-h)"/>
      <path d="M34 12 L52 28 L34 28Z" fill="url(#gb-hl)" opacity="0.5"/>
    </svg>
  );
}

function ArrowV({ dir, s = 56 }: { dir: 'up'|'down'; s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 56 56" fill="none" style={{ transform: dir === 'down' ? 'scaleY(-1)' : undefined, filter: BF }}>
      <BlueDefs/>
      <rect x="22" y="18" width="12" height="28" rx="6" fill="url(#gb-v)"/>
      <rect x="22" y="18" width="6" height="28" rx="6" fill="url(#gb-hl)"/>
      <path d="M12 20 L28 2 L44 20Z" fill="url(#gb-v)"/>
      <path d="M12 20 L28 2 L28 20Z" fill="url(#gb-hl)" opacity="0.5"/>
    </svg>
  );
}

function ArrowCurve({ s = 110 }: { s?: number }) {
  const h = Math.round(s * 0.55);
  return (
    <svg width={s} height={h} viewBox="0 0 110 60" fill="none" style={{ filter: BF }}>
      <BlueDefs/>
      <path d="M14 50 A 48 40 0 0 1 96 50" stroke="url(#gb-d)" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M16 48 A 46 38 0 0 1 94 48" stroke="url(#gb-hl)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M92 50 L102 42 L96 58Z" fill="url(#gb-d)"/>
      <path d="M92 50 L102 42 L97 50Z" fill="url(#gb-hl)" opacity="0.5"/>
      <path d="M96 50 A 48 40 0 0 1 14 50" stroke="url(#gb-d)" strokeWidth="1.5" strokeDasharray="5 6" fill="none" opacity="0.15"/>
    </svg>
  );
}

function ArrowDepth({ s = 68 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 68 68" fill="none" style={{ filter: BF }}>
      <BlueDefs/>
      <circle cx="34" cy="34" r="28" stroke="url(#gb-d)" strokeWidth="2" fill="none" opacity="0.2"/>
      <circle cx="34" cy="34" r="17" stroke="url(#gb-d)" strokeWidth="2" fill="none" opacity="0.4"/>
      <circle cx="34" cy="34" r="5" fill="url(#gb-r)"/>
      <circle cx="33" cy="33" r="2" fill="rgba(255,255,255,0.35)"/>
      {[0,90,180,270].map(d=><g key={d} transform={`rotate(${d} 34 34)`}><path d="M34 3L30 9M34 3L38 9" stroke="url(#gb-v)" strokeWidth="2" strokeLinecap="round"/></g>)}
    </svg>
  );
}

// SVG Ring for Ring mode
function SvgRing({ variant }: { variant: 'lr'|'ud'|'fb'|'roll'|'pitch'|'yaw' }) {
  const isRot = variant === 'roll' || variant === 'pitch' || variant === 'yaw';
  const anim = variant === 'roll' ? 'ring-spin 5s linear infinite' :
               variant === 'pitch' ? 'pulse-pitch-f 3s ease-in-out infinite' :
               variant === 'yaw' ? 'pulse-yaw-f 3s ease-in-out infinite' :
               variant === 'lr' ? 'pulse-drift-lr 2.8s ease-in-out infinite' :
               variant === 'ud' ? 'pulse-drift-ud 2.8s ease-in-out infinite' :
               'pulse-breathe 3.2s ease-in-out infinite';
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%', width: 260, height: 260,
      animation: anim, pointerEvents: 'none',
    }}>
      <svg width="260" height="260" viewBox="0 0 260 260" fill="none" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,154,206,0.3))' }}>
        <BlueDefs/>
        <ellipse cx="130" cy="130"
          rx={variant === 'fb' ? 100 : 120}
          ry={variant === 'fb' ? 60 : variant === 'lr' ? 60 : 120}
          stroke="url(#gb-d)" strokeWidth="3" fill="none" opacity="0.7"
          strokeDasharray={isRot ? 'none' : '12 6'}
        />
        <ellipse cx="130" cy="130"
          rx={variant === 'fb' ? 98 : 118}
          ry={variant === 'fb' ? 58 : variant === 'lr' ? 58 : 118}
          stroke="url(#gb-hl)" strokeWidth="1.5" fill="none" opacity="0.4"
        />
        {/* Arrowhead on ring */}
        <circle cx={variant === 'lr' ? 250 : variant === 'ud' ? 130 : 230} cy={variant === 'ud' ? 10 : variant === 'lr' ? 130 : 60} r="4" fill="url(#gb-r)"/>
      </svg>
    </div>
  );
}

// ─── Labels ──────────────────────────────────────────────────────────────────

const MODE_LABEL: Record<string, string> = {
  'dof-lr':'Left / Right','dof-ud':'Up / Down','dof-fb':'Forward / Back','dof-roll':'Roll','dof-pitch':'Pitch','dof-yaw':'Yaw',
  'bare-lr':'Left / Right','bare-ud':'Up / Down','bare-fb':'Forward / Back','bare-roll':'Roll','bare-pitch':'Pitch','bare-yaw':'Yaw',
  'ring-lr':'Left / Right','ring-ud':'Up / Down','ring-fb':'Forward / Back','ring-roll':'Roll','ring-pitch':'Pitch','ring-yaw':'Yaw',
  'pulse-lr':'Left / Right','pulse-ud':'Up / Down','pulse-fb':'Forward / Back','pulse-roll':'Roll','pulse-pitch':'Pitch','pulse-yaw':'Yaw',
  'dof-gizmo':'6DoF Overview',
};

function ModeLabel({ mode, c = '#009ACE' }: { mode: string; c?: string }) {
  return (
    <div style={{
      position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)',
      fontSize: '11px', fontWeight: 600, color: c,
      backgroundColor: 'rgba(255,255,255,0.92)', padding: '3px 12px',
      borderRadius: '10px', whiteSpace: 'nowrap',
      border: `1px solid ${color.borderDefault}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      {MODE_LABEL[mode] ?? mode}
    </div>
  );
}

// ─── Frame wrapper ───────────────────────────────────────────────────────────

function DofFrame({ mode, flashActive, children, anim }: {
  mode: string; flashActive: boolean; children?: React.ReactNode; anim?: string;
}) {
  const bc = flashActive ? '#16A34A' : 'rgba(0,154,206,0.45)';
  const glow = flashActive ? '0 0 24px 8px rgba(22,163,74,0.4)' : 'none';
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      width: 'clamp(220px, 20vw, 300px)', height: 'clamp(340px, 32vw, 450px)',
      transform: 'translate(-50%,-50%)', pointerEvents: 'none',
      border: `3px solid ${bc}`, borderRadius: '14px',
      boxShadow: glow, transition: 'border-color 0.2s, box-shadow 0.2s', animation: anim,
    }}>
      <ModeLabel mode={mode}/>
      {children}
    </div>
  );
}

function BareWrap({ mode, children }: { mode: string; children?: React.ReactNode }) {
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      width: 'clamp(220px, 20vw, 300px)', height: 'clamp(340px, 32vw, 450px)',
      transform: 'translate(-50%,-50%)', pointerEvents: 'none',
    }}>
      <ModeLabel mode={mode}/>
      {children}
    </div>
  );
}

// ─── 6DoF overlays (shared between frame & bare via `bare` prop) ─────────────

function DofLR({ g, f, bare }: { g: GuidanceState; f: boolean; bare?: boolean }) {
  const pct = Math.round(g.coveragePercent * 100);
  const W = bare ? BareWrap : DofFrame;
  const m = bare ? 'bare-lr' : 'dof-lr';
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',fontFamily:font.family }}>
      <style>{KF+DOF_KF}</style><TopBar guidance={g} pct={pct}/>
      <W mode={m} flashActive={f}>
        <div style={{ position:'absolute',left:-64,top:'50%',transform:'translateY(-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowH dir="left"/></div>
        <div style={{ position:'absolute',right:-64,top:'50%',transform:'translateY(-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowH dir="right"/></div>
        <div style={{ position:'absolute',top:'50%',left:'50%',width:10,height:10,borderRadius:'50%',background:'linear-gradient(135deg,#40B8DB,#007A9E)',boxShadow:'0 1px 4px rgba(0,120,160,0.4)',animation:'dof-slide-lr 2.5s ease-in-out infinite' }}/>
      </W>
    </div>
  );
}

function DofUD({ g, f, bare }: { g: GuidanceState; f: boolean; bare?: boolean }) {
  const pct = Math.round(g.coveragePercent * 100);
  const W = bare ? BareWrap : DofFrame;
  const m = bare ? 'bare-ud' : 'dof-ud';
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',fontFamily:font.family }}>
      <style>{KF+DOF_KF}</style><TopBar guidance={g} pct={pct}/>
      <W mode={m} flashActive={f}>
        <div style={{ position:'absolute',top:-64,left:'50%',transform:'translateX(-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowV dir="up"/></div>
        <div style={{ position:'absolute',bottom:-64,left:'50%',transform:'translateX(-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowV dir="down"/></div>
        <div style={{ position:'absolute',top:'50%',left:'50%',width:10,height:10,borderRadius:'50%',background:'linear-gradient(135deg,#40B8DB,#007A9E)',boxShadow:'0 1px 4px rgba(0,120,160,0.4)',animation:'dof-slide-ud 2.5s ease-in-out infinite' }}/>
      </W>
    </div>
  );
}

function DofFB({ g, f, bare }: { g: GuidanceState; f: boolean; bare?: boolean }) {
  const pct = Math.round(g.coveragePercent * 100);
  const m = bare ? 'bare-fb' : 'dof-fb';
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',fontFamily:font.family }}>
      <style>{KF+DOF_KF}</style><TopBar guidance={g} pct={pct}/>
      <div style={{
        position:'absolute',top:'50%',left:'50%',
        width:'clamp(220px,20vw,300px)',height:'clamp(340px,32vw,450px)',
        pointerEvents:'none',
        border: bare ? 'none' : `3px solid ${f ? '#16A34A' : 'rgba(0,154,206,0.45)'}`,
        borderRadius:'14px', boxShadow: !bare && f ? '0 0 24px 8px rgba(22,163,74,0.4)' : 'none',
        animation:'dof-scale-fb 3s ease-in-out infinite',
      }}>
        <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowDepth s={bare ? 80 : 68}/></div>
        <ModeLabel mode={m}/>
      </div>
    </div>
  );
}

function DofRoll({ g, f, bare }: { g: GuidanceState; f: boolean; bare?: boolean }) {
  const pct = Math.round(g.coveragePercent * 100);
  const W = bare ? BareWrap : DofFrame;
  const m = bare ? 'bare-roll' : 'dof-roll';
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',fontFamily:font.family }}>
      <style>{KF+DOF_KF}</style><TopBar guidance={g} pct={pct}/>
      <W mode={m} flashActive={f}>
        <div style={{ position:'absolute',top:-68,left:'50%',transform:'translateX(-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowCurve s={110}/></div>
        <div style={{ position:'absolute',top:'50%',left:'50%',width:70,height:70,animation:'dof-roll 4s linear infinite' }}>
          <svg width="70" height="70" viewBox="0 0 70 70" fill="none" style={{ filter:BF }}>
            <BlueDefs/><circle cx="35" cy="35" r="28" stroke="url(#gb-d)" strokeWidth="2" opacity="0.25" fill="none"/>
            <line x1="35" y1="7" x2="35" y2="20" stroke="url(#gb-v)" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="35" y1="50" x2="35" y2="63" stroke="url(#gb-v)" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="7" y1="35" x2="20" y2="35" stroke="url(#gb-h)" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="50" y1="35" x2="63" y2="35" stroke="url(#gb-h)" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="35" cy="35" r="3" fill="url(#gb-r)"/>
          </svg>
        </div>
      </W>
    </div>
  );
}

function DofPitch({ g, f, bare }: { g: GuidanceState; f: boolean; bare?: boolean }) {
  const pct = Math.round(g.coveragePercent * 100);
  const W = bare ? BareWrap : DofFrame;
  const m = bare ? 'bare-pitch' : 'dof-pitch';
  const anim = bare ? undefined : 'dof-pitch 3s ease-in-out infinite';
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',fontFamily:font.family }}>
      <style>{KF+DOF_KF}</style><TopBar guidance={g} pct={pct}/>
      <W mode={m} flashActive={f} anim={anim}>
        <div style={{ position:'absolute',right:-68,top:'50%',transform:'translateY(-50%) rotate(90deg)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowCurve s={100}/></div>
        <div style={{ position:'absolute',left:-68,top:'50%',transform:'translateY(-50%) rotate(-90deg) scaleX(-1)',animation:'dof-breathe 2s ease-in-out infinite',animationDelay:'1s',opacity:0.35 }}><ArrowCurve s={80}/></div>
      </W>
    </div>
  );
}

function DofYaw({ g, f, bare }: { g: GuidanceState; f: boolean; bare?: boolean }) {
  const pct = Math.round(g.coveragePercent * 100);
  const W = bare ? BareWrap : DofFrame;
  const m = bare ? 'bare-yaw' : 'dof-yaw';
  const anim = bare ? undefined : 'dof-yaw 3s ease-in-out infinite';
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',fontFamily:font.family }}>
      <style>{KF+DOF_KF}</style><TopBar guidance={g} pct={pct}/>
      <W mode={m} flashActive={f} anim={anim}>
        <div style={{ position:'absolute',top:-68,left:'50%',transform:'translateX(-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowCurve s={120}/></div>
        <div style={{ position:'absolute',bottom:-68,left:'50%',transform:'translateX(-50%) scaleY(-1)',animation:'dof-breathe 2s ease-in-out infinite',animationDelay:'1s',opacity:0.35 }}><ArrowCurve s={100}/></div>
      </W>
    </div>
  );
}

// ─── Ring overlays ───────────────────────────────────────────────────────────

function RingOverlay({ mode, g }: { mode: string; g: GuidanceState }) {
  const pct = Math.round(g.coveragePercent * 100);
  const variant = mode.replace('ring-','') as 'lr'|'ud'|'fb'|'roll'|'pitch'|'yaw';
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',fontFamily:font.family }}>
      <style>{KF+DOF_KF}</style><TopBar guidance={g} pct={pct}/>
      <SvgRing variant={variant}/>
      <div style={{
        position:'absolute',bottom:36,left:'50%',transform:'translateX(-50%)',
        fontSize:'12px',fontWeight:600,color:'#009ACE',
        backgroundColor:'rgba(255,255,255,0.9)',padding:'4px 14px',
        borderRadius:'12px',whiteSpace:'nowrap',
        border:'1px solid rgba(0,154,206,0.2)',boxShadow:'0 2px 8px rgba(0,154,206,0.1)',
      }}>
        {MODE_LABEL[mode] ?? mode}
      </div>
    </div>
  );
}

// ─── Pulse overlays ──────────────────────────────────────────────────────────

const PT = '#009ACE';
const PTG = 'rgba(0,154,206,0.35)';

function PulseOverlay({ mode, g, f, anim, lead }: {
  mode: string; g: GuidanceState; f: boolean; anim: string;
  lead?: 'top'|'right'|'bottom'|'left'|'all'|null;
}) {
  const pct = Math.round(g.coveragePercent * 100);
  const bc = f ? '#16A34A' : PT;
  const ew = (e: string) => (lead === 'all' ? 3 : e === lead ? 4 : 2);
  const ec = (e: string) => (f ? '#16A34A' : lead === 'all' ? PT : e === lead ? PT : 'rgba(0,154,206,0.3)');
  const glows: string[] = [];
  if (f) glows.push('0 0 20px 6px rgba(22,163,74,0.35)');
  else if (lead && lead !== 'all') {
    const m: Record<string,string> = { left:`inset 14px 0 24px -6px ${PTG}`, right:`inset -14px 0 24px -6px ${PTG}`, top:`inset 0 14px 24px -6px ${PTG}`, bottom:`inset 0 -14px 24px -6px ${PTG}` };
    glows.push(m[lead]);
  } else if (lead === 'all') glows.push(`0 0 18px 4px ${PTG}`);

  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',fontFamily:font.family }}>
      <style>{KF+DOF_KF}</style><TopBar guidance={g} pct={pct}/>
      <div style={{
        position:'absolute',top:'50%',left:'50%',
        width:'clamp(220px,20vw,300px)',height:'clamp(340px,32vw,450px)',
        pointerEvents:'none',borderStyle:'solid',borderRadius:'14px',
        borderTopWidth:ew('top'),borderTopColor:ec('top'),
        borderRightWidth:ew('right'),borderRightColor:ec('right'),
        borderBottomWidth:ew('bottom'),borderBottomColor:ec('bottom'),
        borderLeftWidth:ew('left'),borderLeftColor:ec('left'),
        boxShadow:glows.join(',')||'none',animation:anim,
        transition:'border-color 0.3s,box-shadow 0.3s',
      }}>
        <div style={{ position:'absolute',bottom:-24,left:'50%',transform:'translateX(-50%)',fontSize:'10px',fontWeight:500,color:PT,opacity:0.7,whiteSpace:'nowrap' }}>
          {MODE_LABEL[mode]??mode}
        </div>
      </div>
    </div>
  );
}

// ─── Gizmo ───────────────────────────────────────────────────────────────────

function GizmoOverlay({ g }: { g: GuidanceState }) {
  const pct = Math.round(g.coveragePercent * 100);
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',fontFamily:font.family }}>
      <style>{KF+DOF_KF}</style><TopBar guidance={g} pct={pct}/>
      <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:320,height:320,pointerEvents:'none' }}>
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none" style={{ filter:'drop-shadow(0 3px 8px rgba(0,120,160,0.18))' }}>
          <BlueDefs/>
          {/* X — L/R */}
          <g style={{ animation:'dof-gizmo-pulse 3s ease-in-out infinite' }}>
            <rect x="40" y="155" width="240" height="10" rx="5" fill="url(#gb-h)"/><rect x="40" y="155" width="240" height="5" rx="5" fill="url(#gb-hl)"/>
            <path d="M40 145L20 160L40 175Z" fill="url(#gb-h)"/><path d="M280 145L300 160L280 175Z" fill="url(#gb-h)"/>
            <text x="305" y="164" fill="#007A9E" fontSize="11" fontWeight="700" fontFamily="system-ui">X</text>
          </g>
          {/* Y — U/D */}
          <g style={{ animation:'dof-gizmo-pulse 3s ease-in-out infinite',animationDelay:'0.5s' }}>
            <rect x="155" y="40" width="10" height="240" rx="5" fill="url(#gb-v)"/><rect x="155" y="40" width="5" height="240" rx="5" fill="url(#gb-hl)"/>
            <path d="M145 40L160 20L175 40Z" fill="url(#gb-v)"/><path d="M145 280L160 300L175 280Z" fill="url(#gb-v)"/>
            <text x="164" y="14" fill="#16A34A" fontSize="11" fontWeight="700" fontFamily="system-ui" textAnchor="middle">Y</text>
          </g>
          {/* Z — F/B diagonal */}
          <g style={{ animation:'dof-gizmo-pulse 3s ease-in-out infinite',animationDelay:'1s' }}>
            <line x1="90" y1="230" x2="230" y2="90" stroke="url(#gb-d)" strokeWidth="8" strokeLinecap="round"/>
            <path d="M90 230L78 212L102 218Z" fill="url(#gb-d)"/><path d="M230 90L218 78L242 84Z" fill="url(#gb-d)"/>
            <text x="240" y="78" fill="#007A9E" fontSize="11" fontWeight="700" fontFamily="system-ui">Z</text>
          </g>
          {/* Roll arc */}
          <g style={{ animation:'dof-gizmo-pulse 3s ease-in-out infinite',animationDelay:'1.5s' }}>
            <path d="M110 70A100 100 0 0 1 210 70" stroke="url(#gb-d)" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M210 70L200 60L203 75Z" fill="url(#gb-d)"/>
            <text x="160" y="56" fill="#009ACE" fontSize="9" fontWeight="600" fontFamily="system-ui" textAnchor="middle">Roll</text>
          </g>
          {/* Pitch arc */}
          <g style={{ animation:'dof-gizmo-pulse 3s ease-in-out infinite',animationDelay:'2s' }}>
            <path d="M252 110A100 100 0 0 1 252 210" stroke="url(#gb-d)" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M252 210L242 200L257 203Z" fill="url(#gb-d)"/>
            <text x="268" y="164" fill="#009ACE" fontSize="9" fontWeight="600" fontFamily="system-ui">Pitch</text>
          </g>
          {/* Yaw arc */}
          <g style={{ animation:'dof-gizmo-pulse 3s ease-in-out infinite',animationDelay:'2.5s' }}>
            <path d="M110 252A100 100 0 0 1 210 252" stroke="url(#gb-d)" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M210 252L200 243L203 257Z" fill="url(#gb-d)"/>
            <text x="160" y="272" fill="#009ACE" fontSize="9" fontWeight="600" fontFamily="system-ui" textAnchor="middle">Yaw</text>
          </g>
          <circle cx="160" cy="160" r="8" fill="url(#gb-r)"/><circle cx="158" cy="158" r="3" fill="rgba(255,255,255,0.4)"/>
        </svg>
        <div style={{ position:'absolute',bottom:-36,left:'50%',transform:'translateX(-50%)',fontSize:'12px',fontWeight:700,color:'#009ACE',backgroundColor:'rgba(255,255,255,0.92)',padding:'4px 16px',borderRadius:'12px',whiteSpace:'nowrap',border:`1px solid ${color.borderDefault}`,boxShadow:'0 1px 4px rgba(0,0,0,0.08)' }}>
          6 Degrees of Freedom
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// GHOST WAND GUIDANCE — real frame + ghost frame per 6DoF axis
// ════════════════════════════════════════════════════════════════════════════

const GHOST_KF = `
  @keyframes ghost-float-lr  { 0%{transform:translate(calc(-50% + 30px),-50%)} 50%{transform:translate(calc(-50% - 30px),-50%)} 100%{transform:translate(calc(-50% + 30px),-50%)} }
  @keyframes ghost-float-ud  { 0%{transform:translate(-50%,calc(-50% + 24px))} 50%{transform:translate(-50%,calc(-50% - 24px))} 100%{transform:translate(-50%,calc(-50% + 24px))} }
  @keyframes ghost-float-fb  { 0%{transform:translate(-50%,-50%) scale(0.88)} 50%{transform:translate(-50%,-50%) scale(1.12)} 100%{transform:translate(-50%,-50%) scale(0.88)} }
  @keyframes ghost-float-roll { 0%{transform:translate(-50%,-50%) rotate(-8deg)} 50%{transform:translate(-50%,-50%) rotate(8deg)} 100%{transform:translate(-50%,-50%) rotate(-8deg)} }
  @keyframes ghost-float-pitch { 0%{transform:translate(-50%,-50%) perspective(400px) rotateX(-12deg)} 50%{transform:translate(-50%,-50%) perspective(400px) rotateX(12deg)} 100%{transform:translate(-50%,-50%) perspective(400px) rotateX(-12deg)} }
  @keyframes ghost-float-yaw { 0%{transform:translate(-50%,-50%) perspective(400px) rotateY(-14deg)} 50%{transform:translate(-50%,-50%) perspective(400px) rotateY(14deg)} 100%{transform:translate(-50%,-50%) perspective(400px) rotateY(-14deg)} }
  @keyframes ghost-confirm  { 0%{box-shadow:0 0 0 0 rgba(22,163,74,0.5)} 70%{box-shadow:0 0 0 18px rgba(22,163,74,0)} 100%{box-shadow:0 0 0 0 rgba(22,163,74,0)} }
`;

const GHOST_ANIM: Record<string, string> = {
  'ghost-lr':    'ghost-float-lr 2.8s ease-in-out infinite',
  'ghost-ud':    'ghost-float-ud 2.8s ease-in-out infinite',
  'ghost-fb':    'ghost-float-fb 3.2s ease-in-out infinite',
  'ghost-roll':  'ghost-float-roll 3s ease-in-out infinite',
  'ghost-pitch': 'ghost-float-pitch 3s ease-in-out infinite',
  'ghost-yaw':   'ghost-float-yaw 3s ease-in-out infinite',
};

const GHOST_LABEL: Record<string, string> = {
  'ghost-lr': 'Left / Right', 'ghost-ud': 'Up / Down', 'ghost-fb': 'Forward / Back',
  'ghost-roll': 'Roll', 'ghost-pitch': 'Pitch', 'ghost-yaw': 'Yaw',
};

const GW = '#009ACE';

function GhostOverlay({ mode, g, f }: { mode: string; g: GuidanceState; f: boolean }) {
  const pct = Math.round(g.coveragePercent * 100);
  const isScanning = g.phase === 'scanning';

  // Real frame colors
  const realBorder = f ? '#16A34A' : isScanning ? GW : 'rgba(0,154,206,0.5)';
  const realGlow = f
    ? '0 0 24px 8px rgba(22,163,74,0.4), inset 0 0 12px 2px rgba(22,163,74,0.15)'
    : isScanning
    ? '0 0 20px 6px rgba(0,154,206,0.3), inset 0 0 10px 2px rgba(0,154,206,0.08)'
    : 'none';

  // Ghost frame
  const ghostAnim = GHOST_ANIM[mode] ?? 'none';

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', fontFamily: font.family }}>
      <style>{KF + DOF_KF + GHOST_KF}</style>
      <TopBar guidance={g} pct={pct} />

      {/* Ghost frame — animates along the axis */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 'clamp(220px, 20vw, 300px)', height: 'clamp(340px, 32vw, 450px)',
        pointerEvents: 'none',
        animation: ghostAnim,
      }}>
        <div style={{
          width: '100%', height: '100%',
          border: '2.5px dashed rgba(0,154,206,0.25)',
          borderRadius: '14px',
          boxShadow: '0 0 14px 3px rgba(0,154,206,0.1)',
          transition: 'border-color 0.3s ease',
        }}>
          {/* "target" label */}
          <div style={{
            position: 'absolute', bottom: -24, left: '50%', transform: 'translateX(-50%)',
            fontSize: '10px', fontWeight: 600, color: GW, opacity: 0.7,
            backgroundColor: 'rgba(255,255,255,0.88)', padding: '2px 10px',
            borderRadius: '8px', whiteSpace: 'nowrap',
            border: '1px solid rgba(0,154,206,0.12)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            scan here
          </div>
        </div>
      </div>

      {/* Real frame — stationary in the center */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 'clamp(220px, 20vw, 300px)', height: 'clamp(340px, 32vw, 450px)',
        transform: 'translate(-50%,-50%)',
        pointerEvents: 'none',
        border: `3px solid ${realBorder}`,
        borderRadius: '14px',
        boxShadow: realGlow,
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}>
        {/* Mode label */}
        <div style={{
          position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)',
          fontSize: '11px', fontWeight: 600, color: GW,
          backgroundColor: 'rgba(255,255,255,0.92)', padding: '3px 12px',
          borderRadius: '10px', whiteSpace: 'nowrap',
          border: `1px solid ${color.borderDefault}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          {GHOST_LABEL[mode] ?? mode}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SURFACE GUIDANCE — model-driven minimal highlights
// ════════════════════════════════════════════════════════════════════════════

const SURFACE_KF = `
  @keyframes surface-pulse  { 0%,100%{opacity:0.45} 50%{opacity:0.85} }
  @keyframes surface-reveal { from{clip-path:inset(100% 0 0 0)} to{clip-path:inset(0)} }
  @keyframes surface-hint-slide { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
  @keyframes surface-region-glow { 0%,100%{box-shadow:0 0 12px 2px var(--sg)} 50%{box-shadow:0 0 24px 6px var(--sg)} }
`;

/** Maps stage to a human-readable instruction */
function surfaceHint(stage: ScanStage, direction: GuidanceDirection | null, coverage: number): string {
  if (coverage < 0.02) return 'Hover over the model to begin scanning';
  if (stage === 'occlusal') {
    if (!direction) return 'Scanning occlusal surface...';
    if (direction === 'left' || direction === 'rotate-left') return 'Move toward the left side';
    if (direction === 'right' || direction === 'rotate-right') return 'Move toward the right side';
    if (direction === 'up') return 'Scan the upper area';
    if (direction === 'down') return 'Scan the lower area';
  }
  if (stage === 'buccal') {
    if (!direction || direction === 'rotate-left') return 'Rotate to scan buccal surface';
    return 'Continue scanning buccal area';
  }
  if (stage === 'lingual') {
    if (!direction || direction === 'rotate-right') return 'Rotate to reach lingual surface';
    return 'Continue scanning lingual area';
  }
  return 'Continue scanning';
}

function SurfaceGuideOverlay({ guidance, containerSize }: {
  guidance: GuidanceState;
  containerSize: { width: number; height: number };
}) {
  const pct = Math.round(guidance.coveragePercent * 100);
  const dir = guidance.phase !== 'complete' ? guidance.direction : null;
  const isScanning = guidance.phase === 'scanning';
  const isComplete = guidance.phase === 'complete';
  const { width: cw, height: ch } = containerSize;

  // Find the weakest regions (up to 3) to highlight
  const sortedRegions = [...guidance.regions]
    .filter(r => r.coverage < 0.6)
    .sort((a, b) => a.coverage - b.coverage)
    .slice(0, 3);

  const hint = isComplete
    ? 'Scan complete'
    : surfaceHint(guidance.stage, dir, guidance.coveragePercent);

  // Subtle rotation cue arrow (only shows when stage suggests rotation)
  const showRotateCue = !isComplete && (dir === 'rotate-left' || dir === 'rotate-right');

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', fontFamily: font.family }}>
      <style>{KF + SURFACE_KF}</style>
      <TopBar guidance={guidance} pct={pct} />

      {/* Region highlight markers — positioned over the 3D model area */}
      {cw > 0 && sortedRegions.map((region, i) => {
        // Map region's normalized coords to screen space
        // The model occupies roughly the center 60% of the viewport
        const modelLeft = cw * 0.2;
        const modelTop = ch * 0.15;
        const modelW = cw * 0.6;
        const modelH = ch * 0.7;

        const rx = modelLeft + ((region.xMin + region.xMax) / 2) * modelW;
        const ry = modelTop + ((region.zMin + region.zMax) / 2) * modelH;
        const rw = ((region.xMax - region.xMin) * modelW) * 0.85;
        const rh = ((region.zMax - region.zMin) * modelH) * 0.85;

        const intensity = 1 - region.coverage; // 0=fully scanned, 1=not scanned
        const glowColor = `rgba(0,154,206,${(intensity * 0.35).toFixed(2)})`;

        return (
          <div key={region.id} style={{
            position: 'absolute',
            left: rx - rw / 2, top: ry - rh / 2,
            width: rw, height: rh,
            borderRadius: '12px',
            border: `1.5px solid rgba(0,154,206,${(intensity * 0.5).toFixed(2)})`,
            backgroundColor: `rgba(0,154,206,${(intensity * 0.08).toFixed(2)})`,
            animation: `surface-pulse ${2 + i * 0.4}s ease-in-out infinite`,
            ['--sg' as string]: glowColor,
            transition: 'opacity 0.5s ease, border-color 0.5s ease',
          }}>
            {/* Inner pulse dot */}
            {i === 0 && intensity > 0.4 && (
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                width: 8, height: 8, borderRadius: '50%',
                backgroundColor: 'rgba(0,154,206,0.6)',
                transform: 'translate(-50%, -50%)',
                animation: 'surface-pulse 1.4s ease-in-out infinite',
              }} />
            )}
          </div>
        );
      })}

      {/* Subtle rotation cue — minimal curved hint */}
      {showRotateCue && cw > 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          [dir === 'rotate-left' ? 'left' : 'right']: '8%',
          transform: `translateY(-50%) ${dir === 'rotate-right' ? 'scaleX(-1)' : ''}`,
          opacity: 0.45,
          animation: 'surface-pulse 2s ease-in-out infinite',
        }}>
          <svg width="36" height="60" viewBox="0 0 36 60" fill="none">
            <path d="M28 8C12 12 8 28 12 48" stroke="#009ACE" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M12 48L6 40M12 48L20 42" stroke="#009ACE" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Direction hint — subtle arrow for non-rotation directions */}
      {dir && !showRotateCue && !isComplete && cw > 0 && (
        <div style={{
          position: 'absolute',
          ...(dir === 'left'  ? { top: '50%', left: '12%', transform: 'translateY(-50%)' } :
              dir === 'right' ? { top: '50%', right: '12%', transform: 'translateY(-50%)' } :
              dir === 'up'    ? { top: '15%', left: '50%', transform: 'translateX(-50%)' } :
              dir === 'down'  ? { bottom: '15%', left: '50%', transform: 'translateX(-50%)' } : {}),
          opacity: 0.4,
          animation: 'surface-hint-slide 2.5s ease-in-out infinite',
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d={
              dir === 'left'  ? 'M22,14 L6,14 M12,8 L6,14 L12,20' :
              dir === 'right' ? 'M6,14 L22,14 M16,8 L22,14 L16,20' :
              dir === 'up'    ? 'M14,22 L14,6 M8,12 L14,6 L20,12' :
                                'M14,6 L14,22 M8,16 L14,22 L20,16'
            } stroke="#009ACE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* Instruction hint bar — bottom center */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: '8px',
        fontSize: '12px', fontWeight: 500,
        color: isComplete ? '#16A34A' : '#009ACE',
        backgroundColor: isComplete ? 'rgba(22,163,74,0.06)' : 'rgba(0,154,206,0.06)',
        padding: '6px 18px', borderRadius: '14px', whiteSpace: 'nowrap',
        border: `1px solid ${isComplete ? 'rgba(22,163,74,0.15)' : 'rgba(0,154,206,0.12)'}`,
        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
        animation: 'surface-hint-slide 3s ease-in-out infinite',
        transition: 'color 0.3s, background-color 0.3s, border-color 0.3s',
      }}>
        {/* Pulsing dot indicator */}
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          backgroundColor: isComplete ? '#16A34A' : isScanning ? '#009ACE' : 'rgba(0,154,206,0.4)',
          animation: isScanning ? 'surface-pulse 1.2s ease-in-out infinite' : undefined,
        }} />
        {hint}
      </div>

      {/* Scan complete overlay */}
      {isComplete && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
          <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
            <circle cx="44" cy="44" r="40" fill="rgba(22,163,74,0.1)" stroke="#16A34A" strokeWidth="2" />
            <polyline points="24,44 37,57 64,31" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCAN INDICATOR — standalone mode showing where the user needs to move
// ════════════════════════════════════════════════════════════════════════════

const INDICATOR_KF = `
  @keyframes ind-ping  { 0%{transform:translate(-50%,-50%) scale(1);opacity:0.7} 100%{transform:translate(-50%,-50%) scale(2.8);opacity:0} }
  @keyframes ind-pulse { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.15)} }
  @keyframes ind-arrow-bounce {
    0%,100%{transform:var(--ind-base)} 50%{transform:var(--ind-bounce)}
  }
  @keyframes ind-stage-enter { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
  @keyframes ind-rotate-hint { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(12deg)} 75%{transform:rotate(-12deg)} }
`;

function stageInstruction(stage: ScanStage, dir: GuidanceDirection | null, cov: number): { text: string; sub: string; isRotate: boolean } {
  if (cov < 0.03) return { text: 'Begin scanning', sub: 'Hover over the model to start', isRotate: false };

  if (stage === 'occlusal') {
    if (!dir) return { text: 'Scanning occlusal', sub: 'Scan the top surface evenly', isRotate: false };
    if (dir === 'left' || dir === 'rotate-left') return { text: 'Scan left side', sub: 'Move scanner toward the left', isRotate: false };
    if (dir === 'right' || dir === 'rotate-right') return { text: 'Scan right side', sub: 'Move scanner toward the right', isRotate: false };
    if (dir === 'up') return { text: 'Scan upper area', sub: 'Move scanner upward', isRotate: false };
    if (dir === 'down') return { text: 'Scan lower area', sub: 'Move scanner downward', isRotate: false };
    return { text: 'Continue scanning', sub: 'Cover the remaining occlusal area', isRotate: false };
  }

  if (stage === 'buccal') {
    if (!dir || dir === 'rotate-left') return { text: 'Now scan buccal', sub: 'Rotate the scanner to see the outer side', isRotate: true };
    return { text: 'Scanning buccal', sub: 'Continue scanning the outer surface', isRotate: false };
  }

  if (stage === 'lingual') {
    if (!dir || dir === 'rotate-right') return { text: 'Now scan lingual', sub: 'Rotate to the inner side of the arch', isRotate: true };
    return { text: 'Scanning lingual', sub: 'Continue scanning the inner surface', isRotate: false };
  }

  return { text: 'Continue scanning', sub: '', isRotate: false };
}

function dirArrowPath(dir: GuidanceDirection): string {
  switch (dir) {
    case 'left':  case 'rotate-left':  return 'M20,12 L6,12 M11,7 L6,12 L11,17';
    case 'right': case 'rotate-right': return 'M4,12 L18,12 M13,7 L18,12 L13,17';
    case 'up':    return 'M12,20 L12,6 M7,11 L12,6 L17,11';
    case 'down':  return 'M12,4 L12,18 M7,13 L12,18 L17,13';
  }
}

function dirArrowPlacement(dir: GuidanceDirection): React.CSSProperties & Record<string, string> {
  const base: React.CSSProperties = { position: 'absolute', animation: 'ind-arrow-bounce 1.2s ease-in-out infinite' };
  switch (dir) {
    case 'left': case 'rotate-left':
      return { ...base, right: '100%', top: '50%', marginRight: 8, marginTop: -12,
        ['--ind-base' as string]: 'translateX(0)', ['--ind-bounce' as string]: 'translateX(-8px)' };
    case 'right': case 'rotate-right':
      return { ...base, left: '100%', top: '50%', marginLeft: 8, marginTop: -12,
        ['--ind-base' as string]: 'translateX(0)', ['--ind-bounce' as string]: 'translateX(8px)' };
    case 'up':
      return { ...base, left: '50%', bottom: '100%', marginBottom: 8, marginLeft: -12,
        ['--ind-base' as string]: 'translateY(0)', ['--ind-bounce' as string]: 'translateY(-8px)' };
    case 'down':
      return { ...base, left: '50%', top: '100%', marginTop: 8, marginLeft: -12,
        ['--ind-base' as string]: 'translateY(0)', ['--ind-bounce' as string]: 'translateY(8px)' };
  }
}

function ScanIndicatorOverlay({ guidance, containerSize, pointerNDC, flashActive }: {
  guidance: GuidanceState;
  containerSize: { width: number; height: number };
  pointerNDC: { x: number; y: number };
  flashActive: boolean;
}) {
  const pct = Math.round(guidance.coveragePercent * 100);
  const { width: cw, height: ch } = containerSize;
  const dir = guidance.direction;
  const tp = guidance.targetScreenPos;
  const wr = guidance.weakestRegion;
  const isComplete = guidance.phase === 'complete';
  const isScanning = guidance.phase === 'scanning';
  const stage = guidance.stage;

  // Scan frame position (follows cursor)
  const ox = pointerNDC.x * 8;
  const oy = pointerNDC.y * -6;
  const frameBorder = flashActive ? '#16A34A' : isScanning ? 'rgba(0,154,206,0.6)' : 'rgba(0,154,206,0.3)';
  const frameGlow = flashActive
    ? '0 0 24px 8px rgba(22,163,74,0.4), inset 0 0 12px 2px rgba(22,163,74,0.15)'
    : isScanning
    ? '0 0 16px 4px rgba(0,154,206,0.15), inset 0 0 8px 2px rgba(0,154,206,0.05)'
    : 'none';

  const hasTarget = !!dir && !!tp && !!wr && !isComplete && cw > 0 && guidance.coveragePercent >= 0.03;

  // Clamp target position to stay within the model's visible area (center 70% of viewport)
  const padX = cw * 0.15;
  const padY = ch * 0.12;
  const tx = tp ? Math.max(padX, Math.min(cw - padX, tp.x * cw)) : cw / 2;
  const ty = tp ? Math.max(padY + 40, Math.min(ch - padY - 60, tp.y * ch)) : ch / 2;
  const regionCov = wr ? Math.round(wr.coverage * 100) : 0;

  const { text: stageText, sub: stageSub, isRotate } = stageInstruction(stage, dir, guidance.coveragePercent);

  // Label goes below marker but clamp so it doesn't go offscreen
  const labelTop = Math.min(ty + 32, ch - 60);
  const labelLeft = Math.max(60, Math.min(cw - 60, tx));

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', fontFamily: font.family }}>
      <style>{KF + INDICATOR_KF}</style>
      <TopBar guidance={guidance} pct={pct} />

      {/* Scan frame — always visible, follows cursor */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 'clamp(220px, 20vw, 300px)', height: 'clamp(340px, 32vw, 450px)',
        transform: `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`,
        pointerEvents: 'none',
        border: `3px solid ${frameBorder}`,
        borderRadius: '14px',
        boxShadow: frameGlow,
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease',
      }} />

      {/* Idle — pre-scan hint centered on model */}
      {guidance.coveragePercent < 0.03 && !isComplete && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px',
        }}>
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" opacity="0.45">
            <circle cx="26" cy="26" r="22" stroke="#009ACE" strokeWidth="1.5" strokeDasharray="6 4" />
            <path d="M26 14v12" stroke="#009ACE" strokeWidth="2" strokeLinecap="round" />
            <circle cx="26" cy="32" r="1.5" fill="#009ACE" />
          </svg>
          <div style={{
            fontSize: '13px', fontWeight: 500, color: '#94A3B8',
            backgroundColor: 'rgba(255,255,255,0.92)', padding: '6px 18px',
            borderRadius: '12px', border: `1px solid ${color.borderDefault}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            Hover over the model to start scanning
          </div>
        </div>
      )}

      {/* Target marker — positioned on the model's weak area */}
      {hasTarget && dir && (
        <>
          {/* Outer soft glow halo */}
          <div style={{
            position: 'absolute', left: tx, top: ty,
            width: 48, height: 48, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,154,206,0.12) 0%, transparent 70%)',
            transform: 'translate(-50%,-50%)',
            animation: 'ind-pulse 2s ease-in-out infinite',
          }} />

          {/* Main target ring */}
          <div style={{
            position: 'absolute', left: tx, top: ty,
            width: 32, height: 32, borderRadius: '50%',
            border: '2px solid rgba(0,154,206,0.55)',
            backgroundColor: 'rgba(0,154,206,0.06)',
            transform: 'translate(-50%,-50%)',
            animation: 'ind-pulse 1.8s ease-in-out infinite',
          }}>
            {/* Center dot */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 8, height: 8, borderRadius: '50%',
              backgroundColor: 'rgba(0,154,206,0.55)',
              transform: 'translate(-50%,-50%)',
            }} />

            {/* Expanding ping */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 32, height: 32, borderRadius: '50%',
              border: '1.5px solid rgba(0,154,206,0.35)',
              animation: 'ind-ping 2.2s ease-out infinite',
            }} />

            {/* Directional arrow */}
            <div style={dirArrowPlacement(dir) as React.CSSProperties}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d={dirArrowPath(dir)} stroke="rgba(0,154,206,0.65)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Coverage chip near marker */}
          <div style={{
            position: 'absolute',
            left: labelLeft, top: labelTop,
            transform: 'translateX(-50%)',
            fontSize: '10px', fontWeight: 600,
            color: '#009ACE', opacity: 0.8,
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '2px 8px',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(0,154,206,0.12)',
          }}>
            {regionCov}% covered
          </div>
        </>
      )}

      {/* Stage instruction bar — bottom center, shows current phase + what to do */}
      {!isComplete && guidance.coveragePercent >= 0.03 && (
        <div style={{
          position: 'absolute', bottom: 56, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: '10px',
          backgroundColor: 'rgba(255,255,255,0.94)',
          padding: '8px 20px',
          borderRadius: '14px',
          border: `1px solid ${hasTarget ? 'rgba(0,154,206,0.12)' : 'rgba(22,163,74,0.15)'}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          animation: 'ind-stage-enter 0.3s ease-out',
          whiteSpace: 'nowrap',
        }}>
          {/* Rotate hint icon */}
          {isRotate && (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
              style={{ animation: 'ind-rotate-hint 2s ease-in-out infinite', flexShrink: 0 }}>
              <path d="M14 4C8 2 3 6 3 10" stroke="#009ACE" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M3 10L1 7M3 10L6 8" stroke="#009ACE" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}

          {/* Status dot */}
          {!isRotate && (
            <div style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              backgroundColor: hasTarget ? '#009ACE' : '#16A34A',
              animation: isScanning ? 'pulse-dot 1.2s infinite' : undefined,
            }} />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{
              fontSize: '12px', fontWeight: 600,
              color: hasTarget ? '#009ACE' : '#16A34A',
            }}>
              {hasTarget ? stageText : 'Coverage balanced'}
            </span>
            {stageSub && hasTarget && (
              <span style={{ fontSize: '10px', fontWeight: 400, color: '#94A3B8' }}>
                {stageSub}
              </span>
            )}
          </div>

        </div>
      )}

      {/* Scan complete */}
      {isComplete && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
        }}>
          <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
            <circle cx="44" cy="44" r="40" fill="rgba(22,163,74,0.1)" stroke="#16A34A" strokeWidth="2" />
            <polyline points="24,44 37,57 64,31" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{
            fontSize: '13px', fontWeight: 600, color: '#16A34A',
            backgroundColor: 'rgba(255,255,255,0.92)', padding: '5px 16px',
            borderRadius: '12px', border: '1px solid rgba(22,163,74,0.15)',
          }}>
            Scan complete
          </div>
        </div>
      )}

      {/* Mode label */}
      <div style={{
        position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        fontSize: '11px', fontWeight: 600, color: '#009ACE',
        backgroundColor: 'rgba(255,255,255,0.92)', padding: '3px 14px',
        borderRadius: '10px', whiteSpace: 'nowrap',
        border: '1px solid rgba(0,154,206,0.1)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        Scan Indicator
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCAN WAND — wand silhouette replacing frame, same 6DoF arrows as DofFrame
// ════════════════════════════════════════════════════════════════════════════

const WAND_KF = `
  @keyframes wand-slide-lr  { 0%{transform:translate(-50%,-50%) translateX(-20px)} 50%{transform:translate(-50%,-50%) translateX(20px)} 100%{transform:translate(-50%,-50%) translateX(-20px)} }
  @keyframes wand-slide-ud  { 0%{transform:translate(-50%,-50%) translateY(-16px)} 50%{transform:translate(-50%,-50%) translateY(16px)} 100%{transform:translate(-50%,-50%) translateY(-16px)} }
  @keyframes wand-scale-fb  { 0%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) scale(0.88)} 50%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) scale(1.12)} 100%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) scale(0.88)} }
  @keyframes wand-roll      { 0%{transform:translate(-50%,-29.3%) rotate(0deg)} 100%{transform:translate(-50%,-29.3%) rotate(360deg)} }
  @keyframes wand-pitch     { 0%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) perspective(400px) rotateX(-14deg)} 50%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) perspective(400px) rotateX(14deg)} 100%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) perspective(400px) rotateX(-14deg)} }
  @keyframes wand-yaw       { 0%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) perspective(400px) rotateY(-16deg)} 50%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) perspective(400px) rotateY(16deg)} 100%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) perspective(400px) rotateY(-16deg)} }
`;

function WandSilhouette({ strokeColor, opacity, dashed }: { strokeColor: string; opacity: number; dashed?: boolean }) {
  const dash = dashed ? '8 5' : undefined;
  return (
    <svg width="100%" height="100%" viewBox="0 0 251 561" fill="none" preserveAspectRatio="xMidYMid meet" style={{ opacity }}>
      <path
        d="M249.361 560.044L232.599 25.1221C232.185 11.8815 221.331 1.36279 208.084 1.36279H53.8173C40.7683 1.36279 30.0037 11.5798 29.3232 24.6111L1.36084 560.044"
        stroke={strokeColor} strokeWidth="2.72527" strokeDasharray={dash}
      />
      <rect x="49.7235" y="30.7254" width="163.516" height="267.077" stroke={strokeColor} strokeWidth="2.72527" strokeDasharray={dash} />
    </svg>
  );
}

const WAND_LABELS: Record<string, string> = {
  'wand-lr': 'Left / Right', 'wand-ud': 'Up / Down', 'wand-fb': 'Forward / Back',
  'wand-roll': 'Roll', 'wand-pitch': 'Pitch', 'wand-yaw': 'Yaw',
};

// Center of the wand's screen rectangle as % of the full wand container
// rect: x=49.7235 y=30.7254 w=163.516 h=267.077  viewBox: 0 0 251 561
const WRECT_CX = '52.4%';  // (49.7235 + 163.516/2) / 251
const WRECT_CY = '29.3%';  // (30.7254 + 267.077/2) / 561

/** Wand wrapper — positioned so the wand's screen rectangle center aligns with viewport center */
function WandFrame({ mode, flashActive, children, anim }: {
  mode: string; flashActive: boolean; children?: React.ReactNode; anim?: string;
}) {
  const bc = flashActive ? '#16A34A' : 'rgba(0,154,206,0.55)';
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      width: 'clamp(140px, 14vw, 200px)', height: 'clamp(310px, 31vw, 450px)',
      transform: 'translate(-50%,-29.3%)', pointerEvents: 'none',
      animation: anim,
    }}>
      <WandSilhouette strokeColor={bc} opacity={1} />
      {/* Mode label */}
      <div style={{
        position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)',
        fontSize: '11px', fontWeight: 600, color: '#009ACE',
        backgroundColor: 'rgba(255,255,255,0.92)', padding: '3px 12px',
        borderRadius: '10px', whiteSpace: 'nowrap',
        border: `1px solid ${color.borderDefault}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        {WAND_LABELS[mode] ?? mode}
      </div>
      {children}
    </div>
  );
}

function WandLR({ g, f }: { g: GuidanceState; f: boolean }) {
  const pct = Math.round(g.coveragePercent * 100);
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',fontFamily:font.family }}>
      <style>{KF+DOF_KF+WAND_KF}</style><TopBar guidance={g} pct={pct}/>
      <WandFrame mode="wand-lr" flashActive={f}>
        <div style={{ position:'absolute',left:-64,top:WRECT_CY,transform:'translateY(-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowH dir="left"/></div>
        <div style={{ position:'absolute',right:-64,top:WRECT_CY,transform:'translateY(-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowH dir="right"/></div>
        <div style={{ position:'absolute',top:WRECT_CY,left:WRECT_CX,width:10,height:10,borderRadius:'50%',background:'linear-gradient(135deg,#40B8DB,#007A9E)',boxShadow:'0 1px 4px rgba(0,120,160,0.4)',animation:'wand-slide-lr 2.5s ease-in-out infinite' }}/>
      </WandFrame>
    </div>
  );
}

function WandUD({ g, f }: { g: GuidanceState; f: boolean }) {
  const pct = Math.round(g.coveragePercent * 100);
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',fontFamily:font.family }}>
      <style>{KF+DOF_KF+WAND_KF}</style><TopBar guidance={g} pct={pct}/>
      <WandFrame mode="wand-ud" flashActive={f}>
        <div style={{ position:'absolute',top:-64,left:WRECT_CX,transform:'translateX(-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowV dir="up"/></div>
        <div style={{ position:'absolute',bottom:-64,left:WRECT_CX,transform:'translateX(-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowV dir="down"/></div>
        <div style={{ position:'absolute',top:WRECT_CY,left:WRECT_CX,width:10,height:10,borderRadius:'50%',background:'linear-gradient(135deg,#40B8DB,#007A9E)',boxShadow:'0 1px 4px rgba(0,120,160,0.4)',animation:'wand-slide-ud 2.5s ease-in-out infinite' }}/>
      </WandFrame>
    </div>
  );
}

function WandFB({ g, f }: { g: GuidanceState; f: boolean }) {
  const pct = Math.round(g.coveragePercent * 100);
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',fontFamily:font.family }}>
      <style>{KF+DOF_KF+WAND_KF}</style><TopBar guidance={g} pct={pct}/>
      <WandFrame mode="wand-fb" flashActive={f} anim="wand-scale-fb 3s ease-in-out infinite">
        <div style={{ position:'absolute',top:WRECT_CY,left:WRECT_CX,transform:'translate(-50%,-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowDepth s={68}/></div>
      </WandFrame>
    </div>
  );
}

function WandRoll({ g, f }: { g: GuidanceState; f: boolean }) {
  const pct = Math.round(g.coveragePercent * 100);
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',fontFamily:font.family }}>
      <style>{KF+DOF_KF+WAND_KF}</style><TopBar guidance={g} pct={pct}/>
      <WandFrame mode="wand-roll" flashActive={f}>
        <div style={{ position:'absolute',top:-68,left:WRECT_CX,transform:'translateX(-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowCurve s={110}/></div>
        <div style={{ position:'absolute',top:WRECT_CY,left:WRECT_CX,width:70,height:70,animation:'wand-roll 4s linear infinite' }}>
          <svg width="70" height="70" viewBox="0 0 70 70" fill="none" style={{ filter:BF }}>
            <BlueDefs/><circle cx="35" cy="35" r="28" stroke="url(#gb-d)" strokeWidth="2" opacity="0.25" fill="none"/>
            <line x1="35" y1="7" x2="35" y2="20" stroke="url(#gb-v)" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="35" y1="50" x2="35" y2="63" stroke="url(#gb-v)" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="7" y1="35" x2="20" y2="35" stroke="url(#gb-h)" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="50" y1="35" x2="63" y2="35" stroke="url(#gb-h)" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="35" cy="35" r="3" fill="url(#gb-r)"/>
          </svg>
        </div>
      </WandFrame>
    </div>
  );
}

function WandPitch({ g, f }: { g: GuidanceState; f: boolean }) {
  const pct = Math.round(g.coveragePercent * 100);
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',fontFamily:font.family }}>
      <style>{KF+DOF_KF+WAND_KF}</style><TopBar guidance={g} pct={pct}/>
      <WandFrame mode="wand-pitch" flashActive={f} anim="wand-pitch 3s ease-in-out infinite">
        <div style={{ position:'absolute',right:-68,top:WRECT_CY,transform:'translateY(-50%) rotate(90deg)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowCurve s={100}/></div>
        <div style={{ position:'absolute',left:-68,top:WRECT_CY,transform:'translateY(-50%) rotate(-90deg) scaleX(-1)',animation:'dof-breathe 2s ease-in-out infinite',animationDelay:'1s',opacity:0.35 }}><ArrowCurve s={80}/></div>
      </WandFrame>
    </div>
  );
}

function WandYaw({ g, f }: { g: GuidanceState; f: boolean }) {
  const pct = Math.round(g.coveragePercent * 100);
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',fontFamily:font.family }}>
      <style>{KF+DOF_KF+WAND_KF}</style><TopBar guidance={g} pct={pct}/>
      <WandFrame mode="wand-yaw" flashActive={f} anim="wand-yaw 3s ease-in-out infinite">
        <div style={{ position:'absolute',top:-68,left:WRECT_CX,transform:'translateX(-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowCurve s={120}/></div>
        <div style={{ position:'absolute',bottom:-68,left:WRECT_CX,transform:'translateX(-50%) scaleY(-1)',animation:'dof-breathe 2s ease-in-out infinite',animationDelay:'1s',opacity:0.35 }}><ArrowCurve s={100}/></div>
      </WandFrame>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// GHOST SCAN WAND — center rect of wand (stationary) + ghost rect + 6DoF arrows
// ════════════════════════════════════════════════════════════════════════════

const GWAND_KF = `
  @keyframes gwand-float-lr    { 0%{transform:translate(calc(-50% + 34px),-29.3%)} 50%{transform:translate(calc(-50% - 34px),-29.3%)} 100%{transform:translate(calc(-50% + 34px),-29.3%)} }
  @keyframes gwand-float-ud    { 0%{transform:translate(-50%,calc(-29.3% + 26px))} 50%{transform:translate(-50%,calc(-29.3% - 26px))} 100%{transform:translate(-50%,calc(-29.3% + 26px))} }
  @keyframes gwand-float-fb    { 0%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) scale(0.85)} 50%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) scale(1.15)} 100%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) scale(0.85)} }
  @keyframes gwand-float-roll  { 0%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) rotate(-10deg)} 50%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) rotate(10deg)} 100%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) rotate(-10deg)} }
  @keyframes gwand-float-pitch { 0%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) perspective(400px) rotateX(-14deg)} 50%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) perspective(400px) rotateX(14deg)} 100%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) perspective(400px) rotateX(-14deg)} }
  @keyframes gwand-float-yaw   { 0%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) perspective(400px) rotateY(-16deg)} 50%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) perspective(400px) rotateY(16deg)} 100%{transform-origin:52.4% 29.3%;transform:translate(-50%,-29.3%) perspective(400px) rotateY(-16deg)} }
`;

const GWAND_ANIM: Record<string, string> = {
  'gwand-lr':    'gwand-float-lr 2.8s ease-in-out infinite',
  'gwand-ud':    'gwand-float-ud 2.8s ease-in-out infinite',
  'gwand-fb':    'gwand-float-fb 3.2s ease-in-out infinite',
  'gwand-roll':  'gwand-float-roll 3s ease-in-out infinite',
  'gwand-pitch': 'gwand-float-pitch 3s ease-in-out infinite',
  'gwand-yaw':   'gwand-float-yaw 3s ease-in-out infinite',
  'bgwand-lr':   'gwand-float-lr 2.8s ease-in-out infinite',
  'bgwand-ud':   'gwand-float-ud 2.8s ease-in-out infinite',
  'bgwand-fb':   'gwand-float-fb 3.2s ease-in-out infinite',
  'bgwand-roll': 'gwand-float-roll 3s ease-in-out infinite',
  'bgwand-pitch':'gwand-float-pitch 3s ease-in-out infinite',
  'bgwand-yaw':  'gwand-float-yaw 3s ease-in-out infinite',
  'fgwand-lr':   'gwand-float-lr 2.8s ease-in-out infinite',
  'fgwand-ud':   'gwand-float-ud 2.8s ease-in-out infinite',
  'fgwand-fb':   'gwand-float-fb 3.2s ease-in-out infinite',
  'fgwand-roll': 'gwand-float-roll 3s ease-in-out infinite',
  'fgwand-pitch':'gwand-float-pitch 3s ease-in-out infinite',
  'fgwand-yaw':  'gwand-float-yaw 3s ease-in-out infinite',
  'fagwand-lr':  'gwand-float-lr 2.8s ease-in-out infinite',
  'fagwand-ud':  'gwand-float-ud 2.8s ease-in-out infinite',
  'fagwand-fb':  'gwand-float-fb 3.2s ease-in-out infinite',
  'fagwand-roll':'gwand-float-roll 3s ease-in-out infinite',
  'fagwand-pitch':'gwand-float-pitch 3s ease-in-out infinite',
  'fagwand-yaw': 'gwand-float-yaw 3s ease-in-out infinite',
  'rot-cw':  'gwand-float-roll 3s ease-in-out infinite',
  'rot-ccw': 'gwand-float-roll 3s ease-in-out infinite',
  'rot-tilt':'gwand-float-pitch 3s ease-in-out infinite',
};

const GWAND_LABELS: Record<string, string> = {
  'gwand-lr': 'Left / Right', 'gwand-ud': 'Up / Down', 'gwand-fb': 'Forward / Back',
  'gwand-roll': 'Roll', 'gwand-pitch': 'Pitch', 'gwand-yaw': 'Yaw',
  'bgwand-lr': 'Left / Right', 'bgwand-ud': 'Up / Down', 'bgwand-fb': 'Forward / Back',
  'bgwand-roll': 'Roll', 'bgwand-pitch': 'Pitch', 'bgwand-yaw': 'Yaw',
  'fgwand-lr': 'Left / Right', 'fgwand-ud': 'Up / Down', 'fgwand-fb': 'Forward / Back',
  'fgwand-roll': 'Roll', 'fgwand-pitch': 'Pitch', 'fgwand-yaw': 'Yaw',
  'fagwand-lr': 'Left / Right', 'fagwand-ud': 'Up / Down', 'fagwand-fb': 'Forward / Back',
  'fagwand-roll': 'Roll', 'fagwand-pitch': 'Pitch', 'fagwand-yaw': 'Yaw',
  'rot-cw': 'Rotate CW', 'rot-ccw': 'Rotate CCW', 'rot-tilt': 'Tilt',
};

/** Just the center rectangle from the wand SVG — same viewBox so it aligns perfectly with the full wand */
function WandScreenRect({ strokeColor, opacity, dashed }: { strokeColor: string; opacity: number; dashed?: boolean }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 251 561" fill="none" preserveAspectRatio="xMidYMid meet" style={{ opacity }}>
      <rect
        x="49.7235" y="30.7254" width="163.516" height="267.077"
        stroke={strokeColor} strokeWidth="2.72527"
        strokeDasharray={dashed ? '8 5' : undefined}
        fill="none"
      />
    </svg>
  );
}

/** Arrows placed around the stationary wand — positioned at the wand rect center */
function GWandArrows({ mode }: { mode: string }) {
  // Rotation modes — show circular rotation arrows + spinning ring
  if (mode === 'rot-cw' || mode === 'rot-ccw' || mode === 'rot-tilt') {
    const isTilt = mode === 'rot-tilt';
    const isCCW = mode === 'rot-ccw';
    return (
      <>
        {/* Circular rotation arrow */}
        <div style={{
          position:'absolute', top:WRECT_CY, left:WRECT_CX,
          width: 140, height: 140,
          transform: `translate(-50%,-50%)${isCCW ? ' scaleX(-1)' : ''}`,
          animation: 'dof-breathe 2s ease-in-out infinite',
        }}>
          <svg width="140" height="140" viewBox="0 0 140 140" fill="none" style={{ filter: BF }}>
            <BlueDefs/>
            {/* 270° arc */}
            <path
              d="M70 10 A 60 60 0 1 1 10 70"
              stroke="url(#gb-d)" strokeWidth="3.5" fill="none" strokeLinecap="round"
              strokeDasharray={isTilt ? '8 6' : 'none'}
            />
            {/* Arrowhead at end of arc */}
            <polygon points="10,70 20,58 4,58" fill="url(#gb-d)" />
            {/* Small starting dot */}
            <circle cx="70" cy="10" r="4" fill="url(#gb-r)" />
          </svg>
        </div>

        {/* Center crosshair ring */}
        <div style={{
          position:'absolute', top:WRECT_CY, left:WRECT_CX,
          width:50, height:50,
          animation: isTilt ? undefined : `wand-roll 4s linear infinite${isCCW ? ' reverse' : ''}`,
        }}>
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" style={{ filter: BF }}>
            <BlueDefs/>
            <circle cx="25" cy="25" r="20" stroke="url(#gb-d)" strokeWidth="1.5" opacity="0.25" fill="none"/>
            <line x1="25" y1="5" x2="25" y2="15" stroke="url(#gb-v)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="25" y1="35" x2="25" y2="45" stroke="url(#gb-v)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="5" y1="25" x2="15" y2="25" stroke="url(#gb-h)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="35" y1="25" x2="45" y2="25" stroke="url(#gb-h)" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="25" cy="25" r="3" fill="url(#gb-r)"/>
          </svg>
        </div>
      </>
    );
  }

  const variant = mode.replace(/^(?:g|bg|fg|fag)wand-/, '');
  if (variant === 'lr') return (
    <>
      <div style={{ position:'absolute',left:-64,top:WRECT_CY,transform:'translateY(-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowH dir="left"/></div>
      <div style={{ position:'absolute',right:-64,top:WRECT_CY,transform:'translateY(-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowH dir="right"/></div>
    </>
  );
  if (variant === 'ud') return (
    <>
      <div style={{ position:'absolute',top:-64,left:WRECT_CX,transform:'translateX(-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowV dir="up"/></div>
      <div style={{ position:'absolute',bottom:-64,left:WRECT_CX,transform:'translateX(-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowV dir="down"/></div>
    </>
  );
  if (variant === 'fb') return (
    <div style={{ position:'absolute',top:WRECT_CY,left:WRECT_CX,transform:'translate(-50%,-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowDepth s={68}/></div>
  );
  if (variant === 'roll') return (
    <>
      <div style={{ position:'absolute',top:-68,left:WRECT_CX,transform:'translateX(-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowCurve s={110}/></div>
      <div style={{ position:'absolute',top:WRECT_CY,left:WRECT_CX,width:70,height:70,animation:'wand-roll 4s linear infinite' }}>
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" style={{ filter:BF }}>
          <BlueDefs/><circle cx="35" cy="35" r="28" stroke="url(#gb-d)" strokeWidth="2" opacity="0.25" fill="none"/>
          <line x1="35" y1="7" x2="35" y2="20" stroke="url(#gb-v)" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="35" y1="50" x2="35" y2="63" stroke="url(#gb-v)" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="7" y1="35" x2="20" y2="35" stroke="url(#gb-h)" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="50" y1="35" x2="63" y2="35" stroke="url(#gb-h)" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="35" cy="35" r="3" fill="url(#gb-r)"/>
        </svg>
      </div>
    </>
  );
  if (variant === 'pitch') return (
    <>
      <div style={{ position:'absolute',right:-68,top:WRECT_CY,transform:'translateY(-50%) rotate(90deg)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowCurve s={100}/></div>
      <div style={{ position:'absolute',left:-68,top:WRECT_CY,transform:'translateY(-50%) rotate(-90deg) scaleX(-1)',animation:'dof-breathe 2s ease-in-out infinite',animationDelay:'1s',opacity:0.35 }}><ArrowCurve s={80}/></div>
    </>
  );
  if (variant === 'yaw') return (
    <>
      <div style={{ position:'absolute',top:-68,left:WRECT_CX,transform:'translateX(-50%)',animation:'dof-breathe 2s ease-in-out infinite' }}><ArrowCurve s={120}/></div>
      <div style={{ position:'absolute',bottom:-68,left:WRECT_CX,transform:'translateX(-50%) scaleY(-1)',animation:'dof-breathe 2s ease-in-out infinite',animationDelay:'1s',opacity:0.35 }}><ArrowCurve s={100}/></div>
    </>
  );
  return null;
}

function GhostWandOverlay({ mode, g, f, showArrows = true, ghostFull = false }: { mode: string; g: GuidanceState; f: boolean; showArrows?: boolean; ghostFull?: boolean }) {
  const pct = Math.round(g.coveragePercent * 100);
  const isScanning = g.phase === 'scanning';
  const ghostAnim = GWAND_ANIM[mode] ?? 'none';

  const wandColor = f ? '#16A34A' : isScanning ? 'rgba(0,154,206,0.7)' : 'rgba(0,154,206,0.55)';

  const wandW = 'clamp(140px, 14vw, 200px)';
  const wandH = 'clamp(310px, 31vw, 450px)';

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', fontFamily: font.family }}>
      <style>{KF + DOF_KF + WAND_KF + GWAND_KF}</style>
      <TopBar guidance={g} pct={pct} />

      {/* Ghost — full wand or just the center rect */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: wandW, height: wandH,
        pointerEvents: 'none',
        animation: ghostAnim,
      }}>
        {ghostFull
          ? <WandSilhouette strokeColor="rgba(0,154,206,0.25)" opacity={1} dashed />
          : <WandScreenRect strokeColor="rgba(0,154,206,0.25)" opacity={1} dashed />
        }
        <div style={{
          position: 'absolute', bottom: ghostFull ? -30 : -22, left: '50%', transform: 'translateX(-50%)',
          fontSize: '10px', fontWeight: 600, color: '#009ACE', opacity: 0.7,
          backgroundColor: 'rgba(255,255,255,0.88)', padding: '2px 10px',
          borderRadius: '8px', whiteSpace: 'nowrap',
          border: '1px solid rgba(0,154,206,0.12)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          scan here
        </div>
      </div>

      {/* Stationary full wand silhouette + arrows */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: wandW, height: wandH,
        transform: 'translate(-50%,-29.3%)',
        pointerEvents: 'none',
      }}>
        <WandSilhouette strokeColor={wandColor} opacity={1} />

        {/* Arrows */}
        {showArrows && <GWandArrows mode={mode} />}

        {/* Mode label */}
        <div style={{
          position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)',
          fontSize: '11px', fontWeight: 600, color: '#009ACE',
          backgroundColor: 'rgba(255,255,255,0.92)', padding: '3px 12px',
          borderRadius: '10px', whiteSpace: 'nowrap',
          border: `1px solid ${color.borderDefault}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          {GWAND_LABELS[mode] ?? mode}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ROTATION GUIDANCE — circular arrow overlays
// ════════════════════════════════════════════════════════════════════════════

const ROT_KF = `
  @keyframes rot-spin-cw  { 0%{transform:translate(-50%,-50%) rotate(0deg)}   100%{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes rot-spin-ccw { 0%{transform:translate(-50%,-50%) rotate(0deg)}   100%{transform:translate(-50%,-50%) rotate(-360deg)} }
  @keyframes rot-tilt-f   { 0%{transform:translate(-50%,-50%) perspective(500px) rotateX(-15deg)} 50%{transform:translate(-50%,-50%) perspective(500px) rotateX(15deg)} 100%{transform:translate(-50%,-50%) perspective(500px) rotateX(-15deg)} }
  @keyframes rot-arrow-pulse { 0%,100%{opacity:0.9} 50%{opacity:0.4} }
`;

const ROT_LABELS: Record<string, string> = {
  'rot-cw': 'Clockwise', 'rot-ccw': 'Counter-Clockwise', 'rot-tilt': 'Tilt',
};

function RotationOverlay({ mode, g, f }: { mode: string; g: GuidanceState; f: boolean }) {
  const pct = Math.round(g.coveragePercent * 100);
  const isCCW = mode === 'rot-ccw';
  const isTilt = mode === 'rot-tilt';

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', fontFamily: font.family }}>
      <style>{KF + DOF_KF + ROT_KF}</style>
      <TopBar guidance={g} pct={pct} />

      {/* Large circular rotation arrow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 220, height: 220,
        transform: `translate(-50%,-50%)${isCCW ? ' scaleX(-1)' : ''}`,
        animation: 'dof-breathe 2s ease-in-out infinite',
      }}>
        <svg width="220" height="220" viewBox="0 0 220 220" fill="none" style={{ filter: BF }}>
          <BlueDefs/>
          {/* 270° circular arc */}
          <path d="M110 15 A 95 95 0 1 1 15 110" stroke="url(#gb-d)" strokeWidth="4" fill="none" strokeLinecap="round"
            strokeDasharray={isTilt ? '10 7' : 'none'}
          />
          {/* Arrowhead */}
          <polygon points="15,110 28,96 6,96" fill="url(#gb-d)" />
          {/* Start dot */}
          <circle cx="110" cy="15" r="5" fill="url(#gb-r)" />
        </svg>
      </div>

      {/* Spinning crosshair in center */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 60, height: 60,
        animation: isTilt ? 'rot-tilt-f 3s ease-in-out infinite' : `rot-spin-cw 4s linear infinite${isCCW ? ' reverse' : ''}`,
      }}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style={{ filter: BF }}>
          <BlueDefs/>
          <circle cx="30" cy="30" r="24" stroke="url(#gb-d)" strokeWidth="1.5" opacity="0.2" fill="none"/>
          <line x1="30" y1="6" x2="30" y2="18" stroke="url(#gb-v)" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="30" y1="42" x2="30" y2="54" stroke="url(#gb-v)" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="6" y1="30" x2="18" y2="30" stroke="url(#gb-h)" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="42" y1="30" x2="54" y2="30" stroke="url(#gb-h)" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="30" cy="30" r="3.5" fill="url(#gb-r)"/>
        </svg>
      </div>

      {/* Mode label */}
      <div style={{
        position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
        fontSize: '11px', fontWeight: 600, color: '#009ACE',
        backgroundColor: 'rgba(255,255,255,0.92)', padding: '3px 12px',
        borderRadius: '10px', whiteSpace: 'nowrap',
        border: `1px solid ${color.borderDefault}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        {ROT_LABELS[mode] ?? mode}
      </div>
    </div>
  );
}

// ─── Main dispatcher ───────────────────────────────────────────────────────────

export default function GuidanceOverlay({ guidance, pointerNDC, flashActive, containerSize, mode }: GuidanceOverlayProps) {
  // Original scan modes
  if (mode === 'edge')  return <EdgeGuideOverlay guidance={guidance} pointerNDC={pointerNDC} flashActive={flashActive}/>;
  if (mode === 'dot')   return <SmartDotOverlay guidance={guidance} pointerNDC={pointerNDC} containerSize={containerSize} flashActive={flashActive}/>;
  if (mode === 'glow')  return <GlowFrameOverlay guidance={guidance} pointerNDC={pointerNDC} flashActive={flashActive}/>;

  // 6DoF + Frame
  if (mode === 'dof-lr')    return <DofLR g={guidance} f={flashActive}/>;
  if (mode === 'dof-ud')    return <DofUD g={guidance} f={flashActive}/>;
  if (mode === 'dof-fb')    return <DofFB g={guidance} f={flashActive}/>;
  if (mode === 'dof-roll')  return <DofRoll g={guidance} f={flashActive}/>;
  if (mode === 'dof-pitch') return <DofPitch g={guidance} f={flashActive}/>;
  if (mode === 'dof-yaw')   return <DofYaw g={guidance} f={flashActive}/>;

  // Arrows Only
  if (mode === 'bare-lr')    return <DofLR g={guidance} f={flashActive} bare/>;
  if (mode === 'bare-ud')    return <DofUD g={guidance} f={flashActive} bare/>;
  if (mode === 'bare-fb')    return <DofFB g={guidance} f={flashActive} bare/>;
  if (mode === 'bare-roll')  return <DofRoll g={guidance} f={flashActive} bare/>;
  if (mode === 'bare-pitch') return <DofPitch g={guidance} f={flashActive} bare/>;
  if (mode === 'bare-yaw')   return <DofYaw g={guidance} f={flashActive} bare/>;

  // Ring
  if (mode.startsWith('ring-')) return <RingOverlay mode={mode} g={guidance}/>;

  // Pulse — both directions for L/R and U/D
  if (mode === 'pulse-lr')    return <PulseOverlay mode={mode} g={guidance} f={flashActive} anim="pulse-drift-lr 2.8s ease-in-out infinite" lead="right"/>;
  if (mode === 'pulse-ud')    return <PulseOverlay mode={mode} g={guidance} f={flashActive} anim="pulse-drift-ud 2.8s ease-in-out infinite" lead="bottom"/>;
  if (mode === 'pulse-fb')    return <PulseOverlay mode={mode} g={guidance} f={flashActive} anim="pulse-breathe 3.2s ease-in-out infinite" lead="all"/>;
  if (mode === 'pulse-roll')  return <PulseOverlay mode={mode} g={guidance} f={flashActive} anim="pulse-roll-f 3s ease-in-out infinite" lead={null}/>;
  if (mode === 'pulse-pitch') return <PulseOverlay mode={mode} g={guidance} f={flashActive} anim="pulse-pitch-f 3s ease-in-out infinite" lead={null}/>;
  if (mode === 'pulse-yaw')   return <PulseOverlay mode={mode} g={guidance} f={flashActive} anim="pulse-yaw-f 3s ease-in-out infinite" lead={null}/>;

  // Gizmo
  if (mode === 'dof-gizmo') return <GizmoOverlay g={guidance}/>;

  // Ghost Wand (6DoF)
  if (mode.startsWith('ghost-')) return <GhostOverlay mode={mode} g={guidance} f={flashActive}/>;

  // Scan Wand (6DoF with wand silhouette)
  if (mode === 'wand-lr')    return <WandLR g={guidance} f={flashActive}/>;
  if (mode === 'wand-ud')    return <WandUD g={guidance} f={flashActive}/>;
  if (mode === 'wand-fb')    return <WandFB g={guidance} f={flashActive}/>;
  if (mode === 'wand-roll')  return <WandRoll g={guidance} f={flashActive}/>;
  if (mode === 'wand-pitch') return <WandPitch g={guidance} f={flashActive}/>;
  if (mode === 'wand-yaw')   return <WandYaw g={guidance} f={flashActive}/>;

  // Ghost Scan Wand (wand + ghost rect + arrows)
  if (mode.startsWith('gwand-')) return <GhostWandOverlay mode={mode} g={guidance} f={flashActive}/>;

  // Bare Ghost Wand (wand + ghost rect, no arrows)
  if (mode.startsWith('bgwand-')) return <GhostWandOverlay mode={mode} g={guidance} f={flashActive} showArrows={false}/>;

  // Full Ghost Wand (wand + full ghost wand silhouette, no arrows)
  if (mode.startsWith('fgwand-')) return <GhostWandOverlay mode={mode} g={guidance} f={flashActive} showArrows={false} ghostFull/>;

  // Full Ghost Wand + Arrows
  if (mode.startsWith('fagwand-')) return <GhostWandOverlay mode={mode} g={guidance} f={flashActive} showArrows ghostFull/>;

  // Scan Indicator
  // Rotation guidance — rendered with ghost wand silhouette + arrows
  if (mode.startsWith('rot-')) return <GhostWandOverlay mode={mode} g={guidance} f={flashActive} showArrows ghostFull/>;

  if (mode === 'scan-indicator') return <ScanIndicatorOverlay guidance={guidance} containerSize={containerSize} pointerNDC={pointerNDC} flashActive={flashActive}/>;

  // Surface Guide
  if (mode === 'surface-guide') return <SurfaceGuideOverlay guidance={guidance} containerSize={containerSize}/>;

  return <ClassicOverlay guidance={guidance} pointerNDC={pointerNDC} flashActive={flashActive}/>;
}
