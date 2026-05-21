import React from 'react';
import { Avatar, Icon } from '../../../design-system';
import type { ActivityEvent } from '../data/types';
import { formatTimestamp } from '../data/activity';
import { jobStatusLabel } from './StatusTag';

/**
 * Vertical timeline of activity events.
 * Used by Job detail and TreatmentPlan history.
 *
 * Each event renders with: icon (per type), one-line summary, actor name +
 * relative timestamp, and an optional payload-specific detail line.
 */
export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  const sorted = [...events].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div
        style={{
          padding: '32px 16px',
          textAlign: 'center',
          color: 'var(--ads-text-muted)',
          fontSize: '13px',
        }}
      >
        No activity yet.
      </div>
    );
  }

  return (
    <ol
      style={{
        listStyle: 'none',
        margin: 0,
        padding: '8px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
      }}
    >
      {sorted.map((event, idx) => (
        <ActivityRow key={event.id} event={event} isLast={idx === sorted.length - 1} />
      ))}
    </ol>
  );
}

function ActivityRow({ event, isLast }: { event: ActivityEvent; isLast: boolean }) {
  const summary = renderSummary(event);
  const monogram = event.actor.name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
  return (
    <li style={{ display: 'flex', gap: '12px', position: 'relative' }}>
      {/* Connector */}
      {!isLast && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: '15px',
            top: '32px',
            bottom: '-12px',
            width: '1px',
            backgroundColor: 'var(--ads-border-subtle)',
          }}
        />
      )}
      <div style={{ flexShrink: 0, width: '32px', display: 'flex', justifyContent: 'center' }}>
        <ActivityBadge type={event.type} role={event.actor.role} />
      </div>
      <div style={{ flex: 1, minWidth: 0, paddingTop: '2px' }}>
        <div
          style={{
            fontFamily: 'var(--ads-font-sans)',
            fontSize: '13px',
            lineHeight: '18px',
            color: 'var(--ads-text-primary)',
          }}
        >
          {summary}
        </div>
        <div
          style={{
            fontFamily: 'var(--ads-font-sans)',
            fontSize: '12px',
            lineHeight: '16px',
            color: 'var(--ads-text-muted)',
            marginTop: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Avatar name={monogram} size="xs" />
          <span>{event.actor.name}</span>
          <span aria-hidden>·</span>
          <span>{formatTimestamp(event.timestamp)}</span>
        </div>
      </div>
    </li>
  );
}

function ActivityBadge({ type, role }: { type: ActivityEvent['type']; role: ActivityEvent['actor']['role'] }) {
  const bg =
    type === 'plan-accepted' || type === 'status-change' ? 'var(--ads-tag-blue-bg)' :
    type === 'plan-declined' || type === 'changes-requested' || type === 'cancelled' as never ? 'var(--ads-tag-red-bg)' :
    type === 'message-sent' ? 'var(--ads-tag-green-bg)' :
    type === 'file-added'  ? 'var(--ads-tag-purple-bg)' :
    type === 'priority-change' || type === 'due-date-change' ? 'var(--ads-tag-orange-bg)' :
    'var(--ads-bg-muted)';
  const fg =
    type === 'plan-accepted' || type === 'status-change' ? 'var(--ads-tag-blue-fg)' :
    type === 'plan-declined' || type === 'changes-requested' ? 'var(--ads-tag-red-fg)' :
    type === 'message-sent' ? 'var(--ads-tag-green-fg)' :
    type === 'file-added'  ? 'var(--ads-tag-purple-fg)' :
    type === 'priority-change' || type === 'due-date-change' ? 'var(--ads-tag-orange-fg)' :
    'var(--ads-text-muted)';
  const iconName =
    type === 'message-sent' ? 'messages' :
    type === 'file-added'  ? 'card' :
    type === 'plan-accepted' || type === 'plan-presented' ? 'check' :
    type === 'plan-declined' || type === 'changes-requested' || type === 'cancelled' as never ? 'close' :
    type === 'priority-change' ? 'star' :
    type === 'due-date-change' ? 'calendar' :
    type === 'assigned' ? 'patients' :
    type === 'created' ? 'plus' :
    'check';
  void role;
  return (
    <span
      aria-hidden
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: bg,
        color: fg,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={iconName as any} size={14} color="currentColor" />
    </span>
  );
}

function renderSummary(event: ActivityEvent): React.ReactNode {
  const p = event.payload as Record<string, any>;
  switch (event.type) {
    case 'created':
      return <>Created job</>;
    case 'assigned':
      return <>Assigned to <strong>{String(p.lab ?? '—')}</strong></>;
    case 'status-change':
      return (
        <>
          Status changed{' '}
          <strong>{jobStatusLabel(p.from)}</strong>
          {' → '}
          <strong>{jobStatusLabel(p.to)}</strong>
        </>
      );
    case 'message-sent':
      return <>Sent a message{p.preview ? `: "${truncate(String(p.preview))}"` : ''}</>;
    case 'file-added':
      return <>Added file <strong>{String(p.fileName ?? 'attachment')}</strong></>;
    case 'changes-requested':
      return <>Requested changes{p.note ? `: ${truncate(String(p.note))}` : ''}</>;
    case 'priority-change':
      return <>Priority changed to <strong>{String(p.to)}</strong></>;
    case 'due-date-change':
      return <>Due date moved to <strong>{String(p.to)}</strong></>;
    case 'plan-version-bumped':
      return <>Plan revised to v{String(p.version)}</>;
    case 'plan-presented':
      return <>Plan presented to patient</>;
    case 'plan-accepted':
      return <>Plan accepted</>;
    case 'plan-declined':
      return <>Plan declined{p.reason ? ` · ${String(p.reason)}` : ''}</>;
    default:
      return <>{String(event.type)}</>;
  }
}

function truncate(s: string, max = 60): string {
  return s.length <= max ? s : s.slice(0, max - 1) + '…';
}
