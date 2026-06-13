import React, { useMemo, useState } from 'react';
import {
  DropdownList,
  LinkButton,
  Modal,
  PrimaryButton,
  ProgressBar,
  SecondaryButton,
  Tag,
  TextInput,
  WarningButton,
  type TagColor,
} from '../../design-system';
import {
  type SettingsState,
  type SettingsAction,
  type PlanId,
  type PaymentMethod,
  PLAN_TIERS,
  formatUSD,
  formatDate,
  planById,
} from './settingsState';
import { SectionCard } from './sectionShared';

const STATUS_TONE: Record<'paid' | 'open' | 'void' | 'failed', TagColor> = {
  paid:   'green',
  open:   'blue',
  void:   'magenta',
  failed: 'red',
};

export function PlanBillingSection({
  state,
  dispatch,
}: {
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
}) {
  const [editPaymentOpen, setEditPaymentOpen] = useState(false);
  const current = planById(state.plan.currentPlan);

  return (
    <>
      <SectionCard
        title="Current plan"
        description="Update your subscription, see usage, and review invoices."
        headerExtra={
          <SecondaryButton size={36} onClick={() => dispatch({ type: 'OPEN_COMPARE' })}>
            Compare plans
          </SecondaryButton>
        }
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '8px 4px 20px',
            borderBottom: '1px solid var(--ads-border-subtle)',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '20px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>
                {current.name}
              </span>
              {current.highlighted && <Tag size="small" color="purple">Most popular</Tag>}
            </div>
            <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-muted)', marginTop: '2px' }}>
              {formatUSD(current.monthlyUSD)} / month — billed monthly
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            padding: '20px 0 4px',
          }}
        >
          <UsageMeter
            label="Cases this month"
            value={state.plan.usage.casesThisMonth}
            limit={current.limits.cases}
          />
          <UsageMeter
            label="Storage"
            value={state.plan.usage.storageGbUsed}
            limit={current.limits.storageGb}
            unit=" GB"
          />
          <UsageMeter
            label="Team seats"
            value={state.plan.usage.seatsUsed}
            limit={current.limits.seats}
          />
          <UsageMeter
            label="Active integrations"
            value={state.plan.usage.integrationsActive}
            limit={current.limits.integrations}
          />
        </div>
      </SectionCard>

      <SectionCard title="Payment method" description="Used for monthly subscription charges and any add-on usage.">
        {state.plan.paymentMethod ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '32px',
                borderRadius: '4px',
                backgroundColor: 'var(--ads-bg-page)',
                border: '1px solid var(--ads-border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--ads-font-sans)',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--ads-text-primary)',
              }}
            >
              {state.plan.paymentMethod.brand.slice(0, 4).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>
                {state.plan.paymentMethod.brand} ··· {state.plan.paymentMethod.last4}
              </div>
              <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                Expires {String(state.plan.paymentMethod.expMonth).padStart(2, '0')}/{state.plan.paymentMethod.expYear}
              </div>
            </div>
            <LinkButton onClick={() => setEditPaymentOpen(true)}>Update</LinkButton>
          </div>
        ) : (
          <PrimaryButton size={36} onClick={() => setEditPaymentOpen(true)}>
            Add payment method
          </PrimaryButton>
        )}
      </SectionCard>

      <SectionCard title="Invoices" description="Historical charges. Download a PDF for any line.">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr) 100px 100px 100px',
            gap: '0 16px',
            alignItems: 'center',
            fontFamily: 'var(--ads-font-sans)',
            fontSize: '13px',
          }}
        >
          {['Invoice', 'Date', 'Amount', 'Status', ''].map((h, i) => (
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
          {state.plan.invoices.map((inv) => (
            <React.Fragment key={inv.id}>
              <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)', color: 'var(--ads-text-primary)', fontFamily: 'var(--ads-font-mono, ui-monospace)', fontSize: '12px' }}>
                {inv.number}
              </div>
              <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)', color: 'var(--ads-text-muted)' }}>
                {formatDate(inv.date)}
              </div>
              <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)', color: 'var(--ads-text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                {formatUSD(inv.amountUSD)}
              </div>
              <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)' }}>
                <Tag size="small" color={STATUS_TONE[inv.status]}>{inv.status}</Tag>
              </div>
              <div style={{ padding: '14px 0', borderBottom: '1px solid var(--ads-border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                <LinkButton onClick={() => alert(`Mock download for ${inv.number}`)}>Download</LinkButton>
              </div>
            </React.Fragment>
          ))}
        </div>
      </SectionCard>

      {state.plan.compareOpen && <CompareModal state={state} dispatch={dispatch} />}
      {editPaymentOpen && (
        <PaymentMethodModal
          existing={state.plan.paymentMethod}
          onClose={() => setEditPaymentOpen(false)}
          onSave={(pm) => {
            dispatch({ type: 'UPDATE_PAYMENT_METHOD', pm });
            setEditPaymentOpen(false);
          }}
        />
      )}
    </>
  );
}

function UsageMeter({ label, value, limit, unit = '' }: { label: string; value: number; limit: number; unit?: string }) {
  const unlimited = limit === -1;
  const pct = unlimited ? 0 : Math.min(100, (value / Math.max(1, limit)) * 100);
  const tone: 'default' | 'warning' = !unlimited && pct > 80 ? 'warning' : 'default';
  const display = unlimited ? `${value}${unit} / ∞` : `${value}${unit} / ${limit}${unit}`;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
        <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: tone === 'warning' ? 'var(--ads-danger-500)' : 'var(--ads-text-primary)', fontVariantNumeric: 'tabular-nums' }}>
          {display}
        </span>
      </div>
      {unlimited ? (
        <div
          style={{
            height: '4px',
            borderRadius: '2px',
            backgroundColor: 'var(--ads-bg-page)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, var(--ads-tag-purple-bg) 0 6px, var(--ads-tag-purple-br) 6px 12px)' }} />
        </div>
      ) : (
        <ProgressBar value={pct} error={tone === 'warning' ? `${Math.round(pct)}% used` : undefined} />
      )}
    </div>
  );
}

function CompareModal({
  state,
  dispatch,
}: {
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
}) {
  const target = state.plan.targetPlan;

  return (
    <Modal
      open
      onClose={() => dispatch({ type: 'CLOSE_COMPARE' })}
      title="Compare plans"
      size="lg"
      footer={
        target ? (
          <>
            <SecondaryButton size={36} onClick={() => dispatch({ type: 'PICK_TARGET_PLAN', plan: null })}>
              Back
            </SecondaryButton>
            <WarningButton size={36} onClick={() => dispatch({ type: 'CHANGE_PLAN', plan: target })}>
              Confirm change to {planById(target).name}
            </WarningButton>
          </>
        ) : (
          <SecondaryButton size={36} onClick={() => dispatch({ type: 'CLOSE_COMPARE' })}>
            Close
          </SecondaryButton>
        )
      }
    >
      {target ? (
        <ConfirmStrip
          fromPlan={state.plan.currentPlan}
          toPlan={target}
        />
      ) : null}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginTop: target ? '16px' : 0,
        }}
      >
        {PLAN_TIERS.map((p) => {
          const isCurrent = p.id === state.plan.currentPlan;
          return (
            <div
              key={p.id}
              style={{
                position: 'relative',
                padding: '20px',
                border: `1px solid ${p.highlighted ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
                borderRadius: 'var(--ads-radius-sm)',
                backgroundColor: 'var(--ads-bg-surface)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {p.highlighted && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '16px',
                  }}
                >
                  <Tag size="small" color="blue">Most popular</Tag>
                </div>
              )}
              <div>
                <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '15px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>
                  {p.name}
                </div>
                <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '24px', fontWeight: 500, color: 'var(--ads-text-primary)', marginTop: '4px' }}>
                  {formatUSD(p.monthlyUSD)}
                  <span style={{ fontSize: '13px', color: 'var(--ads-text-muted)', fontWeight: 400 }}> / month</span>
                </div>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {p.features.map((f, i) => (
                  <li
                    key={i}
                    style={{
                      fontFamily: 'var(--ads-font-sans)',
                      fontSize: '13px',
                      color: 'var(--ads-text-primary)',
                      paddingLeft: '20px',
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '2px',
                        width: '14px',
                        height: '14px',
                        color: 'var(--ads-blue-500)',
                      }}
                    >
                      <CheckIcon />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 'auto' }}>
                {isCurrent ? (
                  <SecondaryButton size={36} disabled fullWidth>
                    Current plan
                  </SecondaryButton>
                ) : (
                  <PrimaryButton size={36} fullWidth onClick={() => dispatch({ type: 'PICK_TARGET_PLAN', plan: p.id })}>
                    Switch to {p.name}
                  </PrimaryButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

function ConfirmStrip({ fromPlan, toPlan }: { fromPlan: PlanId; toPlan: PlanId }) {
  const from = planById(fromPlan);
  const to = planById(toPlan);
  const upgrading = to.monthlyUSD > from.monthlyUSD;
  const diff = Math.abs(to.monthlyUSD - from.monthlyUSD);
  return (
    <div
      style={{
        padding: '12px 16px',
        backgroundColor: 'var(--ads-tag-orange-bg)',
        border: '1px solid var(--ads-tag-orange-br)',
        borderRadius: 'var(--ads-radius-sm)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontFamily: 'var(--ads-font-sans)',
        fontSize: '13px',
        color: 'var(--ads-text-primary)',
      }}
    >
      <strong>Confirm plan change</strong>
      <span>
        Moving from <strong>{from.name}</strong> to <strong>{to.name}</strong>{' '}
        — that's {upgrading ? 'an extra' : 'a savings of'} <strong>{formatUSD(diff)}</strong> / month, prorated to today.
      </span>
    </div>
  );
}

function PaymentMethodModal({
  existing,
  onClose,
  onSave,
}: {
  existing: PaymentMethod | null;
  onClose: () => void;
  onSave: (pm: PaymentMethod) => void;
}) {
  const [brand, setBrand] = useState<PaymentMethod['brand']>(existing?.brand ?? 'Visa');
  const [last4, setLast4] = useState(existing?.last4 ?? '');
  const [expMonth, setExpMonth] = useState(String(existing?.expMonth ?? ''));
  const [expYear, setExpYear] = useState(String(existing?.expYear ?? ''));

  const valid = useMemo(() => {
    if (!/^\d{4}$/.test(last4)) return false;
    const m = Number(expMonth);
    const y = Number(expYear);
    if (!(m >= 1 && m <= 12)) return false;
    if (!(y >= 2024 && y <= 2050)) return false;
    return true;
  }, [last4, expMonth, expYear]);

  return (
    <Modal
      open
      onClose={onClose}
      title="Update payment method"
      size="sm"
      footer={
        <>
          <SecondaryButton size={36} onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton
            size={36}
            disabled={!valid}
            onClick={() => onSave({ brand, last4, expMonth: Number(expMonth), expYear: Number(expYear) })}
          >
            Save
          </PrimaryButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <DropdownList
          label="Card brand"
          options={[
            { value: 'Visa',       label: 'Visa' },
            { value: 'Mastercard', label: 'Mastercard' },
            { value: 'Amex',       label: 'American Express' },
            { value: 'Discover',   label: 'Discover' },
          ]}
          value={brand}
          onChange={(v) => setBrand(v as PaymentMethod['brand'])}
          fullWidth
        />
        <TextInput
          label="Last 4 digits"
          required
          maxLength={4}
          placeholder="4242"
          value={last4}
          onChange={(e) => setLast4(e.target.value.replace(/\D/g, ''))}
          fullWidth
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <TextInput
            label="Exp month"
            required
            placeholder="07"
            maxLength={2}
            value={expMonth}
            onChange={(e) => setExpMonth(e.target.value.replace(/\D/g, ''))}
            fullWidth
          />
          <TextInput
            label="Exp year"
            required
            placeholder="2028"
            maxLength={4}
            value={expYear}
            onChange={(e) => setExpYear(e.target.value.replace(/\D/g, ''))}
            fullWidth
          />
        </div>
        <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
          Card details are tokenized via Stripe — we never store the full number.
        </p>
      </div>
    </Modal>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 7.5l3 3 5-6" />
    </svg>
  );
}
