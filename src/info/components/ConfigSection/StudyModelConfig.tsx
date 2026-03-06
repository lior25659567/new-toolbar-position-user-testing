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
  borderRadius: "10px",
  border: "1px solid #E5E7EB",
  padding: "20px",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#1e2939",
  fontFamily: "Inter, sans-serif",
  marginBottom: "16px",
};

export function StudyModelConfig({ state, dispatch }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Card 1: Scheduling */}
      <div style={cardStyle}>
        <div style={cardTitleStyle}>Scheduling</div>
        <DueDateSendTo dueDate={state.dueDate} sendTo={state.sendTo} dispatch={dispatch} />
      </div>

      {/* Card 2: Scan Options */}
      <div style={cardStyle}>
        <div style={cardTitleStyle}>Scan Options</div>
        <ScanOptionsCheckboxes procedure="study-model" scanOptions={state.scanOptions} dispatch={dispatch} />
      </div>

      {/* Card 3: Notes & Attachments side by side */}
      <div style={cardStyle}>
        <div style={cardTitleStyle}>Notes & Attachments</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "stretch" }}>
          <NotesField notes={state.notes} dispatch={dispatch} />
          <AttachmentsUpload attachments={state.attachments} dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
}
