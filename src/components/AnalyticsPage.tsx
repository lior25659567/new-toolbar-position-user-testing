import React, { useMemo, useState } from 'react';
import { Tabs } from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';
import { SEED_JOBS } from './dscore/data/jobs';
import { SEED_PLANS } from './dscore/data/plans';
import {
  buildKpis, casesByCategory, defaultFilters, drillJobsForKpi,
  filterJobs, filterPlans, planFunnel, revenueByWeek, topLabsByVolume,
} from './dscore/analytics/analyticsAggregator';
import { AnalyticsFilters } from './dscore/analytics/AnalyticsFilters';
import { PlanAcceptanceFunnel } from './dscore/analytics/PlanAcceptanceFunnel';
import { DrillDownPanel } from './dscore/analytics/DrillDownPanel';
import { KpiTile } from './dscore/shared/KpiTile';
import { TimeSeriesChart } from './dscore/shared/TimeSeriesChart';
import { DonutBreakdown } from './dscore/shared/DonutBreakdown';
import { BarRanking } from './dscore/shared/BarRanking';
import type { Job } from './dscore/data/types';

interface AnalyticsPageProps {
  onBackToHome?: () => void;
  onNavigate?: (id: DSCoreNavId) => void;
  /** Jobs created from accepted plans should appear here too. */
  externalJobs?: Job[];
}

export default function AnalyticsPage({ onBackToHome, onNavigate, externalJobs }: AnalyticsPageProps) {
  const [filters, setFilters] = useState(defaultFilters());
  const [donutMode, setDonutMode] = useState<'absolute' | 'percent'>('absolute');
  const [drill, setDrill] = useState<{ label: string; jobs: Job[] } | null>(null);

  const allJobs = useMemo(() => [...(externalJobs ?? []), ...SEED_JOBS], [externalJobs]);
  const filteredJobs = useMemo(() => filterJobs(allJobs, filters), [allJobs, filters]);
  const filteredPlans = useMemo(() => filterPlans(SEED_PLANS, filters), [filters]);

  const kpis = useMemo(() => buildKpis(filteredJobs, filteredPlans), [filteredJobs, filteredPlans]);
  const revenueSeries = useMemo(() => revenueByWeek(filteredPlans, filters.range), [filteredPlans, filters.range]);
  const categoryBreakdown = useMemo(() => casesByCategory(filteredJobs), [filteredJobs]);
  const labRanking = useMemo(() => topLabsByVolume(filteredJobs), [filteredJobs]);
  const funnel = useMemo(() => planFunnel(filteredPlans), [filteredPlans]);

  const onKpiClick = (label: string) => {
    setDrill({ label, jobs: drillJobsForKpi(label, filteredJobs) });
  };

  return (
    <DSCoreShell
      active="treatments"
      unread={1}
      onNavigate={(id) => {
        if (id === 'home' && onBackToHome) onBackToHome();
        else onNavigate?.(id);
      }}
    >
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '32px 40px 80px' }}>
        <header style={{ marginBottom: '20px' }}>
          <h1
            style={{
              fontFamily: 'var(--ads-font-sans)',
              fontWeight: 500,
              fontSize: '28px',
              lineHeight: '36px',
              letterSpacing: '-0.01em',
              color: 'var(--ads-text-primary)',
              margin: 0,
            }}
          >
            Analytics
          </h1>
          <p
            style={{
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '14px',
              lineHeight: '20px',
              color: 'var(--ads-text-muted)',
              margin: '6px 0 0',
            }}
          >
            Practice-wide performance across jobs and treatment plans. Click any tile to drill in.
          </p>
        </header>

        <AnalyticsFilters filters={filters} onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))} />

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          {kpis.map((k) => (
            <KpiTile
              key={k.label}
              kpi={k}
              onClick={k.label === 'Active cases' || k.label === 'On-time rate' || k.label === 'SLA risk' ? () => onKpiClick(k.label) : undefined}
              tone={k.label === 'SLA risk' && k.value > 0 ? 'warning' : 'default'}
              invertDeltaSemantics={k.label === 'SLA risk'}
            />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '16px', marginBottom: '16px' }}>
          <ChartCard title="Revenue by week" subtitle="Sum of accepted-plan totals, bucketed weekly.">
            <TimeSeriesChart data={revenueSeries} valuePrefix="$" />
          </ChartCard>
          <ChartCard title="Top labs by volume" subtitle="Cases per lab in the selected range.">
            <BarRanking data={labRanking} limit={5} />
          </ChartCard>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px' }}>
          <ChartCard
            title="Cases by category"
            subtitle="Restorative / Orthodontics / Implantology / Appliance."
            headerExtra={
              <Tabs
                items={[
                  { id: 'absolute', label: 'Count' },
                  { id: 'percent',  label: 'Percent' },
                ]}
                activeId={donutMode}
                onChange={(id) => setDonutMode(id as 'absolute' | 'percent')}
                style={{ marginBottom: 0 }}
              />
            }
          >
            <DonutBreakdown data={categoryBreakdown} mode={donutMode} />
          </ChartCard>
          <ChartCard title="Plan acceptance funnel" subtitle="From draft to completed treatment plans.">
            <PlanAcceptanceFunnel stages={funnel} />
          </ChartCard>
        </div>
      </div>

      <DrillDownPanel
        open={drill !== null}
        onClose={() => setDrill(null)}
        title={drill?.label ?? ''}
        jobs={drill?.jobs ?? []}
      />
    </DSCoreShell>
  );
}

function ChartCard({
  title,
  subtitle,
  headerExtra,
  children,
}: {
  title: string;
  subtitle?: string;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '15px', color: 'var(--ads-text-primary)' }}>
            {title}
          </h3>
          {subtitle && (
            <p style={{ margin: '4px 0 0', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {headerExtra}
      </header>
      <div>{children}</div>
    </section>
  );
}
