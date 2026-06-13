import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { X } from 'lucide-react';

// Data produced by ReportWorkflowView for each node. The view does all the
// type-specific mapping (icon, tint, preview); this just renders a card that
// matches the report's block cards using design-system tokens.
export interface WorkflowNodeData {
  kind: 'start' | 'end' | 'block';
  tint: { bg: string; fg: string };
  icon: React.ReactNode;
  title: string;
  badge?: string;
  lines?: string[];
  thumb?: string | null;
  thumbB?: string | null;
  index?: number;
  onOpen?: () => void;
  onRemove?: () => void;
}

const handleStyle: React.CSSProperties = {
  width: 7,
  height: 7,
  background: 'var(--ads-border-accent, #c7ccd4)',
  border: '1.5px solid var(--ads-bg-surface, #fff)',
};

function Thumb({ src }: { src: string | null | undefined }) {
  return (
    <div
      style={{
        flex: 1,
        aspectRatio: '4 / 3',
        borderRadius: 'var(--ads-radius-sm, 8px)',
        overflow: 'hidden',
        background: 'var(--ads-background-subtle-01, #f4f5f7)',
        border: '1px solid var(--ads-border-subtle, #e5e7eb)',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {src ? (
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ads-text-muted, #9aa0a8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="1.6" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      )}
    </div>
  );
}

export function ReportWorkflowNode({ data }: { data: WorkflowNodeData }) {
  const { kind, tint, icon, title, badge, lines, thumb, thumbB, index, onOpen, onRemove } = data;
  const hasThumb = thumb !== undefined || thumbB !== undefined;
  const hasBody = hasThumb || (lines && lines.length > 0);
  const isTerminal = kind !== 'block';

  return (
    <div
      onClick={onOpen}
      className={onOpen ? 'nopan' : undefined}
      style={{
        width: 256,
        borderRadius: 'var(--ads-radius-md, 12px)',
        background: 'var(--ads-bg-surface, #ffffff)',
        border: `1px solid ${isTerminal ? tint.fg : 'var(--ads-border-subtle, #e6e8ec)'}`,
        boxShadow: '0 8px 22px -12px rgba(15,23,42,0.22), 0 1px 2px rgba(15,23,42,0.05)',
        overflow: 'hidden',
        fontFamily: 'var(--ads-font-sans)',
        cursor: onOpen ? 'pointer' : 'default',
      }}
    >
      <div style={{ height: 3, background: tint.fg }} />

      {kind !== 'start' && <Handle type="target" position={Position.Top} style={handleStyle} />}
      {kind !== 'end' && <Handle type="source" position={Position.Bottom} style={handleStyle} />}

      {/* header — mirrors a report block-card header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '11px 12px',
          borderBottom: hasBody ? '1px solid var(--ads-border-subtle, #eef0f3)' : 'none',
        }}
      >
        <span
          aria-hidden
          style={{
            width: 30,
            height: 30,
            borderRadius: 'var(--ads-radius-sm, 8px)',
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            background: tint.bg,
            color: tint.fg,
          }}
        >
          {icon}
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0, gap: 1 }}>
          <span
            style={{
              fontSize: 'var(--tp-body-01-size, 14px)',
              fontWeight: 600,
              color: 'var(--ads-text-primary, #14181f)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </span>
          {badge && <span style={{ fontSize: 11, fontWeight: 500, color: tint.fg, whiteSpace: 'nowrap' }}>{badge}</span>}
        </span>

        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {typeof index === 'number' && (
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ads-text-muted, #9aa0a8)', fontVariantNumeric: 'tabular-nums' }}>
              {String(index).padStart(2, '0')}
            </span>
          )}
          {onRemove && (
            <button
              type="button"
              aria-label="Remove block"
              className="nodrag nopan"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              style={{
                width: 22, height: 22, display: 'grid', placeItems: 'center',
                border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer',
                color: 'var(--ads-text-muted, #9aa0a8)',
              }}
            >
              <X size={14} strokeWidth={2} />
            </button>
          )}
        </span>
      </div>

      {/* body */}
      {hasThumb && (
        <div style={{ display: 'flex', gap: 6, padding: 8 }}>
          {thumb !== undefined && <Thumb src={thumb} />}
          {thumbB !== undefined && <Thumb src={thumbB} />}
        </div>
      )}
      {lines && lines.length > 0 && (
        <div style={{ padding: hasThumb ? '0 12px 11px' : '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {lines.map((l, i) => (
            <span
              key={i}
              style={{
                fontSize: 12,
                lineHeight: '16px',
                color: i === 0 ? 'var(--ads-text-primary, #14181f)' : 'var(--ads-text-secondary, #5b626d)',
                fontWeight: i === 0 ? 500 : 400,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReportWorkflowNode;
