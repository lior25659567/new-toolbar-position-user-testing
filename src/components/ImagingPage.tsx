import React, { useState } from 'react';
import { Avatar, Modal, PrimaryButton, SecondaryButton, Tag, type TagColor } from '../design-system';
import { DSCoreShell, type DSCoreNavId } from './dscore/DSCoreShell';

interface ImagingPageProps {
  onBackToHome?: () => void;
  onNavigate?: (id: DSCoreNavId) => void;
}

type ImageKind = 'pano' | 'bitewing' | 'periapical' | 'cbct' | 'intraoral';

interface ImagingItem {
  id: string;
  kind: ImageKind;
  title: string;
  capturedAt: string;
  capturedBy: string;
  patientId: string;
  patientName: string;
  /** Mock AI overlay markers — each is a finding the model flagged. */
  aiFindings?: { id: string; x: number; y: number; w: number; h: number; label: string; confidence: number }[];
  /** Manual annotations the dentist added. */
  annotations: { id: string; x: number; y: number; note: string; addedBy: string; addedAt: string }[];
}

const KIND_LABEL: Record<ImageKind, string> = {
  pano:       'Panoramic',
  bitewing:   'Bitewing',
  periapical: 'Periapical',
  cbct:       'CBCT',
  intraoral:  'Intraoral',
};

const KIND_COLOR: Record<ImageKind, TagColor> = {
  pano:       'blue',
  bitewing:   'green',
  periapical: 'purple',
  cbct:       'orange',
  intraoral:  'magenta',
};

const SEED: ImagingItem[] = [
  {
    id: 'img-1', kind: 'pano', title: 'Pano · 2026-04-29',
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    capturedBy: 'Sara Singh', patientId: 'pat-mina', patientName: 'Mina Yamada',
    aiFindings: [
      { id: 'ai-1', x: 0.34, y: 0.42, w: 0.06, h: 0.08, label: 'Caries (suspected)', confidence: 0.84 },
      { id: 'ai-2', x: 0.68, y: 0.55, w: 0.05, h: 0.06, label: 'Periapical lesion', confidence: 0.71 },
    ],
    annotations: [],
  },
  {
    id: 'img-2', kind: 'bitewing', title: 'BW · Right · 2026-04-29',
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    capturedBy: 'Sara Singh', patientId: 'pat-mina', patientName: 'Mina Yamada',
    aiFindings: [{ id: 'ai-3', x: 0.45, y: 0.38, w: 0.08, h: 0.08, label: 'Interproximal caries', confidence: 0.91 }],
    annotations: [],
  },
  {
    id: 'img-3', kind: 'bitewing', title: 'BW · Left · 2026-04-29',
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    capturedBy: 'Sara Singh', patientId: 'pat-mina', patientName: 'Mina Yamada',
    aiFindings: [],
    annotations: [{ id: 'a-1', x: 0.52, y: 0.45, note: 'Watch for recurrent decay around #14 crown margin', addedBy: 'Dr. Alex Watanabe', addedAt: new Date().toISOString() }],
  },
  {
    id: 'img-4', kind: 'periapical', title: 'PA · #36 · 2025-11-12',
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 168).toISOString(),
    capturedBy: 'Dr. Maria Petrov', patientId: 'pat-mina', patientName: 'Mina Yamada',
    annotations: [],
  },
  {
    id: 'img-5', kind: 'cbct', title: 'CBCT · Anterior · 2026-02-08',
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 80).toISOString(),
    capturedBy: 'Dr. Alex Watanabe', patientId: 'pat-ethan', patientName: 'Ethan Liu',
    aiFindings: [{ id: 'ai-4', x: 0.5, y: 0.3, w: 0.1, h: 0.1, label: 'Bone density irregularity', confidence: 0.62 }],
    annotations: [],
  },
  {
    id: 'img-6', kind: 'intraoral', title: 'Intraoral · #24 buccal · 2026-04-29',
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    capturedBy: 'Sara Singh', patientId: 'pat-mina', patientName: 'Mina Yamada',
    annotations: [],
  },
];

export default function ImagingPage({ onBackToHome, onNavigate }: ImagingPageProps) {
  const [items] = useState<ImagingItem[]>(SEED);
  const [filterKind, setFilterKind] = useState<ImageKind | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const [compareId, setCompareId] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(true);

  const filtered = items.filter((i) => filterKind === 'all' || i.kind === filterKind);
  const open = openId ? items.find((i) => i.id === openId) ?? null : null;
  const compare = compareId ? items.find((i) => i.id === compareId) ?? null : null;

  return (
    <DSCoreShell active="files" unread={0} onNavigate={(id) => id === 'home' && onBackToHome ? onBackToHome() : onNavigate?.(id)}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '32px 40px 80px' }}>
        <header style={{ marginBottom: '20px' }}>
          <h1 style={{ fontFamily: 'var(--ads-font-sans)', fontWeight: 500, fontSize: '28px', margin: 0, color: 'var(--ads-text-primary)' }}>
            Imaging Studio
          </h1>
          <p style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '14px', color: 'var(--ads-text-muted)', margin: '6px 0 0' }}>
            Browse pano, bitewing, PA, CBCT, and intraoral images. Click to view; AI markers and annotations layer on top.
          </p>
        </header>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <KindChip k="all"        active={filterKind === 'all'}        onClick={() => setFilterKind('all')} label={`All (${items.length})`} />
          {(Object.keys(KIND_LABEL) as ImageKind[]).map((k) => (
            <KindChip key={k} k={k} active={filterKind === k} onClick={() => setFilterKind(k)} label={`${KIND_LABEL[k]} (${items.filter((i) => i.kind === k).length})`} />
          ))}
          <div style={{ marginLeft: 'auto' }}>
            <SecondaryButton size={36} selected={showAI} onClick={() => setShowAI((v) => !v)}>
              AI overlay {showAI ? 'on' : 'off'}
            </SecondaryButton>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenId(item.id)}
              style={{
                background: 'none',
                border: '1px solid var(--ads-border-subtle)',
                borderRadius: 'var(--ads-radius-sm)',
                padding: 0,
                cursor: 'pointer',
                overflow: 'hidden',
                fontFamily: 'inherit',
                color: 'inherit',
                textAlign: 'left',
              }}
            >
              <Thumb item={item} showAI={showAI} />
              <div style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                  <span style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--ads-text-primary)' }}>
                    {item.title}
                  </span>
                  <Tag size="small" color={KIND_COLOR[item.kind]}>{KIND_LABEL[item.kind]}</Tag>
                </div>
                <div style={{ fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)', marginTop: '4px' }}>
                  {item.patientName} · {new Date(item.capturedAt).toLocaleDateString()}
                </div>
                {item.aiFindings && item.aiFindings.length > 0 && (
                  <div style={{ marginTop: '6px', fontFamily: 'var(--ads-font-sans)', fontSize: '11px', color: 'var(--ads-tag-orange-fg)' }}>
                    {item.aiFindings.length} AI flag{item.aiFindings.length === 1 ? '' : 's'}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <Modal
          open
          onClose={() => { setOpenId(null); setCompareId(null); }}
          title={open.title}
          size="lg"
          footer={
            <>
              <SecondaryButton size={36} onClick={() => setShowAI((v) => !v)}>
                {showAI ? 'Hide AI' : 'Show AI'}
              </SecondaryButton>
              <SecondaryButton size={36} onClick={() => {
                const others = items.filter((i) => i.id !== open.id && i.patientId === open.patientId);
                if (others.length > 0) setCompareId(others[0].id);
              }}>
                Compare with prior
              </SecondaryButton>
              <PrimaryButton size={36} onClick={() => { setOpenId(null); setCompareId(null); }}>Done</PrimaryButton>
            </>
          }
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Viewer item={open} showAI={showAI} large />
              <Meta item={open} />
            </div>
            {compare && (
              <div style={{ flex: 1 }}>
                <Viewer item={compare} showAI={showAI} large />
                <Meta item={compare} />
              </div>
            )}
          </div>
        </Modal>
      )}
    </DSCoreShell>
  );
}

function KindChip({ active, onClick, label }: { k: string; active: boolean; onClick: () => void; label: string }) {
  return (
    <SecondaryButton size={36} selected={active} onClick={onClick}>
      {label}
    </SecondaryButton>
  );
}

function Thumb({ item, showAI }: { item: ImagingItem; showAI: boolean }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '4 / 3',
        backgroundColor: 'var(--ads-text-primary)',
        backgroundImage: 'radial-gradient(circle at 30% 30%, var(--ads-text-primary) 0%, transparent 60%), radial-gradient(circle at 70% 65%, var(--ads-text-primary) 0%, transparent 55%)',
        overflow: 'hidden',
      }}
    >
      <FakeAnatomy kind={item.kind} />
      {showAI && item.aiFindings?.map((f) => (
        <div
          key={f.id}
          style={{
            position: 'absolute',
            left: `${f.x * 100}%`,
            top: `${f.y * 100}%`,
            width: `${f.w * 100}%`,
            height: `${f.h * 100}%`,
            border: '2px solid var(--ads-tag-orange-fg)',
            backgroundColor: 'color-mix(in srgb, var(--ads-tag-orange-bg) 30%, transparent)',
            borderRadius: 4,
          }}
          title={`${f.label} (${Math.round(f.confidence * 100)}%)`}
        />
      ))}
    </div>
  );
}

function Viewer({ item, showAI, large }: { item: ImagingItem; showAI: boolean; large?: boolean }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '4 / 3',
        backgroundColor: 'var(--ads-text-primary)',
        backgroundImage: 'radial-gradient(circle at 30% 30%, var(--ads-text-primary) 0%, transparent 60%), radial-gradient(circle at 70% 65%, var(--ads-text-primary) 0%, transparent 55%)',
        overflow: 'hidden',
        borderRadius: large ? 'var(--ads-radius-sm)' : 0,
      }}
    >
      <FakeAnatomy kind={item.kind} large />
      {showAI && item.aiFindings?.map((f) => (
        <div
          key={f.id}
          style={{
            position: 'absolute',
            left: `${f.x * 100}%`,
            top: `${f.y * 100}%`,
            width: `${f.w * 100}%`,
            height: `${f.h * 100}%`,
            border: '2px solid var(--ads-tag-orange-fg)',
            backgroundColor: 'color-mix(in srgb, var(--ads-tag-orange-bg) 30%, transparent)',
            borderRadius: 4,
          }}
        >
          <span
            style={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              padding: '2px 6px',
              fontFamily: 'var(--ads-font-sans)',
              fontSize: '11px',
              backgroundColor: 'var(--ads-tag-orange-fg)',
              color: '#fff',
              whiteSpace: 'nowrap',
              borderRadius: '2px 2px 0 0',
            }}
          >
            {f.label} · {Math.round(f.confidence * 100)}%
          </span>
        </div>
      ))}
      {item.annotations.map((a) => (
        <div
          key={a.id}
          style={{
            position: 'absolute',
            left: `${a.x * 100}%`,
            top: `${a.y * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: 12, height: 12, borderRadius: '50%',
            backgroundColor: 'var(--ads-blue-500)',
            border: '2px solid #fff',
          }}
          title={a.note}
        />
      ))}
    </div>
  );
}

function FakeAnatomy({ kind, large }: { kind: ImageKind; large?: boolean }) {
  const stroke = '#9DA3AE';
  if (kind === 'pano') {
    return (
      <svg viewBox="0 0 400 200" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.7 }}>
        <path d="M30 110 Q200 -20 370 110" fill="none" stroke={stroke} strokeWidth="1" />
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={i} x={50 + i * 22} y={70 + Math.sin(i / 2) * 20} width="14" height="22" fill="var(--ads-text-primary)" stroke={stroke} strokeWidth="0.5" rx="3" />
        ))}
        <path d="M30 130 Q200 240 370 130" fill="none" stroke={stroke} strokeWidth="1" />
      </svg>
    );
  }
  if (kind === 'cbct') {
    return (
      <svg viewBox="0 0 400 300" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.7 }}>
        <ellipse cx="200" cy="150" rx="120" ry="100" fill="none" stroke={stroke} strokeWidth="0.8" />
        <ellipse cx="200" cy="160" rx="80"  ry="60"  fill="#2A3340" stroke={stroke} strokeWidth="0.5" />
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={i} x1={120 + i * 8} y1={120} x2={120 + i * 8} y2={200} stroke={stroke} strokeWidth="0.3" opacity="0.4" />
        ))}
      </svg>
    );
  }
  if (kind === 'intraoral') {
    return (
      <svg viewBox="0 0 400 300" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.85 }}>
        <rect x="60" y="60" width="280" height="180" fill="#5C2828" rx="8" />
        <rect x="100" y="120" width="200" height="60" fill="#F0E6D0" rx="6" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={110 + i * 30} y="125" width="22" height="50" fill="#FAF1DD" stroke="#9C9078" strokeWidth="0.5" rx="3" />
        ))}
      </svg>
    );
  }
  // bitewing / periapical — simple tooth pair
  return (
    <svg viewBox="0 0 400 300" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.7 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <g key={i} transform={`translate(${80 + i * 60}, 80)`}>
          <rect width="42" height="80" fill="var(--ads-text-primary)" stroke={stroke} strokeWidth="0.6" rx="6" />
          <line x1="0" y1="40" x2="42" y2="40" stroke={stroke} strokeWidth="0.4" />
        </g>
      ))}
      {Array.from({ length: 4 }).map((_, i) => (
        <g key={i} transform={`translate(${80 + i * 60}, 180)`}>
          <rect width="42" height="80" fill="var(--ads-text-primary)" stroke={stroke} strokeWidth="0.6" rx="6" />
        </g>
      ))}
      {large && <text x="20" y="20" fill="#fff" opacity="0.4" fontSize="10" fontFamily="ui-monospace">L  R</text>}
    </svg>
  );
}

function Meta({ item }: { item: ImagingItem }) {
  return (
    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--ads-font-sans)', fontSize: '12px', color: 'var(--ads-text-muted)' }}>
      <Avatar name={item.capturedBy.split(' ').map((s) => s[0]).slice(0, 2).join('')} size="xs" />
      <span>{item.capturedBy}</span>
      <span>·</span>
      <span>{new Date(item.capturedAt).toLocaleString()}</span>
      <span>·</span>
      <span>{item.patientName}</span>
    </div>
  );
}
