import * as React from "react";
import { color, font, radius, shadow, transition, space } from "./tokens";

/**
 * TextInput – design system component.
 * Figma: 01 Text input node 5:494.
 *
 * Variants:
 *   - type: "text" | "password" | "textarea"
 *   - layerSet: "white" (Set 01) | "grey" (Set 02)
 *   - state: enabled | focused | filled | disabled | error
 */
export interface TextInputProps
  extends Omit<React.ComponentProps<"input">, "size" | "type"> {
  type?: "text" | "password" | "email" | "search" | "tel" | "url" | "number";
  /** Label displayed above the field */
  label?: string;
  /** Mark field as required (shows red asterisk) */
  required?: boolean;
  /** Helper text below the field */
  helper?: string;
  /** Error message – triggers error state */
  error?: string;
  /** "white" = white field on grey page (Set 01). "grey" = grey field (Set 02). Default: "white" */
  layerSet?: "white" | "grey";
  fullWidth?: boolean;
}

export interface TextAreaProps
  extends Omit<React.ComponentProps<"textarea">, "size"> {
  label?: string;
  required?: boolean;
  helper?: string;
  error?: string;
  layerSet?: "white" | "grey";
  fullWidth?: boolean;
  /** Character counter: current/max */
  maxLength?: number;
}

// ─── Shared ──────────────────────────────────────────────────────────────────

const wrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: space[2],
  fontFamily: font.family,
};

const labelRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: space[1],
};

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

// ─── TextInput ────────────────────────────────────────────────────────────────

export function TextInput({
  label,
  required,
  helper,
  error,
  layerSet = "white",
  fullWidth,
  disabled,
  style,
  value,
  defaultValue,
  onChange,
  type = "text",
  ...props
}: TextInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const hasError = Boolean(error);

  const fieldBg = layerSet === "white" ? color.bgSurface : "#F4F4F4";

  const fieldStyle: React.CSSProperties = {
    fontFamily: font.family,
    fontSize: font.size.base,
    fontWeight: font.weight.regular,
    color: color.textDefault,
    backgroundColor: disabled ? fieldBg : fieldBg,
    border: "1px solid",
    borderColor: hasError
      ? color.danger
      : isFocused
      ? color.primary
      : color.borderDefault,
    borderRadius: radius.sm,
    padding: `${space[3]} ${space[4]}`,
    outline: "none",
    width: fullWidth ? "100%" : undefined,
    boxSizing: "border-box" as const,
    transition: transition.input,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "text",
    ...style,
  };

  return (
    <div style={{ ...wrapperStyle, ...(fullWidth ? { width: "100%" } : {}) }}>
      {label && (
        <div style={labelRowStyle}>
          <label style={labelStyle}>{label}</label>
          {required && <span style={asteriskStyle}>*</span>}
        </div>
      )}
      <input
        type={type}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        style={fieldStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-invalid={hasError}
        aria-describedby={hasError ? "field-error" : helper ? "field-helper" : undefined}
        {...props}
      />
      {hasError ? (
        <span id="field-error" style={errorTextStyle} role="alert">
          {error}
        </span>
      ) : helper ? (
        <span id="field-helper" style={helperStyle}>
          {helper}
        </span>
      ) : null}
    </div>
  );
}

// ─── TextArea ─────────────────────────────────────────────────────────────────

export function TextArea({
  label,
  required,
  helper,
  error,
  layerSet = "white",
  fullWidth,
  disabled,
  style,
  maxLength,
  value,
  defaultValue,
  onChange,
  ...props
}: TextAreaProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [charCount, setCharCount] = React.useState(() => {
    if (typeof value === "string") return value.length;
    if (typeof defaultValue === "string") return defaultValue.length;
    return 0;
  });

  const hasError = Boolean(error);
  const fieldBg = layerSet === "white" ? color.bgSurface : "#F4F4F4";

  const fieldStyle: React.CSSProperties = {
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
    outline: "none",
    width: fullWidth ? "100%" : undefined,
    boxSizing: "border-box" as const,
    transition: transition.input,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "text",
    resize: "vertical" as const,
    minHeight: "96px",
    ...style,
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    onChange?.(e);
  };

  return (
    <div style={{ ...wrapperStyle, ...(fullWidth ? { width: "100%" } : {}) }}>
      {(label || maxLength !== undefined) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={labelRowStyle}>
            {label && <label style={labelStyle}>{label}</label>}
            {required && <span style={asteriskStyle}>*</span>}
          </div>
          {maxLength !== undefined && (
            <span style={{ ...helperStyle, marginLeft: "auto" }}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}
      <textarea
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        maxLength={maxLength}
        style={fieldStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-invalid={hasError}
        {...props}
      />
      {hasError ? (
        <span style={errorTextStyle} role="alert">{error}</span>
      ) : helper ? (
        <span style={helperStyle}>{helper}</span>
      ) : null}
    </div>
  );
}
