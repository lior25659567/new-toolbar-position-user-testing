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

export function ToothArc({ teeth, selectedTeeth, toothSpecs, toothColorMap, expandedTeeth, onToothClick, label }: ToothArcProps) {
  return (
    <div>
      <div style={{ display: "flex", gap: "3px" }}>
        {teeth.map((num) => {
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
        })}
      </div>
    </div>
  );
}
