// ============================================================================
// PREP EDIT PANEL COMPONENT
// ============================================================================
// This component provides controls for prep review and editing
// ============================================================================

import type { PrepEditPanelProps } from '@/app/types/dental';

export function PrepEditPanel({
  onSelect,
  onEraseRescan,
  onClose
}: PrepEditPanelProps) {
  return (
    <div className="bg-white flex flex-col items-start relative rounded-[16px] w-[420px] shadow-lg" data-name="Prep Edit Panel">
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
          <h2 className="text-[20px] font-semibold text-gray-800">Prep review</h2>
        </div>
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="w-full px-6 py-8 flex flex-col gap-3">
        {/* Select Button */}
        <button 
          onClick={onSelect}
          className="w-full h-16 bg-[#009ace] hover:bg-[#0088b8] text-white rounded-xl flex items-center justify-center gap-3 transition-colors font-medium text-lg"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 13L19 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Select
        </button>

        {/* Erase & Rescan Button */}
        <button 
          onClick={onEraseRescan}
          className="w-full h-16 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl flex items-center justify-center gap-3 transition-colors font-medium text-base text-gray-700"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 7V3M3 3H7M3 3L7 7C8.5 8.5 10.5 9 12.5 9C16.5 9 19.5 6 19.5 3" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 17V21M21 21H17M21 21L17 17C15.5 15.5 13.5 15 11.5 15C7.5 15 4.5 18 4.5 21" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Erase & Rescan
        </button>
      </div>
    </div>
  );
}
