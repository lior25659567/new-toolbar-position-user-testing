import * as React from "react";
import { Icon } from "./Icon";

/**
 * Tag — back-compat shim using ADS .tag styles.
 * Original color names map 1:1 to ADS tones.
 */
export type TagColor = "red" | "orange" | "magenta" | "purple" | "blue" | "green";
export type TagSize = "small" | "medium";

export interface TagProps {
  children: React.ReactNode;
  color?: TagColor;
  size?: TagSize;
  icon?: React.ReactNode;
  onDismiss?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export function Tag({
  children,
  color: tagColor = "blue",
  size = "small",
  icon,
  onDismiss,
  style,
  className,
}: TagProps) {
  const sizeStyle: React.CSSProperties | undefined = size === "medium"
    ? { height: 32, padding: "8px 12px", fontSize: 14 }
    : undefined;

  return (
    <span
      className={["tag", `tag-${tagColor}`, className].filter(Boolean).join(" ")}
      style={{ ...sizeStyle, ...style }}
    >
      {icon && (
        <span style={{ display: "inline-flex", alignItems: "center" }} aria-hidden>
          {icon}
        </span>
      )}
      {children}
      {onDismiss && (
        <button className="tag-x" type="button" onClick={onDismiss} aria-label="Remove tag">
          <Icon name="close" size={12} />
        </button>
      )}
    </span>
  );
}
