// Pure aggregation functions for the Claims page. Memoize from React with useMemo.

import {
  type ClaimsFiltersState,
  type InsuranceClaim,
  type AgingBucket,
  bucketFor,
  claimAgeDays,
  claimOutstanding,
  claimTotalPaid,
  claimTotalBilled,
  OUTSTANDING_STATUSES,
} from './claimsState';
import type { KpiValue } from '../data/types';

export function applyClaimFilters(claims: InsuranceClaim[], f: ClaimsFiltersState): InsuranceClaim[] {
  const q = f.search.trim().toLowerCase();
  return claims.filter((c) => {
    if (f.status !== 'all' && c.status !== f.status) return false;
    if (f.payerId !== 'all' && c.payer.id !== f.payerId) return false;
    if (f.agingBucket !== 'all') {
      if (!OUTSTANDING_STATUSES.includes(c.status)) return false;
      if (bucketFor(claimAgeDays(c)) !== f.agingBucket) return false;
    }
    if (q) {
      const blob = `${c.claimNumber} ${c.patient.name} ${c.payer.name} ${c.dentist.name}`.toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });
}

export interface AgingBreakdown {
  bucket: AgingBucket;
  label: string;
  count: number;
  amount: number;
  /** Claims contributing to this bucket — used for drill-down. */
  claimIds: string[];
}

export function agingBuckets(claims: InsuranceClaim[]): AgingBreakdown[] {
  const buckets: AgingBucket[] = ['0-30', '31-60', '61-90', '90+'];
  const labels: Record<AgingBucket, string> = {
    '0-30':  '0–30 days',
    '31-60': '31–60 days',
    '61-90': '61–90 days',
    '90+':   '90+ days',
  };
  const out = buckets.map<AgingBreakdown>((b) => ({
    bucket: b, label: labels[b], count: 0, amount: 0, claimIds: [],
  }));
  for (const c of claims) {
    if (!OUTSTANDING_STATUSES.includes(c.status)) continue;
    const b = bucketFor(claimAgeDays(c));
    const tgt = out.find((x) => x.bucket === b)!;
    tgt.count += 1;
    tgt.amount += claimOutstanding(c);
    tgt.claimIds.push(c.id);
  }
  return out;
}

/** KPI tiles for the strip at the top of the page. */
export function buildClaimKpis(claims: InsuranceClaim[]): KpiValue[] {
  const outstanding = claims.filter((c) => OUTSTANDING_STATUSES.includes(c.status));
  const totalAR = outstanding.reduce((s, c) => s + claimOutstanding(c), 0);

  const over90 = outstanding.filter((c) => claimAgeDays(c) > 90).reduce((s, c) => s + claimOutstanding(c), 0);

  // First-pass: claims that went straight from in-review → paid without a denial event.
  const adjudicated = claims.filter((c) => ['paid', 'partial', 'denied', 'patient-paid', 'written-off'].includes(c.status));
  const noDenialEver = adjudicated.filter((c) => !c.denialReasonCode);
  const firstPassRate = adjudicated.length === 0 ? 0 : noDenialEver.length / adjudicated.length;

  // Avg days to payment: claims with payments, avg(submit → first payment)
  const paid = claims.filter((c) => c.payments.length > 0 && c.dateSubmitted);
  const avgDays = paid.length === 0
    ? 0
    : paid.reduce((s, c) => {
        const sub = new Date(c.dateSubmitted!).getTime();
        const pay = new Date(c.payments[0].postedAt).getTime();
        return s + Math.max(0, (pay - sub) / (1000 * 60 * 60 * 24));
      }, 0) / paid.length;

  const denialRate = adjudicated.length === 0 ? 0 : adjudicated.filter((c) => c.denialReasonCode).length / adjudicated.length;

  return [
    {
      label: 'Total A/R',
      value: totalAR,
      display: usd(totalAR),
      delta: -0.04,
      spark: sparkOver(claims, 'ar'),
    },
    {
      label: 'A/R > 90 days',
      value: over90,
      display: usd(over90),
      delta: 0.08,
      spark: sparkOver(claims, 'ar90'),
    },
    {
      label: 'First-pass rate',
      value: firstPassRate,
      display: pct(firstPassRate),
      delta: 0.02,
    },
    {
      label: 'Denial rate',
      value: denialRate,
      display: pct(denialRate),
      delta: -0.01,
    },
    {
      label: 'Avg days to pay',
      value: avgDays,
      display: `${Math.round(avgDays)}d`,
      delta: -0.06,
    },
  ];
}

/** Top denial reasons grouped by reason code. */
export function topDenialReasons(claims: InsuranceClaim[]): { code: string; count: number; amount: number }[] {
  const map = new Map<string, { code: string; count: number; amount: number }>();
  for (const c of claims) {
    if (!c.denialReasonCode) continue;
    const key = c.denialReasonCode;
    const cur = map.get(key) ?? { code: key, count: 0, amount: 0 };
    cur.count += 1;
    cur.amount += claimTotalBilled(c) - claimTotalPaid(c);
    map.set(key, cur);
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

function usd(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

/** Faked sparkline trend so KPI tiles get a visual. */
function sparkOver(_claims: InsuranceClaim[], kind: 'ar' | 'ar90'): number[] {
  if (kind === 'ar') return [42, 44, 41, 47, 46, 49, 48, 47, 45, 44, 43, 42];
  return [12, 13, 14, 13, 15, 16, 17, 16, 18, 19, 17, 16];
}
