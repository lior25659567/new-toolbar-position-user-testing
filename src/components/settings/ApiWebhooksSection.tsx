import React, { useState } from 'react';
import {
  Checkbox,
  IconButton,
  Modal,
  Notification,
  PrimaryButton,
  SecondaryButton,
  Tag,
  TextInput,
  Toggle,
  type TagColor,
} from '../../design-system';
import {
  type SettingsState,
  type SettingsAction,
  type ApiKey,
  type WebhookEndpoint,
  type NotificationEvent,
  AVAILABLE_SCOPES,
  NOTIFICATION_EVENT_LABEL,
} from './settingsState';
import { SectionCard, ConfirmModal, relativeTime } from './sectionShared';

const ALL_EVENTS: NotificationEvent[] = [
  'case-status-change',
  'message-received',
  'plan-presented',
  'plan-accepted',
  'invoice-paid',
  'invoice-failed',
  'sla-risk',
  'team-invite-accepted',
];

function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    return;
  }
  fallbackCopy(text);
}

function fallbackCopy(text: string) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch {}
  document.body.removeChild(ta);
}

export function ApiWebhooksSection({
  state,
  dispatch,
}: {
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
}) {
  const [pendingRevoke, setPendingRevoke] = useState<ApiKey | null>(null);
  const [pendingDeleteWebhook, setPendingDeleteWebhook] = useState<WebhookEndpoint | null>(null);
  const [copied, setCopied] = useState(false);

  return (
    <>
      {state.api.revealedSecret && (
        <Notification
          type="warning"
          title="Save this key now"
          onDismiss={() => dispatch({ type: 'DISMISS_REVEAL' })}
          style={{ marginBottom: '16px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              You won't be able to view this secret again. Copy it and store it somewhere safe.
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                backgroundColor: 'var(--ads-bg-page)',
                border: '1px solid var(--ads-border-subtle)',
                borderRadius: 'var(--ads-radius-sm)',
                fontFamily: 'var(--ads-font-mono, ui-monospace)',
                fontSize: '13px',
                wordBreak: 'break-all',
              }}
            >
              <span style={{ flex: 1, minWidth: 0 }}>{state.api.revealedSecret}</span>
              <SecondaryButton
                size={36}
                onClick={() => {
                  copyToClipboard(state.api.revealedSecret!);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </SecondaryButton>
            </div>
          </div>
        </Notification>
      )}

      <SectionCard
        title="API keys"
        description="Programmatic access to this workspace. Keys are scoped — pick the minimum required."
        headerExtra={
          <PrimaryButton size={36} onClick={() => dispatch({ type: 'OPEN_CREATE_KEY' })}>
            + New key
          </PrimaryButton>
        }
      >
        {state.api.keys.length === 0 ? (
          <div style={{ padding: '24px 0', color: 'var(--ads-text-muted)', fontFamily: 'var(--ads-font-sans)', fontSize: '14px' }}>
            No API keys yet. Create one to get started.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.5fr) 120px 120px 60px',
              gap: '0 16px',
              alignItems: 'center',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '13px',
            }}
          >
            {['Name', 'Token & scopes', 'Created', 'Last used', ''].map((h, i) => (
              <div
                key={i}
                style={{
                  paddingBottom: '10px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--ads-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  borderBottom: '1px solid var(--ads-border-subtle)',
                }}
              >
                {h}
              </div>
            ))}
            {state.api.keys.map((k) => (
              <React.Fragment key={k.id}>
                <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)', color: 'var(--ads-text-primary)', fontWeight: 500 }}>
                  {k.name}
                  <div style={{ marginTop: '2px', fontSize: '12px', fontWeight: 400, color: 'var(--ads-text-muted)' }}>by {k.createdByName}</div>
                </div>
                <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)' }}>
                  <div style={{ fontFamily: 'var(--ads-font-mono, ui-monospace)', fontSize: '12px', color: 'var(--ads-text-primary)' }}>
                    {k.prefix}<span style={{ color: 'var(--ads-text-muted)' }}>·············</span>
                  </div>
                  <div style={{ marginTop: '6px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {k.scopes.map((s) => (
                      <Tag key={s} size="small" color="blue">{s}</Tag>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)', color: 'var(--ads-text-muted)' }}>
                  {relativeTime(k.createdAt)}
                </div>
                <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)', color: 'var(--ads-text-muted)' }}>
                  {k.lastUsedAt ? relativeTime(k.lastUsedAt) : '—'}
                </div>
                <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton size="md" aria-label="Revoke" onClick={() => setPendingRevoke(k)}>
                    <TrashIcon />
                  </IconButton>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Webhooks"
        description="HTTP endpoints we'll POST to when events fire. Each delivery is signed with the webhook secret."
        headerExtra={
          <PrimaryButton size={36} onClick={() => dispatch({ type: 'OPEN_CREATE_WEBHOOK' })}>
            + New endpoint
          </PrimaryButton>
        }
      >
        {state.api.webhooks.length === 0 ? (
          <div style={{ padding: '24px 0', color: 'var(--ads-text-muted)', fontFamily: 'var(--ads-font-sans)', fontSize: '14px' }}>
            No webhooks configured.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.5fr) 160px 80px 60px',
              gap: '0 16px',
              alignItems: 'center',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '13px',
            }}
          >
            {['Endpoint', 'Events', 'Last delivery', 'Active', ''].map((h, i) => (
              <div
                key={i}
                style={{
                  paddingBottom: '10px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--ads-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  borderBottom: '1px solid var(--ads-border-subtle)',
                }}
              >
                {h}
              </div>
            ))}
            {state.api.webhooks.map((w) => {
              const deliveryTone: TagColor = w.lastDelivery?.status === 'ok' ? 'green' : 'red';
              return (
                <React.Fragment key={w.id}>
                  <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)', minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--ads-font-mono, ui-monospace)', fontSize: '12px', color: 'var(--ads-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {w.url}
                    </div>
                    <div style={{ marginTop: '2px', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                      created {relativeTime(w.createdAt)}
                    </div>
                  </div>
                  <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {w.events.map((e) => (
                      <Tag key={e} size="small" color="blue">{NOTIFICATION_EVENT_LABEL[e]}</Tag>
                    ))}
                  </div>
                  <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)' }}>
                    {w.lastDelivery ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <Tag size="small" color={deliveryTone}>{w.lastDelivery.status}</Tag>
                        <span style={{ fontSize: '12px', color: 'var(--ads-text-muted)' }}>{relativeTime(w.lastDelivery.timestamp)}</span>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--ads-text-muted)' }}>never</span>
                    )}
                  </div>
                  <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)' }}>
                    <Toggle
                      checked={w.active}
                      onChange={() => dispatch({ type: 'TOGGLE_WEBHOOK', id: w.id })}
                    />
                  </div>
                  <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton size="md" aria-label="Delete" onClick={() => setPendingDeleteWebhook(w)}>
                      <TrashIcon />
                    </IconButton>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </SectionCard>

      {state.api.createKeyOpen && <CreateKeyModal dispatch={dispatch} />}
      {state.api.createWebhookOpen && <CreateWebhookModal dispatch={dispatch} />}

      <ConfirmModal
        open={pendingRevoke !== null}
        title="Revoke API key"
        message={pendingRevoke ? <>Revoke <strong>{pendingRevoke.name}</strong>? Any service using this key will start returning 401 errors immediately.</> : ''}
        confirmLabel="Revoke key"
        destructive
        onConfirm={() => {
          if (pendingRevoke) dispatch({ type: 'REVOKE_KEY', keyId: pendingRevoke.id });
          setPendingRevoke(null);
        }}
        onCancel={() => setPendingRevoke(null)}
      />

      <ConfirmModal
        open={pendingDeleteWebhook !== null}
        title="Delete webhook"
        message={pendingDeleteWebhook ? <>Delete the endpoint <strong>{pendingDeleteWebhook.url}</strong>? Pending deliveries will be dropped.</> : ''}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (pendingDeleteWebhook) dispatch({ type: 'DELETE_WEBHOOK', id: pendingDeleteWebhook.id });
          setPendingDeleteWebhook(null);
        }}
        onCancel={() => setPendingDeleteWebhook(null)}
      />
    </>
  );
}

function CreateKeyModal({ dispatch }: { dispatch: React.Dispatch<SettingsAction> }) {
  const [name, setName] = useState('');
  const [scopes, setScopes] = useState<string[]>(['cases:read']);

  const toggle = (s: string) => {
    setScopes((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  };

  return (
    <Modal
      open
      onClose={() => dispatch({ type: 'CLOSE_CREATE_KEY' })}
      title="Create API key"
      size="md"
      footer={
        <>
          <SecondaryButton size={36} onClick={() => dispatch({ type: 'CLOSE_CREATE_KEY' })}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            size={36}
            disabled={!name.trim() || scopes.length === 0}
            onClick={() => dispatch({ type: 'CREATE_KEY', name: name.trim(), scopes })}
          >
            Create key
          </PrimaryButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextInput
          label="Key name"
          required
          placeholder="e.g. Production server"
          helper="A label only you'll see — pick something memorable."
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <div>
          <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
            Scopes
          </div>
          <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)', marginBottom: '10px' }}>
            Pick the minimum scopes this key needs.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {AVAILABLE_SCOPES.map((s) => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <Checkbox checked={scopes.includes(s)} onChange={() => toggle(s)} />
                <span style={{ fontFamily: 'var(--ads-font-mono, ui-monospace)', fontSize: '12px', color: 'var(--ads-text-primary)' }}>{s}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function CreateWebhookModal({ dispatch }: { dispatch: React.Dispatch<SettingsAction> }) {
  const [url, setUrl] = useState('');
  const [events, setEvents] = useState<NotificationEvent[]>(['case-status-change']);

  const validUrl = /^https?:\/\/.+/.test(url);

  const toggle = (e: NotificationEvent) => {
    setEvents((cur) => (cur.includes(e) ? cur.filter((x) => x !== e) : [...cur, e]));
  };

  return (
    <Modal
      open
      onClose={() => dispatch({ type: 'CLOSE_CREATE_WEBHOOK' })}
      title="Create webhook endpoint"
      size="md"
      footer={
        <>
          <SecondaryButton size={36} onClick={() => dispatch({ type: 'CLOSE_CREATE_WEBHOOK' })}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            size={36}
            disabled={!validUrl || events.length === 0}
            onClick={() => dispatch({ type: 'CREATE_WEBHOOK', url, events })}
          >
            Create endpoint
          </PrimaryButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextInput
          label="Endpoint URL"
          required
          type="url"
          placeholder="https://your-server.example/dscore/events"
          helper="We'll POST a signed JSON payload here on each event."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
        />
        <div>
          <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
            Events to subscribe to
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {ALL_EVENTS.map((e) => (
              <label key={e} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <Checkbox checked={events.includes(e)} onChange={() => toggle(e)} />
                <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-primary)' }}>{NOTIFICATION_EVENT_LABEL[e]}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 4h10M6.5 4V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1M5 4l.5 8a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1L11 4M7 7v4M9 7v4" />
    </svg>
  );
}
