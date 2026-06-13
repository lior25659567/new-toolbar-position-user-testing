import React, { useState } from "react";
import { Tooth18Icon, Tooth17Icon, Tooth16Icon, Tooth15Icon, Tooth14Icon, Tooth13Icon, Tooth12Icon, Tooth11Icon, Tooth48Icon, Tooth47Icon, Tooth46Icon, Tooth45Icon, Tooth44Icon, Tooth43Icon, Tooth42Icon, Tooth41Icon } from "./ToothIcons";
import { GhostButton } from "../../../design-system";

interface ToothProps {
  number: number;
  selected: boolean;
  color?: string;
  procedure?: string;
  expanded: boolean;
  onClick: (e: React.MouseEvent) => void;
}

// Upper teeth (11-28) render with the number above the tooth and the crown
// aligned to the bottom of the cell (so it meets the occlusal divider).
// Lower teeth (31-48) flip: tooth at top with crown to the divider, number
// below.
function isUpper(num: number) {
  return num >= 11 && num <= 28;
}

const CUSTOM_TOOTH_ICONS: Record<number, React.FC<{ color: string; hovered?: boolean; strokeWidth?: number }>> = {
  18: Tooth18Icon, 17: Tooth17Icon, 16: Tooth16Icon, 15: Tooth15Icon,
  14: Tooth14Icon, 13: Tooth13Icon, 12: Tooth12Icon, 11: Tooth11Icon,
  48: Tooth48Icon, 47: Tooth47Icon, 46: Tooth46Icon, 45: Tooth45Icon,
  44: Tooth44Icon, 43: Tooth43Icon, 42: Tooth42Icon, 41: Tooth41Icon,
};

// Right-side upper teeth (21-28) are horizontal mirrors of left-side (11-18)
// Right-side lower teeth (31-38) are horizontal mirrors of left-side (41-48)
const MIRROR_MAP: Record<number, number> = {
  21: 11, 22: 12, 23: 13, 24: 14, 25: 15, 26: 16, 27: 17, 28: 18,
  31: 41, 32: 42, 33: 43, 34: 44, 35: 45, 36: 46, 37: 47, 38: 48,
};

function ToothIcon({ number, color: iconColor, hovered, strokeWidth }: { number: number; color: string; hovered: boolean; strokeWidth?: number }) {
  // Check direct match first
  const CustomIcon = CUSTOM_TOOTH_ICONS[number];
  if (CustomIcon) return <CustomIcon color={iconColor} hovered={hovered} strokeWidth={strokeWidth} />;

  // Check if this tooth is a mirrored version of a custom icon
  const mirrorOf = MIRROR_MAP[number];
  if (mirrorOf) {
    const MirrorIcon = CUSTOM_TOOTH_ICONS[mirrorOf];
    if (MirrorIcon) return <div style={{ transform: "scaleX(-1)", display: "inline-flex" }}><MirrorIcon color={iconColor} hovered={hovered} strokeWidth={strokeWidth} /></div>;
  }
  const isUpper = number <= 28;
  return (
    <svg width="20" height="24" viewBox="0 0 16 18" fill="none">
      {isUpper ? (
        <path
          d="M8 1C5.5 1 3.5 2.5 3 5C2.5 7.5 3 9 4 10.5C4.5 11.2 5 12 5.5 14C6 16 6.5 17 8 17C9.5 17 10 16 10.5 14C11 12 11.5 11.2 12 10.5C13 9 13.5 7.5 13 5C12.5 2.5 10.5 1 8 1Z"
          stroke={iconColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
        />
      ) : (
        <path
          d="M8 17C5.5 17 3.5 15.5 3 13C2.5 10.5 3 9 4 7.5C4.5 6.8 5 6 5.5 4C6 2 6.5 1 8 1C9.5 1 10 2 10.5 4C11 6 11.5 6.8 12 7.5C13 9 13.5 10.5 13 13C12.5 15.5 10.5 17 8 17Z"
          stroke={iconColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

// Fixed visual envelope for the tooth SVG inside each cell. Keeping this
// constant (rather than letting each SVG size the cell) is what makes the
// number row land on a single baseline across all teeth in an arch — the
// numbers always sit at the same offset from the top/bottom edge of the
// button.
const TOOTH_VIEWPORT_HEIGHT = 54;

export function Tooth({ number, selected, color, procedure, onClick }: ToothProps) {
  const [hovered, setHovered] = useState(false);

  const isMissing = procedure === "missing";
  const hasProc = !!procedure;
  const upper = isUpper(number);

  // Accent colour that drives both the border and a subtle background tint
  // when the tooth is "on": an assigned procedure uses that procedure's
  // colour, otherwise a plain selection uses the focus colour.
  const accent = hasProc && color ? color : selected ? "var(--ads-border-focus)" : null;

  // The tooth icon always stays neutral — the assigned procedure is shown on
  // the card border (below), not by recolouring the tooth.
  const iconColor = "var(--ads-text-muted)";
  const strokeWidth = undefined;

  const label = (
    <span
      style={{
        fontSize: "var(--tp-label-01-size)",
        fontWeight: 500,
        color: "var(--ads-text-secondary)",
        fontFamily: "var(--ads-font-sans)",
        textDecoration: isMissing ? "line-through" : "none",
        lineHeight: 1,
      }}
    >
      {number}
    </span>
  );

  const toothViewport = (
    <div
      style={{
        height: TOOTH_VIEWPORT_HEIGHT,
        display: "flex",
        alignItems: upper ? "flex-end" : "flex-start",
        justifyContent: "center",
      }}
    >
      <ToothIcon number={number} color={iconColor} hovered={hovered} strokeWidth={strokeWidth} />
    </div>
  );

  return (
    <GhostButton
      size={36}
      selected={selected}
      data-demo={`tooth-${number}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "1 1 0",
        minWidth: 43,
        height: 88,
        padding: "7px 3px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 5,
        // White card surface with the design-system small elevation.
        backgroundColor: "var(--ads-background-subtle-01)",
        boxShadow: "var(--ads-shadow-sm)",
        borderRadius: "var(--ads-radius-sm)",
        // The card border conveys state: an assigned procedure colours the
        // border with that procedure's colour; otherwise selection shows the
        // focus colour and hover a subtle border. Width is constant (2.5px)
        // across states to avoid layout shift, and box-sizing keeps the border
        // centred on the cell edge so the thicker stroke doesn't nudge the
        // contents.
        boxSizing: "border-box",
        border:
          accent
            ? `2.5px solid ${accent}`
            : hovered
            ? "2.5px solid var(--ads-border-subtle-hover)"
            : "2.5px solid transparent",
      }}
    >
      {upper ? (
        <>
          {label}
          {toothViewport}
        </>
      ) : (
        <>
          {toothViewport}
          {label}
        </>
      )}
    </GhostButton>
  );
}
