import React from 'react';
import { DropdownList, SearchInput, SecondaryButton } from '../../../design-system';
import { type ClaimsFiltersState, type ClaimsViewMode, type ClaimStatus, PAYERS, STATUS_LABEL } from './claimsState';

export function ClaimsFilters({
  filters,
  viewMode,
  onChange,
  onChangeViewMode,
}: {
  filters: ClaimsFiltersState;
  viewMode: ClaimsViewMode;
  onChange: (patch: Partial<ClaimsFiltersState>) => void;
  onChangeViewMode: (mode: ClaimsViewMode) => void;
}) {
  const statusOpts = [
    { value: 'all', label: 'All statuses' },
    ...(Object.keys(STATUS_LABEL) as ClaimStatus[]).map((s) => ({ value: s, label: STATUS_LABEL[s] })),
  ];
  const payerOpts = [
    { value: 'all', label: 'All payers' },
    ...PAYERS.map((p) => ({ value: p.id, label: p.name })),
  ];
  const agingOpts = [
    { value: 'all',   label: 'All ages' },
    { value: '0-30',  label: '0–30 days' },
    { value: '31-60', label: '31–60 days' },
    { value: '61-90', label: '61–90 days' },
    { value: '90+',   label: '90+ days' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center',
        marginBottom: '12px',
      }}
    >
      <div style={{ flex: '1 1 240px', minWidth: '240px', maxWidth: '320px' }}>
        <SearchInput
          placeholder="Search by claim #, patient, or payer…"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          fullWidth
        />
      </div>
      <DropdownList
        options={statusOpts}
        value={filters.status}
        onChange={(v) => onChange({ status: v as ClaimStatus | 'all' })}
      />
      <DropdownList
        options={payerOpts}
        value={filters.payerId}
        onChange={(v) => onChange({ payerId: v })}
      />
      <DropdownList
        options={agingOpts}
        value={filters.agingBucket}
        onChange={(v) => onChange({ agingBucket: v as ClaimsFiltersState['agingBucket'] })}
      />
      <div style={{ marginLeft: 'auto', display: 'inline-flex', gap: '4px', padding: '3px', backgroundColor: 'var(--ads-bg-page)', borderRadius: 'var(--ads-radius-sm)' }}>
        <SecondaryButton size={36} selected={viewMode === 'list'} onClick={() => onChangeViewMode('list')}>
          List
        </SecondaryButton>
        <SecondaryButton size={36} selected={viewMode === 'aging'} onClick={() => onChangeViewMode('aging')}>
          Aging
        </SecondaryButton>
      </div>
    </div>
  );
}
