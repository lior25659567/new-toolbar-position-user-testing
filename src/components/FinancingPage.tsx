import React, { useMemo, useState } from 'react';
import { Avatar, DropdownList, Modal, NumberInput, PrimaryButton, ProgressBar, SecondaryButton, Tag, TextInput, type TagColor } from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';
import { KpiTile } from './dscore/shared/KpiTile';

type PlanStatus = 'application' | 'approved' | 'declined' | 'active' | 'overdue' | 'completed' | 'defaulted';

interface FinancingPlan {
  id: string;
  patientName: string;
  amount: number;
  termMonths: number;
  apr: number;        // 0 for promo, > 0 for standard
  monthlyPayment: number;
  status: PlanStatus;
  paidMonths: number;
  missedMonths: number;
  createdAt: string;
  /** When status === application, this is the underwriting decision pipeline. */
  applicationStage?: 'soft-pull' | 'hard-pull' | 'underwriting' | 'awaiting-id';
}

const PLANS: FinancingPlan[] = [
  { id: 'fp-1', patientName: 'Ethan Liu',    amount: 3800, termMonths: 24, apr: 0,    monthlyPayment: 158.34, status: 'active',     paidMonths: 4, missedMonths: 0, createdAt: hoursAgo(120 * 24) },
  { id: 'fp-2', patientName: 'Leon Bernal',  amount: 5500, termMonths: 36, apr: 9.99, monthlyPayment: 177.36, status: 'active',     paidMonths: 8, missedMonths: 1, createdAt: hoursAgo(240 * 24) },
  { id: 'fp-3', patientName: 'Noor Hassan',  amount: 1200, termMonths: 12, apr: 0,    monthlyPayment: 100,    status: 'overdue',    paidMonths: 5, missedMonths: 2, createdAt: hoursAgo(210 * 24) },
  { id: 'fp-4', patientName: 'Mina Yamada',  amount: 1620, termMonths: 18, apr: 0,    monthlyPayment: 90,     status: 'application', paidMonths: 0, missedMonths: 0, createdAt: hoursAgo(2),  applicationStage: 'underwriting' },
  { id: 'fp-5', patientName: 'Aiko Tanaka',  amount: 2200, termMonths: 24, apr: 0,    monthlyPayment: 91.67,  status: 'completed',  paidMonths: 24, missedMonths: 0, createdAt: hoursAgo(750 * 24) },
];

const STATUS_TONE: Record<PlanStatus, TagColor> = {
  application: 'orange', approved: 'blue', declined: 'red', active: 'green', overdue: 'orange', completed: 'green', defaulted: 'red',
};

interface Props { onBackToHome?: () => void; onNavigate?: (id: DSCoreNavId) => void; }

export default function FinancingPage({ onBackToHome, onNavigate }: Props) {
  const [appModalOpen, setAppModalOpen] = useState(false);

  const totalFinanced = PLANS.reduce((s, p) => s + p.amount, 0);
  const collectedToDate = PLANS.reduce((s, p) => s + p.monthlyPayment * p.paidMonths, 0);
  const outstandingBalance = PLANS.filter((p) => p.status === 'active' || p.status === 'overdue').reduce((s, p) => s + p.monthlyPayment * (p.termMonths - p.paidMonths), 0);
  const overdue = PLANS.filter((p) => p.status === 'overdue').length;

  return (
    <DSCoreShell active="claims" unread={overdue} onNavigate={(id) => id === 'home' && onBackToHome ? onBackToHome() : onNavigate?.(id)}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '32px 40px 80px' }}>
        <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '28px', margin: 0, color: 'var(--ads-text-primary)' }}>
              Patient Financing
            </h1>
            <p style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)', margin: '6px 0 0' }}>
              0% promo and standard-APR plans for patients to spread out the cost of treatment. Application → soft-pull → hard-pull → underwriting → activation.
            </p>
          </div>
          <PrimaryButton size={36} onClick={() => setAppModalOpen(true)}>+ Start application</PrimaryButton>
        </header>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <KpiTile kpi={{ label: 'Total financed (lifetime)', value: totalFinanced, display: usd(totalFinanced) }} />
          <KpiTile kpi={{ label: 'Collected to date',         value: collectedToDate, display: usd(collectedToDate) }} />
          <KpiTile kpi={{ label: 'Outstanding receivable',    value: outstandingBalance, display: usd(outstandingBalance) }} />
          <KpiTile kpi={{ label: 'Overdue plans',             value: overdue, display: String(overdue) }} tone={overdue > 0 ? 'warning' : 'default'} invertDeltaSemantics />
        </div>

        <h3 style={{ margin: '8px 0 12px', fontFamily: 'var(--ads-font-sans)', fontSize: '15px', fontWeight: 500 }}>Plans</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {PLANS.map((p) => {
            const progress = (p.paidMonths / p.termMonths) * 100;
            return (
              <div key={p.id} style={{ padding: '16px', backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Avatar name={p.patientName.split(' ').map((s) => s[0]).slice(0, 2).join('')} size="md" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500 }}>{p.patientName}</span>
                      <Tag size="small" color={STATUS_TONE[p.status]}>{p.status}</Tag>
                      {p.apr === 0 && <Tag size="small" color="purple">0% promo</Tag>}
                      {p.applicationStage && <Tag size="small" color="blue">{p.applicationStage}</Tag>}
                      {p.missedMonths > 0 && p.status !== 'completed' && <Tag size="small" color="red">{p.missedMonths} missed</Tag>}
                    </div>
                    <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '14px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                      <span><strong>Total:</strong> {usd(p.amount)}</span>
                      <span><strong>Term:</strong> {p.termMonths}mo @ {p.apr}% APR</span>
                      <span><strong>Monthly:</strong> ${p.monthlyPayment.toFixed(2)}</span>
                      <span><strong>Paid:</strong> {p.paidMonths} / {p.termMonths}</span>
                      <span><strong>Started:</strong> {new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                    {p.status !== 'application' && (
                      <div style={{ marginTop: '8px' }}>
                        <ProgressBar value={progress} />
                      </div>
                    )}
                    {p.applicationStage && (
                      <ApplicationProgress stage={p.applicationStage} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {appModalOpen && <ApplicationModal onClose={() => setAppModalOpen(false)} />}
    </DSCoreShell>
  );
}

function ApplicationProgress({ stage }: { stage: NonNullable<FinancingPlan['applicationStage']> }) {
  const stages: NonNullable<FinancingPlan['applicationStage']>[] = ['soft-pull', 'hard-pull', 'underwriting', 'awaiting-id'];
  const idx = stages.indexOf(stage);
  return (
    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
      {stages.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: i <= idx ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '11px', color: i === idx ? 'var(--ads-text-primary)' : 'var(--ads-text-muted)', fontWeight: i === idx ? 500 : 400 }}>{s}</span>
          </div>
          {i < stages.length - 1 && <span style={{ flex: 1, height: 1, backgroundColor: i < idx ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)' }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function ApplicationModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'amount' | 'profile' | 'review' | 'decision'>('amount');
  const [amount, setAmount] = useState(2400);
  const [term, setTerm]     = useState(12);
  const [apr, setApr]       = useState(0);
  const [name, setName]     = useState('');
  const [income, setIncome] = useState(75000);
  const [decision, setDecision] = useState<'approved' | 'declined' | null>(null);

  const monthly = useMemo(() => {
    if (apr === 0) return amount / term;
    const r = (apr / 100) / 12;
    return (amount * r) / (1 - Math.pow(1 + r, -term));
  }, [amount, term, apr]);

  const onSubmit = () => {
    setStep('decision');
    setTimeout(() => setDecision(income > 30000 ? 'approved' : 'declined'), 800);
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="New financing application"
      size="md"
      footer={
        step === 'amount' ? (
          <PrimaryButton size={36} onClick={() => setStep('profile')}>Next: profile</PrimaryButton>
        ) : step === 'profile' ? (
          <>
            <SecondaryButton size={36} onClick={() => setStep('amount')}>Back</SecondaryButton>
            <PrimaryButton size={36} onClick={() => setStep('review')}>Next: review</PrimaryButton>
          </>
        ) : step === 'review' ? (
          <>
            <SecondaryButton size={36} onClick={() => setStep('profile')}>Back</SecondaryButton>
            <PrimaryButton size={36} onClick={onSubmit}>Submit application</PrimaryButton>
          </>
        ) : (
          <PrimaryButton size={36} onClick={onClose}>Close</PrimaryButton>
        )
      }
    >
      {step === 'amount' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <NumberInput label="Treatment cost" value={amount} onChange={(v) => setAmount(Number(v) || 0)} fullWidth />
          <DropdownList
            label="Term"
            options={[6, 12, 18, 24, 36, 48, 60].map((m) => ({ value: String(m), label: `${m} months` }))}
            value={String(term)}
            onChange={(v) => setTerm(Number(v))}
            fullWidth
          />
          <DropdownList
            label="Promo / APR"
            options={[
              { value: '0',    label: '0% APR (6–24 month promo)' },
              { value: '9.99', label: '9.99% APR (standard)' },
              { value: '14.99',label: '14.99% APR (extended)' },
            ]}
            value={String(apr)}
            onChange={(v) => setApr(Number(v))}
            fullWidth
          />
          <div style={{ padding: '10px 12px', backgroundColor: 'var(--ads-tag-blue-bg)', border: '1px solid var(--ads-tag-blue-br)', borderRadius: 'var(--ads-radius-sm)', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
            Estimated monthly payment: <strong>${monthly.toFixed(2)}</strong>
          </div>
        </div>
      )}
      {step === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <TextInput label="Full legal name" required value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <NumberInput label="Annual income (USD)" value={income} onChange={(v) => setIncome(Number(v) || 0)} fullWidth />
          <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
            We'll perform a soft credit pull first (no impact on credit score). Hard pull happens only when you approve the offer.
          </p>
        </div>
      )}
      {step === 'review' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Patient</span><strong>{name}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Treatment cost</span><strong>${amount.toLocaleString()}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Term</span><strong>{term} months @ {apr}% APR</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Monthly</span><strong>${monthly.toFixed(2)}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total of payments</span><strong>${(monthly * term).toFixed(2)}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total interest</span><strong>${((monthly * term) - amount).toFixed(2)}</strong></div>
        </div>
      )}
      {step === 'decision' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          {!decision ? (
            <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)' }}>Submitting to underwriter…</p>
          ) : decision === 'approved' ? (
            <>
              <div style={{ fontSize: 32, marginBottom: '8px' }}>✓</div>
              <h2 style={{ margin: '0 0 4px', fontFamily: 'var(--ads-font-sans)', fontSize: '20px', fontWeight: 500, color: 'var(--ads-success-600)' }}>Approved</h2>
              <p style={{ margin: '0 auto', maxWidth: '400px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)' }}>
                {name} is approved for {term} months at {apr}% APR — about ${monthly.toFixed(2)}/mo. We've sent the patient a link to e-sign and confirm.
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize: 32, marginBottom: '8px' }}>✗</div>
              <h2 style={{ margin: '0 0 4px', fontFamily: 'var(--ads-font-sans)', fontSize: '20px', fontWeight: 500, color: 'var(--ads-danger-500)' }}>Declined</h2>
              <p style={{ margin: '0 auto', maxWidth: '400px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)' }}>
                We weren't able to approve the application at the requested terms. Try a smaller amount or a longer term.
              </p>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}

function usd(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}
