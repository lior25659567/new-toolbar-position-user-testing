// ============================================================================
// WIZARD STEPS COMPONENT
// ============================================================================
// Wizard navigation steps for the header
// ============================================================================

import svgPaths from '@/imports/svg-tl25ixc7nv';
import type { WizardStep } from '@/app/types/dental';

interface WizardStepsProps {
  currentStep: WizardStep;
  onStepChange?: (step: WizardStep) => void;
}

function StepName({ children }: { children: React.ReactNode }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px mr-[-176px] relative z-[2]" data-name="Name">
      <div className="flex flex-[1_0_0] flex-col font-['Roboto:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px relative text-[24px] text-[rgba(0,0,0,0.93)] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[32px] whitespace-pre-wrap">{children}</p>
      </div>
    </div>
  );
}

function StepNameActive({ children }: { children: React.ReactNode }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px mr-[-176px] relative z-[2]" data-name="Name">
      <div className="flex flex-[1_0_0] flex-col font-['Roboto:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px relative text-[24px] text-center text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[32px] whitespace-pre-wrap">{children}</p>
      </div>
    </div>
  );
}

function CompleteStep({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <div className="content-stretch flex isolate items-center justify-center pl-0 pr-[176px] py-0 relative shrink-0 w-[176px] cursor-pointer" data-name="complete" onClick={onClick}>
      <StepName>{label}</StepName>
      <div className="flex-[1_0_0] h-[64px] min-h-px min-w-px mr-[-176px] relative z-[1]" data-name="back">
        <div className="absolute inset-[-6.25%_0_-6.25%_-2.27%]" style={{ "--fill-0": "rgba(244, 244, 244, 1)", "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 180 72">
            <path d={svgPaths.p2106e100} fill="var(--fill-0, #F4F4F4)" id="back" stroke="var(--stroke-0, white)" strokeWidth="4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function CurrentStep({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <div className="content-stretch flex isolate items-center justify-center pl-0 pr-[176px] py-0 relative shrink-0 w-[176px] cursor-pointer" data-name="current" onClick={onClick}>
      <StepNameActive>{label}</StepNameActive>
      <div className="flex-[1_0_0] h-[64px] min-h-px min-w-px mr-[-176px] relative z-[1]" data-name="back">
        <div className="absolute inset-[-6.25%_0_-6.25%_-2.27%]" style={{ "--fill-0": "rgba(255, 255, 255, 1)", "--fill-1": "rgba(241, 241, 241, 1)", "--fill-2": "rgba(0, 154, 206, 1)", "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 180 72">
            <g id="back">
              <path d={svgPaths.p2106e100} fill="var(--fill-0, white)" />
              <path d={svgPaths.p2106e100} fill="var(--fill-1, #F1F1F1)" />
              <path d={svgPaths.p2106e100} fill="var(--fill-2, #009ACE)" />
              <path d={svgPaths.p2106e100} stroke="var(--stroke-0, white)" strokeWidth="4" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function IncompleteStep({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <div className="content-stretch flex isolate items-center justify-center pl-0 pr-[176px] py-0 relative shrink-0 w-[176px] cursor-pointer" data-name="incomplete" onClick={onClick}>
      <StepName>{label}</StepName>
      <div className="flex-[1_0_0] h-[64px] min-h-px min-w-px mr-[-176px] relative z-[1]" data-name="back">
        <div className="absolute inset-[-6.25%_0_-6.25%_-2.27%]" style={{ "--fill-0": "rgba(255, 255, 255, 1)", "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 180 72">
            <path d={svgPaths.p2106e100} fill="var(--fill-0, white)" id="back" stroke="var(--stroke-0, white)" strokeWidth="4" />
          </svg>
        </div>
      </div>
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
    <div className="content-stretch flex isolate items-center justify-center pl-0 pr-[32px] py-0 relative shrink-0" data-name="./Wizard topbar">
      {steps.map((step, index) => {
        const zIndex = 4 - index;
        const StepWrapper = ({ children }: { children: React.ReactNode }) => (
          <div className="content-stretch flex items-start mr-[-32px] relative shrink-0" data-name="./ Wizard lables" style={{ zIndex }}>
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
  );
}

export function WizardSteps({ currentStep, onStepChange }: WizardStepsProps) {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[607px]" data-name="./Wizard topbar switcher">
      <div className="content-stretch flex items-start relative shrink-0 w-[608px]" data-name="./Wizard topbar / selected 2">
        <WizardTopbar currentStep={currentStep} onStepChange={onStepChange} />
      </div>
    </div>
  );
}
