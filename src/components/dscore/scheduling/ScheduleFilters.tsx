import React from 'react';
import { DropdownList, IconButton, PrimaryButton, SecondaryButton } from '../../../design-system';
import {
  type ScheduleFiltersState,
  type ScheduleViewBy,
  type Specialty,
  PROVIDERS,
  SPECIALTY_LABEL,
} from './scheduleState';

function shiftDate(dateISO: string, days: number): string {
  const [y, m, d] = dateISO.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

function fmtPretty(dateISO: string): string {
  const [y, m, d] = dateISO.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

export function ScheduleFilters({
  filters,
  onChange,
  onNewAppointment,
}: {
  filters: ScheduleFiltersState;
  onChange: (patch: Partial<ScheduleFiltersState>) => void;
  onNewAppointment: () => void;
}) {
  const providerOpts = [
    { value: 'all', label: 'All providers' },
    ...PROVIDERS.map((p) => ({ value: p.id, label: `${p.name} · ${p.role === 'dentist' ? 'DDS' : 'RDH'}` })),
  ];
  const specOpts = [
    { value: 'all', label: 'All specialties' },
    ...(Object.keys(SPECIALTY_LABEL) as Specialty[]).map((s) => ({ value: s, label: SPECIALTY_LABEL[s] })),
  ];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <IconButton size="md" aria-label="Previous day" onClick={() => onChange({ date: shiftDate(filters.date, -1) })}>
          <ChevIcon dir="left" />
        </IconButton>
        <SecondaryButton size={36} onClick={() => onChange({ date: todayISO() })}>
          Today
        </SecondaryButton>
        <IconButton size="md" aria-label="Next day" onClick={() => onChange({ date: shiftDate(filters.date, 1) })}>
          <ChevIcon dir="right" />
        </IconButton>
        <span style={{ marginLeft: '8px', fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-primary)', fontWeight: 500 }}>
          {fmtPretty(filters.date)}
        </span>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <DropdownList
          options={providerOpts}
          value={filters.providerId}
          onChange={(v) => onChange({ providerId: v })}
        />
        <DropdownList
          options={specOpts}
          value={filters.specialty}
          onChange={(v) => onChange({ specialty: v as Specialty | 'all' })}
        />
        <div style={{ display: 'inline-flex', gap: '4px', padding: '3px', backgroundColor: 'var(--ads-bg-page)', borderRadius: 'var(--ads-radius-sm)' }}>
          <SecondaryButton size={36} selected={filters.viewBy === 'operatory'} onClick={() => onChange({ viewBy: 'operatory' })}>
            By chair
          </SecondaryButton>
          <SecondaryButton size={36} selected={filters.viewBy === 'provider'} onClick={() => onChange({ viewBy: 'provider' })}>
            By provider
          </SecondaryButton>
        </div>
        <PrimaryButton size={36} onClick={onNewAppointment}>
          + New appointment
        </PrimaryButton>
      </div>
    </div>
  );
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function ChevIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={dir === 'left' ? '10,4 6,8 10,12' : '6,4 10,8 6,12'} />
    </svg>
  );
}
