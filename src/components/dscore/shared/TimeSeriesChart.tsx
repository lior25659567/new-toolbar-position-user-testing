import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import type { TimeSeriesPoint } from '../data/types';

export interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  /** Optional Y-axis prefix for tooltip values, e.g. "$". */
  valuePrefix?: string;
  /** Optional Y-axis suffix, e.g. "%". */
  valueSuffix?: string;
  height?: number;
}

export function TimeSeriesChart({ data, valuePrefix = '', valueSuffix = '', height = 240 }: TimeSeriesChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--ads-border-subtle)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="var(--ads-text-muted)"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'var(--ads-border-subtle)' }}
          />
          <YAxis
            stroke="var(--ads-text-muted)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${valuePrefix}${formatCompact(v)}${valueSuffix}`}
            width={48}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--ads-bg-surface)',
              border: '1px solid var(--ads-border-subtle)',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'var(--ads-font-sans)',
            }}
            formatter={(value) => [`${valuePrefix}${value}${valueSuffix}`, '']}
            labelFormatter={(label) => label}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--ads-blue-500)"
            strokeWidth={2}
            dot={{ r: 3, fill: 'var(--ads-blue-500)' }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'k';
  return String(n);
}
