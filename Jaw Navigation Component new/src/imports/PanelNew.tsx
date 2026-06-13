import svgPaths from "./svg-uqgjjif1et";

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M15 18L9 12L15 6" id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center relative rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 size-[48px]" data-name="Button">
      <Icon />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Avenir:Heavy',sans-serif] leading-[16.5px] left-1/2 not-italic text-[#6a7282] text-[11px] text-center top-0 translate-x-[-50%] uppercase whitespace-pre">Tooth</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[42px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Avenir:Heavy',sans-serif] leading-[42px] left-1/2 not-italic text-[#364153] text-[28px] text-center top-[3px] translate-x-[-50%] whitespace-pre">11</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[calc(50%-0.5px)] not-italic text-[#6a7282] text-[11px] text-center top-0 tracking-[0.0645px] translate-x-[-50%] whitespace-pre">Upper Jaw</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-full">
      <Container3 />
      <Container4 />
      <Container5 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-h-px min-w-px relative" data-name="Container">
      <Frame4 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M9 18L15 12L9 6" id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center relative rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 size-[48px]" data-name="Button">
      <Icon1 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative w-full">
        <Button />
        <Container2 />
        <Button1 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#f9fafb] h-[103px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-0 relative size-full">
          <Frame3 />
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-full">
      <Container1 />
    </div>
  );
}

function LeftIcon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Left icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Left icon">
          <path clipRule="evenodd" d={svgPaths.p3dd9e400} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector 23 (Stroke)" />
          <path clipRule="evenodd" d={svgPaths.p221882c0} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector 24 (Stroke)" />
          <path d={svgPaths.p3ba58900} fill="var(--fill-0, white)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[18px] relative shrink-0 w-[35.594px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[-2.2px] not-italic text-[14px] text-white top-0 w-[46px] whitespace-pre-wrap">Detect</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#009ace] content-stretch flex flex-[1_0_0] flex-col gap-[4px] h-[64px] items-center justify-center min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <LeftIcon />
      <Text />
    </div>
  );
}

function LeftIcon1() {
  return (
    <div className="relative shrink-0 size-[23px]" data-name="Left icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 23">
        <g id="Left icon">
          <path d={svgPaths.p13b47600} fill="var(--fill-0, #3E3D40)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[18px] relative shrink-0 w-[35.594px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[-8.2px] not-italic text-[#364153] text-[14px] top-[-0.5px] w-[68px] whitespace-pre-wrap">manually</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-[1_0_0] flex-col gap-[4px] h-[64px] items-center justify-center min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <LeftIcon1 />
      <Text1 />
    </div>
  );
}

function LeftIcon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Left icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Left icon">
          <path d={svgPaths.p1678db80} fill="var(--fill-0, #3E3D40)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[18px] relative shrink-0 w-[35.594px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[-0.2px] not-italic text-[#364153] text-[14px] top-0 w-[42px] whitespace-pre-wrap">Undo</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-[1_0_0] flex-col gap-[4px] h-[64px] items-center justify-center min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <LeftIcon2 />
      <Text2 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <Button2 />
      <Button3 />
      <Button4 />
    </div>
  );
}

function LeftIcon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Left icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Left icon">
          <g id="Shape">
            <path d="M8.75 7.5H7.5V15H8.75V7.5Z" fill="#3E3D40" />
            <path d="M12.5 7.5H11.25V15H12.5V7.5Z" fill="#3E3D40" />
            <path d={svgPaths.p6013800} fill="#3E3D40" />
            <path d={svgPaths.p20d258f0} fill="#3E3D40" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-[101.719px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Avenir:Medium',sans-serif] leading-[22.5px] left-0 not-italic text-[#364153] text-[15px] top-px whitespace-pre">Clear Selection</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex gap-[8px] h-[56px] items-center justify-center relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <LeftIcon3 />
      <Text3 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-full">
      <Button5 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame1 />
      <Frame2 />
    </div>
  );
}

function Container() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start overflow-clip relative rounded-bl-[4px] rounded-br-[4px] shrink-0 w-full" data-name="Container">
      <Frame />
      <Frame5 />
    </div>
  );
}

export default function PanelNew() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[8px] size-full" data-name="Panel New">
      <Container />
    </div>
  );
}