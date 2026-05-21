import React from 'react';
import { Modal, PrimaryButton, SecondaryButton, WarningButton } from '../../design-system';

export const FIELD_WIDTH = 480;

export function SectionCard({
  title,
  description,
  headerExtra,
  children,
  tone = 'default',
}: {
  title?: string;
  description?: string;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  tone?: 'default' | 'danger';
}) {
  const isDanger = tone === 'danger';
  return (
    <section
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: `1px solid ${isDanger ? 'var(--ads-tag-red-br)' : 'var(--ads-border-subtle)'}`,
        borderRadius: 'var(--ads-radius-sm)',
        padding: '24px',
        marginBottom: '16px',
      }}
    >
      {(title || headerExtra) && (
        <header
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: title || description ? '20px' : 0,
          }}
        >
          <div style={{ minWidth: 0 }}>
            {title && (
              <h2
                style={{
                  margin: 0,
                  fontFamily: 'var(--ads-font-sans)',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '22px',
                  color: isDanger ? 'var(--ads-danger-500)' : 'var(--ads-text-primary)',
                }}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                style={{
                  margin: '6px 0 0',
                  fontFamily: 'var(--ads-font-sans)',
                  fontSize: '13px',
                  lineHeight: '18px',
                  color: 'var(--ads-text-muted)',
                }}
              >
                {description}
              </p>
            )}
          </div>
          {headerExtra && <div style={{ flexShrink: 0 }}>{headerExtra}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

export function SettingRow({
  label,
  helper,
  children,
  align = 'center',
}: {
  label: string;
  helper?: string;
  children: React.ReactNode;
  align?: 'center' | 'start';
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 240px) minmax(0, 1fr)',
        gap: '24px',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        padding: '14px 0',
        borderTop: '1px solid var(--ads-border-subtle)',
      }}
    >
      <div>
        <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>
          {label}
        </div>
        {helper && (
          <div style={{ marginTop: '2px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', lineHeight: '16px', color: 'var(--ads-text-muted)' }}>
            {helper}
          </div>
        )}
      </div>
      <div style={{ maxWidth: `${FIELD_WIDTH}px`, width: '100%' }}>{children}</div>
    </div>
  );
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <SecondaryButton size={36} onClick={onCancel}>
            {cancelLabel}
          </SecondaryButton>
          {destructive ? (
            <WarningButton size={36} onClick={onConfirm}>
              {confirmLabel}
            </WarningButton>
          ) : (
            <PrimaryButton size={36} onClick={onConfirm}>
              {confirmLabel}
            </PrimaryButton>
          )}
        </>
      }
    >
      <div style={{ padding: '4px 0', fontFamily: 'var(--ads-font-sans)', fontSize: '14px', lineHeight: '20px', color: 'var(--ads-text-primary)' }}>
        {message}
      </div>
    </Modal>
  );
}

export function MutedText({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <span style={{ color: 'var(--ads-text-muted)', fontFamily: 'var(--ads-font-sans)', fontSize: '13px', ...style }}>{children}</span>;
}

export function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const s = Math.floor(ms / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}
