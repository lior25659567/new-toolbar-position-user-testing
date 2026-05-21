import React from 'react';
import { DropdownList } from '../../../design-system';
import type { AnalyticsFiltersState } from '../data/types';
import { LABS, DENTISTS } from '../data/labs';

const RANGE_OPTIONS = [
  { value: '7',   label: 'Last 7 days' },
  { value: '30',  label: 'Last 30 days' },
  { value: '90',  label: 'Last 90 days' },
  { value: '365', label: 'Last 12 months' },
];

const PRACTITIONER_OPTIONS = [
  { value: 'all', label: 'All practitioners' },
  ...DENTISTS.map((d) => ({ value: d.id, label: d.name })),
];

const LAB_OPTIONS = [
  { value: 'all', label: 'All labs' },
  ...LABS.map((l) => ({ value: l.id, label: l.name })),
];

export function AnalyticsFilters({
  filters,
  onChange,
}: {
  filters: AnalyticsFiltersState;
  onChange: (patch: Partial<AnalyticsFiltersState>) => void;
}) {
  // Map current range back to a coarse preset for the dropdown
  const days = Math.round((new Date(filters.range.endISO).getTime() - new Date(filters.range.startISO).getTime()) / (24 * 60 * 60 * 1000));
  const preset =
    days <= 7 ? '7' : days <= 30 ? '30' : days <= 90 ? '90' : '365';

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
      <div style={{ width: '180px' }}>
        <DropdownList
          options={RANGE_OPTIONS}
          value={preset}
          onChange={(v) => {
            const n = Number(v);
            const end = new Date();
            const start = new Date(end.getTime() - n * 24 * 60 * 60 * 1000);
            onChange({ range: { startISO: start.toISOString(), endISO: end.toISOString() } });
          }}
          fullWidth
        />
      </div>
      <div style={{ width: '220px' }}>
        <DropdownList
          options={PRACTITIONER_OPTIONS}
          value={filters.practitionerId}
          onChange={(v) => onChange({ practitionerId: v as AnalyticsFiltersState['practitionerId'] })}
          fullWidth
        />
      </div>
      <div style={{ width: '220px' }}>
        <DropdownList
          options={LAB_OPTIONS}
          value={filters.labId}
          onChange={(v) => onChange({ labId: v as AnalyticsFiltersState['labId'] })}
          fullWidth
        />
      </div>
    </div>
  );
}
