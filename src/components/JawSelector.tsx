import React, { useState } from "react";
import jawUpper from "@/assets/jaw/jaw-upper.png";
import jawLower from "@/assets/jaw/jaw-lower.png";
import jawBite from "@/assets/jaw/jaw-bite.png";

// ============================================================================
// JAW SELECTOR
// ----------------------------------------------------------------------------
// Interactive port of the Figma "Jaw Selector" component (Aohs · node 917:12240).
//
// Shows the full dental anatomy (upper arch + bite + lower arch). The active
// jaw can be changed two ways, both driving the same state:
//   • clicking the upper arch, lower arch, or centre bite directly, or
//   • the prev/next switcher bar below the artwork.
// The selected arch / bite outline is drawn blue (#009ACE), matching the Figma
// states (upper 917:10369 · lower 917:11773 · bite 917:12020).
//
// Artwork is a transparent, high-res (3x) export of each Figma instance — raster
// PNG is used deliberately because this project ships a *precompiled* Tailwind
// stylesheet, so a vector export's per-tooth arbitrary classes would never be
// generated. The switcher bar is styled entirely with our design-system tokens
// (--ads-*), which work regardless of the precompiled-Tailwind constraint.
// ============================================================================

export type JawView = "upper" | "lower" | "bite";

const VIEW_ORDER: JawView[] = ["upper", "lower", "bite"];

const STATE_IMAGE: Record<JawView, string> = {
  upper: jawUpper,
  lower: jawLower,
  bite: jawBite,
};

// Long labels for aria; short labels for the switcher bar (truncates if narrow).
const ARIA_LABEL: Record<JawView, string> = {
  upper: "Upper jaw",
  lower: "Lower jaw",
  bite: "Bite (both jaws)",
};
const SWITCH_LABEL: Record<JawView, string> = {
  upper: "Upper Jaw",
  lower: "Lower Jaw",
  bite: "Bite",
};

// Natural artwork size of the Figma instance.
const ART_W = 249;
const ART_H = 377;

// Default render width. Compact enough for side panels, large enough to read.
const DEFAULT_WIDTH = 200;

// Minimum interactive hit area per WCAG / Apple HIG / Material (44px).
const MIN_HIT = 44;

// Clickable hotspot rectangles in natural (249 × 377) coordinates.
const HOTSPOTS: Record<JawView, { top: number; left: number; width: number; height: number }> = {
  upper: { top: 0, left: 17, width: 215, height: 140 },
  bite: { top: 146, left: 94, width: 65, height: 70 },
  lower: { top: 220, left: 17, width: 214, height: 157 },
};

export interface JawSelectorProps {
  /** Controlled selection. */
  value?: JawView;
  /** Initial selection when uncontrolled. Defaults to "lower". */
  defaultValue?: JawView;
  /** Fired whenever the selection changes. */
  onChange?: (view: JawView) => void;
  /** Render width in px (height scales proportionally). Defaults to 200. */
  width?: number;
  /** Show the prev/next switcher bar below the artwork. Defaults to true. */
  showSwitcher?: boolean;
  className?: string;
}

const hotspotBaseStyle: React.CSSProperties = {
  position: "absolute",
  background: "transparent",
  border: "none",
  padding: 0,
  margin: 0,
  cursor: "pointer",
  borderRadius: 10,
  outline: "none",
  WebkitTapHighlightColor: "transparent",
};

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M15 18L9 12L15 6" : "M9 18L15 12L9 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Divider() {
  return <div aria-hidden="true" style={{ width: 0, height: 24, borderLeft: "1px solid var(--ads-border-subtle)" }} />;
}

function SwitcherBar({ view, onStep }: { view: JawView; onStep: (delta: number) => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "var(--ads-background-subtle-01)",
        boxShadow: "var(--ads-shadow-sm)", // same elevation as the toolbar (no border)
        borderRadius: 8,
        height: 52, // match toolbar height (44px control + 4px padding × 2)
        gap: 8,
        padding: "8px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <button
          type="button"
          className="btn btn-ghost icon-btn"
          data-design-system="ghost-button"
          aria-label="Previous jaw"
          style={{ color: "var(--ads-text-primary)" }}
          onClick={() => onStep(-1)}
        >
          <Chevron direction="left" />
        </button>
        <Divider />
      </div>

      <div
        style={{
          flex: 1,
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          color: "var(--ads-text-primary)",
          fontFamily: "'Roboto', sans-serif",
          fontSize: 16,
          lineHeight: "24px",
        }}
      >
        {SWITCH_LABEL[view]}
      </div>

      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <Divider />
        <button
          type="button"
          className="btn btn-ghost icon-btn"
          data-design-system="ghost-button"
          aria-label="Next jaw"
          style={{ color: "var(--ads-text-primary)" }}
          onClick={() => onStep(1)}
        >
          <Chevron direction="right" />
        </button>
      </div>
    </div>
  );
}

export default function JawSelector({
  value,
  defaultValue = "lower",
  onChange,
  width = DEFAULT_WIDTH,
  showSwitcher = true,
  className,
}: JawSelectorProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<JawView>(defaultValue);
  const [hovered, setHovered] = useState<JawView | null>(null);
  const view = isControlled ? (value as JawView) : internal;

  const select = (next: JawView) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const step = (delta: number) => {
    const idx = VIEW_ORDER.indexOf(view);
    select(VIEW_ORDER[(idx + delta + VIEW_ORDER.length) % VIEW_ORDER.length]);
  };

  // Hovering an arch previews that state's artwork (the blue outline), so the
  // hover hint is the real jaw highlight rather than a translucent box.
  const displayedView = hovered ?? view;

  const scale = width / ART_W;
  const px = (n: number) => n * scale;

  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column", gap: 16, width, userSelect: "none" }}
      role="group"
      aria-label="Jaw selector"
      data-name="Jaw Selector"
    >
      {/* Component-scoped a11y/state styling, independent of precompiled Tailwind. */}
      <style>{`
        .jaw-hotspot:focus-visible {
          outline: 2px solid var(--ads-border-focus);
          outline-offset: 2px;
          border-radius: 10px;
        }
      `}</style>

      {/* Anatomy artwork + click hotspots */}
      <div style={{ position: "relative", width, height: ART_H * scale }} data-name="Jaw Anatomy">
        <img
          src={STATE_IMAGE[displayedView]}
          alt={`Jaw selector — ${ARIA_LABEL[view]} selected`}
          draggable={false}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", pointerEvents: "none" }}
        />

        {(Object.keys(HOTSPOTS) as JawView[]).map((key) => {
          const r = HOTSPOTS[key];
          // Visual rect (scaled), grown to the 44px minimum, kept centred.
          const w = Math.max(px(r.width), MIN_HIT);
          const h = Math.max(px(r.height), MIN_HIT);
          const left = px(r.left) - (w - px(r.width)) / 2;
          const top = px(r.top) - (h - px(r.height)) / 2;
          return (
            <button
              key={key}
              type="button"
              className="jaw-hotspot"
              aria-label={`Select ${ARIA_LABEL[key]}`}
              aria-pressed={view === key}
              onClick={() => select(key)}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered((cur) => (cur === key ? null : cur))}
              style={{
                ...hotspotBaseStyle,
                top,
                left,
                width: w,
                height: h,
                zIndex: key === "bite" ? 2 : 1,
                background: "transparent",
              }}
            />
          );
        })}
      </div>

      {/* Prev/Next switcher bar (16px below the artwork) */}
      {showSwitcher && <SwitcherBar view={view} onStep={step} />}
    </div>
  );
}
