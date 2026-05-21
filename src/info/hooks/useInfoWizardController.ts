import { useMemo, useState } from "react";
import type { InfoState } from "../types";
import type { InfoStepId } from "../components/InfoSummaryWizard";

export const WIZARD_STEPS: { id: InfoStepId; label: string }[] = [
  { id: "patient", label: "Patient" },
  { id: "procedure", label: "Procedure" },
  { id: "configuration", label: "Configuration" },
  { id: "notes-files", label: "Notes & Files" },
];

interface ControllerInput {
  state: InfoState;
  canProceed: boolean;
  onContinue: () => void;
  /** Optional subset of WIZARD_STEPS to drive — used by variants that
   *  fold Notes & Files into Configuration. Order is preserved.
   *  Defaults to the full four-step flow. */
  steps?: { id: InfoStepId; label: string }[];
}

/**
 * Shared step-driving logic for the wizard-style Info page variants
 * (`InfoPageWizard` horizontal + `InfoPageWizardRail` vertical).
 *
 * Keeps both variants behaving identically: validation gates per step,
 * Back/Next semantics, and direct jump-to-step from the sidebar.
 */
export function useInfoWizardController({ state, canProceed, onContinue, steps }: ControllerInput) {
  const stepList = steps ?? WIZARD_STEPS;
  const [stepIdx, setStepIdx] = useState(0);
  const safeIdx = Math.min(stepIdx, stepList.length - 1);
  const currentStep = stepList[safeIdx].id;
  const isLastStep = safeIdx === stepList.length - 1;

  const stepValid = useMemo(() => {
    // The final step always uses the strict `canProceed` gate so the
    // user can't advance with required fields missing — this absorbs
    // Notes & Files validation when it's folded into Configuration.
    if (isLastStep) return canProceed;
    switch (currentStep) {
      case "patient":       return !!state.patient;
      case "procedure":     return !!state.selectedProcedure;
      case "configuration": return !!state.selectedProcedure;
      case "notes-files":   return canProceed;
    }
  }, [currentStep, isLastStep, state.patient, state.selectedProcedure, canProceed]);

  const handleNext = () => {
    if (!stepValid) return;
    if (isLastStep) {
      onContinue();
      return;
    }
    setStepIdx((i) => Math.min(stepList.length - 1, i + 1));
  };

  const handleBack = () => setStepIdx((i) => Math.max(0, i - 1));

  const jumpToStep = (id: InfoStepId) => {
    const idx = stepList.findIndex((s) => s.id === id);
    if (idx >= 0) setStepIdx(idx);
  };

  return { stepIdx: safeIdx, currentStep, stepValid, isLastStep, handleNext, handleBack, jumpToStep, setStepIdx, stepList };
}
