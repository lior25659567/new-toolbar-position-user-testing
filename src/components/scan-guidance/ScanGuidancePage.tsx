import React, { useState, useCallback } from 'react';
import { color, font, space, radius, shadow, transition } from '../../design-system/tokens';
import { SecondaryButton } from '../../design-system/SecondaryButton';
import ScanGuidanceViewer from './ScanGuidanceViewer';

interface ScanGuidancePageProps {
  onBackToHome: () => void;
}

export default function ScanGuidancePage({ onBackToHome }: ScanGuidancePageProps) {
  const [resetCounter, setResetCounter] = useState(0);
  const [demoTrigger, setDemoTrigger] = useState(0);

  const handleReset = useCallback(() => {
    setResetCounter((c) => c + 1);
  }, []);

  const handlePlayDemo = useCallback(() => {
    // Reset first so the demo starts clean, then trigger demo playback
    setResetCounter((c) => c + 1);
    setDemoTrigger((c) => c + 1);
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: color.neutral50,
      fontFamily: font.family,
      overflow: 'hidden',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${space[3]} ${space[5]}`,
        backgroundColor: color.white,
        borderBottom: `1px solid ${color.borderDefault}`,
        flexShrink: 0,
      }}>
        {/* Left: back + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: space[3] }}>
          <button
            onClick={onBackToHome}
            style={{
              display: 'flex', alignItems: 'center', gap: space[1],
              padding: `${space[1]} ${space[2]}`,
              backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
              color: color.textSubtle, fontSize: font.size.sm,
              fontWeight: font.weight.medium, borderRadius: radius.md,
              transition: `color ${transition.fast}, background-color ${transition.fast}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = color.textDefault;
              e.currentTarget.style.backgroundColor = color.neutral100;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = color.textSubtle;
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Home
          </button>

          <div style={{ width: '1px', height: '20px', backgroundColor: color.borderDefault }} />

          <div>
            <div style={{
              fontSize: font.size.base, fontWeight: font.weight.bold,
              color: color.textHeading, letterSpacing: font.tracking.tight,
            }}>
              Smart Scan Guidance
            </div>
            <div style={{ fontSize: font.size.xs, color: color.textPlaceholder, marginTop: '1px' }}>
              Prototype — scan coverage simulation
            </div>
          </div>
        </div>

        {/* Right: Play Demo + Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: space[2] }}>

          {/* Play Demo — primary action */}
          <button
            onClick={handlePlayDemo}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: `0 ${space[4]}`,
              height: '36px',
              backgroundColor: color.primary,
              color: color.white,
              border: 'none',
              borderRadius: radius.md,
              cursor: 'pointer',
              fontSize: font.size.sm,
              fontWeight: font.weight.semibold,
              boxShadow: shadow.sm,
              transition: `background-color ${transition.fast}, box-shadow ${transition.fast}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0088B8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = color.primary;
            }}
          >
            {/* Play triangle icon */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            Play Demo
          </button>

          <div style={{ width: '1px', height: '20px', backgroundColor: color.borderDefault }} />

          <SecondaryButton size={36} onClick={handleReset}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <path d="M3 12a9 9 0 1 1 9 9" />
              <polyline points="3 3 3 12 12 12" />
            </svg>
            Reset
          </SecondaryButton>
        </div>
      </div>

      {/* Canvas area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <ScanGuidanceViewer resetTrigger={resetCounter} demoTrigger={demoTrigger} />
      </div>
    </div>
  );
}
