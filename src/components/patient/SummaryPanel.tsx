import React, { useState } from 'react';

export interface SummaryItemData {
  id: string;
  label: string;
  value: string | null;
  subValue?: string;
  badge?: React.ReactNode;
}

interface SummaryPanelProps {
  title: string;
  patientName: string;
  patientSubtitle?: string;
  items: SummaryItemData[];
  activeId?: string;
  /** When provided, each item becomes a clickable row that jumps to that field. */
  onItemClick?: (id: string) => void;
  /** Optional content rendered pinned at the bottom (e.g. a status note). */
  footer?: React.ReactNode;
}

export function SummaryPanel({
  title,
  patientName,
  patientSubtitle = 'Patient',
  items,
  activeId,
  onItemClick,
  footer,
}: SummaryPanelProps) {
  const completed = items.filter((i) => !!i.value).length;
  const total = items.length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const monogram = patientName
    .split(/[ ,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('') || 'P';

  return (
    <aside
      style={{
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
        borderRadius: 'var(--ads-radius-md)',
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.04)',
        fontFamily: 'var(--ads-font-sans)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 560,
        overflow: 'hidden',
      }}
    >
      {/* Header — title + completion progress */}
      <header
        style={{
          padding: '16px 18px 14px',
          borderBottom: '1px solid var(--ads-border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <h4
            style={{
              margin: 0,
              fontSize: 17,
              lineHeight: '24px',
              fontWeight: 500,
              color: 'var(--ads-text-primary)',
              letterSpacing: '-0.015em',
            }}
          >
            {title}
          </h4>
          <span style={{ fontSize: 12, color: 'var(--ads-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {completed}/{total} <span style={{ opacity: 0.7 }}>complete</span>
          </span>
        </div>
        <div
          aria-hidden
          style={{
            marginTop: 10,
            height: 4,
            borderRadius: 'var(--ads-radius-full)',
            backgroundColor: 'var(--ads-bg-muted)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              backgroundColor: 'var(--ads-blue-500)',
              borderRadius: 'var(--ads-radius-full)',
              transition: 'width var(--ads-duration-base) var(--ads-ease-standard)',
            }}
          />
        </div>
      </header>

      {/* Patient mini-card */}
      <div
        style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid var(--ads-border-subtle)',
          backgroundColor: 'var(--ads-bg-surface)',
        }}
      >
        <span
          aria-hidden
          style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--ads-radius-full)',
            backgroundColor: 'color-mix(in srgb, var(--ads-blue-500) 12%, transparent)',
            color: 'var(--ads-blue-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          {monogram}
        </span>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--ads-text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {patientName}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ads-text-muted)', marginTop: 1 }}>{patientSubtitle}</div>
        </div>
      </div>

      {/* Scrollable item list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 6px 8px' }}>
        {items.map((item, i) => (
          <SummaryRow
            key={item.id}
            data={item}
            active={activeId === item.id}
            isLast={i === items.length - 1}
            onClick={onItemClick ? () => onItemClick(item.id) : undefined}
          />
        ))}
      </div>

      {/* Optional footer (status note, totals, etc.) */}
      {footer && (
        <div
          style={{
            padding: '12px 18px 14px',
            borderTop: '1px solid var(--ads-border-subtle)',
            backgroundColor: 'var(--ads-bg-surface)',
          }}
        >
          {footer}
        </div>
      )}
    </aside>
  );
}

function SummaryRow({
  data,
  active,
  isLast,
  onClick,
}: {
  data: SummaryItemData;
  active?: boolean;
  isLast?: boolean;
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);
  const filled = !!data.value;
  const interactive = !!onClick;

  const innerContent = (
    <>
      {/* Active accent bar (left edge) */}
      {active && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: 6,
            top: 10,
            bottom: 10,
            width: 3,
            borderRadius: 'var(--ads-radius-xs)',
            backgroundColor: 'var(--ads-blue-500)',
          }}
        />
      )}

      {/* Status dot */}
      <span
        aria-hidden
        style={{
          marginTop: 4,
          width: 14,
          height: 14,
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: filled ? 'var(--ads-blue-500)' : 'transparent',
          border: filled
            ? '1px solid var(--ads-blue-500)'
            : `1px dashed ${active ? 'var(--ads-blue-500)' : 'var(--ads-border-default)'}`,
          flexShrink: 0,
        }}
      >
        {filled && (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1.5 4.2 L3.2 5.8 L6.5 2.2" />
          </svg>
        )}
      </span>

      {/* Label + value */}
      <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span
          style={{
            fontSize: 11,
            color: 'var(--ads-text-muted)',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {data.label}
        </span>
        <span
          style={{
            fontSize: 13,
            lineHeight: '18px',
            fontWeight: filled ? 500 : 400,
            color: filled ? 'var(--ads-text-primary)' : 'var(--ads-text-muted)',
            fontStyle: filled ? 'normal' : 'italic',
            wordBreak: 'break-word',
          }}
        >
          {data.value ?? 'Not selected'}
        </span>
        {data.badge && <span style={{ marginTop: 4 }}>{data.badge}</span>}
        {data.subValue && (
          <span style={{ fontSize: 11, color: 'var(--ads-text-muted)', marginTop: 1 }}>
            {data.subValue}
          </span>
        )}
      </span>

      {/* Edit affordance — only when interactive */}
      {interactive && (
        <span
          aria-hidden
          style={{
            marginTop: 4,
            color: active ? 'var(--ads-blue-500)' : 'var(--ads-text-muted)',
            opacity: active ? 1 : hover ? 0.85 : 0,
            transform: hover || active ? 'translateX(0)' : 'translateX(-4px)',
            transition:
              'opacity var(--ads-duration-fast) var(--ads-ease-standard), transform var(--ads-duration-fast) var(--ads-ease-standard)',
            display: 'inline-flex',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="5 3 9 7 5 11" />
          </svg>
        </span>
      )}
    </>
  );

  const baseStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    textAlign: 'left',
    padding: '10px 14px 10px 18px',
    borderRadius: 'var(--ads-radius-md)',
    marginBottom: isLast ? 0 : 2,
    fontFamily: 'inherit',
    display: 'grid',
    gridTemplateColumns: interactive ? '14px 1fr auto' : '14px 1fr',
    columnGap: 10,
    rowGap: 2,
    alignItems: 'start',
    transition: 'background-color var(--ads-duration-fast) var(--ads-ease-standard)',
    backgroundColor: active
      ? 'color-mix(in srgb, var(--ads-blue-500) 6%, transparent)'
      : interactive && hover
      ? 'var(--ads-bg-muted)'
      : 'transparent',
  };

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ ...baseStyle, border: 'none', cursor: 'pointer' }}
      >
        {innerContent}
      </button>
    );
  }
  return <div style={baseStyle}>{innerContent}</div>;
}
