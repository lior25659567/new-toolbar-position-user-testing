// ─── Patient ─────────────────────────────────────────────────
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string; // ISO date
  chartNumber: string;
}

// ─── Procedure ───────────────────────────────────────────────
export type ProcedureType =
  | "study-model"
  | "invisalign"
  | "fixed-restorative"
  | "implant-planning"
  | "dentures"
  | "appliance";

// ─── Per-tooth config ────────────────────────────────────────
export type ToothProcedure =
  | "crown"
  | "bridge"
  | "veneer"
  | "inlay"
  | "onlay"
  | "eggshell"
  | "mockup"
  | "missing"
  | "implant-based";

export interface ToothSpec {
  toothNumber: number; // FDI: 11-48
  procedure: ToothProcedure;
  material?: string;
  shadeSystem?: string;
  shadeBody?: string;
  groupId?: string;
}

// ─── Scan options ────────────────────────────────────────────
export interface ScanOptions {
  niri: boolean;
  palatal: boolean;
  gingival: boolean;
  multiBite: boolean;
  sleeveAttached: boolean;
  preTreatment: boolean;
  dentureCopy: boolean;
}

// ─── Denture config ──────────────────────────────────────────
export type ArchSelection = "upper" | "lower" | "both";

// ─── Root info state ─────────────────────────────────────────
export interface InfoState {
  // Patient
  patient: Patient | null;
  patientSearchQuery: string;
  isCreatingPatient: boolean;

  // Procedure
  selectedProcedure: ProcedureType | null;

  // Shared config
  dueDate: string;
  sendTo: string;
  notes: string;
  attachments: File[];

  // Fixed Restorative
  selectedTeeth: number[];
  toothSpecs: ToothSpec[];

  // Invisalign
  invisalignType: string;
  treatmentStage: string;

  // Dentures
  archSelection: ArchSelection;
  dentureType: string;
  dentureStage: string;
  dentureMould: string;
  dentureShadeSystem: string;
  dentureTeethShade: string;
  dentureGingival: string;

  // Scan options
  scanOptions: ScanOptions;

  // UI state
  expandedTeeth: number[];
}

// ─── Case info (serialized for passing to Scan/View/Send) ────
export interface CaseInfo {
  patient: Patient;
  procedure: ProcedureType;
  dueDate: string;
  sendTo: string;
  notes: string;
  selectedTeeth: number[];
  toothSpecs: ToothSpec[];
  scanOptions: ScanOptions;
  archSelection: ArchSelection;
  invisalignType: string;
  treatmentStage: string;
  dentureType: string;
  dentureStage: string;
}

// ─── Tag color mapping ───────────────────────────────────────
export type TagColor = string;
