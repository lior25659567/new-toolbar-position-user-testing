import React, { useState, useEffect } from 'react';
import { TextInput, DropdownList, PrimaryButton, SecondaryButton } from '../../design-system';
import type { SettingsState, SettingsAction } from './settingsState';
import { SectionCard, SettingRow } from './sectionShared';

const TIMEZONES = [
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PT)' },
  { value: 'America/Denver',      label: 'America/Denver (MT)' },
  { value: 'America/Chicago',     label: 'America/Chicago (CT)' },
  { value: 'America/New_York',    label: 'America/New_York (ET)' },
  { value: 'Europe/London',       label: 'Europe/London (BST)' },
  { value: 'Europe/Berlin',       label: 'Europe/Berlin (CET)' },
  { value: 'Asia/Tokyo',          label: 'Asia/Tokyo (JST)' },
  { value: 'UTC',                 label: 'UTC' },
];

export function GeneralSection({
  state,
  dispatch,
}: {
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
}) {
  const [draft, setDraft] = useState(state.general);

  useEffect(() => {
    setDraft(state.general);
  }, [state.general]);

  const dirty =
    draft.workspaceName !== state.general.workspaceName ||
    draft.address !== state.general.address ||
    draft.timezone !== state.general.timezone ||
    draft.workingHoursStart !== state.general.workingHoursStart ||
    draft.workingHoursEnd !== state.general.workingHoursEnd;

  const onSave = () => {
    if (!dirty) return;
    dispatch({ type: 'UPDATE_GENERAL', patch: draft });
  };

  const onReset = () => setDraft(state.general);

  return (
    <>
      <SectionCard title="Workspace identity" description="The name and address shown to teammates and on patient-facing documents.">
        <SettingRow label="Workspace name" helper="Shown in the breadcrumb and on outgoing emails.">
          <TextInput
            fullWidth
            value={draft.workspaceName}
            onChange={(e) => setDraft({ ...draft, workspaceName: e.target.value })}
          />
        </SettingRow>
        <SettingRow label="Practice address" helper="Used on invoices and treatment-plan presentations.">
          <TextInput
            fullWidth
            value={draft.address}
            onChange={(e) => setDraft({ ...draft, address: e.target.value })}
          />
        </SettingRow>
      </SectionCard>

      <SectionCard title="Hours & locale" description="Used for SLA windows, scheduling, and audit log timestamps.">
        <SettingRow label="Timezone" helper="Drives every relative time shown in this workspace.">
          <DropdownList
            fullWidth
            options={TIMEZONES}
            value={draft.timezone}
            onChange={(value) => setDraft({ ...draft, timezone: value })}
          />
        </SettingRow>
        <SettingRow label="Working hours" helper="Cases due outside these hours don't count toward SLA.">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <TextInput
              type="text"
              value={draft.workingHoursStart}
              onChange={(e) => setDraft({ ...draft, workingHoursStart: e.target.value })}
              style={{ width: '120px' }}
            />
            <span style={{ color: 'var(--ads-text-muted)', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>to</span>
            <TextInput
              type="text"
              value={draft.workingHoursEnd}
              onChange={(e) => setDraft({ ...draft, workingHoursEnd: e.target.value })}
              style={{ width: '120px' }}
            />
          </div>
        </SettingRow>
      </SectionCard>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <SecondaryButton size={36} disabled={!dirty} onClick={onReset}>
          Discard
        </SecondaryButton>
        <PrimaryButton size={36} disabled={!dirty} onClick={onSave}>
          Save changes
        </PrimaryButton>
      </div>
    </>
  );
}
