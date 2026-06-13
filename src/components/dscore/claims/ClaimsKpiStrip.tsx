import React from 'react';
import { KpiTile } from '../shared/KpiTile';
import { buildClaimKpis } from './claimsAggregator';
import type { InsuranceClaim } from './claimsState';

export function ClaimsKpiStrip({
  claims,
  onAR90Click,
}: {
  claims: InsuranceClaim[];
  onAR90Click?: () => void;
}) {
  const kpis = React.useMemo(() => buildClaimKpis(claims), [claims]);
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
      {kpis.map((k) => (
        <KpiTile
          key={k.label}
          kpi={k}
          tone={k.label === 'A/R > 90 days' && k.value > 0 ? 'warning' : 'default'}
          onClick={k.label === 'A/R > 90 days' ? onAR90Click : undefined}
          invertDeltaSemantics={k.label === 'A/R > 90 days' || k.label === 'Denial rate' || k.label === 'Avg days to pay' || k.label === 'Total A/R'}
        />
      ))}
    </div>
  );
}
