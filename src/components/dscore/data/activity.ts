import type { ActivityEvent, ActivityEventType, ActorRole } from './types';

let _id = 0;
function nextId(): string {
  _id += 1;
  return `evt-${Date.now()}-${_id}`;
}

/**
 * Build a fully-formed ActivityEvent with consistent shape so callers in any
 * reducer can append events the same way without remembering the field names.
 */
export function makeActivityEvent({
  type,
  actorId,
  actorName,
  actorRole = 'dentist',
  payload = {},
  timestamp,
}: {
  type: ActivityEventType;
  actorId: string;
  actorName: string;
  actorRole?: ActorRole;
  payload?: Record<string, unknown>;
  timestamp?: string;
}): ActivityEvent {
  return {
    id: nextId(),
    type,
    actor: { id: actorId, name: actorName, role: actorRole },
    timestamp: timestamp ?? new Date().toISOString(),
    payload,
  };
}

/** ISO date helpers used by mock data + UI. */
export function daysFromNowISO(days: number, baseISO?: string): string {
  const base = baseISO ? new Date(baseISO) : new Date();
  const ms = base.getTime() + days * 24 * 60 * 60 * 1000;
  return new Date(ms).toISOString();
}

export function formatRelativeDays(targetISO: string, nowISO?: string): {
  days: number;
  label: string;
  past: boolean;
} {
  const now = nowISO ? new Date(nowISO).getTime() : Date.now();
  const target = new Date(targetISO).getTime();
  const days = Math.round((target - now) / (24 * 60 * 60 * 1000));
  if (days === 0) return { days, label: 'Today', past: false };
  if (days === 1) return { days, label: 'Tomorrow', past: false };
  if (days === -1) return { days, label: 'Yesterday', past: true };
  if (days < 0) return { days, label: `${Math.abs(days)} days ago`, past: true };
  return { days, label: `In ${days} days`, past: false };
}

/** Human-readable timestamp for cards / messages. */
export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
    ' · ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}
