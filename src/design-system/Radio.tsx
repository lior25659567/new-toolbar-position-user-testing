import * as React from "react";
import { color, font, radius, shadow, transition, space } from "./tokens";

/**
 * Radio group – design system. Wrap RadioItem components in a RadioGroup.
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

export function RadioGroup({
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  children,
  style,
  className,
}: RadioGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? "");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const context = React.useMemo(
    () => ({
      name,
      value,
      onChange: (v: string) => {
        if (!isControlled) setUncontrolledValue(v);
        onChange?.(v);
      },
    }),
    [name, value, isControlled, onChange]
  );

  return (
    <RadioGroupContext.Provider value={context}>
      <div
        role="radiogroup"
        style={{ display: "flex", flexDirection: "column", gap: space[2], ...style }}
        className={className}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

const RadioGroupContext = React.createContext<{
  name: string;
  value: string;
  onChange: (value: string) => void;
} | null>(null);

/**
 * Radio item – design system component.
 * States: default, hover, selected, focus, disabled.
 * Size: 16 | 20 | 24. Default 20.
 */
export interface RadioItemProps {
  value: string;
  label?: React.ReactNode;
  size?: 16 | 20 | 24;
  disabled?: boolean;
  id?: string;
}

const sizePx = { 16: 16, 20: 20, 24: 24 } as const;
const dotScale = { 16: 6, 20: 8, 24: 10 } as const;

export function RadioItem({
  value,
  label,
  size = 20,
  disabled = false,
  id: idProp,
}: RadioItemProps) {
  const group = React.useContext(RadioGroupContext);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const id = React.useId();
  const inputId = idProp ?? id;

  if (!group) {
    console.warn("RadioItem must be used inside RadioGroup");
    return null;
  }

  const checked = group.value === value;
  const px = sizePx[size];
  const dotPx = dotScale[size];

  const circleStyle: React.CSSProperties = {
    width: px,
    height: px,
    minWidth: px,
    minHeight: px,
    borderRadius: radius.full,
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: color.borderStrong,
    background: color.bgSurface,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: transition.input,
    pointerEvents: "none",
  };

  if (disabled) {
    circleStyle.opacity = 0.5;
    circleStyle.cursor = "not-allowed";
  } else {
    if (checked) {
      circleStyle.borderColor = color.primary;
      circleStyle.background = color.bgSurface;
      if (isHovered) {
        circleStyle.borderColor = color.primaryHover;
      }
    } else {
      if (isHovered) {
        circleStyle.borderColor = color.borderHover;
        circleStyle.background = color.bgHover;
      }
    }
    if (isFocused) {
      circleStyle.borderColor = color.primary;
    }
  }

  const labelStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: space[2],
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: font.family,
    fontSize: size >= 24 ? font.size.md : font.size.base,
    color: color.textDefault,
    userSelect: "none",
  };

  return (
    <label
      style={labelStyle}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        type="radio"
        name={group.name}
        value={value}
        checked={checked}
        disabled={disabled}
        id={inputId}
        aria-checked={checked}
        aria-disabled={disabled}
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
        onFocus={(e) => { if (e.target === e.currentTarget) setIsFocused(true); }}
        onBlur={() => setIsFocused(false)}
      />
      <span style={circleStyle} aria-hidden>
        {checked && (
          <span
            style={{
              width: dotPx,
              height: dotPx,
              borderRadius: radius.full,
              background: color.primary,
            }}
          />
        )}
      </span>
      {label != null && <span>{label}</span>}
    </label>
  );
}
