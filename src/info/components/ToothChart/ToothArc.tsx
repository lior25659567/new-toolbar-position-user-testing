import React from "react";
import type { ToothSpec } from "../../types";
import { Tooth } from "./Tooth";

interface ToothArcProps {
  teeth: number[];
  selectedTeeth: number[];
  toothSpecs: ToothSpec[];
  toothColorMap: Record<number, string>;
  expandedTeeth: number[];
  onToothClick: (num: number, e?: React.MouseEvent) => void;
  label: string;
}

export function ToothArc({ teeth, selectedTeeth, toothSpecs, toothColorMap, expandedTeeth, onToothClick }: ToothArcProps) {
  // The arch has 16 teeth split into a left half (idx 0..7) and a right
  // half (idx 8..15). A faint vertical line between halves mirrors the
  // dental midline in the reference chart.
  const mid = teeth.length / 2;
  const renderTooth = (num: number) => {
    const spec = toothSpecs.find((s) => s.toothNumber === num);
    return (
      <Tooth
        key={num}
        number={num}
        selected={selectedTeeth.includes(num)}
        color={toothColorMap[num]}
        procedure={spec?.procedure}
        expanded={expandedTeeth.includes(num)}
        onClick={(e) => onToothClick(num, e)}
      />
    );
  };
  return (
    <div style={{ display: "flex", alignItems: "stretch" }}>
      <div style={{ flex: 1, display: "flex", gap: "8px" }}>
        {teeth.slice(0, mid).map(renderTooth)}
      </div>
      {/* Midline spacer (divider line removed). */}
      <div style={{ width: "49px", flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", gap: "8px" }}>
        {teeth.slice(mid).map(renderTooth)}
      </div>
    </div>
  );
}
