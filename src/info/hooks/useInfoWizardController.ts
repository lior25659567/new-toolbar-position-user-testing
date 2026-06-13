import { useCallback, useState } from "react";
import type { InfoState } from "../types";
import type { InfoStepId } from "../components/InfoSummaryWizard";

/**
 * STUB — original implementation was lost. Drives the shared step state for the
 * wizard variants of the Info page (`InfoPageWizard` / `InfoPageWizardRail`).
 * Steps mirror the `InfoStepId` union and `InfoSummaryWizard` rows.
 */
export const WIZARD_STEPS: { id: InfoStepId; label: string }[] = [
  { id: "patient", label: "Patient" },
  { id: "procedure", label: "Procedure" },
  { id: "configuration", label: "Configuration" },
  { id: "notes-files", label: "Notes & Files" },
];

interface UseInfoWizardControllerArgs {
  state: InfoState;
  /** Full "ready to continue to Scan" validity from `useInfoState`. */
  canProceed: boolean;
  /** Called when advancing past the final step. */
  onContinue: () => void;
}

export function useInfoWizardController({ state, canProceed, onContinue }: UseInfoWizardControllerArgs) {
  const [stepIdx, setStepIdx] = useState(0);

  const currentStep = WIZARD_STEPS[stepIdx].id;
  const isLastStep = stepIdx === WIZARD_STEPS.length - 1;

  // Whether the current step is satisfied enough to advance.
  const stepValid = (() => {
    switch (currentStep) {
      case "patient":
        return !!state.patient;
      case "procedure":
        return !!state.selectedProcedure;
      case "configuration":
      case "notes-files":
        return canProceed;
      default:
        return true;
    }
  })();

  const jumpToStep = useCallback((id: InfoStepId) => {
    const idx = WIZARD_STEPS.findIndex((s) => s.id === id);
    if (idx >= 0) setStepIdx(idx);
  }, []);

  const handleBack = useCallback(() => {
    setStepIdx((i) => Math.max(0, i - 1));
  }, []);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onContinue();
      return;
    }
    setStepIdx((i) => Math.min(WIZARD_STEPS.length - 1, i + 1));
  }, [isLastStep, onContinue]);

  return { currentStep, stepIdx, isLastStep, stepValid, jumpToStep, handleBack, handleNext };
}
