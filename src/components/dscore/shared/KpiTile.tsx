import React from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import type { KpiValue } from '../data/types';

/**
 * KPI tile with label, big value, optional period-over-period delta, and
 * optional sparkline. Used by Jobs (4-tile strip) and Analytics (KpiRow).
 */
export interface KpiTileProps {
  kpi: KpiValue;
  /** Click handler enables drill-down behavior. */
  onClick?: () => void;
  /** Override delta-up color. Default: green for positive, red for negative. */
  invertDeltaSemantics?: boolean;
  tone?: 'default' | 'warning';
}

export function KpiTile({ kpi, onClick, invertDeltaSemantics, tone = 'default' }: KpiTileProps) {
  const interactive = !!onClick;
  const positiveIsGood = !invertDeltaSemantics;
  const deltaPositive = (kpi.delta ?? 0) > 0;
  const deltaIsGood = positiveIsGood ? deltaPositive : !deltaPositive;
  const deltaColor =
    kpi.delta == null ? 'var(--ads-text-muted)'
      : deltaIsGood ? 'var(--ads-success-600)'
      : 'var(--ads-danger-500)';
  const deltaArrow = kpi.delta == null ? '' : deltaPositive ? '▲' : '▼';
  const deltaText = kpi.delta == null ? '' : `${Math.abs(Math.round(kpi.delta * 100))}%`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      style={{
        flex: '1 1 0',
        textAlign: 'left',
        backgroundColor: tone === 'warning' ? 'var(--ads-tag-orange-bg)' : 'var(--ads-bg-surface)',
        border: `1px solid ${tone === 'warning' ? 'var(--ads-tag-orange-br)' : 'var(--ads-border-subtle)'}`,
        borderRadius: 'var(--ads-radius-sm)',
        padding: '16px 20px',
        cursor: interactive ? 'pointer' : 'default',
        font: 'inherit',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        transition: 'box-shadow var(--ads-duration-fast) var(--ads-ease-standard), border-color var(--ads-duration-fast) var(--ads-ease-standard)',
      }}
      onMouseEnter={(e) => {
        if (interactive) {
          e.currentTarget.style.boxShadow = 'var(--ads-shadow-sm)';
          e.currentTarget.style.borderColor = 'var(--ads-blue-500)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = tone === 'warning' ? 'var(--ads-tag-orange-br)' : 'var(--ads-border-subtle)';
      }}
    >
      <div
        style={{
          fontFamily: 'var(--ads-font-sans)',
          fontSize: '12px',
          lineHeight: '16px',
          color: 'var(--ads-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {kpi.label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
        <div
          style={{
            fontFamily: 'var(--ads-font-sans)',
            fontWeight: 500,
            fontSize: '28px',
            lineHeight: '32px',
            color: tone === 'warning' ? 'var(--ads-tag-orange-fg)' : 'var(--ads-text-primary)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {kpi.display}
        </div>
        {kpi.delta != null && (
          <span
            style={{
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '12px',
              fontWeight: 500,
              color: deltaColor,
            }}
          >
            {deltaArrow} {deltaText}
          </span>
        )}
      </div>
      {kpi.spark && kpi.spark.length > 1 && (
        <div style={{ height: '32px', marginTop: 'auto' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={kpi.spark.map((value, i) => ({ i, value }))}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--ads-blue-500)"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </button>
  );
}
