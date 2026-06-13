import * as React from "react";

/**
 * TextInput / TextArea — back-compat shims using ADS field styles.
 * Uses .field / .input-wrap / .field-label / .field-helper / .req / .error.
 */
export interface TextInputProps
  extends Omit<React.ComponentProps<"input">, "size" | "type"> {
  type?: "text" | "password" | "email" | "search" | "tel" | "url" | "number";
  label?: string;
  required?: boolean;
  helper?: string;
  error?: string;
  /** v2.0 default is "white" (background-subtle-01). "grey" keeps the legacy
   *  background-subtle-02 fill for callers that need to sit visually on a
   *  white card. */
  layerSet?: "white" | "grey";
  fullWidth?: boolean;
  /** Documentation-only: force a visual state statically (no interaction). */
  forceState?: "hover" | "focus";
}

export interface TextAreaProps
  extends Omit<React.ComponentProps<"textarea">, "size"> {
  label?: string;
  required?: boolean;
  helper?: string;
  error?: string;
  layerSet?: "white" | "grey";
  fullWidth?: boolean;
  maxLength?: number;
  /** Documentation-only: force a visual state statically (no interaction). */
  forceState?: "hover" | "focus";
}

export function TextInput({
  label,
  required,
  helper,
  error,
  fullWidth,
  disabled,
  style,
  className,
  type = "text",
  layerSet = "white",
  forceState,
  ...props
}: TextInputProps) {
  const hasError = Boolean(error);
  // v2.0 default = white surface (background-subtle-01) on the .input-wrap CSS.
  // "grey" opts back into the legacy background-subtle-02 fill (e.g. when the
  // field sits on a white card and needs visual recess).
  const wrapStyle: React.CSSProperties | undefined =
    layerSet === "grey" ? { background: "var(--ads-background-subtle-02)" } : undefined;
  return (
    <label
      className={["field", className].filter(Boolean).join(" ")}
      style={{ width: fullWidth ? "100%" : undefined, ...style }}
    >
      {label && (
        <span className="field-label">
          {label}
          {required && <span className="req">*</span>}
        </span>
      )}
      <span className={`input-wrap ${hasError ? "error" : ""}`} style={wrapStyle} data-force={forceState}>
        <input
          type={type}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          {...props}
        />
      </span>
      {(error || helper) && (
        <span className={`field-helper ${hasError ? "error" : ""}`} role={hasError ? "alert" : undefined}>
          {error || helper}
        </span>
      )}
    </label>
  );
}

export function TextArea({
  label,
  required,
  helper,
  error,
  fullWidth,
  disabled,
  style,
  className,
  maxLength,
  value,
  defaultValue,
  onChange,
  layerSet = "white",
  forceState,
  ...props
}: TextAreaProps) {
  const wrapStyle: React.CSSProperties | undefined =
    layerSet === "grey" ? { background: "var(--ads-background-subtle-02)" } : undefined;
  const hasError = Boolean(error);
  const [charCount, setCharCount] = React.useState(() => {
    if (typeof value === "string") return value.length;
    if (typeof defaultValue === "string") return defaultValue.length;
    return 0;
  });

  React.useEffect(() => {
    if (typeof value === "string") setCharCount(value.length);
  }, [value]);

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setCharCount(e.target.value.length);
    onChange?.(e);
  };

  return (
    <label
      className={["field", className].filter(Boolean).join(" ")}
      style={{ width: fullWidth ? "100%" : undefined, ...style }}
    >
      {(label || maxLength !== undefined) && (
        <span className="field-label" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>
            {label}
            {required && <span className="req">*</span>}
          </span>
          {maxLength !== undefined && (
            <span style={{ marginLeft: "auto" }}>{charCount}/{maxLength}</span>
          )}
        </span>
      )}
      <span className={`input-wrap ${hasError ? "error" : ""}`} style={wrapStyle} data-force={forceState}>
        <textarea
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          maxLength={maxLength}
          aria-invalid={hasError || undefined}
          {...props}
        />
      </span>
      {(error || helper) && (
        <span className={`field-helper ${hasError ? "error" : ""}`} role={hasError ? "alert" : undefined}>
          {error || helper}
        </span>
      )}
    </label>
  );
}
