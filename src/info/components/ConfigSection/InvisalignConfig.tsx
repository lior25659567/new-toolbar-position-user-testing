import React from "react";
import type { InfoState } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { DropdownList } from "../../../design-system";
import { INVISALIGN_TYPES, TREATMENT_STAGES } from "../../constants";
import { ScanOptionsCheckboxes } from "./shared/ScanOptionsCheckboxes";
import { NotesField } from "./shared/NotesField";
import { AttachmentsUpload } from "./shared/AttachmentsUpload";

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

export function InvisalignConfig({ state, dispatch }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={cardStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <DropdownList
            label="Invisalign type"
            required
            fullWidth
            placeholder="Select type"
            options={INVISALIGN_TYPES}
            value={state.invisalignType}
            onChange={(v) => dispatch({ type: "SET_INVISALIGN_TYPE", value: v })}
          />
          <DropdownList
            label="Treatment stage"
            required
            fullWidth
            placeholder="Select stage"
            options={TREATMENT_STAGES}
            value={state.treatmentStage}
            onChange={(v) => dispatch({ type: "SET_TREATMENT_STAGE", value: v })}
          />
        </div>
      </div>
      <div style={cardStyle}>
        <ScanOptionsCheckboxes procedure="invisalign" scanOptions={state.scanOptions} dispatch={dispatch} />
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
