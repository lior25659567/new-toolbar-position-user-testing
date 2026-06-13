import React from "react";
import type { InfoState } from "../types";
import { PROCEDURES } from "../constants";

/**
 * Sidebar for the wizard variant of the Info page — modelled on the
 * "Order summary" pattern from CreateOrderWizard. Each row represents one
 * step of the wizard; the row for the currently-active step is highlighted,
 * completed rows show their value plus an edit pencil that jumps back.
 */

export type InfoStepId = "patient" | "procedure" | "configuration" | "notes-files";

interface Props {
  state: InfoState;
  activeStep: InfoStepId;
  onJump: (step: InfoStepId) => void;
  /** When true, drop the standalone "Notes & Files" row — used by
   *  variants that fold notes/files into the Configuration step. */
  hideNotesFilesRow?: boolean;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "var(--ads-bg-surface)",
  border: "1px solid var(--ads-border-subtle)",
  borderRadius: "var(--ads-radius-sm)",
  boxShadow: "var(--ads-shadow-sm)",
  fontFamily: "var(--ads-font-sans)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

export function InfoSummaryWizard({ state, activeStep, onJump, hideNotesFilesRow }: Props) {
  const procedureLabel = state.selectedProcedure
    ? PROCEDURES.find((p) => p.id === state.selectedProcedure)?.name ?? null
    : null;

  const configValue = describeConfig(state);

  return (
    <div style={{ position: "sticky", top: 0, alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: "16px" }}>
      <aside style={cardStyle}>
        <div style={{ padding: "24px 24px 16px" }}>
          <h2 style={{
            margin: 0,
            fontSize: "20px",
            lineHeight: "28px",
            fontWeight: 500,
            color: "var(--ads-text-primary)",
            letterSpacing: "-0.015em",
          }}>
            Case summary
          </h2>
        </div>

        <SummaryRow
          title="Patient"
          value={state.patient ? `${state.patient.firstName} ${state.patient.lastName}` : null}
          subtitle={state.patient ? state.patient.chartNumber : undefined}
          isActive={activeStep === "patient"}
          onEdit={() => onJump("patient")}
          editable={!!state.patient && activeStep !== "patient"}
        />

        <SummaryRow
          title="Procedure"
          value={procedureLabel}
          isActive={activeStep === "procedure"}
          onEdit={() => onJump("procedure")}
          editable={!!procedureLabel && activeStep !== "procedure"}
        />

        <SummaryRow
          title="Configuration"
          value={configValue}
          isActive={activeStep === "configuration"}
          onEdit={() => onJump("configuration")}
          editable={!!configValue && activeStep !== "configuration"}
          last={hideNotesFilesRow}
        />

        {!hideNotesFilesRow && (
          <SummaryRow
            title="Notes & Files"
            value={describeNotesFiles(state)}
            isActive={activeStep === "notes-files"}
            onEdit={() => onJump("notes-files")}
            editable={!!describeNotesFiles(state) && activeStep !== "notes-files"}
            last
          />
        )}
      </aside>
    </div>
  );
}

function describeNotesFiles(state: InfoState): string | null {
  const hasNotes = state.notes.trim().length > 0;
  const files = state.attachments?.length ?? 0;
  if (!hasNotes && files === 0) return null;
  const parts: string[] = [];
  if (hasNotes) parts.push("Notes added");
  if (files > 0) parts.push(`${files} file${files === 1 ? "" : "s"}`);
  return parts.join(" · ");
}

function SummaryRow({
  title,
  value,
  subtitle,
  isActive,
  editable,
  onEdit,
  last,
}: {
  title: string;
  value: string | null;
  subtitle?: string;
  isActive: boolean;
  editable: boolean;
  onEdit: () => void;
  last?: boolean;
}) {
  return (
    <div style={{
      padding: "16px 24px",
      backgroundColor: isActive
        ? "color-mix(in srgb, var(--ads-blue-500) 4%, transparent)"
        : "transparent",
      borderBottomLeftRadius: last ? "var(--ads-radius-sm)" : 0,
      borderBottomRightRadius: last ? "var(--ads-radius-sm)" : 0,
      transition: "background-color var(--ads-duration-fast) var(--ads-ease-standard)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 500,
            color: value ? "var(--ads-text-primary)" : "var(--ads-text-muted)",
            wordBreak: "break-word",
          }}>
            {value || title}
          </div>
          {value && (
            <div style={{
              marginTop: "2px",
              fontSize: "13px",
              lineHeight: "18px",
              color: "var(--ads-text-muted)",
            }}>
              {subtitle || title}
            </div>
          )}
        </div>
        {editable && (
          <button
            type="button"
            aria-label={`Edit ${title}`}
            onClick={onEdit}
            style={{
              flexShrink: 0,
              width: 32,
              height: 32,
              borderRadius: "var(--ads-radius-sm)",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: isActive ? "var(--ads-blue-500)" : "var(--ads-text-primary)",
              transition: "background-color var(--ads-duration-fast)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--ads-background-subtle-hover)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11.5 2.5 L15.5 6.5 L6 16 L2 16 L2 12 Z" />
              <line x1="11.5" y1="2.5" x2="15.5" y2="6.5" />
              <line x1="9.5" y1="4.5" x2="13.5" y2="8.5" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

/** Build a short description for the configuration step's summary value. */
function describeConfig(state: InfoState): string | null {
  if (!state.selectedProcedure) return null;
  const teethCount = state.toothSpecs?.length ?? 0;
  switch (state.selectedProcedure) {
    case "invisalign":
      if (!state.invisalignType) return null;
      return `${state.invisalignType.replace(/-/g, " ")}${state.treatmentStage ? ` · ${state.treatmentStage}` : ""}`;
    case "dentures":
      if (!state.dentureType) return null;
      return `${state.dentureType}${state.archSelection ? ` · ${state.archSelection}` : ""}`;
    default:
      return teethCount > 0 ? `${teethCount} tooth${teethCount === 1 ? "" : "s"}` : null;
  }
}
