import svgPaths from "./svg-imhgtrgfw2";

function Text() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-[118.828px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[22.5px] relative w-[118.828px]">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[30px] left-0 text-[24px] text-nowrap text-white top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Prep edit
        </p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[21.333px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
            <path d={svgPaths.p1330f52c} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.77778" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
            <path d={svgPaths.p2a13940} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.77778" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[5.333px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[5.333px] px-[5.333px] relative size-[32px]">
        <Icon />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[#00adef] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#0099d6] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded-tl-[4px] rounded-tr-[4px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between pb-[17px] pt-[16px] px-[16px] relative w-full">
          <Text />
          <Button />
        </div>
      </div>
    </div>
  );
}

function Draw() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Draw">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Draw" opacity="0">
          <path d={svgPaths.p34bbca00} fill="var(--fill-0, #3E3D40)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function LeftItem() {
  return (
    <div className="box-border content-stretch flex flex-col items-center justify-center mr-[-24px] relative shrink-0 size-[64px]" data-name="Left item">
      <Draw />
    </div>
  );
}

function TextPart() {
  return (
    <div className="box-border content-stretch flex flex-col items-start justify-center mr-[-24px] px-[16px] py-[6px] relative self-stretch shrink-0" data-name="Text part">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#3e3d40] text-[18px] text-nowrap w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="[white-space-collapse:collapse] leading-[28px] overflow-ellipsis overflow-hidden">Select</p>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="box-border content-stretch flex items-start pl-0 pr-[24px] py-0 relative shrink-0" data-name="Content">
      <LeftItem />
      <TextPart />
    </div>
  );
}

function ListItem() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="List item">
      <Content />
      <div className="absolute bg-[#e0e0e0] bottom-0 h-px left-0 opacity-0 right-0" data-name="Divider" />
    </div>
  );
}

function WandIcon() {
  return (
    <div className="absolute left-[20px] size-[24px] top-[20px]" data-name="wand icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="wand icon">
          <path clipRule="evenodd" d={svgPaths.p10912200} fill="var(--fill-0, #3E3D40)" fillRule="evenodd" id="Vector 23 (Stroke)" />
          <path clipRule="evenodd" d={svgPaths.p216e4300} fill="var(--fill-0, #3E3D40)" fillRule="evenodd" id="Vector 24 (Stroke)" />
          <path d={svgPaths.pc6cb100} fill="var(--fill-0, #3E3D40)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Undo() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Undo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Undo">
          <path d={svgPaths.p34ab8900} fill="var(--fill-0, #3E3D40)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function LeftItem1() {
  return (
    <div className="box-border content-stretch flex flex-col items-center justify-center mr-[-24px] relative shrink-0 size-[64px]" data-name="Left item">
      <Undo />
    </div>
  );
}

function TextPart1() {
  return (
    <div className="box-border content-stretch flex flex-col items-start justify-center mr-[-24px] px-[16px] py-[6px] relative self-stretch shrink-0" data-name="Text part">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#3e3d40] text-[18px] text-nowrap w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="[white-space-collapse:collapse] leading-[28px] overflow-ellipsis overflow-hidden">Erase and scan</p>
      </div>
    </div>
  );
}

function Content1() {
  return (
    <div className="box-border content-stretch flex items-start pl-0 pr-[24px] py-0 relative shrink-0" data-name="Content">
      <LeftItem1 />
      <TextPart1 />
    </div>
  );
}

function ListItem1() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="List item">
      <Content1 />
      <div className="absolute bg-[#e0e0e0] bottom-0 h-px left-0 opacity-0 right-0" data-name="Divider" />
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative rounded-bl-[4px] rounded-br-[4px] shrink-0 w-[284px]">
      <ListItem />
      <WandIcon />
      <ListItem1 />
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full">
      <Container />
      <Frame />
    </div>
  );
}