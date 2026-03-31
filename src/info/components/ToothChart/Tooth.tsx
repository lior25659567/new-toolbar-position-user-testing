import React, { useState } from "react";
import { Tooth18Icon, Tooth17Icon, Tooth16Icon, Tooth15Icon, Tooth14Icon, Tooth13Icon, Tooth12Icon, Tooth11Icon, Tooth48Icon, Tooth47Icon, Tooth46Icon, Tooth45Icon, Tooth44Icon, Tooth43Icon, Tooth42Icon, Tooth41Icon } from "./ToothIcons";

interface ToothProps {
  number: number;
  selected: boolean;
  color?: string;
  procedure?: string;
  expanded: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const CUSTOM_TOOTH_ICONS: Record<number, React.FC<{ color: string }>> = {
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

function ToothIcon({ number, color: iconColor }: { number: number; color: string }) {
  // Check direct match first
  const CustomIcon = CUSTOM_TOOTH_ICONS[number];
  if (CustomIcon) return <CustomIcon color={iconColor} />;

  // Check if this tooth is a mirrored version of a custom icon
  const mirrorOf = MIRROR_MAP[number];
  if (mirrorOf) {
    const MirrorIcon = CUSTOM_TOOTH_ICONS[mirrorOf];
    if (MirrorIcon) return <div style={{ transform: "scaleX(-1)", display: "inline-flex" }}><MirrorIcon color={iconColor} /></div>;
  }
  const isUpper = number <= 28;
  return (
    <svg width="24" height="28" viewBox="0 0 16 18" fill="none">
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

export function Tooth({ number, selected, color, procedure, expanded, onClick }: ToothProps) {
  const [hovered, setHovered] = useState(false);

  const isMissing = procedure === "missing";
  const hasProc = !!procedure;

  const bgColor = selected ? "#F3F4F6"
    : hovered ? "#F9FAFB"
    : "white";

  const borderColor = hasProc && color ? color
    : selected ? "#9CA3AF"
    : hovered ? "#9CA3AF"
    : "#E5E7EB";

  const borderWidth = hasProc && color ? "2px" : "1px";

  const textColor = selected ? "#1e2939" : "#374151";
  const iconColor = selected ? "#374151" : "#9CA3AF";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "1 1 0",
        minWidth: "48px",
        height: "84px",
        borderRadius: "8px",
        border: `${borderWidth} solid ${borderColor}`,
        backgroundColor: bgColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
        gap: "2px",
        position: "relative",
      }}
    >
      <ToothIcon number={number} color={iconColor} />
      <span
        style={{
          fontSize: "12px",
          fontWeight: selected || hasProc ? 600 : 500,
          color: textColor,
          fontFamily: "Inter, sans-serif",
          textDecoration: isMissing ? "line-through" : "none",
          lineHeight: 1,
        }}
      >
        {number}
      </span>
    </div>
  );
}
