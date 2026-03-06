import React from "react";
import type { InfoState, TagColor } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { FixedRestorativeConfig } from "./FixedRestorativeConfig";
import { StudyModelConfig } from "./StudyModelConfig";
import { InvisalignConfig } from "./InvisalignConfig";
import { ImplantPlanningConfig } from "./ImplantPlanningConfig";
import { DenturesConfig } from "./DenturesConfig";
import { ApplianceConfig } from "./ApplianceConfig";

interface ConfigSectionProps {
  state: InfoState;
  toothColorMap: Record<number, TagColor>;
  dispatch: React.Dispatch<InfoAction>;
}

export function ConfigSection({ state, toothColorMap, dispatch }: ConfigSectionProps) {
  if (!state.selectedProcedure) return null;

  const configMap: Record<string, React.ReactNode> = {
    "fixed-restorative": <FixedRestorativeConfig state={state} toothColorMap={toothColorMap} dispatch={dispatch} />,
    "study-model": <StudyModelConfig state={state} dispatch={dispatch} />,
    "invisalign": <InvisalignConfig state={state} dispatch={dispatch} />,
    "implant-planning": <ImplantPlanningConfig state={state} dispatch={dispatch} />,
    "dentures": <DenturesConfig state={state} dispatch={dispatch} />,
    "appliance": <ApplianceConfig state={state} dispatch={dispatch} />,
  };

  return (
    <section>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: 600,
          color: "#1e2939",
          fontFamily: "Inter, sans-serif",
          marginBottom: "16px",
        }}
      >
        Configuration
      </h3>
      {configMap[state.selectedProcedure]}
    </section>
  );
}
