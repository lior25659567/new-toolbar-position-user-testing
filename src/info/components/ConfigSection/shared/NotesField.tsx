import React from "react";
import type { InfoAction } from "../../../state/infoReducer";

interface NotesFieldProps {
  notes: string;
  dispatch: React.Dispatch<InfoAction>;
}

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 500,
  color: "#6a7282",
  fontFamily: "Inter, sans-serif",
  marginBottom: "8px",
};

export function NotesField({ notes, dispatch }: NotesFieldProps) {
  const maxLength = 500;
  const charCount = notes.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={labelStyle}>Notes</div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRadius: "8px",
          border: "1px solid #E5E7EB",
          backgroundColor: "white",
          padding: "12px",
          minHeight: "120px",
        }}
      >
        <textarea
          value={notes}
          onChange={(e) => dispatch({ type: "SET_NOTES", value: e.target.value })}
          placeholder="Add any additional notes for the lab..."
          maxLength={maxLength}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            resize: "none",
            fontSize: "13px",
            fontFamily: "Inter, sans-serif",
            color: "#1e2939",
            lineHeight: "1.5",
          }}
        />
        <div
          style={{
            textAlign: "right",
            fontSize: "11px",
            color: charCount > maxLength * 0.9 ? "#DC2626" : "#9CA3AF",
            fontFamily: "Inter, sans-serif",
            marginTop: "8px",
          }}
        >
          {charCount}/{maxLength}
        </div>
      </div>
    </div>
  );
}
