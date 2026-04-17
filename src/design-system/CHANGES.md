# Design System Changes

## Summary

Full design system audit, token refactor to CSS custom properties, and dark mode implementation.

## What changed

### Token Layer (Phase 1)

- **New file: `theme.css`** — Defines all design tokens as CSS custom properties with both `:root` (light) and `.dark` (dark) mappings. Categories: surface, text, border, accent, danger, success, warning, info, focus, shadow, tag, toggle, tooltip, notification.
- **Refactored: `tokens.ts`** — All color tokens now resolve to `var(--ds-*)` CSS variables instead of raw hex values. This enables runtime theme switching without component changes.
- **Added: `zIndex` scale** — Centralized z-index tokens (dropdown: 1000, modal: 1050, tooltip: 1070, etc.) to replace scattered hardcoded `9999` values.
- **New file: `ThemeProvider.tsx`** — React context for theme management with `useTheme()` hook. Supports `'light' | 'dark' | 'system'`, persists to localStorage, respects `prefers-color-scheme`.
- **Updated: `index.html`** — Inline script prevents FOUC by applying saved theme class before first paint.
- **Updated: `main.tsx`** — App wrapped in `<ThemeProvider>`.

### Component Fixes (Phase 2)

| Component | Fix |
|---|---|
| SecondaryButton | Replaced `rgba(0,0,0,0.93)` → `color.textDefault`, `#E0F2FE` → primary-subtle, `#f5f5f5` → `color.bgHover`, `#9CA3AF` → `color.borderHover` |
| LinkButton | Replaced `rgba(0,0,0,0.05)` → `color.bgHover`, `rgba(0,0,0,0.09)` → `color.bgActive` |
| GhostButton | Same as LinkButton |
| Toggle | Replaced 5 hardcoded colors (`#0080B2`, `#C5C5C5`, etc.) → toggle CSS variables |
| TextInput/TextArea | Replaced `#F4F4F4` → `var(--ds-surface-input-grey)` |
| DatePicker | Replaced `"white"` → `color.bgSurface`, `#E0F2FE` → primary-subtle, `#6a7282` → `color.textSubtle` |
| Tooltip | Replaced `#1e293b` / `#f8fafc` → `var(--ds-tooltip-bg/text)` (inverts in dark mode) |
| Notification | Replaced all hardcoded palette colors → `var(--ds-notif-*)` CSS variables |

### DesignSystemPage

- Added theme toggle button (sun/moon icon) in header bar
- All sections now respond to dark mode via token layer

## Breaking changes

**None.** All component props and exports are unchanged. The token type changes from literal strings (`'#009ACE'`) to CSS variable references (`'var(--ds-color-primary)'`) which are still `string` type and work identically with `React.CSSProperties`.

## Follow-ups recommended

- [ ] Add `loading` prop + spinner to all button components
- [ ] Add focus trap to Modal
- [ ] Add arrow-key keyboard navigation to Tabs
- [ ] Add ARIA roles to Stepper (`role="group"`, `aria-current="step"`)
- [ ] Add semantic structure to MessageList (`<article>`, timestamps)
- [ ] Add `aria-describedby` to Tooltip triggers
- [ ] Replace hardcoded `zIndex: 9999` across codebase with `zIndex.tooltip` / `zIndex.modal`
- [ ] Add Storybook or component story files
- [ ] Audit 99 non-design-system files for hardcoded colors
