import React, { useState } from "react";
import type { ToothSpec, ToothProcedure } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { DropdownList, IconButton } from "../../../design-system";
import { TOOTH_PROCEDURES, TOOTH_PROCEDURE_COLORS, MATERIALS, SHADE_SYSTEMS, SHADE_OPTIONS } from "../../constants";

const tagColors: Record<string, { bg: string; border: string; text: string }> = {
  red: { bg: "#FFF0F3", border: "#FFE0E7", text: "#A30F34" },
  orange: { bg: "#FFF2E3", border: "#FFE5D6", text: "#8A4300" },
  magenta: { bg: "#FFF0F9", border: "#FFE3F4", text: "#A30463" },
  purple: { bg: "#F8F2FF", border: "#F2E6FF", text: "#6C37A1" },
  blue: { bg: "#E6F7FF", border: "#D1F1FF", text: "#005780" },
  green: { bg: "#ECFDF5", border: "#D1FAE5", text: "#065F46" },
};

interface ToothSpecCardProps {
  specs: ToothSpec[];
  expanded: boolean;
  onToggle: () => void;
  dispatch: React.Dispatch<InfoAction>;
}

export function ToothSpecCard({ specs, expanded, onToggle, dispatch }: ToothSpecCardProps) {
  const [hoveredProc, setHoveredProc] = useState<string | null>(null);

  const firstSpec = specs[0];
  const colorKey = TOOTH_PROCEDURE_COLORS[firstSpec.procedure];
  const palette = colorKey ? tagColors[colorKey] : tagColors.blue;
  const procLabel = TOOTH_PROCEDURES.find((p) => p.value === firstSpec.procedure)?.label || firstSpec.procedure;
  const toothNumbers = specs.map((s) => s.toothNumber).sort((a, b) => a - b);

  const shadeOptions = firstSpec.shadeSystem
    ? (SHADE_OPTIONS[firstSpec.shadeSystem] || []).map((s) => ({ value: s, label: s }))
    : [];

  const handleProcedureSelect = (proc: ToothProcedure) => {
    for (const s of specs) {
      dispatch({ type: "SET_TOOTH_SPEC", toothNumber: s.toothNumber, spec: { procedure: proc } });
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    for (const s of specs) {
      if (field === "shadeSystem") {
        dispatch({ type: "SET_TOOTH_SPEC", toothNumber: s.toothNumber, spec: { shadeSystem: value, shadeBody: "" } });
      } else {
        dispatch({ type: "SET_TOOTH_SPEC", toothNumber: s.toothNumber, spec: { [field]: value } });
      }
    }
  };

  const handleRemoveAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    for (const s of specs) {
      dispatch({ type: "REMOVE_TOOTH", toothNumber: s.toothNumber });
    }
  };

  const title = toothNumbers.length === 1
    ? `Tooth ${toothNumbers[0]}`
    : `Teeth ${toothNumbers.join(", ")}`;

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #E5E7EB",
        boxShadow: expanded ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
        overflow: "visible",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
    >
      {/* Header */}
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 12px",
          cursor: "pointer",
          backgroundColor: "white",
          borderRadius: expanded ? "8px 8px 0 0" : "8px",
          transition: "background-color 0.15s",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e2939", fontFamily: "Inter, sans-serif" }}>
          {title}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 10px",
            borderRadius: "12px",
            backgroundColor: palette.bg,
            border: `1px solid ${palette.border}`,
            color: palette.text,
            fontSize: "11px",
            fontWeight: 500,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {procLabel}
        </span>
        {firstSpec.material && (
          <span style={{ fontSize: "11px", color: "#6a7282", fontFamily: "Inter, sans-serif" }}>
            {MATERIALS.find((m) => m.value === firstSpec.material)?.label}
          </span>
        )}
        {firstSpec.shadeBody && (
          <span style={{ fontSize: "11px", color: "#6a7282", fontFamily: "Inter, sans-serif" }}>
            {firstSpec.shadeBody}
          </span>
        )}
        <div style={{ flex: 1 }} />
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"
          style={{ transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
        >
          <path d="M3 5l4 4 4-4" />
        </svg>
        <IconButton
          aria-label="Remove"
          onClick={handleRemoveAll}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round">
            <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" />
          </svg>
        </IconButton>
      </div>

      {/* Body */}
      {expanded && (
        <div style={{ padding: "12px", borderTop: "1px solid #E5E7EB" }}>
          <div style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "11px", fontWeight: 400, color: "#6a7282", fontFamily: "Inter, sans-serif", marginBottom: "6px" }}>
              Procedure
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {TOOTH_PROCEDURES.map((proc) => {
                const pColorKey = TOOTH_PROCEDURE_COLORS[proc.value as ToothProcedure];
                const pPalette = tagColors[pColorKey] || tagColors.blue;
                const isSelected = firstSpec.procedure === proc.value;
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
                      padding: "2px 10px",
                      borderRadius: "12px",
                      border: `1px solid ${isSelected ? pPalette.text : pPalette.border}`,
                      backgroundColor: pPalette.bg,
                      color: pPalette.text,
                      fontSize: "11px",
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      outline: "none",
                    }}
                  >
                    {proc.label}
                  </button>
                );
              })}
            </div>
          </div>

          {firstSpec.procedure && firstSpec.procedure !== "missing" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              <DropdownList
                label="Material"
                fullWidth
                placeholder="Select"
                options={MATERIALS}
                value={firstSpec.material || ""}
                onChange={(v) => handleFieldChange("material", v)}
              />
              <DropdownList
                label="Shade system"
                fullWidth
                placeholder="Select"
                options={SHADE_SYSTEMS}
                value={firstSpec.shadeSystem || ""}
                onChange={(v) => handleFieldChange("shadeSystem", v)}
              />
              <DropdownList
                label="Shade body"
                fullWidth
                placeholder={firstSpec.shadeSystem ? "Select" : "System first"}
                options={shadeOptions}
                value={firstSpec.shadeBody || ""}
                disabled={!firstSpec.shadeSystem}
                onChange={(v) => handleFieldChange("shadeBody", v)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
