import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import type { ScanTab } from './ScanTabs';
import { SecondaryButton } from '../design-system';
import upperJawRaw from '@/assets/jaw/upper-jaw.svg?raw';
import lowerJawRaw from '@/assets/jaw/lower-jaw.svg?raw';
import bothJawRaw from '@/assets/jaw/both-jaw.svg?raw';

type JawSelection = 'upper' | 'lower' | 'both';
type Jaw = 'upper' | 'lower';

interface LayerState {
  /** Per-arch visibility — each jaw's eye toggles independently. */
  visibleUpper: boolean;
  visibleLower: boolean;
  opacityUpper: number;
  opacityLower: number;
  selected: boolean;
}

interface ViewLayersPanelProps {
  scanTabs: ScanTab[];
  onOpacityChange?: (jaw: Jaw, opacity: number) => void;
  onVisibilityChange?: (layerVisibility: Record<string, boolean>) => void;
  /** Controlled jaw selection. When provided, the panel reflects this value
   *  instead of its own internal state (used to drive the shared 3D model). */
  jawSelection?: JawSelection;
  /** Fired when the user picks a different jaw. */
  onJawSelectionChange?: (jaw: JawSelection) => void;
}

const makeInitialState = (): LayerState => ({
  visibleUpper: true,
  visibleLower: true,
  opacityUpper: 100,
  opacityLower: 100,
  selected: false,
});

const isLayerVisible = (s: LayerState) => s.visibleUpper || s.visibleLower;

export default function ViewLayersPanel({ scanTabs, onOpacityChange, onVisibilityChange, jawSelection: jawSelectionProp, onJawSelectionChange }: ViewLayersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [internalJawSelection, setInternalJawSelection] = useState<JawSelection>('both');
  // Controlled when a jawSelection prop is supplied; otherwise self-managed.
  const jawSelection = jawSelectionProp ?? internalJawSelection;
  const setJawSelection = (jaw: JawSelection) => {
    if (jawSelectionProp === undefined) setInternalJawSelection(jaw);
    onJawSelectionChange?.(jaw);
  };
  const [layerStates, setLayerStates] = useState<Record<string, LayerState>>(() => {
    const initial: Record<string, LayerState> = {};
    scanTabs.forEach((tab) => {
      initial[tab.id] = makeInitialState();
    });
    return initial;
  });
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);

  // Sync layer states with scan tabs — add new, remove stale
  React.useEffect(() => {
    setLayerStates((prev) => {
      const next: Record<string, LayerState> = {};
      scanTabs.forEach((tab) => {
        next[tab.id] = prev[tab.id] || makeInitialState();
      });
      return next;
    });
  }, [scanTabs]);

  const toggleJawVisibility = (id: string, jaw: Jaw) => {
    setLayerStates((prev) => {
      const cur = prev[id];
      const nowVisible = jaw === 'upper' ? !cur.visibleUpper : !cur.visibleLower;
      const next = {
        ...prev,
        [id]: {
          ...cur,
          visibleUpper: jaw === 'upper' ? !cur.visibleUpper : cur.visibleUpper,
          visibleLower: jaw === 'lower' ? !cur.visibleLower : cur.visibleLower,
        },
      };
      // Actually hide/show the arch in the shared 3D model by driving the
      // existing per-arch opacity pipeline: fade the mesh to 0 when hidden,
      // restore to its slider opacity when shown. Only the layer that drives
      // the 3D model (selected, else first) affects it — same rule as opacity.
      const selectedId = Object.keys(next).find((k) => next[k].selected) || Object.keys(next)[0];
      if (selectedId && id === selectedId) {
        const restore = jaw === 'upper' ? cur.opacityUpper : cur.opacityLower;
        onOpacityChange?.(jaw, nowVisible ? restore : 0);
      }
      return next;
    });
  };

  // Report visibility changes to parent whenever layerStates change.
  // Layer-level visible = either arch visible (preserves existing parent contract).
  const prevLayerStatesRef = React.useRef(layerStates);
  React.useEffect(() => {
    if (prevLayerStatesRef.current !== layerStates && onVisibilityChange) {
      const visMap: Record<string, boolean> = {};
      scanTabs.forEach((tab) => {
        if (layerStates[tab.id]) visMap[tab.id] = isLayerVisible(layerStates[tab.id]);
      });
      onVisibilityChange(visMap);
    }
    prevLayerStatesRef.current = layerStates;
  }, [layerStates, onVisibilityChange, scanTabs]);

  const setOpacity = (id: string, jaw: Jaw, value: number) => {
    setLayerStates((prev) => {
      const cur = prev[id];
      const next = {
        ...prev,
        [id]: {
          ...cur,
          opacityUpper: jaw === 'upper' ? value : cur.opacityUpper,
          opacityLower: jaw === 'lower' ? value : cur.opacityLower,
        },
      };
      // Report the changed arch + its opacity so the parent fades only that
      // arch's 3D mesh (upper slider → upper model, lower slider → lower model).
      // Only the active/selected layer drives the shared 3D model.
      const selectedId = Object.keys(next).find(k => next[k].selected) || Object.keys(next)[0];
      if (selectedId && id === selectedId) {
        onOpacityChange?.(jaw, value);
      }
      return next;
    });
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

  // Bite layers (additional bites) are only relevant to the bite/both view —
  // hide them when the panel is showing the upper or lower jaw on its own.
  const visibleTabs =
    jawSelection === 'both'
      ? scanTabs
      : scanTabs.filter((tab) => tab.layerType !== 'additional-bite');

  return (
    <div
      style={{
        width: '240px',
        backgroundColor: 'var(--ads-bg-surface)',
        borderRadius: 'var(--ads-radius-sm)',
        boxShadow: 'var(--ads-shadow-sm)',
        fontFamily: 'var(--ads-font-sans)',
        overflow: 'hidden',
        border: '1px solid var(--ads-border-subtle)',
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
          borderBottom: isExpanded ? '1px solid var(--ads-border-subtle)' : 'none',
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
            {visibleTabs.length === 0 ? (
              <div
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: 'var(--ads-text-muted)',
                }}
              >
                No scan layers added
              </div>
            ) : (
              visibleTabs.map((tab) => {
                const state = layerStates[tab.id] || makeInitialState();
                const isHovered = hoveredLayerId === tab.id;

                return (
                  <LayerRow
                    key={tab.id}
                    tab={tab}
                    state={state}
                    jawSelection={jawSelection}
                    isHovered={isHovered}
                    onMouseEnter={() => setHoveredLayerId(tab.id)}
                    onMouseLeave={() => setHoveredLayerId(null)}
                    onSelect={() => selectLayer(tab.id)}
                    onToggleJawVisibility={(jaw) => toggleJawVisibility(tab.id, jaw)}
                    onOpacityChange={(jaw, val) => setOpacity(tab.id, jaw, val)}
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
          stroke="var(--ads-text-secondary)"
          strokeWidth={1}
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
      onClick={onClick}
      aria-label={isExpanded ? 'Collapse layers' : 'Expand layers'}
      style={{ width: 36, height: 36, padding: 0, minWidth: 36 }}
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
      role="button"
      aria-label={`Select ${icon} jaw`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9, transition: { type: 'spring', stiffness: 600, damping: 15 } }}
      style={{
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--ads-radius-sm)',
        backgroundColor: active
          ? 'var(--ads-blue-50)'
          : hovered
          ? 'var(--ads-bg-muted)'
          : 'transparent',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <JawIcon type={icon} active={active} />
    </motion.div>
  );
}

const JAW_ICON_RAW: Record<'upper' | 'lower' | 'both', string> = {
  upper: upperJawRaw,
  lower: lowerJawRaw,
  both: bothJawRaw,
};

const JAW_ICON_SIZE = 32;

// Default (inactive) icon colour per jaw; active matches the toolbar's
// selected colour.
const JAW_DEFAULT_COLOR: Record<'upper' | 'lower' | 'both', string> = {
  upper: 'var(--ads-icon-secondary)',
  lower: 'var(--ads-icon-secondary)',
  both: 'var(--ads-icon-secondary)',
};
const JAW_ACTIVE_COLOR = '#008EC2';

function buildJawSvg(type: 'upper' | 'lower' | 'both', active: boolean): string {
  let svg = JAW_ICON_RAW[type];
  // Render at the icon size, preserving aspect ratio.
  svg = svg.replace(
    /<svg\s+width="\d+"\s+height="\d+"/,
    `<svg width="${JAW_ICON_SIZE}" height="${JAW_ICON_SIZE}"`,
  );
  // Recolour the artwork's blue (fills + strokes) for the current state.
  svg = svg.replace(/#3593D6/gi, active ? JAW_ACTIVE_COLOR : JAW_DEFAULT_COLOR[type]);
  return svg;
}

function JawIcon({ type, active }: { type: 'upper' | 'lower' | 'both'; active: boolean }) {
  // Inline SVG (vs <img>) for crisp scaling and so the colour can switch with
  // selection state. No opacity/filter — matches the toolbar icons' crispness.
  const html = React.useMemo(() => buildJawSvg(type, active), [type, active]);
  return (
    <span
      aria-hidden
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: JAW_ICON_SIZE,
        height: JAW_ICON_SIZE,
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ============================================================================
// Layer Row
// ============================================================================

function LayerRow({
  tab,
  state,
  jawSelection,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onSelect,
  onToggleJawVisibility,
  onOpacityChange,
}: {
  tab: ScanTab;
  state: LayerState;
  jawSelection: JawSelection;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onSelect: () => void;
  onToggleJawVisibility: (jaw: Jaw) => void;
  onOpacityChange: (jaw: Jaw, value: number) => void;
}) {
  const isHidden = !isLayerVisible(state);

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
          borderRadius: 'var(--ads-radius-md)',
          // v2.0 layer-selected ladder: 4.25% black wash for selected, slight
          // hover surface, transparent at rest. Plus a 2px brand-blue left
          // accent stripe when selected, matching the unified card model.
          backgroundColor: state.selected
            ? 'var(--ads-background-layer-selected)'
            : isHovered
            ? 'var(--ads-background-subtle-hover)'
            : 'transparent',
          borderLeft: state.selected
            ? '2px solid var(--ads-background-interactive)'
            : '2px solid transparent',
          transition: 'background-color var(--ads-duration-fast), border-color var(--ads-duration-fast)',
          padding: '8px 4px',
        }}
      >
        {/* Top row: layer name only — per-arch eye lives on each slider row below */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
          onClick={onSelect}
        >
          <span
            style={{
              fontSize: '13px',
              lineHeight: '18px',
              fontWeight: state.selected ? 500 : 400,
              color: isHidden
                ? 'var(--ads-text-disabled)'
                : state.selected
                ? 'var(--ads-blue-550)'
                : 'var(--ads-text-primary)',
              transition: 'color 0.15s ease',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1,
              minWidth: 0,
            }}
          >
            {tab.label}
          </span>
        </div>

        {/* Opacity sliders — one per visible jaw.
            When jawSelection==='both' we show two stacked sliders with U/L labels
            so each jaw has independent opacity control. */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            marginTop: '12px',
            opacity: isHidden ? 0.4 : 1,
            transition: 'opacity 0.15s ease',
          }}
        >
          {(jawSelection === 'upper' || jawSelection === 'both') && (
            <JawSlider
              jaw="upper"
              showIcon={jawSelection === 'both'}
              value={state.opacityUpper}
              visible={state.visibleUpper}
              disabled={!state.visibleUpper}
              onChange={(val) => onOpacityChange('upper', val)}
              onToggleVisibility={() => onToggleJawVisibility('upper')}
            />
          )}
          {(jawSelection === 'lower' || jawSelection === 'both') && (
            <JawSlider
              jaw="lower"
              showIcon={jawSelection === 'both'}
              value={state.opacityLower}
              visible={state.visibleLower}
              disabled={!state.visibleLower}
              onChange={(val) => onOpacityChange('lower', val)}
              onToggleVisibility={() => onToggleJawVisibility('lower')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// JawSlider — opacity slider with the U/L jaw-arch icon on the left and a
// per-jaw eye toggle on the right. The eye hides/shows that arch only.
function JawSlider({
  jaw,
  showIcon,
  value,
  visible,
  disabled,
  onChange,
  onToggleVisibility,
}: {
  jaw: Jaw;
  showIcon: boolean;
  value: number;
  visible: boolean;
  disabled: boolean;
  onChange: (val: number) => void;
  onToggleVisibility: () => void;
}) {
  const jawName = jaw === 'upper' ? 'Upper' : 'Lower';
  const labelId = `${jaw}-jaw-opacity-label`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Field label — matches the .label-01 typography token used elsewhere
          for meta text (e.g. patient details). Value is already shown on
          the slider thumb tooltip. */}
      {showIcon && (
        <span
          id={labelId}
          style={{
            color: disabled ? 'var(--ads-text-disabled)' : 'var(--ads-text-secondary)',
            fontFamily: 'var(--ads-font-sans)',
            fontSize: 'var(--tp-label-01-size)',
            lineHeight: 'var(--tp-label-01-lh)',
          }}
        >
          {jawName} jaw
        </span>
      )}
      {/* Slider row: slider + visibility toggle. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <OpacitySlider
          value={value}
          disabled={disabled}
          onChange={onChange}
          aria-labelledby={showIcon ? labelId : undefined}
          aria-label={showIcon ? undefined : `${jawName} jaw opacity`}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          aria-label={visible ? `Hide ${jawName.toLowerCase()} arch` : `Show ${jawName.toLowerCase()} arch`}
          aria-pressed={!visible}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: 'var(--ads-radius-sm)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'background-color 0.12s ease, color 0.12s ease',
            color: visible ? 'var(--ads-text-secondary)' : 'var(--ads-text-tertiary)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--ads-background-subtle-hover)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          }}
        >
          {visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </button>
      </div>
    </div>
  );
}

// Mini jaw-arch indicator — minimalist half-circle "smile".
// Upper (∩) — arc opens downward, apex at top.
// Lower (∪) — arc opens upward,   apex at bottom.
function MiniJawIcon({ jaw }: { jaw: Jaw }) {
  const d =
    jaw === 'upper'
      ? 'M4 16 A8 8 0 0 1 20 16'
      : 'M4 8  A8 8 0 0 0 20 8';
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// ============================================================================
// Icons — shared stroke width for eye icons so they stay consistent
// ============================================================================

const EYE_ICON_STROKE_WIDTH = 2;

function EyeOpenIcon() {
  return <Eye size={20} color="var(--ads-text-secondary)" strokeWidth={EYE_ICON_STROKE_WIDTH} />;
}

function EyeClosedIcon() {
  return <EyeOff size={20} color="var(--ads-text-tertiary)" strokeWidth={EYE_ICON_STROKE_WIDTH} />;
}

// ============================================================================
// Opacity Slider (custom track + thumb like reference)
// ============================================================================

function OpacitySlider({
  value,
  disabled,
  onChange,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: {
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

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
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-valuetext={`${value}%`}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      tabIndex={disabled ? -1 : 0}
      onMouseDown={(e) => {
        if (disabled) return;
        setDragging(true);
        updateValue(e.clientX);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={(e) => {
        if (disabled) return;
        const step = e.shiftKey ? 10 : 1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          onChange(Math.min(100, value + step));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          onChange(Math.max(0, value - step));
        } else if (e.key === 'Home') {
          e.preventDefault();
          onChange(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          onChange(100);
        }
      }}
      style={{
        flex: 1,
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        cursor: disabled ? 'default' : 'pointer',
        position: 'relative',
        outline: 'none',
      }}
    >
      {/* Track background — design-system slider track */}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        height: '4px',
        borderRadius: '2px',
        backgroundColor: 'var(--ds-surface-active)',
        opacity: disabled ? 0.5 : 1,
      }} />
      {/* Track fill — design-system primary */}
      <div style={{
        position: 'absolute',
        left: 0,
        width: `${value}%`,
        height: '4px',
        borderRadius: '2px',
        backgroundColor: disabled ? 'var(--ads-text-disabled)' : 'var(--ds-color-primary)',
        transition: dragging ? 'none' : 'width 0.1s ease',
      }} />
      {/* Thumb — design-system 20px handle with hover/active scale */}
      <div style={{
        position: 'absolute',
        left: `${value}%`,
        transform: `translateX(-50%) scale(${dragging ? 1.15 : hovered ? 1.08 : 1})`,
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: 'var(--ds-surface-base, #fff)',
        border: `2px solid ${disabled ? 'var(--ads-text-disabled)' : 'var(--ds-color-primary)'}`,
        boxShadow: dragging ? 'var(--ads-shadow-md)' : 'var(--ads-shadow-sm)',
        transition: `transform 120ms cubic-bezier(0.2, 0, 0, 1)${dragging ? '' : ', left 0.1s ease'}`,
        cursor: disabled ? 'default' : 'grab',
      }}>
        {/* Floating toast */}
        <div style={{
          position: 'absolute',
          bottom: '22px',
          left: '50%',
          transform: `translateX(-50%) scale(${dragging ? 1 : 0.8})`,
          opacity: dragging ? 1 : 0,
          pointerEvents: 'none',
          // Matches the toolbar button tooltip (dark surface, light text).
          backgroundColor: 'var(--ds-tooltip-bg)',
          color: 'var(--ds-tooltip-text)',
          fontSize: '12px',
          fontWeight: 400,
          fontFamily: 'var(--ads-font-sans)',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1.5,
          padding: '4px 8px',
          borderRadius: 'var(--ads-radius-sm)',
          whiteSpace: 'nowrap',
          transition: 'opacity 0.15s ease, transform 0.15s ease',
        }}>
          {value}%
          {/* Arrow */}
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--ds-tooltip-bg)',
          }} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================

