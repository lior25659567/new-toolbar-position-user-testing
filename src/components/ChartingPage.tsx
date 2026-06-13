import React, { useReducer, useState } from 'react';
import { Avatar, DropdownList, PrimaryButton, SecondaryButton, Tag } from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';
import {
  chartingReducer,
  initChartingState,
  summarizePerio,
  type ChartingState,
  type ChartingAction,
  type Surface,
  type RestorationType,
  type ConditionType,
  type PerioSite,
  UPPER_RIGHT, UPPER_LEFT, LOWER_LEFT, LOWER_RIGHT,
  RESTORATION_LABEL, CONDITION_LABEL,
  RESTORATION_COLOR, CONDITION_COLOR,
} from './dscore/charting/chartingState';

const PERIO_SITE_ORDER: PerioSite[] = ['mb', 'b', 'db', 'ml', 'l', 'dl'];
const PERIO_SITE_LABEL: Record<PerioSite, string> = {
  mb: 'MB', b: 'B', db: 'DB', ml: 'ML', l: 'L', dl: 'DL',
};

interface ChartingPageProps {
  onBackToHome?: () => void;
  onNavigate?: (id: DSCoreNavId) => void;
}

export default function ChartingPage({ onBackToHome, onNavigate }: ChartingPageProps) {
  const [state, dispatch] = useReducer(chartingReducer, undefined, initChartingState);
  const [tab, setTab] = useState<'chart' | 'perio'>('chart');
  const summary = React.useMemo(() => summarizePerio(state), [state]);

  return (
    <DSCoreShell
      active="patients"
      unread={0}
      onNavigate={(id) => {
        if (id === 'home' && onBackToHome) onBackToHome();
        else onNavigate?.(id);
      }}
    >
      <div style={{ maxWidth: '1480px', margin: '0 auto', padding: '32px 32px 80px' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '28px', margin: 0, color: 'var(--ads-text-primary)' }}>
              Charting & Perio
            </h1>
            <p style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)', margin: '6px 0 0' }}>
              Visual restoration chart and 6-site perio probing for {state.patientName}.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar name={state.patientName.split(' ').map((s) => s[0]).slice(0, 2).join('')} size="md" />
            <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
              <div style={{ fontWeight: 500, color: 'var(--ads-text-primary)' }}>{state.patientName}</div>
              <div style={{ color: 'var(--ads-text-muted)' }}>Visit · {new Date(state.visitDate).toLocaleDateString()}</div>
            </div>
          </div>
        </header>

        {/* Tab nav */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--ads-border-subtle)', marginBottom: '20px' }}>
          {[
            { id: 'chart', label: 'Tooth chart' },
            { id: 'perio', label: 'Perio exam' },
          ].map((t) => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id as 'chart' | 'perio')}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  borderBottom: `2px solid ${isActive ? 'var(--ads-blue-500)' : 'transparent'}`,
                  background: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--ads-font-sans)',
                  fontSize: '14px',
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? 'var(--ads-blue-550)' : 'var(--ads-text-muted)',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'chart' && <ChartTab state={state} dispatch={dispatch} />}
        {tab === 'perio' && <PerioTab state={state} dispatch={dispatch} summary={summary} />}
      </div>
    </DSCoreShell>
  );
}

function ChartTab({ state, dispatch }: { state: ChartingState; dispatch: React.Dispatch<ChartingAction> }) {
  const selected = state.selectedTooth;
  const findings = selected ? state.findings[selected] ?? [] : [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '16px' }}>
      <ToothChart state={state} dispatch={dispatch} />
      <FindingsPanel selected={selected} findings={findings} dispatch={dispatch} />
    </div>
  );
}

function ToothChart({ state, dispatch }: { state: ChartingState; dispatch: React.Dispatch<ChartingAction> }) {
  return (
    <section
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
        padding: '24px',
      }}
    >
      <Arch teeth={UPPER_RIGHT} state={state} dispatch={dispatch} side="right-half" />
      <Arch teeth={UPPER_LEFT}  state={state} dispatch={dispatch} side="left-half" />
      <div style={{ height: '24px' }} />
      <Arch teeth={LOWER_LEFT}  state={state} dispatch={dispatch} side="left-half" inverted />
      <Arch teeth={LOWER_RIGHT} state={state} dispatch={dispatch} side="right-half" inverted />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', gap: '12px', flexWrap: 'wrap', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
        {(Object.keys(RESTORATION_LABEL) as RestorationType[]).map((k) => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 10, height: 10, backgroundColor: RESTORATION_COLOR[k], borderRadius: 2, border: '1px solid var(--ads-border-subtle)' }} />
            {RESTORATION_LABEL[k]}
          </span>
        ))}
      </div>
    </section>
  );
}

function Arch({
  teeth,
  state,
  dispatch,
  inverted,
}: {
  teeth: number[];
  state: ChartingState;
  dispatch: React.Dispatch<ChartingAction>;
  side: 'left-half' | 'right-half';
  inverted?: boolean;
}) {
  return (
    <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${teeth.length}, 60px)`, gap: '6px' }}>
      {teeth.map((t) => (
        <ToothCell
          key={t}
          tooth={t}
          findings={state.findings[t] ?? []}
          selected={state.selectedTooth === t}
          inverted={inverted}
          onClick={() => dispatch({ type: 'SELECT_TOOTH', tooth: t })}
        />
      ))}
    </div>
  );
}

function ToothCell({
  tooth,
  findings,
  selected,
  inverted,
  onClick,
}: {
  tooth: number;
  findings: ReturnType<typeof Object>;
  selected: boolean;
  inverted?: boolean;
  onClick: () => void;
}) {
  const findingsArr = findings as { type: string; surfaces?: Surface[] }[];
  const isMissing = findingsArr.some((f) => f.type === 'missing');
  const crown = findingsArr.find((f) => f.type === 'crown');
  const rct = findingsArr.find((f) => f.type === 'rct');
  const conditions = findingsArr.filter((f): f is { type: ConditionType; surfaces?: Surface[] } =>
    ['caries', 'fracture', 'recession', 'mobility', 'periapical-lesion'].includes(f.type),
  );
  const surfaceFills = new Map<Surface, string>();
  for (const f of findingsArr) {
    if (!['amalgam', 'composite', 'sealant'].includes(f.type)) continue;
    const color = RESTORATION_COLOR[f.type as RestorationType];
    (f.surfaces ?? ['O']).forEach((s) => surfaceFills.set(s, color));
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 60,
        height: 80,
        padding: 0,
        border: `1.5px solid ${selected ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
        borderRadius: 'var(--ads-radius-sm)',
        backgroundColor: 'var(--ads-bg-surface)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: inverted ? 'column-reverse' : 'column',
        alignItems: 'center',
        opacity: isMissing ? 0.35 : 1,
      }}
    >
      <div style={{ fontFamily: 'var(--ads-font-mono, ui-monospace)', fontSize: '11px', color: 'var(--ads-text-muted)', padding: '2px 0' }}>
        {tooth}
      </div>
      <ToothSvg surfaceFills={surfaceFills} crowned={Boolean(crown)} rct={Boolean(rct)} missing={isMissing} />
      <div style={{ display: 'flex', gap: '2px', padding: '2px 0', minHeight: '8px' }}>
        {conditions.slice(0, 3).map((c, i) => (
          <span key={i} title={CONDITION_LABEL[c.type]} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: CONDITION_COLOR[c.type] }} />
        ))}
      </div>
    </button>
  );
}

function ToothSvg({ surfaceFills, crowned, rct, missing }: { surfaceFills: Map<Surface, string>; crowned: boolean; rct: boolean; missing: boolean }) {
  if (missing) {
    return (
      <svg width="40" height="48" viewBox="0 0 40 48">
        <line x1="6" y1="6" x2="34" y2="42" stroke="var(--ads-border-accent)" strokeWidth="1.5" />
        <line x1="34" y1="6" x2="6" y2="42" stroke="var(--ads-border-accent)" strokeWidth="1.5" />
      </svg>
    );
  }
  // Simple "tooth" rendering: 5 surfaces (M / L (/B) / O center / D, with I as outer ring)
  const occlusal = surfaceFills.get('O') ?? (crowned ? 'var(--ads-text-warning)' : 'var(--ads-bg-page)');
  const mesial   = surfaceFills.get('M') ?? 'var(--ads-bg-page)';
  const distal   = surfaceFills.get('D') ?? 'var(--ads-bg-page)';
  const buccal   = surfaceFills.get('B') ?? 'var(--ads-bg-page)';
  const lingual  = surfaceFills.get('L') ?? 'var(--ads-bg-page)';
  return (
    <svg width="44" height="48" viewBox="0 0 44 48">
      <rect x="6" y="6" width="32" height="36" rx="4" fill={crowned ? 'var(--ads-background-highlight-orange)' : 'var(--ads-bg-page)'} stroke="var(--ads-border-subtle)" strokeWidth="0.8" />
      {/* M / D / B / L / O surfaces */}
      <polygon points="6,6 16,16 16,32 6,42" fill={mesial} stroke="#999" strokeWidth="0.4" />
      <polygon points="38,6 28,16 28,32 38,42" fill={distal} stroke="#999" strokeWidth="0.4" />
      <polygon points="6,6 16,16 28,16 38,6" fill={buccal} stroke="#999" strokeWidth="0.4" />
      <polygon points="6,42 16,32 28,32 38,42" fill={lingual} stroke="#999" strokeWidth="0.4" />
      <rect x="16" y="16" width="12" height="16" fill={occlusal} stroke="#999" strokeWidth="0.4" />
      {rct && (
        <line x1="22" y1="6" x2="22" y2="42" stroke="var(--ads-text-on-highlight-purple)" strokeWidth="1.4" />
      )}
    </svg>
  );
}

function FindingsPanel({
  selected,
  findings,
  dispatch,
}: {
  selected: number | null;
  findings: { id: string; type: RestorationType | ConditionType; surfaces?: Surface[]; recordedAt: string; recordedBy: string }[];
  dispatch: React.Dispatch<ChartingAction>;
}) {
  const [type, setType] = useState<RestorationType | ConditionType>('composite');
  const [surfaces, setSurfaces] = useState<Surface[]>(['O']);

  if (!selected) {
    return (
      <section
        style={{
          backgroundColor: 'var(--ads-bg-surface)',
          border: '1px solid var(--ads-border-subtle)',
          borderRadius: 'var(--ads-radius-sm)',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--ads-text-muted)',
          fontFamily: 'var(--ads-font-sans)',
          fontSize: '14px',
        }}
      >
        Click a tooth to see and edit findings.
      </section>
    );
  }

  const allTypes: { value: RestorationType | ConditionType; label: string }[] = [
    ...((Object.keys(RESTORATION_LABEL) as RestorationType[]).map((k) => ({ value: k, label: RESTORATION_LABEL[k] }))),
    ...((Object.keys(CONDITION_LABEL) as ConditionType[]).map((k) => ({ value: k, label: CONDITION_LABEL[k] }))),
  ];
  const allSurfaces: Surface[] = ['M', 'O', 'D', 'B', 'L', 'I'];

  const toggleSurface = (s: Surface) => {
    setSurfaces((cur) => cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]);
  };

  return (
    <section
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <header>
        <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '15px', color: 'var(--ads-text-primary)' }}>
          Tooth #{selected}
        </h3>
        <p style={{ margin: '4px 0 0', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
          {findings.length} finding{findings.length === 1 ? '' : 's'} on file
        </p>
      </header>

      <div>
        <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
          History
        </div>
        {findings.length === 0 ? (
          <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-muted)' }}>None yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {findings.map((f) => {
              const restLabel = (RESTORATION_LABEL as Record<string, string>)[f.type] ?? (CONDITION_LABEL as Record<string, string>)[f.type] ?? f.type;
              const isCondition = f.type in CONDITION_LABEL;
              return (
                <div
                  key={f.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    padding: '8px 10px',
                    border: '1px solid var(--ads-border-subtle)',
                    borderRadius: 'var(--ads-radius-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <Tag size="small" color={isCondition ? 'red' : 'blue'}>{restLabel}</Tag>
                    {f.surfaces && f.surfaces.length > 0 && (
                      <span style={{ fontFamily: 'var(--ads-font-mono, ui-monospace)', fontSize: '11px', color: 'var(--ads-text-muted)' }}>
                        {f.surfaces.join('')}
                      </span>
                    )}
                    <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
                      · {new Date(f.recordedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'REMOVE_FINDING', toothNumber: selected, findingId: f.id })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ads-text-muted)', fontSize: '12px' }}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--ads-border-subtle)', paddingTop: '14px' }}>
        <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
          Add finding
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <DropdownList
            label="Type"
            options={allTypes}
            value={type}
            onChange={(v) => setType(v as RestorationType | ConditionType)}
            fullWidth
          />
          <div>
            <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-primary)', marginBottom: '4px' }}>Surfaces</div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {allSurfaces.map((s) => (
                <SecondaryButton key={s} size={36} selected={surfaces.includes(s)} onClick={() => toggleSurface(s)}>
                  {s}
                </SecondaryButton>
              ))}
            </div>
          </div>
          <PrimaryButton
            size={36}
            onClick={() => dispatch({ type: 'ADD_FINDING', finding: { toothNumber: selected, type, surfaces: surfaces.length > 0 ? surfaces : undefined } })}
          >
            Add finding to #{selected}
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}

function PerioTab({
  state,
  dispatch,
  summary,
}: {
  state: ChartingState;
  dispatch: React.Dispatch<ChartingAction>;
  summary: ReturnType<typeof summarizePerio>;
}) {
  const allTeeth = [...UPPER_RIGHT, ...UPPER_LEFT, ...LOWER_LEFT, ...LOWER_RIGHT];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 1fr)', gap: '16px' }}>
      <section
        style={{
          backgroundColor: 'var(--ads-bg-surface)',
          border: '1px solid var(--ads-border-subtle)',
          borderRadius: 'var(--ads-radius-sm)',
          padding: '20px',
          overflowX: 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--ads-font-mono, ui-monospace)', fontSize: '11px', minWidth: '1100px' }}>
          <thead>
            <tr>
              <th style={th()}>Tooth</th>
              {PERIO_SITE_ORDER.map((s) => (
                <th key={`d-${s}`} style={th()}>{PERIO_SITE_LABEL[s]}<br /><span style={{ fontWeight: 400, color: 'var(--ads-text-muted)' }}>depth</span></th>
              ))}
              <th style={th()}>Mob</th>
              <th style={th()}>BoP</th>
            </tr>
          </thead>
          <tbody>
            {allTeeth.map((t) => {
              const row = state.perio[t];
              return (
                <tr key={t}>
                  <td style={td()}><strong>{t}</strong></td>
                  {PERIO_SITE_ORDER.map((s) => {
                    const m = row?.sites[s];
                    const depth = m?.depth ?? 0;
                    const bop = m?.bop ?? false;
                    return (
                      <td key={s} style={{ ...td(), padding: 0 }}>
                        <input
                          type="number"
                          value={depth}
                          min={0}
                          max={12}
                          onChange={(e) => dispatch({
                            type: 'SET_PERIO_SITE',
                            toothNumber: t,
                            site: s,
                            patch: { depth: Math.max(0, Math.min(12, Number(e.target.value) || 0)) },
                          })}
                          style={{
                            width: '100%',
                            padding: '4px 6px',
                            textAlign: 'center',
                            border: 'none',
                            background: depthBg(depth),
                            color: depth >= 5 ? '#fff' : 'var(--ads-text-primary)',
                            fontFamily: 'inherit',
                            fontWeight: depth >= 5 ? 600 : 400,
                            outline: 'none',
                          }}
                          onFocus={(e) => (e.currentTarget.style.outline = '2px solid var(--ads-blue-500)')}
                          onBlur={(e) => (e.currentTarget.style.outline = 'none')}
                        />
                        {bop && (
                          <span style={{ display: 'block', height: 2, backgroundColor: 'var(--ads-text-error)' }} />
                        )}
                      </td>
                    );
                  })}
                  <td style={td()}>
                    <select
                      value={row?.mobility ?? 0}
                      onChange={(e) => dispatch({ type: 'SET_MOBILITY', toothNumber: t, mobility: Number(e.target.value) as 0 | 1 | 2 | 3 })}
                      style={{ border: 'none', background: 'none', fontFamily: 'inherit', fontSize: '11px', textAlign: 'center', width: '100%' }}
                    >
                      {[0, 1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </td>
                  <td style={td()}>
                    {row && Object.values(row.sites).filter((m) => m?.bop).length}/6
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <aside
        style={{
          backgroundColor: 'var(--ads-bg-surface)',
          border: '1px solid var(--ads-border-subtle)',
          borderRadius: 'var(--ads-radius-sm)',
          padding: '20px',
          height: 'fit-content',
          position: 'sticky',
          top: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '14px', color: 'var(--ads-text-primary)' }}>
          Perio summary
        </h3>
        <Stat label="Average depth" value={`${summary.averageDepth.toFixed(1)}mm`} tone="default" />
        <Stat label="Bleeding sites" value={`${summary.bopCount} (${Math.round(summary.bopPct * 100)}%)`} tone={summary.bopPct > 0.2 ? 'warning' : 'default'} />
        <Stat label="Pockets ≥ 5mm" value={String(summary.pocketsOver5)} tone={summary.pocketsOver5 > 5 ? 'warning' : 'default'} />
        <Stat label="Pockets ≥ 7mm" value={String(summary.pocketsOver7)} tone={summary.pocketsOver7 > 0 ? 'danger' : 'default'} />
        <Stat label="Recession sites" value={String(summary.recessionCount)} tone="default" />
        <div style={{ marginTop: '8px', padding: '10px 12px', backgroundColor: 'var(--ads-bg-page)', border: '1px solid var(--ads-border-subtle)', borderRadius: 'var(--ads-radius-sm)', fontFamily: 'var(--ads-font-sans)', fontSize: '11px', color: 'var(--ads-text-muted)', lineHeight: '15px' }}>
          Type a number 0–12 in any cell to log pocket depth. Depth ≥ 5mm tints orange; ≥ 7mm tints red. Click the bottom row of each cell to toggle bleeding-on-probing.
        </div>
      </aside>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: 'default' | 'warning' | 'danger' }) {
  const fg = tone === 'danger' ? 'var(--ads-danger-500)' : tone === 'warning' ? 'var(--ads-tag-orange-fg)' : 'var(--ads-text-primary)';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
      <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500, color: fg, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

function depthBg(depth: number): string {
  if (depth >= 7) return 'var(--ads-text-error)';
  if (depth >= 5) return 'var(--ads-text-warning)';
  if (depth >= 4) return 'var(--ads-background-highlight-orange)';
  return 'transparent';
}

function th(): React.CSSProperties {
  return {
    padding: '6px 4px',
    textAlign: 'center',
    borderBottom: '1px solid var(--ads-border-subtle)',
    backgroundColor: 'var(--ads-bg-page)',
    fontWeight: 600,
    color: 'var(--ads-text-primary)',
  };
}
function td(): React.CSSProperties {
  return {
    padding: 0,
    textAlign: 'center',
    borderBottom: '1px solid var(--ads-border-subtle)',
    borderRight: '1px solid var(--ads-border-subtle)',
  };
}
