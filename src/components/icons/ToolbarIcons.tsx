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
  const fillColor = isActive ? "#008EC2" : "#5E646E";
  const strokeColor = isActive ? "#008EC2" : "#5E646E";
  
  return (
    <div className="relative shrink-0 size-[60px] flex items-center justify-center" data-name="Monochrome Icon">
      <svg width="44" height="44" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_monochrome)">
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
          <clipPath id="clip0_monochrome">
            <rect width="60" height="60" fill="white"/>
          </clipPath>
        </defs>
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
            <path d={svgPathsScan.p1f4faa00} fill="var(--fill-0, #FFD6D6)" id="Vector" />
            <path d={svgPathsScan.p161588f0} fill="var(--fill-0, white)" id="Vector_2" stroke="var(--stroke-0, #3D3935)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.06414" />
            <path d={svgPathsScan.p1031d180} fill="var(--fill-0, #008EC2)" id="Vector_3" stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="2.06414" />
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
              <path d={svgPathsScan.p2b201d80} fill="var(--fill-0, #FFD6D6)" id="Vector" />
              <path d={svgPathsScan.p16a0d0e0} fill="var(--fill-0, white)" id="Vector_2" stroke="var(--stroke-0, #3D3935)" strokeMiterlimit="10" strokeWidth="1.4" />
            </g>
            <g id="Shape">
              <path d={svgPathsScan.pabd600} fill="var(--fill-0, #009ACE)" />
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
          stroke="#717182" 
          strokeWidth="1" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// Default exports object for convenience
const ToolbarIcons = {
  // Scan page icons
  MonochromeIcon,
  ScanAssistIcon,
  PrepEditIcon,
  
  // View page icons (re-exported)
  ReviewToolIcon: require('../../imports/NiriIonNew').default,
  OcclusalgramIcon: require('../../imports/OcculsgramNew').default,
  MarginLineIcon: require('../../imports/MarginLineNew').default,
  PrepQcIcon: require('../../imports/PrepQcNew').default,
  TrimIcon: require('../../imports/TrimNew').default,
  
  // Utility icons
  ChevronIcon,
};

export default ToolbarIcons;

