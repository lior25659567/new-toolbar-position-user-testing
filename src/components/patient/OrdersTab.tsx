import React, { useEffect, useMemo, useState } from 'react';
import {
  PrimaryButton,
  SearchInput,
  DropdownList,
  LinkButton,
} from '../../design-system';
import { DataTable, DataTableRow, Td, StatusTag } from '../shared/DataTable';
import {
  STATUS_FILTER_OPTIONS,
  SERVICE_FILTER_OPTIONS,
  DATE_FILTER_OPTIONS,
  EMPTY_DRAFT,
  SERVICES,
  type OrderDraft,
  type OrderTemplate,
  type PatientOrder,
} from './orderConstants';
import { CreateOrderWizard } from './CreateOrderWizard';

interface OrdersTabProps {
  orders: PatientOrder[];
  patientName: string;
  templates?: OrderTemplate[];
  /** When set, opens the wizard with a draft duplicated from this order. */
  duplicateSource?: PatientOrder | null;
  onDuplicateConsumed?: () => void;
  onOrderCreated: (order: PatientOrder) => void;
  onSaveTemplate?: (template: OrderTemplate) => void;
  onOpenOrder?: (id: string) => void;
}

export function OrdersTab({
  orders,
  patientName,
  templates,
  duplicateSource,
  onDuplicateConsumed,
  onOrderCreated,
  onSaveTemplate,
  onOpenOrder,
}: OrdersTabProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('any');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [initialDraft, setInitialDraft] = useState<OrderDraft | undefined>(undefined);

  // External "duplicate" request — open the wizard pre-filled.
  useEffect(() => {
    if (duplicateSource) {
      setInitialDraft(buildDraftFromOrder(duplicateSource));
      setWizardOpen(true);
      onDuplicateConsumed?.();
    }
  }, [duplicateSource, onDuplicateConsumed]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (search && !o.service.toLowerCase().includes(search.toLowerCase()) && !(o.procedureType?.toLowerCase().includes(search.toLowerCase()))) return false;
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (serviceFilter !== 'all') {
        const matches = o.service.toLowerCase().includes(serviceFilter.replace(/-/g, ' ').toLowerCase());
        if (!matches) return false;
      }
      return true;
    });
  }, [orders, search, statusFilter, serviceFilter, dateFilter]);

  const openCreate = () => {
    setInitialDraft(undefined);
    setWizardOpen(true);
  };

  const duplicateOrder = (o: PatientOrder) => {
    setInitialDraft(buildDraftFromOrder(o));
    setWizardOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FilterBar
        search={search}
        onSearch={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        serviceFilter={serviceFilter}
        onServiceChange={setServiceFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
        onCreate={openCreate}
        count={filtered.length}
      />

      <DataTable
        columns={[
          { key: 'service',  header: 'Service' },
          { key: 'category', header: 'Category' },
          { key: 'status',   header: 'Status' },
          { key: 'created',  header: 'Created' },
          { key: 'due',      header: 'Due date' },
          { key: 'provider', header: 'Service provider' },
          { key: 'ordered',  header: 'Ordered by' },
          { key: 'actions',  header: '' },
        ]}
        isEmpty={filtered.length === 0}
        emptyMessage={
          orders.length === 0
            ? 'No orders for this patient yet. Click Create order to start.'
            : 'No orders match the current filters.'
        }
      >
        {filtered.map((o, idx) => (
          <DataTableRow key={o.id} idx={idx}>
            <Td emphasis>
              <button
                type="button"
                onClick={() => onOpenOrder?.(o.id)}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  textAlign: 'left',
                  cursor: onOpenOrder ? 'pointer' : 'default',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  color: onOpenOrder ? 'var(--ads-blue-500)' : 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <span>{o.service}</span>
                {o.procedureType && (
                  <span style={{ fontSize: 12, color: 'var(--ads-text-muted)', fontWeight: 400 }}>
                    {o.procedureType}
                    {o.teeth.length > 0 && ` · #${o.teeth.slice().sort((a, b) => a - b).join(', #')}`}
                  </span>
                )}
              </button>
            </Td>
            <Td>{o.category}</Td>
            <Td><StatusTag status={o.status} /></Td>
            <Td muted>{o.createdDate}</Td>
            <Td muted>{o.dueDate || '—'}</Td>
            <Td muted>{o.provider || '—'}</Td>
            <Td muted>{o.orderedBy}</Td>
            <Td align="right">
              <LinkButton size={36} onClick={() => duplicateOrder(o)}>
                Duplicate
              </LinkButton>
            </Td>
          </DataTableRow>
        ))}
      </DataTable>

      <CreateOrderWizard
        open={wizardOpen}
        onClose={() => {
          setWizardOpen(false);
          setInitialDraft(undefined);
        }}
        onSubmitted={(o) => {
          onOrderCreated(o);
          setWizardOpen(false);
          setInitialDraft(undefined);
        }}
        patientName={patientName}
        initialDraft={initialDraft}
        templates={templates}
        onSaveTemplate={onSaveTemplate}
      />
    </div>
  );
}

/** Build a fresh draft from an existing order (for Duplicate). Patient + tooth selection are kept. */
function buildDraftFromOrder(o: PatientOrder): OrderDraft {
  const def = SERVICES.find((s) => s.name === o.service);
  return {
    ...EMPTY_DRAFT,
    service: def?.id ?? null,
    teeth: [...o.teeth],
    notes: o.notes ?? '',
  };
}

function FilterBar({
  search,
  onSearch,
  statusFilter,
  onStatusChange,
  serviceFilter,
  onServiceChange,
  dateFilter,
  onDateChange,
  onCreate,
  count,
}: {
  search: string;
  onSearch: (v: string) => void;
  statusFilter: string;
  onStatusChange: (v: string) => void;
  serviceFilter: string;
  onServiceChange: (v: string) => void;
  dateFilter: string;
  onDateChange: (v: string) => void;
  onCreate: () => void;
  count: number;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(220px, 1fr) 160px 200px 160px auto',
        gap: 12,
        alignItems: 'end',
      }}
    >
      <SearchInput value={search} onSearch={onSearch} placeholder="Search by service or procedure" fullWidth />
      <DropdownList options={STATUS_FILTER_OPTIONS} value={statusFilter} onChange={onStatusChange} fullWidth />
      <DropdownList options={SERVICE_FILTER_OPTIONS} value={serviceFilter} onChange={onServiceChange} fullWidth />
      <div style={{ position: 'relative' }}>
        <DropdownList options={DATE_FILTER_OPTIONS} value={dateFilter} onChange={onDateChange} fullWidth />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: 13, color: 'var(--ads-text-muted)', whiteSpace: 'nowrap' }}>
          {count} {count === 1 ? 'order' : 'orders'}
        </span>
        <PrimaryButton size={44} icon="plus" onClick={onCreate}>
          Create order
        </PrimaryButton>
      </div>
    </div>
  );
}
