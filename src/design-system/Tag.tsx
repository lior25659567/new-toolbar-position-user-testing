import * as React from "react";
import { color, font, space } from "./tokens";

/**
 * Tag (Badge) – design system component.
 * Figma: Tags node 5:1033.
 *
 * Pill-shaped colored tags with optional icon and dismiss button.
 * Colors: red | orange | magenta | purple | blue | green
 * Sizes: small (24px) | medium (32px)
 */

export type TagColor = "red" | "orange" | "magenta" | "purple" | "blue" | "green";
export type TagSize = "small" | "medium";

export interface TagProps {
  children: React.ReactNode;
  color?: TagColor;
  size?: TagSize;
  /** Icon rendered before label */
  icon?: React.ReactNode;
  /** Show dismiss (×) button */
  onDismiss?: () => void;
  style?: React.CSSProperties;
}

const palette: Record<TagColor, { bg: string; border: string; text: string }> = {
  red:     { bg: "#FFF0F3", border: "#FFE0E7", text: "#A30F34" },
  orange:  { bg: "#FFF2E3", border: "#FFE5D6", text: "#8A4300" },
  magenta: { bg: "#FFF0F9", border: "#FFE3F4", text: "#A30463" },
  purple:  { bg: "#F8F2FF", border: "#F2E6FF", text: "#6C37A1" },
  blue:    { bg: "#E6F7FF", border: "#D1F1FF", text: "#005780" },
  green:   { bg: color.tagGreen.bg, border: color.tagGreen.border, text: color.tagGreen.text },
};

const sizes: Record<TagSize, { height: number; fontSize: string; iconSize: number; padding: string }> = {
  small:  { height: 24, fontSize: font.size.xs,   iconSize: 14, padding: `${space[1]} ${space[2]}` },
  medium: { height: 32, fontSize: font.size.base,  iconSize: 16, padding: `${space[1]} ${space[3]}` },
};

/** Compact ×  icon for dismissing a tag */
function CloseIcon({ size, color: c }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      fill="none"
      stroke={c}
      strokeWidth="1.5"
      strokeLinecap="round"
      style={{ display: "block", flexShrink: 0 }}
      aria-hidden
    >
      <line x1="1.5" y1="1.5" x2="6.5" y2="6.5" />
      <line x1="6.5" y1="1.5" x2="1.5" y2="6.5" />
    </svg>
  );
}

export function Tag({
  children,
  color: tagColor = "blue",
  size = "small",
  icon,
  onDismiss,
  style,
}: TagProps) {
  const p = palette[tagColor];
  const s = sizes[size];

  const tagStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: space[1],
    height: s.height,
    padding: s.padding,
    borderRadius: 9999,
    backgroundColor: p.bg,
    border: `1px solid ${p.border}`,
    color: p.text,
    fontFamily: font.family,
    fontSize: s.fontSize,
    fontWeight: font.weight.regular,
    lineHeight: "1",
    whiteSpace: "nowrap" as const,
    boxSizing: "border-box" as const,
    ...style,
  };

  return (
    <span style={tagStyle}>
      {icon && (
        <span style={{ display: "inline-flex", alignItems: "center", color: p.text }} aria-hidden>
          {icon}
        </span>
      )}
      {children}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Remove tag"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: p.text,
            marginLeft: 2,
          }}
        >
          <CloseIcon size={8} color={p.text} />
        </button>
      )}
    </span>
  );
}
