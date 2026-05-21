import React from 'react';
import { Checkbox, SecondaryButton } from '../../design-system';
import {
  type SettingsState,
  type SettingsAction,
  type NotificationChannel,
  type NotificationEvent,
  NOTIFICATION_EVENT_LABEL,
} from './settingsState';
import { SectionCard } from './sectionShared';

const EVENTS: NotificationEvent[] = [
  'case-status-change',
  'message-received',
  'plan-presented',
  'plan-accepted',
  'invoice-paid',
  'invoice-failed',
  'sla-risk',
  'team-invite-accepted',
];

const CHANNELS: { id: NotificationChannel; label: string; helper: string }[] = [
  { id: 'email', label: 'Email', helper: 'Sent to your account email.' },
  { id: 'sms',   label: 'SMS',   helper: 'Charged to your plan beyond included credits.' },
  { id: 'push',  label: 'Push',  helper: 'Browser and mobile push notifications.' },
];

const DIGESTS: { id: 'off' | 'daily' | 'weekly'; label: string }[] = [
  { id: 'off',    label: 'Off' },
  { id: 'daily',  label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
];

export function NotificationsSection({
  state,
  dispatch,
}: {
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
}) {
  return (
    <>
      <SectionCard title="Channels" description="Choose how you receive each event. Toggling a channel applies just to your account.">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 80px 80px 80px',
            alignItems: 'center',
            gap: '4px 16px',
          }}
        >
          <div />
          {CHANNELS.map((c) => (
            <div
              key={c.id}
              style={{
                fontFamily: 'var(--ads-font-sans)',
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--ads-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                textAlign: 'center',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--ads-border-subtle)',
              }}
            >
              {c.label}
            </div>
          ))}
          {EVENTS.map((event) => (
            <React.Fragment key={event}>
              <div
                style={{
                  fontFamily: 'var(--ads-font-sans)',
                  fontSize: '13px',
                  color: 'var(--ads-text-primary)',
                  padding: '14px 0',
                  borderBottom: '1px solid var(--ads-border-subtle)',
                }}
              >
                {NOTIFICATION_EVENT_LABEL[event]}
              </div>
              {CHANNELS.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '14px 0',
                    borderBottom: '1px solid var(--ads-border-subtle)',
                  }}
                >
                  <Checkbox
                    checked={state.notifications.prefs[event][c.id]}
                    onChange={() => dispatch({ type: 'TOGGLE_PREF', event, channel: c.id })}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Daily digest" description="Get a single summary of activity instead of one notification per event.">
        <div style={{ display: 'inline-flex', gap: '6px', padding: '4px', backgroundColor: 'var(--ads-bg-page)', borderRadius: 'var(--ads-radius-sm)' }}>
          {DIGESTS.map((d) => {
            const isActive = state.notifications.digestFrequency === d.id;
            return (
              <SecondaryButton
                key={d.id}
                size={36}
                selected={isActive}
                onClick={() => dispatch({ type: 'SET_DIGEST', frequency: d.id })}
              >
                {d.label}
              </SecondaryButton>
            );
          })}
        </div>
      </SectionCard>
    </>
  );
}
