import { useMemo, useCallback, useRef } from 'react';
import type { ScanPhase, ScanStage, FrameEdge, ScanRegion, GuidanceState, GuidanceDirection } from './types';

const BUCCAL_THRESHOLD   = 0.40;
const LINGUAL_THRESHOLD  = 0.70;
const COMPLETE_THRESHOLD = 0.95;
const EDGE_SENSITIVITY   = 0.12;

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

function getActiveEdge(stage: ScanStage, regions: ScanRegion[]): FrameEdge {
  if (stage !== 'occlusal') return null;
  // regions[0]=upper-left, [1]=upper-right, [2]=lower-left, [3]=lower-right
  const leftCov  = (regions[0].coverage + regions[2].coverage) / 2;
  const rightCov = (regions[1].coverage + regions[3].coverage) / 2;
  const topCov   = (regions[0].coverage + regions[1].coverage) / 2;
  const botCov   = (regions[2].coverage + regions[3].coverage) / 2;

  const absH = Math.abs(rightCov - leftCov);
  const absV = Math.abs(botCov - topCov);

  if (absH < EDGE_SENSITIVITY && absV < EDGE_SENSITIVITY) return null;

  if (absH >= absV) {
    // right is more covered → guide toward left (left edge glows)
    return rightCov > leftCov ? 'left' : 'right';
  } else {
    // bottom is more covered → guide toward top (top edge glows)
    return botCov > topCov ? 'top' : 'bottom';
  }
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

    const activeEdge = getActiveEdge(stage, regions);

    // buccal = roll left (left edge / left arrow first, matching clinical convention)
    // lingual = roll right
    const direction: GuidanceDirection | null =
      stage === 'buccal'  ? 'rotate-left'  :
      stage === 'lingual' ? 'rotate-right' :
      null;

    return {
      phase,
      direction,
      hint: '',
      coveragePercent,
      activeRegion: null,
      regions,
      stage,
      activeEdge,
      stageAdvanced,
    };
  }, [regionDefs]);

  const resetEngine = useCallback(() => {
    prevStageRef.current = 'occlusal';
  }, []);

  return { evaluate, resetEngine };
}
