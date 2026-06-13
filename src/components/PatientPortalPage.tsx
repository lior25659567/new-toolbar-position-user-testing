import React, { useState } from 'react';
import { Avatar, Modal, PrimaryButton, SecondaryButton, Tag, TextInput, type TagColor } from '../design-system';

interface Props { onBackToHome?: () => void }

interface PatientUpcoming { id: string; date: string; time: string; provider: string; procedure: string; operatory: string; }
interface PatientBalance { invoiceId: string; date: string; description: string; amount: number; status: 'due' | 'paid'; }
interface PatientPlan { phase: string; procedures: { name: string; tooth?: string; status: 'planned' | 'completed' }[]; cost: number; }
interface PatientMessage { from: string; date: string; body: string; }

const upcoming: PatientUpcoming = { id: 'apt-1', date: '2026-05-08', time: '9:30 AM', provider: 'Dr. Alex Watanabe', procedure: 'Crown seat #14', operatory: 'Op 1' };

const previous: PatientUpcoming[] = [
  { id: 'apt-0', date: '2026-04-29', time: '8:30 AM', provider: 'Dr. Alex Watanabe', procedure: 'Crown prep #14',     operatory: 'Op 1' },
  { id: 'apt-x', date: '2026-04-15', time: '9:00 AM', provider: 'Sara Singh, RDH',   procedure: 'Cleaning + exam',     operatory: 'Op 3' },
];

const plan: PatientPlan[] = [
  { phase: 'Diagnostic', procedures: [{ name: 'Comprehensive evaluation', status: 'completed' }, { name: 'Bitewings + pano', status: 'completed' }], cost: 195 },
  { phase: 'Restoration', procedures: [{ name: 'Crown — porcelain/ceramic', tooth: '#14', status: 'planned' }, { name: 'Core buildup', tooth: '#14', status: 'planned' }], cost: 1620 },
  { phase: 'Maintenance', procedures: [{ name: 'Cleaning (6mo)', status: 'planned' }], cost: 110 },
];

const balance: PatientBalance[] = [
  { invoiceId: 'INV-1042', date: '2026-04-29', description: 'Crown prep visit copay',     amount: 65,  status: 'due' },
  { invoiceId: 'INV-1031', date: '2026-04-15', description: 'Cleaning + exam',            amount: 0,   status: 'paid' },
  { invoiceId: 'INV-0998', date: '2025-10-22', description: 'Composite filling #19',      amount: 220, status: 'paid' },
];

const messages: PatientMessage[] = [
  { from: 'Sara Singh (DS Core, Demo)', date: '2026-04-30', body: 'Reminder: your crown seat is May 8 at 9:30 AM. Reply to confirm.' },
  { from: 'Dr. Alex Watanabe',          date: '2026-04-29', body: "Today's prep went smoothly. Take ibuprofen for any soreness; the lab will deliver in ~10 days." },
];

export default function PatientPortalPage({ onBackToHome }: Props) {
  const [tab, setTab] = useState<'home' | 'plan' | 'balance' | 'messages' | 'forms'>('home');
  const [confirmAptOpen, setConfirmAptOpen] = useState(false);
  const [payOpen, setPayOpen] = useState<PatientBalance | null>(null);

  const dueTotal = balance.filter((b) => b.status === 'due').reduce((s, b) => s + b.amount, 0);
  const planTotal = plan.reduce((s, p) => s + p.cost, 0);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--ads-bg-page)', fontFamily: 'var(--ads-font-sans)', overflow: 'auto' }}>
      <header style={{ height: 56, backgroundColor: 'var(--ads-bg-surface)', borderBottom: '1px solid var(--ads-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 600, fontSize: '15px', letterSpacing: '0.06em' }}>DS CORE, Demo</span>
          <Tag size="small" color="purple">Patient view</Tag>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button type="button" onClick={onBackToHome} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', color: 'var(--ads-text-muted)' }}>
            Back to staff view
          </button>
          <Avatar name="MY" size="sm" />
          <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)' }}>Mina Yamada</span>
        </div>
      </header>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px 80px', width: '100%' }}>
        <h1 style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '28px', margin: 0 }}>
          Welcome back, Mina.
        </h1>
        <p style={{ margin: '6px 0 0', fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)' }}>
          Your next visit is in 8 days. You have {balance.filter((b) => b.status === 'due').length} balance line waiting on you.
        </p>

        <nav style={{ display: 'flex', gap: '4px', marginTop: '20px', borderBottom: '1px solid var(--ads-border-subtle)' }}>
          {[
            { id: 'home',     label: 'Home' },
            { id: 'plan',     label: 'Treatment plan' },
            { id: 'balance',  label: `Balance (${dueTotal > 0 ? `$${dueTotal} due` : 'paid'})` },
            { id: 'messages', label: `Messages (${messages.length})` },
            { id: 'forms',    label: 'Forms' },
          ].map((t) => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id as typeof tab)}
                style={{
                  padding: '10px 14px',
                  border: 'none',
                  borderBottom: `2px solid ${isActive ? 'var(--ads-blue-500)' : 'transparent'}`,
                  background: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '13px',
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? 'var(--ads-blue-550)' : 'var(--ads-text-muted)',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: '20px' }}>
          {tab === 'home' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Card>
                <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '16px', fontWeight: 500 }}>Your next appointment</h3>
                <p style={{ margin: '4px 0 0', fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)' }}>
                  {new Date(upcoming.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} · {upcoming.time}
                </p>
                <div style={{ marginTop: '12px', padding: '14px 16px', backgroundColor: 'var(--ads-bg-page)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)' }}>
                  <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '15px', fontWeight: 500 }}>{upcoming.procedure}</div>
                  <div style={{ marginTop: '4px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-muted)' }}>
                    With {upcoming.provider} · {upcoming.operatory}
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <PrimaryButton size={36} onClick={() => setConfirmAptOpen(true)}>Confirm</PrimaryButton>
                    <SecondaryButton size={36}>Reschedule</SecondaryButton>
                    <SecondaryButton size={36}>Cancel</SecondaryButton>
                  </div>
                </div>
              </Card>

              <Card>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '16px', fontWeight: 500 }}>Recent visits</h3>
                  <button type="button" onClick={() => setTab('plan')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', color: 'var(--ads-blue-550)' }}>
                    View plan
                  </button>
                </div>
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {previous.map((p) => (
                    <div key={p.id} style={{ padding: '10px 12px', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)' }}>
                      <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500 }}>{p.procedure}</div>
                      <div style={{ marginTop: '2px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                        {new Date(p.date).toLocaleDateString()} · {p.time} · {p.provider}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {tab === 'plan' && (
            <Card>
              <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '16px', fontWeight: 500 }}>Your treatment plan</h3>
              <p style={{ margin: '4px 0 0', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-muted)' }}>
                Total estimate: ${planTotal.toLocaleString()}. Insurance estimate at 60% — your share ~${Math.round(planTotal * 0.4).toLocaleString()}.
              </p>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {plan.map((phase, i) => (
                  <div key={i} style={{ padding: '12px 14px', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500 }}>{phase.phase}</span>
                      <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontVariantNumeric: 'tabular-nums' }}>${phase.cost.toLocaleString()}</span>
                    </div>
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {phase.procedures.map((p, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
                          <Tag size="small" color={p.status === 'completed' ? 'green' : 'blue'}>{p.status}</Tag>
                          <span>{p.name}{p.tooth ? ` · ${p.tooth}` : ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === 'balance' && (
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '16px', fontWeight: 500 }}>Balance</h3>
                {dueTotal > 0 && <Tag size="small" color="orange">${dueTotal} due</Tag>}
              </div>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {balance.map((b) => (
                  <div key={b.invoiceId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>{b.description}</div>
                      <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>{b.invoiceId} · {new Date(b.date).toLocaleDateString()}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>${b.amount.toLocaleString()}</span>
                      {b.status === 'due' ? (
                        <PrimaryButton size={36} onClick={() => setPayOpen(b)}>Pay</PrimaryButton>
                      ) : (
                        <Tag size="small" color="green">paid</Tag>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === 'messages' && (
            <Card>
              <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '16px', fontWeight: 500 }}>Messages from your team</h3>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ padding: '12px 14px', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
                      <span style={{ fontWeight: 500 }}>{m.from}</span>
                      <span style={{ color: 'var(--ads-text-muted)' }}>{new Date(m.date).toLocaleDateString()}</span>
                    </div>
                    <p style={{ margin: '6px 0 0', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', lineHeight: '20px', color: 'var(--ads-text-primary)' }}>{m.body}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                <TextInput placeholder="Reply…" fullWidth />
                <PrimaryButton size={36}>Send</PrimaryButton>
              </div>
            </Card>
          )}

          {tab === 'forms' && (
            <Card>
              <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '16px', fontWeight: 500 }}>Forms to sign</h3>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <FormRow title="Crown placement informed consent" status="awaiting" />
                <FormRow title="Annual medical history update"     status="completed" />
                <FormRow title="HIPAA notice of privacy practices"  status="completed" />
              </div>
            </Card>
          )}
        </div>
      </div>

      {confirmAptOpen && (
        <Modal open onClose={() => setConfirmAptOpen(false)} title="Confirm appointment" size="sm" footer={<PrimaryButton size={36} onClick={() => setConfirmAptOpen(false)}>Got it</PrimaryButton>}>
          <p style={{ margin: 0 }}>Thanks! Your visit on {new Date(upcoming.date).toLocaleDateString()} at {upcoming.time} is confirmed.</p>
        </Modal>
      )}

      {payOpen && (
        <Modal
          open
          onClose={() => setPayOpen(null)}
          title="Pay your balance"
          size="sm"
          footer={
            <>
              <SecondaryButton size={36} onClick={() => setPayOpen(null)}>Cancel</SecondaryButton>
              <PrimaryButton size={36} onClick={() => setPayOpen(null)}>Pay ${payOpen.amount}</PrimaryButton>
            </>
          }
        >
          <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
            Pay <strong>${payOpen.amount}</strong> for {payOpen.invoiceId}. Charged to Visa ··· 4242.
          </p>
        </Modal>
      )}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section style={{ backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', padding: '20px' }}>
      {children}
    </section>
  );
}

function FormRow({ title, status }: { title: string; status: 'awaiting' | 'completed' }) {
  const tone: TagColor = status === 'completed' ? 'green' : 'orange';
  return (
    <div style={{ padding: '10px 12px', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>{title}</span>
      {status === 'awaiting' ? (
        <PrimaryButton size={36}>Open form</PrimaryButton>
      ) : (
        <Tag size="small" color={tone}>completed</Tag>
      )}
    </div>
  );
}
