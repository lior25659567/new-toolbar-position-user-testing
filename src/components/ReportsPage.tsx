import React, { useMemo, useState } from 'react';
import { DropdownList, IconButton, Modal, PrimaryButton, SecondaryButton, Tag, TextInput, type TagColor } from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

type WidgetKind = 'kpi' | 'bar' | 'line' | 'pie' | 'table';
type DataSource = 'jobs' | 'plans' | 'claims' | 'appointments' | 'patients';
type Aggregation = 'count' | 'sum' | 'avg' | 'rate';

interface Widget {
  id: string;
  kind: WidgetKind;
  title: string;
  source: DataSource;
  aggregation: Aggregation;
  groupBy?: string;
  filterField?: string;
  filterValue?: string;
}

interface SavedReport {
  id: string;
  name: string;
  ownerName: string;
  schedule?: 'daily' | 'weekly' | 'monthly';
  widgets: Widget[];
  lastRun: string;
}

const SEED_DATA: Record<DataSource, { name: string; field: string; value: number }[]> = {
  jobs: [
    { name: 'New', field: 'status', value: 4 },
    { name: 'In design', field: 'status', value: 6 },
    { name: 'Production', field: 'status', value: 8 },
    { name: 'QC', field: 'status', value: 3 },
    { name: 'Shipping', field: 'status', value: 2 },
    { name: 'Delivered', field: 'status', value: 12 },
  ],
  plans: [
    { name: 'Draft', field: 'status', value: 6 },
    { name: 'Presented', field: 'status', value: 4 },
    { name: 'Accepted', field: 'status', value: 11 },
    { name: 'In progress', field: 'status', value: 8 },
    { name: 'Completed', field: 'status', value: 23 },
  ],
  claims: [
    { name: 'Submitted', field: 'status', value: 14 },
    { name: 'In review', field: 'status', value: 9 },
    { name: 'Paid', field: 'status', value: 42 },
    { name: 'Partial', field: 'status', value: 7 },
    { name: 'Denied', field: 'status', value: 5 },
  ],
  appointments: [
    { name: 'Scheduled', field: 'status', value: 38 },
    { name: 'Completed', field: 'status', value: 211 },
    { name: 'No-show', field: 'status', value: 9 },
  ],
  patients: [
    { name: 'Active', field: 'status', value: 1247 },
    { name: 'Inactive', field: 'status', value: 312 },
  ],
};

const SEED_TIMESERIES = [
  { label: 'W1', value: 28 }, { label: 'W2', value: 32 }, { label: 'W3', value: 30 },
  { label: 'W4', value: 38 }, { label: 'W5', value: 35 }, { label: 'W6', value: 42 },
  { label: 'W7', value: 39 }, { label: 'W8', value: 47 },
];

const SEED_REPORTS: SavedReport[] = [
  { id: 'r-1', name: 'Practice executive overview', ownerName: 'Dr. Alex Watanabe', schedule: 'weekly', lastRun: hoursAgo(48), widgets: [
    { id: 'w1', kind: 'kpi',  title: 'Active patients',  source: 'patients',     aggregation: 'count' },
    { id: 'w2', kind: 'kpi',  title: 'Open A/R',         source: 'claims',       aggregation: 'sum' },
    { id: 'w3', kind: 'line', title: 'Revenue by week',  source: 'claims',       aggregation: 'sum',   groupBy: 'week' },
    { id: 'w4', kind: 'bar',  title: 'Jobs by status',   source: 'jobs',         aggregation: 'count', groupBy: 'status' },
    { id: 'w5', kind: 'pie',  title: 'Plans by status',  source: 'plans',        aggregation: 'count', groupBy: 'status' },
  ]},
  { id: 'r-2', name: 'Lab performance', ownerName: 'Dr. Maria Petrov', lastRun: hoursAgo(120), widgets: [
    { id: 'w1', kind: 'bar', title: 'Cases by lab', source: 'jobs', aggregation: 'count', groupBy: 'lab' },
    { id: 'w2', kind: 'kpi', title: 'Avg turnaround', source: 'jobs', aggregation: 'avg' },
  ]},
  { id: 'r-3', name: 'Hygiene recall pipeline', ownerName: 'Sara Singh', schedule: 'monthly', lastRun: hoursAgo(720), widgets: [] },
];

const PIE_COLORS = ['var(--ads-background-interactive)', 'var(--ads-text-on-highlight-purple)', 'var(--ads-text-success)', 'var(--ads-text-warning)', 'var(--ads-text-error)', '#5DD3F0'];

interface Props { onBackToHome?: () => void; onNavigate?: (id: DSCoreNavId) => void; }

export default function ReportsPage({ onBackToHome, onNavigate }: Props) {
  const [reports, setReports] = useState<SavedReport[]>(SEED_REPORTS);
  const [activeId, setActiveId] = useState<string>(reports[0].id);
  const [addOpen, setAddOpen] = useState(false);

  const active = reports.find((r) => r.id === activeId)!;

  const addWidget = (w: Widget) => {
    setReports((rs) => rs.map((r) => r.id === activeId ? { ...r, widgets: [...r.widgets, w] } : r));
    setAddOpen(false);
  };
  const removeWidget = (wid: string) => {
    setReports((rs) => rs.map((r) => r.id === activeId ? { ...r, widgets: r.widgets.filter((w) => w.id !== wid) } : r));
  };

  return (
    <DSCoreShell active="treatments" unread={0} onNavigate={(id) => id === 'home' && onBackToHome ? onBackToHome() : onNavigate?.(id)}>
      <div style={{ maxWidth: '1480px', margin: '0 auto', padding: '32px 32px 80px' }}>
        <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '28px', margin: 0, color: 'var(--ads-text-primary)' }}>
              Custom reports
            </h1>
            <p style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)', margin: '6px 0 0' }}>
              Compose dashboards from any data source. Save, schedule deliveries, share to team roles.
            </p>
          </div>
          <PrimaryButton size={36} onClick={() => setAddOpen(true)}>+ Add widget</PrimaryButton>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '260px minmax(0, 1fr)', gap: '12px', alignItems: 'flex-start' }}>
          <aside style={{ backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', padding: '12px' }}>
            <h4 style={{ margin: '0 0 8px 4px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Saved reports</h4>
            {reports.map((r) => {
              const isActive = activeId === r.id;
              return (
                <button key={r.id} type="button" onClick={() => setActiveId(r.id)} style={{ width: '100%', padding: '8px 10px', textAlign: 'left', background: isActive ? 'color-mix(in srgb, var(--ads-blue-500) 6%, transparent)' : 'transparent', border: '1px solid', borderColor: isActive ? 'var(--ads-blue-500)' : 'transparent', borderRadius: 'var(--ads-radius-sm)', cursor: 'pointer', fontFamily: 'inherit', color: 'inherit', marginBottom: '2px' }}>
                  <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500 }}>{r.name}</div>
                  <div style={{ marginTop: '2px', fontFamily: 'var(--ads-font-sans)', fontSize: '11px', color: 'var(--ads-text-muted)' }}>
                    {r.ownerName} · {r.widgets.length} widget{r.widgets.length === 1 ? '' : 's'}
                    {r.schedule && ` · ${r.schedule}`}
                  </div>
                </button>
              );
            })}
            <SecondaryButton size={36} fullWidth>+ New report</SecondaryButton>
          </aside>

          <section>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h2 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '20px', fontWeight: 500 }}>{active.name}</h2>
                <p style={{ margin: '4px 0 0', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                  Last run {new Date(active.lastRun).toLocaleString()} · owner {active.ownerName}
                  {active.schedule && ` · auto-runs ${active.schedule}`}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <SecondaryButton size={36}>Schedule</SecondaryButton>
                <SecondaryButton size={36}>Share</SecondaryButton>
                <PrimaryButton size={36}>Export</PrimaryButton>
              </div>
            </header>

            {active.widgets.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', backgroundColor: 'var(--ads-bg-surface)', border: '1px dashed var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)' }}>
                <p style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)' }}>
                  Empty canvas. Click "+ Add widget" to drop your first chart.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
                {active.widgets.map((w) => (
                  <WidgetCard key={w.id} widget={w} onRemove={() => removeWidget(w.id)} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {addOpen && <AddWidgetModal onAdd={addWidget} onClose={() => setAddOpen(false)} />}
    </DSCoreShell>
  );
}

function WidgetCard({ widget, onRemove }: { widget: Widget; onRemove: () => void }) {
  const data = SEED_DATA[widget.source] ?? [];
  return (
    <div style={{ backgroundColor: 'var(--ads-bg-surface)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 200 }}>
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div>
          <h4 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>{widget.title}</h4>
          <div style={{ marginTop: '4px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <Tag size="small" color="blue">{widget.source}</Tag>
            <Tag size="small" color="purple">{widget.aggregation}</Tag>
            {widget.groupBy && <Tag size="small" color="orange">by {widget.groupBy}</Tag>}
          </div>
        </div>
        <IconButton size="md" aria-label="Remove" onClick={onRemove}>×</IconButton>
      </header>
      <div style={{ flex: 1, minHeight: 140 }}>
        {widget.kind === 'kpi' && (
          <div>
            <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '36px', fontWeight: 500, color: 'var(--ads-text-primary)', fontVariantNumeric: 'tabular-nums' }}>
              {data.reduce((s, d) => s + d.value, 0).toLocaleString()}
            </div>
            <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>Total {widget.aggregation}</div>
          </div>
        )}
        {widget.kind === 'bar' && (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="var(--ads-text-muted)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--ads-text-muted)" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="var(--ads-blue-500)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
        {widget.kind === 'line' && (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={SEED_TIMESERIES}>
              <XAxis dataKey="label" stroke="var(--ads-text-muted)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--ads-text-muted)" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="var(--ads-blue-500)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
        {widget.kind === 'pie' && (
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={36} outerRadius={64}>
                {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
        {widget.kind === 'table' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--ads-font-sans)', fontSize: '12px' }}>
            <thead>
              <tr><th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid var(--ads-border-subtle)' }}>Bucket</th><th style={{ textAlign: 'right', padding: '4px 8px', borderBottom: '1px solid var(--ads-border-subtle)' }}>Count</th></tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i}><td style={{ padding: '4px 8px' }}>{d.name}</td><td style={{ padding: '4px 8px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{d.value}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function AddWidgetModal({ onAdd, onClose }: { onAdd: (w: Widget) => void; onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<WidgetKind>('bar');
  const [source, setSource] = useState<DataSource>('jobs');
  const [aggregation, setAggregation] = useState<Aggregation>('count');
  const [groupBy, setGroupBy] = useState('status');

  const valid = title.trim().length > 0;

  return (
    <Modal
      open
      onClose={onClose}
      title="Add widget"
      size="md"
      footer={
        <>
          <SecondaryButton size={36} onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton size={36} disabled={!valid} onClick={() => onAdd({ id: `w-${Date.now()}`, kind, title: title.trim(), source, aggregation, groupBy })}>Add to canvas</PrimaryButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <TextInput label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
        <DropdownList
          label="Visualization"
          options={[
            { value: 'kpi',   label: 'KPI tile' },
            { value: 'bar',   label: 'Bar chart' },
            { value: 'line',  label: 'Line chart' },
            { value: 'pie',   label: 'Pie / donut' },
            { value: 'table', label: 'Table' },
          ]}
          value={kind} onChange={(v) => setKind(v as WidgetKind)} fullWidth
        />
        <DropdownList
          label="Data source"
          options={[
            { value: 'jobs',         label: 'Jobs' },
            { value: 'plans',        label: 'Treatment plans' },
            { value: 'claims',       label: 'Claims' },
            { value: 'appointments', label: 'Appointments' },
            { value: 'patients',     label: 'Patients' },
          ]}
          value={source} onChange={(v) => setSource(v as DataSource)} fullWidth
        />
        <DropdownList
          label="Aggregation"
          options={[
            { value: 'count', label: 'Count' },
            { value: 'sum',   label: 'Sum' },
            { value: 'avg',   label: 'Average' },
            { value: 'rate',  label: 'Rate (%)' },
          ]}
          value={aggregation} onChange={(v) => setAggregation(v as Aggregation)} fullWidth
        />
        <TextInput label="Group by (field name)" value={groupBy} onChange={(e) => setGroupBy(e.target.value)} fullWidth />
      </div>
    </Modal>
  );
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}
