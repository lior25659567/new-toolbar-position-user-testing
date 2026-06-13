import React from 'react';
import { Avatar } from '../../../design-system';
import type { Job } from '../data/types';
import { JobStatusTag, PriorityTag } from '../shared/StatusTag';
import { isSlaRisk } from './jobsAggregator';
import { formatRelativeDays } from '../data/activity';

export interface JobsListProps {
  jobs: Job[];
  onRowClick: (jobId: string) => void;
  bulkSelection: Set<string>;
  onToggleBulk: (jobId: string) => void;
}

export function JobsList({ jobs, onRowClick, bulkSelection, onToggleBulk }: JobsListProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        borderRadius: 'var(--ads-radius-sm)',
        border: '1px solid var(--ads-border-subtle)',
        overflow: 'hidden',
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--ads-font-sans)' }}>
          <thead>
            <tr>
              <Th width="40px"> </Th>
              <Th>Patient</Th>
              <Th>Service</Th>
              <Th>Status</Th>
              <Th>Priority</Th>
              <Th>Lab</Th>
              <Th>Dentist</Th>
              <Th align="right">Due</Th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--ads-text-muted)', fontSize: '14px' }}>
                  No jobs match the current filters.
                </td>
              </tr>
            )}
            {jobs.map((j, idx) => {
              const sla = isSlaRisk(j);
              const due = formatRelativeDays(j.dueDate);
              const checked = bulkSelection.has(j.id);
              return (
                <tr
                  key={j.id}
                  onClick={() => onRowClick(j.id)}
                  style={{
                    cursor: 'pointer',
                    borderTop: idx === 0 ? 'none' : '1px solid var(--ads-border-subtle)',
                    transition: 'background-color var(--ads-duration-fast)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--ads-bg-muted)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
                >
                  <Td onClick={(e) => { e.stopPropagation(); onToggleBulk(j.id); }}>
                    <span
                      role="checkbox"
                      aria-checked={checked}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        border: `1.5px solid ${checked ? 'var(--ads-blue-500)' : 'var(--ads-border-strong)'}`,
                        backgroundColor: checked ? 'var(--ads-blue-500)' : 'var(--ads-bg-surface)',
                      }}
                    >
                      {checked && (
                        <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="4,11 9,16 16,5" />
                        </svg>
                      )}
                    </span>
                  </Td>
                  <Td emphasis>{j.patient.name}</Td>
                  <Td>{j.service}{j.toothNumbers.length > 0 ? ` · #${j.toothNumbers.join(', ')}` : ''}</Td>
                  <Td><JobStatusTag status={j.status} /></Td>
                  <Td>{j.priority === 'standard' ? <span style={{ color: 'var(--ads-text-muted)' }}>—</span> : <PriorityTag priority={j.priority} />}</Td>
                  <Td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Avatar name={j.lab.monogram} size="xs" />
                      {j.lab.name}
                    </span>
                  </Td>
                  <Td muted>{j.dentist.name}</Td>
                  <Td align="right" emphasis={sla} colorize={sla ? 'var(--ads-warning-500)' : undefined}>{due.label}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, align, width }: { children: React.ReactNode; align?: 'left' | 'right'; width?: string }) {
  return (
    <th
      style={{
        textAlign: align ?? 'left',
        padding: '12px 16px',
        fontFamily: 'var(--ads-font-sans)',
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '16px',
        color: 'var(--ads-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        borderBottom: '1px solid var(--ads-border-subtle)',
        whiteSpace: 'nowrap',
        backgroundColor: 'var(--ads-bg-surface)',
        width,
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, emphasis, muted, align, colorize, onClick }: {
  children: React.ReactNode;
  emphasis?: boolean;
  muted?: boolean;
  align?: 'left' | 'right';
  colorize?: string;
  onClick?: (e: React.MouseEvent<HTMLTableCellElement>) => void;
}) {
  return (
    <td
      onClick={onClick}
      style={{
        padding: '14px 16px',
        textAlign: align ?? 'left',
        fontFamily: 'var(--ads-font-sans)',
        fontWeight: emphasis ? 500 : 400,
        fontSize: '14px',
        lineHeight: '20px',
        color: colorize || (muted ? 'var(--ads-text-muted)' : 'var(--ads-text-primary)'),
        verticalAlign: 'middle',
      }}
    >
      {children}
    </td>
  );
}
