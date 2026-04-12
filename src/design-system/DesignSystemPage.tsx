import React, { useRef, useState } from "react";
import { color, font, space, radius, shadow, transition } from "./tokens";
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
import { HorizontalScanToolbar, UpperJawIcon, LowerJawIcon, BothJawsIcon } from "../components/HorizontalToolbarScan";
import { HorizontalViewToolbar } from "../components/HorizontalToolbarView";
import HeaderNavigation from "../components/HeaderNavigation";
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

const NAV = [
  {
    group: "Foundation",
    items: [
      { id: "colors",     label: "Colors" },
      { id: "typography", label: "Typography" },
      { id: "spacing",    label: "Spacing" },
      { id: "radii",      label: "Border Radius" },
      { id: "shadows",    label: "Shadows" },
    ],
  },
  {
    group: "Controls",
    items: [
      { id: "button",      label: "Button" },
      { id: "icon-button", label: "Icon Button" },
      { id: "toggle",     label: "Toggle" },
      { id: "checkbox",   label: "Checkbox" },
      { id: "radio",      label: "Radio" },
    ],
  },
  {
    group: "Inputs",
    items: [
      { id: "text-input",    label: "Text Input" },
      { id: "text-area",     label: "Text Area" },
      { id: "number-input",  label: "Number Input" },
      { id: "search-input",  label: "Search" },
      { id: "select",        label: "Select" },
      { id: "dropdown-list", label: "Dropdown List" },
      { id: "date-picker",   label: "Date Picker" },
    ],
  },
  {
    group: "Navigation",
    items: [
      { id: "tabs",        label: "Tabs" },
      { id: "breadcrumbs", label: "Breadcrumbs" },
      { id: "stepper",     label: "Stepper" },
    ],
  },
  {
    group: "Data Display",
    items: [
      { id: "tag",          label: "Tag" },
      { id: "progress-bar", label: "Progress Bar" },
      { id: "message-list", label: "Message List" },
    ],
  },
  {
    group: "Feedback",
    items: [
      { id: "tooltip",       label: "Tooltip" },
      { id: "notification",  label: "Notification" },
      { id: "modal",         label: "Modal" },
    ],
  },
  {
    group: "Application",
    items: [
      { id: "toolbar",  label: "Toolbar" },
      { id: "header",   label: "Header" },
      { id: "panels",   label: "Panels" },
    ],
  },
  {
    group: "Iconography",
    items: [
      { id: "icons-toolbar",   label: "Toolbar Icons" },
      { id: "icons-procedure", label: "Procedure Icons" },
    ],
  },
  {
    group: "Templates",
    items: [
      { id: "templates", label: "Templates" },
    ],
  },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

export interface DesignSystemPageProps {
  onBack?: () => void;
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

function ButtonSection() {
  return (
    <>
      {/* Type × Size comparison */}
      <div style={{ marginBottom: space[10] }}>
        <SubHeading title="Button / Type — all variants" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `160px repeat(${BUTTON_SIZES.length}, 1fr)`,
            gap: `${space[2]} ${space[4]}`,
            alignItems: "center",
          }}
        >
          {/* Column headers */}
          <div />
          {BUTTON_SIZES.map((s) => (
            <div key={s.size} style={{ fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.textLabel, paddingBottom: space[2] }}>
              {s.label}
            </div>
          ))}

          {/* Primary */}
          <VariantRowLabel>Button / Primary</VariantRowLabel>
          {BUTTON_SIZES.map((s) => <PrimaryButton key={s.size} size={s.size}>Label</PrimaryButton>)}

          {/* Secondary */}
          <VariantRowLabel>Button / Secondary</VariantRowLabel>
          {BUTTON_SIZES.map((s) => <SecondaryButton key={s.size} size={s.size}>Label</SecondaryButton>)}

          {/* Ghost */}
          <VariantRowLabel>Button / Ghost</VariantRowLabel>
          {BUTTON_SIZES.map((s) => <GhostButton key={s.size} size={s.size}>Label</GhostButton>)}

          {/* Link */}
          <VariantRowLabel>Button / Link</VariantRowLabel>
          {BUTTON_SIZES.map((s) => <LinkButton key={s.size} size={s.size}>Label</LinkButton>)}

          {/* Danger */}
          <VariantRowLabel>Button / Danger</VariantRowLabel>
          {BUTTON_SIZES.map((s) => <WarningButton key={s.size} size={s.size}>Label</WarningButton>)}
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: space[3] }}>
          <StateCell label="Default" tokens={[{ name: "color.borderDefault" }]}>
            <SecondaryButton>Secondary</SecondaryButton>
          </StateCell>
          <StateCell label="Hover" tokens={[{ name: "borderColor: #9CA3AF", value: "~borderHover" }]}>
            <SecondaryButton>Hover me</SecondaryButton>
          </StateCell>
          <StateCell label="Pressed" tokens={[{ name: "scale(0.98)" }, { name: "borderColor: #9CA3AF" }]}>
            <SecondaryButton>Press me</SecondaryButton>
          </StateCell>
          <StateCell label="Focused" tokens={[{ name: "borderColor: #9CA3AF" }]}>
            <SecondaryButton>Focus me</SecondaryButton>
          </StateCell>
          <StateCell label="Disabled" tokens={[{ name: "opacity: 0.5" }]}>
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
          <StateCell label="Toolbar / Hover" hint="Mouse over" tokens={[{ name: "bg: #f5f5f5", value: "hard-coded" }]}>
            <SecondaryButton variant="toolbar">Hover me</SecondaryButton>
          </StateCell>
          <StateCell label="Toolbar / Active" hint="Toggled on" tokens={[{ name: "bg: #E0F2FE", value: "hard-coded" }]}>
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
          <StateCell label="Active" tokens={[{ name: "bg", value: "primaryLight" }, { name: "icon", value: "color.primary" }]}>
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
          <StateCell label="Active" tokens={[{ name: "bg", value: "primaryLight" }, { name: "icon", value: "color.primary" }]}>
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
          tokens={[{ name: "bg", value: "#F4F4F4" }, { name: "hover", value: "#E8E8E8" }, { name: "text", value: "rgba(0,0,0,0.93)" }]}
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
          tokens={[{ name: "bg", value: "white" }, { name: "border", value: "#E0E0E0" }, { name: "hover-bg", value: "#FAFAFA" }]}
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

  const selectSection = (id: string) => {
    setActiveId(id);
    // scroll main panel back to top when switching sections
    if (mainRef.current) mainRef.current.scrollTop = 0;
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
            Figma: nswYX2pzgi7ToSzWuRkyd8 · Component / Variant / State
          </p>
        </div>
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
      </header>

      {/* ── Body ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Sidebar */}
        <nav
          style={{
            width: 192,
            flexShrink: 0,
            borderRight: `1px solid ${color.neutral150}`,
            overflowY: "auto",
            padding: `${space[6]} 0`,
            backgroundColor: color.bgSurface,
          }}
        >
          {NAV.map(({ group, items }) => (
            <div key={group} style={{ marginBottom: space[5] }}>
              <div
                style={{
                  fontSize: font.size["2xs"],
                  fontWeight: font.weight.semibold,
                  color: color.textPlaceholder,
                  letterSpacing: font.tracking.wide,
                  textTransform: "uppercase",
                  padding: `0 ${space[4]}`,
                  marginBottom: space[1],
                }}
              >
                {group}
              </div>
              {items.map(({ id, label }) => {
                const isActive = activeId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectSection(id)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: `${space[2]} ${space[4]}`,
                      fontSize: font.size.base,
                      fontWeight: isActive ? font.weight.medium : font.weight.regular,
                      color: isActive ? color.primary : color.textSubtle,
                      backgroundColor: isActive ? color.primaryRingLight : "transparent",
                      border: "none",
                      borderLeft: isActive ? `2px solid ${color.primary}` : "2px solid transparent",
                      cursor: "pointer",
                      transition: transition.base,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Content — only the active section renders */}
        <main
          ref={mainRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: `${space[8]} ${space[10]}`,
            backgroundColor: activeId === "templates" ? "#F5F5F5" : undefined,
          }}
        >

          {/* ── Colors ── */}
          {activeId === "colors" && (
            <>
              <SectionHeading id="colors" title="Colors" description="All values live in tokens.ts under the color object. Never use raw hex values in components." />
              <ColorGroup title="Primary" items={[
                { token: "color.primary",       value: color.primary,        usage: "Default fill" },
                { token: "color.primaryHover",   value: color.primaryHover,   usage: "Hover state" },
                { token: "color.primaryPressed", value: color.primaryPressed, usage: "Pressed state" },
                { token: "color.primaryRing",    value: color.primaryRing,    usage: "Focus ring" },
              ]} />
              <ColorGroup title="Danger" items={[
                { token: "color.danger",        value: color.danger,        usage: "Default fill" },
                { token: "color.dangerHover",    value: color.dangerHover,   usage: "Hover state" },
                { token: "color.dangerPressed",  value: color.dangerPressed, usage: "Pressed state" },
                { token: "color.dangerRing",     value: color.dangerRing,    usage: "Focus ring" },
              ]} />
              <ColorGroup title="Neutral scale" columns="repeat(auto-fill, minmax(110px, 1fr))" items={[
                { token: "neutral950", value: color.neutral950 }, { token: "neutral900", value: color.neutral900 },
                { token: "neutral800", value: color.neutral800 }, { token: "neutral700", value: color.neutral700 },
                { token: "neutral600", value: color.neutral600 }, { token: "neutral400", value: color.neutral400 },
                { token: "neutral300", value: color.neutral300 }, { token: "neutral200", value: color.neutral200 },
                { token: "neutral150", value: color.neutral150 }, { token: "neutral100", value: color.neutral100 },
                { token: "neutral50",  value: color.neutral50 },  { token: "neutral25",  value: color.neutral25 },
                { token: "white",      value: color.white },
              ]} />
              <ColorGroup title="Semantic — Text" items={[
                { token: "color.textHeading",     value: color.textHeading,     usage: "Page / section titles" },
                { token: "color.textDefault",     value: color.textDefault,     usage: "Body copy" },
                { token: "color.textSubtle",      value: color.textSubtle,      usage: "Descriptions, secondary" },
                { token: "color.textLabel",       value: color.textLabel,       usage: "Form labels" },
                { token: "color.textPlaceholder", value: color.textPlaceholder, usage: "Hints, captions" },
                { token: "color.textOnPrimary",   value: color.textOnPrimary,   usage: "Text on filled bg" },
              ]} />
              <ColorGroup title="Semantic — Border & Background" items={[
                { token: "color.borderDefault", value: color.borderDefault, usage: "Normal dividers" },
                { token: "color.borderStrong",  value: color.borderStrong,  usage: "Prominent borders" },
                { token: "color.borderHover",   value: color.borderHover,   usage: "Hover borders" },
                { token: "color.bgPage",        value: color.bgPage,        usage: "Page / canvas" },
                { token: "color.bgSurface",     value: color.bgSurface,     usage: "Card / panel" },
                { token: "color.bgHover",       value: color.bgHover,       usage: "Hover fill" },
                { token: "color.bgActive",      value: color.bgActive,      usage: "Pressed fill" },
              ]} />
              <ColorGroup title="Success" items={[
                { token: "color.success",       value: color.success,       usage: "Success fill" },
                { token: "color.successLight",  value: color.successLight,  usage: "Success background" },
                { token: "color.successBorder", value: color.successBorder, usage: "Success border" },
                { token: "color.successText",   value: color.successText,   usage: "Success text" },
              ]} />
              <div style={{ marginBottom: space[8] }}>
                <SubHeading title="Tag Colors" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: space[3] }}>
                  {(["Red", "Orange", "Magenta", "Purple", "Blue", "Green"] as const).map((name) => {
                    const key = `tag${name}` as keyof typeof color;
                    const c = color[key] as { bg: string; border: string; text: string };
                    return (
                      <div key={name} style={{ borderRadius: radius.md, overflow: "hidden", border: `1px solid ${color.neutral150}` }}>
                        <div style={{ display: "flex", height: 36 }}>
                          <div style={{ flex: 1, backgroundColor: c.bg }} title="bg" />
                          <div style={{ flex: 1, backgroundColor: c.border }} title="border" />
                          <div style={{ flex: 1, backgroundColor: c.text }} title="text" />
                        </div>
                        <div style={{ padding: `${space[2]} ${space[3]}`, background: color.bgSurface }}>
                          <code style={{ display: "block", fontFamily: font.mono, fontSize: font.size["2xs"], color: color.textLabel, fontWeight: font.weight.medium }}>
                            color.tag{name}
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
            </>
          )}

          {/* ── Typography ── */}
          {activeId === "typography" && (
            <>
              <SectionHeading id="typography" title="Typography" description="All type styles use Inter. Import from the font token — never hardcode sizes or weights." />
              <TypeRow label="Heading 2XL"  sample="Design system"                           size={font.size["2xl"]} weight="600" lineHeight="1.2"   tracking={font.tracking.tighter} tokenNote="font.size['2xl'] / weight.semibold" />
              <TypeRow label="Heading XL"   sample="Section heading"                         size={font.size.xl}    weight="600" lineHeight="1.2"   tracking={font.tracking.tight}   tokenNote="font.size.xl / weight.semibold" />
              <TypeRow label="Heading MD"   sample="Subsection label"                        size={font.size.md}    weight="600" lineHeight="1.375"                                  tokenNote="font.size.md / weight.semibold" />
              <TypeRow label="Body Base"    sample="Main call-to-action. Default #009ACE."   size={font.size.base}  weight="400" lineHeight="1.5"                                    tokenNote="font.size.base / weight.regular" />
              <TypeRow label="Body Small"   sample="Secondary description and helper text."  size={font.size.sm}    weight="400" lineHeight="1.5"                                    tokenNote="font.size.sm / weight.regular" />
              <TypeRow label="Label / Caps" sample="SIZES (60, 44, 36 PX)"                   size={font.size.xs}    weight="600" lineHeight="1"     tracking={font.tracking.wide}    tokenNote="font.size.xs / weight.semibold / tracking.wide" />
              <TypeRow label="Caption"      sample="Tab here or click then Tab"              size={font.size["2xs"]}weight="400" lineHeight="1.5"                                    tokenNote="font.size['2xs'] / weight.regular" />
              <TypeRow label="Code / Mono"  sample="color.primary · #009ACE"                 size={font.size.xs}    weight="500" lineHeight="1.5"                                    tokenNote="font.mono / size.xs / weight.medium" />
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
                  <StateCell label="Toggle / Unselected / Default" tokens={[{ name: "bg: #DFDFDF", value: "hard-coded" }]}><Toggle /></StateCell>
                  <StateCell label="Toggle / Selected / Default" tokens={[{ name: "color.primary" }]}><Toggle defaultChecked /></StateCell>
                  <StateCell label="Toggle / Unselected / Hover" hint="Hover to see" tokens={[{ name: "bg: #D2D2D2", value: "hard-coded" }]}><Toggle /></StateCell>
                  <StateCell label="Toggle / Selected / Hover" hint="Hover to see" tokens={[{ name: "bg: #008EC2", value: "hard-coded" }]}><Toggle defaultChecked /></StateCell>
                  <StateCell label="Toggle / Unselected / Pressed" hint="Click & hold" tokens={[{ name: "bg: #C5C5C5", value: "hard-coded" }]}><Toggle /></StateCell>
                  <StateCell label="Toggle / Selected / Pressed" hint="Click & hold" tokens={[{ name: "bg: #0080B2", value: "hard-coded" }]}><Toggle defaultChecked /></StateCell>
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
              <SectionHeading id="text-input" title="Text Input" description="Single-line input with label, helper, and error. Two background variants: white (Set 01) and grey (Set 02). Figma: node 5:494." />
              <div style={{ marginBottom: space[8] }}>
                <SubHeading title="Text Input / Layer Sets" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: space[5] }}>
                  <div><VariantLabel>Input / Set 01 — White field</VariantLabel><TextInput label="Label" placeholder="Placeholder text" layerSet="white" /></div>
                  <div><VariantLabel>Input / Set 02 — Grey field</VariantLabel><TextInput label="Label" placeholder="Placeholder text" layerSet="grey" /></div>
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

          {/* ── Panels ── */}
          {activeId === "panels" && (
            <PanelsSection />
          )}

          {/* ── Toolbar Icons ── */}
          {activeId === "icons-toolbar" && (
            <>
              <SectionHeading id="icons-toolbar" title="Toolbar Icons" description="Icons used in scan and view toolbars. Active state uses #008EC2 (= color.primaryHover), inactive uses #5E646E (not in tokens.ts). Scan Assist and Prep Edit are static compound illustrations and don't accept an isActive prop." />
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
