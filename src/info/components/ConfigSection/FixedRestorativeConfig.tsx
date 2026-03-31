import React from "react";
import type { InfoState } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { DueDateSendTo } from "./shared/DueDateSendTo";
import { NotesField } from "./shared/NotesField";
import { AttachmentsUpload } from "./shared/AttachmentsUpload";
import { ToothChart } from "../ToothChart/ToothChart";
import { Toggle } from "../../../design-system";

interface Props {
  state: InfoState;
  toothColorMap: Record<number, string>;
  dispatch: React.Dispatch<InfoAction>;
}

const base: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: "12px",
  border: "1px solid #E5E7EB",
  padding: "24px",
  animation: "info-fade-in 0.35s ease-out both",
};

const d = (s: number): React.CSSProperties => ({ ...base, animationDelay: `${s}s` });

export function FixedRestorativeConfig({ state, toothColorMap, dispatch }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ ...d(0.12), overflow: "visible", position: "relative", zIndex: 10 }}>
        <DueDateSendTo dueDate={state.dueDate} sendTo={state.sendTo} dispatch={dispatch} />
      </div>

      <div style={d(0.18)}>
        <ToothChart state={state} toothColorMap={toothColorMap} dispatch={dispatch} title="Select teeth and assign procedures" />
      </div>

      <div style={d(0.24)}>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px" }}>
          <Toggle checked={state.scanOptions.niri} onChange={() => dispatch({ type: "TOGGLE_SCAN_OPTION", key: "niri" })} label="NIRI Capture" />
          <Toggle checked={state.scanOptions.sleeveAttached} onChange={() => dispatch({ type: "TOGGLE_SCAN_OPTION", key: "sleeveAttached" })} label="New Sleeve" />
          <Toggle checked={state.scanOptions.multiBite} onChange={() => dispatch({ type: "TOGGLE_SCAN_OPTION", key: "multiBite" })} label="Multi Bite" />
          <Toggle checked={state.scanOptions.preTreatment} onChange={() => dispatch({ type: "TOGGLE_SCAN_OPTION", key: "preTreatment" })} label="Pre Treatment" />
        </div>
      </div>

      <div style={d(0.3)}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div style={{ borderRadius: "10px", border: "1px solid #E5E7EB", padding: "20px" }}>
            <NotesField notes={state.notes} dispatch={dispatch} />
          </div>
          <div style={{ borderRadius: "10px", border: "1px solid #E5E7EB", padding: "20px" }}>
            <AttachmentsUpload attachments={state.attachments} dispatch={dispatch} />
          </div>
        </div>
      </div>
    </div>
  );
}
