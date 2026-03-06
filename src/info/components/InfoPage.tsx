import React from "react";
import { useInfoState } from "../state/useInfoState";
import { PatientSection } from "./PatientSection/PatientSection";
import { ProcedureSection } from "./ProcedureSection/ProcedureSection";
import { ConfigSection } from "./ConfigSection/ConfigSection";
import { CaseSummaryPanel } from "./CaseSummaryPanel/CaseSummaryPanel";

interface InfoPageProps {
  onContinue: () => void;
}

const sectionCardStyle: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: "12px",
  padding: "24px",
  border: "1px solid #E5E7EB",
};

export function InfoPage({ onContinue }: InfoPageProps) {
  const { state, dispatch, canProceed, toothColorMap } = useInfoState();

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        backgroundColor: "#F8FAFC",
      }}
    >
      {/* Left column - scrollable workflow */}
      <div
        style={{
          flex: 1,
          padding: "32px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div style={sectionCardStyle}>
          <PatientSection
            patient={state.patient}
            searchQuery={state.patientSearchQuery}
            isCreating={state.isCreatingPatient}
            dispatch={dispatch}
          />
        </div>
        <div style={sectionCardStyle}>
          <ProcedureSection
            selectedProcedure={state.selectedProcedure}
            hasPatient={!!state.patient}
            dispatch={dispatch}
          />
        </div>
        {state.selectedProcedure && (
          <div style={sectionCardStyle}>
            <ConfigSection
              state={state}
              toothColorMap={toothColorMap}
              dispatch={dispatch}
            />
          </div>
        )}
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
