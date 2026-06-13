import React from "react";
import type { InfoState } from "../types";
import type { InfoAction } from "../state/infoReducer";
import { NotesField } from "./ConfigSection/shared/NotesField";
import { AttachmentsUpload } from "./ConfigSection/shared/AttachmentsUpload";

interface Props {
  state: InfoState;
  dispatch: React.Dispatch<InfoAction>;
}

/**
 * Step body for the wizard's "Notes & Files" step (used by both the
 * horizontal Wizard and the vertical Rail variants). The same two fields
 * still live inside per-procedure configs for Classic mode; the wizard
 * variants suppress them there via `hideNotesAndAttachments` so this
 * step is the single place to fill them in those flows.
 */
export function NotesAndFilesStep({ state, dispatch }: Props) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
      <div style={cellStyle}>
        <NotesField notes={state.notes} dispatch={dispatch} />
      </div>
      <div style={cellStyle}>
        <AttachmentsUpload attachments={state.attachments} dispatch={dispatch} />
      </div>
    </div>
  );
}

const cellStyle: React.CSSProperties = {
  borderRadius: "var(--ads-radius-sm)",
  border: "1px solid var(--ads-border-subtle)",
  padding: "20px",
};
