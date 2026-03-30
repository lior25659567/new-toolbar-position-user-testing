import React, { useState } from "react";
import type { ToothProcedure } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { TOOTH_PROCEDURES, TOOTH_PROCEDURE_COLORS } from "../../constants";

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
    <div style={{ padding: "16px 0", marginTop: "12px" }}>
      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#1e2939",
          fontFamily: "Inter, sans-serif",
          marginBottom: "10px",
        }}
      >
        Assign procedure to {selectedCount} {selectedCount === 1 ? "tooth" : "teeth"}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {TOOTH_PROCEDURES.map((proc) => {
          const color = TOOTH_PROCEDURE_COLORS[proc.value as ToothProcedure];
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
                gap: "6px",
                height: "36px",
                padding: "0 12px",
                borderRadius: "8px",
                border: `1px solid ${isHovered ? "#9CA3AF" : "#E5E7EB"}`,
                backgroundColor: "#ffffff",
                color: "#1e2939",
                fontSize: "13px",
                fontWeight: 500,
                fontFamily: "Inter, sans-serif",
                cursor: "pointer",
                transition: "border-color 0.15s ease",
                outline: "none",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  flexShrink: 0,
                }}
              />
              {proc.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
