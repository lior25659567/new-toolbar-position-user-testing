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
  hideNotesAndAttachments?: boolean;
  unified?: boolean;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: "var(--ads-radius-md)",
  border: "1px solid var(--ads-border-subtle)",
  padding: "24px",
};

export function ApplianceConfig({ state, dispatch, hideNotesAndAttachments, unified }: Props) {
  const cs: React.CSSProperties = unified ? {} : cardStyle;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: unified ? "24px" : "16px" }}>
      <div style={cs}>
        <div style={{ fontSize: "12px", fontWeight: 400, color: "var(--ads-text-muted)", fontFamily: "var(--ads-font-sans)", marginBottom: "8px" }}>
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

      <div style={cs}>
        <ScanOptionsCheckboxes procedure="appliance" scanOptions={state.scanOptions} dispatch={dispatch} />
      </div>

      {!hideNotesAndAttachments && (
        <div style={cs}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div style={{ borderRadius: "var(--ads-radius-sm)", border: "1px solid var(--ads-border-subtle)", padding: "20px" }}>
              <NotesField notes={state.notes} dispatch={dispatch} />
            </div>
            <div style={{ borderRadius: "var(--ads-radius-sm)", border: "1px solid var(--ads-border-subtle)", padding: "20px" }}>
              <AttachmentsUpload attachments={state.attachments} dispatch={dispatch} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
