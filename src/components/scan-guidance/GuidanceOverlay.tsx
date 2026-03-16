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
      <StagePill stage={guidance.stage} phase={guidance.phase} />
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
  const glow   = isDone ? 'rgba(22,163,74,0.25)' : 'rgba(231,76,60,0.18)';
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
            backgroundColor: isDone ? 'rgba(22,163,74,0.1)' : 'rgba(231,76,60,0.07)',
            boxShadow: `0 0 12px 2px ${isDone ? 'rgba(22,163,74,0.2)' : 'rgba(231,76,60,0.15)'}`,
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

// ─── Main dispatcher ───────────────────────────────────────────────────────────

export default function GuidanceOverlay({ guidance, pointerNDC, flashActive, containerSize, mode }: GuidanceOverlayProps) {
  if (mode === 'edge') {
    return <EdgeGuideOverlay guidance={guidance} pointerNDC={pointerNDC} flashActive={flashActive} />;
  }
  if (mode === 'dot') {
    return <SmartDotOverlay guidance={guidance} pointerNDC={pointerNDC} containerSize={containerSize} flashActive={flashActive} />;
  }
  if (mode === 'glow') {
    return <GlowFrameOverlay guidance={guidance} pointerNDC={pointerNDC} flashActive={flashActive} />;
  }
  return <ClassicOverlay guidance={guidance} pointerNDC={pointerNDC} flashActive={flashActive} />;
}
