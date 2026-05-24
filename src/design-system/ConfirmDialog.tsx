import * as React from "react";
import { Modal } from "./Modal";
import { Button } from "./Kit";
import { SecondaryButton } from "./SecondaryButton";
import { PrimaryButton } from "./PrimaryButton";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Render the confirm action with destructive (red) styling. */
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Confirmation dialog built on the DS Modal (inherits focus trap, Escape,
 * scrim, role="dialog"). Use before destructive or irreversible actions.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <SecondaryButton size={36} onClick={onClose}>
            {cancelLabel}
          </SecondaryButton>
          {danger ? (
            <Button variant="danger" size="sm" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          ) : (
            <PrimaryButton size={36} onClick={onConfirm}>
              {confirmLabel}
            </PrimaryButton>
          )}
        </>
      }
    >
      {message}
    </Modal>
  );
}
