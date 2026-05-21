import React, { useMemo, useReducer, useState } from 'react';
import { Modal, PrimaryButton, SecondaryButton } from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';
import { SEED_JOBS } from './dscore/data/jobs';
import { jobsReducer, initJobsState } from './dscore/jobs/jobsReducer';
import { applyFilters } from './dscore/jobs/jobsAggregator';
import { JobsFilters } from './dscore/jobs/JobsFilters';
import { JobKpiStrip } from './dscore/jobs/JobKpiStrip';
import { KanbanBoard } from './dscore/jobs/KanbanBoard';
import { JobsList } from './dscore/jobs/JobsList';
import { JobDetailPanel } from './dscore/jobs/JobDetailPanel';
import type { Job } from './dscore/data/types';

interface JobsPageProps {
  onBackToHome?: () => void;
  onNavigate?: (id: DSCoreNavId) => void;
  /**
   * Optional injected jobs that came from elsewhere (e.g. the Treatment Plan
   * Builder appending generated jobs). When set, prepends them to the seed list.
   */
  externalJobs?: Job[];
}

const CURRENT_USER = { id: 'dr-aw', name: 'Dr. Alex Watanabe' };

export default function JobsPage({ onBackToHome, onNavigate, externalJobs }: JobsPageProps) {
  const [state, dispatch] = useReducer(
    jobsReducer,
    null,
    () => initJobsState([...(externalJobs ?? []), ...SEED_JOBS]),
  );
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  const allJobs = useMemo(() => state.order.map((id) => state.jobs[id]).filter(Boolean), [state.jobs, state.order]);
  const filtered = useMemo(() => applyFilters(allJobs, state.filters), [allJobs, state.filters]);

  const selectedJob = state.selectedJobId ? state.jobs[state.selectedJobId] : null;

  const bulkCount = state.bulkSelection.size;

  return (
    <DSCoreShell
      active="jobs"
      unread={state.unreadTotal}
      onNavigate={(id) => {
        if (id === 'home' && onBackToHome) onBackToHome();
        else onNavigate?.(id);
      }}
    >
      <div
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '32px 40px 80px',
        }}
      >
        <header style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px' }}>
          <div>
            <h1
              style={{
                fontFamily: 'var(--ads-font-sans)',
                fontWeight: 500,
                fontSize: '28px',
                lineHeight: '36px',
                letterSpacing: '-0.01em',
                color: 'var(--ads-text-primary)',
                margin: 0,
              }}
            >
              Jobs
            </h1>
            <p
              style={{
                fontFamily: 'var(--ads-font-sans)',
                fontSize: '14px',
                lineHeight: '20px',
                color: 'var(--ads-text-muted)',
                margin: '6px 0 0',
              }}
            >
              Track every lab case from submission to delivery.
            </p>
          </div>
        </header>

        <JobKpiStrip
          jobs={allJobs}
          onSlaRiskClick={() => dispatch({ type: 'SET_FILTERS', filters: { slaRiskOnly: true } })}
        />

        <JobsFilters
          filters={state.filters}
          onChange={(patch) => dispatch({ type: 'SET_FILTERS', filters: patch })}
          viewMode={state.viewMode}
          onViewModeChange={(mode) => dispatch({ type: 'SET_VIEW_MODE', mode })}
        />

        {bulkCount > 0 && (
          <BulkActionBar
            count={bulkCount}
            onCancelAll={() => setConfirmCancelOpen(true)}
            onClear={() => dispatch({ type: 'CLEAR_BULK' })}
          />
        )}

        {state.viewMode === 'kanban' ? (
          <KanbanBoard
            jobs={filtered}
            onCardClick={(jobId) => dispatch({ type: 'OPEN_DETAIL', jobId })}
            onAdvance={(jobId, to) => dispatch({ type: 'ADVANCE_STATUS', jobId, to, actor: CURRENT_USER })}
            bulkSelection={state.bulkSelection}
            onToggleBulk={(jobId) => dispatch({ type: 'TOGGLE_BULK', jobId })}
          />
        ) : (
          <JobsList
            jobs={filtered}
            onRowClick={(jobId) => dispatch({ type: 'OPEN_DETAIL', jobId })}
            bulkSelection={state.bulkSelection}
            onToggleBulk={(jobId) => dispatch({ type: 'TOGGLE_BULK', jobId })}
          />
        )}
      </div>

      <JobDetailPanel
        job={selectedJob}
        open={!!selectedJob}
        onClose={() => dispatch({ type: 'CLOSE_DETAIL' })}
        currentUser={CURRENT_USER}
        onAdvance={(to) => selectedJob && dispatch({ type: 'ADVANCE_STATUS', jobId: selectedJob.id, to, actor: CURRENT_USER })}
        onRequestChanges={(note) => selectedJob && dispatch({ type: 'REQUEST_CHANGES', jobId: selectedJob.id, note, actor: CURRENT_USER })}
        onCancel={() => selectedJob && dispatch({ type: 'CANCEL_JOB', jobId: selectedJob.id, actor: CURRENT_USER })}
        onChangePriority={(p) => selectedJob && dispatch({ type: 'CHANGE_PRIORITY', jobId: selectedJob.id, priority: p, actor: CURRENT_USER })}
        onAddMessage={(body) => selectedJob && dispatch({ type: 'ADD_MESSAGE', jobId: selectedJob.id, message: { authorId: CURRENT_USER.id, authorName: CURRENT_USER.name, authorRole: 'dentist', body } })}
        onAddFile={(file) => selectedJob && dispatch({ type: 'ADD_FILE', jobId: selectedJob.id, file: { ...file, uploadedBy: CURRENT_USER.name }, actor: CURRENT_USER })}
      />

      <Modal
        open={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        title="Cancel selected jobs?"
        size="sm"
        footer={
          <>
            <SecondaryButton size={36} onClick={() => setConfirmCancelOpen(false)}>Keep them</SecondaryButton>
            <PrimaryButton
              size={36}
              onClick={() => {
                dispatch({ type: 'CANCEL_BULK', jobIds: Array.from(state.bulkSelection), actor: CURRENT_USER });
                setConfirmCancelOpen(false);
              }}
            >
              Cancel {bulkCount} job{bulkCount === 1 ? '' : 's'}
            </PrimaryButton>
          </>
        }
      >
        These jobs will move to <strong>Cancelled</strong> and disappear from the active board. The audit log keeps the full history.
      </Modal>
    </DSCoreShell>
  );
}

function BulkActionBar({ count, onCancelAll, onClear }: { count: number; onCancelAll: () => void; onClear: () => void }) {
  return (
    <div
      role="region"
      aria-label="Bulk actions"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '10px 16px',
        marginBottom: '12px',
        backgroundColor: 'var(--ads-blue-50)',
        border: '1px solid var(--ads-blue-100)',
        borderRadius: 'var(--ads-radius-sm)',
        fontFamily: 'var(--ads-font-sans)',
        fontSize: '13px',
        color: 'var(--ads-blue-text)',
      }}
    >
      <span style={{ fontWeight: 500 }}>{count} selected</span>
      <span style={{ flex: 1 }} />
      <SecondaryButton size={36} onClick={onCancelAll}>Cancel jobs</SecondaryButton>
      <SecondaryButton size={36} onClick={onClear}>Clear selection</SecondaryButton>
    </div>
  );
}
