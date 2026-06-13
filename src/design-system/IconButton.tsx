import * as React from "react";

/**
 * IconButton — square icon-only button. ADS-styled.
 *
 * size: "sm" (32) | "md" (36) | "lg" (40). Default "md".
 * Children = the icon (SVG / Icon component / glyph).
 */
export interface IconButtonProps extends React.ComponentProps<"button"> {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  "aria-label"?: string;
}

const sizeMap: Record<"sm" | "md" | "lg", number> = { sm: 32, md: 36, lg: 40 };

export function IconButton({
  children,
  size = "md",
  style,
  disabled,
  className,
  ...props
}: IconButtonProps) {
  const dim = sizeMap[size];
  const combinedStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: dim,
    height: dim,
    flexShrink: 0,
    padding: 0,
    border: "none",
    borderRadius: "var(--ads-radius-sm)",
    cursor: disabled ? "not-allowed" : "pointer",
    background: "transparent",
    color: "var(--ads-text-primary)",
    transition: "background var(--ads-duration-fast) var(--ads-ease-standard), transform var(--ads-duration-fast) var(--ads-ease-standard)",
    opacity: disabled ? 0.5 : 1,
    outline: "none",
    position: "relative", // anchor the ::after hit-area overlay (see injected stylesheet below)
    ...style,
  };

  return (
    <button
      type="button"
      disabled={disabled}
      style={combinedStyle}
      data-design-system="icon-button"
      className={["ads-icon-btn-shim", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

/* Hover/active styles — added via inline <style> once per app load.
   We can't drive :hover / :active from inline style, and we want this
   shim to be drop-in. Keeping the rule scoped to data attribute.

   The ::after rule extends the click target to a minimum of 44×44 without
   changing the visual size. Apple HIG / Align DS v2.0 require 44px touch
   targets; we keep dense 32/36/40 visuals (see CHANGES.md deviation #2). */
if (typeof document !== "undefined" && !document.getElementById("ads-icon-btn-shim-style")) {
  const style = document.createElement("style");
  style.id = "ads-icon-btn-shim-style";
  style.textContent = `
    [data-design-system="icon-button"]:hover:not(:disabled) { background: var(--ads-bg-muted) !important; }
    [data-design-system="icon-button"]:active:not(:disabled) { background: var(--ads-bg-subtle) !important; transform: scale(0.94); }
    [data-design-system="icon-button"]:focus-visible { outline: 1px solid var(--ads-focus-ring); outline-offset: 1px; }
    /* Documentation-only forced states (data-force) mirror the rules above. */
    [data-design-system="icon-button"][data-force="hover"]:not(:disabled) { background: var(--ads-bg-muted) !important; }
    [data-design-system="icon-button"][data-force="pressed"]:not(:disabled) { background: var(--ads-bg-subtle) !important; transform: scale(0.94); }
    [data-design-system="icon-button"][data-force="focus"] { outline: 1px solid var(--ads-focus-ring); outline-offset: 1px; }
    [data-design-system="icon-button"]::after {
      content: "";
      position: absolute;
      inset: min(0px, calc((44px - 100%) / -2));
    }
  `;
  document.head.appendChild(style);
}
