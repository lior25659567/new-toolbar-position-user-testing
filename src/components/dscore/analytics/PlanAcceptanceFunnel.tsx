import React from 'react';

export function PlanAcceptanceFunnel({ stages }: { stages: { label: string; count: number }[] }) {
  const max = Math.max(1, ...stages.map((s) => s.count));
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {stages.map((s, i) => {
        const pct = (s.count / max) * 100;
        const colorTint =
          i === 0 ? 'var(--ads-bg-muted)' :
          i === 1 ? 'var(--ads-tag-blue-bg)' :
          i === 2 ? 'var(--ads-tag-green-bg)' :
          'var(--ads-tag-purple-bg)';
        const colorBar =
          i === 0 ? 'var(--ads-text-muted)' :
          i === 1 ? 'var(--ads-blue-500)' :
          i === 2 ? 'var(--ads-success-600)' :
          'var(--ads-tag-purple-fg)';
        return (
          <li key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '120px', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', color: 'var(--ads-text-primary)' }}>
              {s.label}
            </div>
            <div style={{ flex: 1, position: 'relative', height: '24px', borderRadius: 'var(--ads-radius-sm)', backgroundColor: colorTint, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  backgroundColor: colorBar,
                  borderRadius: 'var(--ads-radius-sm)',
                  transition: 'width var(--ads-duration-base) var(--ads-ease-standard)',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '12px',
                  fontFamily: 'var(--ads-font-sans)',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: pct > 50 ? '#fff' : 'var(--ads-text-primary)',
                  fontVariantNumeric: 'tabular-nums',
                  pointerEvents: 'none',
                }}
              >
                {s.count}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
