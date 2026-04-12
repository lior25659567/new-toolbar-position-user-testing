import React, { useState } from "react";
import type { ToothSpec, ToothProcedure } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { DropdownList, IconButton } from "../../../design-system";
import { TOOTH_PROCEDURES, TOOTH_PROCEDURE_COLORS, MATERIALS, SHADE_SYSTEMS, SHADE_OPTIONS } from "../../constants";

interface ToothSpecCardProps {
  specs: ToothSpec[];
  expanded: boolean;
  onToggle: () => void;
  dispatch: React.Dispatch<InfoAction>;
}

export function ToothSpecCard({ specs, expanded, onToggle, dispatch }: ToothSpecCardProps) {
  const [hoveredProc, setHoveredProc] = useState<string | null>(null);

  const firstSpec = specs[0];
  const procColor = TOOTH_PROCEDURE_COLORS[firstSpec.procedure] || "#9CA3AF";
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
            gap: "5px",
            padding: "2px 8px",
            borderRadius: "9999px",
            border: `1px solid ${procColor}40`,
            backgroundColor: `${procColor}14`,
            fontSize: "11px",
            fontWeight: 500,
            fontFamily: "Inter, sans-serif",
            color: "#1e2939",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: procColor,
              flexShrink: 0,
            }}
          />
          {procLabel}
        </span>
        {firstSpec.material && (
          <span style={{ fontSize: "11px", color: "#6a7282", fontFamily: "Inter, sans-serif" }}>
            {MATERIALS.find((m) => m.value === firstSpec.material)?.label}
          </span>
        )}
        {firstSpec.shadeSystem && (
          <span style={{ fontSize: "11px", color: "#6a7282", fontFamily: "Inter, sans-serif" }}>
            {SHADE_SYSTEMS.find((s) => s.value === firstSpec.shadeSystem)?.label || firstSpec.shadeSystem}
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
                const pColor = TOOTH_PROCEDURE_COLORS[proc.value as ToothProcedure];
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
                      gap: "5px",
                      height: "32px",
                      padding: "0 10px",
                      borderRadius: "8px",
                      border: `${isSelected ? "2px" : "1px"} solid ${isSelected ? pColor : isHovered ? "#9CA3AF" : "#E5E7EB"}`,
                      backgroundColor: "#ffffff",
                      color: "#1e2939",
                      fontSize: "11px",
                      fontWeight: isSelected ? 600 : 400,
                      fontFamily: "Inter, sans-serif",
                      cursor: "pointer",
                      transition: "border-color 0.15s ease",
                      outline: "none",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: pColor,
                        flexShrink: 0,
                      }}
                    />
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
