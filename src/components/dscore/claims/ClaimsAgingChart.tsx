import React from 'react';
import { agingBuckets, type AgingBreakdown } from './claimsAggregator';
import { topDenialReasons } from './claimsAggregator';
import { DENIAL_REASONS, formatUSD, type AgingBucket, type InsuranceClaim } from './claimsState';

const BUCKET_TONE: Record<AgingBucket, { bg: string; fg: string; br: string }> = {
  '0-30':  { bg: 'var(--ads-tag-green-bg)',   fg: 'var(--ads-tag-green-fg)',   br: 'var(--ads-tag-green-br)'   },
  '31-60': { bg: 'var(--ads-tag-blue-bg)',    fg: 'var(--ads-tag-blue-fg)',    br: 'var(--ads-tag-blue-br)'    },
  '61-90': { bg: 'var(--ads-tag-orange-bg)',  fg: 'var(--ads-tag-orange-fg)',  br: 'var(--ads-tag-orange-br)'  },
  '90+':   { bg: 'var(--ads-tag-red-bg)',     fg: 'var(--ads-tag-red-fg)',     br: 'var(--ads-tag-red-br)'     },
};

export function ClaimsAgingChart({
  claims,
  onBucketClick,
}: {
  claims: InsuranceClaim[];
  onBucketClick?: (bucket: AgingBreakdown) => void;
}) {
  const buckets = React.useMemo(() => agingBuckets(claims), [claims]);
  const total = buckets.reduce((s, b) => s + b.amount, 0);
  const denials = React.useMemo(() => topDenialReasons(claims), [claims]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '16px' }}>
      <Card title="Outstanding A/R aging" subtitle={`${formatUSD(total)} across ${buckets.reduce((s, b) => s + b.count, 0)} claims`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {buckets.map((b) => {
            const tone = BUCKET_TONE[b.bucket];
            const pct = total === 0 ? 0 : (b.amount / total) * 100;
            return (
              <button
                key={b.bucket}
                type="button"
                onClick={onBucketClick ? () => onBucketClick(b) : undefined}
                disabled={!onBucketClick || b.count === 0}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  padding: '10px 12px',
                  border: `1px solid ${tone.br}`,
                  backgroundColor: tone.bg,
                  borderRadius: 'var(--ads-radius-sm)',
                  cursor: onBucketClick && b.count > 0 ? 'pointer' : 'default',
                  textAlign: 'left',
                  font: 'inherit',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '13px', color: tone.fg }}>
                    {b.label}
                  </span>
                  <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: tone.fg, fontVariantNumeric: 'tabular-nums' }}>
                    {formatUSD(b.amount)} <span style={{ color: 'var(--ads-text-muted)' }}>· {b.count} claim{b.count === 1 ? '' : 's'}</span>
                  </span>
                </div>
                <div
                  style={{
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: 'var(--ads-bg-surface)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      backgroundColor: tone.fg,
                      transition: 'width var(--ads-duration-fast) var(--ads-ease-standard)',
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="Top denial reasons" subtitle="By count, all-time">
        {denials.length === 0 ? (
          <div style={{ padding: '24px 0', color: 'var(--ads-text-muted)', fontFamily: 'var(--ads-font-sans)', fontSize: '13px' }}>
            No denials on record. 🎉
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {denials.map((d) => {
              const meta = DENIAL_REASONS.find((x) => x.code === d.code);
              return (
                <div key={d.code} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--ads-font-mono, ui-monospace)', fontSize: '12px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>
                      {d.code}
                    </span>
                    <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                      {d.count} · {formatUSD(d.amount)}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)', lineHeight: '16px' }}>
                    {meta?.short ?? '—'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
        padding: '20px 24px',
      }}
    >
      <header style={{ marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '15px', color: 'var(--ads-text-primary)' }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ margin: '4px 0 0', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
            {subtitle}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}
