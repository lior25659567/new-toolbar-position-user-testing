# Design System Changes

## v0.10 — Full Figma 0.9.0 coverage (2026-05-15)

Added missing components from the Figma library `06. Web components 0.9.0`
and gallery sections for the existing-but-undemonstrated ones. Light NAV
reorganization to mirror Figma grouping (existing section IDs preserved
so deep links still work).

**New components**
- `Slider.tsx` — Single / Ranged value, 20×20 handle, all 4 states (Figma 18362:19162).
- `Spinner.tsx` — Sizes sm/md/lg (Figma 15305:6739).
- `Combobox.tsx` — Searchable select, both layer-sets, 7 states (Figma 15305:6735).
- `ContextualMenu.tsx` — Popover menu with Item/Separator, keyboard nav (Figma 15305:6736).
- `MessageBubble.tsx` — Chat bubble, from = them/you, position single/top/center/bottom (Figma 15305:6742).

**New gallery sections (existing components, now demonstrated)**
- Accordion, Avatar, Logo / LogoMark, Page Header (TopBar), Navigation Panel (LeftRail), Link.

**NAV reorganization**
- "Controls" → split into "Actions" (button, icon-button, link) + "Selection" (toggle, checkbox, radio, tag).
- New group "Pickers & Menus" extracted from Inputs (select, dropdown-list, contextual-menu).
- New group "Branding" — folds Iconography in alongside the new Logo entry.
- Slider, Combobox added to Inputs. Page Header, Nav Panel added to Navigation.
- Avatar, Accordion, Message Bubble added to Data Display. Spinner added to Feedback.

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

---

## v2.0 Alignment

The codebase is aligned against [Deisgn-system 2.0/Design-System 2.0.md](../../Deisgn-system%202.0/Design-System%202.0.md). Three intentional deviations are documented here as approved.

### Approved deviations from DS v2.0

1. **Dark-mode trigger** — spec mandates `.mode-dark` on `:root`; we use `[data-theme="align-dark"]` on `<html>` plus a `.dark` class fallback for Tailwind. Both are wired through `ThemeProvider`. Already in production; migration provides no functional value.
2. **IconButton visual size** — spec/Apple HIG require ≥44×44px touch targets; visual `IconButton` sizes stay at 32 / 36 / 40px to preserve dense toolbar layouts. The effective hit target is extended to ≥44×44px through an invisible `::after` overlay (see `IconButton.tsx`). Meets the a11y requirement without breaking density.
3. **Warning tokens** — `text-warning` / `border-warning` / `icon-warning` are flagged "unresolved — do not use" by the spec, but the v2.0 doc value (`#FA8E41`) is what we use. 50+ live consumers in `src/components/`. We keep the current value; a single `UNRESOLVED` comment block in `theme.css` marks the spot for a future Figma-driven update.

### Out of scope for this iteration

- DS v2.1 components (Header, Page title, Data table, Pagination) — explicitly deferred by the spec.
- Hardcoded hexes in [src/imports/](../imports/) (Figma auto-imports, regenerated by tooling).
- Tailwind v4 compiled output in [src/index.css](../index.css).
