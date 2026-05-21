import React from "react";
import type { Patient } from "../../types";
import { GhostButton } from "../../../design-system";
import { patientAvatarUrl } from "../../utils/patientAvatar";
import { EditIcon } from "../icons/EditIcon";

interface PatientCardProps {
  patient: Patient;
  /** When set, shows an edit-icon ghost button that deselects the patient. */
  onClear?: () => void;
}

export function PatientCard({ patient, onClear }: PatientCardProps) {
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
        backgroundColor: "var(--ads-background-subtle-01)",
        borderRadius: "var(--ads-radius-md)",
        border: "1px solid var(--ads-border-subtle)",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          backgroundColor: "var(--ads-background-highlight-blue)",
          border: "1px solid var(--ads-border-highlight-blue)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            color: "var(--ads-text-on-highlight-blue)",
            fontSize: "15px",
            fontWeight: 500,
            fontFamily: "var(--ads-font-sans)",
          }}
        >
          {initials}
        </span>
        <img
          src={patientAvatarUrl(patient)}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "relative" }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "var(--tp-body-01-size)",
            lineHeight: "var(--tp-body-01-lh)",
            fontWeight: 500,
            color: "var(--ads-text-primary)",
            fontFamily: "var(--ads-font-sans)",
          }}
        >
          {patient.firstName} {patient.lastName}
        </div>
        <div
          style={{
            fontSize: "var(--tp-label-01-size)",
            lineHeight: "var(--tp-label-01-lh)",
            color: "var(--ads-text-secondary)",
            fontFamily: "var(--ads-font-sans)",
            marginTop: "2px",
          }}
        >
          {patient.gender === "male" ? "Male" : patient.gender === "female" ? "Female" : "Other"} · {age} yrs · {patient.chartNumber}
        </div>
      </div>

      {onClear && (
        <div style={{ flexShrink: 0 }}>
          <GhostButton
            size={36}
            onClick={onClear}
            aria-label="Edit patient"
            title="Edit"
            style={{ width: 36, padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            <EditIcon size={18} />
          </GhostButton>
        </div>
      )}
    </div>
  );
}
