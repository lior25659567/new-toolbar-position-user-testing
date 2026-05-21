import React from "react";
import { PrimaryButton as DSPrimaryButton, SecondaryButton as DSSecondaryButton } from "../design-system";
import niriImage from "../assets/button-images/review-tool/Niri.png";
import colorImage from "../assets/button-images/review-tool/Color.png";

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
    <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M18.7462 19.2287C18.3494 19.6658 17.6622 19.6658 17.2654 19.2287L11.4031 12.771C11.057 12.3898 11.057 11.808 11.4031 11.4267L12.0926 10.6672C12.4895 10.23 13.1766 10.23 13.5735 10.6672L19.4357 17.1249C19.7818 17.5061 19.7818 18.0879 19.4357 18.4691L18.7462 19.2287Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M9.79109 10.0996C9.23978 10.6195 8.37873 10.6195 7.82743 10.0996L6.78553 9.11695C6.18661 8.55211 6.18661 7.59964 6.78553 7.0348L7.64855 6.22088C8.19986 5.70095 9.06091 5.70095 9.61222 6.22088L10.6541 7.20349C11.253 7.76833 11.253 8.7208 10.6541 9.28564L9.79109 10.0996Z" fill="white"/>
      <path d="M7.65918 11.5928C7.99395 11.6539 8.21842 11.9607 8.16016 12.2773L7.56152 15.5215C7.50271 15.8378 7.18417 16.0445 6.84961 15.9834C6.51502 15.9222 6.29155 15.6163 6.34961 15.2998L6.94727 12.0566C7.00567 11.7401 7.32449 11.5319 7.65918 11.5928ZM4.26855 8.65137C4.6039 8.59585 4.91728 8.80887 4.96875 9.12695C5.01971 9.44487 4.78931 9.74794 4.4541 9.80371L0.707031 10.4268C0.371786 10.4823 0.0584469 10.2691 0.00683594 9.95117C-0.0444096 9.63316 0.185272 9.33032 0.520508 9.27441L4.26855 8.65137ZM15.5811 3.99805C15.8806 3.84699 16.2417 3.96218 16.3877 4.25488C16.5334 4.54753 16.4088 4.9065 16.1094 5.05762L12.9072 6.67383C12.6077 6.8249 12.2457 6.7105 12.0996 6.41797C11.9538 6.12527 12.0794 5.76538 12.3789 5.61426L15.5811 3.99805ZM2.04102 2.0127C2.27552 1.7788 2.65558 1.77927 2.88965 2.01367L5.66504 4.79297C5.89881 5.02734 5.89904 5.4075 5.66504 5.6416C5.43073 5.87557 5.0506 5.87556 4.81641 5.6416L2.04004 2.86133C1.80608 2.62683 1.8066 2.24678 2.04102 2.0127ZM10.96 0.0253906C11.287 0.118937 11.4774 0.44518 11.3848 0.753906L10.3838 4.08887C10.2911 4.39748 9.94999 4.57184 9.62305 4.47852C9.29631 4.38479 9.1066 4.05857 9.19922 3.75L10.2002 0.415039C10.2929 0.106329 10.6329 -0.068118 10.96 0.0253906Z" fill="white"/>
    </svg>
  );
}

// --- Margin Line Panel Components (Updated to match Figma design) ---
function Container() {
  return (
    <div
      className="relative shrink-0 w-full"
      data-name="Container"
      style={{
        height: '56px',
        borderBottom: '1px solid var(--ads-border-subtle)',
      }}
    >
      <div className="content-stretch flex items-center justify-between px-[16px] relative size-full">
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--ads-font-sans)',
            fontWeight: 500,
            fontSize: '17px',
            lineHeight: '24px',
            color: 'var(--ads-text-primary)',
          }}
        >
          Margin line
        </p>
        {/* Close Button */}
        <div
          className="relative shrink-0 size-[32px] cursor-pointer transition-all duration-200"
          data-name="Button"
          style={{
            borderRadius: 'var(--ads-radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="relative shrink-0 size-[20px]" data-name="Icon">
            <img alt="" className="block max-w-none size-full" src={imgIcon} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowButton({ direction, imgSrc }: { direction: 'left' | 'right'; imgSrc: string }) {
  return (
    <DSSecondaryButton
      size={44}
      style={{ width: 44, height: 44, padding: 0, minWidth: 44 }}
      aria-label={direction === 'left' ? 'Previous tooth' : 'Next tooth'}
    >
      <img alt="" style={{ width: 20, height: 20, display: 'block' }} src={imgSrc} />
    </DSSecondaryButton>
  );
}

function ListItem() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container" style={{ height: '84px' }}>
      <div className="content-stretch flex items-center justify-between relative size-full">
        {/* Left Arrow Button */}
        <ArrowButton direction="left" imgSrc={imgIcon1} />
        {/* Tooth Info */}
        <div className="flex flex-col items-center justify-center gap-[2px]">
          <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--ads-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--ads-font-sans)', lineHeight: '16px' }}>
            TOOTH
          </span>
          <span style={{ fontSize: '28px', fontWeight: 500, color: 'var(--ads-text-primary)', lineHeight: '32px', fontFamily: 'var(--ads-font-sans)' }}>
            11
          </span>
          <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--ads-text-muted)', lineHeight: '20px', fontFamily: 'var(--ads-font-sans)' }}>
            Upper Jaw
          </span>
        </div>
        {/* Right Arrow Button */}
        <ArrowButton direction="right" imgSrc={imgIcon2} />
      </div>
    </div>
  );
}

function PanelDetectButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <DSPrimaryButton size={44} fullWidth>
      {icon}
      {label}
    </DSPrimaryButton>
  );
}

function ActionButton({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ flex: '1 0 0', minWidth: 0 }}>
      <DSSecondaryButton size={44} fullWidth>
        <img alt="" style={{ width: 20, height: 20, display: 'block' }} src={icon} />
        {label}
      </DSSecondaryButton>
    </div>
  );
}

function Frame() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Container" data-node-id="138:22021">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        {/* Detect Button */}
        <PanelDetectButton icon={<DetectIcon />} label="Detect" />
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
    <div
      className="relative shrink-0 w-full"
      data-name="Review Tool Header"
      style={{
        backgroundColor: 'var(--ads-blue-500)',
        borderBottom: '1px solid var(--ads-blue-600)',
      }}
    >
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] py-[16px] relative w-full">
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--ads-font-sans)',
              fontWeight: 500,
              fontSize: '20px',
              lineHeight: '28px',
              color: 'var(--ads-text-on-primary)',
              whiteSpace: 'nowrap',
            }}
          >
            Review Tool
          </p>
        </div>
      </div>
    </div>
  );
}

// Review Tool Images Components - SVG Placeholders that STRETCH
function ReviewToolImages() {
  return (
    <div className="w-full h-full bg-[var(--ads-background-subtle-01)] flex flex-col" data-name="Review Tool Images">
      {/* Container fills ALL available height and splits evenly between two images */}
      <div className="flex-1 min-h-0 flex flex-col gap-[8px] p-[16px]">
        
        {/* NIRI Image */}
        <div className="w-full flex-1 min-h-0 overflow-hidden" style={{ borderRadius: 'var(--ads-radius-sm)', backgroundColor: 'var(--ads-bg-inverse)' }}>
          <img src={niriImage} alt="NIRI Scan" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>

        {/* Color Image */}
        <div className="w-full flex-1 min-h-0 overflow-hidden" style={{ borderRadius: 'var(--ads-radius-sm)', backgroundColor: 'var(--ads-bg-inverse)' }}>
          <img src={colorImage} alt="Color Capture" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
      className="flex flex-col p-[16px] relative w-[432px] bg-[var(--ads-background-subtle-02)] rounded-[8px] gap-[16px]"
      style={{ boxShadow: 'var(--ads-shadow-sm)', height: 'calc(100vh - 88px)' }}
      data-name="Combined Review Margin Panel"
    >
      
      {/* Margin Line Section — natural height so it leaves room for review tool */}
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-[240px]" data-name="MarginLinePanel" style={{ width: '240px', minWidth: '240px', maxWidth: '240px', borderRadius: 'var(--ads-radius-sm)', backgroundColor: 'var(--ads-bg-surface)', boxShadow: 'var(--ads-shadow-sm)' }}>
        <Container />
        <div className="relative w-full" data-name="Container">
          <div className="content-stretch flex flex-col gap-[16px] items-start px-[16px] py-[16px] relative w-full">
            <ListItem />
            <Frame />
          </div>
        </div>
      </div>

      {/* Review Tool Section - fills remaining height */}
      <div className="w-full flex-1 min-h-0 overflow-hidden flex flex-col" style={{ borderRadius: 'var(--ads-radius-sm)', backgroundColor: 'var(--ads-bg-surface)', boxShadow: 'var(--ads-shadow-sm)' }}>
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