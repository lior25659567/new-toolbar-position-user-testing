import * as React from "react";
import { Icon } from "./Icon";

/**
 * Checkbox — back-compat shim using ADS .check / .cbx styles.
 */
export interface CheckboxProps
  extends Omit<React.ComponentProps<"input">, "size" | "type"> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  size?: 16 | 20 | 24;
  label?: React.ReactNode;
}

export function Checkbox({
  checked: checkedProp,
  defaultChecked,
  indeterminate = false,
  size = 20,
  label,
  id: idProp,
  disabled,
  className,
  style,
  onChange,
  ...props
}: CheckboxProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uncontrolled, setUncontrolled] = React.useState(defaultChecked ?? false);
  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? !!checkedProp : uncontrolled;
  const id = React.useId();
  const inputId = idProp ?? id;

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setUncontrolled(e.target.checked);
    onChange?.(e);
  };

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const state = indeterminate ? "ind" : checked ? "on" : "";
  const sizeOverride: React.CSSProperties | undefined = size !== 20 ? { width: size, height: size, flex: `0 0 ${size}px` } : undefined;

  return (
    <label
      htmlFor={inputId}
      className={["check", className].filter(Boolean).join(" ")}
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer", ...style }}
      aria-disabled={disabled || undefined}
    >
      <input
        ref={inputRef}
        type="checkbox"
        id={inputId}
        {...(isControlled ? { checked } : { defaultChecked: defaultChecked ?? false })}
        disabled={disabled}
        aria-checked={indeterminate ? "mixed" : checked}
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
        onChange={handle}
        {...props}
      />
      <span className={`cbx ${state}`} aria-hidden style={sizeOverride}>
        {checked && !indeterminate && <Icon name="check" size={Math.max(10, size - 8)} color="var(--ads-icon-on-color-primary)" />}
        {indeterminate && <span className="ind-bar" />}
      </span>
      {label != null && <span className="check-lbl">{label}</span>}
    </label>
  );
}
