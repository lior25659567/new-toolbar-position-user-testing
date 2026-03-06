import React from "react";
import type { InfoState } from "../../types";
import type { InfoAction } from "../../state/infoReducer";
import { DropdownList, RadioGroup, RadioItem } from "../../../design-system";
import { DENTURE_TYPES, DENTURE_STAGES, DENTURE_MOULDS, SHADE_SYSTEMS, SHADE_OPTIONS } from "../../constants";
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

export function DenturesConfig({ state, dispatch }: Props) {
  const shadeOptions = state.dentureShadeSystem
    ? (SHADE_OPTIONS[state.dentureShadeSystem] || []).map((s) => ({ value: s, label: s }))
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Card 1: Scheduling */}
      <div style={cardStyle}>
        <div style={cardTitleStyle}>Scheduling</div>
        <DueDateSendTo dueDate={state.dueDate} sendTo={state.sendTo} dispatch={dispatch} />
      </div>

      {/* Card 2: Denture Configuration */}
      <div style={cardStyle}>
        <div style={cardTitleStyle}>Denture Configuration</div>
        <div style={{ marginBottom: "16px" }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <DropdownList
            label="Denture type"
            required
            fullWidth
            placeholder="Select type"
            options={DENTURE_TYPES}
            value={state.dentureType}
            onChange={(v) => dispatch({ type: "SET_DENTURE_TYPE", value: v })}
          />
          <DropdownList
            label="Stage"
            required
            fullWidth
            placeholder="Select stage"
            options={DENTURE_STAGES}
            value={state.dentureStage}
            onChange={(v) => dispatch({ type: "SET_DENTURE_STAGE", value: v })}
          />
          <DropdownList
            label="Mould"
            fullWidth
            placeholder="Select mould"
            options={DENTURE_MOULDS}
            value={state.dentureMould}
            onChange={(v) => dispatch({ type: "SET_DENTURE_MOULD", value: v })}
          />
          <DropdownList
            label="Shade system"
            fullWidth
            placeholder="Select"
            options={SHADE_SYSTEMS}
            value={state.dentureShadeSystem}
            onChange={(v) => dispatch({ type: "SET_DENTURE_SHADE_SYSTEM", value: v })}
          />
          <DropdownList
            label="Teeth shade"
            fullWidth
            placeholder={state.dentureShadeSystem ? "Select" : "Select system first"}
            options={shadeOptions}
            value={state.dentureTeethShade}
            disabled={!state.dentureShadeSystem}
            onChange={(v) => dispatch({ type: "SET_DENTURE_TEETH_SHADE", value: v })}
          />
          <DropdownList
            label="Gingival shade"
            fullWidth
            placeholder="Select"
            options={[
              { value: "light", label: "Light Pink" },
              { value: "medium", label: "Medium Pink" },
              { value: "dark", label: "Dark Pink" },
              { value: "natural", label: "Natural" },
            ]}
            value={state.dentureGingival}
            onChange={(v) => dispatch({ type: "SET_DENTURE_GINGIVAL", value: v })}
          />
        </div>
      </div>

      {/* Card 3: Scan Options */}
      <div style={cardStyle}>
        <div style={cardTitleStyle}>Scan Options</div>
        <ScanOptionsCheckboxes procedure="dentures" scanOptions={state.scanOptions} dispatch={dispatch} />
      </div>

      {/* Card 4: Notes & Attachments side by side */}
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
