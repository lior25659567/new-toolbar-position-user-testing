import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { BreakdownSlice } from '../data/types';

export interface DonutBreakdownProps {
  data: BreakdownSlice[];
  /** When 'percent', tooltip + legend show % of total. Otherwise raw values. */
  mode?: 'absolute' | 'percent';
  height?: number;
}

const PALETTE = [
  'var(--ads-blue-500)',
  'var(--ads-tag-purple-fg)',
  'var(--ads-tag-orange-fg)',
  'var(--ads-tag-green-fg)',
  'var(--ads-tag-red-fg)',
  'var(--ads-tag-magenta-fg)',
];

export function DonutBreakdown({ data, mode = 'absolute', height = 240 }: DonutBreakdownProps) {
  const total = data.reduce((sum, s) => sum + s.value, 0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', height }}>
      <div style={{ width: height, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="60%"
              outerRadius="90%"
              paddingAngle={1.5}
              isAnimationActive={false}
            >
              {data.map((slice, i) => (
                <Cell key={slice.label} fill={slice.color || PALETTE[i % PALETTE.length]} stroke="var(--ads-bg-surface)" strokeWidth={1.5} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--ads-bg-surface)',
                border: '1px solid var(--ads-border-subtle)',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'var(--ads-font-sans)',
              }}
              formatter={(value: number, name: string) => {
                if (mode === 'percent' && total > 0) {
                  return [`${Math.round((value / total) * 100)}%`, name];
                }
                return [String(value), name];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {data.map((slice, i) => {
          const pct = total > 0 ? Math.round((slice.value / total) * 100) : 0;
          return (
            <li key={slice.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
              <span
                aria-hidden
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  backgroundColor: slice.color || PALETTE[i % PALETTE.length],
                  flexShrink: 0,
                }}
              />
              <span style={{ color: 'var(--ads-text-primary)', flex: 1 }}>{slice.label}</span>
              <span style={{ color: 'var(--ads-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                {mode === 'percent' ? `${pct}%` : slice.value}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
