import * as React from "react";
import { color, font, radius, transition, space } from "./tokens";

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
  placeholder?: string;
  showIcon?: boolean;
}

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }} aria-hidden>
    <rect x="2" y="3" width="12" height="11" rx="2" />
    <line x1="2" y1="7" x2="14" y2="7" />
    <line x1="5.5" y1="1.5" x2="5.5" y2="4.5" />
    <line x1="10.5" y1="1.5" x2="10.5" y2="4.5" />
  </svg>
);

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIdx = parseInt(m, 10) - 1;
  return `${months[monthIdx]} ${parseInt(d, 10)}, ${y}`;
}

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
  placeholder = "Select date",
  showIcon = true,
}: DatePickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const hasError = Boolean(error);
  const hasValue = Boolean(value || defaultValue);

  const wrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: space[2],
    fontFamily: font.family,
    ...(fullWidth ? { width: "100%" } : {}),
  };

  const triggerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space[2],
    width: fullWidth ? "100%" : undefined,
    minWidth: 200,
    padding: `${space[3]} ${space[4]}`,
    fontFamily: font.family,
    fontSize: font.size.base,
    color: hasValue ? color.textDefault : color.textPlaceholder,
    backgroundColor: color.bgSurface,
    border: "1px solid",
    borderColor: hasError ? color.danger : isFocused ? color.primary : color.borderDefault,
    borderRadius: radius.sm,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    outline: "none",
    transition: transition.input,
    boxSizing: "border-box" as const,
    position: "relative",
  };

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.showPicker?.();
      inputRef.current.focus();
    }
  };

  return (
    <div style={wrapperStyle}>
      {label && (
        <div style={{ display: "flex", alignItems: "center", gap: space[1] }}>
          <label style={{ fontSize: font.size.xs, fontWeight: font.weight.regular, color: color.textLabel }}>
            {label}
          </label>
          {required && <span style={{ color: color.danger, fontSize: font.size.xs }}>*</span>}
        </div>
      )}
      <div style={{ position: "relative" }}>
        <button
          type="button"
          disabled={disabled}
          style={triggerStyle}
          onClick={handleClick}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {hasValue ? formatDate((value || defaultValue)!) : placeholder}
          </span>
          {showIcon && <CalendarIcon />}
        </button>
        <input
          ref={inputRef}
          type="date"
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          min={min}
          max={max}
          aria-invalid={hasError}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: disabled ? "not-allowed" : "pointer",
            zIndex: 1,
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      {hasError ? (
        <span style={{ fontSize: font.size.xs, color: color.danger }} role="alert">{error}</span>
      ) : helper ? (
        <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>{helper}</span>
      ) : null}
    </div>
  );
}
