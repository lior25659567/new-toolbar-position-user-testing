import { motion } from "motion/react";
import svgPaths from "./svg-4m16l2fjs5";
import NiriIonNew from "./NiriIonNew";
import OcculsgramNew from "./OcculsgramNew";
import MarginLineNew from "./MarginLineNew";
import PrepQcNew from "./PrepQcNew";
import TrimNew from "./TrimNew";

// Monochrome Icon - Two overlapping squares
function MonoChomrNew({ isActive = false }: { isActive?: boolean }) {
  const fillColor = isActive ? "#008EC2" : "#5E646E";
  const strokeColor = isActive ? "#008EC2" : "#5E646E";
  
  return (
    <div className="relative shrink-0 size-[60px] flex items-center justify-center" data-name="Mono chomr new">
      <svg width="44" height="44" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_monochrome_hviewtoolbar)">
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M49.3509 21.4961H41.0319V36.7473C41.0319 39.0444 39.1687 40.9076 36.8716 40.9076H21.6204V49.2267C21.6204 50.758 22.8624 52.0002 24.3939 52.0002H49.3509C50.8823 52.0002 52.1244 50.7596 52.1244 49.2267V24.2696C52.1244 22.7382 50.8823 21.4961 49.3509 21.4961Z" 
            fill={fillColor}
          />
          <path 
            d="M35.627 8H9.86313C8.28064 8 7 9.23644 7 10.7609V35.6046C7 37.1291 8.28064 38.3655 9.86313 38.3655H35.627C37.208 38.3655 38.4902 37.1291 38.4902 35.6046V10.7609C38.4902 9.23644 37.208 8 35.627 8Z" 
            stroke={strokeColor} 
            strokeWidth="1.5" 
            strokeMiterlimit="10"
          />
        </g>
        <defs>
          <clipPath id="clip0_monochrome_hviewtoolbar">
            <rect width="60" height="60" fill="white"/>
          </clipPath>
        </defs>
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
