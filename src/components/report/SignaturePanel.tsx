import React, { useState, useRef, useCallback, useEffect } from 'react';
import { color, font, space, radius, shadow, transition } from '../../design-system/tokens';
import { SecondaryButton } from '../../design-system/SecondaryButton';
import { PrimaryButton } from '../../design-system/PrimaryButton';

interface SignaturePanelProps {
  signatureUrl: string;
  signatureMethod: 'upload' | 'draw' | 'saved' | '';
  onSignatureChange: (url: string, method: 'upload' | 'draw' | 'saved' | '') => void;
}

type SignatureTab = 'upload' | 'draw';

export default function SignaturePanel({ signatureUrl, signatureMethod, onSignatureChange }: SignaturePanelProps) {
  const [activeTab, setActiveTab] = useState<SignatureTab>(signatureMethod === 'upload' ? 'upload' : 'draw');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Drawing logic ──
  useEffect(() => {
    if (activeTab !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = color.textHeading;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height),
      };
    };

    const onDown = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDrawing.current = true;
      const { x, y } = getPos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing.current) return;
      e.preventDefault();
      const { x, y } = getPos(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    };
    const onUp = () => {
      isDrawing.current = false;
    };

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseup', onUp);
    canvas.addEventListener('mouseleave', onUp);
    canvas.addEventListener('touchstart', onDown, { passive: false });
    canvas.addEventListener('touchmove', onMove, { passive: false });
    canvas.addEventListener('touchend', onUp);

    return () => {
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('mouseleave', onUp);
      canvas.removeEventListener('touchstart', onDown);
      canvas.removeEventListener('touchmove', onMove);
      canvas.removeEventListener('touchend', onUp);
    };
  }, [activeTab]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    onSignatureChange(url, 'draw');
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onSignatureChange(url, 'upload');
    }
  };

  const clearSignature = () => {
    onSignatureChange('', '');
    clearCanvas();
  };

  // ── Has signature — show preview ──
  if (signatureUrl) {
    return (
      <div style={{
        border: `1px solid ${color.borderDefault}`,
        borderRadius: radius.lg,
        backgroundColor: color.white,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: space[4],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAFAFA',
          minHeight: '80px',
          position: 'relative',
        }}>
          <img
            src={signatureUrl}
            alt="Signature"
            style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain' }}
          />
          {/* Clear button */}
          <button
            type="button"
            onClick={clearSignature}
            style={{
              position: 'absolute',
              top: space[2],
              right: space[2],
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: color.neutral300,
              color: color.white,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="2" y1="2" x2="8" y2="8" />
              <line x1="8" y1="2" x2="2" y2="8" />
            </svg>
          </button>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${space[2]} ${space[4]}`,
          borderTop: `1px solid ${color.borderDefault}`,
        }}>
          <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>
            {signatureMethod === 'draw' ? 'Drawn' : 'Uploaded'} signature
          </span>
          <SecondaryButton size={36} onClick={clearSignature} style={{ minHeight: '28px', padding: `0 ${space[3]}`, fontSize: '11px' }}>
            Remove
          </SecondaryButton>
        </div>
      </div>
    );
  }

  // ── No signature — tabbed UI ──
  const TABS: { id: SignatureTab; label: string }[] = [
    { id: 'upload', label: 'Type' },
    { id: 'draw', label: 'Draw' },
  ];

  return (
    <div style={{
      border: `1px solid ${color.borderDefault}`,
      borderRadius: radius.lg,
      backgroundColor: color.white,
      overflow: 'hidden',
    }}>
      {/* Segmented tabs */}
      <div style={{
        padding: `${space[3]} ${space[4]} 0`,
      }}>
        <div style={{
          display: 'flex',
          border: `1px solid ${color.borderDefault}`,
          borderRadius: radius.md,
          overflow: 'hidden',
        }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: `${space[2]} ${space[2]}`,
                fontSize: font.size.sm,
                fontWeight: font.weight.medium,
                fontFamily: font.family,
                color: activeTab === tab.id ? color.primary : color.textSubtle,
                backgroundColor: activeTab === tab.id ? 'rgb(230, 247, 255)' : color.white,
                border: 'none',
                cursor: 'pointer',
                transition: `all ${transition.fast}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding: space[4] }}>
        {activeTab === 'upload' ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: space[3],
          }}>
            <div style={{
              width: '100%',
              height: '120px',
              border: `2px dashed ${color.borderDefault}`,
              borderRadius: radius.md,
              backgroundColor: '#FAFAFA',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: space[2],
              cursor: 'pointer',
            }}
              onClick={() => fileRef.current?.click()}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color.neutral400} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15V3M7 7l5-5 5 5" />
                <path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" />
              </svg>
              <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>
                Click to upload signature image
              </span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: space[3],
          }}>
            {/* Canvas with clear X button */}
            <div style={{ position: 'relative' }}>
              <canvas
                ref={canvasRef}
                width={500}
                height={200}
                style={{
                  width: '100%',
                  height: '150px',
                  border: `1px solid ${color.borderDefault}`,
                  borderRadius: radius.md,
                  cursor: 'crosshair',
                  backgroundColor: '#FAFAFA',
                  touchAction: 'none',
                  display: 'block',
                }}
              />
              {/* Clear X on canvas */}
              <button
                type="button"
                onClick={clearCanvas}
                style={{
                  position: 'absolute',
                  top: space[2],
                  right: space[2],
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: color.neutral300,
                  color: color.white,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  opacity: 0.7,
                  transition: `opacity ${transition.fast}`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="3" y1="3" x2="9" y2="9" />
                  <line x1="9" y1="3" x2="3" y2="9" />
                </svg>
              </button>
            </div>
            {/* Save button */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
              <PrimaryButton size={36} onClick={saveDrawing}>
                Save
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
