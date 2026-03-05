import * as React from "react";
import { color, font, radius, space } from "./tokens";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface NotificationProps {
  type?: NotificationType;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  style?: React.CSSProperties;
}

const palette: Record<NotificationType, { bg: string; border: string; icon: string; title: string }> = {
  info:    { bg: "#E6F7FF", border: "#BAE7FF", icon: color.primary,  title: "#005780" },
  success: { bg: color.successLight, border: color.successBorder, icon: color.success, title: color.successText },
  warning: { bg: "#FFF7E6", border: "#FFE7BA", icon: "#D48806", title: "#874D00" },
  error:   { bg: "#FFF0F3", border: "#FFE0E7", icon: color.danger, title: "#A30F34" },
};

const icons: Record<NotificationType, React.ReactNode> = {
  info: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
      <line x1="9" y1="8" x2="9" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="5.5" r="0.75" fill="currentColor" />
    </svg>
  ),
  success: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 9l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2L1.5 16h15L9 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="9" y1="7" x2="9" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="13.5" r="0.75" fill="currentColor" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6.5" y1="6.5" x2="11.5" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11.5" y1="6.5" x2="6.5" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

export function Notification({ type = "info", title, children, onDismiss, style }: NotificationProps) {
  const p = palette[type];

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        gap: space[3],
        padding: `${space[4]} ${space[5]}`,
        backgroundColor: p.bg,
        border: `1px solid ${p.border}`,
        borderRadius: radius.md,
        fontFamily: font.family,
        fontSize: font.size.sm,
        color: color.textDefault,
        lineHeight: font.lineHeight.normal,
        ...style,
      }}
    >
      <span style={{ color: p.icon, flexShrink: 0, marginTop: 1 }}>{icons[type]}</span>
      <div style={{ flex: 1 }}>
        {title && (
          <div style={{ fontWeight: font.weight.semibold, color: p.title, marginBottom: space[1], fontSize: font.size.base }}>
            {title}
          </div>
        )}
        <div>{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            border: "none",
            background: "none",
            cursor: "pointer",
            color: p.icon,
            padding: 0,
            flexShrink: 0,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" />
          </svg>
        </button>
      )}
    </div>
  );
}
