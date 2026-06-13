import svgPaths from "./svg-tl25ixc7nv";

function Logo2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[70.182px]" data-name="Logo">
      <div className="absolute inset-[-16.67%_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70.182 28">
          <g id="Logo">
            <g id="Vector">
              <path d={svgPaths.p26fe6970} fill="var(--fill-0, black)" fillOpacity="0.93" />
              <path d={svgPaths.p4976f80} fill="var(--fill-0, black)" fillOpacity="0.93" />
              <path d={svgPaths.pafff0f2} fill="var(--fill-0, black)" fillOpacity="0.93" />
              <path d={svgPaths.p36e5d100} fill="var(--fill-0, black)" fillOpacity="0.93" />
              <path d={svgPaths.p4166a00} fill="var(--fill-0, black)" fillOpacity="0.93" />
              <path d={svgPaths.p3a0bb800} fill="var(--fill-0, black)" fillOpacity="0.93" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function Logo1() {
  return (
    <div className="content-stretch flex flex-col h-[24px] items-center justify-end relative shrink-0 w-full" data-name="Logo">
      <Logo2 />
    </div>
  );
}

function Logo() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip px-[2px] py-[16px] relative shrink-0 w-[75px]" data-name="Logo">
      <Logo1 />
    </div>
  );
}

function LeftGroup() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[72px] items-center left-0 top-0 w-[487px]" data-name="Left group">
      <Logo />
    </div>
  );
}

function Dropdown() {
  return (
    <div className="content-stretch flex gap-[8px] h-[72px] items-center overflow-clip px-[16px] py-[12px] relative rounded-[4px] shrink-0" data-name="Dropdown">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[18px] text-[rgba(0,0,0,0.63)] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Patient: Mina Y.
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] h-[72px] items-start px-[90px] py-0 relative shrink-0">
      <LeftGroup />
      <Dropdown />
    </div>
  );
}

function Name() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px mr-[-176px] relative z-[2]" data-name="Name">
      <div className="flex flex-[1_0_0] flex-col font-['Roboto:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px relative text-[24px] text-[rgba(0,0,0,0.93)] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[32px] whitespace-pre-wrap">Info</p>
      </div>
    </div>
  );
}

function Complete() {
  return (
    <div className="content-stretch flex isolate items-center justify-center pl-0 pr-[176px] py-0 relative shrink-0 w-[176px]" data-name="complete">
      <Name />
      <div className="flex-[1_0_0] h-[64px] min-h-px min-w-px mr-[-176px] relative z-[1]" data-name="back">
        <div className="absolute inset-[-6.25%_0_-6.25%_-2.27%]" style={{ "--fill-0": "rgba(244, 244, 244, 1)", "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 180 72">
            <path d={svgPaths.p2106e100} fill="var(--fill-0, #F4F4F4)" id="back" stroke="var(--stroke-0, white)" strokeWidth="4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function WizardLables() {
  return (
    <div className="content-stretch flex items-start mr-[-32px] relative shrink-0 z-[4]" data-name="./ Wizard lables">
      <Complete />
    </div>
  );
}

function Name1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px mr-[-176px] relative z-[2]" data-name="Name">
      <div className="flex flex-[1_0_0] flex-col font-['Roboto:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px relative text-[24px] text-center text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[32px] whitespace-pre-wrap">Scan</p>
      </div>
    </div>
  );
}

function Current() {
  return (
    <div className="content-stretch flex isolate items-center justify-center pl-0 pr-[176px] py-0 relative shrink-0 w-[176px]" data-name="current">
      <Name1 />
      <div className="flex-[1_0_0] h-[64px] min-h-px min-w-px mr-[-176px] relative z-[1]" data-name="back">
        <div className="absolute inset-[-6.25%_0_-6.25%_-2.27%]" style={{ "--fill-0": "rgba(255, 255, 255, 1)", "--fill-1": "rgba(241, 241, 241, 1)", "--fill-2": "rgba(0, 154, 206, 1)", "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 180 72">
            <g id="back">
              <path d={svgPaths.p2106e100} fill="var(--fill-0, white)" />
              <path d={svgPaths.p2106e100} fill="var(--fill-1, #F1F1F1)" />
              <path d={svgPaths.p2106e100} fill="var(--fill-2, #009ACE)" />
              <path d={svgPaths.p2106e100} stroke="var(--stroke-0, white)" strokeWidth="4" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function WizardLables1() {
  return (
    <div className="content-stretch flex items-start mr-[-32px] relative shrink-0 z-[3]" data-name="./ Wizard lables">
      <Current />
    </div>
  );
}

function Name2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px mr-[-176px] relative z-[2]" data-name="Name">
      <div className="flex flex-[1_0_0] flex-col font-['Roboto:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px relative text-[24px] text-[rgba(0,0,0,0.93)] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[32px] whitespace-pre-wrap">View</p>
      </div>
    </div>
  );
}

function Incomplete() {
  return (
    <div className="content-stretch flex isolate items-center justify-center pl-0 pr-[176px] py-0 relative shrink-0 w-[176px]" data-name="incomplete">
      <Name2 />
      <div className="flex-[1_0_0] h-[64px] min-h-px min-w-px mr-[-176px] relative z-[1]" data-name="back">
        <div className="absolute inset-[-6.25%_0_-6.25%_-2.27%]" style={{ "--fill-0": "rgba(255, 255, 255, 1)", "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 180 72">
            <path d={svgPaths.p2106e100} fill="var(--fill-0, white)" id="back" stroke="var(--stroke-0, white)" strokeWidth="4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function WizardLables2() {
  return (
    <div className="content-stretch flex items-start mr-[-32px] relative shrink-0 z-[2]" data-name="./ Wizard lables">
      <Incomplete />
    </div>
  );
}

function Name3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px mr-[-176px] relative z-[2]" data-name="Name">
      <div className="flex flex-[1_0_0] flex-col font-['Roboto:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px relative text-[24px] text-[rgba(0,0,0,0.93)] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[32px] whitespace-pre-wrap">Send</p>
      </div>
    </div>
  );
}

function Inactive() {
  return (
    <div className="content-stretch flex isolate items-center justify-center pl-0 pr-[176px] py-0 relative shrink-0 w-[176px]" data-name="inactive">
      <Name3 />
      <div className="flex-[1_0_0] h-[64px] min-h-px min-w-px mr-[-176px] relative z-[1]" data-name="back">
        <div className="absolute inset-[-6.25%_0_-6.25%_-2.27%]" style={{ "--fill-0": "rgba(255, 255, 255, 1)", "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 180 72">
            <path d={svgPaths.p2106e100} fill="var(--fill-0, white)" id="back" stroke="var(--stroke-0, white)" strokeWidth="4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function WizardLables3() {
  return (
    <div className="content-stretch flex items-start mr-[-32px] relative shrink-0 z-[1]" data-name="./ Wizard lables">
      <Inactive />
    </div>
  );
}

function WizardTopbar() {
  return (
    <div className="content-stretch flex isolate items-center justify-center pl-0 pr-[32px] py-0 relative shrink-0" data-name="./Wizard topbar">
      <WizardLables />
      <WizardLables1 />
      <WizardLables2 />
      <WizardLables3 />
    </div>
  );
}

function WizardTopbarSelected() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[608px]" data-name="./Wizard topbar / selected 2">
      <WizardTopbar />
    </div>
  );
}

function WizardTopbarSwitcher() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[607px]" data-name="./Wizard topbar switcher">
      <WizardTopbarSelected />
    </div>
  );
}

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
    <div className="content-stretch flex items-center overflow-clip p-[14px] relative shrink-0" data-name="icon">
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
    <div className="content-stretch flex items-center overflow-clip p-[14px] relative shrink-0" data-name="icon">
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
    <div className="content-stretch flex items-center overflow-clip p-[14px] relative shrink-0" data-name="icon">
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
    <div className="content-stretch flex items-center overflow-clip p-[14px] relative shrink-0" data-name="icon">
      <Settings />
    </div>
  );
}

function NavigatonIcons() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Navigaton Icons">
      <Icon />
      <Icon1 />
      <Icon2 />
      <Icon3 />
    </div>
  );
}

function Dropdown1() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[72px] items-center left-[106px] overflow-clip px-[16px] py-[12px] rounded-[4px] top-1/2 translate-y-[-50%]" data-name="Dropdown">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[18px] text-[rgba(0,0,0,0.63)] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Patient: Mina Y.
      </p>
    </div>
  );
}

export default function HeaderScanComponent() {
  return (
    <div className="bg-white content-stretch flex items-center justify-between px-[16px] py-0 relative size-full" data-name="Header Scan component">
      <div aria-hidden="true" className="absolute border-0 border-[rgba(0,0,0,0.23)] border-solid inset-0 pointer-events-none" />
      <Frame />
      <WizardTopbarSwitcher />
      <NavigatonIcons />
      <Dropdown1 />
    </div>
  );
}