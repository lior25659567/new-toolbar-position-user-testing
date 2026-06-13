import svgPaths from "./svg-0s7zyu5rh9";

function Container() {
  return <div className="absolute left-0 rounded-[10px] size-[60px] top-0" data-name="Container" />;
}

function Vector() {
  return (
    <div className="absolute contents inset-[2.9%_34.32%_50.73%_50.1%]" data-name="Vector_4">
      <div className="absolute inset-[2.9%_34.32%_50.73%_50.1%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 14">
          <path d={svgPaths.p2ead5580} fill="var(--fill-0, #CCCCCC)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[2.9%_34.32%_50.73%_50.1%]" data-name="Vector">
        <div className="absolute inset-[-4.96%_-6.65%_-4.96%_-6.64%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 15">
            <path d={svgPaths.p5695f80} id="Vector" stroke="var(--stroke-0, #6A6A6A)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.34474" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[2.9%_34.32%_50.71%_34.53%]">
      <div className="absolute inset-[2.92%_34.32%_50.71%_34.53%]" data-name="Vector_3">
        <div className="absolute inset-[-6.37%_-4.27%_-6.38%_-4.27%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 16">
            <path d={svgPaths.p178e6500} fill="var(--fill-0, white)" id="Vector_3" stroke="var(--stroke-0, #3D3935)" strokeMiterlimit="10" strokeWidth="1.72665" />
          </svg>
        </div>
      </div>
      <Vector />
    </div>
  );
}

function TrimArea() {
  return (
    <div className="absolute contents inset-[2.9%_1.35%_2.61%_1.35%]" data-name="trim area">
      <div className="absolute inset-[30.72%_47.88%_2.61%_12.12%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 20">
          <path d={svgPaths.p21f1c340} fill="var(--fill-0, #FFD6D6)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[27.39%_10.96%_2.61%_50.58%]" data-name="Vector_2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 21">
          <path d={svgPaths.p3b10a4c0} fill="var(--fill-0, #CCCCCC)" id="Vector_2" />
        </svg>
      </div>
      <Group />
      <div className="absolute inset-[4.05%_67.5%_49.58%_1.35%]" data-name="Vector_5">
        <div className="absolute inset-[-6.37%_-4.27%_-6.38%_-4.27%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 16">
            <path d={svgPaths.p3934a3f0} fill="var(--fill-0, white)" id="Vector_5" stroke="var(--stroke-0, #3D3935)" strokeMiterlimit="10" strokeWidth="1.72665" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[4.05%_1.35%_49.58%_67.5%]" data-name="Vector_6">
        <div className="absolute inset-[-6.37%_-4.27%_-6.38%_-4.27%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 16">
            <path d={svgPaths.p11376600} fill="var(--fill-0, #CCCCCC)" id="Vector_6" stroke="var(--stroke-0, #6A6A6A)" strokeMiterlimit="10" strokeWidth="1.72665" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[29.219px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <TrimArea />
    </div>
  );
}

function TrimArea3() {
  return (
    <div className="content-stretch flex flex-col h-[29.219px] items-start relative shrink-0 w-full" data-name="TrimArea3">
      <Icon />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col h-[31px] items-start overflow-clip pb-0 pt-[1.781px] relative shrink-0 w-full" data-name="Container">
      <TrimArea3 />
    </div>
  );
}

function MonoChomrNew() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pb-0 pt-[15px] px-[5px] rounded-[8.75px] size-[60px] top-0" data-name="MonoChomrNew3">
      <Container1 />
    </div>
  );
}

function ExpandedToolbar() {
  return (
    <div className="absolute left-[8px] rounded-[10px] size-[60px] top-0" data-name="ExpandedToolbar">
      <Container />
      <MonoChomrNew />
    </div>
  );
}

function ExpandedToolbar1() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[72px] top-[20px] w-[98.031px]" data-name="ExpandedToolbar">
      <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-black text-nowrap text-center">Monochrome</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[60px] relative rounded-[4px] shrink-0 w-[178.016px]" data-name="Container">
      <ExpandedToolbar />
      <ExpandedToolbar1 />
    </div>
  );
}

function Container3() {
  return <div className="absolute left-0 rounded-[10px] size-[64.8px] top-0" data-name="Container" />;
}

function TrimArea1() {
  return (
    <div className="absolute bottom-[2.36%] contents left-0 right-0 top-[2.52%]" data-name="trim area">
      <div className="absolute bottom-[2.36%] left-0 right-0 top-[46.42%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 55 23">
          <path d={svgPaths.p2f3fad00} fill="var(--fill-0, #FFD6D6)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[2.52%_12%_29.19%_12%]" data-name="Vector_2">
        <div className="absolute inset-[-3.73%_-2.68%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 32">
            <path d={svgPaths.p37bdeff0} fill="var(--fill-0, white)" id="Vector_2" stroke="var(--stroke-0, #3D3935)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2039" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.71%_2.7%_7.07%_55.3%]" data-name="Vector_3">
        <div className="absolute inset-[-4.97%_-4.86%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 25">
            <path d={svgPaths.p21689500} fill="var(--fill-0, #008EC2)" id="Vector_3" stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="2.2039" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[43.251px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <TrimArea1 />
    </div>
  );
}

function TrimArea4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[43.251px] items-start left-[5.38px] top-[10.75px] w-[54.034px]" data-name="TrimArea13">
      <Icon1 />
    </div>
  );
}

function ExpandedToolbar2() {
  return (
    <div className="absolute left-[8.64px] rounded-[10px] size-[64.8px] top-0" data-name="ExpandedToolbar">
      <Container3 />
      <TrimArea4 />
    </div>
  );
}

function ExpandedToolbar3() {
  return (
    <div className="absolute content-stretch flex h-[21.6px] items-start left-[77.76px] top-[21.6px] w-[90.838px]" data-name="ExpandedToolbar">
      <p className="basis-0 font-['Roboto'] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-black text-center">Scan assist</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[#dff5fc] h-[64.8px] relative rounded-[4px] shrink-0 w-[177.221px]" data-name="Container">
      <ExpandedToolbar2 />
      <ExpandedToolbar3 />
    </div>
  );
}

function Container5() {
  return <div className="absolute left-0 rounded-[10px] size-[64.8px] top-0" data-name="Container" />;
}

function TrimArea2() {
  return (
    <div className="absolute bottom-0 contents left-0 right-[1.96%] top-[2.5%]" data-name="trim area">
      <div className="absolute bottom-0 left-0 right-[1.96%] top-[52.5%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54 21">
          <path d={svgPaths.p29691800} fill="var(--fill-0, #FFD6D6)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[2.5%_19.7%_27.73%_20.57%]" data-name="Vector_2">
        <div className="absolute inset-[-3.14%_-2.87%_-3.14%_-3.08%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 33">
            <path d={svgPaths.p3b1a4500} fill="var(--fill-0, white)" id="Vector_2" stroke="var(--stroke-0, #3D3935)" strokeMiterlimit="10" strokeWidth="1.88934" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Shape() {
  return (
    <div className="absolute bottom-[36.25%] contents left-1/2 right-[0.98%] top-[1.25%]" data-name="Shape">
      <div className="absolute inset-[2.5%_1.96%_37.5%_50.98%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
          <path d={svgPaths.p2c375800} fill="var(--fill-0, #009ACE)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[13.56%_10.64%_42.43%_54.85%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
          <path clipRule="evenodd" d={svgPaths.p166c700} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[6.79%_5.32%_80.71%_84.87%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
          <path clipRule="evenodd" d={svgPaths.p1b65bf00} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
      <div className="absolute bottom-[36.25%] left-1/2 right-[0.98%] top-[1.25%]" data-name="Vector">
        <div className="absolute inset-[-2%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 29">
            <path d={svgPaths.p3451aa80} id="Vector" stroke="var(--stroke-0, white)" strokeLinejoin="round" strokeWidth="1.07962" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bottom-0 contents left-0 right-[0.98%] top-[1.25%]">
      <TrimArea2 />
      <Shape />
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[43.183px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Frame1 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col h-[43.183px] items-start left-[5.42px] top-[10.82px] w-[55.063px]" data-name="Frame73">
      <Icon2 />
    </div>
  );
}

function ExpandedToolbar4() {
  return (
    <div className="absolute left-[8.64px] rounded-[10px] size-[64.8px] top-0" data-name="ExpandedToolbar">
      <Container5 />
      <Frame />
    </div>
  );
}

function ExpandedToolbar5() {
  return (
    <div className="absolute content-stretch flex h-[21.6px] items-start left-[77.76px] top-[21.6px] w-[72.276px]" data-name="ExpandedToolbar">
      <p className="basis-0 font-['Roboto'] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-black text-center">Prep edit</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[#dff5fc] h-[64.8px] relative rounded-[4px] shrink-0 w-[158.676px]" data-name="Container">
      <ExpandedToolbar4 />
      <ExpandedToolbar5 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <Container2 />
      <Container4 />
      <Container6 />
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start px-[8px] py-[6px] relative rounded-bl-[4px] rounded-tl-[4px] shrink-0" data-name="Container">
      <Frame2 />
    </div>
  );
}

function Container8() {
  return <div className="absolute border-[0px_0px_0px_1px] border-[rgba(0,0,0,0.1)] border-solid h-[76px] left-0 rounded-br-[4px] rounded-tr-[4px] top-0 w-[60px]" data-name="Container" />;
}

function Icon3() {
  return (
    <div className="absolute bottom-1/4 contents left-[12.49%] right-[12.5%] top-1/4" data-name="Icon">
      <div className="absolute bottom-1/2 left-[12.49%] right-[37.5%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.83px_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 2">
            <path d="M10.8337 0.83336H0.83336" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66672" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/4 left-[12.49%] right-[29.17%] top-3/4" data-name="Vector_2">
        <div className="absolute inset-[-0.83px_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 2">
            <path d="M12.5004 0.83336H0.83336" id="Vector_2" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66672" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[12.49%] right-[12.5%] top-1/4" data-name="Vector_3">
        <div className="absolute inset-[-0.83px_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 2">
            <path d="M15.8338 0.83336H0.83336" id="Vector_3" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66672" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Icon3 />
    </div>
  );
}

function ExpandIcon() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[8px] size-[20px] top-[15px]" data-name="ExpandIcon">
      <Icon4 />
    </div>
  );
}

function ExpandButton() {
  return (
    <div className="absolute h-[50px] left-[10px] rounded-[8px] top-[13px] w-[40px]" data-name="ExpandButton">
      <ExpandIcon />
    </div>
  );
}

function Container9() {
  return <div className="absolute left-0 rounded-[10px] size-[60px] top-0" data-name="Container" />;
}

function Container10() {
  return (
    <div className="bg-white h-[76px] relative rounded-br-[4px] rounded-tr-[4px] shrink-0 w-[60px]" data-name="Container">
      <Container8 />
      <ExpandButton />
      <Container9 />
    </div>
  );
}

function ExpandedToolbar6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="ExpandedToolbar">
      <Container10 />
    </div>
  );
}

export default function Frame3() {
  return (
    <div className="content-stretch flex items-center relative size-full">
      <Container7 />
      <ExpandedToolbar6 />
    </div>
  );
}