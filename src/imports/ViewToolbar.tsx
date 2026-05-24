import { motion } from "framer-motion";
import { useState } from "react";
import { SecondaryButton } from "../design-system";
import svgPaths from "./svg-4m16l2fjs5";
import NiriIonNew from "./NiriIonNew";
import OcculsgramNew from "./OcculsgramNew";
import MarginLineNew from "./MarginLineNew";
import PrepQcNew from "./PrepQcNew";
import TrimNew from "./TrimNew";

// Monochrome Icon
function MonoChomrNew({ isActive = false }: { isActive?: boolean }) {
  const strokeColor = isActive ? "var(--ads-background-interactive-hover)" : "var(--ads-icon-secondary)";

  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Mono chomr new">
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