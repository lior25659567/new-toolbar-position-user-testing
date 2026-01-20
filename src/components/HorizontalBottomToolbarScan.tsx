import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import svgPaths from "../imports/svg-76kjqgrbiw";

function InfoIcon() {
  return (
    <svg className="block size-[32px]" viewBox="0 0 24 24" fill="none" stroke="#3e3d40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="8" />
    </svg>
  );
}

// Monochrome Icon - Two overlapping squares
function MonoChomrNew({ isActive = false }: { isActive?: boolean }) {
  const fillColor = isActive ? "#008EC2" : "#5E646E";
  const strokeColor = isActive ? "#008EC2" : "#5E646E";
  
  return (
    <div className="relative shrink-0 size-[60px] flex items-center justify-center" data-name="Mono chomr new">
      <svg width="44" height="44" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_monochrome_hbotscan)">
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
          <clipPath id="clip0_monochrome_hbotscan">
            <rect width="60" height="60" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function AohsButton({ isActive, onClick, buttonIndex }: { isActive: boolean; onClick: () => void; buttonIndex?: number }) {
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ 
        scale: 0.9,
        transition: {
          type: "spring" as const,
          stiffness: 600,
          damping: 15
        }
      }}
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
        <MonoChomrNew isActive={isActive || isHovered} />
      </div>
    </motion.div>
  );
}

function ToolbarTextLabel({ isActive, onClick, buttonIndex }: { isActive: boolean; onClick: () => void; buttonIndex?: number }) {
  // No change here, this is just a wrapper for the button
  return (
    <div className="content-stretch flex items-center relative rounded-[8px] shrink-0" data-name="Toolbar Text label">
      <AohsButton isActive={isActive} onClick={onClick} buttonIndex={buttonIndex} />
    </div>
  );
}

// Feedback Icon
function TrimArea1() {
  return (
    <div className="absolute inset-[18.33%_8.33%_16.67%_8.33%]" data-name="trim area">
      <div className="absolute bottom-0 left-0 right-0 top-[-2.65%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 41">
          <g id="trim area">
            <path d={svgPaths.p1f4faa00} fill="var(--fill-0, #FFD6D6)" id="Vector" />
            <path d={svgPaths.p161588f0} fill="var(--fill-0, white)" id="Vector_2" stroke="var(--stroke-0, #3D3935)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.06414" />
            <path d={svgPaths.p1031d180} fill="var(--fill-0, #008EC2)" id="Vector_3" stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="2.06414" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame1() {
  return <div className="absolute left-1/2 size-[50px] top-1/2 translate-x-[-50%] translate-y-[-50%]" />;
}

function FeedbackNew({ isActive = false }: { isActive?: boolean }) {
  const strokeColor = isActive ? "#008EC2" : "#5E646E";
  const fillColor = isActive ? "#008EC2" : "#5E646E";
  
  return (
    <div className="relative shrink-0 size-[60px] flex items-center justify-center" data-name="Feedback new">
      <svg width="44" height="44" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M32.861 53H24.5715V28.7183H29.7507V10.2847H24.5715V6H30.4588C31.9723 6 33.4232 6.51317 34.4994 7.4382L38.9773 11.2873C40.0535 12.2062 40.6505 13.4594 40.6505 14.7603V33.0654" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M44 44V51.8235" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M44 55C48.9705 55 53 50.9705 53 46C53 41.0295 48.9705 37 44 37C39.0295 37 35 41.0295 35 46C35 50.9705 39.0295 55 44 55Z" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M44.0948 41.1897C44.6995 41.1897 45.1897 40.6995 45.1897 40.0948C45.1897 39.4902 44.6995 39 44.0948 39C43.4902 39 43 39.4902 43 40.0948C43 40.6995 43.4902 41.1897 44.0948 41.1897Z" 
          fill={fillColor}
        />
        <path 
          d="M25.2119 10.7351V27.7083L13.5531 34.8968C11.1369 36.3864 7 35.3324 7 33.2244V8.37029C7 6.35356 10.8293 5.26442 13.3137 6.56436L25.2119 10.7351Z" 
          stroke={strokeColor} 
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function AohsButton1({ isActive, onClick, buttonIndex }: { isActive: boolean; onClick: () => void; buttonIndex?: number }) {
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ 
        scale: 0.9,
        transition: {
          type: "spring" as const,
          stiffness: 600,
          damping: 15
        }
      }}
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
        <FeedbackNew isActive={isActive || isHovered} />
      </div>
    </motion.div>
  );
}

function ToolbarTextLabel1({ isActive, onClick, buttonIndex }: { isActive: boolean; onClick: () => void; buttonIndex?: number }) {
  // No change here, this is just a wrapper for the button
  return (
    <div className="content-stretch flex items-center relative rounded-[8px] shrink-0" data-name="Toolbar Text label">
      <AohsButton1 isActive={isActive} onClick={onClick} buttonIndex={buttonIndex} />
    </div>
  );
}

// Prep QC / Panel Icon
function Icons() {
  return <div className="absolute left-0 size-[48px] top-0" data-name="Icons" />;
}

function Icons1() {
  return (
    <div className="absolute left-0 size-[48px] top-0" data-name="Icons">
      <Icons />
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute h-[32.2px] left-[calc(50%-0.18px)] top-[calc(50%+0.1px)] translate-x-[-50%] translate-y-[-50%] w-[43.636px]">
      <div className="absolute bottom-0 left-0 right-0 top-[-2.48%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 33">
          <g id="Frame 1618872990">
            <g id="trim area">
              <path d={svgPaths.p2b201d80} fill="var(--fill-0, #FFD6D6)" id="Vector" />
              <path d={svgPaths.p16a0d0e0} fill="var(--fill-0, white)" id="Vector_2" stroke="var(--stroke-0, #3D3935)" strokeMiterlimit="10" strokeWidth="1.4" />
            </g>
            <g id="Shape">
              <path d={svgPaths.pabd600} fill="var(--fill-0, #009ACE)" />
              <path clipRule="evenodd" d={svgPaths.p21b85980} fill="white" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p1ba64c70} fill="white" fillRule="evenodd" />
              <path d={svgPaths.p34f3c300} stroke="var(--stroke-0, white)" strokeLinejoin="round" strokeWidth="0.8" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function PrepQc() {
  return (
    <div className="absolute left-1/2 size-[48px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Prep Qc">
      <Icons1 />
      <Frame2 />
    </div>
  );
}

function PrepEditToTest({ isActive = false }: { isActive?: boolean }) {
  const strokeColor = isActive ? "#008EC2" : "#5E646E";
  
  return (
    <div className="relative shrink-0 size-[60px] flex items-center justify-center" data-name="Prep edit to test">
      <svg width="44" height="45" viewBox="0 0 60 61" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M25.5238 51C19.5289 50.971 14.1168 49.5938 6.70168 46.5318C6.28657 46.3603 6.03918 45.9312 6.09579 45.4857L10.6275 9.82312C10.9436 7.33696 13.0214 5.65522 15.2086 6.06017C25.126 7.89606 31.8458 8.06423 40.8708 6.22052C43.1241 5.76026 45.3022 7.48079 45.5983 10.0541L47 22.2335" 
          stroke={strokeColor} 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <path 
          d="M50.1007 31.8468L54 35.6905L40.766 48.7095L31.641 50.6509C30.9001 50.8085 30.2598 50.1172 30.4736 49.3905L32.9245 41.0614L46.1994 28L50.1007 31.8468Z" 
          stroke={strokeColor} 
          strokeWidth="2"
        />
        <path 
          d="M46.6653 27.6042C48.8028 25.4637 52.2653 25.4654 54.4004 27.6083C56.4675 29.6831 56.5311 33.0055 54.5918 35.1569L54.3973 35.3614L50.7487 39L43 31.2595L46.6642 27.6051L46.6653 27.6042Z" 
          stroke={strokeColor} 
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function AohsButton2({ isActive, onClick, buttonIndex }: { isActive: boolean; onClick: () => void; buttonIndex?: number }) {
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ 
        scale: 0.9,
        transition: {
          type: "spring" as const,
          stiffness: 600,
          damping: 15
        }
      }}
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
        <PrepEditToTest isActive={isActive || isHovered} />
      </div>
    </motion.div>
  );
}

function ToolbarTextLabel2({ isActive, onClick, buttonIndex }: { isActive: boolean; onClick: () => void; buttonIndex?: number }) {
  // No change here, this is just a wrapper for the button
  return (
    <div className="content-stretch flex items-center relative rounded-[8px] shrink-0" data-name="Toolbar Text label">
      <AohsButton2 isActive={isActive} onClick={onClick} buttonIndex={buttonIndex} />
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

// Expanded Toolbar - all buttons with vertical text labels for compact design
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
    <div className="bg-white flex flex-1 gap-[12px] items-stretch p-[8px] relative rounded-[8px] font-['Roboto']">
      
      {/* Monochrome */}
      <div className="flex flex-col flex-1 items-center justify-center gap-[2px] relative">
        <AohsButton isActive={activeButtons.has(0)} onClick={() => onButtonClick(0)} buttonIndex={0} />
        <p className="font-['Roboto'] font-normal whitespace-nowrap text-center text-[12px] leading-[14px]" style={{ color: activeButtons.has(0) ? '#008EC2' : '#000000' }}>Monochrome</p>
      </div>

      {/* Feedback */}
      <div className="flex flex-col flex-1 items-center justify-center gap-[2px] relative">
        <AohsButton1 isActive={activeButtons.has(1)} onClick={() => onButtonClick(1)} buttonIndex={1} />
        <p className="font-['Roboto'] font-normal whitespace-nowrap text-center text-[12px] leading-[14px]" style={{ color: activeButtons.has(1) ? '#008EC2' : '#000000' }}>Scan assist</p>
      </div>

      {/* Prep Edit */}
      <div className="flex flex-col flex-1 items-center justify-center gap-[2px] relative">
        <AohsButton2 isActive={activeButtons.has(2)} onClick={() => onButtonClick(2)} buttonIndex={2} />
        <p className="font-['Roboto'] font-normal whitespace-nowrap text-center text-[12px] leading-[14px]" style={{ color: activeButtons.has(2) ? '#008EC2' : '#000000' }}>Prep edit</p>
      </div>

      {/* Collapse Button */}
      <motion.div 
        className="flex items-center justify-center cursor-pointer relative shrink-0"
        onClick={() => onButtonClick(3)}
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

function Frame4({ activeButtons, onButtonClick }: { activeButtons: Set<number>; onButtonClick: (index: number) => void }) {
  return (
    <div className="bg-white content-stretch flex gap-[12px] items-center p-[8px] relative self-stretch shrink-0 h-[76px]">
      <ToolbarTextLabel isActive={activeButtons.has(0)} onClick={() => onButtonClick(0)} buttonIndex={0} />
      <ToolbarTextLabel1 isActive={activeButtons.has(1)} onClick={() => onButtonClick(1)} buttonIndex={1} />
      <ToolbarTextLabel2 isActive={activeButtons.has(2)} onClick={() => onButtonClick(2)} buttonIndex={2} />
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

function AohsButton3({ onClick, isExpanded }: { onClick: () => void; isExpanded: boolean }) {
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
          <AohsButton3 onClick={() => onButtonClick(3)} isExpanded={isExpanded} />
        </div>
      </div>
    </div>
  );
}

export function HorizontalBottomToolbarScan({
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
  const isExpanded = activeButtons.has(3);

  if (isExpanded) {
    return (
      <div className="content-stretch flex items-stretch relative rounded-[8px] font-['Roboto'] overflow-hidden">
        <ExpandedToolbar activeButtons={activeButtons} onButtonClick={onButtonClick} microAnimations={microAnimations} stackVertical={stackVertical} />
      </div>
    );
  }

  return (
    <div className="content-stretch flex items-start relative rounded-[8px] h-[76px] font-['Roboto'] overflow-hidden">
      <Frame4 activeButtons={activeButtons} onButtonClick={onButtonClick} />
      <div className="flex h-[76px] items-center justify-center relative shrink-0 w-[76px] bg-white" style={{ "--transform-inner-width": "60", "--transform-inner-height": "60" } as React.CSSProperties}>
        <Frame3 onButtonClick={onButtonClick} isExpanded={isExpanded} />
      </div>
    </div>
  );
}
