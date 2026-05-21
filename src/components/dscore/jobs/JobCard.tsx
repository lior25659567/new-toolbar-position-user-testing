import React from 'react';
import { Avatar, Tooltip } from '../../../design-system';
import type { Job } from '../data/types';
import { JobStatusTag, PriorityTag } from '../shared/StatusTag';
import { isSlaRisk } from './jobsAggregator';
import { formatRelativeDays } from '../data/activity';

export interface JobCardProps {
  job: Job;
  onClick: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  draggable?: boolean;
  /** If set, render a small bulk-select checkbox in the corner. */
  bulkSelected?: boolean;
  onToggleBulk?: () => void;
  /** Compact mode — used in kanban columns. List view sets false. */
  compact?: boolean;
}

export function JobCard({ job, onClick, onDragStart, onDragEnd, draggable, bulkSelected, onToggleBulk, compact = true }: JobCardProps) {
  const sla = isSlaRisk(job);
  const dueRel = formatRelativeDays(job.dueDate);
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        position: 'relative',
        backgroundColor: 'var(--ads-bg-surface)',
        border: `1px solid ${sla ? 'var(--ads-tag-orange-br)' : 'var(--ads-border-subtle)'}`,
        borderLeft: sla ? '3px solid var(--ads-warning-500)' : `1px solid var(--ads-border-subtle)`,
        borderRadius: 'var(--ads-radius-sm)',
        padding: compact ? '12px' : '16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        transition: 'box-shadow var(--ads-duration-fast) var(--ads-ease-standard), border-color var(--ads-duration-fast) var(--ads-ease-standard)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--ads-shadow-sm)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
    >
      {onToggleBulk && (
        <button
          type="button"
          aria-label={bulkSelected ? 'Deselect job' : 'Select job'}
          aria-pressed={!!bulkSelected}
          onClick={(e) => { e.stopPropagation(); onToggleBulk(); }}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '18px',
            height: '18px',
            borderRadius: '4px',
            border: `1.5px solid ${bulkSelected ? 'var(--ads-blue-500)' : 'var(--ads-border-strong)'}`,
            backgroundColor: bulkSelected ? 'var(--ads-blue-500)' : 'var(--ads-bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {bulkSelected && (
            <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4,11 9,16 16,5" />
            </svg>
          )}
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', paddingRight: onToggleBulk ? '24px' : 0 }}>
        <JobStatusTag status={job.status} />
        <PriorityTag priority={job.priority} />
      </div>

      <div
        style={{
          fontFamily: 'var(--ads-font-sans)',
          fontWeight: 500,
          fontSize: compact ? '14px' : '15px',
          lineHeight: '20px',
          color: 'var(--ads-text-primary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={`${job.patient.name} · ${job.service}`}
      >
        {job.patient.name}
      </div>

      <div
        style={{
          fontFamily: 'var(--ads-font-sans)',
          fontSize: '13px',
          lineHeight: '18px',
          color: 'var(--ads-text-muted)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={job.service}
      >
        {job.service}
        {job.toothNumbers.length > 0 && (
          <span style={{ color: 'var(--ads-text-subtle)' }}> · #{job.toothNumbers.join(', ')}</span>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          marginTop: 'auto',
          fontFamily: 'var(--ads-font-sans)',
          fontSize: '12px',
          color: 'var(--ads-text-muted)',
        }}
      >
        <Tooltip content={`Lab: ${job.lab.name}`}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Avatar name={job.lab.monogram} size="xs" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>{job.lab.name}</span>
          </span>
        </Tooltip>
        <Tooltip content={`Due ${new Date(job.dueDate).toLocaleDateString()}`}>
          <span style={{ color: sla ? 'var(--ads-warning-500)' : 'var(--ads-text-muted)', fontWeight: sla ? 500 : 400 }}>
            {dueRel.label}
          </span>
        </Tooltip>
      </div>
    </article>
  );
}
