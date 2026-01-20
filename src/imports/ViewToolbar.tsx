import { motion } from "framer-motion";
import { useState } from "react";
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
        <g clipPath="url(#clip0_monochrome_view)">
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
          <clipPath id="clip0_monochrome_view">
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

function ToolbarTextLabel({ isActive, onClick, isExpanded, microAnimations = true, buttonIndex }: { isActive: boolean; onClick: () => void; isExpanded?: boolean; microAnimations?: boolean; buttonIndex?: number }) {
  const [pressedButton, setPressedButton] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleTapStart = () => {
    if (buttonIndex !== undefined) {
      setPressedButton(buttonIndex);
    }
  };
  
  const handleTapEnd = () => {
    setTimeout(() => setPressedButton(null), 300);
  };

  return (
    <motion.div 
      className={`flex flex-row items-center ${isExpanded ? 'px-[8px]' : ''} py-0 gap-[4px] h-[60px] relative rounded-[8px] shrink-0 cursor-pointer self-stretch overflow-hidden transition-all duration-200`}
      style={{
        backgroundColor: isActive ? '#E0F2FE' : (isHovered ? '#f5f5f5' : 'transparent'),
        border: isActive ? '1px solid #009ACE' : (isHovered ? '1px solid #D1D5DB' : '1px solid transparent'),
      }}
      data-name="Toolbar Text label"
      onClick={onClick}
      onTapStart={handleTapStart}
      onTapEnd={handleTapEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ 
        scale: 0.9,
        transition: {
          type: "spring" as const,
          stiffness: 600,
          damping: 15
        }
      }}
      whileHover={{ scale: 1.02 }}
    >
      {pressedButton === buttonIndex && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 2.5, opacity: [0, 0.5, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%)',
            filter: 'blur(12px)',
          }}
        />
      )}
      <AohsButton isActive={isActive || isHovered} />
      {isExpanded && <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-nowrap text-center transition-all duration-200" style={{ color: (isActive || isHovered) ? '#008EC2' : '#000000' }}>Monochrome</p>}
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

function ToolbarTextLabel1({ isActive, onClick, isExpanded, buttonIndex }: { isActive: boolean; onClick: () => void; isExpanded?: boolean; buttonIndex?: number }) {
  const [pressedButton, setPressedButton] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleTapStart = () => {
    if (buttonIndex !== undefined) {
      setPressedButton(buttonIndex);
    }
  };
  
  const handleTapEnd = () => {
    setTimeout(() => setPressedButton(null), 300);
  };
  
  return (
    <motion.div 
      className={`flex flex-row items-center ${isExpanded ? 'px-[8px]' : ''} py-0 gap-[4px] h-[60px] relative rounded-[8px] shrink-0 cursor-pointer self-stretch overflow-hidden transition-all duration-200`}
      style={{
        backgroundColor: isActive ? '#E0F2FE' : (isHovered ? '#f5f5f5' : 'transparent'),
        border: isActive ? '1px solid #009ACE' : (isHovered ? '1px solid #D1D5DB' : '1px solid transparent'),
      }}
      data-name="Toolbar Text label"
      onClick={onClick}
      onTapStart={handleTapStart}
      onTapEnd={handleTapEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ 
        scale: 0.9,
        transition: {
          type: "spring" as const,
          stiffness: 600,
          damping: 15
        }
      }}
      whileHover={{ scale: 1.02 }}
    >
      {pressedButton === buttonIndex && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 2.5, opacity: [0, 0.5, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%)',
            filter: 'blur(12px)',
          }}
        />
      )}
      <AohsButton1 isActive={isActive || isHovered} />
      {isExpanded && <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-nowrap text-center transition-all duration-200" style={{ color: (isActive || isHovered) ? '#008EC2' : '#000000' }}>Review Tool</p>}
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

function ToolbarTextLabel2({ isActive, onClick, isExpanded, buttonIndex }: { isActive: boolean; onClick: () => void; isExpanded?: boolean; buttonIndex?: number }) {
  const [pressedButton, setPressedButton] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleTapStart = () => {
    if (buttonIndex !== undefined) {
      setPressedButton(buttonIndex);
    }
  };
  
  const handleTapEnd = () => {
    setTimeout(() => setPressedButton(null), 300);
  };
  
  return (
    <motion.div 
      className={`flex flex-row items-center ${isExpanded ? 'px-[8px]' : ''} py-0 gap-[4px] h-[60px] relative rounded-[8px] shrink-0 cursor-pointer self-stretch overflow-hidden transition-all duration-200`}
      style={{
        backgroundColor: isActive ? '#E0F2FE' : (isHovered ? '#f5f5f5' : 'transparent'),
        border: isActive ? '1px solid #009ACE' : (isHovered ? '1px solid #D1D5DB' : '1px solid transparent'),
      }}
      data-name="Toolbar Text label"
      onClick={onClick}
      onTapStart={handleTapStart}
      onTapEnd={handleTapEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ 
        scale: 0.9,
        transition: {
          type: "spring" as const,
          stiffness: 600,
          damping: 15
        }
      }}
      whileHover={{ scale: 1.02 }}
    >
      {pressedButton === buttonIndex && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 2.5, opacity: [0, 0.5, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%)',
            filter: 'blur(12px)',
          }}
        />
      )}
      <AohsButton2 isActive={isActive || isHovered} />
      {isExpanded && <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-nowrap text-center transition-all duration-200" style={{ color: (isActive || isHovered) ? '#008EC2' : '#000000' }}>Occulsgram</p>}
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

function ToolbarTextLabel3({ isActive, onClick, isExpanded, buttonIndex }: { isActive: boolean; onClick: () => void; isExpanded?: boolean; buttonIndex?: number }) {
  const [pressedButton, setPressedButton] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleTapStart = () => {
    if (buttonIndex !== undefined) {
      setPressedButton(buttonIndex);
    }
  };
  
  const handleTapEnd = () => {
    setTimeout(() => setPressedButton(null), 300);
  };
  
  return (
    <motion.div 
      className={`flex flex-row items-center ${isExpanded ? 'px-[8px]' : ''} py-0 gap-[4px] h-[60px] relative rounded-[8px] shrink-0 cursor-pointer self-stretch overflow-hidden transition-all duration-200`}
      style={{
        backgroundColor: isActive ? '#E0F2FE' : (isHovered ? '#f5f5f5' : 'transparent'),
        border: isActive ? '1px solid #009ACE' : (isHovered ? '1px solid #D1D5DB' : '1px solid transparent'),
      }}
      data-name="Toolbar Text label"
      onClick={onClick}
      onTapStart={handleTapStart}
      onTapEnd={handleTapEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ 
        scale: 0.9,
        transition: {
          type: "spring" as const,
          stiffness: 600,
          damping: 15
        }
      }}
      whileHover={{ scale: 1.02 }}
    >
      {pressedButton === buttonIndex && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 2.5, opacity: [0, 0.5, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%)',
            filter: 'blur(12px)',
          }}
        />
      )}
      <AohsButton3Margin isActive={isActive || isHovered} />
      {isExpanded && <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-nowrap text-center transition-all duration-200" style={{ color: (isActive || isHovered) ? '#008EC2' : '#000000' }}>Margin line</p>}
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

function ToolbarTextLabel4({ isActive, onClick, isExpanded, buttonIndex }: { isActive: boolean; onClick: () => void; isExpanded?: boolean; buttonIndex?: number }) {
  const [pressedButton, setPressedButton] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleTapStart = () => {
    if (buttonIndex !== undefined) {
      setPressedButton(buttonIndex);
    }
  };
  
  const handleTapEnd = () => {
    setTimeout(() => setPressedButton(null), 300);
  };
  
  return (
    <motion.div 
      className={`flex flex-row items-center ${isExpanded ? 'px-[8px]' : ''} py-0 gap-[4px] h-[60px] relative rounded-[8px] shrink-0 cursor-pointer self-stretch overflow-hidden transition-all duration-200`}
      style={{
        backgroundColor: isActive ? '#E0F2FE' : (isHovered ? '#f5f5f5' : 'transparent'),
        border: isActive ? '1px solid #009ACE' : (isHovered ? '1px solid #D1D5DB' : '1px solid transparent'),
      }}
      data-name="Toolbar Text label"
      onClick={onClick}
      onTapStart={handleTapStart}
      onTapEnd={handleTapEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ 
        scale: 0.9,
        transition: {
          type: "spring" as const,
          stiffness: 600,
          damping: 15
        }
      }}
      whileHover={{ scale: 1.02 }}
    >
      {pressedButton === buttonIndex && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 2.5, opacity: [0, 0.5, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%)',
            filter: 'blur(12px)',
          }}
        />
      )}
      <AohsButton4PrepQc isActive={isActive || isHovered} />
      {isExpanded && <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-nowrap text-center transition-all duration-200" style={{ color: (isActive || isHovered) ? '#008EC2' : '#000000' }}>Prep QC</p>}
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

function ToolbarTextLabel5({ isActive, onClick, isExpanded, buttonIndex }: { isActive: boolean; onClick: () => void; isExpanded?: boolean; buttonIndex?: number }) {
  const [pressedButton, setPressedButton] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleTapStart = () => {
    if (buttonIndex !== undefined) {
      setPressedButton(buttonIndex);
    }
  };
  
  const handleTapEnd = () => {
    setTimeout(() => setPressedButton(null), 300);
  };
  
  return (
    <motion.div 
      className={`flex flex-row items-center ${isExpanded ? 'px-[8px]' : ''} py-0 gap-[4px] h-[60px] relative rounded-[8px] shrink-0 cursor-pointer self-stretch overflow-hidden transition-all duration-200`}
      style={{
        backgroundColor: isActive ? '#E0F2FE' : (isHovered ? '#f5f5f5' : 'transparent'),
        border: isActive ? '1px solid #009ACE' : (isHovered ? '1px solid #D1D5DB' : '1px solid transparent'),
      }}
      data-name="Toolbar Text label"
      onClick={onClick}
      onTapStart={handleTapStart}
      onTapEnd={handleTapEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ 
        scale: 0.9,
        transition: {
          type: "spring" as const,
          stiffness: 600,
          damping: 15
        }
      }}
      whileHover={{ scale: 1.02 }}
    >
      {pressedButton === buttonIndex && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 2.5, opacity: [0, 0.5, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%)',
            filter: 'blur(12px)',
          }}
        />
      )}
      <AohsButton5Trim isActive={isActive || isHovered} />
      {isExpanded && <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-nowrap text-center transition-all duration-200" style={{ color: (isActive || isHovered) ? '#008EC2' : '#000000' }}>Trim</p>}
    </motion.div>
  );
}

function Frame5({ activeButtons, onButtonClick, microAnimations }: { activeButtons: Set<number>; onButtonClick: (index: number) => void; microAnimations?: boolean }) {
  const isExpanded = activeButtons.has(6);
  return (
    <div className="box-border content-stretch flex flex-col gap-[8px] items-stretch p-[8px] relative shrink-0 w-full">
      <ToolbarTextLabel isActive={activeButtons.has(0)} onClick={() => onButtonClick(0)} isExpanded={isExpanded} buttonIndex={0} microAnimations={microAnimations} />
      <ToolbarTextLabel1 isActive={activeButtons.has(1)} onClick={() => onButtonClick(1)} isExpanded={isExpanded} buttonIndex={1} />
      <ToolbarTextLabel2 isActive={activeButtons.has(2)} onClick={() => onButtonClick(2)} isExpanded={isExpanded} buttonIndex={2} />
      <ToolbarTextLabel3 isActive={activeButtons.has(3)} onClick={() => onButtonClick(3)} isExpanded={isExpanded} buttonIndex={3} />
      <ToolbarTextLabel4 isActive={activeButtons.has(4)} onClick={() => onButtonClick(4)} isExpanded={isExpanded} buttonIndex={4} />
      <ToolbarTextLabel5 isActive={activeButtons.has(5)} onClick={() => onButtonClick(5)} isExpanded={isExpanded} buttonIndex={5} />
    </div>
  );
}

function ChevronIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="ChevronIcon">
      <svg 
        className="block size-full transition-transform duration-300" 
        fill="none" 
        viewBox="0 0 24 24"
        style={{ transform: isExpanded ? 'rotate(-90deg)' : 'rotate(90deg)' }}
      >
        <path 
          d="M6 9L12 15L18 9" 
          stroke="#717182" 
          strokeWidth="1" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Button({ isExpanded, onClick }: { isExpanded?: boolean; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200" 
      data-name="Button"
      style={{ 
        border: `1px solid ${isHovered ? '#009ACE' : '#E5E7EB'}`,
        backgroundColor: isHovered ? '#f0f9ff' : 'transparent',
        width: '60px',
        height: '60px',
        minWidth: '60px',
        minHeight: '60px'
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
    >
      <ChevronIcon isExpanded={!!isExpanded} />
    </motion.div>
  );
}

function Frame4({ onButtonClick, activeButtons }: { onButtonClick: (index: number) => void; activeButtons: Set<number> }) {
  const isExpanded = activeButtons.has(6);
  return (
    <div className="box-border flex flex-col items-start px-[8px] pb-[8px] pt-0 gap-[8px] w-full relative shrink-0">
      <Button isExpanded={isExpanded} onClick={() => onButtonClick(6)} />
    </div>
  );
}

function Frame6({ activeButtons, onButtonClick, microAnimations = true }: { activeButtons: Set<number>; onButtonClick: (index: number) => void; microAnimations?: boolean }) {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-stretch relative shrink-0 w-full">
      <Frame5 activeButtons={activeButtons} onButtonClick={onButtonClick} microAnimations={microAnimations} />
      <Frame4 onButtonClick={onButtonClick} activeButtons={activeButtons} />
    </div>
  );
}

export default function ViewToolbar({ activeButtons, onButtonClick, microAnimations = true }: { activeButtons: Set<number>; onButtonClick: (index: number) => void; microAnimations?: boolean }) {
  return (
    <div 
      className="bg-white box-border content-stretch flex flex-col gap-[8px] items-center justify-center px-0 py-[8px] relative rounded-[12px] w-full" 
      data-name="Toolbar"
    >
      <Frame6 activeButtons={activeButtons} onButtonClick={onButtonClick} microAnimations={microAnimations} />
    </div>
  );
}