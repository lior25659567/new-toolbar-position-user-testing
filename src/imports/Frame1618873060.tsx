import svgPaths from "./svg-76kjqgrbiw";

function TrimArea() {
  return (
    <div className="absolute bottom-0 left-[-14%] right-[-12.5%] top-[8.56%]" data-name="trim area">
      <div className="absolute bottom-0 left-[-1.38%] right-[-1.38%] top-[-3.07%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 65 30">
          <g id="trim area">
            <path d={svgPaths.p3f793e80} fill="var(--fill-0, #FFD6D6)" id="Vector" />
            <path d={svgPaths.p3615b2c0} fill="var(--fill-0, #CCCCCC)" id="Vector_2" />
            <g id="Group 563025">
              <path d={svgPaths.p113c6810} fill="var(--fill-0, white)" id="Vector_3" stroke="var(--stroke-0, #3D3935)" strokeMiterlimit="10" strokeWidth="1.75" />
              <g id="Vector_4">
                <path d={svgPaths.p32843ca8} fill="var(--fill-0, #CCCCCC)" />
                <path d={svgPaths.p32843ca8} stroke="var(--stroke-0, #6A6A6A)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.36293" />
              </g>
            </g>
            <path d={svgPaths.p3ba27000} fill="var(--fill-0, white)" id="Vector_5" stroke="var(--stroke-0, #3D3935)" strokeMiterlimit="10" strokeWidth="1.75" />
            <path d={svgPaths.p34459c00} fill="var(--fill-0, #CCCCCC)" id="Vector_6" stroke="var(--stroke-0, #6A6A6A)" strokeMiterlimit="10" strokeWidth="1.75" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[31px] left-1/2 overflow-clip top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[50px]">
      <TrimArea />
    </div>
  );
}

function MonoChomrNew() {
  return (
    <div className="relative rounded-[8.75px] shrink-0 size-[60px]" data-name="Mono chomr new">
      <Frame />
    </div>
  );
}

function AohsButton() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-between relative rounded-[10px] shrink-0 size-[60px]" data-name="AOHS button">
      <div aria-hidden="true" className="absolute border-0 border-[#00adef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <MonoChomrNew />
    </div>
  );
}

function ToolbarTextLabel() {
  return (
    <div className="content-stretch flex items-center relative rounded-[4px] shrink-0" data-name="Toolbar Text label">
      <AohsButton />
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

function Frame1() {
  return <div className="absolute left-1/2 size-[50px] top-1/2 translate-x-[-50%] translate-y-[-50%]" />;
}

function FeedbackNew({ isActive = false }: { isActive?: boolean }) {
  const strokeColor = isActive ? "#008EC2" : "#5E646E";
  const fillColor = isActive ? "#008EC2" : "#5E646E";
  
  return (
    <div className="relative shrink-0 size-[60px] flex items-center justify-center" data-name="Feedback new">
      <svg width="44" height="44" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M32.861 53H24.5715V28.7183H29.7507V10.2847H24.5715V6H30.4588C31.9723 6 33.4232 6.51317 34.4994 7.4382L38.9773 11.2873C40.0535 12.2062 40.6505 13.4594 40.6505 14.7603V33.0654" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M44 44V51.8235" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M44 55C48.9705 55 53 50.9705 53 46C53 41.0295 48.9705 37 44 37C39.0295 37 35 41.0295 35 46C35 50.9705 39.0295 55 44 55Z" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M44.0948 41.1897C44.6995 41.1897 45.1897 40.6995 45.1897 40.0948C45.1897 39.4902 44.6995 39 44.0948 39C43.4902 39 43 39.4902 43 40.0948C43 40.6995 43.4902 41.1897 44.0948 41.1897Z" 
          fill={fillColor}
        />
        <path 
          d="M25.2119 10.7351V27.7083L13.5531 34.8968C11.1369 36.3864 7 35.3324 7 33.2244V8.37029C7 6.35356 10.8293 5.26442 13.3137 6.56436L25.2119 10.7351Z" 
          stroke={strokeColor} 
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function AohsButton1() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-between relative rounded-[10px] shrink-0 size-[60px]" data-name="AOHS button">
      <div aria-hidden="true" className="absolute border-0 border-[#00adef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <FeedbackNew />
    </div>
  );
}

function ToolbarTextLabel1() {
  return (
    <div className="content-stretch flex items-center relative rounded-[4px] shrink-0" data-name="Toolbar Text label">
      <AohsButton1 />
    </div>
  );
}

function Icons() {
  return <div className="absolute left-0 size-[48px] top-0" data-name="Icons" />;
}

function Icons1() {
  return (
    <div className="absolute left-0 size-[48px] top-0" data-name="Icons">
      <Icons />
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute h-[32.2px] left-[calc(50%-0.18px)] top-[calc(50%+0.1px)] translate-x-[-50%] translate-y-[-50%] w-[43.636px]">
      <div className="absolute bottom-0 left-0 right-0 top-[-2.48%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 33">
          <g id="Frame 1618872990">
            <g id="trim area">
              <path d={svgPaths.p2b201d80} fill="var(--fill-0, #FFD6D6)" id="Vector" />
              <path d={svgPaths.p16a0d0e0} fill="var(--fill-0, white)" id="Vector_2" stroke="var(--stroke-0, #3D3935)" strokeMiterlimit="10" strokeWidth="1.4" />
            </g>
            <g id="Shape">
              <path d={svgPaths.pabd600} fill="var(--fill-0, #009ACE)" />
              <path clipRule="evenodd" d={svgPaths.p21b85980} fill="white" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p1ba64c70} fill="white" fillRule="evenodd" />
              <path d={svgPaths.p34f3c300} stroke="var(--stroke-0, white)" strokeLinejoin="round" strokeWidth="0.8" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function PrepQc() {
  return (
    <div className="absolute left-1/2 size-[48px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Prep Qc">
      <Icons1 />
      <Frame2 />
    </div>
  );
}

function PrepEditToTest({ isActive = false }: { isActive?: boolean }) {
  const strokeColor = isActive ? "#008EC2" : "#5E646E";
  
  return (
    <div className="relative shrink-0 size-[60px] flex items-center justify-center" data-name="Prep edit to test">
      <svg width="44" height="45" viewBox="0 0 60 61" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M25.5238 51C19.5289 50.971 14.1168 49.5938 6.70168 46.5318C6.28657 46.3603 6.03918 45.9312 6.09579 45.4857L10.6275 9.82312C10.9436 7.33696 13.0214 5.65522 15.2086 6.06017C25.126 7.89606 31.8458 8.06423 40.8708 6.22052C43.1241 5.76026 45.3022 7.48079 45.5983 10.0541L47 22.2335" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <path 
          d="M50.1007 31.8468L54 35.6905L40.766 48.7095L31.641 50.6509C30.9001 50.8085 30.2598 50.1172 30.4736 49.3905L32.9245 41.0614L46.1994 28L50.1007 31.8468Z" 
          stroke={strokeColor} 
          strokeWidth="2"
        />
        <path 
          d="M46.6653 27.6042C48.8028 25.4637 52.2653 25.4654 54.4004 27.6083C56.4675 29.6831 56.5311 33.0055 54.5918 35.1569L54.3973 35.3614L50.7487 39L43 31.2595L46.6642 27.6051L46.6653 27.6042Z" 
          stroke={strokeColor} 
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function AohsButton2() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-between relative rounded-[10px] shrink-0 size-[60px]" data-name="AOHS button">
      <div aria-hidden="true" className="absolute border-0 border-[#00adef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <PrepEditToTest />
    </div>
  );
}

function ToolbarTextLabel2() {
  return (
    <div className="content-stretch flex items-center relative rounded-[4px] shrink-0" data-name="Toolbar Text label">
      <AohsButton2 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center px-[8px] py-0 relative rounded-bl-[4px] rounded-tl-[4px] self-stretch shrink-0">
      <ToolbarTextLabel />
      <ToolbarTextLabel1 />
      <ToolbarTextLabel2 />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20.001px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M12.4991 10.0002H2.49878" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M14.1658 15.0002H2.49878" id="Vector_2" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M17.4992 4.99994H2.49878" id="Vector_3" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative rounded-[8px] shrink-0 w-[50px]" data-name="Button">
      <Icon />
    </div>
  );
}

function AohsButton3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-between relative rounded-[10px] size-[60px]" data-name="AOHS button">
      <div aria-hidden="true" className="absolute border-0 border-[#00adef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Button />
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[68px] items-center justify-center relative rounded-bl-[4px] rounded-br-[4px] w-[76px]">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-bl-[4px] rounded-br-[4px]" />
      <div className="flex items-center justify-center relative shrink-0 size-[60px]" style={{ "--transform-inner-width": "60", "--transform-inner-height": "60" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <AohsButton3 />
        </div>
      </div>
    </div>
  );
}

export default function Frame5() {
  return (
    <div className="content-stretch flex items-start relative rounded-bl-[4px] rounded-tl-[4px] size-full">
      <Frame4 />
      <div className="flex h-[76px] items-center justify-center relative shrink-0 w-[68px]" style={{ "--transform-inner-width": "76", "--transform-inner-height": "68" } as React.CSSProperties}>
        <div className="flex-none rotate-[270deg]">
          <Frame3 />
        </div>
      </div>
    </div>
  );
}