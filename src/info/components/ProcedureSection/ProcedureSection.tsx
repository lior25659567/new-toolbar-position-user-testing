import React from "react";
import type { ProcedureType } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { PROCEDURES } from "../../constants";
import { ProcedureCard } from "./ProcedureCard";

interface ProcedureSectionProps {
  selectedProcedure: ProcedureType | null;
  hasPatient: boolean;
  dispatch: React.Dispatch<InfoAction>;
}

export function ProcedureSection({ selectedProcedure, hasPatient, dispatch }: ProcedureSectionProps) {
  return (
    <section style={{ opacity: hasPatient ? 1 : 0.4, pointerEvents: hasPatient ? "auto" : "none", transition: "opacity 0.3s" }}>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: 600,
          color: "#1e2939",
          fontFamily: "Inter, sans-serif",
          marginBottom: "16px",
        }}
      >
        Procedure
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        {PROCEDURES.map((proc) => (
          <ProcedureCard
            key={proc.id}
            id={proc.id}
            name={proc.name}
            description={proc.description}
            icon={proc.icon}
            selected={selectedProcedure === proc.id}
            disabled={!hasPatient}
            onSelect={(id) => dispatch({ type: "SET_PROCEDURE", procedure: id })}
          />
        ))}
      </div>
    </section>
  );
}
