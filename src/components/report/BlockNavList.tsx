import * as React from "react";
import {
  Image as ImageIcon, Columns2, Receipt, StickyNote, Pill,
  CalendarClock, ClipboardCheck, Square,
} from "lucide-react";
import { color, font, radius, shadow, space, transition } from "../../design-system/tokens";
import { SecondaryButton } from "../../design-system/SecondaryButton";
import { BLOCK_TYPE_TINT } from "./blockTheme";
import type {
  BlockType, ImageBlock, ComparisonBlock, CostSummaryBlock, NotesBlock,
  RxBlock, NextAppointmentBlock, PatientInstructionsBlock,
} from "./types";
import { AddBlockMenu } from "./BlockEditor";

type SupportedBlock =
  | ImageBlock | ComparisonBlock | CostSummaryBlock | NotesBlock
  | RxBlock | NextAppointmentBlock | PatientInstructionsBlock;

interface BlockNavListProps {
  blocks: SupportedBlock[];
  activeBlockId: string | null;
  onSelect: (id: string) => void;
  onReorder: (next: SupportedBlock[]) => void;
  /** Called when the user picks a block type from the "+ Add block" popover. */
  onAdd?: (type: BlockType) => void;
  /** Called when the user inserts a block between two rows. atIndex is the position to insert at. */
  onInsert?: (type: BlockType, atIndex: number) => void;
  /** Called when the user picks "Image gallery" — opens the multi-select gallery (one block per image). */
  onAddImageGallery?: () => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const BLOCK_TYPE_LABEL: Record<string, string> = {
  image: "Image",
  comparison: "Comparison",
  "cost-summary": "Cost summary",
  notes: "Notes",
  rx: "Rx",
  "next-appointment": "Appointment",
  "patient-instructions": "Instructions",
};

/** Per-block-type icon, sourced from lucide-react. Single-color via currentColor. */
const BLOCK_TYPE_ICON: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  image: ImageIcon,
  comparison: Columns2,
  "cost-summary": Receipt,
  notes: StickyNote,
  rx: Pill,
  "next-appointment": CalendarClock,
  "patient-instructions": ClipboardCheck,
};

export function BlockTypeIcon({ type, size = 14 }: { type: BlockType; size?: number }) {
  const LucideIcon = BLOCK_TYPE_ICON[type] ?? Square;
  return <LucideIcon size={size} strokeWidth={1.6} />;
}

function getBlockTitle(block: SupportedBlock, i: number): string {
  if (block.type === "image") return (block as ImageBlock).title || `Image ${i + 1}`;
  if (block.type === "patient-instructions") return (block as PatientInstructionsBlock).title || "Patient Instructions";
  return BLOCK_TYPE_LABEL[block.type] || `Block ${i + 1}`;
}

function getThumbnail(block: SupportedBlock): string | undefined {
  if (block.type === "image") return (block as ImageBlock).previewUrl || undefined;
  if (block.type === "comparison") return (block as ComparisonBlock).imageA?.previewUrl || undefined;
  return undefined;
}

export default function BlockNavList({ blocks, activeBlockId, onSelect, onReorder, onAdd, onInsert, onAddImageGallery, onDuplicate, onDelete }: BlockNavListProps) {
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);
  // Which half of the hovered row the cursor is in — drives the precise
  // above/below drop indicator (true = insert before this row).
  const [overBefore, setOverBefore] = React.useState<boolean>(true);

  // Shared reorder used by both drag-and-drop and keyboard move.
  const move = (from: number, to: number) => {
    if (from === to || to < 0 || to >= blocks.length) return;
    const next = [...blocks];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onReorder(next);
  };

  const resetDrag = () => { setDragIndex(null); setOverIndex(null); };

  // Insertion-based drop: `insertAt` is the gap index (0..length) where the
  // dragged row should land, so dropping above vs. below a row is exact.
  const handleDropAt = (insertAt: number) => {
    if (dragIndex === null) { resetDrag(); return; }
    const next = [...blocks];
    const [moved] = next.splice(dragIndex, 1);
    const adj = insertAt > dragIndex ? insertAt - 1 : insertAt;
    if (adj !== dragIndex) { next.splice(adj, 0, moved); onReorder(next); }
    resetDrag();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: onInsert ? 0 : 4 }}>
      {blocks.map((b, i) => {
        const isActive = b.id === activeBlockId;
        // Precise drop indicator: only on the hovered row, on the half the
        // cursor is in, and never where dropping would be a no-op.
        let dropEdge: "top" | "bottom" | null = null;
        if (dragIndex !== null && overIndex === i && dragIndex !== i) {
          if (overBefore) dropEdge = dragIndex === i - 1 ? null : "top";
          else dropEdge = dragIndex === i + 1 ? null : "bottom";
        }
        return (
          <React.Fragment key={b.id}>
            <NavRow
              index={i}
              label={getBlockTitle(b, i)}
              type={b.type}
              thumbnail={getThumbnail(b)}
              isActive={isActive}
              dropEdge={dropEdge}
              isDraggingThis={dragIndex === i}
              onClick={() => onSelect(b.id)}
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => {
                e.preventDefault();
                const r = e.currentTarget.getBoundingClientRect();
                setOverIndex(i);
                setOverBefore(e.clientY < r.top + r.height / 2);
              }}
              onDrop={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const before = e.clientY < r.top + r.height / 2;
                handleDropAt(before ? i : i + 1);
              }}
              onDragEnd={resetDrag}
              onMove={(dir) => move(i, i + dir)}
              total={blocks.length}
              onDuplicate={onDuplicate ? () => onDuplicate(b.id) : undefined}
              onDelete={onDelete ? () => onDelete(b.id) : undefined}
              anyDragging={dragIndex !== null}
            />
            {onInsert && i < blocks.length - 1 && (
              <InsertBetweenSlot onInsert={(type) => onInsert(type, i + 1)} index={i} />
            )}
          </React.Fragment>
        );
      })}
      {onAdd && (
        <div style={{
          marginTop: blocks.length ? space[6] : 0,
        }}>
          <AddBlockMenu onAdd={onAdd} onAddImageGallery={onAddImageGallery} />
        </div>
      )}
    </div>
  );
}

/** Insert-between-rows slot — "+" appears on hover, mirrors the right-panel editor. */
function InsertBetweenSlot({ onInsert, index }: { onInsert: (type: BlockType) => void; index: number }) {
  const [hovered, setHovered] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const visible = hovered || open;
  return (
    <div
      data-demo={`insert-slot-${index}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        height: visible ? 32 : 6,
        transition: `height ${transition.fast}`,
      }}
    >
      {/* Inner row is always mounted (so the self-driving demo can reveal + click
          it programmatically) but stays invisible & non-interactive until hovered. */}
      <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          gap: space[2],
          paddingLeft: space[2],
          paddingRight: space[2],
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transition: `opacity ${transition.fast}`,
        }}>
          <div style={{ flex: 1, height: 1, background: color.borderDefault }} />
          <AddBlockMenu
            onAdd={(type) => { onInsert(type); setHovered(false); }}
            onOpenChange={setOpen}
            renderTrigger={({ toggle, ref }) => (
              <span
                ref={ref as unknown as React.Ref<HTMLSpanElement>}
                style={{ display: "inline-flex", flexShrink: 0 }}
              >
                <SecondaryButton
                  variant="toolbar"
                  size={36}
                  aria-label="Insert block"
                  data-demo={`insert-between-${index}`}
                  onClick={(e) => { e.stopPropagation(); toggle(); }}
                  style={{ width: 28, height: 28, minHeight: 28, padding: 0, color: "var(--ads-icon-secondary)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="6" y1="2" x2="6" y2="10" /><line x1="2" y1="6" x2="10" y2="6" />
                  </svg>
                </SecondaryButton>
              </span>
            )}
          />
          <div style={{ flex: 1, height: 1, background: color.borderDefault }} />
        </div>
    </div>
  );
}

/** Precise insertion line shown between rows while dragging — a 2px brand-blue
 *  bar with a leading dot, matching a polished block editor. */
function DropIndicator({ edge }: { edge: "top" | "bottom" }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: 4,
        right: 4,
        top: edge === "top" ? -3 : undefined,
        bottom: edge === "bottom" ? -3 : undefined,
        height: 2,
        borderRadius: 999,
        background: "var(--ds-color-primary)",
        pointerEvents: "none",
        zIndex: 3,
      }}
    >
      <span style={{
        position: "absolute",
        left: -3,
        top: -3,
        width: 8,
        height: 8,
        borderRadius: 999,
        background: "var(--ds-color-primary)",
        border: "1.5px solid var(--ds-surface-base)",
      }} />
    </div>
  );
}

function NavRow({
  index, label, type, thumbnail, isActive, dropEdge, isDraggingThis,
  onClick, onDragStart, onDragOver, onDrop, onDragEnd, onMove, total,
  onDuplicate, onDelete, anyDragging,
}: {
  index: number;
  label: string;
  type: SupportedBlock["type"];
  thumbnail?: string;
  isActive: boolean;
  /** Which edge to draw the drop indicator on (null = none). */
  dropEdge: "top" | "bottom" | null;
  /** True for the row currently being dragged (dimmed as the source). */
  isDraggingThis?: boolean;
  onClick: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  /** Keyboard reorder: dir is -1 (up) or +1 (down). */
  onMove: (dir: number) => void;
  total: number;
  onDuplicate?: () => void;
  onDelete?: () => void;
  /** True while any row is being dragged — hide row actions during reorder. */
  anyDragging?: boolean;
}) {
  const [hovered, setHovered] = React.useState(false);
  // Secondary-button look: white fill, neutral border, subtle shadow — no blue.
  // Selected row mirrors the DS secondary button's selected (pressed) border.
  // Hover/drag only — no persistent "selected" state after clicking a row.
  const borderColor = hovered
    ? "var(--ads-border-accent-hover)"
    : color.borderDefault;
  const textColor = color.textDefault;

  return (
    <div
      data-demo={`nav-row-${index}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={(e) => { setHovered(false); onDrop(e); }}
      onDragEnd={() => { setHovered(false); onDragEnd(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: space[2],
        padding: `${space[3]} ${space[2]} ${space[3]} ${space[3]}`,
        borderRadius: radius.md,
        cursor: "pointer",
        background: color.bgSurface,
        border: `1px solid ${borderColor}`,
        boxShadow: "none",
        opacity: isDraggingThis ? 0.4 : 1,
        transition: `border-color ${transition.fast}, opacity ${transition.fast}`,
        userSelect: "none",
      }}
    >
      {dropEdge && <DropIndicator edge={dropEdge} />}
      {/* Drag handle — also a keyboard reorder control (↑/↓ arrows) */}
      <button
        type="button"
        title="Drag to reorder, or use arrow up/down keys"
        aria-label={`Reorder ${label}, position ${index + 1} of ${total}. Use arrow up and down keys to move.`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") { e.preventDefault(); e.stopPropagation(); onMove(-1); }
          else if (e.key === "ArrowDown") { e.preventDefault(); e.stopPropagation(); onMove(1); }
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          background: "transparent",
          padding: 0,
          color: color.neutral400,
          cursor: "grab",
          opacity: hovered || isActive ? 1 : 0.4,
          flexShrink: 0,
          transition: `opacity ${transition.fast}`,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="9" cy="6" r="1.6" /><circle cx="15" cy="6" r="1.6" />
          <circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" />
          <circle cx="9" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" />
        </svg>
      </button>

      {/* Index */}
      <span style={{
        fontSize: font.size.xs,
        fontWeight: font.weight.medium,
        color: color.textPlaceholder,
        minWidth: 16,
        textAlign: "right",
        flexShrink: 0,
        fontVariantNumeric: "tabular-nums",
      }}>
        {index + 1}.
      </span>

      {/* Type icon or thumbnail */}
      {thumbnail ? (
        <span style={{
          width: 28,
          height: 28,
          borderRadius: radius.md,
          overflow: "hidden",
          flexShrink: 0,
          border: `1px solid ${color.borderDefault}`,
        }}>
          <img src={thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </span>
      ) : (
        <span style={{
          width: 28,
          height: 28,
          borderRadius: radius.md,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: (BLOCK_TYPE_TINT[type] ?? { bg: color.neutral100 }).bg,
          color: (BLOCK_TYPE_TINT[type] ?? { fg: color.textSubtle }).fg,
          flexShrink: 0,
        }}>
          <BlockTypeIcon type={type} />
        </span>
      )}

      {/* Label */}
      <span style={{
        flex: 1,
        minWidth: 0,
        fontSize: font.size.sm,
        fontWeight: font.weight.regular,
        color: textColor,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {label}
      </span>

      {/* Duplicate / Delete — visible on hover or when active */}
      {(onDuplicate || onDelete) && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexShrink: 0,
            // Duplicate/delete are hover-only — they must NOT linger on a
            // selected card, nor after a drag/drop reorder (anyDragging guards
            // the in-flight drag; resetting `hovered` on drop guards the rest).
            opacity: hovered && !anyDragging ? 1 : 0,
            pointerEvents: hovered && !anyDragging ? "auto" : "none",
            transition: `opacity ${transition.fast}`,
          }}
        >
          {onDuplicate && (
            <RowIconButton title="Duplicate" onClick={onDuplicate}>
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="8" height="8" rx="1.5" />
                <path d="M10 4V3a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 3v5.5A1.5 1.5 0 003 10h1" />
              </svg>
            </RowIconButton>
          )}
          {onDelete && (
            <RowIconButton title="Delete" danger onClick={onDelete}>
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <line x1="3" y1="3" x2="11" y2="11" /><line x1="11" y1="3" x2="3" y2="11" />
              </svg>
            </RowIconButton>
          )}
        </div>
      )}
    </div>
  );
}

function RowIconButton({ children, onClick, title, danger }: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 28,
        height: 28,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        borderRadius: radius.sm,
        background: hovered ? color.bgHover : "transparent",
        color: hovered && danger ? color.danger : color.textSubtle,
        cursor: "pointer",
        padding: 0,
        transition: `background-color ${transition.fast}, color ${transition.fast}`,
      }}
    >
      {children}
    </button>
  );
}
