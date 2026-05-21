import React from 'react';
import { Avatar } from '../../../design-system';
import { SlideOverPanel } from '../shared/SlideOverPanel';
import { JobStatusTag, PriorityTag } from '../shared/StatusTag';
import type { Job } from '../data/types';
import { formatRelativeDays } from '../data/activity';

export function DrillDownPanel({
  open,
  onClose,
  title,
  jobs,
  emptyMessage,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  jobs: Job[];
  emptyMessage?: string;
}) {
  return (
    <SlideOverPanel open={open} onClose={onClose} title={title} width={640}>
      <div style={{ padding: '24px' }}>
        {jobs.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: 'var(--ads-text-muted)',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '14px',
            }}
          >
            {emptyMessage ?? 'No jobs match this metric.'}
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {jobs.map((j) => (
              <li
                key={j.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) auto auto',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '12px 14px',
                  border: '1px solid var(--ads-border-subtle)',
                  borderRadius: 'var(--ads-radius-sm)',
                  backgroundColor: 'var(--ads-bg-surface)',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '14px', color: 'var(--ads-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {j.patient.name}
                  </div>
                  <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {j.service}
                    {j.toothNumbers.length > 0 ? ` · #${j.toothNumbers.join(', ')}` : ''}
                    {' · '}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', verticalAlign: 'middle' }}>
                      <Avatar name={j.lab.monogram} size="xs" />
                      {j.lab.name}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <JobStatusTag status={j.status} />
                  <PriorityTag priority={j.priority} />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--ads-text-muted)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                  {formatRelativeDays(j.dueDate).label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SlideOverPanel>
  );
}
