/**
 * Design tokens – single source of truth for all visual properties.
 * Import named groups instead of using raw values in component styles.
 *
 * Usage:
 *   import { color, font, space, radius, shadow, transition } from './tokens';
 */

// ─── Color ───────────────────────────────────────────────────────────────────
export const color = {
  // Primary brand – Figma: Primary 9-157
  primary:           '#009ACE',
  primaryHover:      '#0088B8',
  primaryPressed:    '#007A9E',
  primaryRing:       'rgb(0, 155, 206)',
  primaryRingLight:  'rgb(0, 155, 206)',

  // Danger / destructive – Figma: Warning 5-6738
  danger:            '#D43F58',
  dangerHover:       '#C23850',
  dangerPressed:     '#A82D40',
  dangerRing:        'rgba(212, 63, 88, 0.35)',

  // Neutral scale (Slate palette)
  neutral950:        '#0f172a',
  neutral900:        '#1e293b',
  neutral800:        '#374151',
  neutral700:        '#475569',
  neutral600:        '#64748b',
  neutral400:        '#94a3b8',
  neutral300:        '#d1d5db',
  neutral200:        '#e5e7eb',
  neutral150:        '#e2e8f0',
  neutral100:        '#f1f5f9',
  neutral50:         '#f9fafb',
  neutral25:         '#f8fafc',
  white:             '#ffffff',

  // Semantic text aliases
  textDefault:       '#374151',  // body copy
  textSubtle:        '#64748b',  // descriptions, secondary
  textPlaceholder:   '#94a3b8',  // hints, captions
  textHeading:       '#0f172a',  // page / section titles
  textLabel:         '#475569',  // form labels, subsection labels
  textOnPrimary:     '#ffffff',  // text on filled primary/danger

  // Semantic border aliases
  borderDefault:     '#e5e7eb',  // normal dividers
  borderStrong:      '#d1d5db',  // prominent borders
  borderHover:       '#9ca3af',  // hover borders

  // Semantic background aliases
  bgPage:            '#f8fafc',  // page / canvas
  bgSurface:         '#ffffff',  // card / panel
  bgHover:           '#f9fafb',  // subtle hover fill
  bgActive:          '#f3f4f6',  // pressed fill

  // Success
  success:           '#00964E',
  successLight:      '#DCFCE8',
  successBorder:     '#C6F5D6',
  successText:       '#006130',

  // Tag palette – Figma Tags node 5:1033
  tagRed:       { bg: '#FFF0F3', border: '#FFE0E7', text: '#A30F34' },
  tagOrange:    { bg: '#FFF2E3', border: '#FFE5D6', text: '#8A4300' },
  tagMagenta:   { bg: '#FFF0F9', border: '#FFE3F4', text: '#A30463' },
  tagPurple:    { bg: '#F8F2FF', border: '#F2E6FF', text: '#6C37A1' },
  tagBlue:      { bg: '#E6F7FF', border: '#D1F1FF', text: '#005780' },
  tagGreen:     { bg: '#DCFCE8', border: '#C6F5D6', text: '#006130' },
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────────────
export const space = {
  0:  '0px',
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '20px',
  6:  '24px',
  8:  '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────
export const radius = {
  none: '0px',
  sm:   '4px',
  md:   '8px',
  lg:   '12px',
  xl:   '16px',
  full: '9999px',
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
export const font = {
  family: 'Inter, system-ui, sans-serif',
  mono:   'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace',

  size: {
    '2xs': '11px',
    xs:    '12px',
    sm:    '13px',
    base:  '14px',
    md:    '15px',
    lg:    '18px',
    xl:    '20px',
    '2xl': '24px',
    '3xl': '32px',
  },

  weight: {
    regular:  400,
    medium:   500,
    semibold: 600,
    bold:     700,
  },

  lineHeight: {
    none:    '1',
    tight:   '1.2',
    snug:    '1.375',
    normal:  '1.5',
    relaxed: '1.625',
  },

  tracking: {
    tighter: '-0.03em',
    tight:   '-0.02em',
    snug:    '-0.015em',
    normal:  '0em',
    wide:    '0.05em',
  },
} as const;

// ─── Shadows & Focus Rings ────────────────────────────────────────────────────
export const shadow = {
  focusPrimary:      '0 0 0 3px rgba(0, 154, 206, 0.35)',
  focusPrimaryLight: '0 0 0 3px rgba(0, 154, 206, 0.20)',
  focusDanger:       '0 0 0 3px rgba(212, 63, 88, 0.35)',
  sm:                '0 1px 2px rgba(0, 0, 0, 0.05)',
  md:                '0 2px 8px rgba(0, 0, 0, 0.08)',
  lg:                '0 4px 16px rgba(0, 0, 0, 0.10)',
} as const;

// ─── Motion / Transition ──────────────────────────────────────────────────────
export const transition = {
  fast:   '0.1s ease',
  base:   '0.2s ease',
  slow:   '0.3s ease',
  button: 'background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease, opacity 0.2s ease',
  border: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease, transform 0.2s ease, opacity 0.2s ease',
  input:  'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
} as const;
