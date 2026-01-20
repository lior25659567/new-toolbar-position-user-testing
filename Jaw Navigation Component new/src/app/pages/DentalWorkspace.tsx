import { useState } from 'react';
import JawNavigation from '@/app/components/JawNavigation';
import { HeaderNavigation } from '@/app/components/header';
import { MarginPanel, TrimPanel, PrepEditPanel } from '@/app/components/panels';
import type { WizardStep } from '@/app/types/dental';

export default function DentalWorkspace() {
  const [selectedTooth, setSelectedTooth] = useState<string | null>('11');
  const [currentStep, setCurrentStep] = useState<WizardStep>('scan');
  const [showMarginPanel, setShowMarginPanel] = useState(true);
  const [showTrimPanel, setShowTrimPanel] = useState(true);
  const [showPrepEditPanel, setShowPrepEditPanel] = useState(true);

  const handleToothSelect = (toothId: string) => {
    setSelectedTooth(toothId);
    setShowMarginPanel(true);
    console.log('Tooth selected:', toothId);
  };

  const handleStepChange = (step: WizardStep) => {
    setCurrentStep(step);
    console.log('Step changed to:', step);
  };

  // Margin Panel Handlers
  const handlePreviousTooth = () => {
    console.log('Previous tooth clicked');
  };

  const handleNextTooth = () => {
    console.log('Next tooth clicked');
  };

  const handleDetect = () => {
    console.log('Detect margin clicked');
  };

  const handleManual = () => {
    console.log('Manual margin clicked');
  };

  const handleUndo = () => {
    console.log('Undo clicked');
  };

  const handleClearSelection = () => {
    setSelectedTooth(null);
    setShowMarginPanel(false);
    console.log('Clear selection clicked');
  };

  // Trim Panel Handlers
  const handleTrim = () => {
    console.log('Trim clicked');
  };

  const handleTrimUndo = () => {
    console.log('Trim undo clicked');
  };

  const handleConfirm = () => {
    console.log('Confirm clicked');
  };

  const handleCloseTrim = () => {
    setShowTrimPanel(false);
    console.log('Trim panel closed');
  };

  // Prep Edit Panel Handlers
  const handleSelect = () => {
    console.log('Select clicked');
  };

  const handleEraseRescan = () => {
    console.log('Erase & Rescan clicked');
  };

  const handleClosePrepEdit = () => {
    setShowPrepEditPanel(false);
    console.log('Prep Edit panel closed');
  };

  return (
    <div className="size-full flex flex-col bg-gray-50">
      {/* Header Navigation */}
      <HeaderNavigation 
        currentStep={currentStep} 
        patientName="Patient: Mina Y."
        onStepChange={handleStepChange}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center gap-8 p-8">
        {/* Margin Panel */}
        {selectedTooth && showMarginPanel && (
          <MarginPanel
            selectedTooth={selectedTooth}
            jawType="Upper Jaw"
            onPreviousTooth={handlePreviousTooth}
            onNextTooth={handleNextTooth}
            onDetect={handleDetect}
            onManual={handleManual}
            onUndo={handleUndo}
            onClearSelection={handleClearSelection}
          />
        )}
        
        {/* Jaw Navigation */}
        <JawNavigation onToothSelect={handleToothSelect} />

        {/* Trim Panel */}
        {showTrimPanel && (
          <TrimPanel
            onTrim={handleTrim}
            onUndo={handleTrimUndo}
            onConfirm={handleConfirm}
            onClose={handleCloseTrim}
          />
        )}

        {/* Prep Edit Panel */}
        {showPrepEditPanel && (
          <PrepEditPanel
            onSelect={handleSelect}
            onEraseRescan={handleEraseRescan}
            onClose={handleClosePrepEdit}
          />
        )}
      </div>
    </div>
  );
}