import type { JobStatus } from '../data/types';

/**
 * Lab case state machine.
 *
 *   new ──► in-design ──► in-production ──► quality-check ──► shipping ──► delivered
 *               │              │                  │              │
 *               ├── changes-requested ◄───────────┴──────────────┘
 *               │              │
 *               └──────────────┴──► cancelled
 *           changes-requested ──► in-design (rework)
 *
 * Drag-drop and CTA buttons consult `canTransition()`. Invalid drops snap back.
 */

const TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  'new':                ['in-design', 'cancelled'],
  'in-design':          ['in-production', 'changes-requested', 'cancelled'],
  'in-production':      ['quality-check', 'changes-requested', 'cancelled'],
  'quality-check':      ['shipping', 'in-production', 'changes-requested'],
  'shipping':           ['delivered', 'changes-requested'],
  'delivered':          [], // terminal
  'changes-requested':  ['in-design', 'cancelled'],
  'cancelled':          [], // terminal
};

export function canTransition(from: JobStatus, to: JobStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export function nextStatuses(from: JobStatus): JobStatus[] {
  return [...TRANSITIONS[from]];
}

export function isTerminal(status: JobStatus): boolean {
  return TRANSITIONS[status].length === 0;
}

/** Ordered statuses used as kanban columns. Excludes 'cancelled' (shown as a quiet pile). */
export const KANBAN_COLUMNS: JobStatus[] = [
  'new',
  'in-design',
  'in-production',
  'quality-check',
  'shipping',
  'delivered',
];
