import React, { useState } from "react";
import type { ProcedureType } from "../../types";

interface ProcedureCardProps {
  id: ProcedureType;
  name: string;
  description: string;
  icon: string;
  selected: boolean;
  disabled: boolean;
  onSelect: (id: ProcedureType) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  study: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  invisalign: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  restorative: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  ),
  implant: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v6M9 8h6M10 8l-1 12h6l-1-12" />
    </svg>
  ),
  dentures: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
  appliance: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
};

export function ProcedureCard({ id, name, description, icon, selected, disabled, onSelect }: ProcedureCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => !disabled && onSelect(id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "20px",
        borderRadius: "8px",
        border: selected ? "2px solid #009ACE" : "1px solid #E5E5E5",
        backgroundColor: selected ? "#E0F2FE" : hovered && !disabled ? "#F9FAFB" : "white",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s ease",
        transform: hovered && !disabled ? "translateY(-2px)" : "none",
        boxShadow: hovered && !disabled ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
        minHeight: "120px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div style={{ color: selected ? "#009ACE" : "#6a7282" }}>
        {iconMap[icon] || iconMap.study}
      </div>
      <div
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: selected ? "#005780" : "#1e2939",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontSize: "13px",
          color: selected ? "#007BA3" : "#6a7282",
          fontFamily: "Inter, sans-serif",
          lineHeight: "1.4",
        }}
      >
        {description}
      </div>
    </div>
  );
}
