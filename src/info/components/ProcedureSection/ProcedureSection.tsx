import React, { useState } from "react";
import type { ProcedureType } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { PROCEDURES } from "../../constants";
import { procedureIconMap } from "./ProcedureCard";

/**
 * STUB — original implementation was lost. Renders the procedure picker: a grid
 * of the available procedures from `PROCEDURES`; selecting one dispatches
 * `SET_PROCEDURE`. Procedures are disabled until a patient is chosen.
 */
interface ProcedureSectionProps {
  selectedProcedure: ProcedureType | null;
  hasPatient: boolean;
  dispatch: React.Dispatch<InfoAction>;
  /** Hide the in-section "Procedure" heading (wizard cards render their own). */
  hideHeading?: boolean;
  /** Number of grid columns. Defaults to 3. */
  columns?: number;
  /** Stretch to fill the available height. */
  fillHeight?: boolean;
  /** Accepted for API compatibility with the classic layout. */
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
  const [hoveredId, setHoveredId] = useState<ProcedureType | null>(null);
  // Once a procedure is chosen in the classic (collapsible) layout, the picker
  // collapses to a compact summary row so the page stays short; "Change"
  // re-expands the grid to pick another.
  const [forceExpanded, setForceExpanded] = useState(false);
  const selected = PROCEDURES.find((p) => p.id === selectedProcedure) || null;
  const showGrid = !collapsible || !selected || forceExpanded;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        height: fillHeight ? "100%" : undefined,
        minWidth: 0,
      }}
    >
      {!hideHeading && (
        <h2
          style={{
            margin: 0,
            fontSize: "var(--tp-heading-02-size)",
            lineHeight: "var(--tp-heading-02-lh)",
            fontWeight: 500,
            color: "var(--ads-text-primary)",
            fontFamily: "var(--ads-font-sans)",
          }}
        >
          Procedure
        </h2>
      )}

      {collapsible && selected && !showGrid && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px",
            borderRadius: "var(--ads-radius-md)",
            border: "1px solid var(--ads-border-subtle)",
            backgroundColor: "var(--ads-background-subtle-01)",
          }}
        >
          <span aria-hidden style={{ display: "inline-flex", width: 40, height: 40, flexShrink: 0 }}>
            {React.cloneElement(
              (procedureIconMap[selected.icon] || procedureIconMap.study) as React.ReactElement,
              { width: 40, height: 40 },
            )}
          </span>
          <span style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 }}>
            <span
              style={{
                fontSize: "var(--tp-body-01-size)",
                lineHeight: "var(--tp-body-01-lh)",
                fontWeight: 500,
                color: "var(--ads-text-primary)",
              }}
            >
              {selected.name}
            </span>
            <span
              style={{
                fontSize: "var(--tp-label-01-size)",
                lineHeight: "var(--tp-label-01-lh)",
                color: "var(--ads-text-secondary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {selected.description}
            </span>
          </span>
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={() => setForceExpanded(true)}
            style={{
              flexShrink: 0,
              minHeight: 32,
              padding: "6px 12px",
              borderRadius: "var(--ads-radius-sm)",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontFamily: "var(--ads-font-sans)",
              fontSize: "var(--tp-body-01-size)",
              lineHeight: "var(--tp-body-01-lh)",
              fontWeight: 500,
              color: "var(--ads-text-link)",
            }}
          >
            Change
          </button>
        </div>
      )}

      {!hasPatient && (
        <p
          style={{
            margin: 0,
            fontSize: "var(--tp-body-01-size)",
            lineHeight: "var(--tp-body-01-lh)",
            color: "var(--ads-text-muted)",
            fontFamily: "var(--ads-font-sans)",
          }}
        >
          Select a patient first to choose a procedure.
        </p>
      )}

      {showGrid && (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: "12px",
        }}
      >
        {PROCEDURES.map((p) => {
          const active = p.id === selectedProcedure;
          const hovered = hoveredId === p.id;
          // v2.0 unified card behavior (mirrors ProcedureCard): border-only
          // treatment, no bg fill on any state. Default = 1px border-subtle,
          // hover = 1px border-subtle-hover, selected = 2px border-interactive.
          // -1px padding offset on selected so the card doesn't grow when the
          // border thickens from 1px to 2px.
          const border = active
            ? "2px solid var(--ads-background-interactive)"
            : hovered && hasPatient
              ? "1px solid var(--ads-border-subtle-hover)"
              : "1px solid var(--ads-border-subtle)";
          return (
            <button
              key={p.id}
              type="button"
              disabled={!hasPatient}
              aria-pressed={active}
              onClick={() => {
                dispatch({ type: "SET_PROCEDURE", procedure: p.id });
                setForceExpanded(false);
              }}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId((cur) => (cur === p.id ? null : cur))}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                alignItems: "flex-start",
                textAlign: "left",
                padding: active ? "15px" : "16px",
                borderRadius: "var(--ads-radius-md)",
                border,
                backgroundColor: "var(--ads-background-subtle-01)",
                cursor: hasPatient ? "pointer" : "not-allowed",
                opacity: hasPatient ? 1 : 0.5,
                fontFamily: "var(--ads-font-sans)",
                transition: "border-color var(--ads-duration-fast) var(--ads-ease-standard)",
              }}
            >
              <span
                aria-hidden
                style={{
                  display: "inline-flex",
                  width: 56,
                  height: 56,
                  flexShrink: 0,
                }}
              >
                {React.cloneElement(
                  (procedureIconMap[p.icon] || procedureIconMap.study) as React.ReactElement,
                  { width: 56, height: 56 },
                )}
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span
                  style={{
                    fontSize: "var(--tp-body-01-size)",
                    lineHeight: "var(--tp-body-01-lh)",
                    fontWeight: 500,
                    color: "var(--ads-text-primary)",
                  }}
                >
                  {p.name}
                </span>
                <span
                  style={{
                    fontSize: "var(--tp-label-01-size)",
                    lineHeight: "var(--tp-label-01-lh)",
                    color: "var(--ads-text-secondary)",
                  }}
                >
                  {p.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      )}
    </div>
  );
}
