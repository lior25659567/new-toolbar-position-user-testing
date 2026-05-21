import React, { useState, useRef, useEffect } from "react";
import type { InfoAction } from "../../../state/infoReducer";
import { GhostButton } from "../../../../design-system";

interface NotesFieldProps {
  notes: string;
  dispatch: React.Dispatch<InfoAction>;
}

const SCROLLBAR_STYLE = `
  .notes-scroll::-webkit-scrollbar { width: 6px; }
  .notes-scroll::-webkit-scrollbar-track { background: transparent; }
  .notes-scroll::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
  .notes-scroll::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }
`;

function DeleteButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--ads-bg-muted)" : "none",
        border: "none", cursor: "pointer", padding: "4px",
        borderRadius: "4px",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: hovered ? "var(--ads-text-muted)" : "var(--ads-text-muted)",
        flexShrink: 0,
        transition: "all 0.15s ease",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}

export function NotesField({ notes, dispatch }: NotesFieldProps) {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const noteItems = notes ? notes.split("\n---\n") : [];

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const updated = noteItems.length > 0
      ? notes + "\n---\n" + trimmed
      : trimmed;
    dispatch({ type: "SET_NOTES", value: updated });
    setInputValue("");
  };

  // Auto-scroll to bottom when new note is added
  useEffect(() => {
    if (scrollRef.current && noteItems.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [noteItems.length]);

  const handleRemoveNote = (index: number) => {
    const updated = noteItems.filter((_, i) => i !== index);
    dispatch({ type: "SET_NOTES", value: updated.join("\n---\n") });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <style>{SCROLLBAR_STYLE}</style>
      <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--ads-text-primary)", fontFamily: "var(--ads-font-sans)", marginBottom: "16px" }}>
        Note
      </div>

      {/* Notes list / empty state */}
      <div
        ref={scrollRef}
        className="notes-scroll"
        style={{ minHeight: "100px", maxHeight: "180px", marginBottom: "16px", overflowY: "auto" }}
      >
        {noteItems.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "12px", padding: "24px 20px",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--ads-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--ads-text-primary)", fontFamily: "var(--ads-font-sans)" }}>
              No notes yet
            </div>
            <div style={{ fontSize: "13px", color: "var(--ads-text-muted)", fontFamily: "var(--ads-font-sans)" }}>
              Type below to add your first note
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {noteItems.map((note, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "8px",
                  padding: "10px 12px",
                  backgroundColor: "var(--ads-bg-muted)",
                  borderRadius: "var(--ads-radius-sm)",
                  animation: "info-fade-in 0.35s ease-out both",
                }}
              >
                <div style={{
                  flex: 1,
                  fontSize: "13px", fontFamily: "var(--ads-font-sans)",
                  color: "var(--ads-text-primary)", lineHeight: "1.5",
                  whiteSpace: "pre-wrap", wordBreak: "break-word",
                }}>
                  {note}
                </div>
                <DeleteButton onClick={() => handleRemoveNote(i)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input bar - always at the bottom */}
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        borderRadius: "var(--ads-radius-sm)", border: "1px solid var(--ads-border-subtle)", padding: "10px 14px",
        marginTop: "auto",
      }}>
        <input
          type="text"
          placeholder="Progress notes here"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          style={{
            flex: 1, border: "none", outline: "none", backgroundColor: "transparent",
            fontSize: "13px", fontFamily: "var(--ads-font-sans)", color: "var(--ads-text-primary)",
          }}
        />
        <GhostButton
          onClick={handleSend}
          aria-label="Send note"
          disabled={!inputValue.trim()}
          size={36}
          style={{ width: 36, height: 36, padding: 0, minWidth: 36, flexShrink: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </GhostButton>
      </div>
    </div>
  );
}
