import * as React from "react";
import { color, font, radius, shadow, transition, space } from "./tokens";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number | string;
}

export function Modal({ open, onClose, title, children, footer, width = 480 }: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      />
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        style={{
          position: "relative",
          width,
          maxWidth: "calc(100vw - 48px)",
          maxHeight: "calc(100vh - 48px)",
          display: "flex",
          flexDirection: "column",
          backgroundColor: color.bgSurface,
          borderRadius: radius.lg,
          boxShadow: shadow.lg,
          fontFamily: font.family,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        {title && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `${space[3]} ${space[5]}`,
              borderBottom: `1px solid ${color.borderDefault}`,
              flexShrink: 0,
            }}
          >
            <h2
              id="modal-title"
              style={{
                margin: 0,
                fontSize: font.size.md,
                fontWeight: font.weight.semibold,
                color: color.textHeading,
                letterSpacing: font.tracking.tight,
              }}
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                border: "none",
                background: "none",
                borderRadius: radius.sm,
                cursor: "pointer",
                color: color.textSubtle,
                transition: transition.fast,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color.bgHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
              </svg>
            </button>
          </div>
        )}
        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: `${space[6]}`,
            fontSize: font.size.base,
            color: color.textDefault,
            lineHeight: font.lineHeight.normal,
          }}
        >
          {children}
        </div>
        {/* Footer */}
        {footer && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: space[3],
              padding: `${space[4]} ${space[6]}`,
              borderTop: `1px solid ${color.borderDefault}`,
              flexShrink: 0,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ModalFooter({ onClose, confirmLabel = "Confirm", onConfirm }: {
  onClose: () => void;
  confirmLabel?: string;
  onConfirm?: () => void;
}) {
  return (
    <>
      <SecondaryButton size={36} onClick={onClose}>Cancel</SecondaryButton>
      <PrimaryButton size={36} onClick={onConfirm ?? onClose}>{confirmLabel}</PrimaryButton>
    </>
  );
}
