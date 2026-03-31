import React, { useEffect } from "react";
import { useInfoState } from "../state/useInfoState";
import { PatientSection } from "./PatientSection/PatientSection";
import { ProcedureSection } from "./ProcedureSection/ProcedureSection";
import { ConfigSection } from "./ConfigSection/ConfigSection";
import { CaseSummaryPanel } from "./CaseSummaryPanel/CaseSummaryPanel";
import type { Patient } from "../types";

interface InfoPageProps {
  onContinue: () => void;
  onPatientChange?: (patient: Patient | null) => void;
}

const ANIM_KF = `
  @keyframes info-fade-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const sectionCardStyle: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: "12px",
  padding: "24px",
  border: "1px solid #E5E7EB",
  flexShrink: 0,
  animation: "info-fade-in 0.35s ease-out both",
};

export function InfoPage({ onContinue, onPatientChange }: InfoPageProps) {
  const { state, dispatch, canProceed, toothColorMap } = useInfoState();

  useEffect(() => {
    onPatientChange?.(state.patient);
  }, [state.patient, onPatientChange]);

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        backgroundColor: "#F8FAFC",
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
