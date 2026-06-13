import React, { useState } from 'react';
import { DropdownList, IconButton, Modal, PrimaryButton, SecondaryButton, Tag, TextInput, Toggle, type TagColor } from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';
import { KpiTile } from './dscore/shared/KpiTile';

type TriggerKind = 'job-status-change' | 'plan-accepted' | 'sla-risk' | 'invoice-failed' | 'appointment-completed' | 'patient-overdue';
type ConditionKind = 'field-equals' | 'field-greater' | 'field-contains' | 'time-window';
type ActionKind = 'send-sms' | 'send-email' | 'create-task' | 'schedule-followup' | 'notify-team' | 'add-tag' | 'auto-bill' | 'webhook';

interface Trigger { id: string; kind: TriggerKind; label: string; descriptor: string; }
interface Condition { id: string; kind: ConditionKind; field: string; op: string; value: string; }
interface Action { id: string; kind: ActionKind; label: string; details: string; }

interface Workflow {
  id: string;
  name: string;
  enabled: boolean;
  trigger: Trigger;
  conditions: Condition[];
  actions: Action[];
  /** Run history. */
  runs: { id: string; firedAt: string; result: 'success' | 'skipped' | 'failed'; summary: string }[];
}

const TRIGGER_LABEL: Record<TriggerKind, { label: string; descriptor: string }> = {
  'job-status-change':       { label: 'Job status changes',          descriptor: 'When a Job moves between statuses' },
  'plan-accepted':           { label: 'Treatment plan accepted',     descriptor: 'When a patient signs and accepts a plan' },
  'sla-risk':                { label: 'SLA risk detected',           descriptor: 'When a Job is < 2 days from due and not in shipping' },
  'invoice-failed':          { label: 'Invoice payment fails',       descriptor: 'When a card declines or check bounces' },
  'appointment-completed':   { label: 'Appointment completed',       descriptor: 'When a visit is marked complete' },
  'patient-overdue':         { label: 'Patient overdue for recall',  descriptor: 'When > N months since last cleaning' },
};

const ACTION_LABEL: Record<ActionKind, { label: string; descriptor: string; tone: TagColor }> = {
  'send-sms':         { label: 'Send SMS to patient',     descriptor: 'Twilio',    tone: 'green'   },
  'send-email':       { label: 'Send email to patient',   descriptor: 'SendGrid',  tone: 'blue'    },
  'create-task':      { label: 'Create internal task',    descriptor: 'Tasks',     tone: 'purple'  },
  'schedule-followup':{ label: 'Schedule follow-up appt', descriptor: 'Schedule',  tone: 'orange'  },
  'notify-team':      { label: 'Notify a team channel',   descriptor: 'Slack',     tone: 'magenta' },
  'add-tag':          { label: 'Tag the patient record',  descriptor: 'CRM',       tone: 'blue'    },
  'auto-bill':        { label: 'Auto-charge card',        descriptor: 'Stripe',    tone: 'green'   },
  'webhook':          { label: 'Call a webhook',          descriptor: 'HTTP POST', tone: 'magenta' },
};

const SEED_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-1', name: 'Crown delivery follow-up',
    enabled: true,
    trigger: { id: 't', kind: 'job-status-change', label: 'Job status changes', descriptor: 'Status from anything → Delivered' },
    conditions: [
      { id: 'c1', kind: 'field-equals', field: 'job.status', op: 'equals', value: 'delivered' },
      { id: 'c2', kind: 'field-equals', field: 'job.service', op: 'contains', value: 'Crown' },
    ],
    actions: [
      { id: 'a1', kind: 'send-sms',          label: 'Send SMS to patient',     details: '"Your crown is ready! Call us to schedule the seat appointment."' },
      { id: 'a2', kind: 'create-task',       label: 'Create internal task',    details: 'Assign to assistant: book seat appointment within 7 days' },
    ],
    runs: [
      { id: 'r1', firedAt: hoursAgo(2),  result: 'success', summary: 'Mina Yamada · Crown #14 — SMS sent + task created' },
      { id: 'r2', firedAt: hoursAgo(72), result: 'success', summary: 'Aiko Tanaka · Crown #19 — SMS sent + task created' },
    ],
  },
  {
    id: 'wf-2', name: 'SLA risk → notify production lead',
    enabled: true,
    trigger: { id: 't', kind: 'sla-risk', label: 'SLA risk detected', descriptor: 'Due < 2d AND not in shipping' },
    conditions: [],
    actions: [
      { id: 'a1', kind: 'notify-team', label: 'Notify a team channel', details: '#lab-ops Slack channel' },
      { id: 'a2', kind: 'add-tag',     label: 'Tag the case',          details: 'Add "expedite" priority tag' },
    ],
    runs: [
      { id: 'r1', firedAt: hoursAgo(8),  result: 'success', summary: 'Job-2241 (Acme Lab) — Slack ping sent' },
      { id: 'r2', firedAt: hoursAgo(28), result: 'success', summary: 'Job-2238 (CrownCo) — Slack ping sent' },
    ],
  },
  {
    id: 'wf-3', name: 'Failed invoice → retry + collections task',
    enabled: true,
    trigger: { id: 't', kind: 'invoice-failed', label: 'Invoice payment fails', descriptor: 'Card declined or check bounced' },
    conditions: [
      { id: 'c1', kind: 'field-greater', field: 'invoice.amount', op: '>', value: '50' },
    ],
    actions: [
      { id: 'a1', kind: 'send-email',  label: 'Send email to patient',  details: 'Past-due notice template' },
      { id: 'a2', kind: 'auto-bill',   label: 'Auto-retry card',        details: 'Retry once after 3 days' },
      { id: 'a3', kind: 'create-task', label: 'Create collections task',details: 'Assigned to billing team' },
    ],
    runs: [
      { id: 'r1', firedAt: hoursAgo(120), result: 'success', summary: 'INV-1042 ($65) — email sent, retry scheduled' },
    ],
  },
  {
    id: 'wf-4', name: '6-month cleaning recall',
    enabled: false,
    trigger: { id: 't', kind: 'patient-overdue', label: 'Patient overdue for recall', descriptor: '> 6 months since last cleaning' },
    conditions: [],
    actions: [
      { id: 'a1', kind: 'send-email', label: 'Send email to patient', details: 'Recall campaign: "Time for your cleaning?"' },
    ],
    runs: [],
  },
];

interface Props { onBackToHome?: () => void; onNavigate?: (id: DSCoreNavId) => void; }

export default function AutomationPage({ onBackToHome, onNavigate }: Props) {
  const [workflows, setWorkflows] = useState<Workflow[]>(SEED_WORKFLOWS);
  const [openId, setOpenId] = useState<string | null>(workflows[0].id);
  const [createOpen, setCreateOpen] = useState(false);

  const selected = openId ? workflows.find((w) => w.id === openId) ?? null : null;
  const totalRuns = workflows.reduce((s, w) => s + w.runs.length, 0);
  const successRate = totalRuns === 0 ? 0 : workflows.flatMap((w) => w.runs).filter((r) => r.result === 'success').length / totalRuns;
  const enabled = workflows.filter((w) => w.enabled).length;

  const toggle = (id: string) => setWorkflows((ws) => ws.map((w) => w.id === id ? { ...w, enabled: !w.enabled } : w));

  return (
    <DSCoreShell active="collaboration" unread={0} onNavigate={(id) => id === 'home' && onBackToHome ? onBackToHome() : onNavigate?.(id)}>
      <div style={{ maxWidth: '1480px', margin: '0 auto', padding: '32px 32px 80px' }}>
        <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '28px', margin: 0, color: 'var(--ads-text-primary)' }}>
              Workflow automation
            </h1>
            <p style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)', margin: '6px 0 0' }}>
              Build "if this, then that" automations across Jobs, Plans, Schedule, Claims, and Patients. Triggers fire → conditions filter → actions execute.
            </p>
          </div>
          <PrimaryButton size={36} onClick={() => setCreateOpen(true)}>+ New automation</PrimaryButton>
        </header>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <KpiTile kpi={{ label: 'Active automations',  value: enabled, display: String(enabled) }} />
          <KpiTile kpi={{ label: 'Runs (last 7d)',      value: totalRuns, display: String(totalRuns), delta: 0.12 }} />
          <KpiTile kpi={{ label: 'Success rate',        value: successRate, display: `${Math.round(successRate * 100)}%` }} />
          <KpiTile kpi={{ label: 'Hours saved (est)',   value: 24, display: '24h', delta: 0.08 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px minmax(0, 1fr)', gap: '12px', alignItems: 'flex-start' }}>
          <aside style={{ backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', padding: '8px' }}>
            {workflows.map((w) => {
              const isActive = openId === w.id;
              return (
                <button
                  key={w.id} type="button" onClick={() => setOpenId(w.id)}
                  style={{ width: '100%', padding: '10px 12px', textAlign: 'left', background: isActive ? 'color-mix(in srgb, var(--ads-blue-500) 6%, transparent)' : 'transparent', border: '1px solid', borderColor: isActive ? 'var(--ads-blue-500)' : 'transparent', borderRadius: 'var(--ads-radius-sm)', cursor: 'pointer', fontFamily: 'inherit', color: 'inherit', marginBottom: '4px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>{w.name}</span>
                    <Tag size="small" color={w.enabled ? 'green' : 'magenta'}>{w.enabled ? 'on' : 'off'}</Tag>
                  </div>
                  <div style={{ marginTop: '4px', fontFamily: 'var(--ads-font-sans)', fontSize: '11px', color: 'var(--ads-text-muted)' }}>
                    {TRIGGER_LABEL[w.trigger.kind].label} · {w.actions.length} action{w.actions.length === 1 ? '' : 's'}
                  </div>
                </button>
              );
            })}
          </aside>

          {selected && <Canvas workflow={selected} onToggle={() => toggle(selected.id)} />}
        </div>
      </div>

      {createOpen && (
        <Modal open onClose={() => setCreateOpen(false)} title="Create automation" size="md" footer={
          <>
            <SecondaryButton size={36} onClick={() => setCreateOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton size={36} onClick={() => setCreateOpen(false)}>Create</PrimaryButton>
          </>
        }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <TextInput label="Name" required fullWidth />
            <DropdownList
              label="Trigger"
              options={(Object.keys(TRIGGER_LABEL) as TriggerKind[]).map((k) => ({ value: k, label: TRIGGER_LABEL[k].label }))}
              value="job-status-change" onChange={() => {}}
              fullWidth
            />
            <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
              You'll add conditions and actions after creating the automation.
            </p>
          </div>
        </Modal>
      )}
    </DSCoreShell>
  );
}

function Canvas({ workflow, onToggle }: { workflow: Workflow; onToggle: () => void }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)' }}>
        <div>
          <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '16px', fontWeight: 500 }}>{workflow.name}</h3>
          <p style={{ margin: '4px 0 0', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
            {workflow.runs.length} run{workflow.runs.length === 1 ? '' : 's'} · {workflow.actions.length} action{workflow.actions.length === 1 ? '' : 's'}
          </p>
        </div>
        <Toggle checked={workflow.enabled} onChange={onToggle} label={workflow.enabled ? 'Enabled' : 'Disabled'} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Node tone="purple" label="Trigger" body={
          <div>
            <div style={{ fontWeight: 500 }}>{TRIGGER_LABEL[workflow.trigger.kind].label}</div>
            <div style={{ marginTop: '2px', color: 'var(--ads-text-muted)', fontSize: '12px' }}>{workflow.trigger.descriptor}</div>
          </div>
        } />
        <Connector />
        {workflow.conditions.length > 0 ? (
          <>
            <Node tone="orange" label={`If ALL of these match (${workflow.conditions.length})`} body={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {workflow.conditions.map((c) => (
                  <div key={c.id} style={{ fontFamily: 'var(--ads-font-mono, ui-monospace)', fontSize: '12px', color: 'var(--ads-text-primary)' }}>
                    {c.field} <span style={{ color: 'var(--ads-text-muted)' }}>{c.op}</span> <strong>"{c.value}"</strong>
                  </div>
                ))}
              </div>
            } />
            <Connector />
          </>
        ) : (
          <>
            <Node tone="orange" label="No conditions" body={<span style={{ color: 'var(--ads-text-muted)', fontSize: '12px' }}>This automation runs every time the trigger fires.</span>} />
            <Connector />
          </>
        )}
        <Node tone="blue" label={`Then run ${workflow.actions.length} action${workflow.actions.length === 1 ? '' : 's'}`} body={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {workflow.actions.map((a, i) => {
              const meta = ACTION_LABEL[a.kind];
              return (
                <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', backgroundColor: 'var(--ads-blue-500)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ads-font-sans)', fontSize: '11px', fontWeight: 600 }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500 }}>{meta.label}</span>
                      <Tag size="small" color={meta.tone}>{meta.descriptor}</Tag>
                    </div>
                    <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)', marginTop: '2px' }}>
                      {a.details}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        } />
      </div>

      <div style={{ marginTop: '12px' }}>
        <h4 style={{ margin: '0 0 8px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Recent runs</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {workflow.runs.length === 0 ? (
            <div style={{ padding: '12px', backgroundColor: 'var(--ads-bg-page)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)', textAlign: 'center' }}>
              No runs yet. Enable the automation to see it fire.
            </div>
          ) : (
            workflow.runs.map((r) => (
              <div key={r.id} style={{ padding: '10px 12px', backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>{r.summary}</span>
                  <div style={{ marginTop: '2px', fontFamily: 'var(--ads-font-sans)', fontSize: '11px', color: 'var(--ads-text-muted)' }}>{new Date(r.firedAt).toLocaleString()}</div>
                </div>
                <Tag size="small" color={r.result === 'success' ? 'green' : r.result === 'failed' ? 'red' : 'magenta'}>{r.result}</Tag>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function Node({ tone, label, body }: { tone: TagColor; label: string; body: React.ReactNode }) {
  return (
    <div style={{ padding: '14px 16px', backgroundColor: 'var(--ads-bg-surface)', border: `1px solid var(--ads-tag-${tone}-br)`, borderLeft: `4px solid var(--ads-tag-${tone}-fg)`, borderRadius: 'var(--ads-radius-sm)' }}>
      <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '11px', fontWeight: 500, color: `var(--ads-tag-${tone}-fg)`, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>{body}</div>
    </div>
  );
}

function Connector() {
  return (
    <div style={{ height: 16, display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: 2, height: '100%', backgroundColor: 'var(--ads-border-subtle)' }} />
    </div>
  );
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}
