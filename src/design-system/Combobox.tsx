import * as React from "react";
import { createPortal } from "react-dom";
import { color, font, radius, shadow, space, transition } from "./tokens";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type ComboboxLayerSet = "white" | "grey";

export interface ComboboxProps {
  label?: string;
  placeholder?: string;
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  helper?: string;
  required?: boolean;
  fullWidth?: boolean;
  /** Background variant — "white" matches surface, "grey" sits on a tinted surface. Defaults to "white". */
  layerSet?: ComboboxLayerSet;
  /** When false, behaves like a static dropdown (no filtering). Defaults to true. */
  searchable?: boolean;
  /** Documentation-only: render the menu open on mount (no click). */
  defaultOpen?: boolean;
  /** Documentation-only: force the focused-trigger border (no real focus). */
  forceFocus?: boolean;
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="16" height="16" viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0, transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    aria-hidden
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
);

export function Combobox({
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
  layerSet = "white",
  searchable = true,
  defaultOpen,
  forceFocus,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen ?? false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [hoveredIndex, setHoveredIndex] = React.useState(-1);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? "");

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const menuRef = React.useRef<HTMLUListElement>(null);
  const [menuPos, setMenuPos] = React.useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : uncontrolledValue;
  const selectedOption = options.find((o) => o.value === selectedValue);
  const hasError = Boolean(error);
  const isFilled = Boolean(selectedOption);

  const filtered = React.useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      const r = inputRef.current.getBoundingClientRect();
      setMenuPos({ top: r.bottom + 4, left: r.left, width: r.width });
    }
  }, [isOpen, filtered.length]);

  React.useEffect(() => {
    if (!isOpen) return;
    const onScroll = () => setIsOpen(false);
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [isOpen]);

  React.useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        wrapperRef.current && !wrapperRef.current.contains(t) &&
        menuRef.current && !menuRef.current.contains(t)
      ) {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const commit = (val: string) => {
    if (!isControlled) setUncontrolledValue(val);
    onChange?.(val);
    setIsOpen(false);
    setQuery("");
    setActiveIndex(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item && !item.disabled) commit(item.value);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
    } else if (e.key === "Backspace" && !query && selectedValue) {
      if (!isControlled) setUncontrolledValue("");
      onChange?.("");
    }
  };

  const surfaceBg = layerSet === "grey" ? color.bgPage : color.bgSurface;
  const inputBorder = hasError
    ? color.danger
    : isOpen || isFocused || forceFocus
    ? color.primary
    : color.borderDefault;

  return (
    <div
      ref={wrapperRef}
      data-design-system="combobox"
      data-layer-set={layerSet}
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

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: space[2],
          minWidth: fullWidth ? 0 : 200,
          width: fullWidth ? "100%" : undefined,
          padding: `${space[3]} ${space[4]}`,
          background: surfaceBg,
          border: "1px solid",
          borderColor: inputBorder,
          borderRadius: radius.sm,
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "text",
          transition: transition.input,
          boxSizing: "border-box",
        }}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          role="combobox"
          aria-label={label ?? placeholder}
          aria-expanded={isOpen}
          aria-controls="combobox-listbox"
          aria-autocomplete={searchable ? "list" : "none"}
          aria-activedescendant={activeIndex >= 0 ? `combobox-opt-${activeIndex}` : undefined}
          disabled={disabled}
          value={isOpen && searchable ? query : selectedOption?.label ?? ""}
          placeholder={placeholder}
          readOnly={!searchable}
          onChange={(e) => { setQuery(e.target.value); if (!isOpen) setIsOpen(true); setActiveIndex(0); }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onClick={() => !disabled && setIsOpen(true)}
          onKeyDown={onKeyDown}
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: font.family,
            fontSize: font.size.base,
            color: isFilled || isOpen ? color.textDefault : color.textPlaceholder,
            padding: 0,
            cursor: disabled ? "not-allowed" : searchable ? "text" : "pointer",
          }}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          disabled={disabled}
          onClick={(e) => { e.stopPropagation(); if (!disabled) setIsOpen((v) => !v); }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: disabled ? "not-allowed" : "pointer",
            color: color.textSubtle,
          }}
        >
          <ChevronIcon open={isOpen} />
        </button>
      </div>

      {isOpen && createPortal(
        <ul
          id="combobox-listbox"
          ref={menuRef}
          role="listbox"
          aria-label={label ?? placeholder}
          style={{
            position: "fixed",
            top: menuPos.top,
            left: menuPos.left,
            width: menuPos.width,
            zIndex: 9999,
            background: color.bgSurface,
            border: `1px solid ${color.borderDefault}`,
            borderRadius: radius.md,
            boxShadow: shadow.md,
            padding: `${space[1]} 0`,
            margin: 0,
            maxHeight: 240,
            overflowY: "auto",
            listStyle: "none",
            fontFamily: font.family,
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {filtered.length === 0 ? (
            <li style={{ padding: `${space[2]} ${space[4]}`, color: color.textPlaceholder, fontSize: font.size.base }}>
              No results
            </li>
          ) : (
            filtered.map((opt, i) => {
              const isSelected = opt.value === selectedValue;
              const isHovered = hoveredIndex === i;
              const isActive = activeIndex === i;
              return (
                <li
                  key={opt.value}
                  id={`combobox-opt-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled}
                  onMouseEnter={() => !opt.disabled && setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(-1)}
                  onClick={() => !opt.disabled && commit(opt.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: `${space[2]} ${space[4]}`,
                    fontSize: font.size.base,
                    color: opt.disabled ? color.textPlaceholder : isSelected ? color.primary : color.textDefault,
                    fontWeight: isSelected ? font.weight.medium : font.weight.regular,
                    background: (isHovered || isActive) && !opt.disabled ? color.bgHover : "transparent",
                    cursor: opt.disabled ? "not-allowed" : "pointer",
                    opacity: opt.disabled ? 0.5 : 1,
                    transition: transition.fast,
                  }}
                >
                  {opt.label}
                </li>
              );
            })
          )}
        </ul>,
        document.body,
      )}

      {hasError ? (
        <span style={{ fontSize: font.size.xs, color: color.danger }} role="alert">{error}</span>
      ) : helper ? (
        <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>{helper}</span>
      ) : null}
    </div>
  );
}
