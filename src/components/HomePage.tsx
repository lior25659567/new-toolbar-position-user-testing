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
        backgroundColor: 'var(--ads-background-subtle-01)',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid var(--ads-border-accent)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--ads-border-accent)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--ads-border-accent)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Illustration container */}
      <div
        style={{
          width: '100%',
          height: '140px',
          backgroundColor: 'var(--ads-background-subtle-02)',
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
          color: 'var(--ads-text-primary)',
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
          color: 'var(--ads-text-tertiary)',
          marginBottom: '12px',
        }}>
          <span>Shortcut</span>
          <span style={{ fontWeight: 500, color: 'var(--ads-text-secondary)' }}>Press {shortcut}</span>
        </div>

        {/* Select button */}
        <button
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '100px',
            border: 'none',
            backgroundColor: 'var(--ads-background-subtle-02)',
            color: 'var(--ads-text-primary)',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--ads-background-subtle-active)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--ads-background-subtle-02)';
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
      <rect x="12" y="10" width="96" height="80" rx="6" fill="white" stroke="var(--ads-border-accent)" strokeWidth="1"/>
      <rect x="18" y="16" width="62" height="68" rx="3" fill="var(--ads-background-subtle-00)"/>
      <rect x="86" y="16" width="16" height="68" rx="3" fill="var(--ads-background-interactive)"/>
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
      <rect x="12" y="10" width="96" height="80" rx="6" fill="white" stroke="var(--ads-border-accent)" strokeWidth="1"/>
      <rect x="56" y="16" width="46" height="14" rx="3" fill="var(--ads-background-interactive)"/>
      <circle cx="68" cy="23" r="3" fill="white"/>
      <circle cx="80" cy="23" r="3" fill="white"/>
      <circle cx="92" cy="23" r="3" fill="white"/>
      <rect x="18" y="36" width="84" height="48" rx="3" fill="var(--ads-background-subtle-00)"/>
    </svg>
  );
}

function BottomLayoutIcon() {
  return (
    <svg width="100" height="80" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="10" width="96" height="80" rx="6" fill="white" stroke="var(--ads-border-accent)" strokeWidth="1"/>
      <rect x="18" y="16" width="84" height="48" rx="3" fill="var(--ads-background-subtle-00)"/>
      <rect x="28" y="70" width="64" height="14" rx="3" fill="var(--ads-background-interactive)"/>
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
      <rect x="30" y="8" width="60" height="84" rx="4" fill="white" stroke="var(--ads-border-accent)" strokeWidth="1"/>
      <rect x="36" y="14" width="48" height="6" rx="2" fill="var(--ads-background-interactive)"/>
      <rect x="36" y="24" width="32" height="3" rx="1.5" fill="var(--ads-border-accent)"/>
      <rect x="36" y="30" width="24" height="3" rx="1.5" fill="var(--ads-border-accent)"/>
      <rect x="36" y="38" width="48" height="28" rx="3" fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <circle cx="50" cy="48" r="4" fill="var(--ads-border-accent)"/>
      <path d="M42 60 L50 52 L58 60 L66 46 L78 60" stroke="var(--ads-border-accent)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="36" y="72" width="48" height="2.5" rx="1" fill="var(--ads-border-accent)"/>
      <rect x="36" y="78" width="36" height="2.5" rx="1" fill="var(--ads-border-accent)"/>
      <rect x="36" y="84" width="42" height="2.5" rx="1" fill="var(--ads-border-accent)"/>
    </svg>
  );
}

function ScanGuidanceIcon() {
  return (
    <svg width="100" height="80" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 50 A30 30 0 0 1 90 50" stroke="var(--ads-background-interactive)" strokeWidth="2" fill="none" strokeDasharray="4 3"/>
      <path d="M90 50 A30 30 0 0 1 30 50" stroke="var(--ads-border-accent)" strokeWidth="1" fill="none" strokeDasharray="4 3"/>
      <path d="M38 48 Q42 30 60 28 Q78 30 82 48" stroke="#888" strokeWidth="2" fill="var(--ads-background-subtle-00)"/>
      <path d="M42 46 Q48 32 60 30 Q66 31 70 36" stroke="none" fill="var(--ads-background-interactive)" opacity="0.2"/>
      <circle cx="58" cy="38" r="8" stroke="var(--ads-background-interactive)" strokeWidth="1.5" fill="var(--ads-background-interactive)" opacity="0.15"/>
      <circle cx="58" cy="38" r="2" fill="var(--ads-background-interactive)"/>
      <rect x="30" y="72" width="60" height="4" rx="2" fill="var(--ads-border-accent)"/>
      <rect x="30" y="72" width="28" height="4" rx="2" fill="var(--ads-background-interactive)"/>
      <line x1="74" y1="40" x2="86" y2="40" stroke="var(--ads-background-interactive)" strokeWidth="1.5" strokeLinecap="round"/>
      <polyline points="82,36 86,40 82,44" stroke="var(--ads-background-interactive)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function UndercutIcon() {
  return (
    <svg width="100" height="80" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tooth outline */}
      <path d="M42 20 C42 20 38 30 38 45 C38 60 42 75 50 80 C54 82 58 78 60 72 C62 78 66 82 70 80 C78 75 82 60 82 45 C82 30 78 20 78 20" stroke="#888" strokeWidth="2" fill="var(--ads-background-subtle-00)" strokeLinecap="round"/>
      {/* Undercut regions (heatmap colors) */}
      <path d="M40 42 Q42 38 48 36 L48 50 Q42 48 40 42Z" fill="var(--ads-text-error)" opacity="0.5"/>
      <path d="M72 36 Q78 38 80 42 Q78 48 72 50Z" fill="var(--ads-text-warning)" opacity="0.5"/>
      <path d="M48 36 Q55 32 65 32 Q72 34 72 36 L72 42 Q65 38 55 38 L48 42Z" fill="var(--ads-text-success)" opacity="0.3"/>
      {/* Insertion path arrow */}
      <line x1="60" y1="10" x2="60" y2="55" stroke="var(--ads-background-interactive)" strokeWidth="2" strokeLinecap="round"/>
      <polyline points="54,18 60,10 66,18" stroke="var(--ads-background-interactive)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Arrow base ring */}
      <ellipse cx="60" cy="56" rx="6" ry="2" stroke="var(--ads-background-interactive)" strokeWidth="1.5" fill="none"/>
      {/* Heatmap legend */}
      <rect x="28" y="88" width="16" height="3" rx="1.5" fill="var(--ads-text-success)"/>
      <rect x="48" y="88" width="16" height="3" rx="1.5" fill="var(--ads-text-warning)"/>
      <rect x="68" y="88" width="16" height="3" rx="1.5" fill="var(--ads-text-error)"/>
    </svg>
  );
}

function OrdersPageIcon() {
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* App frame */}
      <rect x="14" y="20" width="84" height="72" rx="6" fill="white" stroke="var(--ads-border-accent)" strokeWidth="1"/>
      {/* Title strip */}
      <rect x="22" y="32" width="22" height="6" rx="2" fill="var(--ads-text-primary)"/>
      {/* New order pill */}
      <rect x="74" y="30" width="20" height="8" rx="4" fill="var(--ads-background-interactive)"/>
      {/* Search bar */}
      <rect x="22" y="46" width="72" height="6" rx="3" fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      {/* Filter chips */}
      <rect x="22" y="58" width="14" height="4" rx="2" fill="var(--ads-border-accent)"/>
      <rect x="38" y="58" width="14" height="4" rx="2" fill="var(--ads-border-accent)"/>
      {/* Table card */}
      <rect x="22" y="68" width="72" height="22" rx="2" fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <rect x="22" y="68" width="72" height="6" rx="2" fill="var(--ads-background-subtle-02)"/>
      <line x1="22" y1="78" x2="94" y2="78" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <line x1="22" y1="84" x2="94" y2="84" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      {/* Status pills */}
      <rect x="38" y="80" width="8" height="3" rx="1.5" fill="var(--ads-background-highlight-orange)"/>
      <rect x="38" y="86" width="8" height="3" rx="1.5" fill="var(--ads-border-highlight-blue)"/>
    </svg>
  );
}

function JobsPageIcon() {
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="20" width="84" height="72" rx="6" fill="white" stroke="var(--ads-border-accent)" strokeWidth="1"/>
      {/* KPI strip */}
      <rect x="22" y="28" width="14" height="8" rx="2" fill="var(--ads-background-highlight-blue)"/>
      <rect x="40" y="28" width="14" height="8" rx="2" fill="var(--ads-background-highlight-blue)"/>
      <rect x="58" y="28" width="14" height="8" rx="2" fill="var(--ads-background-highlight-blue)"/>
      <rect x="76" y="28" width="14" height="8" rx="2" fill="var(--ads-background-highlight-orange)"/>
      {/* Kanban columns */}
      <rect x="22" y="42" width="16" height="44" rx="2" fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <rect x="40" y="42" width="16" height="44" rx="2" fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <rect x="58" y="42" width="16" height="44" rx="2" fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <rect x="76" y="42" width="16" height="44" rx="2" fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      {/* Cards */}
      <rect x="24" y="46" width="12" height="10" rx="1" fill="var(--ads-background-highlight-orange)"/>
      <rect x="24" y="58" width="12" height="10" rx="1" fill="white" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <rect x="42" y="46" width="12" height="10" rx="1" fill="var(--ads-border-highlight-blue)"/>
      <rect x="60" y="46" width="12" height="10" rx="1" fill="var(--ads-background-highlight-purple)"/>
      <rect x="78" y="46" width="12" height="10" rx="1" fill="var(--ads-background-highlight-green)"/>
    </svg>
  );
}

function TreatmentPlanIcon() {
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="20" width="84" height="72" rx="6" fill="white" stroke="var(--ads-border-accent)" strokeWidth="1"/>
      {/* Stepper */}
      <circle cx="28" cy="32" r="3" fill="var(--ads-background-interactive)"/>
      <line x1="31" y1="32" x2="44" y2="32" stroke="var(--ads-background-interactive)" strokeWidth="1"/>
      <circle cx="46" cy="32" r="3" fill="var(--ads-background-interactive)"/>
      <line x1="49" y1="32" x2="62" y2="32" stroke="var(--ads-border-accent)" strokeWidth="1"/>
      <circle cx="64" cy="32" r="3" fill="white" stroke="var(--ads-border-accent)" strokeWidth="1"/>
      <line x1="67" y1="32" x2="80" y2="32" stroke="var(--ads-border-accent)" strokeWidth="1"/>
      <circle cx="82" cy="32" r="3" fill="white" stroke="var(--ads-border-accent)" strokeWidth="1"/>
      {/* Phase cards */}
      <rect x="22" y="42" width="60" height="14" rx="2" fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <rect x="22" y="58" width="60" height="14" rx="2" fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <rect x="22" y="74" width="60" height="14" rx="2" fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      {/* Side panel cost */}
      <rect x="84" y="42" width="14" height="46" rx="2" fill="var(--ads-background-highlight-blue)" stroke="var(--ads-border-highlight-blue)" strokeWidth="0.5"/>
      <rect x="86" y="46" width="10" height="2" rx="1" fill="var(--ads-background-interactive)"/>
      <rect x="86" y="50" width="6" height="2" rx="1" fill="var(--ads-background-interactive)"/>
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="20" width="84" height="72" rx="6" fill="white" stroke="var(--ads-border-accent)" strokeWidth="1"/>
      {/* KPI tiles */}
      <rect x="22" y="28" width="20" height="14" rx="2" fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <rect x="46" y="28" width="20" height="14" rx="2" fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <rect x="70" y="28" width="20" height="14" rx="2" fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      {/* Line chart */}
      <polyline points="22,72 30,62 38,66 46,52 54,58 62,46 70,50 78,40 86,46 90,42" stroke="var(--ads-background-interactive)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="22" y1="80" x2="90" y2="80" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <line x1="22" y1="46" x2="22" y2="80" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      {/* Donut */}
      <circle cx="76" cy="72" r="10" fill="none" stroke="var(--ads-background-highlight-purple)" strokeWidth="3"/>
      <path d="M 76 62 A 10 10 0 0 1 84 76" stroke="var(--ads-background-interactive)" strokeWidth="3" fill="none"/>
    </svg>
  );
}

function ClaimsIcon() {
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* App frame */}
      <rect x="14" y="20" width="84" height="72" rx="6" fill="white" stroke="var(--ads-border-accent)" strokeWidth="1"/>
      {/* Top bar */}
      <rect x="14" y="20" width="84" height="10" rx="6" fill="var(--ads-background-subtle-00)"/>
      {/* Stat tiles */}
      <rect x="22" y="34" width="22" height="14" rx="2" fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <rect x="48" y="34" width="22" height="14" rx="2" fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <rect x="74" y="34" width="20" height="14" rx="2" fill="var(--ads-background-highlight-red)" stroke="var(--ads-background-highlight-orange)" strokeWidth="0.5"/>
      {/* Aging bars */}
      <rect x="22" y="56" width="72" height="6" rx="3" fill="var(--ads-background-highlight-blue)"/>
      <rect x="22" y="56" width="20" height="6" rx="3" fill="var(--ads-background-interactive)"/>
      <rect x="22" y="66" width="72" height="6" rx="3" fill="var(--ads-background-subtle-active)"/>
      <rect x="22" y="66" width="36" height="6" rx="3" fill="#888"/>
      <rect x="22" y="76" width="72" height="6" rx="3" fill="var(--ads-background-highlight-orange)"/>
      <rect x="22" y="76" width="48" height="6" rx="3" fill="var(--ads-text-warning)"/>
      {/* Money badge */}
      <circle cx="86" cy="42" r="5" fill="white" stroke="var(--ads-text-warning)" strokeWidth="0.8"/>
      <text x="86" y="44.5" fontSize="6.5" textAnchor="middle" fill="var(--ads-text-warning)" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="600">$</text>
    </svg>
  );
}

function ScheduleIcon() {
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* App frame */}
      <rect x="14" y="20" width="84" height="72" rx="6" fill="white" stroke="var(--ads-border-accent)" strokeWidth="1"/>
      {/* Top bar */}
      <rect x="14" y="20" width="84" height="10" rx="6" fill="var(--ads-background-subtle-00)"/>
      {/* Time column */}
      <rect x="14" y="30" width="14" height="62" fill="var(--ads-background-subtle-00)"/>
      <line x1="14" y1="40" x2="98" y2="40" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <line x1="14" y1="50" x2="98" y2="50" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <line x1="14" y1="60" x2="98" y2="60" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <line x1="14" y1="70" x2="98" y2="70" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <line x1="14" y1="80" x2="98" y2="80" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      {/* Resource column dividers */}
      <line x1="46" y1="30" x2="46" y2="92" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <line x1="72" y1="30" x2="72" y2="92" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      {/* Appointment blocks */}
      <rect x="30" y="34" width="14" height="14" rx="2" fill="var(--ads-background-highlight-blue)" stroke="var(--ads-background-interactive)" strokeWidth="0.6"/>
      <rect x="50" y="42" width="20" height="12" rx="2" fill="var(--ads-background-highlight-red)" stroke="var(--ads-text-warning)" strokeWidth="0.6"/>
      <rect x="76" y="36" width="20" height="20" rx="2" fill="var(--ads-background-highlight-purple)" stroke="var(--ads-text-on-highlight-purple)" strokeWidth="0.6"/>
      <rect x="30" y="56" width="14" height="20" rx="2" fill="var(--ads-background-highlight-green)" stroke="var(--ads-text-success)" strokeWidth="0.6"/>
      <rect x="76" y="62" width="20" height="14" rx="2" fill="var(--ads-background-highlight-blue)" stroke="var(--ads-background-interactive)" strokeWidth="0.6"/>
      <rect x="50" y="62" width="20" height="22" rx="2" fill="var(--ads-background-highlight-red)" stroke="var(--ads-text-warning)" strokeWidth="0.6"/>
    </svg>
  );
}

// ─── 16 new feature icons (compact glyphs) ─────────────────────────────────

function GlyphFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="20" width="84" height="72" rx="6" fill="white" stroke="var(--ads-border-accent)" strokeWidth="1"/>
      <rect x="14" y="20" width="84" height="10" rx="6" fill="var(--ads-background-subtle-00)"/>
      {children}
    </svg>
  );
}

function ChartingIcon()      { return <GlyphFrame>{Array.from({length:8}).map((_,i)=><rect key={i} x={20+i*8} y={42} width={6} height={10} rx={1} fill="var(--ads-text-primary)"/>)}{Array.from({length:8}).map((_,i)=><rect key={i} x={20+i*8} y={66} width={6} height={10} rx={1} fill="var(--ads-text-primary)"/>)}<rect x={36} y={42} width={6} height={10} rx={1} fill="var(--ads-text-warning)"/><rect x={68} y={66} width={6} height={10} rx={1} fill="var(--ads-text-error)"/></GlyphFrame>; }
function ImagingIcon()       { return <GlyphFrame><rect x={22} y={36} width={32} height={26} rx={3} fill="var(--ads-text-primary)"/><rect x={58} y={36} width={32} height={26} rx={3} fill="var(--ads-text-primary)"/><rect x={22} y={66} width={68} height={20} rx={3} fill="var(--ads-text-primary)"/><rect x={32} y={42} width={4} height={16} rx={1} fill="var(--ads-text-primary)"/><rect x={42} y={42} width={4} height={16} rx={1} fill="var(--ads-text-primary)"/><rect x={68} y={42} width={4} height={16} rx={1} fill="var(--ads-text-primary)"/><rect x={78} y={42} width={4} height={16} rx={1} fill="var(--ads-text-primary)"/><rect x={36} y={46} width={6} height={6} fill="none" stroke="var(--ads-text-warning)" strokeWidth="1"/></GlyphFrame>; }
function SterilizationIcon() { return <GlyphFrame><rect x={22} y={38} width={68} height={36} rx={6} fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)"/><circle cx={56} cy={56} r={11} fill="var(--ads-background-highlight-blue)" stroke="var(--ads-background-interactive)" strokeWidth="1"/><text x={56} y={59} fontSize="9" textAnchor="middle" fill="var(--ads-background-interactive)" fontFamily="ui-sans-serif" fontWeight="600">CI</text><circle cx={32} cy={80} r={3} fill="var(--ads-text-success)"/><circle cx={42} cy={80} r={3} fill="var(--ads-text-success)"/><circle cx={52} cy={80} r={3} fill="var(--ads-text-warning)"/><circle cx={62} cy={80} r={3} fill="var(--ads-text-success)"/><circle cx={72} cy={80} r={3} fill="var(--ads-text-success)"/></GlyphFrame>; }
function ERxIcon()           { return <GlyphFrame><rect x={26} y={36} width={60} height={50} rx={3} fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)"/><text x={32} y={52} fontSize="14" fill="var(--ads-background-interactive)" fontFamily="ui-serif, Georgia" fontWeight="600">℞</text><rect x={48} y={42} width={32} height={3} rx={1.5} fill="var(--ads-text-primary)"/><rect x={32} y={58} width={48} height={2} rx={1} fill="#888"/><rect x={32} y={64} width={40} height={2} rx={1} fill="#888"/><rect x={32} y={70} width={32} height={2} rx={1} fill="#888"/><rect x={32} y={78} width={20} height={4} rx={1} fill="var(--ads-background-interactive)"/></GlyphFrame>; }
function InventoryIcon()     { return <GlyphFrame>{[0,1,2].map(r=>[0,1,2,3].map(c=><rect key={`${r}-${c}`} x={22+c*16} y={36+r*16} width={14} height={14} rx={2} fill={r===0&&c===2?'var(--ads-background-highlight-red)':r===1&&c===0?'var(--ads-background-highlight-red)':'var(--ads-background-subtle-00)'} stroke={r===0&&c===2?'var(--ads-text-error)':r===1&&c===0?'var(--ads-text-error)':'var(--ads-border-accent)'}/>))}<rect x={22} y={84} width={14} height={4} rx={1} fill="#888"/></GlyphFrame>; }
function EquipmentIcon()     { return <GlyphFrame><rect x={22} y={38} width={26} height={30} rx={4} fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)"/><circle cx={35} cy={50} r={3} fill="none" stroke="#888"/><rect x={28} y={56} width={14} height={2} rx={1} fill="#888"/><rect x={56} y={38} width={32} height={20} rx={3} fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)"/><circle cx={62} cy={48} r={2} fill="var(--ads-text-success)"/><circle cx={70} cy={48} r={2} fill="var(--ads-text-success)"/><circle cx={78} cy={48} r={2} fill="var(--ads-text-warning)"/><rect x={56} y={64} width={32} height={20} rx={3} fill="var(--ads-background-highlight-red)" stroke="var(--ads-text-error)"/></GlyphFrame>; }
function OnboardingIcon()    { return <GlyphFrame>{[0,1,2,3,4].map(i=><circle key={i} cx={26+i*15} cy={56} r={4} fill={i<=2?'var(--ads-text-success)':i===3?'var(--ads-background-interactive)':'var(--ads-border-accent)'}/>)}{[0,1,2,3].map(i=><line key={i} x1={30+i*15} y1={56} x2={37+i*15} y2={56} stroke={i<2?'var(--ads-text-success)':'var(--ads-border-accent)'} strokeWidth="1"/>)}<rect x={20} y={68} width={72} height={16} rx={3} fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)"/><rect x={26} y={74} width={20} height={4} rx={1} fill="var(--ads-background-interactive)"/></GlyphFrame>; }
function PatientPortalIcon() { return <GlyphFrame><circle cx={56} cy={48} r={10} fill="var(--ads-background-highlight-blue)" stroke="var(--ads-background-interactive)"/><path d={`M40 76 Q56 64 72 76`} fill="none" stroke="var(--ads-background-interactive)" strokeWidth="1.2"/><rect x={28} y={82} width={56} height={2} rx={1} fill="var(--ads-border-accent)"/></GlyphFrame>; }
function RecallIcon()        { return <GlyphFrame><rect x={22} y={38} width={28} height={20} rx={3} fill="var(--ads-background-highlight-blue)" stroke="var(--ads-background-interactive)"/><rect x={56} y={38} width={32} height={20} rx={3} fill="var(--ads-background-highlight-orange)" stroke="var(--ads-text-warning)"/><polyline points="22,72 32,68 42,70 52,62 62,64 72,58 82,52 90,48" stroke="var(--ads-background-interactive)" strokeWidth="1.5" fill="none"/><circle cx={90} cy={48} r={3} fill="var(--ads-text-success)"/></GlyphFrame>; }
function FormsIcon()         { return <GlyphFrame><rect x={28} y={36} width={56} height={50} rx={3} fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)"/><rect x={34} y={42} width={32} height={3} rx={1.5} fill="var(--ads-text-primary)"/><rect x={34} y={50} width={44} height={2} rx={1} fill="#888"/><rect x={34} y={56} width={36} height={2} rx={1} fill="#888"/><rect x={34} y={66} width={44} height={6} rx={1} fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)"/><path d="M40 80 Q44 76 50 79 Q56 82 60 78 Q64 74 70 78" stroke="var(--ads-background-interactive)" strokeWidth="1.2" fill="none"/></GlyphFrame>; }
function EligibilityIcon()   { return <GlyphFrame><rect x={26} y={36} width={60} height={36} rx={3} fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)"/><rect x={32} y={42} width={32} height={3} rx={1.5} fill="var(--ads-text-primary)"/><rect x={32} y={50} width={48} height={2} rx={1} fill="#888"/><circle cx={78} cy={66} r={3} fill="var(--ads-text-success)"/><rect x={32} y={64} width={16} height={3} rx={1} fill="var(--ads-text-success)"/><rect x={26} y={78} width={60} height={6} rx={1} fill="var(--ads-background-highlight-blue)"/><rect x={26} y={78} width={36} height={6} rx={1} fill="var(--ads-background-interactive)"/></GlyphFrame>; }
function FinancingIcon()     { return <GlyphFrame><rect x={26} y={36} width={60} height={20} rx={3} fill="var(--ads-background-highlight-blue)" stroke="var(--ads-background-interactive)"/><text x={32} y={52} fontSize="12" fill="var(--ads-background-interactive)" fontFamily="ui-sans-serif" fontWeight="700">$</text><rect x={48} y={42} width={32} height={3} rx={1.5} fill="var(--ads-background-interactive)"/><rect x={48} y={48} width={20} height={2} rx={1} fill="var(--ads-background-interactive)"/>{[0,1,2,3,4].map(i=><rect key={i} x={26+i*12} y={64} width={10} height={20} rx={1} fill={i<3?'var(--ads-text-success)':'var(--ads-border-accent)'}/>)}</GlyphFrame>; }
function AutomationIcon()    { return <GlyphFrame><rect x={28} y={36} width={56} height={14} rx={2} fill="var(--ads-background-highlight-purple)" stroke="var(--ads-text-on-highlight-purple)"/><line x1={56} y1={50} x2={56} y2={56} stroke="var(--ads-border-accent)"/><rect x={28} y={56} width={56} height={14} rx={2} fill="var(--ads-background-highlight-orange)" stroke="var(--ads-text-warning)"/><line x1={56} y1={70} x2={56} y2={76} stroke="var(--ads-border-accent)"/><rect x={28} y={76} width={56} height={10} rx={2} fill="var(--ads-background-highlight-blue)" stroke="var(--ads-background-interactive)"/></GlyphFrame>; }
function MultiLocationIcon() { return <GlyphFrame><circle cx={36} cy={50} r={6} fill="var(--ads-background-highlight-blue)" stroke="var(--ads-background-interactive)"/><circle cx={56} cy={66} r={6} fill="var(--ads-background-highlight-purple)" stroke="var(--ads-text-on-highlight-purple)"/><circle cx={76} cy={48} r={6} fill="var(--ads-background-highlight-green)" stroke="var(--ads-text-success)"/><line x1={36} y1={50} x2={56} y2={66} stroke="var(--ads-border-accent)" strokeDasharray="2 2"/><line x1={56} y1={66} x2={76} y2={48} stroke="var(--ads-border-accent)" strokeDasharray="2 2"/><line x1={36} y1={50} x2={76} y2={48} stroke="var(--ads-border-accent)" strokeDasharray="2 2"/></GlyphFrame>; }
function ReportsIcon()       { return <GlyphFrame><rect x={22} y={36} width={20} height={28} rx={2} fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)"/><polyline points="26,58 30,52 34,56 38,46" stroke="var(--ads-background-interactive)" strokeWidth="1.5" fill="none"/><rect x={46} y={36} width={20} height={28} rx={2} fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)"/><circle cx={56} cy={50} r={8} fill="none" stroke="var(--ads-text-on-highlight-purple)" strokeWidth="3"/><path d="M 56 42 A 8 8 0 0 1 64 50" stroke="var(--ads-text-success)" strokeWidth="3" fill="none"/><rect x={70} y={36} width={20} height={28} rx={2} fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)"/>{[0,1,2,3].map(i=><rect key={i} x={74+i*4} y={48+i*4} width={3} height={12-i*3} fill="var(--ads-text-warning)"/>)}<rect x={22} y={68} width={68} height={20} rx={2} fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)"/></GlyphFrame>; }

function SettingsIcon() {
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* App frame */}
      <rect x="14" y="20" width="84" height="72" rx="6" fill="white" stroke="var(--ads-border-accent)" strokeWidth="1"/>
      {/* Sidebar */}
      <rect x="14" y="20" width="22" height="72" rx="6" fill="var(--ads-background-subtle-00)"/>
      <rect x="14" y="20" width="22" height="6" rx="3" fill="var(--ads-background-subtle-00)"/>
      <rect x="20" y="32" width="10" height="3" rx="1.5" fill="var(--ads-background-interactive)"/>
      <rect x="20" y="40" width="10" height="3" rx="1.5" fill="var(--ads-border-accent)"/>
      <rect x="20" y="48" width="10" height="3" rx="1.5" fill="var(--ads-border-accent)"/>
      <rect x="20" y="56" width="10" height="3" rx="1.5" fill="var(--ads-border-accent)"/>
      <rect x="20" y="64" width="10" height="3" rx="1.5" fill="var(--ads-border-accent)"/>
      <rect x="20" y="80" width="10" height="3" rx="1.5" fill="var(--ads-background-highlight-red)"/>
      {/* Form rows */}
      <rect x="42" y="30" width="20" height="3" rx="1.5" fill="var(--ads-text-primary)"/>
      <rect x="42" y="40" width="48" height="8" rx="2" fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <rect x="42" y="54" width="32" height="3" rx="1.5" fill="#888"/>
      <rect x="42" y="62" width="48" height="8" rx="2" fill="var(--ads-background-subtle-00)" stroke="var(--ads-border-accent)" strokeWidth="0.5"/>
      <rect x="42" y="76" width="22" height="6" rx="3" fill="var(--ads-background-interactive)"/>
      {/* Cog */}
      <circle cx="84" cy="32" r="5" fill="var(--ads-background-highlight-blue)" stroke="var(--ads-background-interactive)" strokeWidth="0.8"/>
      <circle cx="84" cy="32" r="1.6" fill="var(--ads-background-interactive)"/>
    </svg>
  );
}

function PatientPageIcon() {
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* App frame */}
      <rect x="14" y="20" width="84" height="72" rx="6" fill="white" stroke="var(--ads-border-accent)" strokeWidth="1"/>
      {/* Top bar */}
      <rect x="14" y="20" width="84" height="10" rx="6" fill="var(--ads-background-subtle-00)"/>
      <circle cx="86" cy="25" r="2" fill="var(--ads-background-interactive)"/>
      <circle cx="92" cy="25" r="2" fill="var(--ads-border-accent)"/>
      {/* Patient title block */}
      <rect x="22" y="36" width="34" height="6" rx="2" fill="var(--ads-text-primary)"/>
      <rect x="22" y="46" width="22" height="3" rx="1.5" fill="var(--ads-border-accent)"/>
      {/* Action pill (primary) */}
      <rect x="74" y="38" width="20" height="8" rx="4" fill="var(--ads-background-interactive)"/>
      {/* Tabs */}
      <line x1="22" y1="58" x2="92" y2="58" stroke="var(--ads-border-accent)" strokeWidth="1"/>
      <rect x="22" y="55" width="14" height="3" rx="1.5" fill="var(--ads-background-interactive)"/>
      {/* Media grid */}
      <rect x="22" y="64" width="14" height="14" rx="2" fill="var(--ads-background-highlight-red)"/>
      <rect x="40" y="64" width="14" height="14" rx="2" fill="var(--ads-background-highlight-orange)"/>
      <rect x="58" y="64" width="14" height="14" rx="2" fill="var(--ads-background-subtle-active)"/>
      <rect x="76" y="64" width="14" height="14" rx="2" fill="var(--ads-background-highlight-blue)"/>
      <rect x="22" y="82" width="10" height="2" rx="1" fill="#888"/>
      <rect x="40" y="82" width="10" height="2" rx="1" fill="#888"/>
      <rect x="58" y="82" width="10" height="2" rx="1" fill="#888"/>
      <rect x="76" y="82" width="10" height="2" rx="1" fill="#888"/>
    </svg>
  );
}

function DemoIcon() {
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="22" width="80" height="56" rx="6" stroke="var(--ads-background-interactive)" strokeWidth="2" fill="var(--ads-background-highlight-blue)"/>
      <polygon points="48,40 48,60 66,50" fill="var(--ads-background-interactive)"/>
      <line x1="40" y1="88" x2="72" y2="88" stroke="var(--ads-background-interactive)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="52" y1="78" x2="52" y2="88" stroke="var(--ads-background-interactive)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="60" y1="78" x2="60" y2="88" stroke="var(--ads-background-interactive)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function HomePage({
  onSelectLayout,
  onOpenDesignSystem,
  onOpenPatient,
  onOpenOrders,
  onOpenJobs,
  onOpenTreatmentPlan,
  onOpenAnalytics,
  onOpenPatientReport,
  onOpenScanGuidance,
  onOpenUndercut,
  onOpenDemo,
  onOpenSettings,
  onOpenClaims,
  onOpenScheduling,
  onOpenCharting,
  onOpenImaging,
  onOpenSterilization,
  onOpenERx,
  onOpenInventory,
  onOpenEquipment,
  onOpenOnboarding,
  onOpenPatientPortal,
  onOpenRecall,
  onOpenForms,
  onOpenEligibility,
  onOpenFinancing,
  onOpenAutomation,
  onOpenMultiLocation,
  onOpenReports,
}: {
  onSelectLayout: (layout: 'vertical' | 'horizontal' | 'horizontal-top' | 'horizontal-bottom' | 'dedicated-top') => void;
  onOpenDesignSystem?: () => void;
  onOpenPatient?: () => void;
  onOpenOrders?: () => void;
  onOpenJobs?: () => void;
  onOpenTreatmentPlan?: () => void;
  onOpenAnalytics?: () => void;
  onOpenPatientReport?: () => void;
  onOpenScanGuidance?: () => void;
  onOpenUndercut?: () => void;
  onOpenDemo?: () => void;
  onOpenSettings?: () => void;
  onOpenClaims?: () => void;
  onOpenScheduling?: () => void;
  onOpenCharting?: () => void;
  onOpenImaging?: () => void;
  onOpenSterilization?: () => void;
  onOpenERx?: () => void;
  onOpenInventory?: () => void;
  onOpenEquipment?: () => void;
  onOpenOnboarding?: () => void;
  onOpenPatientPortal?: () => void;
  onOpenRecall?: () => void;
  onOpenForms?: () => void;
  onOpenEligibility?: () => void;
  onOpenFinancing?: () => void;
  onOpenAutomation?: () => void;
  onOpenMultiLocation?: () => void;
  onOpenReports?: () => void;
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
      if ((e.key === 'k' || e.key === 'K') && onOpenPatient) onOpenPatient();
      if ((e.key === 'o' || e.key === 'O') && onOpenOrders) onOpenOrders();
      if ((e.key === 'j' || e.key === 'J') && onOpenJobs) onOpenJobs();
      if ((e.key === 't' || e.key === 'T') && onOpenTreatmentPlan) onOpenTreatmentPlan();
      if ((e.key === 'a' || e.key === 'A') && onOpenAnalytics) onOpenAnalytics();
      if ((e.key === 'p' || e.key === 'P') && onOpenPatientReport) onOpenPatientReport();
      if ((e.key === 'g' || e.key === 'G') && onOpenScanGuidance) onOpenScanGuidance();
      if ((e.key === 'u' || e.key === 'U') && onOpenUndercut) onOpenUndercut();
      if ((e.key === 'd' || e.key === 'D') && onOpenDemo) onOpenDemo();
      if ((e.key === 's' || e.key === 'S') && onOpenSettings) onOpenSettings();
      if ((e.key === 'c' || e.key === 'C') && onOpenClaims) onOpenClaims();
      if ((e.key === 'l' || e.key === 'L') && onOpenScheduling) onOpenScheduling();
      if ((e.key === 'h' || e.key === 'H') && onOpenCharting) onOpenCharting();
      if ((e.key === 'i' || e.key === 'I') && onOpenImaging) onOpenImaging();
      if ((e.key === 'z' || e.key === 'Z') && onOpenSterilization) onOpenSterilization();
      if ((e.key === 'x' || e.key === 'X') && onOpenERx) onOpenERx();
      if ((e.key === 'v' || e.key === 'V') && onOpenInventory) onOpenInventory();
      if ((e.key === 'e' || e.key === 'E') && onOpenEquipment) onOpenEquipment();
      if ((e.key === 'w' || e.key === 'W') && onOpenOnboarding) onOpenOnboarding();
      if ((e.key === 'b' || e.key === 'B') && onOpenPatientPortal) onOpenPatientPortal();
      if ((e.key === 'm' || e.key === 'M') && onOpenRecall) onOpenRecall();
      if ((e.key === 'f' || e.key === 'F') && onOpenForms) onOpenForms();
      if ((e.key === 'y' || e.key === 'Y') && onOpenEligibility) onOpenEligibility();
      if ((e.key === 'n' || e.key === 'N') && onOpenFinancing) onOpenFinancing();
      if ((e.key === 'q' || e.key === 'Q') && onOpenAutomation) onOpenAutomation();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectLayout, onOpenPatient, onOpenOrders, onOpenJobs, onOpenTreatmentPlan, onOpenAnalytics, onOpenPatientReport, onOpenScanGuidance, onOpenUndercut, onOpenDemo, onOpenSettings, onOpenClaims, onOpenScheduling, onOpenCharting, onOpenImaging, onOpenSterilization, onOpenERx, onOpenInventory, onOpenEquipment, onOpenOnboarding, onOpenPatientPortal, onOpenRecall, onOpenForms, onOpenEligibility, onOpenFinancing, onOpenAutomation]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'var(--ads-background-subtle-01)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '40px 40px 64px',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 600,
          color: 'var(--ads-text-primary)',
          margin: '0 0 8px 0',
          letterSpacing: '-0.02em',
        }}>
          Dental Scanner Prototype
        </h1>
        <p style={{
          fontSize: '14px',
          color: 'var(--ads-text-tertiary)',
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
          title="Patient page"
          icon={<PatientPageIcon />}
          onClick={() => onOpenPatient?.()}
          shortcut="K"
        />
        <LayoutCard
          title="Orders page"
          icon={<OrdersPageIcon />}
          onClick={() => onOpenOrders?.()}
          shortcut="O"
        />
        <LayoutCard
          title="Jobs (lab cases)"
          icon={<JobsPageIcon />}
          onClick={() => onOpenJobs?.()}
          shortcut="J"
        />
        <LayoutCard
          title="Treatment plan"
          icon={<TreatmentPlanIcon />}
          onClick={() => onOpenTreatmentPlan?.()}
          shortcut="T"
        />
        <LayoutCard
          title="Analytics"
          icon={<AnalyticsIcon />}
          onClick={() => onOpenAnalytics?.()}
          shortcut="A"
        />
        <LayoutCard
          title="Claims & RCM"
          icon={<ClaimsIcon />}
          onClick={() => onOpenClaims?.()}
          shortcut="C"
        />
        <LayoutCard
          title="Schedule"
          icon={<ScheduleIcon />}
          onClick={() => onOpenScheduling?.()}
          shortcut="L"
        />
        <LayoutCard
          title="Settings"
          icon={<SettingsIcon />}
          onClick={() => onOpenSettings?.()}
          shortcut="S"
        />
        <LayoutCard title="Charting & Perio"  icon={<ChartingIcon />}      onClick={() => onOpenCharting?.()}      shortcut="H" />
        <LayoutCard title="Imaging Studio"    icon={<ImagingIcon />}       onClick={() => onOpenImaging?.()}       shortcut="I" />
        <LayoutCard title="Sterilization"     icon={<SterilizationIcon />} onClick={() => onOpenSterilization?.()} shortcut="Z" />
        <LayoutCard title="e-Prescriptions"   icon={<ERxIcon />}           onClick={() => onOpenERx?.()}           shortcut="X" />
        <LayoutCard title="Inventory"         icon={<InventoryIcon />}     onClick={() => onOpenInventory?.()}     shortcut="V" />
        <LayoutCard title="Equipment"         icon={<EquipmentIcon />}     onClick={() => onOpenEquipment?.()}     shortcut="E" />
        <LayoutCard title="Onboarding wizard" icon={<OnboardingIcon />}    onClick={() => onOpenOnboarding?.()}    shortcut="W" />
        <LayoutCard title="Patient Portal"    icon={<PatientPortalIcon />} onClick={() => onOpenPatientPortal?.()} shortcut="B" />
        <LayoutCard title="Recall & Outreach" icon={<RecallIcon />}        onClick={() => onOpenRecall?.()}        shortcut="M" />
        <LayoutCard title="Forms & e-Sign"    icon={<FormsIcon />}         onClick={() => onOpenForms?.()}         shortcut="F" />
        <LayoutCard title="Eligibility / PA"  icon={<EligibilityIcon />}   onClick={() => onOpenEligibility?.()}   shortcut="Y" />
        <LayoutCard title="Patient Financing" icon={<FinancingIcon />}     onClick={() => onOpenFinancing?.()}     shortcut="N" />
        <LayoutCard title="Automation"        icon={<AutomationIcon />}    onClick={() => onOpenAutomation?.()}    shortcut="Q" />
        <LayoutCard title="Multi-location"    icon={<MultiLocationIcon />} onClick={() => onOpenMultiLocation?.()} shortcut="" />
        <LayoutCard title="Custom Reports"    icon={<ReportsIcon />}       onClick={() => onOpenReports?.()}       shortcut="" />
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
          color: 'var(--ads-text-tertiary)',
          margin: 0,
        }}>
          Press <span style={{ fontWeight: 500, color: 'var(--ads-text-secondary)' }}>R</span> to return anytime
        </p>
        {onOpenDesignSystem && (
          <button
            type="button"
            onClick={onOpenDesignSystem}
            style={{
              marginTop: '12px',
              padding: '6px 12px',
              fontSize: '12px',
              color: 'var(--ads-background-interactive)',
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
