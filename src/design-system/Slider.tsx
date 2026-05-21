import * as React from "react";
import { color, font, space, transition } from "./tokens";

type SingleValue = number;
type RangeValue = [number, number];

export interface SliderProps {
  /** Single or ranged value. If a tuple is passed, the slider renders two handles. */
  value: SingleValue | RangeValue;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: SingleValue | RangeValue) => void;
  disabled?: boolean;
  label?: string;
  /** Format the inline value display. */
  formatValue?: (v: number) => string;
  showValue?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const HANDLE = 20;
const TRACK_HEIGHT = 4;

function pct(v: number, min: number, max: number) {
  if (max === min) return 0;
  return ((v - min) / (max - min)) * 100;
}

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled,
  label,
  formatValue = (v) => String(v),
  showValue = true,
  style,
  className,
}: SliderProps) {
  const isRanged = Array.isArray(value);
  const [lo, hi] = isRanged ? (value as RangeValue) : [min, value as number];
  const selectedFrom = isRanged ? pct(lo, min, max) : 0;
  const selectedTo = isRanged ? pct(hi, min, max) : pct(value as number, min, max);

  const fire = (next: SingleValue | RangeValue) => {
    if (disabled) return;
    onChange?.(next);
  };

  const onSingleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    fire(Number(e.target.value));
  };

  const onLoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextLo = Math.min(Number(e.target.value), hi - step);
    fire([nextLo, hi]);
  };

  const onHiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextHi = Math.max(Number(e.target.value), lo + step);
    fire([lo, nextHi]);
  };

  return (
    <div
      data-design-system="slider"
      data-disabled={disabled || undefined}
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: space[2],
        fontFamily: font.family,
        width: "100%",
        ...style,
      }}
    >
      {(label || showValue) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          {label ? (
            <span style={{ fontSize: font.size.xs, color: color.textLabel, fontWeight: font.weight.regular }}>
              {label}
            </span>
          ) : <span />}
          {showValue && (
            <span style={{ fontSize: font.size.xs, color: color.textSubtle, fontVariantNumeric: "tabular-nums" }}>
              {isRanged ? `${formatValue(lo)} – ${formatValue(hi)}` : formatValue(value as number)}
            </span>
          )}
        </div>
      )}

      <div
        style={{
          position: "relative",
          height: HANDLE,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Track background */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: TRACK_HEIGHT,
            borderRadius: TRACK_HEIGHT / 2,
            background: color.bgActive,
            opacity: disabled ? 0.5 : 1,
          }}
        />
        {/* Selected range fill */}
        <div
          style={{
            position: "absolute",
            left: `${selectedFrom}%`,
            width: `${selectedTo - selectedFrom}%`,
            height: TRACK_HEIGHT,
            borderRadius: TRACK_HEIGHT / 2,
            background: disabled ? color.neutral300 : color.primary,
            transition: transition.fast,
          }}
        />

        {/* Native range input(s) — invisible, drive the value */}
        {isRanged ? (
          <>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={lo}
              disabled={disabled}
              onChange={onLoChange}
              aria-label={label ? `${label} (minimum)` : "Minimum"}
              className="ads-slider-input"
            />
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={hi}
              disabled={disabled}
              onChange={onHiChange}
              aria-label={label ? `${label} (maximum)` : "Maximum"}
              className="ads-slider-input"
            />
          </>
        ) : (
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value as number}
            disabled={disabled}
            onChange={onSingleChange}
            aria-label={label || "Value"}
            className="ads-slider-input"
          />
        )}
      </div>
    </div>
  );
}

if (typeof document !== "undefined" && !document.getElementById("ads-slider-style")) {
  const style = document.createElement("style");
  style.id = "ads-slider-style";
  style.textContent = `
    [data-design-system="slider"] .ads-slider-input {
      position: absolute;
      inset: 0;
      width: 100%;
      height: ${HANDLE}px;
      margin: 0;
      padding: 0;
      background: transparent;
      -webkit-appearance: none;
      appearance: none;
      pointer-events: auto;
      outline: none;
    }
    [data-design-system="slider"][data-disabled] .ads-slider-input { cursor: not-allowed; }
    [data-design-system="slider"] .ads-slider-input::-webkit-slider-runnable-track {
      background: transparent; height: ${HANDLE}px;
    }
    [data-design-system="slider"] .ads-slider-input::-moz-range-track {
      background: transparent; height: ${HANDLE}px; border: none;
    }
    [data-design-system="slider"] .ads-slider-input::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none;
      width: ${HANDLE}px; height: ${HANDLE}px;
      border-radius: 9999px;
      background: var(--ds-surface-base, #fff);
      border: 2px solid var(--ds-color-primary);
      box-shadow: var(--ds-shadow-sm, 0 1px 2px rgba(0,0,0,0.08));
      cursor: pointer;
      transition: transform 120ms cubic-bezier(0.2, 0, 0, 1), box-shadow 120ms cubic-bezier(0.2, 0, 0, 1);
      margin-top: 0;
    }
    [data-design-system="slider"] .ads-slider-input::-moz-range-thumb {
      width: ${HANDLE}px; height: ${HANDLE}px;
      border-radius: 9999px;
      background: var(--ds-surface-base, #fff);
      border: 2px solid var(--ds-color-primary);
      box-shadow: var(--ds-shadow-sm, 0 1px 2px rgba(0,0,0,0.08));
      cursor: pointer;
      transition: transform 120ms cubic-bezier(0.2, 0, 0, 1), box-shadow 120ms cubic-bezier(0.2, 0, 0, 1);
    }
    [data-design-system="slider"] .ads-slider-input:hover:not(:disabled)::-webkit-slider-thumb { transform: scale(1.08); }
    [data-design-system="slider"] .ads-slider-input:hover:not(:disabled)::-moz-range-thumb { transform: scale(1.08); }
    [data-design-system="slider"] .ads-slider-input:active:not(:disabled)::-webkit-slider-thumb { transform: scale(1.15); box-shadow: var(--ds-shadow-md, 0 2px 8px rgba(0,0,0,0.12)); }
    [data-design-system="slider"] .ads-slider-input:active:not(:disabled)::-moz-range-thumb { transform: scale(1.15); box-shadow: var(--ds-shadow-md, 0 2px 8px rgba(0,0,0,0.12)); }
    [data-design-system="slider"] .ads-slider-input:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 4px var(--ds-color-primary-ring, rgba(59, 126, 190, 0.25)); }
    [data-design-system="slider"] .ads-slider-input:focus-visible::-moz-range-thumb { box-shadow: 0 0 0 4px var(--ds-color-primary-ring, rgba(59, 126, 190, 0.25)); }
    [data-design-system="slider"] .ads-slider-input:disabled::-webkit-slider-thumb { background: var(--ds-surface-hover); border-color: var(--ds-border-default); cursor: not-allowed; }
    [data-design-system="slider"] .ads-slider-input:disabled::-moz-range-thumb { background: var(--ds-surface-hover); border-color: var(--ds-border-default); cursor: not-allowed; }
  `;
  document.head.appendChild(style);
}
