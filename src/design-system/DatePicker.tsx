import * as React from "react";
import * as ReactDOM from "react-dom";
import { color, font, radius, transition, space } from "./tokens";

export interface DatePickerProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  helper?: string;
  required?: boolean;
  min?: string;
  max?: string;
  fullWidth?: boolean;
  placeholder?: string;
  showIcon?: boolean;
}

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }} aria-hidden>
    <rect x="2" y="3" width="12" height="11" rx="2" />
    <line x1="2" y1="7" x2="14" y2="7" />
    <line x1="5.5" y1="1.5" x2="5.5" y2="4.5" />
    <line x1="10.5" y1="1.5" x2="10.5" y2="4.5" />
  </svg>
);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const monthIdx = parseInt(m, 10) - 1;
  return `${MONTHS[monthIdx]} ${parseInt(d, 10)}, ${y}`;
}

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function CalendarDropdown({ value, min, max, onChange, onClose, anchorRect }: {
  value?: string; min?: string; max?: string;
  onChange: (v: string) => void; onClose: () => void;
  anchorRect: { top: number; left: number; height: number };
}) {
  const today = new Date();
  const selected = value ? new Date(value + "T00:00:00") : null;
  const initial = selected || today;
  const [viewYear, setViewYear] = React.useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(initial.getMonth());
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const minDate = min ? new Date(min + "T00:00:00") : null;
  const maxDate = max ? new Date(max + "T00:00:00") : null;

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const next = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const isDisabled = (d: number) => {
    const date = new Date(viewYear, viewMonth, d);
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isSelected = (d: number) => {
    if (!selected) return false;
    return selected.getFullYear() === viewYear && selected.getMonth() === viewMonth && selected.getDate() === d;
  };

  const isToday = (d: number) => {
    return today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === d;
  };

  const dropdown = (
    <div ref={ref} style={{
      position: "fixed",
      top: anchorRect.top + anchorRect.height + 4,
      left: anchorRect.left,
      zIndex: 9999,
      backgroundColor: "white", border: `1px solid ${color.borderDefault}`,
      borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
      padding: "12px", width: "280px",
      animation: "dp-fade-in 0.15s ease-out",
    }}>
      <style>{`@keyframes dp-fade-in { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <button type="button" onClick={prev} style={navBtnStyle}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 4L6 8l4 4"/></svg>
        </button>
        <span style={{ fontSize: "13px", fontWeight: 600, color: color.textHeading, fontFamily: font.family }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button type="button" onClick={next} style={navBtnStyle}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 4l4 4-4 4"/></svg>
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "4px" }}>
        {DAYS.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: "10px", fontWeight: 600, color: color.textPlaceholder, padding: "4px 0", fontFamily: font.family }}>
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;
          const disabled = isDisabled(day);
          const sel = isSelected(day);
          const tod = isToday(day);
          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => { onChange(toISO(viewYear, viewMonth, day)); onClose(); }}
              style={{
                width: "100%", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: sel ? 600 : 400, fontFamily: font.family,
                color: disabled ? color.neutral300 : sel ? "white" : tod ? color.primary : color.textDefault,
                backgroundColor: sel ? color.primary : "transparent",
                border: tod && !sel ? `1px solid ${color.primary}` : "1px solid transparent",
                borderRadius: "50%", cursor: disabled ? "default" : "pointer",
                transition: "all 0.1s ease",
              }}
              onMouseEnter={(e) => { if (!disabled && !sel) e.currentTarget.style.backgroundColor = color.neutral100; }}
              onMouseLeave={(e) => { if (!disabled && !sel) e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Today shortcut */}
      <div style={{ marginTop: "8px", borderTop: `1px solid ${color.borderDefault}`, paddingTop: "8px", textAlign: "center" }}>
        <button
          type="button"
          onClick={() => { onChange(toISO(today.getFullYear(), today.getMonth(), today.getDate())); onClose(); }}
          style={{
            fontSize: "12px", fontWeight: 500, color: color.primary,
            backgroundColor: "transparent", border: "none", cursor: "pointer",
            padding: "4px 12px", borderRadius: "6px",
            transition: `background-color ${transition.fast}`,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E0F2FE")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          Today
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(dropdown, document.body);
}

const navBtnStyle: React.CSSProperties = {
  width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center",
  border: "none", borderRadius: "6px", backgroundColor: "transparent",
  cursor: "pointer", color: "#6a7282", transition: "background-color 0.1s",
};

export function DatePicker({
  label,
  value,
  defaultValue,
  onChange,
  disabled,
  error,
  helper,
  required,
  min,
  max,
  fullWidth,
  placeholder = "Select date",
  showIcon = true,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const [anchorRect, setAnchorRect] = React.useState({ top: 0, left: 0, height: 0 });
  const hasError = Boolean(error);
  const hasValue = Boolean(value || defaultValue);

  const handleOpen = () => {
    if (disabled) return;
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setAnchorRect({ top: rect.top, left: rect.left, height: rect.height });
    }
    setOpen(!open);
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: space[2],
      fontFamily: font.family, ...(fullWidth ? { width: "100%" } : {}),
    }}>
      {label && (
        <div style={{ display: "flex", alignItems: "center", gap: space[1] }}>
          <label style={{ fontSize: font.size.xs, fontWeight: font.weight.regular, color: color.textLabel }}>{label}</label>
          {required && <span style={{ color: color.danger, fontSize: font.size.xs }}>*</span>}
        </div>
      )}
      <div style={{ position: "relative" }}>
        <button
          ref={btnRef}
          type="button"
          disabled={disabled}
          onClick={handleOpen}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: space[2], width: fullWidth ? "100%" : undefined, minWidth: 200,
            padding: `${space[3]} ${space[4]}`, fontFamily: font.family,
            fontSize: font.size.base,
            color: hasValue ? color.textDefault : color.textPlaceholder,
            backgroundColor: color.bgSurface,
            border: `1px solid ${hasError ? color.danger : isFocused || open ? color.primary : color.borderDefault}`,
            borderRadius: radius.sm, cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1, outline: "none",
            transition: transition.input, boxSizing: "border-box" as const,
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {hasValue ? formatDate((value || defaultValue)!) : placeholder}
          </span>
          {showIcon && <CalendarIcon />}
        </button>

        {open && (
          <CalendarDropdown
            value={value}
            min={min}
            max={max}
            anchorRect={anchorRect}
            onChange={(v) => { onChange?.(v); }}
            onClose={() => setOpen(false)}
          />
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
