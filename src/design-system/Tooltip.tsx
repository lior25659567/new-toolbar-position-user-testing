import * as React from "react";
import { font, space, radius } from "./tokens";

/**
 * Tooltip – design system component.
 * Figma: Tooltip node 5:276.
 *
 * Dark tooltip with arrow. Positions: top | bottom | left | right.
 * Alignment: start | center | end.
 * Shows on hover/focus of child element.
 */

export type TooltipPosition = "top" | "bottom" | "left" | "right";
export type TooltipAlign = "start" | "center" | "end";

export interface TooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  align?: TooltipAlign;
  /** Delay in ms before showing. Default 400. */
  delay?: number;
  children: React.ReactElement;
}

const BG = "#1e293b";
const TEXT = "#f8fafc";
const ARROW = 6; // arrow size px

function getTooltipPosition(
  position: TooltipPosition,
  align: TooltipAlign
): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "absolute",
    zIndex: 9999,
    whiteSpace: "nowrap" as const,
  };

  const gap = 8 + ARROW; // distance from element

  switch (position) {
    case "top":
      return {
        ...base,
        bottom: "100%",
        marginBottom: gap,
        ...(align === "start"
          ? { left: 0 }
          : align === "end"
          ? { right: 0 }
          : { left: "50%", transform: "translateX(-50%)" }),
      };
    case "bottom":
      return {
        ...base,
        top: "100%",
        marginTop: gap,
        ...(align === "start"
          ? { left: 0 }
          : align === "end"
          ? { right: 0 }
          : { left: "50%", transform: "translateX(-50%)" }),
      };
    case "left":
      return {
        ...base,
        right: "100%",
        marginRight: gap,
        ...(align === "start"
          ? { top: 0 }
          : align === "end"
          ? { bottom: 0 }
          : { top: "50%", transform: "translateY(-50%)" }),
      };
    case "right":
      return {
        ...base,
        left: "100%",
        marginLeft: gap,
        ...(align === "start"
          ? { top: 0 }
          : align === "end"
          ? { bottom: 0 }
          : { top: "50%", transform: "translateY(-50%)" }),
      };
  }
}

function Arrow({ position }: { position: TooltipPosition }) {
  const base: React.CSSProperties = {
    position: "absolute",
    width: 0,
    height: 0,
    border: `${ARROW}px solid transparent`,
  };

  const styles: Record<TooltipPosition, React.CSSProperties> = {
    top:    { ...base, top: "100%",  left: "50%", transform: "translateX(-50%)", borderTopColor: BG,    borderBottomWidth: 0 },
    bottom: { ...base, bottom: "100%", left: "50%", transform: "translateX(-50%)", borderBottomColor: BG, borderTopWidth: 0 },
    left:   { ...base, left: "100%",  top: "50%",  transform: "translateY(-50%)", borderLeftColor: BG,   borderRightWidth: 0 },
    right:  { ...base, right: "100%", top: "50%",  transform: "translateY(-50%)", borderRightColor: BG,  borderLeftWidth: 0 },
  };

  return <span style={styles[position]} aria-hidden />;
}

export function Tooltip({
  content,
  position = "top",
  align = "center",
  delay = 400,
  children,
}: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  };
  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  React.useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const tooltipStyle: React.CSSProperties = {
    ...getTooltipPosition(position, align),
    backgroundColor: BG,
    color: TEXT,
    fontFamily: font.family,
    fontSize: font.size.xs,
    fontWeight: font.weight.regular,
    lineHeight: "1.5",
    padding: `${space[1]} ${space[2]}`,
    borderRadius: radius.sm,
    pointerEvents: "none",
    opacity: visible ? 1 : 0,
    transition: "opacity 0.15s ease",
  };

  const child = React.cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent) => {
      show();
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hide();
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      show();
      children.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hide();
      children.props.onBlur?.(e);
    },
  });

  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      {child}
      <span role="tooltip" style={tooltipStyle}>
        {content}
        <Arrow position={position} />
      </span>
    </span>
  );
}
