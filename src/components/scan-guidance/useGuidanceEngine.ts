import { useMemo, useCallback, useRef } from 'react';
import type { ScanPhase, ScanStage, FrameEdge, ScanRegion, GuidanceState, GuidanceDirection } from './types';

const BUCCAL_THRESHOLD   = 0.40;
const LINGUAL_THRESHOLD  = 0.70;
const COMPLETE_THRESHOLD = 0.95;
const IMBALANCE_THRESHOLD = 0.015; // more sensitive — reacts faster to uneven coverage

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
 * Find the weakest region that's actually on the model surface.
 * Cells outside the jaw's footprint (corners, edges with no geometry)
 * are filtered out by checking if they or their neighbors have any coverage.
 */
function analyzeDirection(regions: ScanRegion[]): {
  edge: FrameEdge;
  direction: GuidanceDirection | null;
  weakestRegion: ScanRegion | null;
} {
  // Need some scanning before giving guidance
  const avgCov = regions.reduce((s, r) => s + r.coverage, 0) / regions.length;
  if (avgCov < 0.01) return { edge: null, direction: null, weakestRegion: null };

  // Build set of "on-model" cell indices:
  // A cell is on the model if it or any of its 8 neighbors has coverage > 0.
  // This filters out grid cells in corners/edges where no jaw geometry exists.
  const onModel = new Set<number>();
  for (let i = 0; i < regions.length; i++) {
    if (regions[i].coverage > 0) {
      const row = Math.floor(i / GRID_SIZE);
      const col = i % GRID_SIZE;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = row + dr, nc = col + dc;
          if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
            onModel.add(nr * GRID_SIZE + nc);
          }
        }
      }
    }
  }

  // Once meaningful scanning has started (>5% avg), consider ALL cells so the
  // engine can detect entirely-unscanned halves that the on-model mask would miss.
  const considerAll = avgCov > 0.05;

  // Find the weakest and strongest among candidate cells
  let weakest: ScanRegion | null = null;
  let maxCov = 0;
  for (let i = 0; i < regions.length; i++) {
    if (!considerAll && !onModel.has(i)) continue;
    if (!weakest || regions[i].coverage < weakest.coverage) {
      weakest = regions[i];
    }
    if (regions[i].coverage > maxCov) maxCov = regions[i].coverage;
  }

  if (!weakest) return { edge: null, direction: null, weakestRegion: null };

  // If the gap between best and worst on-model cells is small, no guidance needed
  if (maxCov - weakest.coverage < IMBALANCE_THRESHOLD) {
    return { edge: null, direction: null, weakestRegion: null };
  }

  // Direction from grid center toward weakest cell.
  // X is INVERTED because the model is rotated 180° around Z (BASE_ROT_Z = PI),
  // so texture-space left = screen-space right and vice versa.
  const cx = (weakest.xMin + weakest.xMax) / 2 - 0.5;
  const cz = (weakest.zMin + weakest.zMax) / 2 - 0.5;

  let direction: GuidanceDirection;
  let edge: FrameEdge;

  if (Math.abs(cx) > Math.abs(cz)) {
    // Flipped: texture cx < 0 means screen RIGHT, cx > 0 means screen LEFT
    direction = cx < 0 ? 'right' : 'left';
    edge = cx < 0 ? 'right' : 'left';
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
        modelRotation: { x: 0, y: 0 },
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
