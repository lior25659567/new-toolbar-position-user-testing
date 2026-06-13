import React, { useMemo, useState } from 'react';
import { Avatar, Modal, PrimaryButton, SecondaryButton, Tag, type TagColor } from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';
import { KpiTile } from './dscore/shared/KpiTile';

interface Location {
  id: string;
  name: string;
  shortCode: string;
  city: string;
  state: string;
  monogram: string;
  /** Inherited settings, with overrides shown explicitly. */
  hours: { open: string; close: string };
  hoursOverridden?: boolean;
  taxRate: number;
  taxRateOverridden?: boolean;
  patientCount: number;
  monthlyRevenue: number;
  activeCases: number;
  utilization: number;     // 0-1
  staffCount: number;
}

const ORG_DEFAULTS = {
  hours: { open: '08:00', close: '18:00' },
  taxRate: 8.5,
  brandPrimary: 'var(--ads-background-interactive)',
};

const SEED_LOCATIONS: Location[] = [
  { id: 'loc-sf',      name: 'DS Core, Demo — San Francisco',  shortCode: 'SFO', city: 'San Francisco', state: 'CA', monogram: 'SF', hours: ORG_DEFAULTS.hours, taxRate: ORG_DEFAULTS.taxRate, patientCount: 1247, monthlyRevenue: 142000, activeCases: 38, utilization: 0.78, staffCount: 11 },
  { id: 'loc-oak',     name: 'DS Core, Demo — Oakland',         shortCode: 'OAK', city: 'Oakland',       state: 'CA', monogram: 'OK', hours: ORG_DEFAULTS.hours, taxRate: ORG_DEFAULTS.taxRate, patientCount: 642,  monthlyRevenue: 89000,  activeCases: 22, utilization: 0.66, staffCount: 6 },
  { id: 'loc-pdx',     name: 'DS Core, Demo — Portland',        shortCode: 'PDX', city: 'Portland',      state: 'OR', monogram: 'PD', hours: { open: '09:00', close: '17:00' }, hoursOverridden: true, taxRate: 0,    taxRateOverridden: true, patientCount: 412, monthlyRevenue: 58000, activeCases: 14, utilization: 0.54, staffCount: 4 },
  { id: 'loc-lax',     name: 'DS Core, Demo — Los Angeles',     shortCode: 'LAX', city: 'Los Angeles',   state: 'CA', monogram: 'LA', hours: { open: '07:00', close: '19:00' }, hoursOverridden: true, taxRate: 9.5, taxRateOverridden: true, patientCount: 1810, monthlyRevenue: 198000, activeCases: 51, utilization: 0.85, staffCount: 14 },
];

interface Props { onBackToHome?: () => void; onNavigate?: (id: DSCoreNavId) => void; }

export default function MultiLocationPage({ onBackToHome, onNavigate }: Props) {
  const [activeLocationId, setActiveLocationId] = useState<string | 'all'>('all');
  const [transferOpen, setTransferOpen] = useState(false);

  const visible = useMemo(() => activeLocationId === 'all' ? SEED_LOCATIONS : SEED_LOCATIONS.filter((l) => l.id === activeLocationId), [activeLocationId]);

  const totals = useMemo(() => ({
    patients: visible.reduce((s, l) => s + l.patientCount, 0),
    revenue:  visible.reduce((s, l) => s + l.monthlyRevenue, 0),
    cases:    visible.reduce((s, l) => s + l.activeCases, 0),
    utilization: visible.length === 0 ? 0 : visible.reduce((s, l) => s + l.utilization, 0) / visible.length,
  }), [visible]);

  return (
    <DSCoreShell active="patients" unread={0} onNavigate={(id) => id === 'home' && onBackToHome ? onBackToHome() : onNavigate?.(id)}>
      <div style={{ maxWidth: '1480px', margin: '0 auto', padding: '32px 32px 80px' }}>
        <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '28px', margin: 0, color: 'var(--ads-text-primary)' }}>
              Multi-location
            </h1>
            <p style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)', margin: '6px 0 0' }}>
              Switch between locations or view rolled-up org metrics. Per-location settings inherit from org defaults; overrides are flagged.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <SecondaryButton size={36} onClick={() => setTransferOpen(true)}>Transfer patient</SecondaryButton>
            <PrimaryButton size={36}>+ Add location</PrimaryButton>
          </div>
        </header>

        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <SecondaryButton size={36} selected={activeLocationId === 'all'} onClick={() => setActiveLocationId('all')}>
            All locations ({SEED_LOCATIONS.length})
          </SecondaryButton>
          {SEED_LOCATIONS.map((l) => (
            <SecondaryButton key={l.id} size={36} selected={activeLocationId === l.id} onClick={() => setActiveLocationId(l.id)}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Avatar name={l.monogram} size="xs" />
                {l.shortCode}
              </span>
            </SecondaryButton>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <KpiTile kpi={{ label: 'Total patients',   value: totals.patients, display: totals.patients.toLocaleString(), delta: 0.06 }} />
          <KpiTile kpi={{ label: 'Monthly revenue',  value: totals.revenue,  display: usd(totals.revenue), delta: 0.11 }} />
          <KpiTile kpi={{ label: 'Active cases',     value: totals.cases,    display: String(totals.cases), delta: 0.04 }} />
          <KpiTile kpi={{ label: 'Avg utilization',  value: totals.utilization, display: `${Math.round(totals.utilization * 100)}%`, delta: 0.02 }} />
        </div>

        {activeLocationId === 'all' && (
          <section style={{ backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '15px', fontWeight: 500 }}>Roll-up across locations</h3>
            <div
              style={{
                marginTop: '14px',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.5fr) 100px 110px 100px 90px 80px 100px',
                gap: '0 12px',
                alignItems: 'center',
                fontFamily: 'var(--ads-font-sans)',
                fontSize: '13px',
              }}
            >
              {['Location', 'Patients', 'Revenue', 'Active cases', 'Utilization', 'Staff', ''].map((h, i) => (
                <div key={i} style={{ padding: '6px 0', fontSize: '11px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--ads-border-subtle)', textAlign: i >= 1 && i <= 5 ? 'right' : 'left' }}>
                  {h}
                </div>
              ))}
              {SEED_LOCATIONS.map((l) => (
                <React.Fragment key={l.id}>
                  <div style={{ padding: '12px 0', borderBottom: '1px solid var(--ads-border-subtle)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Avatar name={l.monogram} size="sm" />
                    <div>
                      <div style={{ fontWeight: 500 }}>{l.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--ads-text-muted)' }}>{l.city}, {l.state}</div>
                    </div>
                  </div>
                  <div style={{ padding: '12px 0', borderBottom: '1px solid var(--ads-border-subtle)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{l.patientCount.toLocaleString()}</div>
                  <div style={{ padding: '12px 0', borderBottom: '1px solid var(--ads-border-subtle)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{usd(l.monthlyRevenue)}</div>
                  <div style={{ padding: '12px 0', borderBottom: '1px solid var(--ads-border-subtle)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{l.activeCases}</div>
                  <div style={{ padding: '12px 0', borderBottom: '1px solid var(--ads-border-subtle)', textAlign: 'right' }}>
                    <Tag size="small" color={utilTone(l.utilization)}>{Math.round(l.utilization * 100)}%</Tag>
                  </div>
                  <div style={{ padding: '12px 0', borderBottom: '1px solid var(--ads-border-subtle)', textAlign: 'right' }}>{l.staffCount}</div>
                  <div style={{ padding: '12px 0', borderBottom: '1px solid var(--ads-border-subtle)', textAlign: 'right' }}>
                    <button type="button" onClick={() => setActiveLocationId(l.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', color: 'var(--ads-blue-550)' }}>
                      Open →
                    </button>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </section>
        )}

        {activeLocationId !== 'all' && (() => {
          const loc = SEED_LOCATIONS.find((l) => l.id === activeLocationId)!;
          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '16px' }}>
              <section style={{ backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', padding: '20px' }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '15px', fontWeight: 500 }}>{loc.name}</h3>
                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'minmax(0, 140px) minmax(0, 1fr)', gap: '8px 16px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
                  <KV k="Patients"     v={loc.patientCount.toLocaleString()} />
                  <KV k="Monthly revenue" v={usd(loc.monthlyRevenue)} />
                  <KV k="Active cases" v={String(loc.activeCases)} />
                  <KV k="Utilization"  v={`${Math.round(loc.utilization * 100)}%`} />
                  <KV k="Staff"        v={String(loc.staffCount)} />
                </div>
              </section>
              <aside style={{ backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', padding: '20px' }}>
                <h4 style={{ margin: '0 0 8px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Settings inheritance
                </h4>
                <SettingRow
                  label="Working hours"
                  value={`${loc.hours.open}–${loc.hours.close}`}
                  override={loc.hoursOverridden}
                  orgDefault={`${ORG_DEFAULTS.hours.open}–${ORG_DEFAULTS.hours.close}`}
                />
                <SettingRow
                  label="Sales tax"
                  value={`${loc.taxRate}%`}
                  override={loc.taxRateOverridden}
                  orgDefault={`${ORG_DEFAULTS.taxRate}%`}
                />
                <SettingRow
                  label="Brand primary"
                  value={ORG_DEFAULTS.brandPrimary}
                  override={false}
                  orgDefault={ORG_DEFAULTS.brandPrimary}
                  swatch
                />
                <p style={{ margin: '12px 0 0', fontFamily: 'var(--ads-font-sans)', fontSize: '11px', color: 'var(--ads-text-muted)' }}>
                  Settings inherit from the organization. Override at the location level when local rules differ (e.g. state tax, longer hours).
                </p>
              </aside>
            </div>
          );
        })()}
      </div>

      {transferOpen && (
        <Modal open onClose={() => setTransferOpen(false)} title="Transfer patient between locations" size="sm" footer={
          <>
            <SecondaryButton size={36} onClick={() => setTransferOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton size={36} onClick={() => setTransferOpen(false)}>Transfer</PrimaryButton>
          </>
        }>
          <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
            Move <strong>Mina Yamada</strong> from <strong>SFO</strong> to which location? The patient's chart, plans, and balance follow them; appointments are cancelled and need to be re-booked.
          </p>
          <p style={{ margin: '12px 0 0', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
            (Demo — selection UI not wired.)
          </p>
        </Modal>
      )}
    </DSCoreShell>
  );
}

function SettingRow({ label, value, override, orgDefault, swatch }: { label: string; value: string; override?: boolean; orgDefault: string; swatch?: boolean }) {
  return (
    <div style={{ padding: '8px 0', borderTop: '1px solid var(--ads-border-subtle)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)' }}>{label}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {swatch && <span style={{ width: 14, height: 14, backgroundColor: value, border: '1px solid var(--ads-border-subtle)', borderRadius: 3 }} />}
          <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500 }}>{value}</span>
        </span>
      </div>
      <div style={{ marginTop: '2px', fontFamily: 'var(--ads-font-sans)', fontSize: '11px', color: 'var(--ads-text-muted)' }}>
        {override ? <Tag size="small" color="orange">Override · org default {orgDefault}</Tag> : <Tag size="small" color="green">Inherits org default</Tag>}
      </div>
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

function utilTone(util: number): TagColor {
  if (util > 0.85) return 'red';
  if (util > 0.7)  return 'green';
  if (util > 0.5)  return 'blue';
  return 'orange';
}

function usd(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}
