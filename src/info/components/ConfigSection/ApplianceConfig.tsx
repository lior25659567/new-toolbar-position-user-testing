import React from "react";
import type { InfoState } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { RadioGroup, RadioItem } from "../../../design-system";
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

export function ApplianceConfig({ state, dispatch }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={cardStyle}>
        <div style={{ fontSize: "12px", fontWeight: 400, color: "#6a7282", fontFamily: "Inter, sans-serif", marginBottom: "8px" }}>
          Arch
        </div>
        <RadioGroup
          name="arch"
          value={state.archSelection}
          onChange={(v) => dispatch({ type: "SET_ARCH_SELECTION", value: v as any })}
          style={{ flexDirection: "row", gap: "24px" }}
        >
          <RadioItem value="upper" label="Upper" />
          <RadioItem value="lower" label="Lower" />
          <RadioItem value="both" label="Both" />
        </RadioGroup>
      </div>

      <div style={cardStyle}>
        <ScanOptionsCheckboxes procedure="appliance" scanOptions={state.scanOptions} dispatch={dispatch} />
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
