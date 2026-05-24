import React, { useState } from "react";
import { motion } from "motion/react";
import svgPaths from "./svg-76kjqgrbiw";

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
      className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px] cursor-pointer overflow-hidden transition-colors duration-200"
      style={{
        backgroundColor: isActive ? 'var(--ads-background-highlight-blue)' : isHovered ? 'var(--ads-background-subtle-02)' : 'transparent'
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
      <div className="relative flex items-center justify-center size-[40px]">
        <MonoChomrNew isActive={isActive || isHovered} />
      </div>
    </motion.div>
  );
}

// Feedback Icon
function TrimArea1() {
  return (
    <div className="absolute inset-[18.33%_8.33%_16.67%_8.33%]" data-name="trim area">
      <div className="absolute bottom-0 left-0 right-0 top-[-2.65%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 41">
          <g id="trim area">
            <path d={svgPaths.p1f4faa00} fill="var(--fill-0, var(--ads-background-highlight-red))" id="Vector" />
            <path d={svgPaths.p161588f0} fill="var(--fill-0, white)" id="Vector_2" stroke="var(--stroke-0, var(--ads-text-primary))" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.06414" />
            <path d={svgPaths.p1031d180} fill="var(--fill-0, var(--ads-background-interactive-hover))" id="Vector_3" stroke="var(--stroke-0, white)" strokeMiterlimit="10" strokeWidth="2.06414" />
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
  const strokeColor = isActive ? "var(--ads-background-interactive-hover)" : "var(--ads-icon-secondary)";
  
  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Feedback new">
      <svg width="28" height="28" viewBox="0 0 101 99" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M90.3583 46.7358C93.8373 40.5116 96.176 33.215 95.5426 26.0479C94.6893 16.3981 88.2465 7.08327 79.0171 3.43773C73.8585 1.42646 68.1052 1.47682 62.9836 3.57798C61.0873 4.37708 59.4418 5.40557 57.7623 6.54499C54.2175 8.94917 50.9158 11.7141 46.388 9.86402C44.4754 9.08249 42.6568 7.8091 40.966 6.60804C36.6602 3.5496 32.3282 1.71866 26.9254 1.8078C19.8037 2.06645 14.171 4.51851 9.29872 9.69409C4.2059 15.0511 1.51447 22.1976 1.82954 29.527C2.10932 36.2737 4.70087 42.8442 8.3107 48.5245C9.19907 49.9224 10.3284 51.2982 11.1578 52.6678C11.8177 53.7578 12.3046 54.9623 12.7453 56.1515C15.992 64.9122 19.26 87.4375 25.5912 93.1645C27.1518 94.5759 29.2232 95.392 31.3539 95.2933C33.4763 95.1952 35.3838 94.2715 36.7985 92.7209C37.614 91.8266 38.2381 90.7614 38.7358 89.6691C39.7679 87.4028 40.4139 84.9197 41.0576 82.5224C41.6155 80.4635 42.9915 76.8608 43.512 74.7925"
          stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M73.6341 96.8046C87.3907 96.8046 98.5427 85.6527 98.5427 71.8961C98.5427 58.1395 87.3907 46.9875 73.6341 46.9875C59.8775 46.9875 48.7256 58.1395 48.7256 71.8961C48.7256 85.6527 59.8775 96.8046 73.6341 96.8046Z"
          stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M73.6341 60.5L73.6341 75" stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M73.6341 83.5H73.6386" stroke={strokeColor} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
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
      className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px] cursor-pointer overflow-hidden transition-colors duration-200"
      style={{
        backgroundColor: isActive ? 'var(--ads-background-highlight-blue)' : isHovered ? 'var(--ads-background-subtle-02)' : 'transparent'
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
      <div className="relative flex items-center justify-center size-[40px]">
        <FeedbackNew isActive={isActive || isHovered} />
      </div>
    </motion.div>
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
              <path d={svgPaths.p2b201d80} fill="var(--fill-0, var(--ads-background-highlight-red))" id="Vector" />
              <path d={svgPaths.p16a0d0e0} fill="var(--fill-0, white)" id="Vector_2" stroke="var(--stroke-0, var(--ads-text-primary))" strokeMiterlimit="10" strokeWidth="1.4" />
            </g>
            <g id="Shape">
              <path d={svgPaths.pabd600} fill="var(--fill-0, var(--ads-background-interactive))" />
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
  const strokeColor = isActive ? "var(--ads-background-interactive-hover)" : "var(--ads-icon-secondary)";
  
  return (
    <div className="relative shrink-0 size-[40px] flex items-center justify-center" data-name="Prep edit to test">
      <svg width="28" height="28" viewBox="0 0 29 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21.633 12.5V5.52943C21.633 4.42341 21.1817 3.33988 20.2539 2.73775C15.6477 -0.251733 8.60112 -0.245909 4.3379 2.75524C3.49179 3.35088 3.10092 4.37316 3.10092 5.4079V9.96671C3.10092 12.3399 2.75447 14.7004 2.07254 16.9735L0.647546 21.7235C0.348125 22.7215 0.509384 23.8011 1.08739 24.6682C1.73597 25.641 2.82842 26.2254 3.99767 26.2254C7.25926 26.2254 9.40805 26.2254 12.6748 26.2254"
          stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
        <path
          d="M27.1585 16.5077C27.489 16.1774 27.6746 15.7293 27.6747 15.262C27.6747 14.7948 27.4892 14.3466 27.1588 14.0162C26.8285 13.6857 26.3804 13.5001 25.9131 13.5C25.4459 13.4999 24.9977 13.6855 24.6673 14.0159L16.326 22.359C16.1809 22.5037 16.0736 22.6818 16.0135 22.8777L15.1879 25.5977C15.1717 25.6518 15.1705 25.7092 15.1844 25.7639C15.1982 25.8186 15.2266 25.8685 15.2665 25.9084C15.3064 25.9482 15.3564 25.9765 15.4111 25.9903C15.4658 26.004 15.5232 26.0027 15.5773 25.9865L18.2979 25.1615C18.4936 25.102 18.6717 24.9953 18.8166 24.8509L27.1585 16.5077Z"
          stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M23.2998 15.3752L25.7998 17.8752" stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
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
      className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px] cursor-pointer overflow-hidden transition-colors duration-200"
      style={{
        backgroundColor: isActive ? 'var(--ads-background-highlight-blue)' : isHovered ? 'var(--ads-background-subtle-02)' : 'transparent'
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
      <div className="relative flex items-center justify-center size-[40px]">
        <PrepEditToTest isActive={isActive || isHovered} />
      </div>
    </motion.div>
  );
}

// Chevron Icon - points left when collapsed, right when expanded (for vertical toolbar)
function ChevronIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <motion.div 
      className="relative shrink-0 size-[32px]" 
      data-name="ChevronIcon"
      animate={{ 
        rotate: isExpanded ? 90 : -90,
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
          stroke="var(--ads-text-secondary)" 
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
      className="content-stretch flex size-[40px] items-center justify-center relative rounded-[8px] shrink-0 transition-all duration-200" 
      data-name="Button"
      style={{ 
        border: `1px solid ${isHovered ? 'var(--ads-background-interactive)' : 'var(--ads-border-subtle)'}`,
        backgroundColor: isHovered ? 'var(--ads-background-highlight-blue)' : 'transparent'
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
      className="content-stretch flex flex-col items-center justify-between relative rounded-[8px] size-[40px] cursor-pointer overflow-hidden" 
      data-name="AOHS button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div aria-hidden="true" className="absolute border-0 border-[var(--ads-background-interactive)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Button isExpanded={isExpanded} isHovered={isHovered} />
    </motion.div>
  );
}

export default function Toolbar({ activeButtons, onButtonClick, microAnimations = true }: { activeButtons: Set<number>; onButtonClick: (index: number) => void; microAnimations?: boolean }) {
  return (
    <div className="bg-[var(--ads-background-subtle-01)] content-stretch flex flex-col gap-[4px] items-stretch p-[4px] relative w-[48px] rounded-[8px] font-['Roboto']" data-name="Toolbar">
      <AohsButton isActive={activeButtons.has(0)} onClick={() => onButtonClick(0)} buttonIndex={0} />
      <AohsButton1 isActive={activeButtons.has(1)} onClick={() => onButtonClick(1)} buttonIndex={1} />
      <AohsButton2 isActive={activeButtons.has(2)} onClick={() => onButtonClick(2)} buttonIndex={2} />
      <AohsButton3 onClick={() => onButtonClick(3)} isExpanded={false} />
    </div>
  );
}
