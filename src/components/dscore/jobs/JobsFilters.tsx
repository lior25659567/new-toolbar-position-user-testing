import React from 'react';
import { SearchInput, DropdownList, Toggle } from '../../../design-system';
import type { JobsFiltersState, JobsViewMode } from '../data/types';
import { LABS } from '../data/labs';
import { jobStatusLabel } from '../shared/StatusTag';

const STATUS_OPTIONS = [
  { value: 'all',                label: 'All statuses' },
  { value: 'new',                label: jobStatusLabel('new') },
  { value: 'in-design',          label: jobStatusLabel('in-design') },
  { value: 'in-production',      label: jobStatusLabel('in-production') },
  { value: 'quality-check',      label: jobStatusLabel('quality-check') },
  { value: 'shipping',           label: jobStatusLabel('shipping') },
  { value: 'delivered',          label: jobStatusLabel('delivered') },
  { value: 'changes-requested',  label: jobStatusLabel('changes-requested') },
  { value: 'cancelled',          label: jobStatusLabel('cancelled') },
];

const CATEGORY_OPTIONS = [
  { value: 'all',           label: 'All categories' },
  { value: 'Restorative',   label: 'Restorative' },
  { value: 'Orthodontics',  label: 'Orthodontics' },
  { value: 'Implantology',  label: 'Implantology' },
  { value: 'Appliance',     label: 'Appliance' },
  { value: 'Diagnostic',    label: 'Diagnostic' },
];

const PRIORITY_OPTIONS = [
  { value: 'all',      label: 'All priorities' },
  { value: 'standard', label: 'Standard' },
  { value: 'rush',     label: 'Rush' },
  { value: 'urgent',   label: 'Urgent' },
];

const LAB_OPTIONS = [
  { value: 'all', label: 'All labs' },
  ...LABS.map((l) => ({ value: l.id, label: l.name })),
];

export interface JobsFiltersProps {
  filters: JobsFiltersState;
  onChange: (patch: Partial<JobsFiltersState>) => void;
  viewMode: JobsViewMode;
  onViewModeChange: (mode: JobsViewMode) => void;
}

export function JobsFilters({ filters, onChange, viewMode, onViewModeChange }: JobsFiltersProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
      <SearchInput
        value={filters.search}
        onSearch={(v) => onChange({ search: v })}
        placeholder="Search by patient, service, lab, or dentist"
        fullWidth
      />
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ width: '180px' }}>
          <DropdownList
            options={STATUS_OPTIONS}
            value={filters.status}
            onChange={(v) => onChange({ status: v as JobsFiltersState['status'] })}
            fullWidth
          />
        </div>
        <div style={{ width: '180px' }}>
          <DropdownList
            options={LAB_OPTIONS}
            value={filters.labId}
            onChange={(v) => onChange({ labId: v })}
            fullWidth
          />
        </div>
        <div style={{ width: '170px' }}>
          <DropdownList
            options={CATEGORY_OPTIONS}
            value={filters.category}
            onChange={(v) => onChange({ category: v as JobsFiltersState['category'] })}
            fullWidth
          />
        </div>
        <div style={{ width: '160px' }}>
          <DropdownList
            options={PRIORITY_OPTIONS}
            value={filters.priority}
            onChange={(v) => onChange({ priority: v as JobsFiltersState['priority'] })}
            fullWidth
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
          <Toggle
            checked={filters.slaRiskOnly}
            onChange={(e) => onChange({ slaRiskOnly: e.target.checked })}
          />
          <span style={{ fontSize: '13px', color: 'var(--ads-text-primary)' }}>SLA risk only</span>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <ViewModeToggle mode={viewMode} onChange={onViewModeChange} />
        </div>
      </div>
    </div>
  );
}

function ViewModeToggle({ mode, onChange }: { mode: JobsViewMode; onChange: (m: JobsViewMode) => void }) {
  return (
    <div
      role="tablist"
      style={{
        display: 'inline-flex',
        padding: '4px',
        backgroundColor: 'var(--ads-bg-muted)',
        borderRadius: '999px',
        gap: '4px',
      }}
    >
      {(['kanban', 'list'] as JobsViewMode[]).map((m) => {
        const active = mode === m;
        return (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(m)}
            style={{
              padding: '6px 14px',
              minHeight: '32px',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: active ? 'var(--ads-bg-surface)' : 'transparent',
              color: active ? 'var(--ads-text-primary)' : 'var(--ads-text-muted)',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '13px',
              fontWeight: active ? 500 : 400,
              cursor: 'pointer',
              boxShadow: active ? 'var(--ads-shadow-sm)' : 'none',
              textTransform: 'capitalize',
              transition: 'background-color var(--ads-duration-fast), color var(--ads-duration-fast), box-shadow var(--ads-duration-fast)',
            }}
          >
            {m}
          </button>
        );
      })}
    </div>
  );
}
