import React from "react";
import type { Patient } from "../../types";
import { SecondaryButton } from "../../../design-system";
import { patientAvatarUrl } from "../../utils/patientAvatar";
import { EditIcon } from "../icons/EditIcon";

interface PatientHeaderBarProps {
  patient: Patient;
  /** Re-open the patient picker (pencil / edit). Renders the default edit
   *  button on the right unless `actions` is provided. */
  onEdit?: () => void;
  /** Custom right-aligned content (e.g. page action buttons). When provided
   *  it replaces the default edit button. */
  actions?: React.ReactNode;
}

function formatDob(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}/${dd}/${d.getFullYear()}`;
}

/** Small chart-number badge icon (matches the Figma "chart" glyph). */
function ChartIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="2.5" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 7h3M5 9.5h4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="11" cy="7" r="1.4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** A labelled field column: muted label over a value (Figma "Birthdate" / "Notes"). */
function Field({ label, value, placeholder }: { label: string; value?: string; placeholder?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
      <span
        style={{
          fontSize: "var(--tp-label-01-size)",
          lineHeight: "var(--tp-label-01-lh)",
          color: "var(--ads-text-muted)",
          fontFamily: "var(--ads-font-sans)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "var(--tp-body-01-size)",
          lineHeight: "var(--tp-body-01-lh)",
          color: value ? "var(--ads-text-primary)" : "var(--ads-text-placeholder)",
          fontFamily: "var(--ads-font-sans)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value || placeholder}
      </span>
    </div>
  );
}

/**
 * Full-width horizontal patient header, modelled on the Figma records header:
 * avatar + name + chart number on the left, Birthdate / Notes fields in the
 * middle, and an Edit action on the right (no "Start new order" button).
 */
export function PatientHeaderBar({ patient, onEdit, actions }: PatientHeaderBarProps) {
  const initials = `${patient.firstName[0] ?? ""}${patient.lastName[0] ?? ""}`.toUpperCase();
  const age = Math.floor(
    (Date.now() - new Date(patient.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "72px",
        width: "100%",
      }}
    >
      {/* Identity: avatar + name + chart number */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: "0 1 auto", minWidth: 0 }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            minWidth: "48px",
            borderRadius: "50%",
            backgroundColor: "var(--ads-background-highlight-blue)",
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
              fontSize: "16px",
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
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
          <span
            style={{
              fontSize: "var(--tp-heading-03-size)",
              lineHeight: "var(--tp-heading-03-lh)",
              fontWeight: 500,
              color: "var(--ads-text-primary)",
              fontFamily: "var(--ads-font-sans)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {patient.firstName} {patient.lastName}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--ads-text-secondary)",
              fontFamily: "var(--ads-font-sans)",
              fontSize: "var(--tp-body-01-size)",
              lineHeight: "var(--tp-body-01-lh)",
            }}
          >
            <ChartIcon size={16} />
            {patient.chartNumber}
          </span>
        </div>
      </div>

      {/* Detail fields */}
      <Field label="Birthdate" value={`${formatDob(patient.dateOfBirth)} (${age} years)`} />
      <Field label="Notes" placeholder="Progress notes here." />

      {/* Right-aligned actions: custom content if provided, else the default
          edit button. */}
      <div style={{ marginLeft: "auto", flexShrink: 0, display: "flex", alignItems: "center", gap: "8px" }}>
        {actions ?? (
          onEdit && (
            <SecondaryButton
              size={36}
              onClick={onEdit}
              aria-label="Edit patient"
              title="Edit"
              style={{ width: 36, padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >
              <EditIcon size={18} />
            </SecondaryButton>
          )
        )}
      </div>
    </div>
  );
}
