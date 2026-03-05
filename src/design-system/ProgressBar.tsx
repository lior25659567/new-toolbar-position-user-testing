import * as React from "react";
import { color, font, radius, space } from "./tokens";

/**
 * ProgressBar – design system component.
 * Figma: Progress bar node 5:49.
 *
 * Sizes: medium (4px bar) | large (8px bar)
 * States: in-progress (primary blue), success (green at 100%), error (danger red)
 *
 * Props:
 *   value  0–100  (shows in-progress or success)
 *   error  true   (shows full-width red bar + error message)
 */

export type ProgressBarSize = "medium" | "large";

export interface ProgressBarProps {
  /** 0–100 */
  value?: number;
  label?: string;
  /** Helper text below bar. Shown when not error. */
  helper?: string;
  /** Error message – triggers error state (full red bar). */
  error?: string;
  size?: ProgressBarSize;
  style?: React.CSSProperties;
}

const barHeights: Record<ProgressBarSize, number> = {
  medium: 4,
  large:  8,
};

export function ProgressBar({
  value = 0,
  label,
  helper,
  error,
  size = "medium",
  style,
}: ProgressBarProps) {
  const isError = Boolean(error);
  const clampedValue = Math.min(100, Math.max(0, value));
  const isSuccess = !isError && clampedValue >= 100;

  const barH = barHeights[size];

  const fillColor = isError
    ? color.danger
    : isSuccess
    ? color.success
    : color.primary;

  const fillPercent = isError ? 100 : clampedValue;

  const wrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: space[2],
    fontFamily: font.family,
    ...style,
  };

  const trackStyle: React.CSSProperties = {
    width: "100%",
    height: barH,
    borderRadius: radius.sm,
    backgroundColor: color.borderDefault,
    overflow: "hidden" as const,
  };

  const fillStyle: React.CSSProperties = {
    height: "100%",
    width: `${fillPercent}%`,
    borderRadius: radius.sm,
    backgroundColor: fillColor,
    transition: "width 0.4s ease, background-color 0.3s ease",
  };

  const textStyle: React.CSSProperties = {
    fontSize: font.size.xs,
    lineHeight: "1.4",
    color: isError ? color.danger : color.textSubtle,
  };

  return (
    <div style={wrapperStyle}>
      {label && (
        <span style={{ fontSize: font.size.xs, color: color.textLabel, lineHeight: "1.4" }}>
          {label}
        </span>
      )}
      <div
        role="progressbar"
        aria-valuenow={isError ? undefined : clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        style={trackStyle}
      >
        <div style={fillStyle} />
      </div>
      {(isError ? error : helper) && (
        <span style={textStyle} role={isError ? "alert" : undefined}>
          {isError ? error : helper}
        </span>
      )}
    </div>
  );
}
