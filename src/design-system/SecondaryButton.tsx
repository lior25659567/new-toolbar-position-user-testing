import * as React from "react";
import { color, font, radius, shadow, transition, space } from "./tokens";

/**
 * Secondary button – design system component.
 * Figma: node 5-6633. White bg, border, hover blue tint.
 * States: default, hover, active, focus, disabled.
 *
 * variant="toolbar" – matches toolbar icon buttons: transparent bg, hover #f5f5f5, active #E0F2FE, no border, 8px radius.
 */
export interface SecondaryButtonProps extends React.ComponentProps<"button"> {
  children?: React.ReactNode;
  /** Size: 60 | 44 | 36 (height in px). Default 44. */
  size?: 60 | 44 | 36;
  fullWidth?: boolean;
  /** Toolbar variant: transparent bg, hover/active like toolbar icon buttons. */
  variant?: "default" | "toolbar";
}

const baseStyle: React.CSSProperties = {
  fontFamily: font.family,
  fontWeight: font.weight.medium,
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: color.borderDefault,
  cursor: "pointer",
  outline: "none",
  transition: transition.border,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: space[2],
  color: "rgba(0, 0, 0, 0.93)",
  backgroundColor: color.bgSurface,
  borderRadius: radius.md,
};

const toolbarBaseStyle: React.CSSProperties = {
  fontFamily: font.family,
  fontWeight: font.weight.medium,
  borderWidth: 0,
  borderStyle: "none",
  cursor: "pointer",
  outline: "none",
  transition: "background-color 0.2s ease",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: space[2],
  color: "rgba(0, 0, 0, 0.93)",
  backgroundColor: "transparent",
  borderRadius: radius.md,
};

const sizeStyles: Record<60 | 44 | 36, React.CSSProperties> = {
  60: { minHeight: "60px", padding: `0 ${space[6]}`, fontSize: "16px", lineHeight: "22px", letterSpacing: "-0.2px" },
  44: { minHeight: "44px", padding: `0 ${space[4]}`, fontSize: font.size.base, lineHeight: "20px", letterSpacing: "-0.15px" },
  36: { minHeight: "34px", padding: `0 ${space[4]}`, fontSize: font.size.xs, lineHeight: "18px", letterSpacing: "-0.1px" },
};

export function SecondaryButton({
  children = "Secondary button",
  size = 44,
  fullWidth,
  style,
  disabled,
  variant = "default",
  ...props
}: SecondaryButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const isToolbar = variant === "toolbar";
  const base = isToolbar ? toolbarBaseStyle : baseStyle;

  const combinedStyle: React.CSSProperties = {
    ...base,
    ...sizeStyles[size],
    ...(fullWidth ? { width: "100%" } : {}),
    ...(disabled
      ? { opacity: 0.5, cursor: "not-allowed" }
      : isToolbar
        ? {
            backgroundColor: isActive ? "#E0F2FE" : isHovered ? "#f5f5f5" : undefined,
          }
        : {
            ...(isHovered && { borderColor: "#9CA3AF" }),
            ...(isActive && { transform: "scale(0.98)", borderColor: "#9CA3AF" }),
            ...(isFocused && { borderColor: "#9CA3AF" }),
          }),
    ...style,
  };

  return (
    <button
      type="button"
      disabled={disabled}
      style={combinedStyle}
      data-design-system="secondary-button"
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => !disabled && setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onFocus={(e) => { if (e.target === e.currentTarget) setIsFocused(true); }}
      onBlur={() => setIsFocused(false)}
      {...props}
    >
      {children}
    </button>
  );
}
