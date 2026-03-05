import * as React from "react";
import { color, radius, transition } from "./tokens";

/**
 * IconButton – square icon wrapper with hover/focus/active states.
 * Use for close, dismiss, and other single-icon actions inside panels and cards.
 *
 * Size: 36 × 36 px (default) | 32 px (sm) | 40 px (lg)
 * Shape: square with 4 px radius (radius.sm)
 */
export interface IconButtonProps extends React.ComponentProps<"button"> {
  children: React.ReactNode;
  /** Wrapper size. Default "md" = 36 px */
  size?: "sm" | "md" | "lg";
  /** Accessible label – required when there is no visible text */
  "aria-label"?: string;
}

const sizeMap: Record<"sm" | "md" | "lg", number> = {
  sm: 32,
  md: 36,
  lg: 40,
};

export function IconButton({
  children,
  size = "md",
  style,
  disabled,
  ...props
}: IconButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const dim = sizeMap[size];

  const combinedStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: dim,
    height: dim,
    flexShrink: 0,
    padding: 0,
    border: "none",
    borderRadius: radius.sm,
    cursor: disabled ? "not-allowed" : "pointer",
    backgroundColor: isActive
      ? color.bgActive
      : isHovered
      ? color.neutral100
      : "transparent",
    transition: `background-color ${transition.fast}, transform ${transition.fast}`,
    transform: isActive ? "scale(0.94)" : "scale(1)",
    opacity: disabled ? 0.5 : 1,
    outline: "none",
    ...style,
  };

  return (
    <button
      type="button"
      disabled={disabled}
      style={combinedStyle}
      data-design-system="icon-button"
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
      onMouseDown={() => !disabled && setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      {...props}
    >
      {children}
    </button>
  );
}
