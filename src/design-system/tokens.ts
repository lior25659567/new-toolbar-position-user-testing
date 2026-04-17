/**
 * Design tokens – single source of truth for all visual properties.
 * Import named groups instead of using raw values in component styles.
 *
 * Colors resolve to CSS custom properties defined in theme.css,
 * enabling runtime dark-mode switching without component changes.
 *
 * Usage:
 *   import { color, font, space, radius, shadow, transition, zIndex } from './tokens';
 */

// ─── Color ───────────────────────────────────────────────────────────────────
export const color = {
  // Primary brand
  primary:           'var(--ds-color-primary)',
  primaryHover:      'var(--ds-color-primary-hover)',
  primaryPressed:    'var(--ds-color-primary-pressed)',
  primaryRing:       'var(--ds-color-primary)',
  primaryRingLight:  'var(--ds-color-primary)',

  // Danger / destructive
  danger:            'var(--ds-color-danger)',
  dangerHover:       'var(--ds-color-danger-hover)',
  dangerPressed:     'var(--ds-color-danger-pressed)',
  dangerRing:        'var(--ds-color-danger-ring)',

  // Neutral scale — mapped to semantic surface/text tokens where possible,
  // raw palette kept for backwards compatibility with existing component refs
  neutral950:        'var(--ds-text-heading)',
  neutral900:        'var(--ds-surface-inverse)',
  neutral800:        'var(--ds-text-primary)',
  neutral700:        'var(--ds-text-label)',
  neutral600:        'var(--ds-text-secondary)',
  neutral400:        'var(--ds-text-tertiary)',
  neutral300:        'var(--ds-border-strong)',
  neutral200:        'var(--ds-border-default)',
  neutral150:        'var(--ds-border-subtle)',
  neutral100:        'var(--ds-surface-active)',
  neutral50:         'var(--ds-surface-hover)',
  neutral25:         'var(--ds-surface-sunken)',
  white:             'var(--ds-surface-base)',

  // Semantic text aliases
  textDefault:       'var(--ds-text-primary)',
  textSubtle:        'var(--ds-text-secondary)',
  textPlaceholder:   'var(--ds-text-placeholder)',
  textHeading:       'var(--ds-text-heading)',
  textLabel:         'var(--ds-text-label)',
  textOnPrimary:     'var(--ds-text-on-accent)',

  // Semantic border aliases
  borderDefault:     'var(--ds-border-default)',
  borderStrong:      'var(--ds-border-strong)',
  borderHover:       'var(--ds-border-hover)',

  // Semantic background aliases
  bgPage:            'var(--ds-surface-sunken)',
  bgSurface:         'var(--ds-surface-base)',
  bgHover:           'var(--ds-surface-hover)',
  bgActive:          'var(--ds-surface-active)',

  // Success
  success:           'var(--ds-color-success)',
  successLight:      'var(--ds-color-success-subtle)',
  successBorder:     'var(--ds-color-success-border)',
  successText:       'var(--ds-color-success-on)',

  // Error (alias for danger used in form states)
  error:             'var(--ds-color-danger)',

  // Tag palette
  tagRed:       { bg: 'var(--ds-tag-red-bg)',       border: 'var(--ds-tag-red-border)',       text: 'var(--ds-tag-red-text)' },
  tagOrange:    { bg: 'var(--ds-tag-orange-bg)',     border: 'var(--ds-tag-orange-border)',     text: 'var(--ds-tag-orange-text)' },
  tagMagenta:   { bg: 'var(--ds-tag-magenta-bg)',    border: 'var(--ds-tag-magenta-border)',    text: 'var(--ds-tag-magenta-text)' },
  tagPurple:    { bg: 'var(--ds-tag-purple-bg)',     border: 'var(--ds-tag-purple-border)',     text: 'var(--ds-tag-purple-text)' },
  tagBlue:      { bg: 'var(--ds-tag-blue-bg)',       border: 'var(--ds-tag-blue-border)',       text: 'var(--ds-tag-blue-text)' },
  tagGreen:     { bg: 'var(--ds-tag-green-bg)',      border: 'var(--ds-tag-green-border)',      text: 'var(--ds-tag-green-text)' },
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
  focusPrimary:      'var(--ds-focus-ring)',
  focusPrimaryLight: 'var(--ds-focus-ring-light)',
  focusDanger:       'var(--ds-focus-ring-danger)',
  sm:                'var(--ds-shadow-sm)',
  md:                'var(--ds-shadow-md)',
  lg:                'var(--ds-shadow-lg)',
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

// ─── Z-Index ──────────────────────────────────────────────────────────────────
export const zIndex = {
  hide:      -1,
  base:      0,
  dropdown:  1000,
  sticky:    1020,
  fixed:     1030,
  backdrop:  1040,
  modal:     1050,
  popover:   1060,
  tooltip:   1070,
} as const;
