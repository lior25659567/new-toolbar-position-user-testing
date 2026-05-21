import React from 'react';
import { KpiTile } from '../shared/KpiTile';
import { buildScheduleKpis } from './scheduleAggregator';
import type { Appointment } from './scheduleState';

export function ScheduleKpiStrip({
  appointments,
  dateISO,
}: {
  appointments: Appointment[];
  dateISO: string;
}) {
  const kpis = React.useMemo(() => buildScheduleKpis(appointments, dateISO), [appointments, dateISO]);
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
      {kpis.map((k) => (
        <KpiTile
          key={k.label}
          kpi={k}
          tone={(k.label === 'Conflicts' && k.value > 0) || (k.label === 'No-shows' && k.value > 0) ? 'warning' : 'default'}
          invertDeltaSemantics={k.label === 'No-shows' || k.label === 'Conflicts'}
        />
      ))}
    </div>
  );
}
