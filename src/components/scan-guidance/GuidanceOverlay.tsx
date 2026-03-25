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
        <stop offset="0%" stopColor="#93C5FD"/><stop offset="50%" stopColor="#3B82F6"/><stop offset="100%" stopColor="#1D4ED8"/>
      </linearGradient>
      <linearGradient id="gb-v" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#93C5FD"/><stop offset="50%" stopColor="#3B82F6"/><stop offset="100%" stopColor="#1D4ED8"/>
      </linearGradient>
      <linearGradient id="gb-d" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#93C5FD"/><stop offset="100%" stopColor="#1E40AF"/>
      </linearGradient>
      <linearGradient id="gb-hl" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.4)"/><stop offset="100%" stopColor="rgba(255,255,255,0)"/>
      </linearGradient>
      <radialGradient id="gb-r" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#60A5FA"/><stop offset="100%" stopColor="#1E40AF"/>
      </radialGradient>
    </defs>
  );
}

const BF = 'drop-shadow(0 2px 6px rgba(30,64,175,0.3))';

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
      <svg width="260" height="260" viewBox="0 0 260 260" fill="none" style={{ filter: 'drop-shadow(0 2px 8px rgba(99,102,241,0.3))' }}>
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

function ModeLabel({ mode, c = '#3B82F6' }: { mode: string; c?: string }) {
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
  const bc = flashActive ? '#16A34A' : 'rgba(59,130,246,0.45)';
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
        <div style={{ position:'absolute',top:'50%',left:'50%',width:10,height:10,borderRadius:'50%',background:'linear-gradient(135deg,#60A5FA,#1D4ED8)',boxShadow:'0 1px 4px rgba(30,64,175,0.4)',animation:'dof-slide-lr 2.5s ease-in-out infinite' }}/>
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
        <div style={{ position:'absolute',top:'50%',left:'50%',width:10,height:10,borderRadius:'50%',background:'linear-gradient(135deg,#60A5FA,#1D4ED8)',boxShadow:'0 1px 4px rgba(30,64,175,0.4)',animation:'dof-slide-ud 2.5s ease-in-out infinite' }}/>
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
        border: bare ? 'none' : `3px solid ${f ? '#16A34A' : 'rgba(59,130,246,0.45)'}`,
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
        fontSize:'12px',fontWeight:600,color:'#6366F1',
        backgroundColor:'rgba(255,255,255,0.9)',padding:'4px 14px',
        borderRadius:'12px',whiteSpace:'nowrap',
        border:'1px solid rgba(99,102,241,0.2)',boxShadow:'0 2px 8px rgba(99,102,241,0.1)',
      }}>
        {MODE_LABEL[mode] ?? mode}
      </div>
    </div>
  );
}

// ─── Pulse overlays ──────────────────────────────────────────────────────────

const PT = '#0D9488';
const PTG = 'rgba(13,148,136,0.35)';

function PulseOverlay({ mode, g, f, anim, lead }: {
  mode: string; g: GuidanceState; f: boolean; anim: string;
  lead?: 'top'|'right'|'bottom'|'left'|'all'|null;
}) {
  const pct = Math.round(g.coveragePercent * 100);
  const bc = f ? '#16A34A' : PT;
  const ew = (e: string) => (lead === 'all' ? 3 : e === lead ? 4 : 2);
  const ec = (e: string) => (f ? '#16A34A' : lead === 'all' ? PT : e === lead ? PT : 'rgba(13,148,136,0.3)');
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
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none" style={{ filter:'drop-shadow(0 3px 8px rgba(30,64,175,0.18))' }}>
          <BlueDefs/>
          {/* X — L/R */}
          <g style={{ animation:'dof-gizmo-pulse 3s ease-in-out infinite' }}>
            <rect x="40" y="155" width="240" height="10" rx="5" fill="url(#gb-h)"/><rect x="40" y="155" width="240" height="5" rx="5" fill="url(#gb-hl)"/>
            <path d="M40 145L20 160L40 175Z" fill="url(#gb-h)"/><path d="M280 145L300 160L280 175Z" fill="url(#gb-h)"/>
            <text x="305" y="164" fill="#1D4ED8" fontSize="11" fontWeight="700" fontFamily="system-ui">X</text>
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
            <text x="240" y="78" fill="#DC2626" fontSize="11" fontWeight="700" fontFamily="system-ui">Z</text>
          </g>
          {/* Roll arc */}
          <g style={{ animation:'dof-gizmo-pulse 3s ease-in-out infinite',animationDelay:'1.5s' }}>
            <path d="M110 70A100 100 0 0 1 210 70" stroke="url(#gb-d)" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M210 70L200 60L203 75Z" fill="url(#gb-d)"/>
            <text x="160" y="56" fill="#2563EB" fontSize="9" fontWeight="600" fontFamily="system-ui" textAnchor="middle">Roll</text>
          </g>
          {/* Pitch arc */}
          <g style={{ animation:'dof-gizmo-pulse 3s ease-in-out infinite',animationDelay:'2s' }}>
            <path d="M252 110A100 100 0 0 1 252 210" stroke="url(#gb-d)" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M252 210L242 200L257 203Z" fill="url(#gb-d)"/>
            <text x="268" y="164" fill="#2563EB" fontSize="9" fontWeight="600" fontFamily="system-ui">Pitch</text>
          </g>
          {/* Yaw arc */}
          <g style={{ animation:'dof-gizmo-pulse 3s ease-in-out infinite',animationDelay:'2.5s' }}>
            <path d="M110 252A100 100 0 0 1 210 252" stroke="url(#gb-d)" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M210 252L200 243L203 257Z" fill="url(#gb-d)"/>
            <text x="160" y="272" fill="#2563EB" fontSize="9" fontWeight="600" fontFamily="system-ui" textAnchor="middle">Yaw</text>
          </g>
          <circle cx="160" cy="160" r="8" fill="url(#gb-r)"/><circle cx="158" cy="158" r="3" fill="rgba(255,255,255,0.4)"/>
        </svg>
        <div style={{ position:'absolute',bottom:-36,left:'50%',transform:'translateX(-50%)',fontSize:'12px',fontWeight:700,color:'#D97706',backgroundColor:'rgba(255,255,255,0.92)',padding:'4px 16px',borderRadius:'12px',whiteSpace:'nowrap',border:`1px solid ${color.borderDefault}`,boxShadow:'0 1px 4px rgba(0,0,0,0.08)' }}>
          6 Degrees of Freedom
        </div>
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

  return <ClassicOverlay guidance={guidance} pointerNDC={pointerNDC} flashActive={flashActive}/>;
}
