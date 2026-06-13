import type {
  Job, TreatmentPlan, AnalyticsFiltersState, KpiValue, BreakdownSlice, TimeSeriesPoint,
} from '../data/types';
import { rollupPlan } from '../treatments/treatmentPlanRules';
import { isSlaRisk } from '../jobs/jobsAggregator';

/**
 * Analytics aggregators — pure functions only. No React, no reducer dispatch.
 * Each takes the raw datasets + filter state and returns derived metrics.
 * Memoize at the call site with useMemo.
 */

export function filterJobs(jobs: Job[], f: AnalyticsFiltersState): Job[] {
  const start = new Date(f.range.startISO).getTime();
  const end = new Date(f.range.endISO).getTime();
  return jobs.filter((j) => {
    const t = new Date(j.createdAt).getTime();
    if (t < start || t > end) return false;
    if (f.practitionerId !== 'all' && j.dentist.id !== f.practitionerId) return false;
    if (f.labId !== 'all' && j.lab.id !== f.labId) return false;
    return true;
  });
}

export function filterPlans(plans: TreatmentPlan[], f: AnalyticsFiltersState): TreatmentPlan[] {
  const start = new Date(f.range.startISO).getTime();
  const end = new Date(f.range.endISO).getTime();
  return plans.filter((p) => {
    const t = new Date(p.createdAt).getTime();
    return t >= start && t <= end;
  });
}

// ─── KPIs ────────────────────────────────────────────────────────────────────

export function buildKpis(jobs: Job[], plans: TreatmentPlan[]): KpiValue[] {
  // Revenue: sum of plan totals where status ∈ {accepted, in-progress, completed}
  let revenue = 0;
  for (const p of plans) {
    if (p.status === 'accepted' || p.status === 'in-progress' || p.status === 'completed') {
      revenue += rollupPlan(p).subtotal;
    }
  }

  const active = jobs.filter((j) => j.status !== 'delivered' && j.status !== 'cancelled').length;
  const shipped = jobs.filter((j) => j.shippedAt);
  const onTime = shipped.length === 0 ? 0
    : shipped.filter((j) => new Date(j.shippedAt!).getTime() <= new Date(j.dueDate).getTime()).length / shipped.length;
  const risk = jobs.filter(isSlaRisk).length;

  // Mock period-over-period delta: deterministic from values so the UI shows
  // movement without needing a second time-window dataset.
  const deltaFor = (n: number, hash: number) => {
    if (n === 0) return undefined;
    return ((hash * 7 + n * 13) % 30 - 12) / 100;  // -0.12 … +0.18
  };

  return [
    {
      label: 'Revenue',
      value: revenue,
      display: revenue >= 1000 ? `$${(revenue / 1000).toFixed(1)}k` : `$${revenue}`,
      delta: deltaFor(revenue, 1),
      spark: makeSpark(revenue, 8),
    },
    {
      label: 'Active cases',
      value: active,
      display: String(active),
      delta: deltaFor(active, 2),
      spark: makeSpark(active, 8),
    },
    {
      label: 'On-time rate',
      value: onTime,
      display: `${Math.round(onTime * 100)}%`,
      delta: deltaFor(Math.round(onTime * 100), 3),
      spark: makeSpark(Math.round(onTime * 100), 8),
    },
    {
      label: 'SLA risk',
      value: risk,
      display: String(risk),
      delta: deltaFor(risk, 4),
    },
  ];
}

function makeSpark(seed: number, n: number): number[] {
  const out: number[] = [];
  let v = (seed % 9) + 4;
  for (let i = 0; i < n; i++) {
    v = Math.max(1, v + ((i * 13 + seed * 7) % 7) - 3);
    out.push(v);
  }
  return out;
}

// ─── Time series ─────────────────────────────────────────────────────────────

export function revenueByWeek(plans: TreatmentPlan[], range: AnalyticsFiltersState['range']): TimeSeriesPoint[] {
  const start = new Date(range.startISO).getTime();
  const end = new Date(range.endISO).getTime();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const buckets: TimeSeriesPoint[] = [];
  for (let t = start, i = 0; t <= end; t += weekMs, i += 1) {
    buckets.push({ label: `W${i + 1}`, value: 0, iso: new Date(t).toISOString() });
  }
  if (buckets.length === 0) return buckets;
  for (const p of plans) {
    if (!(p.status === 'accepted' || p.status === 'in-progress' || p.status === 'completed')) continue;
    const t = new Date(p.acceptedAt ?? p.createdAt).getTime();
    if (t < start || t > end) continue;
    const idx = Math.min(buckets.length - 1, Math.floor((t - start) / weekMs));
    buckets[idx].value += rollupPlan(p).subtotal;
  }
  return buckets;
}

// ─── Breakdowns ──────────────────────────────────────────────────────────────

export function casesByCategory(jobs: Job[]): BreakdownSlice[] {
  const m = new Map<string, number>();
  for (const j of jobs) m.set(j.category, (m.get(j.category) ?? 0) + 1);
  return Array.from(m.entries()).map(([label, value]) => ({ label, value }));
}

export function topLabsByVolume(jobs: Job[]): BreakdownSlice[] {
  const m = new Map<string, number>();
  for (const j of jobs) m.set(j.lab.name, (m.get(j.lab.name) ?? 0) + 1);
  return Array.from(m.entries()).map(([label, value]) => ({ label, value }));
}

export function planFunnel(plans: TreatmentPlan[]): { label: string; count: number }[] {
  return [
    { label: 'Drafts',     count: plans.filter((p) => p.status === 'draft').length },
    { label: 'Presented',  count: plans.filter((p) => p.status === 'presented').length },
    { label: 'Accepted',   count: plans.filter((p) => ['accepted', 'in-progress', 'completed'].includes(p.status)).length },
    { label: 'Completed',  count: plans.filter((p) => p.status === 'completed').length },
  ];
}

// ─── Drill-down ──────────────────────────────────────────────────────────────

export function drillJobsForKpi(kpiLabel: string, jobs: Job[]): Job[] {
  switch (kpiLabel) {
    case 'Active cases': return jobs.filter((j) => j.status !== 'delivered' && j.status !== 'cancelled');
    case 'On-time rate': return jobs.filter((j) => j.shippedAt);
    case 'SLA risk':     return jobs.filter(isSlaRisk);
    default:             return jobs;
  }
}

// ─── Defaults ────────────────────────────────────────────────────────────────

export function defaultFilters(): AnalyticsFiltersState {
  // Last 90 days, no practitioner/lab filter
  const end = new Date();
  const start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);
  return {
    range: { startISO: start.toISOString(), endISO: end.toISOString() },
    practitionerId: 'all',
    labId: 'all',
  };
}
