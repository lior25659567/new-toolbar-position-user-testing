import * as React from "react";
import { color, font, shadow, transition, space } from "./tokens";

/**
 * Toggle (Switch) – design system component.
 * Figma: Toggle node 5:381.
 *
 * Track: 44×28px, fully rounded (radius 28).
 * Handle: 24×24px white circle.
 *
 * States: enabled, hovered, active, focused, disabled.
 * Selected: primary blue. Unselected: neutral grey.
 */
export interface ToggleProps
  extends Omit<React.ComponentProps<"input">, "size" | "type"> {
  checked?: boolean;
  defaultChecked?: boolean;
  /** Label displayed next to the toggle */
  label?: React.ReactNode;
  /** Label position: "right" (default) | "left" */
  labelPosition?: "right" | "left";
}

const TRACK_W = 44;
const TRACK_H = 28;
const HANDLE_SIZE = 24;
const HANDLE_OFFSET = 2; // gap from edge
const HANDLE_TRAVEL = TRACK_W - HANDLE_SIZE - HANDLE_OFFSET * 2; // 16px

export function Toggle({
  checked: checkedProp,
  defaultChecked,
  label,
  labelPosition = "right",
  disabled,
  onChange,
  id: idProp,
  ...props
}: ToggleProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(
    defaultChecked ?? false
  );

  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : uncontrolledChecked;
  const id = React.useId();
  const inputId = idProp ?? id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setUncontrolledChecked(e.target.checked);
    onChange?.(e);
  };

  // Track background
  let trackBg: string;
  if (disabled) {
    trackBg = "rgba(0,0,0,0.12)";
  } else if (checked) {
    trackBg = isActive
      ? "#0080B2"
      : isHovered
      ? "#008EC2"
      : "#009ACE";
  } else {
    trackBg = isActive ? "#C5C5C5" : isHovered ? "#D2D2D2" : "#DFDFDF";
  }

  const trackStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    width: TRACK_W,
    minWidth: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H,
    backgroundColor: trackBg,
    transition: `background-color ${transition.base}`,
    cursor: disabled ? "not-allowed" : "pointer",
    ...(isFocused && !disabled
      ? { outline: `2px solid ${color.primary}`, outlineOffset: "2px" }
      : {}),
  };

  const handleStyle: React.CSSProperties = {
    position: "absolute",
    top: HANDLE_OFFSET,
    left: checked ? HANDLE_OFFSET + HANDLE_TRAVEL : HANDLE_OFFSET,
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: "50%",
    backgroundColor: disabled ? "rgba(0,0,0,0.26)" : "#ffffff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
    transition: `left 0.2s ease, background-color 0.15s ease`,
    pointerEvents: "none",
  };

  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: space[2],
    flexDirection: labelPosition === "left" ? "row-reverse" : "row",
    cursor: disabled ? "not-allowed" : "pointer",
    userSelect: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: font.family,
    fontSize: font.size.base,
    color: disabled ? "rgba(0,0,0,0.38)" : color.textDefault,
    lineHeight: "1.5",
  };

  return (
    <label
      style={wrapperStyle}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
      onMouseDown={() => !disabled && setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
    >
      {/* Visually hidden native input for accessibility */}
      <input
        type="checkbox"
        role="switch"
        id={inputId}
        checked={isControlled ? checkedProp : undefined}
        defaultChecked={!isControlled ? defaultChecked : undefined}
        disabled={disabled}
        aria-checked={checked}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
        {...props}
      />
      {/* Visual track */}
      <span style={trackStyle} aria-hidden>
        <span style={handleStyle} />
      </span>
      {label != null && <span style={labelStyle}>{label}</span>}
    </label>
  );
}
