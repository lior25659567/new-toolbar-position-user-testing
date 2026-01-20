import React, { useState } from "react";
import { motion } from "motion/react";
import svgPaths from "../imports/svg-34vouhfnvt";

function InfoIcon() {
  return (
    <svg className="block size-[32px]" viewBox="0 0 24 24" fill="none" stroke="#3e3d40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="8" />
    </svg>
  );
}
import NiriIonNew from "../imports/NiriIonNew";
import OcculsgramNew from "../imports/OcculsgramNew";
import MarginLineNew from "../imports/MarginLineNew";
import PrepQcNew from "../imports/PrepQcNew";
import TrimNew from "../imports/TrimNew";

// Monochrome Icon - Two overlapping squares
function MonoChomrNew({ isActive = false }: { isActive?: boolean }) {
  const fillColor = isActive ? "#008EC2" : "#5E646E";
  const strokeColor = isActive ? "#008EC2" : "#5E646E";
  
  return (
    <div className="relative shrink-0 size-[60px] flex items-center justify-center" data-name="Mono chomr new">
      <svg width="44" height="44" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_monochrome_hbotview)">
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
          <clipPath id="clip0_monochrome_hbotview">
            <rect width="60" height="60" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

type ViewButtonConfig = {
  label: string;
  Icon: React.ComponentType<{ isActive?: boolean }>;
};

const viewButtons: ViewButtonConfig[] = [
  { label: "Monochrome", Icon: MonoChomrNew },
  { label: "Review Tool", Icon: NiriIonNew },
  { label: "Occlusalgram", Icon: OcculsgramNew },
  { label: "Margin line", Icon: MarginLineNew },
  { label: "Prep QC", Icon: PrepQcNew },
  { label: "Trim", Icon: TrimNew },
];

function IconButton({
  isActive,
  onClick,
  Icon,
  microAnimations = true,
  buttonIndex
}: {
  isActive: boolean;
  onClick?: () => void;
  Icon: React.ComponentType<{ isActive?: boolean }>;
  microAnimations?: boolean;
  buttonIndex?: number;
}) {
  const [pressedButton, setPressedButton] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const animationProps = microAnimations ? { 
    whileHover: { scale: 1.05 },
    whileTap: { 
      scale: 0.85,
      transition: {
        type: "spring" as const,
        stiffness: 600,
        damping: 15
      }
    } 
  } : {};
  
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
      className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[60px] cursor-pointer overflow-hidden transition-colors duration-200"
      style={{
        backgroundColor: isActive ? '#e0f2fe' : isHovered ? '#f5f5f5' : 'transparent'
      }}
      data-name="AOHS button"
      onClick={onClick}
      onTapStart={handleTapStart}
      onTapEnd={handleTapEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...animationProps}
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
      <div className="relative flex items-center justify-center size-[60px]">
        <Icon isActive={isActive || isHovered} />
      </div>
    </motion.div>
  );
}

function ExpandedButton({
  label,
  Icon,
  isActive,
  onClick,
  microAnimations = true,
  stackVertical = false,
  buttonIndex
}: {
  label: string;
  Icon: React.ComponentType;
  isActive: boolean;
  onClick: () => void;
  microAnimations?: boolean;
  stackVertical?: boolean;
  buttonIndex?: number;
}) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-[2px] relative">
      <IconButton isActive={isActive} onClick={onClick} Icon={Icon} microAnimations={microAnimations} buttonIndex={buttonIndex} />
      <p className="font-['Roboto'] font-normal whitespace-nowrap text-center text-[12px] leading-[14px]" style={{ color: isActive ? '#008EC2' : '#000000' }}>{label}</p>
    </div>
  );
}

// Close/Collapse Icon (X icon for expanded state)
function CloseIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g>
          <path d="M15 5L5 15M5 5L15 15" stroke="#717182" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
      </svg>
    </div>
  );
}

// Expanded Toolbar - all buttons with horizontal text labels
function ExpandedToolbar({
  activeButtons,
  onButtonClick,
  microAnimations = true,
  stackVertical = false
}: {
  activeButtons: Set<number>;
  onButtonClick: (index: number) => void;
  microAnimations?: boolean;
  stackVertical?: boolean;
}) {
  return (
    <div className="bg-white flex flex-1 gap-[12px] items-stretch p-[8px] relative rounded-[8px]">
      
      {viewButtons.map((btn, index) => (
        <React.Fragment key={btn.label}>
          <ExpandedButton
            label={btn.label}
            Icon={btn.Icon}
            isActive={activeButtons.has(index)}
            onClick={() => onButtonClick(index)}
            microAnimations={microAnimations}
            stackVertical={stackVertical}
            buttonIndex={index}
          />
        </React.Fragment>
      ))}

      {/* Collapse Button */}
      <motion.div 
        className="flex items-center justify-center cursor-pointer relative shrink-0"
        onClick={() => onButtonClick(6)}
        whileTap={{ 
          scale: 0.88,
          transition: {
            type: "spring" as const,
            stiffness: 600,
            damping: 15
          }
        }}
      >
        <div 
          className="size-[60px] flex items-center justify-center rounded-[8px]"
          style={{ border: '1px solid #E5E7EB' }}
        >
          <ChevronIcon isExpanded={true} />
        </div>
      </motion.div>
    </div>
  );
}

function Frame4({
  activeButtons,
  onButtonClick,
  microAnimations = true
}: {
  activeButtons: Set<number>;
  onButtonClick: (index: number) => void;
  microAnimations?: boolean;
}) {
  return (
    <div className="bg-white content-stretch flex gap-[12px] items-center p-[8px] relative self-stretch shrink-0 h-[76px]">
      {viewButtons.map((btn, index) => (
        <React.Fragment key={btn.label}>
          <IconButton
            isActive={activeButtons.has(index)}
            onClick={() => onButtonClick(index)}
            Icon={btn.Icon}
            microAnimations={microAnimations}
            buttonIndex={index}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

// Chevron Icon - points right when collapsed, left when expanded  
function ChevronIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <motion.div 
      className="relative shrink-0 size-[32px]" 
      data-name="ChevronIcon"
      animate={{ 
        rotate: isExpanded ? 180 : 90,
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        rotate: { duration: 0.3, ease: "easeInOut" },
        scale: { duration: 0.2, ease: "easeOut" }
      }}
    >
      <svg 
        className="block size-full" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <path 
          d="M6 9L12 15L18 9" 
          stroke="#717182" 
          strokeWidth="1" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}

function Button({ isExpanded, isHovered }: { isExpanded: boolean; isHovered?: boolean }) {
  return (
    <div 
      className="content-stretch flex size-[60px] items-center justify-center relative rounded-[8px] shrink-0 transition-all duration-200" 
      data-name="Button"
      style={{ 
        border: `1px solid ${isHovered ? '#009ACE' : '#E5E7EB'}`,
        backgroundColor: isHovered ? '#f0f9ff' : 'transparent'
      }}
    >
      <ChevronIcon isExpanded={isExpanded} />
    </div>
  );
}

function AohsButton6({ onClick, isExpanded }: { onClick: () => void; isExpanded: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="content-stretch flex flex-col items-center justify-between relative rounded-[8px] size-[60px] cursor-pointer overflow-hidden" 
      data-name="AOHS button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div aria-hidden="true" className="absolute border-0 border-[#00adef] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Button isExpanded={isExpanded} isHovered={isHovered} />
    </motion.div>
  );
}

function Frame3({ onButtonClick, isExpanded }: { onButtonClick: (index: number) => void; isExpanded: boolean }) {
  return (
    <div className="bg-white content-stretch flex flex-col h-[76px] items-center justify-center relative rounded-bl-[4px] rounded-br-[4px] w-[76px]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rotate-[270deg]">
          <AohsButton6 onClick={() => onButtonClick(6)} isExpanded={isExpanded} />
        </div>
      </div>
    </div>
  );
}

export function HorizontalBottomToolbarView({
  activeButtons,
  onButtonClick,
  microAnimations = true,
  stackVertical = false
}: {
  activeButtons: Set<number>;
  onButtonClick: (index: number) => void;
  microAnimations?: boolean;
  stackVertical?: boolean;
}) {
  const isExpanded = activeButtons.has(6);

  if (isExpanded) {
    return (
      <motion.div 
        className="content-stretch flex items-stretch relative rounded-[8px] font-['Roboto'] overflow-hidden"
        initial={{ width: 'auto', opacity: 0 }}
        animate={{ width: 'auto', opacity: 1 }}
        exit={{ width: 'auto', opacity: 0 }}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        <ExpandedToolbar activeButtons={activeButtons} onButtonClick={onButtonClick} microAnimations={microAnimations} stackVertical={stackVertical} />
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="content-stretch flex items-start relative rounded-[8px] h-[76px] font-['Roboto'] overflow-hidden"
      initial={{ width: 'auto', opacity: 0 }}
      animate={{ width: 'auto', opacity: 1 }}
      exit={{ width: 'auto', opacity: 0 }}
      transition={{ 
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      <Frame4 activeButtons={activeButtons} onButtonClick={onButtonClick} microAnimations={microAnimations} />
      <div className="flex h-[76px] items-center justify-center relative shrink-0 w-[76px] bg-white" style={{ "--transform-inner-width": "60", "--transform-inner-height": "60" } as React.CSSProperties}>
        <Frame3 onButtonClick={onButtonClick} isExpanded={isExpanded} />
      </div>
    </motion.div>
  );
}
