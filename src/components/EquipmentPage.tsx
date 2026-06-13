import React, { useMemo, useState } from 'react';
import { Modal, PrimaryButton, SecondaryButton, Tag, type TagColor } from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';
import { KpiTile } from './dscore/shared/KpiTile';

type AssetCategory = 'imaging' | 'sterilization' | 'chair' | 'compressor' | 'computer' | 'other';
type AssetStatus = 'operational' | 'due-soon' | 'overdue' | 'down' | 'retired';

interface MaintenanceTask {
  id: string;
  label: string;
  cadenceDays: number;
  lastDoneAt: string;
  nextDueAt: string;
  performedBy?: string;
}

interface Asset {
  id: string;
  tag: string;          // 'AC-1', 'CHAIR-3'
  name: string;
  category: AssetCategory;
  manufacturer: string;
  model: string;
  serial: string;
  installedAt: string;
  warrantyEndsAt?: string;
  /** Hours used (for compressors / autoclaves). */
  hoursUsed?: number;
  /** Cycle count (for autoclaves). */
  cycleCount?: number;
  status: AssetStatus;
  location: string;
  /** Calibration certificate that must be renewed annually. */
  certificationExpiresAt?: string;
  tasks: MaintenanceTask[];
  downtimeHours: number;
}

const SEED_ASSETS: Asset[] = [
  {
    id: 'a-1', tag: 'AC-1', name: 'Autoclave (Statim 5000)', category: 'sterilization',
    manufacturer: 'SciCan', model: 'Statim 5000', serial: 'SC-5000-AB12C',
    installedAt: '2022-06-12', warrantyEndsAt: '2027-06-12', hoursUsed: 1840, cycleCount: 4221,
    status: 'operational', location: 'Sterilization room',
    certificationExpiresAt: nextMonth(2),
    tasks: [
      mkTask('Daily flush',   1,  hoursAgo(20), hoursAgo(-4)),
      mkTask('Weekly clean',  7,  hoursAgo(96), hoursAgo(-72)),
      mkTask('Annual service',365, hoursAgo(180 * 24), hoursAgo(-180 * 24)),
    ],
    downtimeHours: 4,
  },
  {
    id: 'a-2', tag: 'AC-2', name: 'Autoclave (Statim 2000)', category: 'sterilization',
    manufacturer: 'SciCan', model: 'Statim 2000', serial: 'SC-2000-XY03Z',
    installedAt: '2019-03-08', hoursUsed: 4720, cycleCount: 11042,
    status: 'due-soon', location: 'Sterilization room',
    certificationExpiresAt: nextMonth(0),
    tasks: [
      mkTask('Daily flush',   1, hoursAgo(48), hoursAgo(0)),
      mkTask('Weekly clean',  7, hoursAgo(170), hoursAgo(-2)),
      mkTask('Annual service',365, hoursAgo(360 * 24), hoursAgo(5 * 24)),
    ],
    downtimeHours: 18,
  },
  {
    id: 'a-3', tag: 'PANO-1', name: 'Panoramic X-ray (ProMax)', category: 'imaging',
    manufacturer: 'Planmeca', model: 'ProMax 2D', serial: 'PM-2D-99877',
    installedAt: '2024-01-22', warrantyEndsAt: '2029-01-22',
    status: 'operational', location: 'Imaging suite',
    certificationExpiresAt: nextMonth(7),
    tasks: [
      mkTask('Beam calibration', 90, hoursAgo(80 * 24), hoursAgo(10 * 24)),
      mkTask('State inspection', 365, hoursAgo(150 * 24), hoursAgo(215 * 24)),
    ],
    downtimeHours: 0,
  },
  {
    id: 'a-4', tag: 'CHAIR-1', name: 'Treatment chair (A-dec 511)', category: 'chair',
    manufacturer: 'A-dec', model: '511', serial: 'ADC-511-A0091',
    installedAt: '2021-09-15', hoursUsed: 5200,
    status: 'operational', location: 'Op 1',
    tasks: [
      mkTask('Lubrication',  90, hoursAgo(70 * 24), hoursAgo(20 * 24)),
      mkTask('Upholstery clean', 30, hoursAgo(28 * 24), hoursAgo(2 * 24)),
    ],
    downtimeHours: 2,
  },
  {
    id: 'a-5', tag: 'CHAIR-3', name: 'Treatment chair (A-dec 511)', category: 'chair',
    manufacturer: 'A-dec', model: '511', serial: 'ADC-511-A0093',
    installedAt: '2021-09-15', hoursUsed: 6010,
    status: 'down', location: 'Op 3',
    tasks: [
      mkTask('Lubrication',  90, hoursAgo(120 * 24), hoursAgo(30 * 24)),
    ],
    downtimeHours: 36,
  },
  {
    id: 'a-6', tag: 'COMP-1', name: 'Compressor (Mojave V8)', category: 'compressor',
    manufacturer: 'Air Techniques', model: 'Mojave V8', serial: 'AT-V8-3344',
    installedAt: '2020-04-30', hoursUsed: 13520,
    status: 'overdue', location: 'Mechanical',
    tasks: [
      mkTask('Drain receiver', 30, hoursAgo(60 * 24), hoursAgo(30 * 24)),
      mkTask('Filter change',  90, hoursAgo(180 * 24), hoursAgo(90 * 24)),
    ],
    downtimeHours: 12,
  },
  {
    id: 'a-7', tag: 'PC-FRONT', name: 'Front desk PC', category: 'computer',
    manufacturer: 'Dell', model: 'Optiplex 7090', serial: 'D-OP-77882',
    installedAt: '2023-02-01',
    status: 'operational', location: 'Front desk',
    tasks: [mkTask('OS patch + AV update', 30, hoursAgo(15 * 24), hoursAgo(15 * 24))],
    downtimeHours: 0,
  },
];

const STATUS_TONE: Record<AssetStatus, TagColor> = {
  operational: 'green',
  'due-soon':  'orange',
  overdue:     'red',
  down:        'red',
  retired:     'magenta',
};

const CATEGORY_LABEL: Record<AssetCategory, string> = {
  imaging: 'Imaging', sterilization: 'Sterilization', chair: 'Chair', compressor: 'Compressor', computer: 'Computer', other: 'Other',
};

interface Props { onBackToHome?: () => void; onNavigate?: (id: DSCoreNavId) => void; }

export default function EquipmentPage({ onBackToHome, onNavigate }: Props) {
  const [items] = useState<Asset[]>(SEED_ASSETS);
  const [openId, setOpenId] = useState<string | null>(null);

  const overdue = items.filter((a) => a.status === 'overdue').length;
  const down = items.filter((a) => a.status === 'down').length;
  const dueSoon = items.filter((a) => a.status === 'due-soon').length;
  const expiring = items.filter((a) => a.certificationExpiresAt && daysUntil(a.certificationExpiresAt) < 60).length;

  const open = openId ? items.find((a) => a.id === openId) ?? null : null;

  return (
    <DSCoreShell active="equipment" unread={overdue + down} onNavigate={(id) => id === 'home' && onBackToHome ? onBackToHome() : onNavigate?.(id)}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px 80px' }}>
        <header style={{ marginBottom: '20px' }}>
          <h1 style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '28px', margin: 0, color: 'var(--ads-text-primary)' }}>
            Equipment lifecycle
          </h1>
          <p style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)', margin: '6px 0 0' }}>
            Asset registry, calibration calendar, and maintenance tasks across the practice.
          </p>
        </header>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <KpiTile kpi={{ label: 'Total assets',         value: items.length, display: String(items.length) }} />
          <KpiTile kpi={{ label: 'Down',                 value: down,         display: String(down) }}    tone={down > 0 ? 'warning' : 'default'} invertDeltaSemantics />
          <KpiTile kpi={{ label: 'Overdue maintenance',  value: overdue,      display: String(overdue) }} tone={overdue > 0 ? 'warning' : 'default'} invertDeltaSemantics />
          <KpiTile kpi={{ label: 'Maintenance due soon', value: dueSoon,      display: String(dueSoon) }} />
          <KpiTile kpi={{ label: 'Cert expiring < 60d',  value: expiring,     display: String(expiring) }} tone={expiring > 0 ? 'warning' : 'default'} invertDeltaSemantics />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
          {items.map((a) => {
            const overdueTaskCount = a.tasks.filter((t) => new Date(t.nextDueAt) < new Date()).length;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setOpenId(a.id)}
                style={{
                  textAlign: 'left',
                  background: 'var(--ads-bg-surface)',
                  border: '1px solid var(--ads-border-subtle)',
                  borderRadius: 'var(--ads-radius-sm)',
                  padding: '16px',
                  cursor: 'pointer',
                  font: 'inherit',
                  color: 'inherit',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--ads-blue-500)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--ads-border-subtle)')}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: 'var(--ads-font-mono, ui-monospace)', fontSize: '11px', fontWeight: 500, color: 'var(--ads-text-muted)' }}>
                        {a.tag}
                      </span>
                      <Tag size="small" color={STATUS_TONE[a.status]}>{a.status}</Tag>
                    </div>
                    <div style={{ marginTop: '4px', fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>
                      {a.name}
                    </div>
                    <div style={{ marginTop: '2px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                      {a.location} · {a.manufacturer} {a.model}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px' }}>
                  {a.cycleCount != null && <Stat label="Cycles" value={a.cycleCount.toLocaleString()} />}
                  {a.hoursUsed != null && <Stat label="Hours" value={a.hoursUsed.toLocaleString()} />}
                  <Stat label="Tasks" value={`${a.tasks.length} / ${overdueTaskCount} overdue`} tone={overdueTaskCount > 0 ? 'warn' : 'default'} />
                  <Stat label="Downtime" value={`${a.downtimeHours}h`} />
                </div>
                {a.certificationExpiresAt && (
                  <div style={{ marginTop: '8px', padding: '6px 8px', backgroundColor: daysUntil(a.certificationExpiresAt) < 30 ? 'var(--ads-tag-red-bg)' : 'var(--ads-tag-orange-bg)', border: `1px solid ${daysUntil(a.certificationExpiresAt) < 30 ? 'var(--ads-tag-red-br)' : 'var(--ads-tag-orange-br)'}`, borderRadius: 'var(--ads-radius-sm)', fontFamily: 'var(--ads-font-sans)', fontSize: '11px', color: daysUntil(a.certificationExpiresAt) < 30 ? 'var(--ads-tag-red-fg)' : 'var(--ads-tag-orange-fg)' }}>
                    Certification expires in {daysUntil(a.certificationExpiresAt)}d
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {open && (
        <Modal open onClose={() => setOpenId(null)} title={open.name} size="md" footer={<PrimaryButton size={36} onClick={() => setOpenId(null)}>Done</PrimaryButton>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 120px) minmax(0, 1fr)', gap: '6px 16px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
              <KV k="Tag"           v={open.tag} />
              <KV k="Category"      v={CATEGORY_LABEL[open.category]} />
              <KV k="Manufacturer"  v={`${open.manufacturer} ${open.model}`} />
              <KV k="Serial"        v={open.serial} />
              <KV k="Location"      v={open.location} />
              <KV k="Installed"     v={open.installedAt} />
              {open.warrantyEndsAt && <KV k="Warranty"      v={open.warrantyEndsAt} />}
              {open.certificationExpiresAt && <KV k="Cert expires" v={open.certificationExpiresAt} />}
            </div>

            <div>
              <h4 style={{ margin: '0 0 8px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Maintenance tasks
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {open.tasks.map((t) => {
                  const overdue = new Date(t.nextDueAt) < new Date();
                  return (
                    <div key={t.id} style={{ padding: '10px 12px', border: `1px solid ${overdue ? 'var(--ads-tag-red-br)' : 'var(--ads-border-subtle)'}`, backgroundColor: overdue ? 'var(--ads-tag-red-bg)' : 'var(--ads-bg-page)', borderRadius: 'var(--ads-radius-sm)', display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>
                          {t.label}
                        </div>
                        <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                          Every {t.cadenceDays}d · last {new Date(t.lastDoneAt).toLocaleDateString()} · next {new Date(t.nextDueAt).toLocaleDateString()}
                        </div>
                      </div>
                      <SecondaryButton size={36}>{overdue ? 'Mark done' : 'Log task'}</SecondaryButton>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </DSCoreShell>
  );
}

function Stat({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'warn' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontSize: '11px', color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: tone === 'warn' ? 'var(--ads-danger-500)' : 'var(--ads-text-primary)' }}>{value}</span>
    </div>
  );
}
function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <>
      <div style={{ color: 'var(--ads-text-muted)' }}>{k}</div>
      <div style={{ color: 'var(--ads-text-primary)' }}>{v}</div>
    </>
  );
}

function mkTask(label: string, cadenceDays: number, lastDoneAt: string, nextDueAt: string): MaintenanceTask {
  return { id: `t-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, label, cadenceDays, lastDoneAt, nextDueAt };
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}

function nextMonth(n: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + n);
  return d.toISOString();
}

function daysUntil(iso: string): number {
  return Math.round((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}
