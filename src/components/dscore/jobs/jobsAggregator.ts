import type { Job, JobStatus, JobsFiltersState, KpiValue, BreakdownSlice } from '../data/types';

const SLA_RISK_DAYS = 2; // due within 2 days and not yet shipping/delivered

/**
 * Apply user filters to a list of jobs. Pure function — re-runs on every render
 * but cheap because all checks are O(jobs).
 */
export function applyFilters(jobs: Job[], filters: JobsFiltersState): Job[] {
  const term = filters.search.trim().toLowerCase();
  return jobs.filter((j) => {
    if (term) {
      const hay = `${j.patient.name} ${j.service} ${j.lab.name} ${j.dentist.name}`.toLowerCase();
      if (!hay.includes(term)) return false;
    }
    if (filters.status !== 'all' && j.status !== filters.status) return false;
    if (filters.labId !== 'all' && j.lab.id !== filters.labId) return false;
    if (filters.category !== 'all' && j.category !== filters.category) return false;
    if (filters.priority !== 'all' && j.priority !== filters.priority) return false;
    if (filters.slaRiskOnly && !isSlaRisk(j)) return false;
    return true;
  });
}

export function isSlaRisk(job: Job): boolean {
  if (job.status === 'delivered' || job.status === 'shipping' || job.status === 'cancelled') return false;
  const now = Date.now();
  const due = new Date(job.dueDate).getTime();
  const days = (due - now) / (24 * 60 * 60 * 1000);
  return days < SLA_RISK_DAYS;
}

export function countByStatus(jobs: Job[]): Record<JobStatus, number> {
  const out: Record<JobStatus, number> = {
    'new': 0, 'in-design': 0, 'in-production': 0, 'quality-check': 0,
    'shipping': 0, 'delivered': 0, 'changes-requested': 0, 'cancelled': 0,
  };
  for (const j of jobs) out[j.status] += 1;
  return out;
}

export function countActive(jobs: Job[]): number {
  return jobs.filter((j) => j.status !== 'delivered' && j.status !== 'cancelled').length;
}

export function avgTurnaroundDays(jobs: Job[]): number {
  const finished = jobs.filter((j) => j.shippedAt);
  if (finished.length === 0) return 0;
  const sum = finished.reduce((s, j) => {
    const ms = new Date(j.shippedAt!).getTime() - new Date(j.createdAt).getTime();
    return s + ms / (24 * 60 * 60 * 1000);
  }, 0);
  return Number((sum / finished.length).toFixed(1));
}

export function onTimeRate(jobs: Job[]): number {
  const shipped = jobs.filter((j) => j.shippedAt);
  if (shipped.length === 0) return 0;
  const onTime = shipped.filter((j) => new Date(j.shippedAt!).getTime() <= new Date(j.dueDate).getTime()).length;
  return onTime / shipped.length;
}

export function slaRiskCount(jobs: Job[]): number {
  return jobs.filter(isSlaRisk).length;
}

/**
 * Compose the four KPI tiles shown above the kanban board.
 */
export function buildJobKpis(jobs: Job[]): KpiValue[] {
  const active = countActive(jobs);
  const avg = avgTurnaroundDays(jobs);
  const onTime = onTimeRate(jobs);
  const risk = slaRiskCount(jobs);
  return [
    { label: 'Active cases', value: active, display: String(active), spark: makeSpark(jobs.length, 8) },
    { label: 'Avg turnaround', value: avg, display: `${avg}d`, spark: makeSpark(jobs.length, 6) },
    { label: 'On-time rate', value: onTime, display: `${Math.round(onTime * 100)}%`, spark: makeSpark(jobs.length, 4) },
    { label: 'SLA risk', value: risk, display: String(risk) },
  ];
}

/** Cheap deterministic mock sparkline derived from list size — placeholder until real history exists. */
function makeSpark(seed: number, n: number): number[] {
  const out: number[] = [];
  let v = (seed % 7) + 3;
  for (let i = 0; i < n; i++) {
    v = Math.max(1, v + ((i * 31 + seed * 17) % 5) - 2);
    out.push(v);
  }
  return out;
}

export function jobsByLabBreakdown(jobs: Job[]): BreakdownSlice[] {
  const counts = new Map<string, number>();
  for (const j of jobs) counts.set(j.lab.name, (counts.get(j.lab.name) ?? 0) + 1);
  return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
}

export function jobsByCategoryBreakdown(jobs: Job[]): BreakdownSlice[] {
  const counts = new Map<string, number>();
  for (const j of jobs) counts.set(j.category, (counts.get(j.category) ?? 0) + 1);
  return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
}
