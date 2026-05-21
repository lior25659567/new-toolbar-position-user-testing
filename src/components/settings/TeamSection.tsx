import React, { useMemo, useState } from 'react';
import {
  Avatar,
  DropdownList,
  IconButton,
  Modal,
  PrimaryButton,
  SearchInput,
  SecondaryButton,
  Tag,
  TextInput,
  type TagColor,
} from '../../design-system';
import {
  type SettingsState,
  type SettingsAction,
  type Member,
  type Role,
  ROLE_LABEL,
} from './settingsState';
import { SectionCard, ConfirmModal, relativeTime } from './sectionShared';

const ROLE_OPTIONS = (Object.keys(ROLE_LABEL) as Role[]).map((id) => ({
  value: id,
  label: ROLE_LABEL[id],
}));

const ROLE_TAG_COLOR: Record<Role, TagColor> = {
  owner:        'purple',
  admin:        'blue',
  clinician:    'green',
  staff:        'orange',
  'lab-liaison':'magenta',
};

const STATUS_TAG_COLOR: Record<Member['status'], TagColor> = {
  active:    'green',
  invited:   'orange',
  suspended: 'red',
};

export function TeamSection({
  state,
  dispatch,
}: {
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
}) {
  const [search, setSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const members = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return state.team.members;
    return state.team.members.filter(
      (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
    );
  }, [state.team.members, search]);

  const pending = state.team.members.find((m) => m.id === state.team.pendingDeleteId) ?? null;

  return (
    <>
      <SectionCard
        title="Members"
        description={`${state.team.members.length} members in this workspace.`}
        headerExtra={
          <PrimaryButton size={36} onClick={() => dispatch({ type: 'OPEN_INVITE' })}>
            Invite teammate
          </PrimaryButton>
        }
      >
        <div style={{ marginBottom: '16px', maxWidth: '320px' }}>
          <SearchInput
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) 160px 110px 130px 48px',
            gap: '0 16px',
            alignItems: 'center',
            fontFamily: 'var(--ads-font-sans)',
            fontSize: '13px',
          }}
        >
          {['Member', 'Role', 'Status', 'Last active', ''].map((h, i) => (
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

          {members.length === 0 ? (
            <div
              style={{
                gridColumn: '1 / -1',
                padding: '32px 0',
                textAlign: 'center',
                color: 'var(--ads-text-muted)',
              }}
            >
              No members match your search.
            </div>
          ) : (
            members.map((m) => (
              <React.Fragment key={m.id}>
                <div
                  style={{
                    padding: '14px 0',
                    borderBottom: '1px solid var(--ads-border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    minWidth: 0,
                  }}
                >
                  <Avatar name={m.monogram} size="sm" />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: 'var(--ads-text-primary)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.name}
                    </div>
                    <div style={{ color: 'var(--ads-text-muted)', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.email}
                    </div>
                  </div>
                </div>
                <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)' }}>
                  {m.role === 'owner' ? (
                    <Tag color={ROLE_TAG_COLOR.owner}>Owner</Tag>
                  ) : (
                    <DropdownList
                      options={ROLE_OPTIONS.filter((o) => o.value !== 'owner')}
                      value={m.role}
                      onChange={(value) => dispatch({ type: 'CHANGE_ROLE', memberId: m.id, role: value as Role })}
                    />
                  )}
                </div>
                <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)' }}>
                  <Tag color={STATUS_TAG_COLOR[m.status]} size="small">
                    {m.status}
                  </Tag>
                </div>
                <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)', color: 'var(--ads-text-muted)' }}>
                  {m.status === 'invited' ? `invited ${relativeTime(m.invitedAt!)}` : m.lastActiveAt ? relativeTime(m.lastActiveAt) : '—'}
                </div>
                <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)', position: 'relative', display: 'flex', justifyContent: 'flex-end' }}>
                  {m.role !== 'owner' && (
                    <>
                      <IconButton
                        size="md"
                        aria-label="More actions"
                        onClick={() => setOpenMenuId((cur) => (cur === m.id ? null : m.id))}
                      >
                        <MoreIcon />
                      </IconButton>
                      {openMenuId === m.id && (
                        <RowMenu
                          member={m}
                          onClose={() => setOpenMenuId(null)}
                          dispatch={dispatch}
                        />
                      )}
                    </>
                  )}
                </div>
              </React.Fragment>
            ))
          )}
        </div>
      </SectionCard>

      {state.team.inviteOpen && <InviteModal dispatch={dispatch} />}
      <ConfirmModal
        open={pending !== null}
        title="Remove from workspace"
        message={pending ? <>Remove <strong>{pending.name}</strong> ({pending.email}) from this workspace? This will revoke their access immediately.</> : ''}
        confirmLabel="Remove"
        destructive
        onConfirm={() => pending && dispatch({ type: 'REMOVE_MEMBER', memberId: pending.id })}
        onCancel={() => dispatch({ type: 'SET_PENDING_DELETE', memberId: null })}
      />
    </>
  );
}

function RowMenu({
  member,
  onClose,
  dispatch,
}: {
  member: Member;
  onClose: () => void;
  dispatch: React.Dispatch<SettingsAction>;
}) {
  const items: { label: string; onClick: () => void; tone?: 'danger' }[] = [];
  if (member.status === 'invited') {
    items.push({ label: 'Resend invite', onClick: () => { dispatch({ type: 'RESEND_INVITE', memberId: member.id }); onClose(); } });
  }
  if (member.status === 'active') {
    items.push({ label: 'Suspend', onClick: () => { dispatch({ type: 'SUSPEND_MEMBER', memberId: member.id }); onClose(); } });
  }
  if (member.status === 'suspended') {
    items.push({ label: 'Reactivate', onClick: () => { dispatch({ type: 'REACTIVATE_MEMBER', memberId: member.id }); onClose(); } });
  }
  items.push({ label: 'Remove', tone: 'danger', onClick: () => { dispatch({ type: 'SET_PENDING_DELETE', memberId: member.id }); onClose(); } });

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 100 }}
      />
      <div
        style={{
          position: 'absolute',
          top: '44px',
          right: 0,
          minWidth: '160px',
          backgroundColor: 'var(--ads-bg-surface)',
          border: '1px solid var(--ads-border-subtle)',
          borderRadius: 'var(--ads-radius-sm)',
          boxShadow: 'var(--ads-shadow-md)',
          padding: '4px',
          zIndex: 101,
        }}
      >
        {items.map((it, i) => (
          <button
            key={i}
            type="button"
            onClick={it.onClick}
            style={{
              display: 'block',
              width: '100%',
              padding: '8px 12px',
              border: 'none',
              background: 'none',
              textAlign: 'left',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '13px',
              color: it.tone === 'danger' ? 'var(--ads-danger-500)' : 'var(--ads-text-primary)',
              cursor: 'pointer',
              borderRadius: 'var(--ads-radius-xs, 4px)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--ads-bg-page)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {it.label}
          </button>
        ))}
      </div>
    </>
  );
}

function InviteModal({ dispatch }: { dispatch: React.Dispatch<SettingsAction> }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('clinician');

  const validEmail = /.+@.+\..+/.test(email);

  return (
    <Modal
      open
      onClose={() => dispatch({ type: 'CLOSE_INVITE' })}
      title="Invite teammate"
      size="sm"
      footer={
        <>
          <SecondaryButton size={36} onClick={() => dispatch({ type: 'CLOSE_INVITE' })}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            size={36}
            disabled={!validEmail}
            onClick={() => dispatch({ type: 'INVITE_MEMBER', email, role })}
          >
            Send invite
          </PrimaryButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <TextInput
          label="Email address"
          required
          placeholder="name@your-clinic.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          type="email"
        />
        <DropdownList
          label="Role"
          options={ROLE_OPTIONS.filter((o) => o.value !== 'owner')}
          value={role}
          onChange={(v) => setRole(v as Role)}
          fullWidth
        />
        <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
          They'll receive an email with a link to join. Invites expire in 14 days.
        </p>
      </div>
    </Modal>
  );
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="3" cy="8" r="1.4" fill="currentColor" />
      <circle cx="8" cy="8" r="1.4" fill="currentColor" />
      <circle cx="13" cy="8" r="1.4" fill="currentColor" />
    </svg>
  );
}
