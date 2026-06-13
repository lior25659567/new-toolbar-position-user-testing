import * as React from "react";
import { Icon } from "./Icon";

/**
 * Notification — back-compat shim using ADS .toast styles.
 */
export type NotificationType = "info" | "success" | "warning" | "error";

export interface NotificationProps {
  type?: NotificationType;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const glyph: Record<NotificationType, string> = {
  success: "✓",
  error: "!",
  warning: "!",
  info: "i",
};

export function Notification({
  type = "info",
  title,
  children,
  onDismiss,
  style,
  className,
}: NotificationProps) {
  return (
    <div
      role="alert"
      className={["toast", `toast-${type}`, className].filter(Boolean).join(" ")}
      style={style}
    >
      <span className="toast-icon" aria-hidden>{glyph[type]}</span>
      <div className="toast-body" style={{ flex: 1 }}>
        {title && <span className="toast-title">{title} </span>}
        <span className="toast-text">{children}</span>
      </div>
      {onDismiss && (
        <button className="toast-close" type="button" onClick={onDismiss} aria-label="Dismiss">
          <Icon name="close" size={14} color="var(--ads-icon-muted)" />
        </button>
      )}
    </div>
  );
}
