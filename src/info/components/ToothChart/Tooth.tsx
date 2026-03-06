import React, { useState } from "react";
import type { TagColor } from "../../types";

interface ToothProps {
  number: number;
  selected: boolean;
  color?: TagColor;
  procedure?: string;
  expanded: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const tagColors: Record<string, { bg: string; border: string; text: string }> = {
  red: { bg: "#FFF0F3", border: "#FFE0E7", text: "#A30F34" },
  orange: { bg: "#FFF2E3", border: "#FFE5D6", text: "#8A4300" },
  magenta: { bg: "#FFF0F9", border: "#FFE3F4", text: "#A30463" },
  purple: { bg: "#F8F2FF", border: "#F2E6FF", text: "#6C37A1" },
  blue: { bg: "#E6F7FF", border: "#D1F1FF", text: "#005780" },
  green: { bg: "#ECFDF5", border: "#D1FAE5", text: "#065F46" },
};

const procAbbrev: Record<string, string> = {
  crown: "Cr",
  bridge: "Br",
  veneer: "Vn",
  inlay: "In",
  onlay: "On",
  eggshell: "Eg",
  mockup: "Mk",
  missing: "—",
  "implant-based": "Im",
};

function ToothIcon({ number, color: iconColor }: { number: number; color: string }) {
  const isUpper = number <= 28;
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
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
  const colorPalette = color ? tagColors[color] : null;
  const hasProc = !!procedure;

  const bgColor = colorPalette
    ? colorPalette.bg
    : selected ? "#F3F4F6"
    : hovered ? "#F9FAFB"
    : "white";

  const borderColor = expanded
    ? "#374151"
    : colorPalette ? colorPalette.border
    : selected ? "#9CA3AF"
    : hovered ? "#9CA3AF"
    : "#E5E7EB";

  const textColor = colorPalette
    ? colorPalette.text
    : selected ? "#1e2939"
    : "#374151";

  const iconColor = colorPalette ? colorPalette.text : selected ? "#374151" : "#9CA3AF";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "1 1 0",
        minWidth: "36px",
        height: "56px",
        borderRadius: "6px",
        border: `${expanded ? "2px" : "1px"} solid ${borderColor}`,
        backgroundColor: bgColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.15s ease",
        gap: "1px",
        position: "relative",
      }}
    >
      <ToothIcon number={number} color={iconColor} />
      <span
        style={{
          fontSize: "10px",
          fontWeight: selected || colorPalette ? 600 : 500,
          color: textColor,
          fontFamily: "Inter, sans-serif",
          textDecoration: isMissing ? "line-through" : "none",
          lineHeight: 1,
        }}
      >
        {number}
      </span>
      {hasProc && (
        <span
          style={{
            position: "absolute",
            top: "-1px",
            right: "-1px",
            fontSize: "7px",
            fontWeight: 700,
            color: "white",
            backgroundColor: colorPalette ? colorPalette.text : "#6a7282",
            borderRadius: "0 5px 0 4px",
            padding: "1px 3px",
            lineHeight: 1.2,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {procAbbrev[procedure] || "?"}
        </span>
      )}
    </div>
  );
}
