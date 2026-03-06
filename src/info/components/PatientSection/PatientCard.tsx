import React from "react";
import type { Patient } from "../../types";
import { GhostButton } from "../../../design-system";

interface PatientCardProps {
  patient: Patient;
  onEdit: () => void;
}

export function PatientCard({ patient, onEdit }: PatientCardProps) {
  const initials = `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();
  const age = Math.floor(
    (Date.now() - new Date(patient.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px",
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #E5E7EB",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          backgroundColor: "#E8F4F8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: "#007BA3",
            fontSize: "15px",
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {initials}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#1e2939",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {patient.firstName} {patient.lastName}
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "#6a7282",
            fontFamily: "Inter, sans-serif",
            marginTop: "2px",
          }}
        >
          {patient.gender === "male" ? "Male" : patient.gender === "female" ? "Female" : "Other"} · {age} yrs · {patient.chartNumber}
        </div>
      </div>
      <GhostButton onClick={onEdit} style={{ fontSize: "14px" }}>
        Edit
      </GhostButton>
    </div>
  );
}
