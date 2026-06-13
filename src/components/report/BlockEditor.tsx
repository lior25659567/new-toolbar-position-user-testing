import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Undo2, Redo2 } from 'lucide-react';
import { notify } from '../../design-system/notify';
import { color, font, space, radius, shadow, transition } from '../../design-system/tokens';
import { SecondaryButton } from '../../design-system/SecondaryButton';
import { PrimaryButton } from '../../design-system/PrimaryButton';
import { DropdownList } from '../../design-system/DropdownList';
import { DatePicker } from '../../design-system/DatePicker';
import { Checkbox } from '../../design-system/Checkbox';
import ToothSelector from './ToothSelector';
import { BlockTypeIcon } from './BlockNavList';
import { getGalleryBus } from './reportDemoGalleryBus';
import { BLOCK_TYPE_TINT } from './blockTheme';
import type {
  ReportBlock, ImageBlock, ComparisonBlock, CostSummaryBlock, BlockType,
  NotesBlock, RxBlock, NextAppointmentBlock, PatientInstructionsBlock,
} from './types';

// ─── Image upload validation ─────────────────────────────────────────────────

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB

/** Returns true if the file is a usable image; otherwise toasts the reason. */
function isValidImageFile(file: File): boolean {
  if (!file.type.startsWith('image/')) {
    notify.error(`"${file.name}" isn't a supported image file`);
    return false;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    notify.error(`"${file.name}" is larger than 10MB`);
    return false;
  }
  return true;
}

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
        // Leave a gap above the card when it's scrolled into view (nav select →
        // scrollIntoView block:'start'); otherwise it sits squeezed against the
        // top with no breathing room above it.
        scrollMarginTop: space[4],
        // Right-side cards don't show "selected" state — only the left nav does.
        // Cards still react to drag-target and hover.
        border: `1px solid ${isDragTarget ? color.primary : hovered ? color.borderHover : color.borderDefault}`,
        borderRadius: radius.lg,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        overflow: 'hidden',
        boxShadow: hovered ? shadow.sm : 'none',
      }}
    >
      {/* Card header — Wynde-style: drag · number · type chip · title · actions.
          Clicking anywhere on the header (except the drag handle / actions) toggles collapse. */}
      <div
        onClick={onToggleCollapse}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: space[3],
          padding: `${space[3]} ${space[4]}`,
          borderBottom: collapsed ? 'none' : `1px solid ${color.borderDefault}`,
          backgroundColor: 'transparent',
          userSelect: 'none',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: space[2], minWidth: 0, flex: 1 }}>
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
              background: (blockType && BLOCK_TYPE_TINT[blockType] ? BLOCK_TYPE_TINT[blockType].bg : color.neutral100),
              color: (blockType && BLOCK_TYPE_TINT[blockType] ? BLOCK_TYPE_TINT[blockType].fg : color.textSubtle),
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
            aria-label={collapsed ? 'Expand block' : 'Collapse block'}
            aria-expanded={!collapsed}
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
      aria-label={title}
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
import occlusalView from '../../assets/button-images/default/3d-model-upper.png';
import model3dLower from '../../assets/button-images/default/3d-model-lower.png';
import dentalArchColor from '../../assets/button-images/default/dental-arch-color.png';
import archGrayscale from '../../assets/button-images/monochrome/dental-arch-grayscale.png';
import archColorFeedback from '../../assets/button-images/default/dental-arch-color-feedback.png';
import archGrayscaleFeedback from '../../assets/button-images/default/dental-arch-grayscale-feedback.png';
import marginView from '../../assets/button-images/margin-line/dental-arch-margin-view.png';
import prepModel1 from '../../assets/button-images/prep-qc/prep-model-1.png';
import prepModel2 from '../../assets/button-images/prep-qc/prep-model-2.png';
import toothCrown from '../../assets/button-images/teeth/crown.svg';
import toothImplant from '../../assets/button-images/teeth/implant.svg';
import toothMolar from '../../assets/button-images/teeth/molar.svg';
import toothIncisor from '../../assets/button-images/teeth/incisor.svg';
// Demo case images (implant → crown sequence), in report-flow order.
import demoPreop from '../../assets/Report images/1.png';
import demoImplantXray from '../../assets/Report images/2.png';
import demoImplantPlaced from '../../assets/Report images/3.png';
import demoHealing from '../../assets/Report images/4.png';
import demoFinalCrown from '../../assets/Report images/5.png';

type GalleryCategory = 'full-arch' | 'restorative' | 'single-tooth' | 'diagnostics';

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  'full-arch': 'Full Arch Scans',
  'restorative': 'Crown, Prep & Implant',
  'single-tooth': 'Single Tooth',
  'diagnostics': 'NIRI & Diagnostics',
};

const CATEGORY_ORDER: GalleryCategory[] = ['full-arch', 'restorative', 'single-tooth', 'diagnostics'];

interface GalleryImage {
  /** Stable unique id — selection is keyed by this, never by url (two
   *  entries may legitimately share the same image file). */
  id: string;
  url: string;
  label: string;
  category: GalleryCategory;
}

const GALLERY_IMAGES: GalleryImage[] = [
  // ── Demo case (implant → crown), kept first and in the report-flow order so
  //    the self-driving demo picks the right photo for each slot (0..4). ──
  { id: 'demo-preop',         url: demoPreop,             label: 'Pre-op site #19',     category: 'single-tooth' },
  { id: 'demo-implant-xray',  url: demoImplantXray,       label: 'Implant X-ray',       category: 'diagnostics' },
  { id: 'demo-implant-placed', url: demoImplantPlaced,    label: 'Implant placed',      category: 'restorative' },
  { id: 'demo-healing',       url: demoHealing,           label: 'Healing abutment',    category: 'restorative' },
  { id: 'demo-final-crown',   url: demoFinalCrown,        label: 'Final crown',         category: 'restorative' },
  { id: 'upper-arch-color',   url: upperArchColor,        label: 'Upper arch (color)',  category: 'full-arch' },
  { id: 'lower-arch-3d',      url: model3dLower,          label: 'Lower arch (3D)',     category: 'full-arch' },
  { id: 'dental-arch-color',  url: dentalArchColor,       label: 'Dental arch (color)', category: 'full-arch' },
  { id: 'occlusal-view',      url: occlusalView,          label: 'Occlusal view',       category: 'full-arch' },
  { id: 'arch-monochrome',    url: archGrayscale,         label: 'Monochrome arch',     category: 'full-arch' },
  { id: 'crown',              url: toothCrown,            label: 'Crown',               category: 'restorative' },
  { id: 'implant',            url: toothImplant,          label: 'Implant',             category: 'restorative' },
  { id: 'crown-prep',         url: prepModel1,            label: 'Crown prep',          category: 'restorative' },
  { id: 'onlay-prep',         url: prepModel2,            label: 'Onlay prep',          category: 'restorative' },
  { id: 'margin-line-view',   url: marginView,            label: 'Margin line',         category: 'restorative' },
  { id: 'tooth-molar',        url: toothMolar,            label: 'Molar',               category: 'single-tooth' },
  { id: 'tooth-incisor',      url: toothIncisor,          label: 'Incisor',             category: 'single-tooth' },
  { id: 'lower-arch-niri',    url: lowerArchNiri,         label: 'Lower arch (NIRI)',   category: 'diagnostics' },
  { id: 'arch-color-fb',      url: archColorFeedback,     label: 'Color + feedback',    category: 'diagnostics' },
  { id: 'arch-gray-fb',       url: archGrayscaleFeedback, label: 'Grayscale + feedback', category: 'diagnostics' },
];

// ─── Hidden gallery edit mode (curation overlay) ────────────────────────────
// Press `e` while the Image Gallery modal is open to toggle a hidden edit mode
// where images can be removed and photos uploaded. Edits persist to
// localStorage on this browser so they survive refresh and show to anyone using
// this browser — but there is no on-screen affordance, so test users never see
// the controls. "Export to code" copies the overlay so it can be baked into
// GALLERY_IMAGES permanently. Uploaded photos are stored as data URLs.

const GALLERY_EDITS_KEY = 'reportGalleryEdits';

interface GalleryEdits {
  /** Ids of built-in GALLERY_IMAGES entries the curator removed. */
  removedIds: string[];
  /** Uploaded images (url is a data URL). */
  added: GalleryImage[];
}

const EMPTY_GALLERY_EDITS: GalleryEdits = { removedIds: [], added: [] };

function loadGalleryEdits(): GalleryEdits {
  try {
    const raw = localStorage.getItem(GALLERY_EDITS_KEY);
    if (!raw) return EMPTY_GALLERY_EDITS;
    const parsed = JSON.parse(raw);
    return {
      removedIds: Array.isArray(parsed?.removedIds) ? parsed.removedIds.filter((x: unknown) => typeof x === 'string') : [],
      added: Array.isArray(parsed?.added)
        ? parsed.added.filter((a: unknown): a is GalleryImage =>
            !!a && typeof (a as GalleryImage).id === 'string' && typeof (a as GalleryImage).url === 'string')
        : [],
    };
  } catch {
    return EMPTY_GALLERY_EDITS;
  }
}

function saveGalleryEdits(edits: GalleryEdits): boolean {
  try {
    localStorage.setItem(GALLERY_EDITS_KEY, JSON.stringify(edits));
    return true;
  } catch {
    return false; // likely quota exceeded (too many / too large photos)
  }
}

function getEffectiveGalleryImages(edits: GalleryEdits): GalleryImage[] {
  const base = GALLERY_IMAGES.filter((g) => !edits.removedIds.includes(g.id));
  return [...base, ...edits.added];
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// ─── Image Upload Zone (change image within a card) ─────────────────────────

function ImageUploadZone({ previewUrl, onFileSelect, onGallerySelect, onGalleryMultiSelect, onAnnotate, isAnnotated }: {
  previewUrl: string;
  onFileSelect: (file: File, url: string) => void;
  onGallerySelect: (url: string) => void;
  /** When provided, the gallery allows picking several images at once. */
  onGalleryMultiSelect?: (urls: string[]) => void;
  onAnnotate?: () => void;
  isAnnotated?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showGallery, setShowGallery] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidImageFile(file)) onFileSelect(file, URL.createObjectURL(file));
    e.target.value = '';
  };

  if (previewUrl) {
    return (
      <div style={{ position: 'relative' }}>
        <img
          src={previewUrl}
          alt="Uploaded clinical image"
          style={{
            width: '100%',
            aspectRatio: '4 / 3',
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
          multiSelect={!!onGalleryMultiSelect}
          onMultiSelect={onGalleryMultiSelect ? (urls) => { onGalleryMultiSelect(urls); setShowGallery(false); } : undefined}
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
      aria-label={label}
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
        gap: space[1],
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
  // Inline text annotations — placed, editable & draggable directly on the
  // image (display-pixel coords relative to the canvas), baked in on save.
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  type TextItem = { id: string; x: number; y: number; text: string; color: string; sizePx: number };
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  // Set on each text keystroke; lets blur commit a history entry only when the
  // text actually changed (avoids no-op snapshots on focus/blur).
  const textEditedRef = useRef(false);

  // ── Undo / redo ──────────────────────────────────────────────────────────
  // Snapshot history: each entry captures the full annotation state — the canvas
  // pixels (pen/eraser) AND the text overlays — so undo/redo restores a
  // consistent pair regardless of which action is being reverted. A snapshot is
  // committed after each completed action (stroke end, erase, clear, text
  // add/edit/remove/move), the standard pattern for raster annotation tools.
  const MAX_HISTORY = 30;
  const history = useRef<{ image: ImageData; texts: TextItem[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex >= 0 && historyIndex < history.current.length - 1;

  // `textsOverride` lets callers that have just called setTexts() pass the new
  // array explicitly — React state isn't updated until the next render, so
  // reading `texts` immediately after setTexts() would snapshot the stale value.
  const snapshot = useCallback((textsOverride?: TextItem[]): { image: ImageData; texts: TextItem[] } | null => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || canvas.width === 0) return null;
    const src = textsOverride ?? texts;
    return { image: ctx.getImageData(0, 0, canvas.width, canvas.height), texts: src.map((t) => ({ ...t })) };
  }, [texts]);

  const pushHistory = useCallback((textsOverride?: TextItem[]) => {
    const snap = snapshot(textsOverride);
    if (!snap) return;
    const base = history.current.slice(0, historyIndex + 1);
    base.push(snap);
    const overflow = base.length - MAX_HISTORY;
    history.current = overflow > 0 ? base.slice(overflow) : base;
    setHistoryIndex(history.current.length - 1);
  }, [snapshot, historyIndex]);

  // Always points at the latest pushHistory so handlers captured in a closure
  // (e.g. the text-drag mouseup bound at drag start) commit current state.
  const pushHistoryRef = useRef(pushHistory);
  pushHistoryRef.current = pushHistory;

  const restore = useCallback((idx: number) => {
    const entry = history.current[idx];
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!entry || !canvas || !ctx) return;
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.putImageData(entry.image, 0, 0);
    setTexts(entry.texts.map((t) => ({ ...t })));
    setEditingTextId(null);
  }, []);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const next = historyIndex - 1;
    restore(next);
    setHistoryIndex(next);
  }, [historyIndex, restore]);

  const redo = useCallback(() => {
    if (historyIndex >= history.current.length - 1) return;
    const next = historyIndex + 1;
    restore(next);
    setHistoryIndex(next);
  }, [historyIndex, restore]);

  // Keyboard shortcuts: ⌘/Ctrl+Z = undo, ⌘/Ctrl+Shift+Z or ⌘/Ctrl+Y = redo.
  // Skipped while a text field is focused so native text editing keeps its own undo.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      const key = e.key.toLowerCase();
      if (key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
      } else if (key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  const startTextDrag = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const wrap = canvasWrapRef.current;
    const item = texts.find((t) => t.id === id);
    if (!wrap || !item) return;
    const rect = wrap.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - item.x;
    const offsetY = e.clientY - rect.top - item.y;
    const onMove = (ev: MouseEvent) => {
      const x = ev.clientX - rect.left - offsetX;
      const y = ev.clientY - rect.top - offsetY;
      setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, x, y } : t)));
    };
    let moved = false;
    const onMoveTracked = (ev: MouseEvent) => { moved = true; onMove(ev); };
    const onUp = () => {
      window.removeEventListener('mousemove', onMoveTracked);
      window.removeEventListener('mouseup', onUp);
      if (moved) pushHistoryRef.current(); // commit the final position
    };
    window.addEventListener('mousemove', onMoveTracked);
    window.addEventListener('mouseup', onUp);
  };

  const removeText = (id: string) => {
    const next = texts.filter((t) => t.id !== id);
    setTexts(next);
    setEditingTextId((cur) => (cur === id ? null : cur));
    pushHistory(next);
  };

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

      // Seed undo history with the freshly loaded canvas as the baseline state.
      const seedHistory = () => {
        history.current = [{ image: ctx.getImageData(0, 0, canvas.width, canvas.height), texts: [] }];
        setHistoryIndex(0);
      };

      // Now load the current (possibly annotated) image to draw on canvas
      if (imageUrl !== originalImageUrl) {
        const curImg = new Image();
        curImg.crossOrigin = 'anonymous';
        curImg.onload = () => {
          if (cancelled) return;
          ctx.drawImage(curImg, 0, 0, canvas.width, canvas.height);
          seedHistory();
        };
        curImg.src = imageUrl;
      } else {
        ctx.drawImage(origImg, 0, 0, canvas.width, canvas.height);
        seedHistory();
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

    // Text tool: drop an inline, editable & draggable text box at the click
    // point (display coords) — no modal/prompt.
    if (tool === 'text') {
      const wrap = canvasWrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      const id = `text-${Date.now()}`;
      setTexts((prev) => [...prev, {
        id,
        x: clientX - rect.left,
        y: clientY - rect.top,
        text: '',
        color: brushColor,
        sizePx: Math.max(14, brushSize * 4),
      }]);
      setEditingTextId(id);
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
    const wasDrawing = isDrawing.current;
    isDrawing.current = false;
    lastPos.current = null;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
    if (wasDrawing) pushHistory(); // commit the completed pen/eraser stroke
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas || !cleanCanvasRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(cleanCanvasRef.current, 0, 0);
    setTexts([]);
    setEditingTextId(null);
    pushHistory([]); // commit the cleared state (blank canvas + no text)
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Bake inline text annotations onto the canvas before exporting.
    const ctx = canvas.getContext('2d');
    if (ctx && texts.length) {
      const rect = canvas.getBoundingClientRect();
      const scale = rect.width ? canvas.width / rect.width : 1;
      ctx.save();
      ctx.textBaseline = 'top';
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      texts.forEach((t) => {
        if (!t.text.trim()) return;
        ctx.font = `${Math.round(t.sizePx * scale)}px Inter, "Helvetica Neue", Arial, sans-serif`;
        ctx.fillStyle = t.color;
        ctx.fillText(t.text, t.x * scale, t.y * scale);
      });
      ctx.restore();
    }
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
        width: '960px',
        maxWidth: '96vw',
        height: '85vh',
        maxHeight: '94vh',
        backgroundColor: color.white,
        borderRadius: radius.xl,
        boxShadow: shadow.lg,
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
                aria-label={t.label}
                aria-pressed={tool === t.id}
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
                aria-label={`Brush color ${c}`}
                aria-pressed={brushColor === c}
                onClick={() => setBrushColor(c)}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: radius.full,
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
          <div style={{ display: 'flex', gap: space[1], alignItems: 'center' }}>
            {BRUSH_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                aria-label={`Brush size ${s}`}
                aria-pressed={brushSize === s}
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
                  borderRadius: radius.full,
                  backgroundColor: color.textDefault,
                }} />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '24px', backgroundColor: color.borderDefault }} />

          {/* Undo / Redo */}
          <div style={{ display: 'flex', gap: '2px' }}>
            {([
              { label: 'Undo', hint: 'Undo (⌘Z)', icon: <Undo2 size={16} />, onClick: undo, enabled: canUndo },
              { label: 'Redo', hint: 'Redo (⌘⇧Z)', icon: <Redo2 size={16} />, onClick: redo, enabled: canRedo },
            ]).map((b) => (
              <button
                key={b.label}
                type="button"
                title={b.hint}
                aria-label={b.label}
                disabled={!b.enabled}
                onClick={b.onClick}
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
                  cursor: b.enabled ? 'pointer' : 'default',
                  opacity: b.enabled ? 1 : 0.35,
                  padding: 0,
                  transition: `background-color ${transition.fast}`,
                }}
                onMouseEnter={(e) => { if (b.enabled) e.currentTarget.style.backgroundColor = color.bgHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {b.icon}
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
          <div ref={canvasWrapRef} style={{ position: 'relative', display: 'inline-block', lineHeight: 0 }}>
            <canvas
              ref={canvasRef}
              aria-label="Annotation canvas"
              data-demo="annotation-canvas"
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
            {/* Inline editable + draggable text annotations */}
            {texts.map((t) => {
              const editing = editingTextId === t.id;
              return (
                <div
                  key={t.id}
                  style={{ position: 'absolute', left: t.x, top: t.y, lineHeight: 1 }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {/* Drag handle (above the text, doesn't shift baseline) */}
                  <div
                    onMouseDown={(e) => startTextDrag(t.id, e)}
                    title="Drag to move"
                    style={{
                      position: 'absolute', top: -20, left: 0,
                      display: 'flex', alignItems: 'center', gap: 2,
                      cursor: 'grab', color: color.textSubtle,
                      background: color.bgSurface, border: `1px solid ${color.borderDefault}`,
                      borderRadius: radius.sm, padding: '1px 4px',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <circle cx="9" cy="6" r="1.6" /><circle cx="15" cy="6" r="1.6" />
                      <circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" />
                      <circle cx="9" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" />
                    </svg>
                    <button
                      type="button"
                      aria-label="Remove text"
                      onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); removeText(t.id); }}
                      style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', color: color.textSubtle, display: 'flex' }}
                    >
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="3" y1="3" x2="9" y2="9" /><line x1="9" y1="3" x2="3" y2="9" /></svg>
                    </button>
                  </div>
                  <input
                    value={t.text}
                    autoFocus={editing}
                    placeholder="Type…"
                    onFocus={() => setEditingTextId(t.id)}
                    onChange={(e) => { textEditedRef.current = true; setTexts((prev) => prev.map((it) => it.id === t.id ? { ...it, text: e.target.value } : it)); }}
                    onBlur={() => {
                      setEditingTextId((cur) => (cur === t.id ? null : cur));
                      if (textEditedRef.current) { textEditedRef.current = false; pushHistory(); }
                    }}
                    style={{
                      font: `${t.sizePx}px Inter, "Helvetica Neue", Arial, sans-serif`,
                      color: t.color,
                      background: 'transparent',
                      border: `1px dashed ${editing ? color.primary : 'transparent'}`,
                      outline: 'none',
                      padding: 0,
                      margin: 0,
                      minWidth: 40,
                      width: `${Math.max(4, t.text.length + 2)}ch`,
                    }}
                  />
                </div>
              );
            })}
          </div>
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

export function GalleryOverlayModal({ onSelect, onClose, multiSelect, onMultiSelect }: {
  onSelect: (url: string) => void;
  onClose: () => void;
  multiSelect?: boolean;
  onMultiSelect?: (urls: string[]) => void;
}) {
  // Selection is keyed by image id (not url) so two entries that share the
  // same image file can't get highlighted together.
  const [selected, setSelected] = useState<string[]>([]);

  // Hidden curation overlay (see GalleryEdits above). Toggled with the `e` key.
  const [edits, setEdits] = useState<GalleryEdits>(() => loadGalleryEdits());
  const [editMode, setEditMode] = useState(false);

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredImages = React.useMemo(() => getEffectiveGalleryImages(edits), [edits]);

  const urlsForSelectedIds = () =>
    selected
      .map((id) => filteredImages.find((g) => g.id === id)?.url)
      .filter((u): u is string => !!u);

  // ── Self-driving demo support ──
  // When the report demo is active, the modal drives its OWN selection + confirm
  // using real state (so the selection is visibly highlighted and the Add button
  // genuinely enables), then closes itself. This avoids the fragile synthetic-
  // click path that doesn't register reliably in real browsers.
  useEffect(() => {
    const bus = getGalleryBus();
    if (!bus.active) return;
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(resolve, ms);
        timers.push(id);
      });
    (async () => {
      await wait(380); // let the grid paint
      const start = Math.min(Math.max(0, bus.pickIndex), Math.max(0, filteredImages.length - 1));
      const ids = filteredImages.slice(start, start + Math.max(1, bus.selectCount)).map((g) => g.id);
      for (const id of ids) {
        if (cancelled) return;
        toggleSelection(id); // real state change → border + aria-pressed
        await wait(bus.stepMs);
      }
      await wait(bus.settleMs);
      if (cancelled) return;
      // Confirm via the same callbacks the Add button uses; the in-card wrappers
      // also flip showGallery=false, which unmounts the modal.
      const urls = ids
        .map((id) => filteredImages.find((g) => g.id === id)?.url)
        .filter((u): u is string => !!u);
      if (urls.length === 0) return;
      if (multiSelect && onMultiSelect) onMultiSelect(urls);
      else onSelect(urls[0]);
    })();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // Runs once per mount; one mount == one gallery session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist curation edits as they happen, and warn if storage is full.
  useEffect(() => {
    if (!saveGalleryEdits(edits)) {
      notify.error('Gallery edits could not be saved — browser storage is full. Remove some uploaded photos.');
    }
  }, [edits]);

  // Hidden edit-mode toggle: press `e` (not while typing) to enter; `e` again to save & exit.
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key !== 'e' && ev.key !== 'E') return;
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
      const t = ev.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      ev.preventDefault();
      setEditMode((on) => {
        if (on) notify.success('Gallery saved');
        return !on;
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const removeImage = (id: string) => {
    setEdits((prev) =>
      prev.added.some((a) => a.id === id)
        ? { ...prev, added: prev.added.filter((a) => a.id !== id) }
        : { ...prev, removedIds: Array.from(new Set([...prev.removedIds, id])) }
    );
    setSelected((s) => s.filter((x) => x !== id));
  };

  const addImages = async (files: FileList | null, category: GalleryCategory) => {
    if (!files) return;
    const valid = Array.from(files).filter(isValidImageFile);
    if (valid.length === 0) return;
    const added: GalleryImage[] = [];
    for (let i = 0; i < valid.length; i++) {
      const file = valid[i];
      try {
        const url = await readFileAsDataURL(file);
        added.push({
          id: `custom-${Date.now()}-${i}`,
          url,
          label: file.name.replace(/\.[^.]+$/, '') || 'Untitled',
          category,
        });
      } catch {
        notify.error(`Could not read ${file.name}`);
      }
    }
    if (added.length > 0) setEdits((prev) => ({ ...prev, added: [...prev.added, ...added] }));
  };

  const renameImage = (id: string, label: string) => {
    setEdits((prev) => ({ ...prev, added: prev.added.map((a) => (a.id === id ? { ...a, label } : a)) }));
  };

  const exportEditsToCode = async () => {
    const payload = JSON.stringify(
      { removedIds: edits.removedIds, added: edits.added },
      null,
      2,
    );
    // eslint-disable-next-line no-console
    console.log('[Gallery curation] paste this to bake edits into GALLERY_IMAGES:\n', payload);
    try {
      await navigator.clipboard.writeText(payload);
      notify.success('Gallery edits copied to clipboard (also logged to console)');
    } catch {
      notify.info('Gallery edits logged to console (clipboard blocked)');
    }
  };

  const handleImageClick = (id: string) => {
    if (editMode) return; // in edit mode clicks are for removing/renaming, not selecting
    toggleSelection(id);
  };

  const selectMode = !editMode;

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
          width: '960px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: space[3] }}>
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
            {/* Hidden curation indicator — only ever visible to whoever pressed `e`. */}
            {editMode && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: space[1],
                  padding: `2px ${space[2]}`,
                  borderRadius: radius.full,
                  fontSize: font.size.xs,
                  fontWeight: font.weight.medium,
                  color: color.primary,
                  backgroundColor: 'var(--ds-color-primary-subtle)',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: color.primary }} />
                Edit mode · press <kbd style={{ fontFamily: font.mono, fontSize: 11 }}>e</kbd> to save &amp; exit
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: space[2] }}>
            {editMode && (
              <SecondaryButton size={36} onClick={exportEditsToCode}>
                Export to code
              </SecondaryButton>
            )}
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
        </div>

        {/* ── Image grid ── */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: space[5],
        }}>
          {filteredImages.length === 0 && !editMode ? (
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
              <span style={{ fontSize: font.size.base }}>No images</span>
            </div>
          ) : (
            /* Single flat grid — all images fill the modal, no category sections. */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: space[3],
            }}>
              {filteredImages.map((img) => (
                <GalleryThumbnail
                  key={img.id}
                  url={img.url}
                  label={img.label}
                  isSelected={selected.includes(img.id)}
                  showCheckbox={selectMode}
                  editMode={editMode}
                  onClick={() => handleImageClick(img.id)}
                  onRemove={() => removeImage(img.id)}
                  onRename={img.id.startsWith('custom-') ? (label) => renameImage(img.id, label) : undefined}
                />
              ))}
              {editMode && <GalleryAddTile onFiles={(files) => addImages(files, 'full-arch')} />}
            </div>
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
              const urls = urlsForSelectedIds();
              if (urls.length === 0) return;
              if (multiSelect && onMultiSelect) {
                onMultiSelect(urls);
              } else if (urls.length > 1 && onMultiSelect) {
                onMultiSelect(urls);
              } else {
                onSelect(urls[0]);
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

function GalleryThumbnail({ url, label, onClick, isSelected, showCheckbox, editMode, onRemove, onRename }: {
  url: string; label: string; onClick: () => void; isSelected?: boolean; showCheckbox?: boolean;
  editMode?: boolean; onRemove?: () => void; onRename?: (label: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  // Wrapper (not a <button>) so the remove control and rename input can live
  // alongside the selection button without nesting interactive elements.
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: editMode ? space[1] : 0 }}
    >
      <button
        type="button"
        data-demo={`gallery-${label.toLowerCase().replace(/[\s()]/g, '-')}`}
        onClick={onClick}
        aria-pressed={isSelected}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          padding: 0,
          border: `2px solid ${isSelected ? color.primary : 'transparent'}`,
          borderRadius: radius.lg,
          backgroundColor: 'transparent',
          cursor: editMode ? 'default' : 'pointer',
          overflow: 'hidden',
          transition: `all ${transition.fast}`,
          position: 'relative',
        }}
      >
        {/* DS checkbox — visual only; the thumbnail button handles selection */}
        {showCheckbox && (hovered || isSelected) && (
          <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 1, pointerEvents: 'none', display: 'flex' }}>
            <Checkbox checked={!!isSelected} readOnly tabIndex={-1} size={20} aria-hidden />
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
              opacity: !editMode && hovered ? 0.85 : 1,
              transition: `opacity ${transition.fast}`,
            }}
          />
        </div>
      </button>

      {/* Remove control — edit mode only */}
      {editMode && onRemove && (
        <button
          type="button"
          aria-label={`Remove ${label}`}
          title={`Remove ${label}`}
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            zIndex: 2,
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'rgba(17,17,17,0.72)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color.danger; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(17,17,17,0.72)'; }}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
          </svg>
        </button>
      )}

      {/* Inline rename — uploaded images only */}
      {editMode && onRename && (
        <input
          value={label}
          onChange={(e) => onRename(e.target.value)}
          placeholder="Label"
          aria-label="Image label"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '4px 6px',
            fontSize: font.size.xs,
            fontFamily: font.family,
            color: color.textDefault,
            border: `1px solid ${color.borderDefault}`,
            borderRadius: radius.sm,
            outline: 'none',
          }}
        />
      )}
    </div>
  );
}

// Dashed "add photo" tile shown inside each category grid while in edit mode.
function GalleryAddTile({ onFiles }: { onFiles: (files: FileList | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          aspectRatio: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: space[1],
          border: `2px dashed ${hovered ? color.primary : color.borderDefault}`,
          borderRadius: radius.lg,
          backgroundColor: hovered ? color.bgHover : 'transparent',
          color: hovered ? color.primary : color.textSubtle,
          cursor: 'pointer',
          transition: `all ${transition.fast}`,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span style={{ fontSize: font.size.xs, fontWeight: font.weight.medium }}>Add photo</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => { onFiles(e.target.files); e.target.value = ''; }}
      />
    </>
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

function ImageCardEditor({ block, onUpdate, onGalleryMulti }: {
  block: ImageBlock;
  onUpdate: (updates: Partial<ImageBlock>) => void;
  /** Apply several gallery images: the first fills this block, the rest become new image blocks. */
  onGalleryMulti?: (urls: string[]) => void;
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
        onGalleryMultiSelect={onGalleryMulti ? (urls) => {
          if (urls.length === 0) return;
          // Reset annotation state for the image that fills this block (urls[0]);
          // the parent applies urls[0] here and appends the rest as new blocks.
          setIsAnnotated(false);
          originalUrlRef.current = urls[0];
          onGalleryMulti(urls);
        } : undefined}
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
    </>
  );
}

function ComparisonCardEditor({ block, onUpdate }: {
  block: ComparisonBlock;
  onUpdate: (updates: Partial<ComparisonBlock>) => void;
}) {
  const [annotating, setAnnotating] = useState<'A' | 'B' | null>(null);
  const origA = useRef<string>(block.imageA.previewUrl);
  const origB = useRef<string>(block.imageB.previewUrl);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space[3] }}>
        <div>
          <FieldLabel>{block.labelA || 'Before'}</FieldLabel>
          <ImageUploadZone
            previewUrl={block.imageA.previewUrl}
            onFileSelect={(file, url) => { origA.current = url; onUpdate({ imageA: { file, previewUrl: url } }); }}
            onGallerySelect={(url) => { origA.current = url; onUpdate({ imageA: { file: null, previewUrl: url } }); }}
            onAnnotate={block.imageA.previewUrl ? () => setAnnotating('A') : undefined}
          />
          <div style={{ marginTop: space[2] }}>
            <TextInput value={block.labelA} onChange={(v) => onUpdate({ labelA: v })} placeholder="Label (e.g. Before)" />
          </div>
        </div>
        <div>
          <FieldLabel>{block.labelB || 'After'}</FieldLabel>
          <ImageUploadZone
            previewUrl={block.imageB.previewUrl}
            onFileSelect={(file, url) => { origB.current = url; onUpdate({ imageB: { file, previewUrl: url } }); }}
            onGallerySelect={(url) => { origB.current = url; onUpdate({ imageB: { file: null, previewUrl: url } }); }}
            onAnnotate={block.imageB.previewUrl ? () => setAnnotating('B') : undefined}
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

      {annotating && ReactDOM.createPortal(
        <AnnotationLightbox
          imageUrl={annotating === 'A' ? block.imageA.previewUrl : block.imageB.previewUrl}
          originalImageUrl={annotating === 'A' ? origA.current : origB.current}
          onSave={(annotatedUrl) => {
            if (annotating === 'A') onUpdate({ imageA: { file: null, previewUrl: annotatedUrl } });
            else onUpdate({ imageB: { file: null, previewUrl: annotatedUrl } });
            setAnnotating(null);
          }}
          onClose={() => setAnnotating(null)}
        />,
        document.body
      )}
    </>
  );
}

function SummaryCardEditor({ block, onUpdate }: {
  block: CostSummaryBlock;
  onUpdate: (updates: Partial<CostSummaryBlock>) => void;
}) {
  return (
    <div>
      <FieldLabel>Summary</FieldLabel>
      <TextArea
        value={block.content ?? ''}
        onChange={(v) => onUpdate({ content: v })}
        placeholder="Write a summary..."
        rows={4}
      />
    </div>
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
              marginTop: i === 0 ? space[5] : 0, padding: 0,
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

// Half-hour appointment slots (8:00 AM – 6:30 PM) for the DS time dropdown.
const TIME_SLOTS: { value: string; label: string }[] = (() => {
  const slots: { value: string; label: string }[] = [];
  for (let h = 8; h <= 18; h++) {
    for (const m of [0, 30]) {
      const ampm = h < 12 ? 'AM' : 'PM';
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      const label = `${hour12}:${m === 0 ? '00' : '30'} ${ampm}`;
      slots.push({ value: label, label });
    }
  }
  return slots;
})();

function NextAppointmentCardEditor({ block, onUpdate }: {
  block: NextAppointmentBlock;
  onUpdate: (updates: Partial<NextAppointmentBlock>) => void;
}) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space[3] }}>
        <div>
          <FieldLabel>Date</FieldLabel>
          <DatePicker value={block.date} onChange={(v) => onUpdate({ date: v })} placeholder="Select date" fullWidth />
        </div>
        <div>
          <FieldLabel>Time</FieldLabel>
          <DropdownList options={TIME_SLOTS} value={block.time} onChange={(v) => onUpdate({ time: v })} placeholder="Select time" fullWidth menuPlacement="bottom" />
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
  { type: 'cost-summary',  label: 'Summary',         description: 'Free-text cost summary' },
  { type: 'notes',         label: 'Notes',           description: 'Free-form clinical notes' },
  { type: 'rx',            label: 'Prescription',    description: 'Medication & dosage details' },
  { type: 'next-appointment', label: 'Next Appointment', description: 'Schedule follow-up visit' },
  { type: 'patient-instructions', label: 'Patient Instructions', description: 'Post-treatment care checklist' },
];

export function AddBlockMenu({ onAdd, renderTrigger, onOpenChange, onAddImageGallery }: {
  onAdd: (type: BlockType) => void;
  /** Custom trigger; receives helpers to control open state. Defaults to the dashed "+ Add Block" bar. */
  renderTrigger?: (api: { open: boolean; toggle: () => void; ref: React.RefObject<HTMLButtonElement | null> }) => React.ReactNode;
  /** Fires whenever the menu opens/closes (incl. backdrop dismiss) so callers can sync their own UI. */
  onOpenChange?: (open: boolean) => void;
  /** When provided, adds an "Image gallery" entry that opens the multi-select gallery (one block per image). */
  onAddImageGallery?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Keep external callers (e.g. the insert-between slot) in sync with every
  // open/close — including backdrop dismissal — so their UI never gets stuck.
  useEffect(() => { onOpenChange?.(open); }, [open, onOpenChange]);
  // Fixed-viewport position so the menu escapes the scrolling nav rail's
  // overflow clipping (the rail is 300px wide with overflow:auto).
  const [pos, setPos] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const MENU_W = 300;
      let left = rect.left;
      if (left + MENU_W > window.innerWidth - 8) left = window.innerWidth - MENU_W - 8;
      if (left < 8) left = 8;
      // Open just below the trigger; the layout effect clamps it into view.
      setPos({ left, top: rect.bottom + 4 });
    }
    setOpen(!open);
  };

  // After the menu renders we know its real height, so clamp it fully into the
  // viewport — when there isn't room below the trigger it slides up to stay
  // entirely visible beside it (rather than dropping off-screen).
  React.useLayoutEffect(() => {
    if (!open || !menuRef.current) return;
    const m = menuRef.current.getBoundingClientRect();
    const MARGIN = 8;
    let left = m.left;
    let top = m.top;
    if (m.bottom > window.innerHeight - MARGIN) top = window.innerHeight - m.height - MARGIN;
    if (top < MARGIN) top = MARGIN;
    if (m.right > window.innerWidth - MARGIN) left = window.innerWidth - m.width - MARGIN;
    if (left < MARGIN) left = MARGIN;
    if (Math.abs(left - m.left) > 0.5 || Math.abs(top - m.top) > 0.5) {
      setPos({ left, top });
    }
  }, [open]);

  return (
    <div style={{ position: 'relative' }}>
      {renderTrigger ? (
        renderTrigger({ open, toggle: handleOpen, ref: btnRef })
      ) : (
        <span ref={btnRef as unknown as React.Ref<HTMLSpanElement>} style={{ display: 'block' }}>
          <SecondaryButton
            size={36}
            fullWidth
            selected={open}
            onClick={handleOpen}
            data-demo="add-block-trigger"
            style={{ backgroundColor: color.bgSurface, boxShadow: 'none' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="7" y1="3" x2="7" y2="11" /><line x1="3" y1="7" x2="11" y2="7" />
            </svg>
            Add Block
          </SecondaryButton>
        </span>
      )}

      {open && ReactDOM.createPortal(
        <>
          <div data-demo="addmenu-backdrop" style={{ position: 'fixed', inset: 0, zIndex: 9998 }} onClick={() => setOpen(false)} />
          <div ref={menuRef} style={{
            position: 'fixed',
            left: pos.left,
            top: pos.top,
            width: 300,
            maxWidth: '90vw',
            maxHeight: '92vh',
            overflowY: 'auto',
            backgroundColor: color.bgSurface,
            border: `1px solid ${color.borderDefault}`,
            borderRadius: radius.lg,
            boxShadow: shadow.lg,
            zIndex: 9999,
            padding: space[2],
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}>
            {ADDABLE_BLOCKS.map((item) => (
              <MenuRow
                key={item.type}
                type={item.type}
                label={item.label}
                description={item.description}
                demoId={`add-block-${item.type}`}
                onClick={() => { onAdd(item.type); setOpen(false); }}
              />
            ))}
            {onAddImageGallery && (
              <MenuRow
                type="image"
                label="Image gallery"
                description="Pick multiple photos at once — one block each"
                demoId="add-block-gallery"
                onClick={() => { onAddImageGallery(); setOpen(false); }}
              />
            )}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

function MenuRow({ type, label, description, onClick, demoId }: {
  type: BlockType; label: string; description: string; onClick: () => void; demoId?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const c = BLOCK_TYPE_TINT[type] ?? { bg: color.neutral100, fg: color.textSubtle };
  return (
    <button
      type="button"
      data-demo={demoId}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: space[3],
        padding: `${space[3]} ${space[3]}`,
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
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: c.bg,
        color: c.fg,
        borderRadius: radius.md,
        flexShrink: 0,
      }}>
        <BlockTypeIcon type={type} size={16} />
      </div>
      <div style={{ minWidth: 0, paddingTop: 1 }}>
        <div style={{ fontSize: font.size.sm, fontWeight: font.weight.semibold, color: color.textHeading }}>{label}</div>
        <div style={{ fontSize: font.size.xs, color: color.textSubtle, lineHeight: font.lineHeight.normal, marginTop: 2 }}>{description}</div>
      </div>
    </button>
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
}

export default function BlockEditor({ blocks, onBlocksChange, activeBlockId, onBlockAdded }: BlockEditorProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

  // Multi-select from within an image block's gallery: the first picked image
  // fills the originating block, the rest are inserted as new image blocks
  // right after it. Done in one onBlocksChange so the first-image update and
  // the inserts aren't built from a stale `blocks` closure.
  const applyGalleryMulti = (blockId: string, urls: string[]) => {
    if (urls.length === 0) return;
    const idx = blocks.findIndex((b) => b.id === blockId);
    if (idx === -1) return;
    const [first, ...rest] = urls;
    const base = Date.now();
    const created = rest.map((url, k) => ({
      ...(createBlock('image') as ImageBlock),
      id: `block-${base}-${k}`,
      previewUrl: url,
    }) as SupportedBlock);
    const next = blocks.map((b) =>
      b.id === blockId ? ({ ...b, file: null, previewUrl: first } as SupportedBlock) : b
    );
    next.splice(idx + 1, 0, ...created);
    onBlocksChange(next);
    if (created.length > 0) onBlockAdded?.(created[created.length - 1].id);
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
        return <ImageCardEditor block={block} onUpdate={(u) => updateBlock(block.id, u)} onGalleryMulti={(urls) => applyGalleryMulti(block.id, urls)} />;
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: space[3] }}>
      {blocks.map((block, i) => {
        return (
            <BlockCardShell
              key={block.id}
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
        );
      })}

      {/* Adding blocks happens via the + button in the left nav; image
          uploads happen via each ImageCardEditor. Adding multiple gallery
          images at once is handled by PatientReportPage (Add Block →
          Image gallery). */}
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
