import * as React from "react";
import { color } from "./tokens";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps {
  /** "sm" = 16, "md" = 24, "lg" = 96. Pass a number to override. Defaults to "md". */
  size?: SpinnerSize | number;
  /** Stroke color. Defaults to the primary brand color. */
  color?: string;
  /** Screen-reader label. Defaults to "Loading". */
  label?: string;
  style?: React.CSSProperties;
  className?: string;
}

const SIZE_MAP: Record<SpinnerSize, number> = { sm: 16, md: 24, lg: 96 };

export function Spinner({
  size = "md",
  color: strokeColor = color.primary,
  label = "Loading",
  style,
  className,
}: SpinnerProps) {
  const dim = typeof size === "number" ? size : SIZE_MAP[size];
  const stroke = Math.max(2, Math.round(dim / 12));
  const r = (dim - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label}
      style={{ display: "inline-flex", width: dim, height: dim, ...style }}
      className={className}
      data-design-system="spinner"
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} aria-hidden>
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.15}
          strokeWidth={stroke}
        />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * 0.75}
          style={{
            transformOrigin: "center",
            animation: "ads-spinner-rotate 0.9s linear infinite",
          }}
        />
      </svg>
    </span>
  );
}

if (typeof document !== "undefined" && !document.getElementById("ads-spinner-style")) {
  const style = document.createElement("style");
  style.id = "ads-spinner-style";
  style.textContent = `
    @keyframes ads-spinner-rotate { to { transform: rotate(360deg); } }
    [data-design-system="spinner"] svg circle:last-child { animation: ads-spinner-rotate 0.9s linear infinite; transform-origin: center; }
  `;
  document.head.appendChild(style);
}
