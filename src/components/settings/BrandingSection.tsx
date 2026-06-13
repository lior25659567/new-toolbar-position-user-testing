import React, { useRef, useState, useEffect } from 'react';
import { TextInput, PrimaryButton, SecondaryButton, LinkButton, Tag } from '../../design-system';
import type { SettingsState, SettingsAction } from './settingsState';
import { SectionCard, SettingRow } from './sectionShared';

const HEX_RE = /^#([0-9a-fA-F]{6})$/;

export function BrandingSection({
  state,
  dispatch,
}: {
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [hexDraft, setHexDraft] = useState(state.branding.primaryColorHex);
  const [domainDraft, setDomainDraft] = useState(state.branding.customDomain ?? '');

  useEffect(() => setHexDraft(state.branding.primaryColorHex), [state.branding.primaryColorHex]);
  useEffect(() => setDomainDraft(state.branding.customDomain ?? ''), [state.branding.customDomain]);

  const onPickFile = () => fileRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      dispatch({ type: 'UPDATE_BRANDING', patch: { logoDataUrl: String(reader.result) } });
    };
    reader.readAsDataURL(f);
    e.target.value = '';
  };

  const onColorChange = (next: string) => {
    setHexDraft(next);
    if (HEX_RE.test(next)) {
      dispatch({ type: 'UPDATE_BRANDING', patch: { primaryColorHex: next } });
    }
  };

  const domainDirty = domainDraft !== (state.branding.customDomain ?? '');

  return (
    <>
      <SectionCard title="Logo" description="Shown on patient-facing treatment plans, invoices, and the workspace shell.">
        <SettingRow label="Workspace logo" helper="PNG or SVG, ideally on a transparent background. Max 2 MB." align="start">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '88px',
                height: '88px',
                borderRadius: 'var(--ads-radius-sm)',
                border: state.branding.logoDataUrl ? '1px solid var(--ads-border-subtle)' : '2px dashed var(--ads-border-subtle)',
                backgroundColor: state.branding.logoDataUrl ? 'var(--ads-bg-surface)' : 'var(--ads-bg-page)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {state.branding.logoDataUrl ? (
                <img
                  src={state.branding.logoDataUrl}
                  alt="Workspace logo"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              ) : (
                <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '11px', color: 'var(--ads-text-muted)', textAlign: 'center', padding: '0 8px' }}>
                  No logo
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <SecondaryButton size={36} onClick={onPickFile}>
                {state.branding.logoDataUrl ? 'Replace logo' : 'Upload logo'}
              </SecondaryButton>
              {state.branding.logoDataUrl && (
                <LinkButton onClick={() => dispatch({ type: 'UPDATE_BRANDING', patch: { logoDataUrl: undefined } })}>
                  Remove logo
                </LinkButton>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </SettingRow>
      </SectionCard>

      <SectionCard title="Accent color" description="Used for primary buttons and link styling on patient-facing surfaces.">
        <SettingRow label="Primary color" helper="Pick a hex value or use the swatch.">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--ads-radius-sm)',
                border: '1px solid var(--ads-border-subtle)',
                backgroundColor: state.branding.primaryColorHex,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <input
                type="color"
                value={state.branding.primaryColorHex}
                onChange={(e) => onColorChange(e.target.value)}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', border: 'none' }}
                aria-label="Pick primary color"
              />
            </label>
            <TextInput
              value={hexDraft}
              onChange={(e) => onColorChange(e.target.value)}
              style={{ width: '160px', fontFamily: 'var(--ads-font-mono, ui-monospace)', textTransform: 'uppercase' }}
            />
          </div>
        </SettingRow>
      </SectionCard>

      <SectionCard title="Custom domain" description="Send patient links from a domain you own (CNAME setup required).">
        <SettingRow label="Domain" helper="Set a CNAME record pointing to app.dscore.cloud.">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <TextInput
              placeholder="app.your-clinic.com"
              value={domainDraft}
              onChange={(e) => setDomainDraft(e.target.value)}
              style={{ flex: '1 1 240px', minWidth: '240px' }}
            />
            <PrimaryButton
              size={36}
              disabled={!domainDirty}
              onClick={() => dispatch({ type: 'UPDATE_BRANDING', patch: { customDomain: domainDraft || undefined } })}
            >
              Save
            </PrimaryButton>
            {state.branding.customDomain && (
              <Tag color="orange" size="small">DNS pending</Tag>
            )}
          </div>
        </SettingRow>
      </SectionCard>
    </>
  );
}
