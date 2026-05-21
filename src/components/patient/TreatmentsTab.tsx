import React, { useMemo, useState } from 'react';
import {
  PrimaryButton,
  SearchInput,
  DropdownList,
} from '../../design-system';
import { DataTable, DataTableRow, Td, StatusTag } from '../shared/DataTable';
import {
  TREATMENT_PROCEDURE_OPTIONS,
  TREATMENT_STATUS_OPTIONS,
  type PatientTreatment,
} from './treatmentConstants';
import { CreateTreatmentWizard } from './CreateTreatmentWizard';

interface TreatmentsTabProps {
  treatments: PatientTreatment[];
  patientName: string;
  onTreatmentCreated: (t: PatientTreatment) => void;
  /** Lets the parent open the wizard via the page-header "Create Treatment" button. */
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
}

export function TreatmentsTab({
  treatments,
  patientName,
  onTreatmentCreated,
  externalOpen,
  onExternalOpenChange,
}: TreatmentsTabProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [procedureFilter, setProcedureFilter] = useState('all');
  const [internalOpen, setInternalOpen] = useState(false);

  const wizardOpen = externalOpen ?? internalOpen;
  const setWizardOpen = (v: boolean) => {
    if (onExternalOpenChange) onExternalOpenChange(v);
    setInternalOpen(v);
  };

  const filtered = useMemo(() => {
    return treatments.filter((t) => {
      if (search && !t.procedureLabel.toLowerCase().includes(search.toLowerCase()) && !(t.details?.toLowerCase().includes(search.toLowerCase()))) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (procedureFilter !== 'all' && t.procedure !== procedureFilter) return false;
      return true;
    });
  }, [treatments, search, statusFilter, procedureFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 1fr) 180px 200px auto',
          gap: 12,
          alignItems: 'end',
        }}
      >
        <SearchInput value={search} onSearch={setSearch} placeholder="Search by procedure or details" fullWidth />
        <DropdownList options={TREATMENT_STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} fullWidth />
        <DropdownList options={TREATMENT_PROCEDURE_OPTIONS} value={procedureFilter} onChange={setProcedureFilter} fullWidth />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: 13, color: 'var(--ads-text-muted)', whiteSpace: 'nowrap' }}>
            {filtered.length} {filtered.length === 1 ? 'treatment' : 'treatments'}
          </span>
          <PrimaryButton size={44} icon="plus" onClick={() => setWizardOpen(true)}>
            Create treatment
          </PrimaryButton>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'procedure', header: 'Procedure' },
          { key: 'details',   header: 'Details' },
          { key: 'teeth',     header: 'Teeth' },
          { key: 'status',    header: 'Status' },
          { key: 'created',   header: 'Created' },
          { key: 'provider',  header: 'Provider' },
        ]}
        isEmpty={filtered.length === 0}
        emptyMessage={
          treatments.length === 0
            ? 'No treatments for this patient yet. Click Create treatment to start.'
            : 'No treatments match the current filters.'
        }
      >
        {filtered.map((t, idx) => (
          <DataTableRow key={t.id} idx={idx}>
            <Td emphasis>{t.procedureLabel}</Td>
            <Td muted>{t.details || '—'}</Td>
            <Td muted>{t.toothSummary}</Td>
            <Td><StatusTag status={t.status} /></Td>
            <Td muted>{t.createdDate}</Td>
            <Td muted>{t.provider}</Td>
          </DataTableRow>
        ))}
      </DataTable>

      <CreateTreatmentWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSubmitted={(t) => {
          onTreatmentCreated(t);
          setWizardOpen(false);
        }}
        patientName={patientName}
      />
    </div>
  );
}
