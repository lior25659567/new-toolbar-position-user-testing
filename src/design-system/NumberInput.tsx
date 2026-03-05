import * as React from "react";
import { color, font, radius, transition, space } from "./tokens";

export interface NumberInputProps {
  label?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  error?: string;
  helper?: string;
  required?: boolean;
  fullWidth?: boolean;
}

const StepButton = ({
  direction,
  onClick,
  disabled,
}: {
  direction: "up" | "down";
  onClick: () => void;
  disabled?: boolean;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={direction === "up" ? "Increase" : "Decrease"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: "100%",
        border: "none",
        borderLeft: `1px solid ${color.borderDefault}`,
        background: isHovered && !disabled ? color.bgHover : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        color: color.textLabel,
        padding: 0,
        transition: transition.fast,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {direction === "up" ? <path d="M2 6.5l3-3 3 3" /> : <path d="M2 3.5l3 3 3-3" />}
      </svg>
    </button>
  );
};

export function NumberInput({
  label,
  value: controlledValue,
  defaultValue,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  error,
  helper,
  required,
  fullWidth,
}: NumberInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? 0);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const hasError = Boolean(error);

  const clamp = (v: number) => {
    if (min !== undefined && v < min) return min;
    if (max !== undefined && v > max) return max;
    return v;
  };

  const setValue = (v: number) => {
    const clamped = clamp(v);
    if (!isControlled) setInternalValue(clamped);
    onChange?.(clamped);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) setValue(parsed);
  };

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "stretch",
    border: "1px solid",
    borderColor: hasError ? color.danger : isFocused ? color.primary : color.borderDefault,
    borderRadius: radius.sm,
    overflow: "hidden",
    transition: transition.input,
    opacity: disabled ? 0.5 : 1,
    backgroundColor: color.bgSurface,
    ...(fullWidth ? { width: "100%" } : {}),
    boxSizing: "border-box" as const,
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    border: "none",
    outline: "none",
    padding: `${space[3]} ${space[4]}`,
    fontFamily: font.family,
    fontSize: font.size.base,
    color: color.textDefault,
    background: "none",
    minWidth: 60,
    textAlign: "left" as const,
    MozAppearance: "textfield" as React.CSSProperties["MozAppearance"],
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: space[2], fontFamily: font.family, ...(fullWidth ? { width: "100%" } : {}) }}>
      {label && (
        <div style={{ display: "flex", alignItems: "center", gap: space[1] }}>
          <label style={{ fontSize: font.size.xs, color: color.textLabel }}>{label}</label>
          {required && <span style={{ color: color.danger, fontSize: font.size.xs }}>*</span>}
        </div>
      )}
      <div style={fieldStyle}>
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={hasError}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <StepButton direction="up" onClick={() => setValue(value + step)} disabled={disabled || (max !== undefined && value >= max)} />
          <StepButton direction="down" onClick={() => setValue(value - step)} disabled={disabled || (min !== undefined && value <= min)} />
        </div>
      </div>
      {hasError ? (
        <span style={{ fontSize: font.size.xs, color: color.danger }} role="alert">{error}</span>
      ) : helper ? (
        <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>{helper}</span>
      ) : null}
    </div>
  );
}
