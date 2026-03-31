import React from "react";
import type { InfoState } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { DueDateSendTo } from "./shared/DueDateSendTo";
import { ScanOptionsCheckboxes } from "./shared/ScanOptionsCheckboxes";
import { AttachmentsUpload } from "./shared/AttachmentsUpload";
import { NotesField } from "./shared/NotesField";

interface Props {
  state: InfoState;
  dispatch: React.Dispatch<InfoAction>;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: "12px",
  border: "1px solid #E5E7EB",
  padding: "24px",
};

export function StudyModelConfig({ state, dispatch }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ ...cardStyle, overflow: "visible", position: "relative", zIndex: 10 }}>
        <DueDateSendTo dueDate={state.dueDate} sendTo={state.sendTo} dispatch={dispatch} />
      </div>
      <div style={cardStyle}>
        <ScanOptionsCheckboxes procedure="study-model" scanOptions={state.scanOptions} dispatch={dispatch} />
      </div>
      <div style={cardStyle}>
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
