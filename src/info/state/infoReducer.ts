import type { Patient, ProcedureType, ToothProcedure, ToothSpec, ArchSelection, InfoState, ScanOptions } from "../types";

let groupCounter = 0;
function nextGroupId(): string {
  return `g${++groupCounter}`;
}

// ─── Actions ────────────────────────────────────────────────────
export type InfoAction =
  // Patient
  | { type: "SET_PATIENT"; patient: Patient }
  | { type: "CLEAR_PATIENT" }
  | { type: "SET_PATIENT_SEARCH"; query: string }
  | { type: "SET_CREATING_PATIENT"; value: boolean }

  // Procedure
  | { type: "SET_PROCEDURE"; procedure: ProcedureType }

  // Shared fields
  | { type: "SET_DUE_DATE"; date: string }
  | { type: "SET_SEND_TO"; value: string }
  | { type: "SET_NOTES"; value: string }
  | { type: "ADD_ATTACHMENTS"; files: File[] }
  | { type: "REMOVE_ATTACHMENT"; index: number }

  // Fixed Restorative – teeth
  | { type: "TOGGLE_TOOTH"; toothNumber: number }
  | { type: "SELECT_TEETH_RANGE"; from: number; to: number; teeth: number[] }
  | { type: "SET_TOOTH_SPEC"; toothNumber: number; spec: Partial<Omit<ToothSpec, "toothNumber">> }
  | { type: "BATCH_SET_PROCEDURE"; toothNumbers: number[]; procedure: ToothProcedure }
  | { type: "REMOVE_TOOTH"; toothNumber: number }
  | { type: "SET_EXPANDED_TEETH"; teeth: number[] }
  | { type: "TOGGLE_EXPANDED_TOOTH"; toothNumber: number }
  | { type: "SELECT_ALL_TEETH"; teeth: number[] }
  | { type: "CLEAR_SELECTION" }

  // Invisalign
  | { type: "SET_INVISALIGN_TYPE"; value: string }
  | { type: "SET_TREATMENT_STAGE"; value: string }

  // Dentures
  | { type: "SET_ARCH_SELECTION"; value: ArchSelection }
  | { type: "SET_DENTURE_TYPE"; value: string }
  | { type: "SET_DENTURE_STAGE"; value: string }
  | { type: "SET_DENTURE_MOULD"; value: string }
  | { type: "SET_DENTURE_SHADE_SYSTEM"; value: string }
  | { type: "SET_DENTURE_TEETH_SHADE"; value: string }
  | { type: "SET_DENTURE_GINGIVAL"; value: string }

  // Scan options
  | { type: "TOGGLE_SCAN_OPTION"; key: keyof ScanOptions }

  // Reset
  | { type: "RESET" };

// ─── Initial state ──────────────────────────────────────────────
export const initialInfoState: InfoState = {
  patient: null,
  patientSearchQuery: "",
  isCreatingPatient: false,

  selectedProcedure: null,

  dueDate: "",
  sendTo: "",
  notes: "",
  attachments: [],

  selectedTeeth: [],
  toothSpecs: [],

  invisalignType: "",
  treatmentStage: "",

  archSelection: "both",
  dentureType: "",
  dentureStage: "",
  dentureMould: "",
  dentureShadeSystem: "",
  dentureTeethShade: "",
  dentureGingival: "",

  scanOptions: {
    niri: false,
    palatal: false,
    gingival: false,
    multiBite: false,
    sleeveAttached: false,
    preTreatment: false,
    dentureCopy: false,
  },

  expandedTeeth: [],
};

// ─── Reducer ────────────────────────────────────────────────────
export function infoReducer(state: InfoState, action: InfoAction): InfoState {
  switch (action.type) {
    // Patient
    case "SET_PATIENT":
      return { ...state, patient: action.patient, patientSearchQuery: "", isCreatingPatient: false };
    case "CLEAR_PATIENT":
      return { ...state, patient: null, patientSearchQuery: "" };
    case "SET_PATIENT_SEARCH":
      return { ...state, patientSearchQuery: action.query };
    case "SET_CREATING_PATIENT":
      return { ...state, isCreatingPatient: action.value };

    // Procedure
    case "SET_PROCEDURE":
      return {
        ...state,
        selectedProcedure: action.procedure,
        selectedTeeth: [],
        toothSpecs: [],
        invisalignType: "",
        treatmentStage: "",
        archSelection: "both",
        dentureType: "",
        dentureStage: "",
        dentureMould: "",
        dentureShadeSystem: "",
        dentureTeethShade: "",
        dentureGingival: "",
        scanOptions: { ...initialInfoState.scanOptions },
        expandedTeeth: [],
      };

    // Shared
    case "SET_DUE_DATE":
      return { ...state, dueDate: action.date };
    case "SET_SEND_TO":
      return { ...state, sendTo: action.value };
    case "SET_NOTES":
      return { ...state, notes: action.value };
    case "ADD_ATTACHMENTS":
      return { ...state, attachments: [...state.attachments, ...action.files] };
    case "REMOVE_ATTACHMENT":
      return { ...state, attachments: state.attachments.filter((_, i) => i !== action.index) };

    // Teeth
    case "TOGGLE_TOOTH": {
      const hasSpec = state.toothSpecs.some((s) => s.toothNumber === action.toothNumber);

      if (hasSpec) {
        // Assigned tooth → remove its procedure (reset to unassigned)
        return {
          ...state,
          toothSpecs: state.toothSpecs.filter((s) => s.toothNumber !== action.toothNumber),
          expandedTeeth: state.expandedTeeth.filter((t) => t !== action.toothNumber),
        };
      }

      // Unassigned tooth → toggle selection
      const isSelected = state.selectedTeeth.includes(action.toothNumber);
      return {
        ...state,
        selectedTeeth: isSelected
          ? state.selectedTeeth.filter((t) => t !== action.toothNumber)
          : [...state.selectedTeeth, action.toothNumber],
      };
    }
    case "SELECT_TEETH_RANGE": {
      const newTeeth = action.teeth.filter((t) => !state.selectedTeeth.includes(t));
      return { ...state, selectedTeeth: [...state.selectedTeeth, ...newTeeth] };
    }
    case "SET_TOOTH_SPEC": {
      const existing = state.toothSpecs.find((s) => s.toothNumber === action.toothNumber);
      const procedureChanging = action.spec.procedure && existing && action.spec.procedure !== existing.procedure;
      const updatedSpec: ToothSpec = existing
        ? { ...existing, ...action.spec, ...(procedureChanging ? { groupId: nextGroupId() } : {}) }
        : { toothNumber: action.toothNumber, procedure: "crown" as ToothProcedure, groupId: nextGroupId(), ...action.spec };
      const toothSpecs = existing
        ? state.toothSpecs.map((s) => (s.toothNumber === action.toothNumber ? updatedSpec : s))
        : [...state.toothSpecs, updatedSpec];
      return { ...state, toothSpecs };
    }
    case "BATCH_SET_PROCEDURE": {
      const gid = nextGroupId();
      const toothSpecs = [...state.toothSpecs];
      for (const num of action.toothNumbers) {
        const idx = toothSpecs.findIndex((s) => s.toothNumber === num);
        if (idx >= 0) {
          toothSpecs[idx] = { ...toothSpecs[idx], procedure: action.procedure, groupId: gid };
        } else {
          toothSpecs.push({ toothNumber: num, procedure: action.procedure, groupId: gid });
        }
      }
      return {
        ...state,
        toothSpecs,
        selectedTeeth: state.selectedTeeth.filter((t) => !action.toothNumbers.includes(t)),
        expandedTeeth: action.toothNumbers,
      };
    }
    case "REMOVE_TOOTH":
      return {
        ...state,
        selectedTeeth: state.selectedTeeth.filter((t) => t !== action.toothNumber),
        toothSpecs: state.toothSpecs.filter((s) => s.toothNumber !== action.toothNumber),
        expandedTeeth: state.expandedTeeth.filter((t) => t !== action.toothNumber),
      };

    // Expanded teeth (multi-select editing)
    case "SET_EXPANDED_TEETH":
      return { ...state, expandedTeeth: action.teeth };
    case "TOGGLE_EXPANDED_TOOTH": {
      const isExp = state.expandedTeeth.includes(action.toothNumber);
      return {
        ...state,
        expandedTeeth: isExp
          ? state.expandedTeeth.filter((t) => t !== action.toothNumber)
          : [...state.expandedTeeth, action.toothNumber],
      };
    }

    // Select all / clear
    case "SELECT_ALL_TEETH":
      return { ...state, selectedTeeth: action.teeth };
    case "CLEAR_SELECTION":
      return { ...state, selectedTeeth: [], expandedTeeth: [] };

    // Invisalign
    case "SET_INVISALIGN_TYPE":
      return { ...state, invisalignType: action.value };
    case "SET_TREATMENT_STAGE":
      return { ...state, treatmentStage: action.value };

    // Dentures
    case "SET_ARCH_SELECTION":
      return { ...state, archSelection: action.value };
    case "SET_DENTURE_TYPE":
      return { ...state, dentureType: action.value };
    case "SET_DENTURE_STAGE":
      return { ...state, dentureStage: action.value };
    case "SET_DENTURE_MOULD":
      return { ...state, dentureMould: action.value };
    case "SET_DENTURE_SHADE_SYSTEM":
      return { ...state, dentureShadeSystem: action.value, dentureTeethShade: "" };
    case "SET_DENTURE_TEETH_SHADE":
      return { ...state, dentureTeethShade: action.value };
    case "SET_DENTURE_GINGIVAL":
      return { ...state, dentureGingival: action.value };

    // Scan options
    case "TOGGLE_SCAN_OPTION":
      return { ...state, scanOptions: { ...state.scanOptions, [action.key]: !state.scanOptions[action.key] } };

    // Reset
    case "RESET":
      return { ...initialInfoState };

    default:
      return state;
  }
}
