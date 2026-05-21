import React from 'react';
import { Tag } from '../../design-system';

export type RecordStatus = 'draft' | 'submitted' | 'in-progress' | 'completed' | 'cancelled';

export const STATUS_LABELS: Record<RecordStatus, string> = {
  draft:         'Draft',
  submitted:     'Submitted',
  'in-progress': 'In progress',
  completed:     'Completed',
  cancelled:     'Cancelled',
};

const STATUS_COLOR: Record<RecordStatus, 'orange' | 'blue' | 'purple' | 'green' | 'red'> = {
  draft:         'orange',
  submitted:     'blue',
  'in-progress': 'purple',
  completed:     'green',
  cancelled:     'red',
};

export function StatusTag({ status }: { status: RecordStatus }) {
  return (
    <Tag color={STATUS_COLOR[status]} size="small">
      {STATUS_LABELS[status]}
    </Tag>
  );
}

export function Th({ children, width }: { children: React.ReactNode; width?: number | string }) {
  return (
    <th
      style={{
        textAlign: 'left',
        padding: '16px',
        fontFamily: 'var(--ads-font-sans)',
        fontWeight: 500,
        fontSize: '13px',
        lineHeight: '18px',
        color: 'var(--ads-text-muted)',
        borderBottom: '1px solid var(--ads-border-subtle)',
        whiteSpace: 'nowrap',
        backgroundColor: 'var(--ads-bg-surface)',
        width,
      }}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  emphasis,
  muted,
  align = 'left',
}: {
  children: React.ReactNode;
  emphasis?: boolean;
  muted?: boolean;
  align?: 'left' | 'right' | 'center';
}) {
  return (
    <td
      style={{
        padding: '16px',
        fontFamily: 'var(--ads-font-sans)',
        fontWeight: emphasis ? 500 : 400,
        fontSize: '14px',
        lineHeight: '20px',
        color: muted ? 'var(--ads-text-muted)' : 'var(--ads-text-primary)',
        verticalAlign: 'middle',
        textAlign: align,
      }}
    >
      {children}
    </td>
  );
}

export interface DataTableColumn {
  key: string;
  header: React.ReactNode;
  width?: number | string;
}

interface DataTableProps {
  columns: DataTableColumn[];
  children: React.ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
}

export function DataTable({ columns, children, emptyMessage = 'No records yet.', isEmpty }: DataTableProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        borderRadius: 'var(--ads-radius-sm)',
        border: '1px solid var(--ads-border-subtle)',
        overflow: 'hidden',
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--ads-font-sans)',
          }}
        >
          <thead>
            <tr>
              {columns.map((c) => (
                <Th key={c.key} width={c.width}>{c.header}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: '64px 16px',
                    textAlign: 'center',
                    color: 'var(--ads-text-muted)',
                    fontSize: '14px',
                    fontFamily: 'var(--ads-font-sans)',
                  }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DataTableRow({ children, idx }: { children: React.ReactNode; idx: number }) {
  return (
    <tr
      style={{
        borderTop: idx === 0 ? 'none' : '1px solid var(--ads-border-subtle)',
      }}
    >
      {children}
    </tr>
  );
}
