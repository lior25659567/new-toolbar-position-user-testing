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
  onOpacityChange?: (opacity: number) => void;
  onVisibilityChange?: (layerVisibility: Record<string, boolean>) => void;
}

export default function ViewLayersPanel({ scanTabs, onOpacityChange, onVisibilityChange }: ViewLayersPanelProps) {
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

  // Sync layer states with scan tabs — add new, remove stale
  React.useEffect(() => {
    setLayerStates((prev) => {
      const tabIds = new Set(scanTabs.map((t) => t.id));
      const next: Record<string, LayerState> = {};
      // Keep existing states for current tabs
      scanTabs.forEach((tab) => {
        next[tab.id] = prev[tab.id] || { visible: true, opacity: 100, selected: false };
      });
      return next;
    });
  }, [scanTabs]);

  const toggleVisibility = (id: string) => {
    setLayerStates((prev) => {
      const next = {
        ...prev,
        [id]: { ...prev[id], visible: !prev[id].visible },
      };
      return next;
    });
  };

  // Report visibility changes to parent whenever layerStates change
  const prevLayerStatesRef = React.useRef(layerStates);
  React.useEffect(() => {
    if (prevLayerStatesRef.current !== layerStates && onVisibilityChange) {
      const visMap: Record<string, boolean> = {};
      // Only report for tabs that currently exist
      scanTabs.forEach((tab) => {
        if (layerStates[tab.id]) visMap[tab.id] = layerStates[tab.id].visible;
      });
      onVisibilityChange(visMap);
    }
    prevLayerStatesRef.current = layerStates;
  }, [layerStates, onVisibilityChange, scanTabs]);

  const setOpacity = (id: string, value: number) => {
    setLayerStates((prev) => {
      const next = { ...prev, [id]: { ...prev[id], opacity: value } };
      // Find the selected/first visible layer's opacity to send to 3D model
      const selectedId = Object.keys(next).find(k => next[k].selected) || Object.keys(next)[0];
      if (selectedId && id === selectedId) {
        onOpacityChange?.(value);
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
          strokeWidth={1.5}
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
  const color = active ? '#008EC2' : '#5E646E';
  const sw = 1.5;

  if (type === 'upper') {
    return (
      <svg width="28" height="28" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_upper_jaw)">
          <path d="M4 47V54.4999C4 57.2613 6.23858 59.4999 9 59.4999H51C53.7614 59.4999 56 57.2613 56 54.4999V46.7764" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M56.6016 36.0352C56.7305 35.3087 55.5821 35.1798 55.5704 35.918C55.4532 36.6446 56.5899 36.7735 56.6016 36.0352ZM55.3477 24.5977C55.2188 23.8477 54.1055 24.0587 54.3282 24.8087C54.4571 25.5587 55.5704 25.336 55.3477 24.5977ZM40.5235 8.13287C41.2032 8.55475 40.4766 9.45709 39.879 8.95319C39.1993 8.53131 39.9259 7.62897 40.5235 8.13287ZM30.0938 5.09772C30.8907 5.15631 30.6798 6.28131 29.9063 6.12897C29.1095 6.07037 29.3204 4.93366 30.0938 5.09772ZM19.6407 8.05084C20.3673 7.72272 20.7071 8.82428 19.9571 9.04694C19.2305 9.36334 18.8907 8.2735 19.6407 8.05084ZM4.6993 24.4571C4.31258 25.1133 5.32039 25.6524 5.61336 24.9376C6.00008 24.2813 4.99227 23.7422 4.6993 24.4571ZM3.39852 35.918C3.26961 36.6446 4.41805 36.7735 4.42977 36.0352C4.54696 35.3087 3.41024 35.1798 3.39852 35.918Z" fill={color}/>
          <path d="M5.71601 25.2074L9.15015 26.5855L9.15273 26.5872C10.3281 27.0501 11.0368 28.1662 10.7273 29.3213L9.19558 35.0376C9.03857 35.6236 8.66967 36.0584 8.18736 36.3214L8.1625 36.335L8.13902 36.3509C7.94335 36.4883 7.62712 36.5802 7.17744 36.6079C6.73651 36.635 6.22338 36.5981 5.68308 36.529C5.14401 36.4599 4.60042 36.3621 4.09123 36.2743C3.61085 36.1915 3.14499 36.1151 2.77533 36.0915C1.60044 35.9324 0.857942 34.5724 1.19041 33.3698L2.95664 26.7782C3.25863 25.6511 4.41286 24.8536 5.47825 25.1325L5.71601 25.2074Z" stroke={color} strokeWidth={sw}/>
          <path d="M54.2761 25.0506L50.842 26.4288L50.8394 26.4305C49.664 26.8933 48.9554 28.0095 49.2649 29.1646L50.7965 34.8809C50.9536 35.4669 51.3225 35.9016 51.8048 36.1647L51.8296 36.1782L51.8531 36.1942C52.0488 36.3316 52.365 36.4235 52.8147 36.4511C53.2556 36.4782 53.7687 36.4414 54.309 36.3722C54.8481 36.3032 55.3917 36.2054 55.9009 36.1176C56.3813 36.0347 56.8471 35.9583 57.2168 35.9348C58.3917 35.7756 59.1342 34.4156 58.8017 33.2131L57.0355 26.6214C56.7335 25.4944 55.5793 24.6969 54.5139 24.9758L54.2761 25.0506Z" stroke={color} strokeWidth={sw}/>
          <path d="M10.4694 14.8666L13.382 17.1491L13.384 17.1514C14.3834 17.9241 14.7521 19.1938 14.1323 20.2164L11.0651 25.2775C10.7507 25.7963 10.2751 26.1108 9.73849 26.2286L9.71083 26.2347L9.68383 26.2435C9.45758 26.3208 9.12826 26.3207 8.68875 26.2216C8.2578 26.1245 7.77538 25.9458 7.27589 25.7285C6.77755 25.5117 6.28292 25.2659 5.81851 25.0394C5.38038 24.8257 4.9544 24.6223 4.60601 24.4964C3.52233 24.0155 3.1892 22.5022 3.84427 21.4404L7.38118 15.6043C7.98591 14.6064 9.31694 14.163 10.262 14.7284L10.4694 14.8666Z" stroke={color} strokeWidth={sw}/>
          <path d="M49.5227 14.7099L46.6101 16.9923L46.6081 16.9947C45.6087 17.7674 45.24 19.037 45.8598 20.0597L48.927 25.1208C49.2414 25.6396 49.7171 25.954 50.2536 26.0719L50.2813 26.078L50.3083 26.0867C50.5346 26.164 50.8639 26.164 51.3034 26.0649C51.7343 25.9678 52.2168 25.7891 52.7162 25.5718C53.2146 25.3549 53.7092 25.1092 54.1736 24.8827C54.6117 24.669 55.0377 24.4655 55.3861 24.3397C56.4698 23.8587 56.8029 22.3455 56.1479 21.2837L52.6109 15.4475C52.0062 14.4497 50.6752 14.0063 49.7301 14.5716L49.5227 14.7099Z" stroke={color} strokeWidth={sw}/>
          <path d="M18.0367 6.43792L20.3755 9.31944L20.3769 9.32218C21.1836 10.3034 21.2611 11.6082 20.451 12.4413L16.3991 16.6086C15.9876 17.0318 15.4637 17.2241 14.92 17.2136L14.8917 17.2133L14.8634 17.2158C14.629 17.2378 14.3099 17.1622 13.9048 16.9647C13.5079 16.7713 13.0793 16.487 12.6421 16.162C12.2059 15.8377 11.7792 15.4861 11.3781 15.1604C11 14.8535 10.6316 14.5597 10.3219 14.3583C9.3665 13.6387 9.37844 12.1039 10.2299 11.2422L14.9027 6.43633C15.6928 5.62375 17.0732 5.49613 17.8727 6.26481L18.0367 6.43792Z" stroke={color} strokeWidth={sw}/>
          <path d="M41.9554 6.28118L39.6167 9.1627L39.6153 9.16544C38.8085 10.1467 38.731 11.4514 39.5411 12.2845L43.5931 16.4519C44.0045 16.8751 44.5285 17.0674 45.0721 17.0569L45.1004 17.0566L45.1287 17.0591C45.3632 17.0811 45.6822 17.0055 46.0874 16.808C46.4842 16.6145 46.9129 16.3303 47.35 16.0053C47.7863 15.681 48.2129 15.3293 48.614 15.0037C48.9921 14.6968 49.3605 14.403 49.6702 14.2015C50.6256 13.4819 50.6137 11.9471 49.7623 11.0855L45.0894 6.27959C44.2993 5.46701 42.9189 5.33939 42.1195 6.10807L41.9554 6.28118Z" stroke={color} strokeWidth={sw}/>
          <path d="M29.4087 2.65634L29.8961 6.33585L29.8969 6.33869C30.0713 7.59364 29.451 8.75195 28.3106 9.0436L22.6329 10.4956C22.0542 10.6435 21.5016 10.5347 21.0401 10.2427L21.0161 10.2277L20.9907 10.215C20.7774 10.1117 20.5436 9.88065 20.3002 9.50155C20.0617 9.12984 19.8441 8.66356 19.6402 8.15836C19.4368 7.65418 19.2554 7.13189 19.0828 6.64479C18.919 6.1826 18.7575 5.73653 18.5967 5.40226C18.1644 4.29591 18.979 2.99311 20.1683 2.69909L26.7154 1.02473C27.8282 0.740385 29.0799 1.35405 29.3594 2.42402L29.4087 2.65634Z" stroke={color} strokeWidth={sw}/>
          <path d="M41.1236 5.4824L39.8338 8.64704L39.8329 8.64679L39.8321 8.64962C39.4133 9.69668 38.3696 10.3435 37.2515 10.0439L31.7493 8.56955C31.1828 8.41777 30.7635 8.07168 30.5096 7.63077L30.4958 7.60685L30.4786 7.58406C30.3496 7.40869 30.2599 7.12486 30.2289 6.71641C30.1985 6.31505 30.2281 5.84689 30.2883 5.3513C30.3485 4.85666 30.4366 4.35781 30.5155 3.88857C30.573 3.5463 30.6277 3.20949 30.6581 2.91476L30.6763 2.677C30.7431 2.1569 31.0759 1.73596 31.5666 1.47486C32.0619 1.21137 32.6833 1.13265 33.2408 1.28651L39.5863 2.98678C40.6889 3.28224 41.4335 4.35753 41.1834 5.29319L41.1236 5.4824Z" stroke={color} strokeWidth={sw}/>
          <path d="M2.75879 35.8779L6.43262 36.3203L6.43555 36.3213C7.69068 36.4642 8.66406 37.3589 8.66406 38.5547V44.4727C8.66406 45.0793 8.42025 45.5947 8.02246 45.9736L8.00195 45.9932L7.9834 46.0146C7.82997 46.198 7.5483 46.3686 7.12109 46.5117C6.70219 46.652 6.19702 46.7492 5.65723 46.8223C5.11866 46.8951 4.56827 46.9413 4.05371 46.9883C3.56826 47.0326 3.0985 47.0794 2.73535 47.1523C1.55929 47.3027 0.490099 46.1812 0.5 44.9336V38.1094C0.500002 36.9426 1.40849 35.8735 2.50977 35.8672L2.75879 35.8779Z" stroke={color} strokeWidth={sw}/>
          <path d="M57.2333 35.7212L53.5595 36.1636L53.5566 36.1646C52.3014 36.3074 51.3281 37.2021 51.3281 38.3979V44.3159C51.3281 44.9226 51.5719 45.438 51.9697 45.8169L51.9902 45.8364L52.0087 45.8579C52.1622 46.0413 52.4438 46.2119 52.871 46.355C53.2899 46.4953 53.7951 46.5925 54.3349 46.6655C54.8735 46.7384 55.4239 46.7846 55.9384 46.8315C56.4239 46.8759 56.8936 46.9226 57.2568 46.9956C58.4328 47.1459 59.502 46.0244 59.4921 44.7769V37.9526C59.4921 36.7859 58.5836 35.7168 57.4824 35.7104L57.2333 35.7212Z" stroke={color} strokeWidth={sw}/>
        </g>
        <defs>
          <clipPath id="clip0_upper_jaw">
            <rect width="60" height="60" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    );
  }
  if (type === 'lower') {
    return (
      <svg width="28" height="28" viewBox="0 0 60 61" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M57.2333 24.2891L53.5595 23.8467L53.5566 23.8457C52.3014 23.7028 51.3281 22.8081 51.3281 21.6123L51.3281 15.6943C51.3281 15.0877 51.5719 14.5723 51.9697 14.1934L51.9902 14.1738L52.0087 14.1523C52.1622 13.969 52.4438 13.7984 52.871 13.6553C53.2899 13.515 53.7951 13.4177 54.3349 13.3447C54.8735 13.2719 55.4239 13.2257 55.9384 13.1787C56.4239 13.1344 56.8936 13.0876 57.2568 13.0146C58.4328 12.8643 59.502 13.9858 59.4921 15.2334L59.4921 22.0576C59.4921 23.2244 58.5836 24.2935 57.4824 24.2998L57.2333 24.2891Z" stroke={color} strokeWidth={sw}/>
        <path d="M2.75879 24.4458L6.43262 24.0034L6.43555 24.0024C7.69068 23.8596 8.66406 22.9649 8.66406 21.769L8.66406 15.8511C8.66406 15.2444 8.42025 14.729 8.02246 14.3501L8.00195 14.3306L7.9834 14.3091C7.82997 14.1257 7.5483 13.9551 7.12109 13.812C6.70219 13.6717 6.19702 13.5745 5.65723 13.5015C5.11866 13.4286 4.56827 13.3824 4.05371 13.3354C3.56826 13.2911 3.0985 13.2444 2.73535 13.1714C1.55929 13.0211 0.490099 14.1426 0.500001 15.3901L0.5 22.2144C0.500002 23.3811 1.40849 24.4502 2.50977 24.4565L2.75879 24.4458Z" stroke={color} strokeWidth={sw}/>
        <path d="M54.2761 34.9596L50.842 33.5815L50.8394 33.5798C49.664 33.1169 48.9554 32.0008 49.2649 30.8457L50.7965 25.1294C50.9536 24.5434 51.3225 24.1086 51.8048 23.8456L51.8296 23.832L51.8531 23.8161C52.0488 23.6787 52.365 23.5868 52.8147 23.5591C53.2556 23.532 53.7687 23.5689 54.309 23.638C54.8481 23.7071 55.3917 23.8049 55.9009 23.8927C56.3813 23.9755 56.8471 24.0519 57.2168 24.0754C58.3917 24.2346 59.1342 25.5946 58.8017 26.7971L57.0355 33.3888C56.7335 34.5159 55.5793 35.3134 54.5139 35.0345L54.2761 34.9596Z" stroke={color} strokeWidth={sw}/>
        <path d="M5.71601 35.1164L9.15015 33.7382L9.15273 33.7365C10.3281 33.2737 11.0368 32.1575 10.7273 31.0024L9.19558 25.2861C9.03857 24.7001 8.66967 24.2654 8.18736 24.0023L8.1625 23.9888L8.13902 23.9728C7.94335 23.8354 7.62712 23.7435 7.17744 23.7159C6.73651 23.6888 6.22338 23.7256 5.68308 23.7948C5.14401 23.8638 4.60042 23.9616 4.09124 24.0494C3.61085 24.1323 3.145 24.2087 2.77534 24.2322C1.60044 24.3914 0.857943 25.7514 1.19041 26.9539L2.95664 33.5456C3.25863 34.6726 4.41286 35.4701 5.47825 35.1912L5.71601 35.1164Z" stroke={color} strokeWidth={sw}/>
        <path d="M49.5227 45.3004L46.6101 43.0179L46.6081 43.0156C45.6087 42.2429 45.24 40.9732 45.8598 39.9505L48.927 34.8895C49.2414 34.3707 49.7171 34.0562 50.2536 33.9384L50.2813 33.9323L50.3083 33.9235C50.5346 33.8462 50.8639 33.8463 51.3034 33.9453C51.7343 34.0425 52.2168 34.2211 52.7162 34.4385C53.2146 34.6553 53.7092 34.9011 54.1736 35.1276C54.6117 35.3413 55.0377 35.5447 55.3861 35.6706C56.4698 36.1515 56.8029 37.6648 56.1479 38.7266L52.6109 44.5627C52.0062 45.5606 50.6752 46.004 49.7301 45.4386L49.5227 45.3004Z" stroke={color} strokeWidth={sw}/>
        <path d="M10.4694 45.4571L13.382 43.1747L13.384 43.1723C14.3834 42.3996 14.7521 41.13 14.1323 40.1073L11.0651 35.0462C10.7507 34.5274 10.2751 34.213 9.73849 34.0951L9.71083 34.089L9.68383 34.0803C9.45758 34.003 9.12826 34.003 8.68876 34.1021C8.2578 34.1992 7.77538 34.3779 7.27589 34.5952C6.77755 34.812 6.28292 35.0578 5.81851 35.2843C5.38038 35.498 4.9544 35.7015 4.60601 35.8273C3.52233 36.3083 3.1892 37.8215 3.84427 38.8833L7.38118 44.7194C7.98591 45.7173 9.31694 46.1607 10.262 45.5953L10.4694 45.4571Z" stroke={color} strokeWidth={sw}/>
        <path d="M41.9554 53.7291L39.6167 50.8476L39.6153 50.8448C38.8085 49.8636 38.731 48.5588 39.5411 47.7257L43.5931 43.5584C44.0045 43.1352 44.5285 42.9429 45.0721 42.9534L45.1004 42.9537L45.1287 42.9512C45.3632 42.9292 45.6822 43.0048 46.0874 43.2022C46.4842 43.3957 46.9129 43.68 47.35 44.005C47.7863 44.3293 48.2129 44.6809 48.614 45.0065C48.9921 45.3135 49.3605 45.6072 49.6702 45.8087C50.6256 46.5283 50.6137 48.0631 49.7623 48.9248L45.0894 53.7307C44.2993 54.5432 42.9189 54.6709 42.1195 53.9022L41.9554 53.7291Z" stroke={color} strokeWidth={sw}/>
        <path d="M18.0367 53.8858L20.3755 51.0043L20.3769 51.0016C21.1836 50.0203 21.2611 48.7156 20.451 47.8825L16.3991 43.7151C15.9876 43.2919 15.4637 43.0996 14.92 43.1101L14.8917 43.1104L14.8634 43.1079C14.629 43.0859 14.3099 43.1615 13.9048 43.359C13.5079 43.5524 13.0793 43.8367 12.6421 44.1617C12.2059 44.486 11.7792 44.8377 11.3781 45.1633C11 45.4702 10.6316 45.764 10.322 45.9654C9.3665 46.6851 9.37844 48.2199 10.2299 49.0815L14.9027 53.8874C15.6928 54.7 17.0732 54.8276 17.8727 54.0589L18.0367 53.8858Z" stroke={color} strokeWidth={sw}/>
        <path d="M30.5834 57.5107L30.096 53.8311L30.0953 53.8283C29.9209 52.5734 30.5411 51.415 31.6816 51.1234L37.3592 49.6714C37.9379 49.5235 38.4906 49.6323 38.952 49.9243L38.976 49.9393L39.0014 49.952C39.2147 50.0553 39.4485 50.2863 39.6919 50.6654C39.9305 51.0372 40.148 51.5034 40.3519 52.0086C40.5553 52.5128 40.7367 53.0351 40.9093 53.5222C41.0731 53.9844 41.2346 54.4305 41.3954 54.7647C41.8277 55.8711 41.0131 57.1739 39.8238 57.4679L33.2767 59.1423C32.1639 59.4266 30.9122 58.8129 30.6327 57.743L30.5834 57.5107Z" stroke={color} strokeWidth={sw}/>
        <path d="M18.8685 54.6846L20.1583 51.5199L20.1593 51.5202L20.16 51.5174C20.5788 50.4703 21.6225 49.8235 22.7406 50.1231L28.2428 51.5974C28.8093 51.7492 29.2286 52.0953 29.4825 52.5362L29.4963 52.5601L29.5135 52.5829C29.6426 52.7583 29.7323 53.0421 29.7632 53.4506C29.7937 53.8519 29.7641 54.3201 29.7038 54.8157C29.6436 55.3103 29.5555 55.8092 29.4767 56.2784C29.4192 56.6207 29.3645 56.9575 29.334 57.2522L29.3158 57.49C29.249 58.0101 28.9162 58.431 28.4255 58.6921C27.9302 58.9556 27.3088 59.0343 26.7514 58.8805L20.4059 57.1802C19.3033 56.8848 18.5586 55.8095 18.8087 54.8738L18.8685 54.6846Z" stroke={color} strokeWidth={sw}/>
        <path d="M4 13C4 9.6601 4 7.5582 4 5.00026C4 2.79112 5.79086 1 8 1H12.5C14.7091 1 16.5 2.79086 16.5 5V25C16.5 32.4558 22.5442 38.5 30 38.5C37.4558 38.5 43.5 32.4558 43.5 25V4.5C43.5 2.29086 45.2909 0.5 47.5 0.5H52C54.2091 0.5 56 2.29086 56 4.5V13" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
      </svg>
    );
  }
  // Both jaws
  return (
    <svg width="28" height="28" viewBox="0 0 66 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.32663 22.1577C2.24746 22.1577 0.561951 20.4722 0.561951 18.393V5.69358C0.561951 2.37574 3.68267 -0.0569149 6.90018 0.752814L16.0402 3.05303C26.663 5.72639 37.7792 5.75443 48.4154 3.1347L58.2487 0.712708C61.4599 -0.0782403 64.562 2.35245 64.562 5.65968V18.9577C64.562 20.725 63.1293 22.1577 61.3619 22.1577" stroke={color} strokeWidth={sw}/>
      <path d="M15.0094 25.9182L15.0094 20.8774C15.0094 17.7185 12.6706 15.1576 9.78566 15.1576C6.90075 15.1576 4.56196 17.7185 4.56196 20.8774L4.56196 25.9182C4.56196 27.5264 5.74987 28.8271 7.21855 28.8271L12.3559 28.8271C13.8245 28.8271 15.0125 27.5264 15.0125 25.9182L15.0094 25.9182Z" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M26.5046 25.9182L26.5046 20.8774C26.5046 17.7185 23.9319 15.1576 20.7585 15.1576C17.5851 15.1576 15.0125 17.7185 15.0125 20.8774L15.0125 25.9182C15.0125 27.5264 16.3192 28.8271 17.9347 28.8271L23.5857 28.8271C25.2013 28.8271 26.508 27.5264 26.508 25.9182L26.5046 25.9182Z" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M38.0001 25.9182L38.0001 20.8774C38.0001 17.7185 35.4275 15.1576 32.2541 15.1576C29.0807 15.1576 26.508 17.7185 26.508 20.8774L26.508 25.9182C26.508 27.5264 27.8147 28.8271 29.4303 28.8271L35.0813 28.8271C36.6968 28.8271 38.0035 27.5264 38.0035 25.9182L38.0001 25.9182Z" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M46.5793 28.8271L40.9266 28.8271C39.3106 28.8271 38.0035 27.5264 38.0035 25.9182L38.0035 20.8774C38.0035 17.7185 40.5769 15.1576 43.7513 15.1576C46.9256 15.1576 49.499 17.7185 49.499 20.8774L49.499 25.9182C49.499 27.5264 48.1919 28.8271 46.5759 28.8271L46.5793 28.8271Z" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M58.0749 28.8271L52.4221 28.8271C50.8061 28.8271 49.499 27.5264 49.499 25.9182L49.499 20.8774C49.499 17.7185 52.0725 15.1576 55.2468 15.1576C58.4211 15.1576 60.9946 17.7185 60.9946 20.8774L60.9946 25.9182C60.9946 27.5264 59.6875 28.8271 58.0715 28.8271L58.0749 28.8271Z" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M60.7973 39.1577C62.8764 39.1577 64.562 40.8432 64.562 42.9224L64.562 54.0629C64.562 56.8767 62.2809 59.1577 59.4671 59.1577L32.562 59.1577L5.65677 59.1577C2.84298 59.1577 0.56195 56.8767 0.56195 54.0629L0.561951 43.1774C0.561951 40.9574 2.36165 39.1577 4.58168 39.1577" stroke={color} strokeWidth={sw}/>
      <path d="M50.5472 33.0666L50.5472 38.1074C50.5472 41.2664 52.8859 43.8273 55.7709 43.8273C58.6558 43.8273 60.9946 41.2664 60.9946 38.1074L60.9946 33.0666C60.9946 31.4585 59.8066 30.1577 58.338 30.1577L53.2007 30.1577C51.732 30.1577 50.5441 31.4585 50.5441 33.0666L50.5472 33.0666Z" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M39.0519 33.0666L39.0519 38.1074C39.0519 41.2664 41.6246 43.8273 44.798 43.8273C47.9714 43.8273 50.5441 41.2664 50.5441 38.1074L50.5441 33.0666C50.5441 31.4585 49.2374 30.1577 47.6218 30.1577L41.9708 30.1577C40.3552 30.1577 39.0485 31.4585 39.0485 33.0666L39.0519 33.0666Z" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M27.5564 33.0666L27.5564 38.1074C27.5564 41.2664 30.129 43.8273 33.3024 43.8273C36.4758 43.8273 39.0485 41.2664 39.0485 38.1074L39.0485 33.0666C39.0485 31.4585 37.7418 30.1577 36.1263 30.1577L30.4752 30.1577C28.8597 30.1577 27.553 31.4585 27.553 33.0666L27.5564 33.0666Z" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.9772 30.1577L24.6299 30.1577C26.2459 30.1577 27.553 31.4585 27.553 33.0666L27.553 38.1074C27.553 41.2664 24.9796 43.8273 21.8053 43.8273C18.6309 43.8273 16.0575 41.2664 16.0575 38.1074L16.0575 33.0666C16.0575 31.4585 17.3646 30.1577 18.9806 30.1577L18.9772 30.1577Z" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.48167 30.1577L13.1344 30.1577C14.7504 30.1577 16.0575 31.4585 16.0575 33.0666L16.0575 38.1074C16.0575 41.2664 13.4841 43.8273 10.3097 43.8273C7.13537 43.8273 4.56195 41.2664 4.56195 38.1074L4.56195 33.0666C4.56195 31.4585 5.86903 30.1577 7.48506 30.1577L7.48167 30.1577Z" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
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
          padding: '8px 12px',
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
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Icons — shared stroke width for eye icons so they stay consistent
// ============================================================================

const EYE_ICON_STROKE_WIDTH = 1.3;

function EyeOpenIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 4C4.5 4 2 8 2 8C2 8 4.5 12 8 12C11.5 12 14 8 14 8C14 8 11.5 4 8 4Z"
        stroke="#666666"
        strokeWidth={EYE_ICON_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="2" stroke="#666666" strokeWidth={EYE_ICON_STROKE_WIDTH} />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 3L13 13"
        stroke="#BBBBBB"
        strokeWidth={EYE_ICON_STROKE_WIDTH}
        strokeLinecap="round"
      />
      <path
        d="M6.5 6.8C5.7 7.4 5.3 8.4 5.7 9.4C6.1 10.4 7 11 8 11C8.6 11 9.1 10.8 9.5 10.5"
        stroke="#BBBBBB"
        strokeWidth={EYE_ICON_STROKE_WIDTH}
        strokeLinecap="round"
      />
      <path
        d="M8 4C4.5 4 2 8 2 8C2 8 3 9.5 4.5 10.5"
        stroke="#BBBBBB"
        strokeWidth={EYE_ICON_STROKE_WIDTH}
        strokeLinecap="round"
      />
      <path
        d="M11 5.5C12.5 6.5 14 8 14 8C14 8 11.5 12 8 12"
        stroke="#BBBBBB"
        strokeWidth={EYE_ICON_STROKE_WIDTH}
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
      }}>
        {/* Floating toast */}
        <div style={{
          position: 'absolute',
          bottom: '22px',
          left: '50%',
          transform: `translateX(-50%) scale(${dragging ? 1 : 0.8})`,
          opacity: dragging ? 1 : 0,
          pointerEvents: 'none',
          backgroundColor: 'rgba(255,255,255,0.95)',
          color: '#374151',
          fontSize: '11px',
          fontWeight: 600,
          fontFamily: "'Roboto', system-ui, sans-serif",
          fontVariantNumeric: 'tabular-nums',
          padding: '4px 8px',
          borderRadius: '6px',
          whiteSpace: 'nowrap',
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(4px)',
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
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRight: '1px solid #E5E7EB',
            borderBottom: '1px solid #E5E7EB',
          }} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================

