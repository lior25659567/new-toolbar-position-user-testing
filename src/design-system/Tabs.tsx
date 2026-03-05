import * as React from "react";
import { color, font, transition, space } from "./tokens";

/**
 * Tabs – design system component.
 * Figma: Tab node 5:1079.
 *
 * Tab items: 44px height, 12px/16px padding, bottom border indicator.
 * Selected: primary blue border + medium weight.
 * Disabled: muted opacity, not interactive.
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
}

export interface TabsPanelProps {
  /** The tab id this panel belongs to */
  tabId: string;
  activeId: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const TAB_HEIGHT = 44;
const BORDER_H = 2;

function TabButton({
  item,
  isActive,
  onChange,
}: {
  item: TabItem;
  isActive: boolean;
  onChange: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: TAB_HEIGHT,
    padding: `0 ${space[4]}`,
    border: "none",
    borderBottom: `${BORDER_H}px solid`,
    borderBottomColor: isActive
      ? color.primary
      : isFocused
      ? color.primary
      : isHovered
      ? color.borderHover
      : "transparent",
    background: "none",
    fontFamily: font.family,
    fontSize: font.size.base,
    fontWeight: isActive ? font.weight.medium : font.weight.regular,
    color: item.disabled
      ? "rgba(0,0,0,0.38)"
      : isActive
      ? color.primary
      : color.textDefault,
    cursor: item.disabled ? "not-allowed" : "pointer",
    opacity: item.disabled ? 0.5 : 1,
    transition: transition.border,
    outline: "none",
    boxSizing: "border-box" as const,
    whiteSpace: "nowrap" as const,
    userSelect: "none" as const,
    ...(isFocused && !item.disabled
      ? { borderBottomColor: color.primary }
      : {}),
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={item.disabled}
      disabled={item.disabled}
      style={style}
      onClick={() => !item.disabled && onChange(item.id)}
      onMouseEnter={() => !item.disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {item.label}
    </button>
  );
}

export function Tabs({
  items,
  activeId: activeIdProp,
  defaultActiveId,
  onChange,
  style,
}: TabsProps) {
  const [uncontrolledActive, setUncontrolledActive] = React.useState(
    defaultActiveId ?? items[0]?.id
  );
  const isControlled = activeIdProp !== undefined;
  const activeId = isControlled ? activeIdProp : uncontrolledActive;

  const handleChange = (id: string) => {
    if (!isControlled) setUncontrolledActive(id);
    onChange?.(id);
  };

  const listStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    margin: 0,
    padding: 0,
    listStyle: "none",
    borderBottom: `1px solid ${color.borderDefault}`,
    ...style,
  };

  return (
    <div role="tablist" style={listStyle} aria-label="Tabs">
      {items.map((item) => (
        <TabButton
          key={item.id}
          item={item}
          isActive={item.id === activeId}
          onChange={handleChange}
        />
      ))}
    </div>
  );
}

/** Optional panel that shows/hides based on active tab id */
export function TabPanel({ tabId, activeId, children, style }: TabsPanelProps) {
  if (tabId !== activeId) return null;
  return (
    <div role="tabpanel" style={style}>
      {children}
    </div>
  );
}
