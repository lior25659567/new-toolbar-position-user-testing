import React, { useRef, useState } from "react";
import { color, font, space, radius, shadow, transition, v2 } from "./tokens";
import { useTheme } from "./ThemeProvider";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import { WarningButton } from "./WarningButton";
import { LinkButton, GhostButton } from "./LinkButton";
import { Checkbox } from "./Checkbox";
import { RadioGroup, RadioItem } from "./Radio";
import { Toggle } from "./Toggle";
import { TextInput, TextArea } from "./TextInput";
import { Select } from "./Select";
import { Tag } from "./Tag";
import { Tabs, TabPanel } from "./Tabs";
import { Tooltip } from "./Tooltip";
import { ProgressBar } from "./ProgressBar";
import { DropdownList } from "./DropdownList";
import { Modal, ModalFooter } from "./Modal";
import { Stepper } from "./Stepper";
import { Breadcrumbs } from "./Breadcrumbs";
import { SearchInput } from "./SearchInput";
import { NumberInput } from "./NumberInput";
import { Notification } from "./Notification";
import { DatePicker } from "./DatePicker";
import { MessageList } from "./MessageList";
import { IconButton } from "./IconButton";
import { Icon } from "./Icon";
import { Spinner } from "./Spinner";
import { Slider } from "./Slider";
import { Combobox } from "./Combobox";
import { ContextualMenu } from "./ContextualMenu";
import { MessageBubble } from "./MessageBubble";
import { Accordion, Avatar } from "./Kit";
import { Logo, LogoMark, TopBar, LeftRail } from "./Shell";
import { HorizontalScanToolbar, UpperJawIcon, LowerJawIcon, BothJawsIcon } from "../components/HorizontalToolbarScan";
import { HorizontalViewToolbar } from "../components/HorizontalToolbarView";
import HeaderNavigation from "../components/HeaderNavigation";
import JawSelector from "../components/JawSelector";
import PrepReviewPanel from "../imports/PrepReviewPanel";
import MarginLinePanel from "../imports/MarginLinePanel";
import TrimPanel from "../imports/Panel-88-1668";
import {
  MonochromeIcon, ScanAssistIcon, PrepEditIcon, ChevronIcon,
  ReviewToolIcon, OcclusalgramIcon, MarginLineIcon, PrepQcIcon, TrimIcon,
} from "../components/icons";

// ─── Procedure icon references (simplified previews) ────────────────────────

const PROCEDURE_ICONS: Record<string, React.ReactNode> = {
  study: <svg width="32" height="22" viewBox="0 0 49 34" fill="none"><rect x="0.4" y="0.4" width="48.2" height="28.7" rx="4" stroke="currentColor" strokeWidth="1"/><path d="M31.6 9.1C31.6 6.8 29.6 5 27.2 5c-.7 0-1.2.1-1.6.4-.4.2-1 .2-1.4 0-.5-.3-1-.4-1.6-.4-2.4 0-4.4 1.8-4.4 4.1v8.2c0 1.6 1.2 2.8 2.7 2.8h4.1c1.5 0 2.7-1.2 2.7-2.8V9.1z" stroke="currentColor" strokeWidth="1"/><path d="M13.3 33H35.6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>,
  invisalign: <svg width="32" height="22" viewBox="0 0 60 41" fill="none"><path d="M28 7.6c1.8-.8 3.8-1.3 5.7-.9l.4.1c1.7.5 3 1.8 4.4 3.2 6.7 7 13.5 15.1 15.9 24.6.3 1.1.1 2.3-.5 3.2-.6.9-1.6 1.5-2.6 1.7-1.8.3-3.6-.8-4.8-2.4-1.2-1.6-1.8-3.7-2.4-5.8-.6-2-1-4-1.5-6.1-.5-2.1-1.1-4.1-2.2-6-2.2-3.6-5.8-4.9-9.8-4.8-4 0-7.6 1.3-9.8 4.9-1.1 1.8-1.8 3.9-2.3 6-.5 2.1-.9 4.2-1.4 6.1-.6 2.1-1.2 4.1-2.4 5.8-1.2 1.6-3 2.7-4.8 2.4-1-.2-2-.8-2.6-1.7-.6-.9-.8-2-.6-3l.1-.1.1-.1c1.8-3 3.6-6.1 5.4-9.1 2.1-3.6 4.2-7.1 6.8-10.3 2.6-3.2 5.6-5.9 9.1-7.5z" stroke="currentColor" strokeWidth="1"/></svg>,
  restorative: <svg width="22" height="24" viewBox="0 0 47 50" fill="none"><path d="M40 18c0 1.3-.2 2.6-.7 3.7l-.3.7-1.6 3.9c-2 4.7-3 9.8-3 14.9v2.1c0 1.5-.6 2.9-1.6 3.9-1 1-2.3 1.6-3.7 1.6-2.9 0-5.3-2.5-5.3-5.6v-6.1c0-2.1-1.7-3.7-3.8-3.7s-3.8 1.7-3.8 3.7v6.1c0 1.5-.6 2.9-1.6 3.9-1 1-2.3 1.6-3.7 1.6-2.9 0-5.3-2.5-5.3-5.6v-2.7c0-4.7-.9-9.4-2.5-13.8L1.3 20.8l-.2-.5c-.4-1.1-.6-2.3-.6-3.6 0-6.3 5.5-11.4 12.2-11.4 1.9 0 3.2.4 4.4 1.1 1.2.7 2.7.8 3.9.3 2.1-.9 4.7-1.4 6.8-1.4C34.6 5.3 40 10.4 40 16.7z" stroke="currentColor" strokeWidth="1"/><path d="M33.7 2c-.5 0-1 .4-1.1.9-.7 2.5-1.2 3.6-1.9 4.3-.7.7-1.8 1.2-4.3 1.9-.5.1-.9.6-.9 1.1s.4 1 .9 1.1c2.5.6 3.6 1.1 4.3 1.8.7.7 1.2 1.8 1.9 4.3.1.5.6.9 1.1.9s1-.4 1.1-.9c.6-2.5 1.1-3.6 1.8-4.3.7-.7 1.8-1.2 4.3-1.8.5-.1.9-.6.9-1.1s-.4-1-.9-1.1c-2.5-.7-3.6-1.2-4.3-1.9-.7-.7-1.2-1.8-1.8-4.3-.1-.5-.6-.9-1.1-.9z" fill="none" stroke="#3B7EBE" strokeWidth="1" strokeLinejoin="round"/></svg>,
  implant: <svg width="20" height="24" viewBox="0 0 37 44" fill="none"><path d="M21.5 40.7c-.4 1.7-1.9 2.9-3.4 2.7-1.3-.1-2.5-1.2-2.8-2.7L13.5 25.5H23.5L21.5 40.7z" stroke="currentColor" strokeWidth="1"/><ellipse cx="18.3" cy="19.9" rx="17.8" ry="5.4" stroke="#4482B8" strokeWidth="1"/><path d="M24.3 21c4.4 0 7-4.6 7.9-10.1 1.4-8.2-3.5-10.1-7.9-10.1-2.1 0-3.9 1-5.3 2.6C17.2 1.5 14.6.5 12 .5 7.4.5 4.5 3.7 4.5 9.9c0 5.5 3 10.1 7 10.9l12.8.2z" stroke="currentColor" strokeWidth="1"/></svg>,
  dentures: <svg width="32" height="20" viewBox="0 0 59 36" fill="none"><path d="M58.3 29v1.8c0 2-.6 3.5-2.5 4.4-7.7.8-16.2 1.3-25.4 1.3S12.6 36 4.9 35.2c-.2 0-1.5 0-2.5-1-.6-.6-1-1.5-1-2.5V29c0-2.1 1.7-3.7 3.7-3.7h8.8c.6 1.3 1.8 2.2 3.2 2.3 1.6.1 3.1-.7 3.8-2.2 1 1.9 2.9 3.1 5 3 2.4-.1 3.8-1.8 4-2.1.2.3 1.9 2.1 4.6 2.1 2.8-.1 4.4-2.2 4.6-2.4.1.1 2.1 1.8 4.6 1.1 1.3-.4 2.1-1.3 2.6-1.9h9.1c2.1 0 3.7 1.7 3.7 3.7z" fill="#3B7EBE"/><rect x="6" y="0.5" width="47.6" height="11.9" rx="4.4" stroke="currentColor" strokeWidth="1"/></svg>,
  appliance: <svg width="32" height="18" viewBox="0 0 60 34" fill="none"><path d="M17 13V4.9c1.9-6.4 9.6-5.4 12 0V13.5" stroke="currentColor" strokeWidth="1"/><path d="M41 13V4.9c-1.9-6.4-9.6-5.4-12 0V13.5" stroke="currentColor" strokeWidth="1"/><path d="M1 10.5c22.4 3.7 35 4.3 58 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/><path d="M7.5 18.8v3c17.6 4.4 27.4 4.4 45 0v-3c0-.7-.3-1.3-.9-1.7l-.2-.1c-.4-.3-.8-.4-1.3-.3-15.7 1.4-24.8 1.3-40.6 0-.5 0-.9.1-1.3.3l-.3.2c-.6.4-.9 1-.9 1.7z" stroke="currentColor" strokeWidth="1"/><path d="M5.5 26.7v-3c0-.4.1-.7.3-1 .4-.6 1.2-.9 1.9-.8 16.9 3.6 27 3.6 43.9 0 .7-.2 1.5.2 1.7.9l.1.5v3.3c0 3.3-2.7 6-6 6H11.5c-3.3 0-6-2.7-6-6z" stroke="currentColor" strokeWidth="1"/></svg>,
};

// ─── Nav ─────────────────────────────────────────────────────────────────────

// NAV mirrors Figma "06. Web components 0.9.0" grouping.
// Section IDs are stable — only group headers and order changed.
// Group `id` + `icon` are consumed by <LeftRail groups={NAV} /> below.
const NAV = [
  {
    id: "g-foundation",
    label: "Foundation",
    icon: "palette",
    items: [
      { id: "colors",     label: "Colors" },
      { id: "typography", label: "Typography" },
      { id: "spacing",    label: "Spacing" },
      { id: "radii",      label: "Border Radius" },
      { id: "shadows",    label: "Shadows" },
    ],
  },
  {
    id: "g-actions",
    label: "Actions",
    icon: "button",
    items: [
      { id: "button",      label: "Button" },
      { id: "icon-button", label: "Icon Button" },
      { id: "link",        label: "Link" },
    ],
  },
  {
    id: "g-selection",
    label: "Selection",
    icon: "check-square",
    items: [
      { id: "toggle",     label: "Toggle" },
      { id: "checkbox",   label: "Checkbox" },
      { id: "radio",      label: "Radio" },
      { id: "tag",        label: "Tag" },
    ],
  },
  {
    id: "g-inputs",
    label: "Inputs",
    icon: "form",
    items: [
      { id: "text-input",    label: "Text Input" },
      { id: "text-area",     label: "Text Area" },
      { id: "number-input",  label: "Number Input" },
      { id: "search-input",  label: "Search" },
      { id: "combobox",      label: "Combobox" },
      { id: "slider",        label: "Slider" },
      { id: "date-picker",   label: "Date Picker" },
    ],
  },
  {
    id: "g-pickers",
    label: "Pickers & Menus",
    icon: "more",
    items: [
      { id: "select",          label: "Select" },
      { id: "dropdown-list",   label: "Dropdown List" },
      { id: "contextual-menu", label: "Contextual Menu" },
    ],
  },
  {
    id: "g-navigation",
    label: "Navigation",
    icon: "layout",
    items: [
      { id: "tabs",        label: "Tabs" },
      { id: "breadcrumbs", label: "Breadcrumbs" },
      { id: "stepper",     label: "Stepper" },
      { id: "page-header", label: "Page Header" },
      { id: "nav-panel",   label: "Navigation Panel" },
    ],
  },
  {
    id: "g-data",
    label: "Data Display",
    icon: "grid-dashboard",
    items: [
      { id: "avatar",         label: "Avatar" },
      { id: "card",           label: "Card" },
      { id: "accordion",      label: "Accordion" },
      { id: "message-list",   label: "Message List" },
      { id: "message-bubble", label: "Message Bubble" },
      { id: "progress-bar",   label: "Progress Bar" },
    ],
  },
  {
    id: "g-feedback",
    label: "Feedback",
    icon: "bell",
    items: [
      { id: "tooltip",       label: "Tooltip" },
      { id: "notification",  label: "Notification" },
      { id: "modal",         label: "Modal" },
      { id: "spinner",       label: "Loading / Spinner" },
    ],
  },
  {
    id: "g-branding",
    label: "Branding",
    icon: "logo-mark",
    items: [
      { id: "logo",            label: "Logo" },
      { id: "icons-toolbar",   label: "Toolbar Icons" },
      { id: "icons-procedure", label: "Procedure Icons" },
    ],
  },
  {
    id: "g-application",
    label: "Application",
    icon: "browser",
    items: [
      { id: "toolbar",      label: "Toolbar" },
      { id: "header",       label: "Header" },
      { id: "jaw-selector", label: "Jaw Selector" },
      { id: "panels",       label: "Panels" },
    ],
  },
  {
    id: "g-templates",
    label: "Templates",
    icon: "blocks",
    items: [
      { id: "templates", label: "Templates" },
    ],
  },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

export interface DesignSystemPageProps {
  onBack?: () => void;
}

function ThemeToggleButton() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${color.borderDefault}`,
        borderRadius: radius.md,
        backgroundColor: color.bgSurface,
        color: color.textLabel,
        cursor: 'pointer',
        transition: transition.border,
      }}
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}

function SectionHeading({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description?: string;
}) {
  return (
    <div id={`ds-${id}`} style={{ scrollMarginTop: 24, marginBottom: space[6] }}>
      <h2
        style={{
          fontSize: font.size.xl,
          fontWeight: font.weight.semibold,
          color: color.textHeading,
          margin: 0,
          letterSpacing: font.tracking.tight,
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          style={{
            fontSize: font.size.sm,
            color: color.textSubtle,
            margin: `${space[1]} 0 0`,
            lineHeight: font.lineHeight.normal,
            maxWidth: 600,
          }}
        >
          {description}
        </p>
      )}
      <hr
        style={{
          border: "none",
          borderTop: `1px solid ${color.neutral150}`,
          margin: `${space[3]} 0 0`,
        }}
      />
    </div>
  );
}

function SubHeading({ title }: { title: string }) {
  return (
    <h3
      style={{
        fontSize: font.size["2xs"],
        fontWeight: font.weight.semibold,
        color: color.textPlaceholder,
        letterSpacing: font.tracking.wide,
        textTransform: "uppercase",
        margin: `0 0 ${space[3]}`,
      }}
    >
      {title}
    </h3>
  );
}

function VariantLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: font.size.xs,
        fontWeight: font.weight.medium,
        color: color.textLabel,
        marginBottom: space[2],
      }}
    >
      {children}
    </div>
  );
}

function TokenBadge({ name, value }: { name: string; value?: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: radius.sm,
        background: color.neutral100,
        border: `1px solid ${color.neutral150}`,
        fontFamily: font.mono,
        fontSize: font.size["2xs"],
        color: color.textLabel,
        whiteSpace: "nowrap",
      }}
    >
      {name}
      {value && <span style={{ color: color.textPlaceholder }}>{" · " + value}</span>}
    </span>
  );
}

/** Bordered cell for displaying one component state with label + optional tokens */
function StateCell({
  label,
  hint,
  tokens: tokenList,
  children,
}: {
  label: string;
  hint?: string;
  tokens?: Array<{ name: string; value?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: space[2],
        padding: space[4],
        border: `1px solid ${color.neutral150}`,
        borderRadius: radius.md,
        backgroundColor: color.bgSurface,
      }}
    >
      <div style={{ fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.textLabel }}>
        {label}
      </div>
      {hint && (
        <div style={{ fontSize: font.size["2xs"], color: color.textPlaceholder }}>{hint}</div>
      )}
      <div style={{ display: "flex", alignItems: "center", minHeight: 44 }}>{children}</div>
      {tokenList && tokenList.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {tokenList.map((t) => (
            <TokenBadge key={t.name} name={t.name} value={t.value} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Dashed-border grouping card used by the Templates section. */
function TemplateCard({
  title,
  direction,
  children,
}: {
  title?: string;
  direction: "vertical" | "horizontal";
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: space[5],
        border: `1.5px dashed ${color.neutral200}`,
        borderRadius: radius.lg,
        backgroundColor: color.bgSurface,
        minWidth: 220,
      }}
    >
      {title && (
        <div style={{ fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.textLabel, marginBottom: space[3], textTransform: "uppercase", letterSpacing: font.tracking.wide }}>
          {title}
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: direction === "vertical" ? "column" : "row",
          flexWrap: direction === "horizontal" ? "wrap" : "nowrap",
          alignItems: direction === "vertical" ? "stretch" : "center",
          gap: space[3],
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Foundation helpers ───────────────────────────────────────────────────────

function ColorSwatch({ token, value, usage }: { token: string; value: string; usage?: string }) {
  const isVeryLight = value === color.white || value === color.neutral25 || value === color.neutral50;
  return (
    <div style={{ borderRadius: radius.md, overflow: "hidden", border: `1px solid ${color.neutral150}` }}>
      <div
        style={{
          height: 48,
          backgroundColor: value,
          borderBottom: `1px solid ${isVeryLight ? color.neutral150 : "transparent"}`,
        }}
      />
      <div style={{ padding: `${space[2]} ${space[3]}`, background: color.bgSurface }}>
        <code style={{ display: "block", fontFamily: font.mono, fontSize: font.size["2xs"], color: color.textLabel, fontWeight: font.weight.medium, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {token}
        </code>
        <code style={{ display: "block", fontFamily: font.mono, fontSize: font.size["2xs"], color: color.textPlaceholder, marginTop: 2 }}>
          {value}
        </code>
        {usage && <div style={{ fontSize: font.size["2xs"], color: color.textPlaceholder, marginTop: 4, lineHeight: font.lineHeight.normal }}>{usage}</div>}
      </div>
    </div>
  );
}

function ColorGroup({ title, items, columns = "repeat(auto-fill, minmax(140px, 1fr))" }: {
  title: string;
  items: Array<{ token: string; value: string; usage?: string }>;
  columns?: string;
}) {
  return (
    <div style={{ marginBottom: space[8] }}>
      <SubHeading title={title} />
      <div style={{ display: "grid", gridTemplateColumns: columns, gap: space[3] }}>
        {items.map(({ token, value, usage }) => (
          <ColorSwatch key={token} token={token} value={value} usage={usage} />
        ))}
      </div>
    </div>
  );
}

function TypeRow({ label, sample, size, weight, lineHeight, tracking, tokenNote }: {
  label: string; sample: string; size: string; weight: string;
  lineHeight: string; tracking?: string; tokenNote?: string;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: space[6], alignItems: "center", padding: `${space[4]} 0`, borderBottom: `1px solid ${color.neutral150}` }}>
      <div>
        <div style={{ fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.textLabel }}>{label}</div>
        <div style={{ fontFamily: font.mono, fontSize: font.size["2xs"], color: color.textPlaceholder, marginTop: 4, lineHeight: font.lineHeight.relaxed }}>
          {size} / {weight}
          <br />lh {lineHeight}{tracking ? ` / ls ${tracking}` : ""}
          {tokenNote && (<><br /><span style={{ color: color.primary }}>{tokenNote}</span></>)}
        </div>
      </div>
      <div style={{ fontFamily: font.family, fontSize: size, fontWeight: weight as React.CSSProperties["fontWeight"], lineHeight, letterSpacing: tracking, color: color.textDefault, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {sample}
      </div>
    </div>
  );
}

function SpacingRow({ token, value, usage }: { token: string; value: string; usage?: string }) {
  const px = parseInt(value);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "80px 200px 1fr", gap: space[4], alignItems: "center", padding: `${space[2]} 0`, borderBottom: `1px solid ${color.neutral150}` }}>
      <code style={{ fontFamily: font.mono, fontSize: font.size.xs, color: color.textLabel, fontWeight: font.weight.medium }}>space[{token}]</code>
      <div style={{ display: "flex", alignItems: "center", gap: space[3] }}>
        <div style={{ width: px, height: 20, backgroundColor: color.primary, borderRadius: radius.sm, flexShrink: 0, opacity: 0.7 }} />
        <code style={{ fontFamily: font.mono, fontSize: font.size.xs, color: color.textPlaceholder }}>{value}</code>
      </div>
      {usage && <div style={{ fontSize: font.size.xs, color: color.textPlaceholder }}>{usage}</div>}
    </div>
  );
}

function RadiusSwatch({ token, value, usage }: { token: string; value: string; usage?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: space[2] }}>
      <div style={{ width: 72, height: 72, backgroundColor: color.primary, opacity: 0.15, borderRadius: value, border: `2px solid ${color.primary}` }} />
      <div>
        <code style={{ display: "block", fontFamily: font.mono, fontSize: font.size.xs, color: color.textLabel, fontWeight: font.weight.medium }}>radius.{token}</code>
        <code style={{ display: "block", fontFamily: font.mono, fontSize: font.size["2xs"], color: color.textPlaceholder, marginTop: 2 }}>{value}</code>
        {usage && <div style={{ fontSize: font.size["2xs"], color: color.textPlaceholder, marginTop: 4 }}>{usage}</div>}
      </div>
    </div>
  );
}

function ShadowSwatch({ token, value, usage, bg }: { token: string; value: string; usage?: string; bg?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: space[2] }}>
      <div style={{ width: 96, height: 48, background: bg ?? color.bgSurface, borderRadius: radius.md, boxShadow: value, border: `1px solid ${color.neutral150}` }} />
      <div>
        <code style={{ display: "block", fontFamily: font.mono, fontSize: font.size.xs, color: color.textLabel, fontWeight: font.weight.medium }}>shadow.{token}</code>
        <div style={{ fontSize: font.size["2xs"], color: color.textPlaceholder, marginTop: 4 }}>{usage}</div>
      </div>
    </div>
  );
}

// ─── DemoCard — used in the "Card" section of the styleguide ─────────────────
// Implements the unified v2.0 card pattern: border-only, no bg fill on any
// state. "static" = no hover; "interactive" = hover darkens border; "selected"
// = 2px border-interactive (brand blue), inner padding -1px so the card
// doesn't grow.
function DemoCard({ kind, label }: { kind: "static" | "interactive" | "selected"; label?: string }) {
  const [hovered, setHovered] = React.useState(false);
  const isSelected = kind === "selected";
  const isInteractive = kind !== "static";
  const border = isSelected
    ? "2px solid var(--ads-background-interactive)"
    : hovered && isInteractive
      ? "1px solid var(--ads-border-subtle-hover)"
      : "1px solid var(--ads-border-subtle)";
  return (
    <div
      onMouseEnter={() => isInteractive && setHovered(true)}
      onMouseLeave={() => isInteractive && setHovered(false)}
      aria-selected={isSelected || undefined}
      style={{
        padding: isSelected ? "15px" : "16px",
        borderRadius: "var(--ads-radius-md)",
        border,
        backgroundColor: "var(--ads-background-subtle-01)",
        cursor: isInteractive ? "pointer" : "default",
        transition: "border-color var(--ads-duration-fast) var(--ads-ease-standard)",
        minHeight: "96px",
        display: "flex",
        flexDirection: "column",
        gap: space[2],
      }}
    >
      <div style={{ fontSize: font.size.sm, fontWeight: font.weight.medium, color: "var(--ads-text-primary)", fontFamily: "var(--ads-font-sans)" }}>
        Card title
      </div>
      <div style={{ fontSize: font.size.xs, color: "var(--ads-text-secondary)", fontFamily: "var(--ads-font-sans)" }}>
        {label ?? (kind === "static" ? "Static (no hover)" : "Hover or click to see state")}
      </div>
    </div>
  );
}

// ─── Section divider label ────────────────────────────────────────────────────

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: font.size.xs,
        fontWeight: font.weight.semibold,
        color: color.textPlaceholder,
        letterSpacing: font.tracking.wide,
        textTransform: "uppercase",
        marginBottom: space[6],
        paddingTop: space[4],
        borderTop: `1px solid ${color.neutral150}`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Button type comparison table ─────────────────────────────────────────────

const BUTTON_SIZES: Array<{ label: string; size: 36 | 44 | 60 }> = [
  { label: "Small — 36px", size: 36 },
  { label: "Medium — 44px", size: 44 },
  { label: "Large — 60px",  size: 60 },
];

const BUTTON_VARIANTS = [
  { key: "primary",   label: "Button / Primary",   Comp: PrimaryButton },
  { key: "secondary", label: "Button / Secondary", Comp: SecondaryButton },
  { key: "link",      label: "Button / Link",      Comp: LinkButton },
  { key: "ghost",     label: "Button / Ghost",     Comp: GhostButton },
  { key: "danger",    label: "Button / Danger",    Comp: WarningButton },
] as const;

/** Sizes shown in the icon-only grid — matches Figma (Large 44, Medium 36). */
const ICON_BUTTON_SIZES: Array<{ label: string; size: 36 | 44 }> = [
  { label: "Small — 36px",  size: 36 },
  { label: "Medium — 44px", size: 44 },
];

function ButtonSection() {
  return (
    <>
      {/* Type × Size comparison — Text only */}
      <div style={{ marginBottom: space[10] }}>
        <SubHeading title="Button / Type — text only" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `160px repeat(${BUTTON_SIZES.length}, 1fr)`,
            gap: `${space[2]} ${space[4]}`,
            alignItems: "center",
          }}
        >
          <div />
          {BUTTON_SIZES.map((s) => (
            <div key={s.size} style={{ fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.textLabel, paddingBottom: space[2] }}>
              {s.label}
            </div>
          ))}

          {BUTTON_VARIANTS.map(({ key, label, Comp }) => (
            <React.Fragment key={key}>
              <VariantRowLabel>{label}</VariantRowLabel>
              {BUTTON_SIZES.map((s) => <Comp key={s.size} size={s.size}>Label</Comp>)}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Type × Size comparison — Text + icon */}
      <div style={{ marginBottom: space[10] }}>
        <SubHeading title="Button / Type — text + icon" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `160px repeat(${BUTTON_SIZES.length}, 1fr)`,
            gap: `${space[2]} ${space[4]}`,
            alignItems: "center",
          }}
        >
          <div />
          {BUTTON_SIZES.map((s) => (
            <div key={s.size} style={{ fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.textLabel, paddingBottom: space[2] }}>
              {s.label}
            </div>
          ))}

          {BUTTON_VARIANTS.map(({ key, label, Comp }) => (
            <React.Fragment key={key}>
              <VariantRowLabel>{label}</VariantRowLabel>
              {BUTTON_SIZES.map((s) => (
                <Comp key={s.size} size={s.size}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: space[2] }}>
                    <Icon name="plus" size={s.size === 36 ? 14 : 16} />
                    Label
                  </span>
                </Comp>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Type × Size comparison — Icon only */}
      <div style={{ marginBottom: space[10] }}>
        <SubHeading title="Button / Type — icon only" />
        <p style={{ fontSize: font.size.xs, color: color.textPlaceholder, margin: `0 0 ${space[3]} 0` }}>
          Icon-only variants render the colored Button shim with just an icon child. For neutral toolbar-style icon buttons, prefer the standalone <code>&lt;IconButton /&gt;</code> shown below.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `160px repeat(${ICON_BUTTON_SIZES.length}, max-content)`,
            gap: `${space[2]} ${space[4]}`,
            alignItems: "center",
          }}
        >
          <div />
          {ICON_BUTTON_SIZES.map((s) => (
            <div key={s.size} style={{ fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.textLabel, paddingBottom: space[2] }}>
              {s.label}
            </div>
          ))}

          {BUTTON_VARIANTS.map(({ key, label, Comp }) => (
            <React.Fragment key={key}>
              <VariantRowLabel>{label}</VariantRowLabel>
              {ICON_BUTTON_SIZES.map((s) => (
                <Comp
                  key={s.size}
                  size={s.size}
                  aria-label={`${key} icon-only`}
                  style={{ width: s.size, paddingLeft: 0, paddingRight: 0 }}
                >
                  <Icon name="plus" size={s.size === 36 ? 16 : 18} />
                </Comp>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* States — shown for Primary / Medium as the canonical reference */}
      <div style={{ marginBottom: space[10] }}>
        <SubHeading title="Button / Primary / States" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: space[3],
          }}
        >
          <StateCell label="Default" hint="Resting" tokens={[{ name: "color.primary", value: color.primary }]}>
            <PrimaryButton>Primary</PrimaryButton>
          </StateCell>
          <StateCell label="Hover" hint="Mouse over" tokens={[{ name: "color.primaryHover", value: color.primaryHover }]}>
            <PrimaryButton>Hover me</PrimaryButton>
          </StateCell>
          <StateCell label="Pressed" hint="Click & hold" tokens={[{ name: "color.primaryPressed", value: color.primaryPressed }]}>
            <PrimaryButton>Press me</PrimaryButton>
          </StateCell>
          <StateCell label="Focused" hint="Tab to focus" tokens={[{ name: "outline: 2px color.primary" }, { name: "outlineOffset: 2px" }]}>
            <PrimaryButton>Focus me</PrimaryButton>
          </StateCell>
          <StateCell label="Disabled" tokens={[{ name: "opacity: 0.5" }]}>
            <PrimaryButton disabled>Disabled</PrimaryButton>
          </StateCell>
        </div>
      </div>

      {/* States — Secondary */}
      <div style={{ marginBottom: space[10] }}>
        <SubHeading title="Button / Secondary / States" />
        <p style={{ fontSize: font.size.xs, color: color.textPlaceholder, margin: `0 0 ${space[3]} 0` }}>
          v2.0 spec: <b>transparent fill on every state</b> — only the border darkens through the
          accent ladder (23% → 34% → 49% black). No background fill on hover or pressed. The card
          components (ProcedureCard, ViewLayersPanel rows) follow this exact same border-only model.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: space[3] }}>
          <StateCell label="Default" tokens={[{ name: "bg: transparent" }, { name: "border: border-accent" }]}>
            <SecondaryButton>Secondary</SecondaryButton>
          </StateCell>
          <StateCell label="Hover" tokens={[{ name: "bg: transparent (no fill)" }, { name: "border: border-accent-hover" }]}>
            <SecondaryButton>Hover me</SecondaryButton>
          </StateCell>
          <StateCell label="Pressed" tokens={[{ name: "bg: transparent (no fill)" }, { name: "border: border-accent-active" }, { name: "scale(0.98)" }]}>
            <SecondaryButton>Press me</SecondaryButton>
          </StateCell>
          <StateCell label="Focused" tokens={[{ name: "border: border-focus" }, { name: "outlineOffset: 1px" }]}>
            <SecondaryButton>Focus me</SecondaryButton>
          </StateCell>
          <StateCell label="Disabled" tokens={[{ name: "opacity: 0.5" }, { name: "border: border-disabled" }]}>
            <SecondaryButton disabled>Disabled</SecondaryButton>
          </StateCell>
        </div>
      </div>

      {/* Variant — Secondary / Toolbar */}
      <div style={{ marginBottom: space[10] }}>
        <SubHeading title="Button / Secondary / variant='toolbar'" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: space[3] }}>
          <StateCell label="Toolbar / Default" tokens={[{ name: "bg: transparent" }, { name: "border: color.borderDefault" }]}>
            <SecondaryButton variant="toolbar">Toolbar</SecondaryButton>
          </StateCell>
          <StateCell label="Toolbar / Hover" hint="Mouse over" tokens={[{ name: "bg: background-subtle-02" }]}>
            <SecondaryButton variant="toolbar">Hover me</SecondaryButton>
          </StateCell>
          <StateCell label="Toolbar / Active" hint="Toggled on" tokens={[{ name: "bg: background-highlight-blue" }]}>
            <SecondaryButton variant="toolbar">Active</SecondaryButton>
          </StateCell>
        </div>
      </div>

      {/* States — Danger */}
      <div style={{ marginBottom: space[10] }}>
        <SubHeading title="Button / Danger / States" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: space[3] }}>
          <StateCell label="Default" tokens={[{ name: "color.danger", value: color.danger }]}>
            <WarningButton>Danger</WarningButton>
          </StateCell>
          <StateCell label="Hover" tokens={[{ name: "color.dangerHover" }]}>
            <WarningButton>Hover me</WarningButton>
          </StateCell>
          <StateCell label="Pressed" tokens={[{ name: "color.dangerPressed" }]}>
            <WarningButton>Press me</WarningButton>
          </StateCell>
          <StateCell label="Focused" tokens={[{ name: "outline: 2px color.primary" }]}>
            <WarningButton>Focus me</WarningButton>
          </StateCell>
          <StateCell label="Disabled" tokens={[{ name: "opacity: 0.5" }]}>
            <WarningButton disabled>Disabled</WarningButton>
          </StateCell>
        </div>
      </div>

      {/* States — Ghost */}
      <div style={{ marginBottom: space[10] }}>
        <SubHeading title="Button / Ghost / States" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: space[3] }}>
          <StateCell label="Default" tokens={[{ name: "bg: transparent" }]}>
            <GhostButton>Ghost</GhostButton>
          </StateCell>
          <StateCell label="Hover" hint="Mouse over" tokens={[{ name: "bg: rgba(0,0,0,0.05)" }]}>
            <GhostButton>Hover me</GhostButton>
          </StateCell>
          <StateCell label="Pressed" hint="Click & hold" tokens={[{ name: "bg: rgba(0,0,0,0.09)" }, { name: "scale(0.98)" }]}>
            <GhostButton>Press me</GhostButton>
          </StateCell>
          <StateCell label="Focused" hint="Tab to focus" tokens={[{ name: "outline: 2px color.primary" }]}>
            <GhostButton>Focus me</GhostButton>
          </StateCell>
          <StateCell label="Disabled" tokens={[{ name: "opacity: 0.5" }]}>
            <GhostButton disabled>Disabled</GhostButton>
          </StateCell>
        </div>
      </div>

      {/* States — Link */}
      <div>
        <SubHeading title="Button / Link / States" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: space[3] }}>
          <StateCell label="Default" tokens={[{ name: "color.primary" }, { name: "bg: transparent" }]}>
            <LinkButton>Link</LinkButton>
          </StateCell>
          <StateCell label="Hover" hint="Mouse over" tokens={[{ name: "bg: rgba(0,0,0,0.05)" }]}>
            <LinkButton>Hover me</LinkButton>
          </StateCell>
          <StateCell label="Pressed" hint="Click & hold" tokens={[{ name: "bg: rgba(0,0,0,0.09)" }]}>
            <LinkButton>Press me</LinkButton>
          </StateCell>
          <StateCell label="Focused" hint="Tab to focus" tokens={[{ name: "border: color.primary" }]}>
            <LinkButton>Focus me</LinkButton>
          </StateCell>
          <StateCell label="Disabled" tokens={[{ name: "opacity: 0.5" }]}>
            <LinkButton disabled>Disabled</LinkButton>
          </StateCell>
        </div>
      </div>
    </>
  );
}

/** Inline row-label for the type×size grid */
function VariantRowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: font.size.xs, fontWeight: font.weight.medium, color: color.textSubtle, paddingRight: space[2] }}>
      {children}
    </div>
  );
}

// ─── Tabs demo ────────────────────────────────────────────────────────────────

function TabsDemo() {
  const [active, setActive] = useState("tab1");
  return (
    <div>
      <Tabs
        items={[
          { id: "tab1", label: "Overview" },
          { id: "tab2", label: "Details" },
          { id: "tab3", label: "Settings" },
          { id: "tab4", label: "Disabled", disabled: true },
        ]}
        activeId={active}
        onChange={setActive}
      />
      <div
        style={{
          padding: `${space[5]} 0`,
          color: color.textSubtle,
          fontFamily: font.family,
          fontSize: font.size.base,
        }}
      >
        <TabPanel tabId="tab1" activeId={active}>Overview panel content</TabPanel>
        <TabPanel tabId="tab2" activeId={active}>Details panel content</TabPanel>
        <TabPanel tabId="tab3" activeId={active}>Settings panel content</TabPanel>
      </div>
    </div>
  );
}

// ─── Stepper demo ──────────────────────────────────────────────────────────

function StepperSection() {
  const [step, setStep] = useState(1);
  const steps = ["Scan", "Design", "Review", "Approve"];

  return (
    <>
      <SectionHeading id="stepper" title="Stepper" description="Step indicator for multi-step flows. Shows completed, active, and pending steps. Horizontal and vertical orientation." />
      <div style={{ marginBottom: space[8] }}>
        <SubHeading title="Stepper / Horizontal — Interactive" />
        <Stepper steps={steps} activeStep={step} />
        <div style={{ display: "flex", gap: space[3], marginTop: space[5] }}>
          <SecondaryButton size={36} onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Back</SecondaryButton>
          <PrimaryButton size={36} onClick={() => setStep(Math.min(steps.length, step + 1))} disabled={step === steps.length}>Next</PrimaryButton>
        </div>
      </div>
      <div style={{ marginBottom: space[8] }}>
        <SubHeading title="Stepper / States" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: space[6] }}>
          <div><VariantLabel>Step 0 — All pending</VariantLabel><Stepper steps={["Step 1", "Step 2", "Step 3"]} activeStep={0} /></div>
          <div><VariantLabel>Step 1 — First completed</VariantLabel><Stepper steps={["Step 1", "Step 2", "Step 3"]} activeStep={1} /></div>
          <div><VariantLabel>Step 3 — All completed</VariantLabel><Stepper steps={["Step 1", "Step 2", "Step 3"]} activeStep={3} /></div>
        </div>
      </div>
      <div>
        <SubHeading title="Stepper / Vertical" />
        <Stepper steps={["Upload scan", "Set margin line", "Generate design", "Review & approve"]} activeStep={2} orientation="vertical" />
      </div>
    </>
  );
}

// ─── Link demo ─────────────────────────────────────────────────────────────────

function LinkSection() {
  return (
    <>
      <SectionHeading id="link" title="Link" description="LinkButton — transparent-background, primary-colored text. Used inline or as a standalone button-styled action. Figma: 'Link' page (06. Web components 0.9.0)." />
      <div style={{ marginBottom: space[8] }}>
        <SubHeading title="Link / Sizes" />
        <div style={{ display: "flex", gap: space[4], alignItems: "center" }}>
          <LinkButton size={36}>Small link</LinkButton>
          <LinkButton size={44}>Medium link</LinkButton>
          <LinkButton size={60}>Large link</LinkButton>
        </div>
      </div>
      <div>
        <SubHeading title="Link / States" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: space[3] }}>
          <StateCell label="Default"><LinkButton>Link</LinkButton></StateCell>
          <StateCell label="Hover" hint="Mouse over"><LinkButton>Hover me</LinkButton></StateCell>
          <StateCell label="Pressed" hint="Click & hold"><LinkButton>Press me</LinkButton></StateCell>
          <StateCell label="Focused" hint="Tab to focus"><LinkButton>Focus me</LinkButton></StateCell>
          <StateCell label="Disabled"><LinkButton disabled>Disabled</LinkButton></StateCell>
        </div>
      </div>
    </>
  );
}

// ─── Combobox demo ─────────────────────────────────────────────────────────────

const COMBOBOX_OPTIONS = [
  { value: "amber",    label: "Amber" },
  { value: "azure",    label: "Azure" },
  { value: "beige",    label: "Beige" },
  { value: "coral",    label: "Coral" },
  { value: "crimson",  label: "Crimson" },
  { value: "indigo",   label: "Indigo" },
  { value: "ivory",    label: "Ivory" },
  { value: "magenta",  label: "Magenta" },
  { value: "olive",    label: "Olive" },
  { value: "scarlet",  label: "Scarlet" },
];

function ComboboxSection() {
  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("indigo");
  return (
    <>
      <SectionHeading id="combobox" title="Combobox" description="Searchable select with type-ahead. Both layer-sets (white surface and grey surface) match Figma. States: enabled, hovered, focused, activated, filled, disabled, error. Figma: 15305:6735." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: space[6], maxWidth: 720 }}>
        <div>
          <VariantLabel>Layer set 01 — white surface</VariantLabel>
          <Combobox label="Color" options={COMBOBOX_OPTIONS} value={v1} onChange={setV1} placeholder="Search colors…" fullWidth />
        </div>
        <div>
          <VariantLabel>Layer set 02 — grey surface</VariantLabel>
          <Combobox label="Color" layerSet="grey" options={COMBOBOX_OPTIONS} value={v2} onChange={setV2} placeholder="Search colors…" fullWidth />
        </div>
        <div>
          <VariantLabel>With helper text</VariantLabel>
          <Combobox label="Color" options={COMBOBOX_OPTIONS} helper="Type to filter the list" fullWidth />
        </div>
        <div>
          <VariantLabel>With error</VariantLabel>
          <Combobox label="Color" options={COMBOBOX_OPTIONS} error="Please choose one" fullWidth />
        </div>
        <div>
          <VariantLabel>Disabled</VariantLabel>
          <Combobox label="Color" options={COMBOBOX_OPTIONS} disabled defaultValue="indigo" fullWidth />
        </div>
        <div>
          <VariantLabel>Non-searchable (dropdown mode)</VariantLabel>
          <Combobox label="Color" options={COMBOBOX_OPTIONS} searchable={false} fullWidth />
        </div>
      </div>
    </>
  );
}

// ─── Slider demo ───────────────────────────────────────────────────────────────

function SliderSection() {
  const [single, setSingle] = useState(40);
  const [ranged, setRanged] = useState<[number, number]>([20, 70]);
  return (
    <>
      <SectionHeading id="slider" title="Slider" description="Single-value and ranged sliders. 20×20 circular handle on a thin track. States: enabled, hover, active, disabled. Figma: 18362:19162." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: space[8], maxWidth: 720 }}>
        <div>
          <VariantLabel>Single — enabled</VariantLabel>
          <Slider label="Opacity" value={single} onChange={(v) => setSingle(v as number)} formatValue={(v) => `${v}%`} />
        </div>
        <div>
          <VariantLabel>Single — disabled</VariantLabel>
          <Slider label="Opacity" value={50} onChange={() => {}} disabled formatValue={(v) => `${v}%`} />
        </div>
        <div>
          <VariantLabel>Ranged — enabled</VariantLabel>
          <Slider label="Price range" value={ranged} onChange={(v) => setRanged(v as [number, number])} formatValue={(v) => `$${v}`} />
        </div>
        <div>
          <VariantLabel>Ranged — disabled</VariantLabel>
          <Slider label="Price range" value={[30, 80]} onChange={() => {}} disabled formatValue={(v) => `$${v}`} />
        </div>
        <div>
          <VariantLabel>Custom min / max / step</VariantLabel>
          <Slider label="Temperature (°C)" value={37} onChange={() => {}} min={35} max={42} step={0.1} formatValue={(v) => v.toFixed(1)} />
        </div>
      </div>
    </>
  );
}

// ─── Contextual Menu demo ──────────────────────────────────────────────────────

function ContextualMenuSection() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <SectionHeading id="contextual-menu" title="Contextual Menu" description="Popover menu of items anchored to a trigger. Items: 180×44, with optional icon and trailing element. Keyboard nav (↑/↓ Enter Esc). Figma: 15305:6736." />
      <div style={{ marginBottom: space[8] }}>
        <SubHeading title="Trigger + menu — interactive" />
        <div style={{ position: "relative" }}>
          <SecondaryButton
            ref={anchorRef as unknown as React.Ref<HTMLButtonElement>}
            size={36}
            onClick={() => setOpen((v) => !v)}
          >
            Open menu
          </SecondaryButton>
          <ContextualMenu
            anchor={anchorRef.current}
            open={open}
            onClose={() => setOpen(false)}
          >
            <ContextualMenu.Item icon={<Icon name="edit" size={16} />} onSelect={() => setOpen(false)}>Edit</ContextualMenu.Item>
            <ContextualMenu.Item icon={<Icon name="upload" size={16} />} onSelect={() => setOpen(false)}>Upload</ContextualMenu.Item>
            <ContextualMenu.Item icon={<Icon name="filter" size={16} />} trailing={<Icon name="chevron-right" size={16} />} onSelect={() => setOpen(false)}>Filter by…</ContextualMenu.Item>
            <ContextualMenu.Separator />
            <ContextualMenu.Item icon={<Icon name="close" size={16} />} destructive onSelect={() => setOpen(false)}>Delete</ContextualMenu.Item>
            <ContextualMenu.Item disabled>Archived (disabled)</ContextualMenu.Item>
          </ContextualMenu>
        </div>
      </div>
      <div>
        <SubHeading title="Item states (static preview)" />
        <div
          style={{
            display: "inline-block",
            width: 220,
            background: color.bgSurface,
            border: `1px solid ${color.borderDefault}`,
            borderRadius: radius.md,
            boxShadow: shadow.md,
            padding: `${space[1]} 0`,
            fontFamily: font.family,
          }}
        >
          <MenuItemPreview state="enabled">Enabled</MenuItemPreview>
          <MenuItemPreview state="hovered">Hovered</MenuItemPreview>
          <MenuItemPreview state="active">Active</MenuItemPreview>
          <MenuItemPreview state="focused">Focused</MenuItemPreview>
          <MenuItemPreview state="disabled">Disabled</MenuItemPreview>
        </div>
      </div>
    </>
  );
}

function MenuItemPreview({ state, children }: { state: "enabled" | "hovered" | "active" | "focused" | "disabled"; children: React.ReactNode }) {
  const bg =
    state === "hovered" ? color.bgHover :
    state === "active"  ? color.bgActive :
    "transparent";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 44,
        padding: `0 ${space[3]}`,
        fontSize: font.size.base,
        color: state === "disabled" ? color.textPlaceholder : color.textDefault,
        background: bg,
        opacity: state === "disabled" ? 0.5 : 1,
        outline: state === "focused" ? `2px solid ${color.primary}` : "none",
        outlineOffset: state === "focused" ? -2 : 0,
      }}
    >
      {children}
    </div>
  );
}

// ─── Page Header demo ──────────────────────────────────────────────────────────

function PageHeaderSection() {
  const [theme, setTheme] = useState<"align-light" | "align-dark">("align-light");
  return (
    <>
      <SectionHeading id="page-header" title="Page Header" description="Top app bar (TopBar) — search field, size-mode toggle, theme toggle, notification bell, avatar. Used by the application shell. Figma: 'Page header' page." />
      <div style={{ border: `1px solid ${color.borderDefault}`, borderRadius: radius.md, overflow: "hidden" }}>
        <TopBar
          theme={theme}
          onThemeToggle={() => setTheme((t) => (t === "align-light" ? "align-dark" : "align-light"))}
          onNew={() => {}}
          unread={3}
        />
      </div>
      <p style={{ fontSize: font.size.xs, color: color.textPlaceholder, marginTop: space[3] }}>
        Render with <code style={{ fontFamily: font.mono }}>&lt;TopBar /&gt;</code> from <code style={{ fontFamily: font.mono }}>./Shell</code>.
      </p>
    </>
  );
}

// ─── Navigation Panel demo ────────────────────────────────────────────────────

function NavPanelSection() {
  const [nav, setNav] = useState("cases");
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <SectionHeading id="nav-panel" title="Navigation Panel" description="LeftRail — collapsible side navigation with logo, primary nav items, and optional grouping. Figma: 'Navigation panel' page." />
      <div style={{ marginBottom: space[8] }}>
        <SubHeading title="Expanded" />
        <div style={{ height: 360, border: `1px solid ${color.borderDefault}`, borderRadius: radius.md, overflow: "hidden", display: "flex", background: color.bgPage }}>
          <LeftRail nav={nav} setNav={setNav} collapsed={false} onToggleCollapsed={() => setCollapsed((v) => !v)} />
          <div style={{ flex: 1, padding: space[6], color: color.textSubtle, fontSize: font.size.sm }}>
            Active nav: <b>{nav}</b>
          </div>
        </div>
      </div>
      <div>
        <SubHeading title="Collapsed" />
        <div style={{ height: 360, border: `1px solid ${color.borderDefault}`, borderRadius: radius.md, overflow: "hidden", display: "flex", background: color.bgPage }}>
          <LeftRail nav={nav} setNav={setNav} collapsed={true} onToggleCollapsed={() => {}} />
          <div style={{ flex: 1, padding: space[6], color: color.textSubtle, fontSize: font.size.sm }}>
            Active nav: <b>{nav}</b>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Avatar demo ───────────────────────────────────────────────────────────────

function AvatarSection() {
  return (
    <>
      <SectionHeading id="avatar" title="Avatar" description="Initials avatar in 4 sizes (xs/sm/md/lg). Pass a name string — the first letters of two words become the initials. Figma: 'Avatar' page." />
      <div style={{ marginBottom: space[8] }}>
        <SubHeading title="Avatar / Sizes" />
        <div style={{ display: "flex", alignItems: "center", gap: space[6] }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space[2] }}>
            <Avatar name="Sarah Chen" size="xs" />
            <VariantLabel>xs</VariantLabel>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space[2] }}>
            <Avatar name="Sarah Chen" size="sm" />
            <VariantLabel>sm</VariantLabel>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space[2] }}>
            <Avatar name="Sarah Chen" size="md" />
            <VariantLabel>md (default)</VariantLabel>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space[2] }}>
            <Avatar name="Sarah Chen" size="lg" />
            <VariantLabel>lg</VariantLabel>
          </div>
        </div>
      </div>
      <div>
        <SubHeading title="Avatar / Different names" />
        <div style={{ display: "flex", gap: space[3], alignItems: "center" }}>
          <Avatar name="Alex Davis" />
          <Avatar name="Maria Lopez" />
          <Avatar name="Yuki Tanaka" />
          <Avatar name="Patient Zero" />
          <Avatar name="N" />
        </div>
      </div>
    </>
  );
}

// ─── Accordion demo ────────────────────────────────────────────────────────────

function AccordionSection() {
  return (
    <>
      <SectionHeading id="accordion" title="Accordion" description="Stack of expandable panels. One opens by default; clicking a title toggles the panel. Figma: 'Accordion' page." />
      <div style={{ maxWidth: 560 }}>
        <Accordion
          defaultOpen={0}
          items={[
            { title: "What is included in the scan?", body: <p style={{ margin: 0, color: color.textSubtle, fontSize: font.size.base }}>The intra-oral scan captures upper jaw, lower jaw, and bite registration. Optional add-ons include occlusalgram and prep QC.</p> },
            { title: "How long does the workflow take?", body: <p style={{ margin: 0, color: color.textSubtle, fontSize: font.size.base }}>End-to-end: scanning (4–8 min), review (2 min), submission (~1 min). Lab turnaround is separate.</p> },
            { title: "Can I edit a scan after submission?", body: <p style={{ margin: 0, color: color.textSubtle, fontSize: font.size.base }}>Yes — submitted scans can be reopened from the Cases list. Re-submission requires a quick re-validation step.</p> },
          ]}
        />
      </div>
    </>
  );
}

// ─── Message Bubble demo ───────────────────────────────────────────────────────

function MessageBubbleSection() {
  return (
    <>
      <SectionHeading id="message-bubble" title="Message Bubble" description="Chat bubble primitive. from = 'them' (left, neutral) or 'you' (right, blue). position controls corner rounding for chained messages. Figma: 15305:6742." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: space[6], maxWidth: 760 }}>
        <div>
          <VariantLabel>Interlocutor (them) — chain</VariantLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: space[1], padding: space[3], background: color.bgPage, borderRadius: radius.md }}>
            <MessageBubble from="them" position="top">First message in a chain.</MessageBubble>
            <MessageBubble from="them" position="center">Middle — both corners on the speaker side are tight.</MessageBubble>
            <MessageBubble from="them" position="bottom">Last message in the chain.</MessageBubble>
          </div>
        </div>
        <div>
          <VariantLabel>You — chain</VariantLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: space[1], padding: space[3], background: color.bgPage, borderRadius: radius.md }}>
            <MessageBubble from="you" position="top">First reply.</MessageBubble>
            <MessageBubble from="you" position="center">Middle reply.</MessageBubble>
            <MessageBubble from="you" position="bottom">Last reply.</MessageBubble>
          </div>
        </div>
        <div>
          <VariantLabel>Single bubbles</VariantLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: space[2], padding: space[3], background: color.bgPage, borderRadius: radius.md }}>
            <MessageBubble from="them" position="single">A standalone message from them.</MessageBubble>
            <MessageBubble from="you"  position="single">A standalone reply from you.</MessageBubble>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Spinner / Loading demo ────────────────────────────────────────────────────

function SpinnerSection() {
  return (
    <>
      <SectionHeading id="spinner" title="Loading / Spinner" description="Indeterminate progress indicator. Two Figma sizes (Large 96, Small 16) plus a Medium 24 for the common case. Pure CSS rotation. Figma: 15305:6739." />
      <div style={{ marginBottom: space[8] }}>
        <SubHeading title="Spinner / Sizes" />
        <div style={{ display: "flex", alignItems: "center", gap: space[8] }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space[2] }}>
            <Spinner size="sm" /><VariantLabel>sm — 16</VariantLabel>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space[2] }}>
            <Spinner size="md" /><VariantLabel>md — 24</VariantLabel>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space[2] }}>
            <Spinner size="lg" /><VariantLabel>lg — 96</VariantLabel>
          </div>
        </div>
      </div>
      <div>
        <SubHeading title="Inline in a button" />
        <div style={{ display: "flex", gap: space[3] }}>
          <PrimaryButton disabled>
            <span style={{ display: "inline-flex", alignItems: "center", gap: space[2] }}>
              <Spinner size="sm" color="currentColor" /> Submitting…
            </span>
          </PrimaryButton>
          <SecondaryButton disabled>
            <span style={{ display: "inline-flex", alignItems: "center", gap: space[2] }}>
              <Spinner size="sm" color="currentColor" /> Loading…
            </span>
          </SecondaryButton>
        </div>
      </div>
    </>
  );
}

// ─── Logo demo ─────────────────────────────────────────────────────────────────

function LogoSection() {
  return (
    <>
      <SectionHeading id="logo" title="Logo" description="Brand mark. <Logo /> renders the full wordmark; <LogoMark /> renders the icon-only mark used in the collapsed nav rail. Both accept a height prop (default 22). Figma: 'Logo' page." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: space[6], maxWidth: 720 }}>
        <StateCell label="Logo (full wordmark)" tokens={[{ name: "height: 22 (default)" }]}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 60, color: color.textDefault }}>
            <Logo />
          </div>
        </StateCell>
        <StateCell label="LogoMark (icon only)" tokens={[{ name: "height: 22 (default)" }]}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 60, color: color.textDefault }}>
            <LogoMark />
          </div>
        </StateCell>
        <StateCell label="Logo — height: 32" tokens={[{ name: "height={32}" }]}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 60, color: color.textDefault }}>
            <Logo height={32} />
          </div>
        </StateCell>
        <StateCell label="LogoMark — height: 40" tokens={[{ name: "height={40}" }]}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 60, color: color.textDefault }}>
            <LogoMark height={40} />
          </div>
        </StateCell>
      </div>
    </>
  );
}

// ─── Modal demo ────────────────────────────────────────────────────────────────

function ModalSection() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);

  return (
    <>
      <SectionHeading id="modal" title="Modal" description="Overlay dialog with backdrop. Closes on Escape or backdrop click. Header, body, and footer sections." />
      <div style={{ display: "flex", flexWrap: "wrap", gap: space[4] }}>
        <div>
          <VariantLabel>Modal / Default</VariantLabel>
          <PrimaryButton size={36} onClick={() => setOpen1(true)}>Open Modal</PrimaryButton>
          <Modal open={open1} onClose={() => setOpen1(false)} title="Confirm Action" footer={<ModalFooter onClose={() => setOpen1(false)} confirmLabel="Confirm" />}>
            <p style={{ margin: 0 }}>Are you sure you want to proceed with this action? This cannot be undone.</p>
          </Modal>
        </div>
        <div>
          <VariantLabel>Modal / Without Footer</VariantLabel>
          <SecondaryButton size={36} onClick={() => setOpen2(true)}>Info Modal</SecondaryButton>
          <Modal open={open2} onClose={() => setOpen2(false)} title="Information">
            <p style={{ margin: 0 }}>This is a simple informational modal without any action buttons in the footer.</p>
          </Modal>
        </div>
        <div>
          <VariantLabel>Modal / Danger Confirmation</VariantLabel>
          <WarningButton size={36} onClick={() => setOpen3(true)}>Delete Item</WarningButton>
          <Modal open={open3} onClose={() => setOpen3(false)} title="Delete Permanently?" footer={
            <div style={{ display: "flex", gap: space[2], justifyContent: "flex-end" }}>
              <SecondaryButton size={36} onClick={() => setOpen3(false)}>Cancel</SecondaryButton>
              <WarningButton size={36} onClick={() => setOpen3(false)}>Delete</WarningButton>
            </div>
          }>
            <p style={{ margin: 0 }}>This will permanently delete the item. This action cannot be undone.</p>
          </Modal>
        </div>
        <div>
          <VariantLabel>Modal / Wide (800px)</VariantLabel>
          <SecondaryButton size={36} onClick={() => setOpen4(true)}>Wide Modal</SecondaryButton>
          <Modal open={open4} onClose={() => setOpen4(false)} title="Wide dialog" width={800} footer={<ModalFooter onClose={() => setOpen4(false)} />}>
            <p style={{ margin: 0 }}>Wider modal (800px) for content-heavy forms, tables, or detailed views.</p>
          </Modal>
        </div>
      </div>
    </>
  );
}

// ─── Application sections ─────────────────────────────────────────────────────

function ToolbarSection() {
  const [scanActive, setScanActive] = React.useState<Set<number>>(new Set());
  const [viewActive, setViewActive] = React.useState<Set<number>>(new Set());

  const toggleScan = (i: number) => {
    setScanActive((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const toggleView = (i: number) => {
    setViewActive((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <>
      <SectionHeading
        id="toolbar"
        title="Toolbar"
        description="Horizontal toolbar used on Scan and View pages. Supports collapsed (icons only) and expanded (icons + labels) variants. Buttons toggle active state with color feedback."
      />

      <SubHeading title="Scan Toolbar" />
      <div style={{ display: "flex", flexDirection: "column", gap: space[6], marginBottom: space[8] }}>
        <div>
          <VariantLabel>Collapsed (icons only)</VariantLabel>
          <div style={{ background: color.neutral100, padding: space[4], borderRadius: radius.md, display: "inline-block" }}>
            <HorizontalScanToolbar activeButtons={scanActive} onButtonClick={toggleScan} microAnimations={false} />
          </div>
        </div>
        <div>
          <VariantLabel>Expanded (icons + labels)</VariantLabel>
          <div style={{ background: color.neutral100, padding: space[4], borderRadius: radius.md, display: "inline-block" }}>
            <HorizontalScanToolbar activeButtons={new Set([...scanActive, 3])} onButtonClick={toggleScan} microAnimations={false} />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: space[3] }}>
          <StateCell label="Default" tokens={[{ name: "bg", value: "transparent" }, { name: "icon", value: "neutral600" }]}>
            <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>No interaction</span>
          </StateCell>
          <StateCell label="Hover" tokens={[{ name: "bg", value: "color.neutral100" }, { name: "icon", value: "color.primary" }]}>
            <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>Mouse over button</span>
          </StateCell>
          <StateCell label="Active" tokens={[{ name: "bg: background-highlight-blue" }, { name: "icon", value: "color.primary" }]}>
            <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>Toggled on</span>
          </StateCell>
        </div>
      </div>

      <SubHeading title="View Toolbar" />
      <div style={{ display: "flex", flexDirection: "column", gap: space[6] }}>
        <div>
          <VariantLabel>Collapsed (icons only)</VariantLabel>
          <div style={{ background: color.neutral100, padding: space[4], borderRadius: radius.md, display: "inline-block" }}>
            <HorizontalViewToolbar activeButtons={viewActive} onButtonClick={toggleView} microAnimations={false} />
          </div>
        </div>
        <div>
          <VariantLabel>Expanded (icons + labels)</VariantLabel>
          <div style={{ background: color.neutral100, padding: space[4], borderRadius: radius.md, display: "inline-block" }}>
            <HorizontalViewToolbar activeButtons={new Set([...viewActive, 6])} onButtonClick={toggleView} microAnimations={false} />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: space[3] }}>
          <StateCell label="Default" tokens={[{ name: "bg", value: "transparent" }, { name: "icon", value: "neutral600" }]}>
            <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>No interaction</span>
          </StateCell>
          <StateCell label="Hover" tokens={[{ name: "bg", value: "color.neutral100" }, { name: "icon", value: "color.primary" }]}>
            <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>Mouse over button</span>
          </StateCell>
          <StateCell label="Active" tokens={[{ name: "bg: background-highlight-blue" }, { name: "icon", value: "color.primary" }]}>
            <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>Toggled on</span>
          </StateCell>
        </div>
      </div>
    </>
  );
}

function HeaderSection() {
  const [currentStep, setCurrentStep] = React.useState<'info' | 'scan' | 'view' | 'send'>('scan');

  return (
    <>
      <SectionHeading
        id="header"
        title="Header Navigation"
        description="Top-level header with logo, patient info, wizard step navigation, and utility icons. Wizard steps show complete, current, and incomplete states with arrow-shaped tabs."
      />

      <SubHeading title="Full Header" />
      <div style={{ border: `1px solid ${color.borderDefault}`, borderRadius: radius.md, overflow: "hidden", marginBottom: space[8] }}>
        <div style={{ position: "relative" }}>
          <HeaderNavigation currentStep={currentStep} patientName="Patient: Mina Y." onStepChange={setCurrentStep} />
          {/* Hide the jaw image overlay */}
          <div style={{ position: "absolute", left: 0, top: 72, width: 320, height: 480, background: "transparent", pointerEvents: "all", zIndex: 100 }} />
        </div>
      </div>

      <SubHeading title="Wizard Step States" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: space[3] }}>
        <StateCell
          label="Complete"
          tokens={[{ name: "bg: background-subtle-00" }, { name: "hover: background-subtle-active" }, { name: "text: text-primary" }]}
        >
          <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>Steps before the current step</span>
        </StateCell>
        <StateCell
          label="Current"
          tokens={[{ name: "color.primary", value: color.primary }, { name: "color.primaryHover", value: color.primaryHover }, { name: "color.textOnPrimary" }]}
        >
          <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>Currently active step</span>
        </StateCell>
        <StateCell
          label="Incomplete"
          tokens={[{ name: "bg: background-subtle-01" }, { name: "border: border-accent" }, { name: "hover-bg: background-subtle-00" }]}
        >
          <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>Steps after the current step</span>
        </StateCell>
      </div>

      <div style={{ marginTop: space[6] }}>
        <SubHeading title="Interactive Demo" />
        <VariantLabel>Click the step tabs below to change the active step:</VariantLabel>
        <div style={{ display: "flex", gap: space[2], marginTop: space[2] }}>
          {(["info", "scan", "view", "send"] as const).map((step) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              style={{
                padding: `${space[2]} ${space[4]}`,
                border: `1px solid ${currentStep === step ? color.primary : color.borderDefault}`,
                borderRadius: radius.sm,
                background: currentStep === step ? color.primary : color.bgSurface,
                color: currentStep === step ? "white" : color.textDefault,
                fontFamily: font.family,
                fontSize: font.size.sm,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {step}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function JawSelectorSection() {
  const [view, setView] = React.useState<"upper" | "lower" | "bite">("lower");
  const labels: Record<typeof view, string> = {
    upper: "Upper jaw",
    lower: "Lower jaw",
    bite: "Bite (both jaws)",
  };

  return (
    <>
      <SectionHeading
        id="jaw-selector"
        title="Jaw Selector"
        description="Dental anatomy selector. Click the upper arch, lower arch, or centre bite to choose which jaw is active — the selected arch/bite outline is drawn blue. True-vector artwork. Figma: node 917:12240."
      />

      <SubHeading title="States" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: space[6], marginBottom: space[8] }}>
        {(["upper", "lower", "bite"] as const).map((s) => (
          <div key={s} style={{ display: "flex", flexDirection: "column", gap: space[2], alignItems: "center" }}>
            <VariantLabel>{labels[s]} selected</VariantLabel>
            <div style={{ background: color.neutral100, padding: space[4], borderRadius: radius.md }}>
              <JawSelector value={s} width={150} showSwitcher={false} />
            </div>
          </div>
        ))}
      </div>

      <SubHeading title="Interactive Demo" />
      <VariantLabel>Click the arches or the centre bite to change the selection:</VariantLabel>
      <div style={{ display: "flex", alignItems: "center", gap: space[8], marginTop: space[3] }}>
        <div style={{ background: color.neutral100, padding: space[4], borderRadius: radius.md }}>
          <JawSelector value={view} onChange={setView} width={200} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: space[2] }}>
          <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>Current selection</span>
          <span style={{ fontSize: font.size.xl, fontWeight: font.weight.semibold, color: color.textDefault }}>
            {labels[view]}
          </span>
        </div>
      </div>
    </>
  );
}

function PanelsSection() {
  return (
    <>
      <SectionHeading
        id="panels"
        title="Tool Panels"
        description="Side panels used for tool controls. Each panel has a header with drag handle and close button, plus action buttons using design system PrimaryButton and SecondaryButton."
      />

      <SubHeading title="Prep Review Panel" />
      <div style={{ display: "inline-block", marginBottom: space[8] }}>
        <PrepReviewPanel />
      </div>

      <SubHeading title="Trim Panel" />
      <div style={{ display: "inline-block", marginBottom: space[8] }}>
        <TrimPanel />
      </div>

      <SubHeading title="Margin Line Panel" />
      <div style={{ display: "inline-block", marginBottom: space[8] }}>
        <MarginLinePanel />
      </div>
    </>
  );
}

/** Static button mock used in Templates — renders a visible state without needing real :hover. */
function MockButton({
  state,
  children,
}: {
  state: "default" | "hover" | "pressed" | "disabled";
  children: React.ReactNode;
}) {
  const bgByState: Record<typeof state, string> = {
    default: color.primary,
    hover: color.primaryHover,
    pressed: color.primaryPressed,
    disabled: color.primary,
  };
  return (
    <button
      type="button"
      disabled={state === "disabled"}
      style={{
        padding: `0 ${space[5]}`,
        height: 36,
        borderRadius: radius.md,
        border: state === "hover" ? `2px solid ${color.primary}` : "none",
        background: bgByState[state],
        color: color.textOnPrimary,
        fontFamily: font.family,
        fontSize: font.size.sm,
        fontWeight: font.weight.medium,
        cursor: state === "disabled" ? "not-allowed" : "pointer",
        opacity: state === "disabled" ? 0.5 : 1,
        transform: state === "pressed" ? "scale(0.98)" : "none",
      }}
    >
      {children}
    </button>
  );
}

type TemplateDef = {
  id: string;
  label: string;
  render: (direction: "vertical" | "horizontal") => React.ReactNode;
};

const TEMPLATES: TemplateDef[] = [
  {
    id: "inputs",
    label: "Input States",
    render: (direction) => (
      <TemplateCard title="Input States" direction={direction}>
        <TextInput label="Default" placeholder="Placeholder" />
        <TextInput label="Filled" defaultValue="Typing…" />
        <TextInput label="Disabled" defaultValue="Text" disabled />
        <TextInput label="Error" defaultValue="Typing…" error="Error validation" />
      </TemplateCard>
    ),
  },
  {
    id: "buttons",
    label: "Button States",
    render: (direction) => (
      <TemplateCard title="Button States" direction={direction}>
        <MockButton state="default">Default</MockButton>
        <MockButton state="hover">Hover</MockButton>
        <MockButton state="pressed">Pressed</MockButton>
        <MockButton state="disabled">Disabled</MockButton>
      </TemplateCard>
    ),
  },
  {
    id: "checkboxes",
    label: "Selection Controls",
    render: (direction) => (
      <TemplateCard title="Selection Controls" direction={direction}>
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Indeterminate" checked indeterminate onChange={() => {}} />
        <Checkbox label="Disabled" disabled />
      </TemplateCard>
    ),
  },
  {
    id: "toggles",
    label: "Toggles",
    render: (direction) => (
      <TemplateCard title="Toggles" direction={direction}>
        <Toggle label="Off" />
        <Toggle label="On" defaultChecked />
        <Toggle label="Disabled off" disabled />
        <Toggle label="Disabled on" defaultChecked disabled />
      </TemplateCard>
    ),
  },
  {
    id: "tags",
    label: "Status Tags",
    render: (direction) => (
      <TemplateCard title="Status Tags" direction={direction}>
        <Tag color="blue">Active</Tag>
        <Tag color="green">Completed</Tag>
        <Tag color="orange">Pending</Tag>
        <Tag color="red">Failed</Tag>
        <Tag color="purple">Review</Tag>
        <Tag color="magenta">New</Tag>
      </TemplateCard>
    ),
  },
  {
    id: "icons",
    label: "Icons",
    render: (direction) => {
      const items: { label: string; icon: React.ReactNode }[] = [
        { label: "Mono", icon: <MonochromeIcon isActive={false} /> },
        { label: "Assist", icon: <ScanAssistIcon /> },
        { label: "Prep", icon: <PrepEditIcon /> },
        { label: "Review", icon: <ReviewToolIcon isActive={false} /> },
        { label: "Occlusal", icon: <OcclusalgramIcon isActive={false} /> },
        { label: "Margin", icon: <MarginLineIcon isActive={false} /> },
        { label: "Prep QC", icon: <PrepQcIcon isActive={false} /> },
        { label: "Trim", icon: <TrimIcon isActive={false} /> },
        { label: "Upper", icon: <UpperJawIcon isActive={false} /> },
        { label: "Lower", icon: <LowerJawIcon isActive={false} /> },
        { label: "Both", icon: <BothJawsIcon isActive={false} /> },
      ];
      return (
        <TemplateCard title="Icons" direction={direction}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: space[2],
              alignItems: "center",
              width: "100%",
            }}
          >
            {items.map((it) => (
              <div key={it.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: 52 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40 }}>{it.icon}</div>
                <span style={{ fontSize: font.size["2xs"], color: color.textSubtle, textAlign: "center" }}>{it.label}</span>
              </div>
            ))}
          </div>
        </TemplateCard>
      );
    },
  },
  {
    id: "icon-buttons",
    label: "Icon Button Sizes",
    render: (direction) => {
      const X = (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" /></svg>
      );
      return (
        <TemplateCard title="Icon Button Sizes" direction={direction}>
          <IconButton size="sm" aria-label="Small">{X}</IconButton>
          <IconButton size="md" aria-label="Medium">{X}</IconButton>
          <IconButton size="lg" aria-label="Large">{X}</IconButton>
          <IconButton aria-label="Disabled" disabled>{X}</IconButton>
        </TemplateCard>
      );
    },
  },
  {
    id: "notifications",
    label: "Notifications",
    render: (direction) => (
      <TemplateCard title="Notifications" direction={direction}>
        <Notification type="info" title="Info">An informational message.</Notification>
        <Notification type="success" title="Success">Action completed successfully.</Notification>
        <Notification type="warning" title="Warning">Something needs your attention.</Notification>
        <Notification type="error" title="Error">Something went wrong.</Notification>
      </TemplateCard>
    ),
  },
  {
    id: "progress",
    label: "Progress States",
    render: (direction) => (
      <TemplateCard title="Progress States" direction={direction}>
        <div style={{ minWidth: 180 }}><ProgressBar label="Uploading" value={25} /></div>
        <div style={{ minWidth: 180 }}><ProgressBar label="Processing" value={60} /></div>
        <div style={{ minWidth: 180 }}><ProgressBar label="Complete" value={100} /></div>
        <div style={{ minWidth: 180 }}><ProgressBar label="Failed" value={40} error="Upload failed" /></div>
      </TemplateCard>
    ),
  },
];

function TemplatesSection() {
  const [direction, setDirection] = useState<"vertical" | "horizontal">("horizontal");
  const [selected, setSelected] = useState<Set<string>>(() => new Set(TEMPLATES.slice(0, 4).map((t) => t.id)));

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const visible = TEMPLATES.filter((t) => selected.has(t.id));

  return (
    <>
      <SectionHeading
        id="templates"
        title="Templates"
        description="Pre-composed groupings of design system components. Pick which templates to display and flip between vertical and horizontal layouts to see how each one flows."
      />

      {/* Controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: space[4], marginBottom: space[6], padding: space[4], backgroundColor: color.bgHover, borderRadius: radius.md, border: `1px solid ${color.neutral150}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: space[3] }}>
          <span style={{ fontSize: font.size.sm, fontWeight: font.weight.medium, color: color.textLabel }}>Direction:</span>
          <div style={{ display: "flex", gap: space[2] }}>
            {(["horizontal", "vertical"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDirection(d)}
                style={{
                  padding: `${space[2]} ${space[4]}`,
                  border: `1px solid ${direction === d ? color.primary : color.borderDefault}`,
                  borderRadius: radius.sm,
                  background: direction === d ? color.primary : color.bgSurface,
                  color: direction === d ? color.textOnPrimary : color.textDefault,
                  fontFamily: font.family,
                  fontSize: font.size.sm,
                  fontWeight: font.weight.medium,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: font.size.sm, fontWeight: font.weight.medium, color: color.textLabel, marginBottom: space[2] }}>
            Templates ({selected.size} of {TEMPLATES.length} shown):
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: space[3] }}>
            {TEMPLATES.map((t) => (
              <Checkbox
                key={t.id}
                label={t.label}
                checked={selected.has(t.id)}
                onChange={() => toggle(t.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Template gallery — fixed 4 columns */}
      {visible.length === 0 ? (
        <div style={{ padding: space[8], textAlign: "center", color: color.textSubtle, fontSize: font.size.sm, border: `1px dashed ${color.neutral200}`, borderRadius: radius.lg }}>
          No templates selected. Tick one or more above to show them here.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: space[5] }}>
          {visible.map((t) => (
            <React.Fragment key={t.id}>{t.render(direction)}</React.Fragment>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function DesignSystemPage({ onBack }: DesignSystemPageProps) {
  const mainRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState("colors");
  // Color-section preview mode: scoped to the swatch wrapper only, doesn't affect the rest of the page.
  const [colorPreviewMode, setColorPreviewMode] = useState<"light" | "dark">("light");
  const [railCollapsed, setRailCollapsed] = useState(false);
  // Default: every group expanded. The group that contains the active section also stays open.
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set(NAV.map((g) => g.id)));

  const selectSection = (id: string) => {
    setActiveId(id);
    // Ensure the group containing the new section is expanded.
    const owningGroup = NAV.find((g) => g.items.some((it) => it.id === id));
    if (owningGroup && !expandedGroups.has(owningGroup.id)) {
      setExpandedGroups((prev) => new Set([...prev, owningGroup.id]));
    }
    // scroll main panel back to top when switching sections
    if (mainRef.current) mainRef.current.scrollTop = 0;
  };

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: color.bgPage,
        fontFamily: font.family,
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${space[4]} ${space[8]}`,
          borderBottom: `1px solid ${color.neutral150}`,
          backgroundColor: color.bgSurface,
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: font.size["2xl"],
              fontWeight: font.weight.semibold,
              color: color.textHeading,
              margin: 0,
              letterSpacing: font.tracking.tighter,
            }}
          >
            Design System
          </h1>
          <p
            style={{
              fontSize: font.size.xs,
              color: color.textPlaceholder,
              margin: `${space[1]} 0 0`,
              fontFamily: font.mono,
            }}
          >
            Align DS v2.0 · 27 background / 20 border / 20 text / 20 icon tokens · 21 typography tokens · Roboto + Roboto Mono
          </p>
          <p
            style={{
              fontSize: font.size["2xs"],
              color: color.textPlaceholder,
              margin: `${space[1]} 0 0`,
              maxWidth: 720,
              lineHeight: font.lineHeight.normal,
            }}
          >
            Source of truth: <code style={{ fontFamily: font.mono }}>Deisgn-system 2.0/Design-System 2.0.md</code>. Three tokens (text/border/icon-warning, icon-inverse-secondary in dark) are flagged unresolved in the spec; this page renders the v2.0 doc values for them and the source has matching <code style={{ fontFamily: font.mono }}>// UNRESOLVED</code> markers.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: space[2] }}>
          <ThemeToggleButton />
          {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{
              padding: `${space[2]} ${space[4]}`,
              fontSize: font.size.base,
              fontWeight: font.weight.medium,
              color: color.textLabel,
              backgroundColor: color.bgSurface,
              border: `1px solid ${color.borderDefault}`,
              borderRadius: radius.md,
              cursor: "pointer",
              transition: transition.border,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = color.bgHover; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = color.bgSurface; }}
          >
            ← Back
          </button>
        )}
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Sidebar — dogfooded LeftRail from the design system itself. */}
        <style>{`
          /* Scope LeftRail to the DS page body: don't use viewport height
             (we live inside a flex container), and hide the per-item icons
             since gallery labels carry the meaning on their own. */
          .ds-page-rail { display: flex; flex-shrink: 0; height: 100%; overflow: hidden; }
          .ds-page-rail .left-rail { position: static; height: 100%; overflow-y: auto; }
          .ds-page-rail .nav-sub-item .nav-icon { display: none; }
          .ds-page-rail .nav-sub-item { padding-left: 36px; }
        `}</style>
        <div className="ds-page-rail">
          <LeftRail
            nav={activeId}
            setNav={selectSection}
            collapsed={railCollapsed}
            onToggleCollapsed={() => setRailCollapsed((v) => !v)}
            groups={NAV}
            expandedGroups={expandedGroups}
            onToggleGroup={toggleGroup}
          />
        </div>

        {/* Content — only the active section renders */}
        <main
          ref={mainRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: `${space[8]} ${space[10]}`,
            backgroundColor: activeId === "templates" ? "var(--ads-background-subtle-02)" : undefined,
          }}
        >

          {/* ── Colors ── */}
          {activeId === "colors" && (
            <>
              <SectionHeading
                id="colors"
                title="Colors"
                description="Align DS v2.0 (Deisgn-system 2.0/Design-System 2.0.md). Tokens resolve through CSS custom properties so light/dark modes are handled automatically. Use the toggle to preview dark mode on these swatches without flipping the rest of the page."
              />
              <div style={{ display: "flex", alignItems: "center", gap: space[3], marginBottom: space[6] }}>
                <code style={{ fontFamily: font.mono, fontSize: font.size.xs, color: color.textLabel }}>
                  Preview mode:
                </code>
                <SecondaryButton size={36} onClick={() => setColorPreviewMode(colorPreviewMode === "dark" ? "light" : "dark")}>
                  {colorPreviewMode === "dark" ? "Switch to Light" : "Switch to Dark"}
                </SecondaryButton>
                <span style={{ fontSize: font.size["2xs"], color: color.textPlaceholder }}>
                  Currently showing: <b>{colorPreviewMode}</b>
                </span>
              </div>

              <div data-theme={colorPreviewMode === "dark" ? "align-dark" : "align-light"} style={{ background: "var(--ads-background-subtle-00)", padding: space[4], borderRadius: radius.md, border: `1px solid var(--ads-border-subtle)` }}>
                {/* Background tokens — 27 v2.0 */}
                <ColorGroup title="Background" items={[
                  { token: "background-subtle-00",     value: "var(--ads-background-subtle-00)",     usage: "Page / canvas" },
                  { token: "background-subtle-01",     value: "var(--ads-background-subtle-01)",     usage: "Card / toolbar / header surface" },
                  { token: "background-subtle-02",     value: "var(--ads-background-subtle-02)",     usage: "Raised surface, hover fill" },
                  { token: "background-accent",        value: "var(--ads-background-accent)",        usage: "Accent surface" },
                  { token: "background-menu",          value: "var(--ads-background-menu)",          usage: "Elevated (dropdown, popover)" },
                  { token: "background-overlay",       value: "var(--ads-background-overlay)",       usage: "Modal scrim (#000 @ 63%)" },
                  { token: "background-on-color",      value: "var(--ads-background-on-color)",      usage: "Surface on filled bg" },
                  { token: "background-inverse",       value: "var(--ads-background-inverse)",       usage: "Inverse surface (tooltip)" },
                  { token: "background-interactive",   value: "var(--ads-background-interactive)",   usage: "Brand fill (primary CTA)" },
                  { token: "background-destructive",   value: "var(--ads-background-destructive)",   usage: "Destructive CTA" },
                  { token: "background-subtle-hover",  value: "var(--ads-background-subtle-hover)",  usage: "Subtle hover" },
                  { token: "background-subtle-active", value: "var(--ads-background-subtle-active)", usage: "Subtle pressed" },
                  { token: "background-success",       value: "var(--ads-background-success)",       usage: "Success fill (extended)" },
                ]} />

                <ColorGroup title="Highlight Palette — Backgrounds" items={[
                  { token: "background-highlight-red",     value: "var(--ads-background-highlight-red)" },
                  { token: "background-highlight-magenta", value: "var(--ads-background-highlight-magenta)" },
                  { token: "background-highlight-purple",  value: "var(--ads-background-highlight-purple)" },
                  { token: "background-highlight-blue",    value: "var(--ads-background-highlight-blue)" },
                  { token: "background-highlight-green",   value: "var(--ads-background-highlight-green)" },
                  { token: "background-highlight-orange",  value: "var(--ads-background-highlight-orange)" },
                  { token: "background-highlight-gray",    value: "var(--ads-background-highlight-gray)" },
                ]} />

                {/* Text tokens — 20 v2.0 */}
                <ColorGroup title="Text" items={[
                  { token: "text-primary",        value: "var(--ads-text-primary)",        usage: "Body copy, headings (93% / 100%)" },
                  { token: "text-secondary",      value: "var(--ads-text-secondary)",      usage: "Descriptions (63%)" },
                  { token: "text-tertiary",      value: "var(--ads-text-tertiary)",       usage: "Hints, captions (44% / 47%)" },
                  { token: "text-link",           value: "var(--ads-text-link)",           usage: "Links (#009ACE / #41C1F0)" },
                  { token: "text-link-hovered",   value: "var(--ads-text-link-hovered)",   usage: "Link hover" },
                  { token: "text-error",          value: "var(--ads-text-error)",          usage: "Error message" },
                  { token: "text-warning",        value: "var(--ads-text-warning)",        usage: "Warning ⚠ unresolved in source" },
                  { token: "text-success",        value: "var(--ads-text-success)",        usage: "Success message" },
                  { token: "text-disabled",       value: "var(--ads-text-disabled)",       usage: "Disabled labels" },
                ]} />
                <ColorGroup title="Text — On color / inverse" items={[
                  { token: "text-on-color-primary",   value: "var(--ads-text-on-color-primary)",   usage: "Label on filled CTA" },
                  { token: "text-on-color-secondary", value: "var(--ads-text-on-color-secondary)" },
                  { token: "text-on-color-tertiary",  value: "var(--ads-text-on-color-tertiary)" },
                  { token: "text-inverse-primary",    value: "var(--ads-text-inverse-primary)",    usage: "Tooltip, inverse surface" },
                  { token: "text-inverse-secondary",  value: "var(--ads-text-inverse-secondary)" },
                  { token: "text-inverse-tertiary",   value: "var(--ads-text-inverse-tertiary)" },
                ]} />
                <ColorGroup title="Text — On highlight" items={[
                  { token: "text-on-highlight-red",     value: "var(--ads-text-on-highlight-red)" },
                  { token: "text-on-highlight-magenta", value: "var(--ads-text-on-highlight-magenta)" },
                  { token: "text-on-highlight-purple",  value: "var(--ads-text-on-highlight-purple)" },
                  { token: "text-on-highlight-blue",    value: "var(--ads-text-on-highlight-blue)" },
                  { token: "text-on-highlight-green",   value: "var(--ads-text-on-highlight-green)" },
                  { token: "text-on-highlight-orange",  value: "var(--ads-text-on-highlight-orange)" },
                ]} />

                {/* Border tokens — 20 v2.0 */}
                <ColorGroup title="Border" items={[
                  { token: "border-subtle",       value: "var(--ads-border-subtle)",       usage: "Default dividers (9%)" },
                  { token: "border-accent",       value: "var(--ads-border-accent)",       usage: "Secondary button border (23%)" },
                  { token: "border-strong",       value: "var(--ads-border-strong)",       usage: "Prominent border (#121212)" },
                  { token: "border-interactive",  value: "var(--ads-border-interactive)",  usage: "Brand outline" },
                  { token: "border-focus",        value: "var(--ads-border-focus)",        usage: "Keyboard focus ring" },
                  { token: "border-error",        value: "var(--ads-border-error)" },
                  { token: "border-warning",      value: "var(--ads-border-warning)", usage: "⚠ unresolved in source" },
                  { token: "border-success",      value: "var(--ads-border-success)" },
                  { token: "border-disabled",     value: "var(--ads-border-disabled)" },
                  { token: "border-subtle-hover", value: "var(--ads-border-subtle-hover)" },
                  { token: "border-accent-hover", value: "var(--ads-border-accent-hover)" },
                  { token: "border-accent-active",value: "var(--ads-border-accent-active)" },
                ]} />
                <ColorGroup title="Highlight Palette — Borders" items={[
                  { token: "border-highlight-red",     value: "var(--ads-border-highlight-red)" },
                  { token: "border-highlight-magenta", value: "var(--ads-border-highlight-magenta)" },
                  { token: "border-highlight-purple",  value: "var(--ads-border-highlight-purple)" },
                  { token: "border-highlight-blue",    value: "var(--ads-border-highlight-blue)" },
                  { token: "border-highlight-green",   value: "var(--ads-border-highlight-green)" },
                  { token: "border-highlight-orange",  value: "var(--ads-border-highlight-orange)" },
                ]} />

                {/* Icon tokens — 20 v2.0 */}
                <ColorGroup title="Icon" items={[
                  { token: "icon-primary",       value: "var(--ads-icon-primary)" },
                  { token: "icon-secondary",     value: "var(--ads-icon-secondary)" },
                  { token: "icon-tertiary",      value: "var(--ads-icon-tertiary)" },
                  { token: "icon-link",          value: "var(--ads-icon-link)" },
                  { token: "icon-link-hovered",  value: "var(--ads-icon-link-hovered)" },
                  { token: "icon-error",         value: "var(--ads-icon-error)" },
                  { token: "icon-warning",       value: "var(--ads-icon-warning)", usage: "⚠ unresolved in source" },
                  { token: "icon-success",       value: "var(--ads-icon-success)" },
                  { token: "icon-disabled",      value: "var(--ads-icon-disabled)" },
                ]} />

                <div style={{ marginBottom: space[8] }}>
                  <SubHeading title="Tag Colors (highlight pairs)" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: space[3] }}>
                    {(["Red", "Orange", "Magenta", "Purple", "Blue", "Green"] as const).map((name) => {
                      const key = `tag${name}` as keyof typeof color;
                      const c = color[key] as { bg: string; border: string; text: string };
                      return (
                        <div key={name} style={{ borderRadius: radius.md, overflow: "hidden", border: `1px solid var(--ads-border-subtle)`, background: "var(--ads-background-subtle-01)" }}>
                          <div style={{ display: "flex", height: 36 }}>
                            <div style={{ flex: 1, backgroundColor: c.bg }} title="bg" />
                            <div style={{ flex: 1, backgroundColor: c.border }} title="border" />
                            <div style={{ flex: 1, backgroundColor: c.text }} title="text" />
                          </div>
                          <div style={{ padding: `${space[2]} ${space[3]}` }}>
                            <code style={{ display: "block", fontFamily: font.mono, fontSize: font.size["2xs"], color: "var(--ads-text-secondary)", fontWeight: font.weight.medium }}>
                              {name.toLowerCase()} (= background-highlight-{name.toLowerCase()})
                            </code>
                            <div style={{ display: "flex", gap: space[2], marginTop: 4 }}>
                              <Tag color={name.toLowerCase() as any} size="small">{name}</Tag>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Typography ── */}
          {activeId === "typography" && (
            <>
              <SectionHeading
                id="typography"
                title="Typography"
                description="Align DS v2.0 type ramp — 21 tokens. Roboto 500 for headings & display-medium, 400 for body / label / link, 300 for display-regular 02–05, Roboto Mono 400 for code. Links underlined by default."
              />

              <GroupLabel>Heading — Roboto 500 Medium</GroupLabel>
              <TypeRow label="$tp-heading-01" sample="Heading 01 — 14 / 20"  size="14px" weight="500" lineHeight="20px" tokenNote="v2.typography.heading01" />
              <TypeRow label="$tp-heading-02" sample="Heading 02 — 17 / 24"  size="17px" weight="500" lineHeight="24px" tokenNote="v2.typography.heading02" />
              <TypeRow label="$tp-heading-03" sample="Heading 03 — 20 / 28"  size="20px" weight="500" lineHeight="28px" tokenNote="v2.typography.heading03" />
              <TypeRow label="$tp-heading-04" sample="Heading 04 — 24 / 32"  size="24px" weight="500" lineHeight="32px" tokenNote="v2.typography.heading04" />
              <TypeRow label="$tp-heading-05" sample="Heading 05 — 28 / 36"  size="28px" weight="500" lineHeight="36px" tokenNote="v2.typography.heading05" />

              <GroupLabel>Body — Roboto 400 Regular</GroupLabel>
              <TypeRow label="$tp-body-01" sample="Body 01 — default body copy at 14 / 20." size="14px" weight="400" lineHeight="20px" tokenNote="v2.typography.body01" />
              <TypeRow label="$tp-body-02" sample="Body 02 — larger paragraph at 17 / 24."  size="17px" weight="400" lineHeight="24px" tokenNote="v2.typography.body02" />

              <GroupLabel>Label — Roboto 400 Regular</GroupLabel>
              <TypeRow label="$tp-label-01" sample="Label 01 — form labels, captions"  size="12px" weight="400" lineHeight="16px" tokenNote="v2.typography.label01" />

              <GroupLabel>Link — Roboto 400, text-decoration: underline</GroupLabel>
              <TypeRow label="$tp-link-01" sample="Link 01 — 12 / 16"  size="12px" weight="400" lineHeight="16px" tokenNote="v2.typography.link01 (underlined)" />
              <TypeRow label="$tp-link-02" sample="Link 02 — 14 / 20"  size="14px" weight="400" lineHeight="20px" tokenNote="v2.typography.link02 (underlined)" />
              <TypeRow label="$tp-link-03" sample="Link 03 — 17 / 24"  size="17px" weight="400" lineHeight="24px" tokenNote="v2.typography.link03 (underlined)" />

              <GroupLabel>Code — Roboto Mono 400</GroupLabel>
              <TypeRow label="$tp-code-01" sample="const code = '12/16'"  size="12px" weight="400" lineHeight="16px" tokenNote="v2.typography.code01 (mono)" />
              <TypeRow label="$tp-code-02" sample="const code = '14/20'"  size="14px" weight="400" lineHeight="20px" tokenNote="v2.typography.code02 (mono)" />

              <GroupLabel>Display Regular — Roboto (400 for -01; 300 Light for -02..05)</GroupLabel>
              <TypeRow label="$tp-display-regular-01" sample="Display 01"  size="36px" weight="400" lineHeight="44px" tokenNote="v2.typography.displayRegular01 (Roboto 400)" />
              <TypeRow label="$tp-display-regular-02" sample="Display 02"  size="44px" weight="300" lineHeight="52px" tokenNote="v2.typography.displayRegular02 (Roboto 300 Light)" />
              <TypeRow label="$tp-display-regular-03" sample="Display 03"  size="52px" weight="300" lineHeight="60px" tokenNote="v2.typography.displayRegular03 (Roboto 300 Light)" />
              <TypeRow label="$tp-display-regular-04" sample="Display 04"  size="72px" weight="300" lineHeight="96px" tokenNote="v2.typography.displayRegular04 (Roboto 300 Light)" />
              <TypeRow label="$tp-display-regular-05" sample="Display 05"  size="96px" weight="300" lineHeight="116px" tokenNote="v2.typography.displayRegular05 (Roboto 300 Light)" />

              <GroupLabel>Display Medium — Roboto 500</GroupLabel>
              <TypeRow label="$tp-display-medium-01" sample="Display Medium 01"  size="36px" weight="500" lineHeight="44px" tokenNote="v2.typography.displayMedium01" />
              <TypeRow label="$tp-display-medium-02" sample="Display Medium 02"  size="44px" weight="500" lineHeight="52px" tokenNote="v2.typography.displayMedium02" />
              <TypeRow label="$tp-display-medium-03" sample="Display Medium 03"  size="52px" weight="500" lineHeight="60px" tokenNote="v2.typography.displayMedium03" />
              <TypeRow label="$tp-display-medium-04" sample="Display Medium 04"  size="72px" weight="500" lineHeight="96px" tokenNote="v2.typography.displayMedium04" />
              <TypeRow label="$tp-display-medium-05" sample="Display Medium 05"  size="96px" weight="500" lineHeight="116px" tokenNote="v2.typography.displayMedium05" />
            </>
          )}

          {/* ── Spacing ── */}
          {activeId === "spacing" && (
            <>
              <SectionHeading id="spacing" title="Spacing" description="4 px-based scale. Use the space token for all margins, padding, and gaps." />
              <SpacingRow token="1"  value="4px"  usage="Icon gap, tight padding" />
              <SpacingRow token="2"  value="8px"  usage="Button icon gap, inline spacing" />
              <SpacingRow token="3"  value="12px" usage="Small button padding" />
              <SpacingRow token="4"  value="16px" usage="Button padding, form spacing" />
              <SpacingRow token="5"  value="20px" usage="Component gap" />
              <SpacingRow token="6"  value="24px" usage="Large button padding, card padding" />
              <SpacingRow token="8"  value="32px" usage="Section padding" />
              <SpacingRow token="10" value="40px" usage="Page header padding" />
              <SpacingRow token="12" value="48px" usage="Section margin" />
              <SpacingRow token="16" value="64px" usage="Large section gap" />
            </>
          )}

          {/* ── Border Radius ── */}
          {activeId === "radii" && (
            <>
              <SectionHeading id="radii" title="Border Radius" description="Use the radius token for all border-radius values." />
              <div style={{ display: "flex", flexWrap: "wrap", gap: space[8], alignItems: "flex-end" }}>
                <RadiusSwatch token="none" value={radius.none} usage="No radius" />
                <RadiusSwatch token="sm"   value={radius.sm}   usage="Buttons, inputs, badges" />
                <RadiusSwatch token="md"   value={radius.md}   usage="Cards, modals, dropdowns" />
                <RadiusSwatch token="lg"   value={radius.lg}   usage="Panels, large cards" />
                <RadiusSwatch token="xl"   value={radius.xl}   usage="Overlays" />
                <RadiusSwatch token="full" value="24px"        usage="radius.full → pills, avatars" />
              </div>
            </>
          )}

          {/* ── Shadows ── */}
          {activeId === "shadows" && (
            <>
              <SectionHeading id="shadows" title="Shadows" description="Focus rings use color-matched 3 px rings. Elevation shadows communicate depth." />
              <div style={{ marginBottom: space[6] }}>
                <SubHeading title="Focus rings" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: space[8] }}>
                  <ShadowSwatch token="focusPrimary"      value={shadow.focusPrimary}      usage="Primary / checkbox / radio focus" />
                  <ShadowSwatch token="focusPrimaryLight" value={shadow.focusPrimaryLight} usage="Secondary button focus" />
                  <ShadowSwatch token="focusDanger"       value={shadow.focusDanger}       usage="Warning / danger button focus" />
                </div>
              </div>
              <div>
                <SubHeading title="Elevation" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: space[8] }}>
                  <ShadowSwatch token="sm" value={shadow.sm} usage="Subtle lift" />
                  <ShadowSwatch token="md" value={shadow.md} usage="Cards, dropdowns" />
                  <ShadowSwatch token="lg" value={shadow.lg} usage="Modals, popovers" />
                </div>
              </div>
            </>
          )}

          {/* ── Button ── */}
          {activeId === "button" && (
            <>
              <SectionHeading id="button" title="Button" description="Five types: Primary · Secondary · Ghost · Link · Danger. Three sizes: 36 · 44 · 60 px. Figma: node 5:6473." />
              <ButtonSection />
            </>
          )}

          {/* ── Icon Button ── */}
          {activeId === "icon-button" && (
            <>
              <SectionHeading id="icon-button" title="Icon Button" description="Square icon-only button for actions like close, delete, settings. Three sizes: sm (32) · md (36) · lg (40). Always provide aria-label." />
              <div style={{ marginBottom: space[8] }}>
                <SubHeading title="Icon Button / Sizes" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: space[6], alignItems: "flex-end" }}>
                  {(["sm", "md", "lg"] as const).map((sz) => (
                    <div key={sz} style={{ display: "flex", flexDirection: "column", gap: space[2], alignItems: "center" }}>
                      <IconButton size={sz} aria-label="Close">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" /></svg>
                      </IconButton>
                      <TokenBadge name={`size="${sz}"`} value={sz === "md" ? "default" : undefined} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: space[8] }}>
                <SubHeading title="Icon Button / States" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: space[3] }}>
                  <StateCell label="Default" hint="Transparent bg" tokens={[{ name: "bg: transparent" }]}>
                    <IconButton aria-label="Close"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" /></svg></IconButton>
                  </StateCell>
                  <StateCell label="Hover" hint="Mouse over" tokens={[{ name: "color.neutral100" }]}>
                    <IconButton aria-label="Close"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" /></svg></IconButton>
                  </StateCell>
                  <StateCell label="Pressed" hint="Click & hold" tokens={[{ name: "color.bgActive" }, { name: "scale(0.94)" }]}>
                    <IconButton aria-label="Close"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" /></svg></IconButton>
                  </StateCell>
                  <StateCell label="Disabled" tokens={[{ name: "opacity: 0.5" }]}>
                    <IconButton aria-label="Close" disabled><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" /></svg></IconButton>
                  </StateCell>
                </div>
              </div>
              <div>
                <SubHeading title="Icon Button / Example Icons" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: space[3] }}>
                  <IconButton aria-label="Close"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" /></svg></IconButton>
                  <IconButton aria-label="Delete"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg></IconButton>
                  <IconButton aria-label="Settings"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg></IconButton>
                  <IconButton aria-label="More"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg></IconButton>
                  <IconButton aria-label="Chevron"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 5l4 4 4-4" /></svg></IconButton>
                </div>
              </div>
            </>
          )}

          {/* ── Toggle ── */}
          {activeId === "toggle" && (
            <>
              <SectionHeading id="toggle" title="Toggle" description="On/off switch. Track 44×28 px, fully rounded. Primary blue when selected. Figma: node 5:381." />
              <div style={{ marginBottom: space[8] }}>
                <SubHeading title="Toggle / States" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: space[3] }}>
                  <StateCell label="Toggle / Unselected / Default" tokens={[{ name: "bg: track-off (--ds-toggle-off-bg)" }]}><Toggle /></StateCell>
                  <StateCell label="Toggle / Selected / Default" tokens={[{ name: "color.primary" }]}><Toggle defaultChecked /></StateCell>
                  <StateCell label="Toggle / Unselected / Hover" hint="Hover to see" tokens={[{ name: "bg: track-off hover (--ds-toggle-off-hover)" }]}><Toggle /></StateCell>
                  <StateCell label="Toggle / Selected / Hover" hint="Hover to see" tokens={[{ name: "bg: background-interactive-hover" }]}><Toggle defaultChecked /></StateCell>
                  <StateCell label="Toggle / Unselected / Pressed" hint="Click & hold" tokens={[{ name: "bg: track-off active (--ds-toggle-off-active)" }]}><Toggle /></StateCell>
                  <StateCell label="Toggle / Selected / Pressed" hint="Click & hold" tokens={[{ name: "bg: background-interactive-active" }]}><Toggle defaultChecked /></StateCell>
                  <StateCell label="Toggle / Unselected / Focused" hint="Tab to focus" tokens={[{ name: "border: color.primary" }]}><Toggle /></StateCell>
                  <StateCell label="Toggle / Selected / Focused" hint="Tab to focus" tokens={[{ name: "border: color.primary" }]}><Toggle defaultChecked /></StateCell>
                  <StateCell label="Toggle / Unselected / Disabled" tokens={[{ name: "opacity 0.38" }]}><Toggle disabled /></StateCell>
                  <StateCell label="Toggle / Selected / Disabled" tokens={[{ name: "opacity 0.38" }]}><Toggle disabled defaultChecked /></StateCell>
                </div>
              </div>
              <div>
                <SubHeading title="Toggle / Label position" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: space[5] }}>
                  <Toggle label="Label right (default)" defaultChecked />
                  <Toggle label="Label left" labelPosition="left" defaultChecked />
                </div>
              </div>
            </>
          )}

          {/* ── Checkbox ── */}
          {activeId === "checkbox" && (
            <>
              <SectionHeading id="checkbox" title="Checkbox" description="Multi-select control. Supports indeterminate for partial selection (e.g. Select All). Figma: node 5:6238." />
              <div style={{ marginBottom: space[8] }}>
                <SubHeading title="Checkbox / Sizes" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: space[6], alignItems: "flex-end" }}>
                  {([16, 20, 24] as const).map((sz) => (
                    <div key={sz} style={{ display: "flex", flexDirection: "column", gap: space[2] }}>
                      <Checkbox size={sz} label={`${sz} px`} defaultChecked />
                      <TokenBadge name={`size={${sz}}`} value={sz === 20 ? "default" : undefined} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <SubHeading title="Checkbox / States" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: space[3] }}>
                  <StateCell label="Checkbox / Unchecked" tokens={[{ name: "color.borderStrong" }]}><Checkbox size={20} label="Option A" /></StateCell>
                  <StateCell label="Checkbox / Checked" tokens={[{ name: "color.primary" }]}><Checkbox size={20} checked label="Option A" onChange={() => {}} /></StateCell>
                  <StateCell label="Checkbox / Indeterminate" tokens={[{ name: "color.primary" }]}><Checkbox size={20} checked indeterminate label="Select all" onChange={() => {}} /></StateCell>
                  <StateCell label="Checkbox / Unchecked / Hover" hint="Hover to see" tokens={[{ name: "color.borderHover" }, { name: "color.bgHover" }]}><Checkbox size={20} label="Option A" /></StateCell>
                  <StateCell label="Checkbox / Checked / Hover" hint="Hover to see" tokens={[{ name: "color.primaryHover" }]}><Checkbox size={20} checked label="Option A" onChange={() => {}} /></StateCell>
                  <StateCell label="Checkbox / Focused" hint="Tab to focus" tokens={[{ name: "border: color.primary" }]}><Checkbox size={20} label="Option A" /></StateCell>
                  <StateCell label="Checkbox / Checked / Focused" hint="Tab to focus" tokens={[{ name: "border: color.primary" }]}><Checkbox size={20} checked label="Option A" onChange={() => {}} /></StateCell>
                  <StateCell label="Checkbox / Disabled" tokens={[{ name: "opacity: 0.5" }]}><Checkbox size={20} disabled label="Option A" /></StateCell>
                  <StateCell label="Checkbox / Checked / Disabled" tokens={[{ name: "opacity: 0.5" }]}><Checkbox size={20} checked disabled label="Option A" onChange={() => {}} /></StateCell>
                </div>
              </div>
            </>
          )}

          {/* ── Radio ── */}
          {activeId === "radio" && (
            <>
              <SectionHeading id="radio" title="Radio" description="Single-select within a group. Always wrap RadioItem inside RadioGroup. Figma: node 5:2379." />
              <div style={{ marginBottom: space[8] }}>
                <SubHeading title="Radio / Sizes" />
                <RadioGroup name="radio-sizes" defaultValue="20">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: space[6], alignItems: "flex-end" }}>
                    {([16, 20, 24] as const).map((sz) => (
                      <div key={sz} style={{ display: "flex", flexDirection: "column", gap: space[2] }}>
                        <RadioItem value={String(sz)} size={sz} label={`${sz} px`} />
                        <TokenBadge name={`size={${sz}}`} value={sz === 20 ? "default" : undefined} />
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              <div>
                <SubHeading title="Radio / States" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: space[3] }}>
                  <StateCell label="Radio / Unselected" tokens={[{ name: "color.borderStrong" }]}>
                    <RadioGroup name="radio-s1"><RadioItem value="a" size={20} label="Option A" /><RadioItem value="b" size={20} label="Option B" /></RadioGroup>
                  </StateCell>
                  <StateCell label="Radio / Selected" tokens={[{ name: "color.primary" }]}>
                    <RadioGroup name="radio-s2" defaultValue="b"><RadioItem value="a" size={20} label="Option A" /><RadioItem value="b" size={20} label="Option B" /></RadioGroup>
                  </StateCell>
                  <StateCell label="Radio / Hover" hint="Hover to see" tokens={[{ name: "color.borderHover" }, { name: "color.bgHover" }]}>
                    <RadioGroup name="radio-s4"><RadioItem value="a" size={20} label="Option A" /><RadioItem value="b" size={20} label="Option B" /></RadioGroup>
                  </StateCell>
                  <StateCell label="Radio / Selected / Hover" hint="Hover to see" tokens={[{ name: "color.primaryHover" }]}>
                    <RadioGroup name="radio-s5" defaultValue="a"><RadioItem value="a" size={20} label="Option A" /><RadioItem value="b" size={20} label="Option B" /></RadioGroup>
                  </StateCell>
                  <StateCell label="Radio / Focused" hint="Tab to focus" tokens={[{ name: "border: color.primary" }]}>
                    <RadioGroup name="radio-s6"><RadioItem value="a" size={20} label="Option A" /><RadioItem value="b" size={20} label="Option B" /></RadioGroup>
                  </StateCell>
                  <StateCell label="Radio / Disabled" tokens={[{ name: "opacity: 0.5" }]}>
                    <RadioGroup name="radio-s3" defaultValue="a"><RadioItem value="a" size={20} label="Option A" /><RadioItem value="b" size={20} label="Option B" disabled /></RadioGroup>
                  </StateCell>
                  <StateCell label="Radio / Selected / Disabled" tokens={[{ name: "opacity: 0.5" }]}>
                    <RadioGroup name="radio-s7" defaultValue="a"><RadioItem value="a" size={20} label="Option A" disabled /><RadioItem value="b" size={20} label="Option B" disabled /></RadioGroup>
                  </StateCell>
                </div>
              </div>
            </>
          )}

          {/* ── Text Input ── */}
          {activeId === "text-input" && (
            <>
              <SectionHeading id="text-input" title="Text Input" description='Single-line input with label, helper, and error. v2.0 default: white surface (background-subtle-01) + 1px subtle border. Legacy "grey" layer set still available via layerSet="grey" for fields on white cards. Figma: node 5:494.' />
              <div style={{ marginBottom: space[8] }}>
                <SubHeading title="Text Input / Layer Sets" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: space[5] }}>
                  <div><VariantLabel>{`Input / Default — White field (v2.0)`}</VariantLabel><TextInput label="Label" placeholder="Placeholder text" /></div>
                  <div><VariantLabel>{`Input / layerSet="grey" — Legacy fill`}</VariantLabel><TextInput label="Label" placeholder="Placeholder text" layerSet="grey" /></div>
                </div>
              </div>
              <div>
                <SubHeading title="Text Input / States" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: space[5] }}>
                  <div><VariantLabel>Input / Default</VariantLabel><TextInput label="Label" placeholder="Placeholder text" /></div>
                  <div><VariantLabel>Input / Focused</VariantLabel><TextInput label="Label" placeholder="Click to focus" helper="Primary border + focus ring" /></div>
                  <div><VariantLabel>Input / Filled</VariantLabel><TextInput label="Label" defaultValue="Entered value" /></div>
                  <div><VariantLabel>Input / Required</VariantLabel><TextInput label="Label" placeholder="Placeholder text" required /></div>
                  <div><VariantLabel>Input / With Helper</VariantLabel><TextInput label="Label" placeholder="Placeholder text" helper="Optional helper text" /></div>
                  <div><VariantLabel>Input / Error</VariantLabel><TextInput label="Label" defaultValue="Invalid value" error="This field is required" /></div>
                  <div><VariantLabel>Input / Error / Focused</VariantLabel><TextInput label="Label" defaultValue="Invalid value" error="Click to see danger ring" /></div>
                  <div><VariantLabel>Input / Disabled</VariantLabel><TextInput label="Label" defaultValue="Locked value" disabled /></div>
                  <div><VariantLabel>Input / Password</VariantLabel><TextInput type="password" label="Password" placeholder="••••••••" /></div>
                </div>
              </div>
            </>
          )}

          {/* ── Text Area ── */}
          {activeId === "text-area" && (
            <>
              <SectionHeading id="text-area" title="Text Area" description="Multi-line input. Supports character counter and all input states. Figma: node 5:494 (03 Text area)." />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: space[5] }}>
                <div><VariantLabel>Text Area / Default</VariantLabel><TextArea label="Label" placeholder="Enter text…" /></div>
                <div><VariantLabel>Text Area / Focused</VariantLabel><TextArea label="Label" placeholder="Click to focus" helper="Primary border + focus ring" /></div>
                <div><VariantLabel>Text Area / Filled</VariantLabel><TextArea label="Label" defaultValue="Some entered text content here." /></div>
                <div><VariantLabel>Text Area / With Counter</VariantLabel><TextArea label="Label" placeholder="Enter text…" maxLength={100} helper="Max 100 characters" /></div>
                <div><VariantLabel>Text Area / Error</VariantLabel><TextArea label="Label" defaultValue="x" error="Content is required" /></div>
                <div><VariantLabel>Text Area / Disabled</VariantLabel><TextArea label="Label" defaultValue="Read-only content" disabled /></div>
              </div>
            </>
          )}

          {/* ── Select ── */}
          {activeId === "select" && (
            <>
              <SectionHeading id="select" title="Select" description="Native dropdown styled with custom chevron. Matches text input field styling. Figma: node 5:4011." />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: space[5] }}>
                <div><VariantLabel>Select / Default</VariantLabel><Select label="Label" placeholder="Choose an option" options={[{ value: "a", label: "Option A" }, { value: "b", label: "Option B" }, { value: "c", label: "Option C" }]} /></div>
                <div><VariantLabel>Select / Focused</VariantLabel><Select label="Label" placeholder="Click to focus" helper="Primary border + focus ring" options={[{ value: "a", label: "Option A" }, { value: "b", label: "Option B" }]} /></div>
                <div><VariantLabel>Select / Filled</VariantLabel><Select label="Label" defaultValue="a" options={[{ value: "a", label: "Option A" }, { value: "b", label: "Option B" }]} /></div>
                <div><VariantLabel>Select / With Helper</VariantLabel><Select label="Label" helper="Select one from the list" placeholder="Choose an option" options={[{ value: "a", label: "Option A" }, { value: "b", label: "Option B" }]} /></div>
                <div><VariantLabel>Select / Error</VariantLabel><Select label="Label" error="Please select an option" placeholder="Choose an option" options={[{ value: "a", label: "Option A" }, { value: "b", label: "Option B" }]} /></div>
                <div><VariantLabel>Select / Grey layer set</VariantLabel><Select label="Label" layerSet="grey" placeholder="Grey field" options={[{ value: "a", label: "Option A" }, { value: "b", label: "Option B" }]} /></div>
                <div><VariantLabel>Select / Disabled</VariantLabel><Select label="Label" disabled placeholder="Unavailable" options={[{ value: "a", label: "Option A" }]} /></div>
              </div>
            </>
          )}

          {/* ── Tabs ── */}
          {activeId === "tabs" && (
            <>
              <SectionHeading id="tabs" title="Tabs" description="Bottom border indicator, 44 px height, 12/16 px padding. Primary blue when selected, medium weight. Figma: node 5:1079." />
              <div style={{ marginBottom: space[8] }}>
                <SubHeading title="Tabs / Interactive demo" />
                <TabsDemo />
              </div>
              <div>
                <SubHeading title="Tabs / Item States" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: space[3] }}>
                  <StateCell label="Tab / Default" tokens={[{ name: "border: transparent" }]}><Tabs items={[{ id: "a", label: "Tab" }]} defaultActiveId="" /></StateCell>
                  <StateCell label="Tab / Selected" tokens={[{ name: "color.primary border" }, { name: "weight.medium" }]}><Tabs items={[{ id: "a", label: "Tab" }]} defaultActiveId="a" /></StateCell>
                  <StateCell label="Tab / Hover" hint="Hover to see" tokens={[{ name: "color.borderHover" }]}><Tabs items={[{ id: "a", label: "Tab" }]} defaultActiveId="" /></StateCell>
                  <StateCell label="Tab / Focused" hint="Tab to focus" tokens={[{ name: "border: color.primary" }]}><Tabs items={[{ id: "a", label: "Tab" }]} defaultActiveId="" /></StateCell>
                  <StateCell label="Tab / Disabled" tokens={[{ name: "opacity: 0.5" }]}><Tabs items={[{ id: "a", label: "Tab", disabled: true }]} defaultActiveId="" /></StateCell>
                </div>
              </div>
            </>
          )}

          {/* ── Card ── */}
          {activeId === "card" && (
            <>
              <SectionHeading
                id="card"
                title="Card"
                description="Unified card model — border-only treatment. Mirrors the .btn-secondary state ladder: transparent fill, the border carries every state. Static cards have no hover. Interactive cards darken their border on hover; selected interactive cards swap to a 2px border-interactive (no fill). Radius: --ads-radius-md (8px)."
              />

              <div style={{ marginBottom: space[8] }}>
                <SubHeading title="Static card — display only (PatientCard, Config panels, ToothSpecCard)" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: space[3] }}>
                  <DemoCard kind="static" />
                </div>
              </div>

              <div style={{ marginBottom: space[8] }}>
                <SubHeading title="Interactive card — clickable (ProcedureCard, list rows)" />
                <p style={{ fontSize: font.size.xs, color: color.textPlaceholder, margin: `0 0 ${space[3]} 0` }}>
                  Hover the rest card → border darkens (border-subtle-hover, 13% black). No background
                  fill on hover, no shadow, no transform. Click → switches to the selected state.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: space[3] }}>
                  <DemoCard kind="interactive" label="Rest / Hover" />
                  <DemoCard kind="selected" label="Selected (2px border-interactive)" />
                </div>
              </div>

              <div>
                <SubHeading title="Anatomy & tokens" />
                <ul style={{ fontSize: font.size.xs, color: color.textSubtle, lineHeight: font.lineHeight.relaxed, fontFamily: font.mono, paddingLeft: space[5] }}>
                  <li>background = <b>--ads-background-subtle-01</b> (#FFFFFF)</li>
                  <li>border (rest) = 1px solid <b>--ads-border-subtle</b> (9% black)</li>
                  <li>border (hover) = 1px solid <b>--ads-border-subtle-hover</b> (13% black) — interactive only</li>
                  <li>border (selected) = 2px solid <b>--ads-background-interactive</b> (#009ACE) — inner padding shifts -1px</li>
                  <li>border-radius = <b>--ads-radius-md</b> (8px)</li>
                  <li>transition = border-color <b>--ads-duration-fast</b> <b>--ads-ease-standard</b></li>
                </ul>
              </div>
            </>
          )}

          {/* ── Tag ── */}
          {activeId === "tag" && (
            <>
              <SectionHeading id="tag" title="Tag" description="Pill-shaped label. 6 semantic color variants, 2 sizes, optional dismiss. Figma: node 5:1033." />
              <div style={{ marginBottom: space[8] }}>
                <SubHeading title="Tag / Colors — Small (default)" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: space[3] }}>
                  {(["red", "orange", "magenta", "purple", "blue", "green"] as const).map((c) => (
                    <div key={c} style={{ display: "flex", flexDirection: "column", gap: space[2] }}>
                      <Tag color={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Tag>
                      <TokenBadge name={`Tag / ${c.charAt(0).toUpperCase() + c.slice(1)}`} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: space[8] }}>
                <SubHeading title="Tag / Sizes" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: space[4], alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: space[2] }}><Tag color="blue" size="small">Tag / Small</Tag><TokenBadge name='size="small"' value="24px height" /></div>
                  <div style={{ display: "flex", flexDirection: "column", gap: space[2] }}><Tag color="blue" size="medium">Tag / Medium</Tag><TokenBadge name='size="medium"' value="32px height" /></div>
                </div>
              </div>
              <div style={{ marginBottom: space[8] }}>
                <SubHeading title="Tag / With icon" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: space[3], alignItems: "center" }}>
                  <Tag color="blue" icon={<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><circle cx="6" cy="6" r="5" /></svg>}>Status</Tag>
                  <Tag color="green" icon={<svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7l3 4 7-8" /></svg>}>Verified</Tag>
                  <Tag color="orange" size="medium" icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 1v6M7 10v.5" /><circle cx="7" cy="7" r="6" /></svg>}>Medium w/ icon</Tag>
                </div>
              </div>
              <div>
                <SubHeading title="Tag / With dismiss" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: space[3] }}>
                  <Tag color="red" onDismiss={() => {}}>Dismissable</Tag>
                  <Tag color="purple" onDismiss={() => {}}>Remove me</Tag>
                  <Tag color="green" size="medium" onDismiss={() => {}}>Medium dismiss</Tag>
                </div>
              </div>
            </>
          )}

          {/* ── Progress Bar ── */}
          {activeId === "progress-bar" && (
            <>
              <SectionHeading id="progress-bar" title="Progress Bar" description="Two track sizes: Medium (4 px) and Large (8 px). Three fill states: In-progress (blue) · Success (green) · Error (red). Figma: node 5:49." />
              <div style={{ marginBottom: space[8] }}>
                <SubHeading title="Progress Bar / Medium — all progress states" />
                <div style={{ display: "flex", flexDirection: "column", gap: space[5], maxWidth: 480 }}>
                  <ProgressBar size="medium" label="Progress Bar / Medium / 0%"   value={0}   helper="Not started" />
                  <ProgressBar size="medium" label="Progress Bar / Medium / 40%"  value={40}  helper="Uploading…" />
                  <ProgressBar size="medium" label="Progress Bar / Medium / 75%"  value={75}  helper="Almost there…" />
                  <ProgressBar size="medium" label="Progress Bar / Medium / 100%" value={100} helper="Complete!" />
                  <ProgressBar size="medium" label="Progress Bar / Medium / Error" value={100} error="Upload failed. Please retry." />
                </div>
              </div>
              <div>
                <SubHeading title="Progress Bar / Large — all progress states" />
                <div style={{ display: "flex", flexDirection: "column", gap: space[5], maxWidth: 480 }}>
                  <ProgressBar size="large" label="Progress Bar / Large / 50%"  value={50}  helper="Processing…" />
                  <ProgressBar size="large" label="Progress Bar / Large / 100%" value={100} helper="Done!" />
                  <ProgressBar size="large" label="Progress Bar / Large / Error" value={100} error="Connection lost." />
                </div>
              </div>
            </>
          )}

          {/* ── Tooltip ── */}
          {activeId === "tooltip" && (
            <>
              <SectionHeading id="tooltip" title="Tooltip" description="Dark tooltip with directional arrow. 4 positions × 3 alignments. Appears on hover/focus after 400 ms delay. Figma: node 5:276." />
              <div style={{ marginBottom: space[8] }}>
                <SubHeading title="Tooltip / Positions" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: space[6], paddingTop: space[5], paddingBottom: space[5] }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space[2] }}><Tooltip content="Tooltip / Top" position="top"><SecondaryButton size={36}>Top</SecondaryButton></Tooltip><TokenBadge name='position="top"' /></div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space[2] }}><Tooltip content="Tooltip / Bottom" position="bottom"><SecondaryButton size={36}>Bottom</SecondaryButton></Tooltip><TokenBadge name='position="bottom"' /></div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space[2] }}><Tooltip content="Tooltip / Left" position="left"><SecondaryButton size={36}>Left</SecondaryButton></Tooltip><TokenBadge name='position="left"' /></div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space[2] }}><Tooltip content="Tooltip / Right" position="right"><SecondaryButton size={36}>Right</SecondaryButton></Tooltip><TokenBadge name='position="right"' /></div>
                </div>
              </div>
              <div>
                <SubHeading title="Tooltip / Top — Alignment variants" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: space[6], paddingTop: space[5], paddingBottom: space[5] }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space[2] }}><Tooltip content="Tooltip / Top / Start" position="top" align="start"><SecondaryButton size={36}>Start</SecondaryButton></Tooltip><TokenBadge name='align="start"' /></div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space[2] }}><Tooltip content="Tooltip / Top / Center" position="top" align="center"><SecondaryButton size={36}>Center</SecondaryButton></Tooltip><TokenBadge name='align="center"' value="default" /></div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space[2] }}><Tooltip content="Tooltip / Top / End" position="top" align="end"><SecondaryButton size={36}>End</SecondaryButton></Tooltip><TokenBadge name='align="end"' /></div>
                </div>
              </div>
            </>
          )}

          {/* ── Number Input ── */}
          {activeId === "number-input" && (
            <>
              <SectionHeading id="number-input" title="Number Input" description="Numeric input with increment/decrement buttons. Supports min, max, step, and validation states." />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: space[5] }}>
                <div><VariantLabel>Number Input / Default</VariantLabel><NumberInput label="Quantity" defaultValue={1} /></div>
                <div><VariantLabel>Number Input / Focused</VariantLabel><NumberInput label="Quantity" defaultValue={5} helper="Click to focus" /></div>
                <div><VariantLabel>Number Input / With Range</VariantLabel><NumberInput label="Rating" defaultValue={3} min={1} max={10} helper="Min 1, Max 10" /></div>
                <div><VariantLabel>Number Input / Step</VariantLabel><NumberInput label="Price" defaultValue={0} step={0.5} min={0} helper="Step: 0.5" /></div>
                <div><VariantLabel>Number Input / Error</VariantLabel><NumberInput label="Age" defaultValue={-1} error="Must be a positive number" /></div>
                <div><VariantLabel>Number Input / Disabled</VariantLabel><NumberInput label="Locked" defaultValue={42} disabled /></div>
              </div>
            </>
          )}

          {/* ── Search Input ── */}
          {activeId === "search-input" && (
            <>
              <SectionHeading id="search-input" title="Search" description="Search input with magnifier icon and optional clear button. Focuses border to primary color." />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: space[5] }}>
                <div><VariantLabel>Search / Default</VariantLabel><SearchInput placeholder="Search…" /></div>
                <div><VariantLabel>Search / Focused</VariantLabel><SearchInput placeholder="Click to focus" /></div>
                <div><VariantLabel>Search / With Value</VariantLabel><SearchInput defaultValue="design tokens" /></div>
                <div><VariantLabel>Search / Full Width</VariantLabel><SearchInput placeholder="Search full width…" fullWidth /></div>
                <div><VariantLabel>Search / Disabled</VariantLabel><SearchInput placeholder="Unavailable" disabled /></div>
              </div>
            </>
          )}

          {/* ── Dropdown List ── */}
          {activeId === "dropdown-list" && (
            <>
              <SectionHeading id="dropdown-list" title="Dropdown List" description="Custom dropdown with a listbox popup. Shows selected item in trigger. Supports error, helper, disabled states." />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: space[5] }}>
                <div><VariantLabel>Dropdown / Default</VariantLabel><DropdownList label="Country" placeholder="Select country" options={[{ value: "us", label: "United States" }, { value: "uk", label: "United Kingdom" }, { value: "il", label: "Israel" }, { value: "de", label: "Germany" }]} /></div>
                <div><VariantLabel>Dropdown / Focused</VariantLabel><DropdownList label="Country" placeholder="Click to open" options={[{ value: "us", label: "United States" }, { value: "uk", label: "United Kingdom" }]} /></div>
                <div><VariantLabel>Dropdown / Selected</VariantLabel><DropdownList label="Country" defaultValue="il" options={[{ value: "us", label: "United States" }, { value: "uk", label: "United Kingdom" }, { value: "il", label: "Israel" }]} /></div>
                <div><VariantLabel>Dropdown / With Helper</VariantLabel><DropdownList label="Region" helper="Choose your region" placeholder="Select region" options={[{ value: "na", label: "North America" }, { value: "eu", label: "Europe" }]} /></div>
                <div><VariantLabel>Dropdown / Error</VariantLabel><DropdownList label="Priority" error="Selection required" placeholder="Select priority" options={[{ value: "low", label: "Low" }, { value: "high", label: "High" }]} /></div>
                <div><VariantLabel>Dropdown / Required</VariantLabel><DropdownList label="Category" required placeholder="Select category" options={[{ value: "a", label: "Category A" }, { value: "b", label: "Category B" }]} /></div>
                <div><VariantLabel>Dropdown / Menu Placement Top</VariantLabel><DropdownList label="Opens upward" menuPlacement="top" placeholder="Click — menu above" options={[{ value: "a", label: "Option A" }, { value: "b", label: "Option B" }, { value: "c", label: "Option C" }]} /></div>
                <div><VariantLabel>Dropdown / Disabled</VariantLabel><DropdownList label="Status" disabled placeholder="Unavailable" options={[{ value: "a", label: "Active" }]} /></div>
              </div>
            </>
          )}

          {/* ── Date Picker ── */}
          {activeId === "date-picker" && (
            <>
              <SectionHeading id="date-picker" title="Date Picker" description="Native date input styled to match the design system. Supports min/max constraints, error, and disabled states." />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: space[5] }}>
                <div><VariantLabel>Date Picker / Default</VariantLabel><DatePicker label="Start Date" /></div>
                <div><VariantLabel>Date Picker / Focused</VariantLabel><DatePicker label="Start Date" helper="Click to focus" /></div>
                <div><VariantLabel>Date Picker / With Value</VariantLabel><DatePicker label="Birthday" defaultValue="1990-06-15" /></div>
                <div><VariantLabel>Date Picker / With Range</VariantLabel><DatePicker label="Appointment" min="2026-01-01" max="2026-12-31" helper="2026 only" /></div>
                <div><VariantLabel>Date Picker / Error</VariantLabel><DatePicker label="Due Date" error="Date is required" /></div>
                <div><VariantLabel>Date Picker / Disabled</VariantLabel><DatePicker label="Locked" defaultValue="2025-01-01" disabled /></div>
              </div>
            </>
          )}

          {/* ── Breadcrumbs ── */}
          {activeId === "breadcrumbs" && (
            <>
              <SectionHeading id="breadcrumbs" title="Breadcrumbs" description="Navigation trail showing hierarchy. Last item is current page (non-clickable). Separator defaults to chevron." />
              <div style={{ display: "flex", flexDirection: "column", gap: space[8] }}>
                <div>
                  <SubHeading title="Breadcrumbs / Default" />
                  <Breadcrumbs items={[{ label: "Home", onClick: () => {} }, { label: "Settings", onClick: () => {} }, { label: "Profile" }]} />
                </div>
                <div>
                  <SubHeading title="Breadcrumbs / Long Path" />
                  <Breadcrumbs items={[{ label: "Home", onClick: () => {} }, { label: "Products", onClick: () => {} }, { label: "Category", onClick: () => {} }, { label: "Subcategory", onClick: () => {} }, { label: "Item Detail" }]} />
                </div>
                <div>
                  <SubHeading title="Breadcrumbs / Custom Separator" />
                  <Breadcrumbs separator={<span style={{ color: color.textPlaceholder, margin: `0 ${space[1]}` }}>/</span>} items={[{ label: "Dashboard", onClick: () => {} }, { label: "Analytics", onClick: () => {} }, { label: "Reports" }]} />
                </div>
              </div>
            </>
          )}

          {/* ── Stepper ── */}
          {activeId === "stepper" && (
            <StepperSection />
          )}

          {/* ── Message List ── */}
          {activeId === "message-list" && (
            <>
              <SectionHeading id="message-list" title="Message List" description="Chat-style message bubbles with avatar, sender name, and timestamps. Own messages align right in primary blue." />
              <div style={{ maxWidth: 500, border: `1px solid ${color.borderDefault}`, borderRadius: radius.md, backgroundColor: color.bgSurface }}>
                <MessageList
                  messages={[
                    { id: "1", sender: "Dr. Sarah Chen", content: "The scan results look good. I've reviewed the margin lines.", timestamp: "10:32 AM" },
                    { id: "2", sender: "You", content: "Great, should I proceed with the prep?", timestamp: "10:33 AM", isOwn: true },
                    { id: "3", sender: "Dr. Sarah Chen", content: "Yes, go ahead. Make sure to check the occlusal clearance first.", timestamp: "10:35 AM" },
                    { id: "4", sender: "You", content: "Will do. Thanks!", timestamp: "10:36 AM", isOwn: true },
                  ]}
                />
              </div>
            </>
          )}

          {/* ── Notification ── */}
          {activeId === "notification" && (
            <>
              <SectionHeading id="notification" title="Notification" description="Inline alert banners with icon. Four types: info, success, warning, error. Optional title and dismiss button." />
              <div style={{ display: "flex", flexDirection: "column", gap: space[4], maxWidth: 520 }}>
                <SubHeading title="Notification / Types" />
                <Notification type="info" title="Information">This is an informational notification with helpful details.</Notification>
                <Notification type="success" title="Success">The operation completed successfully.</Notification>
                <Notification type="warning" title="Warning">Please review the settings before proceeding.</Notification>
                <Notification type="error" title="Error">Something went wrong. Please try again.</Notification>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: space[4], maxWidth: 520, marginTop: space[8] }}>
                <SubHeading title="Notification / Without Title" />
                <Notification type="info">A simple inline message without a title.</Notification>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: space[4], maxWidth: 520, marginTop: space[8] }}>
                <SubHeading title="Notification / Dismissable" />
                <Notification type="info" title="New Update" onDismiss={() => {}}>A new version is available.</Notification>
                <Notification type="success" title="Upload Complete" onDismiss={() => {}}>Your file has been uploaded.</Notification>
                <Notification type="warning" title="Low Storage" onDismiss={() => {}}>You are running low on storage space.</Notification>
                <Notification type="error" title="Connection Lost" onDismiss={() => {}}>Check your internet connection and retry.</Notification>
              </div>
            </>
          )}

          {/* ── Modal ── */}
          {activeId === "modal" && (
            <ModalSection />
          )}

          {/* ── Toolbar ── */}
          {activeId === "toolbar" && (
            <ToolbarSection />
          )}

          {/* ── Header ── */}
          {activeId === "header" && (
            <HeaderSection />
          )}

          {/* ── Jaw Selector ── */}
          {activeId === "jaw-selector" && (
            <JawSelectorSection />
          )}

          {/* ── Panels ── */}
          {activeId === "panels" && (
            <PanelsSection />
          )}

          {/* ── Toolbar Icons ── */}
          {activeId === "icons-toolbar" && (
            <>
              <SectionHeading id="icons-toolbar" title="Toolbar Icons" description="Icons used in scan and view toolbars. Active state uses background-interactive-hover, inactive uses icon-secondary. Scan Assist and Prep Edit are static compound illustrations and don't accept an isActive prop." />
              <div style={{ marginBottom: space[8] }}>
                <SubHeading title="Scan Toolbar Icons" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: space[3] }}>
                  {([
                    { label: "Monochrome", icon: <MonochromeIcon isActive={false} /> },
                    { label: "Monochrome (Active)", icon: <MonochromeIcon isActive={true} /> },
                    { label: "Scan Assist", icon: <ScanAssistIcon /> },
                    { label: "Prep Edit", icon: <PrepEditIcon /> },
                  ] as const).map((item) => (
                    <StateCell key={item.label} label={item.label}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40 }}>{item.icon}</div>
                    </StateCell>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: space[8] }}>
                <SubHeading title="View Toolbar Icons" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: space[3] }}>
                  {([
                    { label: "Review Tool", icon: <ReviewToolIcon isActive={false} /> },
                    { label: "Review Tool (Active)", icon: <ReviewToolIcon isActive={true} /> },
                    { label: "Occlusalgram", icon: <OcclusalgramIcon isActive={false} /> },
                    { label: "Occlusalgram (Active)", icon: <OcclusalgramIcon isActive={true} /> },
                    { label: "Margin Line", icon: <MarginLineIcon isActive={false} /> },
                    { label: "Margin Line (Active)", icon: <MarginLineIcon isActive={true} /> },
                    { label: "Prep QC", icon: <PrepQcIcon isActive={false} /> },
                    { label: "Prep QC (Active)", icon: <PrepQcIcon isActive={true} /> },
                    { label: "Trim", icon: <TrimIcon isActive={false} /> },
                    { label: "Trim (Active)", icon: <TrimIcon isActive={true} /> },
                  ] as const).map((item) => (
                    <StateCell key={item.label} label={item.label}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40 }}>{item.icon}</div>
                    </StateCell>
                  ))}
                </div>
              </div>
              <div>
                <SubHeading title="Utility Icons" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: space[3] }}>
                  <StateCell label="Chevron / Collapsed" tokens={[{ name: "isExpanded={false}" }]}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40 }}><ChevronIcon isExpanded={false} /></div>
                  </StateCell>
                  <StateCell label="Chevron / Expanded" tokens={[{ name: "isExpanded={true}" }]}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40 }}><ChevronIcon isExpanded={true} /></div>
                  </StateCell>
                  <StateCell label="Chevron / Horizontal" tokens={[{ name: 'direction="horizontal"' }]}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40 }}><ChevronIcon isExpanded={false} direction="horizontal" /></div>
                  </StateCell>
                </div>
              </div>
            </>
          )}

          {/* ── Templates ── */}
          {activeId === "templates" && (
            <TemplatesSection />
          )}

          {/* ── Link ── */}
          {activeId === "link" && (
            <LinkSection />
          )}

          {/* ── Combobox ── */}
          {activeId === "combobox" && (
            <ComboboxSection />
          )}

          {/* ── Slider ── */}
          {activeId === "slider" && (
            <SliderSection />
          )}

          {/* ── Contextual Menu ── */}
          {activeId === "contextual-menu" && (
            <ContextualMenuSection />
          )}

          {/* ── Page Header ── */}
          {activeId === "page-header" && (
            <PageHeaderSection />
          )}

          {/* ── Navigation Panel ── */}
          {activeId === "nav-panel" && (
            <NavPanelSection />
          )}

          {/* ── Avatar ── */}
          {activeId === "avatar" && (
            <AvatarSection />
          )}

          {/* ── Accordion ── */}
          {activeId === "accordion" && (
            <AccordionSection />
          )}

          {/* ── Message Bubble ── */}
          {activeId === "message-bubble" && (
            <MessageBubbleSection />
          )}

          {/* ── Spinner ── */}
          {activeId === "spinner" && (
            <SpinnerSection />
          )}

          {/* ── Logo ── */}
          {activeId === "logo" && (
            <LogoSection />
          )}

          {/* ── Procedure Icons ── */}
          {activeId === "icons-procedure" && (
            <>
              <SectionHeading id="icons-procedure" title="Procedure Icons" description="Icons used in the Info page procedure selection cards. Each represents a dental procedure type." />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: space[3] }}>
                {([
                  { label: "Study Model", icon: "study" },
                  { label: "Invisalign", icon: "invisalign" },
                  { label: "Fixed Restorative", icon: "restorative" },
                  { label: "Implant Planning", icon: "implant" },
                  { label: "Dentures", icon: "dentures" },
                  { label: "Appliance", icon: "appliance" },
                ] as const).map((item) => (
                  <StateCell key={item.icon} label={item.label} tokens={[{ name: `icon: "${item.icon}"` }]}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 40, color: color.textSubtle }}>
                      {PROCEDURE_ICONS[item.icon]}
                    </div>
                  </StateCell>
                ))}
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}
