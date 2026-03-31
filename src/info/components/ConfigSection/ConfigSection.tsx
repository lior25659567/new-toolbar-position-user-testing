import React from "react";
import type { InfoState } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { FixedRestorativeConfig } from "./FixedRestorativeConfig";
import { StudyModelConfig } from "./StudyModelConfig";
import { InvisalignConfig } from "./InvisalignConfig";
import { ImplantPlanningConfig } from "./ImplantPlanningConfig";
import { DenturesConfig } from "./DenturesConfig";
import { ApplianceConfig } from "./ApplianceConfig";

interface ConfigSectionProps {
  state: InfoState;
  toothColorMap: Record<number, string>;
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
      {configMap[state.selectedProcedure]}
    </section>
  );
}
