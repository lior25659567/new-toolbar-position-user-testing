import React from "react";
import type { InfoAction } from "../../../state/infoReducer";
import { DatePicker, DropdownList } from "../../../../design-system";
import { LAB_DESTINATIONS } from "../../../constants";

interface DueDateSendToProps {
  dueDate: string;
  sendTo: string;
  dispatch: React.Dispatch<InfoAction>;
}

export function DueDateSendTo({ dueDate, sendTo, dispatch }: DueDateSendToProps) {
  return (
    <div style={{ display: "flex", gap: "12px" }}>
      <div style={{ flex: 1 }}>
        <DropdownList
          label="Send to"
          required
          fullWidth
          placeholder="Select lab"
          options={LAB_DESTINATIONS}
          value={sendTo}
          onChange={(v) => dispatch({ type: "SET_SEND_TO", value: v })}
        />
      </div>
      <div style={{ flex: 1 }}>
        <DatePicker
          label="Due date"
          required
          fullWidth
          value={dueDate}
          onChange={(v) => dispatch({ type: "SET_DUE_DATE", date: v })}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>
    </div>
  );
}
