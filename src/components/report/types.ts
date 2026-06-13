// ─── Report Block Types ──────────────────────────────────────────────────────

export type BlockType =
  | 'image'
  | 'notes'
  | 'section-title'
  | 'diagnosis'
  | 'treatment'
  | 'cost-summary'
  | 'comparison'
  | 'rx'
  | 'next-appointment'
  | 'patient-instructions';

export interface BaseBlock {
  id: string;
  type: BlockType;
  collapsed: boolean;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  file: File | null;
  previewUrl: string;
  title: string;
  notes: string;
  teeth: number[];
  diagnosis: string;
  treatment: string;
  estimatedCost: string;
  treatmentDate: string;
  annotations: Annotation[];
  showClinicalFields: boolean;
}

export interface NotesBlock extends BaseBlock {
  type: 'notes';
  content: string;
}

export interface SectionTitleBlock extends BaseBlock {
  type: 'section-title';
  title: string;
}

export interface DiagnosisBlock extends BaseBlock {
  type: 'diagnosis';
  diagnosis: string;
  teeth: number[];
  severity: 'mild' | 'moderate' | 'severe' | '';
}

export interface TreatmentBlock extends BaseBlock {
  type: 'treatment';
  treatment: string;
  teeth: number[];
  estimatedCost: string;
  treatmentDate: string;
}

export interface CostSummaryBlock extends BaseBlock {
  type: 'cost-summary';
  /** Free-text summary content. */
  content: string;
  /** @deprecated legacy itemized list — kept optional for back-compat. */
  items?: CostItem[];
}

export interface CostItem {
  id: string;
  description: string;
  amount: string;
}

export interface ComparisonBlock extends BaseBlock {
  type: 'comparison';
  labelA: string;
  labelB: string;
  imageA: { file: File | null; previewUrl: string };
  imageB: { file: File | null; previewUrl: string };
  notes: string;
}

export interface RxItem {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface RxBlock extends BaseBlock {
  type: 'rx';
  items: RxItem[];
  notes: string;
}

export interface NextAppointmentBlock extends BaseBlock {
  type: 'next-appointment';
  date: string;
  time: string;
  procedure: string;
  instructions: string;
}

export interface InstructionItem {
  id: string;
  text: string;
}

export interface PatientInstructionsBlock extends BaseBlock {
  type: 'patient-instructions';
  title: string;
  items: InstructionItem[];
}

export type ReportBlock =
  | ImageBlock
  | NotesBlock
  | SectionTitleBlock
  | DiagnosisBlock
  | TreatmentBlock
  | CostSummaryBlock
  | ComparisonBlock
  | RxBlock
  | NextAppointmentBlock
  | PatientInstructionsBlock;

// ─── Annotation ──────────────────────────────────────────────────────────────

export type AnnotationType = 'circle' | 'arrow' | 'line' | 'text' | 'highlight';

export interface Annotation {
  id: string;
  type: AnnotationType;
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  radius?: number;
  label?: string;
  color: string;
}

// ─── Report Meta ─────────────────────────────────────────────────────────────

export interface PatientInfo {
  patientName: string;
  birthDate: string;
  chartNumber: string;
}

export interface ReportSettings {
  reportName: string;
  doctorName: string;
  doctorImageUrl: string;
  clinicName: string;
  clinicLogoUrl: string;
  pinEnabled: boolean;
  pin: string;
  signatureUrl: string;
  signatureMethod: 'upload' | 'draw' | 'saved' | '';
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  blocks: Omit<ReportBlock, 'id'>[];
}

// ─── Block Factories ─────────────────────────────────────────────────────────

let _blockId = 0;
const uid = () => `block-${++_blockId}-${Date.now()}`;

export function createImageBlock(): ImageBlock {
  return {
    id: uid(), type: 'image', collapsed: false,
    file: null, previewUrl: '', title: '', notes: '',
    teeth: [], diagnosis: '', treatment: '',
    estimatedCost: '', treatmentDate: '',
    annotations: [], showClinicalFields: false,
  };
}

export function createNotesBlock(): NotesBlock {
  return { id: uid(), type: 'notes', collapsed: false, content: '' };
}

export function createSectionTitleBlock(title = ''): SectionTitleBlock {
  return { id: uid(), type: 'section-title', collapsed: false, title };
}

export function createDiagnosisBlock(): DiagnosisBlock {
  return { id: uid(), type: 'diagnosis', collapsed: false, diagnosis: '', teeth: [], severity: '' };
}

export function createTreatmentBlock(): TreatmentBlock {
  return { id: uid(), type: 'treatment', collapsed: false, treatment: '', teeth: [], estimatedCost: '', treatmentDate: '' };
}

export function createCostSummaryBlock(): CostSummaryBlock {
  return { id: uid(), type: 'cost-summary', collapsed: false, content: '' };
}

export function createComparisonBlock(): ComparisonBlock {
  return {
    id: uid(), type: 'comparison', collapsed: false,
    labelA: 'Before', labelB: 'After', notes: '',
    imageA: { file: null, previewUrl: '' },
    imageB: { file: null, previewUrl: '' },
  };
}

export function createRxBlock(): RxBlock {
  return {
    id: uid(), type: 'rx', collapsed: false, notes: '',
    items: [{ id: uid(), medication: '', dosage: '', frequency: '', duration: '' }],
  };
}

export function createNextAppointmentBlock(): NextAppointmentBlock {
  return {
    id: uid(), type: 'next-appointment', collapsed: false,
    date: '', time: '', procedure: '', instructions: '',
  };
}

export function createPatientInstructionsBlock(): PatientInstructionsBlock {
  return {
    id: uid(), type: 'patient-instructions', collapsed: false,
    title: 'Post-Treatment Instructions',
    items: [{ id: uid(), text: '' }],
  };
}

/** Dispatcher used by callers that just have a `BlockType` string. */
export function createBlock(type: BlockType): ReportBlock {
  switch (type) {
    case 'image':                return createImageBlock();
    case 'notes':                return createNotesBlock();
    case 'section-title':        return createSectionTitleBlock();
    case 'diagnosis':            return createDiagnosisBlock();
    case 'treatment':            return createTreatmentBlock();
    case 'cost-summary':         return createCostSummaryBlock();
    case 'comparison':           return createComparisonBlock();
    case 'rx':                   return createRxBlock();
    case 'next-appointment':     return createNextAppointmentBlock();
    case 'patient-instructions': return createPatientInstructionsBlock();
  }
}

// ─── Block metadata for the "Add block" menu ────────────────────────────────

export const BLOCK_CATALOG: { type: BlockType; label: string; description: string }[] = [
  { type: 'image',         label: 'Image',            description: 'Clinical photo with notes' },
  { type: 'notes',         label: 'Notes',            description: 'Free-form text block' },
  { type: 'section-title', label: 'Section Title',    description: 'Section heading divider' },
  { type: 'diagnosis',     label: 'Diagnosis',        description: 'Diagnosis with tooth reference' },
  { type: 'treatment',     label: 'Treatment',        description: 'Treatment plan and cost' },
  { type: 'cost-summary',  label: 'Cost Summary',     description: 'Free-text cost summary' },
  { type: 'comparison',    label: 'Before / After',   description: 'Side-by-side comparison' },
  { type: 'rx',              label: 'Prescription',     description: 'Medication & dosage details' },
  { type: 'next-appointment', label: 'Next Appointment', description: 'Schedule follow-up visit' },
  { type: 'patient-instructions', label: 'Patient Instructions', description: 'Post-treatment care checklist' },
];

// ─── Templates ───────────────────────────────────────────────────────────────

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'general',
    name: 'General Scan Report',
    description: 'Standard clinical scan with images and notes',
    blocks: [
      { type: 'image', collapsed: false, file: null, previewUrl: '', title: 'Full arch scan', notes: '', teeth: [], diagnosis: '', treatment: '', estimatedCost: '', treatmentDate: '', annotations: [], showClinicalFields: false },
      { type: 'image', collapsed: false, file: null, previewUrl: '', title: 'Area of concern', notes: '', teeth: [], diagnosis: '', treatment: '', estimatedCost: '', treatmentDate: '', annotations: [], showClinicalFields: true },
      { type: 'notes', collapsed: false, content: '' },
    ],
  },
  {
    id: 'implant',
    name: 'Implant Planning',
    description: 'Pre-operative implant assessment',
    blocks: [
      { type: 'image', collapsed: false, file: null, previewUrl: '', title: 'Pre-operative scan', notes: '', teeth: [19], diagnosis: 'Missing tooth', treatment: 'Implant placement', estimatedCost: '', treatmentDate: '', annotations: [], showClinicalFields: true },
      { type: 'image', collapsed: false, file: null, previewUrl: '', title: 'Implant planning view', notes: '', teeth: [19], diagnosis: '', treatment: '', estimatedCost: '', treatmentDate: '', annotations: [], showClinicalFields: false },
      { type: 'cost-summary', collapsed: false, content: 'Implant placement — $2,500\nAbutment — $800\nCrown — $1,200' },
      { type: 'rx', collapsed: false, notes: '', items: [{ id: 'tpl-rx1', medication: 'Amoxicillin', dosage: '500mg', frequency: '3x daily', duration: '7 days' }, { id: 'tpl-rx2', medication: 'Ibuprofen', dosage: '600mg', frequency: 'Every 6 hours as needed', duration: '5 days' }] },
      { type: 'patient-instructions', collapsed: false, title: 'Post-Surgical Instructions', items: [{ id: 'tpl-pi1', text: 'Apply ice packs for 20 min on / 20 min off for the first 24 hours' }, { id: 'tpl-pi2', text: 'Eat soft foods for the first 48 hours' }, { id: 'tpl-pi3', text: 'Do not rinse, spit, or use a straw for 24 hours' }, { id: 'tpl-pi4', text: 'Take prescribed antibiotics as directed' }] },
      { type: 'next-appointment', collapsed: false, date: '', time: '', procedure: 'Post-op check & suture removal', instructions: 'Bring any medications you are currently taking' },
    ],
  },
  {
    id: 'crown',
    name: 'Crown Preparation',
    description: 'Crown prep documentation',
    blocks: [
      { type: 'image', collapsed: false, file: null, previewUrl: '', title: 'Initial tooth condition', notes: '', teeth: [5], diagnosis: 'Fractured cusp', treatment: 'Full crown restoration', estimatedCost: '$1,200', treatmentDate: '', annotations: [], showClinicalFields: true },
      { type: 'comparison', collapsed: false, labelA: 'Before prep', labelB: 'After prep', notes: '', imageA: { file: null, previewUrl: '' }, imageB: { file: null, previewUrl: '' } },
      { type: 'cost-summary', collapsed: false, content: 'Crown preparation — $400\nCeramic crown — $1,200' },
      { type: 'patient-instructions', collapsed: false, title: 'Temporary Crown Care', items: [{ id: 'tpl-ci1', text: 'Avoid sticky or hard foods on the temporary crown' }, { id: 'tpl-ci2', text: 'Brush gently around the temporary crown' }, { id: 'tpl-ci3', text: 'Call the office if the temporary crown comes loose' }] },
      { type: 'next-appointment', collapsed: false, date: '', time: '', procedure: 'Permanent crown cementation', instructions: 'Appointment takes approximately 30 minutes' },
    ],
  },
  {
    id: 'followup',
    name: 'Follow-up Visit',
    description: 'Progress tracking with before/after',
    blocks: [
      { type: 'comparison', collapsed: false, labelA: 'Previous visit', labelB: 'Current visit', notes: '', imageA: { file: null, previewUrl: '' }, imageB: { file: null, previewUrl: '' } },
      { type: 'image', collapsed: false, file: null, previewUrl: '', title: 'Current condition', notes: '', teeth: [], diagnosis: 'Healing as expected', treatment: 'Continue monitoring', estimatedCost: '', treatmentDate: '', annotations: [], showClinicalFields: true },
      { type: 'notes', collapsed: false, content: '' },
      { type: 'rx', collapsed: false, notes: '', items: [{ id: 'tpl-frx1', medication: '', dosage: '', frequency: '', duration: '' }] },
      { type: 'next-appointment', collapsed: false, date: '', time: '', procedure: 'Follow-up check', instructions: '' },
    ],
  },
];
