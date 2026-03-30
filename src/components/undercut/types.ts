// ─── Undercut & Insertion Path Types ────────────────────────────────────────

export type UndercutStage = 'analyze' | 'confirm';

export type CaseType = 'single-crown' | 'bridge' | 'full-arch';

export type UndercutSeverity = 'clear' | 'minor' | 'severe';

export interface UndercutRegion {
  toothId: number;
  area: number;       // mm²
  maxDepth: number;   // mm
  severity: UndercutSeverity;
}

export interface InsertionPath {
  /** Normalized direction vector [x, y, z] */
  direction: [number, number, number];
  isOptimal: boolean;
}

export interface UndercutAnalysis {
  regions: UndercutRegion[];
  totalArea: number;       // mm²
  maxDepth: number;        // mm
  percentAffected: number; // 0-100
  insertionPath: InsertionPath;
}

/** FDI tooth numbers for upper and lower arches */
export const UPPER_TEETH = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28] as const;
export const LOWER_TEETH = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38] as const;
