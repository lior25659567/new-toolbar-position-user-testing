import React, { useEffect, useState } from "react";
import { SecondaryButton } from "@/design-system/SecondaryButton";
import upperArchImg from "@/assets/button-images/default/3d-model-upper.png";
import lowerArchImg from "@/assets/button-images/default/3d-model-lower.png";

// ============================================================================
// SWAP ARCHES MODAL
// ----------------------------------------------------------------------------
// Tool launched from the scan toolbar. Shows the upper and lower arch scans
// stacked, with a swap control between them. The user can swap which arch is
// upper/lower, then Confirm (✓) or Cancel (✕).
//
// Uses the design-system SecondaryButton (medium, white fill) for all controls
// and design-system tokens throughout.
// ============================================================================

export interface SwapArchesModalProps {
  open: boolean;
  onClose: () => void;
  /** Called with the final swapped state when the user confirms. */
  onConfirm?: (swapped: boolean) => void;
}

// Icons (from the reference) drawn with currentColor, so the SecondaryButton's
// own icon colour (the design-system button icon colour) drives them.
function SwapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 4L10 10L11.41 11.41L15 7.83V28H17V7.83L20.59 11.41L22 10L16 4Z" fill="currentColor" />
      <path d="M20.59 20.59L17 24.17V4H15V24.17L11.41 20.59L10 22L16 28L22 22L20.59 20.59Z" fill="currentColor" />
    </svg>
  );
}
function CancelIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path d="M27 10.575L25.425 9L18 16.425L10.575 9L9 10.575L16.425 18L9 25.425L10.575 27L18 19.575L25.425 27L27 25.425L19.575 18L27 10.575Z" fill="currentColor" />
    </svg>
  );
}
function ConfirmIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M8.125 15.0009L2.5 9.37594L3.38375 8.49219L8.125 13.2328L16.6163 4.74219L17.5 5.62594L8.125 15.0009Z" fill="currentColor" />
    </svg>
  );
}

// Secondary button, given a white fill + small elevation to match the design
// (white floating control over the scan canvas).
// Secondary button (medium / 44px), square, with a white fill + small elevation.
const WHITE_BTN_STYLE: React.CSSProperties = {
  width: 44,
  height: 44,
  minWidth: 44,
  padding: 0,
  backgroundColor: "var(--ads-background-subtle-01)",
  boxShadow: "var(--ads-shadow-sm)",
};

const CARD_STYLE: React.CSSProperties = {
  width: "100%",
  borderRadius: "var(--ads-radius-md)", // 8px
  backgroundColor: "var(--ads-background-subtle-01)",
  border: "1px solid var(--ads-border-subtle)",
  boxShadow: "var(--ads-shadow-sm)",
  overflow: "hidden",
};

function ArchCard({ label, src }: { label: string; src: string }) {
  return (
    <div style={CARD_STYLE}>
      <div style={{ padding: "16px 16px 8px" }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: "var(--ads-text-primary)", fontFamily: "var(--ads-font-sans)" }}>
          {label}
        </span>
      </div>
      <div style={{ height: 300, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backgroundColor: "var(--ads-background-subtle-01)" }}>
        <img
          alt={label}
          src={src}
          draggable={false}
          style={{ height: "100%", width: "100%", maxHeight: "100%", objectFit: "contain", objectPosition: "center", pointerEvents: "none" }}
        />
      </div>
    </div>
  );
}

export default function SwapArchesModal({ open, onClose, onConfirm }: SwapArchesModalProps) {
  const [swapped, setSwapped] = useState(false);

  // Reset to the un-swapped state each time the modal opens.
  useEffect(() => {
    if (open) setSwapped(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const topLabel = swapped ? "Lower 1" : "Upper 1";
  const bottomLabel = swapped ? "Upper 1" : "Lower 1";
  const topSrc = swapped ? lowerArchImg : upperArchImg;
  const bottomSrc = swapped ? upperArchImg : lowerArchImg;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="swap-arches-title"
    >
      {/* Scrim */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, backgroundColor: "var(--ads-bg-scrim, rgba(0,0,0,0.4))" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, width: 480, maxWidth: "100%", maxHeight: "100%", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "var(--ads-font-sans)" }}>
        <span id="swap-arches-title" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
          Swap arches
        </span>

        {/* Model stack — two equal-height cards with a small gap. The swap
            button is absolutely positioned on the seam between them, bridging
            the gap (both cards are equal height, so 50% lands on the seam). */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }}>
          <ArchCard label={topLabel} src={topSrc} />
          <ArchCard label={bottomLabel} src={bottomSrc} />

          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 2 }}>
            <SecondaryButton size={44} aria-label="Swap upper and lower" onClick={() => setSwapped((s) => !s)} style={WHITE_BTN_STYLE}>
              <SwapIcon />
            </SecondaryButton>
          </div>
        </div>

        {/* Confirm / Cancel */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 12 }}>
          <SecondaryButton size={44} aria-label="Cancel" onClick={onClose} style={WHITE_BTN_STYLE}>
            <CancelIcon />
          </SecondaryButton>
          <SecondaryButton size={44} aria-label="Confirm" onClick={() => { onConfirm?.(swapped); onClose(); }} style={WHITE_BTN_STYLE}>
            <ConfirmIcon />
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}
