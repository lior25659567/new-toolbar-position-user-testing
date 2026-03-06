import React, { useState } from "react";
import type { Patient } from "../../types";
import { TextInput, DatePicker, RadioGroup, RadioItem, PrimaryButton, SecondaryButton } from "../../../design-system";

interface PatientFormProps {
  onSave: (patient: Patient) => void;
  onCancel: () => void;
}

export function PatientForm({ onSave, onCancel }: PatientFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [chartNumber, setChartNumber] = useState("");

  const canSave = firstName.trim() && lastName.trim() && dateOfBirth;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      id: `p-${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      dateOfBirth,
      chartNumber: chartNumber.trim() || `CH-${Date.now().toString().slice(-4)}`,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <TextInput
            label="First name"
            required
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
          />
        </div>
        <div style={{ flex: 1 }}>
          <TextInput
            label="Last name"
            required
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
          />
        </div>
      </div>

      <RadioGroup
        name="gender"
        value={gender}
        onChange={(v) => setGender(v as "male" | "female" | "other")}
        style={{ flexDirection: "row", gap: "24px" }}
      >
        <RadioItem value="male" label="Male" />
        <RadioItem value="female" label="Female" />
        <RadioItem value="other" label="Other" />
      </RadioGroup>

      <div style={{ display: "flex", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <DatePicker
            label="Date of birth"
            required
            fullWidth
            value={dateOfBirth}
            onChange={setDateOfBirth}
          />
        </div>
        <div style={{ flex: 1 }}>
          <TextInput
            label="Chart number"
            fullWidth
            value={chartNumber}
            onChange={(e) => setChartNumber(e.target.value)}
            placeholder="Auto-generated"
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <SecondaryButton size={36} onClick={onCancel}>
          Cancel
        </SecondaryButton>
        <PrimaryButton size={36} onClick={handleSave} disabled={!canSave}>
          Save Patient
        </PrimaryButton>
      </div>
    </div>
  );
}
