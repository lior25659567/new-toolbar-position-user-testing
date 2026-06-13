import svgPaths from "./svg-fwmeut6d9a";

function Frame6() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Avenir:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[24px] text-black w-[280px]" dir="auto">
        Pre-treatment
      </p>
    </div>
  );
}

function CoordinateFullArch() {
  return (
    <div className="relative size-[32px]" data-name="coordinate full arch">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="coordinate full arch">
          <path clipRule="evenodd" d={svgPaths.p1136ca30} fill="var(--fill-0, #818181)" fillRule="evenodd" id="Path" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return <div className="bg-[#00adef] h-[6px] rounded-[3.35544e+07px] shrink-0 w-[117px]" data-name="Text" />;
}

function Text1() {
  return (
    <div className="absolute bg-[#818181] content-stretch flex flex-col h-[6px] items-start left-0 overflow-clip rounded-[3.35544e+07px] top-[14px] w-[194px]" data-name="Text">
      <Text />
    </div>
  );
}

function Slider() {
  return <div className="absolute bg-white border-2 border-[#00adef] border-solid left-[105px] rounded-[3.35544e+07px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] size-[18px] top-[7px]" data-name="Slider" />;
}

function PrimitiveSpan() {
  return (
    <div className="h-[32px] relative shrink-0 w-[199px]" data-name="Primitive.span">
      <Text1 />
      <Slider />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <CoordinateFullArch />
        </div>
      </div>
      <PrimitiveSpan />
    </div>
  );
}

function Slider1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[232px]" data-name="Slider">
      <Frame9 />
    </div>
  );
}

function VisibilityOn() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="visibility-on">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="visibility-on">
          <path clipRule="evenodd" d={svgPaths.p30a26100} fill="var(--fill-0, #00ADEF)" fillRule="evenodd" id="Path" />
        </g>
      </svg>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Slider1 />
      <VisibilityOn />
    </div>
  );
}

function Slider2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[280px]" data-name="Slider">
      <Frame12 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[16px] h-[50px] items-center relative shrink-0 w-[280px]">
      <Slider2 />
    </div>
  );
}

function LayerGroup() {
  return (
    <div className="content-stretch flex flex-col gap-[23px] items-start px-0 py-[8px] relative shrink-0 w-full" data-name="Layer group">
      <div aria-hidden="true" className="absolute border-[#cecece] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Frame6 />
      <Frame5 />
    </div>
  );
}

function Layer() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[10px] py-0 relative shrink-0 w-[300px]" data-name="Layer">
      <LayerGroup />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Avenir:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[24px] text-black w-[280px]" dir="auto">
        Treatment scan
      </p>
    </div>
  );
}

function CoordinateFullArch1() {
  return (
    <div className="relative size-[32px]" data-name="coordinate full arch">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="coordinate full arch">
          <path clipRule="evenodd" d={svgPaths.p1136ca30} fill="var(--fill-0, #818181)" fillRule="evenodd" id="Path" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return <div className="bg-[#00adef] h-[6px] rounded-[3.35544e+07px] shrink-0 w-[117px]" data-name="Text" />;
}

function Text3() {
  return (
    <div className="absolute bg-[#818181] content-stretch flex flex-col h-[6px] items-start left-0 overflow-clip rounded-[3.35544e+07px] top-[14px] w-[194px]" data-name="Text">
      <Text2 />
    </div>
  );
}

function Slider3() {
  return <div className="absolute bg-white border-2 border-[#00adef] border-solid left-[105px] rounded-[3.35544e+07px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] size-[18px] top-[7px]" data-name="Slider" />;
}

function PrimitiveSpan1() {
  return (
    <div className="h-[32px] relative shrink-0 w-[199px]" data-name="Primitive.span">
      <Text3 />
      <Slider3 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <CoordinateFullArch1 />
        </div>
      </div>
      <PrimitiveSpan1 />
    </div>
  );
}

function Slider4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[232px]" data-name="Slider">
      <Frame10 />
    </div>
  );
}

function VisibilityOff() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="visibility-off">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="visibility-off">
          <path clipRule="evenodd" d={svgPaths.p2d134280} fill="var(--fill-0, #939598)" fillRule="evenodd" id="Path" />
        </g>
      </svg>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Slider4 />
      <VisibilityOff />
    </div>
  );
}

function Slider5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[280px]" data-name="Slider">
      <Frame13 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[16px] h-[50px] items-center relative shrink-0 w-[280px]">
      <Slider5 />
    </div>
  );
}

function LayerGroup1() {
  return (
    <div className="content-stretch flex flex-col gap-[23px] items-start px-0 py-[8px] relative shrink-0 w-full" data-name="Layer group">
      <Frame8 />
      <Frame7 />
    </div>
  );
}

function Layer1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[10px] py-0 relative shrink-0 w-[300px]" data-name="Layer">
      <LayerGroup1 />
    </div>
  );
}

function Layers() {
  return (
    <div className="absolute bg-white bottom-0 content-stretch flex flex-col gap-[12px] items-center left-0 px-[8px] py-[8px] right-0 rounded-bl-[8px] rounded-br-[8px] top-[20.99%]" data-name="Layers">
      <Layer />
      <Layer1 />
    </div>
  );
}

function Lower() {
  return (
    <div className="absolute h-[17.955px] left-[5.91px] top-[26.11px] w-[45.442px]" data-name="Lower">
      <div className="absolute inset-[-3.28%_-1.21%_-3.04%_-1.2%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 47 20">
          <g id="Lower" opacity="0.2">
            <g id="Vector 231">
              <g filter="url(#filter0_i_97_6168)">
                <path d={svgPaths.p2d072b00} fill="var(--fill-0, #D98A87)" />
              </g>
              <path d={svgPaths.p2d072b00} stroke="var(--stroke-0, #595959)" strokeWidth="1.09271" />
            </g>
            <g id="Vector 225">
              <g filter="url(#filter1_i_97_6168)">
                <path d={svgPaths.p1e8295f1} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p1e8295f1} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p1e8295f1} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <g id="Vector 227">
              <g filter="url(#filter2_i_97_6168)">
                <path d={svgPaths.p1b738280} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p1b738280} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p1b738280} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <g id="Vector 224">
              <g filter="url(#filter3_i_97_6168)">
                <path d={svgPaths.p2df63900} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p2df63900} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p2df63900} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <g id="Vector 230">
              <g filter="url(#filter4_i_97_6168)">
                <path d={svgPaths.p1f0c5940} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p1f0c5940} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p1f0c5940} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <g id="Vector 229">
              <g filter="url(#filter5_i_97_6168)">
                <path d={svgPaths.p3924b100} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p3924b100} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p3924b100} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <g id="Vector 228">
              <g filter="url(#filter6_i_97_6168)">
                <path d={svgPaths.p2965a900} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p2965a900} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p2965a900} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <g id="Vector 223">
              <g filter="url(#filter7_i_97_6168)">
                <path d={svgPaths.p22cd1800} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p22cd1800} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p22cd1800} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <g id="Vector 222">
              <g filter="url(#filter8_i_97_6168)">
                <path d={svgPaths.p28c9fe00} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p28c9fe00} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p28c9fe00} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <g id="Vector 221">
              <g filter="url(#filter9_i_97_6168)">
                <path d={svgPaths.p7aebb70} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p7aebb70} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p7aebb70} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <g id="Vector 226">
              <g filter="url(#filter10_i_97_6168)">
                <path d={svgPaths.p33f19380} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p33f19380} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p33f19380} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="17.1946" id="filter0_i_97_6168" width="46.5345" x="0" y="2.5866">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="0.690625" />
              <feGaussianBlur stdDeviation="0.483438" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6168" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="5.68312" id="filter1_i_97_6168" width="3.32046" x="42.9903" y="6.38583">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6168" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="8.46792" id="filter2_i_97_6168" width="8.5576" x="16.9707" y="4.83921">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6168" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="7.81789" id="filter3_i_97_6168" width="6.9619" x="38.332" y="5.74587">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6168" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="7.91901" id="filter4_i_97_6168" width="10.8313" x="-0.0271315" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6168" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="8.46812" id="filter5_i_97_6168" width="9.5099" x="5.37029" y="3.01101">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6168" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="7.32087" id="filter6_i_97_6168" width="7.82949" x="11.8741" y="4.05056">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6168" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="7.81789" id="filter7_i_97_6168" width="6.9619" x="36.0267" y="6.94867">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6168" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="7.96834" id="filter8_i_97_6168" width="6.9619" x="32.6953" y="7.47654">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6168" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="8.18437" id="filter9_i_97_6168" width="7.4306" x="28.4347" y="7.47758">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6168" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="9.6132" id="filter10_i_97_6168" width="7.20974" x="22.6466" y="6.94418">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6168" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Upper() {
  return (
    <div className="absolute h-[19.99px] left-[6.35px] top-[14.72px] w-[47.988px]" data-name="Upper">
      <div className="absolute inset-[-3.53%_-1.14%_-2.73%_-1.14%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 22">
          <g id="Upper">
            <g filter="url(#filter0_i_97_6194)" id="Vector 233">
              <path d={svgPaths.p3ef53600} fill="var(--fill-0, #D98A87)" />
            </g>
            <g id="Vector 211">
              <g filter="url(#filter1_i_97_6194)">
                <path d={svgPaths.p5c05500} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p5c05500} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p5c05500} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <g id="Vector 212">
              <g filter="url(#filter2_i_97_6194)">
                <path d={svgPaths.p2432fd00} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p2432fd00} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p2432fd00} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <g id="Vector 213">
              <g filter="url(#filter3_i_97_6194)">
                <path d={svgPaths.p3b464900} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p3b464900} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p3b464900} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <g id="Vector 214">
              <g filter="url(#filter4_i_97_6194)">
                <path d={svgPaths.p318fbc80} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p318fbc80} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p318fbc80} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <g id="Vector 215">
              <g filter="url(#filter5_i_97_6194)">
                <path d={svgPaths.p2b4f7900} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p2b4f7900} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p2b4f7900} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <g id="Vector 220">
              <g filter="url(#filter6_i_97_6194)">
                <path d={svgPaths.p1f5abc00} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p1f5abc00} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p1f5abc00} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <g id="Vector 216">
              <g filter="url(#filter7_i_97_6194)">
                <path d={svgPaths.pa1ddd00} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.pa1ddd00} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.pa1ddd00} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <g id="Vector 217">
              <g filter="url(#filter8_i_97_6194)">
                <path d={svgPaths.p30d7dc00} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p30d7dc00} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p30d7dc00} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <g id="Vector 218">
              <g filter="url(#filter9_i_97_6194)">
                <path d={svgPaths.p16779a80} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p16779a80} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p16779a80} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <path d={svgPaths.p13809700} fill="var(--fill-0, #AB6C6C)" id="Vector 234" />
            <g id="Vector 219">
              <g filter="url(#filter10_i_97_6194)">
                <path d={svgPaths.p27829210} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p27829210} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.09271" />
              <path d={svgPaths.p27829210} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.09271" />
            </g>
            <path d={svgPaths.p3578fb00} fill="var(--fill-0, #C47D7A)" id="Vector 232" />
            <path d={svgPaths.p382b78f0} id="Vector 303" stroke="var(--stroke-0, #595959)" strokeWidth="1.09271" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="13.2" id="filter0_i_97_6194" width="47.3983" x="0.790273" y="3.22328">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.207187" dy="-1.17406" />
              <feGaussianBlur stdDeviation="0.5525" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6194" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="10.8634" id="filter1_i_97_6194" width="7.74087" x="25.7851" y="10.0874">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6194" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="12.0401" id="filter2_i_97_6194" width="8.96602" x="32.0772" y="9.32685">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6194" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="11.6568" id="filter3_i_97_6194" width="6.72265" x="39.5986" y="8.52589">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6194" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="10.1374" id="filter4_i_97_6194" width="3.27857" x="44.6621" y="8.01409">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6194" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="9.55666" id="filter5_i_97_6194" width="2.71288" x="46.368" y="6.94414">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6194" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="7.73427" id="filter6_i_97_6194" width="6.36233" x="-0.124044" y="6.88116">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6194" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="10.759" id="filter7_i_97_6194" width="8.15756" x="18.834" y="10.267">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6194" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="9.57719" id="filter8_i_97_6194" width="6.31573" x="14.2219" y="10.1041">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6194" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="8.04329" id="filter9_i_97_6194" width="6.166" x="9.37819" y="10.0264">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6194" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="8.74854" id="filter10_i_97_6194" width="6.54539" x="4.45222" y="7.84977">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.124044" dy="0.124044" />
              <feGaussianBlur stdDeviation="0.124044" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6194" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Icons() {
  return (
    <div className="absolute left-0 size-[60px] top-0" data-name="Icons">
      <Lower />
      <Upper />
    </div>
  );
}

function ButtonsToolbar() {
  return (
    <div className="relative rounded-[8.75px] shrink-0 size-[60px]" data-name="Buttons toolbar">
      <Icons />
    </div>
  );
}

function Lower1() {
  return (
    <div className="absolute h-[18.199px] left-[-0.09px] top-[14.31px] w-[46.059px]" data-name="Lower">
      <div className="absolute inset-[-3.28%_-1.2%_-3.04%_-1.2%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 20">
          <g id="Lower">
            <g id="Vector 231">
              <g filter="url(#filter0_i_97_6181)">
                <path d={svgPaths.p23687a00} fill="var(--fill-0, #D98A87)" />
              </g>
              <path d={svgPaths.p23687a00} stroke="var(--stroke-0, #595959)" strokeWidth="1.10755" />
            </g>
            <g id="Vector 225">
              <g filter="url(#filter1_i_97_6181)">
                <path d={svgPaths.pb5b2870} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.pb5b2870} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.pb5b2870} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <g id="Vector 227">
              <g filter="url(#filter2_i_97_6181)">
                <path d={svgPaths.p34a7c100} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p34a7c100} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.p34a7c100} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <g id="Vector 224">
              <g filter="url(#filter3_i_97_6181)">
                <path d={svgPaths.p10110980} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p10110980} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.p10110980} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <g id="Vector 230">
              <g filter="url(#filter4_i_97_6181)">
                <path d={svgPaths.p367f8d80} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p367f8d80} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.p367f8d80} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <g id="Vector 229">
              <g filter="url(#filter5_i_97_6181)">
                <path d={svgPaths.p3bf1ff00} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p3bf1ff00} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.p3bf1ff00} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <g id="Vector 228">
              <g filter="url(#filter6_i_97_6181)">
                <path d={svgPaths.pc3f5000} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.pc3f5000} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.pc3f5000} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <g id="Vector 223">
              <g filter="url(#filter7_i_97_6181)">
                <path d={svgPaths.pf3d7c00} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.pf3d7c00} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.pf3d7c00} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <g id="Vector 222">
              <g filter="url(#filter8_i_97_6181)">
                <path d={svgPaths.p1c0dd880} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p1c0dd880} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.p1c0dd880} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <g id="Vector 221">
              <g filter="url(#filter9_i_97_6181)">
                <path d={svgPaths.p1c51f700} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p1c51f700} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.p1c51f700} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <g id="Vector 226">
              <g filter="url(#filter10_i_97_6181)">
                <path d={svgPaths.p34ca1e00} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p34ca1e00} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.p34ca1e00} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="17.428" id="filter0_i_97_6181" width="47.1662" x="0" y="2.62163">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="0.7" />
              <feGaussianBlur stdDeviation="0.49" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6181" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="5.76027" id="filter1_i_97_6181" width="3.36554" x="43.5745" y="6.47248">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6181" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="8.58287" id="filter2_i_97_6181" width="8.67376" x="17.1995" y="4.90483">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6181" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="7.92401" id="filter3_i_97_6181" width="7.05641" x="38.8509" y="5.82353">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6181" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="8.02651" id="filter4_i_97_6181" width="10.9784" x="-0.0271349" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6181" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="8.58307" id="filter5_i_97_6181" width="9.639" x="5.4427" y="3.05203">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6181" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="7.42025" id="filter6_i_97_6181" width="7.93577" x="12.0344" y="4.10551">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6181" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="7.92401" id="filter7_i_97_6181" width="7.05641" x="36.5149" y="7.04301">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6181" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="8.07651" id="filter8_i_97_6181" width="7.05641" x="33.139" y="7.57793">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6181" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="8.29547" id="filter9_i_97_6181" width="7.53147" x="28.8196" y="7.57896">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6181" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="9.74369" id="filter10_i_97_6181" width="7.30761" x="22.9533" y="7.03841">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6181" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Upper1() {
  return (
    <div className="absolute h-[20.261px] left-[0.36px] top-[2.76px] w-[48.639px]" data-name="Upper">
      <div className="absolute inset-[-3.54%_-1.14%_-2.73%_-1.14%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 22">
          <g id="Upper" opacity="0.2">
            <g filter="url(#filter0_i_97_6152)" id="Vector 233">
              <path d={svgPaths.p13017e00} fill="var(--fill-0, #D98A87)" />
            </g>
            <g id="Vector 211">
              <g filter="url(#filter1_i_97_6152)">
                <path d={svgPaths.p29299100} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p29299100} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.p29299100} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <g id="Vector 212">
              <g filter="url(#filter2_i_97_6152)">
                <path d={svgPaths.p35c1b100} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p35c1b100} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.p35c1b100} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <g id="Vector 213">
              <g filter="url(#filter3_i_97_6152)">
                <path d={svgPaths.p2da83b00} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p2da83b00} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.p2da83b00} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <g id="Vector 214">
              <g filter="url(#filter4_i_97_6152)">
                <path d={svgPaths.p1fb13900} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p1fb13900} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.p1fb13900} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <g id="Vector 215">
              <g filter="url(#filter5_i_97_6152)">
                <path d={svgPaths.p1090c400} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p1090c400} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.p1090c400} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <g id="Vector 220">
              <g filter="url(#filter6_i_97_6152)">
                <path d={svgPaths.p33862380} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p33862380} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.p33862380} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <g id="Vector 216">
              <g filter="url(#filter7_i_97_6152)">
                <path d={svgPaths.p2d559500} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p2d559500} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.p2d559500} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <g id="Vector 217">
              <g filter="url(#filter8_i_97_6152)">
                <path d={svgPaths.pa819e00} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.pa819e00} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.pa819e00} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <g id="Vector 218">
              <g filter="url(#filter9_i_97_6152)">
                <path d={svgPaths.p3b2f9b00} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p3b2f9b00} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.p3b2f9b00} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <path d={svgPaths.p3d149000} fill="var(--fill-0, #AB6C6C)" id="Vector 234" />
            <g id="Vector 219">
              <g filter="url(#filter10_i_97_6152)">
                <path d={svgPaths.p34577d00} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p34577d00} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.10755" />
              <path d={svgPaths.p34577d00} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.10755" />
            </g>
            <path d={svgPaths.p1882c380} fill="var(--fill-0, #C47D7A)" id="Vector 232" />
            <path d={svgPaths.pf539080} id="Vector 303" stroke="var(--stroke-0, #595959)" strokeWidth="1.10755" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="13.3791" id="filter0_i_97_6152" width="48.0417" x="0.800842" y="3.26727">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.21" dy="-1.19" />
              <feGaussianBlur stdDeviation="0.56" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6152" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="11.0109" id="filter1_i_97_6152" width="7.84594" x="26.135" y="10.2244">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6152" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="12.2035" id="filter2_i_97_6152" width="9.08773" x="32.513" y="9.45356">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6152" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="11.8151" id="filter3_i_97_6152" width="6.81391" x="40.137" y="8.64185">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6152" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="10.275" id="filter4_i_97_6152" width="3.32308" x="45.2687" y="8.12272">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6152" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="9.68639" id="filter5_i_97_6152" width="2.74971" x="46.9984" y="7.03867">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6152" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="7.83926" id="filter6_i_97_6152" width="6.4487" x="-0.125728" y="6.97491">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6152" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="10.9051" id="filter7_i_97_6152" width="8.26829" x="19.0903" y="10.4066">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6152" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="9.70719" id="filter8_i_97_6152" width="6.40146" x="14.4143" y="10.2414">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6152" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="8.15248" id="filter9_i_97_6152" width="6.2497" x="9.50532" y="10.1626">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6152" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="8.8673" id="filter10_i_97_6152" width="6.63424" x="4.51296" y="7.9565">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.125728" dy="0.125728" />
              <feGaussianBlur stdDeviation="0.125728" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6152" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute h-[35.91px] left-[calc(50%+0.5px)] top-[calc(50%-0.04px)] translate-x-[-50%] translate-y-[-50%] w-[49px]">
      <Lower1 />
      <Upper1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute left-0 size-[60px] top-0">
      <Frame1 />
    </div>
  );
}

function IconsLower() {
  return (
    <div className="absolute left-0 overflow-clip size-[60px] top-0" data-name="Icons / Lower">
      <Frame4 />
    </div>
  );
}

function Icons1() {
  return (
    <div className="absolute left-0 overflow-clip size-[60px] top-0" data-name="Icons">
      <IconsLower />
    </div>
  );
}

function ButtonsToolbar1() {
  return (
    <div className="relative rounded-[8.75px] shrink-0 size-[60px]" data-name="Buttons toolbar">
      <div className="absolute bg-[#5fcefa] left-0 opacity-20 rounded-[8.75px] size-[60px] top-0" data-name="White background" />
      <Icons1 />
    </div>
  );
}

function Lower2() {
  return (
    <div className="absolute h-[17.827px] left-[-0.09px] top-[14.01px] w-[45.119px]" data-name="Lower">
      <div className="absolute inset-[-3.28%_-1.2%_-3.04%_-1.2%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 47 19">
          <g id="Lower">
            <g id="Vector 231">
              <g filter="url(#filter0_i_97_6120)">
                <path d={svgPaths.p250cfc00} fill="var(--fill-0, #D98A87)" />
              </g>
              <path d={svgPaths.p250cfc00} stroke="var(--stroke-0, #595959)" strokeWidth="1.08494" />
            </g>
            <g id="Vector 225">
              <g filter="url(#filter1_i_97_6120)">
                <path d={svgPaths.p36af280} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p36af280} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.p36af280} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <g id="Vector 227">
              <g filter="url(#filter2_i_97_6120)">
                <path d={svgPaths.p149d3500} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p149d3500} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.p149d3500} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <g id="Vector 224">
              <g filter="url(#filter3_i_97_6120)">
                <path d={svgPaths.p25587380} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p25587380} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.p25587380} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <g id="Vector 230">
              <g filter="url(#filter4_i_97_6120)">
                <path d={svgPaths.p34992700} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p34992700} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.p34992700} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <g id="Vector 229">
              <g filter="url(#filter5_i_97_6120)">
                <path d={svgPaths.pd69f680} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.pd69f680} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.pd69f680} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <g id="Vector 228">
              <g filter="url(#filter6_i_97_6120)">
                <path d={svgPaths.p1c9d0800} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p1c9d0800} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.p1c9d0800} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <g id="Vector 223">
              <g filter="url(#filter7_i_97_6120)">
                <path d={svgPaths.p1e7a9400} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p1e7a9400} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.p1e7a9400} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <g id="Vector 222">
              <g filter="url(#filter8_i_97_6120)">
                <path d={svgPaths.p231d8d00} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p231d8d00} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.p231d8d00} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <g id="Vector 221">
              <g filter="url(#filter9_i_97_6120)">
                <path d={svgPaths.p21d4a380} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p21d4a380} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.p21d4a380} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <g id="Vector 226">
              <g filter="url(#filter10_i_97_6120)">
                <path d={svgPaths.p1d33cb80} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p1d33cb80} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.p1d33cb80} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="17.0724" id="filter0_i_97_6120" width="46.2037" x="0" y="2.56801">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="0.685714" />
              <feGaussianBlur stdDeviation="0.48" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6120" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="5.64271" id="filter1_i_97_6120" width="3.29685" x="42.6854" y="6.34014">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6120" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="8.40771" id="filter2_i_97_6120" width="8.49675" x="16.8494" y="4.8046">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6120" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="7.7623" id="filter3_i_97_6120" width="6.9124" x="38.0594" y="5.70453">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6120" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="7.86271" id="filter4_i_97_6120" width="10.7543" x="-0.0255479" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6120" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="8.40791" id="filter5_i_97_6120" width="9.44228" x="5.3319" y="2.98968">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6120" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="7.26882" id="filter6_i_97_6120" width="7.77382" x="11.7898" y="4.02172">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6120" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="7.7623" id="filter7_i_97_6120" width="6.9124" x="35.7704" y="6.89911">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6120" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="7.91168" id="filter8_i_97_6120" width="6.9124" x="32.4637" y="7.42304">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6120" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="8.12617" id="filter9_i_97_6120" width="7.37777" x="28.2321" y="7.42417">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6120" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="9.54484" id="filter10_i_97_6120" width="7.15847" x="22.4853" y="6.89483">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6120" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Upper2() {
  return (
    <div className="absolute h-[19.848px] left-[0.35px] top-[2.7px] w-[47.646px]" data-name="Upper">
      <div className="absolute inset-[-3.53%_-1.14%_-2.73%_-1.14%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 49 22">
          <g id="Upper">
            <g filter="url(#filter0_i_97_6136)" id="Vector 233">
              <path d={svgPaths.p389f9b00} fill="var(--fill-0, #D98A87)" />
            </g>
            <g id="Vector 211">
              <g filter="url(#filter1_i_97_6136)">
                <path d={svgPaths.pd2c9280} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.pd2c9280} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.pd2c9280} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <g id="Vector 212">
              <g filter="url(#filter2_i_97_6136)">
                <path d={svgPaths.p25e84500} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p25e84500} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.p25e84500} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <g id="Vector 213">
              <g filter="url(#filter3_i_97_6136)">
                <path d={svgPaths.p20c9ad80} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p20c9ad80} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.p20c9ad80} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <g id="Vector 214">
              <g filter="url(#filter4_i_97_6136)">
                <path d={svgPaths.pefd3a00} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.pefd3a00} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.pefd3a00} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <g id="Vector 215">
              <g filter="url(#filter5_i_97_6136)">
                <path d={svgPaths.p2a358500} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p2a358500} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.p2a358500} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <g id="Vector 220">
              <g filter="url(#filter6_i_97_6136)">
                <path d={svgPaths.p3f3e0300} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p3f3e0300} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.p3f3e0300} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <g id="Vector 216">
              <g filter="url(#filter7_i_97_6136)">
                <path d={svgPaths.p12d09c80} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p12d09c80} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.p12d09c80} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <g id="Vector 217">
              <g filter="url(#filter8_i_97_6136)">
                <path d={svgPaths.p2b56f180} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p2b56f180} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.p2b56f180} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <g id="Vector 218">
              <g filter="url(#filter9_i_97_6136)">
                <path d={svgPaths.p3838c900} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.p3838c900} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.p3838c900} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <path d={svgPaths.pa73d280} fill="var(--fill-0, #AB6C6C)" id="Vector 234" />
            <g id="Vector 219">
              <g filter="url(#filter10_i_97_6136)">
                <path d={svgPaths.pda9cf80} fill="var(--fill-0, white)" />
              </g>
              <path d={svgPaths.pda9cf80} stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="1.08494" />
              <path d={svgPaths.pda9cf80} stroke="var(--stroke-1, #595959)" strokeMiterlimit="10" strokeWidth="1.08494" />
            </g>
            <path d={svgPaths.p35b52080} fill="var(--fill-0, #C47D7A)" id="Vector 232" />
            <path d={svgPaths.p37173c40} id="Vector 303" stroke="var(--stroke-0, #595959)" strokeWidth="1.08494" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="13.1061" id="filter0_i_97_6136" width="47.0612" x="0.783985" y="3.20055">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.205714" dy="-1.16571" />
              <feGaussianBlur stdDeviation="0.548571" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6136" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="10.7862" id="filter1_i_97_6136" width="7.68582" x="25.6005" y="10.0159">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6136" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="11.9545" id="filter2_i_97_6136" width="8.90226" x="31.8485" y="9.26067">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6136" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="11.574" id="filter3_i_97_6136" width="6.67485" x="39.3172" y="8.46512">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6136" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="10.0653" id="filter4_i_97_6136" width="3.25526" x="44.3446" y="7.95696">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6136" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="9.48871" id="filter5_i_97_6136" width="2.69359" x="46.0388" y="6.89506">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6136" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="7.67927" id="filter6_i_97_6136" width="6.31709" x="-0.123162" y="6.83258">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6136" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="10.6825" id="filter7_i_97_6136" width="8.09955" x="18.6999" y="10.1943">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6136" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="9.50909" id="filter8_i_97_6136" width="6.27082" x="14.12" y="10.0324">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6136" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="7.9861" id="filter9_i_97_6136" width="6.12216" x="9.31174" y="9.9551">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6136" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="8.68633" id="filter10_i_97_6136" width="6.49885" x="4.42063" y="7.79407">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-0.123162" dy="0.123162" />
              <feGaussianBlur stdDeviation="0.123162" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.866667 0 0 0 0 0.882353 0 0 0 0 0.898039 0 0 0 1 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_97_6136" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute h-[35.177px] left-1/2 top-[calc(50%-0.41px)] translate-x-[-50%] translate-y-[-50%] w-[48px]">
      <Lower2 />
      <Upper2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute left-0 size-[60px] top-0">
      <Frame2 />
    </div>
  );
}

function Icons2() {
  return (
    <div className="absolute left-0 overflow-clip size-[60px] top-0" data-name="Icons">
      <Frame3 />
    </div>
  );
}

function ButtonsToolbar2() {
  return (
    <div className="relative rounded-[8.75px] shrink-0 size-[60px]" data-name="Buttons toolbar">
      <Icons2 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <ButtonsToolbar />
      <ButtonsToolbar1 />
      <ButtonsToolbar2 />
    </div>
  );
}

function ChevronUp() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Chevron up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Chevron up">
          <path d={svgPaths.p22197900} fill="var(--fill-0, #3E3D40)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute bg-white bottom-[79.01%] content-stretch flex items-center justify-between left-0 px-[16px] py-[8px] right-0 rounded-tl-[8px] rounded-tr-[8px] top-0">
      <Frame11 />
      <ChevronUp />
    </div>
  );
}

export default function LayerPanel() {
  return (
    <div className="relative size-full" data-name="layer panel">
      <Layers />
      <Frame />
    </div>
  );
}