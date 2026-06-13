import React, { useState } from "react";
import type { InfoState, ToothProcedure, ToothSpec } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { IconButton } from "../../../design-system";
import { TOOTH_PROCEDURES, TOOTH_PROCEDURE_COLORS, MATERIALS } from "../../constants";

interface ToothTableProps {
  state: InfoState;
  toothColorMap: Record<number, string>;
  dispatch: React.Dispatch<InfoAction>;
}

/** Column tracks shared by the header and rows so they stay aligned —
 *  same approach as PatientSection. Trailing 40px is the remove-icon
 *  column. */
const GRID_COLS = "minmax(0, 0.6fr) minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr) 40px";

export function ToothTable({ state, dispatch }: ToothTableProps) {
  const specs = state.toothSpecs;
  if (specs.length === 0) {
    return (
      <div style={{ padding: "24px", textAlign: "center", color: "var(--ads-text-muted)", fontSize: "var(--tp-body-01-size)", lineHeight: "var(--tp-body-01-lh)", fontFamily: "var(--ads-font-sans)" }}>
        No teeth assigned yet. Use the chart view to select teeth.
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid var(--ads-border-subtle)",
        borderRadius: "var(--ads-radius-md)",
        overflow: "hidden",
        backgroundColor: "var(--ads-background-subtle-01)",
        position: "relative",
      }}
    >
      <ToothListHeader />
      {specs
        .slice()
        .sort((a, b) => a.toothNumber - b.toothNumber)
        .map((spec, i, arr) => (
          <ToothListRow
            key={spec.toothNumber}
            spec={spec}
            isLast={i === arr.length - 1}
            isExpanded={state.expandedTeeth.includes(spec.toothNumber)}
            onSelect={() => dispatch({ type: "TOGGLE_EXPANDED_TOOTH", toothNumber: spec.toothNumber })}
            onRemove={() => dispatch({ type: "REMOVE_TOOTH", toothNumber: spec.toothNumber })}
          />
        ))}
    </div>
  );
}

function ToothListHeader() {
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
      <HeaderCell>Tooth</HeaderCell>
      <HeaderCell>Procedure</HeaderCell>
      <HeaderCell>Material</HeaderCell>
      <HeaderCell>Shade</HeaderCell>
      <span />
    </div>
  );
}

function HeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--ads-font-sans)",
        fontSize: "var(--tp-label-01-size)",
        lineHeight: "var(--tp-label-01-lh)",
        fontWeight: 400,
        color: "var(--ads-text-secondary)",
      }}
    >
      {children}
    </span>
  );
}

function ToothListRow({
  spec,
  isLast,
  isExpanded,
  onSelect,
  onRemove,
}: {
  spec: ToothSpec;
  isLast: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const procColor = TOOTH_PROCEDURE_COLORS[spec.procedure as ToothProcedure];
  const procLabel = TOOTH_PROCEDURES.find((p) => p.value === spec.procedure)?.label || spec.procedure;
  const matLabel = spec.material ? MATERIALS.find((m) => m.value === spec.material)?.label || spec.material : "—";
  const shadeLabel = spec.shadeBody || "—";

  const bg = isExpanded
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
      aria-selected={isExpanded || undefined}
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
      <span
        style={{
          fontFamily: "var(--ads-font-sans)",
          fontSize: "var(--tp-body-01-size)",
          lineHeight: "var(--tp-body-01-lh)",
          color: "var(--ads-text-primary)",
          fontWeight: 500,
        }}
      >
        {spec.toothNumber}
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        {procColor && (
          <div
            aria-hidden
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: procColor,
              flexShrink: 0,
            }}
          />
        )}
        <span style={rowCellStyle}>{procLabel}</span>
      </span>
      <span style={rowCellStyle}>{matLabel}</span>
      <span style={rowCellStyle}>{shadeLabel}</span>
      <span style={{ display: "inline-flex", justifyContent: "center" }}>
        <IconButton
          aria-label="Remove tooth"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--ads-text-muted)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" />
          </svg>
        </IconButton>
      </span>
    </button>
  );
}

const rowCellStyle: React.CSSProperties = {
  fontFamily: "var(--ads-font-sans)",
  fontSize: "var(--tp-body-01-size)",
  lineHeight: "var(--tp-body-01-lh)",
  color: "var(--ads-text-primary)",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};
