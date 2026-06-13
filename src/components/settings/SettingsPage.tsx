import React, { useReducer } from 'react';
import { Avatar, Icon, IconButton } from '../../design-system';
import {
  initSettingsState,
  settingsReducer,
  type SectionId,
  type SettingsState,
  type SettingsAction,
} from './settingsState';
import { GeneralSection } from './GeneralSection';
import { TeamSection } from './TeamSection';
import { PlanBillingSection } from './PlanBillingSection';
import { IntegrationsSection } from './IntegrationsSection';
import { NotificationsSection } from './NotificationsSection';
import { ApiWebhooksSection } from './ApiWebhooksSection';
import { AuditLogSection } from './AuditLogSection';
import { BrandingSection } from './BrandingSection';
import { DangerZoneSection } from './DangerZoneSection';

interface SettingsPageProps {
  onBackToHome?: () => void;
}

interface SectionDef {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
  /** Optional second-line description for hover/accessibility. */
  description: string;
  /** When true, the item gets the danger color treatment in the rail. */
  danger?: boolean;
}

const ICON_PROPS = {
  width: 18, height: 18, viewBox: '0 0 20 20', fill: 'none' as const,
  stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
};

const SECTIONS: SectionDef[] = [
  { id: 'general',       label: 'General',         description: 'Workspace identity and hours',
    icon: <svg {...ICON_PROPS}><circle cx="10" cy="10" r="3" /><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.6 4.6l1.4 1.4M14 14l1.4 1.4M4.6 15.4L6 14M14 6l1.4-1.4" /></svg> },
  { id: 'team',          label: 'Team',            description: 'Members, roles, invitations',
    icon: <svg {...ICON_PROPS}><circle cx="7" cy="7" r="2.5" /><path d="M2.5 16C2.5 13 4.5 12 7 12s4.5 1 4.5 4" /><circle cx="13.5" cy="8" r="2" /><path d="M11 16c0-2.5 1.5-3 3-3s3 .5 3 3" /></svg> },
  { id: 'plan',          label: 'Plan & billing',  description: 'Subscription, payment, invoices',
    icon: <svg {...ICON_PROPS}><rect x="3" y="5" width="14" height="11" rx="1.5" /><line x1="3" y1="9" x2="17" y2="9" /><line x1="6" y1="13" x2="9" y2="13" /></svg> },
  { id: 'integrations',  label: 'Integrations',    description: 'Connect imaging, payer, lab, scanner',
    icon: <svg {...ICON_PROPS}><circle cx="6" cy="6" r="2" /><circle cx="14" cy="6" r="2" /><circle cx="10" cy="14" r="2" /><line x1="7.4" y1="6.5" x2="12.6" y2="6.5" /><line x1="6.5" y1="7.4" x2="9.5" y2="12.6" /><line x1="13.5" y1="7.4" x2="10.5" y2="12.6" /></svg> },
  { id: 'notifications', label: 'Notifications',   description: 'Email, SMS, push preferences',
    icon: <svg {...ICON_PROPS}><path d="M5 14V10C5 7 7 4 10 4s5 3 5 6v4l1 1H4l1-1Z" /><path d="M8 15c0 2 4 2 4 0" /></svg> },
  { id: 'api',           label: 'API & webhooks',  description: 'Tokens and event endpoints',
    icon: <svg {...ICON_PROPS}><path d="M7 4h6l3 3v9a1 1 0 0 1-1 1H7" /><path d="M7 4 4 7v9a1 1 0 0 0 1 1h10" /><path d="M9 11h2" /><path d="M9 14h4" /></svg> },
  { id: 'audit',         label: 'Audit log',       description: 'History of admin actions',
    icon: <svg {...ICON_PROPS}><circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" /></svg> },
  { id: 'branding',      label: 'Branding',        description: 'Logo, colors, custom domain',
    icon: <svg {...ICON_PROPS}><path d="M10 3 C6 3 3 6 3 10 C3 14 6 17 10 17 C11 17 12 16 12 15 C12 14 11 14 11 13 C11 12 12 12 13 12 H15 C16 12 17 11 17 10 C17 6 14 3 10 3 Z" /><circle cx="6.5" cy="8" r=".9" fill="currentColor" stroke="none" /><circle cx="9" cy="6" r=".9" fill="currentColor" stroke="none" /><circle cx="13" cy="6.5" r=".9" fill="currentColor" stroke="none" /></svg> },
  { id: 'danger',        label: 'Danger zone',     description: 'Transfer or delete workspace', danger: true,
    icon: <svg {...ICON_PROPS}><path d="M10 3 L18 17 H2 Z" /><line x1="10" y1="9" x2="10" y2="12" /><circle cx="10" cy="14.5" r=".8" fill="currentColor" stroke="none" /></svg> },
];

export default function SettingsPage({ onBackToHome }: SettingsPageProps) {
  const [state, dispatch] = useReducer(settingsReducer, undefined, initSettingsState);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--ads-bg-page)',
        fontFamily: 'var(--ads-font-sans)',
        color: 'var(--ads-text-primary)',
      }}
    >
      <TopBar onBackToHome={onBackToHome} workspaceName={state.general.workspaceName} />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <Sidebar
          sections={SECTIONS}
          active={state.section}
          onSelect={(id) => dispatch({ type: 'SET_SECTION', section: id })}
        />
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '32px 40px 64px',
          }}
        >
          <SectionRouter state={state} dispatch={dispatch} sections={SECTIONS} onBackToHome={onBackToHome} />
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Top bar — back to home + breadcrumb + workspace + avatar
   ──────────────────────────────────────────────────────────────────────────── */

function TopBar({ onBackToHome, workspaceName }: { onBackToHome?: () => void; workspaceName: string }) {
  return (
    <header
      style={{
        height: '56px',
        backgroundColor: 'var(--ads-bg-surface)',
        borderBottom: '1px solid var(--ads-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        flexShrink: 0,
      }}
    >
      <button
        type="button"
        onClick={onBackToHome}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          padding: '6px 8px',
          cursor: 'pointer',
          color: 'var(--ads-text-primary)',
          fontFamily: 'var(--ads-font-sans)',
          fontSize: '14px',
          borderRadius: 'var(--ads-radius-sm)',
        }}
      >
        <Icon name="chevron-left" size={20} color="currentColor" />
        Home
      </button>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--ads-font-sans)',
          fontSize: '14px',
          color: 'var(--ads-text-muted)',
        }}
      >
        <span>{workspaceName}</span>
        <span style={{ color: 'var(--ads-text-subtle)' }}>/</span>
        <span style={{ color: 'var(--ads-text-primary)', fontWeight: 500 }}>Settings</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <IconButton aria-label="Help" size="md">
          <Icon name="settings" size={18} color="var(--ads-text-primary)" />
        </IconButton>
        <Avatar name="AW" size="md" />
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Sidebar
   ──────────────────────────────────────────────────────────────────────────── */

function Sidebar({
  sections, active, onSelect,
}: {
  sections: SectionDef[];
  active: SectionId;
  onSelect: (id: SectionId) => void;
}) {
  return (
    <nav
      aria-label="Settings"
      style={{
        width: '240px',
        flexShrink: 0,
        backgroundColor: 'var(--ads-bg-surface)',
        borderRight: '1px solid var(--ads-border-subtle)',
        padding: '20px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        overflowY: 'auto',
      }}
    >
      <h2
        style={{
          margin: '4px 12px 12px',
          fontFamily: 'var(--ads-font-sans)',
          fontWeight: 500,
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: 'var(--ads-text-muted)',
        }}
      >
        Settings
      </h2>
      {sections.map((s) => {
        const isActive = s.id === active;
        const danger = s.danger && isActive;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            aria-current={isActive ? 'page' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              minHeight: '36px',
              border: '1px solid transparent',
              borderRadius: 'var(--ads-radius-sm)',
              backgroundColor: isActive
                ? (s.danger ? 'var(--ads-tag-red-bg)' : 'color-mix(in srgb, var(--ads-blue-500) 8%, transparent)')
                : 'transparent',
              color: isActive
                ? (danger ? 'var(--ads-tag-red-fg)' : 'var(--ads-blue-550)')
                : (s.danger ? 'var(--ads-danger-500)' : 'var(--ads-text-primary)'),
              borderColor: isActive ? (s.danger ? 'var(--ads-tag-red-br)' : 'var(--ads-blue-500)') : 'transparent',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '13px',
              fontWeight: isActive ? 500 : 400,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color var(--ads-duration-fast), border-color var(--ads-duration-fast), color var(--ads-duration-fast)',
            }}
          >
            <span style={{ display: 'inline-flex', width: '18px', height: '18px', flexShrink: 0 }}>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Section router
   ──────────────────────────────────────────────────────────────────────────── */

function SectionRouter({
  state, dispatch, sections, onBackToHome,
}: {
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
  sections: SectionDef[];
  onBackToHome?: () => void;
}) {
  const def = sections.find((s) => s.id === state.section)!;
  return (
    <div style={{ maxWidth: '880px' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--ads-font-sans)',
            fontWeight: 500,
            fontSize: '24px',
            lineHeight: '32px',
            color: 'var(--ads-text-primary)',
          }}
        >
          {def.label}
        </h1>
        <p
          style={{
            margin: '6px 0 0',
            fontFamily: 'var(--ads-font-sans)',
            fontSize: '14px',
            color: 'var(--ads-text-muted)',
          }}
        >
          {def.description}
        </p>
      </header>

      {state.section === 'general'       && <GeneralSection       state={state} dispatch={dispatch} />}
      {state.section === 'team'          && <TeamSection          state={state} dispatch={dispatch} />}
      {state.section === 'plan'          && <PlanBillingSection   state={state} dispatch={dispatch} />}
      {state.section === 'integrations'  && <IntegrationsSection  state={state} dispatch={dispatch} />}
      {state.section === 'notifications' && <NotificationsSection state={state} dispatch={dispatch} />}
      {state.section === 'api'           && <ApiWebhooksSection   state={state} dispatch={dispatch} />}
      {state.section === 'audit'         && <AuditLogSection      state={state} dispatch={dispatch} />}
      {state.section === 'branding'      && <BrandingSection      state={state} dispatch={dispatch} />}
      {state.section === 'danger'        && <DangerZoneSection    state={state} dispatch={dispatch} onBackToHome={onBackToHome} />}
    </div>
  );
}
