import React, { useEffect, useState } from "react";
import type { ProcedureType } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { PROCEDURES } from "../../constants";
import { ProcedureCard } from "./ProcedureCard";
import { GhostButton } from "../../../design-system";
import { EditIcon } from "../icons/EditIcon";

interface ProcedureSectionProps {
  selectedProcedure: ProcedureType | null;
  hasPatient: boolean;
  dispatch: React.Dispatch<InfoAction>;
  /** Hide the section's own h3 heading — used by wizard variants that
   *  render their own big title above the section. */
  hideHeading?: boolean;
  /** Number of grid columns. Defaults to 3 (classic layout). */
  columns?: number;
  /** Stretch the section to fill its parent's height and divide rows
   *  evenly so cards fill the available space instead of hugging
   *  their content. Used by the wizard variant. */
  fillHeight?: boolean;
  /** When true, collapse the picker into a compact row once a
   *  procedure has been chosen (with a "Change" affordance to expand
   *  again). Used by the classic layout to keep the page short after
   *  selection. */
  collapsible?: boolean;
}

export function ProcedureSection({
  selectedProcedure,
  hasPatient,
  dispatch,
  hideHeading,
  columns = 3,
  fillHeight,
  collapsible,
}: ProcedureSectionProps) {
  // Local "expanded" state for the collapsible (classic) layout. Starts
  // collapsed once a procedure is set, expands while the user is
  // choosing, and re-collapses the moment a selection is made.
  const [expanded, setExpanded] = useState<boolean>(!selectedProcedure);
  useEffect(() => {
    if (collapsible && selectedProcedure) setExpanded(false);
  }, [collapsible, selectedProcedure]);

  const handleSelect = (id: ProcedureType) => {
    dispatch({ type: "SET_PROCEDURE", procedure: id });
    if (collapsible) setExpanded(false);
  };

  const selectedProc = selectedProcedure
    ? PROCEDURES.find((p) => p.id === selectedProcedure) ?? null
    : null;

  const showCollapsedRow = collapsible && selectedProc && !expanded;

  return (
    <section
      style={{
        opacity: hasPatient ? 1 : 0.4,
        pointerEvents: hasPatient ? "auto" : "none",
        transition: "opacity 0.3s",
        ...(fillHeight
          ? { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }
          : null),
      }}
    >
      {!hideHeading && (
        <h3
          style={{
            fontSize: "17px",
            fontWeight: 500,
            color: "var(--ads-text-primary)",
            fontFamily: "var(--ads-font-sans)",
            margin: "0 0 16px",
          }}
        >
          Procedure
        </h3>
      )}
      {showCollapsedRow ? (
        <SelectedProcedureRow
          name={selectedProc!.name}
          description={selectedProc!.description}
          icon={selectedProc!.icon}
          onChange={() => setExpanded(true)}
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: "16px",
            ...(fillHeight ? { flex: 1, gridAutoRows: "1fr", minHeight: 0 } : null),
          }}
        >
          {PROCEDURES.map((proc) => (
            <ProcedureCard
              key={proc.id}
              id={proc.id}
              name={proc.name}
              description={proc.description}
              icon={proc.icon}
              selected={selectedProcedure === proc.id}
              disabled={!hasPatient}
              onSelect={handleSelect}
              wizard={fillHeight}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/** Compact selected-procedure pill shown in the classic layout's
 *  collapsed state. Keeps the visual link to the chosen card without
 *  taking up the full grid. The Change action sits inside the pill on
 *  the right so the heading stays clean. */
function SelectedProcedureRow({
  name,
  description,
  onChange,
}: {
  name: string;
  description: string;
  icon: string;
  onChange: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        borderRadius: "var(--ads-radius-md)",
        border: "1px solid var(--ads-border-subtle)",
        backgroundColor: "var(--ads-background-subtle-01)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, gap: 2, flex: 1 }}>
        <span
          style={{
            fontSize: "var(--tp-body-01-size)",
            lineHeight: "var(--tp-body-01-lh)",
            fontWeight: 500,
            color: "var(--ads-text-primary)",
            fontFamily: "var(--ads-font-sans)",
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontSize: "var(--tp-label-01-size)",
            lineHeight: "var(--tp-label-01-lh)",
            color: "var(--ads-text-secondary)",
            fontFamily: "var(--ads-font-sans)",
          }}
        >
          {description}
        </span>
      </div>
      <GhostButton
        size={36}
        onClick={onChange}
        aria-label="Change procedure"
        title="Change"
        style={{ width: 36, padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      >
        <EditIcon size={18} />
      </GhostButton>
    </div>
  );
}
