import React, { useState } from 'react';
import {
  DropdownList,
  Modal,
  PrimaryButton,
  SecondaryButton,
  TextInput,
  WarningButton,
} from '../../design-system';
import type { SettingsState, SettingsAction } from './settingsState';
import { SectionCard } from './sectionShared';

export function DangerZoneSection({
  state,
  onBackToHome,
}: {
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
  onBackToHome?: () => void;
}) {
  const [transferOpen, setTransferOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const adminCandidates = state.team.members.filter((m) => m.role === 'admin' && m.status === 'active');

  return (
    <>
      <SectionCard
        tone="danger"
        title="Transfer ownership"
        description="Move this workspace to another admin. They'll become the new owner; you'll be downgraded to admin."
        headerExtra={
          <WarningButton size={36} onClick={() => setTransferOpen(true)}>
            Transfer ownership
          </WarningButton>
        }
      >
        <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-muted)', lineHeight: '18px' }}>
          We'll send the recipient a confirmation email. Until they accept, you remain the owner.
          Transfers are reviewed by support to prevent account hijacking — expect a 24-hour delay.
        </p>
      </SectionCard>

      <SectionCard
        tone="danger"
        title="Delete workspace"
        description="Permanently delete this workspace, including patients, cases, files, and audit history. This cannot be undone."
        headerExtra={
          <WarningButton size={36} onClick={() => setDeleteOpen(true)}>
            Delete workspace
          </WarningButton>
        }
      >
        <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-muted)', lineHeight: '18px' }}>
          You'll be asked to type the workspace name to confirm. Data is purged within 30 days; export
          everything from the Audit log and Files sections before proceeding.
        </p>
      </SectionCard>

      {transferOpen && (
        <TransferModal
          candidates={adminCandidates.map((m) => ({ value: m.id, label: `${m.name} (${m.email})` }))}
          onClose={() => setTransferOpen(false)}
        />
      )}
      {deleteOpen && (
        <DeleteModal
          workspaceName={state.general.workspaceName}
          onClose={() => setDeleteOpen(false)}
          onConfirm={() => {
            setDeleteOpen(false);
            onBackToHome?.();
          }}
        />
      )}
    </>
  );
}

function TransferModal({
  candidates,
  onClose,
}: {
  candidates: { value: string; label: string }[];
  onClose: () => void;
}) {
  const [target, setTarget] = useState(candidates[0]?.value ?? '');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Modal
        open
        onClose={onClose}
        title="Transfer initiated"
        size="sm"
        footer={<PrimaryButton size={36} onClick={onClose}>Done</PrimaryButton>}
      >
        <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', lineHeight: '20px', color: 'var(--ads-text-primary)' }}>
          Got it — we've notified the recipient and our support team. You'll get an email update within 24 hours.
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Transfer ownership"
      size="sm"
      footer={
        <>
          <SecondaryButton size={36} onClick={onClose}>Cancel</SecondaryButton>
          <WarningButton size={36} disabled={!target} onClick={() => setSubmitted(true)}>
            Confirm transfer
          </WarningButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {candidates.length === 0 ? (
          <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-primary)' }}>
            You need at least one admin teammate before you can transfer ownership. Promote a member to Admin from the Team section first.
          </p>
        ) : (
          <>
            <DropdownList
              label="New owner"
              options={candidates}
              value={target}
              onChange={setTarget}
              fullWidth
            />
            <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)', lineHeight: '16px' }}>
              The recipient must accept via email. Until they do, you remain the owner. You can cancel a pending transfer
              from this page.
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}

function DeleteModal({
  workspaceName,
  onClose,
  onConfirm,
}: {
  workspaceName: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [confirmText, setConfirmText] = useState('');
  const matches = confirmText === workspaceName;

  return (
    <Modal
      open
      onClose={onClose}
      title="Delete workspace"
      size="sm"
      footer={
        <>
          <SecondaryButton size={36} onClick={onClose}>Cancel</SecondaryButton>
          <WarningButton size={36} disabled={!matches} onClick={onConfirm}>
            Delete forever
          </WarningButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '14px', lineHeight: '20px', color: 'var(--ads-text-primary)' }}>
          This will permanently delete the workspace, all patients, cases, files, and audit history.
          Anyone with access will be signed out immediately.
        </p>
        <div>
          <div style={{ marginBottom: '6px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)' }}>
            Type <strong>{workspaceName}</strong> to confirm
          </div>
          <TextInput
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={workspaceName}
            fullWidth
          />
        </div>
        <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
          You have 30 days to recover this workspace via support before data is purged.
        </p>
      </div>
    </Modal>
  );
}
