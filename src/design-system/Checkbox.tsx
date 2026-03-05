import * as React from "react";
import { color, font, radius, shadow, transition, space } from "./tokens";

/**
 * Checkbox – design system component.
 * States: default, hover, checked, indeterminate, focus, disabled.
 */
export interface CheckboxProps
  extends Omit<React.ComponentProps<"input">, "size" | "type"> {
  checked?: boolean;
  defaultChecked?: boolean;
  /** Indeterminate state (e.g. "select all") */
  indeterminate?: boolean;
  /** Size in px: 16 | 20 | 24. Default 20. */
  size?: 16 | 20 | 24;
  label?: React.ReactNode;
}

const sizePx = { 16: 16, 20: 20, 24: 24 } as const;
const iconScale = { 16: 10, 20: 12, 24: 14 } as const;

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
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked ?? false);
  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : uncontrolledChecked;
  const id = React.useId();
  const inputId = idProp ?? id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setUncontrolledChecked(e.target.checked);
    onChange?.(e);
  };

  React.useEffect(() => {
    const el = inputRef.current;
    if (el) el.indeterminate = indeterminate;
  }, [indeterminate]);

  const px = sizePx[size];
  const boxStyle: React.CSSProperties = {
    width: px,
    height: px,
    minWidth: px,
    minHeight: px,
    borderRadius: radius.sm,
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
    boxStyle.opacity = 0.5;
    boxStyle.cursor = "not-allowed";
  } else {
    if (checked || indeterminate) {
      boxStyle.borderColor = color.primary;
      boxStyle.background = color.primary;
      if (isHovered) {
        boxStyle.background = color.primaryHover;
        boxStyle.borderColor = color.primaryHover;
      }
    } else {
      if (isHovered) {
        boxStyle.borderColor = color.borderHover;
        boxStyle.background = color.bgHover;
      }
    }
    if (isFocused) {
      boxStyle.borderColor = color.primary;
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
      className={className}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        ref={inputRef}
        type="checkbox"
        id={inputId}
        {...(isControlled ? { checked } : { defaultChecked: defaultChecked ?? false })}
        disabled={disabled}
        aria-checked={indeterminate ? "mixed" : checked}
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
        onChange={handleChange}
        onFocus={(e) => { if (e.target === e.currentTarget) setIsFocused(true); }}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      <span style={boxStyle} aria-hidden>
        {(checked || indeterminate) && (
          <svg
            width={iconScale[size]}
            height={iconScale[size]}
            viewBox="0 0 14 14"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ display: "block" }}
          >
            {indeterminate ? (
              <line x1="2" y1="7" x2="12" y2="7" />
            ) : (
              <path d="M2 7l3 4 7-8" />
            )}
          </svg>
        )}
      </span>
      {label != null && <span>{label}</span>}
    </label>
  );
}
