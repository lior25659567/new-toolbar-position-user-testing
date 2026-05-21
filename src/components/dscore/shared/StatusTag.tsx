import React from 'react';
import { Tag } from '../../../design-system';
import type { JobStatus, PlanStatus, Priority } from '../data/types';

// Single source of truth for status → color mapping.
// Ensures the same status word looks the same in kanban, list, detail, and KPIs.

const JOB_STATUS_COLOR: Record<JobStatus, 'orange' | 'blue' | 'purple' | 'green' | 'red' | 'magenta'> = {
  'new':                'orange',
  'in-design':          'blue',
  'in-production':      'purple',
  'quality-check':      'magenta',
  'shipping':           'blue',
  'delivered':          'green',
  'changes-requested':  'red',
  'cancelled':          'red',
};

const JOB_STATUS_LABEL: Record<JobStatus, string> = {
  'new':                'New',
  'in-design':          'In design',
  'in-production':      'In production',
  'quality-check':      'Quality check',
  'shipping':           'Shipping',
  'delivered':          'Delivered',
  'changes-requested':  'Changes requested',
  'cancelled':          'Cancelled',
};

const PLAN_STATUS_COLOR: Record<PlanStatus, 'orange' | 'blue' | 'purple' | 'green' | 'red'> = {
  'draft':       'orange',
  'presented':   'blue',
  'accepted':    'green',
  'declined':    'red',
  'in-progress': 'purple',
  'completed':   'green',
};

const PLAN_STATUS_LABEL: Record<PlanStatus, string> = {
  'draft':       'Draft',
  'presented':   'Presented',
  'accepted':    'Accepted',
  'declined':    'Declined',
  'in-progress': 'In progress',
  'completed':   'Completed',
};

const PRIORITY_COLOR: Record<Priority, 'green' | 'orange' | 'red'> = {
  'standard': 'green',
  'rush':     'orange',
  'urgent':   'red',
};

const PRIORITY_LABEL: Record<Priority, string> = {
  'standard': 'Standard',
  'rush':     'Rush',
  'urgent':   'Urgent',
};

export function JobStatusTag({ status, size = 'small' }: { status: JobStatus; size?: 'small' | 'medium' }) {
  return <Tag color={JOB_STATUS_COLOR[status]} size={size}>{JOB_STATUS_LABEL[status]}</Tag>;
}

export function PlanStatusTag({ status, size = 'small' }: { status: PlanStatus; size?: 'small' | 'medium' }) {
  return <Tag color={PLAN_STATUS_COLOR[status]} size={size}>{PLAN_STATUS_LABEL[status]}</Tag>;
}

export function PriorityTag({ priority, size = 'small' }: { priority: Priority; size?: 'small' | 'medium' }) {
  if (priority === 'standard') return null; // Don't visually clutter standard priority
  return <Tag color={PRIORITY_COLOR[priority]} size={size}>{PRIORITY_LABEL[priority]}</Tag>;
}

export const jobStatusLabel = (s: JobStatus) => JOB_STATUS_LABEL[s];
export const planStatusLabel = (s: PlanStatus) => PLAN_STATUS_LABEL[s];
