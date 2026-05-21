import * as React from "react";
import { createPortal } from "react-dom";
import { color, font, radius, shadow, space, transition, zIndex } from "./tokens";

export type ContextualMenuPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end";

export interface ContextualMenuProps {
  /** Anchor element used to position the menu. */
  anchor: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  placement?: ContextualMenuPlacement;
  /** Min width of the menu box. Defaults to the anchor width (or 180px). */
  minWidth?: number;
  children: React.ReactNode;
}

export interface ContextualMenuItemProps {
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  onSelect?: () => void;
  children: React.ReactNode;
}

function getMenuPos(anchor: HTMLElement | null, placement: ContextualMenuPlacement, minWidth: number) {
  if (!anchor) return { top: 0, left: 0, width: minWidth };
  const r = anchor.getBoundingClientRect();
  const width = Math.max(r.width, minWidth);
  const left = placement.endsWith("end") ? r.right - width : r.left;
  const top = placement.startsWith("bottom") ? r.bottom + 4 : r.top - 4;
  return { top, left, width };
}

function ContextualMenuRoot({
  anchor,
  open,
  onClose,
  placement = "bottom-start",
  minWidth = 180,
  children,
}: ContextualMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ top: 0, left: 0, width: minWidth });

  React.useEffect(() => {
    if (open) setPos(getMenuPos(anchor, placement, minWidth));
  }, [open, anchor, placement, minWidth]);

  React.useEffect(() => {
    if (!open) return;
    const onScrollOrResize = () => setPos(getMenuPos(anchor, placement, minWidth));
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (anchor?.contains(target)) return;
      if (menuRef.current && !menuRef.current.contains(target)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])');
      if (!items || !items.length) return;
      const active = document.activeElement as HTMLElement | null;
      let idx = -1;
      items.forEach((el, i) => { if (el === active) idx = i; });
      if (e.key === "ArrowDown") {
        e.preventDefault();
        items[(idx + 1 + items.length) % items.length].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        items[(idx - 1 + items.length) % items.length].focus();
      }
    };
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, anchor, placement, minWidth, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      aria-orientation="vertical"
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        minWidth: pos.width,
        zIndex: zIndex.popover,
        background: color.bgSurface,
        border: `1px solid ${color.borderDefault}`,
        borderRadius: radius.md,
        boxShadow: shadow.md,
        padding: `${space[1]} 0`,
        fontFamily: font.family,
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {children}
    </div>,
    document.body,
  );
}

function Item({
  icon,
  trailing,
  disabled,
  destructive,
  onSelect,
  children,
}: ContextualMenuItemProps) {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const itemColor = disabled
    ? color.textPlaceholder
    : destructive
    ? color.danger
    : color.textDefault;
  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={() => !disabled && onSelect?.()}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect?.(); }
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: space[2],
        height: 44,
        padding: `0 ${space[3]}`,
        fontSize: font.size.base,
        color: itemColor,
        background: pressed && !disabled ? color.bgActive : hovered && !disabled ? color.bgHover : "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: transition.fast,
        outline: "none",
      }}
    >
      {icon ? <span style={{ display: "inline-flex", flexShrink: 0 }}>{icon}</span> : null}
      <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {children}
      </span>
      {trailing ? <span style={{ display: "inline-flex", flexShrink: 0, color: color.textSubtle }}>{trailing}</span> : null}
    </div>
  );
}

function Separator() {
  return (
    <div
      role="separator"
      style={{
        height: 1,
        margin: `${space[1]} ${space[3]}`,
        background: color.borderDefault,
      }}
    />
  );
}

export const ContextualMenu = Object.assign(ContextualMenuRoot, { Item, Separator });
export { Item as ContextualMenuItem, Separator as ContextualMenuSeparator };
