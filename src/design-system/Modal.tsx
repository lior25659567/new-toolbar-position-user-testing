import * as React from "react";
import { Icon } from "./Icon";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";

/**
 * Modal — back-compat shim using ADS .modal-* styles.
 * Figma 13483:13690 ships three width variants: Small=432, Medium=656, Large=880.
 * Pass `size="sm" | "md" | "lg"` for the canonical sizes, or `width` for a custom value.
 */
export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number | string;
  /** Canonical Figma sizes. Overridden by `width` if both are passed. */
  size?: ModalSize;
}

const SIZE_TO_WIDTH: Record<ModalSize, number> = { sm: 432, md: 656, lg: 880 };

export function Modal({ open, onClose, title, children, footer, width, size = "sm" }: ModalProps) {
  const resolvedWidth = width ?? SIZE_TO_WIDTH[size];
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-root">
      <div className="modal-scrim" onClick={onClose} />
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "ads-modal-title" : undefined}
        style={{ width: resolvedWidth, maxWidth: "calc(100vw - 48px)", maxHeight: "calc(100vh - 48px)", display: "flex", flexDirection: "column" }}
      >
        {title && (
          <div className="modal-head">
            <h2 id="ads-modal-title">{title}</h2>
            <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
              <Icon name="close" size={16} color="var(--ads-icon-muted)" />
            </button>
          </div>
        )}
        <div className="modal-body" style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export function ModalFooter({
  onClose,
  confirmLabel = "Confirm",
  onConfirm,
}: {
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
