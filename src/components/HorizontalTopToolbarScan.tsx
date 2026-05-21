import type { ComponentType } from "react";
import { ToolButton } from "./ToolButton";
import { useToolbarDensity } from "./ToolbarDensityContext";

// Monochrome Icon - Two overlapping squares
function MonoChomrNew({ isActive = false }: { isActive?: boolean }) {
  const fillColor = isActive ? "var(--ads-background-interactive)" : "var(--ads-text-secondary)";
  const strokeColor = isActive ? "var(--ads-background-interactive)" : "var(--ads-text-secondary)";

  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Mono chomr new">
      <svg width="28" height="28" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_monochrome_htopscan)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M49.3509 21.4961H41.0319V36.7473C41.0319 39.0444 39.1687 40.9076 36.8716 40.9076H21.6204V49.2267C21.6204 50.758 22.8624 52.0002 24.3939 52.0002H49.3509C50.8823 52.0002 52.1244 50.7596 52.1244 49.2267V24.2696C52.1244 22.7382 50.8823 21.4961 49.3509 21.4961Z"
            fill={fillColor}
          />
          <path
            d="M35.627 8H9.86313C8.28064 8 7 9.23644 7 10.7609V35.6046C7 37.1291 8.28064 38.3655 9.86313 38.3655H35.627C37.208 38.3655 38.4902 37.1291 38.4902 35.6046V10.7609C38.4902 9.23644 37.208 8 35.627 8Z"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
        </g>
        <defs>
          <clipPath id="clip0_monochrome_htopscan">
            <rect width="60" height="60" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function FeedbackNew({ isActive = false }: { isActive?: boolean }) {
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

function PrepEditToTest({ isActive = false }: { isActive?: boolean }) {
  const strokeColor = isActive ? "var(--ads-background-interactive)" : "var(--ads-text-secondary)";

  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Prep edit to test">
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
  Icon: ComponentType<{ isActive?: boolean }>;
};

const SCAN_TOOLS: ScanTool[] = [
  { index: 0, label: "Monochrome", Icon: MonoChomrNew },
  { index: 1, label: "Scan assist", Icon: FeedbackNew },
  { index: 2, label: "Prep edit", Icon: PrepEditToTest },
  { index: 5, label: "Swap arches", Icon: SwapArchesNew },
];

export function HorizontalTopToolbarScan({
  activeButtons,
  onButtonClick,
  microAnimations = true,
}: {
  activeButtons: Set<number>;
  onButtonClick: (index: number) => void;
  microAnimations?: boolean;
  stackVertical?: boolean;
}) {
  const { dense } = useToolbarDensity();
  const activeToolLabel = SCAN_TOOLS.find((t) => activeButtons.has(t.index))?.label ?? "No tool selected";

  // Dense (Dedicated Top page): icon-only, 44×44 buttons, 4px gap, 8px padding.
  const buttonClass = dense
    ? "flex items-center justify-center size-[44px] shrink-0"
    : "flex flex-col flex-1 items-center justify-center gap-[2px] p-[4px]";

  return (
    <div
      className={`flex items-stretch relative rounded-[8px] font-['Roboto'] bg-[var(--ads-background-subtle-01)] ${
        dense ? "gap-[4px] p-[4px]" : "content-stretch"
      }`}
      style={dense ? { boxShadow: "var(--ads-shadow-sm)" } : { boxShadow: "var(--ads-shadow-sm)", padding: "6px" }}
      role="toolbar"
      aria-label="Scan toolbar"
    >
      {!dense && (
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {`Active tool: ${activeToolLabel}.`}
        </div>
      )}

      <div
        className={`bg-[var(--ads-background-subtle-01)] flex items-stretch rounded-[8px] font-['Roboto'] ${
          dense ? "gap-[4px]" : "flex-1 gap-[8px]"
        }`}
      >
        {SCAN_TOOLS.map(({ index, label, Icon }) => (
          <ToolButton
            key={index}
            label={label}
            active={activeButtons.has(index)}
            onClick={() => onButtonClick(index)}
            microAnimations={microAnimations}
            tooltipPosition="bottom"
            className={buttonClass}
          >
            {({ active, hovered }) => (
              <>
                <div className="content-stretch flex items-center justify-center relative size-[40px]">
                  <Icon isActive={active} />
                </div>
                {!dense && (
                  <p
                    className="font-['Roboto'] font-normal whitespace-nowrap text-center text-[12px] leading-[14px]"
                    style={{
                      color:
                        active ? "var(--ads-background-interactive)" : "var(--ads-text-primary)",
                    }}
                  >
                    {label}
                  </p>
                )}
              </>
            )}
          </ToolButton>
        ))}
      </div>
    </div>
  );
}
