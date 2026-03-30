import React, { useState } from "react";
import type { ToothSpec, ToothProcedure } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { DropdownList, IconButton } from "../../../design-system";
import { TOOTH_PROCEDURES, TOOTH_PROCEDURE_COLORS, MATERIALS, SHADE_SYSTEMS, SHADE_OPTIONS } from "../../constants";

interface ToothDetailPanelProps {
  toothNumbers: number[];
  specs: ToothSpec[];
  dispatch: React.Dispatch<InfoAction>;
}

export function ToothDetailPanel({ toothNumbers, specs, dispatch }: ToothDetailPanelProps) {
  const [hoveredProc, setHoveredProc] = useState<string | null>(null);

  const firstSpec = specs[0];
  const procedure = firstSpec?.procedure || "";
  const material = firstSpec?.material || "";
  const shadeSystem = firstSpec?.shadeSystem || "";
  const shadeBody = firstSpec?.shadeBody || "";
  const isBatch = toothNumbers.length > 1;

  const shadeOptions = shadeSystem
    ? (SHADE_OPTIONS[shadeSystem] || []).map((s) => ({ value: s, label: s }))
    : [];

  const handleProcedureSelect = (proc: ToothProcedure) => {
    for (const num of toothNumbers) {
      dispatch({ type: "SET_TOOTH_SPEC", toothNumber: num, spec: { procedure: proc } });
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    for (const num of toothNumbers) {
      if (field === "shadeSystem") {
        dispatch({ type: "SET_TOOTH_SPEC", toothNumber: num, spec: { shadeSystem: value, shadeBody: "" } });
      } else {
        dispatch({ type: "SET_TOOTH_SPEC", toothNumber: num, spec: { [field]: value } });
      }
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #E5E7EB",
        marginTop: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ fontSize: "15px", fontWeight: 600, color: "#1e2939", fontFamily: "Inter, sans-serif" }}>
          {isBatch ? `Teeth ${toothNumbers.join(", ")}` : `Tooth ${toothNumbers[0]}`}
        </div>
        <IconButton
          aria-label="Close"
          onClick={() => dispatch({ type: "SET_EXPANDED_TEETH", teeth: [] })}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 4L4 12M4 4l8 8" />
          </svg>
        </IconButton>
      </div>

      {/* Procedure buttons */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "12px", fontWeight: 400, color: "#6a7282", fontFamily: "Inter, sans-serif", marginBottom: "8px" }}>
          Procedure
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {TOOTH_PROCEDURES.map((proc) => {
            const color = TOOTH_PROCEDURE_COLORS[proc.value as ToothProcedure];
            const isSelected = procedure === proc.value;
            const isHovered = hoveredProc === proc.value;

            return (
              <button
                key={proc.value}
                type="button"
                onClick={() => handleProcedureSelect(proc.value as ToothProcedure)}
                onMouseEnter={() => setHoveredProc(proc.value)}
                onMouseLeave={() => setHoveredProc(null)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "36px",
                  padding: "0 12px",
                  borderRadius: "8px",
                  border: `${isSelected ? "2px" : "1px"} solid ${isSelected ? color : isHovered ? "#9CA3AF" : "#E5E7EB"}`,
                  backgroundColor: "#ffffff",
                  color: "#1e2939",
                  fontSize: "13px",
                  fontWeight: isSelected ? 600 : 400,
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

      {/* Material + Shade fields */}
      {procedure && procedure !== "missing" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <DropdownList
            label="Material"
            fullWidth
            placeholder="Select"
            options={MATERIALS}
            value={material}
            onChange={(v) => handleFieldChange("material", v)}
          />
          <DropdownList
            label="Shade system"
            fullWidth
            placeholder="Select"
            options={SHADE_SYSTEMS}
            value={shadeSystem}
            onChange={(v) => handleFieldChange("shadeSystem", v)}
          />
          <DropdownList
            label="Shade body"
            fullWidth
            placeholder={shadeSystem ? "Select" : "System first"}
            options={shadeOptions}
            value={shadeBody}
            disabled={!shadeSystem}
            onChange={(v) => handleFieldChange("shadeBody", v)}
          />
        </div>
      )}
    </div>
  );
}
