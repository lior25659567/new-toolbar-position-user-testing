import React from 'react';

interface LayoutSwitcherProps {
  currentLayout: 'vertical' | 'horizontal-top' | 'horizontal-bottom';
  onNavigateToLayout: (layout: 'vertical' | 'horizontal-top' | 'horizontal-bottom') => void;
  onBackToHome?: () => void;
  combinedPanelMode?: boolean;
  onCombinedPanelModeChange?: (enabled: boolean) => void;
}

// Layouts available from inside any layout, reordered: Top, Vertical, Bottom
const layouts = [
  { id: 'horizontal-top' as const, label: 'Top' },
  { id: 'vertical' as const, label: 'Vertical' },
  { id: 'horizontal-bottom' as const, label: 'Bottom' },
];

export default function LayoutSwitcher({ 
  currentLayout, 
  onNavigateToLayout, 
  onBackToHome,
  combinedPanelMode = false,
  onCombinedPanelModeChange
}: LayoutSwitcherProps) {
  const handleClick = (layoutId: typeof layouts[number]['id']) => {
    onNavigateToLayout(layoutId);
  };

  const handleToggleCombined = () => {
    if (onCombinedPanelModeChange) {
      onCombinedPanelModeChange(!combinedPanelMode);
    }
  };

  return (
    <div className="inline-flex flex-col items-stretch bg-white rounded-[8px] shadow-lg border border-gray-200 shrink-0 w-fit">
      {/* Tabs Navigation */}
      <div className="flex flex-row p-[4px] gap-[4px]" role="tablist">
        {layouts.map((layout) => {
          const isActive = currentLayout === layout.id;

          return (
            <button
              key={layout.id}
              onClick={() => handleClick(layout.id)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${layout.id}`}
              disabled={false}
              className={`
                flex items-center justify-center
                rounded-[6px] px-[10px]
                text-[13px] leading-[18px]
                font-medium whitespace-nowrap
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
                active:scale-[0.98]
                shrink-0
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isActive 
                  ? 'text-white hover:opacity-90 active:opacity-80 disabled:hover:opacity-100' 
                  : 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 disabled:hover:bg-transparent'}
              `}
              style={{
                height: '36px',
                borderRadius: '6px',
                ...(isActive ? { backgroundColor: '#009ACE' } : {})
              }}
            >
              {layout.label}
            </button>
          );
        })}
        
        {/* Combined button - hidden for now */}
        {/* {onCombinedPanelModeChange && (
          <button
            type="button"
            onClick={handleToggleCombined}
            disabled={false}
            className={`
              flex items-center justify-center
              rounded-[6px] px-[10px]
              text-[13px] leading-[18px]
              font-medium whitespace-nowrap
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
              active:scale-[0.98]
              shrink-0
              disabled:opacity-50 disabled:cursor-not-allowed
              ${combinedPanelMode 
                ? 'text-white hover:opacity-90 active:opacity-80 disabled:hover:opacity-100' 
                : 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 disabled:hover:bg-transparent'}
            `}
            style={{
              height: '36px',
              borderRadius: '6px',
              ...(combinedPanelMode ? { backgroundColor: '#009ACE' } : {})
            }}
            aria-pressed={combinedPanelMode}
            aria-label="Toggle combined panel mode"
          >
            Combined
          </button>
        )} */}
      </div>
    </div>
  );
}
