import * as React from "react";
import { color, font, radius, transition, space, shadow } from "./tokens";

export interface DropdownItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownListProps {
  label?: string;
  placeholder?: string;
  options: DropdownItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  helper?: string;
  required?: boolean;
  fullWidth?: boolean;
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      display: "block",
      flexShrink: 0,
      transition: "transform 0.2s ease",
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
    }}
    aria-hidden
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
);

export function DropdownList({
  label,
  placeholder = "Select an option",
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  disabled,
  error,
  helper,
  required,
  fullWidth,
}: DropdownListProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState(-1);
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? "");
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const selected = isControlled ? controlledValue : uncontrolledValue;
  const selectedOption = options.find((o) => o.value === selected);
  const hasError = Boolean(error);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    if (!isControlled) setUncontrolledValue(val);
    onChange?.(val);
    setIsOpen(false);
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
    color: selectedOption ? color.textDefault : color.textPlaceholder,
    backgroundColor: color.bgSurface,
    border: "1px solid",
    borderColor: hasError
      ? color.danger
      : isOpen || isFocused
      ? color.primary
      : color.borderDefault,
    borderRadius: radius.sm,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    outline: "none",
    transition: transition.input,
    boxSizing: "border-box" as const,
  };

  const menuStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: color.bgSurface,
    border: `1px solid ${color.borderDefault}`,
    borderRadius: radius.md,
    boxShadow: shadow.md,
    padding: `${space[1]} 0`,
    maxHeight: 240,
    overflowY: "auto",
  };

  return (
    <div
      ref={wrapperRef}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: space[2],
        fontFamily: font.family,
        position: "relative",
        ...(fullWidth ? { width: "100%" } : {}),
      }}
    >
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
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => { setIsFocused(false); }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsOpen(false);
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronIcon open={isOpen} />
        </button>

        {isOpen && (
          <ul role="listbox" style={menuStyle}>
            {options.map((opt, i) => {
              const isSelected = opt.value === selected;
              const isHovered = hoveredIndex === i;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled}
                  onMouseEnter={() => !opt.disabled && setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(-1)}
                  onClick={() => !opt.disabled && handleSelect(opt.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: `${space[2]} ${space[4]}`,
                    fontSize: font.size.base,
                    fontFamily: font.family,
                    color: opt.disabled ? color.textPlaceholder : isSelected ? color.primary : color.textDefault,
                    fontWeight: isSelected ? font.weight.medium : font.weight.regular,
                    backgroundColor: isHovered && !opt.disabled ? color.bgHover : "transparent",
                    cursor: opt.disabled ? "not-allowed" : "pointer",
                    opacity: opt.disabled ? 0.5 : 1,
                    listStyle: "none",
                    transition: transition.fast,
                  }}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {hasError ? (
        <span style={{ fontSize: font.size.xs, color: color.danger }} role="alert">{error}</span>
      ) : helper ? (
        <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>{helper}</span>
      ) : null}
    </div>
  );
}
