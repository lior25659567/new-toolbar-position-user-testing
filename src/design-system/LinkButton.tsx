import * as React from "react";
import { Button } from "./Kit";

/**
 * LinkButton / GhostButton — back-compat shims.
 * States: enabled / hovered / selected (aria-pressed) / pressed (:active) /
 * focused (:focus-visible) / disabled — driven by .btn-link / .btn-ghost CSS.
 *   LinkButton  → ADS <Button variant="link">  (transparent, blue text)
 *   GhostButton → ADS <Button variant="ghost"> (transparent, hover bg, neutral text)
 */
export interface LinkButtonProps extends React.ComponentProps<"button"> {
  children?: React.ReactNode;
  size?: 60 | 44 | 36;
  fullWidth?: boolean;
  selected?: boolean;
}

function adsSize(size: 60 | 44 | 36): "sm" | "md" {
  return size === 36 ? "sm" : "md";
}

function sizeOverride(size: 60 | 44 | 36): React.CSSProperties | undefined {
  if (size === 60) return { minHeight: 60, height: 60, padding: "0 24px", fontSize: 16 };
  return undefined;
}

export function LinkButton({
  children = "Link button",
  size = 44,
  fullWidth,
  style,
  selected,
  "aria-pressed": ariaPressed,
  ...props
}: LinkButtonProps) {
  return (
    <Button
      variant="link"
      size={adsSize(size)}
      fullWidth={fullWidth}
      style={{ ...sizeOverride(size), ...style }}
      data-design-system="link-button"
      aria-pressed={selected ?? ariaPressed}
      {...props}
    >
      {children}
    </Button>
  );
}

export interface GhostButtonProps extends React.ComponentProps<"button"> {
  children?: React.ReactNode;
  size?: 60 | 44 | 36;
  fullWidth?: boolean;
  selected?: boolean;
}

export function GhostButton({
  children = "Ghost button",
  size = 44,
  fullWidth,
  style,
  selected,
  "aria-pressed": ariaPressed,
  ...props
}: GhostButtonProps) {
  return (
    <Button
      variant="ghost"
      size={adsSize(size)}
      fullWidth={fullWidth}
      style={{ color: "var(--ads-text-primary)", ...sizeOverride(size), ...style }}
      data-design-system="ghost-button"
      aria-pressed={selected ?? ariaPressed}
      {...props}
    >
      {children}
    </Button>
  );
}
