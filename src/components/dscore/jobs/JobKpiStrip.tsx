import React from 'react';
import { KpiTile } from '../shared/KpiTile';
import { buildJobKpis } from './jobsAggregator';
import type { Job } from '../data/types';

export function JobKpiStrip({
  jobs,
  onSlaRiskClick,
}: {
  jobs: Job[];
  onSlaRiskClick?: () => void;
}) {
  const kpis = buildJobKpis(jobs);
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
      <KpiTile kpi={kpis[0]} />
      <KpiTile kpi={kpis[1]} invertDeltaSemantics />
      <KpiTile kpi={kpis[2]} />
      <KpiTile kpi={kpis[3]} onClick={onSlaRiskClick} tone={kpis[3].value > 0 ? 'warning' : 'default'} invertDeltaSemantics />
    </div>
  );
}
