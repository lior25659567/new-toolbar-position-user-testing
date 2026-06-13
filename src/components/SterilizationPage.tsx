import React, { useState } from 'react';
import { Avatar, DropdownList, Modal, PrimaryButton, SecondaryButton, Tag, type TagColor } from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';
import { KpiTile } from './dscore/shared/KpiTile';

type CycleStatus = 'pass' | 'fail' | 'in-progress' | 'recall';
type CycleType = 'gravity' | 'pre-vacuum' | 'flash' | 'dry-heat';

interface AutoclaveCycle {
  id: string;
  cycleNumber: string;       // 'AC-2026-0421'
  type: CycleType;
  startedAt: string;
  endedAt?: string;
  operator: string;
  autoclaveId: string;
  trayIds: string[];
  /** Class V chemical indicator passed? */
  chemicalIndicator: 'pass' | 'fail';
  /** Biological indicator (spore test) result. May lag. */
  biologicalIndicator?: 'pass' | 'fail' | 'pending';
  status: CycleStatus;
  temperatureF: number;
  pressurePsi: number;
  durationMin: number;
}

interface Tray {
  id: string;            // 'TR-024'
  contents: string;      // 'Crown prep kit'
  /** Patient this tray was used on; pulled from cycle linkage. */
  usedOn?: { patientId: string; patientName: string; visitDate: string };
  lastSterilizedCycleId?: string;
}

interface SporeTest {
  id: string;
  cycleId: string;
  cycleNumber: string;
  incubatedAt: string;
  resultAt?: string;
  result: 'pass' | 'fail' | 'pending';
  technician: string;
}

const SEED_CYCLES: AutoclaveCycle[] = [
  { id: 'c-1', cycleNumber: 'AC-2026-0421', type: 'pre-vacuum', startedAt: hoursAgo(1.5), endedAt: hoursAgo(0.5), operator: 'Sara Singh', autoclaveId: 'AC-1', trayIds: ['TR-024', 'TR-031'], chemicalIndicator: 'pass', biologicalIndicator: 'pending', status: 'pass', temperatureF: 273, pressurePsi: 30, durationMin: 30 },
  { id: 'c-2', cycleNumber: 'AC-2026-0420', type: 'pre-vacuum', startedAt: hoursAgo(4),   endedAt: hoursAgo(3),   operator: 'Tomás Rivera', autoclaveId: 'AC-1', trayIds: ['TR-007'],          chemicalIndicator: 'pass', biologicalIndicator: 'pass',    status: 'pass', temperatureF: 273, pressurePsi: 30, durationMin: 30 },
  { id: 'c-3', cycleNumber: 'AC-2026-0419', type: 'gravity',     startedAt: hoursAgo(7),   endedAt: hoursAgo(6),   operator: 'Sara Singh',  autoclaveId: 'AC-2', trayIds: ['TR-014', 'TR-018'], chemicalIndicator: 'pass', biologicalIndicator: 'pass',    status: 'pass', temperatureF: 250, pressurePsi: 15, durationMin: 30 },
  { id: 'c-4', cycleNumber: 'AC-2026-0418', type: 'pre-vacuum', startedAt: hoursAgo(28),  endedAt: hoursAgo(27),  operator: 'Sara Singh',  autoclaveId: 'AC-1', trayIds: ['TR-002'],          chemicalIndicator: 'fail', biologicalIndicator: 'fail',    status: 'recall', temperatureF: 245, pressurePsi: 22, durationMin: 30 },
  { id: 'c-5', cycleNumber: 'AC-2026-0417', type: 'flash',       startedAt: hoursAgo(31),  endedAt: hoursAgo(30),  operator: 'Tomás Rivera', autoclaveId: 'AC-2', trayIds: ['TR-040'],          chemicalIndicator: 'pass', biologicalIndicator: 'pass',    status: 'pass', temperatureF: 270, pressurePsi: 30, durationMin: 10 },
  { id: 'c-6', cycleNumber: 'AC-2026-0416', type: 'pre-vacuum', startedAt: hoursAgo(50),  endedAt: hoursAgo(49),  operator: 'Sara Singh',  autoclaveId: 'AC-1', trayIds: ['TR-051'],          chemicalIndicator: 'pass', biologicalIndicator: 'pass',    status: 'pass', temperatureF: 273, pressurePsi: 30, durationMin: 30 },
  { id: 'c-7', cycleNumber: 'AC-2026-0422', type: 'pre-vacuum', startedAt: hoursAgo(0),                        operator: 'Sara Singh', autoclaveId: 'AC-2', trayIds: ['TR-061', 'TR-068'], chemicalIndicator: 'pass', status: 'in-progress', temperatureF: 273, pressurePsi: 30, durationMin: 30 },
];

const SEED_TRAYS: Tray[] = [
  { id: 'TR-024', contents: 'Crown prep kit',     usedOn: { patientId: 'pat-mina',  patientName: 'Mina Yamada', visitDate: hoursAgo(0) }, lastSterilizedCycleId: 'c-1' },
  { id: 'TR-031', contents: 'Cleaning kit',                                                         lastSterilizedCycleId: 'c-1' },
  { id: 'TR-007', contents: 'Restorative kit',    usedOn: { patientId: 'pat-aiko',  patientName: 'Aiko Tanaka', visitDate: hoursAgo(2) }, lastSterilizedCycleId: 'c-2' },
  { id: 'TR-014', contents: 'Endo kit',           usedOn: { patientId: 'pat-priya', patientName: 'Priya Singh', visitDate: hoursAgo(5) }, lastSterilizedCycleId: 'c-3' },
  { id: 'TR-018', contents: 'Surgery kit',                                                          lastSterilizedCycleId: 'c-3' },
  { id: 'TR-002', contents: 'Crown prep kit',     usedOn: { patientId: 'pat-noor',  patientName: 'Noor Hassan', visitDate: hoursAgo(26) }, lastSterilizedCycleId: 'c-4' },
  { id: 'TR-040', contents: 'Hygiene kit',        usedOn: { patientId: 'pat-leon',  patientName: 'Leon Bernal', visitDate: hoursAgo(29) }, lastSterilizedCycleId: 'c-5' },
];

const SEED_SPORE: SporeTest[] = [
  { id: 'sp-1', cycleId: 'c-1', cycleNumber: 'AC-2026-0421', incubatedAt: hoursAgo(0.5), result: 'pending',                      technician: 'Sara Singh' },
  { id: 'sp-2', cycleId: 'c-2', cycleNumber: 'AC-2026-0420', incubatedAt: hoursAgo(3),   resultAt: hoursAgo(0.5), result: 'pass', technician: 'Tomás Rivera' },
  { id: 'sp-3', cycleId: 'c-4', cycleNumber: 'AC-2026-0418', incubatedAt: hoursAgo(27),  resultAt: hoursAgo(3),   result: 'fail', technician: 'Sara Singh' },
  { id: 'sp-4', cycleId: 'c-6', cycleNumber: 'AC-2026-0416', incubatedAt: hoursAgo(49),  resultAt: hoursAgo(25),  result: 'pass', technician: 'Sara Singh' },
];

const STATUS_TONE: Record<CycleStatus, TagColor> = { pass: 'green', fail: 'red', 'in-progress': 'blue', recall: 'red' };

interface SterilizationPageProps {
  onBackToHome?: () => void;
  onNavigate?: (id: DSCoreNavId) => void;
}

export default function SterilizationPage({ onBackToHome, onNavigate }: SterilizationPageProps) {
  const [recallTrayId, setRecallTrayId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<CycleStatus | 'all'>('all');

  const filtered = SEED_CYCLES.filter((c) => filterStatus === 'all' || c.status === filterStatus);

  const passToday = SEED_CYCLES.filter((c) => c.status === 'pass').length;
  const recall = SEED_CYCLES.filter((c) => c.status === 'recall').length;
  const pendingSpore = SEED_SPORE.filter((s) => s.result === 'pending').length;
  const failedSpore = SEED_SPORE.filter((s) => s.result === 'fail').length;

  const recallTray = recallTrayId ? SEED_TRAYS.find((t) => t.id === recallTrayId) : null;

  return (
    <DSCoreShell active="equipment" unread={recall} onNavigate={(id) => id === 'home' && onBackToHome ? onBackToHome() : onNavigate?.(id)}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '32px 40px 80px' }}>
        <header style={{ marginBottom: '20px' }}>
          <h1 style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '28px', margin: 0, color: 'var(--ads-text-primary)' }}>
            Sterilization tracking
          </h1>
          <p style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)', margin: '6px 0 0' }}>
            Autoclave cycle log, biological-indicator results, and tray-to-patient chain of custody.
          </p>
        </header>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <KpiTile kpi={{ label: 'Cycles passed (today)', value: passToday, display: String(passToday), delta: 0.1 }} />
          <KpiTile kpi={{ label: 'Cycles recalled',      value: recall,    display: String(recall),    delta: 0   }} tone={recall > 0 ? 'warning' : 'default'} invertDeltaSemantics />
          <KpiTile kpi={{ label: 'Spore tests pending',  value: pendingSpore, display: String(pendingSpore), delta: 0 }} />
          <KpiTile kpi={{ label: 'Spore tests failed',   value: failedSpore,  display: String(failedSpore),  delta: 0 }} tone={failedSpore > 0 ? 'warning' : 'default'} invertDeltaSemantics />
        </div>

        {recall > 0 && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--ads-tag-red-bg)',
              border: '1px solid var(--ads-tag-red-br)',
              borderRadius: 'var(--ads-radius-sm)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '20px' }}>⚠</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--ads-tag-red-fg)' }}>
                {recall} cycle{recall === 1 ? '' : 's'} flagged for recall
              </div>
              <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)' }}>
                Patients exposed to potentially unsterilized instruments need to be notified per CDC infection-control protocol.
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '16px' }}>
          <Card title="Autoclave cycles" extra={
            <DropdownList
              options={[
                { value: 'all',         label: 'All cycles' },
                { value: 'pass',        label: 'Passed' },
                { value: 'in-progress', label: 'In progress' },
                { value: 'recall',      label: 'Recall' },
                { value: 'fail',        label: 'Failed' },
              ]}
              value={filterStatus}
              onChange={(v) => setFilterStatus(v as CycleStatus | 'all')}
            />
          }>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filtered.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: '12px 14px',
                    border: `1px solid ${c.status === 'recall' ? 'var(--ads-tag-red-br)' : 'var(--ads-border-subtle)'}`,
                    backgroundColor: c.status === 'recall' ? 'var(--ads-tag-red-bg)' : 'var(--ads-bg-surface)',
                    borderRadius: 'var(--ads-radius-sm)',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) auto auto auto',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--ads-font-mono, ui-monospace)', fontSize: '12px', color: 'var(--ads-text-primary)', fontWeight: 500 }}>{c.cycleNumber}</span>
                      <Tag size="small" color={STATUS_TONE[c.status]}>{c.status}</Tag>
                      <Tag size="small" color="purple">{c.type}</Tag>
                    </div>
                    <div style={{ marginTop: '4px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                      {c.autoclaveId} · {c.operator} · {new Date(c.startedAt).toLocaleString()} · {c.durationMin}min · {c.temperatureF}°F / {c.pressurePsi} PSI
                    </div>
                    <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {c.trayIds.map((id) => {
                        const tray = SEED_TRAYS.find((t) => t.id === id);
                        const usedOnAffectedCycle = c.status === 'recall' && tray?.usedOn;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => usedOnAffectedCycle && setRecallTrayId(id)}
                            style={{
                              cursor: usedOnAffectedCycle ? 'pointer' : 'default',
                              padding: '2px 8px',
                              fontFamily: 'var(--ads-font-mono, ui-monospace)',
                              fontSize: '11px',
                              border: `1px solid ${usedOnAffectedCycle ? 'var(--ads-danger-500)' : 'var(--ads-border-subtle)'}`,
                              borderRadius: '999px',
                              backgroundColor: 'var(--ads-bg-page)',
                              color: usedOnAffectedCycle ? 'var(--ads-danger-500)' : 'var(--ads-text-primary)',
                            }}
                          >
                            {id}{tray?.usedOn ? ` → ${tray.usedOn.patientName}` : ''}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <Indicator label="CI" pass={c.chemicalIndicator === 'pass'} pending={false} />
                  <Indicator label="BI" pass={c.biologicalIndicator === 'pass'} pending={c.biologicalIndicator === 'pending' || c.biologicalIndicator === undefined} />
                </div>
              ))}
            </div>
          </Card>

          <Card title="Spore tests (BI)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SEED_SPORE.map((s) => (
                <div
                  key={s.id}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid var(--ads-border-subtle)',
                    backgroundColor: 'var(--ads-bg-surface)',
                    borderRadius: 'var(--ads-radius-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--ads-font-mono, ui-monospace)', fontSize: '12px', color: 'var(--ads-text-primary)' }}>
                      {s.cycleNumber}
                    </span>
                    <Tag size="small" color={s.result === 'pass' ? 'green' : s.result === 'fail' ? 'red' : 'orange'}>
                      {s.result}
                    </Tag>
                  </div>
                  <div style={{ marginTop: '4px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                    Inc {new Date(s.incubatedAt).toLocaleString()}{s.resultAt ? ` · result ${new Date(s.resultAt).toLocaleString()}` : ' · awaiting 24h read'}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {recallTray && recallTray.usedOn && (
        <Modal
          open
          onClose={() => setRecallTrayId(null)}
          title={`Recall: ${recallTray.id}`}
          size="sm"
          footer={
            <>
              <SecondaryButton size={36} onClick={() => setRecallTrayId(null)}>Close</SecondaryButton>
              <PrimaryButton size={36} onClick={() => setRecallTrayId(null)}>Send notification</PrimaryButton>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar name={recallTray.usedOn.patientName.split(' ').map((s) => s[0]).slice(0, 2).join('')} size="md" />
              <div>
                <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>
                  {recallTray.usedOn.patientName}
                </div>
                <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                  Visit {new Date(recallTray.usedOn.visitDate).toLocaleString()}
                </div>
              </div>
            </div>
            <div style={{ padding: '10px 12px', backgroundColor: 'var(--ads-tag-red-bg)', border: '1px solid var(--ads-tag-red-br)', borderRadius: 'var(--ads-radius-sm)', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)' }}>
              Tray <strong>{recallTray.id}</strong> ({recallTray.contents}) was used on this patient after a failed sterilization cycle. Notify the patient and offer post-exposure consultation per CDC guidelines.
            </div>
          </div>
        </Modal>
      )}
    </DSCoreShell>
  );
}

function Card({ title, extra, children }: { title: string; extra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
        padding: '20px',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '15px', color: 'var(--ads-text-primary)' }}>
          {title}
        </h3>
        {extra}
      </header>
      {children}
    </section>
  );
}

function Indicator({ label, pass, pending }: { label: string; pass: boolean; pending: boolean }) {
  const bg = pending ? 'var(--ads-tag-orange-bg)' : pass ? 'var(--ads-tag-green-bg)' : 'var(--ads-tag-red-bg)';
  const fg = pending ? 'var(--ads-tag-orange-fg)' : pass ? 'var(--ads-tag-green-fg)' : 'var(--ads-tag-red-fg)';
  const br = pending ? 'var(--ads-tag-orange-br)' : pass ? 'var(--ads-tag-green-br)' : 'var(--ads-tag-red-br)';
  return (
    <div
      title={`${label}: ${pending ? 'pending' : pass ? 'pass' : 'fail'}`}
      style={{
        width: 36, height: 36, borderRadius: '50%',
        backgroundColor: bg, border: `1px solid ${br}`,
        color: fg,
        fontFamily: 'var(--ads-font-sans)', fontWeight: 600, fontSize: 11,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {label}
    </div>
  );
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}
