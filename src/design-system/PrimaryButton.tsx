import * as React from "react";
import { color, font, radius, shadow, transition, space } from "./tokens";

/**
 * Primary button – design system component.
 * Figma: Enabled 5-6595, Hovered 5-6597, Pressed 5-6599, Focused 5-6601.
 */
export interface PrimaryButtonProps extends React.ComponentProps<"button"> {
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
  borderRadius: radius.md,
  backgroundColor: color.primary,
};

const sizeStyles: Record<60 | 44 | 36, React.CSSProperties> = {
  60: { minHeight: "60px", padding: `0 ${space[6]}`, fontSize: "16px", lineHeight: "22px", letterSpacing: "-0.2px" },
  44: { minHeight: "44px", padding: `0 ${space[4]}`, fontSize: font.size.base, lineHeight: "20px", letterSpacing: "-0.15px" },
  36: { minHeight: "34px", padding: `0 ${space[4]}`, fontSize: font.size.xs, lineHeight: "18px", letterSpacing: "-0.1px" },
};

export function PrimaryButton({
  children = "Primary button",
  size = 44,
  fullWidth,
  style,
  disabled,
  ...props
}: PrimaryButtonProps) {
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
            backgroundColor: color.primaryPressed,
            transform: "scale(0.98)",
          }),
          ...(isHovered && !isActive && {
            backgroundColor: color.primaryHover,
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
      data-design-system="primary-button"
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
