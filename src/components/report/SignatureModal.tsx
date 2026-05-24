import React, { useState, useRef, useCallback, useEffect } from 'react';
import { color, font, space, radius, transition } from '../../design-system/tokens';
import { Modal } from '../../design-system/Modal';
import { SecondaryButton } from '../../design-system/SecondaryButton';
import { PrimaryButton } from '../../design-system/PrimaryButton';

type SignatureTab = 'draw' | 'upload' | 'saved';
const SAVED_KEY = 'report.savedSignature';

interface SignatureModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (url: string, method: 'draw' | 'upload' | 'saved') => void;
}

/** Doctor-signature capture modal (Draw / Upload / Use saved) in DS style. */
export default function SignatureModal({ open, onClose, onSave }: SignatureModalProps) {
  const [tab, setTab] = useState<SignatureTab>('draw');
  const [hasInk, setHasInk] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');
  const [savedUrl, setSavedUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Load any previously-saved signature when the modal opens.
  useEffect(() => {
    if (!open) return;
    setTab('draw');
    setHasInk(false);
    setUploadUrl('');
    try { setSavedUrl(localStorage.getItem(SAVED_KEY) || ''); } catch { /* ignore */ }
  }, [open]);

  // Drawing on the canvas.
  useEffect(() => {
    if (!open || tab !== 'draw') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = color.textHeading;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const pos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return { x: (cx - rect.left) * (canvas.width / rect.width), y: (cy - rect.top) * (canvas.height / rect.height) };
    };
    const down = (e: MouseEvent | TouchEvent) => { e.preventDefault(); drawing.current = true; const { x, y } = pos(e); ctx.beginPath(); ctx.moveTo(x, y); };
    const move = (e: MouseEvent | TouchEvent) => { if (!drawing.current) return; e.preventDefault(); const { x, y } = pos(e); ctx.lineTo(x, y); ctx.stroke(); setHasInk(true); };
    const up = () => { drawing.current = false; };

    canvas.addEventListener('mousedown', down);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', up);
    canvas.addEventListener('mouseleave', up);
    canvas.addEventListener('touchstart', down, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', up);
    return () => {
      canvas.removeEventListener('mousedown', down);
      canvas.removeEventListener('mousemove', move);
      canvas.removeEventListener('mouseup', up);
      canvas.removeEventListener('mouseleave', up);
      canvas.removeEventListener('touchstart', down);
      canvas.removeEventListener('touchmove', move);
      canvas.removeEventListener('touchend', up);
    };
  }, [open, tab]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadUrl(URL.createObjectURL(file));
    e.target.value = '';
  };

  const canSave = (tab === 'draw' && hasInk) || (tab === 'upload' && !!uploadUrl) || (tab === 'saved' && !!savedUrl);

  const handleSave = () => {
    let url = '';
    const method: 'draw' | 'upload' | 'saved' = tab;
    if (tab === 'draw') url = canvasRef.current?.toDataURL('image/png') || '';
    else if (tab === 'upload') url = uploadUrl;
    else url = savedUrl;
    if (!url) return;
    try { localStorage.setItem(SAVED_KEY, url); } catch { /* ignore */ }
    onSave(url, method);
    onClose();
  };

  const TABS: { id: SignatureTab; label: string }[] = [
    { id: 'draw', label: 'Draw' },
    { id: 'upload', label: 'Upload' },
    { id: 'saved', label: 'Use saved' },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Doctor signature"
      size="md"
      footer={
        <>
          <SecondaryButton size={36} onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton size={36} onClick={handleSave} disabled={!canSave}>Save signature</PrimaryButton>
        </>
      }
    >
      {/* Segmented tabs (DS secondary-style) */}
      <div role="tablist" aria-label="Signature method" style={{
        display: 'flex',
        border: `1px solid ${color.borderDefault}`,
        borderRadius: radius.md,
        overflow: 'hidden',
        width: 'fit-content',
        marginBottom: space[4],
      }}>
        {TABS.map((t) => {
          const selected = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(t.id)}
              style={{
                padding: `${space[2]} ${space[4]}`,
                fontSize: font.size.sm,
                fontWeight: font.weight.medium,
                fontFamily: font.family,
                color: selected ? color.textHeading : color.textSubtle,
                backgroundColor: selected ? color.bgActive : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: `background-color ${transition.fast}, color ${transition.fast}`,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'draw' && (
        <>
          <div style={{ position: 'relative' }}>
            <canvas
              ref={canvasRef}
              width={760}
              height={300}
              aria-label="Signature drawing area"
              style={{
                width: '100%',
                height: '260px',
                border: `1px solid ${color.borderDefault}`,
                borderRadius: radius.md,
                backgroundColor: color.bgPage,
                cursor: 'crosshair',
                touchAction: 'none',
                display: 'block',
              }}
            />
            <div style={{
              position: 'absolute', left: space[6], right: space[6], bottom: space[6],
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space[2],
              pointerEvents: 'none',
            }}>
              <div style={{ width: '100%', borderTop: `1px dashed ${color.borderStrong}` }} />
              <span style={{ fontSize: font.size.sm, color: color.textPlaceholder }}>
                Sign above the line
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: space[2] }}>
            <SecondaryButton variant="toolbar" size={36} onClick={clearCanvas} style={{ padding: `0 ${space[2]}` }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3v4h4M2.5 7a6 6 0 1 1-.5 3" />
              </svg>
              Clear
            </SecondaryButton>
            <span style={{ fontSize: font.size.sm, color: color.textPlaceholder }}>{hasInk ? 'Signed' : 'Empty'}</span>
          </div>
        </>
      )}

      {tab === 'upload' && (
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${color.borderDefault}`,
            borderRadius: radius.md,
            padding: space[8],
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space[2],
            cursor: 'pointer',
            backgroundColor: uploadUrl ? color.bgPage : 'transparent',
          }}
        >
          {uploadUrl ? (
            <img src={uploadUrl} alt="Signature preview" style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }} />
          ) : (
            <>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color.textSubtle} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 15V3M7 7l5-5 5 5" />
                <path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" />
              </svg>
              <span style={{ fontSize: font.size.base, fontWeight: font.weight.semibold, color: color.textHeading }}>Upload signature image</span>
              <span style={{ fontSize: font.size.sm, color: color.textSubtle }}>PNG with transparent background works best</span>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
        </div>
      )}

      {tab === 'saved' && (
        savedUrl ? (
          <div style={{
            border: `1px solid ${color.borderDefault}`, borderRadius: radius.md,
            padding: space[6], display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: color.bgPage,
          }}>
            <img src={savedUrl} alt="Saved signature" style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }} />
          </div>
        ) : (
          <div style={{ padding: `${space[10]} 0`, textAlign: 'center', color: color.textSubtle, fontSize: font.size.base }}>
            No saved signature yet. Draw or upload one first.
          </div>
        )
      )}
    </Modal>
  );
}
