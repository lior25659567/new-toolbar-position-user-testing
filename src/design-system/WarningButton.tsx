import * as React from "react";
import { Button } from "./Kit";

/**
 * Warning button — back-compat shim around the ADS <Button variant="danger">.
 * States: enabled / hovered / selected (aria-pressed) / pressed (:active) /
 * focused (:focus-visible) / disabled — all managed in theme.css.
 */
export interface WarningButtonProps extends React.ComponentProps<"button"> {
  children?: React.ReactNode;
  size?: 60 | 44 | 36;
  fullWidth?: boolean;
  selected?: boolean;
}

function adsSize(size: 60 | 44 | 36): "sm" | "md" {
  return size === 36 ? "sm" : "md";
}

function sizeOverride(size: 60 | 44 | 36): React.CSSProperties | undefined {
  if (size === 60) return { minHeight: 60, height: 60, padding: "0 24px", fontSize: 16, lineHeight: "22px" };
  return undefined;
}

export function WarningButton({
  children = "Warning button",
  size = 44,
  fullWidth,
  style,
  selected,
  "aria-pressed": ariaPressed,
  ...props
}: WarningButtonProps) {
  return (
    <Button
      variant="danger"
      size={adsSize(size)}
      fullWidth={fullWidth}
      style={{ ...sizeOverride(size), ...style }}
      data-design-system="warning-button"
      aria-pressed={selected ?? ariaPressed}
      {...props}
    >
      {children}
    </Button>
  );
}
