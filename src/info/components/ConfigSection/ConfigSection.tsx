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
  /** When true, the per-procedure renderers skip Notes + Attachments
   *  (used by wizard variants that surface these in a dedicated step). */
  hideNotesAndAttachments?: boolean;
  /** When true, sub-sections render flat (no inner card chrome) so they
   *  can sit inside a single outer white card. Used by the wizard/rail
   *  Configuration step. */
  unified?: boolean;
}

export function ConfigSection({ state, toothColorMap, dispatch, hideNotesAndAttachments, unified }: ConfigSectionProps) {
  if (!state.selectedProcedure) return null;
  const noNotes = !!hideNotesAndAttachments;
  const flat = !!unified;

  const configMap: Record<string, React.ReactNode> = {
    "fixed-restorative": <FixedRestorativeConfig state={state} toothColorMap={toothColorMap} dispatch={dispatch} hideNotesAndAttachments={noNotes} unified={flat} />,
    "study-model": <StudyModelConfig state={state} dispatch={dispatch} hideNotesAndAttachments={noNotes} unified={flat} />,
    "invisalign": <InvisalignConfig state={state} dispatch={dispatch} hideNotesAndAttachments={noNotes} unified={flat} />,
    "implant-planning": <ImplantPlanningConfig state={state} dispatch={dispatch} hideNotesAndAttachments={noNotes} unified={flat} />,
    "dentures": <DenturesConfig state={state} dispatch={dispatch} hideNotesAndAttachments={noNotes} unified={flat} />,
    "appliance": <ApplianceConfig state={state} dispatch={dispatch} hideNotesAndAttachments={noNotes} unified={flat} />,
  };

  return (
    <section>
      {configMap[state.selectedProcedure]}
    </section>
  );
}
