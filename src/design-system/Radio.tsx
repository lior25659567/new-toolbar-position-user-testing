import * as React from "react";

/**
 * RadioGroup / RadioItem — back-compat shims using ADS .radio / .rad styles.
 */
export interface RadioGroupProps {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const RadioGroupContext = React.createContext<{
  name: string;
  value: string;
  onChange: (value: string) => void;
} | null>(null);

export function RadioGroup({
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  children,
  style,
  className,
}: RadioGroupProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? "");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? (controlledValue ?? "") : uncontrolled;

  const ctx = React.useMemo(
    () => ({
      name,
      value,
      onChange: (v: string) => {
        if (!isControlled) setUncontrolled(v);
        onChange?.(v);
      },
    }),
    [name, value, isControlled, onChange]
  );

  return (
    <RadioGroupContext.Provider value={ctx}>
      <div
        role="radiogroup"
        style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}
        className={className}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export interface RadioItemProps {
  value: string;
  label?: React.ReactNode;
  size?: 16 | 20 | 24;
  disabled?: boolean;
  id?: string;
  /** Documentation-only: force a visual state statically (no interaction). */
  forceState?: "hover" | "focus";
}

export function RadioItem({ value, label, size = 20, disabled, id: idProp, forceState }: RadioItemProps) {
  const group = React.useContext(RadioGroupContext);
  const id = React.useId();
  const inputId = idProp ?? id;

  if (!group) {
    console.warn("RadioItem must be used inside RadioGroup");
    return null;
  }

  const checked = group.value === value;
  const sizeOverride: React.CSSProperties | undefined = size !== 20 ? { width: size, height: size, flex: `0 0 ${size}px` } : undefined;

  return (
    <label
      htmlFor={inputId}
      className="radio"
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
      aria-disabled={disabled || undefined}
    >
      <input
        type="radio"
        name={group.name}
        value={value}
        checked={checked}
        disabled={disabled}
        id={inputId}
        aria-checked={checked}
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
        onChange={() => group.onChange(value)}
      />
      <span className={`rad ${checked ? "on" : ""}`} aria-hidden style={sizeOverride} data-force={forceState} />
      {label != null && <span className="check-lbl">{label}</span>}
    </label>
  );
}
