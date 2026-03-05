import * as React from "react";
import { color, font, radius, shadow, transition, space } from "./tokens";

/**
 * Select (Dropdown) – design system component.
 * Figma: Dropdown node 5:4011.
 *
 * Native <select> wrapper styled to match the Figma design.
 * States: default, focused, disabled, error.
 */

export interface SelectProps
  extends Omit<React.ComponentProps<"select">, "size"> {
  label?: string;
  required?: boolean;
  helper?: string;
  error?: string;
  /** "white" (Set 01) | "grey" (Set 02). Default: "white" */
  layerSet?: "white" | "grey";
  placeholder?: string;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

const ChevronIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", pointerEvents: "none", flexShrink: 0 }}
    aria-hidden
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
);

const labelStyle: React.CSSProperties = {
  fontSize: font.size.xs,
  fontWeight: font.weight.regular,
  color: color.textLabel,
  lineHeight: "1.4",
};

const asteriskStyle: React.CSSProperties = {
  color: color.danger,
  fontSize: font.size.xs,
};

const helperStyle: React.CSSProperties = {
  fontSize: font.size.xs,
  color: color.textSubtle,
  lineHeight: "1.4",
};

const errorTextStyle: React.CSSProperties = {
  fontSize: font.size.xs,
  color: color.danger,
  lineHeight: "1.4",
};

export function Select({
  label,
  required,
  helper,
  error,
  layerSet = "white",
  placeholder,
  fullWidth,
  disabled,
  options,
  style,
  value,
  defaultValue,
  onChange,
  ...props
}: SelectProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const hasError = Boolean(error);
  const fieldBg = layerSet === "white" ? color.bgSurface : "#F4F4F4";

  const wrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: space[2],
    fontFamily: font.family,
    ...(fullWidth ? { width: "100%" } : {}),
  };

  const containerStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

  const selectStyle: React.CSSProperties = {
    fontFamily: font.family,
    fontSize: font.size.base,
    fontWeight: font.weight.regular,
    color: color.textDefault,
    backgroundColor: fieldBg,
    border: "1px solid",
    borderColor: hasError
      ? color.danger
      : isFocused
      ? color.primary
      : color.borderDefault,
    borderRadius: radius.sm,
    padding: `${space[3]} ${space[4]}`,
    paddingRight: "40px",
    outline: "none",
    width: fullWidth ? "100%" : undefined,
    boxSizing: "border-box" as const,
    transition: transition.input,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    ...style,
  };

  const iconStyle: React.CSSProperties = {
    position: "absolute",
    right: space[3],
    top: "50%",
    transform: "translateY(-50%)",
    color: disabled ? "rgba(0,0,0,0.38)" : color.textSubtle,
    pointerEvents: "none",
  };

  return (
    <div style={wrapperStyle}>
      {label && (
        <div style={{ display: "flex", alignItems: "center", gap: space[1] }}>
          <label style={labelStyle}>{label}</label>
          {required && <span style={asteriskStyle}>*</span>}
        </div>
      )}
      <div style={containerStyle}>
        <select
          disabled={disabled}
          value={value}
          defaultValue={defaultValue ?? ""}
          onChange={onChange}
          style={selectStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={hasError}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <span style={iconStyle}>
          <ChevronIcon />
        </span>
      </div>
      {hasError ? (
        <span style={errorTextStyle} role="alert">{error}</span>
      ) : helper ? (
        <span style={helperStyle}>{helper}</span>
      ) : null}
    </div>
  );
}
