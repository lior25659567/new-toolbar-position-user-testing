import { useState } from 'react';
import ScreenTemplate from "../imports/ScreenTemplate";
import type { ScanTab } from './ScanTabs';

export default function DedicatedTopToolbarPage({
  onBackToHome,
  activeButtons,
  viewActiveButtons,
  onPageChange,
  onButtonClick,
  onViewButtonClick,
}: {
  onBackToHome: () => void;
  activeButtons: Set<number>;
  viewActiveButtons: Set<number>;
  onPageChange: (page: string) => void;
  onButtonClick: (index: number) => void;
  onViewButtonClick: (index: number) => void;
}) {
  const [currentPage, setCurrentPage] = useState<'scan' | 'view'>('scan');
  const [scanTabs, setScanTabs] = useState<ScanTab[]>([
    { id: '1', label: 'Treatment Scan', layerType: 'treatment-scan' },
  ]);

  const handlePageChange = (page: 'scan' | 'view') => {
    setCurrentPage(page);
    onPageChange(page);
  };

  return (
    <div className="w-full h-full overflow-hidden relative" style={{ backgroundColor: '#FFFFFF' }}>
      <ScreenTemplate
        initialPage={currentPage}
        microAnimations={true}
        onBackToHome={onBackToHome}
        onNavigateToLayout={() => {}}
        layout="horizontal-top"
        activeButtons={activeButtons}
        viewActiveButtons={viewActiveButtons}
        onPageChange={(page) => handlePageChange(page as 'scan' | 'view')}
        onButtonClick={onButtonClick}
        onViewButtonClick={onViewButtonClick}
        combinedPanelMode={false}
        onCombinedPanelModeChange={() => {}}
        hideLayoutSwitcher={true}
        showScanTabs={true}
        scanTabs={scanTabs}
        onScanTabsChange={setScanTabs}
      />
    </div>
  );
}
