import { useRef, useState, useCallback, useEffect } from 'react';
import type { GuidanceState, ScanStage, FrameEdge, GuidanceDirection } from './types';

// ─── Demo Script ──────────────────────────────────────────────────────────────
// Each entry is a keyframe. Coverage and pointerNDC are interpolated between
// keyframes. Phase/stage/direction/activeEdge are step values (current keyframe).

interface KeyFrame {
  t: number;
  phase: GuidanceState['phase'];
  stage: ScanStage;
  coverage: number;
  direction: GuidanceDirection | null;
  activeEdge: FrameEdge;
  flash?: boolean;        // trigger green flash at this keyframe
}

const SCRIPT: KeyFrame[] = [
  // ── Idle — frame visible, nothing happening
  { t: 0.0,  phase: 'idle',     stage: 'occlusal', coverage: 0.00, direction: null,           activeEdge: null },

  // ── Start occlusal scan — frame sweeps left-right across bite surfaces
  { t: 1.0,  phase: 'scanning', stage: 'occlusal', coverage: 0.00, direction: null,           activeEdge: null },
  { t: 2.5,  phase: 'scanning', stage: 'occlusal', coverage: 0.20, direction: null,           activeEdge: 'left'  },  // right covered more → left glow
  { t: 3.8,  phase: 'scanning', stage: 'occlusal', coverage: 0.36, direction: null,           activeEdge: null    },  // balanced again

  // ── Pause — reached 40%, stage advances to buccal
  { t: 4.4,  phase: 'paused',   stage: 'buccal',   coverage: 0.41, direction: 'rotate-left',  activeEdge: 'left',  flash: true },

  // ── Left roll arrow visible — user rotates model
  { t: 5.8,  phase: 'scanning', stage: 'buccal',   coverage: 0.44, direction: null,           activeEdge: null },

  // ── Scanning buccal surface (model tilted left)
  { t: 7.6,  phase: 'scanning', stage: 'buccal',   coverage: 0.67, direction: null,           activeEdge: null },

  // ── Pause — reached 70%, stage advances to lingual
  { t: 8.2,  phase: 'paused',   stage: 'lingual',  coverage: 0.70, direction: 'rotate-right', activeEdge: 'right', flash: true },

  // ── Right roll arrow visible — user rotates model other way
  { t: 9.4,  phase: 'scanning', stage: 'lingual',  coverage: 0.73, direction: null,           activeEdge: null },

  // ── Scanning lingual surface
  { t: 11.6, phase: 'scanning', stage: 'lingual',  coverage: 0.93, direction: null,           activeEdge: null },

  // ── Complete
  { t: 12.3, phase: 'complete', stage: 'lingual',  coverage: 1.00, direction: null,           activeEdge: null, flash: true },
];

const TOTAL_DURATION = 13.5;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

// Compute the full demo state at a given elapsed time
function getDemoFrame(elapsed: number): {
  guidance: GuidanceState;
  pointerNDC: { x: number; y: number };
  flashActive: boolean;
} {
  // Find current keyframe index
  let ki = 0;
  for (let i = 0; i < SCRIPT.length - 1; i++) {
    if (elapsed >= SCRIPT[i].t) ki = i;
  }
  const curr = SCRIPT[ki];
  const next = SCRIPT[Math.min(ki + 1, SCRIPT.length - 1)];

  // Interpolate coverage between keyframes
  const segLen = next.t - curr.t;
  const segT = segLen > 0 ? (elapsed - curr.t) / segLen : 1;
  const coverage = lerp(curr.coverage, next.coverage, segT);

  // Animate the scan frame (pointerNDC drives position + tilt)
  let px = 0;
  let py = 0;

  if (curr.phase === 'scanning') {
    if (curr.stage === 'occlusal') {
      // Smooth left-right sweep with slight vertical drift
      px = Math.sin(elapsed * Math.PI * 1.6) * 0.36;
      py = Math.sin(elapsed * Math.PI * 0.4) * 0.08;
    } else if (curr.stage === 'buccal') {
      // Slightly offset left (model "tilted"), sweeping
      px = -0.1 + Math.sin(elapsed * Math.PI * 1.3) * 0.28;
      py = -0.10 + Math.sin(elapsed * Math.PI * 0.5) * 0.07;
    } else {
      // Slightly offset right (model "tilted" other way)
      px = 0.1 + Math.sin(elapsed * Math.PI * 1.4) * 0.27;
      py = 0.08 + Math.sin(elapsed * Math.PI * 0.55) * 0.07;
    }
  } else if (curr.phase === 'paused') {
    // Frame rests on the side that needs attention
    px = curr.activeEdge === 'left' ? -0.22 : curr.activeEdge === 'right' ? 0.22 : 0;
    py = 0;
  }

  // Flash fires at flash keyframes for 700ms
  const flashActive = !!(curr.flash && elapsed - curr.t < 0.7);

  const guidance: GuidanceState = {
    phase: curr.phase,
    stage: curr.stage,
    direction: curr.direction,
    activeEdge: curr.activeEdge,
    coveragePercent: coverage,
    hint: '',
    activeRegion: null,
    regions: [],
    stageAdvanced: false,
  };

  return { guidance, pointerNDC: { x: px, y: py }, flashActive };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface DemoState {
  guidance: GuidanceState;
  pointerNDC: { x: number; y: number };
  flashActive: boolean;
}

export function useDemoMode() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [demoState, setDemoState] = useState<DemoState | null>(null);

  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    setIsPlaying(false);
    startTimeRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    // Keep last frame visible (shows complete state) rather than clearing
  }, []);

  const tick = useCallback(() => {
    if (!startTimeRef.current) return;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;

    if (elapsed >= TOTAL_DURATION) {
      setDemoState(getDemoFrame(TOTAL_DURATION));
      stop();
      return;
    }

    setDemoState(getDemoFrame(elapsed));
    rafRef.current = requestAnimationFrame(tick);
  }, [stop]);

  const play = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTimeRef.current = Date.now();
    setIsPlaying(true);
    setDemoState(getDemoFrame(0));
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    isPlaying,
    play,
    stop,
    // When playing, these override the real guidance/pointer in the viewer
    demoGuidance: demoState?.guidance ?? null,
    demoPointerNDC: demoState?.pointerNDC ?? null,
    demoFlashActive: demoState?.flashActive ?? false,
  };
}
