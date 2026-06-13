import React, { useEffect, useState } from "react";
import { useInfoState } from "../state/useInfoState";
import { PatientSection } from "./PatientSection/PatientSection";
import { ProcedureSection } from "./ProcedureSection/ProcedureSection";
import { ConfigSection } from "./ConfigSection/ConfigSection";
import { PrimaryButton } from "../../design-system";
import type { Patient } from "../types";

interface Props {
  onContinue: () => void;
  onPatientChange?: (patient: Patient | null) => void;
}

type SectionId = "patient" | "procedure" | "configuration";

/**
 * Accordion variant of the Info page (the "fourth option").
 *
 * Non-linear flow — every section is always visible as a collapsible
 * card stacked in one column. Only one section is expanded at a time,
 * which keeps cognitive load low while letting the user choose the
 * order in which they fill things. The header of each card surfaces a
 * status pill (Pending / Done) and the current value summary so the
 * user always sees progress at a glance, without a Stepper or "Next"
 * button. Continue is enabled once every required section is valid.
 */
export function InfoPageAccordion({ onContinue, onPatientChange }: Props) {
  const { state, dispatch, canProceed, toothColorMap } = useInfoState();
  // Default to the first incomplete section so the user lands on what's next.
  const initialOpen: SectionId = !state.patient
    ? "patient"
    : !state.selectedProcedure
    ? "procedure"
    : "configuration";
  const [openId, setOpenId] = useState<SectionId>(initialOpen);

  useEffect(() => {
    onPatientChange?.(state.patient);
  }, [state.patient, onPatientChange]);

  const sections: Array<{ id: SectionId; title: string; status: { done: boolean; summary: string | null }; body: React.ReactNode }> = [
    {
      id: "patient",
      title: "Patient",
      status: {
        done: !!state.patient,
        summary: state.patient ? `${state.patient.firstName} ${state.patient.lastName}` : null,
      },
      body: (
        <PatientSection
          patient={state.patient}
          searchQuery={state.patientSearchQuery}
          isCreating={state.isCreatingPatient}
          dispatch={dispatch}
        />
      ),
    },
    {
      id: "procedure",
      title: "Procedure",
      status: {
        done: !!state.selectedProcedure,
        summary: state.selectedProcedure ?? null,
      },
      body: (
        <ProcedureSection
          selectedProcedure={state.selectedProcedure}
          hasPatient={!!state.patient}
          dispatch={dispatch}
        />
      ),
    },
    {
      id: "configuration",
      title: "Configuration",
      status: {
        done: canProceed,
        summary: null,
      },
      body: state.selectedProcedure ? (
        <ConfigSection
          state={state}
          toothColorMap={toothColorMap}
          dispatch={dispatch}
        />
      ) : (
        <p style={{
          margin: 0,
          fontSize: "var(--tp-body-01-size)",
          lineHeight: "var(--tp-body-01-lh)",
          color: "var(--ads-text-secondary)",
          fontFamily: "var(--ads-font-sans)",
        }}>
          Pick a procedure first to configure its details.
        </p>
      ),
    },
  ];

  return (
    <div style={{ height: "100%", overflowY: "auto", backgroundColor: "var(--ads-bg-page)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {sections.map((s) => (
          <AccordionCard
            key={s.id}
            title={s.title}
            isOpen={openId === s.id}
            status={s.status}
            onToggle={() => setOpenId((cur) => (cur === s.id ? cur : s.id))}
          >
            {s.body}
          </AccordionCard>
        ))}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
          <PrimaryButton size={44} onClick={onContinue} disabled={!canProceed}>
            Continue to Scan
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function AccordionCard({
  title,
  isOpen,
  status,
  children,
  onToggle,
}: {
  title: string;
  isOpen: boolean;
  status: { done: boolean; summary: string | null };
  children: React.ReactNode;
  onToggle: () => void;
}) {
  return (
    <section style={{
      backgroundColor: "var(--ads-bg-surface)",
      border: "1px solid var(--ads-border-subtle)",
      borderRadius: "var(--ads-radius-md)",
      overflow: "hidden",
    }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          width: "100%",
          padding: "16px 24px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "var(--ads-font-sans)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0, flex: 1 }}>
          <span style={{
            fontSize: "16px",
            lineHeight: "22px",
            fontWeight: 500,
            color: "var(--ads-text-primary)",
          }}>
            {title}
          </span>
          {status.summary && (
            <span style={{
              fontSize: "13px",
              lineHeight: "18px",
              color: "var(--ads-text-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
            }}>
              · {status.summary}
            </span>
          )}
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <StatusPill done={status.done} />
          <svg
            width="14" height="14" viewBox="0 0 16 16" fill="none"
            stroke="var(--ads-text-secondary)" strokeWidth="1.5" strokeLinecap="round"
            style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform var(--ads-duration-fast)" }}
            aria-hidden
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div style={{ padding: "24px", borderTop: "1px solid var(--ads-border-subtle)" }}>
          {children}
        </div>
      )}
    </section>
  );
}

function StatusPill({ done }: { done: boolean }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "2px 8px",
      borderRadius: "9999px",
      fontSize: "11px",
      fontWeight: 500,
      letterSpacing: "0.02em",
      fontFamily: "var(--ads-font-sans)",
      color: done ? "var(--ads-text-success)" : "var(--ads-text-muted)",
      background: done
        ? "color-mix(in srgb, var(--ads-color-success, #16A34A) 12%, transparent)"
        : "var(--ads-background-subtle-hover)",
    }}>
      {done ? "Done" : "Pending"}
    </span>
  );
}
