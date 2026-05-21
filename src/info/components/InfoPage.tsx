import React, { useEffect, useState } from "react";
import { useInfoState } from "../state/useInfoState";
import { PatientSection } from "./PatientSection/PatientSection";
import { ProcedureSection } from "./ProcedureSection/ProcedureSection";
import { ConfigSection } from "./ConfigSection/ConfigSection";
import { CaseSummaryPanel } from "./CaseSummaryPanel/CaseSummaryPanel";
import { InfoPageWizard } from "./InfoPageWizard";
import { InfoPageWizardRail } from "./InfoPageWizardRail";
import { InfoPageAccordion } from "./InfoPageAccordion";
import type { Patient } from "../types";
import type { InfoStepId } from "./InfoSummaryWizard";

export type InfoLayoutVariant = "classic" | "wizard" | "rail" | "accordion";

/** State surfaced up from the wizard variants so a host (e.g. the global
 *  topbar) can render the step indicator instead of the in-page one. */
export interface InfoWizardTopbarState {
  steps: { id: InfoStepId; label: string }[];
  activeIdx: number;
  onJump: (id: InfoStepId) => void;
}

const VARIANT_BY_KEY: Record<string, InfoLayoutVariant> = {
  "1": "classic",
  "2": "wizard",
  "3": "rail",
  "4": "accordion",
};

interface InfoPageProps {
  onContinue: () => void;
  onPatientChange?: (patient: Patient | null) => void;
  /** Optional initial layout when uncontrolled; default 'classic'. */
  initialVariant?: InfoLayoutVariant;
  /** Controlled variant — parent (e.g. ScreenTemplate) owns the state to
   *  coordinate with the app-level chevron topbar visibility. */
  variant?: InfoLayoutVariant;
  onVariantChange?: (v: InfoLayoutVariant) => void;
  /** Called whenever the wizard/rail variants change their internal step
   *  state. Hosts can render this as the centre slot of the global
   *  topbar. Called with `null` when no wizard is active. */
  onWizardTopbarChange?: (state: InfoWizardTopbarState | null) => void;
}

const ANIM_KF = `
  @keyframes info-fade-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const sectionCardStyle: React.CSSProperties = {
  backgroundColor: "var(--ads-bg-surface)",
  borderRadius: "var(--ads-radius-md)",
  padding: "20px",
  border: "1px solid var(--ads-border-subtle)",
  flexShrink: 0,
  animation: "info-fade-in 0.35s ease-out both",
};

export function InfoPage({ onContinue, onPatientChange, initialVariant = "classic", variant: controlledVariant, onVariantChange, onWizardTopbarChange }: InfoPageProps) {
  const [internalVariant, setInternalVariant] = useState<InfoLayoutVariant>(initialVariant);
  const isControlled = controlledVariant !== undefined;
  const variant: InfoLayoutVariant = isControlled ? controlledVariant! : internalVariant;
  const setVariant = (v: InfoLayoutVariant) => {
    if (!isControlled) setInternalVariant(v);
    onVariantChange?.(v);
  };

  // Variants that don't host an internal wizard need to clear any
  // previously-published topbar state so the global header reverts to
  // its default tabs.
  useEffect(() => {
    if (variant === "classic" || variant === "accordion") {
      onWizardTopbarChange?.(null);
    }
  }, [variant, onWizardTopbarChange]);

  // Hidden keyboard shortcut: 1 → Classic, 2 → Wizard, 3 → Rail, 4 → Accordion.
  // Ignored while focus is in a text input, textarea, or contenteditable so
  // typing numbers in form fields doesn't trigger a layout swap.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const next = VARIANT_BY_KEY[e.key];
      if (!next) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      setVariant(next);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isControlled, onVariantChange]);

  const body =
    variant === "wizard" ? (
      <InfoPageWizard onContinue={onContinue} onPatientChange={onPatientChange} onWizardTopbarChange={onWizardTopbarChange} />
    ) : variant === "rail" ? (
      <InfoPageWizardRail onContinue={onContinue} onPatientChange={onPatientChange} onWizardTopbarChange={onWizardTopbarChange} />
    ) : variant === "accordion" ? (
      <InfoPageAccordion onContinue={onContinue} onPatientChange={onPatientChange} />
    ) : (
      <InfoPageClassic onContinue={onContinue} onPatientChange={onPatientChange} />
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {body}
    </div>
  );
}

function InfoPageClassic({ onContinue, onPatientChange }: Omit<InfoPageProps, "initialVariant">) {
  const { state, dispatch, canProceed, toothColorMap } = useInfoState();

  useEffect(() => {
    onPatientChange?.(state.patient);
  }, [state.patient, onPatientChange]);

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        backgroundColor: "var(--ads-bg-page)",
      }}
    >
      <style>{ANIM_KF}</style>
      {/* Left column - scroll container */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          overflowY: "auto",
        }}
      >
        {/* Inner content with padding */}
        <div
          style={{
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div style={{ ...sectionCardStyle, animationDelay: "0s" }}>
            <PatientSection
              patient={state.patient}
              searchQuery={state.patientSearchQuery}
              isCreating={state.isCreatingPatient}
              dispatch={dispatch}
            />
          </div>
          <div style={{ ...sectionCardStyle, animationDelay: "0.06s" }}>
            <ProcedureSection
              selectedProcedure={state.selectedProcedure}
              hasPatient={!!state.patient}
              dispatch={dispatch}
              collapsible
            />
          </div>
          {state.selectedProcedure && (
            <ConfigSection
              state={state}
              toothColorMap={toothColorMap}
              dispatch={dispatch}
            />
          )}
        </div>
      </div>

      {/* Right column - sticky summary */}
      <CaseSummaryPanel
        state={state}
        canProceed={canProceed}
        onContinue={onContinue}
      />
    </div>
  );
}
