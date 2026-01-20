import React, { useState } from "react";

// Image URLs from Figma - Updated to latest design
const imgIcon = "https://www.figma.com/api/mcp/asset/b496beac-7b33-48d3-824e-6ab16f9b6788";
const imgIcon1 = "https://www.figma.com/api/mcp/asset/3663c295-b973-4224-a77a-e840c8303f0b";
const imgIcon2 = "https://www.figma.com/api/mcp/asset/f155490a-1971-434f-a082-63d8ad8e1232";
const imgIcon4 = "https://www.figma.com/api/mcp/asset/d842e333-1ded-4afe-b2f6-74e73ed00ac4";
const imgIcon5 = "https://www.figma.com/api/mcp/asset/d88d6fc6-3c93-4d92-9c50-4deea9376f86";
const imgIcon6 = "https://www.figma.com/api/mcp/asset/2feb583a-ccbc-42eb-8664-2d4d6553dad4";

// Magic wand / Select icon for Detect button
function DetectIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M18.7462 19.2287C18.3494 19.6658 17.6622 19.6658 17.2654 19.2287L11.4031 12.771C11.057 12.3898 11.057 11.808 11.4031 11.4267L12.0926 10.6672C12.4895 10.23 13.1766 10.23 13.5735 10.6672L19.4357 17.1249C19.7818 17.5061 19.7818 18.0879 19.4357 18.4691L18.7462 19.2287Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M9.79109 10.0996C9.23978 10.6195 8.37873 10.6195 7.82743 10.0996L6.78553 9.11695C6.18661 8.55211 6.18661 7.59964 6.78553 7.0348L7.64855 6.22088C8.19986 5.70095 9.06091 5.70095 9.61222 6.22088L10.6541 7.20349C11.253 7.76833 11.253 8.7208 10.6541 9.28564L9.79109 10.0996Z" fill="white"/>
      <path d="M7.65918 11.5928C7.99395 11.6539 8.21842 11.9607 8.16016 12.2773L7.56152 15.5215C7.50271 15.8378 7.18417 16.0445 6.84961 15.9834C6.51502 15.9222 6.29155 15.6163 6.34961 15.2998L6.94727 12.0566C7.00567 11.7401 7.32449 11.5319 7.65918 11.5928ZM4.26855 8.65137C4.6039 8.59585 4.91728 8.80887 4.96875 9.12695C5.01971 9.44487 4.78931 9.74794 4.4541 9.80371L0.707031 10.4268C0.371786 10.4823 0.0584469 10.2691 0.00683594 9.95117C-0.0444096 9.63316 0.185272 9.33032 0.520508 9.27441L4.26855 8.65137ZM15.5811 3.99805C15.8806 3.84699 16.2417 3.96218 16.3877 4.25488C16.5334 4.54753 16.4088 4.9065 16.1094 5.05762L12.9072 6.67383C12.6077 6.8249 12.2457 6.7105 12.0996 6.41797C11.9538 6.12527 12.0794 5.76538 12.3789 5.61426L15.5811 3.99805ZM2.04102 2.0127C2.27552 1.7788 2.65558 1.77927 2.88965 2.01367L5.66504 4.79297C5.89881 5.02734 5.89904 5.4075 5.66504 5.6416C5.43073 5.87557 5.0506 5.87556 4.81641 5.6416L2.04004 2.86133C1.80608 2.62683 1.8066 2.24678 2.04102 2.0127ZM10.96 0.0253906C11.287 0.118937 11.4774 0.44518 11.3848 0.753906L10.3838 4.08887C10.2911 4.39748 9.94999 4.57184 9.62305 4.47852C9.29631 4.38479 9.1066 4.05857 9.19922 3.75L10.2002 0.415039C10.2929 0.106329 10.6329 -0.068118 10.96 0.0253906Z" fill="white"/>
    </svg>
  );
}

// --- Margin Line Panel Components (Updated to match Figma design) ---
function Container() {
  return (
    <div className="border-[#f3f4f6] border-b border-solid h-[73px] relative shrink-0 w-full" data-name="Container" data-node-id="138:21992">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-px pt-0 px-[24px] relative size-full">
        <div className="h-[30px] relative shrink-0 w-[123.633px]" data-name="Container" data-node-id="138:21993">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
            {/* Drag Handle */}
            <div className="relative shrink-0 size-[11px]" data-name="Container" data-node-id="138:21994">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3px] items-start relative size-full">
                <div className="h-[4px] relative shrink-0 w-[11px]" data-name="Container" data-node-id="138:21995">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[3px] items-start relative size-full">
                    <div className="bg-[#99a1af] rounded-[16777200px] shrink-0 size-[4px]" data-name="Container" data-node-id="138:21996" />
                    <div className="bg-[#99a1af] flex-[1_0_0] h-[4px] min-h-px min-w-px rounded-[16777200px]" data-name="Container" data-node-id="138:21997" />
                  </div>
                </div>
                <div className="flex-[1_0_0] min-h-px min-w-px relative w-[11px]" data-name="Container" data-node-id="138:21998">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[3px] items-start relative size-full">
                    <div className="bg-[#99a1af] rounded-[16777200px] shrink-0 size-[4px]" data-name="Container" data-node-id="138:21999" />
                    <div className="bg-[#99a1af] flex-[1_0_0] h-[4px] min-h-px min-w-px rounded-[16777200px]" data-name="Container" data-node-id="138:22000" />
                  </div>
                </div>
              </div>
            </div>
            {/* Title */}
            <div className="flex-[1_0_0] h-[30px] min-h-px min-w-px relative" data-name="Heading 2" data-node-id="138:22001">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[30px] left-0 not-italic text-[#1e2939] text-[20px] top-0 tracking-[-0.4492px]" data-node-id="138:22002">
                  Margin line
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Close Button */}
        <div 
          className="relative rounded-[10px] shrink-0 size-[32px] cursor-pointer transition-all duration-200 hover:bg-[#f3f4f6]" 
          data-name="Button" 
          data-node-id="138:22003"
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="relative shrink-0 size-[20px]" data-name="Icon" data-node-id="138:22004">
            <img alt="" className="block max-w-none size-full" src={imgIcon} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowButton({ direction, imgSrc }: { direction: 'left' | 'right'; imgSrc: string }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="border border-solid relative rounded-[8px] shrink-0 size-[48px] cursor-pointer transition-all duration-200" 
      data-name="Button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        borderColor: isHovered ? '#009ACE' : '#e5e7eb',
        backgroundColor: isHovered ? '#f0f9ff' : 'transparent',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
      }}
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <div className="relative shrink-0 size-[24px]" data-name="Icon">
          <img alt="" className="block max-w-none size-full" src={imgSrc} />
        </div>
      </div>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[84px] relative shrink-0 w-full" data-name="Container" data-node-id="138:22007">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pl-0 pr-[0.008px] py-0 relative size-full">
        {/* Left Arrow Button */}
        <ArrowButton direction="left" imgSrc={imgIcon1} />
        {/* Tooth Info */}
        <div className="h-[84px] relative shrink-0 w-[69.086px]" data-name="Container" data-node-id="138:22011">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center relative size-full">
            <div className="h-[16px] relative shrink-0 w-[43.961px]" data-name="Paragraph" data-node-id="138:22012">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-px tracking-[0.3px] uppercase" data-node-id="138:22013">
                  TOOTH
                </p>
              </div>
            </div>
            <div className="flex-[1_0_0] min-h-px min-w-px relative w-[35.297px]" data-name="Paragraph" data-node-id="138:22014">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[40px] left-0 not-italic text-[#101828] text-[36px] top-[0.5px] tracking-[0.3691px]" data-node-id="138:22015">
                  11
                </p>
              </div>
            </div>
            <div className="h-[20px] relative shrink-0 w-[69.086px]" data-name="Paragraph" data-node-id="138:22016">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[0.5px] tracking-[-0.1504px]" data-node-id="138:22017">
                  Upper Jaw
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Right Arrow Button */}
        <ArrowButton direction="right" imgSrc={imgIcon2} />
      </div>
    </div>
  );
}

function PrimaryButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative rounded-[8px] shrink-0 w-full cursor-pointer transition-all duration-200" 
      data-name="Button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        backgroundColor: isHovered ? '#0088B8' : '#009ace',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovered ? '0 4px 12px rgba(0, 154, 206, 0.3)' : 'none'
      }}
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[16px] relative w-full">
        <div className="content-stretch flex gap-[15px] items-center relative shrink-0">
          <div className="relative shrink-0 size-[24px] flex items-center justify-center" data-name="Icon">
            {icon}
          </div>
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[18px] text-center text-white tracking-[-0.4395px]">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label }: { icon: string; label: string }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="border border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] h-[80px] items-center justify-center min-h-px min-w-px p-px relative rounded-[8px] cursor-pointer transition-all duration-200" 
      data-name="Button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        backgroundColor: isHovered ? '#f0f9ff' : 'white',
        borderColor: isHovered ? '#009ACE' : '#e5e7eb',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 4px 8px rgba(0, 0, 0, 0.08)' : 'none'
      }}
    >
      <div className="relative shrink-0 size-[24px]" data-name="Icon">
        <img alt="" className="block max-w-none size-full" src={icon} />
      </div>
      <p 
        className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic text-[14px] text-center tracking-[-0.1504px] transition-colors duration-200"
        style={{ color: isHovered ? '#009ACE' : '#364153' }}
      >
        {label}
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Container" data-node-id="138:22021">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        {/* Detect Button */}
        <PrimaryButton icon={<DetectIcon />} label="Detect" />
        {/* Action Buttons Row */}
        <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Container" data-node-id="138:22076">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
            <ActionButton icon={imgIcon4} label="Draw" />
            <ActionButton icon={imgIcon5} label="Undo" />
            <ActionButton icon={imgIcon6} label="Clear" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewToolHeader() {
  return (
    <div className="bg-[#00adef] relative shrink-0 w-full" data-name="Review Tool Header">
      <div aria-hidden="true" className="absolute border-[#0099d6] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pb-[17px] pt-[16px] px-[16px] relative w-full">
          <div className="h-[22.5px] relative shrink-0">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[22.5px] relative">
              <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[30px] left-0 text-[24px] text-nowrap text-white top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                Review Tool
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Review Tool Images Components - SVG Placeholders that STRETCH
function ReviewToolImages() {
  return (
    <div className="w-full h-full bg-white flex flex-col" data-name="Review Tool Images">
      {/* Container fills ALL available height and splits evenly between two images */}
      <div className="flex-1 min-h-0 flex flex-col gap-[8px] p-[16px]">
        
        {/* First Placeholder - Color Image - STRETCHES to fill 50% of available height */}
        <div className="w-full flex-1 min-h-0 rounded-[4px] overflow-hidden bg-gradient-to-br from-cyan-50 to-cyan-100 border-2 border-cyan-300 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
            <rect width="400" height="300" fill="url(#gradient1)" />
            <circle cx="200" cy="150" r="60" fill="white" opacity="0.2" />
            <text x="200" y="140" textAnchor="middle" fill="#0891b2" fontSize="28" fontWeight="bold">Color Image</text>
            <text x="200" y="175" textAnchor="middle" fill="#06b6d4" fontSize="18">Upper Arch View</text>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#cffafe" />
                <stop offset="100%" stopColor="#a5f3fc" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Second Placeholder - NIRI Image - STRETCHES to fill 50% of available height */}
        <div className="w-full flex-1 min-h-0 rounded-[4px] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
            <rect width="400" height="300" fill="url(#gradient2)" />
            <circle cx="200" cy="150" r="60" fill="white" opacity="0.2" />
            <text x="200" y="140" textAnchor="middle" fill="#475569" fontSize="28" fontWeight="bold">NIRI Scan</text>
            <text x="200" y="175" textAnchor="middle" fill="#64748b" fontSize="18">Lower Arch View</text>
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

/**
 * Combined Responsive Panel
 * 1. Margin Panel: shrink-0 (Natural height)
 * 2. Review Panel: flex-1 (Fills remaining height)
 * 3. Images: absolute/inset-0 (Forced to fit container size exactly)
 */
export default function CombinedReviewMarginPanel() {
  return (
    <div 
      className="flex flex-col p-[16px] relative w-[432px] bg-[#f5f5f5] rounded-[4px] shadow-lg gap-[16px]" 
      style={{ height: 'calc(100vh - 109px)' }}
      data-name="Combined Review Margin Panel"
    >
      
      {/* Margin Line Section - Updated to match exact Figma design */}
      <div className="bg-white content-stretch flex flex-col items-start relative rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-full shrink-0 w-[240px]" data-name="MarginLinePanel" data-node-id="138:21991" style={{ width: '240px', minWidth: '240px', maxWidth: '240px' }}>
        <Container />
        <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Container" data-node-id="138:22006">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[32px] items-start px-[24px] py-[32px] relative size-full">
            <ListItem />
            <Frame />
          </div>
        </div>
      </div>
      
      {/* Review Tool Section - STRETCHES TO FILL ALL REMAINING HEIGHT */}
      <div className="w-full flex-1 min-h-0 rounded-[4px] overflow-hidden shadow-md bg-white flex flex-col">
        <div className="shrink-0">
          <ReviewToolHeader />
        </div>
        {/* Images Container - Fills all remaining space and stretches */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ReviewToolImages />
        </div>
      </div>
    </div>
  );
}