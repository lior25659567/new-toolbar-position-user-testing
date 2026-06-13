// Scale bar components
function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="bg-[#0066ff] h-[20px] relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-[rgba(112,112,112,0)] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame />
    </div>
  );
}

function Frame2() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
      <Frame1 />
    </div>
  );
}

function Item() {
  return (
    <div className="content-stretch flex h-[23px] items-center relative w-full" data-name="item">
      <Frame2 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[22px] items-start min-h-px min-w-px mr-[-1px] relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0 w-full">
        <div className="flex-none rotate-[180deg] w-full">
          <Item />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="bg-[#3fbaff] h-[20px] relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-[rgba(112,112,112,0)] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame3 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
      <Frame7 />
    </div>
  );
}

function Item1() {
  return (
    <div className="content-stretch flex h-[23px] items-center relative w-full" data-name="item">
      <Frame8 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px mr-[-1px] relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0 w-full">
        <div className="flex-none rotate-[180deg] w-full">
          <Item1 />
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="bg-[#2ce9c7] h-[20px] relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-[rgba(112,112,112,0)] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame9 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
      <Frame10 />
    </div>
  );
}

function Item2() {
  return (
    <div className="content-stretch flex h-[23px] items-center relative w-full" data-name="item">
      <Frame11 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="bg-[#54bf00] h-[20px] relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-[rgba(112,112,112,0)] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame12 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
      <Frame13 />
    </div>
  );
}

function Item3() {
  return (
    <div className="content-stretch flex h-[23px] items-center relative w-full" data-name="item">
      <Frame14 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="bg-[#ffd600] h-[20px] relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-[rgba(112,112,112,0)] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame15 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
      <Frame16 />
    </div>
  );
}

function Item4() {
  return (
    <div className="content-stretch flex h-[23px] items-center relative w-full" data-name="item">
      <Frame17 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="bg-[#f7771a] h-[20px] relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-[rgba(112,112,112,0)] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame18 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
      <Frame19 />
    </div>
  );
}

function Item5() {
  return (
    <div className="content-stretch flex h-[23px] items-center relative w-full" data-name="item">
      <Frame20 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="bg-[red] h-[20px] relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-[rgba(112,112,112,0)] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame21 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
      <Frame22 />
    </div>
  );
}

function Item6() {
  return (
    <div className="content-stretch flex h-[27px] items-center pb-0 pt-[4px] px-0 relative w-full" data-name="item">
      <Frame23 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="absolute bottom-[50.33%] content-stretch flex items-start left-0 pl-0 pr-px py-0 right-[22.08%] top-[13.97%]">
      <Frame5 />
      <Frame4 />
      <div className="basis-0 flex grow items-center justify-center min-h-px min-w-px mr-[-1px] relative shrink-0">
        <div className="flex-none rotate-[180deg] w-full">
          <Item2 />
        </div>
      </div>
      <div className="basis-0 flex grow items-center justify-center min-h-px min-w-px mr-[-1px] relative shrink-0">
        <div className="flex-none rotate-[180deg] w-full">
          <Item3 />
        </div>
      </div>
      <div className="basis-0 flex grow items-center justify-center min-h-px min-w-px mr-[-1px] relative shrink-0">
        <div className="flex-none rotate-[180deg] w-full">
          <Item4 />
        </div>
      </div>
      <div className="basis-0 flex grow items-center justify-center min-h-px min-w-px mr-[-1px] relative shrink-0">
        <div className="flex-none rotate-[180deg] w-full">
          <Item5 />
        </div>
      </div>
      <div className="basis-0 flex grow items-center justify-center min-h-px min-w-px mr-[-1px] relative shrink-0">
        <div className="flex-none rotate-[180deg] w-full">
          <Item6 />
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute bottom-0 content-stretch flex font-['Avenir:Roman',sans-serif] gap-[29px] items-center leading-[32px] left-0 not-italic right-[22.08%] text-[16px] text-black top-[49.67%]">
      <p className="relative shrink-0 text-nowrap whitespace-pre">2.3</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px] whitespace-pre-wrap"> </p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">2.1</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]"> </p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">1.9</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]"> </p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">1.7</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]"> </p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">1.5</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]"> </p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">1.3</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]"> </p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">1.1</p>
      <p className="h-[32px] relative shrink-0 text-right w-[53px]">0</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute bottom-0 contents left-0 right-[22.08%] top-[49.67%]">
      <Frame6 />
    </div>
  );
}

export default function Scale() {
  return (
    <div className="relative size-full" data-name="Scale">
      <Frame24 />
      <Group />
    </div>
  );
}
