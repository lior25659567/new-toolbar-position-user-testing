import React from 'react';
import svgPaths from '@/imports/svg-tl25ixc7nv';
import jawNavigationImage from '@/assets/jaw-selector-lower.png';

// ============================================================================
// HEADER NAVIGATION COMPONENT
// ============================================================================
// This component contains the top navigation header with wizard steps,
// patient info, and navigation icons
// ============================================================================

type WizardStep = 'info' | 'scan' | 'view' | 'send';

interface HeaderNavigationProps {
  currentStep?: WizardStep;
  patientName?: string;
  onStepChange?: (step: WizardStep) => void;
}

// ============================================================================
// Logo Components
// ============================================================================

function Logo2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[70.182px]" data-name="Logo">
      <div className="absolute inset-[-16.67%_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70.182 28">
          <g id="Logo">
            <g id="Vector">
              <path d={svgPaths.p26fe6970} fill="var(--fill-0, black)" fillOpacity="0.93" />
              <path d={svgPaths.p4976f80} fill="var(--fill-0, black)" fillOpacity="0.93" />
              <path d={svgPaths.pafff0f2} fill="var(--fill-0, black)" fillOpacity="0.93" />
              <path d={svgPaths.p36e5d100} fill="var(--fill-0, black)" fillOpacity="0.93" />
              <path d={svgPaths.p4166a00} fill="var(--fill-0, black)" fillOpacity="0.93" />
              <path d={svgPaths.p3a0bb800} fill="var(--fill-0, black)" fillOpacity="0.93" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function Logo1() {
  return (
    <div className="flex flex-col items-center justify-end relative shrink-0 w-full" data-name="Logo">
      <Logo2 />
    </div>
  );
}

function Logo() {
  return (
    <div className="flex flex-col items-start justify-center overflow-clip px-[2px] py-[16px] relative shrink-0 w-[75px]" data-name="Logo">
      <Logo1 />
    </div>
  );
}

function LeftGroup({ patientName }: { patientName: string }) {
  return (
    <div className="flex gap-[4px] items-center shrink-0" data-name="Left group">
      <Logo />
    </div>
  );
}

function Dropdown({ patientName }: { patientName: string }) {
  return (
    <div className="flex gap-[8px] items-center overflow-clip px-[16px] py-[12px] relative rounded-[4px] shrink-0" data-name="Dropdown">
    </div>
  );
}

function Frame({ patientName }: { patientName: string }) {
  return (
    <div className="flex items-center shrink-0">
      <LeftGroup patientName={patientName} />
      <Dropdown patientName={patientName} />
    </div>
  );
}

// ============================================================================
// Wizard Step Components
// ============================================================================

function StepName({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 flex items-center justify-center shrink-0 flex-shrink-0 w-full" data-name="Name" style={{ width: '176px', minWidth: '176px', maxWidth: '176px', height: '64px', minHeight: '64px', flexShrink: 0 }}>
      <p className="font-['Roboto:Medium',sans-serif] font-medium text-[18px] text-[rgba(0,0,0,0.93)] text-center leading-[24px] whitespace-nowrap w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        {children}
      </p>
    </div>
  );
}

function StepNameActive({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 flex items-center justify-center shrink-0 flex-shrink-0 w-full" data-name="Name" style={{ width: '176px', minWidth: '176px', maxWidth: '176px', height: '64px', minHeight: '64px', flexShrink: 0 }}>
      <p className="font-['Roboto:Medium',sans-serif] font-medium text-[18px] text-white text-center leading-[24px] whitespace-nowrap w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        {children}
      </p>
    </div>
  );
}

function CompleteStep({ label, onClick }: { label: string; onClick?: () => void }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div 
      className="flex items-center justify-center relative shrink-0 flex-shrink-0 cursor-pointer transition-all duration-200" 
      data-name="complete" 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        width: '176px', minWidth: '176px', maxWidth: '176px', height: '64px', minHeight: '64px', flexShrink: 0,
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        filter: isHovered ? 'brightness(0.97)' : 'brightness(1)'
      }}
    >
      <div className="absolute inset-0" data-name="back">
        <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 180 72">
          <path d={svgPaths.p2106e100} fill={isHovered ? "#E8E8E8" : "#F4F4F4"} stroke="white" strokeWidth="4" style={{ transition: 'fill 0.2s ease' }} />
        </svg>
      </div>
      <StepName>{label}</StepName>
    </div>
  );
}

function CurrentStep({ label, onClick }: { label: string; onClick?: () => void }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div 
      className="flex items-center justify-center relative shrink-0 flex-shrink-0 cursor-pointer transition-all duration-200" 
      data-name="current" 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        width: '176px', minWidth: '176px', maxWidth: '176px', height: '64px', minHeight: '64px', flexShrink: 0,
        transform: isHovered ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      <div className="absolute inset-0" data-name="back">
        <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 180 72">
          <path d={svgPaths.p2106e100} fill={isHovered ? "#0088B8" : "#009ACE"} stroke="white" strokeWidth="4" style={{ transition: 'fill 0.2s ease' }} />
        </svg>
      </div>
      <StepNameActive>{label}</StepNameActive>
    </div>
  );
}

function IncompleteStep({ label, onClick }: { label: string; onClick?: () => void }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div 
      className="flex items-center justify-center relative shrink-0 flex-shrink-0 cursor-pointer transition-all duration-200" 
      data-name="incomplete" 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        width: '176px', minWidth: '176px', maxWidth: '176px', height: '64px', minHeight: '64px', flexShrink: 0,
        transform: isHovered ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      <div className="absolute inset-0" data-name="back">
        <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 180 72">
          <path d={svgPaths.p2106e100} fill={isHovered ? "#FAFAFA" : "white"} stroke={isHovered ? "#C0C0C0" : "#E0E0E0"} strokeWidth="2" style={{ transition: 'all 0.2s ease' }} />
        </svg>
      </div>
      <StepName>{label}</StepName>
    </div>
  );
}

function WizardTopbar({ currentStep, onStepChange }: { currentStep: WizardStep; onStepChange?: (step: WizardStep) => void }) {
  const steps: { key: WizardStep; label: string; order: number }[] = [
    { key: 'info', label: 'Info', order: 0 },
    { key: 'scan', label: 'Scan', order: 1 },
    { key: 'view', label: 'View', order: 2 },
    { key: 'send', label: 'Send', order: 3 },
  ];

  const currentOrder = steps.find(s => s.key === currentStep)?.order ?? 1;

  return (
    <div className="flex items-center justify-center shrink-0 w-full" data-name="./Wizard topbar" style={{ height: '64px', minHeight: '64px' }}>
      <div className="flex items-center justify-center shrink-0">
        {steps.map((step, index) => {
          const zIndex = 4 - index;
          const StepWrapper = ({ children }: { children: React.ReactNode }) => (
            <div className="flex items-center relative shrink-0 flex-shrink-0" data-name="./ Wizard lables" style={{ zIndex, marginRight: '-32px' }}>
              {children}
            </div>
          );

          if (step.order < currentOrder) {
            return (
              <StepWrapper key={step.key}>
                <CompleteStep label={step.label} onClick={() => onStepChange?.(step.key)} />
              </StepWrapper>
            );
          } else if (step.order === currentOrder) {
            return (
              <StepWrapper key={step.key}>
                <CurrentStep label={step.label} onClick={() => onStepChange?.(step.key)} />
              </StepWrapper>
            );
          } else {
            return (
              <StepWrapper key={step.key}>
                <IncompleteStep label={step.label} onClick={() => onStepChange?.(step.key)} />
              </StepWrapper>
            );
          }
        })}
      </div>
    </div>
  );
}

function WizardTopbarSwitcher({ currentStep, onStepChange }: { currentStep: WizardStep; onStepChange?: (step: WizardStep) => void }) {
  return (
    <div className="flex items-center relative shrink-0" data-name="./Wizard topbar switcher">
      <WizardTopbar currentStep={currentStep} onStepChange={onStepChange} />
    </div>
  );
}

// ============================================================================
// Navigation Icons Components
// ============================================================================

function Locked() {
  return (
    <svg className="block size-[32px]" fill="none" viewBox="0 0 32 32">
      <g id="Locked">
        <path d={svgPaths.p215dc800} fill="black" fillOpacity="0.63" id="Vector" />
      </g>
    </svg>
  );
}

function Icon() {
  return (
    <div className="flex items-center justify-center shrink-0 cursor-pointer hover:bg-gray-100 rounded-[4px] transition-colors" data-name="icon" style={{ width: '60px', height: '60px', minWidth: '60px', minHeight: '60px', maxWidth: '60px', maxHeight: '60px', flexShrink: 0 }}>
      <Locked />
    </div>
  );
}

function BatteryFull() {
  return (
    <svg className="block size-[32px]" fill="none" viewBox="0 0 32 32">
      <g id="Battery full">
        <g id="Vector">
          <path d={svgPaths.p117a6a00} fill="black" fillOpacity="0.63" />
          <path d="M22 20V12H8V20H22Z" fill="black" fillOpacity="0.63" />
        </g>
      </g>
    </svg>
  );
}

function Icon1() {
  return (
    <div className="flex items-center justify-center shrink-0 cursor-pointer hover:bg-gray-100 rounded-[4px] transition-colors" data-name="icon" style={{ width: '60px', height: '60px', minWidth: '60px', minHeight: '60px', maxWidth: '60px', maxHeight: '60px', flexShrink: 0 }}>
      <BatteryFull />
    </div>
  );
}

function NotificationOutline() {
  return (
    <svg className="block size-[32px]" fill="none" viewBox="0 0 32 32">
      <g id="Notification outline">
        <path d={svgPaths.p3ab1f880} fill="black" fillOpacity="0.63" id="Vector" />
      </g>
    </svg>
  );
}

function Icon2() {
  return (
    <div className="flex items-center justify-center shrink-0 cursor-pointer hover:bg-gray-100 rounded-[4px] transition-colors" data-name="icon" style={{ width: '60px', height: '60px', minWidth: '60px', minHeight: '60px', maxWidth: '60px', maxHeight: '60px', flexShrink: 0 }}>
      <NotificationOutline />
    </div>
  );
}

function Settings() {
  return (
    <svg className="block size-[32px]" fill="none" viewBox="0 0 32 32">
      <g id="Settings">
        <g id="Vector">
          <path d={svgPaths.p289c8d00} fill="black" fillOpacity="0.63" />
          <path d={svgPaths.p2be96b00} fill="black" fillOpacity="0.63" />
        </g>
      </g>
    </svg>
  );
}

function Icon3() {
  return (
    <div className="flex items-center justify-center shrink-0 cursor-pointer hover:bg-gray-100 rounded-[4px] transition-colors" data-name="icon" style={{ width: '60px', height: '60px', minWidth: '60px', minHeight: '60px', maxWidth: '60px', maxHeight: '60px', flexShrink: 0 }}>
      <Settings />
    </div>
  );
}

function NavigatonIcons() {
  return (
    <div className="flex items-center relative shrink-0 w-[240px]" data-name="Navigaton Icons">
      <Icon />
      <Icon1 />
      <Icon2 />
      <Icon3 />
    </div>
  );
}

function IteroLogo() {
  return (
    <div className="relative shrink-0">
      <svg width="71" height="28" viewBox="0 0 71 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M63.2389 19.7792C63.2417 18.7027 63.0308 17.6364 62.6182 16.6421C62.2057 15.6478 61.5999 14.7454 60.8358 13.987C59.2477 12.4036 57.0828 11.532 54.7364 11.532C52.3919 11.532 50.2252 12.4036 48.639 13.987C47.8772 14.7461 47.2741 15.6491 46.8649 16.6435C46.4556 17.6379 46.2483 18.7039 46.2551 19.7792C46.2551 22.0073 47.0658 24.0664 48.5746 25.579C50.1307 27.1397 52.3202 28 54.7364 28C57.1527 28 59.3422 27.1397 60.9001 25.579C62.407 24.0664 63.2389 22.0073 63.2389 19.7792ZM59.4197 19.7792C59.4197 22.3042 57.2321 24.5192 54.7364 24.5192C52.2426 24.5192 50.0531 22.3042 50.0531 19.7792C50.0483 19.1467 50.1696 18.5196 50.4098 17.9344C50.6501 17.3493 51.0045 16.8179 51.4523 16.3712C52.3236 15.5008 53.5048 15.0118 54.7365 15.0118C55.9681 15.0118 57.1493 15.5008 58.0206 16.3712C58.4688 16.8176 58.8234 17.349 59.0636 17.9342C59.3039 18.5194 59.4249 19.1466 59.4197 19.7792ZM40.1254 15.8294H44.7869V11.8713H36.1682V27.7249H40.1254V15.8294ZM20.5939 21.2945H33.0215V20.7378C33.0215 18.0643 32.2312 15.7681 30.7357 14.0977C29.2534 12.4433 27.1358 11.532 24.7743 11.532C22.4506 11.532 20.3481 12.3989 18.8583 13.9738C17.427 15.4855 16.6386 17.5369 16.6386 19.7517C16.6386 21.9185 17.4195 23.9415 18.8356 25.4476C20.4067 27.117 22.6056 28 25.1959 28C27.8145 28 29.9738 27.0196 31.9608 24.9239L29.4216 22.3798C28.2172 23.7799 26.7463 24.5192 25.1675 24.5192C23.9273 24.5192 22.823 24.1401 21.9742 23.4217C21.315 22.8637 20.8349 22.1238 20.5939 21.2945ZM20.577 18.0956C20.9948 16.5584 22.2634 15.0118 24.746 15.0118C26.8219 15.0118 28.4611 16.2521 28.9281 18.0956H20.577ZM13.392 7.91404H18.8675V3.95686H3.95927V7.91404H9.43473V27.7249H13.392V7.91404Z" fill="black" fillOpacity="0.93"/>
        <path d="M40.1254 15.8294H44.7869V11.8713H36.1682V27.7249H40.1254V15.8294Z" fill="black" fillOpacity="0.93"/>
        <path d="M3.95718 11.8713H0V27.7249H3.95718V11.8713Z" fill="black" fillOpacity="0.93"/>
        <path d="M3.95718 0H0V3.95718H3.95718V0Z" fill="black" fillOpacity="0.93"/>
        <path d="M64.4516 11.8664H66.8465V12.3382H65.9222V14.8167H65.3708V12.3382H64.4516V11.8664Z" fill="black" fillOpacity="0.93"/>
        <path d="M67.2317 11.8664H67.9573L68.4414 13.2707C68.5565 13.6152 68.6992 14.2613 68.6992 14.2613H68.7114C68.7114 14.2613 68.8541 13.6192 68.9652 13.2707L69.4401 11.8664H70.182V14.8167H69.6704V13.2778C69.6704 12.9568 69.7061 12.3586 69.7061 12.3586H69.6979C69.6979 12.3586 69.5756 12.9018 69.4798 13.1953L68.9214 14.8167H68.477L67.9145 13.1953C67.8187 12.9018 67.6964 12.3586 67.6964 12.3586H67.6882C67.6882 12.3586 67.7239 12.9568 67.7239 13.2778V14.8167H67.2317V11.8664Z" fill="black" fillOpacity="0.93"/>
      </svg>
    </div>
  );
}

function Dropdown1({ patientName }: { patientName: string }) {
  // Parse patient name to separate label and actual name
  const displayName = patientName.replace('Patient:', '').trim();
  
  return (
    <div 
      className="flex items-center gap-[16px] shrink-0" 
      data-name="Dropdown"
    >
      {/* iTero Logo */}
      <IteroLogo />
      
      {/* Vertical Divider */}
      <div 
        style={{ 
          width: '1px', 
          height: '28px', 
          backgroundColor: 'rgba(0, 0, 0, 0.15)' 
        }} 
      />
      
      {/* Patient Info Section */}
      <div 
        className="flex items-center gap-[12px] cursor-pointer group"
      >
        {/* Patient Avatar - Initials */}
        <div
          style={{ 
            width: '44px', 
            height: '44px',
            borderRadius: '50%',
            flexShrink: 0,
            backgroundColor: '#E8F4F8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span 
            style={{ 
              color: '#007BA3',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: "'Roboto', sans-serif",
              letterSpacing: '0.02em'
            }}
          >
            MY
          </span>
        </div>
        
        {/* Patient Name */}
        <div className="flex flex-col">
          <span 
            className="text-[15px] font-medium group-hover:text-[#008EC2] transition-colors"
            style={{ 
              color: 'rgba(0, 0, 0, 0.88)',
              fontFamily: "'Roboto', sans-serif",
              letterSpacing: '-0.01em'
            }}
          >
            {displayName}
          </span>
          <span 
            className="text-[13px]"
            style={{ 
              color: 'rgba(0, 0, 0, 0.45)',
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Patient
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Header Navigation Component
// ============================================================================

export default function HeaderNavigation({ 
  currentStep = 'scan', 
  patientName = 'Patient: Mina Y.',
  onStepChange 
}: HeaderNavigationProps) {
  return (
    <div className="relative w-full">
      <div className="bg-white flex items-center justify-between gap-[16px] px-[16px] py-[4px] relative w-full" data-name="Header Scan component" style={{ height: '72px', minHeight: '72px', maxHeight: '72px' }}>
        <div aria-hidden="true" className="absolute border-b border-[rgba(0,0,0,0.23)] border-solid inset-0 pointer-events-none" />
        <div className="flex items-center shrink-0">
          <Dropdown1 patientName={patientName} />
        </div>
        <div className="flex items-center shrink-0">
          <WizardTopbarSwitcher currentStep={currentStep} onStepChange={onStepChange} />
        </div>
        <div className="flex items-center shrink-0">
          <NavigatonIcons />
        </div>
      </div>
      {/* Jaw Navigation image positioned below navigation, top-left aligned */}
      <div className="absolute left-[16px]" style={{ top: '96px' }}>
        <img 
          src={jawNavigationImage} 
          alt="Jaw Navigation" 
          className="block"
          style={{ width: '301px', height: '467px' }}
        />
      </div>
    </div>
  );
}
