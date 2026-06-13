import * as React from "react";

/**
 * Toggle (Switch) — back-compat shim using ADS .toggle / .tg styles.
 */
export interface ToggleProps
  extends Omit<React.ComponentProps<"input">, "size" | "type"> {
  checked?: boolean;
  defaultChecked?: boolean;
  label?: React.ReactNode;
  labelPosition?: "right" | "left";
  /** Documentation-only: force a visual state statically (no interaction). */
  forceState?: "hover" | "pressed" | "focus";
}

export function Toggle({
  checked: checkedProp,
  defaultChecked,
  label,
  labelPosition = "right",
  disabled,
  onChange,
  id: idProp,
  className,
  style,
  forceState,
  ...props
}: ToggleProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultChecked ?? false);
  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? !!checkedProp : uncontrolled;
  const id = React.useId();
  const inputId = idProp ?? id;

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setUncontrolled(e.target.checked);
    onChange?.(e);
  };

  const wrapperStyle: React.CSSProperties = {
    flexDirection: labelPosition === "left" ? "row-reverse" : "row",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    ...style,
  };

  return (
    <label
      htmlFor={inputId}
      className={["toggle", className].filter(Boolean).join(" ")}
      style={wrapperStyle}
      aria-disabled={disabled || undefined}
    >
      <input
        type="checkbox"
        role="switch"
        id={inputId}
        checked={isControlled ? !!checkedProp : undefined}
        defaultChecked={!isControlled ? defaultChecked : undefined}
        disabled={disabled}
        aria-checked={checked}
        onChange={handle}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
        {...props}
      />
      <span className={`tg ${checked ? "on" : ""}`} aria-hidden data-force={forceState} />
      {label != null && <span className="check-lbl">{label}</span>}
    </label>
  );
}
