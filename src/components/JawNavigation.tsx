import { useState } from 'react';
import svgPaths from '@/imports/svg-hml87k0ihi';
import svgPathsDropdown from '@/imports/svg-z7jaevcduo';
import imgBorder16 from "@/assets/086a3c67d1baba60f210a1123616715dc15bdeef.png";
import imgFill16 from "@/assets/245a7d0f66b2a4c07c6f65541bd8759f79b07f71.png";
import imgBorder14 from "@/assets/f72863b9fd573a8df451a75c2298fca2395476bc.png";

type ToothId = string;
type JawView = 'upper' | 'lower' | 'bite';

interface JawNavigationProps {
  onToothSelect?: (toothId: ToothId) => void;
  selectedTeeth?: ToothId[];
}

interface JawSelectorProps {
  currentView: JawView;
  onPrevious: () => void;
  onNext: () => void;
}

// ============================================================================
// JAW SELECTOR COMPONENT
// ============================================================================

export function JawSelector({ currentView, onPrevious, onNext }: JawSelectorProps) {
  const viewLabels: Record<JawView, string> = {
    upper: 'Upper Jaw',
    lower: 'Lower Jaw',
    bite: 'Bite View'
  };

  return (
    <div className="bg-white h-[64px] relative rounded-[8px] shrink-0 w-full" data-name="Field">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[8px] py-[12px] relative size-full">
          {/* Left Arrow */}
          <div className="content-stretch flex items-center relative shrink-0 w-[61px]">
            <div 
              className="relative rounded-[2px] shrink-0 size-[60px] cursor-pointer hover:bg-gray-100 transition-colors" 
              data-name="box"
              onClick={onPrevious}
            >
              <div className="absolute left-1/2 size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Chevron left">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <g id="Chevron left">
                    <path d={svgPathsDropdown.p3e016100} fill="var(--fill-0, black)" fillOpacity="0.93" id="Vector" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="flex h-[24px] items-center justify-center relative shrink-0 w-0">
              <div className="flex-none rotate-[90deg]">
                <div className="h-0 relative w-[24px]">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 1">
                      <line stroke="black" strokeOpacity="0.2275" x2="24" y1="0.5" y2="0.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Label */}
          <div className="flex flex-[1_0_0] flex-col font-['Roboto:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] min-h-px min-w-px overflow-hidden relative text-[#121212] text-[18px] text-center text-ellipsis whitespace-nowrap">
            <p className="leading-none overflow-hidden">{viewLabels[currentView]}</p>
          </div>

          {/* Right Arrow */}
          <div className="content-stretch flex items-center relative shrink-0">
            <div className="flex h-[24px] items-center justify-center relative shrink-0 w-0">
              <div className="flex-none rotate-[90deg]">
                <div className="h-0 relative w-[24px]">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 1">
                      <line stroke="black" strokeOpacity="0.2275" x2="24" y1="0.5" y2="0.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div 
              className="relative rounded-[2px] shrink-0 size-[60px] cursor-pointer hover:bg-gray-100 transition-colors" 
              data-name="box"
              onClick={onNext}
            >
              <div className="absolute left-1/2 size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Chevron right">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <g id="Chevron right">
                    <path d={svgPathsDropdown.p112ef600} fill="var(--fill-0, black)" fillOpacity="0.93" id="Vector" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tooth() {
  return (
    <div className="absolute bottom-[83.2%] left-[36.52%] right-1/2 top-0" data-name="Tooth">
      <div className="absolute inset-[0_-0.16%_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.0188 31.2541">
          <g id="Tooth">
            <path d={svgPaths.p7722180} fill="var(--fill-0, white)" id="Vector 1" stroke="var(--stroke-0, #8F8F8F)" />
            <path clipRule="evenodd" d={svgPaths.pcf17a40} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 7" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Tooth1() {
  return (
    <div className="relative size-full" data-name="Tooth">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 33">
        <g id="Tooth">
          <path clipRule="evenodd" d={svgPaths.p1a04c200} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 16" stroke="var(--stroke-0, #8F8F8F)" />
          <path clipRule="evenodd" d={svgPaths.p2abbb180} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 16" />
        </g>
      </svg>
    </div>
  );
}

function Tooth2() {
  return (
    <div className="relative size-full" data-name="Tooth">
      <div className="absolute inset-[0_0_-0.27%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32.7837 35.1614">
          <g id="Tooth">
            <path clipRule="evenodd" d={svgPaths.p34874e70} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 15" stroke="var(--stroke-0, #8F8F8F)" />
            <path clipRule="evenodd" d={svgPaths.p15218d00} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 15" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Tooth3() {
  return (
    <div className="relative size-full" data-name="Tooth">
      <div className="absolute inset-[0_0_-0.22%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.8333 38.9635">
          <g id="Tooth">
            <path clipRule="evenodd" d={svgPaths.p20dd4c00} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 14" stroke="var(--stroke-0, #8F8F8F)" />
            <path clipRule="evenodd" d={svgPaths.peb23980} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 14" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Tooth4() {
  return (
    <div className="absolute inset-[4.51%_62.41%_78.69%_25.53%]" data-name="Tooth">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.922 31.2541">
        <g id="Tooth">
          <path clipRule="evenodd" d={svgPaths.pb4cf6f0} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 7" stroke="var(--stroke-0, #8F8F8F)" />
          <path clipRule="evenodd" d={svgPaths.p218b9580} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 7" />
        </g>
      </svg>
    </div>
  );
}

function Tooth5() {
  return (
    <div className="absolute inset-[13.11%_68.09%_70.49%_18.79%]" data-name="Tooth">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.2092 30.4918">
        <g id="Tooth">
          <path clipRule="evenodd" d={svgPaths.p35f99e80} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 6" stroke="var(--stroke-0, #8F8F8F)" />
          <path clipRule="evenodd" d={svgPaths.p1ae4f900} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 6" />
        </g>
      </svg>
    </div>
  );
}

function Tooth6() {
  return (
    <div className="absolute inset-[23.77%_73.05%_61.89%_14.18%]" data-name="Tooth">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.4468 26.6803">
        <g id="Tooth">
          <path clipRule="evenodd" d={svgPaths.p32966e00} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 5" stroke="var(--stroke-0, #8F8F8F)" />
          <path clipRule="evenodd" d={svgPaths.p29204b00} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 5" />
        </g>
      </svg>
    </div>
  );
}

function Tooth7() {
  return (
    <div className="absolute inset-[35.25%_76.24%_51.23%_10.64%]" data-name="Tooth">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.2092 25.1557">
        <g id="Tooth">
          <path clipRule="evenodd" d={svgPaths.p1b7f0e80} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 4" stroke="var(--stroke-0, #8F8F8F)" />
          <path clipRule="evenodd" d={svgPaths.p39f40980} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 4" />
        </g>
      </svg>
    </div>
  );
}

function Tooth8() {
  return (
    <div className="relative size-full" data-name="Tooth">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.734 31.2541">
        <g id="Tooth">
          <path d={svgPaths.p7ff480} fill="var(--fill-0, white)" id="Vector 1" stroke="var(--stroke-0, #8F8F8F)" />
          <path clipRule="evenodd" d={svgPaths.p30f39700} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 7" />
        </g>
      </svg>
    </div>
  );
}

function Tooth9() {
  return (
    <div className="absolute inset-[81.97%_0_0_85.11%]" data-name="Tooth">
      <div className="absolute inset-[2.27%_2.83%_2.39%_2.1%]" data-name="Border 16">
        <div className="absolute inset-[-4.67%_-4.93%_-4.69%_-4.45%]">
          <img alt="" className="block max-w-none size-full" height="34.972" src={imgBorder16} width="33.297" />
        </div>
      </div>
      <div className="absolute inset-[22.8%_31.2%_32.38%_40.88%]" data-name="Fill 16">
        <img alt="" className="block max-w-none size-full" height="15.032" src={imgFill16} width="8.941" />
      </div>
    </div>
  );
}

function Tooth10() {
  return (
    <div className="absolute inset-[64.75%_2.13%_16.39%_82.62%]" data-name="Tooth">
      <div className="absolute inset-[0_0_-0.27%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32.7837 35.1614">
          <g id="Tooth">
            <path clipRule="evenodd" d={svgPaths.p36cc0d00} fill="var(--fill-0, #8ADAFF)" fillRule="evenodd" id="Border 15" stroke="var(--stroke-0, #0080B2)" />
            <path clipRule="evenodd" d={svgPaths.p16460200} fill="var(--fill-0, #0080B2)" fillRule="evenodd" id="Fill 15" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Tooth11() {
  return (
    <div className="absolute inset-[46.72%_5.67%_32.38%_77.66%]" data-name="Tooth">
      <div className="absolute inset-[1.96%_2.77%_1.06%_2.06%]" data-name="Border 14">
        <div className="absolute inset-[-3.97%_-4.4%_-3.69%_-4.35%]">
          <img alt="" className="block max-w-none size-full" height="40.591" src={imgBorder14} width="37.086" />
        </div>
      </div>
      <div className="absolute inset-[24.4%_34.6%_36.76%_32.24%]" data-name="Fill 14">
        <img alt="" className="block max-w-none size-full" height="15.1" src={imgFill16} width="11.883" />
      </div>
    </div>
  );
}

function Tooth12() {
  return (
    <div className="relative size-full" data-name="Tooth">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.922 31.2541">
        <g id="Tooth">
          <path clipRule="evenodd" d={svgPaths.p2eee880} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 7" stroke="var(--stroke-0, #8F8F8F)" />
          <path clipRule="evenodd" d={svgPaths.p18314d80} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 7" />
        </g>
      </svg>
    </div>
  );
}

function Tooth13() {
  return (
    <div className="relative size-full" data-name="Tooth">
      <div className="absolute inset-[0_-0.08%_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.2327 30.4918">
          <g id="Tooth">
            <path clipRule="evenodd" d={svgPaths.p336ece00} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 6" stroke="var(--stroke-0, #8F8F8F)" />
            <path clipRule="evenodd" d={svgPaths.p5bcff00} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Tooth14() {
  return (
    <div className="relative size-full" data-name="Tooth">
      <div className="absolute inset-[0_-0.33%_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.5387 26.6803">
          <g id="Tooth">
            <path clipRule="evenodd" d={svgPaths.p3eb0a700} fill="var(--fill-0, #8ADAFF)" fillRule="evenodd" id="Border 5" stroke="var(--stroke-0, #0080B2)" />
            <path clipRule="evenodd" d={svgPaths.p1f95c770} fill="var(--fill-0, #0080B2)" fillRule="evenodd" id="Fill 5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Tooth15() {
  return (
    <div className="relative size-full" data-name="Tooth">
      <div className="absolute inset-[0_-0.41%_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.3244 25.1557">
          <g id="Tooth">
            <path clipRule="evenodd" d={svgPaths.p1f7569f0} fill="var(--fill-0, #8ADAFF)" fillRule="evenodd" id="Border 4" stroke="var(--stroke-0, #0080B2)" />
            <path clipRule="evenodd" d={svgPaths.p2475a00} fill="var(--fill-0, #0080B2)" fillRule="evenodd" id="Fill 4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute inset-[calc(25.71%-1px)_calc(0.53%-1px)_calc(25.13%-1px)_calc(1.43%-1px)]" data-name="Container">
      <div className="absolute inset-[0_0_-0.22%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 63.7267 34.4875">
          <g id="Container">
            <path clipRule="evenodd" d={svgPaths.p13755700} fill="var(--fill-0, white)" fillRule="evenodd" id="Tooth" stroke="var(--stroke-0, black)" strokeOpacity="0.445" />
            <g id="Tooth permanent">
              <path clipRule="evenodd" d={svgPaths.p21115d00} fill="var(--fill-0, white)" fillRule="evenodd" id="Tooth_2" stroke="var(--stroke-0, black)" strokeOpacity="0.445" />
              <g id="Shade" />
            </g>
            <g id="Tooth permanent_2">
              <path clipRule="evenodd" d={svgPaths.p214785c0} fill="var(--fill-0, white)" fillRule="evenodd" id="Tooth_3" stroke="var(--stroke-0, black)" strokeOpacity="0.445" />
              <g id="Shade_2" />
            </g>
            <g id="Tooth permanent_3">
              <path clipRule="evenodd" d={svgPaths.p18f71280} fill="var(--fill-0, white)" fillRule="evenodd" id="Tooth_4" stroke="var(--stroke-0, black)" strokeOpacity="0.445" />
              <g id="Shade_3" />
            </g>
            <g id="Tooth permanent_4">
              <path clipRule="evenodd" d={svgPaths.p2d1a2b00} fill="var(--fill-0, white)" fillRule="evenodd" id="Tooth_5" stroke="var(--stroke-0, black)" strokeOpacity="0.445" />
              <g id="Shade_4" />
            </g>
            <g id="Tooth permanent_5">
              <path clipRule="evenodd" d={svgPaths.p3b846200} fill="var(--fill-0, white)" fillRule="evenodd" id="Tooth_6" stroke="var(--stroke-0, black)" strokeOpacity="0.445" />
              <g id="Shade_5" />
            </g>
            <path clipRule="evenodd" d={svgPaths.p4d0ef80} fill="var(--fill-0, white)" fillRule="evenodd" id="Tooth_7" stroke="var(--stroke-0, black)" strokeOpacity="0.445" />
            <g id="Tooth permanent_6">
              <path clipRule="evenodd" d={svgPaths.p2fe5cc80} fill="var(--fill-0, white)" fillRule="evenodd" id="Tooth_8" stroke="var(--stroke-0, black)" strokeOpacity="0.445" />
              <g id="Shade_6" />
            </g>
            <g id="Tooth permanent_7">
              <path d={svgPaths.p229710c0} fill="var(--fill-0, white)" id="Tooth_9" stroke="var(--stroke-0, black)" strokeOpacity="0.445" />
              <g id="Shade_7" />
            </g>
            <g id="Tooth permanent_8">
              <path d={svgPaths.p7c29f80} fill="var(--fill-0, white)" id="Tooth_10" stroke="var(--stroke-0, black)" strokeOpacity="0.445" />
              <g id="Shade_8" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function Bite() {
  return (
    <div className="absolute bg-[#fff0f3] border border-[#8e8e8e] border-solid inset-[77.42%_33.95%_-15.05%_35.81%] rounded-[18px]" data-name="Bite">
      <Container3 />
    </div>
  );
}

function UpperArch() {
  return (
    <div className="absolute h-[186px] left-0 top-0 w-[215px]" data-name="Upper Arch">
      <div className="absolute inset-[0.41%_1.06%_0_0.35%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[7.79%_7.89%_0_7.8%]" data-name="Subtract">
        <div className="absolute inset-[-0.29%_-0.28%]" style={{ "--fill-0": "rgba(255, 240, 243, 1)", "--stroke-0": "rgba(143, 143, 143, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 182.273 172.516">
            <path d={svgPaths.p19759800} fill="var(--fill-0, #FFF0F3)" id="Subtract" stroke="var(--stroke-0, #8F8F8F)" />
          </svg>
        </div>
      </div>
      <Tooth />
      <div className="absolute flex inset-[81.72%_85.12%_0.54%_0] items-center justify-center">
        <div className="flex-none h-[33px] rotate-[180deg] scale-y-[-100%] w-[32px]">
          <Tooth1 />
        </div>
      </div>
      <div className="absolute flex inset-[64.75%_82.62%_16.39%_2.13%] items-center justify-center">
        <div className="flex-none h-[35.066px] rotate-[180deg] scale-y-[-100%] w-[32.784px]">
          <Tooth2 />
        </div>
      </div>
      <div className="absolute flex inset-[46.72%_77.66%_32.38%_5.67%] items-center justify-center">
        <div className="flex-none h-[38.877px] rotate-[180deg] scale-y-[-100%] w-[35.833px]">
          <Tooth3 />
        </div>
      </div>
      <Tooth4 />
      <Tooth5 />
      <Tooth6 />
      <Tooth7 />
      <div className="absolute bottom-[83.2%] flex items-center justify-center left-1/2 right-[36.17%] top-0">
        <div className="flex-none h-[31.254px] rotate-[180deg] scale-y-[-100%] w-[29.734px]">
          <Tooth8 />
        </div>
      </div>
      <Tooth9 />
      <Tooth10 />
      <Tooth11 />
      <div className="absolute flex inset-[4.51%_25.53%_78.69%_62.41%] items-center justify-center">
        <div className="flex-none h-[31.254px] rotate-[180deg] scale-y-[-100%] w-[25.922px]">
          <Tooth12 />
        </div>
      </div>
      <div className="absolute flex inset-[13.11%_18.79%_70.49%_68.09%] items-center justify-center">
        <div className="flex-none h-[30.492px] rotate-[180deg] scale-y-[-100%] w-[28.209px]">
          <Tooth13 />
        </div>
      </div>
      <div className="absolute flex inset-[23.77%_14.18%_61.89%_73.05%] items-center justify-center">
        <div className="flex-none h-[26.68px] rotate-[180deg] scale-y-[-100%] w-[27.447px]">
          <Tooth14 />
        </div>
      </div>
      <div className="absolute flex inset-[35.25%_10.64%_51.23%_76.24%] items-center justify-center">
        <div className="flex-none h-[25.156px] rotate-[180deg] scale-y-[-100%] w-[28.209px]">
          <Tooth15 />
        </div>
      </div>
      <Bite />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[186px] left-0 top-0 w-[215px]" data-name="Container">
      <UpperArch />
    </div>
  );
}

export function Container1() {
  return (
    <div className="h-[186px] relative shrink-0 w-[215px]" data-name="Container">
      <Container2 />
    </div>
  );
}

function LowerArch() {
  return (
    <div className="h-[179px] relative shrink-0 w-[214px]" data-name="Lower Arch">
      <div className="absolute inset-[-1.25%_-0.67%_-0.82%_-0.67%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 216.887 182.715">
          <g id="Lower Arch">
            <g id="Vector">
              <mask fill="black" height="183" id="path-1-outside-1_3_13910" maskUnits="userSpaceOnUse" width="217" x="0" y="5.96046e-08">
                <rect fill="white" height="183" width="217" y="5.96046e-08" />
                <path clipRule="evenodd" d={svgPaths.p20f5ac00} fillRule="evenodd" />
              </mask>
              <path clipRule="evenodd" d={svgPaths.p20f5ac00} fillRule="evenodd" mask="url(#path-1-outside-1_3_13910)" stroke="var(--stroke-0, #009ACE)" strokeMiterlimit="10" strokeWidth="6" />
            </g>
            <path d={svgPaths.p2e657d00} fill="var(--fill-0, #FFF0F3)" id="Gingiva" />
            <g id="Tooth">
              <path clipRule="evenodd" d={svgPaths.p17b3d500} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 32" stroke="var(--stroke-0, #8F8F8F)" strokeWidth="0.744681" />
              <path clipRule="evenodd" d={svgPaths.p4ab8500} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 32" />
            </g>
            <g id="Tooth_2">
              <path clipRule="evenodd" d={svgPaths.p2d311440} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 32_2" stroke="var(--stroke-0, #8F8F8F)" strokeWidth="0.744681" />
              <path clipRule="evenodd" d={svgPaths.p1e656f80} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 32_2" />
            </g>
            <g id="Tooth_3">
              <path clipRule="evenodd" d={svgPaths.p17fde600} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 31" stroke="var(--stroke-0, #8F8F8F)" strokeWidth="0.744681" />
              <path clipRule="evenodd" d={svgPaths.p3a8d9e80} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 19" />
            </g>
            <g id="Tooth_4">
              <path clipRule="evenodd" d={svgPaths.p213e6c80} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 31_2" stroke="var(--stroke-0, #8F8F8F)" strokeWidth="0.744681" />
              <path clipRule="evenodd" d={svgPaths.p1bbbd400} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 19_2" />
            </g>
            <g id="Tooth_5">
              <path clipRule="evenodd" d={svgPaths.p2f160f80} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 30" stroke="var(--stroke-0, #8F8F8F)" strokeWidth="0.744681" />
              <path clipRule="evenodd" d={svgPaths.p2202c680} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 30" />
            </g>
            <g id="Tooth_6">
              <path clipRule="evenodd" d={svgPaths.p2910a300} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 30_2" stroke="var(--stroke-0, #8F8F8F)" strokeWidth="0.744681" />
              <path clipRule="evenodd" d={svgPaths.p2fd92500} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 30_2" />
            </g>
            <g id="Tooth_7">
              <path clipRule="evenodd" d={svgPaths.p1f594400} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 29" stroke="var(--stroke-0, #8F8F8F)" strokeWidth="0.744681" />
              <path clipRule="evenodd" d={svgPaths.p3e233540} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 29" />
            </g>
            <g id="Tooth_8">
              <path clipRule="evenodd" d={svgPaths.p3e21ea00} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 29_2" stroke="var(--stroke-0, #8F8F8F)" strokeWidth="0.744681" />
              <path clipRule="evenodd" d={svgPaths.pdf32080} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 29_2" />
            </g>
            <g id="Tooth_9">
              <path clipRule="evenodd" d={svgPaths.p3e61d280} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 28" stroke="var(--stroke-0, #8F8F8F)" strokeWidth="0.744681" />
              <path clipRule="evenodd" d={svgPaths.pba2cb00} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 28" />
            </g>
            <g id="Tooth_10">
              <path clipRule="evenodd" d={svgPaths.p36546800} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 28_2" stroke="var(--stroke-0, #8F8F8F)" strokeWidth="0.744681" />
              <path clipRule="evenodd" d={svgPaths.p936840} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 28_2" />
            </g>
            <g id="Tooth_11">
              <path clipRule="evenodd" d={svgPaths.p1da87b00} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 27" stroke="var(--stroke-0, #8F8F8F)" strokeWidth="0.744681" />
              <path clipRule="evenodd" d={svgPaths.pbc55840} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 27" />
            </g>
            <g id="Tooth_12">
              <path clipRule="evenodd" d={svgPaths.p1e2e3700} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 27_2" stroke="var(--stroke-0, #8F8F8F)" strokeWidth="0.744681" />
              <path clipRule="evenodd" d={svgPaths.p37f32f00} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 27_2" />
            </g>
            <g id="Tooth_13">
              <path clipRule="evenodd" d={svgPaths.pf52c580} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 26" stroke="var(--stroke-0, #8F8F8F)" strokeWidth="0.744681" />
              <path clipRule="evenodd" d={svgPaths.p3ba49700} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 26" />
            </g>
            <g id="Tooth_14">
              <path clipRule="evenodd" d={svgPaths.p29ce0000} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 26_2" stroke="var(--stroke-0, #8F8F8F)" strokeWidth="0.744681" />
              <path clipRule="evenodd" d={svgPaths.p39eb4380} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 26_2" />
            </g>
            <g id="Tooth_15">
              <path clipRule="evenodd" d={svgPaths.p623e600} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 25" stroke="var(--stroke-0, #8F8F8F)" strokeWidth="0.744681" />
              <path clipRule="evenodd" d={svgPaths.p34222a80} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 25" />
            </g>
            <g id="Tooth_16">
              <path clipRule="evenodd" d={svgPaths.p2a190b28} fill="var(--fill-0, white)" fillRule="evenodd" id="Border 25_2" stroke="var(--stroke-0, #8F8F8F)" strokeWidth="0.744681" />
              <path clipRule="evenodd" d={svgPaths.p2ee8500} fill="var(--fill-0, #8F8F8F)" fillRule="evenodd" id="Fill 25_2" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export function Container4() {
  return (
    <div className="content-start flex flex-wrap items-start px-[17px] py-0 relative shrink-0" data-name="Container">
      <LowerArch />
    </div>
  );
}

export default function JawNavigation({ onToothSelect, selectedTeeth = [] }: JawNavigationProps) {
  const [internalSelectedTeeth, setInternalSelectedTeeth] = useState<ToothId[]>([]);
  const [currentView, setCurrentView] = useState<JawView>('lower');

  const handleToothClick = (toothId: ToothId) => {
    const isSelected = internalSelectedTeeth.includes(toothId);
    const newSelection = isSelected 
      ? internalSelectedTeeth.filter(id => id !== toothId)
      : [...internalSelectedTeeth, toothId];
    
    setInternalSelectedTeeth(newSelection);
    
    if (onToothSelect) {
      onToothSelect(toothId);
    }
  };

  const handlePreviousView = () => {
    const views: JawView[] = ['upper', 'lower', 'bite'];
    const currentIndex = views.indexOf(currentView);
    const newIndex = (currentIndex - 1 + views.length) % views.length;
    setCurrentView(views[newIndex]);
  };

  const handleNextView = () => {
    const views: JawView[] = ['upper', 'lower', 'bite'];
    const currentIndex = views.indexOf(currentView);
    const newIndex = (currentIndex + 1) % views.length;
    setCurrentView(views[newIndex]);
  };

  return (
    <div className="content-stretch flex flex-col items-center relative size-full" data-name="Container">
      {/* Jaw Visualization */}
      <div className="content-stretch flex flex-col gap-[8px] items-center">
        <Container1 />
        <Container4 />
      </div>
      
      {/* Jaw Selector with padding */}
      <div className="pt-[16px] w-full max-w-[249px]">
        <JawSelector currentView={currentView} onPrevious={handlePreviousView} onNext={handleNextView} />
      </div>
    </div>
  );
}
