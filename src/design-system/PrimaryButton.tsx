import * as React from "react";
import { Button } from "./Kit";

/**
 * Primary button — back-compat shim around the ADS <Button variant="primary">.
 * States covered (per Figma "06. Web components 0.9.0", node 204:1183):
 *   enabled, hovered, selected (via `selected` prop / aria-pressed),
 *   pressed (:active), focused (:focus-visible), disabled.
 */
export interface PrimaryButtonProps extends React.ComponentProps<"button"> {
  children?: React.ReactNode;
  size?: 60 | 44 | 36;
  fullWidth?: boolean;
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

export function PrimaryButton({
  children = "Primary button",
  size = 44,
  fullWidth,
  style,
  selected,
  "aria-pressed": ariaPressed,
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      variant="primary"
      size={adsSize(size)}
      fullWidth={fullWidth}
      style={{ ...sizeOverride(size), ...style }}
      data-design-system="primary-button"
      aria-pressed={selected ?? ariaPressed}
      {...props}
    >
      {children}
    </Button>
  );
}
