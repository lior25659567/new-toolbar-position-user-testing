import type { Job, JobStatus, JobsFiltersState, JobsViewMode, ChatMessage, Priority, Attachment } from '../data/types';
import { canTransition } from './jobsStateMachine';
import { makeActivityEvent } from '../data/activity';

export interface JobsState {
  jobs: Record<string, Job>;
  order: string[];                        // stable ordering for list view
  filters: JobsFiltersState;
  viewMode: JobsViewMode;
  selectedJobId: string | null;           // detail panel open job
  bulkSelection: Set<string>;
  unreadTotal: number;
}

export const DEFAULT_FILTERS: JobsFiltersState = {
  search: '',
  status: 'all',
  labId: 'all',
  category: 'all',
  priority: 'all',
  slaRiskOnly: false,
};

export type JobsAction =
  | { type: 'ADVANCE_STATUS'; jobId: string; to: JobStatus; actor: { id: string; name: string; role?: 'dentist' | 'lab' | 'system' } }
  | { type: 'REQUEST_CHANGES'; jobId: string; note?: string; actor: { id: string; name: string } }
  | { type: 'CANCEL_JOB'; jobId: string; actor: { id: string; name: string } }
  | { type: 'CANCEL_BULK'; jobIds: string[]; actor: { id: string; name: string } }
  | { type: 'ADD_MESSAGE'; jobId: string; message: Pick<ChatMessage, 'authorId' | 'authorName' | 'authorRole' | 'body'> }
  | { type: 'ADD_FILE'; jobId: string; file: Omit<Attachment, 'uploadedAt' | 'id'> & Partial<Pick<Attachment, 'id' | 'uploadedAt'>>; actor: { id: string; name: string } }
  | { type: 'CHANGE_PRIORITY'; jobId: string; priority: Priority; actor: { id: string; name: string } }
  | { type: 'SET_FILTERS'; filters: Partial<JobsFiltersState> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_VIEW_MODE'; mode: JobsViewMode }
  | { type: 'OPEN_DETAIL'; jobId: string }
  | { type: 'CLOSE_DETAIL' }
  | { type: 'TOGGLE_BULK'; jobId: string }
  | { type: 'CLEAR_BULK' }
  | { type: 'CREATE_JOB_FROM_PLAN'; job: Job };

export function jobsReducer(state: JobsState, action: JobsAction): JobsState {
  switch (action.type) {
    case 'ADVANCE_STATUS': {
      const job = state.jobs[action.jobId];
      if (!job) return state;
      if (!canTransition(job.status, action.to)) return state;
      const evt = makeActivityEvent({
        type: 'status-change',
        actorId: action.actor.id,
        actorName: action.actor.name,
        actorRole: action.actor.role ?? 'dentist',
        payload: { from: job.status, to: action.to },
      });
      return updateJob(state, action.jobId, (j) => ({
        ...j,
        status: action.to,
        shippedAt: action.to === 'shipping' ? new Date().toISOString() : j.shippedAt,
        activity: [...j.activity, evt],
      }));
    }

    case 'REQUEST_CHANGES': {
      const job = state.jobs[action.jobId];
      if (!job) return state;
      const evt = makeActivityEvent({
        type: 'changes-requested',
        actorId: action.actor.id,
        actorName: action.actor.name,
        payload: { note: action.note ?? '' },
      });
      return updateJob(state, action.jobId, (j) => ({
        ...j,
        status: 'changes-requested',
        activity: [...j.activity, evt],
      }));
    }

    case 'CANCEL_JOB': {
      const job = state.jobs[action.jobId];
      if (!job) return state;
      const evt = makeActivityEvent({
        type: 'status-change',
        actorId: action.actor.id,
        actorName: action.actor.name,
        payload: { from: job.status, to: 'cancelled' },
      });
      return updateJob(state, action.jobId, (j) => ({
        ...j,
        status: 'cancelled',
        activity: [...j.activity, evt],
      }));
    }

    case 'CANCEL_BULK': {
      let next = state;
      for (const id of action.jobIds) {
        next = jobsReducer(next, { type: 'CANCEL_JOB', jobId: id, actor: action.actor });
      }
      return { ...next, bulkSelection: new Set() };
    }

    case 'ADD_MESSAGE': {
      const job = state.jobs[action.jobId];
      if (!job) return state;
      const id = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const message: ChatMessage = {
        id,
        authorId: action.message.authorId,
        authorName: action.message.authorName,
        authorRole: action.message.authorRole,
        body: action.message.body,
        timestamp: new Date().toISOString(),
      };
      const evt = makeActivityEvent({
        type: 'message-sent',
        actorId: action.message.authorId,
        actorName: action.message.authorName,
        actorRole: action.message.authorRole,
        payload: { preview: action.message.body },
      });
      return updateJob(state, action.jobId, (j) => ({
        ...j,
        messages: [...j.messages, message],
        activity: [...j.activity, evt],
      }));
    }

    case 'ADD_FILE': {
      const job = state.jobs[action.jobId];
      if (!job) return state;
      const file: Attachment = {
        id: action.file.id ?? `att-${Date.now()}`,
        uploadedAt: action.file.uploadedAt ?? new Date().toISOString(),
        ...action.file,
      };
      const evt = makeActivityEvent({
        type: 'file-added',
        actorId: action.actor.id,
        actorName: action.actor.name,
        payload: { fileName: file.name },
      });
      return updateJob(state, action.jobId, (j) => ({
        ...j,
        attachments: [...j.attachments, file],
        activity: [...j.activity, evt],
      }));
    }

    case 'CHANGE_PRIORITY': {
      const job = state.jobs[action.jobId];
      if (!job) return state;
      if (job.priority === action.priority) return state;
      const evt = makeActivityEvent({
        type: 'priority-change',
        actorId: action.actor.id,
        actorName: action.actor.name,
        payload: { from: job.priority, to: action.priority },
      });
      return updateJob(state, action.jobId, (j) => ({
        ...j,
        priority: action.priority,
        activity: [...j.activity, evt],
      }));
    }

    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.filters } };

    case 'CLEAR_FILTERS':
      return { ...state, filters: DEFAULT_FILTERS };

    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.mode };

    case 'OPEN_DETAIL':
      return { ...state, selectedJobId: action.jobId };

    case 'CLOSE_DETAIL':
      return { ...state, selectedJobId: null };

    case 'TOGGLE_BULK': {
      const next = new Set(state.bulkSelection);
      if (next.has(action.jobId)) next.delete(action.jobId); else next.add(action.jobId);
      return { ...state, bulkSelection: next };
    }

    case 'CLEAR_BULK':
      return { ...state, bulkSelection: new Set() };

    case 'CREATE_JOB_FROM_PLAN': {
      return {
        ...state,
        jobs: { ...state.jobs, [action.job.id]: action.job },
        order: [action.job.id, ...state.order],
      };
    }

    default:
      return state;
  }
}

function updateJob(state: JobsState, jobId: string, mut: (j: Job) => Job): JobsState {
  const job = state.jobs[jobId];
  if (!job) return state;
  return { ...state, jobs: { ...state.jobs, [jobId]: mut(job) } };
}

/**
 * Build the initial reducer state from a list of seed jobs.
 */
export function initJobsState(seed: Job[]): JobsState {
  const jobs: Record<string, Job> = {};
  const order: string[] = [];
  for (const job of seed) {
    jobs[job.id] = job;
    order.push(job.id);
  }
  const unread = seed.reduce((sum, j) => sum + (j.unreadMessages ?? 0), 0);
  return {
    jobs,
    order,
    filters: DEFAULT_FILTERS,
    viewMode: 'kanban',
    selectedJobId: null,
    bulkSelection: new Set(),
    unreadTotal: unread,
  };
}
