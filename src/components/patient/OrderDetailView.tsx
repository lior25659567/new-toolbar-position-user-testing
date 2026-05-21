import React, { useEffect, useState } from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  LinkButton,
  IconButton,
  TextArea,
  Tag,
  Avatar,
  Notification,
} from '../../design-system';
import { zIndex } from '../../design-system/tokens';
import { StatusTag } from '../shared/DataTable';
import {
  PRODUCTION_STAGES,
  stageIndex,
  type ActivityEvent,
  type LabMessage,
  type PatientOrder,
  type ProductionStage,
} from './orderConstants';

interface OrderDetailViewProps {
  open: boolean;
  order: PatientOrder | null;
  patientName: string;
  onClose: () => void;
  onSendMessage: (orderId: string, message: LabMessage) => void;
  onAdvanceStage?: (orderId: string, stage: ProductionStage) => void;
  onDuplicate: (order: PatientOrder) => void;
}

export function OrderDetailView({
  open,
  order,
  patientName,
  onClose,
  onSendMessage,
  onAdvanceStage,
  onDuplicate,
}: OrderDetailViewProps) {
  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Esc to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !order) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Order ${order.id}`}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--ads-bg-page)',
        zIndex: zIndex.modal,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--ads-font-sans)',
      }}
    >
      {/* Header */}
      <header
        style={{
          flexShrink: 0,
          height: 64,
          backgroundColor: 'var(--ads-bg-surface)',
          borderBottom: '1px solid var(--ads-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          gap: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order detail"
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--ads-radius-sm)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ads-text-primary)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--ads-bg-muted)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <line x1="5" y1="5" x2="15" y2="15" />
              <line x1="15" y1="5" x2="5" y2="15" />
            </svg>
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 11, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>
              Order #{order.id.replace(/^po-/, '').toUpperCase()}
            </span>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ads-text-primary)' }}>
              {order.service} · {patientName}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <StatusTag status={order.status} />
          <SecondaryButton size={36} onClick={() => onDuplicate(order)}>
            Duplicate
          </SecondaryButton>
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div
          style={{
            padding: '24px 32px',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 360px',
            gap: 24,
            alignItems: 'start',
          }}
        >
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
            <StatusPipeline stage={order.productionStage} onAdvance={onAdvanceStage ? (s) => onAdvanceStage(order.id, s) : undefined} />
            <ActivityTimeline events={order.activity ?? []} />
            <LabMessageThread
              messages={order.thread ?? []}
              onSend={(body) => {
                onSendMessage(order.id, {
                  id: `m-${Date.now().toString(36)}`,
                  timestamp: new Date().toISOString(),
                  author: 'Dr. A. Whitaker',
                  isLab: false,
                  body,
                });
              }}
            />
          </div>

          {/* Right column */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 0 }}>
            <DetailCard
              title="Delivery"
              rows={[
                { label: 'Estimated', value: order.estimatedDeliveryDate ?? '—' },
                { label: 'Due date',  value: order.dueDate ?? '—' },
                { label: 'Created',   value: order.createdDate },
              ]}
            />
            <DetailCard
              title="Order"
              rows={[
                { label: 'Service',   value: order.service },
                { label: 'Category',  value: order.category },
                { label: 'Procedure', value: order.procedureType ?? '—' },
                { label: 'Provider',  value: order.provider ?? '—' },
                { label: 'Ordered by',value: order.orderedBy },
                ...(order.teeth.length > 0 ? [{ label: 'Teeth', value: order.teeth.slice().sort((a, b) => a - b).join(', ') }] : []),
                ...(order.manufacturer ? [{ label: 'Manufacturer', value: order.manufacturer }] : []),
                ...(order.productLine  ? [{ label: 'Product line', value: order.productLine }]  : []),
              ]}
            />
            {order.details && Object.keys(order.details).length > 0 && (
              <DetailCard
                title="Clinical details"
                rows={Object.entries(order.details).map(([k, v]) => ({
                  label: humanize(k),
                  value: formatValue(v),
                }))}
              />
            )}
            <FilesCard files={order.files ?? []} />
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ─── Status pipeline ─── */

function StatusPipeline({ stage, onAdvance }: { stage?: ProductionStage; onAdvance?: (s: ProductionStage) => void }) {
  const idx = stageIndex(stage);
  return (
    <section
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
        padding: '20px 24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 17,
            lineHeight: '24px',
            fontWeight: 500,
            color: 'var(--ads-text-primary)',
          }}
        >
          Production status
        </h2>
        {stage && (
          <span style={{ fontSize: 13, color: 'var(--ads-text-muted)' }}>
            Stage {idx + 1} of {PRODUCTION_STAGES.length}
          </span>
        )}
      </div>

      <ol
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${PRODUCTION_STAGES.length}, 1fr)`,
          gap: 0,
          alignItems: 'flex-start',
        }}
      >
        {PRODUCTION_STAGES.map((s, i) => {
          const completed = i < idx;
          const active = i === idx;
          return (
            <li
              key={s.value}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                position: 'relative',
                textAlign: 'center',
              }}
            >
              {/* connector line */}
              {i > 0 && (
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: 'calc(-50% + 14px)',
                    right: 'calc(50% + 14px)',
                    top: 13,
                    height: 2,
                    backgroundColor: i <= idx ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)',
                  }}
                />
              )}
              <span
                aria-hidden
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 'var(--ads-radius-full)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 500,
                  backgroundColor: completed
                    ? 'var(--ads-blue-500)'
                    : active
                    ? 'var(--ads-bg-surface)'
                    : 'var(--ads-bg-muted)',
                  color: completed ? '#fff' : active ? 'var(--ads-blue-500)' : 'var(--ads-text-muted)',
                  border: `2px solid ${completed || active ? 'var(--ads-blue-500)' : 'var(--ads-border-subtle)'}`,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {completed ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 7l3 4 7-8" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: active ? 500 : 400,
                    color: active ? 'var(--ads-text-primary)' : completed ? 'var(--ads-text-primary)' : 'var(--ads-text-muted)',
                  }}
                >
                  {s.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ads-text-muted)', marginTop: 2 }}>{s.subtitle}</div>
              </div>
            </li>
          );
        })}
      </ol>

      {onAdvance && idx >= 0 && idx < PRODUCTION_STAGES.length - 1 && (
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <LinkButton
            size={36}
            onClick={() => onAdvance(PRODUCTION_STAGES[idx + 1].value)}
          >
            Demo: advance to {PRODUCTION_STAGES[idx + 1].label} →
          </LinkButton>
        </div>
      )}
    </section>
  );
}

/* ─── Activity timeline ─── */

function ActivityTimeline({ events }: { events: ActivityEvent[] }) {
  return (
    <section
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
        padding: '20px 24px',
      }}
    >
      <h2 style={{ margin: '0 0 16px', fontSize: 17, lineHeight: '24px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>
        Activity
      </h2>
      {events.length === 0 ? (
        <div style={{ fontSize: 13, color: 'var(--ads-text-muted)' }}>No activity yet.</div>
      ) : (
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {events.slice().sort((a, b) => b.timestamp.localeCompare(a.timestamp)).map((e) => (
            <li key={e.id} style={{ display: 'grid', gridTemplateColumns: '20px 1fr auto', gap: 12, alignItems: 'flex-start' }}>
              <span
                aria-hidden
                style={{
                  marginTop: 4,
                  width: 10,
                  height: 10,
                  borderRadius: 'var(--ads-radius-full)',
                  backgroundColor:
                    e.kind === 'stage' ? 'var(--ads-blue-500)' :
                    e.kind === 'submit' ? 'var(--ads-success-500)' :
                    'var(--ads-border-strong)',
                }}
              />
              <div>
                <div style={{ fontSize: 13, color: 'var(--ads-text-primary)' }}>{e.message}</div>
                <div style={{ fontSize: 12, color: 'var(--ads-text-muted)', marginTop: 2 }}>{e.actor}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ads-text-muted)', whiteSpace: 'nowrap' }}>
                {formatTimestamp(e.timestamp)}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

/* ─── Lab message thread ─── */

function LabMessageThread({ messages, onSend }: { messages: LabMessage[]; onSend: (body: string) => void }) {
  const [draft, setDraft] = useState('');
  const send = () => {
    const v = draft.trim();
    if (!v) return;
    onSend(v);
    setDraft('');
  };
  return (
    <section
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
        padding: '20px 24px',
      }}
    >
      <h2 style={{ margin: '0 0 16px', fontSize: 17, lineHeight: '24px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>
        Messages with lab
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--ads-text-muted)' }}>
            No messages yet. Send the lab a note about this order.
          </div>
        ) : (
          messages.slice().sort((a, b) => a.timestamp.localeCompare(b.timestamp)).map((m) => (
            <MessageRow key={m.id} message={m} />
          ))
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'flex-end', marginTop: 8 }}>
          <TextArea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Message the lab — they'll see this on the order"
            fullWidth
            rows={2}
          />
          <PrimaryButton size={36} disabled={!draft.trim()} onClick={send}>
            Send
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}

function MessageRow({ message }: { message: LabMessage }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '32px 1fr',
        gap: 10,
        alignItems: 'flex-start',
      }}
    >
      <Avatar name={message.author.split(/\s+/).slice(0, 2).map((s) => s[0] ?? '').join('').toUpperCase() || 'L'} size="xs" />
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ads-text-primary)' }}>{message.author}</span>
          {message.isLab && <Tag color="blue" size="small">Lab</Tag>}
          <span style={{ fontSize: 12, color: 'var(--ads-text-muted)' }}>{formatTimestamp(message.timestamp)}</span>
        </div>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ads-text-primary)', lineHeight: 1.5, wordBreak: 'break-word' }}>{message.body}</p>
      </div>
    </div>
  );
}

/* ─── Right-column cards ─── */

function DetailCard({ title, rows }: { title: string; rows: { label: string; value: string }[] }) {
  return (
    <section
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
        padding: '16px 20px',
      }}
    >
      <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--ads-text-muted)', flexShrink: 0 }}>{r.label}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ads-text-primary)', textAlign: 'right', wordBreak: 'break-word' }}>{r.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FilesCard({ files }: { files: { kind: string; name: string }[] }) {
  return (
    <section
      style={{
        backgroundColor: 'var(--ads-bg-surface)',
        border: '1px solid var(--ads-border-subtle)',
        borderRadius: 'var(--ads-radius-sm)',
        padding: '16px 20px',
      }}
    >
      <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        Files
      </h3>
      {files.length === 0 ? (
        <div style={{ fontSize: 13, color: 'var(--ads-text-muted)' }}>No files attached.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {files.map((f, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                backgroundColor: 'var(--ads-bg-page)',
                borderRadius: 'var(--ads-radius-sm)',
                fontSize: 13,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  color: 'var(--ads-blue-500)',
                  letterSpacing: '0.04em',
                  width: 70,
                  flexShrink: 0,
                }}
              >
                {f.kind}
              </span>
              <span style={{ color: 'var(--ads-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── Helpers ─── */

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  if (sameDay) return `Today, ${time}`;
  return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, ${time}`;
}

function humanize(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function formatValue(v: string | number | string[] | boolean | null): string {
  if (v === null) return '—';
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  return String(v);
}
