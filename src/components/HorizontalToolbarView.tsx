import type { ComponentType } from "react";
import NiriIonNew from "../imports/NiriIonNew";
import OcculsgramNew from "../imports/OcculsgramNew";
import MarginLineNew from "../imports/MarginLineNew";
import PrepQcNew from "../imports/PrepQcNew";
import TrimNew from "../imports/TrimNew";
import { ToolButton } from "./ToolButton";

// Monochrome Icon - Two overlapping squares
function MonoChomrNew({ isActive = false }: { isActive?: boolean }) {
  const fillColor = isActive ? "var(--ads-background-interactive)" : "var(--ads-text-secondary)";
  const strokeColor = isActive ? "var(--ads-background-interactive)" : "var(--ads-text-secondary)";

  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Mono chomr new">
      <svg width="28" height="28" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_monochrome_hview)">
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
          <clipPath id="clip0_monochrome_hview">
            <rect width="60" height="60" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

type ViewTool = {
  index: number;
  label: string;
  Icon: ComponentType<{ isActive: boolean }>;
};

const VIEW_TOOLS: ViewTool[] = [
  { index: 0, label: "Monochrome", Icon: MonoChomrNew },
  { index: 1, label: "Review Tool", Icon: NiriIonNew },
  { index: 2, label: "Occlusalgram", Icon: OcculsgramNew },
  { index: 3, label: "Margin line", Icon: MarginLineNew },
  { index: 4, label: "Prep QC", Icon: PrepQcNew },
  { index: 5, label: "Trim", Icon: TrimNew },
];

export function HorizontalViewToolbar({
  activeButtons,
  onButtonClick,
  microAnimations = true,
}: {
  activeButtons: Set<number>;
  onButtonClick: (index: number) => void;
  microAnimations?: boolean;
}) {
  return (
    <div className="bg-[var(--ads-background-subtle-01)] rounded-[8px] size-full flex items-center font-['Roboto'] p-[4px]">
      <div className="flex items-center gap-[4px] flex-1">
        {VIEW_TOOLS.map(({ index, label, Icon }) => (
          <ToolButton
            key={index}
            label={label}
            active={activeButtons.has(index)}
            onClick={() => onButtonClick(index)}
            microAnimations={microAnimations}
            tooltipPosition="bottom"
            className="px-[8px] flex items-center gap-[6px] h-[40px]"
          >
            {({ active, hovered }) => (
              <>
                <div className="w-[40px] h-[40px] flex items-center justify-center shrink-0">
                  <div className="scale-[0.7]">
                    <Icon isActive={active} />
                  </div>
                </div>
                <p
                  className="font-['Roboto'] text-[12px] leading-[14px] whitespace-nowrap"
                  style={{
                    color:
                      active
                        ? "var(--ads-background-interactive)"
                        : "var(--ads-text-primary)",
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
