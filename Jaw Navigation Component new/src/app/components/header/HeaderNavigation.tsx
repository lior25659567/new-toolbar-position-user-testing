// ============================================================================
// HEADER NAVIGATION COMPONENT
// ============================================================================
// Main header component that combines logo, wizard steps, and navigation icons
// ============================================================================

import type { HeaderNavigationProps } from '@/app/types/dental';
import { Logo } from './Logo';
import { WizardSteps } from './WizardSteps';
import { NavigationIcons } from './NavigationIcons';

function LeftGroup({ patientName }: { patientName: string }) {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[72px] items-center left-0 top-0 w-[487px]" data-name="Left group">
      <Logo />
    </div>
  );
}

function Dropdown({ patientName }: { patientName: string }) {
  return (
    <div className="content-stretch flex gap-[8px] h-[72px] items-center overflow-clip px-[16px] py-[12px] relative rounded-[4px] shrink-0" data-name="Dropdown">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[18px] text-[rgba(0,0,0,0.63)] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        {patientName}
      </p>
    </div>
  );
}

function Frame({ patientName }: { patientName: string }) {
  return (
    <div className="content-stretch flex flex-col gap-[10px] h-[72px] items-start px-[90px] py-0 relative shrink-0">
      <LeftGroup patientName={patientName} />
      <Dropdown patientName={patientName} />
    </div>
  );
}

function Dropdown1({ patientName }: { patientName: string }) {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[72px] items-center left-[106px] overflow-clip px-[16px] py-[12px] rounded-[4px] top-1/2 translate-y-[-50%]" data-name="Dropdown">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[18px] text-[rgba(0,0,0,0.63)] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        {patientName}
      </p>
    </div>
  );
}

export function HeaderNavigation({ 
  currentStep = 'scan', 
  patientName = 'Patient: Mina Y.',
  onStepChange 
}: HeaderNavigationProps) {
  return (
    <div className="bg-white content-stretch flex items-center justify-between px-[16px] py-0 relative w-full h-[72px]" data-name="Header Scan component">
      <div aria-hidden="true" className="absolute border-0 border-[rgba(0,0,0,0.23)] border-solid inset-0 pointer-events-none" />
      <Frame patientName={patientName} />
      <WizardSteps currentStep={currentStep} onStepChange={onStepChange} />
      <NavigationIcons />
      <Dropdown1 patientName={patientName} />
    </div>
  );
}
