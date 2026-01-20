import { useState } from "react";
import { motion } from "motion/react";
import svgPaths from "./svg-vyw91xr0mn";
import imgScreenshot20240318At1457BackgroundRemoved from "figma:asset/a1dfc57a055d32f098369f51df6fd0791a341b87.png";
import TeethModel3D from "../components/TeethModel3D";
import upperJawModel from "@/assets/3d-models/upper-jaw.ply?url";
import imgScreenshot20240318At1457BackgroundRemovedGrayscale from "figma:asset/d986e19df0e9c14222abc9c62ff49e0276238d2a.png";
import imgScreenshot20240318At1457BackgroundRemovedFeedback from "figma:asset/7235f98944aa9efc68796aee3f4ed01c409cbea7.png";
import imgScreenshot20240318At1457BackgroundRemovedGrayscaleFeedback from "figma:asset/d8e804204d336774af7dc7e2a6b5aeb59aa2b508.png";
import imgImage67 from "figma:asset/49d9f38076a6194269e46687b9daac8309b85fb1.png";
import imgOcclusionHeatmap from "figma:asset/c17f0d7025aceb7deb5df75b4c464fa4ec74f5de.png";
import imgOcclusionHeatmapMonochrome from "figma:asset/d411b5f7af6c8dc24f1c68de9edcc7cc38e7016d.png";
import imgMarginLineView from "../assets/button-images/margin-line/dental-arch-margin-view.png";
import { imgPath4141, imgGroup2917 } from "./svg-fvlvg";
import Toolbar from "./Toolbar-73-13616";
import ExpandedToolbar from "./Toolbar";
import { HorizontalScanToolbar } from "../components/HorizontalToolbarScan";
import { HorizontalViewToolbar } from "../components/HorizontalToolbarView";
import { HorizontalTopToolbarScan } from "../components/HorizontalTopToolbarScan";
import { HorizontalTopToolbarView } from "../components/HorizontalTopToolbarView";
import { HorizontalBottomToolbarScan } from "../components/HorizontalBottomToolbarScan";
import { HorizontalBottomToolbarView } from "../components/HorizontalBottomToolbarView";
import ViewToolbar from "./ViewToolbar";
import HeaderNavigation from "../components/HeaderNavigation";
import JawSelector from "../components/JawSelector";
import Panel from "./Panel";
import CameraNiri from "./CameraNiri";
import Scale from "./Scale";
import Panel881668 from "./Panel-88-1668";
import PrepReviewPanel from "./PrepReviewPanel";
import LayerPanel from "./LayerPanel-97-10893";
import LayoutSwitcher from "../components/LayoutSwitcher";
import CombinedReviewMarginPanel from "../components/CombinedReviewMarginPanel";

function Component3DModelMary({ activeButtons }: { activeButtons: Set<number> }) {
  // Check if monochrome button (index 0) is active
  const isMonochrome = activeButtons.has(0);
  // Check if feedback button (index 1) is active
  const isFeedback = activeButtons.has(1);
  
  // Always show the 3D interactive model - centered and larger
  return (
    <div 
      className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" 
      data-name="3D model - Mary"
      style={{ width: '100%', height: '100%', maxWidth: '1200px', maxHeight: '1000px' }}
    >
      <TeethModel3D
        modelUrl={upperJawModel}
        width="100%"
        height="100%"
        backgroundColor="transparent"
        showControls={true}
        autoRotate={false}
        monochrome={isMonochrome}
        feedback={isFeedback}
      />
    </div>
  );
}

function Component3DModelView({ activeButtons }: { activeButtons: Set<number> }) {
  // Check if monochrome button (index 0) is active
  const isMonochrome = activeButtons.has(0);
  // Check if margin line button (index 3) is active for zoom
  const isMarginLineActive = activeButtons.has(3);
  // No feedback on View page
  
  // Always show the 3D interactive model - centered and larger
  return (
    <div 
      className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" 
      data-name="3D model - View"
      style={{ width: '100%', height: '100%', maxWidth: '1200px', maxHeight: '1000px' }}
    >
      <TeethModel3D
        modelUrl={upperJawModel}
        width="100%"
        height="100%"
        backgroundColor="transparent"
        showControls={true}
        autoRotate={false}
        monochrome={isMonochrome}
        zoomIn={isMarginLineActive}
      />
    </div>
  );
}

// Shared 3D model component that stays mounted across page switches
function Component3DModelShared({ activeButtons, isViewPage }: { activeButtons: Set<number>; isViewPage: boolean }) {
  // Check if monochrome button (index 0) is active
  const isMonochrome = activeButtons.has(0);
  // Check if feedback button (index 1) is active - only for scan page
  const isFeedback = !isViewPage && activeButtons.has(1);
  // Check if margin line button (index 3) is active for zoom - only for view page
  const isMarginLineActive = isViewPage && activeButtons.has(3);
  
  return (
    <div 
      className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" 
      data-name="3D model - Shared"
      style={{ width: '100%', height: '100%', maxWidth: '1200px', maxHeight: '1000px' }}
    >
      <TeethModel3D
        modelUrl={upperJawModel}
        width="100%"
        height="100%"
        backgroundColor="transparent"
        showControls={true}
        autoRotate={false}
        monochrome={isMonochrome}
        feedback={isFeedback}
        zoomIn={isMarginLineActive}
      />
    </div>
  );
}

function Group74() {
  return (
    <div className="absolute inset-[15.83%_14.99%_25.83%_11.67%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 35">
        <g id="Group 3015">
          <path d={svgPaths.p109ff600} fill="url(#paint0_linear_1_7099)" id="Path 4119" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7099" x1="-5.36291e-07" x2="33.8927" y1="-0.49" y2="43.3109">
            <stop stopColor="#59CAF5" />
            <stop offset="1" stopColor="#00ADEF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group75() {
  return (
    <div className="absolute bottom-1/4 left-[10.84%] right-[14.16%] top-[15%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 45 36">
        <g id="Group 3016">
          <path d={svgPaths.pefc00} fill="var(--fill-0, #0067AC)" id="Path 4120" />
        </g>
      </svg>
    </div>
  );
}

function Group76() {
  return (
    <div className="absolute inset-[18.33%_17.49%_28.33%_14.17%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41 32">
        <g id="Group 3017">
          <path d={svgPaths.p21ac8d00} fill="var(--fill-0, #9DDCF9)" id="Path 4121" />
        </g>
      </svg>
    </div>
  );
}

function Group77() {
  return (
    <div className="absolute bottom-1/4 contents left-[10.84%] right-[14.16%] top-[15%]">
      <Group74 />
      <Group75 />
      <Group76 />
    </div>
  );
}

function Group78() {
  return (
    <div className="absolute bottom-1/4 contents left-[10.84%] right-[14.16%] top-[15%]">
      <Group77 />
    </div>
  );
}

function Group79() {
  return (
    <div className="absolute bottom-1/4 contents left-[10.84%] right-[14.16%] top-[15%]">
      <Group78 />
    </div>
  );
}

function Group73() {
  return (
    <div className="absolute inset-[31.67%_9.16%_18.33%_10.84%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 30">
        <g id="Group 3014">
          <path d={svgPaths.p2e64e400} fill="url(#paint0_linear_1_6872)" id="Path 4116" />
          <path d={svgPaths.p26d467e0} fill="var(--fill-0, #0067AC)" id="Path 4117" />
          <path d={svgPaths.p199ad500} fill="var(--fill-0, #9DDCF9)" id="Path 4118" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6872" x1="24" x2="24" y1="0.5" y2="29.5">
            <stop stopColor="#59CAF5" />
            <stop offset="1" stopColor="#00ADEF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group80() {
  return (
    <div className="absolute contents inset-[15%_9.16%_14.54%_10.84%]">
      <p className="absolute font-['Arial_Unicode_MS:Regular',sans-serif] inset-[28.79%_33.33%_14.54%_36.67%] leading-[normal] not-italic text-[25.5px] text-nowrap text-white whitespace-pre">℞</p>
      <Group79 />
      <Group73 />
    </div>
  );
}

function Group83() {
  return (
    <div className="absolute inset-[45.19%_37.21%_30.19%_38.89%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Group 5173">
          <path d={svgPaths.p1c526e00} fill="var(--fill-0, white)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute contents inset-[15%_9.16%_14.54%_10.84%]" data-name="Icon">
      <Group80 />
      <Group83 />
    </div>
  );
}

function HeaderWizardAtoms() {
  return (
    <div className="relative shrink-0 size-[60px]" data-name="./Header/Wizard atoms">
      <Icon />
    </div>
  );
}

function Component() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name=">">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id=">">
          <path d="M13 10L3 20V0L13 10Z" fill="var(--fill-0, #4A4B4D)" id=">_2" />
        </g>
      </svg>
    </div>
  );
}

function HeaderWizardAtoms1({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  return (
    <div 
      className={`relative shrink-0 size-[60px] cursor-pointer ${isActive ? 'bg-[#E0F2FE] rounded-[8px]' : ''}`} 
      data-name="./Header/Wizard atoms"
      onClick={onClick}
    >
      <div className="absolute inset-[11.67%_6.67%_6.67%_15%]" data-name="image 67">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage67} />
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name=">">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id=">">
          <path d="M14 10L4 20V0L14 10Z" fill="var(--fill-0, #4A4B4D)" id=">_2" />
        </g>
      </svg>
    </div>
  );
}

function Path1() {
  return (
    <div className="absolute inset-[38.86%_17.24%_16.58%_14.6%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[1.131px_-10.397px] mask-size-[37.733px_35.361px]" data-name="Path 4141" style={{ maskImage: `url('${imgPath4141}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41 27">
        <g id="Path 4141">
          <path d={svgPaths.p2db7f900} fill="url(#paint0_linear_1_7029)" id="Vector" />
          <path d={svgPaths.p3f495b80} fill="var(--fill-0, #949496)" id="Vector_2" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7029" x1="20.4474" x2="20.4474" y1="0.449379" y2="26.2895">
            <stop stopColor="white" />
            <stop offset="1" stopColor="#E7E7E8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Path2() {
  return (
    <div className="absolute bottom-[31.56%] left-[65.16%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-29.203px_-2.083px] mask-size-[37.733px_35.361px] right-[-4.1%] top-1/4" data-name="Path 4142" style={{ maskImage: `url('${imgPath4141}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 27">
        <g id="Path 4142">
          <path d={svgPaths.p14ed8980} fill="url(#paint0_linear_1_7072)" id="Vector" />
          <path d={svgPaths.p1da05600} fill="var(--fill-0, #949496)" id="Vector_2" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7072" x1="11.6829" x2="11.6829" y1="0.449387" y2="25.6154">
            <stop stopColor="white" />
            <stop offset="1" stopColor="#E7E7E8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Path3() {
  return (
    <div className="absolute bottom-[31.56%] left-[-8.25%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[14.838px_-2.083px] mask-size-[37.733px_35.361px] right-[69.3%] top-1/4" data-name="Path 4143" style={{ maskImage: `url('${imgPath4141}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 27">
        <g id="Path 4142">
          <path d={svgPaths.p14ed8980} fill="url(#paint0_linear_1_7072)" id="Vector" />
          <path d={svgPaths.p1da05600} fill="var(--fill-0, #949496)" id="Vector_2" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7072" x1="11.6829" x2="11.6829" y1="0.449387" y2="25.6154">
            <stop stopColor="white" />
            <stop offset="1" stopColor="#E7E7E8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Path4() {
  return (
    <div className="absolute bottom-[31.56%] left-[29.2%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-7.631px_-2.083px] mask-size-[37.733px_35.361px] right-[31.85%] top-1/4" data-name="Path 4144" style={{ maskImage: `url('${imgPath4141}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 27">
        <g id="Path 4142">
          <path d={svgPaths.p14ed8980} fill="url(#paint0_linear_1_7072)" id="Vector" />
          <path d={svgPaths.p1da05600} fill="var(--fill-0, #949496)" id="Vector_2" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7072" x1="11.6829" x2="11.6829" y1="0.449387" y2="25.6154">
            <stop stopColor="white" />
            <stop offset="1" stopColor="#E7E7E8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group81() {
  return (
    <div className="absolute bottom-[16.58%] contents left-[-8.25%] right-[-4.1%] top-1/4">
      <Path1 />
      <Path2 />
      <Path3 />
      <Path4 />
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="absolute contents inset-[21.53%_20.63%_19.54%_16.48%]" data-name="Mask Group">
      <Group81 />
    </div>
  );
}

function Group82() {
  return (
    <div className="absolute inset-[31.01%_9.57%_16.49%_37.93%]">
      <div className="absolute inset-[-1.59%_-6.35%_-6.35%_-1.59%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 34">
          <g id="Group 4961">
            <g id="Ellipse 464">
              <path d={svgPaths.p35509000} id="Vector" stroke="var(--stroke-0, #0067AC)" strokeMiterlimit="10" />
            </g>
            <path d="M23 23L32 32" id="Line 274" stroke="var(--stroke-0, #0067AC)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute contents inset-[21.53%_9.57%_16.49%_16.48%]" data-name="Icon">
      <MaskGroup />
      <Group82 />
    </div>
  );
}

function HeaderWizardAtoms2({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  return (
    <div 
      className={`relative shrink-0 size-[60px] cursor-pointer ${isActive ? 'bg-[#E0F2FE] rounded-[8px]' : ''}`} 
      data-name="./Header/Wizard atoms"
      onClick={onClick}
    >
      <Icon1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute inset-[29.33%_15%_25.67%_5%]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 27">
        <g id="Icon">
          <path d="M7 3L0 0H7V3Z" fill="var(--fill-0, #9DDCF9)" id="Path 6612" />
          <path d="M9 13L2 10H9V13Z" fill="var(--fill-0, #9DDCF9)" id="Path 6613" />
          <path d="M8 8L1 5H8V8Z" fill="var(--fill-0, #9DDCF9)" id="Path 6614" />
          <g id="Rectangle 1707">
            <path d={svgPaths.p10ef5540} fill="url(#paint0_linear_1_7011)" id="Vector" />
            <path d={svgPaths.p825e800} id="Vector_2" stroke="var(--stroke-0, #949496)" strokeMiterlimit="10" />
          </g>
          <g id="Path 6615">
            <path d={svgPaths.p313d2400} fill="url(#paint1_linear_1_7011)" id="Vector_3" />
            <path d={svgPaths.p1f37b000} fill="var(--fill-0, #949496)" id="Vector_4" />
          </g>
          <g id="Path 6616">
            <path d={svgPaths.p2dbb2d80} fill="url(#paint2_linear_1_7011)" id="Vector_5" />
            <path d={svgPaths.padf9e80} fill="var(--fill-0, #949496)" id="Vector_6" />
          </g>
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7011" x1="27" x2="27" y1="0" y2="27">
            <stop stopColor="white" />
            <stop offset="1" stopColor="#E7E7E8" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_7011" x1="27" x2="27" y1="3867.29" y2="3887.08">
            <stop stopColor="#E7E7E8" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_1_7011" x1="27" x2="27" y1="0.5" y2="20.293">
            <stop stopColor="white" />
            <stop offset="1" stopColor="#E7E7E8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function HeaderWizardAtoms3() {
  return (
    <div className="relative shrink-0 size-[60px]" data-name="./Header/Wizard atoms">
      <Icon2 />
    </div>
  );
}

function WizardNavigation({ currentPage, onPageChange }: { currentPage: string; onPageChange: (page: string) => void }) {
  return (
    <div className="absolute content-stretch flex gap-[5px] items-center justify-center left-[calc(50%+1px)] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="wizard navigation">
      <HeaderWizardAtoms />
      <Component />
      <HeaderWizardAtoms1 isActive={currentPage === 'scan'} onClick={() => onPageChange('scan')} />
      <Component1 />
      <HeaderWizardAtoms2 isActive={currentPage === 'view'} onClick={() => onPageChange('view')} />
      <Component1 />
      <HeaderWizardAtoms3 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[21.87%_31.25%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 19">
        <g id="Group 2579">
          <path d={svgPaths.p21006400} fill="var(--fill-0, white)" id="Path 3464" />
          <path d={svgPaths.p140a97f0} fill="var(--fill-0, white)" id="Ellipse 200" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[21.87%_31.25%]">
      <Group />
    </div>
  );
}

function IconsHelp() {
  return (
    <div className="absolute h-[33.684px] right-[17px] top-[calc(50%-0.16px)] translate-y-[-50%] w-[32px]" data-name="icons/help">
      <div className="absolute bottom-0 left-[6.25%] right-[6.25%] top-[90.62%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 4">
          <path d={svgPaths.p1d7fe600} fill="var(--fill-0, black)" id="Ellipse 198" opacity="0.1" />
        </svg>
      </div>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 34">
        <g id="Group 2578">
          <path d={svgPaths.p3636c900} fill="url(#paint0_linear_1_7211)" id="Ellipse 199" />
          <path d={svgPaths.p37642ec0} fill="var(--fill-0, #399927)" id="Path 3462" />
          <path d={svgPaths.p22856e80} fill="var(--fill-0, #DAEBBA)" id="Path 3463" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7211" x1="16" x2="16" y1="0.526316" y2="33.1579">
            <stop stopColor="#B5D776" />
            <stop offset="1" stopColor="#8AC562" />
          </linearGradient>
        </defs>
      </svg>
      <Group1 />
    </div>
  );
}

function Ellipse() {
  return (
    <div className="absolute inset-[20.6%_20.58%_20.59%_20.57%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 22">
        <g id="Ellipse 197">
          <g id="Vector"></g>
          <path d={svgPaths.p15ddd700} id="Vector_2" stroke="var(--stroke-0, #939598)" strokeMiterlimit="10" />
        </g>
      </svg>
    </div>
  );
}

function IconsSettings() {
  return (
    <div className="absolute h-[35.793px] right-[73px] top-[calc(50%-2.04px)] translate-y-[-50%] w-[34px]" data-name="icons/settings">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 36">
        <g id="Group 2576">
          <g id="Group 2573">
            <path d={svgPaths.p15b8880} fill="url(#paint0_linear_1_7124)" id="Path 3459" />
          </g>
          <g id="Group 2574">
            <path d={svgPaths.p3d793080} fill="var(--fill-0, #717073)" id="Path 3460" />
          </g>
          <g id="Group 2575">
            <path d={svgPaths.p3fa1ba00} fill="var(--fill-0, #F3F3F3)" id="Path 3461" />
          </g>
          <path d={svgPaths.p10740580} fill="var(--fill-0, black)" id="Ellipse 196" opacity="0.1" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7124" x1="17.0042" x2="17.0042" y1="0.0236045" y2="35.7872">
            <stop stopColor="#E7E7E8" />
            <stop offset="1" stopColor="#C9CACB" />
          </linearGradient>
        </defs>
      </svg>
      <Ellipse />
    </div>
  );
}

function IconsBattery() {
  return (
    <div className="absolute h-[34.947px] right-[137.95px] top-[calc(50%-2.46px)] translate-y-[-50%] w-[19.048px]" data-name="icons/Battery">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 35">
        <g id="icons/Battery">
          <rect fill="url(#paint0_linear_1_6993)" height="31" id="Rectangle 896" width="17" x="1" y="3" />
          <path d={svgPaths.p3b5e7d00} fill="var(--fill-0, #CECECE)" id="Vector" />
          <path d={svgPaths.pe459180} fill="var(--fill-0, #CECECE)" id="Vector_2" />
          <path d={svgPaths.p1803b900} fill="var(--fill-0, #868686)" id="Vector_3" />
          <rect fill="var(--fill-0, #CECECE)" height="2" id="Rectangle 895" width="7" x="6.80469" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6993" x1="9.5" x2="8.02823" y1="43.6875" y2="-2.1558">
            <stop stopColor="#C4C4C4" />
            <stop offset="1" stopColor="#FFFBFB" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function L() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[2px] grow h-full items-start min-h-px min-w-px relative shrink-0" data-name="l">
      <div className="basis-0 bg-[#a0daf8] grow min-h-px min-w-px rounded-[2px] shrink-0 w-full" data-name="b" />
      <div className="basis-0 bg-[#b6d77b] grow min-h-px min-w-px rounded-[2px] shrink-0 w-full" data-name="g" />
    </div>
  );
}

function R() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[2px] grow h-full items-start min-h-px min-w-px relative shrink-0" data-name="r">
      <div className="basis-0 bg-[#b6d77b] grow min-h-px min-w-px rounded-[2px] shrink-0 w-full" data-name="g" />
      <div className="basis-0 bg-[#a0daf8] grow min-h-px min-w-px rounded-[2px] shrink-0 w-full" data-name="b" />
    </div>
  );
}

function IconsNewScan() {
  return (
    <div className="content-stretch flex gap-[2px] items-start relative rounded-[2px] shrink-0 size-[36px]" data-name="./ Icons / New Scan">
      <L />
      <R />
    </div>
  );
}

function View() {
  return (
    <div className="absolute box-border content-stretch flex gap-[20px] items-center left-0 p-[20px] top-0" data-name="View">
      <IconsNewScan />
      <div className="flex flex-col font-['Avenir:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#474955] text-[24px] w-[220px]">
        <p className="leading-[36px]">New Scan</p>
      </div>
    </div>
  );
}

function HeaderTopBarITero({ currentPage, onPageChange, onBackToHome }: { currentPage: string; onPageChange: (page: string) => void; onBackToHome?: () => void }) {
  return (
    <div className="absolute h-[76.001px] left-0 right-0 top-0" data-name="Header - Top bar - iTero">
      <div className="absolute inset-[-2.63%_-0.21%_-7.89%_-0.21%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1928 84">
          <g filter="url(#filter0_d_1_7025)" id="back">
            <path d="M1924 2H4V78H1924V2Z" fill="var(--fill-0, white)" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="84" id="filter0_d_1_7025" width="1928" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.149 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_7025" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_7025" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
      <WizardNavigation currentPage={currentPage} onPageChange={onPageChange} />
      <IconsHelp />
      <IconsSettings />
      <IconsBattery />
      <View />
    </div>
  );
}

// Monochrome Icon - Two overlapping squares
function MonoChomrNew({ isActive = false }: { isActive?: boolean }) {
  const fillColor = isActive ? "#008EC2" : "#5E646E";
  const strokeColor = isActive ? "#008EC2" : "#5E646E";
  
  return (
    <div className="relative shrink-0 size-[60px] flex items-center justify-center" data-name="Mono chomr new">
      <svg width="44" height="44" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_monochrome_screen)">
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
          <clipPath id="clip0_monochrome_screen">
            <rect width="60" height="60" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function AohsButton({ isActive, onClick }: { isActive?: boolean; onClick?: () => void }) {
  return (
    <div 
      className={`${isActive ? 'bg-[#E0F2FE]' : 'bg-white'} content-stretch flex flex-col items-center justify-between relative rounded-[10px] shrink-0 size-[60px] cursor-pointer`} 
      data-name="AOHS button"
      onClick={onClick}
    >
      <div aria-hidden="true" className="absolute border-0 border-[#00adef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <MonoChomrNew isActive={isActive} />
    </div>
  );
}

function ToolbarTextLabel({ isActive, onClick }: { isActive?: boolean; onClick?: () => void }) {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative rounded-[4px] shrink-0" data-name="Toolbar Text label">
      <AohsButton isActive={isActive} onClick={onClick} />
    </div>
  );
}

function TrimArea1() {
  return (
    <div className="absolute inset-[18.33%_8.33%_16.67%_8.33%]" data-name="trim area">
      <div className="absolute bottom-0 left-0 right-0 top-[-2.65%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 41">
          <g id="trim area">
            <path d={svgPaths.p1f4faa00} fill="var(--fill-0, #FFD6D6)" id="Vector" />
            <path d={svgPaths.p161588f0} fill="var(--fill-0, white)" id="Vector_2" stroke="var(--stroke-0, #3D3935)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.06414" />
            <path d={svgPaths.p1031d180} fill="var(--fill-0, #008EC2)" id="Vector_3" stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="2.06414" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame3() {
  return <div className="absolute left-1/2 size-[50px] top-1/2 translate-x-[-50%] translate-y-[-50%]" />;
}

function FeedbackNew() {
  return (
    <div className="relative shrink-0 size-[60px]" data-name="Feedback new">
      <TrimArea1 />
      <Frame3 />
    </div>
  );
}

function AohsButton1({ isActive, onClick }: { isActive?: boolean; onClick?: () => void }) {
  return (
    <div 
      className={`${isActive ? 'bg-[#E0F2FE]' : 'bg-white'} content-stretch flex flex-col items-center justify-between relative rounded-[10px] shrink-0 size-[60px] cursor-pointer`} 
      data-name="AOHS button"
      onClick={onClick}
    >
      <div aria-hidden="true" className="absolute border-0 border-[#00adef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <FeedbackNew />
    </div>
  );
}

function ToolbarTextLabel1({ isActive, onClick }: { isActive?: boolean; onClick?: () => void }) {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative rounded-[4px] shrink-0" data-name="Toolbar Text label">
      <AohsButton1 isActive={isActive} onClick={onClick} />
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute h-[39px] left-[calc(50%+0.5px)] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[47px]">
      <div className="absolute bottom-0 left-[-6.38%] right-[-2.13%] top-[-2.56%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 51 40">
          <g id="Frame 1618873037">
            <g id="trim area">
              <path d={svgPaths.p3d2968c0} fill="var(--fill-0, #FFD6D6)" id="Vector" />
              <path d={svgPaths.p15368980} fill="var(--fill-0, white)" id="Vector_2" stroke="var(--stroke-0, #3D3935)" strokeMiterlimit="10" strokeWidth="1.75" />
            </g>
            <g id="Shape">
              <path d={svgPaths.p1e660000} fill="var(--fill-0, #009ACE)" />
              <path clipRule="evenodd" d={svgPaths.pbdf0800} fill="white" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p362805c0} fill="white" fillRule="evenodd" />
              <path d={svgPaths.p3f02d080} stroke="var(--stroke-0, white)" strokeLinejoin="round" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute left-0 size-[60px] top-0">
      <Frame8 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute left-[calc(50%+1px)] size-[60px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
      <Frame2 />
    </div>
  );
}

function PrepEditNew() {
  return (
    <div className="relative shrink-0 size-[60px]" data-name="Prep edit new">
      <Frame1 />
    </div>
  );
}

function AohsButton2({ isActive, onClick }: { isActive?: boolean; onClick?: () => void }) {
  return (
    <div 
      className={`${isActive ? 'bg-[#E0F2FE]' : 'bg-white'} content-stretch flex flex-col items-center justify-between relative rounded-[10px] shrink-0 size-[60px] cursor-pointer`} 
      data-name="AOHS button"
      onClick={onClick}
    >
      <div aria-hidden="true" className="absolute border-0 border-[#00adef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <PrepEditNew />
    </div>
  );
}

function ToolbarTextLabel2({ isActive, onClick }: { isActive?: boolean; onClick?: () => void }) {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative rounded-[4px] shrink-0" data-name="Toolbar Text label">
      <AohsButton2 isActive={isActive} onClick={onClick} />
    </div>
  );
}

function Frame6({ activeButtons, onButtonClick }: { activeButtons: Set<number>; onButtonClick: (index: number) => void }) {
  return (
    <div className="box-border content-stretch flex flex-col gap-[8px] items-start p-[8px] relative shrink-0">
      <ToolbarTextLabel isActive={activeButtons.has(0)} onClick={() => onButtonClick(0)} />
      <ToolbarTextLabel1 isActive={activeButtons.has(1)} onClick={() => onButtonClick(1)} />
      <ToolbarTextLabel2 isActive={activeButtons.has(2)} onClick={() => onButtonClick(2)} />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20.001px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M12.4991 10.0002H2.49878" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66672" />
          <path d="M14.1658 15.0002H2.49878" id="Vector_2" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66672" />
          <path d="M17.4992 4.99994H2.49878" id="Vector_3" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66672" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="flex h-[40px] items-center justify-center relative rounded-[8px] shrink-0 w-[50px] bg-[rgba(0,0,0,0)]" data-name="Button">
      <Icon3 />
    </div>
  );
}

function AohsButton3({ isActive, onClick }: { isActive?: boolean; onClick?: () => void }) {
  return (
    <div 
      className="bg-[rgba(255,255,255,0)] flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[60px] cursor-pointer" 
      data-name="AOHS button"
      onClick={onClick}
    >
      <div aria-hidden="true" className="absolute border-0 border-[#00adef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Button />
    </div>
  );
}

function Frame5({ activeButtons, onButtonClick }: { activeButtons: Set<number>; onButtonClick: (index: number) => void }) {
  return (
    <div className="bg-white relative rounded-bl-[12px] rounded-br-[12px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-bl-[12px] rounded-br-[12px]" />
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-center px-[8px] py-0 relative w-full">
          <AohsButton3 isActive={activeButtons.has(3)} onClick={() => onButtonClick(3)} />
        </div>
      </div>
    </div>
  );
}

function Frame7({ activeButtons, onButtonClick }: { activeButtons: Set<number>; onButtonClick: (index: number) => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0">
      <Frame6 activeButtons={activeButtons} onButtonClick={onButtonClick} />
      <Frame5 activeButtons={activeButtons} onButtonClick={onButtonClick} />
    </div>
  );
}

function OldToolbarUnused({ activeButtons, onButtonClick }: { activeButtons: Set<number>; onButtonClick: (index: number) => void }) {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col gap-[8px] items-center justify-center px-0 py-[8px] right-[14px] rounded-[4px] top-[93px]" data-name="Toolbar">
      <Frame7 activeButtons={activeButtons} onButtonClick={onButtonClick} />
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute inset-[1.86%_4.31%_52.56%_4.31%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 212 196">
        <g id="Group 2871">
          <path d={svgPaths.p1e7edd00} fill="var(--fill-0, #F2C7C2)" id="Path 3894" />
          <path d={svgPaths.p1c511e00} fill="var(--fill-0, #D96657)" id="Path 3895" />
        </g>
      </svg>
    </div>
  );
}

function Group23() {
  return (
    <div className="absolute bottom-[92.56%] left-1/2 right-[35.78%] top-0">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33 32">
        <g id="Group 2872">
          <path d={svgPaths.p32c3cb00} fill="var(--fill-0, #EBF2F7)" id="Path 3896" />
          <path d={svgPaths.p17764c00} fill="url(#paint0_linear_1_6879)" id="Path 3897" />
          <path d={svgPaths.p1ec68000} fill="var(--fill-0, #7AABCC)" id="Path 3898" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6879" x1="16.5" x2="16.5" y1="26" y2="6">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group24() {
  return (
    <div className="absolute bottom-[91.16%] left-[63.36%] right-1/4 top-[2.56%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 27">
        <g id="Group 2873">
          <path d={svgPaths.p3f828b80} fill="var(--fill-0, #EBF2F7)" id="Path 3899" />
          <path d={svgPaths.p197ee600} fill="url(#paint0_linear_1_6903)" id="Path 3900" />
          <path d={svgPaths.p3f5ae230} fill="var(--fill-0, #7AABCC)" id="Path 3901" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6903" x1="13.5096" x2="13.5096" y1="21.0002" y2="5.99072">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group25() {
  return (
    <div className="absolute inset-[7.21%_15.52%_86.74%_70.69%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 26">
        <g id="Group 2874">
          <path d={svgPaths.p119c2d80} fill="var(--fill-0, #EBF2F7)" id="Path 3902" />
          <path d={svgPaths.pc227500} fill="url(#paint0_linear_1_6867)" id="Path 3903" />
          <path d={svgPaths.p37bc9500} fill="var(--fill-0, #7AABCC)" id="Path 3904" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6867" x1="16" x2="16" y1="19.999" y2="5.99902">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group26() {
  return (
    <div className="absolute inset-[12.56%_10.35%_80.93%_76.29%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 28">
        <g id="Group 2875">
          <path d={svgPaths.pf05bcc0} fill="var(--fill-0, #EBF2F7)" id="Path 3905" />
          <path d={svgPaths.p2f77cf00} fill="url(#paint0_linear_1_7065)" id="Path 3906" />
          <path d={svgPaths.pc161400} fill="var(--fill-0, #7AABCC)" id="Path 3907" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7065" x1="15.5004" x2="15.5004" y1="22.0018" y2="5.99707">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group27() {
  return (
    <div className="absolute inset-[18.6%_6.47%_74.88%_81.03%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 29">
        <g id="Group 2876">
          <path d={svgPaths.p26e5a570} fill="var(--fill-0, #EBF2F7)" id="Path 3908" />
          <path d={svgPaths.pecd5c80} fill="url(#paint0_linear_1_7216)" id="Path 3909" />
          <path d={svgPaths.p4200d00} fill="var(--fill-0, #7AABCC)" id="Path 3910" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7216" x1="14.4944" x2="14.4944" y1="22.0149" y2="6.01563">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group28() {
  return (
    <div className="absolute bottom-[59.3%] left-[85.77%] right-0 top-[32.33%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33 36">
        <g id="Group 2877">
          <path d={svgPaths.p3d605200} fill="var(--fill-0, #EBF2F7)" id="Path 3911" />
          <path d={svgPaths.p3022b600} fill="url(#paint0_linear_1_6860)" id="Path 3912" />
          <path d={svgPaths.p1d33ff00} fill="var(--fill-0, #7AABCC)" id="Path 3913" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6860" x1="16.5039" x2="16.5039" y1="30" y2="5.99609">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group29() {
  return (
    <div className="absolute inset-[24.88%_3.02%_67.44%_83.19%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 33">
        <g id="Group 2878">
          <path d={svgPaths.p34f50700} fill="var(--fill-0, #EBF2F7)" id="Path 3914" />
          <path d={svgPaths.p27fa7f00} fill="url(#paint0_linear_1_7233)" id="Path 3915" />
          <path d={svgPaths.p1add80} fill="var(--fill-0, #7AABCC)" id="Path 3916" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7233" x1="15.9926" x2="15.9926" y1="27.0029" y2="6.00293">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group30() {
  return (
    <div className="absolute inset-[40.7%_0.87%_50.93%_86.63%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 36">
        <g id="Group 2879">
          <path d={svgPaths.p4b82800} fill="var(--fill-0, #EBF2F7)" id="Path 3917" />
          <path d={svgPaths.p15f82840} fill="url(#paint0_linear_1_6789)" id="Path 3918" />
          <path d={svgPaths.p3a629000} fill="var(--fill-0, #7AABCC)" id="Path 3919" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6789" x1="14.5068" x2="14.5068" y1="29.998" y2="5.99707">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group31() {
  return (
    <div className="absolute bottom-[50.93%] contents left-1/2 right-0 top-0">
      <Group23 />
      <Group24 />
      <Group25 />
      <Group26 />
      <Group27 />
      <Group28 />
      <Group29 />
      <Group30 />
    </div>
  );
}

function Group32() {
  return (
    <div className="absolute bottom-[92.56%] left-[35.77%] right-1/2 top-0">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33 32">
        <g id="Group 2881">
          <path d={svgPaths.p54b4600} fill="var(--fill-0, #EBF2F7)" id="Path 3920" />
          <path d={svgPaths.p69b3e00} fill="url(#paint0_linear_1_6970)" id="Path 3921" />
          <path d={svgPaths.p34d5bfb2} fill="var(--fill-0, #7AABCC)" id="Path 3922" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6970" x1="-2660.5" x2="-2660.5" y1="26" y2="6">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group33() {
  return (
    <div className="absolute bottom-[91.16%] left-1/4 right-[63.37%] top-[2.56%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 27">
        <g id="Group 2882">
          <path d={svgPaths.p17994980} fill="var(--fill-0, #EBF2F7)" id="Path 3923" />
          <path d={svgPaths.p2b511300} fill="url(#paint0_linear_1_6847)" id="Path 3924" />
          <path d={svgPaths.p17516b00} fill="var(--fill-0, #7AABCC)" id="Path 3925" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6847" x1="-2607.52" x2="-2607.52" y1="21.0007" y2="5.99121">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group34() {
  return (
    <div className="absolute inset-[7.21%_70.69%_86.74%_15.52%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 26">
        <g id="Group 2883">
          <path d={svgPaths.p3ca5e780} fill="var(--fill-0, #EBF2F7)" id="Path 3926" />
          <path d={svgPaths.p370bf600} fill="url(#paint0_linear_1_6838)" id="Path 3927" />
          <path d={svgPaths.p3fa4f180} fill="var(--fill-0, #7AABCC)" id="Path 3928" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6838" x1="-2566" x2="-2566" y1="20" y2="6">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group35() {
  return (
    <div className="absolute inset-[12.56%_76.29%_80.93%_10.34%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 28">
        <g id="Group 2884">
          <path d={svgPaths.p1707c8a0} fill="var(--fill-0, #EBF2F7)" id="Path 3929" />
          <path d={svgPaths.pac6c980} fill="url(#paint0_linear_1_6828)" id="Path 3930" />
          <path d={svgPaths.p299e4880} fill="var(--fill-0, #7AABCC)" id="Path 3931" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6828" x1="-2541.99" x2="-2541.99" y1="22.0049" y2="6.00488">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group36() {
  return (
    <div className="absolute inset-[18.6%_81.04%_74.88%_6.46%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 29">
        <g id="Group 2885">
          <path d={svgPaths.p1dce1800} fill="var(--fill-0, #EBF2F7)" id="Path 3932" />
          <path d={svgPaths.p1fff6600} fill="url(#paint0_linear_1_7142)" id="Path 3933" />
          <path d={svgPaths.p3a4dd200} fill="var(--fill-0, #7AABCC)" id="Path 3934" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7142" x1="-2522.53" x2="-2522.53" y1="22.0149" y2="6.0127">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group37() {
  return (
    <div className="absolute bottom-[59.3%] left-0 right-[85.78%] top-[32.33%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33 36">
        <g id="Group 2886">
          <path d={svgPaths.p2e161380} fill="var(--fill-0, #EBF2F7)" id="Path 3935" />
          <path d={svgPaths.p2e6dcdb0} fill="url(#paint0_linear_1_6823)" id="Path 3936" />
          <path d={svgPaths.p321fd580} fill="var(--fill-0, #7AABCC)" id="Path 3937" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6823" x1="-2494.51" x2="-2494.51" y1="30" y2="6.00195">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group38() {
  return (
    <div className="absolute inset-[24.88%_83.19%_67.44%_3.02%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 33">
        <g id="Group 2887">
          <path d={svgPaths.p1799900} fill="var(--fill-0, #EBF2F7)" id="Path 3938" />
          <path d={svgPaths.p73b3980} fill="url(#paint0_linear_1_7242)" id="Path 3939" />
          <path d={svgPaths.p1d753900} fill="var(--fill-0, #7AABCC)" id="Path 3940" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7242" x1="-2508.22" x2="-2508.22" y1="27" y2="6">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group39() {
  return (
    <div className="absolute inset-[40.7%_86.64%_50.93%_0.86%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 36">
        <g id="Group 2888">
          <path d={svgPaths.p1dde6c00} fill="var(--fill-0, #EBF2F7)" id="Path 3941" />
          <path d={svgPaths.p26392e00} fill="url(#paint0_linear_1_6813)" id="Path 3942" />
          <path d={svgPaths.p4312280} fill="var(--fill-0, #7AABCC)" id="Path 3943" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6813" x1="-2496.47" x2="-2496.47" y1="30.002" y2="6.00195">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group40() {
  return (
    <div className="absolute bottom-[50.93%] contents left-0 right-1/2 top-0">
      <Group32 />
      <Group33 />
      <Group34 />
      <Group35 />
      <Group36 />
      <Group37 />
      <Group38 />
      <Group39 />
    </div>
  );
}

function Group41() {
  return (
    <div className="absolute bottom-[50.93%] contents left-0 right-0 top-0">
      <Group31 />
      <Group40 />
    </div>
  );
}

function Group42() {
  return (
    <div className="absolute bottom-[50.93%] contents left-0 right-0 top-0">
      <Group22 />
      <Group41 />
    </div>
  );
}

function Upper() {
  return (
    <div className="absolute bottom-[50.93%] contents left-0 right-0 top-0" data-name="Upper">
      <Group42 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[55.12%_6.47%_1.86%_7.33%]">
      <div className="absolute inset-[-1.62%_-1.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 206 191">
          <g id="Group 2696">
            <path d={svgPaths.p38ab3ea0} id="Path 3645" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.pfcea780} id="Path 3646" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[84.88%_14.23%_8.14%_72.84%]">
      <div className="absolute inset-[-10%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
          <g id="Group 2697">
            <path d={svgPaths.p20380900} id="Path 3647" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p9b6a7f0} id="Path 3648" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p26ce0340} id="Path 3649" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-[79.07%_9.05%_14.19%_78.88%]">
      <div className="absolute inset-[-10.34%_-10.7%_-10.34%_-10.71%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 35">
          <g id="Group 2698">
            <path d={svgPaths.p51d7500} id="Path 3650" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p259e2000} id="Path 3651" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p23b7a700} id="Path 3652" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute inset-[62.56%_1.73%_28.6%_83.19%]">
      <div className="absolute inset-[-7.89%_-8.57%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41 44">
          <g id="Group 2699">
            <path d={svgPaths.p2d173b80} id="Path 3653" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p39a6da80} id="Path 3654" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p23d5ee80} id="Path 3655" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute inset-[71.39%_4.74%_20.7%_81.89%]">
      <div className="absolute inset-[-8.82%_-9.68%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 40">
          <g id="Group 2700">
            <path d={svgPaths.p7a3a3a0} id="Path 3656" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p17b0de80} id="Path 3657" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p2192bb80} id="Path 3658" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute inset-[53.72%_1.29%_37.21%_84.91%]">
      <div className="absolute inset-[-7.69%_-9.4%_-7.69%_-9.38%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38 45">
          <g id="Group 2701">
            <path d={svgPaths.p1bbef3f0} id="Path 3659" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p38787fc0} id="Path 3660" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p25b59500} id="Path 3661" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute bottom-0 left-1/2 right-[40.52%] top-[93.95%]">
      <div className="absolute inset-[-11.54%_-13.64%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 32">
          <g id="Group 2702">
            <path d={svgPaths.p24939900} id="Path 3662" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p13c63300} id="Path 3663" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p35d27f00} id="Path 3664" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute inset-[93.37%_31.39%_1.04%_59.13%]">
      <div className="absolute inset-[-12.5%_-13.65%_-12.5%_-13.64%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 30">
          <g id="Group 2703">
            <path d={svgPaths.p172aa480} id="Path 3665" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p8d2dc00} id="Path 3666" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p71ba870} id="Path 3667" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute inset-[90.47%_21.98%_3.95%_66.38%]">
      <div className="absolute inset-[-12.5%_-11.11%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33 30">
          <g id="Group 2704">
            <path d={svgPaths.p110ab580} id="Path 3668" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p1c0a1b80} id="Path 3669" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p17ce4b00} id="Path 3670" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute bottom-0 contents left-1/2 right-[1.29%] top-[53.72%]">
      <Group3 />
      <Group4 />
      <Group5 />
      <Group6 />
      <Group7 />
      <Group8 />
      <Group9 />
      <Group10 />
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute inset-[84.88%_72.85%_8.14%_14.22%]">
      <div className="absolute inset-[-10%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
          <g id="Group 2706">
            <path d={svgPaths.p2568c400} id="Path 3671" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p33874b80} id="Path 3672" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p37fae480} id="Path 3673" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute inset-[79.07%_78.87%_14.19%_9.06%]">
      <div className="absolute inset-[-10.34%_-10.71%_-10.34%_-10.7%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 35">
          <g id="Group 2707">
            <path d={svgPaths.p11a31500} id="Path 3674" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p35fd8300} id="Path 3675" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p3af78af0} id="Path 3676" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute inset-[62.56%_83.19%_28.6%_1.72%]">
      <div className="absolute inset-[-7.89%_-8.57%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41 44">
          <g id="Group 2708">
            <path d={svgPaths.p37bb4b80} id="Path 3677" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p8634ff2} id="Path 3678" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p1f8d1330} id="Path 3679" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute inset-[71.4%_81.9%_20.7%_4.74%]">
      <div className="absolute inset-[-8.82%_-9.68%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 40">
          <g id="Group 2709">
            <path d={svgPaths.p120cd600} id="Path 3680" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p3eb95000} id="Path 3681" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p7384c80} id="Path 3682" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute inset-[53.72%_84.91%_37.21%_1.29%]">
      <div className="absolute inset-[-7.69%_-9.38%_-7.69%_-9.4%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38 45">
          <g id="Group 2710">
            <path d={svgPaths.p1bba2f80} id="Path 3683" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p24c31cb0} id="Path 3684" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p25324a00} id="Path 3685" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute bottom-0 left-[40.52%] right-1/2 top-[93.95%]">
      <div className="absolute inset-[-11.54%_-13.64%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 32">
          <g id="Group 2711">
            <path d={svgPaths.p16c51f00} id="Path 3686" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p45fc272} id="Path 3687" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p29c76b00} id="Path 3688" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute inset-[93.38%_59.13%_1.04%_31.39%]">
      <div className="absolute inset-[-12.5%_-13.64%_-12.5%_-13.65%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 30">
          <g id="Group 2712">
            <path d={svgPaths.p3dcebd00} id="Path 3689" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p1c7e4a00} id="Path 3690" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p1c972200} id="Path 3691" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute inset-[90.47%_66.38%_3.95%_21.98%]">
      <div className="absolute inset-[-12.5%_-11.11%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33 30">
          <g id="Group 2713">
            <path d={svgPaths.p1bc59b40} id="Path 3692" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p117c0f80} id="Path 3693" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
            <path d={svgPaths.p11e37680} id="Path 3694" stroke="var(--stroke-0, #00ADEF)" strokeLinejoin="round" strokeWidth="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute bottom-0 contents left-[1.29%] right-1/2 top-[53.72%]">
      <Group12 />
      <Group13 />
      <Group14 />
      <Group15 />
      <Group16 />
      <Group17 />
      <Group18 />
      <Group19 />
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute bottom-0 contents left-[1.29%] right-[1.29%] top-[53.72%]">
      <Group11 />
      <Group20 />
    </div>
  );
}

function Blue() {
  return (
    <div className="absolute bottom-0 contents left-[1.29%] right-[1.29%] top-[53.72%]" data-name="Blue">
      <Group2 />
      <Group21 />
    </div>
  );
}

function Path() {
  return (
    <div className="absolute inset-[55.58%_6.47%_1.86%_7.33%]" data-name="Path 3944">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 200 183">
        <g id="Path 3944">
          <path d={svgPaths.p299f0650} fill="var(--fill-0, #F2C7C2)" id="Vector" />
          <path d={svgPaths.p2552c080} fill="var(--fill-0, #D96657)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group43() {
  return (
    <div className="absolute inset-[84.88%_14.23%_8.14%_72.84%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="Group 2893">
          <path d={svgPaths.p12a85280} fill="var(--fill-0, #EBF2F7)" id="Path 3945" />
          <path d={svgPaths.p368cb900} fill="url(#paint0_linear_1_6733)" id="Path 3946" />
          <path d={svgPaths.p38cd8500} fill="var(--fill-0, #7AABCC)" id="Path 3947" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6733" x1="15.0008" x2="15.0008" y1="24.0039" y2="6.00391">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group44() {
  return (
    <div className="absolute inset-[79.07%_9.05%_14.19%_78.88%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 29">
        <g id="Group 2894">
          <path d={svgPaths.pf166a00} fill="var(--fill-0, #EBF2F7)" id="Path 3948" />
          <path d={svgPaths.p300d6900} fill="url(#paint0_linear_1_6728)" id="Path 3949" />
          <path d={svgPaths.p3e391700} fill="var(--fill-0, #7AABCC)" id="Path 3950" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6728" x1="13.9773" x2="13.9773" y1="23.0032" y2="6.00049">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group45() {
  return (
    <div className="absolute inset-[62.56%_1.73%_28.6%_83.19%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 38">
        <g id="Group 2895">
          <path d={svgPaths.pfe37400} fill="var(--fill-0, #EBF2F7)" id="Path 3951" />
          <path d={svgPaths.p19bc2d00} fill="url(#paint0_linear_1_6718)" id="Path 3952" />
          <path d={svgPaths.p28a0fc00} fill="var(--fill-0, #7AABCC)" id="Path 3953" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6718" x1="17.4906" x2="17.4906" y1="32" y2="6">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group46() {
  return (
    <div className="absolute inset-[71.39%_4.74%_20.7%_81.89%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 34">
        <g id="Group 2896">
          <path d={svgPaths.p17a14af0} fill="var(--fill-0, #EBF2F7)" id="Path 3954" />
          <path d={svgPaths.p2c5c0400} fill="url(#paint0_linear_1_6713)" id="Path 3955" />
          <path d={svgPaths.p2b124600} fill="var(--fill-0, #7AABCC)" id="Path 3956" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6713" x1="15.5019" x2="15.5019" y1="28.0039" y2="6.00391">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group47() {
  return (
    <div className="absolute inset-[53.72%_1.29%_37.21%_84.91%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 39">
        <g id="Group 2897">
          <path d={svgPaths.p8e82b00} fill="var(--fill-0, #EBF2F7)" id="Path 3957" />
          <path d={svgPaths.p3e98300} fill="url(#paint0_linear_1_6708)" id="Path 3958" />
          <path d={svgPaths.p148ba6f0} fill="var(--fill-0, #7AABCC)" id="Path 3959" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6708" x1="15.9964" x2="15.9964" y1="33" y2="6.00391">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group48() {
  return (
    <div className="absolute bottom-0 left-1/2 right-[40.52%] top-[93.95%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 26">
        <g id="Group 2898">
          <path d={svgPaths.pb517a00} fill="var(--fill-0, #EBF2F7)" id="Path 3960" />
          <path d={svgPaths.p102a1400} fill="url(#paint0_linear_1_6833)" id="Path 3961" />
          <path d={svgPaths.p1539c800} fill="var(--fill-0, #7AABCC)" id="Path 3962" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6833" x1="10.803" x2="10.803" y1="20.0175" y2="5.99902">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group49() {
  return (
    <div className="absolute inset-[93.37%_31.39%_1.05%_59.13%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 24">
        <g id="Group 2899">
          <path d={svgPaths.p39e08b80} fill="var(--fill-0, #EBF2F7)" id="Path 3963" />
          <path d={svgPaths.p3372d900} fill="url(#paint0_linear_1_7190)" id="Path 3964" />
          <path d={svgPaths.p3e6b9700} fill="var(--fill-0, #7AABCC)" id="Path 3965" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7190" x1="10.8847" x2="10.8847" y1="18" y2="6.13721">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group50() {
  return (
    <div className="absolute inset-[90.47%_21.98%_3.95%_66.38%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 24">
        <g id="Group 2900">
          <path d={svgPaths.p16d01c00} fill="var(--fill-0, #EBF2F7)" id="Path 3966" />
          <path d={svgPaths.p341f6400} fill="url(#paint0_linear_1_6703)" id="Path 3967" />
          <path d={svgPaths.p1fd43300} fill="var(--fill-0, #7AABCC)" id="Path 3968" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6703" x1="13.5" x2="13.5" y1="18.0035" y2="6">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Right() {
  return (
    <div className="absolute bottom-0 contents left-1/2 right-[1.29%] top-[53.72%]" data-name="right">
      <Group43 />
      <Group44 />
      <Group45 />
      <Group46 />
      <Group47 />
      <Group48 />
      <Group49 />
      <Group50 />
    </div>
  );
}

function Group51() {
  return (
    <div className="absolute inset-[84.88%_72.85%_8.14%_14.22%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="Group 2902">
          <path d={svgPaths.p72d4800} fill="var(--fill-0, #EBF2F7)" id="Path 3969" />
          <path d={svgPaths.pcce4500} fill="url(#paint0_linear_1_6698)" id="Path 3970" />
          <path d={svgPaths.p146a1100} fill="var(--fill-0, #7AABCC)" id="Path 3971" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6698" x1="-2408.94" x2="-2408.94" y1="23.999" y2="5.99902">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group52() {
  return (
    <div className="absolute inset-[79.07%_78.87%_14.19%_9.06%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 29">
        <g id="Group 2903">
          <path d={svgPaths.p2f982b00} fill="var(--fill-0, #EBF2F7)" id="Path 3972" />
          <path d={svgPaths.p3c2a0800} fill="url(#paint0_linear_1_6693)" id="Path 3973" />
          <path d={svgPaths.p174a2800} fill="var(--fill-0, #7AABCC)" id="Path 3974" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6693" x1="-2380.55" x2="-2380.55" y1="22.9983" y2="5.99561">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group53() {
  return (
    <div className="absolute inset-[62.56%_83.19%_28.6%_1.72%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 38">
        <g id="Group 2904">
          <path d={svgPaths.p32181ec0} fill="var(--fill-0, #EBF2F7)" id="Path 3975" />
          <path d={svgPaths.p390017f0} fill="url(#paint0_linear_1_6688)" id="Path 3976" />
          <path d={svgPaths.p1914eb00} fill="var(--fill-0, #7AABCC)" id="Path 3977" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6688" x1="-2353.51" x2="-2353.51" y1="32" y2="6">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group54() {
  return (
    <div className="absolute inset-[71.4%_81.9%_20.7%_4.74%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 34">
        <g id="Group 2905">
          <path d={svgPaths.p2d67a400} fill="var(--fill-0, #EBF2F7)" id="Path 3978" />
          <path d={svgPaths.pe7f4f00} fill="url(#paint0_linear_1_7228)" id="Path 3979" />
          <path d={svgPaths.p3a61b400} fill="var(--fill-0, #7AABCC)" id="Path 3980" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7228" x1="-2365.51" x2="-2365.51" y1="27.9951" y2="5.99316">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group55() {
  return (
    <div className="absolute inset-[53.72%_84.91%_37.21%_1.29%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 39">
        <g id="Group 2906">
          <path d={svgPaths.p4d69d00} fill="var(--fill-0, #EBF2F7)" id="Path 3981" />
          <path d={svgPaths.p3cde7ef0} fill="url(#paint0_linear_1_7006)" id="Path 3982" />
          <path d={svgPaths.pf92b500} fill="var(--fill-0, #7AABCC)" id="Path 3983" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7006" x1="-2350.28" x2="-2350.28" y1="33.001" y2="5.99707">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group56() {
  return (
    <div className="absolute bottom-0 left-[40.52%] right-1/2 top-[93.95%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 26">
        <g id="Group 2907">
          <path d={svgPaths.p3367fb00} fill="var(--fill-0, #EBF2F7)" id="Path 3984" />
          <path d={svgPaths.pd53a200} fill="url(#paint0_linear_1_6683)" id="Path 3985" />
          <path d={svgPaths.paf1a780} fill="var(--fill-0, #7AABCC)" id="Path 3986" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6683" x1="-2527.45" x2="-2527.45" y1="20.0159" y2="5.99658">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group57() {
  return (
    <div className="absolute inset-[93.38%_59.13%_1.04%_31.39%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 24">
        <g id="Group 2908">
          <path d={svgPaths.p19b79080} fill="var(--fill-0, #EBF2F7)" id="Path 3987" />
          <path d={svgPaths.p1ea0fd80} fill="url(#paint0_linear_1_6678)" id="Path 3988" />
          <path d={svgPaths.p2a6657c0} fill="var(--fill-0, #7AABCC)" id="Path 3989" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6678" x1="-2484.47" x2="-2484.47" y1="17.9878" y2="6.125">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group58() {
  return (
    <div className="absolute inset-[90.47%_66.38%_3.95%_21.98%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 24">
        <g id="Group 2909">
          <path d={svgPaths.p3c839400} fill="var(--fill-0, #EBF2F7)" id="Path 3990" />
          <path d={svgPaths.p1c178872} fill="url(#paint0_linear_1_6673)" id="Path 3991" />
          <path d={svgPaths.p31600e00} fill="var(--fill-0, #7AABCC)" id="Path 3992" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6673" x1="-2443.5" x2="-2443.5" y1="18.0014" y2="6">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Left() {
  return (
    <div className="absolute bottom-0 contents left-[1.29%] right-1/2 top-[53.72%]" data-name="left">
      <Group51 />
      <Group52 />
      <Group53 />
      <Group54 />
      <Group55 />
      <Group56 />
      <Group57 />
      <Group58 />
    </div>
  );
}

function Lower() {
  return (
    <div className="absolute bottom-0 contents left-[1.29%] right-[1.29%] top-[53.72%]" data-name="lower">
      <Right />
      <Left />
    </div>
  );
}

function Lower1() {
  return (
    <div className="absolute bottom-0 contents left-[1.29%] right-[1.29%] top-[53.72%]" data-name="Lower">
      <Blue />
      <Path />
      <Lower />
    </div>
  );
}

function Group59() {
  return (
    <div className="absolute inset-[50.53%_60.64%_44.57%_34.21%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.213px_-45.264px] mask-size-[74px_86px]" style={{ maskImage: `url('${imgGroup2917}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 22">
        <g id="Group 2917">
          <path d={svgPaths.p2ed4d600} fill="var(--fill-0, #EBF2F7)" id="Path 4005" />
          <path d={svgPaths.p1c6fd200} fill="url(#paint0_linear_1_6666)" id="Path 4006" />
          <path d={svgPaths.p17997900} fill="var(--fill-0, #7AABCC)" id="Path 4007" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6666" x1="5.96608" x2="5.96608" y1="21.0796" y2="0.000488281">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group60() {
  return (
    <div className="absolute inset-[51.56%_50.02%_44.08%_44.49%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-24.057px_-49.697px] mask-size-[74px_86px]" style={{ maskImage: `url('${imgGroup2917}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 19">
        <g id="Group 2918">
          <path d={svgPaths.p1fc88380} fill="var(--fill-0, #EBF2F7)" id="Path 4008" />
          <path d={svgPaths.p10316000} fill="url(#paint0_linear_1_6661)" id="Path 4009" />
          <path d={svgPaths.p22f58470} fill="var(--fill-0, #7AABCC)" id="Path 4010" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6661" x1="6.36276" x2="6.36276" y1="18.7405" y2="0">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group61() {
  return (
    <div className="absolute inset-[51.55%_55.5%_44.43%_39.34%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-12.105px_-49.681px] mask-size-[74px_86px]" style={{ maskImage: `url('${imgGroup2917}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 18">
        <g id="Group 2919">
          <path d={svgPaths.p3e84b270} fill="var(--fill-0, #EBF2F7)" id="Path 4011" />
          <path d={svgPaths.p3fccfd80} fill="url(#paint0_linear_1_6656)" id="Path 4012" />
          <path d={svgPaths.p104e0500} fill="var(--fill-0, #7AABCC)" id="Path 4013" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6656" x1="5.99066" x2="5.99066" y1="17.2582" y2="2.08174e-08">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group62() {
  return (
    <div className="absolute inset-[50.53%_34.35%_44.57%_60.51%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-61.219px_-45.265px] mask-size-[74px_86px]" style={{ maskImage: `url('${imgGroup2917}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 22">
        <g id="Group 2924">
          <path d={svgPaths.p3a9a7270} fill="var(--fill-0, #EBF2F7)" id="Path 4026" />
          <path d={svgPaths.pa6fd880} fill="url(#paint0_linear_1_6975)" id="Path 4027" />
          <path d={svgPaths.p379f5200} fill="var(--fill-0, #7AABCC)" id="Path 4028" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6975" x1="5.9666" x2="5.9666" y1="21.0791" y2="0">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group63() {
  return (
    <div className="absolute inset-[51.56%_44.63%_44.08%_49.89%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-36.582px_-49.697px] mask-size-[74px_86px]" style={{ maskImage: `url('${imgGroup2917}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 19">
        <g id="Group 2925">
          <path d={svgPaths.p24ab9a00} fill="var(--fill-0, #EBF2F7)" id="Path 4029" />
          <path d={svgPaths.p2782f000} fill="url(#paint0_linear_1_6651)" id="Path 4030" />
          <path d={svgPaths.p3edef240} fill="var(--fill-0, #7AABCC)" id="Path 4031" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6651" x1="6.3596" x2="6.3596" y1="18.7405" y2="0">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group64() {
  return (
    <div className="absolute inset-[51.55%_39.47%_44.43%_55.36%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-49.273px_-49.678px] mask-size-[74px_86px]" style={{ maskImage: `url('${imgGroup2917}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 18">
        <g id="Group 2926">
          <path d={svgPaths.p3b0b7d00} fill="var(--fill-0, #EBF2F7)" id="Path 4032" />
          <path d={svgPaths.p235ab300} fill="url(#paint0_linear_1_6646)" id="Path 4033" />
          <path d={svgPaths.p2107c600} fill="var(--fill-0, #7AABCC)" id="Path 4034" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6646" x1="5.99613" x2="5.99613" y1="17.2606" y2="0.00244141">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Lower2() {
  return (
    <div className="absolute contents inset-[50.53%_34.35%_44.08%_34.21%]" data-name="lower">
      <Group59 />
      <Group60 />
      <Group61 />
      <Group62 />
      <Group63 />
      <Group64 />
    </div>
  );
}

function Group65() {
  return (
    <div className="absolute inset-[46.95%_64.08%_48.14%_30.03%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[9.494px_-29.89px] mask-size-[74px_86px]" style={{ maskImage: `url('${imgGroup2917}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 22">
        <g id="Group 2932">
          <path d={svgPaths.pafbf070} fill="var(--fill-0, #EBF2F7)" id="Path 4047" />
          <path d={svgPaths.p2be06800} fill="url(#paint0_linear_1_6641)" id="Path 4048" />
          <path d={svgPaths.p3048ed80} fill="var(--fill-0, #7AABCC)" id="Path 4049" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6641" x1="7.23267" x2="7.23267" y1="12.6479" y2="10.1919">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group66() {
  return (
    <div className="absolute inset-[47%_58.3%_48.12%_35.47%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3.131px_-30.09px] mask-size-[74px_86px]" style={{ maskImage: `url('${imgGroup2917}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 22">
        <g id="Group 2933">
          <path d={svgPaths.pd661880} fill="var(--fill-0, #EBF2F7)" id="Path 4050" />
          <path d={svgPaths.p32a16900} fill="url(#paint0_linear_1_6947)" id="Path 4051" />
          <path d={svgPaths.p2c1f0000} fill="var(--fill-0, #7AABCC)" id="Path 4052" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6947" x1="7.22176" x2="7.22176" y1="14.9102" y2="7.46338">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group67() {
  return (
    <div className="absolute inset-[46.73%_49.93%_47.66%_41.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-16.711px_-28.925px] mask-size-[74px_86px]" style={{ maskImage: `url('${imgGroup2917}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 25">
        <g id="Group 2934">
          <path d={svgPaths.p2580d450} fill="var(--fill-0, #EBF2F7)" id="Path 4053" />
          <path d={svgPaths.p31077000} fill="url(#paint0_linear_1_6636)" id="Path 4054" />
          <path d={svgPaths.pea7a300} fill="var(--fill-0, #7AABCC)" id="Path 4055" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6636" x1="10.1435" x2="10.1435" y1="18.1191" y2="6.00537">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group68() {
  return (
    <div className="absolute inset-[46.95%_30.06%_48.14%_64.05%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-69.424px_-29.89px] mask-size-[74px_86px]" style={{ maskImage: `url('${imgGroup2917}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 22">
        <g id="Group 2937">
          <path d={svgPaths.p4595df2} fill="var(--fill-0, #EBF2F7)" id="Path 4062" />
          <path d={svgPaths.p1e406200} fill="url(#paint0_linear_1_7112)" id="Path 4063" />
          <path d={svgPaths.p28a0000} fill="var(--fill-0, #7AABCC)" id="Path 4064" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_7112" x1="6.42896" x2="6.42896" y1="12.6367" y2="10.2119">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group69() {
  return (
    <div className="absolute inset-[47%_35.5%_48.11%_58.27%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-56.027px_-30.1px] mask-size-[74px_86px]" style={{ maskImage: `url('${imgGroup2917}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 22">
        <g id="Group 2938">
          <path d={svgPaths.p1f2d2900} fill="var(--fill-0, #EBF2F7)" id="Path 4065" />
          <path d={svgPaths.p359308f0} fill="url(#paint0_linear_1_6631)" id="Path 4066" />
          <path d={svgPaths.p28f13930} fill="var(--fill-0, #7AABCC)" id="Path 4067" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6631" x1="7.20922" x2="7.20922" y1="14.894" y2="7.44971">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group70() {
  return (
    <div className="absolute inset-[46.73%_41.36%_47.65%_49.93%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-36.68px_-28.934px] mask-size-[74px_86px]" style={{ maskImage: `url('${imgGroup2917}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 25">
        <g id="Group 2939">
          <path d={svgPaths.p12efa80} fill="var(--fill-0, #EBF2F7)" id="Path 4068" />
          <path d={svgPaths.p1df1d900} fill="url(#paint0_linear_1_6723)" id="Path 4069" />
          <path d={svgPaths.p2edbdd00} fill="var(--fill-0, #7AABCC)" id="Path 4070" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6723" x1="10.0984" x2="10.0984" y1="18.1079" y2="5.99609">
            <stop stopColor="white" />
            <stop offset="0.25" stopColor="#F2F7FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Upper1() {
  return (
    <div className="absolute contents inset-[46.73%_30.06%_47.65%_30.03%]" data-name="upper">
      <Group65 />
      <Group66 />
      <Group67 />
      <Group68 />
      <Group69 />
      <Group70 />
    </div>
  );
}

function Group71() {
  return (
    <div className="absolute contents inset-[46.73%_30.06%_44.08%_30.03%]">
      <Lower2 />
      <Upper1 />
    </div>
  );
}

function Group72() {
  return (
    <div className="absolute contents inset-[40%_30.06%_40%_30.03%]">
      <div className="absolute inset-[40%_33.98%_40%_34.12%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[74px_86px]" style={{ maskImage: `url('${imgGroup2917}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 74 86">
          <path d={svgPaths.p13be6c80} fill="var(--fill-0, #F2C7C2)" id="Rectangle 940" />
        </svg>
      </div>
      <Group71 />
    </div>
  );
}

function Rectangle() {
  return (
    <div className="absolute inset-[40%_33.98%_40%_34.12%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[74px_86px]" style={{ maskImage: `url('${imgGroup2917}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 74 86">
        <g id="Rectangle 941">
          <g id="Vector" opacity="0.5"></g>
          <path d={svgPaths.p236b5180} id="Vector_2" opacity="0.5" stroke="var(--stroke-0, #D96657)" strokeMiterlimit="10" />
        </g>
      </svg>
    </div>
  );
}

function Bite() {
  return (
    <div className="absolute contents inset-[40%_30.06%_40%_30.03%]" data-name="Bite">
      <Group72 />
      <Rectangle />
    </div>
  );
}

function Bite1() {
  return (
    <div className="absolute contents inset-[40%_33.98%_40%_34.12%]" data-name="Bite">
      <Bite />
    </div>
  );
}

function UiJawT() {
  return (
    <div className="h-[430px] relative shrink-0 w-[232px]" data-name="UI/Jaw/t1">
      <Upper />
      <Lower1 />
      <Bite1 />
    </div>
  );
}

function UiArrow() {
  return (
    <div className="relative shrink-0 size-[42px]" data-name="./UI/arrow">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
        <g id="./UI/arrow">
          <rect fill="url(#paint0_linear_1_6627)" height="41" id="Rectangle 1982" rx="3.5" stroke="var(--stroke-0, #1C4D7D)" transform="rotate(-180 41.5 41.5)" width="41" x="41.5" y="41.5" />
          <path d={svgPaths.p30a1f200} fill="var(--fill-0, #2867A7)" id="Path 3781" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6627" x1="63" x2="63" y1="42" y2="84">
            <stop stopColor="#C0E7F8" />
            <stop offset="1" stopColor="#B5E2F6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Treatment() {
  return (
    <div className="bg-white h-[42px] relative rounded-[4px] shrink-0 w-[192px]" data-name="treatment">
      <div className="h-[42px] overflow-clip relative rounded-[inherit] w-[192px]">
        <p className="absolute font-['Avenir:Roman',sans-serif] inset-[20%_37.64%_20.48%_36.32%] leading-[normal] not-italic text-[#3e3d40] text-[18px] text-center text-nowrap whitespace-pre">Lower</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#1c4d7d] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function UiArrow1() {
  return (
    <div className="relative shrink-0 size-[42px]" data-name="./UI/arrow">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
        <g id="./UI/arrow">
          <rect fill="url(#paint0_linear_1_6623)" height="41" id="Rectangle 1983" rx="3.5" stroke="var(--stroke-0, #1C4D7D)" width="41" x="0.500004" y="0.5" />
          <path d={svgPaths.p39234400} fill="var(--fill-0, #2867A7)" id="Path 3782" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_6623" x1="21" x2="21" y1="0" y2="42">
            <stop stopColor="#C0E7F8" />
            <stop offset="1" stopColor="#B5E2F6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function UiNaviZoneTreatment() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="./UI/Navi Zone treatment">
      <UiArrow />
      <Treatment />
      <UiArrow1 />
    </div>
  );
}

function UiNaviZoneTreatment1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="./UI/Navi Zone treatment">
      <UiNaviZoneTreatment />
    </div>
  );
}

// Temporarily removed - jaw selector and layer panel
// function Frame4({ currentPage }: { currentPage: string }) {
//   return (
//     <div className="absolute content-stretch flex flex-col gap-[45px] items-center left-[14px] top-[95px] w-[292px]">
//       {currentPage === 'scan' ? (
//         <>
//           <div className="h-[467px] w-[249px]">
//             <JawSelector />
//           </div>
//           <UiNaviZoneTreatment1 />
//         </>
//       ) : (
//         <div className="absolute left-[6px] top-[-2px] w-[316px] h-[345.97px]">
//           <LayerPanel />
//         </div>
//       )}
//     </div>
//   );
// }

export default function ScreenTemplate({ 
  initialPage = 'scan',
  microAnimations = true,
  onBackToHome,
  onNavigateToLayout,
  layout = 'vertical',
  activeButtons: externalActiveButtons,
  viewActiveButtons: externalViewActiveButtons,
  onPageChange: externalOnPageChange,
  onButtonClick: externalOnButtonClick,
  onViewButtonClick: externalOnViewButtonClick,
  combinedPanelMode = false,
  onCombinedPanelModeChange,
}: {
  initialPage?: string;
  microAnimations?: boolean;
  onBackToHome?: () => void;
  onNavigateToLayout?: (layout: 'home' | 'vertical' | 'horizontal' | 'horizontal-top' | 'horizontal-bottom') => void;
  layout?: 'vertical' | 'horizontal' | 'horizontal-top' | 'horizontal-bottom';
  activeButtons?: Set<number>;
  viewActiveButtons?: Set<number>;
  onPageChange?: (page: string) => void;
  onButtonClick?: (index: number) => void;
  onViewButtonClick?: (index: number) => void;
  combinedPanelMode?: boolean;
  onCombinedPanelModeChange?: (enabled: boolean) => void;
} = {}) {
  // Use external state if provided, otherwise use local state (for backward compatibility)
  const [localCurrentPage, setLocalCurrentPage] = useState<string>(initialPage);
  const [localActiveButtons, setLocalActiveButtons] = useState<Set<number>>(new Set());
  const [localViewActiveButtons, setLocalViewActiveButtons] = useState<Set<number>>(new Set());
  
  // Use external state if provided, otherwise fall back to local state
  // When using external state, use initialPage prop (which contains currentPage from App.tsx)
  // When using local state, use localCurrentPage
  const isUsingExternalState = externalOnPageChange !== undefined;
  const currentPage = isUsingExternalState ? initialPage : localCurrentPage;
  const activeButtons = externalActiveButtons !== undefined ? externalActiveButtons : localActiveButtons;
  const viewActiveButtons = externalViewActiveButtons !== undefined ? externalViewActiveButtons : localViewActiveButtons;

  const handleButtonClick = externalOnButtonClick || ((index: number) => {
    setLocalActiveButtons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  });

  const handleViewButtonClick = externalOnViewButtonClick || ((index: number) => {
    setLocalViewActiveButtons(prev => {
      const newSet = new Set(prev);
      
      // Occlusalgram (index 2) and Prep QC (index 4) are mutually exclusive
      if (index === 2 || index === 4) {
        const otherIndex = index === 2 ? 4 : 2;
        newSet.delete(otherIndex); // Deactivate the other button
        
        if (newSet.has(index)) {
          newSet.delete(index); // Toggle off if already active
        } else {
          newSet.add(index); // Toggle on
        }
      } 
      // Margin Line (index 3) and Trim (index 5) are mutually exclusive
      else if (index === 3 || index === 5) {
        const otherIndex = index === 3 ? 5 : 3;
        newSet.delete(otherIndex); // Deactivate the other button
        
        if (newSet.has(index)) {
          newSet.delete(index); // Toggle off if already active
        } else {
          newSet.add(index); // Toggle on
        }
      } else {
        // Normal toggle behavior for other buttons
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
      }
      
      return newSet;
    });
  });

  const handlePageChange = externalOnPageChange || ((page: string) => {
    setLocalCurrentPage(page);
    // Reset button states when switching pages
    if (page === 'scan') {
      setLocalActiveButtons(new Set());
    } else if (page === 'view') {
      setLocalViewActiveButtons(new Set());
    }
  });

  return (
    <div className="relative size-full" data-name="Screen template" style={{ backgroundColor: '#F4F4F4' }}>
      {/* Render single 3D Model - shared between scan and view to preserve camera state */}
      <Component3DModelShared 
        activeButtons={currentPage === 'scan' ? activeButtons : viewActiveButtons}
        isViewPage={currentPage === 'view'}
      />
      {currentPage === 'scan' && activeButtons.has(2) && (
        <div className="absolute left-[14px] bottom-[14px]">
          <PrepReviewPanel />
        </div>
      )}
      {currentPage === 'scan' && !activeButtons.has(2) && (
        <div className="absolute flex h-[225px] items-center justify-center left-[14px] bottom-[14px] w-[371px]" style={{ "--transform-inner-width": "225", "--transform-inner-height": "371" } as React.CSSProperties}>
          <div className="flex-none rotate-[90deg]">
            <div className="bg-[rgb(0,0,0)] h-[371px] w-[225px] p-[16px] mx-[16px] my-[0px] rounded-[4px]" />
          </div>
        </div>
      )}
      {currentPage === 'view' && (viewActiveButtons.has(3) || viewActiveButtons.has(5)) && (
        <div className="absolute left-[14px] bottom-[14px]">
          {viewActiveButtons.has(3) && <Panel />}
          {viewActiveButtons.has(5) && <Panel881668 />}
        </div>
      )}
      <HeaderNavigation 
        currentStep={currentPage as 'info' | 'scan' | 'view' | 'send'} 
        patientName="Patient: Mina Y." 
        onStepChange={(step) => handlePageChange(step)}
      />

      {currentPage === 'scan' && layout === 'vertical' && (
        <>
          {activeButtons.has(3) ? (
            <>
              <div className="absolute top-[93px] right-[17px] w-[195px]">
                <ExpandedToolbar activeButtons={activeButtons} onButtonClick={handleButtonClick} microAnimations={microAnimations} />
              </div>
            </>
          ) : (
            <>
              <div className="absolute top-[93px] right-[17px] w-[76px]">
                <Toolbar activeButtons={activeButtons} onButtonClick={handleButtonClick} microAnimations={microAnimations} />
              </div>
            </>
          )}
        </>
      )}
      {currentPage === 'scan' && layout === 'horizontal' && (
        <>
          <div className={`absolute bottom-[14px] left-1/2 translate-x-[-50%] ${activeButtons.has(3) ? 'w-[490px] h-[104px]' : 'w-[284px] h-[92px]'}`}>
            <HorizontalScanToolbar 
              activeButtons={activeButtons} 
              onButtonClick={handleButtonClick} 
              microAnimations={microAnimations} 
            />
          </div>
        </>
      )}
      {currentPage === 'scan' && layout === 'horizontal-bottom' && (
        <>
          <div className="absolute bottom-[14px] left-1/2 translate-x-[-50%] z-50">
            <HorizontalBottomToolbarScan 
              activeButtons={activeButtons} 
              onButtonClick={handleButtonClick} 
              microAnimations={microAnimations}
            />
          </div>
          {activeButtons.has(6) && (
            <div className="absolute bottom-[106px] left-1/2 translate-x-[-50%] flex justify-center h-[68px] z-40">
              <Scale />
            </div>
          )}
          {activeButtons.has(7) && (
            <div className="absolute bottom-[106px] left-1/2 translate-x-[-50%] flex justify-center h-[68px] z-40">
              <Scale />
            </div>
          )}
        </>
      )}
      {currentPage === 'view' && layout === 'vertical' && (
        <>
          {viewActiveButtons.has(6) ? (
            <>
              <div className="absolute right-[17px] top-[93px] w-[195px]">
                <ViewToolbar activeButtons={viewActiveButtons} onButtonClick={handleViewButtonClick} microAnimations={microAnimations} />
              </div>
              {viewActiveButtons.has(1) && viewActiveButtons.has(3) && combinedPanelMode ? (
                <div className="absolute right-[228px] top-[93px]">
                  <CombinedReviewMarginPanel />
                </div>
              ) : (
                <>
                  {viewActiveButtons.has(1) && (
                    <div className="absolute right-[228px] top-[93px] w-[432px] h-[846px]">
                      <CameraNiri />
                    </div>
                  )}
                </>
              )}
              {viewActiveButtons.has(2) && (
                <div className="absolute bottom-[14px] left-1/2 translate-x-[-50%] flex justify-center h-[68px]">
                  <Scale />
                </div>
              )}
              {viewActiveButtons.has(4) && (
                <div className="absolute bottom-[14px] left-1/2 translate-x-[-50%] flex justify-center h-[68px]">
                  <Scale />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="absolute right-[17px] top-[93px] w-[76px]">
                <ViewToolbar activeButtons={viewActiveButtons} onButtonClick={handleViewButtonClick} microAnimations={microAnimations} />
              </div>
              {viewActiveButtons.has(1) && viewActiveButtons.has(3) && combinedPanelMode ? (
                <div className="absolute right-[106px] top-[93px]">
                  <CombinedReviewMarginPanel />
                </div>
              ) : (
                <>
                  {viewActiveButtons.has(1) && (
                    <div className="absolute right-[106px] top-[93px] w-[432px] h-[846px]">
                      <CameraNiri />
                    </div>
                  )}
                </>
              )}
              {viewActiveButtons.has(2) && (
                <div className="absolute bottom-[14px] left-1/2 translate-x-[-50%] flex justify-center h-[68px]">
                  <Scale />
                </div>
              )}
              {viewActiveButtons.has(4) && (
                <div className="absolute bottom-[14px] left-1/2 translate-x-[-50%] flex justify-center h-[68px]">
                  <Scale />
                </div>
              )}
            </>
          )}
        </>
      )}
      {currentPage === 'view' && layout === 'horizontal' && (
        <>
          <div 
            className={`absolute left-1/2 translate-x-[-50%] ${viewActiveButtons.has(6) ? 'w-[790px] h-[104px]' : 'w-[524px] h-[92px]'}`}
            style={{ bottom: viewActiveButtons.has(2) ? 'calc(14px + 148px)' : viewActiveButtons.has(4) ? 'calc(14px + 68px)' : '14px' }}
          >
            <HorizontalViewToolbar 
              activeButtons={viewActiveButtons} 
              onButtonClick={handleViewButtonClick} 
              microAnimations={microAnimations} 
            />
          </div>
          {viewActiveButtons.has(1) && viewActiveButtons.has(3) && combinedPanelMode ? (
            <div className="absolute top-[93px] right-[17px]">
              <CombinedReviewMarginPanel />
            </div>
          ) : (
            <>
              {viewActiveButtons.has(1) && (
                <div className="absolute top-[93px] right-[17px] w-[432px] h-[846px]">
                  <CameraNiri />
                </div>
              )}
            </>
          )}
          {viewActiveButtons.has(2) && (
            <div className="absolute bottom-[105px] left-1/2 translate-x-[-50%] flex justify-center h-[68px]">
              <Scale />
            </div>
          )}
          {viewActiveButtons.has(4) && (
            <div className="absolute bottom-[105px] left-1/2 translate-x-[-50%] flex justify-center h-[68px]">
              <Scale />
            </div>
          )}
        </>
      )}
      {currentPage === 'scan' && layout === 'horizontal-top' && (
        <>
          <div className="absolute right-[17px] top-[93px]">
            <HorizontalTopToolbarScan activeButtons={activeButtons} onButtonClick={handleButtonClick} microAnimations={microAnimations} />
          </div>
        </>
      )}
      {currentPage === 'view' && layout === 'horizontal-top' && (
        <>
          <div className="absolute right-[17px] top-[93px]">
            <HorizontalTopToolbarView activeButtons={viewActiveButtons} onButtonClick={handleViewButtonClick} microAnimations={microAnimations} />
          </div>
          {viewActiveButtons.has(1) && viewActiveButtons.has(3) && combinedPanelMode ? (
            <div className="absolute top-[185px] right-[17px]">
              <CombinedReviewMarginPanel />
            </div>
          ) : (
            <>
              {viewActiveButtons.has(1) && (
                <div className="absolute top-[185px] right-[17px] w-[432px] h-[846px]">
                  <CameraNiri />
                </div>
              )}
            </>
          )}
          {viewActiveButtons.has(2) && (
            <div className="absolute bottom-[14px] left-1/2 translate-x-[-50%] flex justify-center h-[68px]">
              <Scale />
            </div>
          )}
          {viewActiveButtons.has(4) && (
            <div className="absolute bottom-[14px] left-1/2 translate-x-[-50%] flex justify-center h-[68px]">
              <Scale />
            </div>
          )}
        </>
      )}
      {currentPage === 'view' && layout === 'horizontal-bottom' && (
        <>
          <div className="absolute bottom-[14px] left-1/2 translate-x-[-50%] z-50">
            <HorizontalBottomToolbarView 
              activeButtons={viewActiveButtons} 
              onButtonClick={handleViewButtonClick} 
              microAnimations={microAnimations} 
            />
          </div>
          {viewActiveButtons.has(1) && viewActiveButtons.has(3) && combinedPanelMode ? (
            <div className="absolute top-[93px] right-[17px]">
              <CombinedReviewMarginPanel />
            </div>
          ) : (
            <>
              {viewActiveButtons.has(1) && (
                <div className="absolute top-[93px] right-[17px] w-[432px] h-[846px]">
                  <CameraNiri />
                </div>
              )}
            </>
          )}
          {viewActiveButtons.has(2) && (
            <div 
              className="absolute left-1/2 translate-x-[-50%] flex justify-center z-40"
              style={{
                bottom: viewActiveButtons.has(6) ? '138px' : '94px'
              }}
            >
              <Scale />
            </div>
          )}
          {viewActiveButtons.has(4) && (
            <div 
              className="absolute left-1/2 translate-x-[-50%] flex justify-center z-40"
              style={{
                bottom: viewActiveButtons.has(6) ? '138px' : '94px'
              }}
            >
              <Scale />
            </div>
          )}
        </>
      )}
      
      {/* Layout switcher for scan and view pages - positioned below HeaderNavigation/jaw image with 16px gap */}
      {(currentPage === 'scan' || currentPage === 'view') && (onBackToHome || onNavigateToLayout) && (
        <div className="absolute z-50" style={{ top: 'calc(96px + 467px + 16px)', left: '14px' }}>
          <LayoutSwitcher
            currentLayout={
              layout === 'vertical' ? 'vertical' 
              : layout === 'horizontal' ? 'horizontal'
              : layout === 'horizontal-top' ? 'horizontal-top' 
              : layout === 'horizontal-bottom' ? 'horizontal-bottom'
              : 'vertical'
            }
            onNavigateToLayout={onNavigateToLayout || (() => {})}
            onBackToHome={onBackToHome}
            combinedPanelMode={combinedPanelMode}
            onCombinedPanelModeChange={onCombinedPanelModeChange}
          />
        </div>
      )}
    </div>
  );
}