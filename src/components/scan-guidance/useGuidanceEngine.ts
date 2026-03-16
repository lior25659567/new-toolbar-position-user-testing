import { useMemo, useCallback, useRef } from 'react';
import type { ScanPhase, ScanStage, FrameEdge, ScanRegion, GuidanceState, GuidanceDirection } from './types';

const BUCCAL_THRESHOLD   = 0.40;
const LINGUAL_THRESHOLD  = 0.70;
const COMPLETE_THRESHOLD = 0.95;
const IMBALANCE_THRESHOLD = 0.03;

const GRID_SIZE = 4;

/** 4×4 grid of regions for fine-grained coverage analysis */
function createDefaultRegions(): Omit<ScanRegion, 'coverage'>[] {
  const regions: Omit<ScanRegion, 'coverage'>[] = [];
  const step = 1 / GRID_SIZE;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      regions.push({
        id: `r${row}-c${col}`,
        label: `R${row}C${col}`,
        xMin: col * step,
        xMax: (col + 1) * step,
        zMin: row * step,
        zMax: (row + 1) * step,
      });
    }
  }
  return regions;
}

function getStage(coverage: number): ScanStage {
  if (coverage >= LINGUAL_THRESHOLD) return 'lingual';
  if (coverage >= BUCCAL_THRESHOLD)  return 'buccal';
  return 'occlusal';
}

/**
 * Find the single weakest region and compute direction toward it.
 * Uses a 4×4 grid for precise spatial guidance.
 */
function analyzeDirection(regions: ScanRegion[]): {
  edge: FrameEdge;
  direction: GuidanceDirection | null;
  weakestRegion: ScanRegion | null;
} {
  // Need some scanning before giving guidance
  const avgCov = regions.reduce((s, r) => s + r.coverage, 0) / regions.length;
  if (avgCov < 0.02) return { edge: null, direction: null, weakestRegion: null };

  // Find the weakest and strongest regions
  let weakest = regions[0];
  let maxCov = 0;
  for (const r of regions) {
    if (r.coverage < weakest.coverage) weakest = r;
    if (r.coverage > maxCov) maxCov = r.coverage;
  }

  // If the gap between best and worst is small, no guidance needed
  if (maxCov - weakest.coverage < IMBALANCE_THRESHOLD) {
    return { edge: null, direction: null, weakestRegion: null };
  }

  // Direction from grid center (0.5, 0.5) toward the weakest cell's center
  const cx = (weakest.xMin + weakest.xMax) / 2 - 0.5;
  const cz = (weakest.zMin + weakest.zMax) / 2 - 0.5;

  let direction: GuidanceDirection;
  let edge: FrameEdge;

  if (Math.abs(cx) > Math.abs(cz)) {
    direction = cx < 0 ? 'left' : 'right';
    edge = cx < 0 ? 'left' : 'right';
  } else {
    direction = cz < 0 ? 'up' : 'down';
    edge = cz < 0 ? 'top' : 'bottom';
  }

  return { edge, direction, weakestRegion: weakest };
}

export function useGuidanceEngine() {
  const regionDefs = useMemo(createDefaultRegions, []);
  const prevStageRef = useRef<ScanStage>('occlusal');

  const evaluate = useCallback((
    phase: ScanPhase,
    coveragePercent: number,
    getRegionCoverage: (xMin: number, xMax: number, zMin: number, zMax: number) => number,
    _currentRegionId?: string,
  ): GuidanceState => {
    const regions: ScanRegion[] = regionDefs.map((r) => ({
      ...r,
      coverage: getRegionCoverage(r.xMin, r.xMax, r.zMin, r.zMax),
    }));

    if (coveragePercent >= COMPLETE_THRESHOLD) {
      prevStageRef.current = 'lingual';
      return {
        phase: 'complete',
        direction: null,
        hint: '',
        coveragePercent,
        activeRegion: null,
        regions,
        stage: 'lingual',
        activeEdge: null,
        stageAdvanced: false,
        targetScreenPos: null,
        weakestRegion: null,
      };
    }

    const stage = getStage(coveragePercent);
    const stageAdvanced = stage !== prevStageRef.current;
    if (stageAdvanced) prevStageRef.current = stage;

    // Find the weakest region and compute direction
    const { edge, direction, weakestRegion } = analyzeDirection(regions);

    // For buccal/lingual stages, fall back to rotate hints if coverage is balanced
    let finalDirection: GuidanceDirection | null = direction;
    let finalEdge: FrameEdge = edge;

    if (stage === 'buccal' && !direction) {
      finalDirection = 'rotate-left';
      finalEdge = 'left';
    } else if (stage === 'lingual' && !direction) {
      finalDirection = 'rotate-right';
      finalEdge = 'right';
    }

    return {
      phase,
      direction: finalDirection,
      hint: '',
      coveragePercent,
      activeRegion: null,
      regions,
      stage,
      activeEdge: finalEdge,
      stageAdvanced,
      targetScreenPos: null, // filled by Scene's 3D projection
      weakestRegion: weakestRegion ?? null,
    };
  }, [regionDefs]);

  const resetEngine = useCallback(() => {
    prevStageRef.current = 'occlusal';
  }, []);

  return { evaluate, resetEngine };
}
