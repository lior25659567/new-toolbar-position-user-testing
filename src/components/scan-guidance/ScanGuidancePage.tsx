import React, { useState, useCallback } from 'react';
import { color, font, space, radius, transition } from '../../design-system/tokens';
import { SecondaryButton } from '../../design-system/SecondaryButton';
import ScanGuidanceViewer from './ScanGuidanceViewer';

interface ScanGuidancePageProps {
  onBackToHome: () => void;
}

export default function ScanGuidancePage({ onBackToHome }: ScanGuidancePageProps) {
  const [resetCounter, setResetCounter] = useState(0);

  const handleReset = useCallback(() => {
    setResetCounter((c) => c + 1);
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
              Hover to scan · Drag to rotate · Right-drag to pan · Scroll to zoom
            </div>
          </div>
        </div>

        {/* Right: Reset */}
        <SecondaryButton size={36} onClick={handleReset}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <path d="M3 12a9 9 0 1 1 9 9" />
            <polyline points="3 3 3 12 12 12" />
          </svg>
          Reset
        </SecondaryButton>
      </div>

      {/* Canvas area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <ScanGuidanceViewer resetTrigger={resetCounter} />
      </div>
    </div>
  );
}
