import React, { useState } from 'react';
import {
  DropdownList,
  Modal,
  PrimaryButton,
  SecondaryButton,
  TextInput,
  WarningButton,
} from '../../../design-system';
import {
  type ClaimsAction,
  type ClaimPayment,
  type InsuranceClaim,
  claimOutstanding,
  formatUSD,
} from './claimsState';

export function PostPaymentModal({
  claim,
  onClose,
  dispatch,
}: {
  claim: InsuranceClaim;
  onClose: () => void;
  dispatch: React.Dispatch<ClaimsAction>;
}) {
  const remaining = claimOutstanding(claim);
  const [amount, setAmount] = useState(String(remaining || 0));
  const [method, setMethod] = useState<ClaimPayment['method']>(claim.status === 'balance-billed' ? 'patient-card' : 'EFT');
  const [reference, setReference] = useState('');

  const numericAmount = Number(amount);
  const valid = numericAmount > 0 && !Number.isNaN(numericAmount) && reference.trim().length > 0;

  return (
    <Modal
      open
      onClose={onClose}
      title="Post payment"
      size="sm"
      footer={
        <>
          <SecondaryButton size={36} onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton
            size={36}
            disabled={!valid}
            onClick={() => dispatch({ type: 'POST_PAYMENT', id: claim.id, amount: numericAmount, method, reference: reference.trim() })}
          >
            Post {formatUSD(numericAmount || 0)}
          </PrimaryButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-muted)' }}>
          Outstanding balance: <strong>{formatUSD(remaining)}</strong>. If the posted total covers the balance, the claim moves to Paid; otherwise it moves to Partially paid.
        </p>
        <TextInput
          label="Amount"
          required
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
          fullWidth
        />
        <DropdownList
          label="Method"
          options={[
            { value: 'EFT',           label: 'EFT — Insurance' },
            { value: 'check',         label: 'Check — Insurance' },
            { value: 'patient-card',  label: 'Patient — credit card' },
          ]}
          value={method}
          onChange={(v) => setMethod(v as ClaimPayment['method'])}
          fullWidth
        />
        <TextInput
          label="Reference"
          required
          placeholder={method === 'EFT' ? 'ERA or trace #' : method === 'check' ? 'Check #' : 'Auth code'}
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          fullWidth
        />
      </div>
    </Modal>
  );
}

export function FileAppealModal({
  claim,
  onClose,
  dispatch,
}: {
  claim: InsuranceClaim;
  onClose: () => void;
  dispatch: React.Dispatch<ClaimsAction>;
}) {
  const [reason, setReason] = useState('');
  const valid = reason.trim().length >= 20;

  return (
    <Modal
      open
      onClose={onClose}
      title="File appeal"
      size="md"
      footer={
        <>
          <SecondaryButton size={36} onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton
            size={36}
            disabled={!valid}
            onClick={() => dispatch({ type: 'FILE_APPEAL', id: claim.id, reason: reason.trim() })}
          >
            File appeal
          </PrimaryButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: 'var(--ads-tag-orange-bg)',
            border: '1px solid var(--ads-tag-orange-br)',
            borderRadius: 'var(--ads-radius-sm)',
            fontFamily: 'var(--ads-font-sans)',
            fontSize: '13px',
            color: 'var(--ads-text-primary)',
          }}
        >
          Most payers require appeals within 60 days of denial. Attach narrative + supporting documentation when you submit the formal appeal letter.
        </div>
        <div>
          <label
            htmlFor="appeal-reason"
            style={{ display: 'block', marginBottom: '6px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--ads-text-primary)' }}
          >
            Appeal narrative <span style={{ color: 'var(--ads-danger-500)' }}>*</span>
          </label>
          <textarea
            id="appeal-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this denial should be overturned. Cite payer policy, attach radiograph references, and include any prior approvals…"
            rows={6}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '13px',
              lineHeight: '20px',
              border: '1px solid var(--ads-border-subtle)',
              borderRadius: 'var(--ads-radius-sm)',
              resize: 'vertical',
              backgroundColor: 'var(--ads-bg-surface)',
              color: 'var(--ads-text-primary)',
            }}
          />
          <div style={{ marginTop: '4px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
            {reason.length} / minimum 20 characters
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function WriteOffModal({
  claim,
  onClose,
  dispatch,
}: {
  claim: InsuranceClaim;
  onClose: () => void;
  dispatch: React.Dispatch<ClaimsAction>;
}) {
  const [notes, setNotes] = useState('');
  const remaining = claimOutstanding(claim);

  return (
    <Modal
      open
      onClose={onClose}
      title="Write off claim"
      size="sm"
      footer={
        <>
          <SecondaryButton size={36} onClick={onClose}>Cancel</SecondaryButton>
          <WarningButton size={36} onClick={() => dispatch({ type: 'WRITE_OFF', id: claim.id, notes: notes.trim() || undefined })}>
            Write off {formatUSD(remaining)}
          </WarningButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)' }}>
          You're about to write off <strong>{formatUSD(remaining)}</strong> from <strong>{claim.claimNumber}</strong>. The claim will move to Written-off and the balance will be removed from accounts receivable.
        </p>
        <div>
          <label
            htmlFor="writeoff-notes"
            style={{ display: 'block', marginBottom: '6px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--ads-text-primary)' }}
          >
            Reason (optional)
          </label>
          <textarea
            id="writeoff-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Appeal denied; filing limit reached; bad debt."
            rows={3}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '13px',
              lineHeight: '20px',
              border: '1px solid var(--ads-border-subtle)',
              borderRadius: 'var(--ads-radius-sm)',
              resize: 'vertical',
              backgroundColor: 'var(--ads-bg-surface)',
              color: 'var(--ads-text-primary)',
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
