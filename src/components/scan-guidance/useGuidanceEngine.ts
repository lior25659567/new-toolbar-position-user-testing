import { useMemo, useCallback, useRef } from 'react';
import type { ScanPhase, ScanStage, FrameEdge, ScanRegion, GuidanceState, GuidanceDirection } from './types';

const BUCCAL_THRESHOLD   = 0.40;
const LINGUAL_THRESHOLD  = 0.70;
const COMPLETE_THRESHOLD = 0.95;
const IMBALANCE_THRESHOLD = 0.05; // min coverage difference to trigger directional guidance

/** Default 2x2 quadrant regions */
function createDefaultRegions(): Omit<ScanRegion, 'coverage'>[] {
  return [
    { id: 'upper-left',  label: 'Upper Left',  xMin: 0,   xMax: 0.5, zMin: 0,   zMax: 0.5 },
    { id: 'upper-right', label: 'Upper Right', xMin: 0.5, xMax: 1,   zMin: 0,   zMax: 0.5 },
    { id: 'lower-left',  label: 'Lower Left',  xMin: 0,   xMax: 0.5, zMin: 0.5, zMax: 1 },
    { id: 'lower-right', label: 'Lower Right', xMin: 0.5, xMax: 1,   zMin: 0.5, zMax: 1 },
  ];
}

function getStage(coverage: number): ScanStage {
  if (coverage >= LINGUAL_THRESHOLD) return 'lingual';
  if (coverage >= BUCCAL_THRESHOLD)  return 'buccal';
  return 'occlusal';
}

/**
 * Find the lowest-coverage area and point toward it.
 * Compares all 4 quadrants individually — picks the one that needs the most work
 * and returns a direction pointing from the highest-coverage side toward it.
 */
function analyzeDirection(regions: ScanRegion[]): {
  edge: FrameEdge;
  direction: GuidanceDirection | null;
} {
  // Need some scanning done before we can give guidance
  const avgCov = regions.reduce((s, r) => s + r.coverage, 0) / regions.length;
  if (avgCov < 0.03) return { edge: null, direction: null };

  // regions: [0]=upper-left, [1]=upper-right, [2]=lower-left, [3]=lower-right
  const leftCov  = (regions[0].coverage + regions[2].coverage) / 2;
  const rightCov = (regions[1].coverage + regions[3].coverage) / 2;
  const topCov   = (regions[0].coverage + regions[1].coverage) / 2;
  const botCov   = (regions[2].coverage + regions[3].coverage) / 2;

  // Find the side with lowest coverage
  const sides = [
    { cov: leftCov,  edge: 'left'   as FrameEdge, dir: 'left'  as GuidanceDirection },
    { cov: rightCov, edge: 'right'  as FrameEdge, dir: 'right' as GuidanceDirection },
    { cov: topCov,   edge: 'top'    as FrameEdge, dir: 'up'    as GuidanceDirection },
    { cov: botCov,   edge: 'bottom' as FrameEdge, dir: 'down'  as GuidanceDirection },
  ];

  // Sort by coverage ascending — [0] is the least scanned
  sides.sort((a, b) => a.cov - b.cov);
  const weakest = sides[0];
  const strongest = sides[sides.length - 1];

  // Only show guidance if there's a meaningful difference between best and worst
  if (strongest.cov - weakest.cov < IMBALANCE_THRESHOLD) {
    return { edge: null, direction: null };
  }

  // Point toward the weakest side
  return { edge: weakest.edge, direction: weakest.dir };
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
      };
    }

    const stage = getStage(coveragePercent);
    const stageAdvanced = stage !== prevStageRef.current;
    if (stageAdvanced) prevStageRef.current = stage;

    // Always analyze where coverage is low and point there
    const { edge, direction } = analyzeDirection(regions);

    // For buccal/lingual stages, override with rotate direction if no strong imbalance
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
    };
  }, [regionDefs]);

  const resetEngine = useCallback(() => {
    prevStageRef.current = 'occlusal';
  }, []);

  return { evaluate, resetEngine };
}
