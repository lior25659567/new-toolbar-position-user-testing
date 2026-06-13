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

// ─── Per-tooth restoration detail options ────────────────────
export const SPECIFICATIONS = [
  { value: "full-anatomic", label: "Full anatomic" },
  { value: "reduced", label: "Reduced / cutback" },
  { value: "coping", label: "Coping" },
  { value: "framework", label: "Framework" },
];

export const PREP_DESIGNS = [
  { value: "chamfer", label: "Chamfer" },
  { value: "shoulder", label: "Shoulder" },
  { value: "rounded-shoulder", label: "Rounded shoulder" },
  { value: "feather-edge", label: "Feather edge" },
  { value: "bevel", label: "Bevel" },
];

export const MARGIN_DESIGNS = [
  { value: "supragingival", label: "Supragingival" },
  { value: "equigingival", label: "Equigingival" },
  { value: "subgingival", label: "Subgingival" },
];

export const INCISAL_OPTIONS = [
  { value: "low", label: "Low translucency" },
  { value: "medium", label: "Medium translucency" },
  { value: "high", label: "High translucency" },
  { value: "opalescent", label: "Opalescent" },
];

export const GINGIVAL_OPTIONS = [
  { value: "g1", label: "G1" },
  { value: "g2", label: "G2" },
  { value: "g3", label: "G3" },
  { value: "g4", label: "G4" },
];

export const STUMP_SHADES = [
  { value: "nd1", label: "ND1" },
  { value: "nd2", label: "ND2" },
  { value: "nd3", label: "ND3" },
  { value: "nd4", label: "ND4" },
  { value: "nd5", label: "ND5" },
  { value: "nd6", label: "ND6" },
  { value: "nd7", label: "ND7" },
  { value: "nd8", label: "ND8" },
  { value: "nd9", label: "ND9" },
];

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
  { id: "p1",  firstName: "John",      lastName: "Smith",     gender: "male"   as const, dateOfBirth: "1985-03-15", chartNumber: "CH-001" },
  { id: "p2",  firstName: "Sarah",     lastName: "Johnson",   gender: "female" as const, dateOfBirth: "1990-07-22", chartNumber: "CH-002" },
  { id: "p3",  firstName: "Michael",   lastName: "Williams",  gender: "male"   as const, dateOfBirth: "1978-11-08", chartNumber: "CH-003" },
  { id: "p4",  firstName: "Emily",     lastName: "Brown",     gender: "female" as const, dateOfBirth: "1995-01-30", chartNumber: "CH-004" },
  { id: "p5",  firstName: "David",     lastName: "Davis",     gender: "male"   as const, dateOfBirth: "1982-09-12", chartNumber: "CH-005" },
  { id: "p6",  firstName: "Olivia",    lastName: "Miller",    gender: "female" as const, dateOfBirth: "1988-05-04", chartNumber: "CH-006" },
  { id: "p7",  firstName: "James",     lastName: "Wilson",    gender: "male"   as const, dateOfBirth: "1972-12-19", chartNumber: "CH-007" },
  { id: "p8",  firstName: "Sophia",    lastName: "Moore",     gender: "female" as const, dateOfBirth: "1999-04-27", chartNumber: "CH-008" },
  { id: "p9",  firstName: "Benjamin",  lastName: "Taylor",    gender: "male"   as const, dateOfBirth: "1981-06-11", chartNumber: "CH-009" },
  { id: "p10", firstName: "Ava",       lastName: "Anderson",  gender: "female" as const, dateOfBirth: "2001-08-03", chartNumber: "CH-010" },
  { id: "p11", firstName: "William",   lastName: "Thomas",    gender: "male"   as const, dateOfBirth: "1969-02-14", chartNumber: "CH-011" },
  { id: "p12", firstName: "Mia",       lastName: "Jackson",   gender: "female" as const, dateOfBirth: "1993-10-25", chartNumber: "CH-012" },
  { id: "p13", firstName: "Alexander", lastName: "White",     gender: "male"   as const, dateOfBirth: "1976-07-30", chartNumber: "CH-013" },
  { id: "p14", firstName: "Charlotte", lastName: "Harris",    gender: "female" as const, dateOfBirth: "1987-09-09", chartNumber: "CH-014" },
  { id: "p15", firstName: "Daniel",    lastName: "Martin",    gender: "male"   as const, dateOfBirth: "1992-11-17", chartNumber: "CH-015" },
  { id: "p16", firstName: "Amelia",    lastName: "Thompson",  gender: "female" as const, dateOfBirth: "2004-01-21", chartNumber: "CH-016" },
  { id: "p17", firstName: "Henry",     lastName: "Garcia",    gender: "male"   as const, dateOfBirth: "1965-04-06", chartNumber: "CH-017" },
  { id: "p18", firstName: "Isabella",  lastName: "Martinez",  gender: "female" as const, dateOfBirth: "1996-12-02", chartNumber: "CH-018" },
  { id: "p19", firstName: "Jordan",    lastName: "Robinson",  gender: "other"  as const, dateOfBirth: "1998-03-28", chartNumber: "CH-019" },
  { id: "p20", firstName: "Lucas",     lastName: "Clark",     gender: "male"   as const, dateOfBirth: "1983-07-14", chartNumber: "CH-020" },
  { id: "p21", firstName: "Harper",    lastName: "Rodriguez", gender: "female" as const, dateOfBirth: "2007-02-18", chartNumber: "CH-021" },
  { id: "p22", firstName: "Mason",     lastName: "Lewis",     gender: "male"   as const, dateOfBirth: "1991-05-23", chartNumber: "CH-022" },
  { id: "p23", firstName: "Ella",      lastName: "Lee",       gender: "female" as const, dateOfBirth: "1979-10-31", chartNumber: "CH-023" },
  { id: "p24", firstName: "Ethan",     lastName: "Walker",    gender: "male"   as const, dateOfBirth: "1986-08-07", chartNumber: "CH-024" },
  { id: "p25", firstName: "Scarlett",  lastName: "Hall",      gender: "female" as const, dateOfBirth: "1994-06-15", chartNumber: "CH-025" },
  { id: "p26", firstName: "Logan",     lastName: "Allen",     gender: "male"   as const, dateOfBirth: "2000-09-29", chartNumber: "CH-026" },
  { id: "p27", firstName: "Grace",     lastName: "Young",     gender: "female" as const, dateOfBirth: "1974-11-13", chartNumber: "CH-027" },
  { id: "p28", firstName: "Sam",       lastName: "King",      gender: "other"  as const, dateOfBirth: "2002-04-04", chartNumber: "CH-028" },
  { id: "p29", firstName: "Jack",      lastName: "Wright",    gender: "male"   as const, dateOfBirth: "1968-01-26", chartNumber: "CH-029" },
  { id: "p30", firstName: "Zoe",       lastName: "Scott",     gender: "female" as const, dateOfBirth: "1989-07-19", chartNumber: "CH-030" },
];
