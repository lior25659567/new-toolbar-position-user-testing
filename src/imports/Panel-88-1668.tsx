import React from "react";
import { PrimaryButton, SecondaryButton, IconButton } from "../design-system";

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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, minWidth: '16px', minHeight: '16px' }}>
      <path d="M3 7V13H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 17C21 14.6131 20.0518 12.3239 18.364 10.636C16.6761 8.94821 14.3869 8 12 8C9.61305 8 7.32387 8.94821 5.63604 10.636L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ConfirmIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, minWidth: '16px', minHeight: '16px' }}>
      <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Panel() {
  return (
    <div
      className="bg-white flex flex-col overflow-visible"
      data-name="TrimPanel"
      style={{
        width: '260px',
        minWidth: '260px',
        maxWidth: '260px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{ height: '56px', padding: '0 16px', borderBottom: '1px solid #f3f4f6' }}
      >
        <div className="flex items-center" style={{ gap: '12px' }}>
          <DragHandle />
          <h2 className="font-semibold text-[16px] text-[#1e2939] tracking-[-0.45px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Trim tool
          </h2>
        </div>
        <IconButton aria-label="Close panel">
          <CloseIcon />
        </IconButton>
      </div>

      {/* Action Buttons */}
      <div
        className="flex flex-col gap-2"
        style={{ padding: '16px' }}
      >
        {/* Trim Button */}
        <PrimaryButton size={44} fullWidth>
          <ScissorsIcon />
          Trim
        </PrimaryButton>

        {/* Undo and Confirm Buttons */}
        <div className="flex gap-2">
          <div style={{ flex: '1 0 0', minWidth: 0 }}>
            <SecondaryButton size={44} fullWidth>
              <UndoIcon />
              Undo
            </SecondaryButton>
          </div>

          <div style={{ flex: '1 0 0', minWidth: 0 }}>
            <SecondaryButton size={44} fullWidth>
              <ConfirmIcon />
              Confirm
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
