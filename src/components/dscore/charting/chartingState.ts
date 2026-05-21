// Charting & Perio Exam — restorations, conditions, perio probing.
// FDI numbering 11-48. We model a sparse map: most teeth empty, only filled
// in for teeth that have a finding or measurement.

export type Surface = 'M' | 'O' | 'D' | 'B' | 'L' | 'I'; // Mesial Occlusal Distal Buccal Lingual Incisal
export type RestorationType = 'amalgam' | 'composite' | 'crown' | 'implant' | 'rct' | 'sealant' | 'missing';
export type ConditionType = 'caries' | 'fracture' | 'recession' | 'mobility' | 'periapical-lesion';

export interface ToothFinding {
  id: string;
  toothNumber: number;
  type: RestorationType | ConditionType;
  surfaces?: Surface[];
  notes?: string;
  recordedAt: string;
  recordedBy: string;
}

/** Per-tooth perio probing — 6 sites: MB, B, DB, ML, L, DL. */
export type PerioSite = 'mb' | 'b' | 'db' | 'ml' | 'l' | 'dl';
export interface PerioMeasurement {
  /** Pocket depth in mm (0–12). */
  depth: number;
  /** Recession in mm. */
  recession: number;
  /** Bleeding on probing. */
  bop: boolean;
  /** Suppuration / pus. */
  pus?: boolean;
}

export interface ToothPerioRow {
  toothNumber: number;
  /** Mobility 0–3. */
  mobility?: 0 | 1 | 2 | 3;
  /** Furcation involvement 0–3. */
  furcation?: 0 | 1 | 2 | 3;
  sites: Partial<Record<PerioSite, PerioMeasurement>>;
}

export interface ChartingState {
  patientId: string;
  patientName: string;
  visitDate: string;
  findings: Record<number, ToothFinding[]>;     // keyed by tooth number
  perio: Record<number, ToothPerioRow>;
  selectedTooth: number | null;
  /** Set of tooth numbers comprising the current arch view. */
}

// FDI numbering — 11-18 (UR), 21-28 (UL), 31-38 (LL), 41-48 (LR).
export const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
export const UPPER_LEFT  = [21, 22, 23, 24, 25, 26, 27, 28];
export const LOWER_LEFT  = [38, 37, 36, 35, 34, 33, 32, 31];
export const LOWER_RIGHT = [41, 42, 43, 44, 45, 46, 47, 48];

export function isPosterior(tooth: number): boolean {
  const n = tooth % 10;
  return n >= 4;
}

export const RESTORATION_LABEL: Record<RestorationType, string> = {
  amalgam: 'Amalgam',
  composite: 'Composite',
  crown: 'Crown',
  implant: 'Implant',
  rct: 'Root canal',
  sealant: 'Sealant',
  missing: 'Missing',
};

export const CONDITION_LABEL: Record<ConditionType, string> = {
  caries: 'Caries',
  fracture: 'Fracture',
  recession: 'Recession',
  mobility: 'Mobility',
  'periapical-lesion': 'Periapical lesion',
};

export const RESTORATION_COLOR: Record<RestorationType, string> = {
  amalgam:   '#414141',
  composite: '#E0D2B8',
  crown:     'var(--ads-text-warning)',
  implant:   '#9CA3AF',
  rct:       'var(--ads-text-on-highlight-purple)',
  sealant:   '#5DD3F0',
  missing:   'var(--ads-border-accent)',
};

export const CONDITION_COLOR: Record<ConditionType, string> = {
  caries:             'var(--ads-text-error)',
  fracture:           '#FF8A3D',
  recession:          'var(--ads-text-warning)',
  mobility:           'var(--ads-border-accent)',
  'periapical-lesion':'var(--ads-text-on-highlight-purple)',
};

// ─── Mock seed ───────────────────────────────────────────────────────────────

function mkFinding(toothNumber: number, type: ToothFinding['type'], surfaces?: Surface[]): ToothFinding {
  return {
    id: `f-${toothNumber}-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    toothNumber, type, surfaces,
    recordedAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 90).toISOString(),
    recordedBy: 'Dr. Alex Watanabe',
  };
}

const SEED_FINDINGS: ToothFinding[] = [
  mkFinding(14, 'crown'),
  mkFinding(16, 'composite', ['O', 'D']),
  mkFinding(17, 'amalgam', ['O', 'M', 'D']),
  mkFinding(26, 'caries', ['O']),
  mkFinding(36, 'rct'),
  mkFinding(36, 'crown'),
  mkFinding(46, 'amalgam', ['O']),
  mkFinding(47, 'composite', ['B']),
  mkFinding(11, 'fracture', ['I']),
  mkFinding(48, 'missing'),
  mkFinding(38, 'missing'),
  mkFinding(31, 'recession'),
];

function mkPerio(tooth: number, depths: number[], bopMask = 0): ToothPerioRow {
  const sites: PerioSite[] = ['mb', 'b', 'db', 'ml', 'l', 'dl'];
  const result: ToothPerioRow = { toothNumber: tooth, sites: {} };
  sites.forEach((s, i) => {
    const d = depths[i] ?? 2;
    result.sites[s] = { depth: d, recession: d > 4 ? 1 : 0, bop: ((bopMask >> i) & 1) === 1 };
  });
  return result;
}

// Mostly healthy with a few problem teeth for visual variety.
const SEED_PERIO: ToothPerioRow[] = [
  mkPerio(11, [3, 2, 3, 3, 2, 3]),
  mkPerio(12, [2, 2, 2, 2, 2, 2]),
  mkPerio(13, [2, 2, 2, 2, 2, 2]),
  mkPerio(14, [3, 3, 3, 3, 3, 3]),
  mkPerio(16, [4, 5, 6, 4, 5, 5], 0b111111), // problem tooth
  mkPerio(17, [5, 6, 7, 5, 6, 7], 0b111111), // bigger problem
  mkPerio(21, [3, 2, 3, 3, 2, 3]),
  mkPerio(26, [4, 4, 5, 4, 4, 5], 0b101010),
  mkPerio(36, [5, 5, 5, 5, 5, 5], 0b110011),
  mkPerio(46, [3, 3, 4, 3, 3, 4]),
  mkPerio(31, [4, 4, 4, 4, 4, 4], 0b001100),
];

// ─── Reducer ─────────────────────────────────────────────────────────────────

export type ChartingAction =
  | { type: 'SELECT_TOOTH'; tooth: number | null }
  | { type: 'ADD_FINDING'; finding: Omit<ToothFinding, 'id' | 'recordedAt' | 'recordedBy'> }
  | { type: 'REMOVE_FINDING'; toothNumber: number; findingId: string }
  | { type: 'SET_PERIO_SITE'; toothNumber: number; site: PerioSite; patch: Partial<PerioMeasurement> }
  | { type: 'SET_MOBILITY'; toothNumber: number; mobility: 0 | 1 | 2 | 3 };

export function initChartingState(): ChartingState {
  const findings: Record<number, ToothFinding[]> = {};
  for (const f of SEED_FINDINGS) {
    findings[f.toothNumber] = findings[f.toothNumber] ?? [];
    findings[f.toothNumber].push(f);
  }
  const perio: Record<number, ToothPerioRow> = {};
  for (const p of SEED_PERIO) {
    perio[p.toothNumber] = p;
  }
  return {
    patientId: 'pat-mina',
    patientName: 'Mina Yamada',
    visitDate: new Date().toISOString(),
    findings,
    perio,
    selectedTooth: 16,
  };
}

export function chartingReducer(state: ChartingState, action: ChartingAction): ChartingState {
  switch (action.type) {
    case 'SELECT_TOOTH':
      return { ...state, selectedTooth: action.tooth };
    case 'ADD_FINDING': {
      const f: ToothFinding = {
        ...action.finding,
        id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        recordedAt: new Date().toISOString(),
        recordedBy: 'Dr. Alex Watanabe',
      };
      const cur = state.findings[f.toothNumber] ?? [];
      return { ...state, findings: { ...state.findings, [f.toothNumber]: [...cur, f] } };
    }
    case 'REMOVE_FINDING': {
      const cur = state.findings[action.toothNumber] ?? [];
      return {
        ...state,
        findings: { ...state.findings, [action.toothNumber]: cur.filter((f) => f.id !== action.findingId) },
      };
    }
    case 'SET_PERIO_SITE': {
      const cur = state.perio[action.toothNumber] ?? { toothNumber: action.toothNumber, sites: {} };
      const existing = cur.sites[action.site] ?? { depth: 2, recession: 0, bop: false };
      const next: ToothPerioRow = {
        ...cur,
        sites: { ...cur.sites, [action.site]: { ...existing, ...action.patch } },
      };
      return { ...state, perio: { ...state.perio, [action.toothNumber]: next } };
    }
    case 'SET_MOBILITY': {
      const cur = state.perio[action.toothNumber] ?? { toothNumber: action.toothNumber, sites: {} };
      return { ...state, perio: { ...state.perio, [action.toothNumber]: { ...cur, mobility: action.mobility } } };
    }
    default:
      return state;
  }
}

// ─── Aggregator ──────────────────────────────────────────────────────────────

export interface PerioSummary {
  averageDepth: number;
  bopCount: number;
  bopPct: number;
  pocketsOver5: number;
  pocketsOver7: number;
  recessionCount: number;
}

export function summarizePerio(state: ChartingState): PerioSummary {
  let depthSum = 0;
  let depthCount = 0;
  let bop = 0;
  let pocketsOver5 = 0;
  let pocketsOver7 = 0;
  let recession = 0;
  for (const row of Object.values(state.perio)) {
    for (const m of Object.values(row.sites)) {
      if (!m) continue;
      depthSum += m.depth;
      depthCount += 1;
      if (m.bop) bop += 1;
      if (m.depth >= 5) pocketsOver5 += 1;
      if (m.depth >= 7) pocketsOver7 += 1;
      if (m.recession > 0) recession += 1;
    }
  }
  return {
    averageDepth: depthCount === 0 ? 0 : depthSum / depthCount,
    bopCount: bop,
    bopPct: depthCount === 0 ? 0 : bop / depthCount,
    pocketsOver5,
    pocketsOver7,
    recessionCount: recession,
  };
}
