import React from "react";

// SVG Icons as components
function DragHandle() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <div style={{ display: 'flex', gap: '3px' }}>
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#99a1af' }} />
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#99a1af' }} />
      </div>
      <div style={{ display: 'flex', gap: '3px' }}>
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#99a1af' }} />
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#99a1af' }} />
      </div>
      <div style={{ display: 'flex', gap: '3px' }}>
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#99a1af' }} />
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#99a1af' }} />
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 5L5 15M5 5L15 15" stroke="#6B7280" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ScissorsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="3" stroke="white" strokeWidth="2"/>
      <circle cx="6" cy="18" r="3" stroke="white" strokeWidth="2"/>
      <path d="M20 4L8.12 15.88" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.47 14.48L20 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.12 8.12L12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 7V13H9" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 17C21 14.6131 20.0518 12.3239 18.364 10.636C16.6761 8.94821 14.3869 8 12 8C9.61305 8 7.32387 8.94821 5.63604 10.636L3 13" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ConfirmIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 4L12 14.01L9 11.01" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Panel() {
  return (
    <div 
      className="bg-white flex flex-col overflow-visible"
      data-name="TrimPanel"
      style={{ 
        width: '300px', 
        minWidth: '300px', 
        maxWidth: '300px', 
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Header - 72px height with 24px padding on sides */}
      <div 
        className="flex items-center justify-between"
        style={{ height: '72px', padding: '0 24px', borderBottom: '1px solid #f3f4f6' }}
      >
        <div className="flex items-center" style={{ gap: '16px' }}>
          <DragHandle />
          <h2 className="font-semibold text-[20px] text-[#1e2939] tracking-[-0.45px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Trim tool
          </h2>
        </div>
        <button className="flex items-center justify-center size-8 rounded-lg hover:bg-gray-100 transition-colors">
          <CloseIcon />
        </button>
      </div>
      
      {/* Action Buttons - 24px padding on sides, 32px padding on top */}
      <div 
        className="flex flex-col gap-2"
        style={{ padding: '32px 24px 24px 24px' }}
      >
        {/* Trim Button */}
        <button 
          className="flex items-center justify-center gap-4 w-full rounded-lg transition-colors hover:opacity-90"
          style={{ backgroundColor: '#009ACE', height: '60px', minHeight: '60px' }}
        >
          <ScissorsIcon />
          <span className="text-[18px] font-medium tracking-[-0.44px]" style={{ fontFamily: 'Inter, sans-serif', color: 'white' }}>
            Trim
          </span>
        </button>
        
        {/* Undo and Confirm Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 flex flex-col items-center justify-center gap-1 bg-white border border-[#e5e7eb] rounded-lg hover:bg-gray-50 transition-colors" style={{ height: '60px', minHeight: '60px' }}>
            <UndoIcon />
            <span className="text-[14px] font-medium text-[#374151] tracking-[-0.15px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Undo
            </span>
          </button>
          
          <button className="flex-1 flex flex-col items-center justify-center gap-1 bg-white border border-[#e5e7eb] rounded-lg hover:bg-gray-50 transition-colors" style={{ height: '60px', minHeight: '60px' }}>
            <ConfirmIcon />
            <span className="text-[14px] font-medium text-[#374151] tracking-[-0.15px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Confirm
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
