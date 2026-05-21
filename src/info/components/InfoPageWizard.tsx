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
 * Wizard variant of the Info page (the "second option").
 *
 * Horizontal stepper on top, single step body in the centre, persistent
 * "Case summary" sidebar (with Notes) on the right, Back/Next footer at
 * the bottom. Shares step-driving state with the rail variant via
 * `useInfoWizardController`.
 */
export function InfoPageWizard({ onContinue, onPatientChange, onWizardTopbarChange }: Props) {
  const { state, dispatch, canProceed, toothColorMap } = useInfoState();
  const ctl = useInfoWizardController({ state, canProceed, onContinue });

  useEffect(() => {
    onPatientChange?.(state.patient);
  }, [state.patient, onPatientChange]);

  // Publish the wizard step state up to the host (ScreenTemplate) so it
  // can render the step indicator inside the global top header instead
  // of an in-page stepper. Cleared on unmount so the global header
  // reverts to its default tabs when leaving the variant.
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
      {/* Body — step content + sidebar (CreateOrderWizard layout: grid
          with a fixed 340px sidebar column and no vertical divider).
          The step indicator lives in the global top header now. */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <div
          style={{
            // Stretch the grid to at least the full body height so the
            // step card can grow to fill it (rather than hugging its
            // content). Items keep their default `align-self: stretch`.
            minHeight: "100%",
            boxSizing: "border-box",
            padding: "24px 16px 32px",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 340px",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", minWidth: 0, height: "100%" }}>
            {/* Each step renders a single white card with the step title
                at the top. Configuration uses `unified` mode so its
                sub-sections render flat inside the same card. Notes &
                Files is a dedicated last step. The active card grows
                with `flex: 1` so the section fills the body instead of
                hugging its content. */}
            {ctl.currentStep === "patient" && (
              <div style={{ ...cardStyle, flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                <StepHeader label={WIZARD_STEPS[ctl.stepIdx].label} />
                <PatientSection
                  patient={state.patient}
                  searchQuery={state.patientSearchQuery}
                  isCreating={state.isCreatingPatient}
                  dispatch={dispatch}
                  hideHeading
                  fillHeight
                />
              </div>
            )}
            {ctl.currentStep === "procedure" && (
              <div style={{ ...cardStyle, flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                <StepHeader label={WIZARD_STEPS[ctl.stepIdx].label} />
                <ProcedureSection
                  selectedProcedure={state.selectedProcedure}
                  hasPatient={!!state.patient}
                  dispatch={dispatch}
                  hideHeading
                  columns={2}
                  fillHeight
                />
              </div>
            )}
            {ctl.currentStep === "configuration" && (
              state.selectedProcedure ? (
                <div style={{ ...cardStyle, flex: 1 }}>
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
                <div style={{ ...cardStyle, flex: 1 }}>
                  <StepHeader label={WIZARD_STEPS[ctl.stepIdx].label} />
                  <EmptyConfig onPickProcedure={() => ctl.jumpToStep("procedure")} />
                </div>
              )
            )}
            {ctl.currentStep === "notes-files" && (
              <div style={{ ...cardStyle, flex: 1 }}>
                <StepHeader label={WIZARD_STEPS[ctl.stepIdx].label} />
                <NotesAndFilesStep state={state} dispatch={dispatch} />
              </div>
            )}
          </div>

          {/* Sidebar — sits in the second grid column, no extra padding
              or divider; spacing comes from the parent grid gap. */}
          <InfoSummaryWizard
            state={state}
            activeStep={ctl.currentStep}
            onJump={ctl.jumpToStep}
          />
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
