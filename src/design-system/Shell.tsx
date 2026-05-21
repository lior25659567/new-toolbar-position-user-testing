import * as React from "react";
import { Icon, type IconName } from "./Icon";

/* =========================================================
   Shell — page frame, navigation rail, top header bar
   Ported from align-ds/Shell.jsx
   ========================================================= */

interface NavItemProps {
  icon: IconName | string;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

function NavItem({ icon, label, active, onClick, collapsed }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`nav-item ${active ? "active" : ""} ${collapsed ? "collapsed" : ""}`}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
      type="button"
    >
      <span className="nav-icon"><Icon name={icon} /></span>
      {!collapsed && <span className="nav-label">{label}</span>}
    </button>
  );
}

export interface LogoProps {
  height?: number;
}

export function Logo({ height = 22 }: LogoProps) {
  const w = (height * 67) / 28;
  return (
    <svg
      width={w}
      height={height}
      viewBox="0 0 67 28"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Align"
      role="img"
    >
      <path d="M 27.122 0 C 26.71 0 26.307 0.122 25.964 0.351 C 25.622 0.58 25.355 0.905 25.197 1.286 C 25.039 1.667 24.998 2.085 25.079 2.489 C 25.159 2.893 25.357 3.265 25.649 3.556 C 25.94 3.847 26.311 4.046 26.715 4.126 C 27.119 4.206 27.538 4.165 27.919 4.008 C 28.299 3.85 28.625 3.583 28.854 3.24 C 29.082 2.898 29.205 2.495 29.205 2.083 C 29.205 1.809 29.152 1.538 29.047 1.285 C 28.943 1.032 28.789 0.803 28.596 0.609 C 28.402 0.415 28.172 0.262 27.919 0.158 C 27.666 0.053 27.395 -0.001 27.122 0 Z" />
      <path d="M 49.686 6.862 L 52.884 6.862 L 52.934 8.19 C 53.378 7.646 53.938 7.208 54.573 6.909 C 55.209 6.609 55.903 6.456 56.606 6.46 C 60.117 6.46 62.031 8.631 62.031 12.41 L 62.031 21.217 L 58.715 21.217 L 58.715 12.521 C 58.715 10.572 57.525 9.458 55.855 9.458 C 54.186 9.458 53.002 10.572 53.002 12.521 L 53.002 21.229 L 49.686 21.229 L 49.686 6.862 Z M 21.692 21.229 L 18.38 21.229 L 18.38 0.345 L 21.7 0.345 L 21.692 21.229 Z M 28.787 21.229 L 25.464 21.229 L 25.464 6.862 L 28.787 6.862 L 28.787 21.229 Z M 11.323 6.862 L 14.604 6.862 L 14.604 21.229 L 11.323 21.229 L 11.269 19.72 C 10.092 20.913 8.495 21.6 6.82 21.634 C 2.902 21.631 0 18.479 0 14.045 C 0 9.351 3.144 6.46 6.82 6.46 C 7.656 6.435 8.487 6.594 9.256 6.925 C 10.025 7.256 10.712 7.75 11.269 8.374 L 11.323 6.862 Z M 3.393 14.045 C 3.393 16.798 5.081 18.64 7.432 18.64 C 9.573 18.636 11.487 17.085 11.487 14.045 C 11.487 11.089 9.653 9.45 7.444 9.45 C 4.997 9.45 3.404 11.399 3.404 14.045 L 3.393 14.045 Z M 42.794 14.045 C 42.794 11.047 40.906 9.45 38.758 9.45 C 36.193 9.45 34.711 11.537 34.711 14.045 C 34.711 16.687 36.308 18.64 38.758 18.64 C 41.014 18.64 42.794 16.963 42.794 14.045 Z M 45.922 19.789 C 45.922 25.954 42.315 27.998 38.069 27.998 C 36.289 28.028 34.528 27.635 32.93 26.85 L 33.754 23.997 C 35.063 24.732 36.54 25.116 38.042 25.111 C 40.512 25.111 42.61 23.526 42.61 20.677 L 42.61 19.682 C 42.043 20.305 41.348 20.798 40.573 21.129 C 39.798 21.459 38.961 21.619 38.119 21.596 C 34.251 21.596 31.326 18.487 31.326 14.011 C 31.326 9.722 34.079 6.425 38.134 6.425 C 38.972 6.397 39.806 6.554 40.576 6.885 C 41.347 7.216 42.035 7.713 42.591 8.34 L 42.633 6.827 L 45.922 6.827 L 45.922 19.789 Z" />
      <path d="M 62.491 6.858 L 64.348 6.858 L 64.348 7.241 L 63.632 7.241 L 63.632 9.155 L 63.203 9.155 L 63.203 7.241 L 62.491 7.241 L 62.491 6.858 Z" />
      <path d="M 64.651 6.858 L 65.213 6.858 L 65.596 7.949 C 65.684 8.213 65.795 8.715 65.795 8.715 C 65.795 8.715 65.903 8.217 65.991 7.949 L 66.374 6.858 L 66.948 6.858 L 66.948 9.155 L 66.565 9.155 L 66.565 7.953 C 66.565 7.704 66.592 7.241 66.592 7.241 C 66.592 7.241 66.5 7.662 66.423 7.888 L 65.991 9.148 L 65.646 9.148 L 65.21 7.888 C 65.137 7.662 65.041 7.241 65.041 7.241 C 65.041 7.241 65.072 7.704 65.072 7.953 L 65.072 9.148 L 64.689 9.148 L 64.651 6.858 Z" />
    </svg>
  );
}

export function LogoMark({ height = 22 }: LogoProps) {
  return (
    <svg
      width={height}
      height={height}
      viewBox="0 0 28 28"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Align"
      role="img"
    >
      <path
        d="M 11.323 6.862 L 14.604 6.862 L 14.604 21.229 L 11.323 21.229 L 11.269 19.72 C 10.092 20.913 8.495 21.6 6.82 21.634 C 2.902 21.631 0 18.479 0 14.045 C 0 9.351 3.144 6.46 6.82 6.46 C 7.656 6.435 8.487 6.594 9.256 6.925 C 10.025 7.256 10.712 7.75 11.269 8.374 L 11.323 6.862 Z M 3.393 14.045 C 3.393 16.798 5.081 18.64 7.432 18.64 C 9.573 18.636 11.487 17.085 11.487 14.045 C 11.487 11.089 9.653 9.45 7.444 9.45 C 4.997 9.45 3.404 11.399 3.404 14.045 L 3.393 14.045 Z"
        transform="translate(7 0)"
      />
    </svg>
  );
}

export interface NavItemDef {
  id: string;
  icon?: IconName | string;
  label: string;
}

export interface NavGroupDef {
  id: string;
  label: string;
  icon?: IconName | string;
  items: NavItemDef[];
}

interface NavGroupProps {
  id: string;
  label: string;
  icon?: IconName | string;
  items: NavItemDef[];
  collapsed?: boolean;
  expanded?: boolean;
  onToggle: (id: string) => void;
  active: string;
  onSelect: (id: string) => void;
}

function NavGroup({ id, label, icon, items, collapsed, expanded, onToggle, active, onSelect }: NavGroupProps) {
  const hasActiveChild = items.some((it) => it.id === active);
  if (collapsed) {
    return (
      <div className="nav-group-collapsed" title={label}>
        {items.map((it) => (
          <NavItem
            key={it.id}
            icon={it.icon || icon || "cases"}
            label={it.label}
            collapsed
            active={active === it.id}
            onClick={() => onSelect(it.id)}
          />
        ))}
      </div>
    );
  }
  return (
    <div className={`nav-group ${expanded ? "expanded" : ""} ${hasActiveChild ? "has-active" : ""}`}>
      <button
        type="button"
        className="nav-group-head"
        aria-expanded={expanded}
        onClick={() => onToggle(id)}
      >
        {icon && (
          <span className="nav-group-icon"><Icon name={icon} size={16} /></span>
        )}
        <span className="nav-group-label">{label}</span>
        <span className={`nav-group-chev ${expanded ? "open" : ""}`}>
          <Icon name="chevron-down" size={16} />
        </span>
      </button>
      {expanded && (
        <div className="nav-sub">
          {items.map((it) => (
            <button
              key={it.id}
              type="button"
              className={`nav-item nav-sub-item ${active === it.id ? "active" : ""}`}
              onClick={() => onSelect(it.id)}
              aria-current={active === it.id ? "page" : undefined}
            >
              <span className="nav-icon">
                <Icon name={it.icon || "cases"} size={18} />
              </span>
              <span className="nav-label">{it.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export interface LeftRailProps {
  nav: string;
  setNav: (id: string) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  groups?: NavGroupDef[];
  expandedGroups?: Set<string>;
  onToggleGroup?: (id: string) => void;
}

export function LeftRail({ nav, setNav, collapsed, onToggleCollapsed, groups, expandedGroups, onToggleGroup }: LeftRailProps) {
  const items: NavItemDef[] = [
    { id: "home", icon: "home", label: "Home" },
    { id: "cases", icon: "cases", label: "Cases" },
    { id: "patients", icon: "patients", label: "Patients" },
    { id: "scans", icon: "scans", label: "Scans" },
    { id: "messages", icon: "messages", label: "Messages" },
  ];
  const isGrouped = Array.isArray(groups) && groups.length > 0;
  return (
    <aside className={`left-rail ${collapsed ? "collapsed" : ""}`}>
      <div className="rail-logo">
        {collapsed ? <LogoMark /> : <Logo />}
        {onToggleCollapsed && (
          <button
            className="rail-collapse"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            title={collapsed ? "Expand navigation" : "Collapse navigation"}
            type="button"
          >
            <Icon name={collapsed ? "chevron-right" : "chevron-left"} size={16} />
          </button>
        )}
      </div>
      <nav className="rail-nav" aria-label="Main">
        {isGrouped
          ? groups!.map((g) => (
              <NavGroup
                key={g.id}
                id={g.id}
                label={g.label}
                icon={g.icon}
                items={g.items}
                collapsed={collapsed}
                expanded={expandedGroups ? expandedGroups.has(g.id) : true}
                onToggle={onToggleGroup || (() => {})}
                active={nav}
                onSelect={setNav}
              />
            ))
          : items.map((it) => (
              <NavItem
                key={it.id}
                icon={it.icon!}
                label={it.label}
                collapsed={collapsed}
                active={nav === it.id}
                onClick={() => setNav(it.id)}
              />
            ))}
      </nav>
    </aside>
  );
}

export interface TopBarProps {
  onNew?: () => void;
  unread?: number;
  onThemeToggle?: () => void;
  theme?: "align-light" | "align-dark";
  sizeMode?: "web" | "scanner";
  onSizeModeToggle?: () => void;
}

export function TopBar({
  onNew,
  unread = 2,
  onThemeToggle,
  theme = "align-light",
  sizeMode = "web",
  onSizeModeToggle,
}: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <span className="ti"><Icon name="search" size={18} color="var(--ads-text-muted)" /></span>
        <input placeholder="Search patients, cases, scans..." />
      </div>
      <div className="topbar-actions">
        {onSizeModeToggle && (
          <button
            className="btn btn-ghost icon-btn"
            aria-label={sizeMode === "web" ? "Switch to scanner mode" : "Switch to web mode"}
            onClick={onSizeModeToggle}
            title={sizeMode === "web" ? "Switch to scanner mode" : "Switch to web mode"}
            style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.03em" }}
            type="button"
          >
            {sizeMode === "web" ? "WEB" : "SCN"}
          </button>
        )}
        <button
          className="btn btn-ghost icon-btn"
          aria-label={theme === "align-dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={onThemeToggle}
          title={theme === "align-dark" ? "Switch to light mode" : "Switch to dark mode"}
          type="button"
        >
          <Icon name={theme === "align-dark" ? "sun" : "moon"} color="var(--ads-text-primary)" />
        </button>
        <button className="btn btn-ghost icon-btn" aria-label="Notifications" type="button">
          <Icon name="bell" color="var(--ads-text-primary)" />
          {unread > 0 && <span className="dot">{unread}</span>}
        </button>
        <button className="btn btn-primary btn-md" onClick={onNew} type="button">
          <Icon name="plus" size={20} color="var(--ads-icon-on-color-primary)" />
          <span>New request</span>
        </button>
        <div className="avatar avatar-md" title="Alina Dent">AD</div>
      </div>
    </header>
  );
}
