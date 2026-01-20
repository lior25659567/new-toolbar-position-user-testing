// ============================================================================
// DENTAL APPLICATION TYPES
// ============================================================================
// Centralized type definitions for the dental application
// ============================================================================

// Wizard step types
export type WizardStep = 'info' | 'scan' | 'view' | 'send';

// Tooth and jaw types
export type ToothId = string;
export type JawView = 'upper' | 'lower' | 'bite';

// Component prop interfaces
export interface HeaderNavigationProps {
  currentStep?: WizardStep;
  patientName?: string;
  onStepChange?: (step: WizardStep) => void;
}

export interface JawNavigationProps {
  onToothSelect?: (toothId: ToothId) => void;
  selectedTeeth?: ToothId[];
}

export interface MarginPanelProps {
  selectedTooth: string;
  jawType: string;
  onPreviousTooth: () => void;
  onNextTooth: () => void;
  onDetect: () => void;
  onManual: () => void;
  onUndo: () => void;
  onClearSelection: () => void;
}

export interface TrimPanelProps {
  onTrim: () => void;
  onUndo: () => void;
  onConfirm: () => void;
  onClose: () => void;
}

export interface PrepEditPanelProps {
  onSelect: () => void;
  onEraseRescan: () => void;
  onClose: () => void;
}

export interface JawSelectorProps {
  currentView: JawView;
  onPrevious: () => void;
  onNext: () => void;
}
