import React, { useMemo, useState } from "react";
import type { Patient } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { MOCK_PATIENTS } from "../../constants";
import { SearchInput, PrimaryButton, DropdownList } from "../../../design-system";
import { PatientCard } from "./PatientCard";
import { PatientForm } from "./PatientForm";
import { patientAvatarUrl, patientHasPhoto } from "../../utils/patientAvatar";

type SortKey = "name" | "gender" | "dob" | "chart";
type SortDir = "asc" | "desc";

interface PatientSectionProps {
  patient: Patient | null;
  searchQuery: string;
  isCreating: boolean;
  dispatch: React.Dispatch<InfoAction>;
  /** Hide the section's own h3 heading — used by wizard variants that
   *  render their own big title above the section. */
  hideHeading?: boolean;
  /** Stretch the section (and its patient table) to fill the parent's
   *  height instead of capping the table at 480px. Used by the wizard
   *  variant so the Patient step card doesn't have a short table
   *  floating inside a tall card. */
  fillHeight?: boolean;
  /** Open the picker table immediately on mount (vs. showing only the
   *  search toolbar). Used by the sticky variant so pressing "Edit" jumps
   *  straight to the list of patients. */
  defaultPickerOpen?: boolean;
}

// ─── Sort options for the toolbar "Sort by: <key>" control ─────────────────
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "gender", label: "Gender" },
  { value: "dob", label: "Date of birth" },
  { value: "chart", label: "Chart" },
];

function formatDob(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function genderLabel(g: Patient["gender"]): string {
  return g === "male" ? "Male" : g === "female" ? "Female" : "Other";
}

function initials(p: Patient): string {
  return `${p.firstName[0] ?? ""}${p.lastName[0] ?? ""}`.toUpperCase();
}

function compare(a: Patient, b: Patient, key: SortKey): number {
  switch (key) {
    case "name":
      return `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
    case "gender":
      return a.gender.localeCompare(b.gender);
    case "dob":
      return a.dateOfBirth.localeCompare(b.dateOfBirth);
    case "chart":
      return a.chartNumber.localeCompare(b.chartNumber);
  }
}

export function PatientSection({ patient, searchQuery, isCreating, dispatch, hideHeading, fillHeight, defaultPickerOpen }: PatientSectionProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  // When a patient is selected the card view shows; opening search/sort
  // reveals the picker again so another patient can be chosen without clearing.
  const [searchOpen, setSearchOpen] = useState(!!defaultPickerOpen);

  const hasQuery = searchQuery.trim().length > 0;

  const rows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = MOCK_PATIENTS.filter((p) => {
      if (!q) return true;
      return (
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.chartNumber.toLowerCase().includes(q)
      );
    });
    filtered.sort((a, b) => {
      const c = compare(a, b, sortKey);
      return sortDir === "asc" ? c : -c;
    });
    return filtered;
  }, [searchQuery, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  if (isCreating) {
    return (
      <section>
        <h3 style={sectionTitleStyle}>New Patient</h3>
        <PatientForm
          onSave={(p) => {
            dispatch({ type: "SET_PATIENT", patient: p });
            setSearchOpen(false);
          }}
          onCancel={() => dispatch({ type: "SET_CREATING_PATIENT", value: false })}
        />
      </section>
    );
  }

  // Show the PatientCard once a patient is selected — unless the user
  // re-opened the picker (by typing in search or changing the sort).
  const tableActive = hasQuery || searchOpen;
  const showCard = patient && !tableActive;

  const openPicker = () => setSearchOpen(true);

  const sectionStyle: React.CSSProperties = fillHeight
    ? { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }
    : {};

  return (
    <section style={sectionStyle}>
      {!hideHeading && <h3 style={sectionTitleStyle}>Patient</h3>}

      {/* Best-practice picker → selected pattern:
          • Selected state: render only the PatientCard with Change + Clear
            actions. Toolbar is hidden so the chosen patient is the focus.
          • Picker state (no patient OR user clicked "Change"): render the
            search / sort / new-patient toolbar and the patient table. */}
      {showCard && patient ? (
        <PatientCard
          patient={patient}
          onClear={() => {
            dispatch({ type: "CLEAR_PATIENT" });
            setSearchOpen(true);
          }}
        />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <div onMouseDown={openPicker} onFocus={openPicker}>
              <SearchInput
                placeholder="Search"
                value={searchQuery}
                onSearch={(v) => dispatch({ type: "SET_PATIENT_SEARCH", query: v })}
              />
            </div>
            <DropdownList
              value={sortKey}
              options={SORT_OPTIONS}
              onChange={(v) => {
                setSortKey(v as SortKey);
                setSortDir("asc");
              }}
            />
          </div>
          <PrimaryButton
            size={36}
            onClick={() => dispatch({ type: "SET_CREATING_PATIENT", value: true })}
          >
            + New patient
          </PrimaryButton>
        </div>
      )}

      {tableActive && !showCard && (
        <div
          style={{
            border: "1px solid var(--ads-border-subtle)",
            borderRadius: "var(--ads-radius-md)",
            overflow: "hidden",
            backgroundColor: "var(--ads-background-subtle-01)",
            // Default: cap the table at 480px so it doesn't dominate the
            // classic layout. In `fillHeight` mode (wizard) the table
            // grows to fill the remaining card height instead.
            ...(fillHeight
              ? { flex: 1, minHeight: 0 }
              : { maxHeight: "480px" }),
            overflowY: "auto",
            position: "relative",
          }}
        >
          <PatientListHeader sortKey={sortKey} sortDir={sortDir} onToggleSort={toggleSort} />
          {rows.length === 0 ? (
            <div
              style={{
                padding: "24px 16px",
                textAlign: "center",
                fontFamily: "var(--ads-font-sans)",
                fontSize: "var(--tp-body-01-size)",
                lineHeight: "var(--tp-body-01-lh)",
                color: "var(--ads-text-secondary)",
              }}
            >
              No patients match the current search and filters.
            </div>
          ) : (
            rows.map((p, i) => (
              <PatientListRow
                key={p.id}
                patient={p}
                isLast={i === rows.length - 1}
                isSelected={patient?.id === p.id}
                onSelect={() => {
                  dispatch({ type: "SET_PATIENT", patient: p });
                  setSearchOpen(false);
                }}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
}


// ─── Header row — sortable column headers (DS-styled, arrow on the active key) ─
function PatientListHeader({
  sortKey,
  sortDir,
  onToggleSort,
}: {
  sortKey: SortKey;
  sortDir: SortDir;
  onToggleSort: (k: SortKey) => void;
}) {
  return (
    <div
      role="row"
      style={{
        display: "grid",
        gridTemplateColumns: GRID_COLS,
        gap: "16px",
        alignItems: "center",
        padding: "10px 16px",
        borderBottom: "1px solid var(--ads-border-subtle)",
        backgroundColor: "var(--ads-background-subtle-01)",
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      <span /> {/* checkbox column */}
      <HeaderCell columnKey="name" label="Name" sortKey={sortKey} sortDir={sortDir} onClick={onToggleSort} />
      <HeaderCell columnKey="gender" label="Gender" sortKey={sortKey} sortDir={sortDir} onClick={onToggleSort} />
      <HeaderCell columnKey="dob" label="Date of birth" sortKey={sortKey} sortDir={sortDir} onClick={onToggleSort} />
      <HeaderCell columnKey="chart" label="Chart" sortKey={sortKey} sortDir={sortDir} onClick={onToggleSort} />
    </div>
  );
}

function HeaderCell({
  columnKey,
  label,
  sortKey,
  sortDir,
  onClick,
}: {
  columnKey: SortKey;
  label: string;
  sortKey: SortKey;
  sortDir: SortDir;
  onClick: (k: SortKey) => void;
}) {
  const active = columnKey === sortKey;
  return (
    <button
      type="button"
      onClick={() => onClick(columnKey)}
      aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        margin: 0,
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "var(--ads-font-sans)",
        fontSize: "var(--tp-label-01-size)",
        lineHeight: "var(--tp-label-01-lh)",
        fontWeight: 400,
        color: active ? "var(--ads-text-primary)" : "var(--ads-text-secondary)",
        outline: "none",
      }}
    >
      <span>{label}</span>
      {active && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          style={{
            transform: sortDir === "asc" ? "rotate(180deg)" : "none",
            transition: "transform var(--ads-duration-fast) var(--ads-ease-standard)",
          }}
        >
          <path
            d="M3 5L6 8L9 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

// ─── Row ────────────────────────────────────────────────────────────────────
function PatientListRow({
  patient,
  onSelect,
  isLast,
  isSelected,
}: {
  patient: Patient;
  onSelect: () => void;
  isLast?: boolean;
  isSelected?: boolean;
}) {
  const [hovered, setHovered] = React.useState(false);
  const bg = isSelected
    ? "var(--ads-background-subtle-00)"
    : hovered
    ? "var(--ads-background-subtle-hover)"
    : "var(--ads-background-subtle-01)";
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-selected={isSelected || undefined}
      style={{
        display: "grid",
        gridTemplateColumns: GRID_COLS,
        gap: "16px",
        alignItems: "center",
        width: "100%",
        minHeight: "64px",
        padding: "12px 16px",
        border: 0,
        borderBottom: isLast ? "0" : "1px solid var(--ads-border-subtle)",
        background: bg,
        textAlign: "left",
        cursor: "pointer",
        fontFamily: "var(--ads-font-sans)",
        transition: "background-color var(--ads-duration-fast) var(--ads-ease-standard)",
      }}
    >
      {/* Checkbox cell */}
      <RowCheckbox checked={!!isSelected} />

      {/* Name cell: avatar + (name + doctor) */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
        <div
          aria-hidden
          style={{
            width: 36,
            height: 36,
            minWidth: 36,
            minHeight: 36,
            borderRadius: "50%",
            backgroundColor: "var(--ads-background-highlight-blue)",
            border: "1px solid var(--ads-border-highlight-blue)",
            boxSizing: "border-box",
            color: "var(--ads-text-on-highlight-blue)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--ads-font-sans)",
            fontSize: "var(--tp-label-01-size)",
            lineHeight: "var(--tp-label-01-lh)",
            fontWeight: 500,
            letterSpacing: "0.02em",
            flexShrink: 0,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <span style={{ position: "absolute" }}>{initials(patient)}</span>
          {patientHasPhoto(patient) && (
            <img
              src={patientAvatarUrl(patient)}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", position: "relative" }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, gap: "2px" }}>
          <span
            style={{
              fontFamily: "var(--ads-font-sans)",
              fontSize: "var(--tp-body-01-size)",
              lineHeight: "var(--tp-body-01-lh)",
              color: "var(--ads-text-primary)",
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {patient.firstName} {patient.lastName}
          </span>
          <span
            style={{
              fontFamily: "var(--ads-font-sans)",
              fontSize: "var(--tp-label-01-size)",
              lineHeight: "var(--tp-label-01-lh)",
              color: "var(--ads-text-secondary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Dr. Mitra Malini
          </span>
        </div>
      </div>

      <span style={cellStyle}>{genderLabel(patient.gender)}</span>
      <span style={cellStyle}>{formatDob(patient.dateOfBirth)}</span>
      <span style={cellStyle}>{patient.chartNumber}</span>
    </button>
  );
}

// Visual-only checkbox indicator. The whole row is the actual button — this
// pseudo-checkbox reflects selection state without intercepting clicks.
function RowCheckbox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        width: 20,
        height: 20,
        borderRadius: "var(--ads-radius-xs)",
        border: checked
          ? "1px solid var(--ads-background-interactive)"
          : "1px solid var(--ads-border-accent)",
        backgroundColor: checked ? "var(--ads-background-interactive)" : "transparent",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition:
          "background-color var(--ads-duration-fast) var(--ads-ease-standard), border-color var(--ads-duration-fast) var(--ads-ease-standard)",
      }}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M2.5 6L5 8.5L9.5 3.5"
            stroke="var(--ads-icon-on-color-primary)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

const GRID_COLS = "20px minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)";

const cellStyle: React.CSSProperties = {
  fontFamily: "var(--ads-font-sans)",
  fontSize: "var(--tp-body-01-size)",
  lineHeight: "var(--tp-body-01-lh)",
  color: "var(--ads-text-primary)",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "17px",
  fontWeight: 500,
  color: "var(--ads-text-primary)",
  fontFamily: "var(--ads-font-sans)",
  marginBottom: "16px",
  margin: 0,
  marginBlockEnd: "16px",
  letterSpacing: "0",
};
