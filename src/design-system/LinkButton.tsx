import * as React from "react";
import { color, font, radius, shadow, transition, space } from "./tokens";

/**
 * LinkButton – design system component.
 * Figma: Button Variation=03 Link, node 5:6473.
 *
 * Text-only button styled as a link (no background/border in default state).
 * States: enabled, hover (subtle bg), pressed, focused, disabled.
 */
export interface LinkButtonProps extends React.ComponentProps<"button"> {
  children?: React.ReactNode;
  size?: 60 | 44 | 36;
  fullWidth?: boolean;
}

const baseStyle: React.CSSProperties = {
  fontFamily: font.family,
  fontWeight: font.weight.regular,
  border: "none",
  cursor: "pointer",
  outline: "none",
  transition: transition.button,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: space[2],
  color: color.primary,
  backgroundColor: "transparent",
  borderRadius: radius.sm,
  textDecoration: "none",
};

const sizeStyles: Record<60 | 44 | 36, React.CSSProperties> = {
  60: { minHeight: "60px", padding: `0 ${space[6]}`, fontSize: font.size.lg },
  44: { minHeight: "44px", padding: `0 ${space[4]}`, fontSize: font.size.base },
  36: { minHeight: "36px", padding: `0 ${space[3]}`, fontSize: font.size.sm },
};

export function LinkButton({
  children = "Link button",
  size = 44,
  fullWidth,
  style,
  disabled,
  ...props
}: LinkButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const combinedStyle: React.CSSProperties = {
    ...baseStyle,
    ...sizeStyles[size],
    ...(fullWidth ? { width: "100%" } : {}),
    ...(disabled
      ? { opacity: 0.5, cursor: "not-allowed" }
      : {
          ...(isHovered && { backgroundColor: "rgba(0,0,0,0.05)" }),
          ...(isActive && { backgroundColor: "rgba(0,0,0,0.09)" }),
          ...(isFocused && { borderWidth: 1, borderStyle: "solid", borderColor: color.primary }),
        }),
    ...style,
  };

  return (
    <button
      type="button"
      disabled={disabled}
      style={combinedStyle}
      data-design-system="link-button"
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

/**
 * GhostButton – design system component.
 * Figma: Button Variation=04 Ghost.
 *
 * Transparent background with no border. Similar to Link but neutral color.
 */
export interface GhostButtonProps extends React.ComponentProps<"button"> {
  children?: React.ReactNode;
  size?: 60 | 44 | 36;
  fullWidth?: boolean;
}

export function GhostButton({
  children = "Ghost button",
  size = 44,
  fullWidth,
  style,
  disabled,
  ...props
}: GhostButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const combinedStyle: React.CSSProperties = {
    ...baseStyle,
    ...sizeStyles[size],
    color: color.textDefault,
    ...(fullWidth ? { width: "100%" } : {}),
    ...(disabled
      ? { opacity: 0.5, cursor: "not-allowed" }
      : {
          ...(isHovered && { backgroundColor: "rgba(0,0,0,0.05)" }),
          ...(isActive && { backgroundColor: "rgba(0,0,0,0.09)", transform: "scale(0.98)" }),
          ...(isFocused && { outline: `2px solid ${color.primary}`, outlineOffset: "2px" }),
        }),
    ...style,
  };

  return (
    <button
      type="button"
      disabled={disabled}
      style={combinedStyle}
      data-design-system="ghost-button"
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
