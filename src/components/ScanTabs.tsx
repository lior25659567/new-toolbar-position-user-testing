import React, { useState, useRef, useEffect, useCallback } from 'react';

export type ScanLayerType = 'treatment-scan' | 'pre-treatment' | 'additional-scan' | 'additional-bite';

export type BiteType = 'centric-occlusion' | 'right-lateral' | 'left-lateral' | 'protrusive' | 'retrusive';

export interface ScanTab {
  id: string;
  label: string;
  layerType: ScanLayerType;
  biteType?: BiteType;
}

interface ScanTabsProps {
  tabs?: ScanTab[];
  onTabsChange?: (tabs: ScanTab[]) => void;
  onTabSelect?: (tab: ScanTab) => void;
}

export default function ScanTabs({ 
  tabs: externalTabs, 
  onTabsChange,
  onTabSelect 
}: ScanTabsProps) {
  const [tabs, setTabs] = useState<ScanTab[]>(
    externalTabs || [{ id: '1', label: 'Treatment Scan', layerType: 'treatment-scan' }]
  );
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id || '1');
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [showBiteDropdown, setShowBiteDropdown] = useState(false);
  const [plusHovered, setPlusHovered] = useState(false);
  const [selectedBites, setSelectedBites] = useState<Set<BiteType>>(new Set());
  const [newTabIds, setNewTabIds] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (externalTabs) {
      setTabs(externalTabs);
      if (externalTabs.length > 0 && !externalTabs.find(t => t.id === activeTabId)) {
        setActiveTabId(externalTabs[0].id);
      }
    }
  }, [externalTabs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAddDropdown(false);
        setShowBiteDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabClick = (tab: ScanTab) => {
    setActiveTabId(tab.id);
    onTabSelect?.(tab);
  };

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    const closedIndex = tabs.findIndex(t => t.id === tabId);
    const newTabs = tabs.filter(t => t.id !== tabId);
    if (newTabs.length === 0) return;
    setTabs(newTabs);
    onTabsChange?.(newTabs);
    if (activeTabId === tabId) {
      const prevTab = newTabs[Math.min(closedIndex, newTabs.length) - 1] || newTabs[0];
      setActiveTabId(prevTab.id);
      onTabSelect?.(prevTab);
    }
  };

  const handleAddLayer = (layerType: ScanLayerType) => {
    if (layerType === 'additional-bite') {
      // Pre-populate with already-added bite types so they show as checked
      const existingBites = new Set<BiteType>(
        tabs.filter(t => t.layerType === 'additional-bite' && t.biteType).map(t => t.biteType!)
      );
      setSelectedBites(existingBites);
      setShowBiteDropdown(!showBiteDropdown);
      return;
    }
    const newTab: ScanTab = {
      id: Date.now().toString(),
      label: layerType === 'pre-treatment' ? 'Pre Treatment' : 'Additional Scan',
      layerType,
    };
    const newTabs = [...tabs, newTab];
    setTabs(newTabs);
    setActiveTabId(newTab.id);
    setNewTabIds(prev => new Set(prev).add(newTab.id));
    setTimeout(() => setNewTabIds(prev => { const n = new Set(prev); n.delete(newTab.id); return n; }), 400);
    setShowAddDropdown(false);
    setShowBiteDropdown(false);
    onTabsChange?.(newTabs);
    onTabSelect?.(newTab);
  };

  const biteLabels: Record<BiteType, string> = {
    'centric-occlusion': 'Centric Occlusion',
    'right-lateral': 'Right Lateral',
    'left-lateral': 'Left Lateral',
    'protrusive': 'Protrusive',
    'retrusive': 'Retrusive',
  };

  const toggleBiteSelection = (biteType: BiteType) => {
    setSelectedBites(prev => {
      const next = new Set(prev);
      if (next.has(biteType)) {
        next.delete(biteType);
      } else {
        next.add(biteType);
      }
      return next;
    });
  };

  const handleAddSelectedBites = () => {
    const existingBiteTypes = new Set<BiteType>(
      tabs.filter(t => t.layerType === 'additional-bite' && t.biteType).map(t => t.biteType!)
    );

    // Remove bite tabs that were unchecked
    let newTabs = tabs.filter(t => {
      if (t.layerType === 'additional-bite' && t.biteType) {
        return selectedBites.has(t.biteType);
      }
      return true;
    });

    // Add new bite tabs that were checked but don't exist yet
    let lastTab: ScanTab | null = null;
    selectedBites.forEach((biteType) => {
      if (!existingBiteTypes.has(biteType)) {
        const newTab: ScanTab = {
          id: Date.now().toString() + '-' + biteType,
          label: `Bite - ${biteLabels[biteType]}`,
          layerType: 'additional-bite',
          biteType,
        };
        newTabs = [...newTabs, newTab];
        lastTab = newTab;
        setNewTabIds(prev => new Set(prev).add(newTab.id));
        setTimeout(() => setNewTabIds(prev => { const n = new Set(prev); n.delete(newTab.id); return n; }), 400);
      }
    });

    setTabs(newTabs);
    if (lastTab) {
      setActiveTabId((lastTab as ScanTab).id);
      onTabSelect?.(lastTab);
    } else if (newTabs.length > 0 && !newTabs.find(t => t.id === activeTabId)) {
      setActiveTabId(newTabs[0].id);
    }
    setShowBiteDropdown(false);
    setShowAddDropdown(false);
    onTabsChange?.(newTabs);
  };

  const tabHeight = 44;
  const addButtonSize = 32;

  return (
    <div
      className="w-full"
      style={{ 
        minHeight: '60px',
        height: '100%',
        backgroundColor: '#FFFFFF',
        fontFamily: "'Roboto', system-ui, sans-serif",
        display: 'flex',
        alignItems: 'flex-end',
        paddingLeft: '14px',
        paddingRight: '14px',
        paddingTop: '16px',
        paddingBottom: 0,
        gap: '4px',
        borderBottom: '1px solid #E5E7EB',
      }}
    >
      <style>{`@keyframes scan-tab-in { from { opacity: 0; transform: translateX(12px) scale(0.95); } to { opacity: 1; transform: translateX(0) scale(1); } }`}</style>
      {/* Tabs */}
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const isHovered = hoveredTabId === tab.id && !isActive;
        const isNew = newTabIds.has(tab.id);

        return (
          <div
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            onMouseEnter={() => setHoveredTabId(tab.id)}
            onMouseLeave={() => setHoveredTabId(null)}
            className="relative cursor-pointer flex items-center"
            style={{
              height: `${tabHeight}px`,
              paddingLeft: '14px',
              paddingRight: '10px',
              borderRadius: '8px 8px 0 0',
              backgroundColor: isActive ? '#FFFFFF' : isHovered ? '#F0F0F0' : '#F5F5F5',
              transition: 'background-color 0.15s ease',
              ...(isNew ? { animation: 'scan-tab-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both' } : {}),
              minWidth: '140px',
              maxWidth: '260px',
              overflow: 'hidden',
              borderTop: isActive ? '1px solid #E5E7EB' : '1px solid transparent',
              borderLeft: isActive ? '1px solid #E5E7EB' : '1px solid transparent',
              borderRight: isActive ? '1px solid #E5E7EB' : '1px solid transparent',
              borderBottom: 'none',
              marginBottom: isActive ? '-1px' : '0',
            }}
          >
            {/* Active tab: teal underline - full width */}
            {isActive && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: '#009ACE',
              }} />
            )}

            {/* Label */}
            <span
              className="truncate select-none"
              style={{
                fontSize: '14px',
                lineHeight: '22px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#009ACE' : '#666666',
                transition: 'color 0.15s ease',
                flex: 1,
                minWidth: 0,
              }}
            >
              {tab.label}
            </span>

            {/* Close X - only on selected tab */}
            {isActive && (
              <button
                onClick={(e) => handleTabClose(e, tab.id)}
                className="flex items-center justify-center shrink-0"
                style={{
                  width: '20px',
                  height: '20px',
                  marginLeft: '10px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.12s ease',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.08)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1L9 9M9 1L1 9" stroke="#009ACE" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        );
      })}

      {/* Add tab button (+) - centered to tab height with padding */}
      <div
        className="relative"
        style={{
          display: 'flex',
          alignItems: 'center',
          height: `${tabHeight}px`,
          paddingLeft: '6px',
          paddingRight: '6px',
          paddingTop: '6px',
          paddingBottom: '6px',
        }}
        ref={dropdownRef}
      >
        <button
          onClick={() => { setShowAddDropdown(!showAddDropdown); setShowBiteDropdown(false); }}
          onMouseEnter={() => setPlusHovered(true)}
          onMouseLeave={() => setPlusHovered(false)}
          className="flex items-center justify-center"
          style={{
            width: `${addButtonSize}px`,
            height: `${addButtonSize}px`,
            backgroundColor: plusHovered ? '#f3f4f6' : '#FFFFFF',
            border: '1px solid #E5E7EB',
            cursor: 'pointer',
            borderRadius: '8px',
            transition: 'background-color 0.15s ease',
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M3 8H13" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>

        {/* Add Layer Dropdown */}
        {showAddDropdown && (
          <div
            style={{
              position: 'absolute',
              top: '50px',
              left: '0',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.08)',
              zIndex: 100,
              minWidth: '240px',
              padding: '6px',
              overflow: 'visible',
            }}
          >
            <DropdownItem label="Pre Treatment" onClick={() => handleAddLayer('pre-treatment')} />
            <DropdownItem label="Additional Scan" onClick={() => handleAddLayer('additional-scan')} />
            <DropdownItem 
              label="Additional Bite" 
              hasSubmenu 
              onClick={() => handleAddLayer('additional-bite')}
            />
            
            {showBiteDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '100%',
                  marginLeft: '6px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  zIndex: 101,
                  minWidth: '240px',
                  padding: '6px',
                }}
              >
                <CheckboxItem label="Centric Occlusion" checked={selectedBites.has('centric-occlusion')} onClick={() => toggleBiteSelection('centric-occlusion')} />
                <CheckboxItem label="Right Lateral" checked={selectedBites.has('right-lateral')} onClick={() => toggleBiteSelection('right-lateral')} />
                <CheckboxItem label="Left Lateral" checked={selectedBites.has('left-lateral')} onClick={() => toggleBiteSelection('left-lateral')} />
                <CheckboxItem label="Protrusive" checked={selectedBites.has('protrusive')} onClick={() => toggleBiteSelection('protrusive')} />
                <CheckboxItem label="Retrusive" checked={selectedBites.has('retrusive')} onClick={() => toggleBiteSelection('retrusive')} />
                
                {/* Divider + Add button */}
                <div style={{ height: '1px', backgroundColor: '#E0E0E0', margin: '6px 0' }} />
                <button
                  onClick={handleAddSelectedBites}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    lineHeight: '20px',
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 600,
                    color: selectedBites.size > 0 ? '#FFFFFF' : '#999999',
                    backgroundColor: selectedBites.size > 0 ? '#009ACE' : '#F0F0F0',
                    border: 'none',
                    cursor: selectedBites.size > 0 ? 'pointer' : 'default',
                    transition: 'all 0.15s ease',
                    textAlign: 'center',
                  }}
                >
                  {tabs.some(t => t.layerType === 'additional-bite') ? 'Update' : 'Add Selected'} ({selectedBites.size})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DropdownItem({ 
  label, 
  onClick, 
  hasSubmenu = false,
}: { 
  label: string; 
  onClick: () => void; 
  hasSubmenu?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full flex items-center justify-between"
      style={{
        padding: '12px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        lineHeight: '20px',
        color: '#1A1A1A',
        fontFamily: "'Roboto', sans-serif",
        fontWeight: 400,
        backgroundColor: isHovered ? 'rgba(0,0,0,0.05)' : 'transparent',
        transition: 'background-color 0.1s ease',
        textAlign: 'left',
        cursor: 'pointer',
        border: 'none',
      }}
    >
      <span>{label}</span>
      {hasSubmenu && (
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 3L7.5 6L4.5 9" stroke="#5F6368" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function CheckboxItem({ 
  label, 
  checked,
  onClick,
}: { 
  label: string; 
  checked: boolean;
  onClick: () => void; 
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full flex items-center"
      style={{
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        lineHeight: '20px',
        color: '#1A1A1A',
        fontFamily: "'Roboto', sans-serif",
        fontWeight: checked ? 500 : 400,
        backgroundColor: isHovered ? 'rgba(0,0,0,0.05)' : 'transparent',
        transition: 'background-color 0.1s ease',
        textAlign: 'left',
        cursor: 'pointer',
        border: 'none',
      }}
    >
      {/* Checkbox */}
      <div
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '4px',
          border: checked ? 'none' : '2px solid #BBBBBB',
          backgroundColor: checked ? '#009ACE' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.12s ease',
        }}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span>{label}</span>
    </button>
  );
}
