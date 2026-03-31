import React, { useRef, useState } from "react";
import type { InfoAction } from "../../../state/infoReducer";

interface AttachmentsUploadProps {
  attachments: File[];
  dispatch: React.Dispatch<InfoAction>;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentsUpload({ attachments, dispatch }: AttachmentsUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      dispatch({ type: "ADD_ATTACHMENTS", files: Array.from(e.target.files) });
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) {
      dispatch({ type: "ADD_ATTACHMENTS", files: Array.from(e.dataTransfer.files) });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: "16px", fontWeight: 600, color: "#1e2939", fontFamily: "Inter, sans-serif", marginBottom: "16px" }}>
        Attachments
      </div>

      <input ref={inputRef} type="file" multiple hidden onChange={handleFiles} />

      {attachments.length === 0 ? (
        /* Empty state */
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "12px", padding: "40px 20px", cursor: "pointer",
            borderRadius: "8px",
            backgroundColor: dragOver ? "#E0F2FE" : "transparent",
            transition: "background-color 0.15s",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="8" y1="8" x2="16" y2="8" />
            <line x1="8" y1="16" x2="12" y2="16" />
            <line x1="9" y1="3" x2="5" y2="8" />
            <line x1="15" y1="3" x2="19" y2="8" />
          </svg>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#1e2939", fontFamily: "Inter, sans-serif" }}>
            No Attachments
          </div>
          <div style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", textAlign: "center", lineHeight: "1.5" }}>
            You can share external-related files, including images, videos and X-rays, with your lab.
            <br />
            To upload files use MyiTero.com
          </div>
        </div>
      ) : (
        /* Files list */
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {attachments.map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 14px", backgroundColor: "#F9FAFB",
                borderRadius: "8px", border: "1px solid #E5E7EB",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V5L9 1z" />
                <path d="M9 1v4h4" />
              </svg>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "#1e2939", fontFamily: "Inter, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {f.name}
                </div>
                <div style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                  {formatSize(f.size)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => dispatch({ type: "REMOVE_ATTACHMENT", index: i })}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: "2px", display: "flex" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={() => inputRef.current?.click()}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
              padding: "10px", fontSize: "13px", color: "#009ACE", fontWeight: 500,
              fontFamily: "Inter, sans-serif", background: "none", border: "1px dashed #D1D5DB",
              borderRadius: "8px", cursor: "pointer",
            }}
          >
            + Add more files
          </button>
        </div>
      )}
    </div>
  );
}
