import React, { useState } from 'react';
import { Avatar, PrimaryButton, SecondaryButton, Tag, WarningButton, type TagColor } from '../../../design-system';
import { SlideOverPanel } from '../shared/SlideOverPanel';
import { ActivityFeed } from '../shared/ActivityFeed';
import {
  type InsuranceClaim,
  type ClaimsAction,
  type ClaimStatus,
  STATUS_LABEL,
  formatLongDate,
  formatUSD,
  claimTotalBilled,
  claimTotalPaid,
  claimOutstanding,
  claimPatientResponsibility,
  canClaimTransition,
  denialReasonByCode,
} from './claimsState';

const STATUS_TONE: Record<ClaimStatus, TagColor> = {
  'draft':           'magenta',
  'submitted':       'blue',
  'in-review':       'blue',
  'paid':            'green',
  'partial':         'orange',
  'denied':          'red',
  'appealed':        'orange',
  'balance-billed':  'purple',
  'patient-paid':    'green',
  'written-off':     'red',
};

type Tab = 'overview' | 'lines' | 'payments' | 'appeals' | 'activity';

export function ClaimDetailPanel({
  claim,
  onClose,
  dispatch,
}: {
  claim: InsuranceClaim | null;
  onClose: () => void;
  dispatch: React.Dispatch<ClaimsAction>;
}) {
  const [tab, setTab] = useState<Tab>('overview');

  React.useEffect(() => {
    if (claim) setTab('overview');
  }, [claim?.id]);

  return (
    <SlideOverPanel
      open={claim !== null}
      onClose={onClose}
      title={claim ? `${claim.claimNumber} · ${claim.patient.name}` : ''}
      width={680}
    >
      {claim && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ padding: '0 24px 16px' }}>
            <header
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                paddingBottom: '14px',
                borderBottom: '1px solid var(--ads-border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <Avatar name={claim.payer.monogram} size="md" />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>
                    {claim.payer.name}
                  </div>
                  <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                    {claim.dentist.name} · DOS {formatLongDate(claim.dateOfService)}
                  </div>
                </div>
              </div>
              <Tag color={STATUS_TONE[claim.status]} size="medium">
                {STATUS_LABEL[claim.status]}
              </Tag>
            </header>

            <TabBar active={tab} onChange={setTab} appealCount={claim.appeals.length} paymentCount={claim.payments.length} lineCount={claim.procedures.length} />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
            {tab === 'overview' && <OverviewTab claim={claim} />}
            {tab === 'lines'    && <LinesTab claim={claim} />}
            {tab === 'payments' && <PaymentsTab claim={claim} />}
            {tab === 'appeals'  && <AppealsTab claim={claim} />}
            {tab === 'activity' && <ActivityTab claim={claim} />}
          </div>

          <ActionFooter claim={claim} dispatch={dispatch} />
        </div>
      )}
    </SlideOverPanel>
  );
}

function TabBar({
  active,
  onChange,
  appealCount,
  paymentCount,
  lineCount,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
  appealCount: number;
  paymentCount: number;
  lineCount: number;
}) {
  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'lines',    label: 'Lines',    count: lineCount },
    { id: 'payments', label: 'Payments', count: paymentCount },
    { id: 'appeals',  label: 'Appeals',  count: appealCount },
    { id: 'activity', label: 'Activity' },
  ];
  return (
    <nav style={{ display: 'flex', gap: '4px', marginTop: '12px' }}>
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            style={{
              padding: '8px 12px',
              border: 'none',
              borderBottom: `2px solid ${isActive ? 'var(--ads-blue-500)' : 'transparent'}`,
              background: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '13px',
              fontWeight: isActive ? 500 : 400,
              color: isActive ? 'var(--ads-blue-550)' : 'var(--ads-text-muted)',
            }}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span style={{ marginLeft: '6px', color: 'var(--ads-text-muted)', fontSize: '12px' }}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

function OverviewTab({ claim }: { claim: InsuranceClaim }) {
  const denial = denialReasonByCode(claim.denialReasonCode);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '16px' }}>
      <KeyValueGrid
        rows={[
          ['Patient', claim.patient.name],
          ['Provider', claim.dentist.name],
          ['Date of service', formatLongDate(claim.dateOfService)],
          ['Submitted', claim.dateSubmitted ? formatLongDate(claim.dateSubmitted) : '—'],
          ['Closed', claim.dateClosed ? formatLongDate(claim.dateClosed) : '—'],
        ]}
      />

      <Money claim={claim} />

      {denial && (
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: 'var(--ads-tag-red-bg)',
            border: '1px solid var(--ads-tag-red-br)',
            borderRadius: 'var(--ads-radius-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <div style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '13px', color: 'var(--ads-tag-red-fg)' }}>
            Denial — {denial.code}
          </div>
          <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)' }}>
            {denial.short}
          </div>
          <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
            {denial.appealable ? 'Eligible for appeal — gather supporting documentation.' : 'Not appealable per payer rules.'}
          </div>
        </div>
      )}

      {claim.notes && (
        <div>
          <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
            Biller notes
          </div>
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--ads-bg-page)',
              border: '1px solid var(--ads-border-subtle)',
              borderRadius: 'var(--ads-radius-sm)',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '13px',
              lineHeight: '18px',
              color: 'var(--ads-text-primary)',
            }}
          >
            {claim.notes}
          </div>
        </div>
      )}
    </div>
  );
}

function Money({ claim }: { claim: InsuranceClaim }) {
  const billed = claimTotalBilled(claim);
  const paid = claimTotalPaid(claim);
  const ptResp = claimPatientResponsibility(claim);
  const outstanding = claimOutstanding(claim);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
      }}
    >
      <MoneyTile label="Billed" amount={billed} tone="default" />
      <MoneyTile label="Paid" amount={paid} tone="success" />
      <MoneyTile label="Patient resp." amount={ptResp} tone="default" />
      <MoneyTile label="Outstanding" amount={outstanding} tone={outstanding > 0 ? 'warning' : 'default'} />
    </div>
  );
}

function MoneyTile({ label, amount, tone }: { label: string; amount: number; tone: 'default' | 'warning' | 'success' }) {
  const fg = tone === 'warning' ? 'var(--ads-danger-500)' : tone === 'success' ? 'var(--ads-success-600)' : 'var(--ads-text-primary)';
  return (
    <div
      style={{
        padding: '10px 12px',
        backgroundColor: 'var(--ads-bg-page)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
      }}
    >
      <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--ads-text-muted)', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '17px', fontWeight: 500, color: fg, fontVariantNumeric: 'tabular-nums' }}>
        {formatUSD(amount)}
      </div>
    </div>
  );
}

function KeyValueGrid({ rows }: { rows: [string, string][] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 140px) minmax(0, 1fr)', gap: '8px 16px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
      {rows.map(([k, v]) => (
        <React.Fragment key={k}>
          <div style={{ color: 'var(--ads-text-muted)' }}>{k}</div>
          <div style={{ color: 'var(--ads-text-primary)' }}>{v}</div>
        </React.Fragment>
      ))}
    </div>
  );
}

function LinesTab({ claim }: { claim: InsuranceClaim }) {
  return (
    <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {claim.procedures.map((p) => {
        const denial = denialReasonByCode(p.deniedReasonCode);
        return (
          <div
            key={p.id}
            style={{
              padding: '12px 14px',
              border: '1px solid var(--ads-border-subtle)',
              borderRadius: 'var(--ads-radius-sm)',
              backgroundColor: 'var(--ads-bg-surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontFamily: 'var(--ads-font-mono, ui-monospace)', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>
                  {p.cdtCode}
                </span>
                <span style={{ marginLeft: '8px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)' }}>
                  {p.description}
                </span>
                {p.toothNumber && (
                  <span style={{ marginLeft: '8px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                    · #{p.toothNumber}
                  </span>
                )}
              </div>
              <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--ads-text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                {formatUSD(p.feeBilled)}
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
              {p.feeAllowed != null && <span>Allowed {formatUSD(p.feeAllowed)}</span>}
              {p.feePaid != null && <span>Paid {formatUSD(p.feePaid)}</span>}
              {p.patientResponsibility != null && <span>Pt resp. {formatUSD(p.patientResponsibility)}</span>}
            </div>
            {denial && (
              <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-tag-red-fg)' }}>
                Line denied: <span style={{ fontFamily: 'var(--ads-font-mono, ui-monospace)' }}>{denial.code}</span> — {denial.short}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PaymentsTab({ claim }: { claim: InsuranceClaim }) {
  if (claim.payments.length === 0) {
    return (
      <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--ads-text-muted)', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
        No payments posted yet.
      </div>
    );
  }
  return (
    <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {claim.payments.map((p) => (
        <div
          key={p.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 100px 80px',
            gap: '8px 16px',
            padding: '12px 14px',
            border: '1px solid var(--ads-border-subtle)',
            borderRadius: 'var(--ads-radius-sm)',
            backgroundColor: 'var(--ads-bg-surface)',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '13px', color: 'var(--ads-text-primary)' }}>
              {p.method.toUpperCase()} · {p.reference}
            </div>
            <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
              Posted by {p.postedBy} · {formatLongDate(p.postedAt)}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '13px', color: 'var(--ads-text-primary)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            {formatUSD(p.amount)}
          </div>
          <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)', textAlign: 'right' }}>
            {p.method === 'EFT' ? 'Insurance' : p.method === 'patient-card' ? 'Patient' : 'Check'}
          </div>
        </div>
      ))}
    </div>
  );
}

function AppealsTab({ claim }: { claim: InsuranceClaim }) {
  if (claim.appeals.length === 0) {
    return (
      <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--ads-text-muted)', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
        No appeals filed.
      </div>
    );
  }
  return (
    <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {claim.appeals.map((a, i) => (
        <div
          key={a.id}
          style={{
            padding: '12px 14px',
            border: '1px solid var(--ads-border-subtle)',
            borderRadius: 'var(--ads-radius-sm)',
            backgroundColor: 'var(--ads-bg-surface)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '13px', color: 'var(--ads-text-primary)' }}>
              Appeal #{i + 1}
            </span>
            <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
              {formatLongDate(a.filedAt)} · {a.filedBy}
            </span>
          </div>
          <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)', lineHeight: '18px' }}>
            {a.reason}
          </p>
          {a.outcome && (
            <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
              Outcome: <strong>{a.outcome.result}</strong> ({formatLongDate(a.outcome.decidedAt)})
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ActivityTab({ claim }: { claim: InsuranceClaim }) {
  return (
    <div style={{ paddingTop: '16px' }}>
      <ActivityFeed events={claim.activity} />
    </div>
  );
}

function ActionFooter({
  claim,
  dispatch,
}: {
  claim: InsuranceClaim;
  dispatch: React.Dispatch<ClaimsAction>;
}) {
  const buttons: React.ReactNode[] = [];

  if (canClaimTransition(claim.status, 'submitted')) {
    buttons.push(
      <PrimaryButton
        key="submit"
        size={36}
        onClick={() => dispatch({ type: 'ADVANCE', id: claim.id, to: 'submitted' })}
      >
        Submit to payer
      </PrimaryButton>,
    );
  }
  if (claim.status === 'in-review' || claim.status === 'submitted') {
    buttons.push(
      <SecondaryButton
        key="post"
        size={36}
        onClick={() => dispatch({ type: 'OPEN_MODAL', modal: { type: 'post-payment', claimId: claim.id } })}
      >
        Post payment
      </SecondaryButton>,
    );
    buttons.push(
      <SecondaryButton
        key="deny"
        size={36}
        onClick={() => dispatch({ type: 'ADVANCE', id: claim.id, to: 'denied', payload: { reason: 'manual' } })}
      >
        Mark denied
      </SecondaryButton>,
    );
  }
  if (claim.status === 'partial') {
    buttons.push(
      <PrimaryButton
        key="bill"
        size={36}
        onClick={() => dispatch({ type: 'ADVANCE', id: claim.id, to: 'balance-billed' })}
      >
        Send statement
      </PrimaryButton>,
    );
    buttons.push(
      <SecondaryButton
        key="post-partial"
        size={36}
        onClick={() => dispatch({ type: 'OPEN_MODAL', modal: { type: 'post-payment', claimId: claim.id } })}
      >
        Post payment
      </SecondaryButton>,
    );
  }
  if (claim.status === 'balance-billed') {
    buttons.push(
      <PrimaryButton
        key="pt-paid"
        size={36}
        onClick={() => dispatch({ type: 'OPEN_MODAL', modal: { type: 'post-payment', claimId: claim.id } })}
      >
        Post patient payment
      </PrimaryButton>,
    );
  }
  if (claim.status === 'denied') {
    const denial = denialReasonByCode(claim.denialReasonCode);
    if (denial?.appealable !== false) {
      buttons.push(
        <PrimaryButton
          key="appeal"
          size={36}
          onClick={() => dispatch({ type: 'OPEN_MODAL', modal: { type: 'file-appeal', claimId: claim.id } })}
        >
          File appeal
        </PrimaryButton>,
      );
    }
  }
  if (canClaimTransition(claim.status, 'written-off')) {
    buttons.push(
      <WarningButton
        key="writeoff"
        size={36}
        onClick={() => dispatch({ type: 'OPEN_MODAL', modal: { type: 'write-off', claimId: claim.id } })}
      >
        Write off
      </WarningButton>,
    );
  }

  if (buttons.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        flexShrink: 0,
        display: 'flex',
        gap: '8px',
        padding: '14px 24px',
        borderTop: '1px solid var(--ads-border-subtle)',
        backgroundColor: 'var(--ads-bg-surface)',
        flexWrap: 'wrap',
      }}
    >
      {buttons}
    </div>
  );
}
