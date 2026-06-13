import React from 'react';
import { SecondaryButton, Icon } from '../../../design-system';
import type { Attachment } from '../data/types';
import { formatTimestamp } from '../data/activity';

export function JobFilesTab({
  attachments,
  onAdd,
}: {
  attachments: Attachment[];
  onAdd: (file: { name: string; sizeKb: number; kind: 'image' | 'video' | 'scan' | 'pdf' | 'other' }) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SecondaryButton
          size={36}
          onClick={() => {
            // Simulate adding a file (no real upload in this prototype)
            onAdd({ name: `update-${Date.now()}.jpg`, sizeKb: 280, kind: 'image' });
          }}
        >
          + Add file
        </SecondaryButton>
      </div>
      {attachments.length === 0 ? (
        <div
          style={{
            border: '1px dashed var(--ads-border-default)',
            borderRadius: 'var(--ads-radius-sm)',
            padding: '32px 24px',
            textAlign: 'center',
            color: 'var(--ads-text-muted)',
            fontSize: '13px',
            backgroundColor: 'var(--ads-bg-muted)',
          }}
        >
          No files attached.
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {attachments.map((a) => (
            <li
              key={a.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                border: '1px solid var(--ads-border-subtle)',
                borderRadius: 'var(--ads-radius-sm)',
                backgroundColor: 'var(--ads-bg-surface)',
              }}
            >
              <FileIcon kind={a.kind} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--ads-font-sans)',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: 'var(--ads-text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {a.name}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--ads-font-sans)',
                    fontSize: '12px',
                    color: 'var(--ads-text-muted)',
                  }}
                >
                  {formatSize(a.sizeKb)} · {a.uploadedBy} · {formatTimestamp(a.uploadedAt)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FileIcon({ kind }: { kind: Attachment['kind'] }) {
  const color =
    kind === 'image' ? 'var(--ads-tag-blue-fg)' :
    kind === 'video' ? 'var(--ads-tag-purple-fg)' :
    kind === 'scan'  ? 'var(--ads-tag-green-fg)' :
    kind === 'pdf'   ? 'var(--ads-tag-red-fg)' :
    'var(--ads-text-muted)';
  const bg =
    kind === 'image' ? 'var(--ads-tag-blue-bg)' :
    kind === 'video' ? 'var(--ads-tag-purple-bg)' :
    kind === 'scan'  ? 'var(--ads-tag-green-bg)' :
    kind === 'pdf'   ? 'var(--ads-tag-red-bg)' :
    'var(--ads-bg-muted)';
  return (
    <span
      aria-hidden
      style={{
        width: '36px',
        height: '36px',
        borderRadius: 'var(--ads-radius-sm)',
        backgroundColor: bg,
        color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon name={kind === 'image' ? 'card' : kind === 'video' ? 'card' : kind === 'scan' ? 'layers' : 'document'} size={18} color="currentColor" />
    </span>
  );
}

function formatSize(kb: number): string {
  if (kb >= 1000) return `${(kb / 1000).toFixed(1)} MB`;
  return `${kb} KB`;
}
