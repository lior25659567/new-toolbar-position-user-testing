import React, { useMemo, useState } from 'react';
import {
  Checkbox,
  Modal,
  PrimaryButton,
  SecondaryButton,
  Tag,
  type TagColor,
} from '../../design-system';
import {
  type SettingsState,
  type SettingsAction,
  type IntegrationCatalogEntry,
  AVAILABLE_SCOPES,
} from './settingsState';
import { SectionCard, ConfirmModal, relativeTime } from './sectionShared';

const TONE_TO_COLOR: Record<IntegrationCatalogEntry['tone'], TagColor> = {
  blue:    'blue',
  green:   'green',
  purple:  'purple',
  orange:  'orange',
  magenta: 'magenta',
};

const CATEGORY_LABEL: Record<IntegrationCatalogEntry['category'], string> = {
  imaging:   'Imaging',
  payer:     'Payer',
  pms:       'PMS',
  scanner:   'Scanner',
  lab:       'Lab',
  comms:     'Comms',
  analytics: 'Analytics',
};

export function IntegrationsSection({
  state,
  dispatch,
}: {
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
}) {
  const connectedIds = useMemo(
    () => new Set(state.integrations.connected.map((c) => c.id)),
    [state.integrations.connected],
  );

  const available = state.integrations.catalog.filter((c) => !connectedIds.has(c.id));
  const connectedDetailed = state.integrations.connected
    .map((c) => ({ ...c, catalog: state.integrations.catalog.find((x) => x.id === c.id)! }))
    .filter((c) => c.catalog);

  const [pendingDisconnectId, setPendingDisconnectId] = useState<string | null>(null);
  const pendingDisconnect = pendingDisconnectId
    ? state.integrations.catalog.find((c) => c.id === pendingDisconnectId) ?? null
    : null;

  const activeIntegration = state.integrations.activeIntegrationId
    ? state.integrations.catalog.find((c) => c.id === state.integrations.activeIntegrationId) ?? null
    : null;

  return (
    <>
      <SectionCard
        title={`Connected (${connectedDetailed.length})`}
        description="Apps that can read or write data in this workspace."
      >
        {connectedDetailed.length === 0 ? (
          <div style={{ padding: '24px 0', color: 'var(--ads-text-muted)', fontFamily: 'var(--ads-font-sans)', fontSize: '14px' }}>
            No integrations connected yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {connectedDetailed.map(({ catalog, connectedAt, connectedByName, scopes }) => (
              <div
                key={catalog.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 14px',
                  border: '1px solid var(--ads-border-subtle)',
                  borderRadius: 'var(--ads-radius-sm)',
                }}
              >
                <MonogramTile entry={catalog} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>
                      {catalog.name}
                    </span>
                    <Tag size="small" color="green">Connected</Tag>
                  </div>
                  <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                    {catalog.vendor} · connected by {connectedByName} · {relativeTime(connectedAt)}
                  </div>
                  <div style={{ marginTop: '6px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {scopes.map((s) => (
                      <Tag key={s} size="small" color="blue">{s}</Tag>
                    ))}
                  </div>
                </div>
                <SecondaryButton size={36} onClick={() => setPendingDisconnectId(catalog.id)}>
                  Disconnect
                </SecondaryButton>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Marketplace"
        description={`${available.length} more apps available. Connect what your practice already uses.`}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {available.map((entry) => (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '16px',
                border: '1px solid var(--ads-border-subtle)',
                borderRadius: 'var(--ads-radius-sm)',
                backgroundColor: 'var(--ads-bg-surface)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MonogramTile entry={entry} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--ads-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {entry.name}
                  </div>
                  <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                    {entry.vendor}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <Tag size="small" color={TONE_TO_COLOR[entry.tone]}>{CATEGORY_LABEL[entry.category]}</Tag>
                {entry.paid && <Tag size="small" color="orange">Paid add-on</Tag>}
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--ads-font-sans)',
                  fontSize: '13px',
                  lineHeight: '18px',
                  color: 'var(--ads-text-muted)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {entry.description}
              </p>
              <PrimaryButton
                size={36}
                onClick={() => dispatch({ type: 'OPEN_INTEGRATION', id: entry.id, mode: 'connect' })}
              >
                Connect
              </PrimaryButton>
            </div>
          ))}
        </div>
      </SectionCard>

      {activeIntegration && state.integrations.activeMode === 'connect' && (
        <ConnectModal
          integration={activeIntegration}
          onClose={() => dispatch({ type: 'CLOSE_INTEGRATION' })}
          onConnect={(scopes) => dispatch({ type: 'CONNECT_INTEGRATION', id: activeIntegration.id, scopes })}
        />
      )}

      <ConfirmModal
        open={pendingDisconnect !== null}
        title="Disconnect integration"
        message={pendingDisconnect ? <>Disconnect <strong>{pendingDisconnect.name}</strong>? Existing data will be retained but no new data will sync.</> : ''}
        confirmLabel="Disconnect"
        destructive
        onConfirm={() => {
          if (pendingDisconnect) dispatch({ type: 'DISCONNECT_INTEGRATION', id: pendingDisconnect.id });
          setPendingDisconnectId(null);
        }}
        onCancel={() => setPendingDisconnectId(null)}
      />
    </>
  );
}

function ConnectModal({
  integration,
  onClose,
  onConnect,
}: {
  integration: IntegrationCatalogEntry;
  onClose: () => void;
  onConnect: (scopes: string[]) => void;
}) {
  const [scopes, setScopes] = useState<string[]>(['cases:read']);

  const toggle = (s: string) => {
    setScopes((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`Connect ${integration.name}`}
      size="md"
      footer={
        <>
          <SecondaryButton size={36} onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton size={36} disabled={scopes.length === 0} onClick={() => onConnect(scopes)}>
            Connect {integration.name}
          </PrimaryButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MonogramTile entry={integration} size={48} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '15px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>
                {integration.name}
              </div>
              {integration.paid && <Tag size="small" color="orange">Billed separately</Tag>}
            </div>
            <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
              {integration.vendor} · {CATEGORY_LABEL[integration.category]}
            </div>
          </div>
        </div>

        <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '14px', lineHeight: '20px', color: 'var(--ads-text-primary)' }}>
          {integration.description}
        </p>

        <div>
          <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
            Setup steps
          </div>
          <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)' }}>
            {integration.setupSteps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
            Scopes to grant
          </div>
          <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)', marginBottom: '10px' }}>
            Pick only the scopes this integration actually needs.
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

function MonogramTile({ entry, size }: { entry: IntegrationCatalogEntry; size: number }) {
  const tone = entry.tone;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 'var(--ads-radius-sm)',
        backgroundColor: `var(--ads-tag-${tone}-bg)`,
        border: `1px solid var(--ads-tag-${tone}-br)`,
        color: `var(--ads-tag-${tone}-fg)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--ads-font-sans)',
        fontWeight: 600,
        fontSize: size >= 44 ? 16 : size >= 36 ? 13 : 11,
        flexShrink: 0,
      }}
      aria-hidden
    >
      {entry.monogram}
    </div>
  );
}
