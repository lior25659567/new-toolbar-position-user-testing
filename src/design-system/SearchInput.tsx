import * as React from "react";
import { color, font, radius, transition, space } from "./tokens";

export interface SearchInputProps
  extends Omit<React.ComponentProps<"input">, "size" | "type"> {
  /** Placeholder text */
  placeholder?: string;
  /** Callback on value change */
  onSearch?: (value: string) => void;
  /** Show clear button when has value */
  clearable?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke={color.textPlaceholder}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0 }}
    aria-hidden
  >
    <circle cx="7" cy="7" r="4.5" />
    <line x1="10.5" y1="10.5" x2="14" y2="14" />
  </svg>
);

const ClearIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    style={{ display: "block" }}
    aria-hidden
  >
    <line x1="4" y1="4" x2="10" y2="10" /><line x1="10" y1="4" x2="4" y2="10" />
  </svg>
);

export function SearchInput({
  placeholder = "Search…",
  onSearch,
  clearable = true,
  fullWidth,
  disabled,
  value: controlledValue,
  defaultValue,
  onChange,
  style,
  ...props
}: SearchInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState((defaultValue as string) ?? "");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? (controlledValue as string) : internalValue;
  const hasValue = value.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
    onSearch?.(e.target.value);
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue("");
    onSearch?.("");
    inputRef.current?.focus();
  };

  const wrapperStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: space[2],
    padding: `${space[2]} ${space[3]}`,
    backgroundColor: color.bgSurface,
    border: "1px solid",
    borderColor: isFocused ? color.primary : color.borderDefault,
    borderRadius: radius.sm,
    transition: transition.input,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "text",
    ...(fullWidth ? { width: "100%" } : {}),
    boxSizing: "border-box" as const,
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    border: "none",
    outline: "none",
    background: "none",
    fontFamily: font.family,
    fontSize: font.size.base,
    color: color.textDefault,
    padding: 0,
    minWidth: 0,
    ...style,
  };

  return (
    <div
      style={wrapperStyle}
      onClick={() => inputRef.current?.focus()}
    >
      <SearchIcon />
      <input
        ref={inputRef}
        type="text"
        role="searchbox"
        placeholder={placeholder}
        value={isControlled ? controlledValue : undefined}
        defaultValue={!isControlled ? defaultValue : undefined}
        onChange={handleChange}
        disabled={disabled}
        style={inputStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {clearable && hasValue && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            border: "none",
            background: "none",
            padding: 0,
            cursor: "pointer",
            color: color.textPlaceholder,
            borderRadius: radius.sm,
          }}
        >
          <ClearIcon />
        </button>
      )}
    </div>
  );
}
