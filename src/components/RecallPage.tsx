import React, { useMemo, useState } from 'react';
import { DropdownList, IconButton, Modal, PrimaryButton, SecondaryButton, Tag, TextInput, type TagColor } from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';
import { KpiTile } from './dscore/shared/KpiTile';

type SegmentField = 'lastVisitDays' | 'overdueCleaning' | 'noShows12mo' | 'planAcceptanceStatus' | 'balanceDue';
type SegmentOp = 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
type Channel = 'email' | 'sms';
type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'completed';

interface SegmentRule {
  id: string;
  field: SegmentField;
  op: SegmentOp;
  value: string | number;
}

interface CampaignTemplate {
  id: string;
  name: string;
  channel: Channel;
  subject?: string;
  body: string;
  /** Tokens like {{patient.firstName}} */
}

interface CampaignRun {
  id: string;
  name: string;
  status: CampaignStatus;
  segmentDescription: string;
  channels: Channel[];
  templateName: string;
  scheduledAt?: string;
  funnel: { sent: number; delivered: number; opened: number; clicked: number; replied: number; booked: number };
}

const FIELD_LABEL: Record<SegmentField, string> = {
  lastVisitDays:        'Days since last visit',
  overdueCleaning:      'Overdue cleaning (months)',
  noShows12mo:          'No-shows in last 12mo',
  planAcceptanceStatus: 'Plan status',
  balanceDue:           'Outstanding balance',
};

const SEED_TEMPLATES: CampaignTemplate[] = [
  { id: 't-1', name: 'Cleaning recall (gentle)',     channel: 'email', subject: 'Time for your next cleaning?', body: 'Hi {{patient.firstName}}, it has been {{patient.lastVisitMonths}} months since your last cleaning. Click below to book a time that works for you.' },
  { id: 't-2', name: 'Cleaning recall (urgent)',     channel: 'sms',                                              body: '{{patient.firstName}}, you are 8+ months overdue for a cleaning. Book here: {{bookingUrl}}' },
  { id: 't-3', name: 'Plan acceptance follow-up',    channel: 'email', subject: 'Your treatment plan',           body: "Hi {{patient.firstName}}, just checking in on the plan we presented. Reply with any questions." },
  { id: 't-4', name: 'Past-due balance reminder',    channel: 'sms',                                              body: '{{patient.firstName}}, you have a balance of ${{balanceDue}} on file. Pay online: {{payUrl}}' },
  { id: 't-5', name: 'Birthday discount',            channel: 'email', subject: 'Happy birthday from DS Core!',  body: 'Happy birthday, {{patient.firstName}}! Enjoy 15% off any whitening service this month.' },
];

const SEED_CAMPAIGNS: CampaignRun[] = [
  {
    id: 'cmp-1', name: 'Q2 Cleaning Recall — gentle',
    status: 'completed',
    segmentDescription: 'Last visit > 180 days · Overdue cleaning ≥ 6mo',
    channels: ['email'], templateName: 'Cleaning recall (gentle)',
    scheduledAt: hoursAgo(48),
    funnel: { sent: 142, delivered: 138, opened: 89, clicked: 43, replied: 12, booked: 28 },
  },
  {
    id: 'cmp-2', name: 'Past-due balances (April)',
    status: 'sent',
    segmentDescription: 'Outstanding balance > $50',
    channels: ['email', 'sms'], templateName: 'Past-due balance reminder',
    scheduledAt: hoursAgo(96),
    funnel: { sent: 41, delivered: 41, opened: 36, clicked: 18, replied: 4, booked: 3 },
  },
  {
    id: 'cmp-3', name: 'Plan follow-up — March presented',
    status: 'sending',
    segmentDescription: 'Plan presented in last 30d, status = pending',
    channels: ['email'], templateName: 'Plan acceptance follow-up',
    scheduledAt: hoursAgo(2),
    funnel: { sent: 18, delivered: 18, opened: 9, clicked: 3, replied: 1, booked: 0 },
  },
];

const MOCK_PATIENT_POOL = 1247; // overall practice size

interface Props { onBackToHome?: () => void; onNavigate?: (id: DSCoreNavId) => void; }

export default function RecallPage({ onBackToHome, onNavigate }: Props) {
  const [tab, setTab] = useState<'campaigns' | 'segments' | 'templates'>('campaigns');
  const [draftOpen, setDraftOpen] = useState(false);

  return (
    <DSCoreShell active="patients" unread={0} onNavigate={(id) => id === 'home' && onBackToHome ? onBackToHome() : onNavigate?.(id)}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px 80px' }}>
        <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '28px', margin: 0, color: 'var(--ads-text-primary)' }}>
              Recall & Outreach
            </h1>
            <p style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)', margin: '6px 0 0' }}>
              Define patient segments, pick a template, and send via email or SMS. Track delivery → open → reply → booked.
            </p>
          </div>
          <PrimaryButton size={36} onClick={() => setDraftOpen(true)}>+ New campaign</PrimaryButton>
        </header>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <KpiTile kpi={{ label: 'Patients reachable',   value: MOCK_PATIENT_POOL, display: MOCK_PATIENT_POOL.toLocaleString() }} />
          <KpiTile kpi={{ label: 'Campaigns running',    value: SEED_CAMPAIGNS.filter((c) => c.status === 'sending').length, display: String(SEED_CAMPAIGNS.filter((c) => c.status === 'sending').length) }} />
          <KpiTile kpi={{ label: 'Total opens (30d)',    value: 134, display: '134', delta: 0.18 }} />
          <KpiTile kpi={{ label: 'Bookings attributed',  value: 31,  display: '31',  delta: 0.22 }} />
        </div>

        <nav style={{ display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: '1px solid var(--ads-border-subtle)' }}>
          {[
            { id: 'campaigns', label: 'Campaigns' },
            { id: 'segments',  label: 'Segments' },
            { id: 'templates', label: 'Templates' },
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

        {tab === 'campaigns' && <CampaignsList campaigns={SEED_CAMPAIGNS} />}
        {tab === 'segments' && <SegmentBuilder />}
        {tab === 'templates' && <TemplatesList />}
      </div>

      {draftOpen && <DraftCampaignModal onClose={() => setDraftOpen(false)} />}
    </DSCoreShell>
  );
}

function CampaignsList({ campaigns }: { campaigns: CampaignRun[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {campaigns.map((c) => (
        <div key={c.id} style={{ padding: '16px', backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '15px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>{c.name}</span>
                <Tag size="small" color={STATUS_TONE[c.status]}>{c.status}</Tag>
                {c.channels.map((ch) => <Tag key={ch} size="small" color="blue">{ch}</Tag>)}
              </div>
              <div style={{ marginTop: '2px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                {c.segmentDescription} · template "{c.templateName}"
                {c.scheduledAt && ` · ${new Date(c.scheduledAt).toLocaleString()}`}
              </div>
            </div>
          </div>
          <Funnel f={c.funnel} />
        </div>
      ))}
    </div>
  );
}

function Funnel({ f }: { f: CampaignRun['funnel'] }) {
  const stages: { key: keyof typeof f; label: string }[] = [
    { key: 'sent',      label: 'Sent' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'opened',    label: 'Opened' },
    { key: 'clicked',   label: 'Clicked' },
    { key: 'replied',   label: 'Replied' },
    { key: 'booked',    label: 'Booked' },
  ];
  const max = f.sent || 1;
  return (
    <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
      {stages.map((s) => {
        const v = f[s.key];
        const pct = (v / max) * 100;
        return (
          <div key={s.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--ads-font-sans)', fontSize: '11px', color: 'var(--ads-text-muted)' }}>
              <span>{s.label}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--ads-text-primary)' }}>{v}</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, backgroundColor: 'var(--ads-bg-page)' }}>
              <div style={{ width: `${pct}%`, height: '100%', backgroundColor: s.key === 'booked' ? 'var(--ads-success-600)' : 'var(--ads-blue-500)', borderRadius: 3 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SegmentBuilder() {
  const [rules, setRules] = useState<SegmentRule[]>([
    { id: 'r1', field: 'lastVisitDays',     op: 'gt',  value: 180 },
    { id: 'r2', field: 'overdueCleaning',   op: 'gte', value: 6 },
    { id: 'r3', field: 'noShows12mo',       op: 'lt',  value: 2 },
  ]);

  // Mock estimated count based on rule pickiness.
  const estimate = useMemo(() => {
    const factor = rules.reduce((f, r) => f * (typeof r.value === 'number' ? Math.max(0.4, 1 - Number(r.value) / 500) : 0.7), 1);
    return Math.round(MOCK_PATIENT_POOL * factor);
  }, [rules]);

  const update = (id: string, patch: Partial<SegmentRule>) => setRules((cur) => cur.map((r) => r.id === id ? { ...r, ...patch } : r));
  const remove = (id: string) => setRules((cur) => cur.filter((r) => r.id !== id));
  const add = () => setRules((cur) => [...cur, { id: `r-${Date.now()}`, field: 'lastVisitDays', op: 'gt', value: 90 }]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '16px' }}>
      <div style={{ backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', padding: '20px' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '15px', fontWeight: 500 }}>Patients matching ALL of:</h3>
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {rules.map((r) => (
            <div key={r.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 90px 110px 36px', gap: '8px', alignItems: 'flex-end' }}>
              <DropdownList
                options={(Object.keys(FIELD_LABEL) as SegmentField[]).map((f) => ({ value: f, label: FIELD_LABEL[f] }))}
                value={r.field}
                onChange={(v) => update(r.id, { field: v as SegmentField })}
                fullWidth
              />
              <DropdownList
                options={[{ value: 'gt', label: '>' }, { value: 'lt', label: '<' }, { value: 'eq', label: '=' }, { value: 'gte', label: '≥' }, { value: 'lte', label: '≤' }]}
                value={r.op}
                onChange={(v) => update(r.id, { op: v as SegmentOp })}
              />
              <TextInput value={String(r.value)} onChange={(e) => update(r.id, { value: e.target.value.replace(/\D/g, '') ? Number(e.target.value) : e.target.value })} fullWidth />
              <IconButton size="md" aria-label="Remove" onClick={() => remove(r.id)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="2" y1="2" x2="12" y2="12" /><line x1="12" y1="2" x2="2" y2="12" /></svg>
              </IconButton>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
          <SecondaryButton size={36} onClick={add}>+ Add condition</SecondaryButton>
          <PrimaryButton size={36}>Save segment</PrimaryButton>
        </div>
      </div>

      <aside style={{ backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', padding: '20px', height: 'fit-content' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '15px', fontWeight: 500 }}>Estimated audience</h3>
        <div style={{ marginTop: '8px', fontFamily: 'var(--ads-font-sans)', fontSize: '32px', fontWeight: 500, color: 'var(--ads-text-primary)', fontVariantNumeric: 'tabular-nums' }}>
          {estimate.toLocaleString()}
        </div>
        <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
          out of {MOCK_PATIENT_POOL.toLocaleString()} active patients
        </div>
        <div style={{ marginTop: '12px', padding: '10px 12px', backgroundColor: 'var(--ads-bg-page)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
          Estimated cost at $0.012/SMS: <strong>${(estimate * 0.012).toFixed(2)}</strong>
        </div>
      </aside>
    </div>
  );
}

function TemplatesList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {SEED_TEMPLATES.map((t) => (
        <div key={t.id} style={{ padding: '14px 16px', backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500 }}>{t.name}</span>
            <Tag size="small" color={t.channel === 'email' ? 'blue' : 'green'}>{t.channel}</Tag>
          </div>
          {t.subject && <div style={{ marginTop: '4px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>Subject: {t.subject}</div>}
          <p style={{ margin: '6px 0 0', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)', lineHeight: '18px' }}>{t.body}</p>
        </div>
      ))}
    </div>
  );
}

function DraftCampaignModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [channels, setChannels] = useState<Channel[]>(['email']);
  const [templateId, setTemplateId] = useState(SEED_TEMPLATES[0].id);
  const [scheduling, setScheduling] = useState<'now' | 'later'>('now');

  return (
    <Modal
      open
      onClose={onClose}
      title="New campaign"
      size="md"
      footer={
        <>
          <SecondaryButton size={36} onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton size={36} disabled={!name.trim()} onClick={onClose}>{scheduling === 'now' ? 'Send now' : 'Schedule'}</PrimaryButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <TextInput label="Campaign name" required value={name} onChange={(e) => setName(e.target.value)} fullWidth />
        <div>
          <div style={{ marginBottom: '6px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500 }}>Channels</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['email', 'sms'] as Channel[]).map((c) => (
              <SecondaryButton
                key={c} size={36}
                selected={channels.includes(c)}
                onClick={() => setChannels((cur) => cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c])}
              >
                {c.toUpperCase()}
              </SecondaryButton>
            ))}
          </div>
        </div>
        <DropdownList
          label="Template"
          options={SEED_TEMPLATES.map((t) => ({ value: t.id, label: `${t.name} (${t.channel})` }))}
          value={templateId}
          onChange={setTemplateId}
          fullWidth
        />
        <DropdownList
          label="When"
          options={[{ value: 'now', label: 'Send immediately' }, { value: 'later', label: 'Schedule for later' }]}
          value={scheduling}
          onChange={(v) => setScheduling(v as typeof scheduling)}
          fullWidth
        />
      </div>
    </Modal>
  );
}

const STATUS_TONE: Record<CampaignStatus, TagColor> = {
  draft: 'magenta', scheduled: 'blue', sending: 'orange', sent: 'green', completed: 'green',
};

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}
