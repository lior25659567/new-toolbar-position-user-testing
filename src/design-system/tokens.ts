/**
 * Design tokens — Align Design System v2.0 (2026-04-01).
 *
 * Source of truth: Deisgn-system 2.0/Design-System 2.0.md (Semantic Color
 * System v0.9.0 + Typography System + Web Core Components 1.0.0).
 *
 * Three import surfaces (newest first):
 *   - `v2`  — v2.0 canonical token names (background-*, text-*, border-*,
 *             icon-*, $tp-*). Prefer for new code.
 *   - `ads` — legacy --ads-* namespace from v1.0. Kept working via aliases
 *             declared in theme.css.
 *   - `color` / `space` / `radius` / `font` / `shadow` / `transition` /
 *     `zIndex` — original in-house tokens, forwarded through --ds-*.
 */

// ─── Color (legacy alias surface) ───────────────────────────────────────────
export const color = {
  primary:           'var(--ds-color-primary)',
  primaryHover:      'var(--ds-color-primary-hover)',
  primaryPressed:    'var(--ds-color-primary-pressed)',
  primaryRing:       'var(--ds-color-primary)',
  primaryRingLight:  'var(--ds-color-primary)',

  danger:            'var(--ds-color-danger)',
  dangerHover:       'var(--ds-color-danger-hover)',
  dangerPressed:     'var(--ds-color-danger-pressed)',
  dangerRing:        'var(--ds-color-danger-ring)',

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

  textDefault:       'var(--ds-text-primary)',
  textSubtle:        'var(--ds-text-secondary)',
  textPlaceholder:   'var(--ds-text-placeholder)',
  textHeading:       'var(--ds-text-heading)',
  textLabel:         'var(--ds-text-label)',
  textOnPrimary:     'var(--ds-text-on-accent)',

  borderDefault:     'var(--ds-border-default)',
  borderStrong:      'var(--ds-border-strong)',
  borderHover:       'var(--ds-border-hover)',

  bgPage:            'var(--ds-surface-sunken)',
  bgSurface:         'var(--ds-surface-base)',
  bgHover:           'var(--ds-surface-hover)',
  bgActive:          'var(--ds-surface-active)',

  success:           'var(--ds-color-success)',
  successLight:      'var(--ds-color-success-subtle)',
  successBorder:     'var(--ds-color-success-border)',
  successText:       'var(--ds-color-success-on)',

  error:             'var(--ds-color-danger)',

  tagRed:       { bg: 'var(--ds-tag-red-bg)',       border: 'var(--ds-tag-red-border)',       text: 'var(--ds-tag-red-text)' },
  tagOrange:    { bg: 'var(--ds-tag-orange-bg)',     border: 'var(--ds-tag-orange-border)',     text: 'var(--ds-tag-orange-text)' },
  tagMagenta:   { bg: 'var(--ds-tag-magenta-bg)',    border: 'var(--ds-tag-magenta-border)',    text: 'var(--ds-tag-magenta-text)' },
  tagPurple:    { bg: 'var(--ds-tag-purple-bg)',     border: 'var(--ds-tag-purple-border)',     text: 'var(--ds-tag-purple-text)' },
  tagBlue:      { bg: 'var(--ds-tag-blue-bg)',       border: 'var(--ds-tag-blue-border)',       text: 'var(--ds-tag-blue-text)' },
  tagGreen:     { bg: 'var(--ds-tag-green-bg)',      border: 'var(--ds-tag-green-border)',      text: 'var(--ds-tag-green-text)' },
} as const;

// ─── Spacing ────────────────────────────────────────────────────────────────
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

// ─── Border Radius ──────────────────────────────────────────────────────────
// Default radius across components is 8px (sm/md/lg). xl is reserved for
// large overlays (e.g. date-picker popover). Tiny indicators (e.g. the
// checkbox tick at --ads-size-cbx-radius) intentionally keep 4px in CSS.
export const radius = {
  none: '0px',
  sm:   '8px',
  md:   '8px',
  lg:   '8px',
  xl:   '12px',
  full: '9999px',
} as const;

// ─── Typography ─────────────────────────────────────────────────────────────
export const font = {
  family: '"Roboto", "Helvetica Neue", Arial, system-ui, sans-serif',
  mono:   '"Roboto Mono", ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace',

  size: {
    '2xs': '11px',
    xs:    '12px',
    sm:    '13px',
    base:  '14px',
    md:    '17px',
    lg:    '20px',
    xl:    '24px',
    '2xl': '28px',
    '3xl': '44px',
  },

  weight: {
    light:    300,
    regular:  400,
    medium:   500,
    semibold: 500, // ADS does not use 600 — collapse to medium
    bold:     500,
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

// ─── Shadows & Focus Rings ──────────────────────────────────────────────────
export const shadow = {
  focusPrimary:      'var(--ds-focus-ring)',
  focusPrimaryLight: 'var(--ds-focus-ring-light)',
  focusDanger:       'var(--ds-focus-ring-danger)',
  sm:                'var(--ds-shadow-sm)',
  md:                'var(--ds-shadow-md)',
  lg:                'var(--ds-shadow-lg)',
} as const;

// ─── Motion / Transition ────────────────────────────────────────────────────
export const transition = {
  fast:   '120ms cubic-bezier(0.2, 0, 0, 1)',
  base:   '180ms cubic-bezier(0.2, 0, 0, 1)',
  slow:   '240ms cubic-bezier(0.2, 0, 0, 1)',
  button: 'background-color 180ms cubic-bezier(0.2, 0, 0, 1), color 180ms cubic-bezier(0.2, 0, 0, 1), border-color 180ms cubic-bezier(0.2, 0, 0, 1), box-shadow 180ms cubic-bezier(0.2, 0, 0, 1), transform 120ms cubic-bezier(0.2, 0, 0, 1), opacity 180ms cubic-bezier(0.2, 0, 0, 1)',
  border: 'border-color 180ms cubic-bezier(0.2, 0, 0, 1), background-color 180ms cubic-bezier(0.2, 0, 0, 1), box-shadow 180ms cubic-bezier(0.2, 0, 0, 1), color 180ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1), opacity 180ms cubic-bezier(0.2, 0, 0, 1)',
  input:  'background-color 120ms cubic-bezier(0.2, 0, 0, 1), box-shadow 120ms cubic-bezier(0.2, 0, 0, 1)',
} as const;

// ─── Z-Index ────────────────────────────────────────────────────────────────
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

// ─── ADS namespace (new --ads-* surface) ────────────────────────────────────
export const ads = {
  blue: {
    50:   'var(--ads-blue-50)',
    100:  'var(--ads-blue-100)',
    500:  'var(--ads-blue-500)',
    550:  'var(--ads-blue-550)',
    600:  'var(--ads-blue-600)',
    700:  'var(--ads-blue-700)',
    text: 'var(--ads-blue-text)',
  },
  danger: {
    500: 'var(--ads-danger-500)',
    600: 'var(--ads-danger-600)',
    700: 'var(--ads-danger-700)',
  },
  status: {
    error:   'var(--ads-error-500)',
    success: 'var(--ads-success-500)',
    success600: 'var(--ads-success-600)',
    warning: 'var(--ads-warning-500)',
    info:    'var(--ads-info-500)',
  },
  text: {
    primary:     'var(--ads-text-primary)',
    muted:       'var(--ads-text-muted)',
    subtle:      'var(--ads-text-subtle)',
    disabled:    'var(--ads-text-disabled)',
    placeholder: 'var(--ads-text-placeholder)',
    label:       'var(--ads-text-label)',
    strong:      'var(--ads-text-strong)',
    onPrimary:   'var(--ads-text-on-primary)',
  },
  bg: {
    page:    'var(--ads-bg-page)',
    surface: 'var(--ads-bg-surface)',
    muted:   'var(--ads-bg-muted)',
    subtle:  'var(--ads-bg-subtle)',
    inverse: 'var(--ads-bg-inverse)',
  },
  border: {
    subtle:  'var(--ads-border-subtle)',
    default: 'var(--ads-border-default)',
    strong:  'var(--ads-border-strong)',
  },
  shadow: {
    sm: 'var(--ads-shadow-sm)',
    md: 'var(--ads-shadow-md)',
    lg: 'var(--ads-shadow-lg)',
  },
  radius: {
    xs:   'var(--ads-radius-xs)',
    sm:   'var(--ads-radius-sm)',
    md:   'var(--ads-radius-md)',
    pill: 'var(--ads-radius-pill)',
    full: 'var(--ads-radius-full)',
  },
  font: {
    sans: 'var(--ads-font-sans)',
    mono: 'var(--ads-font-mono)',
  },
  duration: {
    fast: 'var(--ads-duration-fast)',
    base: 'var(--ads-duration-base)',
  },
  ease: {
    standard: 'var(--ads-ease-standard)',
  },
  focusRing: 'var(--ads-focus-ring)',
} as const;

// ─── v2.0 namespace ─────────────────────────────────────────────────────────
// Canonical Align DS v2.0 token names (background-*, text-*, border-*,
// icon-*, $tp-*). Values resolve through CSS custom properties declared in
// theme.css — light and dark modes are handled there.
//
// ⚠ Per Design-System 2.0.md Appendix F, three tokens have unresolved
// conflicts (text-warning, border-warning, icon-warning in both modes;
// icon-inverse-secondary in dark mode). Project decision: use v2.0 doc
// values (#FA8E41 etc.) — see comments in theme.css.
export const v2 = {
  background: {
    subtle00:           'var(--ads-background-subtle-00)',
    subtle01:           'var(--ads-background-subtle-01)',
    subtle02:           'var(--ads-background-subtle-02)',
    accent:             'var(--ads-background-accent)',
    menu:               'var(--ads-background-menu)',
    overlay:            'var(--ads-background-overlay)',
    onColor:            'var(--ads-background-on-color)',
    inverse:            'var(--ads-background-inverse)',
    interactive:        'var(--ads-background-interactive)',
    destructive:        'var(--ads-background-destructive)',
    success:            'var(--ads-background-success)',
    highlightRed:       'var(--ads-background-highlight-red)',
    highlightMagenta:   'var(--ads-background-highlight-magenta)',
    highlightPurple:    'var(--ads-background-highlight-purple)',
    highlightBlue:      'var(--ads-background-highlight-blue)',
    highlightGreen:     'var(--ads-background-highlight-green)',
    highlightOrange:    'var(--ads-background-highlight-orange)',
    highlightGray:      'var(--ads-background-highlight-gray)',
    subtleHover:        'var(--ads-background-subtle-hover)',
    accentHover:        'var(--ads-background-accent-hover)',
    interactiveHover:   'var(--ads-background-interactive-hover)',
    destructiveHover:   'var(--ads-background-destructive-hover)',
    inverseHovered:     'var(--ads-background-inverse-hovered)',
    successHovered:     'var(--ads-background-success-hovered)',
    layerSelected:        'var(--ads-background-layer-selected)',
    layerSelectedHovered: 'var(--ads-background-layer-selected-hovered)',
    layerSelectedPressed: 'var(--ads-background-layer-selected-pressed)',
    subtleActive:       'var(--ads-background-subtle-active)',
    accentActive:       'var(--ads-background-accent-active)',
    interactiveActive:  'var(--ads-background-interactive-active)',
    destructiveActive:  'var(--ads-background-destructive-active)',
    successPressed:     'var(--ads-background-success-pressed)',
    interactiveDisabled: 'var(--ads-background-interactive-disabled)',
    destructiveDisabled: 'var(--ads-background-destructive-disabled)',
    onColorDisabled:     'var(--ads-background-on-color-disabled)',
    successDisabled:     'var(--ads-background-success-disabled)',
  },
  border: {
    subtle:              'var(--ads-border-subtle)',
    accent:              'var(--ads-border-accent)',
    strong:              'var(--ads-border-strong)',
    onColorSubtle:       'var(--ads-border-on-color-subtle)',
    onColorAccent:       'var(--ads-border-on-color-accent)',
    onColorStrong:       'var(--ads-border-on-color-strong)',
    inverseSubtle:       'var(--ads-border-inverse-subtle)',
    inverseAccent:       'var(--ads-border-inverse-accent)',
    inverseStrong:       'var(--ads-border-inverse-strong)',
    interactive:         'var(--ads-border-interactive)',
    error:               'var(--ads-border-error)',
    warning:             'var(--ads-border-warning)',
    success:             'var(--ads-border-success)',
    highlightRed:        'var(--ads-border-highlight-red)',
    highlightMagenta:    'var(--ads-border-highlight-magenta)',
    highlightPurple:     'var(--ads-border-highlight-purple)',
    highlightBlue:       'var(--ads-border-highlight-blue)',
    highlightGreen:      'var(--ads-border-highlight-green)',
    highlightOrange:     'var(--ads-border-highlight-orange)',
    highlightGray:       'var(--ads-border-highlight-gray)',
    subtleHover:         'var(--ads-border-subtle-hover)',
    accentHover:         'var(--ads-border-accent-hover)',
    interactiveHovered:  'var(--ads-border-interactive-hovered)',
    inverseSubtleHovered:  'var(--ads-border-inverse-subtle-hovered)',
    inverseAccentHovered:  'var(--ads-border-inverse-accent-hovered)',
    subtlePressed:       'var(--ads-border-subtle-pressed)',
    accentActive:        'var(--ads-border-accent-active)',
    inverseSubtlePressed:  'var(--ads-border-inverse-subtle-pressed)',
    inverseAccentPressed:  'var(--ads-border-inverse-accent-pressed)',
    focus:               'var(--ads-border-focus)',
    onColorFocus:        'var(--ads-border-on-color-focus)',
    inverseFocus:        'var(--ads-border-inverse-focus)',
    disabled:            'var(--ads-border-disabled)',
    onColorDisabled:     'var(--ads-border-on-color-disabled)',
    inverseDisabled:     'var(--ads-border-inverse-disabled)',
  },
  text: {
    primary:             'var(--ads-text-primary)',
    secondary:           'var(--ads-text-secondary)',
    tertiary:            'var(--ads-text-tertiary)',
    onColorPrimary:      'var(--ads-text-on-color-primary)',
    onColorSecondary:    'var(--ads-text-on-color-secondary)',
    onColorTertiary:     'var(--ads-text-on-color-tertiary)',
    onColorDisabled:     'var(--ads-text-on-color-disabled)',
    inversePrimary:      'var(--ads-text-inverse-primary)',
    inverseSecondary:    'var(--ads-text-inverse-secondary)',
    inverseTertiary:     'var(--ads-text-inverse-tertiary)',
    inverseDisabled:     'var(--ads-text-inverse-disabled)',
    link:                'var(--ads-text-link)',
    linkHovered:         'var(--ads-text-link-hovered)',
    error:               'var(--ads-text-error)',
    warning:             'var(--ads-text-warning)',
    success:             'var(--ads-text-success)',
    onHighlightRed:      'var(--ads-text-on-highlight-red)',
    onHighlightMagenta:  'var(--ads-text-on-highlight-magenta)',
    onHighlightPurple:   'var(--ads-text-on-highlight-purple)',
    onHighlightBlue:     'var(--ads-text-on-highlight-blue)',
    onHighlightGreen:    'var(--ads-text-on-highlight-green)',
    onHighlightOrange:   'var(--ads-text-on-highlight-orange)',
    disabled:            'var(--ads-text-disabled)',
  },
  icon: {
    primary:             'var(--ads-icon-primary)',
    secondary:           'var(--ads-icon-secondary)',
    tertiary:            'var(--ads-icon-tertiary)',
    onColorPrimary:      'var(--ads-icon-on-color-primary)',
    onColorSecondary:    'var(--ads-icon-on-color-secondary)',
    onColorTertiary:     'var(--ads-icon-on-color-tertiary)',
    onColorDisabled:     'var(--ads-icon-on-color-disabled)',
    inversePrimary:      'var(--ads-icon-inverse-primary)',
    inverseSecondary:    'var(--ads-icon-inverse-secondary)',
    inverseTertiary:     'var(--ads-icon-inverse-tertiary)',
    inverseDisabled:     'var(--ads-icon-inverse-disabled)',
    link:                'var(--ads-icon-link)',
    linkHovered:         'var(--ads-icon-link-hovered)',
    error:               'var(--ads-icon-error)',
    warning:             'var(--ads-icon-warning)',
    success:             'var(--ads-icon-success)',
    onHighlightRed:      'var(--ads-icon-on-highlight-red)',
    onHighlightMagenta:  'var(--ads-icon-on-highlight-magenta)',
    onHighlightPurple:   'var(--ads-icon-on-highlight-purple)',
    onHighlightBlue:     'var(--ads-icon-on-highlight-blue)',
    onHighlightGreen:    'var(--ads-icon-on-highlight-green)',
    onHighlightOrange:   'var(--ads-icon-on-highlight-orange)',
    disabled:            'var(--ads-icon-disabled)',
  },
  gradient: {
    blue:                'var(--ads-gradient-blue)',
  },
  /** v2.0 typography tokens — Roboto. Pair `size` + `lh` per token. */
  typography: {
    heading01: { size: 'var(--tp-heading-01-size)', lh: 'var(--tp-heading-01-lh)', weight: 500 },
    heading02: { size: 'var(--tp-heading-02-size)', lh: 'var(--tp-heading-02-lh)', weight: 500 },
    heading03: { size: 'var(--tp-heading-03-size)', lh: 'var(--tp-heading-03-lh)', weight: 500 },
    heading04: { size: 'var(--tp-heading-04-size)', lh: 'var(--tp-heading-04-lh)', weight: 500 },
    heading05: { size: 'var(--tp-heading-05-size)', lh: 'var(--tp-heading-05-lh)', weight: 500 },
    body01:    { size: 'var(--tp-body-01-size)',    lh: 'var(--tp-body-01-lh)',    weight: 400 },
    body02:    { size: 'var(--tp-body-02-size)',    lh: 'var(--tp-body-02-lh)',    weight: 400 },
    label01:   { size: 'var(--tp-label-01-size)',   lh: 'var(--tp-label-01-lh)',   weight: 400 },
    link01:    { size: 'var(--tp-link-01-size)',    lh: 'var(--tp-link-01-lh)',    weight: 400 },
    link02:    { size: 'var(--tp-link-02-size)',    lh: 'var(--tp-link-02-lh)',    weight: 400 },
    link03:    { size: 'var(--tp-link-03-size)',    lh: 'var(--tp-link-03-lh)',    weight: 400 },
    code01:    { size: 'var(--tp-code-01-size)',    lh: 'var(--tp-code-01-lh)',    weight: 400 },
    code02:    { size: 'var(--tp-code-02-size)',    lh: 'var(--tp-code-02-lh)',    weight: 400 },
    displayRegular01: { size: 'var(--tp-display-regular-01-size)', lh: 'var(--tp-display-regular-01-lh)', weight: 400 },
    displayRegular02: { size: 'var(--tp-display-regular-02-size)', lh: 'var(--tp-display-regular-02-lh)', weight: 300 },
    displayRegular03: { size: 'var(--tp-display-regular-03-size)', lh: 'var(--tp-display-regular-03-lh)', weight: 300 },
    displayRegular04: { size: 'var(--tp-display-regular-04-size)', lh: 'var(--tp-display-regular-04-lh)', weight: 300 },
    displayRegular05: { size: 'var(--tp-display-regular-05-size)', lh: 'var(--tp-display-regular-05-lh)', weight: 300 },
    displayMedium01:  { size: 'var(--tp-display-medium-01-size)',  lh: 'var(--tp-display-medium-01-lh)',  weight: 500 },
    displayMedium02:  { size: 'var(--tp-display-medium-02-size)',  lh: 'var(--tp-display-medium-02-lh)',  weight: 500 },
    displayMedium03:  { size: 'var(--tp-display-medium-03-size)',  lh: 'var(--tp-display-medium-03-lh)',  weight: 500 },
    displayMedium04:  { size: 'var(--tp-display-medium-04-size)',  lh: 'var(--tp-display-medium-04-lh)',  weight: 500 },
    displayMedium05:  { size: 'var(--tp-display-medium-05-size)',  lh: 'var(--tp-display-medium-05-lh)',  weight: 500 },
  },
  font: {
    sans: 'var(--ads-font-sans)',
    mono: 'var(--ads-font-mono)',
  },
} as const;
