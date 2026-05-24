/**
 * Toolbar Icons
 * 
 * This file contains all toolbar button icons for both Scan and View pages.
 * To change an icon, simply modify the corresponding component below.
 * 
 * SCAN PAGE ICONS:
 * - MonochromeIcon: Monochrome button
 * - ScanAssistIcon: Scan assist / Feedback button
 * - PrepEditIcon: Prep edit button
 * 
 * VIEW PAGE ICONS:
 * - MonochromeViewIcon: Monochrome button (view)
 * - ReviewToolIcon: Review tool / NIRI button
 * - OcclusalgramIcon: Occlusalgram button
 * - MarginLineIcon: Margin line button
 * - PrepQcIcon: Prep QC button
 * - TrimIcon: Trim button
 */

// Re-export existing icon components for easy access
export { default as ReviewToolIcon } from '../../imports/NiriIonNew';
export { default as OcclusalgramIcon } from '../../imports/OcculsgramNew';
export { default as MarginLineIcon } from '../../imports/MarginLineNew';
export { default as PrepQcIcon } from '../../imports/PrepQcNew';
export { default as TrimIcon } from '../../imports/TrimNew';

// Import SVG paths for scan toolbar icons
import svgPathsScan from '../../imports/svg-76kjqgrbiw';

/**
 * Monochrome Icon (Scan Page)
 * Two overlapping squares icon
 */
export function MonochromeIcon({ isActive = false }: { isActive?: boolean }) {
  const strokeColor = isActive ? "var(--ads-background-interactive-hover)" : "var(--ads-icon-secondary)";

  return (
    <div className="relative shrink-0 size-[60px] flex items-center justify-center" data-name="Monochrome Icon">
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

/**
 * Scan Assist / Feedback Icon (Scan Page)
 * Shows a tooth with feedback indicator
 */
function TrimAreaFeedback() {
  return (
    <div className="absolute inset-[18.33%_8.33%_16.67%_8.33%]" data-name="trim area">
      <div className="absolute bottom-0 left-0 right-0 top-[-2.65%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 41">
          <g id="trim area">
            <path d={svgPathsScan.p1f4faa00} fill="var(--fill-0, var(--ads-background-highlight-red))" id="Vector" />
            <path d={svgPathsScan.p161588f0} fill="var(--fill-0, white)" id="Vector_2" stroke="var(--stroke-0, var(--ads-text-primary))" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.06414" />
            <path d={svgPathsScan.p1031d180} fill="var(--fill-0, var(--ads-background-interactive-hover))" id="Vector_3" stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="2.06414" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export function ScanAssistIcon() {
  return (
    <div className="relative shrink-0 size-[60px]" data-name="Scan Assist Icon">
      <TrimAreaFeedback />
    </div>
  );
}

/**
 * Prep Edit Icon (Scan Page)
 * Shows a tooth with prep QC indicator
 */
function TrimAreaPrepEdit() {
  return (
    <div className="absolute h-[32.2px] left-[calc(50%-0.18px)] top-[calc(50%+0.1px)] translate-x-[-50%] translate-y-[-50%] w-[43.636px]">
      <div className="absolute bottom-0 left-0 right-0 top-[-2.48%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 33">
          <g id="Frame 1618872990">
            <g id="trim area">
              <path d={svgPathsScan.p2b201d80} fill="var(--fill-0, var(--ads-background-highlight-red))" id="Vector" />
              <path d={svgPathsScan.p16a0d0e0} fill="var(--fill-0, white)" id="Vector_2" stroke="var(--stroke-0, var(--ads-text-primary))" strokeMiterlimit="10" strokeWidth="1.4" />
            </g>
            <g id="Shape">
              <path d={svgPathsScan.pabd600} fill="var(--fill-0, var(--ads-background-interactive))" />
              <path clipRule="evenodd" d={svgPathsScan.p21b85980} fill="white" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPathsScan.p1ba64c70} fill="white" fillRule="evenodd" />
              <path d={svgPathsScan.p34f3c300} stroke="var(--stroke-0, white)" strokeLinejoin="round" strokeWidth="0.8" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export function PrepEditIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[60px]" data-name="Prep Edit Icon">
      <div className="absolute left-1/2 size-[48px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
        <TrimAreaPrepEdit />
      </div>
    </div>
  );
}

/**
 * Chevron Icon for expand/collapse
 */
export function ChevronIcon({ isExpanded, direction = 'vertical' }: { isExpanded: boolean; direction?: 'vertical' | 'horizontal' }) {
  const rotation = direction === 'vertical' 
    ? (isExpanded ? 'rotate(90deg)' : 'rotate(-90deg)')
    : (isExpanded ? 'rotate(-90deg)' : 'rotate(90deg)');
    
  return (
    <div className="relative shrink-0 size-[32px]" data-name="ChevronIcon">
      <svg 
        className="block size-full transition-transform duration-300" 
        fill="none" 
        viewBox="0 0 24 24"
        style={{ transform: rotation }}
      >
        <path 
          d="M6 9L12 15L18 9" 
          stroke="var(--ads-text-secondary)" 
          strokeWidth="1" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// Default exports object for convenience
// Import view icons for default export object
import _ReviewToolIcon from '../../imports/NiriIonNew';
import _OcclusalgramIcon from '../../imports/OcculsgramNew';
import _MarginLineIcon from '../../imports/MarginLineNew';
import _PrepQcIcon from '../../imports/PrepQcNew';
import _TrimIcon from '../../imports/TrimNew';

const ToolbarIcons = {
  // Scan page icons
  MonochromeIcon,
  ScanAssistIcon,
  PrepEditIcon,

  // View page icons
  ReviewToolIcon: _ReviewToolIcon,
  OcclusalgramIcon: _OcclusalgramIcon,
  MarginLineIcon: _MarginLineIcon,
  PrepQcIcon: _PrepQcIcon,
  TrimIcon: _TrimIcon,

  // Utility icons
  ChevronIcon,
};

export default ToolbarIcons;

