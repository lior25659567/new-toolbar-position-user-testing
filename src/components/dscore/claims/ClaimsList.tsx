import React from 'react';
import { Avatar, Tag, type TagColor } from '../../../design-system';
import {
  type InsuranceClaim,
  type ClaimStatus,
  STATUS_LABEL,
  formatLongDate,
  formatUSD,
  claimAgeDays,
  claimOutstanding,
  bucketFor,
  OUTSTANDING_STATUSES,
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

export function ClaimsList({
  claims,
  onSelect,
}: {
  claims: InsuranceClaim[];
  onSelect: (id: string) => void;
}) {
  if (claims.length === 0) {
    return (
      <div
        style={{
          backgroundColor: 'var(--ads-bg-surface)',
          border: '1px solid var(--ads-border-subtle)',
          borderRadius: 'var(--ads-radius-sm)',
          padding: '48px 24px',
          textAlign: 'center',
          fontFamily: 'var(--ads-font-sans)',
          fontSize: '14px',
          color: 'var(--ads-text-muted)',
        }}
      >
        No claims match the current filters.
      </div>
    );
  }
  return (
    <section
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(140px, 1fr) minmax(0, 1.6fr) minmax(0, 1.2fr) 130px 110px 100px 110px',
          gap: '0 16px',
          alignItems: 'center',
          padding: '0 16px',
          fontFamily: 'var(--ads-font-sans)',
          fontSize: '13px',
        }}
      >
        {['Claim #', 'Patient', 'Payer', 'Status', 'Submitted', 'Age', 'Outstanding'].map((h, i) => (
          <div
            key={i}
            style={{
              padding: '12px 0',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--ads-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              borderBottom: '1px solid var(--ads-border-subtle)',
              textAlign: i >= 4 ? 'right' : 'left',
            }}
          >
            {h}
          </div>
        ))}

        {claims.map((c) => {
          const ageDays = claimAgeDays(c);
          const outstanding = claimOutstanding(c);
          const isOverdue = OUTSTANDING_STATUSES.includes(c.status) && ageDays > 90;
          return (
            <React.Fragment key={c.id}>
              <ClickableRow onClick={() => onSelect(c.id)}>
                <span style={{ fontFamily: 'var(--ads-font-mono, ui-monospace)', fontSize: '12px', color: 'var(--ads-text-primary)' }}>
                  {c.claimNumber}
                </span>
              </ClickableRow>
              <ClickableRow onClick={() => onSelect(c.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ads-text-primary)', fontWeight: 500 }}>
                    {c.patient.name}
                  </span>
                  <span style={{ color: 'var(--ads-text-muted)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    · {c.dentist.monogram}
                  </span>
                </div>
              </ClickableRow>
              <ClickableRow onClick={() => onSelect(c.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <Avatar name={c.payer.monogram} size="xs" />
                  <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ads-text-muted)' }}>
                    {c.payer.name}
                  </span>
                </div>
              </ClickableRow>
              <ClickableRow onClick={() => onSelect(c.id)}>
                <Tag size="small" color={STATUS_TONE[c.status]}>
                  {STATUS_LABEL[c.status]}
                </Tag>
              </ClickableRow>
              <ClickableRow onClick={() => onSelect(c.id)} alignRight>
                <span style={{ color: 'var(--ads-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                  {c.dateSubmitted ? formatLongDate(c.dateSubmitted) : '—'}
                </span>
              </ClickableRow>
              <ClickableRow onClick={() => onSelect(c.id)} alignRight>
                {OUTSTANDING_STATUSES.includes(c.status) ? (
                  <span style={{ color: isOverdue ? 'var(--ads-danger-500)' : 'var(--ads-text-primary)', fontVariantNumeric: 'tabular-nums', fontWeight: isOverdue ? 500 : 400 }}>
                    {ageDays}d <span style={{ color: 'var(--ads-text-muted)', fontWeight: 400 }}>({bucketFor(ageDays)})</span>
                  </span>
                ) : (
                  <span style={{ color: 'var(--ads-text-muted)' }}>—</span>
                )}
              </ClickableRow>
              <ClickableRow onClick={() => onSelect(c.id)} alignRight>
                <span style={{ fontVariantNumeric: 'tabular-nums', color: outstanding > 0 ? 'var(--ads-text-primary)' : 'var(--ads-text-muted)', fontWeight: outstanding > 0 ? 500 : 400 }}>
                  {outstanding > 0 ? formatUSD(outstanding) : '—'}
                </span>
              </ClickableRow>
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}

function ClickableRow({
  onClick,
  alignRight,
  children,
}: {
  onClick: () => void;
  alignRight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--ads-bg-page)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      style={{
        padding: '14px 0',
        borderBottom: '1px solid var(--ads-border-subtle)',
        cursor: 'pointer',
        textAlign: alignRight ? 'right' : 'left',
        minWidth: 0,
        display: alignRight ? 'block' : 'flex',
        alignItems: alignRight ? undefined : 'center',
        transition: 'background-color var(--ads-duration-fast)',
      }}
    >
      {children}
    </div>
  );
}
