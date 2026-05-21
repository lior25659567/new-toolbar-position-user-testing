import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { color, font, space, radius, shadow, transition } from '../../design-system/tokens';
import { SecondaryButton } from '../../design-system/SecondaryButton';
import { PrimaryButton } from '../../design-system/PrimaryButton';
import { DropdownList } from '../../design-system/DropdownList';
import { DatePicker } from '../../design-system/DatePicker';
import ToothSelector from './ToothSelector';
import { BlockTypeIcon } from './BlockNavList';
import type {
  ReportBlock, ImageBlock, ComparisonBlock, CostSummaryBlock, BlockType,
  NotesBlock, RxBlock, NextAppointmentBlock, PatientInstructionsBlock,
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
  blockId,
  label,
  thumbnail,
  blockType,
  collapsed,
  children,
  index,
  isActive,
  onDelete,
  onDuplicate,
  onToggleCollapse,
  onDragStart,
  onDragOver,
  onDrop,
  isDragTarget,
  hideDragHandle = false,
  hideChrome = false,
}: {
  /** Stable id used by the parent to scroll to / highlight this card. */
  blockId?: string;
  label: string;
  thumbnail?: string;
  blockType?: BlockType;
  collapsed: boolean;
  children: React.ReactNode;
  index: number;
  /** Highlights the card when the matching nav row is selected. */
  isActive?: boolean;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleCollapse: () => void;
  onDragStart: (i: number) => void;
  onDragOver: (e: React.DragEvent, i: number) => void;
  onDrop: (i: number) => void;
  isDragTarget: boolean;
  /** Hide the drag handle (used in single-block / minimal mode). */
  hideDragHandle?: boolean;
  /** Hide the card border, padding and shadow — render bare content. */
  hideChrome?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  // Minimal mode: no card border/background/shadow — just a title row above the content.
  if (hideChrome) {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: 'flex', flexDirection: 'column', gap: space[3] }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space[3] }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: space[3], minWidth: 0, flex: 1 }}>
            {thumbnail && (
              <div style={{
                width: '32px', height: '32px', borderRadius: radius.sm,
                overflow: 'hidden', flexShrink: 0,
                border: `1px solid ${color.borderDefault}`,
              }}>
                <img src={thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            )}
            <span style={{
              fontSize: font.size.lg,
              fontWeight: font.weight.semibold,
              color: color.textHeading,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              letterSpacing: font.tracking.tight,
            }}>
              {label}
            </span>
          </div>
          <div style={{ display: 'flex', gap: space[1], flexShrink: 0 }}>
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
        {!collapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: space[3] }}>
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      data-block-id={blockId}
      draggable={!hideDragHandle}
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={() => onDrop(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: color.bgSurface,
        // Right-side cards don't show "selected" state — only the left nav does.
        // Cards still react to drag-target and hover.
        border: `1px solid ${isDragTarget ? color.primary : hovered ? color.borderHover : color.borderDefault}`,
        borderRadius: radius.lg,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        overflow: 'hidden',
        boxShadow: hovered ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
      }}
    >
      {/* Card header — Wynde-style: drag · number · type chip · title · actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: space[3],
          padding: `${space[3]} ${space[4]}`,
          borderBottom: collapsed ? 'none' : `1px solid ${color.borderDefault}`,
          backgroundColor: 'transparent',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: space[2], minWidth: 0, flex: 1 }}>
          {/* Drag handle */}
          {!hideDragHandle && (
            <div
              style={{ cursor: 'grab', color: color.neutral400, display: 'flex', flexShrink: 0, opacity: hovered ? 1 : 0.4, transition: `opacity ${transition.fast}` }}
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                <circle cx="3" cy="3" r="1.2" /><circle cx="9" cy="3" r="1.2" />
                <circle cx="3" cy="7" r="1.2" /><circle cx="9" cy="7" r="1.2" />
                <circle cx="3" cy="11" r="1.2" /><circle cx="9" cy="11" r="1.2" />
              </svg>
            </div>
          )}

          {/* Number prefix */}
          <span style={{
            fontSize: font.size.base,
            fontWeight: font.weight.medium,
            color: color.textDefault,
            minWidth: 20,
            textAlign: 'right',
            flexShrink: 0,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {index + 1}.
          </span>

          {/* Type chip — thumbnail when the block has an image, otherwise a gray rounded box w/ type icon */}
          {thumbnail ? (
            <div style={{
              width: 28,
              height: 28,
              borderRadius: radius.md,
              overflow: 'hidden',
              flexShrink: 0,
              border: `1px solid ${color.borderDefault}`,
            }}>
              <img src={thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ) : (
            <div style={{
              width: 28,
              height: 28,
              borderRadius: radius.md,
              flexShrink: 0,
              background: color.neutral100,
              color: color.textDefault,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {blockType ? <BlockTypeIcon type={blockType} /> : null}
            </div>
          )}

          {/* Title */}
          <span style={{
            fontSize: font.size.base,
            fontWeight: font.weight.medium,
            color: color.textHeading,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            minWidth: 0,
          }}>
            {label}
          </span>

          {/* Collapse chevron */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleCollapse(); }}
            aria-label={collapsed ? 'Expand section' : 'Collapse section'}
            style={{
              flexShrink: 0,
              width: 24,
              height: 24,
              border: 'none',
              background: 'transparent',
              borderRadius: radius.sm,
              cursor: 'pointer',
              color: color.neutral400,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: `transform ${transition.fast}`,
              transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
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
        backgroundColor: color.bgSurface,
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
      data-demo={label.toLowerCase().replace(/\s+/g, '-')}
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
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--ads-background-highlight-blue)'; }}
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
      data-demo={label.toLowerCase().replace(/\s+/g, '-')}
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

const ANNOTATION_COLORS = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#5856D6', '#AF52DE', 'var(--ads-background-subtle-01)', 'var(--ads-text-primary)'];
const BRUSH_SIZES = [2, 6, 14, 28];

// Persist last used brush size and color across annotation sessions
let lastUsedBrushSize = BRUSH_SIZES[2]; // default to third size (14)
let lastUsedBrushColor = '#FF3B30';

type AnnotationTool = 'pen' | 'eraser' | 'text';

// Build a circle cursor data URL for the given diameter
function buildCircleCursor(diameter: number): string {
  const size = Math.max(diameter, 4);
  const half = size / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size + 2}" height="${size + 2}"><circle cx="${half + 1}" cy="${half + 1}" r="${half}" fill="none" stroke="white" stroke-width="1.5"/><circle cx="${half + 1}" cy="${half + 1}" r="${half}" fill="none" stroke="black" stroke-width="0.5"/></svg>`;
  return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}') ${half + 1} ${half + 1}, crosshair`;
}

function AnnotationLightbox({ imageUrl, originalImageUrl, onSave, onClose }: {
  imageUrl: string;
  originalImageUrl: string;
  onSave: (annotatedUrl: string) => void;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<AnnotationTool>('pen');
  const [brushColor, setBrushColorState] = useState(lastUsedBrushColor);
  const [brushSize, setBrushSizeState] = useState(lastUsedBrushSize);
  const setBrushColor = (c: string) => { setBrushColorState(c); lastUsedBrushColor = c; };
  const setBrushSize = (s: number) => { setBrushSizeState(s); lastUsedBrushSize = s; };
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  // Store the original clean image for clear & eraser
  const cleanCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasScaleRef = useRef(1);

  // Load image onto canvas + store clean original
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cancelled = false;

    // Load original clean image first, then the current image on top
    const origImg = new Image();
    origImg.crossOrigin = 'anonymous';
    origImg.onload = () => {
      if (cancelled) return;
      const scale = Math.min(1100 / origImg.width, 800 / origImg.height, 1);
      canvasScaleRef.current = scale;
      canvas.width = origImg.width * scale;
      canvas.height = origImg.height * scale;

      // Store clean original
      const offscreen = document.createElement('canvas');
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const offCtx = offscreen.getContext('2d');
      if (offCtx) offCtx.drawImage(origImg, 0, 0, canvas.width, canvas.height);
      cleanCanvasRef.current = offscreen;

      // Now load the current (possibly annotated) image to draw on canvas
      if (imageUrl !== originalImageUrl) {
        const curImg = new Image();
        curImg.crossOrigin = 'anonymous';
        curImg.onload = () => {
          if (cancelled) return;
          ctx.drawImage(curImg, 0, 0, canvas.width, canvas.height);
        };
        curImg.src = imageUrl;
      } else {
        ctx.drawImage(origImg, 0, 0, canvas.width, canvas.height);
      }
    };
    origImg.src = originalImageUrl;

    return () => { cancelled = true; };
  }, [imageUrl, originalImageUrl]);

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

  const eraseAt = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const clean = cleanCanvasRef.current;
    if (!clean) return;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.clip();
    ctx.clearRect(x - size, y - size, size * 2, size * 2);
    ctx.drawImage(clean, 0, 0);
    ctx.restore();
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
      ctx.globalCompositeOperation = 'source-over';
      ctx.font = `${Math.max(14, brushSize * 4)}px Inter, sans-serif`;
      ctx.fillStyle = brushColor;
      ctx.globalAlpha = 1;
      ctx.fillText(prompt('Enter text:') || '', x, y);
      return;
    }

    isDrawing.current = true;
    lastPos.current = { x, y };

    if (tool === 'eraser') {
      eraseAt(ctx, x, y, brushSize);
      return;
    }

    ctx.globalCompositeOperation = 'source-over';
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

    if (tool === 'eraser') {
      const prev = lastPos.current || { x, y };
      const dx = x - prev.x;
      const dy = y - prev.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const step = Math.max(1, brushSize * 0.25);
      const steps = Math.max(1, Math.ceil(dist / step));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        eraseAt(ctx, prev.x + dx * t, prev.y + dy * t, brushSize);
      }
      lastPos.current = { x, y };
      return;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const onUp = () => {
    isDrawing.current = false;
    lastPos.current = null;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas || !cleanCanvasRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(cleanCanvasRef.current, 0, 0);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL('image/png'));
  };

  // Compute cursor size in screen pixels (canvas pixels / display scale)
  const getCursorSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return brushSize;
    const rect = canvas.getBoundingClientRect();
    const displayScale = rect.width / canvas.width;
    return Math.max(4, Math.round(brushSize * displayScale));
  };

  const TOOLS: { id: AnnotationTool; label: string; icon: React.ReactNode }[] = [
    {
      id: 'pen', label: 'Pen',
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2.5l3.5 3.5L5 14.5H1.5V11L10 2.5z" /></svg>,
    },
    {
      id: 'text', label: 'Text',
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h10M8 3v10M5.5 13h5" /></svg>,
    },
    {
      id: 'eraser', label: 'Eraser',
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 13H6.5L2.85 9.35a1.4 1.4 0 010-2l5.5-5.5a1.4 1.4 0 012 0L14 5.5a1.4 1.4 0 010 2L9 12.5" /><line x1="2" y1="13" x2="14" y2="13" /></svg>,
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
                  border: brushColor === c ? `2px solid ${color.primary}` : `1px solid ${c === 'var(--ads-background-subtle-01)' ? color.borderDefault : 'transparent'}`,
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
                  backgroundColor: brushSize === s ? 'var(--ads-background-highlight-blue)' : color.white,
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

          {/* Spacer + Close */}
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              borderRadius: radius.sm,
              backgroundColor: 'transparent',
              color: color.textSubtle,
              cursor: 'pointer',
              padding: 0,
              transition: `background-color ${transition.fast}`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color.bgHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
            </svg>
          </button>

        </div>

        {/* Canvas */}
        <div style={{
          flex: 1,
          padding: space[4],
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'var(--ads-background-subtle-02)',
          overflow: 'auto',
        }}>
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              cursor: tool === 'text' ? 'text' : buildCircleCursor(getCursorSize()),
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
            <PrimaryButton size={36} data-demo="annotation-save" onClick={handleSave}>
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
            data-demo="gallery-add-btn"
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
      data-demo={`gallery-${label.toLowerCase().replace(/[\s()]/g, '-')}`}
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

// ─── Clinical dropdown options ──────────────────────────────────────────────

const DIAGNOSIS_ITEMS = [
  { value: 'Caries', label: 'Caries' },
  { value: 'Gingivitis', label: 'Gingivitis' },
  { value: 'Periodontitis', label: 'Periodontitis' },
  { value: 'Fractured tooth', label: 'Fractured tooth' },
  { value: 'Missing tooth', label: 'Missing tooth' },
  { value: 'Tooth sensitivity', label: 'Tooth sensitivity' },
  { value: 'Other', label: 'Other' },
];

const TREATMENT_ITEMS = [
  { value: 'Cleaning', label: 'Cleaning' },
  { value: 'Filling', label: 'Filling' },
  { value: 'Crown', label: 'Crown' },
  { value: 'Root canal', label: 'Root canal' },
  { value: 'Extraction', label: 'Extraction' },
  { value: 'Implant', label: 'Implant' },
  { value: 'Monitoring', label: 'Monitoring' },
  { value: 'Other', label: 'Other' },
];

// ─── Block Editors ──────────────────────────────────────────────────────────

function ImageCardEditor({ block, onUpdate }: {
  block: ImageBlock;
  onUpdate: (updates: Partial<ImageBlock>) => void;
}) {
  const [showAnnotation, setShowAnnotation] = useState(false);
  const [isAnnotated, setIsAnnotated] = useState(false);
  // Track the original unannotated image for clear/eraser
  const originalUrlRef = useRef<string>(block.previewUrl);
  const clinicalRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Image upload */}
      <ImageUploadZone
        previewUrl={block.previewUrl}
        onFileSelect={(file, url) => { onUpdate({ file, previewUrl: url }); setIsAnnotated(false); originalUrlRef.current = url; }}
        onGallerySelect={(url) => { onUpdate({ file: null, previewUrl: url }); setIsAnnotated(false); originalUrlRef.current = url; }}
        onAnnotate={block.previewUrl ? () => setShowAnnotation(true) : undefined}
        isAnnotated={isAnnotated}
      />

      {showAnnotation && block.previewUrl && ReactDOM.createPortal(
        <AnnotationLightbox
          imageUrl={block.previewUrl}
          originalImageUrl={originalUrlRef.current}
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
          onClick={() => {
            onUpdate({ showClinicalFields: !block.showClinicalFields });
            if (!block.showClinicalFields) {
              setTimeout(() => clinicalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
            }
          }}
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
          <div ref={clinicalRef} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: space[3],
            marginTop: space[3],
          }}>
            <DropdownList
              placeholder="Diagnosis"
              options={DIAGNOSIS_ITEMS}
              value={block.diagnosis}
              onChange={(v) => onUpdate({ diagnosis: v })}
              fullWidth
              menuPlacement="top"
            />
            <DropdownList
              placeholder="Treatment"
              options={TREATMENT_ITEMS}
              value={block.treatment}
              onChange={(v) => onUpdate({ treatment: v })}
              fullWidth
              menuPlacement="top"
            />
            <div>
              <input
                type="text"
                value={block.estimatedCost}
                onChange={(e) => onUpdate({ estimatedCost: e.target.value })}
                placeholder="Est. cost"
                style={{
                  width: '100%',
                  padding: `${space[3]} ${space[4]}`,
                  fontFamily: font.family,
                  fontSize: font.size.base,
                  color: block.estimatedCost ? color.textDefault : color.textPlaceholder,
                  backgroundColor: color.bgSurface,
                  border: `1px solid ${color.borderDefault}`,
                  borderRadius: radius.sm,
                  outline: 'none',
                  boxSizing: 'border-box' as const,
                  transition: transition.input,
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = color.primary; e.currentTarget.style.boxShadow = shadow.focusPrimaryLight; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = color.borderDefault; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>
            <DatePicker
              placeholder="Date"
              value={block.treatmentDate}
              onChange={(v) => onUpdate({ treatmentDate: v })}
              fullWidth
            />
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

function NotesCardEditor({ block, onUpdate }: {
  block: NotesBlock;
  onUpdate: (updates: Partial<NotesBlock>) => void;
}) {
  return (
    <div>
      <FieldLabel>Clinical Notes</FieldLabel>
      <TextArea
        value={block.content}
        onChange={(v) => onUpdate({ content: v })}
        placeholder="Write clinical notes, observations, or additional comments..."
        rows={4}
      />
    </div>
  );
}

function RxCardEditor({ block, onUpdate }: {
  block: RxBlock;
  onUpdate: (updates: Partial<RxBlock>) => void;
}) {
  const updateItem = (id: string, field: keyof RxBlock['items'][0], value: string) => {
    onUpdate({ items: block.items.map((it) => it.id === id ? { ...it, [field]: value } : it) });
  };

  const addItem = () => {
    onUpdate({ items: [...block.items, { id: `rx-${Date.now()}`, medication: '', dosage: '', frequency: '', duration: '' }] });
  };

  const removeItem = (id: string) => {
    if (block.items.length <= 1) return;
    onUpdate({ items: block.items.filter((it) => it.id !== id) });
  };

  return (
    <>
      {block.items.map((item, i) => (
        <div key={item.id} style={{ display: 'flex', gap: space[2], alignItems: 'flex-start' }}>
          <div style={{ flex: 2 }}>
            {i === 0 && <FieldLabel>Medication</FieldLabel>}
            <TextInput value={item.medication} onChange={(v) => updateItem(item.id, 'medication', v)} placeholder="Medication name" />
          </div>
          <div style={{ flex: 1 }}>
            {i === 0 && <FieldLabel>Dosage</FieldLabel>}
            <TextInput value={item.dosage} onChange={(v) => updateItem(item.id, 'dosage', v)} placeholder="e.g. 500mg" />
          </div>
          <div style={{ flex: 1 }}>
            {i === 0 && <FieldLabel>Frequency</FieldLabel>}
            <TextInput value={item.frequency} onChange={(v) => updateItem(item.id, 'frequency', v)} placeholder="e.g. 3x daily" />
          </div>
          <div style={{ flex: 1 }}>
            {i === 0 && <FieldLabel>Duration</FieldLabel>}
            <TextInput value={item.duration} onChange={(v) => updateItem(item.id, 'duration', v)} placeholder="e.g. 7 days" />
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            style={{
              width: '28px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', backgroundColor: 'transparent',
              color: block.items.length <= 1 ? color.neutral200 : color.neutral400,
              cursor: block.items.length <= 1 ? 'not-allowed' : 'pointer',
              marginTop: i === 0 ? '20px' : 0, padding: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="3" x2="11" y2="11" /><line x1="11" y1="3" x2="3" y2="11" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        style={{
          fontSize: font.size.xs, fontWeight: font.weight.medium, color: color.primary,
          backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', gap: space[1],
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="6" y1="2" x2="6" y2="10" /><line x1="2" y1="6" x2="10" y2="6" />
        </svg>
        Add medication
      </button>
      <div>
        <FieldLabel>Additional Notes</FieldLabel>
        <TextArea value={block.notes} onChange={(v) => onUpdate({ notes: v })} placeholder="Allergies, warnings, or special instructions..." rows={2} />
      </div>
    </>
  );
}

function NextAppointmentCardEditor({ block, onUpdate }: {
  block: NextAppointmentBlock;
  onUpdate: (updates: Partial<NextAppointmentBlock>) => void;
}) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space[3] }}>
        <div>
          <FieldLabel>Date</FieldLabel>
          <TextInput value={block.date} onChange={(v) => onUpdate({ date: v })} placeholder="e.g. 2026-05-01" />
        </div>
        <div>
          <FieldLabel>Time</FieldLabel>
          <TextInput value={block.time} onChange={(v) => onUpdate({ time: v })} placeholder="e.g. 10:00 AM" />
        </div>
      </div>
      <div>
        <FieldLabel>Procedure</FieldLabel>
        <TextInput value={block.procedure} onChange={(v) => onUpdate({ procedure: v })} placeholder="e.g. Post-op check, Crown cementation" />
      </div>
      <div>
        <FieldLabel>Pre-Visit Instructions</FieldLabel>
        <TextArea value={block.instructions} onChange={(v) => onUpdate({ instructions: v })} placeholder="Any preparations the patient should do before the visit..." rows={2} />
      </div>
    </>
  );
}

function PatientInstructionsCardEditor({ block, onUpdate }: {
  block: PatientInstructionsBlock;
  onUpdate: (updates: Partial<PatientInstructionsBlock>) => void;
}) {
  const updateItem = (id: string, text: string) => {
    onUpdate({ items: block.items.map((it) => it.id === id ? { ...it, text } : it) });
  };

  const addItem = () => {
    onUpdate({ items: [...block.items, { id: `instr-${Date.now()}`, text: '' }] });
  };

  const removeItem = (id: string) => {
    if (block.items.length <= 1) return;
    onUpdate({ items: block.items.filter((it) => it.id !== id) });
  };

  return (
    <>
      <div>
        <FieldLabel>Section Title</FieldLabel>
        <TextInput value={block.title} onChange={(v) => onUpdate({ title: v })} placeholder="e.g. Post-Treatment Instructions" />
      </div>
      {block.items.map((item, i) => (
        <div key={item.id} style={{ display: 'flex', gap: space[2], alignItems: 'center' }}>
          <span style={{ fontSize: font.size.sm, color: color.textSubtle, fontWeight: font.weight.medium, minWidth: '20px' }}>
            {i + 1}.
          </span>
          <div style={{ flex: 1 }}>
            <TextInput value={item.text} onChange={(v) => updateItem(item.id, v)} placeholder="Instruction step..." />
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            style={{
              width: '28px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', backgroundColor: 'transparent',
              color: block.items.length <= 1 ? color.neutral200 : color.neutral400,
              cursor: block.items.length <= 1 ? 'not-allowed' : 'pointer', padding: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="3" x2="11" y2="11" /><line x1="11" y1="3" x2="3" y2="11" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        style={{
          fontSize: font.size.xs, fontWeight: font.weight.medium, color: color.primary,
          backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', gap: space[1],
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="6" y1="2" x2="6" y2="10" /><line x1="2" y1="6" x2="10" y2="6" />
        </svg>
        Add instruction
      </button>
    </>
  );
}

// ─── Block type labels ──────────────────────────────────────────────────────

const BLOCK_LABELS: Record<string, string> = {
  'image': 'Image',
  'comparison': 'Before / After',
  'cost-summary': 'Summary',
  'notes': 'Notes',
  'rx': 'Prescription',
  'next-appointment': 'Next Appointment',
  'patient-instructions': 'Patient Instructions',
};

// ─── Add Block Menu ─────────────────────────────────────────────────────────

const ADDABLE_BLOCKS: { type: BlockType; label: string; description: string }[] = [
  { type: 'image',         label: 'Image',          description: 'Clinical photo with notes' },
  { type: 'comparison',    label: 'Before / After',  description: 'Side-by-side comparison' },
  { type: 'cost-summary',  label: 'Summary',         description: 'Itemized cost table' },
  { type: 'notes',         label: 'Notes',           description: 'Free-form clinical notes' },
  { type: 'rx',            label: 'Prescription',    description: 'Medication & dosage details' },
  { type: 'next-appointment', label: 'Next Appointment', description: 'Schedule follow-up visit' },
  { type: 'patient-instructions', label: 'Patient Instructions', description: 'Post-treatment care checklist' },
];

export function AddBlockMenu({ onAdd, renderTrigger }: {
  onAdd: (type: BlockType) => void;
  /** Custom trigger; receives helpers to control open state. Defaults to the dashed "+ Add Section" bar. */
  renderTrigger?: (api: { open: boolean; toggle: () => void; ref: React.RefObject<HTMLButtonElement | null> }) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // Menu is roughly 7 items * 48px + padding ≈ 370px
      setOpenUp(spaceBelow < 380);
    }
    setOpen(!open);
  };

  return (
    <div style={{ position: 'relative' }}>
      {renderTrigger ? (
        renderTrigger({ open, toggle: handleOpen, ref: btnRef })
      ) : (
        <button
          ref={btnRef}
          type="button"
          onClick={handleOpen}
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
            backgroundColor: hovered || open ? 'var(--ads-background-highlight-blue)' : 'transparent',
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
      )}

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 9 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute',
            ...(openUp
              ? { bottom: '100%', marginBottom: space[1] }
              : { top: '100%', marginTop: space[1] }),
            left: 0,
            right: 0,
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

// ─── Insert-between-cards slot — Wynde-style "+" between sections ──────────

function InsertBetweenSlot({ onInsert, isLast }: {
  onInsert: (type: BlockType) => void;
  isLast: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const baseHeight = space[3]; // 12px — natural gap between cards
  const expandedHeight = '32px';
  const visible = hovered || open;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        height: visible ? expandedHeight : baseHeight,
        marginTop: isLast ? space[3] : 0,
        marginBottom: isLast ? 0 : 0,
        transition: `height ${transition.fast}`,
      }}
    >
      {visible && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          gap: space[2],
          paddingLeft: space[1],
          paddingRight: space[1],
        }}>
          <div style={{ flex: 1, height: 1, background: color.borderDefault }} />
          <AddBlockMenu
            onAdd={(type) => { onInsert(type); setOpen(false); }}
            renderTrigger={({ open: o, toggle, ref }) => (
              <button
                ref={ref}
                type="button"
                aria-label="Insert section"
                onClick={() => { setOpen(true); toggle(); }}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: color.bgSurface,
                  border: `1px solid ${o ? color.primary : color.borderDefault}`,
                  color: o ? color.primary : color.textSubtle,
                  cursor: 'pointer',
                  padding: 0,
                  transition: `border-color ${transition.fast}, color ${transition.fast}`,
                  flexShrink: 0,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="6" y1="2" x2="6" y2="10" /><line x1="2" y1="6" x2="10" y2="6" />
                </svg>
              </button>
            )}
          />
          <div style={{ flex: 1, height: 1, background: color.borderDefault }} />
        </div>
      )}
    </div>
  );
}

// ─── Exported Block Editor ──────────────────────────────────────────────────

type SupportedBlock = ImageBlock | ComparisonBlock | CostSummaryBlock | NotesBlock | RxBlock | NextAppointmentBlock | PatientInstructionsBlock;

interface BlockEditorProps {
  blocks: SupportedBlock[];
  onBlocksChange: (blocks: SupportedBlock[]) => void;
  /**
   * When set, only the matching block is rendered. The full `blocks` array
   * is still used internally for add/delete (which forward through to the
   * parent). When unset (default), every block renders as before.
   */
  activeBlockId?: string | null;
  /** Notify parent when a new block is added so it can update selection. */
  onBlockAdded?: (id: string) => void;
  /**
   * If provided, an inline "+" insert affordance appears between cards
   * (visible on hover). Called with the chosen section type and the
   * insertion index in the blocks array.
   */
  onInsert?: (type: BlockType, atIndex: number) => void;
}

export default function BlockEditor({ blocks, onBlocksChange, activeBlockId, onBlockAdded, onInsert }: BlockEditorProps) {
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
      case 'notes':
        return { id, type: 'notes', collapsed: false, content: '' };
      case 'rx':
        return {
          id, type: 'rx', collapsed: false, notes: '',
          items: [{ id: `rx-${Date.now()}`, medication: '', dosage: '', frequency: '', duration: '' }],
        };
      case 'next-appointment':
        return {
          id, type: 'next-appointment', collapsed: false,
          date: '', time: '', procedure: '', instructions: '',
        };
      case 'patient-instructions':
        return {
          id, type: 'patient-instructions', collapsed: false,
          title: 'Post-Treatment Instructions',
          items: [{ id: `instr-${Date.now()}`, text: '' }],
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
    const created = createBlock(type);
    onBlocksChange([...blocks, created]);
    onBlockAdded?.(created.id);
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
    if (newBlocks[0]) onBlockAdded?.(newBlocks[0].id);
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
    if (newBlocks[0]) onBlockAdded?.(newBlocks[0].id);
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
    if (block.type === 'patient-instructions') return (block as PatientInstructionsBlock).title || 'Patient Instructions';
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
      case 'notes':
        return <NotesCardEditor block={block} onUpdate={(u) => updateBlock(block.id, u)} />;
      case 'rx':
        return <RxCardEditor block={block} onUpdate={(u) => updateBlock(block.id, u)} />;
      case 'next-appointment':
        return <NextAppointmentCardEditor block={block} onUpdate={(u) => updateBlock(block.id, u)} />;
      case 'patient-instructions':
        return <PatientInstructionsCardEditor block={block} onUpdate={(u) => updateBlock(block.id, u)} />;
      default:
        return null;
    }
  };

  // Inline-edit mode: every block always renders as its own card. activeBlockId
  // is used only to highlight the currently focused card in the right pane.
  const singleMode = false;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {blocks.map((block, i) => {
        return (
          <React.Fragment key={block.id}>
            <BlockCardShell
              blockId={block.id}
              label={getBlockLabel(block, i)}
              thumbnail={getBlockThumbnail(block)}
              blockType={block.type}
              collapsed={singleMode ? false : block.collapsed}
              index={i}
              isActive={block.id === activeBlockId}
              onDelete={() => deleteBlock(block.id)}
              onDuplicate={() => duplicateBlock(block.id)}
              onToggleCollapse={() => toggleCollapse(block.id)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isDragTarget={dragOverIndex === i && dragIndex !== i}
              hideDragHandle={singleMode}
              hideChrome={singleMode}
            >
              {renderBlockContent(block)}
            </BlockCardShell>
            {onInsert && (
              <InsertBetweenSlot
                isLast={i === blocks.length - 1}
                onInsert={(type) => onInsert(type, i + 1)}
              />
            )}
          </React.Fragment>
        );
      })}

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

      {/* Sticky footer removed — adding sections happens via the + button
          in the left nav; image uploads happen via each ImageCardEditor. */}

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
        backgroundColor: hovered ? 'var(--ads-background-highlight-blue)' : 'transparent',
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
