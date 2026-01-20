// ============================================================================
// THEME CONSTANTS
// ============================================================================
// Centralized theme constants for the dental application
// ============================================================================

export const COLORS = {
  // iTero brand colors
  primary: '#009ace',
  primaryHover: '#0088b8',
  primaryDark: '#0080B2',
  
  // UI colors
  white: '#ffffff',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Status colors
  selected: '#8ADAFF',
  selectedBorder: '#0080B2',
} as const;

export const SIZES = {
  panelWidth: '420px',
  headerHeight: '72px',
} as const;

export const SPACING = {
  panel: {
    padding: '1.5rem', // 24px
    gap: '2rem', // 32px
  },
} as const;
