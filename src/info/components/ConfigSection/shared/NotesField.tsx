import React, { useState } from "react";
import type { InfoAction } from "../../../state/infoReducer";

interface NotesFieldProps {
  notes: string;
  dispatch: React.Dispatch<InfoAction>;
}

export function NotesField({ notes, dispatch }: NotesFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasNotes = notes.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: "16px", fontWeight: 600, color: "#1e2939", fontFamily: "Inter, sans-serif", marginBottom: "16px" }}>
        Note
      </div>

      {!hasNotes && !isFocused ? (
        /* Empty state */
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: "12px", padding: "40px 20px",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#1e2939", fontFamily: "Inter, sans-serif" }}>
            No notes yet
          </div>
          <div style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
            Type below to add your first note
          </div>
        </div>
      ) : (
        /* Notes list area */
        <div style={{
          flex: 1, minHeight: "100px", marginBottom: "16px",
        }}>
          <textarea
            value={notes}
            onChange={(e) => dispatch({ type: "SET_NOTES", value: e.target.value })}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type your note..."
            maxLength={500}
            style={{
              width: "100%", minHeight: "100px", border: "none", outline: "none",
              backgroundColor: "transparent", resize: "none",
              fontSize: "13px", fontFamily: "Inter, sans-serif", color: "#1e2939", lineHeight: "1.5",
            }}
          />
        </div>
      )}

      {/* Input bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        borderRadius: "8px", border: "1px solid #E5E7EB", padding: "10px 14px",
      }}>
        <input
          type="text"
          placeholder="Progress notes here"
          onFocus={() => setIsFocused(true)}
          onChange={(e) => {
            if (!hasNotes) {
              dispatch({ type: "SET_NOTES", value: e.target.value });
            }
          }}
          value={hasNotes ? "" : ""}
          style={{
            flex: 1, border: "none", outline: "none", backgroundColor: "transparent",
            fontSize: "13px", fontFamily: "Inter, sans-serif", color: "#1e2939",
          }}
        />
        <button
          style={{
            background: "none", border: "none", cursor: "pointer", padding: "4px",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
