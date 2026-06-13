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
      <div className="bg-[#0197ec] h-[20px] relative shrink-0 w-full">
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
      <div className="bg-[#3fbaff] h-[20px] relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-[rgba(112,112,112,0)] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="bg-[#3fbaff] content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame9 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="basis-0 bg-[#3fbaff] content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
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
      <div className="bg-[#0ff4fc] h-[20px] relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-[rgba(112,112,112,0)] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-[#0ff4fc] content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame12 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="basis-0 bg-[#0ff4fc] content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
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
      <div className="bg-[#2ce9c6] h-[20px] relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-[rgba(112,112,112,0)] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-[#2ce9c6] content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame15 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="basis-0 bg-[#2ce9c6] content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
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
      <div className="bg-[#54bf00] h-[20px] relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-[rgba(112,112,112,0)] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="bg-[#2ce9c6] content-stretch flex flex-col items-start relative shrink-0 w-full">
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
      <div className="bg-[#ffe500] h-[20px] relative shrink-0 w-full">
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
    <div className="content-stretch flex h-[23px] items-center relative w-full" data-name="item">
      <Frame23 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="bg-[#ffd600] h-[20px] relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-[rgba(112,112,112,0)] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame24 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
      <Frame25 />
    </div>
  );
}

function Item7() {
  return (
    <div className="content-stretch flex h-[23px] items-center relative w-full" data-name="item">
      <Frame26 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="bg-[#ffa008] h-[20px] relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-[rgba(112,112,112,0)] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame27 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
      <Frame28 />
    </div>
  );
}

function Item8() {
  return (
    <div className="content-stretch flex h-[23px] items-center relative w-full" data-name="item">
      <Frame29 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="bg-[#f7771a] h-[20px] relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-[rgba(112,112,112,0)] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame30 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
      <Frame31 />
    </div>
  );
}

function Item9() {
  return (
    <div className="content-stretch flex h-[23px] items-center relative w-full" data-name="item">
      <Frame32 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="bg-[red] h-[20px] relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-[rgba(112,112,112,0)] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame33 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
      <Frame34 />
    </div>
  );
}

function Item10() {
  return (
    <div className="content-stretch flex h-[27px] items-center pb-0 pt-[4px] px-0 relative w-full" data-name="item">
      <Frame35 />
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="bg-[#c61313] h-[20px] relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border border-[rgba(112,112,112,0)] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame36 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
      <Frame37 />
    </div>
  );
}

function Item11() {
  return (
    <div className="content-stretch flex h-[27px] items-center pb-0 pt-[4px] px-0 relative w-full" data-name="item">
      <Frame38 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-start pl-0 pr-px py-0 relative size-full">
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
      <div className="basis-0 flex grow items-center justify-center min-h-px min-w-px mr-[-1px] relative shrink-0">
        <div className="flex-none rotate-[180deg] w-full">
          <Item7 />
        </div>
      </div>
      <div className="basis-0 flex grow items-center justify-center min-h-px min-w-px mr-[-1px] relative shrink-0">
        <div className="flex-none rotate-[180deg] w-full">
          <Item8 />
        </div>
      </div>
      <div className="basis-0 flex grow items-center justify-center min-h-px min-w-px mr-[-1px] relative shrink-0">
        <div className="flex-none rotate-[180deg] w-full">
          <Item9 />
        </div>
      </div>
      <div className="basis-0 flex grow items-center justify-center min-h-px min-w-px mr-[-1px] relative shrink-0">
        <div className="flex-none rotate-[180deg] w-full">
          <Item10 />
        </div>
      </div>
      <div className="basis-0 flex grow items-center justify-center min-h-px min-w-px mr-[-1px] relative shrink-0">
        <div className="flex-none rotate-[180deg] w-full">
          <Item11 />
        </div>
      </div>
    </div>
  );
}

function Frame39() {
  return (
    <div className="absolute bottom-0 content-stretch flex font-['Avenir:Roman',sans-serif] items-center justify-between leading-[32px] left-0 not-italic right-[20.02%] text-[16px] text-black top-[52.94%]">
      <p className="h-[32.421px] relative shrink-0 w-[28px]">0.2</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">0.3</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">0.4</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">0.5</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">0.6</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">0.7</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">0.8</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">0.9</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">1.0</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">1.1</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">1.2</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">1.3</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">1.4</p>
      <p className="h-[32.421px] relative shrink-0 text-center w-[28px]">1.5</p>
      <p className="h-[32.421px] relative shrink-0 w-[28px]">1.6</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute bottom-0 contents left-0 right-[20.02%] top-[52.94%]">
      <Frame39 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-0">
      <div className="absolute bottom-[52.94%] flex items-center justify-center left-0 right-[20.91%] top-[13.24%]">
        <div className="flex-none h-[23px] rotate-[180deg] scale-y-[-100%] w-[802px]">
          <Frame6 />
        </div>
      </div>
      <Group />
    </div>
  );
}

export default function Scale() {
  return (
    <div className="relative size-full" data-name="Scale">
      <Group1 />
    </div>
  );
}
