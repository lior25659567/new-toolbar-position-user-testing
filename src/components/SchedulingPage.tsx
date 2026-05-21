import React, { useMemo, useReducer } from 'react';
import { Notification } from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';
import {
  scheduleReducer,
  initScheduleState,
  STATUS_LABEL,
} from './dscore/scheduling/scheduleState';
import { applyScheduleFilters, conflictDigest } from './dscore/scheduling/scheduleAggregator';
import { ScheduleKpiStrip } from './dscore/scheduling/ScheduleKpiStrip';
import { ScheduleFilters } from './dscore/scheduling/ScheduleFilters';
import { ScheduleGrid } from './dscore/scheduling/ScheduleGrid';
import { AppointmentDetailPanel } from './dscore/scheduling/AppointmentDetailPanel';
import { WaitlistPanel } from './dscore/scheduling/WaitlistPanel';
import { NewAppointmentModal } from './dscore/scheduling/NewAppointmentModal';
import { CONFLICT_LABEL } from './dscore/scheduling/scheduleState';

interface SchedulingPageProps {
  onBackToHome?: () => void;
  onNavigate?: (id: DSCoreNavId) => void;
}

export default function SchedulingPage({ onBackToHome, onNavigate }: SchedulingPageProps) {
  const [state, dispatch] = useReducer(scheduleReducer, undefined, () => initScheduleState());

  const allAppointments = useMemo(
    () => state.order.map((id) => state.appointments[id]).filter(Boolean),
    [state.appointments, state.order],
  );

  const dayAppointments = useMemo(
    () => applyScheduleFilters(allAppointments, state.filters).filter((a) => a.status !== 'cancelled'),
    [allAppointments, state.filters],
  );

  const conflicts = useMemo(() => conflictDigest(dayAppointments), [dayAppointments]);
  const conflictIds = useMemo(() => new Set(conflicts.map((c) => c.id)), [conflicts]);

  const selectedAppointment = state.selectedAppointmentId
    ? state.appointments[state.selectedAppointmentId]
    : null;

  return (
    <DSCoreShell
      active="scheduling"
      unread={0}
      onNavigate={(id) => {
        if (id === 'home' && onBackToHome) onBackToHome();
        else onNavigate?.(id);
      }}
    >
      <div style={{ maxWidth: '1480px', margin: '0 auto', padding: '32px 32px 80px' }}>
        <header style={{ marginBottom: '20px' }}>
          <h1
            style={{
              fontFamily: 'var(--ads-font-sans)',
              fontWeight: 500,
              fontSize: '28px',
              lineHeight: '36px',
              letterSpacing: '-0.01em',
              color: 'var(--ads-text-primary)',
              margin: 0,
            }}
          >
            Schedule
          </h1>
          <p
            style={{
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '14px',
              lineHeight: '20px',
              color: 'var(--ads-text-muted)',
              margin: '6px 0 0',
            }}
          >
            Multi-resource calendar across operatories and providers. Drag an appointment to reschedule; double-click an empty slot to book; pull from the waitlist when you have an opening.
          </p>
        </header>

        <ScheduleKpiStrip appointments={allAppointments} dateISO={state.filters.date} />

        <ScheduleFilters
          filters={state.filters}
          onChange={(patch) => dispatch({ type: 'SET_FILTERS', patch })}
          onNewAppointment={() => dispatch({ type: 'OPEN_NEW_APPT', date: state.filters.date })}
        />

        {conflicts.length > 0 && (
          <Notification
            type="warning"
            title={`${conflicts.length} conflict${conflicts.length === 1 ? '' : 's'} detected`}
            style={{ marginBottom: '16px' }}
          >
            <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {conflicts.slice(0, 4).map((c) => {
                const a = state.appointments[c.id];
                return (
                  <li key={c.id} style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
                    <strong>{a?.patientName ?? 'Unknown'}</strong> · {STATUS_LABEL[a?.status ?? 'scheduled']} —{' '}
                    {c.reasons.map((r) => CONFLICT_LABEL[r]).join('; ')}
                  </li>
                );
              })}
              {conflicts.length > 4 && (
                <li style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-muted)' }}>
                  …and {conflicts.length - 4} more.
                </li>
              )}
            </ul>
          </Notification>
        )}

        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <ScheduleGrid
              filters={state.filters}
              appointments={dayAppointments}
              selectedId={state.selectedAppointmentId}
              conflictIds={conflictIds}
              dispatch={dispatch}
            />
          </div>
          <WaitlistPanel
            waitlist={state.waitlist}
            appointments={dayAppointments}
            dateISO={state.filters.date}
            dispatch={dispatch}
          />
        </div>
      </div>

      <AppointmentDetailPanel
        appointment={selectedAppointment}
        onClose={() => dispatch({ type: 'SELECT_APPT', id: null })}
        dispatch={dispatch}
      />

      {state.newApptDraft.open && (
        <NewAppointmentModal
          draft={state.newApptDraft}
          appointments={dayAppointments}
          onClose={() => dispatch({ type: 'CLOSE_NEW_APPT' })}
          dispatch={dispatch}
        />
      )}
    </DSCoreShell>
  );
}
