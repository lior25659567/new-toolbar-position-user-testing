import { useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import { motion } from "motion/react";
import { Tooltip } from "../design-system";

/**
 * Shared toolbar button used by every horizontal toolbar variant.
 *
 * Provides:
 *   - DS Tooltip wrapper (hover/focus, ~400ms delay)
 *   - role="button", aria-label, aria-pressed, tabIndex, Enter/Space activation
 *   - hover/press state + ripple animation (suppressed when microAnimations=false)
 *   - background tinting that matches the existing toolbar look
 *
 * The caller renders the inner icon + optional label via the children render-prop,
 * which receives `{ active, hovered }` so the icon and label can highlight in sync.
 */
export interface ToolButtonRenderState {
  active: boolean;
  hovered: boolean;
}

export interface ToolButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  microAnimations?: boolean;
  className?: string;
  style?: CSSProperties;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  children: (state: ToolButtonRenderState) => ReactNode;
}

export function ToolButton({
  label,
  active,
  onClick,
  microAnimations = true,
  className = "",
  style,
  tooltipPosition = "bottom",
  children,
}: ToolButtonProps) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const animationProps = microAnimations
    ? {
        animate: { scale: active ? 1.05 : 1 },
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.9, transition: { type: "spring" as const, stiffness: 600, damping: 15 } },
        transition: { type: "spring" as const, stiffness: 500, damping: 10 },
      }
    : {};

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  const background = active
    ? "var(--ads-blue-50)"
    : hovered
    ? "var(--ads-bg-muted)"
    : "transparent";

  return (
    <Tooltip content={label} position={tooltipPosition}>
      <motion.div
        role="button"
        aria-label={label}
        aria-pressed={active}
        tabIndex={0}
        className={`relative overflow-hidden cursor-pointer outline-none rounded-[8px] transition-colors duration-200 ${className}`}
        style={{ backgroundColor: background, ...style }}
        onClick={onClick}
        onKeyDown={handleKey}
        onTapStart={() => setPressed(true)}
        onTapEnd={() => setTimeout(() => setPressed(false), 300)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        {...animationProps}
      >
        {pressed && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2.5, opacity: [0, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              background:
                "radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%)",
              filter: "blur(12px)",
            }}
          />
        )}
        {children({ active, hovered })}
      </motion.div>
    </Tooltip>
  );
}
