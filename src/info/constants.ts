import type { ProcedureType, ToothProcedure, TagColor, ScanOptions } from "./types";

// ─── Procedure definitions ───────────────────────────────────
export interface ProcedureDefinition {
  id: ProcedureType;
  name: string;
  description: string;
  icon: string; // SVG path or emoji placeholder
}

export const PROCEDURES: ProcedureDefinition[] = [
  { id: "study-model", name: "Study Model", description: "Diagnostic study models for analysis", icon: "study" },
  { id: "invisalign", name: "Invisalign", description: "Clear aligner orthodontic treatment", icon: "invisalign" },
  { id: "fixed-restorative", name: "Fixed Restorative", description: "Crowns, bridges, veneers, inlays", icon: "restorative" },
  { id: "implant-planning", name: "Implant Planning", description: "Implant surgical guide planning", icon: "implant" },
  { id: "dentures", name: "Dentures", description: "Full or partial denture fabrication", icon: "dentures" },
  { id: "appliance", name: "Appliance", description: "Orthodontic or dental appliances", icon: "appliance" },
];

// ─── FDI tooth numbering ─────────────────────────────────────
export const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
export const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
export const ALL_TEETH = [...UPPER_TEETH, ...LOWER_TEETH];

// ─── Tooth procedure options ─────────────────────────────────
export const TOOTH_PROCEDURES: { value: ToothProcedure; label: string }[] = [
  { value: "crown", label: "Crown" },
  { value: "bridge", label: "Bridge" },
  { value: "veneer", label: "Veneer" },
  { value: "inlay", label: "Inlay" },
  { value: "onlay", label: "Onlay" },
  { value: "eggshell", label: "Eggshell" },
  { value: "mockup", label: "Mockup" },
  { value: "missing", label: "Missing" },
  { value: "implant-based", label: "Implant Based" },
];

// ─── Color coding per procedure ──────────────────────────────
export const TOOTH_PROCEDURE_COLORS: Record<ToothProcedure, string> = {
  crown: "#9F00A7",
  bridge: "#5FD4C4",
  veneer: "#F5C563",
  inlay: "#F9A8D4",
  onlay: "#AB8ED9",
  eggshell: "#6B8BF5",
  mockup: "#7C3AED",
  missing: "#D4D4D8",
  "implant-based": "#EF4444",
};

// ─── Materials ───────────────────────────────────────────────
export const MATERIALS = [
  { value: "zirconia", label: "Zirconia" },
  { value: "emax", label: "E.max" },
  { value: "pfm", label: "PFM" },
  { value: "gold", label: "Gold" },
  { value: "composite", label: "Composite" },
  { value: "titanium", label: "Titanium" },
];

// ─── Shade systems and their shade options ───────────────────
export const SHADE_SYSTEMS = [
  { value: "vita-classical", label: "VITA Classical" },
  { value: "vita-3d-master", label: "VITA 3D Master" },
  { value: "ivoclar", label: "Ivoclar" },
];

export const SHADE_OPTIONS: Record<string, string[]> = {
  "vita-classical": [
    "A1", "A2", "A3", "A3.5", "A4",
    "B1", "B2", "B3", "B4",
    "C1", "C2", "C3", "C4",
    "D2", "D3", "D4",
  ],
  "vita-3d-master": [
    "0M1", "0M2", "0M3",
    "1M1", "1M2",
    "2L1.5", "2L2.5", "2M1", "2M2", "2M3", "2R1.5", "2R2.5",
    "3L1.5", "3L2.5", "3M1", "3M2", "3M3", "3R1.5", "3R2.5",
    "4L1.5", "4L2.5", "4M1", "4M2", "4M3", "4R1.5", "4R2.5",
    "5M1", "5M2", "5M3",
  ],
  ivoclar: [
    "BL1", "BL2", "BL3", "BL4",
    "A1", "A2", "A3",
    "B1", "B2",
    "C1", "C2",
    "D2", "D3",
  ],
};

// ─── Invisalign options ──────────────────────────────────────
export const INVISALIGN_TYPES = [
  { value: "comprehensive", label: "Comprehensive" },
  { value: "lite", label: "Lite" },
  { value: "express", label: "Express" },
  { value: "first", label: "First" },
  { value: "go", label: "Go" },
];

export const TREATMENT_STAGES = [
  { value: "initial", label: "Initial" },
  { value: "refinement", label: "Refinement" },
  { value: "retainer", label: "Retainer" },
];

// ─── Denture options ─────────────────────────────────────────
export const DENTURE_TYPES = [
  { value: "complete", label: "Complete Denture" },
  { value: "partial", label: "Partial Denture" },
  { value: "immediate", label: "Immediate Denture" },
  { value: "overdenture", label: "Overdenture" },
];

export const DENTURE_STAGES = [
  { value: "impression", label: "Impression" },
  { value: "try-in", label: "Try-in" },
  { value: "final", label: "Final" },
  { value: "reline", label: "Reline" },
  { value: "repair", label: "Repair" },
];

export const DENTURE_MOULDS = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "square", label: "Square" },
  { value: "ovoid", label: "Ovoid" },
  { value: "tapered", label: "Tapered" },
];

// ─── Lab destinations ────────────────────────────────────────
export const LAB_DESTINATIONS = [
  { value: "lab-a", label: "Premier Dental Lab" },
  { value: "lab-b", label: "Digital Dental Solutions" },
  { value: "lab-c", label: "Crown & Bridge Specialists" },
  { value: "lab-d", label: "Aligntech Lab" },
];

// ─── Scan options per procedure ──────────────────────────────
export type ScanOptionKey = keyof ScanOptions;

export const PROCEDURE_SCAN_OPTIONS: Record<ProcedureType, ScanOptionKey[]> = {
  "study-model": ["niri", "palatal", "gingival", "multiBite"],
  invisalign: ["niri", "palatal", "gingival"],
  "fixed-restorative": [],
  "implant-planning": [],
  dentures: ["niri", "sleeveAttached", "preTreatment", "dentureCopy"],
  appliance: ["niri", "sleeveAttached", "multiBite"],
};

export const SCAN_OPTION_LABELS: Record<ScanOptionKey, string> = {
  niri: "NIRI capture",
  palatal: "Palatal",
  gingival: "Gingival feedback",
  multiBite: "Multi bite",
  sleeveAttached: "Sleeve attached",
  preTreatment: "Pre treatment",
  dentureCopy: "Denture copy",
};

// ─── Mock patient data ───────────────────────────────────────
export const MOCK_PATIENTS = [
  { id: "p1", firstName: "John", lastName: "Smith", gender: "male" as const, dateOfBirth: "1985-03-15", chartNumber: "CH-001" },
  { id: "p2", firstName: "Sarah", lastName: "Johnson", gender: "female" as const, dateOfBirth: "1990-07-22", chartNumber: "CH-002" },
  { id: "p3", firstName: "Michael", lastName: "Williams", gender: "male" as const, dateOfBirth: "1978-11-08", chartNumber: "CH-003" },
  { id: "p4", firstName: "Emily", lastName: "Brown", gender: "female" as const, dateOfBirth: "1995-01-30", chartNumber: "CH-004" },
  { id: "p5", firstName: "David", lastName: "Davis", gender: "male" as const, dateOfBirth: "1982-09-12", chartNumber: "CH-005" },
];
