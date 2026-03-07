import React, { useState } from 'react';
import { motion } from 'motion/react';
import type { ScanTab } from './ScanTabs';
import { SecondaryButton } from '../design-system';

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
        width: '240px',
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
          padding: '6px',
          borderBottom: isExpanded ? '1px solid #E5E7EB' : 'none',
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
              padding: '4px 0',
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
        width: '24px',
        height: '24px',
        transform: `rotate(${isExpanded ? 180 : 0}deg)`,
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <svg
        className="block"
        width="24"
        height="24"
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
  return (
    <SecondaryButton
      size={36}
      style={{ width: 36, padding: 0, minHeight: 36 }}
      onClick={onClick}
    >
      <PanelChevronIcon isExpanded={isExpanded} />
    </SecondaryButton>
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
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9, transition: { type: 'spring', stiffness: 600, damping: 15 } }}
      style={{
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        backgroundColor: active ? '#E0F2FE' : hovered ? '#f5f5f5' : 'transparent',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <JawIcon type={icon} active={active} />
    </motion.div>
  );
}

function JawIcon({ type, active }: { type: 'upper' | 'lower' | 'both'; active: boolean }) {
  const color = active ? '#009ACE' : '#999999';
  const fillColor = active ? 'rgba(0, 154, 206, 0.1)' : 'none';

  if (type === 'upper') {
    // Upper jaw: U-shape opening downward (arch with teeth bumps at top)
    return (
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
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
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
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
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
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
        padding: '0 6px',
        margin: '2px 0',
      }}
    >
      <div
        style={{
          borderRadius: '6px',
          backgroundColor: state.selected ? '#F5F5F5' : isHovered ? '#FAFAFA' : 'transparent',
          transition: 'all 0.12s ease',
          padding: '8px 0px',
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
          {/* Layer name */}
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
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
              width: '30px',
              height: '30px',
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
            gap: '16px',
            marginTop: '8px',
            opacity: isHidden ? 0.4 : 1,
            transition: 'opacity 0.15s ease',
          }}
        >
          <OpacitySlider
            value={state.opacity}
            disabled={isHidden}
            onChange={(val) => onOpacityChange(val)}
          />
          <div
            style={{
              minWidth: '44px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 500,
              color: isHidden ? '#CCCCCC' : '#333333',
              fontVariantNumeric: 'tabular-nums',
              fontFamily: "'Roboto', system-ui, sans-serif",
              flexShrink: 0,
              padding: '4px 8px',
            }}
          >
            {state.opacity}%
          </div>
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
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
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
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
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

// ============================================================================
// Opacity Slider (custom track + thumb like reference)
// ============================================================================

function OpacitySlider({
  value,
  disabled,
  onChange,
}: {
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState(false);

  const updateValue = (clientX: number) => {
    if (!trackRef.current || disabled) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.round(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
    onChange(pct);
  };

  React.useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => updateValue(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging]);

  return (
    <div
      ref={trackRef}
      onMouseDown={(e) => {
        if (disabled) return;
        setDragging(true);
        updateValue(e.clientX);
      }}
      style={{
        flex: 1,
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        cursor: disabled ? 'default' : 'pointer',
        position: 'relative',
      }}
    >
      {/* Track background */}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        height: '4px',
        borderRadius: '2px',
        backgroundColor: '#E5E7EB',
      }} />
      {/* Track fill */}
      <div style={{
        position: 'absolute',
        left: 0,
        width: `${value}%`,
        height: '4px',
        borderRadius: '2px',
        backgroundColor: disabled ? '#CCCCCC' : '#009ACE',
        transition: dragging ? 'none' : 'width 0.1s ease',
      }} />
      {/* Thumb */}
      <div style={{
        position: 'absolute',
        left: `${value}%`,
        transform: 'translateX(-50%)',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        backgroundColor: '#FFFFFF',
        border: `2px solid ${disabled ? '#CCCCCC' : '#009ACE'}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        transition: dragging ? 'none' : 'left 0.1s ease',
        cursor: disabled ? 'default' : 'grab',
      }} />
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================

