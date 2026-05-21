import * as React from "react";
import { Button } from "./Kit";

/**
 * Secondary button — back-compat shim around the ADS <Button variant="secondary">.
 * States covered (per Figma "06. Web components 0.9.0", node 204:1226):
 *   enabled, hovered, selected (via `selected` prop / aria-pressed),
 *   pressed (:active), focused (:focus-visible), disabled.
 *
 *   variant="toolbar"  → renders as a ghost button (transparent, hover bg).
 *   variant="default"  → standard secondary (white bg, neutral border).
 */
export interface SecondaryButtonProps extends React.ComponentProps<"button"> {
  children?: React.ReactNode;
  size?: 60 | 44 | 36;
  fullWidth?: boolean;
  variant?: "default" | "toolbar";
  /** Toggle / pressed-by-attribute selected state. Maps to aria-pressed. */
  selected?: boolean;
}

function adsSize(size: 60 | 44 | 36): "sm" | "md" {
  return size === 36 ? "sm" : "md";
}

function sizeOverride(size: 60 | 44 | 36): React.CSSProperties | undefined {
  if (size === 60) return { minHeight: 60, height: 60, padding: "0 24px", fontSize: 16, lineHeight: "22px" };
  return undefined;
}

export function SecondaryButton({
  children = "Secondary button",
  size = 44,
  fullWidth,
  style,
  variant = "default",
  selected,
  "aria-pressed": ariaPressed,
  ...props
}: SecondaryButtonProps) {
  const adsVariant = variant === "toolbar" ? "ghost" : "secondary";
  return (
    <Button
      variant={adsVariant}
      size={adsSize(size)}
      fullWidth={fullWidth}
      style={{ ...sizeOverride(size), ...style }}
      data-design-system="secondary-button"
      aria-pressed={selected ?? ariaPressed}
      {...props}
    >
      {children}
    </Button>
  );
}
