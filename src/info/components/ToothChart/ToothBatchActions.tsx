import React, { useState } from "react";
import type { ToothProcedure } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { TOOTH_PROCEDURES, TOOTH_PROCEDURE_COLORS } from "../../constants";

const tagColors: Record<string, { bg: string; border: string; text: string }> = {
  red: { bg: "#FFF0F3", border: "#FFE0E7", text: "#A30F34" },
  orange: { bg: "#FFF2E3", border: "#FFE5D6", text: "#8A4300" },
  magenta: { bg: "#FFF0F9", border: "#FFE3F4", text: "#A30463" },
  purple: { bg: "#F8F2FF", border: "#F2E6FF", text: "#6C37A1" },
  blue: { bg: "#E6F7FF", border: "#D1F1FF", text: "#005780" },
  green: { bg: "#ECFDF5", border: "#D1FAE5", text: "#065F46" },
};

interface ToothBatchActionsProps {
  selectedCount: number;
  selectedTeeth: number[];
  dispatch: React.Dispatch<InfoAction>;
}

export function ToothBatchActions({ selectedCount, selectedTeeth, dispatch }: ToothBatchActionsProps) {
  const [hoveredProc, setHoveredProc] = useState<string | null>(null);

  if (selectedCount < 1) return null;

  const handleAssign = (procedure: ToothProcedure) => {
    dispatch({
      type: "BATCH_SET_PROCEDURE",
      toothNumbers: selectedTeeth,
      procedure,
    });
  };

  return (
    <div
      style={{
        padding: "16px 0",
        marginTop: "12px",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#1e2939",
          fontFamily: "Inter, sans-serif",
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        Assign procedure to {selectedCount} {selectedCount === 1 ? "tooth" : "teeth"}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {TOOTH_PROCEDURES.map((proc) => {
          const colorKey = TOOTH_PROCEDURE_COLORS[proc.value as ToothProcedure];
          const palette = tagColors[colorKey] || tagColors.blue;
          const isHovered = hoveredProc === proc.value;

          return (
            <button
              key={proc.value}
              type="button"
              onClick={() => handleAssign(proc.value as ToothProcedure)}
              onMouseEnter={() => setHoveredProc(proc.value)}
              onMouseLeave={() => setHoveredProc(null)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "2px 10px",
                borderRadius: "12px",
                border: `1px solid ${palette.border}`,
                backgroundColor: palette.bg,
                color: palette.text,
                fontSize: "11px",
                fontWeight: 500,
                fontFamily: "Inter, sans-serif",
                cursor: "pointer",
                transition: "all 0.15s ease",
                transform: isHovered ? "scale(1.05)" : "scale(1)",
                outline: "none",
              }}
            >
              {proc.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
