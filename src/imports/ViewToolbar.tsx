import { motion } from "framer-motion";
import { useState } from "react";
import { SecondaryButton } from "../design-system";
import svgPaths from "./svg-4m16l2fjs5";
import NiriIonNew from "./NiriIonNew";
import OcculsgramNew from "./OcculsgramNew";
import MarginLineNew from "./MarginLineNew";
import PrepQcNew from "./PrepQcNew";
import TrimNew from "./TrimNew";

// Monochrome Icon - Two overlapping squares
function MonoChomrNew({ isActive = false }: { isActive?: boolean }) {
  const fillColor = isActive ? "var(--ads-background-interactive-hover)" : "var(--ads-text-secondary)";
  const strokeColor = isActive ? "var(--ads-background-interactive-hover)" : "var(--ads-text-secondary)";
  
  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Mono chomr new">
      <svg width="28" height="28" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <div className="content-stretch flex flex-col items-center justify-between relative rounded-[8px] shrink-0 size-[40px]" data-name="AOHS button">
      <div aria-hidden="true" className="absolute border-0 border-[var(--ads-background-interactive)] border-solid inset-0 pointer-events-none rounded-[8px]" />
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
      className={`flex flex-row items-center ${isExpanded ? 'px-[8px]' : ''} py-0 gap-[4px] h-[40px] relative rounded-[8px] shrink-0 cursor-pointer self-stretch overflow-hidden transition-all duration-200`}
      style={{
        backgroundColor: isActive ? 'var(--ads-background-highlight-blue)' : (isHovered ? 'var(--ads-background-subtle-02)' : 'transparent'),
        border: isActive ? '1px solid var(--ads-background-interactive)' : (isHovered ? '1px solid var(--ads-border-accent)' : '1px solid transparent'),
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
      <AohsButton isActive={isActive} />
      {isExpanded && <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-nowrap text-center transition-all duration-200" style={{ color: (isActive) ? 'var(--ads-background-interactive-hover)' : 'var(--ads-text-primary)' }}>Monochrome</p>}
    </motion.div>
  );
}

function AohsButton1({ isActive }: { isActive?: boolean }) {
  return (
    <div className="content-stretch flex flex-col items-center justify-between relative rounded-[8px] shrink-0 size-[40px]" data-name="AOHS button">
      <div aria-hidden="true" className="absolute border-0 border-[var(--ads-background-interactive)] border-solid inset-0 pointer-events-none rounded-[8px]" />
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
      className={`flex flex-row items-center ${isExpanded ? 'px-[8px]' : ''} py-0 gap-[4px] h-[40px] relative rounded-[8px] shrink-0 cursor-pointer self-stretch overflow-hidden transition-all duration-200`}
      style={{
        backgroundColor: isActive ? 'var(--ads-background-highlight-blue)' : (isHovered ? 'var(--ads-background-subtle-02)' : 'transparent'),
        border: isActive ? '1px solid var(--ads-background-interactive)' : (isHovered ? '1px solid var(--ads-border-accent)' : '1px solid transparent'),
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
      <AohsButton1 isActive={isActive} />
      {isExpanded && <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-nowrap text-center transition-all duration-200" style={{ color: (isActive) ? 'var(--ads-background-interactive-hover)' : 'var(--ads-text-primary)' }}>Review Tool</p>}
    </motion.div>
  );
}

function AohsButton2({ isActive }: { isActive?: boolean }) {
  return (
    <div className="content-stretch flex flex-col items-center justify-between relative rounded-[8px] shrink-0 size-[40px]" data-name="AOHS button">
      <div aria-hidden="true" className="absolute border-0 border-[var(--ads-background-interactive)] border-solid inset-0 pointer-events-none rounded-[8px]" />
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
      className={`flex flex-row items-center ${isExpanded ? 'px-[8px]' : ''} py-0 gap-[4px] h-[40px] relative rounded-[8px] shrink-0 cursor-pointer self-stretch overflow-hidden transition-all duration-200`}
      style={{
        backgroundColor: isActive ? 'var(--ads-background-highlight-blue)' : (isHovered ? 'var(--ads-background-subtle-02)' : 'transparent'),
        border: isActive ? '1px solid var(--ads-background-interactive)' : (isHovered ? '1px solid var(--ads-border-accent)' : '1px solid transparent'),
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
      <AohsButton2 isActive={isActive} />
      {isExpanded && <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-nowrap text-center transition-all duration-200" style={{ color: (isActive) ? 'var(--ads-background-interactive-hover)' : 'var(--ads-text-primary)' }}>Occulsgram</p>}
    </motion.div>
  );
}

function AohsButton3Margin({ isActive }: { isActive?: boolean }) {
  return (
    <div className="content-stretch flex flex-col items-center justify-between relative rounded-[8px] shrink-0 size-[40px]" data-name="AOHS button">
      <div aria-hidden="true" className="absolute border-0 border-[var(--ads-background-interactive)] border-solid inset-0 pointer-events-none rounded-[8px]" />
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
      className={`flex flex-row items-center ${isExpanded ? 'px-[8px]' : ''} py-0 gap-[4px] h-[40px] relative rounded-[8px] shrink-0 cursor-pointer self-stretch overflow-hidden transition-all duration-200`}
      style={{
        backgroundColor: isActive ? 'var(--ads-background-highlight-blue)' : (isHovered ? 'var(--ads-background-subtle-02)' : 'transparent'),
        border: isActive ? '1px solid var(--ads-background-interactive)' : (isHovered ? '1px solid var(--ads-border-accent)' : '1px solid transparent'),
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
      <AohsButton3Margin isActive={isActive} />
      {isExpanded && <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-nowrap text-center transition-all duration-200" style={{ color: (isActive) ? 'var(--ads-background-interactive-hover)' : 'var(--ads-text-primary)' }}>Margin line</p>}
    </motion.div>
  );
}

function AohsButton4PrepQc({ isActive }: { isActive?: boolean }) {
  return (
    <div className="content-stretch flex flex-col items-center justify-between relative rounded-[8px] shrink-0 size-[40px]" data-name="AOHS button">
      <div aria-hidden="true" className="absolute border-0 border-[var(--ads-background-interactive)] border-solid inset-0 pointer-events-none rounded-[8px]" />
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
      className={`flex flex-row items-center ${isExpanded ? 'px-[8px]' : ''} py-0 gap-[4px] h-[40px] relative rounded-[8px] shrink-0 cursor-pointer self-stretch overflow-hidden transition-all duration-200`}
      style={{
        backgroundColor: isActive ? 'var(--ads-background-highlight-blue)' : (isHovered ? 'var(--ads-background-subtle-02)' : 'transparent'),
        border: isActive ? '1px solid var(--ads-background-interactive)' : (isHovered ? '1px solid var(--ads-border-accent)' : '1px solid transparent'),
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
      <AohsButton4PrepQc isActive={isActive} />
      {isExpanded && <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-nowrap text-center transition-all duration-200" style={{ color: (isActive) ? 'var(--ads-background-interactive-hover)' : 'var(--ads-text-primary)' }}>Prep QC</p>}
    </motion.div>
  );
}

function AohsButton5Trim({ isActive }: { isActive?: boolean }) {
  return (
    <div className="content-stretch flex flex-col items-center justify-between relative rounded-[8px] shrink-0 size-[40px]" data-name="AOHS button">
      <div aria-hidden="true" className="absolute border-0 border-[var(--ads-background-interactive)] border-solid inset-0 pointer-events-none rounded-[8px]" />
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
      className={`flex flex-row items-center ${isExpanded ? 'px-[8px]' : ''} py-0 gap-[4px] h-[40px] relative rounded-[8px] shrink-0 cursor-pointer self-stretch overflow-hidden transition-all duration-200`}
      style={{
        backgroundColor: isActive ? 'var(--ads-background-highlight-blue)' : (isHovered ? 'var(--ads-background-subtle-02)' : 'transparent'),
        border: isActive ? '1px solid var(--ads-background-interactive)' : (isHovered ? '1px solid var(--ads-border-accent)' : '1px solid transparent'),
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
      <AohsButton5Trim isActive={isActive} />
      {isExpanded && <p className="font-['Roboto'] leading-[16px] not-italic relative shrink-0 text-[14px] text-nowrap text-center transition-all duration-200" style={{ color: (isActive) ? 'var(--ads-background-interactive-hover)' : 'var(--ads-text-primary)' }}>Trim</p>}
    </motion.div>
  );
}

function Frame5({ activeButtons, onButtonClick, microAnimations }: { activeButtons: Set<number>; onButtonClick: (index: number) => void; microAnimations?: boolean }) {
  const isExpanded = activeButtons.has(6);
  return (
    <div className="box-border content-stretch flex flex-col gap-[4px] items-stretch p-[4px] relative shrink-0 w-full">
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
          stroke="var(--ads-text-secondary)" 
          strokeWidth="1" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Button({ isExpanded, onClick }: { isExpanded?: boolean; onClick: () => void }) {
  return (
    <SecondaryButton
      size={36}
      style={{ width: 40, height: 40, minHeight: 40, padding: 0 }}
      onClick={onClick}
    >
      <ChevronIcon isExpanded={!!isExpanded} />
    </SecondaryButton>
  );
}

function Frame4({ onButtonClick, activeButtons }: { onButtonClick: (index: number) => void; activeButtons: Set<number> }) {
  const isExpanded = activeButtons.has(6);
  return (
    <div className="box-border flex flex-col items-start px-[4px] pb-[4px] pt-0 gap-[4px] w-full relative shrink-0">
      <Button isExpanded={isExpanded} onClick={() => onButtonClick(6)} />
    </div>
  );
}

function Frame6({ activeButtons, onButtonClick, microAnimations = true }: { activeButtons: Set<number>; onButtonClick: (index: number) => void; microAnimations?: boolean }) {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-stretch relative shrink-0 w-full">
      <Frame5 activeButtons={activeButtons} onButtonClick={onButtonClick} microAnimations={microAnimations} />
      <Frame4 onButtonClick={onButtonClick} activeButtons={activeButtons} />
    </div>
  );
}

export default function ViewToolbar({ activeButtons, onButtonClick, microAnimations = true }: { activeButtons: Set<number>; onButtonClick: (index: number) => void; microAnimations?: boolean }) {
  return (
    <div 
      className="bg-[var(--ads-background-subtle-01)] box-border content-stretch flex flex-col gap-[4px] items-center justify-center px-0 py-[4px] relative rounded-[12px] w-full" 
      data-name="Toolbar"
      style={{ boxShadow: 'var(--ads-shadow-sm)' }}
    >
      <Frame6 activeButtons={activeButtons} onButtonClick={onButtonClick} microAnimations={microAnimations} />
    </div>
  );
}