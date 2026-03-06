import React from "react";
import type { ProcedureType, ScanOptions } from "../../../types";
import type { InfoAction } from "../../../state/infoReducer";
import { Checkbox } from "../../../../design-system";
import { PROCEDURE_SCAN_OPTIONS, SCAN_OPTION_LABELS } from "../../../constants";
import type { ScanOptionKey } from "../../../constants";

interface ScanOptionsCheckboxesProps {
  procedure: ProcedureType;
  scanOptions: ScanOptions;
  dispatch: React.Dispatch<InfoAction>;
}

export function ScanOptionsCheckboxes({ procedure, scanOptions, dispatch }: ScanOptionsCheckboxesProps) {
  const keys = PROCEDURE_SCAN_OPTIONS[procedure];
  if (keys.length === 0) return null;

  return (
    <div>
      <div
        style={{
          fontSize: "12px",
          fontWeight: 400,
          color: "#6a7282",
          fontFamily: "Inter, sans-serif",
          marginBottom: "8px",
        }}
      >
        Scan options
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {keys.map((key) => (
          <Checkbox
            key={key}
            checked={scanOptions[key]}
            onChange={() => dispatch({ type: "TOGGLE_SCAN_OPTION", key })}
            label={SCAN_OPTION_LABELS[key]}
          />
        ))}
      </div>
    </div>
  );
}
