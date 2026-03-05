import * as React from "react";
import { color, font, radius, shadow, transition, space } from "./tokens";

export interface DatePickerProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  helper?: string;
  required?: boolean;
  min?: string;
  max?: string;
  fullWidth?: boolean;
}

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }} aria-hidden>
    <rect x="2" y="3" width="12" height="11" rx="2" />
    <line x1="2" y1="7" x2="14" y2="7" />
    <line x1="5.5" y1="1.5" x2="5.5" y2="4.5" />
    <line x1="10.5" y1="1.5" x2="10.5" y2="4.5" />
  </svg>
);

export function DatePicker({
  label,
  value,
  defaultValue,
  onChange,
  disabled,
  error,
  helper,
  required,
  min,
  max,
  fullWidth,
}: DatePickerProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const hasError = Boolean(error);

  const wrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: space[2],
    fontFamily: font.family,
    ...(fullWidth ? { width: "100%" } : {}),
  };

  const fieldWrapperStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: font.family,
    fontSize: font.size.base,
    color: color.textDefault,
    backgroundColor: color.bgSurface,
    border: "1px solid",
    borderColor: hasError ? color.danger : isFocused ? color.primary : color.borderDefault,
    borderRadius: radius.sm,
    padding: `${space[3]} ${space[4]}`,
    paddingRight: "40px",
    outline: "none",
    width: fullWidth ? "100%" : undefined,
    boxSizing: "border-box" as const,
    transition: transition.input,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
  };

  return (
    <div style={wrapperStyle}>
      {label && (
        <div style={{ display: "flex", alignItems: "center", gap: space[1] }}>
          <label style={{ fontSize: font.size.xs, color: color.textLabel }}>{label}</label>
          {required && <span style={{ color: color.danger, fontSize: font.size.xs }}>*</span>}
        </div>
      )}
      <div style={fieldWrapperStyle}>
        <input
          type="date"
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          min={min}
          max={max}
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={hasError}
        />
        <span
          style={{
            position: "absolute",
            right: space[3],
            top: "50%",
            transform: "translateY(-50%)",
            color: disabled ? color.textPlaceholder : color.textSubtle,
            pointerEvents: "none",
          }}
        >
          <CalendarIcon />
        </span>
      </div>
      {hasError ? (
        <span style={{ fontSize: font.size.xs, color: color.danger }} role="alert">{error}</span>
      ) : helper ? (
        <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>{helper}</span>
      ) : null}
    </div>
  );
}
