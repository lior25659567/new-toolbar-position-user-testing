// ============================================================================
// LOGO COMPONENT
// ============================================================================
// iTero logo component for the header
// ============================================================================

import svgPaths from '@/imports/svg-tl25ixc7nv';

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

export function Logo() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip px-[2px] py-[16px] relative shrink-0 w-[75px]" data-name="Logo">
      <Logo1 />
    </div>
  );
}
