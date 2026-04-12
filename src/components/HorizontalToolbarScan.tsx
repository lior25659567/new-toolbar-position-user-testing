import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import svgPaths from "../imports/svg-34vouhfnvt";
import feedbackSvgPaths from "../imports/svg-4m16l2fjs5";
import { SecondaryButton } from "../design-system";

// Monochrome Icon - Two overlapping squares
function MonoChomrNew({ isActive = false }: { isActive?: boolean }) {
  const fillColor = isActive ? "#008EC2" : "#5E646E";
  const strokeColor = isActive ? "#008EC2" : "#5E646E";
  
  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Mono chomr new">
      <svg width="28" height="28" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_monochrome_hscan)">
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M49.3509 21.4961H41.0319V36.7473C41.0319 39.0444 39.1687 40.9076 36.8716 40.9076H21.6204V49.2267C21.6204 50.758 22.8624 52.0002 24.3939 52.0002H49.3509C50.8823 52.0002 52.1244 50.7596 52.1244 49.2267V24.2696C52.1244 22.7382 50.8823 21.4961 49.3509 21.4961Z" 
            fill={fillColor}
          />
          <path 
            d="M35.627 8H9.86313C8.28064 8 7 9.23644 7 10.7609V35.6046C7 37.1291 8.28064 38.3655 9.86313 38.3655H35.627C37.208 38.3655 38.4902 37.1291 38.4902 35.6046V10.7609C38.4902 9.23644 37.208 8 35.627 8Z" 
            stroke={strokeColor} 
            strokeWidth="2" 
            strokeMiterlimit="10"
          />
        </g>
        <defs>
          <clipPath id="clip0_monochrome_hscan">
            <rect width="60" height="60" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// Feedback icon component - using exact same icon from vertical toolbar (Toolbar.tsx)
function TrimArea1() {
  return (
    <div className="absolute inset-[18.33%_8.33%_16.67%_8.33%]" data-name="trim area">
      <div className="absolute bottom-0 left-0 right-0 top-[-2.65%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 41">
          <g id="trim area">
            <path d={feedbackSvgPaths.p1f4faa00} fill="var(--fill-0, #FFD6D6)" id="Vector" />
            <path d={feedbackSvgPaths.p161588f0} fill="var(--fill-0, white)" id="Vector_2" stroke="var(--stroke-0, #3D3935)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.06414" />
            <path d={feedbackSvgPaths.p1031d180} fill="var(--fill-0, #008EC2)" id="Vector_3" stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="2.06414" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame3() {
  return <div className="absolute left-1/2 size-[50px] top-1/2 translate-x-[-50%] translate-y-[-50%]" />;
}

function FeedbackNew({ isActive }: { isActive?: boolean }) {
  const strokeColor = isActive ? "#008EC2" : "#5E646E";
  const fillColor = isActive ? "#008EC2" : "#5E646E";
  
  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Feedback new">
      <svg width="28" height="28" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
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

// Prep edit icon component
function TrimArea2() {
  return (
    <div className="absolute inset-[18.33%_7.82%_18.33%_8.85%]" data-name="trim area">
      <div className="absolute bottom-0 left-0 right-0 top-[-2.31%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 39">
          <g id="trim area">
            <path d={svgPaths.p2bdf0900} fill="var(--fill-0, #FFD6D6)" id="Vector" />
            <path d={svgPaths.p2c67eb40} fill="var(--fill-0, white)" id="Vector_2" stroke="var(--stroke-0, #3D3935)" strokeMiterlimit="10" strokeWidth="1.75" />
            <g id="Group">
              <path d={svgPaths.p33e16970} fill="var(--fill-0, #239B28)" id="Vector_3" />
              <path d={svgPaths.p356c8900} fill="var(--fill-0, white)" id="Vector_4" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function PrepEditNew({ isActive }: { isActive?: boolean }) {
  const strokeColor = isActive ? "#008EC2" : "#5E646E";
  
  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Prep edit new">
      <svg width="28" height="29" viewBox="0 0 60 61" fill="none" xmlns="http://www.w3.org/2000/svg">
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

// Undercut icon component
function UndercutNew({ isActive }: { isActive?: boolean }) {
  const strokeColor = isActive ? "#008EC2" : "#5E646E";
  const fillColor = isActive ? "#008EC2" : "#5E646E";

  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Undercut new">
      <svg width="28" height="28" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Tooth outline */}
        <path
          d="M22 10C22 10 18 20 18 32C18 44 22 52 28 54C31 55 34 52 35 48C36 52 39 55 42 54C48 52 52 44 52 32C52 20 48 10 48 10"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Undercut region */}
        <path
          d="M20 28C22 24 26 22 30 22C34 22 38 24 40 28"
          stroke={fillColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Insertion path arrow */}
        <line x1="35" y1="6" x2="35" y2="38" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round"/>
        <polyline points="31,12 35,6 39,12" stroke={strokeColor} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// Expand/Collapse icon with micro animation
function ExpandIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <motion.div 
      className="relative shrink-0 size-[20px]" 
      data-name="Icon"
      animate={{ 
        rotate: isExpanded ? 90 : 0,
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        rotate: { duration: 0.3, ease: "easeInOut" },
        scale: { duration: 0.2, ease: "easeOut" }
      }}
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M12.4991 10.0002H2.49878" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" />
          <path d="M14.1658 15.0002H2.49878" id="Vector_2" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" />
          <path d="M17.4992 4.99994H2.49878" id="Vector_3" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" />
        </g>
      </svg>
    </motion.div>
  );
}

// Jaw Type Selector – upper / lower / both
type JawType = 'upper' | 'lower' | 'both';

export function UpperJawIcon({ isActive }: { isActive: boolean }) {
  const c = isActive ? '#009ACE' : '#717182';
  const sw1 = 1.6;
  const sw2 = 1.1;
  return (
    <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
      <path d="M5 21C5 21 5 10 14 10C23 10 23 21 23 21" stroke={c} strokeWidth={sw1} strokeLinecap="round" fill="none"/>
      <path d="M7 16.5C7.5 15 8.5 14 9.5 14C10.5 14 11 15 11.5 14C12 13 12.5 12.5 14 12.5C15.5 12.5 16 13 16.5 14C17 15 17.5 14 18.5 14C19.5 14 20.5 15 21 16.5" stroke={c} strokeWidth={sw2} strokeLinecap="round" fill="none"/>
    </svg>
  );
}

export function LowerJawIcon({ isActive }: { isActive: boolean }) {
  const c = isActive ? '#009ACE' : '#717182';
  const sw1 = 1.6;
  const sw2 = 1.1;
  return (
    <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
      <path d="M5 7C5 7 5 18 14 18C23 18 23 7 23 7" stroke={c} strokeWidth={sw1} strokeLinecap="round" fill="none"/>
      <path d="M7 11.5C7.5 13 8.5 14 9.5 14C10.5 14 11 13 11.5 14C12 15 12.5 15.5 14 15.5C15.5 15.5 16 15 16.5 14C17 13 17.5 14 18.5 14C19.5 14 20.5 13 21 11.5" stroke={c} strokeWidth={sw2} strokeLinecap="round" fill="none"/>
    </svg>
  );
}

export function BothJawsIcon({ isActive }: { isActive: boolean }) {
  const c = isActive ? '#009ACE' : '#717182';
  const sw1 = 1.6;
  const sw2 = 1.1;
  return (
    <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
      <path d="M6 15C6 15 6 6 14 6C22 6 22 15 22 15" stroke={c} strokeWidth={sw1} strokeLinecap="round" fill="none"/>
      <path d="M8 11.5C8.5 10.5 9.5 10 10.5 10C11.5 10 12 10.5 13 10C13.5 9.5 13.5 9 14 9C14.5 9 14.5 9.5 15 10C16 10.5 16.5 10 17.5 10C18.5 10 19.5 10.5 20 11.5" stroke={c} strokeWidth={sw2} strokeLinecap="round" fill="none"/>
      <path d="M6 13C6 13 6 22 14 22C22 22 22 13 22 13" stroke={c} strokeWidth={sw1} strokeLinecap="round" fill="none"/>
      <path d="M8 16.5C8.5 17.5 9.5 18 10.5 18C11.5 18 12 17.5 13 18C13.5 18.5 13.5 19 14 19C14.5 19 14.5 18.5 15 18C16 17.5 16.5 18 17.5 18C18.5 18 19.5 17.5 20 16.5" stroke={c} strokeWidth={sw2} strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function JawButton({ jaw, isActive, onClick }: { jaw: JawType; isActive: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const active = isActive || hovered;
  return (
    <motion.div
      className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px] cursor-pointer overflow-hidden transition-colors duration-200"
      style={{ backgroundColor: isActive ? '#E0F2FE' : hovered ? '#f5f5f5' : 'transparent' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9, transition: { type: 'spring' as const, stiffness: 600, damping: 15 } }}
    >
      {jaw === 'upper' && <UpperJawIcon isActive={active} />}
      {jaw === 'lower' && <LowerJawIcon isActive={active} />}
      {jaw === 'both' && <BothJawsIcon isActive={active} />}
    </motion.div>
  );
}

function JawTypeRow({ activeJaw, onJawChange, onCollapse }: { activeJaw: JawType; onJawChange: (j: JawType) => void; onCollapse: () => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: 8,
      borderBottom: '1px solid #ebebeb',
    }}>
      <JawButton jaw="upper" isActive={activeJaw === 'upper'} onClick={() => onJawChange('upper')} />
      <JawButton jaw="lower" isActive={activeJaw === 'lower'} onClick={() => onJawChange('lower')} />
      <JawButton jaw="both"  isActive={activeJaw === 'both'}  onClick={() => onJawChange('both')}  />
      <div style={{ flex: 1 }} />
      <SecondaryButton
        size={40}
        style={{ width: 40, padding: 0, minHeight: 40 }}
        onClick={onCollapse}
      >
        <ExpandIcon isExpanded={true} />
      </SecondaryButton>
    </div>
  );
}

// Collapsed Toolbar - just icons (3 buttons)
function CollapsedToolbar({
  activeButtons,
  onButtonClick,
  microAnimations = true
}: {
  activeButtons: Set<number>;
  onButtonClick: (index: number) => void;
  microAnimations?: boolean;
}) {
  const [pressedButton, setPressedButton] = useState<number | null>(null);
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);
  
  const animationProps = microAnimations ? {
    animate: (isActive: boolean) => ({
      scale: isActive ? 1.08 : 1,
    }),
    whileHover: { scale: 1.05 },
    whileTap: { 
      scale: 0.85,
      transition: {
        type: "spring" as const,
        stiffness: 600,
        damping: 15
      }
    },
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 10
    }
  } : {};
  
  const handleButtonClick = (index: number) => {
    onButtonClick(index);
  };
  
  const handleTapStart = (index: number) => {
    setPressedButton(index);
  };
  
  const handleTapEnd = () => {
    setTimeout(() => setPressedButton(null), 300);
  };

  return (
    <div className="bg-white rounded-[4px] size-full flex items-center font-['Roboto']">
      <div className="flex items-center gap-[4px] px-[4px] py-[4px] flex-1">
        {/* Button 0: Monochrome */}
        <motion.div 
          className={`content-stretch flex items-center justify-center relative rounded-[10px] shrink-0 size-[40px] cursor-pointer overflow-hidden p-[6px] transition-colors duration-200`}
          style={{
            backgroundColor: activeButtons.has(0) ? '#E0F2FE' : hoveredButton === 0 ? '#f5f5f5' : 'transparent'
          }}
          custom={activeButtons.has(0)}
          onClick={() => handleButtonClick(0)}
          onTapStart={() => handleTapStart(0)}
          onTapEnd={handleTapEnd}
          onMouseEnter={() => setHoveredButton(0)}
          onMouseLeave={() => setHoveredButton(null)}
          {...animationProps}
        >
          {pressedButton === 0 && (
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
          <div className="relative flex items-center justify-center size-full overflow-hidden">
            <MonoChomrNew isActive={activeButtons.has(0) || hoveredButton === 0} />
          </div>
        </motion.div>

        {/* Button 1: Feedback */}
        <motion.div 
          className={`content-stretch flex items-center justify-center relative rounded-[10px] shrink-0 size-[40px] cursor-pointer overflow-hidden p-[6px] transition-colors duration-200`}
          style={{
            backgroundColor: activeButtons.has(1) ? '#E0F2FE' : hoveredButton === 1 ? '#f5f5f5' : 'transparent'
          }}
          custom={activeButtons.has(1)}
          onClick={() => handleButtonClick(1)}
          onTapStart={() => handleTapStart(1)}
          onTapEnd={handleTapEnd}
          onMouseEnter={() => setHoveredButton(1)}
          onMouseLeave={() => setHoveredButton(null)}
          {...animationProps}
        >
          {pressedButton === 1 && (
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
          <div className="relative flex items-center justify-center size-full overflow-hidden">
            <FeedbackNew isActive={activeButtons.has(1) || hoveredButton === 1} />
          </div>
        </motion.div>

        {/* Button 2: Prep Edit */}
        <motion.div 
          className={`content-stretch flex items-center justify-center relative rounded-[10px] shrink-0 size-[40px] cursor-pointer overflow-hidden p-[6px] transition-colors duration-200`}
          style={{
            backgroundColor: activeButtons.has(2) ? '#E0F2FE' : hoveredButton === 2 ? '#f5f5f5' : 'transparent'
          }}
          custom={activeButtons.has(2)}
          onClick={() => handleButtonClick(2)}
          onTapStart={() => handleTapStart(2)}
          onTapEnd={handleTapEnd}
          onMouseEnter={() => setHoveredButton(2)}
          onMouseLeave={() => setHoveredButton(null)}
          {...animationProps}
        >
          {pressedButton === 2 && (
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
          <div className="relative flex items-center justify-center size-full overflow-hidden">
            <PrepEditNew isActive={activeButtons.has(2) || hoveredButton === 2} />
          </div>
        </motion.div>

        {/* Button 3: Undercut - removed */}
      </div>

      {/* Expand button */}
      <div className="h-full flex items-center justify-center px-[8px]">
        <SecondaryButton
          size={40}
          style={{ width: 40, padding: 0, minHeight: 40 }}
          onClick={() => onButtonClick(4)}
        >
          <ExpandIcon isExpanded={false} />
        </SecondaryButton>
      </div>
    </div>
  );
}

// Expanded Toolbar - icons with text labels below (3 buttons)
function ExpandedToolbar({
  activeButtons,
  onButtonClick,
  microAnimations = true
}: {
  activeButtons: Set<number>;
  onButtonClick: (index: number) => void;
  microAnimations?: boolean;
}) {
  const [pressedButton, setPressedButton] = useState<number | null>(null);
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);
  const [activeJaw, setActiveJaw] = useState<JawType>('both');
  
  const animationProps = microAnimations ? {
    animate: (isActive: boolean) => ({
      scale: isActive ? 1.08 : 1,
    }),
    whileHover: { scale: 1.05 },
    whileTap: { 
      scale: 0.88,
      transition: {
        type: "spring" as const,
        stiffness: 600,
        damping: 15
      }
    },
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 10
    }
  } : {};
  
  const handleButtonClick = (index: number) => {
    onButtonClick(index);
  };
  
  const handleTapStart = (index: number) => {
    setPressedButton(index);
  };
  
  const handleTapEnd = () => {
    setTimeout(() => setPressedButton(null), 300);
  };

  return (
    <div className="bg-white rounded-[4px] flex flex-col font-['Roboto']">
      {/* Jaw type selector row */}
      <JawTypeRow activeJaw={activeJaw} onJawChange={setActiveJaw} onCollapse={() => onButtonClick(4)} />

      {/* Tool buttons */}
      <div className="flex items-center p-[4px] gap-[4px]">
        {/* Button 0: Monochrome */}
        <motion.div 
          className={`rounded-[8px] px-[8px] py-[4px] cursor-pointer flex flex-col items-center justify-center gap-[4px] min-h-[40px] relative overflow-hidden transition-colors duration-200`}
          style={{
            backgroundColor: activeButtons.has(0) ? '#E0F2FE' : hoveredButton === 0 ? '#f5f5f5' : 'transparent'
          }}
          custom={activeButtons.has(0)}
          onClick={() => handleButtonClick(0)}
          onTapStart={() => handleTapStart(0)}
          onTapEnd={handleTapEnd}
          onMouseEnter={() => setHoveredButton(0)}
          onMouseLeave={() => setHoveredButton(null)}
          {...animationProps}
        >
          {pressedButton === 0 && (
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
          <div className="flex items-center justify-center w-[32px] h-[32px]">
            <div className="scale-[0.53]">
              <MonoChomrNew isActive={activeButtons.has(0) || hoveredButton === 0} />
            </div>
          </div>
          <p className="font-['Roboto'] text-[12px] leading-[14px] whitespace-nowrap" style={{ color: activeButtons.has(0) || hoveredButton === 0 ? '#008EC2' : '#000000' }}>Monochrome</p>
        </motion.div>

        {/* Button 1: Feedback */}
        <motion.div 
          className={`rounded-[8px] px-[8px] py-[4px] cursor-pointer flex flex-col items-center justify-center gap-[4px] min-h-[40px] relative overflow-hidden transition-colors duration-200`}
          style={{
            backgroundColor: activeButtons.has(1) ? '#E0F2FE' : hoveredButton === 1 ? '#f5f5f5' : 'transparent'
          }}
          custom={activeButtons.has(1)}
          onClick={() => handleButtonClick(1)}
          onTapStart={() => handleTapStart(1)}
          onTapEnd={handleTapEnd}
          onMouseEnter={() => setHoveredButton(1)}
          onMouseLeave={() => setHoveredButton(null)}
          {...animationProps}
        >
          {pressedButton === 1 && (
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
          <div className="flex items-center justify-center w-[32px] h-[32px]">
            <div className="scale-[0.53]">
              <FeedbackNew isActive={activeButtons.has(1) || hoveredButton === 1} />
            </div>
          </div>
          <p className="font-['Roboto'] text-[12px] leading-[14px] whitespace-nowrap" style={{ color: activeButtons.has(1) || hoveredButton === 1 ? '#008EC2' : '#000000' }}>Scan assist</p>
        </motion.div>

        {/* Button 2: Prep Edit */}
        <motion.div 
          className={`rounded-[8px] px-[8px] py-[4px] cursor-pointer flex flex-col items-center justify-center gap-[4px] min-h-[40px] relative overflow-hidden transition-colors duration-200`}
          style={{
            backgroundColor: activeButtons.has(2) ? '#E0F2FE' : hoveredButton === 2 ? '#f5f5f5' : 'transparent'
          }}
          custom={activeButtons.has(2)}
          onClick={() => handleButtonClick(2)}
          onTapStart={() => handleTapStart(2)}
          onTapEnd={handleTapEnd}
          onMouseEnter={() => setHoveredButton(2)}
          onMouseLeave={() => setHoveredButton(null)}
          {...animationProps}
        >
          {pressedButton === 2 && (
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
          <div className="flex items-center justify-center w-[32px] h-[32px]">
            <div className="scale-[0.53]">
              <PrepEditNew isActive={activeButtons.has(2) || hoveredButton === 2} />
            </div>
          </div>
          <p className="font-['Roboto'] text-[12px] leading-[14px] whitespace-nowrap" style={{ color: activeButtons.has(2) || hoveredButton === 2 ? '#008EC2' : '#000000' }}>Prep edit</p>
        </motion.div>

        {/* Button 3: Undercut - removed */}
      </div>
    </div>
  );
}

// Main export that switches between collapsed and expanded
export function HorizontalScanToolbar({
  activeButtons,
  onButtonClick,
  microAnimations = true
}: {
  activeButtons: Set<number>;
  onButtonClick: (index: number) => void;
  microAnimations?: boolean;
}) {
  const isExpanded = activeButtons.has(4);

  if (isExpanded) {
    return (
      <ExpandedToolbar 
        activeButtons={activeButtons} 
        onButtonClick={onButtonClick} 
        microAnimations={microAnimations} 
      />
    );
  }

  return (
    <CollapsedToolbar 
      activeButtons={activeButtons} 
      onButtonClick={onButtonClick} 
      microAnimations={microAnimations} 
    />
  );
}