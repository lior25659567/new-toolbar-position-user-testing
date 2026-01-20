import svgPaths from "./svg-z7jaevcduo";

function Resizer() {
  return <div className="shrink-0 size-0" data-name="Resizer" />;
}

function Label() {
  return (
    <div className="content-stretch flex items-start justify-end relative shrink-0 w-full z-[3]" data-name="Label">
      <Resizer />
    </div>
  );
}

function ChevronLeft() {
  return (
    <div className="absolute left-1/2 size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Chevron left">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Chevron left">
          <path d={svgPaths.p3e016100} fill="var(--fill-0, black)" fillOpacity="0.93" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Box() {
  return (
    <div className="relative rounded-[2px] shrink-0 size-[60px]" data-name="box">
      <ChevronLeft />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[61px]">
      <Box />
      <div className="flex h-[24px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[24px]">
            <div className="absolute inset-[-1px_0_0_0]" style={{ "--stroke-0": "rgba(0, 0, 0, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 1">
                <line id="Line 2" stroke="var(--stroke-0, black)" strokeOpacity="0.2275" x2="24" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight() {
  return (
    <div className="absolute left-1/2 size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Chevron right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Chevron right">
          <path d={svgPaths.p112ef600} fill="var(--fill-0, black)" fillOpacity="0.93" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Box1() {
  return (
    <div className="relative rounded-[2px] shrink-0 size-[60px]" data-name="box">
      <ChevronRight />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex h-[24px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[24px]">
            <div className="absolute inset-[-1px_0_0_0]" style={{ "--stroke-0": "rgba(0, 0, 0, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 1">
                <line id="Line 2" stroke="var(--stroke-0, black)" strokeOpacity="0.2275" x2="24" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Box1 />
    </div>
  );
}

function Field() {
  return (
    <div className="bg-white h-[64px] relative rounded-[8px] shrink-0 w-full z-[2]" data-name="Field">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[8px] py-[12px] relative size-full">
          <Frame />
          <div className="flex flex-[1_0_0] flex-col font-['Roboto:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] min-h-px min-w-px overflow-hidden relative text-[#121212] text-[18px] text-center text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[28px] overflow-hidden">Upper Jaw</p>
          </div>
          <Frame1 />
        </div>
      </div>
    </div>
  );
}

export default function Dropdowm() {
  return (
    <div className="content-stretch flex flex-col isolate items-start relative size-full" data-name="Dropdowm">
      <Label />
      <Field />
    </div>
  );
}