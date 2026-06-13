// ─── Scan Guidance Types ─────────────────────────────────────────────────────

export type ScanPhase = 'idle' | 'scanning' | 'paused' | 'complete';

export type GuidanceMode = 'classic' | 'edge' | 'dot' | 'glow'
  | 'dof-lr' | 'dof-ud' | 'dof-fb' | 'dof-roll' | 'dof-pitch' | 'dof-yaw'
  | 'bare-lr' | 'bare-ud' | 'bare-fb' | 'bare-roll' | 'bare-pitch' | 'bare-yaw'
  | 'ring-lr' | 'ring-ud' | 'ring-fb' | 'ring-roll' | 'ring-pitch' | 'ring-yaw'
  | 'pulse-lr' | 'pulse-ud' | 'pulse-fb' | 'pulse-roll' | 'pulse-pitch' | 'pulse-yaw'
  | 'dof-gizmo'
  | 'ghost-lr' | 'ghost-ud' | 'ghost-fb' | 'ghost-roll' | 'ghost-pitch' | 'ghost-yaw'
  | 'wand-lr' | 'wand-ud' | 'wand-fb' | 'wand-roll' | 'wand-pitch' | 'wand-yaw'
  | 'gwand-lr' | 'gwand-ud' | 'gwand-fb' | 'gwand-roll' | 'gwand-pitch' | 'gwand-yaw'
  | 'bgwand-lr' | 'bgwand-ud' | 'bgwand-fb' | 'bgwand-roll' | 'bgwand-pitch' | 'bgwand-yaw'
  | 'fgwand-lr' | 'fgwand-ud' | 'fgwand-fb' | 'fgwand-roll' | 'fgwand-pitch' | 'fgwand-yaw'
  | 'fagwand-lr' | 'fagwand-ud' | 'fagwand-fb' | 'fagwand-roll' | 'fagwand-pitch' | 'fagwand-yaw'
  | 'rot-cw' | 'rot-ccw' | 'rot-tilt'
  | 'scan-indicator'
  | 'surface-guide';

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
  /** Screen-space 0-1 coords of the weakest region center (projected from 3D) */
  targetScreenPos: { x: number; y: number } | null;
  /** Model rotation delta from base (radians) — drives target rect perspective */
  modelRotation: { x: number; y: number };
  /** The single region with the lowest coverage that needs scanning */
  weakestRegion: ScanRegion | null;
}

/** Bounding box in world XZ for the loaded model */
export interface ModelBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  /** Y midpoint of the model surface — used for accurate 3D→screen projection */
  surfaceY: number;
}
