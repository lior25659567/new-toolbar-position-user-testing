import React, { useRef, useState } from "react";
import type { InfoAction } from "../../../state/infoReducer";

interface AttachmentsUploadProps {
  attachments: File[];
  dispatch: React.Dispatch<InfoAction>;
}

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 500,
  color: "#6a7282",
  fontFamily: "Inter, sans-serif",
  marginBottom: "8px",
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V5L9 1z" />
      <path d="M9 1v4h4" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 14V6" />
      <path d="M7 9l3-3 3 3" />
      <path d="M17 14v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2" />
    </svg>
  );
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
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={labelStyle}>Attachments</div>
      <input ref={inputRef} type="file" multiple hidden onChange={handleFiles} />
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          flex: 1,
          borderRadius: "8px",
          border: `1.5px dashed ${dragOver ? "#009ACE" : "#D1D5DB"}`,
          backgroundColor: dragOver ? "#E0F2FE" : "white",
          padding: "12px",
          minHeight: "120px",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "border-color 0.15s, background-color 0.15s",
        }}
      >
        {attachments.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <UploadIcon />
            <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
              Drop files here or click to browse
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {attachments.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 10px",
                  backgroundColor: "white",
                  borderRadius: "6px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <FileIcon />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#1e2939",
                      fontFamily: "Inter, sans-serif",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {f.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                    {formatSize(f.size)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: "REMOVE_ATTACHMENT", index: i });
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9CA3AF",
                    padding: "2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px",
                    flexShrink: 0,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" />
                  </svg>
                </button>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                padding: "6px",
                fontSize: "12px",
                color: "#009ACE",
                fontWeight: 500,
                fontFamily: "Inter, sans-serif",
              }}
            >
              + Add more files
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
