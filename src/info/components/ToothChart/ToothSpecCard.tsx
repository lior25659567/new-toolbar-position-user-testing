import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import type { ToothSpec, ToothProcedure } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { DropdownList, IconButton, Toggle } from "../../../design-system";
import {
  TOOTH_PROCEDURES,
  TOOTH_PROCEDURE_COLORS,
  MATERIALS,
  SHADE_SYSTEMS,
  SHADE_OPTIONS,
  SPECIFICATIONS,
  PREP_DESIGNS,
  MARGIN_DESIGNS,
  INCISAL_OPTIONS,
  GINGIVAL_OPTIONS,
  STUMP_SHADES,
} from "../../constants";

interface ToothSpecCardProps {
  specs: ToothSpec[];
  expanded: boolean;
  onToggle: () => void;
  dispatch: React.Dispatch<InfoAction>;
}

export function ToothSpecCard({ specs, expanded, onToggle, dispatch }: ToothSpecCardProps) {
  const [hoveredProc, setHoveredProc] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  const firstSpec = specs[0];
  const procColor = TOOTH_PROCEDURE_COLORS[firstSpec.procedure] || "var(--ads-text-muted)";
  const procLabel = TOOTH_PROCEDURES.find((p) => p.value === firstSpec.procedure)?.label || firstSpec.procedure;
  const toothNumbers = specs.map((s) => s.toothNumber).sort((a, b) => a - b);

  const shadeOptions = firstSpec.shadeSystem
    ? (SHADE_OPTIONS[firstSpec.shadeSystem] || []).map((s) => ({ value: s, label: s }))
    : [];

  // Validation: once a real procedure is assigned, material + shade are
  // required to complete the spec. We surface this non-blockingly — the user
  // can keep assigning other teeth — but the card flags what's still missing
  // so an unfinished procedure isn't silently submitted.
  const isAssigned = !!firstSpec.procedure && firstSpec.procedure !== "missing";
  const needsMaterial = isAssigned && !firstSpec.material;
  const needsShadeSystem = isAssigned && !firstSpec.shadeSystem;
  const needsShadeBody = isAssigned && !!firstSpec.shadeSystem && !firstSpec.shadeBody;
  const missingFields = [
    needsMaterial && "material",
    needsShadeSystem && "shade system",
    needsShadeBody && "shade",
  ].filter(Boolean) as string[];
  const isIncomplete = missingFields.length > 0;
  const missingSummary = isIncomplete
    ? `Add ${missingFields.join(" and ")} to complete this procedure.`
    : "";

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
      data-demo={`spec-card-${firstSpec.procedure}`}
      style={{
        backgroundColor: "white",
        borderRadius: "var(--ads-radius-md)",
        border: "1px solid var(--ads-border-subtle)",
        boxShadow: expanded ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
        overflow: "visible",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
    >
      {/* Header */}
      <div
        data-demo="spec-card-toggle"
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
        <span style={{ fontSize: "var(--tp-body-01-size)", lineHeight: "var(--tp-body-01-lh)", fontWeight: 500, color: "var(--ads-text-primary)", fontFamily: "var(--ads-font-sans)" }}>
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
            fontSize: "var(--tp-label-01-size)",
            lineHeight: "var(--tp-label-01-lh)",
            fontWeight: 500,
            fontFamily: "var(--ads-font-sans)",
            color: "var(--ads-text-primary)",
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
        {!expanded && isIncomplete && (
          <span
            title={missingSummary}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "var(--tp-label-01-size)",
              lineHeight: "var(--tp-label-01-lh)",
              fontWeight: 500,
              fontFamily: "var(--ads-font-sans)",
              color: "var(--ads-text-error)",
            }}
          >
            <AlertCircle size={14} strokeWidth={2} aria-hidden="true" />
            Incomplete
          </span>
        )}
        {firstSpec.material && (
          <span style={{ fontSize: "var(--tp-label-01-size)", lineHeight: "var(--tp-label-01-lh)", color: "var(--ads-text-muted)", fontFamily: "var(--ads-font-sans)" }}>
            {MATERIALS.find((m) => m.value === firstSpec.material)?.label}
          </span>
        )}
        {firstSpec.shadeSystem && (
          <span style={{ fontSize: "var(--tp-label-01-size)", lineHeight: "var(--tp-label-01-lh)", color: "var(--ads-text-muted)", fontFamily: "var(--ads-font-sans)" }}>
            {SHADE_SYSTEMS.find((s) => s.value === firstSpec.shadeSystem)?.label || firstSpec.shadeSystem}
          </span>
        )}
        {firstSpec.shadeBody && (
          <span style={{ fontSize: "var(--tp-label-01-size)", lineHeight: "var(--tp-label-01-lh)", color: "var(--ads-text-muted)", fontFamily: "var(--ads-font-sans)" }}>
            {firstSpec.shadeBody}
          </span>
        )}
        <div style={{ flex: 1 }} />
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--ads-text-muted)" strokeWidth="1.5" strokeLinecap="round"
          style={{ transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
        >
          <path d="M3 5l4 4 4-4" />
        </svg>
        <IconButton
          aria-label="Remove"
          onClick={handleRemoveAll}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--ads-text-muted)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" />
          </svg>
        </IconButton>
      </div>

      {/* Body */}
      {expanded && (
        <div style={{ padding: "12px", borderTop: "1px solid var(--ads-border-subtle)" }}>
          <div style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "var(--tp-label-01-size)", lineHeight: "var(--tp-label-01-lh)", fontWeight: 400, color: "var(--ads-text-muted)", fontFamily: "var(--ads-font-sans)", marginBottom: "6px" }}>
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
                      borderRadius: "var(--ads-radius-md)",
                      border: `1px solid ${isSelected ? "var(--ads-btn-secondary-border-pressed)" : isHovered ? "var(--ads-text-muted)" : "var(--ads-border-subtle)"}`,
                      backgroundColor: "var(--ads-background-subtle-01)",
                      color: "var(--ads-text-primary)",
                      fontSize: "var(--tp-label-01-size)",
                      lineHeight: "var(--tp-label-01-lh)",
                      fontWeight: 400,
                      fontFamily: "var(--ads-font-sans)",
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
            <>
              {/* Required spec fields */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px" }}>
                <DropdownList
                  label="Specification"
                  required
                  fullWidth
                  placeholder="Select"
                  options={SPECIFICATIONS}
                  value={firstSpec.specification || ""}
                  onChange={(v) => handleFieldChange("specification", v)}
                />
                <DropdownList
                  label="Material"
                  required
                  fullWidth
                  placeholder="Select"
                  options={MATERIALS}
                  value={firstSpec.material || ""}
                  onChange={(v) => handleFieldChange("material", v)}
                />
                <DropdownList
                  label="Shade system"
                  required
                  fullWidth
                  placeholder="Select"
                  options={SHADE_SYSTEMS}
                  value={firstSpec.shadeSystem || ""}
                  onChange={(v) => handleFieldChange("shadeSystem", v)}
                />
                <DropdownList
                  label="Body"
                  required
                  fullWidth
                  placeholder={firstSpec.shadeSystem ? "Select" : "System first"}
                  options={shadeOptions}
                  value={firstSpec.shadeBody || ""}
                  disabled={!firstSpec.shadeSystem}
                  onChange={(v) => handleFieldChange("shadeBody", v)}
                />
              </div>

              {/* Additional information disclosure */}
              <div data-demo="add-additional-info" style={{ marginTop: "24px" }}>
                <Toggle
                  checked={showMore}
                  onChange={() => setShowMore((s) => !s)}
                  label="Additional information"
                />
              </div>

              {showMore && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "12px" }}>
                  <DropdownList
                    label="Preparation Design - Buccal"
                    fullWidth
                    placeholder="Select an option"
                    options={PREP_DESIGNS}
                    value={firstSpec.prepBuccal || ""}
                    onChange={(v) => handleFieldChange("prepBuccal", v)}
                  />
                  <DropdownList
                    label="Preparation Design - Lingual"
                    fullWidth
                    placeholder="Select an option"
                    options={PREP_DESIGNS}
                    value={firstSpec.prepLingual || ""}
                    onChange={(v) => handleFieldChange("prepLingual", v)}
                  />
                  <DropdownList
                    label="Margin Design - Buccal"
                    fullWidth
                    placeholder="Select an option"
                    options={MARGIN_DESIGNS}
                    value={firstSpec.marginBuccal || ""}
                    onChange={(v) => handleFieldChange("marginBuccal", v)}
                  />
                  <DropdownList
                    label="Margin Design - Lingual"
                    fullWidth
                    placeholder="Select an option"
                    options={MARGIN_DESIGNS}
                    value={firstSpec.marginLingual || ""}
                    onChange={(v) => handleFieldChange("marginLingual", v)}
                  />
                  <DropdownList
                    label="Incisal"
                    fullWidth
                    placeholder="Select an option"
                    options={INCISAL_OPTIONS}
                    value={firstSpec.incisal || ""}
                    onChange={(v) => handleFieldChange("incisal", v)}
                  />
                  <DropdownList
                    label="Gingival"
                    fullWidth
                    placeholder="Select an option"
                    options={GINGIVAL_OPTIONS}
                    value={firstSpec.gingival || ""}
                    onChange={(v) => handleFieldChange("gingival", v)}
                  />
                  <DropdownList
                    label="Stump Shade"
                    fullWidth
                    placeholder="Select an option"
                    options={STUMP_SHADES}
                    value={firstSpec.stumpShade || ""}
                    onChange={(v) => handleFieldChange("stumpShade", v)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
