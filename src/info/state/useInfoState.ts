import { useReducer, useMemo } from "react";
import { infoReducer, initialInfoState } from "./infoReducer";
import type { InfoState, CaseInfo, ToothProcedure } from "../types";
import { TOOTH_PROCEDURE_COLORS } from "../constants";

// ─── Derived values ─────────────────────────────────────────────

function canProceedToScan(state: InfoState): boolean {
  if (!state.patient) return false;
  if (!state.selectedProcedure) return false;

  switch (state.selectedProcedure) {
    case "fixed-restorative":
      return state.selectedTeeth.length > 0 && state.toothSpecs.length > 0 && !!state.dueDate && !!state.sendTo;
    case "study-model":
      return !!state.dueDate && !!state.sendTo;
    case "invisalign":
      return !!state.invisalignType && !!state.treatmentStage;
    case "implant-planning":
      return !!state.dueDate && !!state.sendTo;
    case "dentures":
      return !!state.dentureType && !!state.dentureStage && !!state.dueDate && !!state.sendTo;
    case "appliance":
      return true;
    default:
      return false;
  }
}

function buildCaseInfo(state: InfoState): CaseInfo | null {
  if (!state.patient || !state.selectedProcedure) return null;
  return {
    patient: state.patient,
    procedure: state.selectedProcedure,
    dueDate: state.dueDate,
    sendTo: state.sendTo,
    notes: state.notes,
    selectedTeeth: state.selectedTeeth,
    toothSpecs: state.toothSpecs,
    scanOptions: state.scanOptions,
    archSelection: state.archSelection,
    invisalignType: state.invisalignType,
    treatmentStage: state.treatmentStage,
    dentureType: state.dentureType,
    dentureStage: state.dentureStage,
  };
}

function buildToothColorMap(state: InfoState): Record<number, string> {
  const map: Record<number, string> = {};
  for (const spec of state.toothSpecs) {
    map[spec.toothNumber] = TOOTH_PROCEDURE_COLORS[spec.procedure as ToothProcedure];
  }
  return map;
}

// ─── Hook ───────────────────────────────────────────────────────

export function useInfoState() {
  const [state, dispatch] = useReducer(infoReducer, initialInfoState);

  const derived = useMemo(
    () => ({
      canProceed: canProceedToScan(state),
      caseInfo: buildCaseInfo(state),
      toothColorMap: buildToothColorMap(state),
    }),
    [state],
  );

  return { state, dispatch, ...derived };
}
