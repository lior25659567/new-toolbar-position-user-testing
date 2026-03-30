import { useState, useCallback, useRef, useEffect } from 'react';
import type { UndercutAnalysis, UndercutRegion, UndercutSeverity, CaseType } from './types';
import { UPPER_TEETH, LOWER_TEETH } from './types';

/** Seeded pseudo-random for deterministic results per tooth+direction combo */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function classifySeverity(depth: number): UndercutSeverity {
  if (depth < 0.15) return 'clear';
  if (depth < 0.5) return 'minor';
  return 'severe';
}

/** Simulate undercut analysis for selected teeth and a given insertion direction */
function simulateAnalysis(
  selectedTeeth: number[],
  direction: [number, number, number],
): UndercutAnalysis {
  if (selectedTeeth.length === 0) {
    return {
      regions: [],
      totalArea: 0,
      maxDepth: 0,
      percentAffected: 0,
      insertionPath: { direction, isOptimal: true },
    };
  }

  const dirSeed = direction[0] * 100 + direction[1] * 200 + direction[2] * 300;

  const regions: UndercutRegion[] = selectedTeeth.map((toothId) => {
    const seed = toothId * 17 + dirSeed;
    const tilt = Math.sqrt(direction[0] ** 2 + direction[2] ** 2);
    const baseFactor = 0.1 + tilt * 1.2;
    const noise = seededRandom(seed) * 0.6;
    const maxDepth = Math.max(0, baseFactor * (0.3 + noise) - 0.05);
    const area = maxDepth > 0.05 ? seededRandom(seed + 7) * 2.5 + maxDepth * 3 : 0;
    return {
      toothId,
      area: Math.round(area * 100) / 100,
      maxDepth: Math.round(maxDepth * 100) / 100,
      severity: classifySeverity(maxDepth),
    };
  });

  const totalArea = Math.round(regions.reduce((s, r) => s + r.area, 0) * 100) / 100;
  const maxDepth = Math.round(Math.max(0, ...regions.map(r => r.maxDepth)) * 100) / 100;
  const affectedCount = regions.filter(r => r.severity !== 'clear').length;
  const percentAffected = selectedTeeth.length > 0
    ? Math.round((affectedCount / selectedTeeth.length) * 100)
    : 0;

  const isOptimal = tiltAngle(direction) < 5;

  return {
    regions,
    totalArea,
    maxDepth,
    percentAffected,
    insertionPath: { direction, isOptimal },
  };
}

function tiltAngle(dir: [number, number, number]): number {
  const dot = Math.abs(dir[1]);
  return Math.acos(Math.min(1, dot)) * (180 / Math.PI);
}

/** Find direction with least undercuts from a set of candidates */
function findOptimalDirection(selectedTeeth: number[]): [number, number, number] {
  let bestDir: [number, number, number] = [0, 1, 0];
  let bestArea = Infinity;

  for (let ax = -20; ax <= 20; ax += 5) {
    for (let az = -20; az <= 20; az += 5) {
      const rx = (ax * Math.PI) / 180;
      const rz = (az * Math.PI) / 180;
      const dir: [number, number, number] = [
        Math.sin(rz),
        Math.cos(rx) * Math.cos(rz),
        Math.sin(rx),
      ];
      const len = Math.sqrt(dir[0] ** 2 + dir[1] ** 2 + dir[2] ** 2);
      dir[0] /= len; dir[1] /= len; dir[2] /= len;
      const result = simulateAnalysis(selectedTeeth, dir);
      if (result.totalArea < bestArea) {
        bestArea = result.totalArea;
        bestDir = dir;
      }
    }
  }
  return bestDir;
}

export function useUndercutAnalysis() {
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);
  const [insertionDir, setInsertionDir] = useState<[number, number, number]>([0, 1, 0]);
  const [analysis, setAnalysis] = useState<UndercutAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const caseType: CaseType = selectedTeeth.length === 0
    ? 'single-crown'
    : selectedTeeth.length === 1
      ? 'single-crown'
      : selectedTeeth.length <= 4
        ? 'bridge'
        : 'full-arch';

  // Debounced recalculation when direction changes (real-time heatmap update)
  useEffect(() => {
    if (selectedTeeth.length === 0) {
      setAnalysis(null);
      return;
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAnalysis(simulateAnalysis(selectedTeeth, insertionDir));
    }, 50); // Fast for responsive feel when dragging
    return () => clearTimeout(timerRef.current);
  }, [selectedTeeth, insertionDir]);

  const runAnalysis = useCallback(() => {
    if (selectedTeeth.length === 0) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const optDir = findOptimalDirection(selectedTeeth);
      setInsertionDir(optDir);
      setAnalysis(simulateAnalysis(selectedTeeth, optDir));
      setIsAnalyzing(false);
    }, 400);
  }, [selectedTeeth]);

  const resetToOptimal = useCallback(() => {
    if (selectedTeeth.length === 0) return;
    const optDir = findOptimalDirection(selectedTeeth);
    setInsertionDir(optDir);
  }, [selectedTeeth]);

  const toggleTooth = useCallback((toothId: number, shiftKey: boolean) => {
    setSelectedTeeth(prev => {
      return prev.includes(toothId) ? prev.filter(t => t !== toothId) : [...prev, toothId];
    });
  }, []);

  /** Replace selection with a single tooth (for crown mode) */
  const selectSingleTooth = useCallback((toothId: number) => {
    setSelectedTeeth(prev => {
      // If already selected, deselect
      if (prev.length === 1 && prev[0] === toothId) return [];
      return [toothId];
    });
  }, []);

  /** Set teeth directly (for full arch auto-select) */
  const setTeeth = useCallback((teeth: number[]) => {
    setSelectedTeeth(teeth);
  }, []);

  const selectFullArch = useCallback((arch: 'upper' | 'lower') => {
    setSelectedTeeth([...(arch === 'upper' ? UPPER_TEETH : LOWER_TEETH)]);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTeeth([]);
    setAnalysis(null);
    setInsertionDir([0, 1, 0]);
  }, []);

  return {
    selectedTeeth,
    insertionDir,
    setInsertionDir,
    analysis,
    isAnalyzing,
    caseType,
    toggleTooth,
    selectSingleTooth,
    setTeeth,
    selectFullArch,
    clearSelection,
    runAnalysis,
    resetToOptimal,
  };
}
