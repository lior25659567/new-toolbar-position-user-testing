import * as React from "react";

/**
 * Tabs / TabPanel — WAI-ARIA Tabs pattern.
 *
 * Behavior:
 *   - Roving tabindex (only the focused tab is in the tab order; others -1).
 *   - ArrowLeft / ArrowRight cycle focus (wrap at ends).
 *   - Home / End jump to first / last tab.
 *   - Enter / Space activate the focused tab (manual activation — panels may be expensive).
 *   - Disabled tabs receive focus but cannot be activated.
 *   - Visual: 40px height, 14px Roboto, 2px underline indicator.
 */
export interface TabItem {
  id: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId?: string;
  defaultActiveId?: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
  className?: string;
  /** Label announced to screen readers. */
  ariaLabel?: string;
}

export interface TabsPanelProps {
  tabId: string;
  activeId: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Tabs({
  items,
  activeId: activeIdProp,
  defaultActiveId,
  onChange,
  style,
  className,
  ariaLabel = "Tabs",
}: TabsProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultActiveId ?? items[0]?.id);
  const isControlled = activeIdProp !== undefined;
  const activeId = isControlled ? (activeIdProp as string) : uncontrolled;

  const [focusedId, setFocusedId] = React.useState<string | undefined>(activeId);
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  React.useEffect(() => {
    setFocusedId((id) => (id && items.some((i) => i.id === id) ? id : activeId));
  }, [items, activeId]);

  const moveFocus = (id: string) => {
    setFocusedId(id);
    tabRefs.current[id]?.focus();
  };

  const handle = (id: string) => {
    if (!isControlled) setUncontrolled(id);
    onChange?.(id);
  };

  const findIndex = (id: string | undefined) => Math.max(0, items.findIndex((i) => i.id === id));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
    const current = findIndex(id);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = items[(current + 1) % items.length];
      moveFocus(next.id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = items[(current - 1 + items.length) % items.length];
      moveFocus(prev.id);
    } else if (e.key === "Home") {
      e.preventDefault();
      moveFocus(items[0].id);
    } else if (e.key === "End") {
      e.preventDefault();
      moveFocus(items[items.length - 1].id);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const item = items[current];
      if (!item.disabled) handle(item.id);
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      className={["tabs", className].filter(Boolean).join(" ")}
      style={style}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        const isFocusTarget = item.id === focusedId;
        return (
          <button
            key={item.id}
            ref={(el) => {
              tabRefs.current[item.id] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${item.id}`}
            aria-disabled={item.disabled || undefined}
            tabIndex={isFocusTarget ? 0 : -1}
            className={`tab ${isActive ? "active" : ""}`}
            onClick={() => !item.disabled && handle(item.id)}
            onFocus={() => setFocusedId(item.id)}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            style={item.disabled ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({ tabId, activeId, children, style }: TabsPanelProps) {
  if (tabId !== activeId) return null;
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${tabId}`}
      aria-labelledby={`tab-${tabId}`}
      tabIndex={0}
      style={style}
    >
      {children}
    </div>
  );
}
