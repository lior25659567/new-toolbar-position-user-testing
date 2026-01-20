'use client';

import { useState, useEffect } from 'react';
import ScreenTemplate from "./imports/ScreenTemplate";
import HomePage from "./components/HomePage";

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'vertical' | 'horizontal' | 'horizontal-top' | 'horizontal-bottom'>('home');

  // Keyboard shortcut: Press 'r' to return to home
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'r' || event.key === 'R') {
        // Don't trigger if user is typing in an input
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
          return;
        }
        setCurrentView('home');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Shared state across all layouts - preserves state when switching layouts
  const [currentPage, setCurrentPage] = useState<string>('scan');
  const [activeButtons, setActiveButtons] = useState<Set<number>>(new Set());
  const [viewActiveButtons, setViewActiveButtons] = useState<Set<number>>(new Set());
  const [combinedPanelMode, setCombinedPanelMode] = useState<boolean>(false);

  const handleSelectLayout = (layout: 'vertical' | 'horizontal' | 'horizontal-top' | 'horizontal-bottom') => {
    setCurrentView(layout);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleNavigateToLayout = (layout: 'home' | 'vertical' | 'horizontal' | 'horizontal-top' | 'horizontal-bottom') => {
    setCurrentView(layout);
  };
  
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    // Reset button states when switching pages
    if (page === 'scan') {
      setActiveButtons(new Set());
    } else if (page === 'view') {
      setViewActiveButtons(new Set());
    }
  };
  
  const handleButtonClick = (index: number) => {
    setActiveButtons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleViewButtonClick = (index: number) => {
    setViewActiveButtons(prev => {
      const newSet = new Set(prev);
      
      // Occlusalgram (index 2) and Prep QC (index 4) are mutually exclusive
      if (index === 2 || index === 4) {
        const otherIndex = index === 2 ? 4 : 2;
        newSet.delete(otherIndex); // Deactivate the other button
        
        if (newSet.has(index)) {
          newSet.delete(index); // Toggle off if already active
        } else {
          newSet.add(index); // Toggle on
        }
      } 
      // Margin Line (index 3) and Trim (index 5) are mutually exclusive
      else if (index === 3 || index === 5) {
        const otherIndex = index === 3 ? 5 : 3;
        newSet.delete(otherIndex); // Deactivate the other button
        
        if (newSet.has(index)) {
          newSet.delete(index); // Toggle off if already active
        } else {
          newSet.add(index); // Toggle on
        }
      } else {
        // Normal toggle behavior for other buttons
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
      }
      
      return newSet;
    });
  };

  return (
    <div className="w-full h-full overflow-hidden relative">
      {currentView === 'home' && (
        <HomePage 
          onSelectLayout={handleSelectLayout}
          combinedPanelMode={combinedPanelMode}
          onCombinedPanelModeChange={setCombinedPanelMode}
        />
      )}
      
      {currentView === 'vertical' && (
        <ScreenTemplate 
          initialPage={currentPage}
          microAnimations={true}
          onBackToHome={handleBackToHome}
          onNavigateToLayout={handleNavigateToLayout}
          layout="vertical"
          activeButtons={activeButtons}
          viewActiveButtons={viewActiveButtons}
          onPageChange={handlePageChange}
          onButtonClick={handleButtonClick}
          onViewButtonClick={handleViewButtonClick}
          combinedPanelMode={combinedPanelMode}
          onCombinedPanelModeChange={setCombinedPanelMode}
        />
      )}
      
      {currentView === 'horizontal' && (
        <ScreenTemplate 
          initialPage={currentPage}
          microAnimations={true}
          onBackToHome={handleBackToHome}
          onNavigateToLayout={handleNavigateToLayout}
          layout="horizontal"
          activeButtons={activeButtons}
          viewActiveButtons={viewActiveButtons}
          onPageChange={handlePageChange}
          onButtonClick={handleButtonClick}
          onViewButtonClick={handleViewButtonClick}
          combinedPanelMode={combinedPanelMode}
          onCombinedPanelModeChange={setCombinedPanelMode}
        />
      )}
      
      {currentView === 'horizontal-top' && (
        <ScreenTemplate 
          initialPage={currentPage}
          microAnimations={true}
          onBackToHome={handleBackToHome}
          onNavigateToLayout={handleNavigateToLayout}
          layout="horizontal-top"
          activeButtons={activeButtons}
          viewActiveButtons={viewActiveButtons}
          onPageChange={handlePageChange}
          onButtonClick={handleButtonClick}
          onViewButtonClick={handleViewButtonClick}
          combinedPanelMode={combinedPanelMode}
          onCombinedPanelModeChange={setCombinedPanelMode}
        />
      )}

      {currentView === 'horizontal-bottom' && (
        <ScreenTemplate 
          initialPage={currentPage}
          microAnimations={true}
          onBackToHome={handleBackToHome}
          onNavigateToLayout={handleNavigateToLayout}
          layout="horizontal-bottom"
          activeButtons={activeButtons}
          viewActiveButtons={viewActiveButtons}
          onPageChange={handlePageChange}
          onButtonClick={handleButtonClick}
          onViewButtonClick={handleViewButtonClick}
          combinedPanelMode={combinedPanelMode}
          onCombinedPanelModeChange={setCombinedPanelMode}
        />
      )}

    </div>
  );
}