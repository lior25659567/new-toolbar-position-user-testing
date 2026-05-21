import React, { useMemo, useState } from 'react';
import { Avatar, Checkbox, DropdownList, Modal, NumberInput, PrimaryButton, SearchInput, SecondaryButton, Tag, TextInput, type TagColor } from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';
import { KpiTile } from './dscore/shared/KpiTile';

type Category = 'consumables' | 'instruments' | 'restorative' | 'pharma' | 'lab' | 'office';
type Status = 'in-stock' | 'low' | 'out' | 'on-order' | 'expiring';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: Category;
  vendor: string;
  unit: string;
  /** Current units on hand. */
  qty: number;
  /** Reorder when qty drops to / below this. */
  parLevel: number;
  /** Standard reorder qty. */
  reorderQty: number;
  unitCost: number;
  /** Earliest expiration date across all lots. */
  earliestExpiry?: string;
  lots?: { lot: string; qty: number; expiresAt: string }[];
  /** When set, an open PO covers this SKU. */
  pendingPO?: { poNumber: string; qty: number; etaDays: number };
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  status: 'draft' | 'sent' | 'partial' | 'received';
  createdAt: string;
  total: number;
  lines: { sku: string; name: string; qty: number; unitCost: number }[];
}

const CATEGORY_LABEL: Record<Category, string> = {
  consumables: 'Consumables', instruments: 'Instruments', restorative: 'Restorative', pharma: 'Pharma', lab: 'Lab supplies', office: 'Office',
};

const SEED_ITEMS: InventoryItem[] = [
  { id: 'i-1',  sku: 'CRT-040', name: 'Cotton rolls (2000ct)',          category: 'consumables', vendor: 'Patterson Dental', unit: 'box',  qty: 4, parLevel: 6, reorderQty: 12, unitCost: 18 },
  { id: 'i-2',  sku: 'GLV-XL',  name: 'Nitrile gloves XL',              category: 'consumables', vendor: 'Henry Schein',     unit: 'box',  qty: 12, parLevel: 8, reorderQty: 24, unitCost: 11 },
  { id: 'i-3',  sku: 'GLV-M',   name: 'Nitrile gloves M',               category: 'consumables', vendor: 'Henry Schein',     unit: 'box',  qty: 2, parLevel: 8, reorderQty: 24, unitCost: 11 },
  { id: 'i-4',  sku: 'BUR-330', name: 'Carbide bur 330 (10 pack)',      category: 'instruments', vendor: 'Patterson Dental', unit: 'pack', qty: 5, parLevel: 4, reorderQty: 10, unitCost: 28 },
  { id: 'i-5',  sku: 'BUR-557', name: 'Carbide bur 557 (10 pack)',      category: 'instruments', vendor: 'Patterson Dental', unit: 'pack', qty: 1, parLevel: 4, reorderQty: 10, unitCost: 28 },
  { id: 'i-6',  sku: 'COMP-A2', name: 'Composite resin A2 (4g)',        category: 'restorative', vendor: '3M ESPE',          unit: 'syringe', qty: 6, parLevel: 5, reorderQty: 10, unitCost: 32, lots: [{ lot: 'L-2024-091', qty: 4, expiresAt: hoursAgo(-30 * 24) }, { lot: 'L-2025-022', qty: 2, expiresAt: hoursAgo(-180 * 24) }] },
  { id: 'i-7',  sku: 'BOND-U',  name: 'Universal bonding agent',        category: 'restorative', vendor: '3M ESPE',          unit: 'bottle', qty: 3, parLevel: 3, reorderQty: 6,  unitCost: 78,  lots: [{ lot: 'L-2025-101', qty: 3, expiresAt: hoursAgo(-25 * 24) }] },
  { id: 'i-8',  sku: 'LIDO-2',  name: 'Lidocaine 2% w/epi 1:100k',      category: 'pharma',      vendor: 'Septodont',         unit: 'box (50)', qty: 2, parLevel: 3, reorderQty: 6, unitCost: 65, earliestExpiry: hoursAgo(-60 * 24) },
  { id: 'i-9',  sku: 'AMOX-500',name: 'Amoxicillin 500mg (100ct)',      category: 'pharma',      vendor: 'McKesson',           unit: 'bottle', qty: 5, parLevel: 4, reorderQty: 6, unitCost: 22 },
  { id: 'i-10', sku: 'IMP-MED', name: 'Impression material — medium',   category: 'lab',         vendor: 'Kerr Dental',        unit: 'cart.',  qty: 8, parLevel: 6, reorderQty: 12, unitCost: 24 },
  { id: 'i-11', sku: 'PAPER',   name: 'Patient bibs (500ct)',           category: 'office',      vendor: 'Patterson Dental',   unit: 'box',    qty: 0, parLevel: 4, reorderQty: 8, unitCost: 19, pendingPO: { poNumber: 'PO-2026-0094', qty: 8, etaDays: 2 } },
  { id: 'i-12', sku: 'STER-PCH',name: 'Sterilization pouches (200ct)',  category: 'consumables', vendor: 'Henry Schein',       unit: 'box',    qty: 3, parLevel: 4, reorderQty: 8, unitCost: 14 },
  { id: 'i-13', sku: 'NA-FL',   name: 'Sodium fluoride varnish (500ct)',category: 'pharma',      vendor: 'McKesson',           unit: 'box',    qty: 7, parLevel: 4, reorderQty: 8, unitCost: 95 },
  { id: 'i-14', sku: 'X-RAY',   name: 'Phosphor plates (size 2)',       category: 'consumables', vendor: 'Henry Schein',       unit: 'pack',   qty: 4, parLevel: 4, reorderQty: 8, unitCost: 65 },
  { id: 'i-15', sku: 'GAUZE',   name: 'Gauze pads 2x2 (200ct)',         category: 'consumables', vendor: 'Patterson Dental',   unit: 'box',    qty: 9, parLevel: 6, reorderQty: 12, unitCost: 8 },
];

const SEED_POS: PurchaseOrder[] = [
  { id: 'po-1', poNumber: 'PO-2026-0094', vendor: 'Patterson Dental', status: 'sent',     createdAt: hoursAgo(48), total: 152,  lines: [{ sku: 'PAPER', name: 'Patient bibs (500ct)', qty: 8, unitCost: 19 }] },
  { id: 'po-2', poNumber: 'PO-2026-0091', vendor: 'McKesson',          status: 'received', createdAt: hoursAgo(96), total: 132,  lines: [{ sku: 'AMOX-500', name: 'Amoxicillin 500mg', qty: 6, unitCost: 22 }] },
  { id: 'po-3', poNumber: 'PO-2026-0089', vendor: '3M ESPE',           status: 'partial',  createdAt: hoursAgo(120), total: 320, lines: [{ sku: 'COMP-A2', name: 'Composite resin A2', qty: 10, unitCost: 32 }] },
];

interface Props { onBackToHome?: () => void; onNavigate?: (id: DSCoreNavId) => void; }

export default function InventoryPage({ onBackToHome, onNavigate }: Props) {
  const [items] = useState<InventoryItem[]>(SEED_ITEMS);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<Category | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
  const [bulkSelection, setBulkSelection] = useState<Set<string>>(new Set());
  const [poModalOpen, setPoModalOpen] = useState(false);

  const enriched = items.map((i) => ({ ...i, status: deriveStatus(i) }));
  const filtered = enriched.filter((i) => {
    if (filterCat !== 'all' && i.category !== filterCat) return false;
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!`${i.name} ${i.sku} ${i.vendor}`.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalValue = items.reduce((s, i) => s + i.qty * i.unitCost, 0);
  const lowCount = enriched.filter((i) => i.status === 'low' || i.status === 'out').length;
  const expiringCount = enriched.filter((i) => i.status === 'expiring').length;
  const onOrderCount = enriched.filter((i) => i.pendingPO).length;

  const toggleBulk = (id: string) => {
    setBulkSelection((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectedItems = items.filter((i) => bulkSelection.has(i.id));

  return (
    <DSCoreShell active="equipment" unread={lowCount} onNavigate={(id) => id === 'home' && onBackToHome ? onBackToHome() : onNavigate?.(id)}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px 80px' }}>
        <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '28px', margin: 0, color: 'var(--ads-text-primary)' }}>
              Inventory & Supply
            </h1>
            <p style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)', margin: '6px 0 0' }}>
              Par levels, lot tracking, expiry alerts, and one-click reorder.
            </p>
          </div>
          {bulkSelection.size > 0 && (
            <PrimaryButton size={36} onClick={() => setPoModalOpen(true)}>
              Reorder {bulkSelection.size} item{bulkSelection.size === 1 ? '' : 's'}
            </PrimaryButton>
          )}
        </header>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <KpiTile kpi={{ label: 'Total inventory value', value: totalValue, display: usd(totalValue) }} />
          <KpiTile kpi={{ label: 'Low / out',      value: lowCount,      display: String(lowCount) }}      tone={lowCount > 0 ? 'warning' : 'default'} invertDeltaSemantics />
          <KpiTile kpi={{ label: 'Expiring soon',  value: expiringCount, display: String(expiringCount) }} tone={expiringCount > 0 ? 'warning' : 'default'} invertDeltaSemantics />
          <KpiTile kpi={{ label: 'Pending POs',    value: onOrderCount,  display: String(onOrderCount) }} />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 240px', minWidth: '240px', maxWidth: '320px' }}>
            <SearchInput placeholder="Search SKU, name, vendor…" value={search} onChange={(e) => setSearch(e.target.value)} fullWidth />
          </div>
          <DropdownList
            options={[{ value: 'all', label: 'All categories' }, ...(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => ({ value: c, label: CATEGORY_LABEL[c] }))]}
            value={filterCat}
            onChange={(v) => setFilterCat(v as Category | 'all')}
          />
          <DropdownList
            options={[
              { value: 'all',       label: 'All status' },
              { value: 'in-stock',  label: 'In stock' },
              { value: 'low',       label: 'Low' },
              { value: 'out',       label: 'Out' },
              { value: 'on-order',  label: 'On order' },
              { value: 'expiring',  label: 'Expiring' },
            ]}
            value={filterStatus}
            onChange={(v) => setFilterStatus(v as Status | 'all')}
          />
          <SecondaryButton size={36} onClick={() => {
            setBulkSelection(new Set(enriched.filter((i) => i.status === 'low' || i.status === 'out').map((i) => i.id)));
          }}>
            Select all low/out
          </SecondaryButton>
        </div>

        <section style={{ backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '36px minmax(0, 1.6fr) 100px minmax(0, 1fr) 100px 110px 110px',
              gap: '0 14px',
              padding: '0 16px',
              alignItems: 'center',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '13px',
            }}
          >
            {[' ', 'Item', 'SKU', 'Vendor', 'On hand', 'Status', 'Value'].map((h, i) => (
              <div key={i} style={{ padding: '12px 0', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--ads-border-subtle)', textAlign: i >= 4 ? 'right' : 'left' }}>
                {h}
              </div>
            ))}

            {filtered.map((i) => {
              const tone = STATUS_TONE[i.status];
              return (
                <React.Fragment key={i.id}>
                  <div style={{ padding: '12px 0', borderBottom: '1px solid var(--ads-border-subtle)' }}>
                    <Checkbox checked={bulkSelection.has(i.id)} onChange={() => toggleBulk(i.id)} />
                  </div>
                  <div style={{ padding: '12px 0', borderBottom: '1px solid var(--ads-border-subtle)', minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, color: 'var(--ads-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {i.name}
                    </div>
                    <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                      {CATEGORY_LABEL[i.category]} · par {i.parLevel} · reorder {i.reorderQty}
                      {i.lots && i.lots.length > 0 && ` · ${i.lots.length} lots`}
                    </div>
                  </div>
                  <div style={{ padding: '12px 0', borderBottom: '1px solid var(--ads-border-subtle)', fontFamily: 'var(--ads-font-mono, ui-monospace)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                    {i.sku}
                  </div>
                  <div style={{ padding: '12px 0', borderBottom: '1px solid var(--ads-border-subtle)', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {i.vendor}
                  </div>
                  <div style={{ padding: '12px 0', borderBottom: '1px solid var(--ads-border-subtle)', fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
                    {i.qty} {i.unit}
                  </div>
                  <div style={{ padding: '12px 0', borderBottom: '1px solid var(--ads-border-subtle)', textAlign: 'right' }}>
                    <Tag size="small" color={tone}>
                      {i.status === 'expiring' ? 'expiring' : i.status === 'on-order' ? 'on order' : i.status}
                    </Tag>
                    {i.pendingPO && (
                      <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '11px', color: 'var(--ads-text-muted)', marginTop: '2px' }}>
                        {i.pendingPO.poNumber} · {i.pendingPO.etaDays}d
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '12px 0', borderBottom: '1px solid var(--ads-border-subtle)', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontVariantNumeric: 'tabular-nums', textAlign: 'right', color: 'var(--ads-text-muted)' }}>
                    {usd(i.qty * i.unitCost)}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </section>

        {/* Recent POs */}
        <section style={{ marginTop: '24px' }}>
          <h3 style={{ margin: '0 0 12px', fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '15px', color: 'var(--ads-text-primary)' }}>
            Recent purchase orders
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SEED_POS.map((po) => (
              <div key={po.id} style={{ padding: '12px 14px', backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--ads-font-mono, ui-monospace)', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>{po.poNumber}</span>
                    <Tag size="small" color={PO_TONE[po.status]}>{po.status}</Tag>
                  </div>
                  <div style={{ marginTop: '2px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                    {po.vendor} · {po.lines.length} line{po.lines.length === 1 ? '' : 's'} · {new Date(po.createdAt).toLocaleString()}
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                  {usd(po.total)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {poModalOpen && (
        <PoModal items={selectedItems} onClose={() => { setPoModalOpen(false); setBulkSelection(new Set()); }} />
      )}
    </DSCoreShell>
  );
}

function PoModal({ items, onClose }: { items: InventoryItem[]; onClose: () => void }) {
  // Group items by vendor — one PO per vendor.
  const groups = useMemo(() => {
    const m = new Map<string, InventoryItem[]>();
    for (const i of items) {
      const cur = m.get(i.vendor) ?? [];
      cur.push(i);
      m.set(i.vendor, cur);
    }
    return Array.from(m.entries());
  }, [items]);

  const totalCost = items.reduce((s, i) => s + i.unitCost * i.reorderQty, 0);

  return (
    <Modal
      open
      onClose={onClose}
      title="Create purchase orders"
      size="md"
      footer={
        <>
          <SecondaryButton size={36} onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton size={36} onClick={onClose}>
            Send {groups.length} PO{groups.length === 1 ? '' : 's'} ({usd(totalCost)})
          </PrimaryButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-muted)' }}>
          We'll group these {items.length} items into {groups.length} purchase order{groups.length === 1 ? '' : 's'}, one per vendor. Each PO uses the SKU's standard reorder quantity.
        </p>
        {groups.map(([vendor, vItems]) => {
          const subtotal = vItems.reduce((s, i) => s + i.unitCost * i.reorderQty, 0);
          return (
            <div key={vendor} style={{ border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)' }}>
              <header style={{ padding: '10px 12px', borderBottom: '1px solid var(--ads-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '13px' }}>{vendor}</span>
                <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontVariantNumeric: 'tabular-nums' }}>{usd(subtotal)}</span>
              </header>
              <div style={{ padding: '4px 0' }}>
                {vItems.map((i) => (
                  <div key={i.id} style={{ padding: '6px 12px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 80px 80px', gap: '8px', alignItems: 'center', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
                    <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.name}</span>
                    <span style={{ textAlign: 'right', color: 'var(--ads-text-muted)' }}>×{i.reorderQty}</span>
                    <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{usd(i.reorderQty * i.unitCost)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

const STATUS_TONE: Record<Status, TagColor> = {
  'in-stock': 'green',
  low:        'orange',
  out:        'red',
  'on-order': 'blue',
  expiring:   'orange',
};

const PO_TONE: Record<PurchaseOrder['status'], TagColor> = {
  draft:    'magenta',
  sent:     'blue',
  partial:  'orange',
  received: 'green',
};

function deriveStatus(i: InventoryItem): Status {
  if (i.qty === 0) return 'out';
  if (i.pendingPO) return 'on-order';
  if (i.qty <= i.parLevel) return 'low';
  if (i.earliestExpiry) {
    const days = (new Date(i.earliestExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (days < 90) return 'expiring';
  }
  return 'in-stock';
}

function usd(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}
