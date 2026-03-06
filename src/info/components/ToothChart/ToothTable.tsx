import React, { useState } from "react";
import type { InfoState, ToothProcedure, TagColor } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { IconButton } from "../../../design-system";
import { TOOTH_PROCEDURES, TOOTH_PROCEDURE_COLORS, MATERIALS, SHADE_SYSTEMS } from "../../constants";

const tagColors: Record<string, { bg: string; border: string; text: string }> = {
  red: { bg: "#FFF0F3", border: "#FFE0E7", text: "#A30F34" },
  orange: { bg: "#FFF2E3", border: "#FFE5D6", text: "#8A4300" },
  magenta: { bg: "#FFF0F9", border: "#FFE3F4", text: "#A30463" },
  purple: { bg: "#F8F2FF", border: "#F2E6FF", text: "#6C37A1" },
  blue: { bg: "#E6F7FF", border: "#D1F1FF", text: "#005780" },
  green: { bg: "#ECFDF5", border: "#D1FAE5", text: "#065F46" },
};

interface ToothTableProps {
  state: InfoState;
  toothColorMap: Record<number, TagColor>;
  dispatch: React.Dispatch<InfoAction>;
}

export function ToothTable({ state, toothColorMap, dispatch }: ToothTableProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const specs = state.toothSpecs;
  if (specs.length === 0) {
    return (
      <div style={{ padding: "24px", textAlign: "center", color: "#9CA3AF", fontSize: "14px", fontFamily: "Inter, sans-serif" }}>
        No teeth assigned yet. Use the chart view to select teeth.
      </div>
    );
  }

  const cellStyle: React.CSSProperties = {
    padding: "10px 12px",
    fontSize: "13px",
    fontFamily: "Inter, sans-serif",
    borderBottom: "1px solid #F3F4F6",
    whiteSpace: "nowrap",
  };

  const handleRowClick = (toothNumber: number) => {
    dispatch({ type: "TOGGLE_EXPANDED_TOOTH", toothNumber });
  };

  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#F8FAFC" }}>
            <th style={{ ...cellStyle, fontWeight: 600, color: "#6a7282", textAlign: "left", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Tooth</th>
            <th style={{ ...cellStyle, fontWeight: 600, color: "#6a7282", textAlign: "left", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Procedure</th>
            <th style={{ ...cellStyle, fontWeight: 600, color: "#6a7282", textAlign: "left", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Material</th>
            <th style={{ ...cellStyle, fontWeight: 600, color: "#6a7282", textAlign: "left", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Shade</th>
            <th style={{ ...cellStyle, fontWeight: 600, color: "#6a7282", textAlign: "center", fontSize: "11px", width: "40px" }}></th>
          </tr>
        </thead>
        <tbody>
          {specs
            .slice()
            .sort((a, b) => a.toothNumber - b.toothNumber)
            .map((spec) => {
              const colorKey = toothColorMap[spec.toothNumber];
              const palette = colorKey ? tagColors[colorKey] : null;
              const procLabel = TOOTH_PROCEDURES.find((p) => p.value === spec.procedure)?.label || spec.procedure;
              const matLabel = spec.material ? MATERIALS.find((m) => m.value === spec.material)?.label || spec.material : "—";
              const shadeLabel = spec.shadeBody || "—";
              const isHovered = hoveredRow === spec.toothNumber;
              const isExpanded = state.expandedTeeth.includes(spec.toothNumber);

              return (
                <tr
                  key={spec.toothNumber}
                  onMouseEnter={() => setHoveredRow(spec.toothNumber)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => handleRowClick(spec.toothNumber)}
                  style={{
                    backgroundColor: isExpanded ? "#E0F2FE" : isHovered ? "#F9FAFB" : "white",
                    cursor: "pointer",
                    transition: "background-color 0.1s",
                  }}
                >
                  <td style={{ ...cellStyle, fontWeight: 600, color: "#1e2939" }}>{spec.toothNumber}</td>
                  <td style={cellStyle}>
                    {palette ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "2px 10px",
                          borderRadius: "12px",
                          backgroundColor: palette.bg,
                          border: `1px solid ${palette.border}`,
                          color: palette.text,
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {procLabel}
                      </span>
                    ) : (
                      procLabel
                    )}
                  </td>
                  <td style={{ ...cellStyle, color: "#374151" }}>{matLabel}</td>
                  <td style={{ ...cellStyle, color: "#374151" }}>{shadeLabel}</td>
                  <td style={{ ...cellStyle, textAlign: "center" }}>
                    <IconButton
                      aria-label="Remove tooth"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: "REMOVE_TOOTH", toothNumber: spec.toothNumber });
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" />
                      </svg>
                    </IconButton>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
