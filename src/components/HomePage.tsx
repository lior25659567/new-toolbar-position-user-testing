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
        flex: '1 1 0%',
        minWidth: '180px',
        maxWidth: '240px',
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
          height: '140px',
          backgroundColor: '#F5F5F5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>

      {/* Card content */}
      <div style={{ padding: '16px' }}>
        {/* Title */}
        <h3 style={{
          fontSize: '15px',
          fontWeight: 600,
          color: '#1a1a1a',
          margin: '0 0 12px 0',
          letterSpacing: '-0.02em',
        }}>
          {title}
        </h3>

        {/* Shortcut info */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: '#888888',
          marginBottom: '12px',
        }}>
          <span>Shortcut</span>
          <span style={{ fontWeight: 500, color: '#333333' }}>Press {shortcut}</span>
        </div>

        {/* Select button */}
        <button
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '100px',
            border: 'none',
            backgroundColor: '#F5F5F5',
            color: '#1a1a1a',
            fontSize: '12px',
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
          Select
        </button>
      </div>
    </div>
  );
}

// Wireframe illustrations
function VerticalLayoutIcon() {
  return (
    <svg width="100" height="80" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <svg width="100" height="80" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <svg width="100" height="80" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function PatientReportIcon() {
  return (
    <svg width="100" height="80" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="8" width="60" height="84" rx="4" fill="white" stroke="#D4D4D4" strokeWidth="1"/>
      <rect x="36" y="14" width="48" height="6" rx="2" fill="#0099d6"/>
      <rect x="36" y="24" width="32" height="3" rx="1.5" fill="#E0E0E0"/>
      <rect x="36" y="30" width="24" height="3" rx="1.5" fill="#E0E0E0"/>
      <rect x="36" y="38" width="48" height="28" rx="3" fill="#FAFAFA" stroke="#E0E0E0" strokeWidth="0.5"/>
      <circle cx="50" cy="48" r="4" fill="#D4D4D4"/>
      <path d="M42 60 L50 52 L58 60 L66 46 L78 60" stroke="#D4D4D4" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="36" y="72" width="48" height="2.5" rx="1" fill="#E0E0E0"/>
      <rect x="36" y="78" width="36" height="2.5" rx="1" fill="#E0E0E0"/>
      <rect x="36" y="84" width="42" height="2.5" rx="1" fill="#E0E0E0"/>
    </svg>
  );
}

function ScanGuidanceIcon() {
  return (
    <svg width="100" height="80" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 50 A30 30 0 0 1 90 50" stroke="#0099d6" strokeWidth="2" fill="none" strokeDasharray="4 3"/>
      <path d="M90 50 A30 30 0 0 1 30 50" stroke="#D4D4D4" strokeWidth="1" fill="none" strokeDasharray="4 3"/>
      <path d="M38 48 Q42 30 60 28 Q78 30 82 48" stroke="#888" strokeWidth="2" fill="#FAFAFA"/>
      <path d="M42 46 Q48 32 60 30 Q66 31 70 36" stroke="none" fill="#0099d6" opacity="0.2"/>
      <circle cx="58" cy="38" r="8" stroke="#0099d6" strokeWidth="1.5" fill="#0099d6" opacity="0.15"/>
      <circle cx="58" cy="38" r="2" fill="#0099d6"/>
      <rect x="30" y="72" width="60" height="4" rx="2" fill="#E0E0E0"/>
      <rect x="30" y="72" width="28" height="4" rx="2" fill="#0099d6"/>
      <line x1="74" y1="40" x2="86" y2="40" stroke="#0099d6" strokeWidth="1.5" strokeLinecap="round"/>
      <polyline points="82,36 86,40 82,44" stroke="#0099d6" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function UndercutIcon() {
  return (
    <svg width="100" height="80" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tooth outline */}
      <path d="M42 20 C42 20 38 30 38 45 C38 60 42 75 50 80 C54 82 58 78 60 72 C62 78 66 82 70 80 C78 75 82 60 82 45 C82 30 78 20 78 20" stroke="#888" strokeWidth="2" fill="#FAFAFA" strokeLinecap="round"/>
      {/* Undercut regions (heatmap colors) */}
      <path d="M40 42 Q42 38 48 36 L48 50 Q42 48 40 42Z" fill="#DC2626" opacity="0.5"/>
      <path d="M72 36 Q78 38 80 42 Q78 48 72 50Z" fill="#EAB308" opacity="0.5"/>
      <path d="M48 36 Q55 32 65 32 Q72 34 72 36 L72 42 Q65 38 55 38 L48 42Z" fill="#16A34A" opacity="0.3"/>
      {/* Insertion path arrow */}
      <line x1="60" y1="10" x2="60" y2="55" stroke="#0099d6" strokeWidth="2" strokeLinecap="round"/>
      <polyline points="54,18 60,10 66,18" stroke="#0099d6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Arrow base ring */}
      <ellipse cx="60" cy="56" rx="6" ry="2" stroke="#0099d6" strokeWidth="1.5" fill="none"/>
      {/* Heatmap legend */}
      <rect x="28" y="88" width="16" height="3" rx="1.5" fill="#16A34A"/>
      <rect x="48" y="88" width="16" height="3" rx="1.5" fill="#EAB308"/>
      <rect x="68" y="88" width="16" height="3" rx="1.5" fill="#DC2626"/>
    </svg>
  );
}

function DemoIcon() {
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="22" width="80" height="56" rx="6" stroke="#009ACE" strokeWidth="2" fill="#F0F9FF"/>
      <polygon points="48,40 48,60 66,50" fill="#009ACE"/>
      <line x1="40" y1="88" x2="72" y2="88" stroke="#009ACE" strokeWidth="2" strokeLinecap="round"/>
      <line x1="52" y1="78" x2="52" y2="88" stroke="#009ACE" strokeWidth="2" strokeLinecap="round"/>
      <line x1="60" y1="78" x2="60" y2="88" stroke="#009ACE" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function HomePage({
  onSelectLayout,
  onOpenDesignSystem,
  onOpenPatientReport,
  onOpenScanGuidance,
  onOpenUndercut,
  onOpenDemo,
}: {
  onSelectLayout: (layout: 'vertical' | 'horizontal' | 'horizontal-top' | 'horizontal-bottom' | 'dedicated-top') => void;
  onOpenDesignSystem?: () => void;
  onOpenPatientReport?: () => void;
  onOpenScanGuidance?: () => void;
  onOpenUndercut?: () => void;
  onOpenDemo?: () => void;
  combinedPanelMode?: boolean;
  onCombinedPanelModeChange?: (enabled: boolean) => void;
}) {
  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '1') onSelectLayout('vertical');
      if (e.key === '2') onSelectLayout('horizontal-top');
      if (e.key === '3') onSelectLayout('horizontal-bottom');
      if (e.key === '4') onSelectLayout('dedicated-top');
      if ((e.key === 'p' || e.key === 'P') && onOpenPatientReport) onOpenPatientReport();
      if ((e.key === 'g' || e.key === 'G') && onOpenScanGuidance) onOpenScanGuidance();
      if ((e.key === 'u' || e.key === 'U') && onOpenUndercut) onOpenUndercut();
      if ((e.key === 'd' || e.key === 'D') && onOpenDemo) onOpenDemo();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectLayout, onOpenPatientReport, onOpenScanGuidance, onOpenUndercut, onOpenDemo]);

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
        padding: '40px',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 600,
          color: '#1a1a1a',
          margin: '0 0 8px 0',
          letterSpacing: '-0.02em',
        }}>
          Dental Scanner Prototype
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#888888',
          margin: 0,
        }}>
          Select a layout, tool, or prototype to get started
        </p>
      </div>

      {/* Unified cards grid — 5 per row */}
      <div style={{
        display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center',
        maxWidth: '1320px', width: '100%',
      }}>
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
        <LayoutCard
          title="Dedicated Top"
          icon={<TopLayoutIcon />}
          onClick={() => onSelectLayout('dedicated-top')}
          shortcut="4"
        />
        <LayoutCard
          title="Patient Report"
          icon={<PatientReportIcon />}
          onClick={() => onOpenPatientReport?.()}
          shortcut="P"
        />
        <LayoutCard
          title="Scan Guidance"
          icon={<ScanGuidanceIcon />}
          onClick={() => onOpenScanGuidance?.()}
          shortcut="G"
        />
        <LayoutCard
          title="Undercuts & Path"
          icon={<UndercutIcon />}
          onClick={() => onOpenUndercut?.()}
          shortcut="U"
        />
        <LayoutCard
          title="Demo"
          icon={<DemoIcon />}
          onClick={() => onOpenDemo?.()}
          shortcut="D"
        />
      </div>

      {/* Footer */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <p style={{
          fontSize: '12px',
          color: '#999999',
          margin: 0,
        }}>
          Press <span style={{ fontWeight: 500, color: '#666666' }}>R</span> to return anytime
        </p>
        {onOpenDesignSystem && (
          <button
            type="button"
            onClick={onOpenDesignSystem}
            style={{
              marginTop: '12px',
              padding: '6px 12px',
              fontSize: '12px',
              color: '#009ACE',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            View design system
          </button>
        )}
      </div>
    </div>
  );
}
