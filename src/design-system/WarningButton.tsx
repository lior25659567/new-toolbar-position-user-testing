import * as React from "react";
import { color, font, radius, shadow, transition, space } from "./tokens";

/**
 * Warning button – design system component.
 * Figma: Enabled 5-6738, Hovered 5-6740, Pressed 5-6742, Focused 5-6744.
 * For destructive / high-risk actions (e.g. Delete, Remove).
 */
export interface WarningButtonProps extends React.ComponentProps<"button"> {
  children?: React.ReactNode;
  /** Size: 60 | 44 | 36 (height in px). Default 44. */
  size?: 60 | 44 | 36;
  fullWidth?: boolean;
}

const baseStyle: React.CSSProperties = {
  fontFamily: font.family,
  fontWeight: font.weight.medium,
  border: "none",
  cursor: "pointer",
  outline: "none",
  transition: transition.button,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: space[2],
  color: color.textOnPrimary,
  borderRadius: radius.sm,
  backgroundColor: color.danger,
};

const sizeStyles: Record<60 | 44 | 36, React.CSSProperties> = {
  60: { minHeight: "60px", padding: `0 ${space[6]}`, fontSize: font.size.lg, lineHeight: "28px", letterSpacing: "-0.44px" },
  44: { minHeight: "44px", padding: `0 ${space[4]}`, fontSize: font.size.base, lineHeight: "20px", letterSpacing: "-0.15px" },
  36: { minHeight: "36px", padding: `0 ${space[3]}`, fontSize: font.size.sm, lineHeight: "18px", letterSpacing: "-0.1px" },
};

export function WarningButton({
  children = "Warning button",
  size = 44,
  fullWidth,
  style,
  disabled,
  ...props
}: WarningButtonProps) {
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
          ...(isActive && {
            backgroundColor: color.dangerPressed,
            transform: "scale(0.98)",
          }),
          ...(isHovered && !isActive && {
            backgroundColor: color.dangerHover,
          }),
          ...(isFocused && {
            outline: `2px solid ${color.primary}`,
            outlineOffset: "2px",
          }),
        }),
    ...style,
  };

  return (
    <button
      type="button"
      disabled={disabled}
      style={combinedStyle}
      data-design-system="warning-button"
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
