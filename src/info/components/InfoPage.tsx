import React, { useEffect, useState } from "react";
import { useInfoState } from "../state/useInfoState";
import { PatientSection } from "./PatientSection/PatientSection";
import { PatientHeaderBar } from "./PatientSection/PatientHeaderBar";
import { ProcedureSection } from "./ProcedureSection/ProcedureSection";
import { ConfigSection } from "./ConfigSection/ConfigSection";
import { CaseSummaryPanel } from "./CaseSummaryPanel/CaseSummaryPanel";
import { InfoPageWizard } from "./InfoPageWizard";
import { InfoPageWizardRail } from "./InfoPageWizardRail";
import { InfoPageAccordion } from "./InfoPageAccordion";
import type { Patient, InfoState } from "../types";
import type { InfoAction } from "../state/infoReducer";
import type { InfoStepId } from "./InfoSummaryWizard";

export type InfoLayoutVariant = "classic" | "wizard" | "rail" | "accordion" | "sticky";

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
  "5": "sticky",
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
    if (variant === "classic" || variant === "accordion" || variant === "sticky") {
      onWizardTopbarChange?.(null);
    }
  }, [variant, onWizardTopbarChange]);

  // Hidden keyboard shortcut: 1 → Classic, 2 → Wizard, 3 → Rail, 4 → Accordion,
  // 5 → Sticky patient (press "h" inside it to hide the case summary).
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
    ) : variant === "sticky" ? (
      <InfoPageStickyPatient onContinue={onContinue} onPatientChange={onPatientChange} />
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
            gap: "16px",
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

/**
 * Presentational Option-5 layout. Stateless: the caller owns the reducer
 * (`state` + `dispatch`) and the summary visibility. This is rendered by the
 * `InfoPageStickyPatient` wrapper in the real app and, with `showSummary`
 * forced off, by the scripted demo in DemoPage.
 *
 * Single full-width scrolling column where only the Patient section is pinned
 * to the top. Everything else — Procedure, config, and the Case Summary —
 * flows beneath it and scrolls normally (the summary is rendered inline).
 */
export interface InfoStickyLayoutProps {
  state: InfoState;
  dispatch: React.Dispatch<InfoAction>;
  canProceed: boolean;
  toothColorMap: Record<number, string>;
  onContinue: () => void;
  /** Whether the inline Case Summary panel is shown. */
  showSummary: boolean;
  /** Open the patient table immediately when the picker is shown. */
  openPickerOnMount: boolean;
  /** Invoked when the user hits "Edit" on the patient header bar. */
  onEditPatient: () => void;
  /** Optional ref to the outer scroll container (used by the demo to scroll). */
  scrollRef?: React.Ref<HTMLDivElement>;
}

export function InfoStickyLayout({
  state,
  dispatch,
  canProceed,
  toothColorMap,
  onContinue,
  showSummary,
  openPickerOnMount,
  onEditPatient,
  scrollRef,
}: InfoStickyLayoutProps) {
  return (
    <div
      ref={scrollRef}
      style={{
        height: "100%",
        overflowY: "auto",
        backgroundColor: "var(--ads-bg-page)",
      }}
    >
      <style>{ANIM_KF}</style>

      {/* Full-width patient header (non-sticky). When a patient is selected this
          is the edge-to-edge Figma-style header bar; otherwise it falls back to
          the patient picker so one can be chosen. */}
      <div
        style={{
          padding: "20px 32px",
          backgroundColor: "var(--ads-bg-surface)",
          borderBottom: "1px solid var(--ads-border-subtle)",
        }}
      >
        {state.patient && !state.isCreatingPatient ? (
          <PatientHeaderBar patient={state.patient} onEdit={onEditPatient} />
        ) : (
          <PatientSection
            patient={state.patient}
            searchQuery={state.patientSearchQuery}
            isCreating={state.isCreatingPatient}
            dispatch={dispatch}
            hideHeading
            defaultPickerOpen={openPickerOnMount}
          />
        )}
      </div>

      {/* Scrolling content beneath the pinned patient header: main column on
          the left, Case Summary as a non-sticky right column that starts level
          with the Procedure section. */}
      <div
        style={{
          padding: "16px 32px 32px",
          display: "flex",
          alignItems: "flex-start",
          gap: "24px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
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
        {/* Case summary — right column, vertical, sticky so it stays in view
            while the main column scrolls. Omitted entirely in the "no summary"
            variant. */}
        {showSummary && (
          <div
            style={{
              width: 300,
              flexShrink: 0,
              position: "sticky",
              top: 16,
              alignSelf: "flex-start",
              maxHeight: "calc(100vh - 32px)",
              overflowY: "auto",
            }}
          >
            <CaseSummaryPanel
              state={state}
              canProceed={canProceed}
              onContinue={onContinue}
              layout="inline"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Sticky-patient layout (key "5"): owns the reducer and the "h"-to-hide summary
 * toggle, then delegates rendering to the stateless `InfoStickyLayout`.
 */
function InfoPageStickyPatient({ onContinue, onPatientChange }: Omit<InfoPageProps, "initialVariant">) {
  const { state, dispatch, canProceed, toothColorMap } = useInfoState();
  // Press "h" to hide/show the case summary panel. Ignored while typing in a
  // form field so it doesn't fire mid-input.
  const [showSummary, setShowSummary] = useState(true);
  // Open the patient table immediately only when re-entering the picker via
  // "Edit" — not on first load, where it stays closed.
  const [openPickerOnMount, setOpenPickerOnMount] = useState(false);

  useEffect(() => {
    onPatientChange?.(state.patient);
  }, [state.patient, onPatientChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "h" && e.key !== "H") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      setShowSummary((v) => !v);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <InfoStickyLayout
      state={state}
      dispatch={dispatch}
      canProceed={canProceed}
      toothColorMap={toothColorMap}
      onContinue={onContinue}
      showSummary={showSummary}
      openPickerOnMount={openPickerOnMount}
      onEditPatient={() => {
        setOpenPickerOnMount(true);
        dispatch({ type: "CLEAR_PATIENT" });
      }}
    />
  );
}
