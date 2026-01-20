// ============================================================================
// NAVIGATION ICONS COMPONENT
// ============================================================================
// Right side navigation icons for the header
// ============================================================================

import svgPaths from '@/imports/svg-tl25ixc7nv';

function Locked() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Locked">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Locked">
          <path d={svgPaths.p215dc800} fill="var(--fill-0, black)" fillOpacity="0.63" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="content-stretch flex items-center overflow-clip p-[14px] relative shrink-0 cursor-pointer hover:bg-gray-100 rounded-[4px] transition-colors" data-name="icon">
      <Locked />
    </div>
  );
}

function BatteryFull() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Battery full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Battery full">
          <g id="Vector">
            <path d={svgPaths.p117a6a00} fill="var(--fill-0, black)" fillOpacity="0.63" />
            <path d="M22 20V12H8V20H22Z" fill="var(--fill-0, black)" fillOpacity="0.63" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Icon1() {
  return (
    <div className="content-stretch flex items-center overflow-clip p-[14px] relative shrink-0 cursor-pointer hover:bg-gray-100 rounded-[4px] transition-colors" data-name="icon">
      <BatteryFull />
    </div>
  );
}

function NotificationOutline() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Notification outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Notification outline">
          <path d={svgPaths.p3ab1f880} fill="var(--fill-0, black)" fillOpacity="0.63" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon2() {
  return (
    <div className="content-stretch flex items-center overflow-clip p-[14px] relative shrink-0 cursor-pointer hover:bg-gray-100 rounded-[4px] transition-colors" data-name="icon">
      <NotificationOutline />
    </div>
  );
}

function Settings() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Settings">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Settings">
          <g id="Vector">
            <path d={svgPaths.p289c8d00} fill="black" fillOpacity="0.63" />
            <path d={svgPaths.p2be96b00} fill="black" fillOpacity="0.63" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Icon3() {
  return (
    <div className="content-stretch flex items-center overflow-clip p-[14px] relative shrink-0 cursor-pointer hover:bg-gray-100 rounded-[4px] transition-colors" data-name="icon">
      <Settings />
    </div>
  );
}

export function NavigationIcons() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Navigaton Icons">
      <Icon />
      <Icon1 />
      <Icon2 />
      <Icon3 />
    </div>
  );
}
