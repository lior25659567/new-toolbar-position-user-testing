// ─── Report Block Types ──────────────────────────────────────────────────────

export type BlockType =
  | 'image'
  | 'notes'
  | 'section-title'
  | 'diagnosis'
  | 'treatment'
  | 'cost-summary'
  | 'comparison';

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
  items: CostItem[];
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

export type ReportBlock =
  | ImageBlock
  | NotesBlock
  | SectionTitleBlock
  | DiagnosisBlock
  | TreatmentBlock
  | CostSummaryBlock
  | ComparisonBlock;

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
  return { id: uid(), type: 'cost-summary', collapsed: false, items: [{ id: uid(), description: '', amount: '' }] };
}

export function createComparisonBlock(): ComparisonBlock {
  return {
    id: uid(), type: 'comparison', collapsed: false,
    labelA: 'Before', labelB: 'After', notes: '',
    imageA: { file: null, previewUrl: '' },
    imageB: { file: null, previewUrl: '' },
  };
}

// ─── Block metadata for the "Add block" menu ────────────────────────────────

export const BLOCK_CATALOG: { type: BlockType; label: string; description: string }[] = [
  { type: 'image',         label: 'Image',            description: 'Clinical photo with notes' },
  { type: 'notes',         label: 'Notes',            description: 'Free-form text block' },
  { type: 'section-title', label: 'Section Title',    description: 'Section heading divider' },
  { type: 'diagnosis',     label: 'Diagnosis',        description: 'Diagnosis with tooth reference' },
  { type: 'treatment',     label: 'Treatment',        description: 'Treatment plan and cost' },
  { type: 'cost-summary',  label: 'Cost Summary',     description: 'Itemized cost table' },
  { type: 'comparison',    label: 'Before / After',   description: 'Side-by-side comparison' },
];

// ─── Templates ───────────────────────────────────────────────────────────────

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'general',
    name: 'General Scan Report',
    description: 'Standard clinical scan with images and notes',
    blocks: [
      { type: 'image', collapsed: false, file: null, previewUrl: '', title: 'Full arch scan', notes: 'Replace with your clinical scan image', teeth: [], diagnosis: '', treatment: '', estimatedCost: '', treatmentDate: '', annotations: [], showClinicalFields: false },
      { type: 'image', collapsed: false, file: null, previewUrl: '', title: 'Area of concern', notes: 'Add detailed view of the region of interest', teeth: [], diagnosis: 'Replace with diagnosis', treatment: 'Replace with treatment plan', estimatedCost: '', treatmentDate: '', annotations: [], showClinicalFields: true },
    ],
  },
  {
    id: 'implant',
    name: 'Implant Planning',
    description: 'Pre-operative implant assessment',
    blocks: [
      { type: 'image', collapsed: false, file: null, previewUrl: '', title: 'Pre-operative scan', notes: 'Replace with pre-op scan image', teeth: [19], diagnosis: 'Missing tooth', treatment: 'Implant placement', estimatedCost: '', treatmentDate: '', annotations: [], showClinicalFields: true },
      { type: 'image', collapsed: false, file: null, previewUrl: '', title: 'Implant planning view', notes: 'Replace with planning software screenshot', teeth: [19], diagnosis: '', treatment: '', estimatedCost: '', treatmentDate: '', annotations: [], showClinicalFields: false },
      { type: 'cost-summary', collapsed: false, items: [{ id: 'tpl-1', description: 'Implant placement', amount: '$2,500' }, { id: 'tpl-2', description: 'Abutment', amount: '$800' }, { id: 'tpl-3', description: 'Crown', amount: '$1,200' }] },
    ],
  },
  {
    id: 'crown',
    name: 'Crown Preparation',
    description: 'Crown prep documentation',
    blocks: [
      { type: 'image', collapsed: false, file: null, previewUrl: '', title: 'Initial tooth condition', notes: 'Replace with initial scan of the tooth', teeth: [5], diagnosis: 'Fractured cusp', treatment: 'Full crown restoration', estimatedCost: '$1,200', treatmentDate: '', annotations: [], showClinicalFields: true },
      { type: 'comparison', collapsed: false, labelA: 'Before prep', labelB: 'After prep', notes: 'Replace images with before and after preparation scans', imageA: { file: null, previewUrl: '' }, imageB: { file: null, previewUrl: '' } },
      { type: 'cost-summary', collapsed: false, items: [{ id: 'tpl-c1', description: 'Crown preparation', amount: '$400' }, { id: 'tpl-c2', description: 'Ceramic crown', amount: '$1,200' }] },
    ],
  },
  {
    id: 'followup',
    name: 'Follow-up Visit',
    description: 'Progress tracking with before/after',
    blocks: [
      { type: 'comparison', collapsed: false, labelA: 'Previous visit', labelB: 'Current visit', notes: 'Replace with comparison images showing treatment progress', imageA: { file: null, previewUrl: '' }, imageB: { file: null, previewUrl: '' } },
      { type: 'image', collapsed: false, file: null, previewUrl: '', title: 'Current condition', notes: 'Replace with current scan showing healing progress', teeth: [], diagnosis: 'Healing as expected', treatment: 'Continue monitoring', estimatedCost: '', treatmentDate: '', annotations: [], showClinicalFields: true },
    ],
  },
];
