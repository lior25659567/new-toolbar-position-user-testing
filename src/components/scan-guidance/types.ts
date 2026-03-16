// ─── Scan Guidance Types ─────────────────────────────────────────────────────

export type ScanPhase = 'idle' | 'scanning' | 'paused' | 'complete';

export type ScanStage = 'occlusal' | 'buccal' | 'lingual';

export type FrameEdge = 'top' | 'right' | 'bottom' | 'left' | null;

export type GuidanceDirection =
  | 'left'
  | 'right'
  | 'up'
  | 'down'
  | 'rotate-left'
  | 'rotate-right';

export interface ScanRegion {
  id: string;
  label: string;
  /** Normalized XZ bounds within the model's bounding box (0-1) */
  xMin: number;
  xMax: number;
  zMin: number;
  zMax: number;
  /** 0-1 coverage within this region */
  coverage: number;
}

export interface GuidanceState {
  phase: ScanPhase;
  direction: GuidanceDirection | null;
  hint: string;
  coveragePercent: number;
  activeRegion: ScanRegion | null;
  regions: ScanRegion[];
  stage: ScanStage;
  activeEdge: FrameEdge;
  stageAdvanced: boolean;
}

/** Bounding box in world XZ for the loaded model */
export interface ModelBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}
