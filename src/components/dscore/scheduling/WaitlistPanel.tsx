import React from 'react';
import { LinkButton, SecondaryButton, Tag } from '../../../design-system';
import {
  type Appointment,
  type ScheduleAction,
  type WaitlistEntry,
  OPERATORIES,
  SPECIALTY_LABEL,
} from './scheduleState';
import { nextOpenSlot } from './scheduleAggregator';

export function WaitlistPanel({
  waitlist,
  appointments,
  dateISO,
  dispatch,
}: {
  waitlist: WaitlistEntry[];
  appointments: Appointment[];
  dateISO: string;
  dispatch: React.Dispatch<ScheduleAction>;
}) {
  return (
    <aside
      style={{
        width: '300px',
        flexShrink: 0,
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: 'fit-content',
        position: 'sticky',
        top: '16px',
      }}
    >
      <header>
        <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '14px', color: 'var(--ads-text-primary)' }}>
          Waitlist
        </h3>
        <p style={{ margin: '4px 0 0', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
          {waitlist.length} patient{waitlist.length === 1 ? '' : 's'} ready to fill openings.
        </p>
      </header>

      {waitlist.length === 0 ? (
        <div style={{ padding: '24px 0', textAlign: 'center', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
          Waitlist is empty.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {waitlist.map((w) => (
            <WaitlistRow
              key={w.id}
              entry={w}
              appointments={appointments}
              dateISO={dateISO}
              dispatch={dispatch}
            />
          ))}
        </div>
      )}
    </aside>
  );
}

function WaitlistRow({
  entry,
  appointments,
  dateISO,
  dispatch,
}: {
  entry: WaitlistEntry;
  appointments: Appointment[];
  dateISO: string;
  dispatch: React.Dispatch<ScheduleAction>;
}) {
  // Find the first operatory that supports this specialty + has an open slot.
  const candidates = OPERATORIES.filter((o) => o.capabilities.includes(entry.specialty));
  const suggestion = (() => {
    for (const op of candidates) {
      const slot = nextOpenSlot(appointments, dateISO, entry.durationMin, op.id);
      if (slot) return { operatoryId: op.id, slot };
    }
    return null;
  })();

  return (
    <div
      style={{
        padding: '10px 12px',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
        backgroundColor: 'var(--ads-bg-page)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', alignItems: 'baseline' }}>
        <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>
          {entry.patientName}
        </span>
        <Tag size="small" color="orange">{entry.durationMin}m</Tag>
      </div>
      <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
        {entry.procedureLabel} · {SPECIALTY_LABEL[entry.specialty]}
      </div>
      {entry.preference && (
        <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '11px', color: 'var(--ads-text-muted)' }}>
          Prefers: {entry.preference}
        </div>
      )}
      {suggestion ? (
        <div
          style={{
            marginTop: '4px',
            padding: '6px 8px',
            backgroundColor: 'var(--ads-tag-green-bg)',
            border: '1px solid var(--ads-tag-green-br)',
            borderRadius: 'var(--ads-radius-sm)',
            fontFamily: 'var(--ads-font-sans)',
            fontSize: '11px',
            color: 'var(--ads-tag-green-fg)',
          }}
        >
          Open slot: {new Date(suggestion.slot).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} · {OPERATORIES.find((o) => o.id === suggestion.operatoryId)?.name}
        </div>
      ) : (
        <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '11px', color: 'var(--ads-text-muted)' }}>
          No open slot today.
        </div>
      )}
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
        <SecondaryButton
          size={36}
          disabled={!suggestion}
          onClick={() => suggestion && dispatch({
            type: 'OPEN_NEW_APPT',
            date: dateISO,
            startISO: suggestion.slot,
            operatoryId: suggestion.operatoryId,
            waitlistEntryId: entry.id,
          })}
        >
          Book
        </SecondaryButton>
        <LinkButton onClick={() => dispatch({ type: 'REMOVE_FROM_WAITLIST', id: entry.id })}>
          Remove
        </LinkButton>
      </div>
    </div>
  );
}
