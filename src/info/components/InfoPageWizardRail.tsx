import React, { useEffect } from "react";
import { useInfoState } from "../state/useInfoState";
import { useInfoWizardController, WIZARD_STEPS } from "../hooks/useInfoWizardController";
import { PatientSection } from "./PatientSection/PatientSection";
import { ProcedureSection } from "./ProcedureSection/ProcedureSection";
import { ConfigSection } from "./ConfigSection/ConfigSection";
import { NotesAndFilesStep } from "./NotesAndFilesStep";
import { InfoSummaryWizard, type InfoStepId } from "./InfoSummaryWizard";
import { PrimaryButton, SecondaryButton } from "../../design-system";
import type { Patient } from "../types";
import type { InfoWizardTopbarState } from "./InfoPage";

interface Props {
  onContinue: () => void;
  onPatientChange?: (patient: Patient | null) => void;
  onWizardTopbarChange?: (state: InfoWizardTopbarState | null) => void;
}

/**
 * Vertical-rail wizard variant of the Info page (the "third option").
 *
 * Same step semantics as `InfoPageWizard` — only the stepper layout
 * differs. The vertical rail lives on the left, freeing the entire
 * vertical space for the step body. The right sidebar (`InfoSummaryWizard`)
 * is unchanged so users get the same case-summary + notes affordance.
 */
export function InfoPageWizardRail({ onContinue, onPatientChange, onWizardTopbarChange }: Props) {
  const { state, dispatch, canProceed, toothColorMap } = useInfoState();
  const ctl = useInfoWizardController({ state, canProceed, onContinue });

  useEffect(() => {
    onPatientChange?.(state.patient);
  }, [state.patient, onPatientChange]);

  // Publish the wizard step state up so the global top header renders
  // the indicator. The vertical rail is gone — only one step indicator
  // exists per the design.
  useEffect(() => {
    onWizardTopbarChange?.({
      steps: WIZARD_STEPS,
      activeIdx: ctl.stepIdx,
      onJump: (id: InfoStepId) => ctl.jumpToStep(id),
    });
  }, [ctl.stepIdx, onWizardTopbarChange]);
  useEffect(() => {
    return () => onWizardTopbarChange?.(null);
  }, [onWizardTopbarChange]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "var(--ads-bg-page)" }}>
      <div style={{ flex: 1, minHeight: 0, display: "flex", overflow: "hidden" }}>
      {/* Body — step content + sidebar (CreateOrderWizard layout). */}
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        <div
          style={{
            padding: "24px 16px 32px",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 340px",
            gap: 24,
            alignItems: "start",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", minWidth: 0 }}>
            {ctl.currentStep === "patient" && (
              <div style={cardStyle}>
                <StepHeader label={WIZARD_STEPS[ctl.stepIdx].label} />
                <PatientSection
                  patient={state.patient}
                  searchQuery={state.patientSearchQuery}
                  isCreating={state.isCreatingPatient}
                  dispatch={dispatch}
                  hideHeading
                />
              </div>
            )}
            {ctl.currentStep === "procedure" && (
              <div style={cardStyle}>
                <StepHeader label={WIZARD_STEPS[ctl.stepIdx].label} />
                <ProcedureSection
                  selectedProcedure={state.selectedProcedure}
                  hasPatient={!!state.patient}
                  dispatch={dispatch}
                  hideHeading
                />
              </div>
            )}
            {ctl.currentStep === "configuration" && (
              state.selectedProcedure ? (
                <div style={cardStyle}>
                  <StepHeader label={WIZARD_STEPS[ctl.stepIdx].label} />
                  <ConfigSection
                    state={state}
                    toothColorMap={toothColorMap}
                    dispatch={dispatch}
                    hideNotesAndAttachments
                    unified
                  />
                </div>
              ) : (
                <div style={cardStyle}>
                  <StepHeader label={WIZARD_STEPS[ctl.stepIdx].label} />
                  <EmptyConfig onPickProcedure={() => ctl.jumpToStep("procedure")} />
                </div>
              )
            )}
            {ctl.currentStep === "notes-files" && (
              <div style={cardStyle}>
                <StepHeader label={WIZARD_STEPS[ctl.stepIdx].label} />
                <NotesAndFilesStep state={state} dispatch={dispatch} />
              </div>
            )}
          </div>

          {/* Sidebar — second grid column, no extra padding or divider. */}
          <InfoSummaryWizard
            state={state}
            activeStep={ctl.currentStep}
            onJump={ctl.jumpToStep}
          />
        </div>
      </div>
      </div>

      {/* Sticky wizard footer — always pinned to the bottom of the page. */}
      <WizardFooter
        onBack={ctl.handleBack}
        onNext={ctl.handleNext}
        backDisabled={ctl.stepIdx === 0}
        nextDisabled={!ctl.stepValid}
        nextLabel={ctl.isLastStep ? "Continue to Scan" : "Next"}
      />
    </div>
  );
}

function WizardFooter({
  onBack,
  onNext,
  backDisabled,
  nextDisabled,
  nextLabel,
}: {
  onBack: () => void;
  onNext: () => void;
  backDisabled: boolean;
  nextDisabled: boolean;
  nextLabel: string;
}) {
  return (
    <div style={{
      flexShrink: 0,
      borderTop: "1px solid var(--ads-border-subtle)",
      backgroundColor: "var(--ads-bg-surface)",
      padding: "12px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <SecondaryButton size={36} onClick={onBack} disabled={backDisabled}>
        Back
      </SecondaryButton>
      <PrimaryButton size={36} onClick={onNext} disabled={nextDisabled}>
        {nextLabel}
      </PrimaryButton>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "var(--ads-bg-surface)",
  borderRadius: "var(--ads-radius-md)",
  padding: "24px",
  border: "1px solid var(--ads-border-subtle)",
  minWidth: 0,
};

function StepHeader({ label }: { label: string }) {
  return (
    <h2 style={{
      margin: "0 0 16px",
      fontSize: "24px",
      lineHeight: "32px",
      fontWeight: 500,
      color: "var(--ads-text-primary)",
      letterSpacing: "-0.015em",
      fontFamily: "var(--ads-font-sans)",
    }}>
      {label}
    </h2>
  );
}

function EmptyConfig({ onPickProcedure }: { onPickProcedure: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 16px", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
      <p style={{
        margin: 0,
        fontSize: "var(--tp-body-01-size)",
        lineHeight: "var(--tp-body-01-lh)",
        color: "var(--ads-text-secondary)",
        fontFamily: "var(--ads-font-sans)",
      }}>
        Pick a procedure first to configure its details.
      </p>
      <SecondaryButton size={36} onClick={onPickProcedure}>Back to Procedure</SecondaryButton>
    </div>
  );
}
