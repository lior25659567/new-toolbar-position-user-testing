import React, { useState } from "react";
import { motion } from "motion/react";
import svgPaths from "../imports/svg-34vouhfnvt";
import { SecondaryButton } from "../design-system";
import { color } from "../design-system/tokens";

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
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Mono chomr new">
      <svg width="28" height="28" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px] cursor-pointer overflow-hidden transition-colors duration-200"
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
      <div className="relative flex items-center justify-center size-[40px]">
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
    <div className="bg-white flex flex-1 gap-[8px] items-stretch p-[4px] relative rounded-[8px]">
      
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

      {/* Collapse Button - same size as toolbar buttons (36px) */}
      <SecondaryButton variant="toolbar" size={36} style={{ width: 36, padding: 0, minHeight: 36, borderWidth: 1, borderStyle: 'solid', borderColor: color.borderDefault }} onClick={() => onButtonClick(6)}>
        <ChevronIcon isExpanded={true} />
      </SecondaryButton>
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
    <div className="bg-white content-stretch flex gap-[8px] items-center p-[6px] relative self-stretch shrink-0 h-[48px]">
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

// Chevron Icon - identical to view toolbar: 0° = down (collapsed), 180° = up (expanded)
function ChevronIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <motion.div
      className="relative shrink-0 flex items-center justify-center"
      style={{ width: '24px', height: '24px' }}
      initial={{ rotate: isExpanded ? 0 : 180 }}
      animate={{ rotate: isExpanded ? 180 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <svg
        className="block"
        width="24"
        height="24"
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

function Frame3({ onButtonClick, isExpanded }: { onButtonClick: (index: number) => void; isExpanded: boolean }) {
  return (
    <SecondaryButton
      variant="toolbar"
      size={36}
      style={{ width: 36, padding: 0, minHeight: 36, borderWidth: 1, borderStyle: 'solid', borderColor: color.borderDefault }}
      onClick={() => onButtonClick(6)}
    >
      <ChevronIcon isExpanded={isExpanded} />
    </SecondaryButton>
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
        className="content-stretch flex items-stretch relative rounded-[8px] font-['Roboto'] overflow-hidden bg-white"
        style={{ backgroundColor: color.bgSurface, boxShadow: '0 2px 8px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)', padding: '6px' }}
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
      className="content-stretch flex items-center gap-[8px] p-[6px] relative rounded-[8px] h-[48px] font-['Roboto'] overflow-hidden bg-white"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)', padding: '6px' }}
      initial={{ width: 'auto', opacity: 0 }}
      animate={{ width: 'auto', opacity: 1 }}
      exit={{ width: 'auto', opacity: 0 }}
      transition={{ 
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      <Frame4 activeButtons={activeButtons} onButtonClick={onButtonClick} microAnimations={microAnimations} />
      <Frame3 onButtonClick={onButtonClick} isExpanded={isExpanded} />
    </motion.div>
  );
}
