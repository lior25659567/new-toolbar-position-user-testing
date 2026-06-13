import React, { useMemo, useState } from 'react';
import {
  DropdownList,
  Modal,
  PrimaryButton,
  SecondaryButton,
  Tag,
  TextInput,
} from '../../../design-system';
import {
  type Appointment,
  type ScheduleAction,
  type Specialty,
  OPERATORIES,
  PROCEDURE_TEMPLATES,
  PROVIDERS,
  buildSlotISO,
  canBookAt,
  CONFLICT_LABEL,
  fmtSlotTime,
} from './scheduleState';
import { PATIENTS } from '../data/labs';

export function NewAppointmentModal({
  draft,
  appointments,
  onClose,
  dispatch,
}: {
  draft: { open: true; date: string; startISO?: string; operatoryId?: string; providerId?: string; waitlistEntryId?: string };
  appointments: Appointment[];
  onClose: () => void;
  dispatch: React.Dispatch<ScheduleAction>;
}) {
  // Form state.
  const [patientId, setPatientId] = useState(PATIENTS[0]?.id ?? '');
  const [procedureId, setProcedureId] = useState(PROCEDURE_TEMPLATES[0].id);
  const [providerId, setProviderId] = useState(draft.providerId ?? PROVIDERS[0].id);
  const [operatoryId, setOperatoryId] = useState(draft.operatoryId ?? OPERATORIES[0].id);
  const [time, setTime] = useState(draft.startISO ? toLocalHHMM(draft.startISO) : '09:00');
  const [notes, setNotes] = useState('');

  const proc = PROCEDURE_TEMPLATES.find((p) => p.id === procedureId)!;

  // Build a candidate appointment so we can validate live.
  const candidate = useMemo(() => {
    const [hh, mm] = time.split(':').map(Number);
    const startISO = buildSlotISO(draft.date, hh, mm);
    return {
      startISO,
      durationMin: proc.durationMin,
      operatoryId,
      providerId,
      specialty: proc.specialty as Specialty,
    };
  }, [time, proc, operatoryId, providerId, draft.date]);

  const validation = useMemo(() => canBookAt(candidate, appointments), [candidate, appointments]);
  const ptValid = patientId !== '';
  const formOk = ptValid && validation.ok;

  const onCreate = () => {
    const patient = PATIENTS.find((p) => p.id === patientId)!;
    const newAppt: Omit<Appointment, 'id' | 'activity'> = {
      patientId,
      patientName: patient.name,
      providerId,
      operatoryId,
      procedureId,
      procedureLabel: proc.label,
      specialty: proc.specialty,
      startISO: candidate.startISO,
      durationMin: proc.durationMin,
      status: 'scheduled',
      notes: notes.trim() || undefined,
    };
    dispatch({ type: 'CREATE_APPT', appt: newAppt });
    if (draft.waitlistEntryId) {
      dispatch({ type: 'REMOVE_FROM_WAITLIST', id: draft.waitlistEntryId });
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="New appointment"
      size="md"
      footer={
        <>
          <SecondaryButton size={36} onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton size={36} disabled={!formOk} onClick={onCreate}>
            Book {fmtSlotTime(candidate.startISO)}
          </PrimaryButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <DropdownList
          label="Patient"
          required
          options={PATIENTS.map((p) => ({ value: p.id, label: p.name }))}
          value={patientId}
          onChange={setPatientId}
          fullWidth
        />
        <DropdownList
          label="Procedure"
          required
          options={PROCEDURE_TEMPLATES.map((p) => ({ value: p.id, label: `${p.label} · ${p.durationMin}min` }))}
          value={procedureId}
          onChange={setProcedureId}
          fullWidth
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <DropdownList
            label="Provider"
            required
            options={PROVIDERS.map((p) => ({ value: p.id, label: `${p.name} (${p.role === 'dentist' ? 'DDS' : 'RDH'})` }))}
            value={providerId}
            onChange={setProviderId}
            fullWidth
          />
          <DropdownList
            label="Operatory"
            required
            options={OPERATORIES.map((o) => ({ value: o.id, label: o.name }))}
            value={operatoryId}
            onChange={setOperatoryId}
            fullWidth
          />
        </div>
        <TextInput
          label="Start time"
          required
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          helper="HH:MM in 24-hour format"
          style={{ width: '160px' }}
        />
        <div>
          <label
            htmlFor="appt-notes"
            style={{ display: 'block', marginBottom: '6px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--ads-text-primary)' }}
          >
            Notes
          </label>
          <textarea
            id="appt-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Reason for visit, special considerations…"
            style={{
              width: '100%',
              padding: '10px 12px',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '13px',
              lineHeight: '20px',
              border: '1px solid var(--ads-border-subtle)',
              borderRadius: 'var(--ads-radius-sm)',
              resize: 'vertical',
              backgroundColor: 'var(--ads-bg-surface)',
              color: 'var(--ads-text-primary)',
            }}
          />
        </div>

        {!validation.ok && (
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: 'var(--ads-tag-red-bg)',
              border: '1px solid var(--ads-tag-red-br)',
              borderRadius: 'var(--ads-radius-sm)',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '13px',
              color: 'var(--ads-tag-red-fg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <strong>Cannot book this slot</strong>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              {validation.reasons.map((r, i) => (
                <li key={`${r}-${i}`}>{CONFLICT_LABEL[r]}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <Tag size="small" color={proc.tone}>{proc.specialty}</Tag>
          <Tag size="small" color="blue">{proc.durationMin}min</Tag>
        </div>
      </div>
    </Modal>
  );
}

function toLocalHHMM(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
