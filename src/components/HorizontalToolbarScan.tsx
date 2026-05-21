import { useState } from "react";
import type { ComponentType, KeyboardEvent as ReactKeyboardEvent } from "react";
import { motion } from "motion/react";
import { ToolButton } from "./ToolButton";

// Monochrome Icon - Two overlapping squares
function MonoChomrNew({ isActive = false }: { isActive?: boolean }) {
  const fillColor = isActive ? "var(--ads-background-interactive)" : "var(--ads-text-secondary)";
  const strokeColor = isActive ? "var(--ads-background-interactive)" : "var(--ads-text-secondary)";

  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Mono chomr new">
      <svg width="28" height="28" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_monochrome_hscan)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M49.3509 21.4961H41.0319V36.7473C41.0319 39.0444 39.1687 40.9076 36.8716 40.9076H21.6204V49.2267C21.6204 50.758 22.8624 52.0002 24.3939 52.0002H49.3509C50.8823 52.0002 52.1244 50.7596 52.1244 49.2267V24.2696C52.1244 22.7382 50.8823 21.4961 49.3509 21.4961Z"
            fill={fillColor}
          />
          <path
            d="M35.627 8H9.86313C8.28064 8 7 9.23644 7 10.7609V35.6046C7 37.1291 8.28064 38.3655 9.86313 38.3655H35.627C37.208 38.3655 38.4902 37.1291 38.4902 35.6046V10.7609C38.4902 9.23644 37.208 8 35.627 8Z"
            stroke={strokeColor}
            strokeWidth="2"
            strokeMiterlimit="10"
          />
        </g>
        <defs>
          <clipPath id="clip0_monochrome_hscan">
            <rect width="60" height="60" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function FeedbackNew({ isActive }: { isActive?: boolean }) {
  const strokeColor = isActive ? "var(--ads-background-interactive)" : "var(--ads-text-secondary)";
  const fillColor = isActive ? "var(--ads-background-interactive)" : "var(--ads-text-secondary)";

  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Feedback new">
      <svg width="28" height="28" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M32.861 53H24.5715V28.7183H29.7507V10.2847H24.5715V6H30.4588C31.9723 6 33.4232 6.51317 34.4994 7.4382L38.9773 11.2873C40.0535 12.2062 40.6505 13.4594 40.6505 14.7603V33.0654"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M44 44V51.8235" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M44 55C48.9705 55 53 50.9705 53 46C53 41.0295 48.9705 37 44 37C39.0295 37 35 41.0295 35 46C35 50.9705 39.0295 55 44 55Z"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M44.0948 41.1897C44.6995 41.1897 45.1897 40.6995 45.1897 40.0948C45.1897 39.4902 44.6995 39 44.0948 39C43.4902 39 43 39.4902 43 40.0948C43 40.6995 43.4902 41.1897 44.0948 41.1897Z"
          fill={fillColor}
        />
        <path
          d="M25.2119 10.7351V27.7083L13.5531 34.8968C11.1369 36.3864 7 35.3324 7 33.2244V8.37029C7 6.35356 10.8293 5.26442 13.3137 6.56436L25.2119 10.7351Z"
          stroke={strokeColor}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function PrepEditNew({ isActive }: { isActive?: boolean }) {
  const strokeColor = isActive ? "var(--ads-background-interactive)" : "var(--ads-text-secondary)";

  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Prep edit new">
      <svg width="28" height="29" viewBox="0 0 60 61" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M25.5238 51C19.5289 50.971 14.1168 49.5938 6.70168 46.5318C6.28657 46.3603 6.03918 45.9312 6.09579 45.4857L10.6275 9.82312C10.9436 7.33696 13.0214 5.65522 15.2086 6.06017C25.126 7.89606 31.8458 8.06423 40.8708 6.22052C43.1241 5.76026 45.3022 7.48079 45.5983 10.0541L47 22.2335"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M50.1007 31.8468L54 35.6905L40.766 48.7095L31.641 50.6509C30.9001 50.8085 30.2598 50.1172 30.4736 49.3905L32.9245 41.0614L46.1994 28L50.1007 31.8468Z"
          stroke={strokeColor}
          strokeWidth="2"
        />
        <path
          d="M46.6653 27.6042C48.8028 25.4637 52.2653 25.4654 54.4004 27.6083C56.4675 29.6831 56.5311 33.0055 54.5918 35.1569L54.3973 35.3614L50.7487 39L43 31.2595L46.6642 27.6051L46.6653 27.6042Z"
          stroke={strokeColor}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

// Jaw Type Selector – upper / lower / both
type JawType = "upper" | "lower" | "both";

export function UpperJawIcon({ isActive }: { isActive: boolean }) {
  const c = isActive ? "var(--ads-background-interactive)" : "var(--ads-text-secondary)";
  return (
    <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
      <path d="M5 21C5 21 5 10 14 10C23 10 23 21 23 21" stroke={c} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <path
        d="M7 16.5C7.5 15 8.5 14 9.5 14C10.5 14 11 15 11.5 14C12 13 12.5 12.5 14 12.5C15.5 12.5 16 13 16.5 14C17 15 17.5 14 18.5 14C19.5 14 20.5 15 21 16.5"
        stroke={c}
        strokeWidth={1.1}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function LowerJawIcon({ isActive }: { isActive: boolean }) {
  const c = isActive ? "var(--ads-background-interactive)" : "var(--ads-text-secondary)";
  return (
    <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
      <path d="M5 7C5 7 5 18 14 18C23 18 23 7 23 7" stroke={c} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <path
        d="M7 11.5C7.5 13 8.5 14 9.5 14C10.5 14 11 13 11.5 14C12 15 12.5 15.5 14 15.5C15.5 15.5 16 15 16.5 14C17 13 17.5 14 18.5 14C19.5 14 20.5 13 21 11.5"
        stroke={c}
        strokeWidth={1.1}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function BothJawsIcon({ isActive }: { isActive: boolean }) {
  const c = isActive ? "var(--ads-background-interactive)" : "var(--ads-text-secondary)";
  return (
    <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
      <path d="M6 15C6 15 6 6 14 6C22 6 22 15 22 15" stroke={c} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <path
        d="M8 11.5C8.5 10.5 9.5 10 10.5 10C11.5 10 12 10.5 13 10C13.5 9.5 13.5 9 14 9C14.5 9 14.5 9.5 15 10C16 10.5 16.5 10 17.5 10C18.5 10 19.5 10.5 20 11.5"
        stroke={c}
        strokeWidth={1.1}
        strokeLinecap="round"
        fill="none"
      />
      <path d="M6 13C6 13 6 22 14 22C22 22 22 13 22 13" stroke={c} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <path
        d="M8 16.5C8.5 17.5 9.5 18 10.5 18C11.5 18 12 17.5 13 18C13.5 18.5 13.5 19 14 19C14.5 19 14.5 18.5 15 18C16 17.5 16.5 18 17.5 18C18.5 18 19.5 17.5 20 16.5"
        stroke={c}
        strokeWidth={1.1}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function JawButton({ jaw, label, isActive, onClick }: { jaw: JawType; label: string; isActive: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const active = isActive;

  const handleKey = (e: ReactKeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      role="button"
      aria-label={label}
      aria-pressed={isActive}
      tabIndex={0}
      className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px] cursor-pointer overflow-hidden transition-colors duration-200 outline-none"
      style={{ backgroundColor: isActive ? "var(--ads-blue-50)" : hovered ? "var(--ads-bg-muted)" : "transparent" }}
      onClick={onClick}
      onKeyDown={handleKey}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9, transition: { type: "spring" as const, stiffness: 600, damping: 15 } }}
    >
      {jaw === "upper" && <UpperJawIcon isActive={active} />}
      {jaw === "lower" && <LowerJawIcon isActive={active} />}
      {jaw === "both" && <BothJawsIcon isActive={active} />}
    </motion.div>
  );
}

function JawTypeRow({ activeJaw, onJawChange }: { activeJaw: JawType; onJawChange: (j: JawType) => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: 8,
        borderBottom: "1px solid var(--ads-border-subtle)",
      }}
    >
      <JawButton jaw="upper" label="Upper jaw" isActive={activeJaw === "upper"} onClick={() => onJawChange("upper")} />
      <JawButton jaw="lower" label="Lower jaw" isActive={activeJaw === "lower"} onClick={() => onJawChange("lower")} />
      <JawButton jaw="both" label="Both jaws" isActive={activeJaw === "both"} onClick={() => onJawChange("both")} />
    </div>
  );
}

// Swap arches — two vertical arrows (up / down).
function SwapArchesNew({ isActive = false }: { isActive?: boolean }) {
  const c = isActive ? "var(--ads-background-interactive)" : "var(--ads-text-secondary)";
  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Swap arches new">
      <svg width="28" height="28" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23 45V19M16 26L23 18L30 26" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M37 15V41M30 34L37 42L44 34" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

type ScanTool = {
  index: number;
  label: string;
  Icon: ComponentType<{ isActive: boolean }>;
};

// Index 5 = "Swap arches" — an action (opens the Swap Arches modal), not a
// toggle tool; the parent intercepts it before toggling active state.
const SCAN_TOOLS: ScanTool[] = [
  { index: 0, label: "Monochrome", Icon: MonoChomrNew },
  { index: 1, label: "Scan assist", Icon: FeedbackNew },
  { index: 2, label: "Prep edit", Icon: PrepEditNew },
  { index: 5, label: "Swap arches", Icon: SwapArchesNew },
];

export function HorizontalScanToolbar({
  activeButtons,
  onButtonClick,
  microAnimations = true,
}: {
  activeButtons: Set<number>;
  onButtonClick: (index: number) => void;
  microAnimations?: boolean;
}) {
  const [activeJaw, setActiveJaw] = useState<JawType>("both");
  const activeToolLabel = SCAN_TOOLS.find((t) => activeButtons.has(t.index))?.label ?? "No tool selected";

  return (
    <div className="bg-[var(--ads-background-subtle-01)] rounded-[8px] flex flex-col font-['Roboto']">
      <JawTypeRow activeJaw={activeJaw} onJawChange={setActiveJaw} />

      {/* Live region — announce active tool / jaw changes to assistive tech */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {`Jaw: ${activeJaw}. Tool: ${activeToolLabel}.`}
      </div>

      <div className="flex items-center p-[4px] gap-[4px]">
        {SCAN_TOOLS.map(({ index, label, Icon }) => (
          <ToolButton
            key={index}
            label={label}
            active={activeButtons.has(index)}
            onClick={() => onButtonClick(index)}
            microAnimations={microAnimations}
            tooltipPosition="bottom"
            className="px-[8px] py-[4px] flex flex-col items-center justify-center gap-[4px] min-h-[40px]"
          >
            {({ active, hovered }) => (
              <>
                <div className="flex items-center justify-center w-[32px] h-[32px]">
                  <div className="scale-[0.53]">
                    <Icon isActive={active} />
                  </div>
                </div>
                <p
                  className="font-['Roboto'] text-[12px] leading-[14px] whitespace-nowrap"
                  style={{
                    color:
                      active ? "var(--ads-background-interactive)" : "var(--ads-text-primary)",
                  }}
                >
                  {label}
                </p>
              </>
            )}
          </ToolButton>
        ))}
      </div>
    </div>
  );
}
