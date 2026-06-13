import React, { useMemo, useState } from 'react';
import {
  PrimaryButton,
  SearchInput,
  DropdownList,
  Icon,
} from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';
import { DataTable, DataTableRow, Td, StatusTag, type RecordStatus } from './shared/DataTable';

interface OrdersPageProps {
  onBackToHome?: () => void;
  onNavigate?: (id: DSCoreNavId) => void;
}

type OrderStatus = RecordStatus;

interface Order {
  id: string;
  patient: string;
  status: OrderStatus;
  dueDate?: string;
  category: string;
  service: string;
  orderedBy: string;
  serviceProvider?: string;
}

const ORDERS: Order[] = [
  { id: '1', patient: 'sd, sd',         status: 'draft', category: 'Orthodontics', service: 'Aligner',          orderedBy: 'sds, sdsd' },
  { id: '2', patient: '123, hello',     status: 'draft', category: 'Implantology', service: 'Custom abutment',  orderedBy: 'sds, sdsd' },
  { id: '3', patient: 'DS Core, Demo',  status: 'draft', category: 'Restorative',  service: 'Final restoration', orderedBy: 'sds, sdsd' },
];

const STATUS_OPTIONS = [
  { value: 'all',         label: 'All statuses' },
  { value: 'draft',       label: 'Draft' },
  { value: 'submitted',   label: 'Submitted' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'completed',   label: 'Completed' },
  { value: 'cancelled',   label: 'Cancelled' },
];

const SERVICE_OPTIONS = [
  { value: 'all',          label: 'All services' },
  { value: 'aligner',      label: 'Aligner' },
  { value: 'abutment',     label: 'Custom abutment' },
  { value: 'restoration',  label: 'Final restoration' },
  { value: 'crown',        label: 'Crown' },
  { value: 'denture',      label: 'Denture' },
];

const DATE_OPTIONS = [
  { value: 'any',     label: 'Any time' },
  { value: 'today',   label: 'Today' },
  { value: 'week',    label: 'This week' },
  { value: 'month',   label: 'This month' },
  { value: 'quarter', label: 'Last 3 months' },
];

export default function OrdersPage({ onBackToHome, onNavigate }: OrdersPageProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [creationFilter, setCreationFilter] = useState('any');
  const [dueFilter, setDueFilter] = useState('any');

  const filtered = useMemo(() => {
    return ORDERS.filter((o) => {
      if (search && !o.patient.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      // service/date filters are wired but treat 'all'/'any' as pass-through.
      return true;
    });
  }, [search, statusFilter, serviceFilter, creationFilter, dueFilter]);

  return (
    <DSCoreShell
      active="orders"
      unread={1}
      onNavigate={(id) => {
        if (id === 'home' && onBackToHome) onBackToHome();
        else onNavigate?.(id);
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '32px 40px 80px',
        }}
      >
        <PageHeader />

        <div style={{ marginTop: '24px', marginBottom: '20px' }}>
          <SearchInput
            value={search}
            onSearch={setSearch}
            placeholder="Search by patient"
            fullWidth
          />
        </div>

        <FilterRow
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          serviceFilter={serviceFilter}
          setServiceFilter={setServiceFilter}
          creationFilter={creationFilter}
          setCreationFilter={setCreationFilter}
          dueFilter={dueFilter}
          setDueFilter={setDueFilter}
          count={filtered.length}
        />

        <OrdersTable orders={filtered} />
      </div>
    </DSCoreShell>
  );
}

/* ============================================================================
   Page header — title + subtitle + New order button
   ============================================================================ */

function PageHeader() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
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
          Orders
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
          All your orders, organized and easy to filter.
        </p>
      </div>
      <PrimaryButton size={44} icon="plus">
        New order
      </PrimaryButton>
    </div>
  );
}

/* ============================================================================
   Filter row — status / service dropdowns + creation/due date pickers + count
   ============================================================================ */

function FilterRow({
  statusFilter,
  setStatusFilter,
  serviceFilter,
  setServiceFilter,
  creationFilter,
  setCreationFilter,
  dueFilter,
  setDueFilter,
  count,
}: {
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  serviceFilter: string;
  setServiceFilter: (v: string) => void;
  creationFilter: string;
  setCreationFilter: (v: string) => void;
  dueFilter: string;
  setDueFilter: (v: string) => void;
  count: number;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ width: '160px' }}>
        <DropdownList
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={setStatusFilter}
          fullWidth
        />
      </div>
      <div style={{ width: '160px' }}>
        <DropdownList
          options={SERVICE_OPTIONS}
          value={serviceFilter}
          onChange={setServiceFilter}
          fullWidth
        />
      </div>
      <DateFilter
        label="Creation date"
        value={creationFilter}
        onChange={setCreationFilter}
      />
      <DateFilter
        label="Due date"
        value={dueFilter}
        onChange={setDueFilter}
      />
      <div
        style={{
          marginLeft: 'auto',
          fontFamily: 'var(--ads-font-sans)',
          fontSize: '14px',
          color: 'var(--ads-text-muted)',
        }}
      >
        {count} {count === 1 ? 'order' : 'orders'}
      </div>
    </div>
  );
}

function DateFilter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ position: 'relative' }}>
      <DropdownList
        options={DATE_OPTIONS.map((o) => ({
          ...o,
          // Show the friendly label inside the dropdown trigger via placeholder
          // when the user hasn't picked a specific window.
        }))}
        value={value}
        onChange={onChange}
        placeholder={label}
      />
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: 'var(--ads-text-muted)',
          display: 'inline-flex',
        }}
      >
        <Icon name="calendar" size={18} color="var(--ads-text-muted)" />
      </span>
    </div>
  );
}

/* ============================================================================
   Orders table
   ============================================================================ */

function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <DataTable
      columns={[
        { key: 'patient',  header: 'Patient' },
        { key: 'status',   header: 'Status' },
        { key: 'due',      header: 'Due date' },
        { key: 'category', header: 'Category' },
        { key: 'service',  header: 'Service' },
        { key: 'ordered',  header: 'Ordered by' },
        { key: 'provider', header: 'Service provider' },
      ]}
      isEmpty={orders.length === 0}
      emptyMessage="No orders match the current filters."
    >
      {orders.map((o, idx) => (
        <DataTableRow key={o.id} idx={idx}>
          <Td emphasis>{o.patient}</Td>
          <Td><StatusTag status={o.status} /></Td>
          <Td muted>{o.dueDate || '—'}</Td>
          <Td>{o.category}</Td>
          <Td>{o.service}</Td>
          <Td muted>{o.orderedBy}</Td>
          <Td muted>{o.serviceProvider || '—'}</Td>
        </DataTableRow>
      ))}
    </DataTable>
  );
}
