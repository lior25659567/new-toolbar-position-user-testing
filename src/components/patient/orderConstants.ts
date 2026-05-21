import type { RecordStatus } from '../shared/DataTable';

// ─── Service catalog ─────────────────────────────────────────

export type ServiceId =
  | 'nightguard'
  | 'full-denture'
  | 'partial-denture'
  | 'temporary-restoration'
  | 'final-restoration'
  | 'custom-abutment'
  | 'aligner'
  | 'implant-planning'
  | 'surgical-guide'
  | 'custom-order';

export interface ServiceDefinition {
  id: ServiceId;
  name: string;
  category: string;
  /** Touches teeth — show step 5 (Tooth selection). */
  requiresTeeth: boolean;
  /** Implant-related — show steps 6 (manufacturer) + 7 (product line). */
  requiresImplant: boolean;
  /** Surgical guide only — show step 8 (support type). */
  requiresGuideSupport: boolean;
  /** Show step 9 (file upload). */
  requiresFiles: boolean;
}

export const SERVICES: ServiceDefinition[] = [
  { id: 'nightguard',            name: 'Nightguard',            category: 'Appliance',    requiresTeeth: false, requiresImplant: false, requiresGuideSupport: false, requiresFiles: false },
  { id: 'full-denture',          name: 'Full denture',          category: 'Prosthetics',  requiresTeeth: false, requiresImplant: false, requiresGuideSupport: false, requiresFiles: true  },
  { id: 'partial-denture',       name: 'Partial denture',       category: 'Prosthetics',  requiresTeeth: true,  requiresImplant: false, requiresGuideSupport: false, requiresFiles: true  },
  { id: 'temporary-restoration', name: 'Temporary restoration', category: 'Restorative',  requiresTeeth: true,  requiresImplant: false, requiresGuideSupport: false, requiresFiles: false },
  { id: 'final-restoration',     name: 'Final restoration',     category: 'Restorative',  requiresTeeth: true,  requiresImplant: false, requiresGuideSupport: false, requiresFiles: true  },
  { id: 'custom-abutment',       name: 'Custom abutment',       category: 'Implantology', requiresTeeth: true,  requiresImplant: true,  requiresGuideSupport: false, requiresFiles: true  },
  { id: 'aligner',               name: 'Invisalign',            category: 'Orthodontics', requiresTeeth: true,  requiresImplant: false, requiresGuideSupport: false, requiresFiles: true  },
  { id: 'implant-planning',      name: 'Implant Planning / Surgical Guide', category: 'Implantology', requiresTeeth: true,  requiresImplant: true,  requiresGuideSupport: true, requiresFiles: true  },
  { id: 'custom-order',          name: 'Custom order',          category: 'Other',        requiresTeeth: false, requiresImplant: false, requiresGuideSupport: false, requiresFiles: false },
];

export const SERVICE_BY_ID = SERVICES.reduce<Record<ServiceId, ServiceDefinition>>((acc, s) => {
  acc[s.id] = s;
  return acc;
}, {} as Record<ServiceId, ServiceDefinition>);

// ─── Procedure-type options (depend on service) ───────────────

export const PROCEDURE_TYPES_BY_SERVICE: Record<ServiceId, { value: string; label: string; description?: string }[]> = {
  'nightguard': [
    { value: 'soft',         label: 'Soft nightguard',     description: 'Comfortable, mild bruxism' },
    { value: 'hard',         label: 'Hard nightguard',     description: 'Heavy bruxism, durability' },
    { value: 'dual-laminate',label: 'Dual-laminate',       description: 'Soft inner / hard outer' },
  ],
  'full-denture': [
    { value: 'immediate',    label: 'Immediate' },
    { value: 'conventional', label: 'Conventional' },
    { value: 'overdenture',  label: 'Overdenture' },
  ],
  'partial-denture': [
    { value: 'cast-metal',   label: 'Cast metal framework' },
    { value: 'flexible',     label: 'Flexible (Valplast)' },
    { value: 'acrylic',      label: 'Acrylic' },
  ],
  'temporary-restoration': [
    { value: 'bridge', label: 'Bridge' },
    { value: 'crown',  label: 'Crown' },
    { value: 'inlay',  label: 'Inlay' },
    { value: 'onlay',  label: 'Onlay' },
    { value: 'veneer', label: 'Veneer' },
  ],
  'final-restoration': [
    { value: 'crown',        label: 'Crown' },
    { value: 'bridge',       label: 'Bridge' },
    { value: 'veneer',       label: 'Veneer' },
    { value: 'inlay',        label: 'Inlay' },
    { value: 'onlay',        label: 'Onlay' },
  ],
  'custom-abutment': [
    { value: 'titanium',     label: 'Titanium' },
    { value: 'zirconia',     label: 'Zirconia' },
    { value: 'hybrid',       label: 'Hybrid (Ti-base + Zr)' },
  ],
  'aligner': [
    { value: 'comprehensive',label: 'Comprehensive' },
    { value: 'lite',         label: 'Lite' },
    { value: 'express',      label: 'Express' },
    { value: 'retainer',     label: 'Retainer only' },
  ],
  'implant-planning': [
    { value: 'implant',             label: 'Implant' },
    { value: 'restorative-position',label: 'Restorative position' },
    { value: 'to-be-extracted',     label: 'To be extracted' },
  ],
  'surgical-guide': [
    { value: 'pilot',        label: 'Pilot guide' },
    { value: 'fully-guided', label: 'Fully guided' },
  ],
  'custom-order': [
    { value: 'other',        label: 'Custom (specify in notes)' },
  ],
};

// ─── Implant manufacturers ───────────────────────────────────

export interface ImplantManufacturer {
  value: string;
  label: string;
  blurb: string;
}

export const IMPLANT_MANUFACTURERS: ImplantManufacturer[] = [
  { value: 'nobel',     label: 'Nobel Biocare',     blurb: 'NobelActive, NobelParallel, Replace' },
  { value: 'straumann', label: 'Straumann',         blurb: 'BLT, BLX, Standard, Tissue Level' },
  { value: 'zimmer',    label: 'Zimmer Biomet',     blurb: 'Tapered Screw-Vent, Trabecular Metal' },
  { value: 'mis',       label: 'MIS',               blurb: 'C1, V3, Seven, M4' },
  { value: 'dentsply',  label: 'Dentsply Sirona',   blurb: 'Astra Tech EV, Ankylos, Xive' },
  { value: 'other',     label: 'Other',             blurb: 'Specify in notes' },
];

export const PRODUCT_LINES_BY_MANUFACTURER: Record<string, { value: string; label: string }[]> = {
  nobel: [
    { value: 'nobelactive',     label: 'NobelActive' },
    { value: 'nobelparallel',   label: 'NobelParallel CC' },
    { value: 'replace',         label: 'Replace Select' },
  ],
  straumann: [
    { value: 'blt',             label: 'BLT (Bone Level Tapered)' },
    { value: 'blx',             label: 'BLX' },
    { value: 'standard',        label: 'Standard' },
    { value: 'tissue-level',    label: 'Tissue Level' },
  ],
  zimmer: [
    { value: 'screw-vent',      label: 'Tapered Screw-Vent' },
    { value: 'trabecular',      label: 'Trabecular Metal' },
  ],
  mis: [
    { value: 'c1',              label: 'C1' },
    { value: 'v3',              label: 'V3' },
    { value: 'seven',           label: 'Seven' },
    { value: 'm4',              label: 'M4' },
  ],
  dentsply: [
    { value: 'astra-ev',        label: 'Astra Tech EV' },
    { value: 'ankylos',         label: 'Ankylos' },
    { value: 'xive',            label: 'Xive' },
  ],
  other: [
    { value: 'unspecified',     label: 'Unspecified' },
  ],
};

// ─── Support type (surgical guide only) ──────────────────────

export const SUPPORT_TYPES = [
  {
    value: 'tooth',
    label: 'Tooth-supported',
    description: 'Guide rests on adjacent teeth — best when surrounding dentition is healthy.',
  },
  {
    value: 'bone',
    label: 'Bone-supported',
    description: 'Guide rests directly on the alveolar bone — used for fully edentulous arches.',
  },
  {
    value: 'mucosa',
    label: 'Mucosa-supported',
    description: 'Guide rests on soft tissue — minimally invasive, requires accurate impression.',
  },
] as const;

export type SupportType = typeof SUPPORT_TYPES[number]['value'];

// ─── Wizard step model ───────────────────────────────────────

export type StepId = 'service' | 'details' | 'files' | 'summary';

export interface StepDefinition {
  id: StepId;
  label: string;
}

export const ALL_STEPS: StepDefinition[] = [
  { id: 'service', label: 'Select service' },
  { id: 'details', label: 'Service details' },
  { id: 'files',   label: 'Files' },
  { id: 'summary', label: 'Summary' },
];

export interface OrderDraft {
  // Universal (all services)
  service: ServiceId | null;
  provider: string | null;
  jaws: ('upper' | 'lower')[];
  procedureType: string | null;
  teeth: number[];
  manufacturer: string | null;
  productLine: string | null;
  supportType: SupportType | null;
  cbctFileName: string | null;
  prosthesisFileName: string | null;
  /** Lab-facing notes (instructions for the technician). */
  notes: string;
  /** Clinical notes (internal — for the patient chart, not the lab). */
  clinicalNotes: string;
  rush: 'standard' | 'rush' | 'super-rush';
  dueDate: string;

  // Restorative + Temporary (Final restoration, Temporary restoration)
  material: string | null;
  shadeSystem: string | null;
  shadeBody: string | null;
  shadeIncisal: string | null;
  shadeCervical: string | null;
  marginDesign: string | null;
  marginLocation: string | null;
  occlusalScheme: string | null;
  antagonist: string | null;
  contactTightness: string | null;
  cementType: string | null;

  // Invisalign / aligner
  alignerPackage: string | null;
  treatmentGoals: string[];
  angleClass: string | null;
  overjet: string;
  overbite: string;
  midlineDeviation: string;
  apStrategy: string[];

  // Custom abutment + Implant planning
  abutmentMaterial: string | null;
  emergenceHeight: string;
  angulation: string;
  retentionMethod: string | null;
  loadingProtocol: string | null;
  restorationPlan: string | null;
  medicalFlags: string[];

  // Surgical guide
  guideType: string | null;

  // Temporary restoration
  tempDuration: string | null;
  outOfOcclusionConfirmed: boolean;

  // Nightguard
  splintIndication: string | null;
  splintCoverage: string | null;
  splintThickness: string | null;
  bitePosition: string | null;
  splintServiceType: 'design' | 'design-manufacturing' | null;
  splintBorder: string | null;
  splintSurfaceType: string | null;
  splintContacts: string | null;
  upperJawFileName: string | null;
  lowerJawFileName: string | null;
  biteFileName: string | null;

  // Full + Partial denture
  dentureType: 'full' | 'copy' | 'reference' | null;
  partialType: 'flexible' | 'metal' | null;
  upperServiceType: 'design' | 'design-manufacturing' | null;
  upperDentureToothShade: string | null;
  upperDentureGingivaShade: string | null;
  upperDentureOcclusion: string | null;
  upperDentureExpanded: boolean;
  upperDentureAdvanced: boolean;
  upperDentureAesthetic: string | null;
  upperDentureMeasurements: string[];
  lowerServiceType: 'design' | 'design-manufacturing' | null;
  lowerDentureToothShade: string | null;
  lowerDentureGingivaShade: string | null;
  lowerDentureOcclusion: string | null;
  lowerDentureExpanded: boolean;
  lowerDentureAdvanced: boolean;
  lowerDentureAesthetic: string | null;
  lowerDentureMeasurements: string[];
  dentureStage: string | null;
  toothShade: string | null;
  toothMold: string | null;
  gingivalShade: string | null;
  vdo: string;
  attachmentSystem: string | null;
  kennedyClass: string | null;
  frameworkMaterial: string | null;
  majorConnector: string | null;
  /** Per-abutment clasp designs (partial denture). Key = FDI tooth #. */
  claspsByTooth: Record<number, string>;

  // Working model
  modelType: string | null;
  modelMaterial: string | null;
  baseDesign: string | null;

  // Custom order
  customDescription: string;
  contactMethod: 'phone' | 'email' | null;

  // Temp restoration: per-tooth procedure assignment
  procedureByTooth: Record<number, string>;
  /** Per-procedure (crown/bridge/inlay/onlay/veneer) options. Free-form to keep type narrow. */
  tempProcedureOptions: Record<string, Record<string, string | number | boolean>>;
  /** Custom abutment: per-tooth implant info. */
  implantByTooth: Record<number, { manufacturer?: string; line?: string; name?: string; scanBodyType?: string }>;
}

export const EMPTY_DRAFT: OrderDraft = {
  service: null,
  provider: null,
  jaws: [],
  procedureType: null,
  teeth: [],
  manufacturer: null,
  productLine: null,
  supportType: null,
  cbctFileName: null,
  prosthesisFileName: null,
  notes: '',
  clinicalNotes: '',
  rush: 'standard',
  dueDate: '',
  material: null,
  shadeSystem: null,
  shadeBody: null,
  shadeIncisal: null,
  shadeCervical: null,
  marginDesign: null,
  marginLocation: null,
  occlusalScheme: null,
  antagonist: null,
  contactTightness: null,
  cementType: null,
  alignerPackage: null,
  treatmentGoals: [],
  angleClass: null,
  overjet: '',
  overbite: '',
  midlineDeviation: '',
  apStrategy: [],
  abutmentMaterial: null,
  emergenceHeight: '',
  angulation: '',
  retentionMethod: null,
  loadingProtocol: null,
  restorationPlan: null,
  medicalFlags: [],
  guideType: null,
  tempDuration: null,
  outOfOcclusionConfirmed: false,
  splintIndication: null,
  splintCoverage: null,
  splintThickness: null,
  bitePosition: null,
  splintServiceType: null,
  splintBorder: null,
  splintSurfaceType: null,
  splintContacts: null,
  upperJawFileName: null,
  lowerJawFileName: null,
  biteFileName: null,
  dentureType: null,
  partialType: null,
  upperServiceType: null,
  upperDentureToothShade: null,
  upperDentureGingivaShade: null,
  upperDentureOcclusion: null,
  upperDentureExpanded: true,
  upperDentureAdvanced: false,
  upperDentureAesthetic: null,
  upperDentureMeasurements: [],
  lowerServiceType: null,
  lowerDentureToothShade: null,
  lowerDentureGingivaShade: null,
  lowerDentureOcclusion: null,
  lowerDentureExpanded: true,
  lowerDentureAdvanced: false,
  lowerDentureAesthetic: null,
  lowerDentureMeasurements: [],
  dentureStage: null,
  toothShade: null,
  toothMold: null,
  gingivalShade: null,
  vdo: '',
  attachmentSystem: null,
  kennedyClass: null,
  frameworkMaterial: null,
  majorConnector: null,
  claspsByTooth: {},
  modelType: null,
  modelMaterial: null,
  baseDesign: null,
  customDescription: '',
  contactMethod: null,
  procedureByTooth: {},
  tempProcedureOptions: {},
  implantByTooth: {},
};

// ─── Service-specific catalogs (clinical truth → UI options) ───────

/** Restorative materials with required occlusal clearance (mm). */
export const RESTORATION_MATERIALS = [
  { value: 'zirconia-3y',   label: 'Zirconia 3Y (monolithic)', clearanceMm: 1.0, blurb: 'Strongest, posterior workhorse' },
  { value: 'zirconia-4y',   label: 'Zirconia 4Y',              clearanceMm: 1.0, blurb: 'Balanced strength + esthetics' },
  { value: 'zirconia-5y',   label: 'Zirconia 5Y',              clearanceMm: 1.2, blurb: 'Highest translucency' },
  { value: 'emax-cad',      label: 'IPS e.max CAD',            clearanceMm: 1.5, blurb: 'Esthetic anterior, lithium disilicate' },
  { value: 'emax-press',    label: 'IPS e.max Press',          clearanceMm: 1.5, blurb: 'Pressed lithium disilicate' },
  { value: 'pfm',           label: 'PFM',                      clearanceMm: 1.5, blurb: 'Porcelain-fused-to-metal' },
  { value: 'gold-iv',       label: 'Full gold (Type IV)',      clearanceMm: 1.0, blurb: 'Gold standard for posteriors' },
  { value: 'feldspathic',   label: 'Feldspathic veneer',       clearanceMm: 0.5, blurb: 'Veneers only' },
];

export const SHADE_SYSTEMS = [
  { value: 'vita-classical', label: 'VITA Classical' },
  { value: 'vita-3d-master', label: 'VITA 3D-Master' },
  { value: 'ivoclar',        label: 'Ivoclar Chromascop' },
  { value: 'bleach',         label: 'Bleach (BL1–BL4)' },
];

export const SHADE_VALUES_VITA_CLASSICAL = [
  'A1', 'A2', 'A3', 'A3.5', 'A4',
  'B1', 'B2', 'B3', 'B4',
  'C1', 'C2', 'C3', 'C4',
  'D2', 'D3', 'D4',
];
export const SHADE_VALUES_BLEACH = ['BL1', 'BL2', 'BL3', 'BL4'];

export const MARGIN_DESIGNS = [
  { value: 'chamfer',        label: 'Chamfer' },
  { value: 'shoulder',       label: 'Shoulder' },
  { value: 'rounded-shldr',  label: 'Rounded shoulder' },
  { value: 'feather',        label: 'Feather / knife edge' },
  { value: 'deep-chamfer',   label: 'Deep chamfer' },
];

export const MARGIN_LOCATIONS = [
  { value: 'supra',  label: 'Supragingival' },
  { value: 'equi',   label: 'Equigingival' },
  { value: 'sub',    label: 'Subgingival' },
];

export const OCCLUSAL_SCHEMES = [
  { value: 'mutually-protected', label: 'Mutually protected' },
  { value: 'group-function',     label: 'Group function' },
  { value: 'canine-guidance',    label: 'Canine guidance' },
];

export const ANTAGONIST_TYPES = [
  { value: 'natural',  label: 'Natural dentition' },
  { value: 'restored', label: 'Restored (crown / onlay)' },
  { value: 'denture',  label: 'Denture' },
  { value: 'implant',  label: 'Implant' },
];

export const CONTACT_TIGHTNESS = [
  { value: 'light',  label: 'Light' },
  { value: 'normal', label: 'Normal' },
  { value: 'heavy',  label: 'Heavy' },
];

export const CEMENT_TYPES = [
  { value: 'resin-adhesive', label: 'Resin (adhesive)' },
  { value: 'rmgi',           label: 'RMGI' },
  { value: 'zinc-phosphate', label: 'Zinc phosphate' },
  { value: 'self-adhesive',  label: 'Self-adhesive resin' },
];

// ─── Aligner / Invisalign ─────────────────────────────────────

export const ALIGNER_PACKAGES = [
  { value: 'comprehensive', label: 'Comprehensive', detail: 'Unlimited aligners, complex cases' },
  { value: 'moderate',      label: 'Moderate',      detail: 'Up to 26 stages' },
  { value: 'lite',          label: 'Lite',          detail: 'Up to 14 stages' },
  { value: 'express',       label: 'Express',       detail: 'Up to 7 stages' },
  { value: 'first',         label: 'First',         detail: 'Mixed dentition / 6–10 yr' },
  { value: 'teen',          label: 'Teen',          detail: 'Eruption compensators, MA features' },
];

export const TREATMENT_GOALS = [
  { value: 'crowding',         label: 'Crowding' },
  { value: 'spacing',          label: 'Spacing' },
  { value: 'deep-bite',        label: 'Deep bite' },
  { value: 'open-bite',        label: 'Open bite' },
  { value: 'crossbite',        label: 'Crossbite' },
  { value: 'class-ii',         label: 'Class II correction' },
  { value: 'class-iii',        label: 'Class III correction' },
  { value: 'midline',          label: 'Midline correction' },
  { value: 'esthetics',        label: 'Esthetics' },
];

export const ANGLE_CLASSES = [
  { value: 'class-i',  label: 'Class I'  },
  { value: 'class-ii', label: 'Class II' },
  { value: 'class-iii',label: 'Class III'},
];

export const AP_STRATEGIES = [
  { value: 'ipr',           label: 'IPR' },
  { value: 'distalization', label: 'Distalization' },
  { value: 'expansion',     label: 'Expansion' },
  { value: 'extractions',   label: 'Extractions' },
  { value: 'class-ii-elastics', label: 'Class II elastics' },
];

// ─── Implant configuration ────────────────────────────────────

export const ABUTMENT_MATERIALS = [
  { value: 'ti-grade5',    label: 'Titanium grade 5' },
  { value: 'ti-zirconia',  label: 'Ti-base + zirconia hybrid' },
  { value: 'zirconia',     label: 'Full zirconia' },
  { value: 'gold-shaded',  label: 'Gold-shaded titanium' },
];

export const RETENTION_METHODS = [
  { value: 'screw',  label: 'Screw-retained' },
  { value: 'cement', label: 'Cement-retained' },
];

export const LOADING_PROTOCOLS = [
  { value: 'immediate',    label: 'Immediate' },
  { value: 'early',        label: 'Early' },
  { value: 'conventional', label: 'Conventional' },
];

export const RESTORATION_PLANS = [
  { value: 'single-crown', label: 'Single crown' },
  { value: 'bridge',       label: 'Bridge' },
  { value: 'overdenture',  label: 'Overdenture' },
  { value: 'all-on-x',     label: 'All-on-X (full arch fixed)' },
];

export const MEDICAL_FLAGS = [
  { value: 'bisphosphonate', label: 'Bisphosphonate history' },
  { value: 'diabetes',       label: 'Diabetes (HbA1c)' },
  { value: 'smoking',        label: 'Smoking' },
  { value: 'anticoagulants', label: 'Anticoagulants' },
  { value: 'radiation',      label: 'Head/neck radiation history' },
];

// ─── Surgical guide ──────────────────────────────────────────

export const GUIDE_TYPES = [
  { value: 'pilot',        label: 'Pilot only' },
  { value: 'partial',      label: 'Partially guided' },
  { value: 'fully-guided', label: 'Fully guided (sleeve-in-sleeve)' },
];

// ─── Temporary restoration ───────────────────────────────────

export const TEMP_DURATIONS = [
  { value: 'short', label: '1–3 weeks',  defaultMaterial: 'bis-acryl' },
  { value: 'mid',   label: '1–3 months', defaultMaterial: 'pmma-milled' },
  { value: 'long',  label: '> 3 months', defaultMaterial: 'heat-cured-acrylic' },
];

export const TEMP_MATERIALS = [
  { value: 'pmma-milled',        label: 'PMMA (milled)' },
  { value: 'bis-acryl',          label: 'Bis-acryl (Luxatemp / Protemp)' },
  { value: 'composite',          label: 'Composite' },
  { value: 'heat-cured-acrylic', label: 'Heat-cured acrylic' },
];

// ─── Nightguard / splint ────────────────────────────────────

export const SPLINT_INDICATIONS = [
  { value: 'bruxism',    label: 'Bruxism' },
  { value: 'tmd',        label: 'TMD' },
  { value: 'protective', label: 'Protective (post-restorative)' },
];

export const SPLINT_COVERAGE = [
  { value: 'full',    label: 'Full arch' },
  { value: 'partial', label: 'Partial (NTI only)' },
];

export const SPLINT_THICKNESSES = [
  { value: '1.5', label: '1.5 mm — light bruxer' },
  { value: '2.0', label: '2.0 mm — moderate' },
  { value: '2.5', label: '2.5 mm' },
  { value: '3.0', label: '3.0 mm — heavy' },
];

export const BITE_POSITIONS = [
  { value: 'mip',         label: 'MIP (intercuspal)' },
  { value: 'cr',          label: 'CR (centric relation)' },
  { value: 'therapeutic', label: 'Therapeutic position' },
];

export const SPLINT_SERVICE_TYPES = [
  { value: 'design',                label: 'Design' },
  { value: 'design-manufacturing',  label: 'Design & manufacturing' },
] as const;

export const SPLINT_BORDERS = [
  { value: 'half-height',  label: 'Straight half height of contour' },
  { value: 'scalloped',    label: 'Scalloped' },
  { value: 'full-height',  label: 'Straight full height of contour' },
];

export const SPLINT_SURFACES = [
  { value: 'smooth',     label: 'Smooth' },
  { value: 'occlusal',   label: 'Following occlusal surface' },
];

export const SPLINT_CONTACTS = [
  { value: 'posterior',        label: 'Posterior contact' },
  { value: 'anterior',         label: 'Anterior' },
  { value: 'anterior-canine',  label: 'Anterior with canine guidance' },
  { value: 'even',             label: 'Even' },
];

// ─── Custom abutment ─────────────────────────────────────────

export const SCAN_BODY_TYPES = [
  { value: 'medentika',     label: 'Medentika' },
  { value: 'sirona',        label: 'Sirona Atlantis' },
  { value: 'nt-trading',    label: 'NT-Trading' },
  { value: 'core3d',        label: 'Core3d' },
  { value: 'native',        label: 'Native scan flag' },
];

// ─── Temp restoration: per-procedure options ─────────────────

export const TEMP_SPACER_RADIAL = [
  { value: 'loose', label: 'Loose', sub: '150μm' },
  { value: 'mid',   label: 'Mid',   sub: '100μm' },
  { value: 'tight', label: 'Tight', sub: '40μm'  },
];

export const TEMP_SPACER_OCCLUSAL = TEMP_SPACER_RADIAL;

export const TEMP_VENEER_SPACER = [
  { value: 'loose', label: 'Loose', sub: '150μm' },
  { value: 'mid',   label: 'Mid',   sub: '80μm'  },
  { value: 'tight', label: 'Tight', sub: '30μm'  },
];

export const TEMP_APPROXIMAL_CONTACT = [
  { value: 'loose', label: 'Loose', sub: '-100μm' },
  { value: 'mid',   label: 'Mid',   sub: '25μm'   },
  { value: 'tight', label: 'Tight', sub: '100μm'  },
];

export const TEMP_OCCLUSAL_CONTACT = TEMP_APPROXIMAL_CONTACT;

export const TEMP_PRODUCTION_UNITS = [
  { value: 'milling',  label: 'Milling'  },
  { value: 'printing', label: 'Printing' },
];

export const TEMP_CROWN_MATERIAL_CLASSES = [
  { value: 'primeprint-temp', label: 'Primeprint temp' },
  { value: 'other',           label: 'Other' },
];

// ─── Dentures ────────────────────────────────────────────────

export const DENTURE_TYPES = [
  { value: 'full',      label: 'Full denture' },
  { value: 'copy',      label: 'Copy denture' },
  { value: 'reference', label: 'Reference denture' },
] as const;

export const PARTIAL_DENTURE_TYPES = [
  { value: 'flexible', label: 'Flexible partial denture' },
  { value: 'metal',    label: 'Metal partial denture' },
] as const;

export const DENTURE_GINGIVA_SHADES = [
  { value: 'original',     label: 'Original',     color: '#C77A4A' },
  { value: 'light',        label: 'Light',        color: '#B8623E' },
  { value: 'light-reddish',label: 'Light reddish',color: '#A8523A' },
  { value: 'dark-reddish', label: 'Dark reddish', color: '#5A3528' },
  { value: 'other',        label: 'Other',        color: 'transparent' },
];

export const DENTURE_TOOTH_AESTHETICS = [
  { value: 'premium',  label: 'Premium' },
  { value: 'standard', label: 'Standard' },
  { value: 'basic',    label: 'Basic' },
];

export const DENTURE_MEASUREMENTS = [
  { value: 'midline',         label: 'Midline' },
  { value: 'height-of-teeth', label: 'Height of teeth' },
  { value: 'canine-line',     label: 'Canine line' },
];

export const DENTURE_OCCLUSION_GUIDANCE = [
  { value: 'canine',    label: 'Canine guidance' },
  { value: 'group',     label: 'Group function' },
  { value: 'balanced',  label: 'Balanced' },
  { value: 'monoplane', label: 'Monoplane' },
];

export const DENTURE_STAGES = [
  { value: 'try-in',     label: 'Try-in' },
  { value: 'final',      label: 'Final' },
  { value: 'reline',     label: 'Reline' },
  { value: 'repair',     label: 'Repair' },
  { value: 'conversion', label: 'Conversion from existing' },
];

export const DENTURE_MATERIALS = [
  { value: 'heat-cured-pmma', label: 'Heat-cured PMMA' },
  { value: 'injected-pmma',   label: 'Injected PMMA' },
  { value: 'milled-puck',     label: 'Milled PMMA puck (digital)' },
  { value: 'printed',         label: '3D-printed (NextDent / Lucitone)' },
];

export const TOOTH_MOLDS = [
  { value: 'sr-vivodent', label: 'Ivoclar SR Vivodent', shape: 'ovoid'   as const, blurb: 'Soft natural ovoid' },
  { value: 'portrait-ipn',label: 'Dentsply Portrait IPN', shape: 'square' as const, blurb: 'Bold square' },
  { value: 'physiodent',  label: 'VITA Physiodent',       shape: 'tapered'as const, blurb: 'Slim tapered' },
];
export type ToothMoldShape = 'ovoid' | 'square' | 'tapered';

/** Clasp design options for partial dentures, keyed per abutment tooth. */
export const CLASP_DESIGNS = [
  { value: 'akers',     label: 'Akers (circumferential)' },
  { value: 'i-bar',     label: 'I-bar' },
  { value: 't-bar',     label: 'T-bar' },
  { value: 'rpi',       label: 'RPI' },
  { value: 'rpa',       label: 'RPA' },
  { value: 'embrasure', label: 'Embrasure' },
  { value: 'wrought',   label: 'Wrought wire' },
];

export const GINGIVAL_SHADES = [
  { value: 'original',    label: 'Original pink' },
  { value: 'light-pink',  label: 'Light pink' },
  { value: 'fibered',     label: 'Fibered' },
  { value: 'vein',        label: 'Vein' },
  { value: 'meharry',     label: 'Meharry (pigmented)' },
];

export const DENTURE_OCCLUSAL_SCHEMES = [
  { value: 'balanced',    label: 'Balanced' },
  { value: 'lingualized', label: 'Lingualized' },
  { value: 'monoplane',   label: 'Monoplane' },
  { value: 'anatomic-30', label: 'Anatomic 30°' },
  { value: 'anatomic-20', label: 'Anatomic 20°' },
];

export const ATTACHMENT_SYSTEMS = [
  { value: 'locator',      label: 'Locator' },
  { value: 'locator-r-tx', label: 'Locator R-Tx' },
  { value: 'ball',         label: 'Ball' },
  { value: 'bar',          label: 'Bar' },
];

export const KENNEDY_CLASSES = [
  { value: 'class-i',   label: 'Class I — bilateral distal extension' },
  { value: 'class-ii',  label: 'Class II — unilateral distal extension' },
  { value: 'class-iii', label: 'Class III — bounded edentulous' },
  { value: 'class-iv',  label: 'Class IV — anterior crossing midline' },
];

export const FRAMEWORK_MATERIALS = [
  { value: 'cocr-cast',   label: 'Cobalt-chrome (cast)' },
  { value: 'titanium',    label: 'Titanium' },
  { value: 'cocr-milled', label: 'Cobalt-chrome (milled)' },
  { value: 'cocr-printed',label: 'Cobalt-chrome (3D-printed)' },
  { value: 'peek',        label: 'PEEK' },
  { value: 'flexible',    label: 'Flexible (Valplast)' },
];

export const MAJOR_CONNECTORS = [
  { value: 'palatal-strap',   label: 'Palatal strap (max)' },
  { value: 'ap-palatal-bar',  label: 'A-P palatal bar (max)' },
  { value: 'horseshoe',       label: 'Horseshoe (max)' },
  { value: 'full-palatal',    label: 'Full palatal plate (max)' },
  { value: 'lingual-bar',     label: 'Lingual bar (mand)' },
  { value: 'lingual-plate',   label: 'Lingual plate (mand)' },
  { value: 'sublingual-bar',  label: 'Sublingual bar (mand)' },
];

// ─── Working model ──────────────────────────────────────────

export const MODEL_TYPES = [
  { value: 'solid',      label: 'Solid (study)' },
  { value: 'die',        label: 'Die model with removable dies' },
  { value: 'articulated',label: 'Articulated set' },
];

export const MODEL_MATERIALS = [
  { value: 'nextdent',  label: 'NextDent Model resin' },
  { value: 'formlabs',  label: 'Formlabs Model V3' },
  { value: 'asiga',     label: 'Asiga DentaModel' },
  { value: 'stone',     label: 'Stone (analog)' },
];

export const BASE_DESIGNS = [
  { value: 'horseshoe', label: 'Horseshoe' },
  { value: 'abo',       label: 'ABO orthodontic' },
  { value: 'ditched',   label: 'Ditched die' },
  { value: 'plain',     label: 'Plain' },
];

// ─── Universal: rush options + due-date guidance ────────────

export const RUSH_OPTIONS = [
  { value: 'standard',   label: 'Standard',   detail: 'Lab quoted lead time, no surcharge' },
  { value: 'rush',       label: 'Rush',       detail: '~2 days faster, +25% surcharge' },
  { value: 'super-rush', label: 'Super-rush', detail: '24-h turnaround, +50% surcharge' },
] as const;
export type RushOption = typeof RUSH_OPTIONS[number]['value'];

/** Typical lead time per service (business days, standard). Used for cost / ETA estimates. */
export const SERVICE_LEAD_TIME_DAYS: Record<ServiceId, number> = {
  'nightguard':            7,
  'full-denture':          21,
  'partial-denture':       14,
  'temporary-restoration': 2,
  'final-restoration':     7,
  'custom-abutment':       9,
  'aligner':               21,
  'implant-planning':      4,
  'surgical-guide':        5,
  'custom-order':          10,
};

/** Typical USD cost per service (standard, indicative — for estimate display only). */
export const SERVICE_COST_USD: Record<ServiceId, number> = {
  'nightguard':            180,
  'full-denture':          950,
  'partial-denture':       780,
  'temporary-restoration': 95,
  'final-restoration':     220,
  'custom-abutment':       310,
  'aligner':               1850,
  'implant-planning':      150,
  'surgical-guide':        290,
  'custom-order':          0,
};

export function getRelevantSteps(_service: ServiceId | null): StepDefinition[] {
  // Steps are now fixed — conditional fields render inline in step 2.
  return ALL_STEPS;
}

export function validateStep(stepId: StepId, draft: OrderDraft): { ok: boolean; message?: string } {
  switch (stepId) {
    case 'service':
      return draft.service ? { ok: true } : { ok: false, message: 'Pick a service to continue.' };
    case 'details': {
      if (!draft.service) return { ok: false, message: 'Pick a service first.' };
      const def = SERVICE_BY_ID[draft.service];
      const isDenture = draft.service === 'full-denture' || draft.service === 'partial-denture';
      const isCustomOrder = draft.service === 'custom-order';
      if (!isDenture && !isCustomOrder && !draft.provider) {
        return { ok: false, message: 'Choose a service provider.' };
      }
      if (!isDenture && !isCustomOrder && !def.requiresTeeth && draft.jaws.length === 0) {
        return { ok: false, message: 'Select at least one jaw.' };
      }
      if (!isDenture && !isCustomOrder && !draft.procedureType) {
        return { ok: false, message: 'Pick a procedure type.' };
      }
      if (def.requiresTeeth && draft.teeth.length === 0) {
        return { ok: false, message: 'Select at least one tooth.' };
      }
      if (def.requiresImplant && (!draft.manufacturer || !draft.productLine)) {
        return { ok: false, message: 'Pick an implant manufacturer and product line.' };
      }
      if (def.requiresGuideSupport && !draft.supportType) {
        return { ok: false, message: 'Pick a support type.' };
      }

      // ─── Per-service additional clinical requirements ───────
      switch (draft.service) {
        case 'final-restoration':
        case 'temporary-restoration':
          if (draft.teeth.length === 0) return { ok: false, message: 'Select position on the dental chart.' };
          break;
        case 'custom-abutment':
          if (draft.teeth.length === 0) return { ok: false, message: 'Select position on the dental chart.' };
          break;
        case 'aligner':
          if (!draft.alignerPackage) return { ok: false, message: 'Pick an aligner package.' };
          if (draft.treatmentGoals.length === 0) return { ok: false, message: 'Select at least one treatment goal.' };
          break;
        case 'nightguard':
          if (!draft.splintServiceType) return { ok: false, message: 'Pick a service type.' };
          break;
        case 'implant-planning':
          if (draft.teeth.length === 0) return { ok: false, message: 'Select position on the dental chart.' };
          break;
        case 'full-denture':
          if (!draft.dentureType) return { ok: false, message: 'Pick a denture type.' };
          break;
        case 'partial-denture':
          if (!draft.partialType) return { ok: false, message: 'Pick a partial denture type.' };
          if (draft.teeth.length === 0) return { ok: false, message: 'Select position on the dental chart.' };
          break;
        case 'working-model' as ServiceId:
          // not in catalog — placeholder for future
          break;
        case 'custom-order':
          // Free-form: allow continuing with whatever the user fills.
          break;
      }
      return { ok: true };
    }
    case 'files':
      return { ok: true };
    case 'summary':
      return { ok: true };
  }
}

// ─── Patient-scoped order record + seed data ─────────────────

export type ProductionStage =
  | 'received'
  | 'in-design'
  | 'in-production'
  | 'qa'
  | 'shipped'
  | 'delivered';

export interface ActivityEvent {
  id: string;
  timestamp: string; // ISO
  actor: string;
  kind: 'stage' | 'note' | 'message' | 'file' | 'submit';
  /** When kind === 'stage', the stage that was entered. */
  stage?: ProductionStage;
  message: string;
}

export interface LabMessage {
  id: string;
  timestamp: string;
  author: string;
  isLab: boolean;
  body: string;
}

export interface PatientOrder {
  id: string;
  service: string;
  category: string;
  status: RecordStatus;
  /** Where the order is in the lab production pipeline (post-submit). */
  productionStage?: ProductionStage;
  createdDate: string;
  dueDate?: string;
  estimatedDeliveryDate?: string;
  provider?: string;
  orderedBy: string;
  procedureType?: string;
  teeth: number[];
  manufacturer?: string;
  productLine?: string;
  supportType?: SupportType | null;
  notes?: string;
  /** Service-specific fields snapshotted at submit-time for the detail view. */
  details?: Record<string, string | number | string[] | boolean | null>;
  activity?: ActivityEvent[];
  thread?: LabMessage[];
  files?: { kind: 'cbct' | 'prosthesis' | 'photo' | 'other'; name: string }[];
}

// ─── AI autofill assistant ─────────────────────────────────

/** A single AI-generated suggestion for one OrderDraft field. */
export interface AiSuggestion {
  /** Key in OrderDraft. */
  field: keyof OrderDraft;
  /** Suggested value. Type matches the field's type at runtime. */
  value: unknown;
  /** Confidence — drives visual treatment (low confidence = quieter). */
  confidence: 'high' | 'medium' | 'low';
  /** Human-readable explanation for the tooltip. */
  reason: string;
}

/**
 * AI suggestions per service, modeled as if learned from the user's prior
 * orders + clinic-level defaults. Demo data — real implementation would
 * compute these from the prior `PatientOrder[]` history.
 */
export const AI_SUGGESTIONS_BY_SERVICE: Partial<Record<ServiceId, AiSuggestion[]>> = {
  'final-restoration': [
    { field: 'provider',         value: 'lab-a',              confidence: 'high',   reason: '8 of your last 10 restorations went to Premier Dental Lab' },
    { field: 'material',         value: 'zirconia-3y',        confidence: 'high',   reason: 'Your most-used material for posterior crowns (last 12 cases)' },
    { field: 'shadeSystem',      value: 'vita-classical',     confidence: 'high',   reason: 'Default shade system for your practice' },
    { field: 'shadeBody',        value: 'A2',                 confidence: 'medium', reason: 'A2 selected on 4 of your last 5 anterior cases' },
    { field: 'marginDesign',     value: 'chamfer',            confidence: 'high',   reason: 'Standard for zirconia crowns in your workflow' },
    { field: 'marginLocation',   value: 'equi',               confidence: 'medium', reason: 'Equigingival default for posterior teeth' },
    { field: 'occlusalScheme',   value: 'mutually-protected', confidence: 'high',   reason: 'Used in 6 of your last 7 restorations' },
    { field: 'antagonist',       value: 'natural',            confidence: 'medium', reason: 'Most common for this patient' },
    { field: 'contactTightness', value: 'normal',             confidence: 'medium', reason: 'Practice default' },
    { field: 'cementType',       value: 'rmgi',               confidence: 'medium', reason: 'Common pairing with zirconia' },
  ],
  'temporary-restoration': [
    { field: 'provider',     value: 'lab-a',          confidence: 'high',   reason: 'Your usual lab for restorations' },
    { field: 'tempDuration', value: 'mid',            confidence: 'medium', reason: 'Most temps in your practice last 1–3 months' },
    { field: 'material',     value: 'pmma-milled',    confidence: 'medium', reason: 'Default material for mid-duration temps' },
    { field: 'shadeSystem',  value: 'vita-classical', confidence: 'high',   reason: 'Default shade system' },
    { field: 'shadeBody',    value: 'A2',             confidence: 'medium', reason: 'Patient\'s recorded final shade' },
    { field: 'marginDesign', value: 'chamfer',        confidence: 'high',   reason: 'Mirrors typical final restoration margin' },
  ],
  'custom-abutment': [
    { field: 'provider',         value: 'lab-b',         confidence: 'high',   reason: 'You sent your last 6 abutments to Digital Dental Solutions' },
    { field: 'manufacturer',     value: 'straumann',     confidence: 'high',   reason: 'Patient has a Straumann implant on record (#36)' },
    { field: 'productLine',      value: 'blx',           confidence: 'high',   reason: 'BLX matches the patient\'s implant SKU' },
    { field: 'abutmentMaterial', value: 'ti-zirconia',   confidence: 'medium', reason: 'Your most-used abutment material for posteriors' },
    { field: 'retentionMethod',  value: 'screw',         confidence: 'high',   reason: 'Screw-retention used on 9 of your last 10 abutments' },
  ],
  'aligner': [
    { field: 'provider',       value: 'lab-d',                confidence: 'high',   reason: 'Aligntech is your usual destination' },
    { field: 'alignerPackage', value: 'comprehensive',        confidence: 'medium', reason: 'Most-used package in your practice' },
    { field: 'angleClass',     value: 'class-i',              confidence: 'medium', reason: 'Most common for this patient demographic' },
  ],
  'nightguard': [
    { field: 'provider',           value: 'lab-a',                confidence: 'high',   reason: 'Lab default for appliances' },
    { field: 'splintServiceType',  value: 'design-manufacturing', confidence: 'high',   reason: 'Most splint orders include manufacturing' },
    { field: 'splintBorder',       value: 'scalloped',            confidence: 'medium', reason: 'Scalloped border is the practice default' },
    { field: 'splintSurfaceType',  value: 'occlusal',             confidence: 'medium', reason: 'Following occlusal surface preserves function' },
    { field: 'splintContacts',     value: 'anterior',             confidence: 'medium', reason: 'Anterior contacts most common for bruxism' },
  ],
  'implant-planning': [
    { field: 'provider',         value: 'lab-b',           confidence: 'high',   reason: 'Digital Dental Solutions handles your implant planning' },
    { field: 'manufacturer',     value: 'straumann',       confidence: 'medium', reason: 'Most-used implant brand in your clinic' },
    { field: 'productLine',      value: 'blx',             confidence: 'medium', reason: 'BLX is your typical product line' },
    { field: 'loadingProtocol',  value: 'conventional',    confidence: 'medium', reason: 'Conventional loading is your default' },
    { field: 'restorationPlan',  value: 'single-crown',    confidence: 'medium', reason: 'Most common plan for posterior implants' },
  ],
  'surgical-guide': [
    { field: 'provider',     value: 'lab-b',         confidence: 'high',   reason: 'Same lab as the linked implant plan' },
    { field: 'manufacturer', value: 'straumann',     confidence: 'high',   reason: 'Inherited from approved implant plan' },
    { field: 'productLine',  value: 'blx',           confidence: 'high',   reason: 'Inherited from approved implant plan' },
    { field: 'guideType',    value: 'fully-guided',  confidence: 'high',   reason: 'Fully guided used on 9 of your last 10 surgical guides' },
    { field: 'supportType',  value: 'tooth',         confidence: 'medium', reason: 'Tooth-supported is the typical choice when adjacent dentition is present' },
  ],
  'full-denture': [
    { field: 'provider',      value: 'lab-c',             confidence: 'high',   reason: 'Crown & Bridge Specialists handles your dentures' },
    { field: 'dentureStage',  value: 'final',             confidence: 'medium', reason: 'Most denture orders are at final stage' },
    { field: 'material',      value: 'heat-cured-pmma',   confidence: 'high',   reason: 'Practice default material' },
    { field: 'shadeSystem',   value: 'vita-classical',    confidence: 'high',   reason: 'Default shade system' },
    { field: 'toothShade',    value: 'A2',                confidence: 'medium', reason: 'Most-used shade for your patient demographic' },
    { field: 'gingivalShade', value: 'original',          confidence: 'medium', reason: 'Practice default base shade' },
    { field: 'occlusalScheme',value: 'lingualized',       confidence: 'medium', reason: 'Your typical occlusion for full dentures' },
  ],
  'partial-denture': [
    { field: 'provider',          value: 'lab-c',         confidence: 'high',   reason: 'Crown & Bridge Specialists handles your removables' },
    { field: 'dentureStage',      value: 'final',         confidence: 'medium', reason: 'Most partials are at final stage' },
    { field: 'frameworkMaterial', value: 'cocr-cast',     confidence: 'high',   reason: 'CoCr cast is your default framework' },
    { field: 'toothShade',        value: 'A2',            confidence: 'medium', reason: 'Most-used shade for partials' },
  ],
};

/** Apply suggestions to a draft. Only fills empty fields; respects dismissed list. */
export function applyAiSuggestions(
  draft: OrderDraft,
  suggestions: AiSuggestion[],
  dismissed: Set<string>,
): { draft: OrderDraft; appliedFields: Set<string> } {
  const next: OrderDraft = { ...draft };
  const applied = new Set<string>();
  for (const s of suggestions) {
    if (dismissed.has(s.field as string)) continue;
    const current = next[s.field];
    const isEmpty =
      current === null ||
      current === '' ||
      current === false ||
      (Array.isArray(current) && current.length === 0);
    if (!isEmpty) continue;
    (next as Record<string, unknown>)[s.field as string] = s.value;
    applied.add(s.field as string);
  }
  return { draft: next, appliedFields: applied };
}

// ─── Order templates (LEGACY — kept for type compatibility, no longer rendered) ─────

export interface OrderTemplate {
  id: string;
  name: string;
  description: string;
  source: 'personal' | 'lab';
  service: ServiceId;
  prefill: Partial<OrderDraft>;
}

export const SEED_ORDER_TEMPLATES: OrderTemplate[] = [
  {
    id: 'tpl-zr-crown',
    name: 'My standard zirconia crown',
    description: 'Posterior monolithic zirconia, A2, chamfer, RMGI cement',
    source: 'personal',
    service: 'final-restoration',
    prefill: {
      provider: 'lab-a',
      material: 'zirconia-3y',
      shadeSystem: 'vita-classical',
      shadeBody: 'A2',
      marginDesign: 'chamfer',
      marginLocation: 'equi',
      occlusalScheme: 'mutually-protected',
      antagonist: 'natural',
      contactTightness: 'normal',
      cementType: 'rmgi',
    },
  },
  {
    id: 'tpl-bruxzir',
    name: 'Glidewell BruxZir crown',
    description: 'BruxZir Solid Zirconia, A2, deep chamfer',
    source: 'lab',
    service: 'final-restoration',
    prefill: {
      provider: 'lab-b',
      material: 'zirconia-3y',
      shadeSystem: 'vita-classical',
      shadeBody: 'A2',
      marginDesign: 'deep-chamfer',
      marginLocation: 'equi',
      occlusalScheme: 'mutually-protected',
      antagonist: 'natural',
      contactTightness: 'normal',
      cementType: 'self-adhesive',
    },
  },
  {
    id: 'tpl-night-hard',
    name: 'Hard nightguard, full-arch',
    description: '2 mm hard acrylic, MIP, bruxism',
    source: 'personal',
    service: 'nightguard',
    prefill: {
      splintServiceType: 'design-manufacturing',
      splintBorder: 'scalloped',
      splintSurfaceType: 'occlusal',
      splintContacts: 'anterior',
    },
  },
  {
    id: 'tpl-atlantis-tibase',
    name: 'Atlantis Ti-base + zirconia',
    description: 'Screw-retained, Ti-base + zirconia hybrid',
    source: 'lab',
    service: 'custom-abutment',
    prefill: {
      abutmentMaterial: 'ti-zirconia',
      retentionMethod: 'screw',
      manufacturer: 'nobel',
    },
  },
  {
    id: 'tpl-invisalign-comp',
    name: 'Invisalign Comprehensive — moderate crowding',
    description: 'Comprehensive package, IPR + expansion',
    source: 'personal',
    service: 'aligner',
    prefill: {
      alignerPackage: 'comprehensive',
      treatmentGoals: ['crowding'],
      apStrategy: ['ipr', 'expansion'],
      angleClass: 'class-i',
    },
  },
];

/** Apply a template's prefill onto an empty draft. */
export function applyTemplate(template: OrderTemplate): OrderDraft {
  return { ...EMPTY_DRAFT, service: template.service, ...template.prefill };
}

/** Build a draft from a previous order — used for "Duplicate". */
export function draftFromOrder(order: PatientOrder, services: ServiceDefinition[]): OrderDraft {
  const def = services.find((s) => s.name === order.service);
  return {
    ...EMPTY_DRAFT,
    service: def?.id ?? null,
    provider: order.provider ? null : null, // lab labels don't round-trip cleanly; clear and let user re-pick
    notes: order.notes ?? '',
  };
}

// ─── Production stage → label / order ───────────────────────

export const PRODUCTION_STAGES: { value: ProductionStage; label: string; subtitle: string }[] = [
  { value: 'received',      label: 'Received',      subtitle: 'Lab queued the order' },
  { value: 'in-design',     label: 'In design',     subtitle: 'Tech is designing in CAD' },
  { value: 'in-production', label: 'In production', subtitle: 'Milling / printing / casting' },
  { value: 'qa',            label: 'QA',            subtitle: 'Final inspection' },
  { value: 'shipped',       label: 'Shipped',       subtitle: 'On the way to your office' },
  { value: 'delivered',     label: 'Delivered',     subtitle: 'Marked received' },
];

export function stageIndex(stage?: ProductionStage): number {
  if (!stage) return -1;
  return PRODUCTION_STAGES.findIndex((s) => s.value === stage);
}

export const SEED_PATIENT_ORDERS: PatientOrder[] = [
  {
    id: 'po-1',
    service: 'Final restoration',
    category: 'Restorative',
    status: 'in-progress',
    productionStage: 'in-production',
    createdDate: '2026-04-22',
    dueDate: '2026-05-09',
    estimatedDeliveryDate: '2026-05-08',
    provider: 'Premier Dental Lab',
    orderedBy: 'Dr. A. Whitaker',
    procedureType: 'Crown',
    teeth: [14],
    details: { material: 'Zirconia 3Y', shade: 'A2' },
    activity: [
      { id: 'a1', timestamp: '2026-04-22T09:14:00Z', actor: 'Dr. A. Whitaker', kind: 'submit',  message: 'Order submitted to Premier Dental Lab.' },
      { id: 'a2', timestamp: '2026-04-22T11:02:00Z', actor: 'Premier Dental Lab', kind: 'stage', stage: 'received',     message: 'Stage: Received.' },
      { id: 'a3', timestamp: '2026-04-23T08:30:00Z', actor: 'Sarah (Lab)',         kind: 'note',  message: 'Scan quality OK. Beginning CAD design.' },
      { id: 'a4', timestamp: '2026-04-23T08:31:00Z', actor: 'Premier Dental Lab', kind: 'stage', stage: 'in-design',    message: 'Stage: In design.' },
      { id: 'a5', timestamp: '2026-04-26T14:22:00Z', actor: 'Premier Dental Lab', kind: 'stage', stage: 'in-production',message: 'Stage: In production.' },
    ],
    thread: [
      { id: 'm1', timestamp: '2026-04-23T08:30:00Z', author: 'Sarah (Lab)', isLab: true,  body: 'Hi Dr. Whitaker — confirming A2 body shade with neutral incisal. Sound right?' },
      { id: 'm2', timestamp: '2026-04-23T09:18:00Z', author: 'Dr. A. Whitaker', isLab: false, body: 'Yes — A2 throughout. Patient prefers a flatter incisal edge.' },
    ],
    files: [{ kind: 'prosthesis', name: 'tooth-14-prep.stl' }],
  },
  {
    id: 'po-2',
    service: 'Surgical guide',
    category: 'Surgical',
    status: 'submitted',
    productionStage: 'in-design',
    createdDate: '2026-04-28',
    dueDate: '2026-05-12',
    estimatedDeliveryDate: '2026-05-10',
    provider: 'Digital Dental Solutions',
    orderedBy: 'Dr. A. Whitaker',
    procedureType: 'Fully guided',
    teeth: [36, 46],
    manufacturer: 'Straumann',
    productLine: 'BLX',
    supportType: 'tooth',
    activity: [
      { id: 'b1', timestamp: '2026-04-28T10:08:00Z', actor: 'Dr. A. Whitaker', kind: 'submit', message: 'Order submitted to Digital Dental Solutions.' },
      { id: 'b2', timestamp: '2026-04-28T11:55:00Z', actor: 'Digital Dental', kind: 'stage', stage: 'received', message: 'Stage: Received.' },
      { id: 'b3', timestamp: '2026-04-29T09:00:00Z', actor: 'Digital Dental', kind: 'stage', stage: 'in-design', message: 'Stage: In design.' },
    ],
    thread: [],
    files: [{ kind: 'cbct', name: 'cbct-2026-04-25.zip' }, { kind: 'prosthesis', name: 'arch-scan.stl' }],
  },
  {
    id: 'po-3',
    service: 'Nightguard',
    category: 'Appliance',
    status: 'draft',
    createdDate: '2026-04-30',
    orderedBy: 'Dr. A. Whitaker',
    procedureType: 'Hard nightguard',
    teeth: [],
    activity: [],
    thread: [],
  },
];

// ─── Filter dropdown options (for the tab toolbar) ───────────

export const STATUS_FILTER_OPTIONS = [
  { value: 'all',         label: 'All statuses' },
  { value: 'draft',       label: 'Draft' },
  { value: 'submitted',   label: 'Submitted' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'completed',   label: 'Completed' },
  { value: 'cancelled',   label: 'Cancelled' },
];

export const SERVICE_FILTER_OPTIONS = [
  { value: 'all', label: 'All services' },
  ...SERVICES.map((s) => ({ value: s.id, label: s.name })),
];

export const DATE_FILTER_OPTIONS = [
  { value: 'any',     label: 'Any time' },
  { value: 'today',   label: 'Today' },
  { value: 'week',    label: 'This week' },
  { value: 'month',   label: 'This month' },
  { value: 'quarter', label: 'Last 3 months' },
];
