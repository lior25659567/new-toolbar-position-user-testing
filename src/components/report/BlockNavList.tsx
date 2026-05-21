import * as React from "react";
import { color, font, radius, space, transition } from "../../design-system/tokens";
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
  /** Called when the user picks a section type from the "+ Add section" popover. */
  onAdd?: (type: BlockType) => void;
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

/** Tiny per-block-type icon. Single-color, currentColor inheritance. */
export function BlockTypeIcon({ type }: { type: SupportedBlock["type"] }) {
  const props = { width: 14, height: 14, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case "image":
      return (
        <svg {...props}>
          <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
          <circle cx="6" cy="6.5" r="1" fill="currentColor" stroke="none" />
          <path d="M2.5 11l3.5-3 3 2.5 2.5-2 2 2" />
        </svg>
      );
    case "comparison":
      return (
        <svg {...props}>
          <rect x="2" y="3" width="5" height="10" rx="1" />
          <rect x="9" y="3" width="5" height="10" rx="1" />
        </svg>
      );
    case "cost-summary":
      return (
        <svg {...props}>
          <rect x="2.5" y="3" width="11" height="10" rx="1" />
          <path d="M2.5 6.5h11M5.5 3v10" />
        </svg>
      );
    case "notes":
      return (
        <svg {...props}>
          <path d="M4 3h6l2.5 2.5V13a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5V3.5A.5.5 0 014 3z" />
          <path d="M5.5 7.5h5M5.5 9.5h5M5.5 11.5h3" />
        </svg>
      );
    case "rx":
      return (
        <svg {...props}>
          <path d="M5 3h3a2 2 0 010 4H5V3zm0 4v6M9 9l4 4M9 13l4-4" />
        </svg>
      );
    case "next-appointment":
      return (
        <svg {...props}>
          <rect x="2.5" y="3.5" width="11" height="10" rx="1" />
          <path d="M2.5 6.5h11M5.5 2.5v2M10.5 2.5v2" />
        </svg>
      );
    case "patient-instructions":
      return (
        <svg {...props}>
          <path d="M4 3.5h8a.5.5 0 01.5.5v9a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5V4a.5.5 0 01.5-.5z" />
          <path d="M5.5 6.5l1 1 2-2M5.5 9.5l1 1 2-2M5.5 12h3" />
        </svg>
      );
    default:
      return <svg {...props}><circle cx="8" cy="8" r="3" /></svg>;
  }
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

export default function BlockNavList({ blocks, activeBlockId, onSelect, onReorder, onAdd, onDuplicate, onDelete }: BlockNavListProps) {
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);

  const handleDrop = (target: number) => {
    if (dragIndex === null || dragIndex === target) {
      setDragIndex(null); setOverIndex(null); return;
    }
    const next = [...blocks];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(target, 0, moved);
    onReorder(next);
    setDragIndex(null); setOverIndex(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {blocks.map((b, i) => {
        const isActive = b.id === activeBlockId;
        const isDropTarget = overIndex === i && dragIndex !== i;
        return (
          <NavRow
            key={b.id}
            index={i}
            label={getBlockTitle(b, i)}
            type={b.type}
            thumbnail={getThumbnail(b)}
            isActive={isActive}
            isDropTarget={isDropTarget}
            onClick={() => onSelect(b.id)}
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => { e.preventDefault(); setOverIndex(i); }}
            onDrop={() => handleDrop(i)}
            onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
            onDuplicate={onDuplicate ? () => onDuplicate(b.id) : undefined}
            onDelete={onDelete ? () => onDelete(b.id) : undefined}
          />
        );
      })}
      {onAdd && (
        <div style={{ padding: `${space[2]} ${space[1]} 0`, marginTop: space[2] }}>
          <AddBlockMenu onAdd={onAdd} />
        </div>
      )}
    </div>
  );
}

function NavRow({
  index, label, type, thumbnail, isActive, isDropTarget,
  onClick, onDragStart, onDragOver, onDrop, onDragEnd,
  onDuplicate, onDelete,
}: {
  index: number;
  label: string;
  type: SupportedBlock["type"];
  thumbnail?: string;
  isActive: boolean;
  isDropTarget: boolean;
  onClick: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);
  // Secondary-button-style: transparent fill, border carries every state.
  const borderColor = isDropTarget
    ? color.primary
    : isActive
    ? color.primary
    : hovered
    ? color.borderHover
    : color.borderDefault;
  const textColor = isActive ? color.primary : color.textDefault;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: space[2],
        padding: `${space[2]} ${space[2]} ${space[2]} ${space[3]}`,
        borderRadius: radius.md,
        cursor: "pointer",
        background: "transparent",
        border: `1px solid ${borderColor}`,
        transition: `border-color ${transition.fast}`,
        userSelect: "none",
      }}
    >
      {/* Drag handle */}
      <span
        title="Drag to reorder"
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "inline-flex",
          color: color.neutral400,
          cursor: "grab",
          opacity: hovered || isActive ? 1 : 0.4,
          flexShrink: 0,
          transition: `opacity ${transition.fast}`,
        }}
      >
        <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" aria-hidden>
          <circle cx="2" cy="2" r="1" /><circle cx="8" cy="2" r="1" />
          <circle cx="2" cy="7" r="1" /><circle cx="8" cy="7" r="1" />
          <circle cx="2" cy="12" r="1" /><circle cx="8" cy="12" r="1" />
        </svg>
      </span>

      {/* Index */}
      <span style={{
        fontSize: font.size.xs,
        fontWeight: font.weight.medium,
        color: isActive ? color.primary : color.textPlaceholder,
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
          width: 22,
          height: 22,
          borderRadius: radius.sm,
          overflow: "hidden",
          flexShrink: 0,
          border: `1px solid ${color.borderDefault}`,
        }}>
          <img src={thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </span>
      ) : (
        <span style={{
          width: 22,
          height: 22,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: isActive ? color.primary : color.textSubtle,
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
        fontWeight: isActive ? font.weight.medium : font.weight.regular,
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
            opacity: hovered || isActive ? 1 : 0,
            transition: `opacity ${transition.fast}`,
          }}
        >
          {onDuplicate && (
            <RowIconButton title="Duplicate" onClick={onDuplicate}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="8" height="8" rx="1.5" />
                <path d="M10 4V3a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 3v5.5A1.5 1.5 0 003 10h1" />
              </svg>
            </RowIconButton>
          )}
          {onDelete && (
            <RowIconButton title="Delete" danger onClick={onDelete}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
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
        width: 22,
        height: 22,
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
