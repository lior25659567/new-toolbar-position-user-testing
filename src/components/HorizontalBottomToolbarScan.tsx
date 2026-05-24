import type { ComponentType } from "react";
import { ToolButton } from "./ToolButton";

// Monochrome Icon - Two overlapping squares
function MonoChomrNew({ isActive = false }: { isActive?: boolean }) {
  const strokeColor = isActive ? "var(--ads-background-interactive)" : "var(--ads-icon-secondary)";

  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Mono chomr new">
      <svg width="28" height="28" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "scaleX(-1)" }}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.0195 19.5642C14.3393 19.5581 14.6617 19.6685 14.9202 19.9137C15.3753 20.3454 15.5613 21.0818 15.7275 21.7399C15.7749 21.9277 15.8207 22.1091 15.8707 22.2752C15.9286 22.4674 15.9854 22.6605 16.0423 22.854C16.3032 23.7408 16.5663 24.6348 16.9394 25.4775C17.268 26.2398 17.6645 26.9922 18.4879 27.3212C19.1912 27.6022 20.1004 27.577 20.795 27.2898C22.194 26.7112 22.6012 24.8208 22.8867 23.4949C22.891 23.475 22.8953 23.4553 22.8995 23.4356C23.0469 22.7596 23.1806 22.0808 23.3005 21.3997C23.569 19.9139 23.8665 18.3721 24.2465 16.9097C24.3925 16.3476 24.6108 15.6776 24.897 15.1713C24.9718 15.0391 25.0993 14.8591 25.215 14.6956C25.2692 14.619 25.3208 14.5461 25.3633 14.4834C25.5892 14.1466 25.801 13.8007 25.998 13.4467C26.999 11.6558 27.6719 9.55645 27.4896 7.49434C27.2442 4.7179 25.3904 2.03785 22.7349 0.988956C21.2507 0.410277 19.5954 0.424765 18.1218 1.02931C17.5762 1.25923 17.1028 1.55514 16.6195 1.88298C16.5295 1.94402 16.4401 2.00587 16.3509 2.06755C15.6114 2.57878 14.8895 3.07794 14.0195 3.00473V19.5642Z"
          stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke"
        />
        <path
          d="M7.74676 0.520183C9.30124 0.494537 10.5476 1.02133 11.7865 1.9013C12.273 2.24687 12.7962 2.61325 13.3465 2.83811C13.5814 2.93407 13.8047 2.98687 14.0191 3.00492V19.5644C13.5702 19.573 13.1267 19.8113 12.8728 20.2288C12.5849 20.7022 12.4652 21.1953 12.3384 21.7172C12.3188 21.7982 12.2989 21.8799 12.2782 21.9623C12.1285 22.5574 11.9734 23.151 11.8129 23.7433C11.8046 23.7741 11.7963 23.8049 11.7881 23.8357C11.6109 24.4967 11.4286 25.1766 11.1448 25.7996C11.0016 26.1138 10.8221 26.4203 10.5874 26.6776C10.1804 27.1238 9.63158 27.3895 9.02092 27.4178C8.40788 27.4462 7.81189 27.2114 7.36289 26.8053C6.12262 25.6834 5.29091 22.3209 4.59153 19.4934C4.26372 18.1681 3.96497 16.9603 3.66686 16.1559C3.54006 15.8137 3.39999 15.4672 3.21011 15.1536C3.08246 14.9428 2.93011 14.7315 2.77688 14.5189C2.64368 14.3342 2.50982 14.1485 2.39095 13.9615C1.35233 12.3272 0.606692 10.4367 0.526193 8.49554C0.435542 6.38672 1.20992 4.33052 2.67522 2.78922C4.07708 1.30011 5.6977 0.594601 7.74676 0.520183Z"
          fill={strokeColor}
          stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function FeedbackNew({ isActive = false }: { isActive?: boolean }) {
  const strokeColor = isActive ? "var(--ads-background-interactive)" : "var(--ads-icon-secondary)";

  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Feedback new">
      <svg width="28" height="28" viewBox="0 0 101 99" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M90.3583 46.7358C93.8373 40.5116 96.176 33.215 95.5426 26.0479C94.6893 16.3981 88.2465 7.08327 79.0171 3.43773C73.8585 1.42646 68.1052 1.47682 62.9836 3.57798C61.0873 4.37708 59.4418 5.40557 57.7623 6.54499C54.2175 8.94917 50.9158 11.7141 46.388 9.86402C44.4754 9.08249 42.6568 7.8091 40.966 6.60804C36.6602 3.5496 32.3282 1.71866 26.9254 1.8078C19.8037 2.06645 14.171 4.51851 9.29872 9.69409C4.2059 15.0511 1.51447 22.1976 1.82954 29.527C2.10932 36.2737 4.70087 42.8442 8.3107 48.5245C9.19907 49.9224 10.3284 51.2982 11.1578 52.6678C11.8177 53.7578 12.3046 54.9623 12.7453 56.1515C15.992 64.9122 19.26 87.4375 25.5912 93.1645C27.1518 94.5759 29.2232 95.392 31.3539 95.2933C33.4763 95.1952 35.3838 94.2715 36.7985 92.7209C37.614 91.8266 38.2381 90.7614 38.7358 89.6691C39.7679 87.4028 40.4139 84.9197 41.0576 82.5224C41.6155 80.4635 42.9915 76.8608 43.512 74.7925"
          stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M73.6341 96.8046C87.3907 96.8046 98.5427 85.6527 98.5427 71.8961C98.5427 58.1395 87.3907 46.9875 73.6341 46.9875C59.8775 46.9875 48.7256 58.1395 48.7256 71.8961C48.7256 85.6527 59.8775 96.8046 73.6341 96.8046Z"
          stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M73.6341 60.5L73.6341 75" stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M73.6341 83.5H73.6386" stroke={strokeColor} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function PrepEditToTest({ isActive = false }: { isActive?: boolean }) {
  const strokeColor = isActive ? "var(--ads-background-interactive)" : "var(--ads-icon-secondary)";

  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Prep edit to test">
      <svg width="28" height="28" viewBox="0 0 29 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21.633 12.5V5.52943C21.633 4.42341 21.1817 3.33988 20.2539 2.73775C15.6477 -0.251733 8.60112 -0.245909 4.3379 2.75524C3.49179 3.35088 3.10092 4.37316 3.10092 5.4079V9.96671C3.10092 12.3399 2.75447 14.7004 2.07254 16.9735L0.647546 21.7235C0.348125 22.7215 0.509384 23.8011 1.08739 24.6682C1.73597 25.641 2.82842 26.2254 3.99767 26.2254C7.25926 26.2254 9.40805 26.2254 12.6748 26.2254"
          stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
        <path
          d="M27.1585 16.5077C27.489 16.1774 27.6746 15.7293 27.6747 15.262C27.6747 14.7948 27.4892 14.3466 27.1588 14.0162C26.8285 13.6857 26.3804 13.5001 25.9131 13.5C25.4459 13.4999 24.9977 13.6855 24.6673 14.0159L16.326 22.359C16.1809 22.5037 16.0736 22.6818 16.0135 22.8777L15.1879 25.5977C15.1717 25.6518 15.1705 25.7092 15.1844 25.7639C15.1982 25.8186 15.2266 25.8685 15.2665 25.9084C15.3064 25.9482 15.3564 25.9765 15.4111 25.9903C15.4658 26.004 15.5232 26.0027 15.5773 25.9865L18.2979 25.1615C18.4936 25.102 18.6717 24.9953 18.8166 24.8509L27.1585 16.5077Z"
          stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M23.2998 15.3752L25.7998 17.8752" stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function SwapArchesNew({ isActive = false }: { isActive?: boolean }) {
  const c = isActive ? "var(--ads-background-interactive)" : "var(--ads-icon-secondary)";
  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Swap arches new">
      <svg width="28" height="28" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28.1923 20.8461C28.1923 19.163 27.5237 17.5489 26.3336 16.3587C25.1434 15.1686 23.5293 14.5 21.8461 14.5C20.072 14.5067 18.3691 15.1989 17.0936 16.432L15.5 18.0256" stroke={c} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.5 15.4067V18.0256H18.0621" stroke={c} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.5 20.8462C15.5 22.5293 16.1686 24.1435 17.3587 25.3336C18.5489 26.5237 20.163 27.1923 21.8461 27.1923C23.6203 27.1857 25.3232 26.4934 26.5987 25.2603L28.1923 23.6667" stroke={c} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26.0776 23.6663H28.1929V26.2854" stroke={c} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.5625 1.50024V6.99985C3.5625 7.82822 4.23413 8.49975 5.0625 8.49975C5.75179 8.49975 6.37286 8.49975 7.06214 8.49975C7.89051 8.49975 8.56215 7.82822 8.56215 6.99985V2.50017" stroke={c} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.56152 2.49976V7.99936C8.56152 8.82773 9.23328 9.49926 10.0617 9.49926C11.2974 9.49926 12.3252 9.49926 13.5609 9.49926C14.3893 9.49926 15.0611 8.82773 15.0611 7.99936V3.49968" stroke={c} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.061 4.00042V8.00013C15.061 8.8285 15.7326 9.50003 16.5609 9.50003H20.0607C20.6129 9.50003 21.0606 9.05234 21.0606 8.5001V3.00049" stroke={c} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21.062 3.00014V6.99985C21.062 7.82822 21.7335 8.49975 22.5619 8.49975H25.0617C25.8901 8.49975 26.5616 7.82822 26.5616 6.99985V1.50024" stroke={c} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0.5 0.5C11.1528 3.80637 17.8015 3.9794 28.6247 0.5" stroke={c} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.80762 25.8845V20.8076C2.80762 20.0429 3.42763 19.423 4.19233 19.423C4.82864 19.423 5.40198 19.423 6.03829 19.423C6.80299 19.423 7.423 20.0429 7.423 20.8076V24.9614" stroke={c} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.42236 24.9617V19.8847C7.42236 19.12 8.04249 18.5001 8.80719 18.5001C9.94799 18.5001 10.8967 18.5001 12.0375 18.5001C12.8022 18.5001 13.4224 19.12 13.4224 19.8847V24.0386" stroke={c} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0.5 26.8079C6.23908 25.0266 9.44219 24.2158 14 24.5" stroke={c} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
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

export function HorizontalBottomToolbarScan({
  activeButtons,
  onButtonClick,
  microAnimations = true,
}: {
  activeButtons: Set<number>;
  onButtonClick: (index: number) => void;
  microAnimations?: boolean;
  stackVertical?: boolean;
}) {
  const activeToolLabel = SCAN_TOOLS.find((t) => activeButtons.has(t.index))?.label ?? "No tool selected";

  return (
    <div
      className="content-stretch flex items-stretch relative rounded-[8px] font-['Roboto'] bg-[var(--ads-background-subtle-01)]"
      style={{ boxShadow: "var(--ads-shadow-sm)", padding: "6px" }}
      role="toolbar"
      aria-label="Scan toolbar"
    >
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {`Active tool: ${activeToolLabel}.`}
      </div>

      <div className="bg-[var(--ads-background-subtle-01)] flex flex-1 gap-[8px] items-stretch rounded-[8px] font-['Roboto']">
        {SCAN_TOOLS.map(({ index, label, Icon }) => (
          <ToolButton
            key={index}
            label={label}
            active={activeButtons.has(index)}
            onClick={() => onButtonClick(index)}
            microAnimations={microAnimations}
            tooltipPosition="top"
            className="flex flex-col flex-1 items-center justify-center gap-[2px] p-[4px]"
          >
            {({ active, hovered }) => (
              <>
                <div className="content-stretch flex items-center justify-center relative size-[40px]">
                  <Icon isActive={active} />
                </div>
                <p
                  className="font-['Roboto'] font-normal whitespace-nowrap text-center text-[12px] leading-[14px]"
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
