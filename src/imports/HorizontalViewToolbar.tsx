import { motion } from "motion/react";
import svgPaths from "./svg-4m16l2fjs5";
import NiriIonNew from "./NiriIonNew";
import OcculsgramNew from "./OcculsgramNew";
import MarginLineNew from "./MarginLineNew";
import PrepQcNew from "./PrepQcNew";
import TrimNew from "./TrimNew";

// Monochrome Icon - Two overlapping squares
function MonoChomrNew({ isActive = false }: { isActive?: boolean }) {
  const strokeColor = isActive ? "#008EC2" : "var(--ads-icon-secondary)";
  
  return (
    <div className="relative shrink-0 size-[60px] flex items-center justify-center" data-name="Mono chomr new">
      <svg width="28" height="28" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "scaleX(-1)" }}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.0195 19.5642C14.3393 19.5581 14.6617 19.6685 14.9202 19.9137C15.3753 20.3454 15.5613 21.0818 15.7275 21.7399C15.7749 21.9277 15.8207 22.1091 15.8707 22.2752C15.9286 22.4674 15.9854 22.6605 16.0423 22.854C16.3032 23.7408 16.5663 24.6348 16.9394 25.4775C17.268 26.2398 17.6645 26.9922 18.4879 27.3212C19.1912 27.6022 20.1004 27.577 20.795 27.2898C22.194 26.7112 22.6012 24.8208 22.8867 23.4949C22.891 23.475 22.8953 23.4553 22.8995 23.4356C23.0469 22.7596 23.1806 22.0808 23.3005 21.3997C23.569 19.9139 23.8665 18.3721 24.2465 16.9097C24.3925 16.3476 24.6108 15.6776 24.897 15.1713C24.9718 15.0391 25.0993 14.8591 25.215 14.6956C25.2692 14.619 25.3208 14.5461 25.3633 14.4834C25.5892 14.1466 25.801 13.8007 25.998 13.4467C26.999 11.6558 27.6719 9.55645 27.4896 7.49434C27.2442 4.7179 25.3904 2.03785 22.7349 0.988956C21.2507 0.410277 19.5954 0.424765 18.1218 1.02931C17.5762 1.25923 17.1028 1.55514 16.6195 1.88298C16.5295 1.94402 16.4401 2.00587 16.3509 2.06755C15.6114 2.57878 14.8895 3.07794 14.0195 3.00473V19.5642Z"
          stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke"
        />
        <path
          d="M7.74676 0.520183C9.30124 0.494537 10.5476 1.02133 11.7865 1.9013C12.273 2.24687 12.7962 2.61325 13.3465 2.83811C13.5814 2.93407 13.8047 2.98687 14.0191 3.00492V19.5644C13.5702 19.573 13.1267 19.8113 12.8728 20.2288C12.5849 20.7022 12.4652 21.1953 12.3384 21.7172C12.3188 21.7982 12.2989 21.8799 12.2782 21.9623C12.1285 22.5574 11.9734 23.151 11.8129 23.7433C11.8046 23.7741 11.7963 23.8049 11.7881 23.8357C11.6109 24.4967 11.4286 25.1766 11.1448 25.7996C11.0016 26.1138 10.8221 26.4203 10.5874 26.6776C10.1804 27.1238 9.63158 27.3895 9.02092 27.4178C8.40788 27.4462 7.81189 27.2114 7.36289 26.8053C6.12262 25.6834 5.29091 22.3209 4.59153 19.4934C4.26372 18.1681 3.96497 16.9603 3.66686 16.1559C3.54006 15.8137 3.39999 15.4672 3.21011 15.1536C3.08246 14.9428 2.93011 14.7315 2.77688 14.5189C2.64368 14.3342 2.50982 14.1485 2.39095 13.9615C1.35233 12.3272 0.606692 10.4367 0.526193 8.49554C0.435542 6.38672 1.20992 4.33052 2.67522 2.78922C4.07708 1.30011 5.6977 0.594601 7.74676 0.520183Z"
          fill={strokeColor}
          stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function AohsButton({ isActive }: { isActive?: boolean }) {
  return (
    <div className="content-stretch flex flex-col items-center justify-between relative rounded-[10px] shrink-0 size-[60px]" data-name="AOHS button">
      <div aria-hidden="true" className="absolute border-0 border-[#00adef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <MonoChomrNew isActive={isActive} />
    </div>
  );
}

function ToolbarTextLabel({ isActive, onClick, isExpanded }: { isActive: boolean; onClick: () => void; isExpanded?: boolean }) {
  return (
    <motion.div 
      className={`${isActive ? 'bg-[#E0F2FE]' : ''} flex ${isExpanded ? 'flex-col' : 'flex-row'} items-center ${isExpanded ? 'py-[8px]' : ''} px-0 gap-[4px] ${isExpanded ? 'w-[60px]' : 'h-[60px]'} relative rounded-[8px] shrink-0 cursor-pointer`} 
      data-name="Toolbar Text label"
      onClick={onClick}
      animate={{
        scale: isActive ? 1.08 : 1,
      }}
      whileTap={{ scale: 0.92 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 10
      }}
    >
      <AohsButton isActive={isActive} />
      {isExpanded && <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-black text-nowrap text-center -rotate-90 origin-center">Monochrome</p>}
    </motion.div>
  );
}

function AohsButton1({ isActive }: { isActive?: boolean }) {
  return (
    <div className="content-stretch flex flex-col items-center justify-between relative rounded-[10px] shrink-0 size-[60px]" data-name="AOHS button">
      <div aria-hidden="true" className="absolute border-0 border-[#00adef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <NiriIonNew isActive={isActive} />
    </div>
  );
}

function ToolbarTextLabel1({ isActive, onClick, isExpanded }: { isActive: boolean; onClick: () => void; isExpanded?: boolean }) {
  return (
    <motion.div 
      className={`${isActive ? 'bg-[#E0F2FE]' : ''} flex ${isExpanded ? 'flex-col' : 'flex-row'} items-center ${isExpanded ? 'py-[8px]' : ''} px-0 gap-[4px] ${isExpanded ? 'w-[60px]' : 'h-[60px]'} relative rounded-[8px] shrink-0 cursor-pointer`} 
      data-name="Toolbar Text label"
      onClick={onClick}
      animate={{
        scale: isActive ? 1.08 : 1,
      }}
      whileTap={{ scale: 0.92 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 10
      }}
    >
      <AohsButton1 isActive={isActive} />
      {isExpanded && <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-black text-nowrap text-center -rotate-90 origin-center">Review Tool</p>}
    </motion.div>
  );
}

function AohsButton2({ isActive }: { isActive?: boolean }) {
  return (
    <div className="content-stretch flex flex-col items-center justify-between relative rounded-[10px] shrink-0 size-[60px]" data-name="AOHS button">
      <div aria-hidden="true" className="absolute border-0 border-[#00adef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <OcculsgramNew isActive={isActive} />
    </div>
  );
}

function ToolbarTextLabel2({ isActive, onClick, isExpanded }: { isActive: boolean; onClick: () => void; isExpanded?: boolean }) {
  return (
    <motion.div 
      className={`${isActive ? 'bg-[#E0F2FE]' : ''} flex ${isExpanded ? 'flex-col' : 'flex-row'} items-center ${isExpanded ? 'py-[8px]' : ''} px-0 gap-[4px] ${isExpanded ? 'w-[60px]' : 'h-[60px]'} relative rounded-[8px] shrink-0 cursor-pointer`} 
      data-name="Toolbar Text label"
      onClick={onClick}
      animate={{
        scale: isActive ? 1.08 : 1,
      }}
      whileTap={{ scale: 0.92 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 10
      }}
    >
      <AohsButton2 isActive={isActive} />
      {isExpanded && <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-black text-nowrap text-center -rotate-90 origin-center">Occulsgram</p>}
    </motion.div>
  );
}

function AohsButton3Margin({ isActive }: { isActive?: boolean }) {
  return (
    <div className="content-stretch flex flex-col items-center justify-between relative rounded-[10px] shrink-0 size-[60px]" data-name="AOHS button">
      <div aria-hidden="true" className="absolute border-0 border-[#00adef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <MarginLineNew isActive={isActive} />
    </div>
  );
}

function ToolbarTextLabel3({ isActive, onClick, isExpanded }: { isActive: boolean; onClick: () => void; isExpanded?: boolean }) {
  return (
    <motion.div 
      className={`${isActive ? 'bg-[#E0F2FE]' : ''} flex ${isExpanded ? 'flex-col' : 'flex-row'} items-center ${isExpanded ? 'py-[8px]' : ''} px-0 gap-[4px] ${isExpanded ? 'w-[60px]' : 'h-[60px]'} relative rounded-[8px] shrink-0 cursor-pointer`} 
      data-name="Toolbar Text label"
      onClick={onClick}
      animate={{
        scale: isActive ? 1.08 : 1,
      }}
      whileTap={{ scale: 0.92 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 10
      }}
    >
      <AohsButton3Margin isActive={isActive} />
      {isExpanded && <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-black text-nowrap text-center -rotate-90 origin-center">Margin line</p>}
    </motion.div>
  );
}

function AohsButton4PrepQc({ isActive }: { isActive?: boolean }) {
  return (
    <div className="content-stretch flex flex-col items-center justify-between relative rounded-[10px] shrink-0 size-[60px]" data-name="AOHS button">
      <div aria-hidden="true" className="absolute border-0 border-[#00adef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <PrepQcNew isActive={isActive} />
    </div>
  );
}

function ToolbarTextLabel4({ isActive, onClick, isExpanded }: { isActive: boolean; onClick: () => void; isExpanded?: boolean }) {
  return (
    <motion.div 
      className={`${isActive ? 'bg-[#E0F2FE]' : ''} flex ${isExpanded ? 'flex-col' : 'flex-row'} items-center ${isExpanded ? 'py-[8px]' : ''} px-0 gap-[4px] ${isExpanded ? 'w-[60px]' : 'h-[60px]'} relative rounded-[8px] shrink-0 cursor-pointer`} 
      data-name="Toolbar Text label"
      onClick={onClick}
      animate={{
        scale: isActive ? 1.08 : 1,
      }}
      whileTap={{ scale: 0.92 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 10
      }}
    >
      <AohsButton4PrepQc isActive={isActive} />
      {isExpanded && <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-black text-nowrap text-center -rotate-90 origin-center">Prep QC</p>}
    </motion.div>
  );
}

function AohsButton5Trim({ isActive }: { isActive?: boolean }) {
  return (
    <div className="content-stretch flex flex-col items-center justify-between relative rounded-[10px] shrink-0 size-[60px]" data-name="AOHS button">
      <div aria-hidden="true" className="absolute border-0 border-[#00adef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <TrimNew isActive={isActive} />
    </div>
  );
}

function ToolbarTextLabel5({ isActive, onClick, isExpanded }: { isActive: boolean; onClick: () => void; isExpanded?: boolean }) {
  return (
    <motion.div 
      className={`${isActive ? 'bg-[#E0F2FE]' : ''} flex ${isExpanded ? 'flex-col' : 'flex-row'} items-center ${isExpanded ? 'py-[8px]' : ''} px-0 gap-[4px] ${isExpanded ? 'w-[60px]' : 'h-[60px]'} relative rounded-[8px] shrink-0 cursor-pointer`} 
      data-name="Toolbar Text label"
      onClick={onClick}
      animate={{
        scale: isActive ? 1.08 : 1,
      }}
      whileTap={{ scale: 0.92 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 10
      }}
    >
      <AohsButton5Trim isActive={isActive} />
      {isExpanded && <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-black text-nowrap text-center -rotate-90 origin-center">Trim</p>}
    </motion.div>
  );
}

function Frame5({ activeButtons, onButtonClick }: { activeButtons: Set<number>; onButtonClick: (index: number) => void }) {
  const isExpanded = activeButtons.has(6);
  return (
    <div className="box-border content-stretch flex flex-row gap-[8px] items-stretch p-[8px] relative shrink-0 h-full">
      <ToolbarTextLabel isActive={activeButtons.has(0)} onClick={() => onButtonClick(0)} isExpanded={isExpanded} />
      <ToolbarTextLabel1 isActive={activeButtons.has(1)} onClick={() => onButtonClick(1)} isExpanded={isExpanded} />
      <ToolbarTextLabel2 isActive={activeButtons.has(2)} onClick={() => onButtonClick(2)} isExpanded={isExpanded} />
      <ToolbarTextLabel3 isActive={activeButtons.has(3)} onClick={() => onButtonClick(3)} isExpanded={isExpanded} />
      <ToolbarTextLabel4 isActive={activeButtons.has(4)} onClick={() => onButtonClick(4)} isExpanded={isExpanded} />
      <ToolbarTextLabel5 isActive={activeButtons.has(5)} onClick={() => onButtonClick(5)} isExpanded={isExpanded} />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20.001px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M12.4991 10.0002H2.49878" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66672" />
          <path d="M14.1658 15.0002H2.49878" id="Vector_2" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66672" />
          <path d="M17.4992 4.99994H2.49878" id="Vector_3" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66672" />
        </g>
      </svg>
    </div>
  );
}

function Button({ isExpanded }: { isExpanded?: boolean }) {
  return (
    <div className={`content-stretch flex w-[40px] items-center ${isExpanded ? 'justify-start pt-[8px]' : 'justify-center'} relative rounded-[8px] shrink-0 h-[50px]`} data-name="Button">
      <Icon />
    </div>
  );
}

function AohsButton3({ onClick, isExpanded }: { onClick: () => void; isExpanded?: boolean }) {
  return (
    <div 
      className={`content-stretch flex flex-row w-[60px] ${isExpanded ? 'items-start' : 'items-center'} justify-center relative rounded-[10px] shrink-0 self-stretch cursor-pointer`}
      data-name="AOHS button"
      onClick={onClick}
    >
      <div aria-hidden="true" className="absolute border-0 border-[#00adef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Button isExpanded={isExpanded} />
    </div>
  );
}

function Frame4({ onButtonClick, activeButtons }: { onButtonClick: (index: number) => void; activeButtons: Set<number> }) {
  return (
    <div className="box-border flex flex-row items-center py-[8px] pl-0 pr-[8px] gap-[8px] h-full border-l border-[rgba(0,0,0,0.1)] rounded-tr-[12px] rounded-br-[12px] relative shrink-0">
      <AohsButton3 onClick={() => onButtonClick(6)} isExpanded={activeButtons.has(6)} />
    </div>
  );
}

function Frame6({ activeButtons, onButtonClick }: { activeButtons: Set<number>; onButtonClick: (index: number) => void }) {
  return (
    <div className="content-stretch flex flex-row gap-[8px] items-center relative shrink-0 h-full">
      <Frame5 activeButtons={activeButtons} onButtonClick={onButtonClick} />
      <Frame4 onButtonClick={onButtonClick} activeButtons={activeButtons} />
    </div>
  );
}

export default function HorizontalViewToolbar({ activeButtons, onButtonClick }: { activeButtons: Set<number>; onButtonClick: (index: number) => void }) {
  return (
    <div className="bg-white box-border content-stretch flex flex-row gap-[8px] items-center justify-center py-0 px-[8px] relative rounded-[4px] h-full" data-name="Toolbar">
      <Frame6 activeButtons={activeButtons} onButtonClick={onButtonClick} />
    </div>
  );
}
