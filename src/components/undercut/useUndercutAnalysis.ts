import { useState, useCallback, useRef, useEffect } from 'react';
import type { UndercutAnalysis, UndercutRegion, UndercutSeverity, CaseType, ArchType, EntryContext, LinkedBridge, AnalysisError } from './types';
import { UPPER_TEETH, LOWER_TEETH, DEFAULT_ENTRY_CONTEXT } from './types';

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

/** Simulate per-tooth analysis: each tooth has its own insertion direction */
function simulatePerToothAnalysis(
  selectedTeeth: number[],
  perToothDirs: Map<number, [number, number, number]>,
): UndercutAnalysis {
  if (selectedTeeth.length === 0) {
    return {
      regions: [],
      totalArea: 0,
      maxDepth: 0,
      percentAffected: 0,
      insertionPath: { direction: [0, 1, 0], isOptimal: true },
    };
  }

  const regions: UndercutRegion[] = selectedTeeth.map((toothId) => {
    const dir = perToothDirs.get(toothId) || [0, 1, 0] as [number, number, number];
    const dirSeed = dir[0] * 100 + dir[1] * 200 + dir[2] * 300;
    const seed = toothId * 17 + dirSeed;
    const tilt = Math.sqrt(dir[0] ** 2 + dir[2] ** 2);
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

  const allOptimal = selectedTeeth.every(t => {
    const d = perToothDirs.get(t) || [0, 1, 0] as [number, number, number];
    return tiltAngle(d) < 5;
  });

  return {
    regions,
    totalArea,
    maxDepth,
    percentAffected,
    insertionPath: { direction: [0, 1, 0], isOptimal: allOptimal },
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

/** Find optimal direction for a single tooth */
function findOptimalDirectionForTooth(toothId: number): [number, number, number] {
  return findOptimalDirection([toothId]);
}

let bridgeIdCounter = 0;

export function useUndercutAnalysis(entryContext: EntryContext = DEFAULT_ENTRY_CONTEXT) {
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);
  const [insertionDir, setInsertionDir] = useState<[number, number, number]>([0, 1, 0]);
  const [perToothDirs, setPerToothDirs] = useState<Map<number, [number, number, number]>>(new Map());
  const [sharedPath, setSharedPath] = useState(true);
  const [analysis, setAnalysis] = useState<UndercutAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // ─── New state for PRD alignment ─────────────────────────────────────────
  const [activeArch, setActiveArchState] = useState<ArchType>(
    entryContext.availableArches[0] || 'upper'
  );
  const [linkedBridges, setLinkedBridges] = useState<LinkedBridge[]>([]);
  const [analysisError, setAnalysisError] = useState<AnalysisError>(null);
  const [hasMarginLine] = useState(entryContext.hasMarginLine);
  const initializedRef = useRef(false);

  const caseType: CaseType = selectedTeeth.length === 0
    ? 'single-crown'
    : selectedTeeth.length === 1
      ? 'single-crown'
      : selectedTeeth.length <= 4
        ? 'bridge'
        : 'full-arch';

  // ─── Auto-initialize based on entry context ──────────────────────────────
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (entryContext.procedureType === 'full-arch') {
      // Full arch: auto-select entire arch, shared path
      const arch = entryContext.availableArches[0] || 'upper';
      const teeth = [...(arch === 'upper' ? UPPER_TEETH : LOWER_TEETH)];
      setSelectedTeeth(teeth);
      const newDirs = new Map<number, [number, number, number]>();
      teeth.forEach(t => newDirs.set(t, [0, 1, 0]));
      setPerToothDirs(newDirs);
      setSharedPath(true);
    } else if (entryContext.procedureType === 'bridge' && entryContext.preselectedTeeth?.length) {
      // Bridge: auto-select preselected teeth, auto-link, shared path
      const teeth = [...entryContext.preselectedTeeth];
      setSelectedTeeth(teeth);
      const newDirs = new Map<number, [number, number, number]>();
      teeth.forEach(t => newDirs.set(t, [0, 1, 0]));
      setPerToothDirs(newDirs);
      setSharedPath(true);
      setLinkedBridges([{ id: `bridge-${++bridgeIdCounter}`, teeth }]);
    } else if (entryContext.procedureType === 'crown' && entryContext.preselectedTeeth?.length) {
      // Crown: auto-select preselected tooth
      const teeth = [...entryContext.preselectedTeeth];
      setSelectedTeeth(teeth);
      const newDirs = new Map<number, [number, number, number]>();
      teeth.forEach(t => newDirs.set(t, [0, 1, 0]));
      setPerToothDirs(newDirs);
    }
  }, [entryContext]);

  // ─── Arch switching ──────────────────────────────────────────────────────
  const setActiveArch = useCallback((arch: ArchType) => {
    setActiveArchState(arch);
    // Clear selection when switching arches
    setSelectedTeeth([]);
    setAnalysis(null);
    setInsertionDir([0, 1, 0]);
    setPerToothDirs(new Map());
    setLinkedBridges([]);
    setAnalysisError(null);
  }, []);

  // ─── Bridge linking ──────────────────────────────────────────────────────
  const linkTeeth = useCallback((teeth: number[]) => {
    if (teeth.length < 2) return;
    const newBridge: LinkedBridge = { id: `bridge-${++bridgeIdCounter}`, teeth: [...teeth] };
    setLinkedBridges(prev => [...prev, newBridge]);
    setSharedPath(true); // Force shared path when bridge is linked
  }, []);

  const unlinkBridge = useCallback((bridgeId: string) => {
    setLinkedBridges(prev => prev.filter(b => b.id !== bridgeId));
  }, []);

  /** Check if teeth are currently linked as a bridge */
  const isBridgeLinked = linkedBridges.length > 0;

  // ─── Debounced recalculation ─────────────────────────────────────────────
  useEffect(() => {
    if (selectedTeeth.length === 0) {
      setAnalysis(null);
      return;
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (sharedPath) {
        setAnalysis(simulateAnalysis(selectedTeeth, insertionDir));
      } else {
        setAnalysis(simulatePerToothAnalysis(selectedTeeth, perToothDirs));
      }
    }, 50);
    return () => clearTimeout(timerRef.current);
  }, [selectedTeeth, insertionDir, sharedPath, perToothDirs]);

  const resetToOptimal = useCallback(() => {
    if (selectedTeeth.length === 0) return;
    if (sharedPath) {
      const optDir = findOptimalDirection(selectedTeeth);
      setInsertionDir(optDir);
    } else {
      const newDirs = new Map<number, [number, number, number]>();
      selectedTeeth.forEach(t => {
        newDirs.set(t, findOptimalDirectionForTooth(t));
      });
      setPerToothDirs(newDirs);
    }
  }, [selectedTeeth, sharedPath]);

  const toggleTooth = useCallback((toothId: number, _shiftKey: boolean) => {
    setSelectedTeeth(prev => {
      const next = prev.includes(toothId) ? prev.filter(t => t !== toothId) : [...prev, toothId];
      if (!prev.includes(toothId)) {
        setPerToothDirs(dirs => {
          const newDirs = new Map(dirs);
          if (!newDirs.has(toothId)) {
            newDirs.set(toothId, [0, 1, 0]);
          }
          return newDirs;
        });
      }
      return next;
    });
  }, []);

  const setTeeth = useCallback((teeth: number[]) => {
    setSelectedTeeth(teeth);
    setPerToothDirs(dirs => {
      const newDirs = new Map(dirs);
      teeth.forEach(t => {
        if (!newDirs.has(t)) {
          newDirs.set(t, [0, 1, 0]);
        }
      });
      return newDirs;
    });
  }, []);

  const selectFullArch = useCallback((arch: 'upper' | 'lower') => {
    setActiveArchState(arch);
    const teeth = [...(arch === 'upper' ? UPPER_TEETH : LOWER_TEETH)];
    setSelectedTeeth(teeth);
    const newDirs = new Map<number, [number, number, number]>();
    teeth.forEach(t => newDirs.set(t, [0, 1, 0]));
    setPerToothDirs(newDirs);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTeeth([]);
    setAnalysis(null);
    setInsertionDir([0, 1, 0]);
    setPerToothDirs(new Map());
    setLinkedBridges([]);
  }, []);

  const setToothDir = useCallback((toothId: number, dir: [number, number, number]) => {
    setPerToothDirs(prev => {
      const next = new Map(prev);
      next.set(toothId, dir);
      return next;
    });
  }, []);

  const toggleSharedPath = useCallback((shared: boolean) => {
    setSharedPath(shared);
    if (!shared) {
      // Switching to per-tooth: initialize each tooth with the current shared direction
      setPerToothDirs(prev => {
        const newDirs = new Map(prev);
        setSelectedTeeth(teeth => {
          teeth.forEach(t => {
            if (!newDirs.has(t)) {
              newDirs.set(t, [...insertionDir] as [number, number, number]);
            }
          });
          return teeth;
        });
        return newDirs;
      });
    }
  }, [insertionDir]);

  /** Simulate triggering/clearing error state (for demo) */
  const toggleAnalysisError = useCallback(() => {
    setAnalysisError(prev => prev === null ? 'poor-scan' : null);
  }, []);

  return {
    selectedTeeth,
    insertionDir,
    setInsertionDir,
    perToothDirs,
    setToothDir,
    sharedPath,
    toggleSharedPath,
    analysis,
    isAnalyzing,
    caseType,
    toggleTooth,
    setTeeth,
    selectFullArch,
    clearSelection,
    resetToOptimal,
    // New for PRD alignment
    activeArch,
    setActiveArch,
    linkedBridges,
    linkTeeth,
    unlinkBridge,
    isBridgeLinked,
    analysisError,
    toggleAnalysisError,
    hasMarginLine,
    entryContext,
  };
}
