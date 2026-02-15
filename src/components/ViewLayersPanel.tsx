import React, { useState } from 'react';
import { motion } from 'motion/react';
import type { ScanTab } from './ScanTabs';

type JawSelection = 'upper' | 'lower' | 'both';

interface LayerState {
  visible: boolean;
  opacity: number;
  selected: boolean;
}

interface ViewLayersPanelProps {
  scanTabs: ScanTab[];
}

export default function ViewLayersPanel({ scanTabs }: ViewLayersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [jawSelection, setJawSelection] = useState<JawSelection>('both');
  const [layerStates, setLayerStates] = useState<Record<string, LayerState>>(() => {
    const initial: Record<string, LayerState> = {};
    scanTabs.forEach((tab) => {
      initial[tab.id] = { visible: true, opacity: 100, selected: false };
    });
    return initial;
  });
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);

  // Sync if new tabs appear
  React.useEffect(() => {
    setLayerStates((prev) => {
      const next = { ...prev };
      scanTabs.forEach((tab) => {
        if (!next[tab.id]) {
          next[tab.id] = { visible: true, opacity: 100, selected: false };
        }
      });
      return next;
    });
  }, [scanTabs]);

  const toggleVisibility = (id: string) => {
    setLayerStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], visible: !prev[id].visible },
    }));
  };

  const setOpacity = (id: string, value: number) => {
    setLayerStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], opacity: value },
    }));
  };

  const selectLayer = (id: string) => {
    setLayerStates((prev) => {
      const next: Record<string, LayerState> = {};
      Object.keys(prev).forEach((key) => {
        next[key] = { ...prev[key], selected: key === id ? !prev[key].selected : false };
      });
      return next;
    });
  };

  return (
    <div
      style={{
        width: '301px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)',
        fontFamily: "'Roboto', system-ui, sans-serif",
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.06)',
        transition: 'height 0.25s ease',
      }}
    >
      {/* Header: Jaw selector + expand/collapse */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px',
          borderBottom: isExpanded ? '1px solid #EBEBEB' : 'none',
        }}
      >
        <JawButton
          icon="upper"
          active={jawSelection === 'upper'}
          onClick={() => setJawSelection('upper')}
        />
        <JawButton
          icon="lower"
          active={jawSelection === 'lower'}
          onClick={() => setJawSelection('lower')}
        />
        <JawButton
          icon="both"
          active={jawSelection === 'both'}
          onClick={() => setJawSelection('both')}
        />
        <div style={{ flex: 1 }} />
        <ExpandCollapseButton isExpanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} />
      </div>

      {isExpanded && (
        <div>
          {/* Layer List */}
          <div
            style={{
              maxHeight: '360px',
              overflowY: 'auto',
              padding: '8px 0',
            }}
          >
            {scanTabs.length === 0 ? (
              <div
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: '#999999',
                }}
              >
                No scan layers added
              </div>
            ) : (
              scanTabs.map((tab) => {
                const state = layerStates[tab.id] || { visible: true, opacity: 100, selected: false };
                const isHovered = hoveredLayerId === tab.id;

                return (
                  <LayerRow
                    key={tab.id}
                    tab={tab}
                    state={state}
                    isHovered={isHovered}
                    onMouseEnter={() => setHoveredLayerId(tab.id)}
                    onMouseLeave={() => setHoveredLayerId(null)}
                    onSelect={() => selectLayer(tab.id)}
                    onToggleVisibility={() => toggleVisibility(tab.id)}
                    onOpacityChange={(val) => setOpacity(tab.id, val)}
                  />
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Expand / Collapse Button (matches toolbar style)
// ============================================================================

function PanelChevronIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <div
      className="relative shrink-0 flex items-center justify-center"
      style={{
        width: '32px',
        height: '32px',
        transform: `rotate(${isExpanded ? 180 : 0}deg)`,
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <svg
        className="block"
        width="32"
        height="32"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M6 9L12 15L18 9"
          stroke="#717182"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function ExpandCollapseButton({ isExpanded, onClick }: { isExpanded: boolean; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center justify-center cursor-pointer relative shrink-0"
      whileHover={{ scale: 1.05 }}
      whileTap={{
        scale: 0.88,
        transition: {
          type: 'spring' as const,
          stiffness: 600,
          damping: 15,
        },
      }}
    >
      <div
        className="flex items-center justify-center rounded-[8px] transition-all duration-200"
        style={{
          width: '60px',
          height: '60px',
          border: `1px solid ${isHovered ? '#009ACE' : '#E5E7EB'}`,
          backgroundColor: isHovered ? '#f0f9ff' : 'transparent',
        }}
      >
        <PanelChevronIcon isExpanded={isExpanded} />
      </div>
    </motion.div>
  );
}

// ============================================================================
// Jaw Selector Button
// ============================================================================

function JawButton({
  icon,
  active,
  onClick,
}: {
  icon: 'upper' | 'lower' | 'both';
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        borderRadius: '8px',
        border: active ? '1.5px solid #009ACE' : '1.5px solid #E0E0E0',
        backgroundColor: active ? '#E8F4F8' : hovered ? '#F5F5F5' : '#FFFFFF',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        flexShrink: 0,
      }}
    >
      <JawIcon type={icon} active={active} />
    </button>
  );
}

function JawIcon({ type, active }: { type: 'upper' | 'lower' | 'both'; active: boolean }) {
  const color = active ? '#009ACE' : '#999999';
  const fillColor = active ? 'rgba(0, 154, 206, 0.1)' : 'none';

  if (type === 'upper') {
    // Upper jaw: U-shape opening downward (arch with teeth bumps at top)
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        {/* Arch shape */}
        <path
          d="M5 21C5 21 5 10 14 10C23 10 23 21 23 21"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill={fillColor}
        />
        {/* Teeth bumps along the arch */}
        <path
          d="M7 16.5C7.5 15 8.5 14 9.5 14C10.5 14 11 15 11.5 14C12 13 12.5 12.5 14 12.5C15.5 12.5 16 13 16.5 14C17 15 17.5 14 18.5 14C19.5 14 20.5 15 21 16.5"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }
  if (type === 'lower') {
    // Lower jaw: inverted U-shape opening upward
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        {/* Arch shape */}
        <path
          d="M5 7C5 7 5 18 14 18C23 18 23 7 23 7"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill={fillColor}
        />
        {/* Teeth bumps along the arch */}
        <path
          d="M7 11.5C7.5 13 8.5 14 9.5 14C10.5 14 11 13 11.5 14C12 15 12.5 15.5 14 15.5C15.5 15.5 16 15 16.5 14C17 13 17.5 14 18.5 14C19.5 14 20.5 13 21 11.5"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }
  // Both jaws: upper + lower with gap between
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      {/* Upper arch */}
      <path
        d="M6 15C6 15 6 6 14 6C22 6 22 15 22 15"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill={fillColor}
      />
      {/* Upper teeth */}
      <path
        d="M8 11.5C8.5 10.5 9.5 10 10.5 10C11.5 10 12 10.5 13 10C13.5 9.5 13.5 9 14 9C14.5 9 14.5 9.5 15 10C16 10.5 16.5 10 17.5 10C18.5 10 19.5 10.5 20 11.5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      {/* Lower arch */}
      <path
        d="M6 13C6 13 6 22 14 22C22 22 22 13 22 13"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill={fillColor}
      />
      {/* Lower teeth */}
      <path
        d="M8 16.5C8.5 17.5 9.5 18 10.5 18C11.5 18 12 17.5 13 18C13.5 18.5 13.5 19 14 19C14.5 19 14.5 18.5 15 18C16 17.5 16.5 18 17.5 18C18.5 18 19.5 17.5 20 16.5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// ============================================================================
// Layer Row
// ============================================================================

function LayerRow({
  tab,
  state,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onSelect,
  onToggleVisibility,
  onOpacityChange,
}: {
  tab: ScanTab;
  state: LayerState;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onOpacityChange: (value: number) => void;
}) {
  const isHidden = !state.visible;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        padding: '0 8px',
        margin: '2px 0',
      }}
    >
      <div
        style={{
          borderRadius: '6px',
          backgroundColor: state.selected ? '#F0F9FC' : isHovered ? '#F5F5F5' : 'transparent',
          borderLeft: state.selected ? '3px solid #009ACE' : '3px solid transparent',
          transition: 'all 0.12s ease',
          padding: '10px 12px 10px 10px',
        }}
      >
        {/* Top row: name + eye icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            cursor: 'pointer',
          }}
          onClick={onSelect}
        >
          {/* Layer color dot + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getLayerColor(tab.layerType),
                flexShrink: 0,
                opacity: isHidden ? 0.35 : 1,
                transition: 'opacity 0.15s ease',
              }}
            />
            <span
              style={{
                fontSize: '13px',
                lineHeight: '18px',
                fontWeight: state.selected ? 600 : 400,
                color: isHidden ? '#BBBBBB' : state.selected ? '#009ACE' : '#333333',
                transition: 'color 0.15s ease',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {tab.label}
            </span>
          </div>

          {/* Eye toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '26px',
              height: '26px',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background-color 0.12s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            }}
          >
            {state.visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </button>
        </div>

        {/* Opacity slider row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '6px',
            paddingLeft: '16px',
            opacity: isHidden ? 0.4 : 1,
            transition: 'opacity 0.15s ease',
          }}
        >
          <OpacityIcon />
          <input
            type="range"
            min={0}
            max={100}
            value={state.opacity}
            disabled={isHidden}
            onChange={(e) => onOpacityChange(Number(e.target.value))}
            style={{
              flex: 1,
              height: '4px',
              appearance: 'none',
              WebkitAppearance: 'none',
              background: isHidden
                ? '#E0E0E0'
                : `linear-gradient(to right, #009ACE ${state.opacity}%, #E0E0E0 ${state.opacity}%)`,
              borderRadius: '2px',
              outline: 'none',
              cursor: isHidden ? 'default' : 'pointer',
              accentColor: '#009ACE',
            }}
          />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: isHidden ? '#CCCCCC' : '#666666',
              minWidth: '30px',
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {state.opacity}%
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Icons
// ============================================================================

function EyeOpenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 4C4.5 4 2 8 2 8C2 8 4.5 12 8 12C11.5 12 14 8 14 8C14 8 11.5 4 8 4Z"
        stroke="#666666"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="2" stroke="#666666" strokeWidth="1.3" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 3L13 13"
        stroke="#BBBBBB"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M6.5 6.8C5.7 7.4 5.3 8.4 5.7 9.4C6.1 10.4 7 11 8 11C8.6 11 9.1 10.8 9.5 10.5"
        stroke="#BBBBBB"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M8 4C4.5 4 2 8 2 8C2 8 3 9.5 4.5 10.5"
        stroke="#BBBBBB"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M11 5.5C12.5 6.5 14 8 14 8C14 8 11.5 12 8 12"
        stroke="#BBBBBB"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OpacityIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="#999999" strokeWidth="1.2" />
      <path
        d="M6 1C6 1 6 6 6 11"
        stroke="#999999"
        strokeWidth="1"
      />
      <path
        d="M6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11"
        fill="#999999"
        fillOpacity="0.3"
      />
    </svg>
  );
}

// ============================================================================
// Helpers
// ============================================================================

function getLayerColor(layerType: string): string {
  switch (layerType) {
    case 'treatment-scan':
      return '#009ACE';
    case 'pre-treatment':
      return '#F59E0B';
    case 'additional-scan':
      return '#10B981';
    case 'additional-bite':
      return '#8B5CF6';
    default:
      return '#999999';
  }
}
