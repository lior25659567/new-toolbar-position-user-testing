'use client';

import React from 'react';

interface LayoutCardProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  shortcut: string;
}

function LayoutCard({ title, icon, onClick, shortcut }: LayoutCardProps) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        width: '260px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid #E5E5E5',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#D0D0D0';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E5E5E5';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Illustration container */}
      <div 
        style={{ 
          width: '100%',
          height: '160px',
          backgroundColor: '#F5F5F5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      
      {/* Card content */}
      <div style={{ padding: '20px' }}>
        {/* Title */}
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#1a1a1a',
          margin: '0 0 16px 0',
          letterSpacing: '-0.02em',
        }}>
          {title}
        </h3>
        
        {/* Shortcut info */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: '12px',
          color: '#888888',
          marginBottom: '16px',
        }}>
          <span>Shortcut</span>
          <span style={{ fontWeight: 500, color: '#333333' }}>Press {shortcut}</span>
        </div>
        
        {/* Select button */}
        <button 
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '100px',
            border: 'none',
            backgroundColor: '#F5F5F5',
            color: '#1a1a1a',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E8E8E8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F5F5F5';
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          Select {title}
        </button>
      </div>
    </div>
  );
}

// Wireframe illustrations
function VerticalLayoutIcon() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="10" width="96" height="80" rx="6" fill="white" stroke="#D4D4D4" strokeWidth="1"/>
      <rect x="18" y="16" width="62" height="68" rx="3" fill="#FAFAFA"/>
      <rect x="86" y="16" width="16" height="68" rx="3" fill="#0099d6"/>
      <circle cx="94" cy="28" r="4" fill="white"/>
      <circle cx="94" cy="42" r="4" fill="white"/>
      <circle cx="94" cy="56" r="4" fill="white"/>
      <circle cx="94" cy="70" r="4" fill="white"/>
    </svg>
  );
}

function TopLayoutIcon() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="10" width="96" height="80" rx="6" fill="white" stroke="#D4D4D4" strokeWidth="1"/>
      <rect x="56" y="16" width="46" height="14" rx="3" fill="#0099d6"/>
      <circle cx="68" cy="23" r="3" fill="white"/>
      <circle cx="80" cy="23" r="3" fill="white"/>
      <circle cx="92" cy="23" r="3" fill="white"/>
      <rect x="18" y="36" width="84" height="48" rx="3" fill="#FAFAFA"/>
    </svg>
  );
}

function BottomLayoutIcon() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="10" width="96" height="80" rx="6" fill="white" stroke="#D4D4D4" strokeWidth="1"/>
      <rect x="18" y="16" width="84" height="48" rx="3" fill="#FAFAFA"/>
      <rect x="28" y="70" width="64" height="14" rx="3" fill="#0099d6"/>
      <circle cx="42" cy="77" r="3" fill="white"/>
      <circle cx="56" cy="77" r="3" fill="white"/>
      <circle cx="70" cy="77" r="3" fill="white"/>
      <circle cx="84" cy="77" r="3" fill="white"/>
    </svg>
  );
}

export default function HomePage({ 
  onSelectLayout,
}: { 
  onSelectLayout: (layout: 'vertical' | 'horizontal' | 'horizontal-top' | 'horizontal-bottom') => void;
  combinedPanelMode?: boolean;
  onCombinedPanelModeChange?: (enabled: boolean) => void;
}) {
  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1') onSelectLayout('vertical');
      if (e.key === '2') onSelectLayout('horizontal-top');
      if (e.key === '3') onSelectLayout('horizontal-bottom');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectLayout]);

  return (
    <div 
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 600,
          color: '#1a1a1a',
          margin: '0 0 8px 0',
          letterSpacing: '-0.02em',
        }}>
          Select Layout
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#888888',
          margin: 0,
        }}>
          Choose your preferred toolbar position
        </p>
      </div>
      
      {/* Cards container */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <LayoutCard
          title="Vertical"
          icon={<VerticalLayoutIcon />}
          onClick={() => onSelectLayout('vertical')}
          shortcut="1"
        />
        
        <LayoutCard
          title="Top"
          icon={<TopLayoutIcon />}
          onClick={() => onSelectLayout('horizontal-top')}
          shortcut="2"
        />
        
        <LayoutCard
          title="Bottom"
          icon={<BottomLayoutIcon />}
          onClick={() => onSelectLayout('horizontal-bottom')}
          shortcut="3"
        />
      </div>
      
      {/* Footer */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <p style={{
          fontSize: '12px',
          color: '#999999',
          margin: 0,
        }}>
          Press <span style={{ fontWeight: 500, color: '#666666' }}>R</span> to return anytime
        </p>
      </div>
    </div>
  );
}
