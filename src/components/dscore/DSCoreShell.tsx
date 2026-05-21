import React from 'react';
import { IconButton, Avatar, Icon } from '../../design-system';

/* =========================================================
   DSCoreShell — shared chrome for DS Core pages.
   Renders the left navigation rail + top bar around `children`.
   Used by PatientPage, OrdersPage, etc.
   ========================================================= */

export type DSCoreNavId =
  | 'home'
  | 'patients'
  | 'orders'
  | 'collaboration'
  | 'treatments'
  | 'jobs'
  | 'files'
  | 'equipment'
  | 'claims'
  | 'scheduling';

export interface DSCoreShellProps {
  active: DSCoreNavId;
  onNavigate: (id: DSCoreNavId) => void;
  unread?: number;
  children: React.ReactNode;
}

export function DSCoreShell({ active, onNavigate, unread = 0, children }: DSCoreShellProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundColor: 'var(--ads-bg-page)',
        fontFamily: 'var(--ads-font-sans)',
        color: 'var(--ads-text-primary)',
        overflow: 'hidden',
      }}
    >
      <DSCoreLeftRail active={active} onSelect={onNavigate} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <DSCoreTopBar unread={unread} />
        <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
      </div>
    </div>
  );
}

/* ============================================================================
   Left rail
   ============================================================================ */

interface RailNavItem {
  id: DSCoreNavId;
  label: string;
  icon: React.ReactNode;
}

function DSCoreLeftRail({ active, onSelect }: { active: DSCoreNavId; onSelect: (id: DSCoreNavId) => void }) {
  const items: RailNavItem[] = [
    { id: 'home',          label: 'Home',          icon: <RailIcon name="home" /> },
    { id: 'patients',      label: 'Patients',      icon: <RailIcon name="patients" /> },
    { id: 'scheduling',    label: 'Schedule',      icon: <RailIcon name="schedule" /> },
    { id: 'orders',        label: 'Orders',        icon: <RailIcon name="orders" /> },
    { id: 'jobs',          label: 'Jobs',          icon: <RailIcon name="jobs" /> },
    { id: 'treatments',    label: 'Treatments',    icon: <RailIcon name="treatments" /> },
    { id: 'claims',        label: 'Claims',        icon: <RailIcon name="claims" /> },
    { id: 'collaboration', label: 'Collaboration', icon: <RailIcon name="collab" /> },
    { id: 'files',         label: 'Files',         icon: <RailIcon name="files" /> },
    { id: 'equipment',     label: 'Equipment',     icon: <RailIcon name="equipment" /> },
  ];

  return (
    <aside className="left-rail" style={{ position: 'sticky', top: 0, flexShrink: 0 }}>
      <div className="rail-logo" style={{ gap: '12px' }}>
        <button
          type="button"
          aria-label="Toggle menu"
          style={{
            width: '32px',
            height: '32px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'var(--ads-text-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            borderRadius: 'var(--ads-radius-sm)',
          }}
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <line x1="1" y1="2"  x2="17" y2="2"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="1" y1="7"  x2="17" y2="7"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="1" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <DSCoreWordmark />
      </div>
      <nav className="rail-nav" aria-label="Main">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            className={`nav-item ${active === it.id ? 'active' : ''}`}
            onClick={() => onSelect(it.id)}
            aria-current={active === it.id ? 'page' : undefined}
          >
            <span className="nav-icon">{it.icon}</span>
            <span className="nav-label">{it.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

function DSCoreWordmark() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--ads-text-primary)',
        fontFamily: 'var(--ads-font-sans)',
        fontWeight: 500,
        fontSize: '15px',
        letterSpacing: '0.06em',
      }}
    >
      <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
        <path
          d="M7 18 C3 18 1 15.5 1 12.5 C1 9.5 3.4 7 6.5 7 C7.2 4.5 9.5 2.5 12.5 2.5 C15.6 2.5 18 4.7 18.5 7.5 C21 7.5 23 9.5 23 12 C23 14.7 21 16.5 18 16.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path d="M5.5 14 H22 V18 H5.5 Z" fill="currentColor" opacity="0.08" />
      </svg>
      DS CORE
    </span>
  );
}

function RailIcon({
  name,
}: {
  name: 'home' | 'patients' | 'orders' | 'collab' | 'treatments' | 'jobs' | 'files' | 'equipment' | 'claims' | 'schedule';
}) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 20 20',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M3 9 L10 3 L17 9 V16.5 A1 1 0 0 1 16 17.5 H4 A1 1 0 0 1 3 16.5 Z" />
          <path d="M8 17.5 V12 H12 V17.5" />
        </svg>
      );
    case 'patients':
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="2.5" />
          <path d="M2.5 16 C2.5 13 4.5 12 7 12 C9.5 12 11.5 13 11.5 16" />
          <circle cx="13.5" cy="8" r="2" />
          <path d="M11 16 C11 13.5 12.5 13 14 13 C15.5 13 17 13.5 17 16" />
        </svg>
      );
    case 'orders':
      return (
        <svg {...common}>
          <path d="M2 4 H4 L5.5 13 H15 L16.5 6 H6" />
          <circle cx="7" cy="16.5" r="1.2" />
          <circle cx="14" cy="16.5" r="1.2" />
        </svg>
      );
    case 'collab':
      return (
        <svg {...common}>
          <circle cx="5" cy="5" r="1.6" />
          <circle cx="15" cy="5" r="1.6" />
          <circle cx="10" cy="15" r="1.6" />
          <line x1="6.4"  y1="5.5" x2="13.6" y2="5.5" />
          <line x1="5.5"  y1="6.5" x2="9.2"  y2="13.5" />
          <line x1="14.5" y1="6.5" x2="10.8" y2="13.5" />
        </svg>
      );
    case 'treatments':
      return (
        <svg {...common}>
          <path d="M5 4 H15 V16.5 A1 1 0 0 1 14 17.5 H6 A1 1 0 0 1 5 16.5 Z" />
          <line x1="7"  y1="8"  x2="13" y2="8" />
          <line x1="7"  y1="11" x2="13" y2="11" />
          <line x1="7"  y1="14" x2="11" y2="14" />
        </svg>
      );
    case 'jobs':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="14" height="12" rx="1.5" />
          <line x1="3" y1="8" x2="17" y2="8" />
          <line x1="7" y1="3" x2="7" y2="6" />
          <line x1="13" y1="3" x2="13" y2="6" />
          <polyline points="7,12 9,14 13,10" />
        </svg>
      );
    case 'files':
      return (
        <svg {...common}>
          <rect x="3" y="3.5" width="14" height="13" rx="1.5" />
          <circle cx="7" cy="8" r="1.2" />
          <path d="M3.5 14 L7.5 10.5 L11 13 L14 10 L17 13" />
        </svg>
      );
    case 'equipment':
      return (
        <svg {...common}>
          <rect x="2.5" y="7" width="6.5" height="6" rx="2.2" />
          <rect x="11"  y="7" width="6.5" height="6" rx="2.2" />
          <line x1="9" y1="10" x2="11" y2="10" />
        </svg>
      );
    case 'claims':
      return (
        <svg {...common}>
          <path d="M5 3 H13 L15 5 V16.5 A1 1 0 0 1 14 17.5 H5 A1 1 0 0 1 4 16.5 V4 A1 1 0 0 1 5 3 Z" />
          <line x1="7"  y1="9"  x2="12" y2="9" />
          <line x1="7"  y1="12" x2="12" y2="12" />
          <path d="M9 5.5 V7 M9 7 H10 A1 1 0 0 1 10 9 H9 A1 1 0 0 0 9 11 H10" />
        </svg>
      );
    case 'schedule':
      return (
        <svg {...common}>
          <rect x="3" y="4.5" width="14" height="13" rx="1.5" />
          <line x1="3" y1="8" x2="17" y2="8" />
          <line x1="6.5" y1="3" x2="6.5" y2="6" />
          <line x1="13.5" y1="3" x2="13.5" y2="6" />
          <rect x="6" y="10.5" width="3" height="2" rx="0.5" fill="currentColor" stroke="none" />
          <rect x="11" y="13.5" width="3" height="2" rx="0.5" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

/* ============================================================================
   Top bar
   ============================================================================ */

function DSCoreTopBar({ unread }: { unread: number }) {
  return (
    <header
      style={{
        height: '56px',
        backgroundColor: 'var(--ads-bg-surface)',
        borderBottom: '1px solid var(--ads-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 32px',
        gap: '8px',
        flexShrink: 0,
      }}
    >
      <IconButton aria-label="Notifications" size="md" style={{ position: 'relative' }}>
        <Icon name="bell" size={20} color="var(--ads-text-primary)" />
        {unread > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--ads-success-500)',
              border: '2px solid var(--ads-bg-surface)',
            }}
          />
        )}
      </IconButton>
      <IconButton aria-label="Help" size="md">
        <HelpIcon />
      </IconButton>
      <Avatar name="SS" size="md" />
    </header>
  );
}

function HelpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7.5" />
      <path d="M7.5 7.75A2.5 2.5 0 0 1 10 5.5a2.5 2.5 0 0 1 1.5 4.5C10.6 10.6 10 11 10 12" />
      <circle cx="10" cy="14.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
