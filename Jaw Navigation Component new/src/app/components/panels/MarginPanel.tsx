// ============================================================================
// MARGIN PANEL COMPONENT
// ============================================================================
// This component provides controls for tooth selection and margin detection
// ============================================================================

import type { MarginPanelProps } from '@/app/types/dental';

export function MarginPanel({
  selectedTooth,
  jawType,
  onPreviousTooth,
  onNextTooth,
  onDetect,
  onManual,
  onUndo,
  onClearSelection
}: MarginPanelProps) {
  return (
    <div className="bg-white flex flex-col items-start relative rounded-[16px] w-[420px] shadow-lg" data-name="Margin Panel">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <div className="flex flex-col gap-[3px]">
            <div className="flex gap-[3px]">
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            </div>
            <div className="flex gap-[3px]">
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            </div>
          </div>
          {/* Title */}
          <h2 className="text-[20px] font-semibold text-gray-800">Margin line</h2>
        </div>
        {/* Close Button */}
        <button 
          onClick={onClearSelection}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="w-full px-6 py-8 flex flex-col gap-8">
        {/* Tooth Selector */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full gap-6">
            {/* Left Arrow */}
            <button 
              onClick={onPreviousTooth}
              className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Tooth Info */}
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">TOOTH</p>
              <p className="text-4xl font-bold text-gray-900">{selectedTooth}</p>
              <p className="text-sm text-gray-500">{jawType}</p>
            </div>

            {/* Right Arrow */}
            <button 
              onClick={onNextTooth}
              className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* Detect Button */}
          <button 
            onClick={onDetect}
            className="w-full h-16 bg-[#009ace] hover:bg-[#0088b8] text-white rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-lg"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M14.7 6.3C15.1 5.9 15.7 5.9 16.1 6.3L20.7 10.9C21.1 11.3 21.1 11.9 20.7 12.3L12.7 20.3C12.5 20.5 12.3 20.6 12 20.6H7C6.4 20.6 6 20.2 6 19.6V15C6 14.7 6.1 14.5 6.3 14.3L14.7 6.3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 8L19 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Detect
          </button>

          {/* Bottom Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {/* Draw Button */}
            <button 
              onClick={onManual}
              className="h-20 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 19L19 12L22 15L15 22L12 19Z" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 13L16.5 5.5L2 2L5.5 16.5L13 18L18 13Z" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 2L9.586 9.586" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="11" cy="11" r="2" stroke="#374151" strokeWidth="2"/>
              </svg>
              <span className="text-sm text-gray-700 font-medium">Draw</span>
            </button>

            {/* Undo Button */}
            <button 
              onClick={onUndo}
              className="h-20 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 7V3M3 3H7M3 3L7 7C8.5 8.5 10.5 9 12.5 9C16.5 9 19.5 6 19.5 3" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 17V21M21 21H17M21 21L17 17C15.5 15.5 13.5 15 11.5 15C7.5 15 4.5 18 4.5 21" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm text-gray-700 font-medium">Undo</span>
            </button>

            {/* Clear Button */}
            <button 
              onClick={onClearSelection}
              className="h-20 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 6H5H21" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm text-gray-700 font-medium">Clear</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
