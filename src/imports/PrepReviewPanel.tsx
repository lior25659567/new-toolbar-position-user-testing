import React, { useState } from "react";

// SVG Icons as components
function DragHandle() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', cursor: 'grab' }}>
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

function CloseIcon({ isHovered }: { isHovered?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 5L5 15M5 5L15 15" stroke={isHovered ? "#374151" : "#6B7280"} strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s ease' }}/>
    </svg>
  );
}

function SelectIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M18.7462 19.2287C18.3494 19.6658 17.6622 19.6658 17.2654 19.2287L11.4031 12.771C11.057 12.3898 11.057 11.808 11.4031 11.4267L12.0926 10.6672C12.4895 10.23 13.1766 10.23 13.5735 10.6672L19.4357 17.1249C19.7818 17.5061 19.7818 18.0879 19.4357 18.4691L18.7462 19.2287Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M9.79109 10.0996C9.23978 10.6195 8.37873 10.6195 7.82743 10.0996L6.78553 9.11695C6.18661 8.55211 6.18661 7.59964 6.78553 7.0348L7.64855 6.22088C8.19986 5.70095 9.06091 5.70095 9.61222 6.22088L10.6541 7.20349C11.253 7.76833 11.253 8.7208 10.6541 9.28564L9.79109 10.0996Z" fill="white"/>
      <path d="M7.65918 11.5928C7.99395 11.6539 8.21842 11.9607 8.16016 12.2773L7.56152 15.5215C7.50271 15.8378 7.18417 16.0445 6.84961 15.9834C6.51502 15.9222 6.29155 15.6163 6.34961 15.2998L6.94727 12.0566C7.00567 11.7401 7.32449 11.5319 7.65918 11.5928ZM4.26855 8.65137C4.6039 8.59585 4.91728 8.80887 4.96875 9.12695C5.01971 9.44487 4.78931 9.74794 4.4541 9.80371L0.707031 10.4268C0.371786 10.4823 0.0584469 10.2691 0.00683594 9.95117C-0.0444096 9.63316 0.185272 9.33032 0.520508 9.27441L4.26855 8.65137ZM15.5811 3.99805C15.8806 3.84699 16.2417 3.96218 16.3877 4.25488C16.5334 4.54753 16.4088 4.9065 16.1094 5.05762L12.9072 6.67383C12.6077 6.8249 12.2457 6.7105 12.0996 6.41797C11.9538 6.12527 12.0794 5.76538 12.3789 5.61426L15.5811 3.99805ZM2.04102 2.0127C2.27552 1.7788 2.65558 1.77927 2.88965 2.01367L5.66504 4.79297C5.89881 5.02734 5.89904 5.4075 5.66504 5.6416C5.43073 5.87557 5.0506 5.87556 4.81641 5.6416L2.04004 2.86133C1.80608 2.62683 1.8066 2.24678 2.04102 2.0127ZM10.96 0.0253906C11.287 0.118937 11.4774 0.44518 11.3848 0.753906L10.3838 4.08887C10.2911 4.39748 9.94999 4.57184 9.62305 4.47852C9.29631 4.38479 9.1066 4.05857 9.19922 3.75L10.2002 0.415039C10.2929 0.106329 10.6329 -0.068118 10.96 0.0253906Z" fill="white"/>
    </svg>
  );
}

function UndoIcon({ isHovered }: { isHovered?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 7V13H9" stroke={isHovered ? "#009ACE" : "#374151"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s ease' }}/>
      <path d="M21 17C21 14.6131 20.0518 12.3239 18.364 10.636C16.6761 8.94821 14.3869 8 12 8C9.61305 8 7.32387 8.94821 5.63604 10.636L3 13" stroke={isHovered ? "#009ACE" : "#374151"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s ease' }}/>
    </svg>
  );
}

function PrimaryPanelButton({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button 
      className="flex items-center justify-center gap-4 w-full rounded-lg transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        backgroundColor: isHovered ? '#0088B8' : '#009ACE', 
        height: '60px', 
        minHeight: '60px',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovered ? '0 4px 12px rgba(0, 154, 206, 0.3)' : 'none'
      }}
    >
      {icon}
      <span className="text-[18px] font-medium tracking-[-0.44px]" style={{ fontFamily: 'Inter, sans-serif', color: 'white' }}>
        {children}
      </span>
    </button>
  );
}

function SecondaryPanelButton({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button 
      className="flex items-center justify-center gap-4 bg-white border rounded-lg transition-all duration-200 w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        height: '60px', 
        minHeight: '60px',
        borderColor: isHovered ? '#009ACE' : '#e5e7eb',
        backgroundColor: isHovered ? '#f0f9ff' : 'white',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 4px 8px rgba(0, 0, 0, 0.08)' : 'none'
      }}
    >
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ isHovered?: boolean }>, { isHovered }) : icon}
      <span 
        className="text-[14px] font-medium tracking-[-0.15px] transition-colors duration-200" 
        style={{ fontFamily: 'Inter, sans-serif', color: isHovered ? '#009ACE' : '#374151' }}
      >
        {children}
      </span>
    </button>
  );
}

export default function PrepReviewPanel() {
  const [closeHovered, setCloseHovered] = useState(false);
  
  return (
    <div 
      className="bg-white flex flex-col overflow-visible"
      data-name="PrepReviewPanel"
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
            Prep review tool
          </h2>
        </div>
        <button 
          className="flex items-center justify-center size-8 rounded-lg transition-all duration-200"
          onMouseEnter={() => setCloseHovered(true)}
          onMouseLeave={() => setCloseHovered(false)}
          style={{ 
            backgroundColor: closeHovered ? '#f3f4f6' : 'transparent',
            transform: closeHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          <CloseIcon isHovered={closeHovered} />
        </button>
      </div>
      
      {/* Action Buttons - 24px padding on sides, 32px padding on top */}
      <div 
        className="flex flex-col gap-2"
        style={{ padding: '32px 24px 24px 24px' }}
      >
        {/* Select Button */}
        <PrimaryPanelButton icon={<SelectIcon />}>
          Select
        </PrimaryPanelButton>
        
        {/* Erase & Rescan Button */}
        <SecondaryPanelButton icon={<UndoIcon />}>
          Erase & Rescan
        </SecondaryPanelButton>
      </div>
    </div>
  );
}

