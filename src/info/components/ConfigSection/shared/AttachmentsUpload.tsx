import React, { useRef, useState } from "react";
import { Paperclip, File, X } from "lucide-react";
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
      <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--ads-text-primary)", fontFamily: "var(--ads-font-sans)", marginBottom: "16px" }}>
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
            gap: "12px", padding: "24px 20px", cursor: "pointer",
            // Match the Notes empty-state box so both start/end at the same place.
            minHeight: "100px", maxHeight: "180px", overflowY: "auto",
            borderRadius: "var(--ads-radius-sm)",
            backgroundColor: dragOver ? "var(--ads-background-highlight-blue)" : "transparent",
            transition: "background-color 0.15s",
          }}
        >
          <Paperclip size={28} strokeWidth={1.5} color="var(--ads-text-muted)" aria-hidden />
          <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--ads-text-primary)", fontFamily: "var(--ads-font-sans)" }}>
            No Attachments
          </div>
          <div style={{ fontSize: "13px", color: "var(--ads-text-muted)", fontFamily: "var(--ads-font-sans)", textAlign: "center", lineHeight: "1.5" }}>
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
                padding: "10px 14px", backgroundColor: "var(--ads-bg-muted)",
                borderRadius: "var(--ads-radius-sm)", border: "1px solid var(--ads-border-subtle)",
              }}
            >
              <File size={16} strokeWidth={1.2} color="var(--ads-text-muted)" aria-hidden />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--ads-text-primary)", fontFamily: "var(--ads-font-sans)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {f.name}
                </div>
                <div style={{ fontSize: "11px", color: "var(--ads-text-muted)", fontFamily: "var(--ads-font-sans)" }}>
                  {formatSize(f.size)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => dispatch({ type: "REMOVE_ATTACHMENT", index: i })}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ads-text-muted)", padding: "2px", display: "flex" }}
              >
                <X size={14} strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          ))}
          <button
            onClick={() => inputRef.current?.click()}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
              padding: "10px", fontSize: "13px", color: "var(--ads-background-interactive)", fontWeight: 500,
              fontFamily: "var(--ads-font-sans)", background: "none", border: "1px dashed #D1D5DB",
              borderRadius: "var(--ads-radius-sm)", cursor: "pointer",
            }}
          >
            + Add more files
          </button>
        </div>
      )}
    </div>
  );
}
