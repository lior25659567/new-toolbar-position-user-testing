import React from "react";
import { IconButton } from "../design-system";
import colorImage from "../assets/button-images/review-tool/Color.png";
import niriImage from "../assets/button-images/review-tool/Niri.png";

const PLACEHOLDER_IMAGE_COLOR = colorImage;
const PLACEHOLDER_IMAGE_NIRI = niriImage;

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

function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 21H3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 3L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 21L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ImageCard({ src, label, badge }: { src: string; label: string; badge: string }) {
  return (
    <div
      style={{
        flex: '1 1 0',
        minHeight: '120px',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#1a1a2e',
      }}
    >
      <img
        alt={label}
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      {/* Badge removed */}
      {/* Expand button */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '28px',
          height: '28px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          color: '#374151',
        }}
      >
        <ExpandIcon />
      </div>
    </div>
  );
}

export default function CameraNiri() {
  return (
    <div
      data-name="ReviewToolPanel"
      style={{
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        height: '100%',
        paddingTop: 0,
        marginTop: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          height: '56px',
          minHeight: '56px',
          padding: '0 16px',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <DragHandle />
          <h2
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              color: '#1e2939',
              letterSpacing: '-0.45px',
              margin: 0,
            }}
          >
            Review tool
          </h2>
        </div>
        <IconButton aria-label="Close panel">
          <CloseIcon />
        </IconButton>
      </div>

      {/* Images - two stacked vertically, filling remaining space */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          justifyContent: 'flex-start',
        }}
      >
        <ImageCard
          src={PLACEHOLDER_IMAGE_COLOR}
          label="Upper arch color scan"
          badge="Color"
        />
        <ImageCard
          src={PLACEHOLDER_IMAGE_NIRI}
          label="Lower arch NIRI scan"
          badge="NIRI"
        />
      </div>
    </div>
  );
}
