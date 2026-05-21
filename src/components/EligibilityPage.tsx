import React, { useState } from 'react';
import { Avatar, DropdownList, Modal, PrimaryButton, SecondaryButton, Tag, TextInput, type TagColor } from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';

interface BenefitResult {
  id: string;
  patientName: string;
  payer: string;
  memberId: string;
  group: string;
  status: 'eligible' | 'inactive' | 'unknown';
  network: 'in-network' | 'out-of-network';
  /** Last refresh — eligibility data ages quickly (24h cache rule). */
  asOf: string;
  cacheAgeMin: number;
  /** Annual maximum / used / remaining. */
  annual: { max: number; used: number; remaining: number };
  /** Remaining deductible. */
  deductible: { individual: number; family: number; metInd: number; metFam: number };
  /** Coverage % per category. */
  coverage: { preventive: number; basic: number; major: number; ortho: number };
  /** Frequency limitations the payer enforces. */
  frequencyLimits: { service: string; limit: string; used: string }[];
}

const SEED_RESULTS: BenefitResult[] = [
  {
    id: 'el-1',
    patientName: 'Mina Yamada',
    payer: 'Delta Dental PPO',
    memberId: '0098-7621-001',
    group: 'GP-449',
    status: 'eligible',
    network: 'in-network',
    asOf: hoursAgo(2),
    cacheAgeMin: 120,
    annual:     { max: 2000, used: 624, remaining: 1376 },
    deductible: { individual: 50, family: 150, metInd: 50, metFam: 50 },
    coverage:   { preventive: 100, basic: 80, major: 50, ortho: 50 },
    frequencyLimits: [
      { service: 'Adult prophy (D1110)',  limit: '2 / yr',           used: '1 / yr' },
      { service: 'Bitewings (D0274)',     limit: '1 / yr',           used: '1 / yr' },
      { service: 'Crown — same tooth',    limit: '1 every 5 years',  used: '0' },
    ],
  },
];

interface PreAuth {
  id: string;
  patientName: string;
  payer: string;
  procedures: string[];
  status: 'draft' | 'submitted' | 'in-review' | 'approved' | 'denied' | 'expired';
  submittedAt?: string;
  responseDueBy?: string;
  decidedAt?: string;
  amountRequested: number;
  amountApproved?: number;
  authNumber?: string;
  notes?: string;
}

const SEED_PREAUTHS: PreAuth[] = [
  { id: 'pa-1', patientName: 'Ethan Liu',   payer: 'Cigna Dental', procedures: ['D6010 Implant placement #19', 'D6058 Custom abutment'], status: 'in-review', submittedAt: hoursAgo(120), responseDueBy: hoursAgo(-72), amountRequested: 3800 },
  { id: 'pa-2', payer: 'Aetna Dental',   patientName: 'Leon Bernal', procedures: ['D8090 Comprehensive ortho — adult'],                  status: 'approved',  submittedAt: hoursAgo(360), decidedAt: hoursAgo(72), amountRequested: 5500, amountApproved: 4400, authNumber: 'AUTH-2026-DEN-998723' },
  { id: 'pa-3', payer: 'Delta Dental',   patientName: 'Noor Hassan', procedures: ['D3310 RCT — anterior'],                              status: 'denied',    submittedAt: hoursAgo(240), decidedAt: hoursAgo(48), amountRequested: 950,  notes: 'Denied — insufficient documentation. Resubmit with periapical + narrative.' },
  { id: 'pa-4', payer: 'MetLife',        patientName: 'Aiko Tanaka', procedures: ['D2740 Crown — porcelain/ceramic #14'],                status: 'submitted', submittedAt: hoursAgo(8),   responseDueBy: hoursAgo(-300), amountRequested: 1325 },
  { id: 'pa-5', payer: 'BCBS',           patientName: 'Tomás Rivera',procedures: ['D7140 Extraction — erupted'],                        status: 'draft',                                                         amountRequested: 240 },
];

const PA_TONE: Record<PreAuth['status'], TagColor> = {
  draft: 'magenta', submitted: 'blue', 'in-review': 'blue', approved: 'green', denied: 'red', expired: 'red',
};

interface Props { onBackToHome?: () => void; onNavigate?: (id: DSCoreNavId) => void; }

export default function EligibilityPage({ onBackToHome, onNavigate }: Props) {
  const [tab, setTab] = useState<'eligibility' | 'preauth'>('eligibility');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<BenefitResult | null>(SEED_RESULTS[0]);
  const [patient, setPatient] = useState('Mina Yamada');
  const [memberId, setMemberId] = useState('0098-7621-001');
  const [payerId, setPayerId] = useState('Delta Dental PPO');

  const onRun = () => {
    setRunning(true);
    setTimeout(() => {
      setResult({ ...SEED_RESULTS[0], asOf: new Date().toISOString(), cacheAgeMin: 0, patientName: patient, memberId, payer: payerId });
      setRunning(false);
    }, 700);
  };

  return (
    <DSCoreShell active="claims" unread={0} onNavigate={(id) => id === 'home' && onBackToHome ? onBackToHome() : onNavigate?.(id)}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '32px 40px 80px' }}>
        <header style={{ marginBottom: '20px' }}>
          <h1 style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '28px', margin: 0, color: 'var(--ads-text-primary)' }}>
            Eligibility & Pre-Authorization
          </h1>
          <p style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)', margin: '6px 0 0' }}>
            Verify benefits before scheduling and submit pre-authorizations for major procedures.
          </p>
        </header>

        <nav style={{ display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: '1px solid var(--ads-border-subtle)' }}>
          {[
            { id: 'eligibility', label: 'Real-time eligibility' },
            { id: 'preauth',     label: `Pre-authorizations (${SEED_PREAUTHS.length})` },
          ].map((t) => {
            const isActive = tab === t.id;
            return (
              <button key={t.id} type="button" onClick={() => setTab(t.id as typeof tab)} style={{ padding: '10px 14px', border: 'none', borderBottom: `2px solid ${isActive ? 'var(--ads-blue-500)' : 'transparent'}`, background: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: isActive ? 500 : 400, color: isActive ? 'var(--ads-blue-550)' : 'var(--ads-text-muted)' }}>
                {t.label}
              </button>
            );
          })}
        </nav>

        {tab === 'eligibility' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)', gap: '16px' }}>
            <Card title="Lookup">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <DropdownList
                  label="Patient"
                  options={['Mina Yamada', 'Ethan Liu', 'Noor Hassan', 'Leon Bernal', 'Aiko Tanaka'].map((n) => ({ value: n, label: n }))}
                  value={patient}
                  onChange={setPatient}
                  fullWidth
                />
                <TextInput label="Member ID" required value={memberId} onChange={(e) => setMemberId(e.target.value)} fullWidth />
                <TextInput label="Payer"     required value={payerId}  onChange={(e) => setPayerId(e.target.value)} fullWidth />
                <PrimaryButton size={36} onClick={onRun} disabled={running}>{running ? 'Checking…' : 'Verify benefits'}</PrimaryButton>
                <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                  Results cached for 24 hours per payer policy.
                </p>
              </div>
            </Card>

            <Card title="Benefits" extra={result && (
              <Tag color={result.status === 'eligible' ? 'green' : result.status === 'inactive' ? 'red' : 'orange'}>
                {result.status} · {result.network}
              </Tag>
            )}>
              {!result ? (
                <div style={{ padding: '32px', textAlign: 'center', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-muted)' }}>
                  Run a lookup to see benefits.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar name={result.patientName.split(' ').map((s) => s[0]).slice(0, 2).join('')} size="md" />
                    <div>
                      <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500 }}>{result.patientName}</div>
                      <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>{result.payer} · {result.memberId} · group {result.group}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                      As of {new Date(result.asOf).toLocaleString()} ({result.cacheAgeMin}m cache)
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    <Stat label="Annual max"      value={`$${result.annual.max.toLocaleString()}`} />
                    <Stat label="Used to date"    value={`$${result.annual.used.toLocaleString()}`} />
                    <Stat label="Remaining"       value={`$${result.annual.remaining.toLocaleString()}`} tone="success" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    <Stat label="Deductible (ind)" value={`$${result.deductible.metInd} / $${result.deductible.individual}`} />
                    <Stat label="Deductible (fam)" value={`$${result.deductible.metFam} / $${result.deductible.family}`} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 8px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Coverage</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      <CoverageTile label="Preventive" pct={result.coverage.preventive} />
                      <CoverageTile label="Basic"      pct={result.coverage.basic} />
                      <CoverageTile label="Major"      pct={result.coverage.major} />
                      <CoverageTile label="Ortho"      pct={result.coverage.ortho} />
                    </div>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 8px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Frequency limits</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {result.frequencyLimits.map((f, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '8px', padding: '6px 8px', backgroundColor: 'var(--ads-bg-page)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', fontFamily: 'var(--ads-font-sans)', fontSize: '12px' }}>
                          <span>{f.service}</span>
                          <span style={{ color: 'var(--ads-text-muted)' }}>{f.limit}</span>
                          <span>{f.used}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <PreAuthList />
        )}
      </div>
    </DSCoreShell>
  );
}

function CoverageTile({ label, pct }: { label: string; pct: number }) {
  return (
    <div style={{ padding: '10px 12px', backgroundColor: 'var(--ads-bg-page)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)' }}>
      <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--ads-text-muted)' }}>{label}</div>
      <div style={{ marginTop: '4px', fontFamily: 'var(--ads-font-sans)', fontSize: '17px', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{pct}%</div>
    </div>
  );
}

function Stat({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'success' }) {
  return (
    <div style={{ padding: '10px 12px', backgroundColor: 'var(--ads-bg-page)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)' }}>
      <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--ads-text-muted)' }}>{label}</div>
      <div style={{ marginTop: '4px', fontFamily: 'var(--ads-font-sans)', fontSize: '17px', fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: tone === 'success' ? 'var(--ads-success-600)' : 'var(--ads-text-primary)' }}>{value}</div>
    </div>
  );
}

function PreAuthList() {
  const [submitOpen, setSubmitOpen] = useState(false);
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
        <PrimaryButton size={36} onClick={() => setSubmitOpen(true)}>+ Submit pre-auth</PrimaryButton>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {SEED_PREAUTHS.map((p) => {
          const dueIn = p.responseDueBy ? Math.round((new Date(p.responseDueBy).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
          return (
            <div key={p.id} style={{ padding: '14px 16px', backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500 }}>{p.patientName}</span>
                <Tag size="small" color={PA_TONE[p.status]}>{p.status}</Tag>
                <Tag size="small" color="purple">{p.payer}</Tag>
                {p.authNumber && <Tag size="small" color="green">Auth: {p.authNumber}</Tag>}
              </div>
              <div style={{ marginTop: '4px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                {p.procedures.join(' · ')}
              </div>
              <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '12px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px' }}>
                <span><strong>Requested:</strong> ${p.amountRequested.toLocaleString()}</span>
                {p.amountApproved != null && <span><strong>Approved:</strong> ${p.amountApproved.toLocaleString()}</span>}
                {p.submittedAt && <span><strong>Submitted:</strong> {new Date(p.submittedAt).toLocaleDateString()}</span>}
                {dueIn != null && p.status === 'in-review' && (
                  <span style={{ color: dueIn < 0 ? 'var(--ads-danger-500)' : 'var(--ads-text-primary)' }}>
                    <strong>Response due:</strong> {dueIn < 0 ? `${Math.abs(dueIn)}d overdue` : `in ${dueIn}d`}
                  </span>
                )}
              </div>
              {p.notes && (
                <div style={{ marginTop: '8px', padding: '8px 10px', backgroundColor: 'var(--ads-tag-red-bg)', border: '1px solid var(--ads-tag-red-br)', borderRadius: 'var(--ads-radius-sm)', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-tag-red-fg)' }}>
                  {p.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {submitOpen && (
        <Modal open onClose={() => setSubmitOpen(false)} title="Submit pre-authorization" size="md" footer={
          <>
            <SecondaryButton size={36} onClick={() => setSubmitOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton size={36} onClick={() => setSubmitOpen(false)}>Submit to payer</PrimaryButton>
          </>
        }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <DropdownList label="Patient" options={['Mina Yamada','Ethan Liu','Noor Hassan'].map((n) => ({ value: n, label: n }))} value="Mina Yamada" onChange={() => {}} fullWidth />
            <DropdownList label="Payer" options={['Delta Dental','Cigna','Aetna','MetLife','BCBS'].map((n) => ({ value: n, label: n }))} value="Delta Dental" onChange={() => {}} fullWidth />
            <TextInput label="Procedures (one per line)" fullWidth />
            <TextInput label="Clinical narrative" fullWidth />
            <TextInput label="Requested amount" fullWidth />
            <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
              Attach radiographs and photos before submitting. Once approved, the auth number auto-attaches to claims for these procedures.
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}

function Card({ title, extra, children }: { title: string; extra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section style={{ backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '15px' }}>{title}</h3>
        {extra}
      </header>
      {children}
    </section>
  );
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}
