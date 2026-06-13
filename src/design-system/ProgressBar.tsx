import * as React from "react";

/**
 * ProgressBar — back-compat shim using ADS .progress styles.
 */
export type ProgressBarSize = "medium" | "large";

export interface ProgressBarProps {
  value?: number;
  label?: string;
  helper?: string;
  error?: string;
  size?: ProgressBarSize;
  style?: React.CSSProperties;
}

export function ProgressBar({
  value = 0,
  label,
  helper,
  error,
  size = "medium",
  style,
}: ProgressBarProps) {
  const isError = Boolean(error);
  const clamped = Math.min(100, Math.max(0, value));
  const isSuccess = !isError && clamped >= 100;
  const tone: "blue" | "red" | "green" = isError ? "red" : isSuccess ? "green" : "blue";
  const barH = size === "large" ? 8 : 4;

  return (
    <div className="progress" style={style}>
      {label && <div className="progress-lbl">{label}</div>}
      <div
        role="progressbar"
        aria-valuenow={isError ? undefined : clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={`progress-track tone-${tone}`}
        style={{ height: barH }}
      >
        <i style={{ width: `${isError ? 100 : clamped}%` }} />
      </div>
      {(isError ? error : helper) && (
        <div className={`progress-hint tone-${tone}`} role={isError ? "alert" : undefined}>
          {isError ? error : helper}
        </div>
      )}
    </div>
  );
}
