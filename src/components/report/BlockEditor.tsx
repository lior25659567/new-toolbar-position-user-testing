import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { color, font, space, radius, shadow, transition } from '../../design-system/tokens';
import { SecondaryButton } from '../../design-system/SecondaryButton';
import { PrimaryButton } from '../../design-system/PrimaryButton';
import ToothSelector from './ToothSelector';
import type {
  ReportBlock, ImageBlock, ComparisonBlock, CostSummaryBlock, BlockType,
} from './types';

// ─── Shared field components ─────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      fontSize: font.size.xs,
      fontWeight: font.weight.medium,
      color: color.textLabel,
      display: 'block',
      marginBottom: space[1],
    }}>
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%',
        height: '36px',
        padding: `0 ${space[3]}`,
        fontSize: font.size.sm,
        fontFamily: font.family,
        color: color.textDefault,
        backgroundColor: color.white,
        border: `1px solid ${focused ? color.primary : color.borderDefault}`,
        borderRadius: radius.md,
        outline: 'none',
        boxShadow: focused ? shadow.focusPrimaryLight : 'none',
        transition: transition.input,
        boxSizing: 'border-box',
      }}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%',
        padding: space[3],
        fontSize: font.size.sm,
        fontFamily: font.family,
        color: color.textDefault,
        backgroundColor: color.white,
        border: `1px solid ${focused ? color.primary : color.borderDefault}`,
        borderRadius: radius.md,
        outline: 'none',
        boxShadow: focused ? shadow.focusPrimaryLight : 'none',
        transition: transition.input,
        boxSizing: 'border-box',
        resize: 'vertical',
        lineHeight: font.lineHeight.normal,
      }}
    />
  );
}

// ─── Block Card Shell ────────────────────────────────────────────────────────

function BlockCardShell({
  label,
  thumbnail,
  collapsed,
  children,
  index,
  onDelete,
  onDuplicate,
  onToggleCollapse,
  onDragStart,
  onDragOver,
  onDrop,
  isDragTarget,
}: {
  label: string;
  thumbnail?: string;
  collapsed: boolean;
  children: React.ReactNode;
  index: number;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleCollapse: () => void;
  onDragStart: (i: number) => void;
  onDragOver: (e: React.DragEvent, i: number) => void;
  onDrop: (i: number) => void;
  isDragTarget: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={() => onDrop(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: color.bgSurface,
        border: `1px solid ${isDragTarget ? color.primary : hovered ? color.borderHover : color.borderDefault}`,
        borderRadius: radius.lg,
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
        overflow: 'hidden',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: hovered ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${space[3]} ${space[4]}`,
          borderBottom: collapsed ? 'none' : `1px solid ${color.borderDefault}`,
          backgroundColor: hovered ? color.bgHover : 'transparent',
          cursor: 'pointer',
          userSelect: 'none',
          transition: `background-color ${transition.fast}`,
        }}
        onClick={onToggleCollapse}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: space[3], minWidth: 0, flex: 1 }}>
          {/* Drag handle */}
          <div
            style={{ cursor: 'grab', color: color.neutral400, display: 'flex', flexShrink: 0, opacity: hovered ? 1 : 0.4, transition: `opacity ${transition.fast}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="5" cy="3" r="1.5" /><circle cx="11" cy="3" r="1.5" />
              <circle cx="5" cy="8" r="1.5" /><circle cx="11" cy="8" r="1.5" />
              <circle cx="5" cy="13" r="1.5" /><circle cx="11" cy="13" r="1.5" />
            </svg>
          </div>

          {/* Thumbnail preview */}
          {thumbnail && (
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: radius.sm,
              overflow: 'hidden',
              flexShrink: 0,
              border: `1px solid ${color.borderDefault}`,
            }}>
              <img src={thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          )}

          {/* Label */}
          <span style={{
            fontSize: font.size.sm,
            fontWeight: font.weight.semibold,
            color: color.textHeading,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {label}
          </span>

          {/* Collapse chevron */}
          <svg
            width="14" height="14" viewBox="0 0 16 16" fill="none"
            stroke={color.neutral400} strokeWidth="1.5" strokeLinecap="round"
            style={{
              flexShrink: 0,
              transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
              transition: `transform ${transition.fast}`,
            }}
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: space[1],
            opacity: hovered ? 1 : 0,
            transition: `opacity ${transition.fast}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <ActionButton title="Duplicate" onClick={onDuplicate}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="8" height="8" rx="1.5" />
              <path d="M10 4V3a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 3v5.5A1.5 1.5 0 003 10h1" />
            </svg>
          </ActionButton>
          <ActionButton title="Delete" danger onClick={onDelete}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
              <line x1="3" y1="3" x2="11" y2="11" />
              <line x1="11" y1="3" x2="3" y2="11" />
            </svg>
          </ActionButton>
        </div>
      </div>

      {/* Card content */}
      {!collapsed && (
        <div style={{ padding: space[4], display: 'flex', flexDirection: 'column', gap: space[3] }}>
          {children}
        </div>
      )}
    </div>
  );
}

function ActionButton({ children, onClick, title, danger }: {
  children: React.ReactNode; onClick: () => void; title: string; danger?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '26px',
        height: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        borderRadius: radius.sm,
        backgroundColor: hovered ? color.bgActive : 'transparent',
        color: hovered ? color.textDefault : color.neutral400,
        cursor: 'pointer',
        transition: `all ${transition.fast}`,
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}

// ─── Gallery images ─────────────────────────────────────────────────────────

import upperArchColor from '../../assets/button-images/review-tool/Color.png';
import lowerArchNiri from '../../assets/button-images/review-tool/Niri.png';
import occlusalView from '../../assets/button-images/review-tool/Color.png';
import dentalArchColor from '../../assets/button-images/default/dental-arch-color.png';
import prepModel1 from '../../assets/button-images/prep-qc/prep-model-1.png';
import prepModel2 from '../../assets/button-images/prep-qc/prep-model-2.png';

type GalleryCategory = 'full-arch' | 'prep-review' | 'diagnostics';

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  'full-arch': 'Full Arch Scans',
  'prep-review': 'Prep & Review',
  'diagnostics': 'NIRI & Diagnostics',
};

const CATEGORY_ORDER: GalleryCategory[] = ['full-arch', 'prep-review', 'diagnostics'];

interface GalleryImage {
  url: string;
  label: string;
  category: GalleryCategory;
}

const GALLERY_IMAGES: GalleryImage[] = [
  { url: upperArchColor, label: 'Upper arch (color)', category: 'full-arch' },
  { url: dentalArchColor, label: 'Dental arch (color)', category: 'full-arch' },
  { url: occlusalView,   label: 'Occlusal view',       category: 'full-arch' },
  { url: prepModel1,     label: 'Prep model 1',        category: 'prep-review' },
  { url: prepModel2,     label: 'Prep model 2',        category: 'prep-review' },
  { url: lowerArchNiri,  label: 'Lower arch (NIRI)',   category: 'diagnostics' },
];

// ─── Image Upload Zone (change image within a card) ─────────────────────────

function ImageUploadZone({ previewUrl, onFileSelect, onGallerySelect, onAnnotate, isAnnotated }: {
  previewUrl: string;
  onFileSelect: (file: File, url: string) => void;
  onGallerySelect: (url: string) => void;
  onAnnotate?: () => void;
  isAnnotated?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showGallery, setShowGallery] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file, URL.createObjectURL(file));
  };

  if (previewUrl) {
    return (
      <div style={{ position: 'relative' }}>
        <img
          src={previewUrl}
          alt=""
          style={{
            width: '100%',
            maxHeight: '200px',
            objectFit: 'cover',
            borderRadius: radius.md,
            display: 'block',
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: space[2],
          right: space[2],
          display: 'flex',
          gap: space[1],
        }}>
          {onAnnotate && (
            <OverlayButton
              label={isAnnotated ? 'Edit Annotation' : 'Annotate'}
              onClick={onAnnotate}
              icon={
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 2.5l3.5 3.5L5 14.5H1.5V11L10 2.5z" />
                </svg>
              }
            />
          )}
          <OverlayButton label="Replace" onClick={() => fileRef.current?.click()} />
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      </div>
    );
  }

  return (
    <>
      <div style={{
        width: '100%',
        border: `2px dashed ${color.borderDefault}`,
        borderRadius: radius.md,
        backgroundColor: color.neutral50,
        overflow: 'hidden',
      }}>
        <UploadRow
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={color.neutral400} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 11V5M5.5 7L8 4.5 10.5 7" />
              <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" />
            </svg>
          }
          label="Upload from device"
          onClick={() => fileRef.current?.click()}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: space[2], padding: `0 ${space[3]}` }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: color.borderDefault }} />
          <span style={{ fontSize: font.size.xs, color: color.textPlaceholder }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: color.borderDefault }} />
        </div>
        <UploadRow
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={color.neutral400} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="1" width="6" height="6" rx="1" />
              <rect x="9" y="1" width="6" height="6" rx="1" />
              <rect x="1" y="9" width="6" height="6" rx="1" />
              <rect x="9" y="9" width="6" height="6" rx="1" />
            </svg>
          }
          label="Choose from gallery"
          onClick={() => setShowGallery(true)}
        />
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      {showGallery && ReactDOM.createPortal(
        <GalleryOverlayModal
          onSelect={(url) => { onGallerySelect(url); setShowGallery(false); }}
          onClose={() => setShowGallery(false)}
        />,
        document.body
      )}
    </>
  );
}

function UploadRow({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: '100%',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: space[2],
        cursor: 'pointer',
        transition: `background-color ${transition.fast}`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E0F2FE'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      {icon}
      <span style={{ fontSize: font.size.xs, color: color.textSubtle }}>{label}</span>
    </div>
  );
}

function OverlayButton({ label, onClick, icon }: { label: string; onClick: () => void; icon?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: `${space[1]} ${space[3]}`,
        fontSize: font.size.xs,
        fontWeight: font.weight.medium,
        color: color.white,
        backgroundColor: 'rgba(0,0,0,0.6)',
        border: 'none',
        borderRadius: radius.sm,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Annotation Lightbox ────────────────────────────────────────────────────

const ANNOTATION_COLORS = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#5856D6', '#AF52DE', '#FFFFFF', '#000000'];
const BRUSH_SIZES = [2, 4, 8, 12];

type AnnotationTool = 'pen' | 'highlighter' | 'arrow' | 'circle' | 'text';

function AnnotationLightbox({ imageUrl, onSave, onClose }: {
  imageUrl: string;
  onSave: (annotatedUrl: string) => void;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<AnnotationTool>('pen');
  const [brushColor, setBrushColor] = useState('#FF3B30');
  const [brushSize, setBrushSize] = useState(4);
  const isDrawing = useRef(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Load image onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      // Scale canvas to image, max 800px wide
      const scale = Math.min(1100 / img.width, 800 / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  }, []);

  const onDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPos(e);

    // Text tool: prompt for text and place it
    if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        ctx.font = `${Math.max(14, brushSize * 4)}px Inter, sans-serif`;
        ctx.fillStyle = brushColor;
        ctx.globalAlpha = 1;
        ctx.fillText(text, x, y);
      }
      return;
    }

    isDrawing.current = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 1;
  };

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const onUp = () => {
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.globalAlpha = 1;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imgRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    onSave(url);
  };

  const TOOLS: { id: AnnotationTool; label: string; icon: React.ReactNode }[] = [
    {
      id: 'pen', label: 'Pen',
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2.5l3.5 3.5L5 14.5H1.5V11L10 2.5z" /></svg>,
    },
    {
      id: 'text' as AnnotationTool, label: 'Text',
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h10M8 3v10M5.5 13h5" /></svg>,
    },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 100 }} />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '1200px',
        maxWidth: '96vw',
        height: '85vh',
        maxHeight: '94vh',
        backgroundColor: color.white,
        borderRadius: radius.xl,
        boxShadow: '0 32px 64px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)',
        zIndex: 101,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: space[3],
          padding: `${space[3]} ${space[4]}`,
          borderBottom: `1px solid ${color.borderDefault}`,
          flexShrink: 0,
          flexWrap: 'wrap',
        }}>
          {/* Tools */}
          <div style={{ display: 'flex', gap: '2px', backgroundColor: color.neutral100, borderRadius: radius.md, padding: '2px' }}>
            {TOOLS.map((t) => (
              <button
                key={t.id}
                type="button"
                title={t.label}
                onClick={() => setTool(t.id)}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  borderRadius: radius.sm,
                  backgroundColor: tool === t.id ? color.white : 'transparent',
                  boxShadow: tool === t.id ? shadow.sm : 'none',
                  color: tool === t.id ? color.primary : color.textSubtle,
                  cursor: 'pointer',
                  transition: `all ${transition.fast}`,
                  padding: 0,
                }}
              >
                {t.icon}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '24px', backgroundColor: color.borderDefault }} />

          {/* Colors */}
          <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
            {ANNOTATION_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setBrushColor(c)}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: c,
                  border: brushColor === c ? `2px solid ${color.primary}` : `1px solid ${c === '#FFFFFF' ? color.borderDefault : 'transparent'}`,
                  cursor: 'pointer',
                  padding: 0,
                  boxShadow: brushColor === c ? `0 0 0 2px ${color.white}` : 'none',
                }}
              />
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '24px', backgroundColor: color.borderDefault }} />

          {/* Brush size */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {BRUSH_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setBrushSize(s)}
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: brushSize === s ? `2px solid ${color.primary}` : `1px solid ${color.borderDefault}`,
                  borderRadius: radius.sm,
                  backgroundColor: brushSize === s ? '#E0F2FE' : color.white,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <div style={{
                  width: `${Math.min(s + 2, 14)}px`,
                  height: `${Math.min(s + 2, 14)}px`,
                  borderRadius: '50%',
                  backgroundColor: color.textDefault,
                }} />
              </button>
            ))}
          </div>

        </div>

        {/* Canvas */}
        <div style={{
          flex: 1,
          padding: space[4],
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F4F4F4',
          overflow: 'auto',
        }}>
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              cursor: 'crosshair',
              borderRadius: radius.sm,
              touchAction: 'none',
            }}
            onMouseDown={onDown}
            onMouseMove={onMove}
            onMouseUp={onUp}
            onMouseLeave={onUp}
            onTouchStart={onDown}
            onTouchMove={onMove}
            onTouchEnd={onUp}
          />
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${space[3]} ${space[5]}`,
          borderTop: `1px solid ${color.borderDefault}`,
          flexShrink: 0,
          backgroundColor: color.white,
        }}>
          <SecondaryButton size={36} onClick={handleClear}>
            Clear
          </SecondaryButton>
          <div style={{ display: 'flex', gap: space[2] }}>
            <SecondaryButton size={36} onClick={onClose}>
              Cancel
            </SecondaryButton>
            <PrimaryButton size={36} onClick={handleSave}>
              Save
            </PrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Gallery Overlay Modal ──────────────────────────────────────────────────

function GalleryOverlayModal({ onSelect, onClose, multiSelect, onMultiSelect }: {
  onSelect: (url: string) => void;
  onClose: () => void;
  multiSelect?: boolean;
  onMultiSelect?: (urls: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (url: string) => {
    setSelected((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const filteredImages = GALLERY_IMAGES;

  // Group by category
  const groupedImages = CATEGORY_ORDER.reduce<{ category: GalleryCategory; images: GalleryImage[] }[]>((acc, cat) => {
    const imgs = filteredImages.filter((img) => img.category === cat);
    if (imgs.length > 0) acc.push({ category: cat, images: imgs });
    return acc;
  }, []);

  const handleImageClick = (url: string) => {
    toggleSelection(url);
  };

  const selectMode = true;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 100,
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-modal-title"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1200px',
          maxWidth: '96vw',
          height: '85vh',
          maxHeight: '94vh',
          backgroundColor: color.white,
          borderRadius: radius.lg,
          boxShadow: shadow.lg,
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: font.family,
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${space[3]} ${space[5]}`,
            borderBottom: `1px solid ${color.borderDefault}`,
            flexShrink: 0,
          }}
        >
          <h2
            id="gallery-modal-title"
            style={{
              margin: 0,
              fontSize: font.size.md,
              fontWeight: font.weight.semibold,
              color: color.textHeading,
              letterSpacing: font.tracking.tight,
            }}
          >
            Image Gallery
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              border: 'none',
              background: 'none',
              borderRadius: radius.sm,
              cursor: 'pointer',
              color: color.textSubtle,
              transition: transition.fast,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color.bgHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
            </svg>
          </button>
        </div>

        {/* ── Image grid ── */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: space[5],
        }}>
          {filteredImages.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: space[3],
              color: color.textPlaceholder,
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M16 16l5 5" />
              </svg>
              <span style={{ fontSize: font.size.base }}>No images found</span>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  style={{
                    fontSize: font.size.sm,
                    fontWeight: font.weight.medium,
                    color: color.primary,
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            groupedImages.map(({ category, images }, gi) => (
              <div key={category} style={{ marginBottom: gi < groupedImages.length - 1 ? space[6] : 0 }}>
                {/* Section label */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: space[2],
                  marginBottom: space[3],
                }}>
                  <span style={{
                    fontSize: font.size.xs,
                    fontWeight: font.weight.semibold,
                    color: color.textSubtle,
                    textTransform: 'uppercase',
                    letterSpacing: font.tracking.wide,
                  }}>
                    {CATEGORY_LABELS[category]}
                  </span>
                </div>

                {/* Grid — 5 columns */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: space[3],
                }}>
                  {images.map((img, i) => (
                    <GalleryThumbnail
                      key={i}
                      url={img.url}
                      label={img.label}
                      isSelected={selected.includes(img.url)}
                      showCheckbox={selectMode}
                      onClick={() => handleImageClick(img.url)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${space[3]} ${space[5]}`,
          borderTop: `1px solid ${color.borderDefault}`,
          flexShrink: 0,
          backgroundColor: color.white,
        }}>
          <SecondaryButton size={36} onClick={() => setSelected([])} disabled={selected.length === 0}>
            Clear
          </SecondaryButton>
          <div style={{ display: 'flex', gap: space[2] }}>
          <SecondaryButton size={36} onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            size={36}
            disabled={selected.length === 0}
            onClick={() => {
              if (multiSelect && onMultiSelect) {
                onMultiSelect(selected);
              } else if (selected.length === 1) {
                onSelect(selected[0]);
              } else if (selected.length > 1 && onMultiSelect) {
                onMultiSelect(selected);
              } else if (selected.length > 0) {
                onSelect(selected[0]);
              }
            }}
          >
            {selected.length > 0 ? `Add Image (${selected.length})` : 'Add Image'}
          </PrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
}

function GalleryThumbnail({ url, label, onClick, isSelected, showCheckbox }: {
  url: string; label: string; onClick: () => void; isSelected?: boolean; showCheckbox?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        padding: 0,
        border: `2px solid ${isSelected ? color.primary : 'transparent'}`,
        borderRadius: radius.lg,
        backgroundColor: 'transparent',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: `all ${transition.fast}`,
        position: 'relative',
      }}
    >
      {/* Checkbox */}
      {showCheckbox && (hovered || isSelected) && (
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '22px',
          height: '22px',
          borderRadius: radius.sm,
          backgroundColor: isSelected ? color.primary : color.white,
          border: `2px solid ${isSelected ? color.primary : color.neutral300}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          transition: `all ${transition.fast}`,
        }}>
          {isSelected && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={color.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6.5L5 9.5l5-7" />
            </svg>
          )}
        </div>
      )}

      {/* Image container */}
      <div style={{
        width: '100%',
        aspectRatio: '1',
        overflow: 'hidden',
        backgroundColor: color.neutral100,
        position: 'relative',
      }}>
        <img
          src={url}
          alt={label}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: hovered ? 0.85 : 1,
            transition: `opacity ${transition.fast}`,
          }}
        />
      </div>

    </button>
  );
}

// ─── Block Editors ──────────────────────────────────────────────────────────

function ImageCardEditor({ block, onUpdate }: {
  block: ImageBlock;
  onUpdate: (updates: Partial<ImageBlock>) => void;
}) {
  const [showAnnotation, setShowAnnotation] = useState(false);
  const [isAnnotated, setIsAnnotated] = useState(false);

  return (
    <>
      {/* Image upload */}
      <ImageUploadZone
        previewUrl={block.previewUrl}
        onFileSelect={(file, url) => { onUpdate({ file, previewUrl: url }); setIsAnnotated(false); }}
        onGallerySelect={(url) => { onUpdate({ file: null, previewUrl: url }); setIsAnnotated(false); }}
        onAnnotate={block.previewUrl ? () => setShowAnnotation(true) : undefined}
        isAnnotated={isAnnotated}
      />

      {showAnnotation && block.previewUrl && ReactDOM.createPortal(
        <AnnotationLightbox
          imageUrl={block.previewUrl}
          onSave={(annotatedUrl) => {
            onUpdate({ previewUrl: annotatedUrl, file: null });
            setIsAnnotated(true);
            setShowAnnotation(false);
          }}
          onClose={() => setShowAnnotation(false)}
        />,
        document.body
      )}

      {/* Teeth */}
      <div>
        <FieldLabel>Teeth</FieldLabel>
        <ToothSelector
          selected={block.teeth}
          onChange={(teeth) => onUpdate({ teeth })}
          compact
        />
      </div>

      {/* Title */}
      <div>
        <FieldLabel>Title</FieldLabel>
        <TextInput
          value={block.title}
          onChange={(v) => onUpdate({ title: v })}
          placeholder="Image title"
        />
      </div>

      {/* Notes */}
      <div>
        <FieldLabel>Notes</FieldLabel>
        <TextArea
          value={block.notes}
          onChange={(v) => onUpdate({ notes: v })}
          placeholder="Add notes..."
          rows={2}
        />
      </div>

      {/* Clinical details toggle */}
      <div style={{
        borderTop: `1px solid ${color.borderDefault}`,
        paddingTop: space[3],
      }}>
        <button
          type="button"
          onClick={() => onUpdate({ showClinicalFields: !block.showClinicalFields })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: space[2],
            padding: 0,
            fontSize: font.size.xs,
            fontWeight: font.weight.medium,
            color: color.textSubtle,
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <svg
            width="14" height="14" viewBox="0 0 16 16" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
            style={{ transition: `transform ${transition.fast}`, transform: block.showClinicalFields ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
          Clinical details
        </button>

        {block.showClinicalFields && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: space[3],
            marginTop: space[3],
          }}>
            <TextInput value={block.diagnosis} onChange={(v) => onUpdate({ diagnosis: v })} placeholder="Diagnosis" />
            <TextInput value={block.treatment} onChange={(v) => onUpdate({ treatment: v })} placeholder="Treatment" />
            <TextInput value={block.estimatedCost} onChange={(v) => onUpdate({ estimatedCost: v })} placeholder="Est. cost" />
            <TextInput value={block.treatmentDate} onChange={(v) => onUpdate({ treatmentDate: v })} placeholder="Date" />
          </div>
        )}
      </div>
    </>
  );
}

function ComparisonCardEditor({ block, onUpdate }: {
  block: ComparisonBlock;
  onUpdate: (updates: Partial<ComparisonBlock>) => void;
}) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space[3] }}>
        <div>
          <FieldLabel>{block.labelA || 'Before'}</FieldLabel>
          <ImageUploadZone
            previewUrl={block.imageA.previewUrl}
            onFileSelect={(file, url) => onUpdate({ imageA: { file, previewUrl: url } })}
            onGallerySelect={(url) => onUpdate({ imageA: { file: null, previewUrl: url } })}
          />
          <div style={{ marginTop: space[2] }}>
            <TextInput value={block.labelA} onChange={(v) => onUpdate({ labelA: v })} placeholder="Label (e.g. Before)" />
          </div>
        </div>
        <div>
          <FieldLabel>{block.labelB || 'After'}</FieldLabel>
          <ImageUploadZone
            previewUrl={block.imageB.previewUrl}
            onFileSelect={(file, url) => onUpdate({ imageB: { file, previewUrl: url } })}
            onGallerySelect={(url) => onUpdate({ imageB: { file: null, previewUrl: url } })}
          />
          <div style={{ marginTop: space[2] }}>
            <TextInput value={block.labelB} onChange={(v) => onUpdate({ labelB: v })} placeholder="Label (e.g. After)" />
          </div>
        </div>
      </div>
      <div>
        <FieldLabel>Comparison Notes</FieldLabel>
        <TextArea value={block.notes} onChange={(v) => onUpdate({ notes: v })} placeholder="Describe what changed between these images..." rows={2} />
      </div>
    </>
  );
}

function SummaryCardEditor({ block, onUpdate }: {
  block: CostSummaryBlock;
  onUpdate: (updates: Partial<CostSummaryBlock>) => void;
}) {
  const updateItem = (id: string, field: 'description' | 'amount', value: string) => {
    onUpdate({ items: block.items.map((it) => it.id === id ? { ...it, [field]: value } : it) });
  };

  const addItem = () => {
    onUpdate({ items: [...block.items, { id: `cost-${Date.now()}`, description: '', amount: '' }] });
  };

  const removeItem = (id: string) => {
    if (block.items.length <= 1) return;
    onUpdate({ items: block.items.filter((it) => it.id !== id) });
  };

  const total = block.items.reduce((sum, it) => {
    const n = parseFloat(it.amount.replace(/[^0-9.]/g, ''));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  return (
    <>
      {block.items.map((item, i) => (
        <div key={item.id} style={{ display: 'flex', gap: space[2], alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            {i === 0 && <FieldLabel>Description</FieldLabel>}
            <TextInput value={item.description} onChange={(v) => updateItem(item.id, 'description', v)} placeholder="Item description" />
          </div>
          <div style={{ width: '120px' }}>
            {i === 0 && <FieldLabel>Amount</FieldLabel>}
            <TextInput value={item.amount} onChange={(v) => updateItem(item.id, 'amount', v)} placeholder="$0.00" />
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            style={{
              width: '28px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              backgroundColor: 'transparent',
              color: block.items.length <= 1 ? color.neutral200 : color.neutral400,
              cursor: block.items.length <= 1 ? 'not-allowed' : 'pointer',
              marginTop: i === 0 ? '20px' : 0,
              padding: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="3" x2="11" y2="11" /><line x1="11" y1="3" x2="3" y2="11" />
            </svg>
          </button>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onClick={addItem}
          style={{
            fontSize: font.size.xs,
            fontWeight: font.weight.medium,
            color: color.primary,
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: space[1],
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="6" y1="2" x2="6" y2="10" /><line x1="2" y1="6" x2="10" y2="6" />
          </svg>
          Add item
        </button>
        <div style={{ fontSize: font.size.sm, fontWeight: font.weight.semibold, color: color.textHeading }}>
          Total: ${total.toFixed(2)}
        </div>
      </div>
    </>
  );
}

// ─── Block type labels ──────────────────────────────────────────────────────

const BLOCK_LABELS: Record<string, string> = {
  'image': 'Image',
  'comparison': 'Before / After',
  'cost-summary': 'Summary',
};

// ─── Add Block Menu ─────────────────────────────────────────────────────────

const ADDABLE_BLOCKS: { type: BlockType; label: string; description: string }[] = [
  { type: 'image',         label: 'Image',          description: 'Clinical photo with notes' },
  { type: 'comparison',    label: 'Before / After',  description: 'Side-by-side comparison' },
  { type: 'cost-summary',  label: 'Summary',         description: 'Itemized cost table' },
];

function AddBlockMenu({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: space[2],
          border: `1.5px dashed ${hovered || open ? color.primary : color.borderDefault}`,
          borderRadius: radius.md,
          backgroundColor: hovered || open ? '#E0F2FE' : 'transparent',
          color: hovered || open ? color.primary : color.textSubtle,
          fontSize: font.size.xs,
          fontWeight: font.weight.medium,
          cursor: 'pointer',
          transition: `all ${transition.fast}`,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="7" y1="3" x2="7" y2="11" /><line x1="3" y1="7" x2="11" y2="7" />
        </svg>
        Add Section
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 9 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            right: 0,
            marginBottom: space[1],
            backgroundColor: color.bgSurface,
            border: `1px solid ${color.borderDefault}`,
            borderRadius: radius.lg,
            boxShadow: shadow.lg,
            zIndex: 10,
            padding: space[2],
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}>
            {ADDABLE_BLOCKS.map((item) => (
              <MenuRow
                key={item.type}
                label={item.label}
                description={item.description}
                onClick={() => { onAdd(item.type); setOpen(false); }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MenuRow({ label, description, onClick }: {
  label: string; description: string; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: space[3],
        padding: `${space[2]} ${space[3]}`,
        backgroundColor: hovered ? color.bgHover : 'transparent',
        border: 'none',
        borderRadius: radius.md,
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: `background-color ${transition.fast}`,
      }}
    >
      <div style={{
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: hovered ? color.neutral200 : color.neutral100,
        borderRadius: radius.sm,
        flexShrink: 0,
        transition: `background-color ${transition.fast}`,
      }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={color.textSubtle} strokeWidth="1.3" strokeLinecap="round">
          <line x1="6" y1="2" x2="6" y2="10" /><line x1="2" y1="6" x2="10" y2="6" />
        </svg>
      </div>
      <div>
        <div style={{ fontSize: font.size.sm, fontWeight: font.weight.medium, color: color.textDefault }}>{label}</div>
        <div style={{ fontSize: font.size.xs, color: color.textSubtle }}>{description}</div>
      </div>
    </button>
  );
}

// ─── Exported Block Editor ──────────────────────────────────────────────────

type SupportedBlock = ImageBlock | ComparisonBlock | CostSummaryBlock;

interface BlockEditorProps {
  blocks: SupportedBlock[];
  onBlocksChange: (blocks: SupportedBlock[]) => void;
}

export default function BlockEditor({ blocks, onBlocksChange }: BlockEditorProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const updateBlock = (id: string, updates: Partial<SupportedBlock>) => {
    onBlocksChange(blocks.map((b) => b.id === id ? { ...b, ...updates } as SupportedBlock : b));
  };

  const deleteBlock = (id: string) => {
    onBlocksChange(blocks.filter((b) => b.id !== id));
  };

  const duplicateBlock = (id: string) => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const clone: SupportedBlock = { ...blocks[idx], id: `block-${Date.now()}` };
    const next = [...blocks];
    next.splice(idx + 1, 0, clone);
    onBlocksChange(next);
  };

  const toggleCollapse = (id: string) => {
    onBlocksChange(blocks.map((b) => b.id === id ? { ...b, collapsed: !b.collapsed } as SupportedBlock : b));
  };

  const createBlock = (type: BlockType): SupportedBlock => {
    const id = `block-${Date.now()}`;
    switch (type) {
      case 'comparison':
        return {
          id, type: 'comparison', collapsed: false,
          labelA: 'Before', labelB: 'After', notes: '',
          imageA: { file: null, previewUrl: '' },
          imageB: { file: null, previewUrl: '' },
        };
      case 'cost-summary':
        return {
          id, type: 'cost-summary', collapsed: false,
          items: [{ id: `cost-${Date.now()}`, description: '', amount: '' }],
        };
      default:
        return {
          id, type: 'image', collapsed: false,
          file: null, previewUrl: '', title: '', notes: '',
          teeth: [], diagnosis: '', treatment: '',
          estimatedCost: '', treatmentDate: '',
          annotations: [], showClinicalFields: false,
        };
    }
  };

  const addBlock = (type: BlockType) => {
    onBlocksChange([...blocks, createBlock(type)]);
  };

  const addImagesFromGallery = (urls: string[]) => {
    const newBlocks: ImageBlock[] = urls.map((url, i) => ({
      id: `block-${Date.now()}-${i}`,
      type: 'image' as const,
      collapsed: false,
      file: null,
      previewUrl: url,
      title: '',
      notes: '',
      teeth: [],
      diagnosis: '',
      treatment: '',
      estimatedCost: '',
      treatmentDate: '',
      annotations: [],
      showClinicalFields: false,
    }));
    onBlocksChange([...blocks, ...newBlocks]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newBlocks: ImageBlock[] = Array.from(files).map((file, i) => ({
      id: `block-${Date.now()}-${i}`,
      type: 'image' as const,
      collapsed: false,
      file,
      previewUrl: URL.createObjectURL(file),
      title: '',
      notes: '',
      teeth: [],
      diagnosis: '',
      treatment: '',
      estimatedCost: '',
      treatmentDate: '',
      annotations: [],
      showClinicalFields: false,
    }));
    onBlocksChange([...blocks, ...newBlocks]);
    e.target.value = '';
  };

  // Drag and drop
  const handleDragStart = (i: number) => setDragIndex(i);
  const handleDragOver = (e: React.DragEvent, i: number) => { e.preventDefault(); setDragOverIndex(i); };
  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const next = [...blocks];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    onBlocksChange(next);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const getBlockLabel = (block: SupportedBlock, i: number) => {
    if (block.type === 'image') return (block as ImageBlock).title || `Image ${i + 1}`;
    return BLOCK_LABELS[block.type] || `Block ${i + 1}`;
  };

  const getBlockThumbnail = (block: SupportedBlock) => {
    if (block.type === 'image') return (block as ImageBlock).previewUrl || undefined;
    if (block.type === 'comparison') return (block as ComparisonBlock).imageA.previewUrl || undefined;
    return undefined;
  };

  const renderBlockContent = (block: SupportedBlock) => {
    switch (block.type) {
      case 'image':
        return <ImageCardEditor block={block} onUpdate={(u) => updateBlock(block.id, u)} />;
      case 'comparison':
        return <ComparisonCardEditor block={block} onUpdate={(u) => updateBlock(block.id, u)} />;
      case 'cost-summary':
        return <SummaryCardEditor block={block} onUpdate={(u) => updateBlock(block.id, u)} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
      {blocks.map((block, i) => (
        <BlockCardShell
          key={block.id}
          label={getBlockLabel(block, i)}
          thumbnail={getBlockThumbnail(block)}
          collapsed={block.collapsed}
          index={i}
          onDelete={() => deleteBlock(block.id)}
          onDuplicate={() => duplicateBlock(block.id)}
          onToggleCollapse={() => toggleCollapse(block.id)}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragTarget={dragOverIndex === i && dragIndex !== i}
        >
          {renderBlockContent(block)}
        </BlockCardShell>
      ))}

      {/* Gallery overlay modal */}
      {showGallery && ReactDOM.createPortal(
        <GalleryOverlayModal
          multiSelect
          onSelect={() => {}}
          onMultiSelect={(urls) => { addImagesFromGallery(urls); setShowGallery(false); }}
          onClose={() => setShowGallery(false)}
        />,
        document.body
      )}

      {/* Sticky footer: action buttons + add block menu pinned to the bottom of the scroll container */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        marginTop: space[2],
        paddingTop: space[3],
        paddingBottom: space[2],
        backgroundColor: color.bgSurface,
        borderTop: `1px solid ${color.borderDefault}`,
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: space[2],
      }}>
        <div style={{ display: 'flex', gap: space[2] }}>
          <ActionBottomButton
            label="Upload from Device"
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 9.5V4M4.5 6L7 3.5 9.5 6" />
                <path d="M2 9.5v1.5a1 1 0 001 1h8a1 1 0 001-1V9.5" />
              </svg>
            }
            onClick={() => fileRef.current?.click()}
          />
          <ActionBottomButton
            label="Select from Gallery"
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="1" width="5" height="5" rx="1" />
                <rect x="8" y="1" width="5" height="5" rx="1" />
                <rect x="1" y="8" width="5" height="5" rx="1" />
                <rect x="8" y="8" width="5" height="5" rx="1" />
              </svg>
            }
            onClick={() => setShowGallery(true)}
          />
        </div>
        <AddBlockMenu onAdd={addBlock} />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
}

function ActionBottomButton({ label, icon, onClick }: {
  label: string; icon: React.ReactNode; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: space[2],
        border: `1.5px dashed ${hovered ? color.primary : color.borderDefault}`,
        borderRadius: radius.md,
        backgroundColor: hovered ? '#E0F2FE' : 'transparent',
        color: hovered ? color.primary : color.textSubtle,
        fontSize: font.size.xs,
        fontWeight: font.weight.medium,
        cursor: 'pointer',
        transition: `all ${transition.fast}`,
      }}
    >
      {icon}
      {label}
    </button>
  );
}
