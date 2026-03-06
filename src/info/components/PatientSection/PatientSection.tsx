import React, { useMemo } from "react";
import type { Patient } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { MOCK_PATIENTS } from "../../constants";
import { SearchInput, PrimaryButton } from "../../../design-system";
import { PatientCard } from "./PatientCard";
import { PatientForm } from "./PatientForm";

interface PatientSectionProps {
  patient: Patient | null;
  searchQuery: string;
  isCreating: boolean;
  dispatch: React.Dispatch<InfoAction>;
}

export function PatientSection({ patient, searchQuery, isCreating, dispatch }: PatientSectionProps) {
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return MOCK_PATIENTS.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.chartNumber.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (patient) {
    return (
      <section>
        <h3 style={sectionTitleStyle}>Patient</h3>
        <PatientCard
          patient={patient}
          onEdit={() => dispatch({ type: "CLEAR_PATIENT" })}
        />
      </section>
    );
  }

  if (isCreating) {
    return (
      <section>
        <h3 style={sectionTitleStyle}>New Patient</h3>
        <PatientForm
          onSave={(p) => dispatch({ type: "SET_PATIENT", patient: p })}
          onCancel={() => dispatch({ type: "SET_CREATING_PATIENT", value: false })}
        />
      </section>
    );
  }

  return (
    <section>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h3 style={{ ...sectionTitleStyle, marginBottom: 0 }}>Patient</h3>
        <PrimaryButton
          size={36}
          onClick={() => dispatch({ type: "SET_CREATING_PATIENT", value: true })}
        >
          + New patient
        </PrimaryButton>
      </div>
      <SearchInput
        placeholder="Search patients by name or chart number…"
        fullWidth
        value={searchQuery}
        onSearch={(v) => dispatch({ type: "SET_PATIENT_SEARCH", query: v })}
      />
      {filteredPatients.length > 0 && (
        <div
          style={{
            marginTop: "8px",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: "white",
          }}
        >
          {filteredPatients.map((p) => (
            <div
              key={p.id}
              onClick={() => dispatch({ type: "SET_PATIENT", patient: p })}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                borderBottom: "1px solid #F3F4F6",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "#1e2939",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8FAFC")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
            >
              <span style={{ fontWeight: 500 }}>
                {p.firstName} {p.lastName}
              </span>
              <span style={{ color: "#6a7282", marginLeft: "8px" }}>{p.chartNumber}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#1e2939",
  fontFamily: "Inter, sans-serif",
  marginBottom: "16px",
  margin: 0,
  marginBlockEnd: "16px",
};
