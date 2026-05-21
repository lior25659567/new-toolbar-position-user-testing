import * as React from "react";
import { color, font, radius, space } from "./tokens";

export type MessageBubbleFrom = "them" | "you";
export type MessageBubblePosition = "single" | "top" | "center" | "bottom";

export interface MessageBubbleProps {
  /** Sender side. "them" = interlocutor (left, neutral). "you" = self (right, blue). */
  from: MessageBubbleFrom;
  /** Where the bubble sits in a chain — controls which corners are rounded. */
  position?: MessageBubblePosition;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const ROUND = radius.lg;
const TIGHT = "4px";

/** Resolve per-corner radius given side + chain position (matches Figma 15305:6742). */
function cornerRadius(from: MessageBubbleFrom, position: MessageBubblePosition) {
  if (position === "single") return { tl: ROUND, tr: ROUND, br: ROUND, bl: ROUND };
  if (from === "them") {
    if (position === "top")    return { tl: ROUND, tr: ROUND, br: ROUND, bl: TIGHT };
    if (position === "center") return { tl: TIGHT, tr: ROUND, br: ROUND, bl: TIGHT };
    /* bottom */                return { tl: TIGHT, tr: ROUND, br: ROUND, bl: ROUND };
  }
  // from === "you"
  if (position === "top")    return { tl: ROUND, tr: ROUND, br: TIGHT, bl: ROUND };
  if (position === "center") return { tl: ROUND, tr: TIGHT, br: TIGHT, bl: ROUND };
  /* bottom */                return { tl: ROUND, tr: TIGHT, br: ROUND, bl: ROUND };
}

export function MessageBubble({
  from,
  position = "single",
  children,
  style,
  className,
}: MessageBubbleProps) {
  const isYou = from === "you";
  const { tl, tr, br, bl } = cornerRadius(from, position);

  return (
    <div
      data-design-system="message-bubble"
      data-from={from}
      data-position={position}
      className={className}
      style={{
        alignSelf: isYou ? "flex-end" : "flex-start",
        maxWidth: "75%",
        padding: `${space[2]} ${space[3]}`,
        background: isYou ? color.primary : color.bgHover,
        color: isYou ? color.textOnPrimary : color.textDefault,
        fontFamily: font.family,
        fontSize: font.size.base,
        lineHeight: font.lineHeight.normal,
        borderTopLeftRadius: tl,
        borderTopRightRadius: tr,
        borderBottomRightRadius: br,
        borderBottomLeftRadius: bl,
        wordBreak: "break-word",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
