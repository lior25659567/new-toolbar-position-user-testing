import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import svgPaths from "../imports/svg-34vouhfnvt";
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
        <g clipPath="url(#clip0_monochrome_hview)">
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
          <clipPath id="clip0_monochrome_hview">
            <rect width="60" height="60" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// Expand/Collapse icon
function ExpandIcon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
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

// Collapsed Toolbar - just icons (6 buttons)
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
  const [expandHovered, setExpandHovered] = useState(false);
  
  const animationProps = microAnimations ? {
    animate: (isActive: boolean) => ({
      scale: isActive ? 1.05 : 1,
    }),
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
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
      <div className="flex items-center gap-[8px] px-[16px] py-[16px] flex-1">
        {/* Button 0: Monochrome */}
        <motion.div 
          className={`rounded-[8px] cursor-pointer flex items-center justify-center size-[60px] relative overflow-hidden transition-colors duration-200`}
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
              className="absolute inset-0 rounded-full pointer-events-none"
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
          <div className="scale-100">
            <MonoChomrNew isActive={activeButtons.has(0) || hoveredButton === 0} />
          </div>
        </motion.div>

        {/* Button 1: Review Tool */}
        <motion.div 
          className={`rounded-[8px] cursor-pointer flex items-center justify-center size-[60px] relative overflow-hidden transition-colors duration-200`}
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
              className="absolute inset-0 rounded-full pointer-events-none"
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
          <div className="scale-100">
            <NiriIonNew isActive={activeButtons.has(1) || hoveredButton === 1} />
          </div>
        </motion.div>

        {/* Button 2: Occlusalgram */}
        <motion.div 
          className={`rounded-[8px] cursor-pointer flex items-center justify-center size-[60px] relative overflow-hidden transition-colors duration-200`}
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
              className="absolute inset-0 rounded-full pointer-events-none"
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
          <div className="scale-100">
            <OcculsgramNew isActive={activeButtons.has(2) || hoveredButton === 2} />
          </div>
        </motion.div>

        {/* Button 3: Margin Line */}
        <motion.div 
          className={`rounded-[8px] cursor-pointer flex items-center justify-center size-[60px] relative overflow-hidden transition-colors duration-200`}
          style={{
            backgroundColor: activeButtons.has(3) ? '#E0F2FE' : hoveredButton === 3 ? '#f5f5f5' : 'transparent'
          }}
          custom={activeButtons.has(3)}
          onClick={() => handleButtonClick(3)}
          onTapStart={() => handleTapStart(3)}
          onTapEnd={handleTapEnd}
          onMouseEnter={() => setHoveredButton(3)}
          onMouseLeave={() => setHoveredButton(null)}
          {...animationProps}
        >
          {pressedButton === 3 && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
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
          <div className="scale-100">
            <MarginLineNew isActive={activeButtons.has(3) || hoveredButton === 3} />
          </div>
        </motion.div>

        {/* Button 4: Prep QC */}
        <motion.div 
          className={`rounded-[8px] cursor-pointer flex items-center justify-center size-[60px] relative overflow-hidden transition-colors duration-200`}
          style={{
            backgroundColor: activeButtons.has(4) ? '#E0F2FE' : hoveredButton === 4 ? '#f5f5f5' : 'transparent'
          }}
          custom={activeButtons.has(4)}
          onClick={() => handleButtonClick(4)}
          onTapStart={() => handleTapStart(4)}
          onTapEnd={handleTapEnd}
          onMouseEnter={() => setHoveredButton(4)}
          onMouseLeave={() => setHoveredButton(null)}
          {...animationProps}
        >
          {pressedButton === 4 && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
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
          <div className="scale-100">
            <PrepQcNew isActive={activeButtons.has(4) || hoveredButton === 4} />
          </div>
        </motion.div>

        {/* Button 5: Trim */}
        <motion.div 
          className={`rounded-[8px] cursor-pointer flex items-center justify-center size-[60px] relative overflow-hidden transition-colors duration-200`}
          style={{
            backgroundColor: activeButtons.has(5) ? '#E0F2FE' : hoveredButton === 5 ? '#f5f5f5' : 'transparent'
          }}
          custom={activeButtons.has(5)}
          onClick={() => handleButtonClick(5)}
          onTapStart={() => handleTapStart(5)}
          onTapEnd={handleTapEnd}
          onMouseEnter={() => setHoveredButton(5)}
          onMouseLeave={() => setHoveredButton(null)}
          {...animationProps}
        >
          {pressedButton === 5 && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
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
          <div className="scale-100">
            <TrimNew isActive={activeButtons.has(5) || hoveredButton === 5} />
          </div>
        </motion.div>
      </div>

      {/* Expand button */}
      <motion.div 
        className="bg-white h-full flex items-center justify-center px-[12px] cursor-pointer rounded-r-[4px] transition-all duration-200" 
        style={{ 
          border: `1px solid ${expandHovered ? '#009ACE' : '#E5E7EB'}`,
          backgroundColor: expandHovered ? '#f0f9ff' : 'transparent'
        }}
        onClick={() => onButtonClick(6)}
        onMouseEnter={() => setExpandHovered(true)}
        onMouseLeave={() => setExpandHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ExpandIcon />
      </motion.div>
    </div>
  );
}

// Expanded Toolbar - icons with text labels below (6 buttons)
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
  const [expandHovered, setExpandHovered] = useState(false);
  
  const animationProps = microAnimations ? {
    animate: (isActive: boolean) => ({
      scale: isActive ? 1.05 : 1,
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
    <div className="bg-white rounded-[4px] size-full flex items-center font-['Roboto'] p-[12px]">
      <div className="flex items-center gap-[8px] flex-1">
        {/* Button 0: Monochrome */}
        <motion.div 
          className={`rounded-[8px] px-[6px] cursor-pointer flex items-center gap-[6px] h-[60px] relative overflow-hidden transition-colors duration-200`}
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
              className="absolute inset-0 rounded-full pointer-events-none"
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
          <div className="w-[40px] h-[40px] flex items-center justify-center shrink-0">
            <div className="scale-[0.7]">
              <MonoChomrNew isActive={activeButtons.has(0) || hoveredButton === 0} />
            </div>
          </div>
          <p className="font-['Roboto'] text-[11px] leading-[14px] whitespace-nowrap" style={{ color: activeButtons.has(0) || hoveredButton === 0 ? '#008EC2' : '#000000' }}>Monochrome</p>
        </motion.div>

        {/* Button 1: Review Tool */}
        <motion.div 
          className={`rounded-[8px] px-[6px] cursor-pointer flex items-center gap-[6px] h-[60px] relative overflow-hidden transition-colors duration-200`}
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
              className="absolute inset-0 rounded-full pointer-events-none"
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
          <div className="w-[40px] h-[40px] flex items-center justify-center shrink-0">
            <div className="scale-[0.7]">
              <NiriIonNew isActive={activeButtons.has(1) || hoveredButton === 1} />
            </div>
          </div>
          <p className="font-['Roboto'] text-[11px] leading-[14px] whitespace-nowrap" style={{ color: activeButtons.has(1) || hoveredButton === 1 ? '#008EC2' : '#000000' }}>Review Tool</p>
        </motion.div>

        {/* Button 2: Occlusalgram */}
        <motion.div 
          className={`rounded-[8px] px-[6px] cursor-pointer flex items-center gap-[6px] h-[60px] relative overflow-hidden transition-colors duration-200`}
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
              className="absolute inset-0 rounded-full pointer-events-none"
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
          <div className="w-[40px] h-[40px] flex items-center justify-center shrink-0">
            <div className="scale-[0.7]">
              <OcculsgramNew isActive={activeButtons.has(2) || hoveredButton === 2} />
            </div>
          </div>
          <p className="font-['Roboto'] text-[11px] leading-[14px] whitespace-nowrap" style={{ color: activeButtons.has(2) || hoveredButton === 2 ? '#008EC2' : '#000000' }}>Occlusalgram</p>
        </motion.div>

        {/* Button 3: Margin Line */}
        <motion.div 
          className={`rounded-[8px] px-[6px] cursor-pointer flex items-center gap-[6px] h-[60px] relative overflow-hidden transition-colors duration-200`}
          style={{
            backgroundColor: activeButtons.has(3) ? '#E0F2FE' : hoveredButton === 3 ? '#f5f5f5' : 'transparent'
          }}
          custom={activeButtons.has(3)}
          onClick={() => handleButtonClick(3)}
          onTapStart={() => handleTapStart(3)}
          onTapEnd={handleTapEnd}
          onMouseEnter={() => setHoveredButton(3)}
          onMouseLeave={() => setHoveredButton(null)}
          {...animationProps}
        >
          {pressedButton === 3 && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
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
          <div className="w-[40px] h-[40px] flex items-center justify-center shrink-0">
            <div className="scale-[0.7]">
              <MarginLineNew isActive={activeButtons.has(3) || hoveredButton === 3} />
            </div>
          </div>
          <p className="font-['Roboto'] text-[11px] leading-[14px] whitespace-nowrap" style={{ color: activeButtons.has(3) || hoveredButton === 3 ? '#008EC2' : '#000000' }}>Margin line</p>
        </motion.div>

        {/* Button 4: Prep QC */}
        <motion.div 
          className={`rounded-[8px] px-[6px] cursor-pointer flex items-center gap-[6px] h-[60px] relative overflow-hidden transition-colors duration-200`}
          style={{
            backgroundColor: activeButtons.has(4) ? '#E0F2FE' : hoveredButton === 4 ? '#f5f5f5' : 'transparent'
          }}
          custom={activeButtons.has(4)}
          onClick={() => handleButtonClick(4)}
          onTapStart={() => handleTapStart(4)}
          onTapEnd={handleTapEnd}
          onMouseEnter={() => setHoveredButton(4)}
          onMouseLeave={() => setHoveredButton(null)}
          {...animationProps}
        >
          {pressedButton === 4 && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
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
          <div className="w-[40px] h-[40px] flex items-center justify-center shrink-0">
            <div className="scale-[0.7]">
              <PrepQcNew isActive={activeButtons.has(4) || hoveredButton === 4} />
            </div>
          </div>
          <p className="font-['Roboto'] text-[11px] leading-[14px] whitespace-nowrap" style={{ color: activeButtons.has(4) || hoveredButton === 4 ? '#008EC2' : '#000000' }}>Prep QC</p>
        </motion.div>

        {/* Button 5: Trim */}
        <motion.div 
          className={`rounded-[8px] px-[6px] cursor-pointer flex items-center gap-[6px] h-[60px] relative overflow-hidden transition-colors duration-200`}
          style={{
            backgroundColor: activeButtons.has(5) ? '#E0F2FE' : hoveredButton === 5 ? '#f5f5f5' : 'transparent'
          }}
          custom={activeButtons.has(5)}
          onClick={() => handleButtonClick(5)}
          onTapStart={() => handleTapStart(5)}
          onTapEnd={handleTapEnd}
          onMouseEnter={() => setHoveredButton(5)}
          onMouseLeave={() => setHoveredButton(null)}
          {...animationProps}
        >
          {pressedButton === 5 && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
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
          <div className="w-[40px] h-[40px] flex items-center justify-center shrink-0">
            <div className="scale-[0.7]">
              <TrimNew isActive={activeButtons.has(5) || hoveredButton === 5} />
            </div>
          </div>
          <p className="font-['Roboto'] text-[11px] leading-[14px] whitespace-nowrap" style={{ color: activeButtons.has(5) || hoveredButton === 5 ? '#008EC2' : '#000000' }}>Trim</p>
        </motion.div>
      </div>

      {/* Expand button */}
      <motion.div 
        className="bg-white h-full flex items-center justify-center px-[12px] cursor-pointer rounded-r-[4px] transition-all duration-200" 
        style={{ 
          border: `1px solid ${expandHovered ? '#009ACE' : '#E5E7EB'}`,
          backgroundColor: expandHovered ? '#f0f9ff' : 'transparent'
        }}
        onClick={() => onButtonClick(6)}
        onMouseEnter={() => setExpandHovered(true)}
        onMouseLeave={() => setExpandHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ExpandIcon />
      </motion.div>
    </div>
  );
}

// Main export that switches between collapsed and expanded
export function HorizontalViewToolbar({
  activeButtons,
  onButtonClick,
  microAnimations = true
}: {
  activeButtons: Set<number>;
  onButtonClick: (index: number) => void;
  microAnimations?: boolean;
}) {
  const isExpanded = activeButtons.has(6);

  return (
    <AnimatePresence mode="wait">
      {isExpanded ? (
        <motion.div
          key="expanded"
          initial={{ width: 'auto', opacity: 0, scale: 0.95 }}
          animate={{ width: 'auto', opacity: 1, scale: 1 }}
          exit={{ width: 'auto', opacity: 0, scale: 0.95 }}
          transition={{ 
            duration: 0.25,
            ease: "easeInOut"
          }}
        >
          <ExpandedToolbar 
            activeButtons={activeButtons} 
            onButtonClick={onButtonClick} 
            microAnimations={microAnimations} 
          />
        </motion.div>
      ) : (
        <motion.div
          key="collapsed"
          initial={{ width: 'auto', opacity: 0, scale: 0.95 }}
          animate={{ width: 'auto', opacity: 1, scale: 1 }}
          exit={{ width: 'auto', opacity: 0, scale: 0.95 }}
          transition={{ 
            duration: 0.25,
            ease: "easeInOut"
          }}
        >
          <CollapsedToolbar 
            activeButtons={activeButtons} 
            onButtonClick={onButtonClick} 
            microAnimations={microAnimations} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}