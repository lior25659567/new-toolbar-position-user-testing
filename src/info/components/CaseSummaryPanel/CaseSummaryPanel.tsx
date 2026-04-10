import React, { useState } from "react";
import type { InfoState } from "../../types";
import { PrimaryButton } from "../../../design-system";
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
    <div style={{ padding: "16px 0", borderBottom: "1px solid #E5E7EB", animation: "info-fade-in 0.3s ease-out both" }}>
      <div style={{ fontSize: "12px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "Inter, sans-serif", marginBottom: "12px" }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {children}
      </div>
    </div>
  );
}

const PANEL_KF = `
  @keyframes info-fade-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const EXPANDED_WIDTH = 280;
const COLLAPSED_WIDTH = 48;

function CollapseChevron({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: "transform 0.25s ease", transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function CaseSummaryPanel({ state, canProceed, onContinue }: CaseSummaryPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const procedureName = state.selectedProcedure
    ? PROCEDURES.find((p) => p.id === state.selectedProcedure)?.name
    : null;

  const labName = state.sendTo
    ? LAB_DESTINATIONS.find((l) => l.value === state.sendTo)?.label
    : null;

  return (
    <div
      style={{
        width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        minWidth: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        borderLeft: "1px solid #E5E7EB",
        position: "sticky",
        top: 0,
        height: "100%",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
      }}
    >
      <style>{PANEL_KF}</style>
      {/* Toggle button - always visible */}
      <div
        style={{
          display: "flex",
          alignItems: collapsed ? "center" : "flex-start",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "16px 8px" : "20px 24px 12px",
          flexShrink: 0,
        }}
      >
        {!collapsed && (
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#1e2939",
              fontFamily: "Inter, sans-serif",
              margin: 0,
              whiteSpace: "nowrap",
              opacity: collapsed ? 0 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            Case Summary
          </h3>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand summary" : "Collapse summary"}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            backgroundColor: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.15s, box-shadow 0.15s",
            flexShrink: 0,
            color: "#6a7282",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#F3F4F6";
            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <CollapseChevron collapsed={collapsed} />
        </button>
      </div>

      {/* Collapsed vertical label */}
      {collapsed && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <span
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              fontSize: "11px",
              fontWeight: 600,
              color: "#9CA3AF",
              fontFamily: "Inter, sans-serif",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Case Summary
          </span>
        </div>
      )}

      {/* Expanded content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: collapsed ? "0" : "0 24px",
          opacity: collapsed ? 0 : 1,
          visibility: collapsed ? "hidden" : "visible",
          transition: "opacity 0.25s ease 0.05s",
        }}
      >
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
              <SummaryRow label="Plan" value={INVISALIGN_TYPES.find((t) => t.value === state.invisalignType)?.label} />
            )}
            {state.selectedProcedure === "invisalign" && state.treatmentStage && (
              <SummaryRow label="Stage" value={TREATMENT_STAGES.find((t) => t.value === state.treatmentStage)?.label} />
            )}
            {state.selectedProcedure === "dentures" && state.dentureType && (
              <SummaryRow label="Denture" value={DENTURE_TYPES.find((t) => t.value === state.dentureType)?.label} />
            )}
            {state.selectedProcedure === "dentures" && state.dentureStage && (
              <SummaryRow label="Stage" value={DENTURE_STAGES.find((t) => t.value === state.dentureStage)?.label} />
            )}
          </SummarySection>
        )}

        {/* Teeth */}
        {state.toothSpecs.length > 0 && (
          <SummarySection title="Teeth">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {state.toothSpecs.map((spec) => {
                const procLabel = TOOTH_PROCEDURES.find((p) => p.value === spec.procedure)?.label || spec.procedure;
                return (
                  <span
                    key={spec.toothNumber}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "3px 10px",
                      borderRadius: "9999px",
                      border: "1px solid #E5E7EB",
                      backgroundColor: "#F9FAFB",
                      fontSize: "12px",
                      fontFamily: "Inter, sans-serif",
                      color: "#374151",
                      fontWeight: 500,
                    }}
                  >
                    {spec.toothNumber} · {procLabel}
                  </span>
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
            {state.notes && (() => {
              const noteItems = state.notes.split("\n---\n");
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                  <span style={{ fontSize: "13px", color: "#6a7282", fontFamily: "Inter, sans-serif", flexShrink: 0 }}>
                    Notes ({noteItems.length})
                  </span>
                  {noteItems.map((note, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif",
                        lineHeight: "1.4",
                        wordBreak: "break-word",
                        animation: "info-fade-in 0.35s ease-out both",
                      }}
                    >
                      {note.length > 60 ? note.slice(0, 60) + "…" : note}
                    </div>
                  ))}
                </div>
              );
            })()}
          </SummarySection>
        )}
      </div>

      {/* Continue button - only when expanded */}
      {!collapsed && (
        <div style={{ padding: "16px 24px 24px", flexShrink: 0 }}>
          <PrimaryButton size={44} fullWidth disabled={!canProceed} onClick={onContinue}>
            Continue to Scan
          </PrimaryButton>
          {!canProceed && (
            <div style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", textAlign: "center", marginTop: "8px" }}>
              Complete all required fields to continue
            </div>
          )}
        </div>
      )}
    </div>
  );
}
