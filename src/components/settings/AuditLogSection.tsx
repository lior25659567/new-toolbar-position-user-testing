import React, { useMemo } from 'react';
import { Avatar, DropdownList, Tag, type TagColor } from '../../design-system';
import {
  type SettingsState,
  type SettingsAction,
  type Role,
  ROLE_LABEL,
} from './settingsState';
import { SectionCard } from './sectionShared';

type ActionCategory = 'all' | 'team' | 'plan' | 'integration' | 'api' | 'general';

function categorize(action: string, target?: string): Exclude<ActionCategory, 'all'> {
  const t = (target ?? '').toLowerCase();
  const a = action.toLowerCase();
  if (a.includes('invited') || a.includes('removed') || a.includes('role') || a.includes('suspended') || a.includes('resent invite')) return 'team';
  if (a.includes('plan') || t.includes('plan') || t.includes('payment')) return 'plan';
  if (a.includes('connected') || a.includes('disconnected')) return 'integration';
  if (t.includes('api key') || t.includes('webhook') || a.includes('rotated') || a.includes('revoked')) return 'api';
  return 'general';
}

const ROLE_TAG_COLOR: Record<Role, TagColor> = {
  owner:        'purple',
  admin:        'blue',
  clinician:    'green',
  staff:        'orange',
  'lab-liaison':'magenta',
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return `${date} · ${time}`;
}

export function AuditLogSection({
  state,
  dispatch,
}: {
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
}) {
  const actorOptions = useMemo(() => {
    const set = new Set<string>();
    state.audit.entries.forEach((e) => set.add(e.actorName));
    return [
      { value: 'all', label: 'All actors' },
      ...Array.from(set).map((name) => ({ value: name, label: name })),
    ];
  }, [state.audit.entries]);

  const filtered = useMemo(() => {
    return state.audit.entries.filter((e) => {
      if (state.audit.filterActor !== 'all' && e.actorName !== state.audit.filterActor) return false;
      if (state.audit.filterAction !== 'all' && categorize(e.action, e.target) !== state.audit.filterAction) return false;
      return true;
    });
  }, [state.audit.entries, state.audit.filterActor, state.audit.filterAction]);

  return (
    <SectionCard
      title="Admin activity"
      description="A read-only history of every administrative action in this workspace. Retained for 7 years."
      headerExtra={
        <div style={{ display: 'flex', gap: '8px' }}>
          <DropdownList
            options={actorOptions}
            value={state.audit.filterActor}
            onChange={(value) => dispatch({ type: 'SET_AUDIT_FILTER', filterActor: value })}
          />
          <DropdownList
            options={[
              { value: 'all',         label: 'All categories' },
              { value: 'team',        label: 'Team' },
              { value: 'plan',        label: 'Plan & billing' },
              { value: 'integration', label: 'Integrations' },
              { value: 'api',         label: 'API & webhooks' },
              { value: 'general',     label: 'General' },
            ]}
            value={state.audit.filterAction}
            onChange={(value) => dispatch({ type: 'SET_AUDIT_FILTER', filterAction: value as ActionCategory })}
          />
        </div>
      }
    >
      {filtered.length === 0 ? (
        <div style={{ padding: '48px 24px', textAlign: 'center', fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)' }}>
          No actions match the current filters.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(180px, 220px) minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 2fr)',
            gap: '0 16px',
            alignItems: 'center',
            fontFamily: 'var(--ads-font-sans)',
            fontSize: '13px',
          }}
        >
          <div style={{ paddingBottom: '10px', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--ads-border-subtle)' }}>
            When
          </div>
          <div style={{ paddingBottom: '10px', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--ads-border-subtle)' }}>
            Who
          </div>
          <div style={{ paddingBottom: '10px', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--ads-border-subtle)' }}>
            Action
          </div>
          <div style={{ paddingBottom: '10px', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--ads-border-subtle)' }}>
            Target
          </div>

          {filtered.map((entry) => (
            <React.Fragment key={entry.id}>
              <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)', color: 'var(--ads-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                {formatTimestamp(entry.timestamp)}
              </div>
              <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)', display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <Avatar name={entry.actorName.split(' ').map((s) => s[0]).slice(0, 2).join('')} size="xs" />
                <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ads-text-primary)' }}>
                  {entry.actorName}
                </span>
                <Tag color={ROLE_TAG_COLOR[entry.actorRole]} size="small">{ROLE_LABEL[entry.actorRole]}</Tag>
              </div>
              <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)', color: 'var(--ads-text-primary)', fontWeight: 500 }}>
                {entry.action}
              </div>
              <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)', color: 'var(--ads-text-muted)', fontStyle: entry.target ? 'italic' : 'normal' }}>
                {entry.target ?? '—'}
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
