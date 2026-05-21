import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SecondaryButton, GhostButton } from '../design-system';

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
  onTabSelect,
}: ScanTabsProps) {
  const [tabs, setTabs] = useState<ScanTab[]>(
    externalTabs || [{ id: '1', label: 'Treatment Scan', layerType: 'treatment-scan' }],
  );
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id || '1');
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);
  const [focusedTabId, setFocusedTabId] = useState<string | null>(tabs[0]?.id || null);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [showBiteDropdown, setShowBiteDropdown] = useState(false);
  const [selectedBites, setSelectedBites] = useState<Set<BiteType>>(new Set());
  const [newTabIds, setNewTabIds] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (externalTabs) {
      setTabs(externalTabs);
      if (externalTabs.length > 0 && !externalTabs.find((t) => t.id === activeTabId)) {
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

  const moveFocus = useCallback((id: string) => {
    setFocusedTabId(id);
    tabRefs.current[id]?.focus();
  }, []);

  const handleTabClick = (tab: ScanTab) => {
    setActiveTabId(tab.id);
    setFocusedTabId(tab.id);
    onTabSelect?.(tab);
  };

  const handleTabClose = useCallback(
    (tabId: string) => {
      const closedIndex = tabs.findIndex((t) => t.id === tabId);
      const newTabs = tabs.filter((t) => t.id !== tabId);
      if (newTabs.length === 0) return;
      setTabs(newTabs);
      onTabsChange?.(newTabs);
      if (activeTabId === tabId) {
        const prevTab = newTabs[Math.min(closedIndex, newTabs.length) - 1] || newTabs[0];
        setActiveTabId(prevTab.id);
        moveFocus(prevTab.id);
        onTabSelect?.(prevTab);
      }
    },
    [tabs, activeTabId, onTabsChange, onTabSelect, moveFocus],
  );

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, tab: ScanTab) => {
    const current = tabs.findIndex((t) => t.id === tab.id);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      moveFocus(tabs[(current + 1) % tabs.length].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      moveFocus(tabs[(current - 1 + tabs.length) % tabs.length].id);
    } else if (e.key === 'Home') {
      e.preventDefault();
      moveFocus(tabs[0].id);
    } else if (e.key === 'End') {
      e.preventDefault();
      moveFocus(tabs[tabs.length - 1].id);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTabClick(tab);
    } else if ((e.key === 'Delete' || e.key === 'Backspace') && tabs.length > 1) {
      e.preventDefault();
      handleTabClose(tab.id);
    }
  };

  const handleAddLayer = (layerType: ScanLayerType) => {
    if (layerType === 'additional-bite') {
      const existingBites = new Set<BiteType>(
        tabs.filter((t) => t.layerType === 'additional-bite' && t.biteType).map((t) => t.biteType!),
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
    setFocusedTabId(newTab.id);
    setNewTabIds((prev) => new Set(prev).add(newTab.id));
    setTimeout(
      () =>
        setNewTabIds((prev) => {
          const n = new Set(prev);
          n.delete(newTab.id);
          return n;
        }),
      400,
    );
    setShowAddDropdown(false);
    setShowBiteDropdown(false);
    onTabsChange?.(newTabs);
    onTabSelect?.(newTab);
  };

  const biteLabels: Record<BiteType, string> = {
    'centric-occlusion': 'Centric Occlusion',
    'right-lateral': 'Right Lateral',
    'left-lateral': 'Left Lateral',
    protrusive: 'Protrusive',
    retrusive: 'Retrusive',
  };

  const toggleBiteSelection = (biteType: BiteType) => {
    setSelectedBites((prev) => {
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
      tabs.filter((t) => t.layerType === 'additional-bite' && t.biteType).map((t) => t.biteType!),
    );

    let newTabs = tabs.filter((t) => {
      if (t.layerType === 'additional-bite' && t.biteType) {
        return selectedBites.has(t.biteType);
      }
      return true;
    });

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
        setNewTabIds((prev) => new Set(prev).add(newTab.id));
        setTimeout(
          () =>
            setNewTabIds((prev) => {
              const n = new Set(prev);
              n.delete(newTab.id);
              return n;
            }),
          400,
        );
      }
    });

    setTabs(newTabs);
    if (lastTab) {
      const last = lastTab as ScanTab;
      setActiveTabId(last.id);
      setFocusedTabId(last.id);
      onTabSelect?.(last);
    } else if (newTabs.length > 0 && !newTabs.find((t) => t.id === activeTabId)) {
      setActiveTabId(newTabs[0].id);
    }
    setShowBiteDropdown(false);
    setShowAddDropdown(false);
    onTabsChange?.(newTabs);
  };

  return (
    <div
      className="w-full"
      style={{
        // Strip is exactly the tab height — no vertical padding.
        minHeight: '44px',
        height: '100%',
        backgroundColor: 'var(--ads-bg-surface)',
        fontFamily: "'Roboto', sans-serif",
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 0,
        paddingRight: '12px',
        paddingTop: 0,
        paddingBottom: 0,
        gap: '8px', // separator gap between tablist group and add button
        borderBottom: '1px solid var(--ads-border-subtle)',
      }}
    >
      <style>{`
        @keyframes scan-tab-in {
          from { opacity: 0; transform: translateY(4px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .scan-tab-enter { animation: none !important; }
        }
        .scan-tab-close::after {
          content: ""; position: absolute; inset: -6px;
        }
      `}</style>

      {/* Tablist — its own container, isolates tab keyboard nav and visual grouping */}
      <div
        role="tablist"
        aria-label="Scan layers"
        aria-orientation="horizontal"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          minWidth: 0,
        }}
      >
        {tabs.length === 0 && (
          <span
            style={{
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--ads-text-tertiary)',
              fontSize: '14px',
              fontWeight: 400,
              paddingLeft: '8px',
              paddingRight: '8px',
            }}
          >
            No layers — click + to add
          </span>
        )}

        {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const isHovered = hoveredTabId === tab.id && !isActive;
        const isFocusTarget = (focusedTabId ?? activeTabId) === tab.id;
        const isNew = newTabIds.has(tab.id);
        const showClose = isActive || isHovered || focusedTabId === tab.id;
        const canClose = tabs.length > 1;

        // Container is white. Active state is signalled by the 1px
        // primary top line + primary-color text. Inactive tabs get a
        // subtle hover wash for affordance.
        const baseBg = isHovered && !isActive
          ? 'var(--ads-background-subtle-hover)'
          : 'transparent';

        return (
          <div
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            role="tab"
            id={`scan-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`scan-tabpanel-${tab.id}`}
            tabIndex={isFocusTarget ? 0 : -1}
            onClick={() => handleTabClick(tab)}
            onMouseEnter={() => setHoveredTabId(tab.id)}
            onMouseLeave={() => setHoveredTabId(null)}
            onFocus={() => setFocusedTabId(tab.id)}
            onKeyDown={(e) => handleTabKeyDown(e, tab)}
            className="relative cursor-pointer flex items-center scan-tab-enter"
            style={{
              height: '44px',
              paddingLeft: '12px',
              paddingRight: '6px',
              backgroundColor: baseBg,
              transition: 'background-color 0.15s ease',
              minWidth: '120px',
              maxWidth: '240px',
              overflow: 'hidden',
              outline: 'none',
              // Flat tabs — no radius, no top/bottom border. A single
              // 1px right-border per tab acts as the divider between
              // adjacent tabs (no doubling, no margin tricks). The 1px
              // primary top line identifies the active tab.
              borderRadius: 0,
              borderTop: 'none',
              borderBottom: 'none',
              borderLeft: 'none',
              borderRight: '1px solid var(--ads-border-subtle)',
              boxShadow: 'none',
              animation: isNew ? 'scan-tab-in 0.18s ease-out both' : undefined,
            }}
          >
            {/* Active tab marker — single 1px line using the CTA
                primary-button background token, so it always matches the
                primary button color. */}
            {isActive && (
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'var(--ads-btn-primary-bg)',
                  pointerEvents: 'none',
                }}
              />
            )}
            <span
              className="truncate select-none"
              style={{
                // body-01 token — 14px / 20px / 400.
                fontFamily: 'var(--ads-font-sans)',
                fontSize: 'var(--tp-body-01-size)',
                lineHeight: 'var(--tp-body-01-lh)',
                fontWeight: 400,
                color: isActive ? 'var(--ads-text-primary)' : 'var(--ads-text-secondary)',
                transition: 'color 0.15s ease',
                flex: 1,
                minWidth: 0,
              }}
            >
              {tab.label}
            </span>


            {/* Close — styled like our Ghost (secondary) button: transparent
                fill, subtle hover wash, secondary text color. Visible on
                active / hover / focus; can't close the last tab. */}
            {canClose && showClose && (
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTabClose(tab.id);
                }}
                aria-label={`Close ${tab.label}`}
                aria-controls={`scan-tab-${tab.id}`}
                className="scan-tab-close btn btn-ghost btn-sm flex items-center justify-center shrink-0 relative"
                data-design-system="ghost-button"
                style={{
                  width: '20px',
                  height: '20px',
                  minWidth: '20px',
                  marginLeft: '8px',
                  padding: 0,
                  borderRadius: 'var(--ads-radius-sm)',
                  color: 'var(--ads-text-secondary)',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M2 2L10 10M10 2L2 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        );
        })}
      </div>

      {/* Add tab button (+) — separated from the tablist; gap from parent container */}
      <div
        className="relative"
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '44px',
        }}
        ref={dropdownRef}
      >
        <GhostButton
          onClick={() => {
            setShowAddDropdown(!showAddDropdown);
            setShowBiteDropdown(false);
          }}
          size={36}
          aria-label="Add layer"
          aria-haspopup="menu"
          aria-expanded={showAddDropdown}
          selected={showAddDropdown}
          style={{ width: 32, height: 32, padding: 0, minWidth: 32 }}
        >
          <svg className="block" width="18" height="18" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 6V18M6 12H18"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </GhostButton>

        {showAddDropdown && (
          <div
            role="menu"
            aria-label="Add layer"
            style={{
              position: 'absolute',
              top: '40px',
              left: '0',
              backgroundColor: 'var(--ads-bg-surface)',
              borderRadius: 'var(--ads-radius-sm)',
              boxShadow: 'var(--ads-shadow-sm)',
              border: '1px solid var(--ads-border-subtle)',
              zIndex: 100,
              minWidth: '240px',
              padding: '6px',
              overflow: 'visible',
            }}
          >
            <DropdownItem label="Pre Treatment" onClick={() => handleAddLayer('pre-treatment')} />
            <DropdownItem label="Additional Scan" onClick={() => handleAddLayer('additional-scan')} />
            <DropdownItem label="Additional Bite" hasSubmenu onClick={() => handleAddLayer('additional-bite')} />

            {showBiteDropdown && (
              <div
                role="menu"
                aria-label="Bite types"
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '100%',
                  marginLeft: '6px',
                  backgroundColor: 'var(--ads-bg-surface)',
                  borderRadius: 'var(--ads-radius-sm)',
                  boxShadow: 'var(--ads-shadow-sm)',
                  border: '1px solid var(--ads-border-subtle)',
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

                <div style={{ height: '1px', backgroundColor: 'var(--ads-border-subtle)', margin: '6px 0' }} />
                <button
                  onClick={handleAddSelectedBites}
                  disabled={selectedBites.size === 0}
                  className={`btn btn-md ${selectedBites.size > 0 ? 'btn-primary' : ''}`}
                  style={{ width: '100%', fontWeight: 500 }}
                >
                  <span>
                    {tabs.some((t) => t.layerType === 'additional-bite') ? 'Update' : 'Add Selected'} ({selectedBites.size})
                  </span>
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
      role="menuitem"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full flex items-center justify-between"
      style={{
        padding: '10px 12px',
        borderRadius: 'var(--ads-radius-sm)',
        fontSize: 'var(--ads-size-font-body)',
        lineHeight: 'var(--ads-size-lh-body)',
        color: 'var(--ads-text-primary)',
        fontFamily: 'var(--ads-font-sans)',
        fontWeight: 400,
        backgroundColor: isHovered ? 'var(--ads-background-subtle-hover)' : 'transparent',
        transition: 'background-color 0.1s ease',
        textAlign: 'left',
        cursor: 'pointer',
        border: 'none',
      }}
    >
      <span>{label}</span>
      {hasSubmenu && (
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4.5 3L7.5 6L4.5 9" stroke="var(--ads-icon-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
      role="menuitemcheckbox"
      aria-checked={checked}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full flex items-center"
      style={{
        gap: 'var(--ads-size-control-gap)',
        padding: '10px 12px',
        borderRadius: 'var(--ads-radius-sm)',
        fontSize: 'var(--ads-size-font-body)',
        lineHeight: 'var(--ads-size-lh-body)',
        color: 'var(--ads-text-primary)',
        fontFamily: 'var(--ads-font-sans)',
        fontWeight: 400,
        backgroundColor: isHovered ? 'var(--ads-background-subtle-hover)' : 'transparent',
        transition: 'background-color 0.1s ease',
        textAlign: 'left',
        cursor: 'pointer',
        border: 'none',
      }}
    >
      <span className={`cbx ${checked ? 'on' : ''}`} aria-hidden>
        {checked && (
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="var(--ads-icon-on-color-primary)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4,11 9,16 16,5" />
          </svg>
        )}
      </span>
      <span>{label}</span>
    </button>
  );
}
