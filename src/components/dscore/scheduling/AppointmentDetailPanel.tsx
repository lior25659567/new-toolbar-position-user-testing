import React from 'react';
import { Avatar, PrimaryButton, SecondaryButton, Tag, WarningButton, type TagColor } from '../../../design-system';
import { SlideOverPanel } from '../shared/SlideOverPanel';
import { ActivityFeed } from '../shared/ActivityFeed';
import {
  type Appointment,
  type AppointmentStatus,
  type ScheduleAction,
  STATUS_LABEL,
  appointmentEndISO,
  fmtSlotTime,
  findOperatory,
  findProvider,
  findProcedure,
  SPECIALTY_LABEL,
} from './scheduleState';

const STATUS_TONE: Record<AppointmentStatus, TagColor> = {
  scheduled: 'blue',
  confirmed: 'blue',
  'checked-in': 'green',
  'in-treatment': 'orange',
  completed: 'green',
  'no-show': 'red',
  cancelled: 'red',
};

const NEXT_STATUS: Partial<Record<AppointmentStatus, { to: AppointmentStatus; label: string }>> = {
  scheduled:    { to: 'confirmed',    label: 'Confirm' },
  confirmed:    { to: 'checked-in',   label: 'Check in' },
  'checked-in': { to: 'in-treatment', label: 'Start treatment' },
  'in-treatment':{ to: 'completed',    label: 'Complete' },
};

export function AppointmentDetailPanel({
  appointment,
  onClose,
  dispatch,
}: {
  appointment: Appointment | null;
  onClose: () => void;
  dispatch: React.Dispatch<ScheduleAction>;
}) {
  return (
    <SlideOverPanel
      open={appointment !== null}
      onClose={onClose}
      title={appointment ? `${appointment.patientName} · ${appointment.procedureLabel}` : ''}
      width={520}
    >
      {appointment && <Body appointment={appointment} dispatch={dispatch} />}
    </SlideOverPanel>
  );
}

function Body({
  appointment,
  dispatch,
}: {
  appointment: Appointment;
  dispatch: React.Dispatch<ScheduleAction>;
}) {
  const op = findOperatory(appointment.operatoryId);
  const provider = findProvider(appointment.providerId);
  const proc = findProcedure(appointment.procedureId);
  const next = NEXT_STATUS[appointment.status];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '0 24px 16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingBottom: '14px',
            borderBottom: '1px solid var(--ads-border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <Avatar name={appointment.patientName.split(' ').map((s) => s[0]).slice(0, 2).join('')} size="md" />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>
                {appointment.patientName}
              </div>
              <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                {fmtSlotTime(appointment.startISO)} – {fmtSlotTime(appointmentEndISO(appointment))} · {appointment.durationMin}min
              </div>
            </div>
          </div>
          <Tag color={STATUS_TONE[appointment.status]} size="medium">
            {STATUS_LABEL[appointment.status]}
          </Tag>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 120px) minmax(0, 1fr)', gap: '8px 16px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', marginBottom: '20px' }}>
          {[
            ['Procedure',   `${proc?.label ?? appointment.procedureLabel} · ${SPECIALTY_LABEL[appointment.specialty]}`],
            ['Provider',    provider ? `${provider.name} (${provider.role === 'dentist' ? 'DDS' : 'RDH'})` : '—'],
            ['Operatory',   op?.name ?? '—'],
            ['Date',        new Date(appointment.startISO).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })],
          ].map(([k, v]) => (
            <React.Fragment key={k}>
              <div style={{ color: 'var(--ads-text-muted)' }}>{k}</div>
              <div style={{ color: 'var(--ads-text-primary)' }}>{v}</div>
            </React.Fragment>
          ))}
        </div>

        {appointment.notes && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
              Notes
            </div>
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: 'var(--ads-bg-page)',
                border: '1px solid var(--ads-border-subtle)',
                borderRadius: 'var(--ads-radius-sm)',
                fontFamily: 'var(--ads-font-sans)',
                fontSize: '13px',
                lineHeight: '18px',
                color: 'var(--ads-text-primary)',
              }}
            >
              {appointment.notes}
            </div>
          </div>
        )}

        <div>
          <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
            Activity
          </div>
          <ActivityFeed events={appointment.activity} />
        </div>
      </div>

      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          gap: '8px',
          padding: '14px 24px',
          borderTop: '1px solid var(--ads-border-subtle)',
          backgroundColor: 'var(--ads-bg-surface)',
          flexWrap: 'wrap',
        }}
      >
        {next && (
          <PrimaryButton
            size={36}
            onClick={() => dispatch({ type: 'CHANGE_STATUS', id: appointment.id, status: next.to })}
          >
            {next.label}
          </PrimaryButton>
        )}
        {appointment.status !== 'no-show' && appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
          <SecondaryButton
            size={36}
            onClick={() => dispatch({ type: 'CHANGE_STATUS', id: appointment.id, status: 'no-show' })}
          >
            Mark no-show
          </SecondaryButton>
        )}
        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
          <WarningButton
            size={36}
            onClick={() => dispatch({ type: 'CANCEL_APPT', id: appointment.id })}
          >
            Cancel
          </WarningButton>
        )}
      </div>
    </div>
  );
}
