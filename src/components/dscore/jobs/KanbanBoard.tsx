import React, { useState } from 'react';
import type { Job, JobStatus } from '../data/types';
import { KANBAN_COLUMNS, canTransition } from './jobsStateMachine';
import { JobCard } from './JobCard';
import { jobStatusLabel } from '../shared/StatusTag';

export interface KanbanBoardProps {
  jobs: Job[];
  onCardClick: (jobId: string) => void;
  onAdvance: (jobId: string, to: JobStatus) => void;
  bulkSelection?: Set<string>;
  onToggleBulk?: (jobId: string) => void;
}

interface DragInfo {
  jobId: string;
  from: JobStatus;
}

export function KanbanBoard({ jobs, onCardClick, onAdvance, bulkSelection, onToggleBulk }: KanbanBoardProps) {
  const [drag, setDrag] = useState<DragInfo | null>(null);
  const [dragOver, setDragOver] = useState<JobStatus | null>(null);

  const grouped = group(jobs);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${KANBAN_COLUMNS.length}, minmax(220px, 1fr))`,
        gap: '12px',
        alignItems: 'flex-start',
      }}
    >
      {KANBAN_COLUMNS.map((status) => {
        const items = grouped[status] ?? [];
        const isDropTarget = drag !== null && canTransition(drag.from, status);
        const isHover = dragOver === status && isDropTarget;
        return (
          <div
            key={status}
            onDragOver={(e) => {
              if (drag && canTransition(drag.from, status)) {
                e.preventDefault();
                setDragOver(status);
              }
            }}
            onDragLeave={() => {
              if (dragOver === status) setDragOver(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (drag && canTransition(drag.from, status)) {
                onAdvance(drag.jobId, status);
              }
              setDrag(null);
              setDragOver(null);
            }}
            style={{
              backgroundColor: isHover ? 'var(--ads-blue-50)' : 'var(--ads-bg-muted)',
              border: `1px solid ${isHover ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
              borderRadius: 'var(--ads-radius-sm)',
              padding: '12px',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              transition: 'background-color var(--ads-duration-fast) var(--ads-ease-standard), border-color var(--ads-duration-fast) var(--ads-ease-standard)',
              opacity: drag !== null && !isDropTarget ? 0.7 : 1,
            }}
          >
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 4px' }}>
              <span
                style={{
                  fontFamily: 'var(--ads-font-sans)',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '16px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--ads-text-muted)',
                }}
              >
                {jobStatusLabel(status)}
              </span>
              <span
                aria-label={`${items.length} jobs`}
                style={{
                  fontFamily: 'var(--ads-font-sans)',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'var(--ads-text-muted)',
                  backgroundColor: 'var(--ads-bg-surface)',
                  border: '1px solid var(--ads-border-subtle)',
                  borderRadius: '999px',
                  padding: '2px 8px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {items.length}
              </span>
            </header>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.length === 0 ? (
                <div
                  style={{
                    padding: '24px 8px',
                    textAlign: 'center',
                    color: 'var(--ads-text-subtle)',
                    fontSize: '12px',
                    border: '1px dashed var(--ads-border-subtle)',
                    borderRadius: 'var(--ads-radius-sm)',
                  }}
                >
                  No jobs
                </div>
              ) : (
                items.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onClick={() => onCardClick(job.id)}
                    onToggleBulk={onToggleBulk ? () => onToggleBulk(job.id) : undefined}
                    bulkSelected={bulkSelection?.has(job.id)}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('text/plain', job.id);
                      setDrag({ jobId: job.id, from: job.status });
                    }}
                    onDragEnd={() => {
                      setDrag(null);
                      setDragOver(null);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function group(jobs: Job[]): Record<JobStatus, Job[]> {
  const out = {} as Record<JobStatus, Job[]>;
  for (const status of KANBAN_COLUMNS) out[status] = [];
  // Cancelled & changes-requested don't have their own columns;
  // changes-requested overlays back into in-design column for visibility.
  // (Could be a separate column too, but Figma reference uses 6 visible.)
  for (const j of jobs) {
    if (j.status === 'cancelled') continue;
    if (j.status === 'changes-requested') {
      out['in-design'].push(j);
    } else {
      out[j.status].push(j);
    }
  }
  return out;
}
