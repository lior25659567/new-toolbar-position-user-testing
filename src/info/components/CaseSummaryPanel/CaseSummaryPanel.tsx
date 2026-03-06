import React from "react";
import type { InfoState, TagColor } from "../../types";
import { PrimaryButton } from "../../../design-system";
import { Tag } from "../../../design-system";
import { PROCEDURES, TOOTH_PROCEDURES, TOOTH_PROCEDURE_COLORS, LAB_DESTINATIONS, INVISALIGN_TYPES, TREATMENT_STAGES, DENTURE_TYPES, DENTURE_STAGES } from "../../constants";

interface CaseSummaryPanelProps {
  state: InfoState;
  canProceed: boolean;
  onContinue: () => void;
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
      <span style={{ fontSize: "13px", color: "#6a7282", fontFamily: "Inter, sans-serif", flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontSize: "13px", fontWeight: 500, color: "#1e2939", fontFamily: "Inter, sans-serif", textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}

function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "16px 0", borderBottom: "1px solid #E5E7EB" }}>
      <div style={{ fontSize: "12px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "Inter, sans-serif", marginBottom: "12px" }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {children}
      </div>
    </div>
  );
}

export function CaseSummaryPanel({ state, canProceed, onContinue }: CaseSummaryPanelProps) {
  const procedureName = state.selectedProcedure
    ? PROCEDURES.find((p) => p.id === state.selectedProcedure)?.name
    : null;

  const labName = state.sendTo
    ? LAB_DESTINATIONS.find((l) => l.value === state.sendTo)?.label
    : null;

  return (
    <div
      style={{
        width: "280px",
        minWidth: "280px",
        padding: "24px",
        borderLeft: "1px solid #E5E7EB",
        position: "sticky",
        top: 0,
        height: "100%",
        overflowY: "auto",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3
        style={{
          fontSize: "18px",
          fontWeight: 600,
          color: "#1e2939",
          fontFamily: "Inter, sans-serif",
          marginBottom: "8px",
        }}
      >
        Case Summary
      </h3>

      {/* Patient */}
      {state.patient && (
        <SummarySection title="Patient">
          <SummaryRow label="Name" value={`${state.patient.firstName} ${state.patient.lastName}`} />
          <SummaryRow label="Chart #" value={state.patient.chartNumber} />
        </SummarySection>
      )}

      {/* Procedure */}
      {procedureName && (
        <SummarySection title="Procedure">
          <SummaryRow label="Type" value={procedureName} />
          {state.selectedProcedure === "invisalign" && state.invisalignType && (
            <SummaryRow
              label="Plan"
              value={INVISALIGN_TYPES.find((t) => t.value === state.invisalignType)?.label}
            />
          )}
          {state.selectedProcedure === "invisalign" && state.treatmentStage && (
            <SummaryRow
              label="Stage"
              value={TREATMENT_STAGES.find((t) => t.value === state.treatmentStage)?.label}
            />
          )}
          {state.selectedProcedure === "dentures" && state.dentureType && (
            <SummaryRow
              label="Denture"
              value={DENTURE_TYPES.find((t) => t.value === state.dentureType)?.label}
            />
          )}
          {state.selectedProcedure === "dentures" && state.dentureStage && (
            <SummaryRow
              label="Stage"
              value={DENTURE_STAGES.find((t) => t.value === state.dentureStage)?.label}
            />
          )}
        </SummarySection>
      )}

      {/* Teeth */}
      {state.toothSpecs.length > 0 && (
        <SummarySection title="Teeth">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {state.toothSpecs.map((spec) => {
              const procLabel = TOOTH_PROCEDURES.find((p) => p.value === spec.procedure)?.label || spec.procedure;
              const tagColor = TOOTH_PROCEDURE_COLORS[spec.procedure] || "blue";
              return (
                <Tag key={spec.toothNumber} color={tagColor} size="small">
                  {spec.toothNumber} · {procLabel}
                </Tag>
              );
            })}
          </div>
        </SummarySection>
      )}

      {/* Details */}
      {(state.dueDate || labName || state.notes) && (
        <SummarySection title="Details">
          <SummaryRow label="Due date" value={state.dueDate} />
          <SummaryRow label="Send to" value={labName} />
          {state.notes && (
            <div style={{ fontSize: "13px", color: "#6a7282", fontFamily: "Inter, sans-serif", fontStyle: "italic", marginTop: "4px" }}>
              "{state.notes.length > 80 ? state.notes.slice(0, 80) + "…" : state.notes}"
            </div>
          )}
        </SummarySection>
      )}

      {/* Continue button */}
      <div style={{ marginTop: "auto", paddingTop: "24px" }}>
        <PrimaryButton size={44} fullWidth disabled={!canProceed} onClick={onContinue}>
          Continue to Scan
        </PrimaryButton>
        {!canProceed && (
          <div
            style={{
              fontSize: "12px",
              color: "#9CA3AF",
              fontFamily: "Inter, sans-serif",
              textAlign: "center",
              marginTop: "8px",
            }}
          >
            Complete all required fields to continue
          </div>
        )}
      </div>
    </div>
  );
}
