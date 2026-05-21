import React, { useState } from 'react';
import { PrimaryButton, SecondaryButton, Tabs, Avatar } from '../../../design-system';
import { SlideOverPanel } from '../shared/SlideOverPanel';
import { JobStatusTag, PriorityTag, jobStatusLabel } from '../shared/StatusTag';
import { ActivityFeed } from '../shared/ActivityFeed';
import type { Job, JobStatus, Priority } from '../data/types';
import { canTransition, nextStatuses } from './jobsStateMachine';
import { JobMessagesTab } from './JobMessagesTab';
import { JobFilesTab } from './JobFilesTab';
import { formatRelativeDays, formatTimestamp } from '../data/activity';

export interface JobDetailPanelProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
  currentUser: { id: string; name: string };
  onAdvance: (to: JobStatus) => void;
  onRequestChanges: (note: string) => void;
  onCancel: () => void;
  onChangePriority: (p: Priority) => void;
  onAddMessage: (body: string) => void;
  onAddFile: (file: { name: string; sizeKb: number; kind: 'image' | 'video' | 'scan' | 'pdf' | 'other' }) => void;
}

export function JobDetailPanel({
  job, open, onClose, currentUser,
  onAdvance, onRequestChanges, onCancel, onChangePriority, onAddMessage, onAddFile,
}: JobDetailPanelProps) {
  const [tab, setTab] = useState('overview');

  if (!job) {
    return <SlideOverPanel open={false} onClose={onClose} title="">{null}</SlideOverPanel>;
  }

  return (
    <SlideOverPanel
      open={open}
      onClose={onClose}
      title={job.patient.name}
      headerExtra={<JobStatusTag status={job.status} />}
      footer={
        <JobActionFooter
          job={job}
          onAdvance={onAdvance}
          onRequestChanges={onRequestChanges}
          onCancel={onCancel}
        />
      }
    >
      <div style={{ padding: '0 24px' }}>
        <Tabs
          items={[
            { id: 'overview',  label: 'Overview' },
            { id: 'activity',  label: 'Activity' },
            { id: 'messages',  label: `Messages${job.messages.length ? ` (${job.messages.length})` : ''}` },
            { id: 'files',     label: `Files${job.attachments.length ? ` (${job.attachments.length})` : ''}` },
          ]}
          activeId={tab}
          onChange={setTab}
          style={{ marginTop: '16px', marginBottom: '20px' }}
        />
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        {tab === 'overview' && <JobOverviewTab job={job} onChangePriority={onChangePriority} />}
        {tab === 'activity' && <ActivityFeed events={job.activity} />}
        {tab === 'messages' && (
          <JobMessagesTab
            messages={job.messages}
            currentUserId={currentUser.id}
            onSend={onAddMessage}
          />
        )}
        {tab === 'files' && (
          <JobFilesTab
            attachments={job.attachments}
            onAdd={onAddFile}
          />
        )}
      </div>
    </SlideOverPanel>
  );
}

function JobOverviewTab({ job, onChangePriority }: { job: Job; onChangePriority: (p: Priority) => void }) {
  const due = formatRelativeDays(job.dueDate);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <section>
        <SectionHeader>Status timeline</SectionHeader>
        <StatusTimeline currentStatus={job.status} />
      </section>

      <section>
        <SectionHeader>Job details</SectionHeader>
        <dl
          style={{
            margin: 0,
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            rowGap: '10px',
            columnGap: '16px',
            fontFamily: 'var(--ads-font-sans)',
            fontSize: '13px',
          }}
        >
          <Term>Service</Term>            <Value>{job.service}</Value>
          <Term>Category</Term>           <Value>{job.category}</Value>
          {job.toothNumbers.length > 0 && (<><Term>Tooth</Term><Value>#{job.toothNumbers.join(', ')}</Value></>)}
          <Term>Lab</Term>                <Value><span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><Avatar name={job.lab.monogram} size="xs" />{job.lab.name}</span></Value>
          <Term>Dentist</Term>            <Value>{job.dentist.name}</Value>
          <Term>Created</Term>            <Value>{formatTimestamp(job.createdAt)}</Value>
          <Term>Due</Term>                <Value>{due.label} <span style={{ color: 'var(--ads-text-muted)' }}>· {new Date(job.dueDate).toLocaleDateString()}</span></Value>
          {job.shippedAt && (<><Term>Shipped</Term><Value>{formatTimestamp(job.shippedAt)}</Value></>)}
          <Term>Priority</Term>
          <Value>
            <PriorityPicker priority={job.priority} onChange={onChangePriority} />
          </Value>
          {job.notes && (<><Term>Notes</Term><Value>{job.notes}</Value></>)}
          {job.sourcePlanId && (<><Term>From plan</Term><Value style={{ color: 'var(--ads-text-muted)' }}>{job.sourcePlanId}</Value></>)}
        </dl>
      </section>
    </div>
  );
}

function StatusTimeline({ currentStatus }: { currentStatus: JobStatus }) {
  // Linear path; cancelled / changes-requested are off-path detours
  const path: JobStatus[] = ['new', 'in-design', 'in-production', 'quality-check', 'shipping', 'delivered'];
  const offPath = ['changes-requested', 'cancelled'].includes(currentStatus);
  const idx = path.indexOf(currentStatus);
  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {path.map((s, i) => {
        const done = !offPath && i < idx;
        const active = !offPath && i === idx;
        return (
          <li key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 0' }}>
            <span
              aria-hidden
              style={{
                width: '20px', height: '20px', borderRadius: '50%',
                border: `1.5px solid ${done ? 'var(--ads-blue-500)' : active ? 'var(--ads-blue-500)' : 'var(--ads-border-default)'}`,
                backgroundColor: done ? 'var(--ads-blue-500)' : active ? 'var(--ads-blue-50)' : 'var(--ads-bg-surface)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {done && (
                <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4,11 9,16 16,5" />
                </svg>
              )}
              {active && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--ads-blue-500)' }} />}
            </span>
            <span style={{
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '13px',
              color: done || active ? 'var(--ads-text-primary)' : 'var(--ads-text-muted)',
              fontWeight: active ? 500 : 400,
            }}>
              {jobStatusLabel(s)}
            </span>
          </li>
        );
      })}
      {offPath && (
        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 0', marginTop: '8px', borderTop: '1px solid var(--ads-border-subtle)', paddingTop: '12px' }}>
          <JobStatusTag status={currentStatus} />
          <span style={{ fontSize: '12px', color: 'var(--ads-text-muted)' }}>
            {currentStatus === 'cancelled' ? 'Job cancelled' : 'Pending dentist response'}
          </span>
        </li>
      )}
    </ol>
  );
}

const PRIORITY_OPTS: Priority[] = ['standard', 'rush', 'urgent'];
function PriorityPicker({ priority, onChange }: { priority: Priority; onChange: (p: Priority) => void }) {
  return (
    <div style={{ display: 'inline-flex', gap: '6px' }}>
      {PRIORITY_OPTS.map((p) => {
        const active = p === priority;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              border: `1px solid ${active ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
              backgroundColor: active ? 'var(--ads-blue-50)' : 'transparent',
              color: active ? 'var(--ads-blue-text)' : 'var(--ads-text-muted)',
              fontSize: '12px',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}

function JobActionFooter({
  job, onAdvance, onRequestChanges, onCancel,
}: {
  job: Job;
  onAdvance: (to: JobStatus) => void;
  onRequestChanges: (note: string) => void;
  onCancel: () => void;
}) {
  const next = nextStatuses(job.status).filter((s) => s !== 'changes-requested' && s !== 'cancelled');
  const canRequestChanges = canTransition(job.status, 'changes-requested');
  const canCancel = canTransition(job.status, 'cancelled');
  const primaryNext = next[0]; // primary advance
  const secondaryNext = next.slice(1);
  if (!primaryNext && !canRequestChanges && !canCancel) {
    return (
      <span style={{ color: 'var(--ads-text-muted)', fontSize: '13px' }}>
        This job is in a terminal state.
      </span>
    );
  }
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {canCancel && <SecondaryButton size={36} onClick={onCancel}>Cancel job</SecondaryButton>}
      {canRequestChanges && (
        <SecondaryButton size={36} onClick={() => onRequestChanges('Please review and adjust.')}>Request changes</SecondaryButton>
      )}
      {secondaryNext.map((s) => (
        <SecondaryButton key={s} size={36} onClick={() => onAdvance(s)}>{jobStatusLabel(s)}</SecondaryButton>
      ))}
      {primaryNext && (
        <PrimaryButton size={36} onClick={() => onAdvance(primaryNext)}>
          Move to {jobStatusLabel(primaryNext)}
        </PrimaryButton>
      )}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        margin: '0 0 12px',
        fontFamily: 'var(--ads-font-sans)',
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '16px',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--ads-text-muted)',
      }}
    >
      {children}
    </h3>
  );
}

function Term({ children }: { children: React.ReactNode }) {
  return <dt style={{ color: 'var(--ads-text-muted)', whiteSpace: 'nowrap' }}>{children}</dt>;
}
function Value({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <dd style={{ margin: 0, color: 'var(--ads-text-primary)', ...style }}>{children}</dd>;
}
