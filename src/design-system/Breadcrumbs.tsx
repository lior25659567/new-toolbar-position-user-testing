import * as React from "react";
import { color, font, transition, space } from "./tokens";

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  style?: React.CSSProperties;
}

const ChevronSeparator = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke={color.textPlaceholder}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0 }}
    aria-hidden
  >
    <path d="M4.5 2.5l3 3.5-3 3.5" />
  </svg>
);

export function Breadcrumbs({ items, separator, style }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: "flex",
        alignItems: "center",
        gap: space[1],
        fontFamily: font.family,
        fontSize: font.size.sm,
        ...style,
      }}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {isLast ? (
              <span
                style={{
                  color: color.textDefault,
                  fontWeight: font.weight.medium,
                }}
              >
                {item.label}
              </span>
            ) : (
              <BreadcrumbLink item={item} />
            )}
            {!isLast && (separator ?? <ChevronSeparator />)}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

function BreadcrumbLink({ item }: { item: BreadcrumbItem }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      type="button"
      onClick={item.onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        margin: 0,
        fontFamily: font.family,
        fontSize: font.size.sm,
        color: isHovered ? color.primary : color.textSubtle,
        cursor: item.onClick ? "pointer" : "default",
        textDecoration: isHovered ? "underline" : "none",
        transition: transition.fast,
        outline: "none",
      }}
    >
      {item.label}
    </button>
  );
}
