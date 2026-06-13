import React, { useEffect } from 'react';
import { IconButton, Icon } from '../../../design-system';

/**
 * Right-side slide-over drawer used by Jobs detail, Analytics drill-down,
 * and the existing PatientPage upload-media flow. Header / body / footer
 * are slot props so each consumer composes its own content.
 */
export interface SlideOverPanelProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  /** Content rendered to the right of the title (e.g. status tag, filters). */
  headerExtra?: React.ReactNode;
  /** Pinned footer (e.g. action buttons). When omitted, body fills full height. */
  footer?: React.ReactNode;
  /** Width in px; defaults to 720. */
  width?: number;
  children: React.ReactNode;
  /** Optional aria-label override; defaults to the stringified title. */
  ariaLabel?: string;
}

export function SlideOverPanel({
  open,
  onClose,
  title,
  headerExtra,
  footer,
  width = 720,
  children,
  ariaLabel,
}: SlideOverPanelProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--ads-scrim)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity var(--ads-duration-base) var(--ads-ease-standard)',
          zIndex: 1000,
        }}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? (typeof title === 'string' ? title : undefined)}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          width,
          maxWidth: '100vw',
          backgroundColor: 'var(--ads-bg-surface)',
          boxShadow: 'var(--ads-shadow-lg)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform var(--ads-duration-base) var(--ads-ease-standard)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            borderBottom: '1px solid var(--ads-border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--ads-font-sans)',
                fontWeight: 500,
                fontSize: '20px',
                lineHeight: '28px',
                color: 'var(--ads-text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </h2>
            {headerExtra}
          </div>
          <IconButton aria-label="Close" size="md" onClick={onClose}>
            <Icon name="close" size={18} color="var(--ads-text-primary)" />
          </IconButton>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>

        {footer && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--ads-border-subtle)',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              backgroundColor: 'var(--ads-bg-surface)',
            }}
          >
            {footer}
          </div>
        )}
      </aside>
    </>
  );
}
