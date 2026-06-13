import React from 'react';
import type { BreakdownSlice } from '../data/types';

export interface BarRankingProps {
  data: BreakdownSlice[];
  /** When set, only show top N (sorted desc by value). */
  limit?: number;
  valuePrefix?: string;
  valueSuffix?: string;
}

/**
 * Horizontal bar list — sorted descending. Custom DOM (not recharts) so
 * the rows are crisp with ADS spacing and readable on dense pages.
 */
export function BarRanking({ data, limit = 5, valuePrefix = '', valueSuffix = '' }: BarRankingProps) {
  const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, limit);
  const max = sorted[0]?.value ?? 0;

  if (sorted.length === 0) {
    return (
      <div style={{ padding: '24px 0', color: 'var(--ads-text-muted)', fontSize: '13px', textAlign: 'center' }}>
        No data.
      </div>
    );
  }

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {sorted.map((row) => {
        const widthPct = max > 0 ? (row.value / max) * 100 : 0;
        return (
          <li key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '120px',
                fontFamily: 'var(--ads-font-sans)',
                fontSize: '13px',
                color: 'var(--ads-text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={row.label}
            >
              {row.label}
            </div>
            <div
              style={{
                flex: 1,
                height: '8px',
                borderRadius: '4px',
                backgroundColor: 'var(--ads-bg-muted)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${widthPct}%`,
                  height: '100%',
                  backgroundColor: row.color || 'var(--ads-blue-500)',
                  borderRadius: '4px',
                  transition: 'width var(--ads-duration-base) var(--ads-ease-standard)',
                }}
              />
            </div>
            <div
              style={{
                width: '56px',
                textAlign: 'right',
                fontFamily: 'var(--ads-font-sans)',
                fontSize: '13px',
                color: 'var(--ads-text-primary)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {valuePrefix}{row.value}{valueSuffix}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
