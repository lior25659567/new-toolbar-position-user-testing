# Align Technology Design System

**Source:** Figma â€” Semantic Color System v0.9.0 + Typography System + Web Core Components 1.0.0 + Icons Library
**Extracted:** March 30â€“April 1, 2026
**Scope:** Light mode colors, Dark mode colors (Align brand), Typography, Web Core Components, Icons, Flags
**Note:** Exocad brand modes exist in the same file but are not included here.

---

## Implementation rules

When using this file, follow these rules exactly:

- All colors must use CSS custom properties mapped from the token tables. No hardcoded hex values.
- Typography: load Roboto 300, 400, 500 and Roboto Mono 400 from Google Fonts. No system fonts.
- Component variants, states, and anatomy are the source of truth. Do not approximate.
- Logos: use inline SVG from the Logos section with the CSS fill overrides documented there.
- No external component libraries.
- Implement light and dark mode using :root and .mode-dark token maps.

## How to use

Paste this into your AI tool and fill in your task:

"Before writing any code, deeply read and analyze [ALIGN-DESIGN-SYSTEM-v2.0.md or v0.9.md] in full. Follow the implementation rules in the file exactly.
I am building: [describe your task here]"

---

## What's New in v2.0

**Released:** 2026-04-01
**Prepared by:** Align UX Team
**Previous version:** v1.0 (colors + typography only)

v2.0 is a major release. It expands the design system reference from a color and typography spec into a full component, icon, and flag library â€” and resolves token discrepancies found between the v1.0 doc and the Figma source of truth.

---

### Summary of Changes

#### Added â€” Web Core Components (25 components)
Full specification for every component marked Ready for Dev in the 06.-Web-core-1.0.0 Figma file, including:
- Variants, states, anatomy, and token usage per component
- Component index with anchor links
- 4 components deferred to v2.1 (Header, Page title, Data table, Pagination â€” in progress in Figma)

#### Added â€” Icons (418 icons across 25 categories)
- Full icon inventory with sizes: 16Ã—16, 20Ã—20, 24Ã—24, 32Ã—32
- Outline and Fill style variants documented per icon
- Naming convention documented
- 4 source typos corrected (originals preserved in Appendix)

#### Added â€” Flags (130 flags)
- ISO 3166-1 alpha-2 naming convention
- Fixed size: 16Ã—12 rectangular format
- Full country/region inventory

#### Added â€” Extended Color Tokens (36 net-new tokens)
Tokens found in the Figma Color Modes file not previously in v1.0. Marked as extended â€” verify implementation status before production use.

#### Added â€” Color Modes Documentation
- Mode switching mechanism documented
- Figma Name column added to all token tables where names differ from v2.0 convention
- Delta comparison completed: 13 light mode and 22 dark mode token values corrected to match Figma source

#### Updated â€” Token Values Corrected
10 light mode and 18 dark mode tokens updated to match current Figma values (excluding unresolved conflicts). Most are minor hex shifts. See Appendix F â€” Unresolved Token Conflicts for full detail.

#### Updated â€” Logos
Logos now documented as inline SVG with viewBox and natural dimensions. Source repo is private â€” use inline SVG in all implementations, not external URLs.

#### Unresolved â€” Requires Design Team Decision
Two token conflicts are flagged and must not be used in production until resolved:

| Token | Conflict |
|-------|----------|
| text-warning / border-warning / icon-warning (light) | #FA8E41 vs #DE5637 |
| text-warning / border-warning / icon-warning (dark) | #FA8E41 vs #F58D71 |
| icon-inverse-secondary (dark) | #FFFFFF 100% vs #000000 63% |

See Appendix F â€” Unresolved Token Conflicts for full detail.

---

### What's Coming in v2.1
- Header, Page title, Data table, Pagination components (currently in progress in Figma)
- Layer set / Set 01 / Set 02 surface tokens (currently a v2.1 BLOCKER for input components)
- Exocad brand color modes (scoped separately)
- Skeleton state tokens

---

### How to Use v2.0

**For AI coding tools (Claude Code, Cursor, Replit, Stitch):**
1. Place `ALIGN-DESIGN-SYSTEM-v2.0.md` in your project root
2. Add to your `CLAUDE.md` or equivalent:
   `"Reference ALIGN-DESIGN-SYSTEM-v2.0.md for all color, typography, component, icon, and logo decisions"`
3. For logos, use the inline SVG markup in the Logos section â€” do not use external URLs

**For designers referencing the doc:**
- Token names in this doc follow v2.0 convention (e.g. `background-subtle-00`)
- Figma uses different names in some cases â€” see the Figma Name column in token tables for cross-reference
- Always check Appendix F â€” Unresolved Token Conflicts before using warning or `icon-inverse-secondary` tokens in dark mode

---

## Typography

Source: Figma node 96:2. All values confirmed from extraction session.

### Headings â€” Roboto 500 Medium

| Token | Size | Rem | Line Height |
|-------|------|-----|-------------|
| $tp-heading-01 | 14px | 0.875rem | 20px / 1.25rem |
| $tp-heading-02 | 17px | 1.063rem | 24px / 1.5rem |
| $tp-heading-03 | 20px | 1.25rem | 28px / 1.75rem |
| $tp-heading-04 | 24px | 1.5rem | 32px / 2rem |
| $tp-heading-05 | 28px | 1.75rem | 36px / 2.25rem |

### Body â€” Roboto 400 Regular

| Token | Size | Rem | Line Height |
|-------|------|-----|-------------|
| $tp-body-01 | 14px | 0.875rem | 20px / 1.25rem |
| $tp-body-02 | 17px | 1.063rem | 24px / 1.5rem |

### Label â€” Roboto 400 Regular

| Token | Size | Rem | Line Height |
|-------|------|-----|-------------|
| $tp-label-01 | 12px | 0.75rem | 16px / 1rem |

### Link â€” Roboto 400 Regular, text-decoration: underline

| Token | Size | Rem | Line Height |
|-------|------|-----|-------------|
| $tp-link-01 | 12px | 0.75rem | 16px / 1rem |
| $tp-link-02 | 14px | 0.875rem | 20px / 1.25rem |
| $tp-link-03 | 17px | 1.063rem | 24px / 1.5rem |

### Code â€” Roboto Mono 400 Regular

| Token | Size | Rem | Line Height |
|-------|------|-----|-------------|
| $tp-code-01 | 12px | 0.75rem | 16px / 1rem |
| $tp-code-02 | 14px | 0.875rem | 20px / 1.25rem |

### Display Regular â€” Roboto (400 Regular for -01, 300 Light for -02 to -05)

| Token | Size | Rem | Line Height | Weight |
|-------|------|-----|-------------|--------|
| $tp-display-regular-01 | 36px | 2.25rem | 44px / 2.75rem | 400 Regular |
| $tp-display-regular-02 | 44px | 2.75rem | 52px / 3.25rem | 300 Light |
| $tp-display-regular-03 | 52px | 3.25rem | 60px / 3.75rem | 300 Light |
| $tp-display-regular-04 | 72px | 4.5rem | 96px / 6rem | 300 Light |
| $tp-display-regular-05 | 96px | 6rem | 116px / 7.25rem | 300 Light |

### Display Medium â€” Roboto 500 Medium

| Token | Size | Rem | Line Height |
|-------|------|-----|-------------|
| $tp-display-medium-01 | 36px | 2.25rem | 44px / 2.75rem |
| $tp-display-medium-02 | 44px | 2.75rem | 52px / 3.25rem |
| $tp-display-medium-03 | 52px | 3.25rem | 60px / 3.75rem |
| $tp-display-medium-04 | 72px | 4.5rem | 96px / 6rem |
| $tp-display-medium-05 | 96px | 6rem | 116px / 7.25rem |

**Total tokens:** 21 (5 Heading + 2 Body + 1 Label + 3 Link + 2 Code + 5 Display Regular + 5 Display Medium)

---

## Colors â€” Light Mode (Align brand)

Token format: Full path from Figma variable name. Opacity derived from hex alpha byte.

### Background (27 tokens)

| Token | Hex | Opacity | Figma Name |
|-------|-----|---------|------------|
| background-subtle-00 | #F4F4F4 | 100% | $background-page |
| background-subtle-01 | #FFFFFF | 100% | $background-layer-01 |
| background-subtle-02 | #F4F4F4 | 100% | $background-layer-02 |
| background-accent | #DFDFDF | 100% |  |
| background-menu | #FFFFFF | 100% | $background-elevated |
| background-overlay | #000000 | 63% |  |
| background-on-color | #FFFFFF | 100% |  |
| background-inverse | #262626 | 100% |  |
| background-interactive | #009ACE | 100% | $background-brand |
| background-destructive | #D43F58 | 100% |  |
| background-highlight-red | #FFF0F3 | 100% |  |
| background-highlight-magenta | #FFF0F9 | 100% |  |
| background-highlight-purple | #F8F2FF | 100% |  |
| background-highlight-blue | #E6F7FF | 100% |  |
| background-highlight-green | #DCFCE8 | 100% |  |
| background-highlight-orange | #FFF2ED | 100% |  |
| background-subtle-hover | #000000 | 4% | $background-layer-hovered |
| background-accent-hover | #000000 | 17.5% | $background-accent-hovered |
| background-interactive-hover | #008EC2 | 100% | $background-brand-hovered |
| background-destructive-hover | #C42D49 | 100% | $background-destructive-hovered |
| background-subtle-active | #000000 | 9% | $layer-pressed |
| background-accent-active | #000000 | 22.75% | $background-accent-pressed |
| background-interactive-active | #0080B2 | 100% | $background-brand-pressed |
| background-destructive-active | #B51F3F | 100% | $background-destructive-pressed |
| background-interactive-disabled | #000000 | 4% | $background-brand-disabled |
| background-destructive-disabled | #000000 | 4% |  |
| background-on-color-disabled | #000000 | 4% | $backgroun-on-color-disabled âš ï¸ typo in Figma |

**Note on alpha tokens:** `#0000000B` = black at ~4%, `#00000016` = black at ~9%, `#000000A1` = black at ~63%.

### Border (20 tokens)

| Token | Hex | Opacity | Figma Name |
|-------|-----|---------|------------|
| border-subtle | #000000 | 9% |  |
| border-accent | #000000 | 23% |  |
| border-on-color-subtle | #FFFFFF | 9% |  |
| border-inverse-subtle | #FFFFFF | 9% |  |
| border-interactive | #009ACE | 100% |  |
| border-error | #D43F58 | 100% |  |
| border-warning | #FA8E41 | 100% |  |
> âš ï¸ UNRESOLVED: warning color conflict. Figma shows #DE5637, v2.0 shows #FA8E41. Requires design team confirmation before update. Do not use until resolved.
| border-success | #00964E | 100% |  |
| border-highlight-red | #FFD4DC | 100% |  |
| border-highlight-magenta | #FFE3F4 | 100% |  |
| border-highlight-purple | #F3E6FF | 100% |  |
| border-highlight-blue | #D1F1FF | 100% |  |
| border-highlight-green | #C6F5D6 | 100% |  |
| border-highlight-orange | #FFE5D6 | 100% |  |
| border-subtle-hover | #000000 | 13% | $border-subtle-hovered |
| border-accent-hover | #000000 | 34% | $border-accent-hovered |
| border-accent-active | #000000 | 49% | $border-accent-pressed |
| border-focus | #009ACE | 100% |  |
| border-on-color-focus | #FFFFFF | 100% |  |
| border-disabled | #000000 | 9% |  |

**Note on alpha tokens (light mode, full 8-digit hex):** `#00000016` (9%), `#0000003A` (border-accent, 23%), `#00000020` (border-subtle-hover, 13%), `#00000057` (border-accent-hover, 34%), `#0000007E` (border-accent-active, 49%).

### Text (20 tokens)

| Token | Hex | Opacity | Figma Name |
|-------|-----|---------|------------|
| text-primary | #000000 | 93% |  |
| text-secondary | #000000 | 63% |  |
| text-tertiary | #000000 | 44% |  |
| text-on-color-primary | #FFFFFF | 100% |  |
| text-on-color-secondary | #FFFFFF | 63% | $text-on-color--secondary |
| text-on-color-tertiary | #FFFFFF | 47% | $text-on-color--tertiary |
| text-inverse-primary | #FFFFFF | 100% |  |
| text-inverse-secondary | #FFFFFF | 63% |  |
| text-inverse-tertiary | #FFFFFF | 47% |  |
| text-link | #009ACE | 100% |  |
| text-error | #D43F58 | 100% |  |
| text-warning | #FA8E41 | 100% |  |
> âš ï¸ UNRESOLVED: warning color conflict. Figma shows #DE5637, v2.0 shows #FA8E41. Requires design team confirmation before update. Do not use until resolved.
| text-success | #00964E | 100% |  |
| text-on-highlight-red | #A31035 | 100% |  |
| text-on-highlight-magenta | #A30564 | 100% |  |
| text-on-highlight-purple | #6C37A1 | 100% |  |
| text-on-highlight-blue | #005780 | 100% |  |
| text-on-highlight-green | #006131 | 100% |  |
| text-on-highlight-orange | #9E2813 | 100% |  |
| text-disabled | #000000 | 22% |  |

**Note on alpha tokens:** `#000000ED` = black at ~93%, `#000000A1` = black at ~63%, `#00000071` = black at ~44%, `#00000039` = black at ~22%. Full alpha-channel hex values are the source of truth.

### Icon (20 tokens)

| Token | Hex | Opacity | Figma Name |
|-------|-----|---------|------------|
| icon-primary | #000000 | 93% |  |
| icon-secondary | #000000 | 63% |  |
| icon-tertiary | #000000 | 44% |  |
| icon-on-color-primary | #FFFFFF | 100% |  |
| icon-on-color-secondary | #FFFFFF | 63% |  |
| icon-on-color-tertiary | #FFFFFF | 47% |  |
| icon-inverse-primary | #FFFFFF | 100% |  |
| icon-inverse-secondary | #FFFFFF | 63% |  |
| icon-inverse-tertiary | #FFFFFF | 47% |  |
| icon-link | #009ACE | 100% |  |
| icon-error | #D43F58 | 100% |  |
| icon-warning | #FA8E41 | 100% |  |
> âš ï¸ UNRESOLVED: warning color conflict. Figma shows #DE5637, v2.0 shows #FA8E41. Requires design team confirmation before update. Do not use until resolved.
| icon-success | #00964E | 100% |  |
| icon-on-highlight-red | #A31035 | 100% |  |
| icon-on-highlight-magenta | #A30564 | 100% |  |
| icon-on-highlight-purple | #6C37A1 | 100% |  |
| icon-on-highlight-blue | #005780 | 100% |  |
| icon-on-highlight-green | #006131 | 100% |  |
| icon-on-highlight-orange | #9E2813 | 100% |  |
| icon-disabled | #000000 | 22% |  |

### Gradient

Gradient token identified in color modes file (v2.0 addition â€” see Extended Tokens section below).

### Semantic Quick Reference

| Role | Token | Light Hex |
|------|-------|-----------|
| Page background | background-subtle-00 | #F4F4F4 |
| Card / surface | background-subtle-01 | #FFFFFF |
| Raised surface | background-subtle-02 | #F4F4F4 |
| Brand primary | background-interactive | #009ACE |
| Destructive | background-destructive | #D43F58 |
| Primary text | text-primary | #000000ED |
| Secondary text | text-secondary | #000000A1 |
| Muted text | text-tertiary | #00000071 |
| Link | text-link | #009ACE |
| Error | text-error | #D43F58 |
| Success | text-success | #00964E |
| Warning | text-warning | #FA8E41 |

---

### Extended Tokens â€” Added v2.0

**Added:** 2026-04-01
**Note:** These tokens are net-new and may not yet be implemented in all codebases. Verify implementation status before use in production.

#### Background (Extended)

| Token | Hex | Opacity | Figma Name |
|-------|-----|---------|------------|
| background-success | #00964E | 100% | $background-success |
| background-highlight-gray | #000000 | 4.25% | $background-highlight-gray |
| background-inverse-hovered | #303030 | 100% | $background-inverse-hovered |
| background-layer-selected | #000000 | 4.25% | $background-layer-selected âš ï¸ typo `$background=layer-selected` in Figma |
| background-layer-selected-hovered | #000000 | 8.5% | $background-layer-selected-hovered |
| background-layer-selected-pressed | #000000 | 12.5% | $background-layer-selected-pressed |
| background-success-hovered | #008744 | 100% | $background-success-hovered |
| background-success-pressed | #007A3D | 100% | $background-success-pressed |
| background-success-disabled | #000000 | 4.25% | $background-success-disabled |

#### Border (Extended)

| Token | Hex | Opacity | Figma Name |
|-------|-----|---------|------------|
| border-strong | #121212 | 100% | $border-strong |
| border-on-color-accent | #FFFFFF | 22.5% | $border-on-color-accent |
| border-on-color-strong | #FFFFFF | 100% | $border-on-color-strong |
| border-inverse-accent | #FFFFFF | 22.5% | $border-inverse-accent |
| border-inverse-strong | #FFFFFF | 100% | $border-inverse-strong |
| border-highlight-gray | #000000 | 4.25% | $border-highlight-gray |
| border-inverse-subtle-hovered | #FFFFFF | 12.5% | $border-inverse-subtle-hovered |
| border-inverse-accent-hovered | #FFFFFF | 32% | $border-inverse-accent-hovered |
| border-interactive-hovered | #008EC2 | 100% | $border-interactive-hovered |
| border-inverse-subtle-pressed | #FFFFFF | 17.25% | $border-inverse-subtle-pressed |
| border-inverse-accent-pressed | #FFFFFF | 52.5% | $border-inverse-accent-pressed |
| border-inverse-focus | #41C1F0 | 100% | $border-inverse-focus |
| border-on-color-disabled | #FFFFFF | 8.5% | $border-on-color-disabled |
| border-inverse-disabled | #FFFFFF | 8.5% | $border-inverse-disabled |
| border-subtle-pressed | #000000 | 17.5% | $border-subtle-pressed |

#### Text & Icon (Extended)

| Token | Hex | Opacity | Figma Name |
|-------|-----|---------|------------|
| text-link-hovered | #008EC2 | 100% | $text-link-hovered |
| text-on-color-disabled | #FFFFFF | 22.5% | $text-on-color-disabled |
| text-inverse-disabled | #FFFFFF | 22.5% | $text-inverse-disabled |
| icon-link-hovered | #008EC2 | 100% | $icon-link-hovered |
| icon-on-color-disabled | #000000 | 22.75% | $icon-on-color-disabled |
| icon-inverse-disabled | #000000 | 22.75% | $icon-inverse-disabled |

#### Gradient

| Token | Hex | Opacity | Figma Name |
|-------|-----|---------|------------|
| gradient-blue | #009ACE | 100% | $gradient-blue |

---

## Colors â€” Dark Mode (Align brand)

### Key Differences (Light to Dark)

| Role | Light | Dark |
|------|-------|------|
| Page background | #F4F4F4 | #121212 |
| Card surface | #FFFFFF | #1B1B1B |
| Raised surface | #F4F4F4 | #262626 |
| Primary text | #000000ED | #FFFFFF |
| Secondary text | #000000A1 | #FFFFFFA1 |
| Brand primary (interactive) | #009ACE | #009ACE (unchanged) |
| Brand interactive border/link | #009ACE | #41C1F0 |
| Destructive | #D43F58 | #D43F58 (unchanged) |
| Error border/text | #D43F58 | #FC8397 |
| Success | #00964E | #4DBD78 |
| Warning | #FA8E41 | #FA8E41 (unchanged) |

### Full Dark Mode Token Table

#### Background (27 tokens)

| Token | Dark Hex | Figma Name |
|-------|----------|------------|
| background-subtle-00 | #121212 | $background-page |
| background-subtle-01 | #1B1B1B | $background-layer-01 |
| background-subtle-02 | #262626 | $background-layer-02 |
| background-accent | #474747 |  |
| background-menu | #262626 | $background-elevated |
| background-overlay | #000000A1 |  |
| background-on-color | #FFFFFF |  |
| background-inverse | #FFFFFF |  |
| background-interactive | #009ACE | $background-brand |
| background-destructive | #D43F58 |  |
| background-highlight-red | #380912 |  |
| background-highlight-magenta | #330D23 |  |
| background-highlight-purple | #261238 |  |
| background-highlight-blue | #021E2E |  |
| background-highlight-green | #002111 |  |
| background-highlight-orange | #360F02 |  |
| background-subtle-hover | #FFFFFF0B | $background-layer-hovered |
| background-accent-hover | #FFFFFF2C | $background-accent-hovered |
| background-interactive-hover | #008EC2 | $background-brand-hovered |
| background-destructive-hover | #C42D49 | $background-destructive-hovered |
| background-subtle-active | #FFFFFF16 | $layer-pressed |
| background-accent-active | #FFFFFF39 | $background-accent-pressed |
| background-interactive-active | #0080B2 | $background-brand-pressed |
| background-destructive-active | #B51F3F | $background-destructive-pressed |
| background-interactive-disabled | #FFFFFF0B | $background-brand-disabled |
| background-destructive-disabled | #FFFFFF0F |  |
| background-on-color-disabled | #FFFFFF0B | $backgroun-on-color-disabled âš ï¸ typo in Figma |

#### Border (20 tokens)

| Token | Dark Hex | Figma Name |
|-------|----------|------------|
| border-subtle | #FFFFFF16 |  |
| border-accent | #FFFFFF3B |  |
| border-on-color-subtle | #FFFFFF16 |  |
| border-inverse-subtle | #00000016 |  |
| border-interactive | #41C1F0 |  |
| border-error | #FC8397 |  |
| border-warning | #FA8E41 |  |
> âš ï¸ UNRESOLVED: warning color conflict. Figma shows #F58D71, v2.0 shows #FA8E41. Requires design team confirmation before update. Do not use until resolved.
| border-success | #4DBD78 |  |
| border-highlight-red | #630920 |  |
| border-highlight-magenta | #5E0B3C |  |
| border-highlight-purple | #431B69 |  |
| border-highlight-blue | #00334D |  |
| border-highlight-green | #00381C |  |
| border-highlight-orange | #5E1509 |  |
| border-subtle-hover | #FFFFFF20 | $border-subtle-hovered |
| border-accent-hover | #FFFFFF52 | $border-accent-hovered |
| border-accent-active | #FFFFFF86 | $border-accent-pressed |
| border-focus | #41C1F0 |  |
| border-on-color-focus | #FFFFFF |  |
| border-disabled | #FFFFFF16 |  |

#### Text (20 tokens)

| Token | Dark Hex | Figma Name |
|-------|----------|------------|
| text-primary | #FFFFFF |  |
| text-secondary | #FFFFFFA1 |  |
| text-tertiary | #FFFFFF78 |  |
| text-on-color-primary | #FFFFFF |  |
| text-on-color-secondary | #FFFFFFA1 | $text-on-color--secondary |
| text-on-color-tertiary | #FFFFFF78 | $text-on-color--tertiary |
| text-inverse-primary | #121212 |  |
| text-inverse-secondary | #000000A1 |  |
| text-inverse-tertiary | #00000071 |  |
| text-link | #41C1F0 |  |
| text-error | #FC8397 |  |
| text-warning | #FA8E41 |  |
> âš ï¸ UNRESOLVED: warning color conflict. Figma shows #F58D71, v2.0 shows #FA8E41. Requires design team confirmation before update. Do not use until resolved.
| text-success | #4DBD78 |  |
| text-on-highlight-red | #FFC2CE |  |
| text-on-highlight-magenta | #FCC2E5 |  |
| text-on-highlight-purple | #E2CAFA |  |
| text-on-highlight-blue | #8ADAFF |  |
| text-on-highlight-green | #9AE3B5 |  |
| text-on-highlight-orange | #FCC6B1 |  |
| text-disabled | #FFFFFF39 |  |

#### Icon (20 tokens)

| Token | Dark Hex | Figma Name |
|-------|----------|------------|
| icon-primary | #FFFFFF |  |
| icon-secondary | #FFFFFFA1 |  |
| icon-tertiary | #FFFFFF78 |  |
| icon-on-color-primary | #FFFFFF |  |
| icon-on-color-secondary | #FFFFFFA1 |  |
| icon-on-color-tertiary | #FFFFFF78 |  |
| icon-inverse-primary | #121212 |  |
| icon-inverse-secondary | #FFFFFF |  |
> âš ï¸ UNRESOLVED: icon-inverse-secondary dark mode value conflict. Figma shows #000000 at 63%, v2.0 shows #FFFFFF at 100%. Opposite values â€” requires immediate design team confirmation. Blocking for any component using inverse surfaces in dark mode.
| icon-inverse-tertiary | #00000071 |  |
| icon-link | #41C1F0 |  |
| icon-error | #FC8397 |  |
| icon-warning | #FA8E41 |  |
> âš ï¸ UNRESOLVED: warning color conflict. Figma shows #F58D71, v2.0 shows #FA8E41. Requires design team confirmation before update. Do not use until resolved.
| icon-success | #4DBD78 |  |
| icon-on-highlight-red | #FFC2CE |  |
| icon-on-highlight-magenta | #FCC2E5 |  |
| icon-on-highlight-purple | #E2CAFA |  |
| icon-on-highlight-blue | #8ADAFF |  |
| icon-on-highlight-green | #9AE3B5 |  |
| icon-on-highlight-orange | #FCC6B1 |  |
| icon-disabled | #FFFFFF39 |  |

---

### Extended Tokens â€” Added v2.0

**Added:** 2026-04-01
**Note:** These tokens are net-new and may not yet be implemented in all codebases. Verify implementation status before use in production.

#### Background (Extended)

| Token | Dark Hex | Figma Name |
|-------|----------|------------|
| background-success | #4DBD78 | $background-success |
| background-highlight-gray | #FFFFFF0A | $background-highlight-gray |
| background-inverse-hovered | #F4F4F4 | $background-inverse-hovered |
| background-layer-selected | #FFFFFF0A | $background-layer-selected âš ï¸ typo `$background=layer-selected` in Figma |
| background-layer-selected-hovered | #FFFFFF16 | $background-layer-selected-hovered |
| background-layer-selected-pressed | #FFFFFF1F | $background-layer-selected-pressed |
| background-success-hovered | #008744 | $background-success-hovered |
| background-success-pressed | #007A3D | $background-success-pressed |
| background-success-disabled | #FFFFFF0B | $background-success-disabled |

#### Border (Extended)

| Token | Dark Hex | Figma Name |
|-------|----------|------------|
| border-strong | #FFFFFF | $border-strong |
| border-on-color-accent | #FFFFFF3A | $border-on-color-accent |
| border-on-color-strong | #FFFFFF | $border-on-color-strong |
| border-inverse-accent | #0000003A | $border-inverse-accent |
| border-inverse-strong | #121212 | $border-inverse-strong |
| border-highlight-gray | #FFFFFF0A | $border-highlight-gray |
| border-inverse-subtle-hovered | #00000020 | $border-inverse-subtle-hovered |
| border-inverse-accent-hovered | #00000052 | $border-inverse-accent-hovered |
| border-interactive-hovered | #5FCEFA | $border-interactive-hovered |
| border-inverse-subtle-pressed | #0000002C | $border-inverse-subtle-pressed |
| border-inverse-accent-pressed | #00000086 | $border-inverse-accent-pressed |
| border-inverse-focus | #B687E8 | $border-inverse-focus |
| border-on-color-disabled | #FFFFFF16 | $border-on-color-disabled |
| border-inverse-disabled | #FFFFFF16 | $border-inverse-disabled |
| border-subtle-pressed | #FFFFFF2C | $border-subtle-pressed |

#### Text & Icon (Extended)

| Token | Dark Hex | Figma Name |
|-------|----------|------------|
| text-link-hovered | #5FCEFA | $text-link-hovered |
| text-on-color-disabled | #FFFFFF3A | $text-on-color-disabled |
| text-inverse-disabled | #FFFFFF3A | $text-inverse-disabled |
| icon-link-hovered | #5FCEFA | $icon-link-hovered |
| icon-on-color-disabled | #0000003A | $icon-on-color-disabled |
| icon-inverse-disabled | #0000003A | $icon-inverse-disabled |

#### Gradient

| Token | Dark Hex | Figma Name |
|-------|----------|------------|
| gradient-blue | #009ACE | $gradient-blue |

---

## Tailwind Mapping â€” First Pass Retheme

### Color Mapping (Light Mode)

| First Pass Current | Align Token | Hex |
|---|---|---|
| teal | $background-interactive | #009ACE |
| teal hover | $background-interactive-hover | #008EC2 |
| teal active | $background-interactive-active | #0080B2 |
| navy-900 (text) | $text-primary | #000000 @ 93% |
| navy-900/60 (muted) | $text-secondary | #000000 @ 63% |
| navy-900/40 (subtle) | $text-tertiary | #000000 @ 44.5% |
| gray-50 (bg) | $background-subtle-00 | #F4F4F4 |
| white (bg) | $background-subtle-01 | #FFFFFF |
| red (error) | $text-error | #D43F58 |
| green (success) | $text-success | #00964E |
| amber (warning) | $text-warning | #FA8E41 |

**Full token-to-Tailwind class mapping:**

| Purpose | Current Tailwind Class | Align Token | Hex (light) |
|---------|----------------------|-------------|-------------|
| Page background | bg-gray-100 / bg-white | background-subtle-00 | #F4F4F4 |
| Card / panel | bg-white | background-subtle-01 | #FFFFFF |
| Brand primary button bg | bg-blue-600 | background-interactive | #009ACE |
| Brand primary button hover | bg-blue-700 | background-interactive-hover | #008EC2 |
| Destructive button bg | bg-red-600 | background-destructive | #D43F58 |
| Primary text | text-gray-900 | text-primary | #000000ED |
| Secondary text | text-gray-600 | text-secondary | #000000A1 |
| Muted / placeholder text | text-gray-400 | text-tertiary | #00000071 |
| Link | text-blue-600 | text-link | #009ACE |
| Error text | text-red-600 | text-error | #D43F58 |
| Success text | text-green-600 | text-success | #00964E |
| Warning text | text-orange-500 | text-warning | #FA8E41 |
| Default border | border-gray-200 | border-subtle | #00000016 |
| Emphasized border | border-gray-400 | border-accent | #0000003A |
| Focus ring | ring-blue-500 | border-focus | #009ACE |
| Error border | border-red-500 | border-error | #D43F58 |

### Typography Mapping

- Replace current font-sans with Roboto (add via Next.js Google Fonts config)
- Add Roboto Mono for code blocks
- Map heading sizes to $tp-heading-01 through $tp-heading-05
- Map body text to $tp-body-01 (14px) as default

| Align Token | Size | Weight | Tailwind Equivalent |
|-------------|------|--------|---------------------|
| $tp-heading-05 | 28px | 500 | text-[28px] font-medium |
| $tp-heading-04 | 24px | 500 | text-2xl font-medium |
| $tp-heading-03 | 20px | 500 | text-xl font-medium |
| $tp-heading-02 | 17px | 500 | text-[17px] font-medium |
| $tp-heading-01 | 14px | 500 | text-sm font-medium |
| $tp-body-02 | 17px | 400 | text-[17px] font-normal |
| $tp-body-01 | 14px | 400 | text-sm font-normal |
| $tp-label-01 | 12px | 400 | text-xs font-normal |
| $tp-link-03 | 17px | 400 | text-[17px] font-normal underline |
| $tp-link-02 | 14px | 400 | text-sm font-normal underline |
| $tp-link-01 | 12px | 400 | text-xs font-normal underline |
| $tp-code-02 | 14px | 400 | text-sm font-mono |
| $tp-code-01 | 12px | 400 | text-xs font-mono |

**Implementation note:** The opacity percentages in the Light Mode tables are informational approximations. When writing actual CSS/Tailwind tokens use the full 8-digit hex values from Figma as the source of truth (e.g. `#000000ED` not `rgba(0,0,0,0.93)`). This project uses Tailwind v4 `@theme` inline CSS custom properties â€” no tailwind.config.ts.

---

## Logos

SVG logo files for all Align brands. Copy the inline SVG directly into your component. All logos require the CSS fill override below to be visible on light backgrounds.

### Required CSS for All Logos

All logo SVGs were exported from Figma against dark backgrounds. Letterforms use `fill="white"` and are invisible on light surfaces without this override.

Add these rules to every project that uses these logos:

```css
/* Light mode â€” make letterforms visible */
.logo path[fill="white"],
.logo path[fill="#FFFFFF"] {
  fill: var(--text-primary);
}

/* Dark mode â€” restore white letterforms */
.mode-dark .logo path[fill="white"],
.mode-dark .logo path[fill="#FFFFFF"] {
  fill: #FFFFFF;
}

/* Preserve brand accent fills in all modes â€”
   applies to the Align dot and X-ray Insight mark */
.logo path[fill="#41C1F0"] {
  fill: #41C1F0;
}
```

Applies to all 8 files: `align.svg`, `align-x-ray-insight.svg`, `all-logos.svg`, `invisalign.svg`, `invisalign-first.svg`, `vivera-retainers.svg`, `itero-exocad.svg`, `itero.svg`

#### Align

```svg
<svg width="67" height="28" viewBox="0 0 67 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27.1216 3.53271e-06C26.7096 3.53271e-06 26.3068 0.122171 25.9643 0.351058C25.6217 0.579944 25.3547 0.90527 25.1971 1.28589C25.0394 1.66652 24.9982 2.08535 25.0785 2.48942C25.1589 2.89348 25.3573 3.26465 25.6486 3.55596C25.9399 3.84728 26.3111 4.04567 26.7152 4.12604C27.1192 4.20642 27.5381 4.16517 27.9187 4.00751C28.2993 3.84985 28.6246 3.58286 28.8535 3.24031C29.0824 2.89775 29.2046 2.49502 29.2046 2.08304C29.2051 1.80935 29.1516 1.53825 29.047 1.2853C28.9425 1.03234 28.7891 0.802513 28.5956 0.608985C28.4021 0.415457 28.1722 0.262041 27.9193 0.157537C27.6663 0.0530339 27.3952 -0.000500965 27.1216 3.53271e-06Z" fill="#41C1F0"/>
<path d="M49.6865 6.86176H52.8838L52.9335 8.19046C53.3776 7.6462 53.9379 7.20825 54.5734 6.90876C55.2088 6.60928 55.9032 6.45584 56.6056 6.45971C60.1169 6.45971 62.0315 8.63081 62.0315 12.4101V21.2171H58.7155V12.5212C58.7155 10.5722 57.5246 9.4579 55.8551 9.4579C54.1856 9.4579 53.0025 10.5722 53.0025 12.5212V21.2286H49.6865V6.86176ZM21.6919 21.2286H18.3797V0.344629H21.6995L21.6919 21.2286ZM28.7872 21.2286H25.4635V6.86176H28.7872V21.2286ZM11.3227 6.86176H14.6042V21.2286H11.3227L11.2691 19.7199C10.0915 20.9127 8.4954 21.5995 6.81963 21.6344C2.90246 21.6306 0 18.4793 0 14.0452C0 9.35068 3.14369 6.45971 6.81963 6.45971C7.65597 6.4355 8.48749 6.5943 9.25604 6.925C10.0246 7.2557 10.7116 7.75032 11.2691 8.37426L11.3227 6.86176ZM3.39259 14.0452C3.39259 16.7983 5.08122 18.6401 7.43229 18.6401C9.57276 18.6363 11.4873 17.0855 11.4873 14.0452C11.4873 11.0891 9.65317 9.45024 7.44378 9.45024C4.99698 9.45024 3.40407 11.3993 3.40407 14.0452H3.39259ZM42.7941 14.0452C42.7941 11.047 40.9063 9.45024 38.7582 9.45024C36.1927 9.45024 34.7108 11.5371 34.7108 14.0452C34.7108 16.6872 36.3076 18.6401 38.7582 18.6401C41.0135 18.6401 42.7941 16.9629 42.7941 14.0452ZM45.9224 19.7888C45.9224 25.9537 42.3154 27.9984 38.069 27.9984C36.2892 28.0283 34.5279 27.6345 32.9303 26.8497L33.7536 23.997C35.063 24.7322 36.5404 25.1161 38.0421 25.1113C40.5119 25.1113 42.6103 23.526 42.6103 20.6772V19.6816C42.0432 20.3048 41.3484 20.7983 40.5733 21.1287C39.7982 21.4591 38.961 21.6186 38.1187 21.5962C34.2513 21.5962 31.3259 18.4869 31.3259 14.0107C31.3259 9.7221 34.079 6.42525 38.134 6.42525C38.972 6.39727 39.8058 6.55433 40.5762 6.88524C41.3466 7.21615 42.0345 7.71278 42.5911 8.3398L42.6332 6.8273H45.9224V19.7888Z" fill="white"/>
<path d="M62.491 6.85791H64.3481V7.24083H63.632V9.15538H63.2032V7.24083H62.491V6.85791Z" fill="white"/>
<path d="M64.6506 6.85791H65.2135L65.5964 7.94921C65.6844 8.21342 65.7955 8.71503 65.7955 8.71503C65.7955 8.71503 65.9027 8.21725 65.9908 7.94921L66.3737 6.85791H66.948V9.15538H66.5651V7.95304C66.5651 7.70415 66.5919 7.24083 66.5919 7.24083C66.5919 7.24083 66.5 7.66203 66.4235 7.88794L65.9908 9.14772H65.6461L65.2096 7.88794C65.1369 7.66203 65.0412 7.24083 65.0412 7.24083C65.0412 7.24083 65.0718 7.70415 65.0718 7.95304V9.14772H64.6889L64.6506 6.85791Z" fill="white"/>
</svg>
```

Natural size: 67 Ã— 28 | viewBox: 0 0 67 28
#### Invisalign

```svg
<svg width="118" height="28" viewBox="0 0 118 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M103.858 9.16311H106.011L106.045 10.0595C106.344 9.69255 106.721 9.39724 107.149 9.19531C107.576 8.99339 108.044 8.88999 108.517 8.89272C110.881 8.89272 112.172 10.3542 112.172 12.9012V18.8387H109.938V12.9744C109.938 11.6633 109.137 10.9112 108.013 10.9112C106.897 10.9112 106.092 11.6633 106.092 12.9744V18.8387H103.858V9.16311ZM85.0049 18.8387H82.769V4.77453H85.0049V18.8387ZM89.7817 18.8387H87.5457V9.16311H89.7817V18.8387ZM88.6617 4.54276C88.3846 4.54297 88.1137 4.62532 87.8834 4.7794C87.6531 4.93348 87.4736 5.15239 87.3677 5.40845C87.2617 5.66451 87.234 5.94623 87.2881 6.21801C87.3423 6.48979 87.4757 6.73942 87.6717 6.93537C87.8676 7.13132 88.1173 7.26478 88.389 7.3189C88.6608 7.37301 88.9426 7.34534 89.1986 7.23939C89.4547 7.13344 89.6736 6.95396 89.8277 6.72363C89.9817 6.49331 90.0641 6.22247 90.0643 5.94536C90.0647 5.76105 90.0287 5.57846 89.9584 5.40809C89.8881 5.23772 89.7848 5.08293 89.6545 4.9526C89.5241 4.82227 89.3693 4.71897 89.199 4.64864C89.0286 4.5783 88.846 4.54232 88.6617 4.54276ZM78.0206 9.16311H80.2321V18.8387H78.0206L77.986 17.8244C77.1917 18.6265 76.1164 19.0879 74.9878 19.1111C72.3514 19.1111 70.3959 16.9889 70.3959 14.0008C70.3959 10.84 72.512 8.89271 74.9878 8.89271C75.5511 8.87706 76.1111 8.98424 76.6289 9.20678C77.1466 9.42933 77.6097 9.76192 77.986 10.1814L78.0206 9.16311ZM72.6807 14.0009C72.6807 15.8567 73.819 17.0947 75.4004 17.0947C76.8355 17.0947 78.1243 16.0499 78.1243 14.0009C78.1243 12.0109 76.8884 10.9072 75.4004 10.9072C73.754 10.9072 72.6807 12.2203 72.6807 14.0009ZM99.2093 14.0009C99.2093 11.9825 97.9368 10.9072 96.4916 10.9072C94.7617 10.9072 93.7658 12.3137 93.7658 14.0009C93.7658 15.7816 94.839 17.0947 96.4896 17.0947C98.008 17.0947 99.2093 15.9644 99.2093 14.0009ZM101.315 17.8812C101.315 22.032 98.8861 23.4102 96.0262 23.4102C94.8279 23.4325 93.6414 23.1699 92.5645 22.6439L93.1194 20.721C94.0009 21.2174 94.9962 21.4765 96.0078 21.473C97.6726 21.473 99.0833 20.4059 99.0833 18.485V17.8162C98.7023 18.2367 98.235 18.5701 97.7134 18.7936C97.1917 19.0171 96.628 19.1254 96.0607 19.1111C93.4548 19.1111 91.4851 17.0154 91.4851 14.0008C91.4851 11.1124 93.3389 8.89271 96.0688 8.89271C96.6332 8.87369 97.1949 8.97932 97.7138 9.20207C98.2327 9.42481 98.6962 9.75921 99.0711 10.1814L99.0996 9.16309H101.315V17.8812Z" fill="white"/>
<path d="M50.122 9.16311L52.6262 14.9827L55.1182 9.1631H57.5981L52.6038 19.5033L47.6522 9.1631L50.122 9.16311ZM62.6392 16.6149C63.4007 17.0576 64.2592 17.3067 65.1394 17.3406C66.2249 17.3406 66.7452 16.8751 66.7452 16.2328C66.7452 15.5681 66.3448 15.2063 65.1353 14.7652C63.2226 14.1188 62.4644 13.1187 62.4644 11.952C62.4644 10.2222 63.8263 8.89273 66.105 8.89273C67.011 8.8732 67.9084 9.07263 68.721 9.47408L68.223 11.206C67.588 10.8487 66.874 10.6552 66.1456 10.6429C65.2573 10.6429 64.7328 11.084 64.7328 11.6897C64.7328 12.3137 65.1984 12.637 66.4485 13.0983C68.2393 13.7224 69.0178 14.6148 69.0381 16.064C69.0381 17.8528 67.7148 19.1111 65.1171 19.1111C64.0814 19.1302 63.0568 18.895 62.1331 18.4261L62.6392 16.6149ZM36.3403 18.8387H34.1043V9.16311H36.3403V18.8387ZM35.2244 4.54276C34.9471 4.54214 34.6758 4.62379 34.445 4.77737C34.2141 4.93096 34.0339 5.14958 33.9274 5.40556C33.8208 5.66155 33.7925 5.9434 33.8461 6.21545C33.8998 6.48751 34.0329 6.73754 34.2287 6.9339C34.4245 7.13027 34.6741 7.26415 34.946 7.3186C35.2179 7.37305 35.4998 7.34562 35.7561 7.23979C36.0124 7.13396 36.2316 6.95448 36.3859 6.72407C36.5401 6.49365 36.6226 6.22265 36.6228 5.94536C36.6231 5.574 36.476 5.2177 36.2138 4.95472C35.9516 4.69173 35.5957 4.54357 35.2244 4.54276ZM60.635 18.8387H58.401V9.16311H60.635V18.8387ZM59.519 4.54276C59.2417 4.54216 58.9705 4.62383 58.7396 4.77743C58.5087 4.93102 58.3286 5.14965 58.2221 5.40563C58.1155 5.66162 58.0872 5.94347 58.1409 6.21552C58.1945 6.48757 58.3277 6.73758 58.5235 6.93394C58.7193 7.13029 58.9689 7.26416 59.2408 7.3186C59.5127 7.37304 59.7946 7.34561 60.0509 7.23978C60.3072 7.13395 60.5263 6.95447 60.6806 6.72406C60.8349 6.49364 60.9173 6.22265 60.9175 5.94536C60.9174 5.57412 60.7701 5.21808 60.508 4.95519C60.2458 4.69231 59.8902 4.544 59.519 4.54276ZM38.875 9.16311H41.0318L41.0683 10.0595C41.366 9.68491 41.7466 9.38456 42.1801 9.18209C42.6136 8.97962 43.0882 8.88057 43.5665 8.89272C45.7292 8.89272 47.1928 10.3542 47.1928 12.9032V18.8387H44.9569V13.0069C44.9569 11.7649 44.1519 10.9112 43.0339 10.9112C41.92 10.9112 41.1151 11.7487 41.1151 13.0069V18.8387H38.875L38.875 9.16311Z" fill="white"/>
<path d="M115.827 8.51365C116.119 8.51389 116.404 8.60066 116.647 8.763C116.889 8.92534 117.078 9.15596 117.19 9.42572C117.302 9.69547 117.331 9.99226 117.274 10.2786C117.217 10.5649 117.076 10.8279 116.87 11.0343C116.663 11.2407 116.4 11.3814 116.114 11.4384C115.828 11.4954 115.531 11.4663 115.261 11.3547C114.991 11.2431 114.761 11.054 114.598 10.8114C114.436 10.5688 114.349 10.2835 114.349 9.99152C114.348 9.7972 114.386 9.60463 114.46 9.42493C114.534 9.24524 114.642 9.08197 114.78 8.94456C114.917 8.80715 115.08 8.69832 115.26 8.62436C115.44 8.5504 115.632 8.51277 115.827 8.51365ZM115.827 11.2507C116.078 11.2597 116.327 11.1934 116.54 11.0602C116.753 10.927 116.922 10.733 117.025 10.5032C117.127 10.2734 117.158 10.0183 117.115 9.77051C117.071 9.52275 116.954 9.2937 116.779 9.11278C116.605 8.93186 116.38 8.80733 116.134 8.75517C115.887 8.70301 115.631 8.72561 115.398 8.82006C115.165 8.91451 114.965 9.07651 114.825 9.28525C114.684 9.49399 114.61 9.73994 114.61 9.99152C114.605 10.1547 114.632 10.3173 114.691 10.4696C114.75 10.6219 114.839 10.7609 114.952 10.8783C115.066 10.9957 115.202 11.0892 115.352 11.1531C115.502 11.2171 115.663 11.2503 115.827 11.2507ZM115.261 9.12701H115.913C116.32 9.12701 116.514 9.2882 116.514 9.62047C116.518 9.68183 116.508 9.74328 116.487 9.80092C116.466 9.85856 116.433 9.91113 116.39 9.9553C116.347 9.99946 116.296 10.0343 116.239 10.0575C116.182 10.0807 116.121 10.0918 116.059 10.0902L116.554 10.8497H116.273L115.807 10.1101H115.522V10.8497H115.261L115.261 9.12701ZM115.522 9.89658H115.793C116.028 9.89658 116.254 9.88283 116.254 9.60672C116.254 9.36814 116.048 9.34192 115.869 9.34192H115.522V9.89658Z" fill="white"/>
<path d="M28 14.0009C26.6079 13.1987 25.0956 12.6262 23.5213 12.3054C23.7189 13.4271 23.7188 14.5747 23.521 15.6963C25.0954 15.3756 26.6078 14.8031 28 14.0009Z" fill="white"/>
<path d="M21.9314 8.468C22.8182 7.12767 23.4829 5.65311 23.9001 4.10111C22.3482 4.51828 20.8737 5.18296 19.5335 6.06958C20.4671 6.7224 21.2788 7.53422 21.9314 8.468Z" fill="white"/>
<path d="M12.3054 4.47868C13.4271 4.28113 14.5747 4.28123 15.6963 4.47898C15.3756 2.90456 14.8031 1.39216 14.0009 0C13.1987 1.39207 12.6262 2.90437 12.3054 4.47868Z" fill="white"/>
<path d="M6.06958 8.46653C6.72241 7.53288 7.53423 6.72121 8.46801 6.06856C7.12768 5.18184 5.65312 4.51709 4.10112 4.0999C4.51829 5.65179 5.18297 7.12626 6.06958 8.46653Z" fill="white"/>
<path d="M0 13.9991C1.39207 14.8013 2.90437 15.3738 4.47868 15.6946C4.28113 14.5729 4.28123 13.4253 4.47899 12.3037C2.90456 12.6244 1.39216 13.1969 0 13.9991Z" fill="white"/>
<path d="M6.06854 19.532C5.18183 20.8723 4.51707 22.3469 4.09987 23.8989C5.65177 23.4817 7.12624 22.817 8.46651 21.9304C7.53286 21.2776 6.72119 20.4658 6.06854 19.532Z" fill="white"/>
<path d="M12.3037 23.521C12.6244 25.0954 13.1969 26.6078 13.9992 28C14.8014 26.6079 15.3738 25.0956 15.6946 23.5213C14.5729 23.7189 13.4253 23.7188 12.3037 23.521Z" fill="white"/>
<path d="M19.532 21.9314C20.8723 22.8182 22.3469 23.4829 23.8989 23.9001C23.4817 22.3482 22.817 20.8737 21.9304 19.5335C21.2776 20.4671 20.4658 21.2788 19.532 21.9314Z" fill="white"/>
<path d="M23.5213 12.3054C22.9486 12.1932 22.3667 12.1347 21.7831 12.1304C21.1739 12.1292 20.5667 12.1991 19.9738 12.3385C20.2747 13.4264 20.2745 14.5755 19.9733 15.6632C20.5664 15.8027 21.1738 15.8725 21.7831 15.8713C22.3666 15.8671 22.9484 15.8085 23.521 15.6963C23.7188 14.5747 23.7189 13.4271 23.5213 12.3054Z" fill="white" fill-opacity="0.63"/>
<path d="M19.3994 10.9526C19.9176 10.6317 20.3966 10.2516 20.8266 9.81975C21.2361 9.40443 21.6059 8.95189 21.9314 8.468C21.2788 7.53422 20.4671 6.7224 19.5335 6.06958C19.0495 6.39514 18.5968 6.76506 18.1814 7.17455C17.7497 7.60453 17.3697 8.08342 17.049 8.60148C18.031 9.15776 18.8434 9.97041 19.3994 10.9526Z" fill="white" fill-opacity="0.63"/>
<path d="M14 4.33059C13.4319 4.33038 12.8649 4.37994 12.3054 4.47868C12.1932 5.05141 12.1347 5.63335 12.1304 6.21694C12.1292 6.82607 12.1991 7.43326 12.3386 8.02621C13.4264 7.72535 14.5755 7.72552 15.6632 8.02668C15.8027 7.43357 15.8725 6.82623 15.8713 6.21694C15.8671 5.63345 15.8085 5.05162 15.6963 4.47898C15.1363 4.38003 14.5687 4.33038 14 4.33059Z" fill="white" fill-opacity="0.63"/>
<path d="M8.46801 6.06856C7.53423 6.72121 6.72241 7.53288 6.06958 8.46653C6.39514 8.95052 6.76512 9.40315 7.17462 9.81855C7.60459 10.2502 8.08346 10.6303 8.60152 10.951C9.15779 9.96899 9.97044 9.15658 10.9526 8.6006C10.6318 8.08243 10.2516 7.60344 9.81977 7.17335C9.40446 6.76393 8.95189 6.39407 8.46801 6.06856Z" fill="white" fill-opacity="0.63"/>
<path d="M8.02622 15.6615C7.72536 14.5736 7.72553 13.4245 8.0267 12.3368C7.43359 12.1973 6.82624 12.1275 6.21696 12.1287C5.63346 12.1329 5.05162 12.1915 4.47899 12.3037C4.28123 13.4253 4.28113 14.5729 4.47868 15.6946C5.05141 15.8068 5.63336 15.8653 6.21696 15.8696C6.82609 15.8708 7.43328 15.8009 8.02622 15.6615Z" fill="white" fill-opacity="0.63"/>
<path d="M8.6006 17.0474C8.08244 17.3683 7.60345 17.7484 7.17336 18.1802C6.76395 18.5956 6.39406 19.0481 6.06854 19.532C6.72119 20.4658 7.53286 21.2776 8.46651 21.9304C8.9505 21.6049 9.40317 21.2349 9.81856 20.8254C10.2503 20.3954 10.6303 19.9166 10.951 19.3985C9.969 18.8422 9.1566 18.0296 8.6006 17.0474Z" fill="white" fill-opacity="0.63"/>
<path d="M14 20.1993C13.4379 20.1997 12.8784 20.1236 12.3368 19.9733C12.1974 20.5664 12.1275 21.1738 12.1287 21.7831C12.133 22.3666 12.1915 22.9484 12.3037 23.521C13.4253 23.7188 14.5729 23.7189 15.6946 23.5213C15.8068 22.9486 15.8654 22.3667 15.8696 21.7831C15.8708 21.1739 15.801 20.5667 15.6615 19.9738C15.1204 20.1238 14.5615 20.1997 14 20.1993Z" fill="white" fill-opacity="0.63"/>
<path d="M19.3985 17.049C18.8422 18.031 18.0296 18.8434 17.0474 19.3994C17.3683 19.9176 17.7484 20.3966 18.1802 20.8267C18.5956 21.2361 19.0481 21.6059 19.532 21.9314C20.4658 21.2788 21.2776 20.4671 21.9304 19.5335C21.6048 19.0495 21.2349 18.5968 20.8254 18.1814C20.3955 17.7498 19.9166 17.3697 19.3985 17.049Z" fill="white" fill-opacity="0.63"/>
<path d="M19.9738 12.3385C18.7904 12.6145 17.6965 13.1866 16.7949 14.0012C17.6964 14.8156 18.7901 15.3876 19.9733 15.6632C20.2745 14.5755 20.2747 13.4264 19.9738 12.3385Z" fill="white" fill-opacity="0.47"/>
<path d="M17.049 8.60148C16.4075 9.63328 16.0387 10.8112 15.9772 12.0246C17.1903 11.963 18.3679 11.5941 19.3994 10.9526C18.8434 9.97041 18.031 9.15776 17.049 8.60148Z" fill="white" fill-opacity="0.47"/>
<path d="M12.3386 8.02621C12.6145 9.2096 13.1866 10.3035 14.0012 11.2051C14.8156 10.3036 15.3876 9.20989 15.6632 8.02668C14.5755 7.72552 13.4264 7.72535 12.3386 8.02621Z" fill="white" fill-opacity="0.47"/>
<path d="M8.60152 10.951C9.63332 11.5925 10.8112 11.9613 12.0246 12.0228C11.963 10.8097 11.5942 9.63207 10.9526 8.6006C9.97044 9.15658 9.15779 9.96899 8.60152 10.951Z" fill="white" fill-opacity="0.47"/>
<path d="M8.0267 12.3368C7.72553 13.4245 7.72536 14.5736 8.02622 15.6615C9.20962 15.3855 10.3035 14.8134 11.2051 13.9988C10.3036 13.1844 9.20991 12.6124 8.0267 12.3368Z" fill="white" fill-opacity="0.47"/>
<path d="M10.951 19.3985C11.5925 18.3667 11.9614 17.1888 12.0229 15.9754C10.8097 16.037 9.63209 16.4059 8.6006 17.0474C9.1566 18.0296 9.969 18.8422 10.951 19.3985Z" fill="white" fill-opacity="0.47"/>
<path d="M12.3368 19.9733C13.4246 20.2745 14.5737 20.2747 15.6615 19.9738C15.3856 18.7904 14.8134 17.6965 13.9988 16.7949C13.1844 17.6964 12.6125 18.7901 12.3368 19.9733Z" fill="white" fill-opacity="0.47"/>
<path d="M17.0474 19.3994C18.0296 18.8434 18.8422 18.031 19.3985 17.049C18.3667 16.4075 17.1888 16.0387 15.9754 15.9772C16.037 17.1903 16.4059 18.3679 17.0474 19.3994Z" fill="white" fill-opacity="0.47"/>
</svg>
```

Natural size: 118 Ã— 28 | viewBox: 0 0 118 28
#### Invisalign First

```svg
<svg width="166" height="28" viewBox="0 0 166 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M103.934 6.85631H107.129L107.18 8.18649C107.623 7.64197 108.182 7.20375 108.817 6.90411C109.452 6.60446 110.146 6.45102 110.848 6.45508C114.356 6.45508 116.271 8.62386 116.271 12.4034V21.2143H112.956V12.512C112.956 10.5664 111.768 9.45042 110.1 9.45042C108.444 9.45042 107.249 10.5664 107.249 12.512V21.2143H103.934L103.934 6.85631ZM75.9568 21.2143H72.6388V0.343941H75.9568V21.2143ZM83.0455 21.2143H79.7274V6.85631H83.0455V21.2143ZM81.3834 5.83821e-06C80.9722 0.000310817 80.5703 0.122511 80.2285 0.351163C79.8867 0.579814 79.6203 0.904655 79.4631 1.28463C79.3059 1.66461 79.2648 2.08266 79.3451 2.48597C79.4254 2.88927 79.6235 3.25972 79.9143 3.5505C80.205 3.84127 80.5755 4.03933 80.9788 4.11963C81.3821 4.19993 81.8002 4.15887 82.1802 4.00164C82.5602 3.84442 82.885 3.57808 83.1137 3.23629C83.3423 2.8945 83.4645 2.4926 83.4648 2.08138C83.4655 1.80787 83.4121 1.53692 83.3077 1.2841C83.2033 1.03129 83.05 0.801582 82.8566 0.608179C82.6632 0.414777 82.4335 0.261489 82.1807 0.15712C81.9279 0.0527509 81.6569 -0.000642723 81.3834 5.83821e-06ZM65.5924 6.85631H68.8743V21.2143H65.5924L65.5411 19.7092C64.3624 20.8994 62.7666 21.5841 61.0918 21.6185C57.1795 21.6185 54.2777 18.4693 54.2777 14.0352C54.2777 9.34478 57.4178 6.45508 61.0918 6.45508C61.9278 6.43186 62.7588 6.5909 63.5272 6.92115C64.2955 7.2514 64.9827 7.74494 65.5411 8.3675L65.5924 6.85631ZM57.6682 14.0352C57.6682 16.7892 59.3575 18.6262 61.7042 18.6262C63.8338 18.6262 65.7463 17.0758 65.7463 14.0352C65.7463 11.0822 63.9123 9.4444 61.7042 9.4444C59.2609 9.4444 57.6682 11.393 57.6682 14.0352ZM97.0357 14.0352C97.0357 11.0401 95.1474 9.4444 93.0026 9.4444C90.4357 9.4444 88.9577 11.5316 88.9577 14.0352C88.9577 16.6777 90.5503 18.6262 92.9997 18.6262C95.253 18.6262 97.0357 16.949 97.0357 14.0352ZM100.161 19.7935C100.161 25.953 96.5561 27.998 92.312 27.998C90.5338 28.0312 88.7731 27.6415 87.175 26.8609L87.9985 24.0075C89.3066 24.7441 90.7835 25.1287 92.2848 25.1235C94.7553 25.1235 96.8487 23.5399 96.8487 20.6894V19.697C96.2833 20.321 95.5898 20.8157 94.8158 21.1473C94.0417 21.4789 93.2051 21.6397 92.3633 21.6185C88.4962 21.6185 85.5733 18.5086 85.5733 14.0352C85.5733 9.74895 88.3242 6.45508 92.3754 6.45508C93.2129 6.42687 94.0463 6.58361 94.8164 6.91415C95.5865 7.2447 96.2742 7.74092 96.8307 8.3675L96.8728 6.85631H100.161L100.161 19.7935Z" fill="white"/>
<path d="M24.192 6.85631L27.9082 15.4922L31.6063 6.85631H35.2863L27.875 22.2006L20.5269 6.85631H24.192ZM42.7671 17.9143C43.8972 18.5712 45.1711 18.941 46.4773 18.9912C48.0881 18.9912 48.8603 18.3004 48.8603 17.3473C48.8603 16.3609 48.266 15.824 46.4712 15.1694C43.6328 14.2102 42.5077 12.7262 42.5077 10.9948C42.5077 8.42788 44.5287 6.45507 47.9102 6.45507C49.2547 6.42608 50.5865 6.72202 51.7922 7.31776L51.0532 9.88778C50.1109 9.35761 49.0514 9.07047 47.9704 9.05227C46.6522 9.05227 45.874 9.70678 45.874 10.6056C45.874 11.5316 46.5648 12.0113 48.4199 12.6959C51.0774 13.622 52.2326 14.9463 52.2628 17.0968C52.2628 19.7513 50.299 21.6185 46.4442 21.6185C44.9072 21.6469 43.3867 21.2978 42.016 20.602L42.7671 17.9143ZM3.74057 21.2143H0.422413V6.85631H3.74057V21.2143ZM2.0845 5.16926e-06C1.67301 -0.00091204 1.2705 0.120249 0.927891 0.348157C0.585283 0.576065 0.317979 0.900477 0.159803 1.28034C0.00162682 1.66021 -0.0403134 2.07846 0.0392893 2.48217C0.118892 2.88588 0.31646 3.25691 0.606994 3.5483C0.897529 3.8397 1.26797 4.03836 1.67145 4.11917C2.07493 4.19997 2.49331 4.15927 2.87365 4.00223C3.25399 3.84518 3.5792 3.57885 3.80813 3.23693C4.03706 2.895 4.15942 2.49286 4.15973 2.08138C4.16017 1.5303 3.94187 1.00157 3.55277 0.611318C3.16367 0.221066 2.63559 0.00119919 2.0845 5.16926e-06ZM39.7929 21.2143H36.4778V6.85631H39.7929V21.2143ZM38.1368 5.16926e-06C37.7253 -0.000882055 37.3228 0.120304 36.9802 0.348231C36.6376 0.576157 36.3704 0.90058 36.2122 1.28045C36.0541 1.66032 36.0121 2.07857 36.0918 2.48227C36.1714 2.88597 36.369 3.25698 36.6595 3.54836C36.95 3.83974 37.3205 4.03839 37.724 4.11918C38.1274 4.19997 38.5458 4.15926 38.9261 4.00221C39.3065 3.84517 39.6317 3.57883 39.8606 3.23691C40.0895 2.89499 40.2119 2.49285 40.2122 2.08138C40.2119 1.53048 39.9934 1.00213 39.6044 0.612028C39.2154 0.221923 38.6877 0.00185152 38.1368 5.16926e-06ZM7.502 6.85631H10.7025L10.7567 8.18649C11.1984 7.63064 11.7632 7.18494 12.4065 6.88449C13.0498 6.58404 13.7541 6.43704 14.4639 6.45508C17.6733 6.45508 19.8453 8.62386 19.8453 12.4064V21.2143H16.5272V12.5602C16.5272 10.7173 15.3326 9.45042 13.6736 9.45042C12.0206 9.45042 10.8262 10.6932 10.8262 12.5602V21.2143H7.502V6.85631Z" fill="white"/>
<path d="M123.423 6.8618H125.728V4.13969C125.728 2.2231 126.755 1.25092 128.811 1.25092H129.8V2.44526H128.894C127.477 2.44526 127.089 3.11197 127.089 4.16745V6.8618H129.884V8.0006H127.089V21.2225H125.728V8.00062H123.423L123.423 6.8618ZM132.024 6.8618H133.385V21.2225H132.024V6.8618Z" fill="white"/>
<path d="M137.824 9.69507H137.879C138.315 8.75207 139.021 7.95942 139.907 7.41725C140.706 6.9505 141.623 6.7284 142.546 6.77854V8.1395C141.854 8.09552 141.16 8.20955 140.518 8.47296C139.688 8.87501 138.993 9.50848 138.514 10.297C138.036 11.0856 137.797 11.9956 137.824 12.9173V21.2226H136.463V6.86183H137.824V9.69507Z" fill="white"/>
<path d="M142.575 16.8893H143.964C144.158 19.2504 145.853 20.417 148.242 20.417C150.658 20.417 152.103 19.2227 152.103 17.3339C152.103 15.7783 151.353 15.1671 148.186 14.4171C145.242 13.7229 143.048 12.9451 143.048 10.3895C143.048 8.00065 145.214 6.55616 147.936 6.55616C151.242 6.55616 152.714 8.30612 153.047 10.6395H151.714C151.52 8.80621 150.103 7.75072 147.936 7.75072C145.603 7.75072 144.409 8.86175 144.409 10.3618C144.409 12.0284 145.742 12.5005 148.686 13.195C151.575 13.8617 153.464 14.6395 153.464 17.3616C153.464 19.6948 151.603 21.5836 148.242 21.5836C144.492 21.5836 142.714 19.3615 142.575 16.8893Z" fill="white"/>
<path d="M153.716 6.86182H155.938V2.52859H157.299V6.86182H159.91V8.00062H157.299V18.7781C157.299 19.8336 157.716 20.1671 158.66 20.1671C159.035 20.163 159.405 20.0777 159.744 19.9171H159.827V21.0837C159.366 21.259 158.876 21.3439 158.383 21.3336C156.911 21.3336 155.938 20.5836 155.938 18.8892V8.00064H153.716V6.86182Z" fill="white"/>
<path d="M132.904 4.90814C133.365 4.90814 133.739 4.53463 133.739 4.07388C133.739 3.61313 133.365 3.23961 132.904 3.23961C132.444 3.23961 132.07 3.61313 132.07 4.07388C132.07 4.53463 132.444 4.90814 132.904 4.90814Z" fill="white"/>
<path d="M160.542 2.52859H162.71V2.9558H161.873V5.19979H161.374V2.9558H160.542L160.542 2.52859Z" fill="white"/>
<path d="M163.059 2.52859H163.716L164.154 3.80007C164.258 4.11194 164.387 4.69693 164.387 4.69693H164.399C164.399 4.69693 164.528 4.11563 164.628 3.80007L165.058 2.5286H165.73V5.1998H165.267V3.80653C165.267 3.51588 165.299 2.97426 165.299 2.97426H165.292C165.292 2.97426 165.181 3.46605 165.094 3.73179L164.589 5.1998H164.186L163.677 3.73179C163.59 3.46605 163.48 2.97426 163.48 2.97426H163.472C163.472 2.97426 163.504 3.51588 163.504 3.80653V5.19978H163.059L163.059 2.52859Z" fill="white"/>
</svg>
```

Natural size: 166 Ã— 28 | viewBox: 0 0 166 28
#### Vivera Retainers

```svg
<svg width="177" height="28" viewBox="0 0 177 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.65506 9.90158L7.30985 17.8349L10.9502 9.90158H14.6197L7.28093 25L0 9.90158H3.65506ZM16.3312 5.10303C16.3286 4.82695 16.3826 4.55326 16.4898 4.29885C16.5971 4.04443 16.7553 3.81468 16.9547 3.62377C17.1516 3.42607 17.3855 3.26919 17.6431 3.16215C17.9007 3.0551 18.177 3 18.4559 3C18.7349 3 19.0111 3.0551 19.2687 3.16215C19.5264 3.26919 19.7603 3.42607 19.9571 3.62377C20.159 3.81586 20.3187 4.04787 20.426 4.30503C20.5334 4.56219 20.586 4.83887 20.5806 5.11748C20.5852 5.39816 20.5323 5.67681 20.425 5.93625C20.3178 6.19568 20.1586 6.43039 19.9571 6.6259C19.7651 6.82791 19.533 6.9877 19.2758 7.09509C19.0186 7.20248 18.7418 7.25513 18.4632 7.24966C18.1825 7.25431 17.9038 7.20136 17.6443 7.09407C17.3849 6.98679 17.1502 6.82745 16.9547 6.6259C16.7523 6.42815 16.5925 6.19098 16.4852 5.92906C16.378 5.66713 16.3256 5.386 16.3312 5.10303ZM20.0874 9.90158V24.0281H16.8241V9.9016L20.0874 9.90158ZM25.9761 9.90158L29.6309 17.8349L33.2712 9.90158H36.9408L29.602 25L22.321 9.90158H25.9761ZM54.0132 9.90158H57.2765V11.1633C57.7334 10.648 58.2725 10.2119 58.8719 9.87267C59.396 9.61982 59.9728 9.49553 60.5545 9.5101C61.5135 9.53982 62.4462 9.83071 63.2521 10.3514L61.7581 13.3388C61.2397 12.9302 60.6049 12.6967 59.9452 12.672C58.1661 12.672 57.2765 14.016 57.2765 16.7041V24.0281H54.0132V9.90158ZM74.8049 9.90158H78.0826V24.0281H74.8049V22.5488C74.2025 23.1653 73.4794 23.6509 72.6809 23.9753C71.8823 24.2996 71.0255 24.4558 70.1638 24.434C69.3022 24.4122 68.4543 24.2129 67.6732 23.8486C66.892 23.4843 66.1945 22.9627 65.624 22.3166C64.3368 20.8199 63.6587 18.8943 63.7241 16.9214C63.6605 14.9792 64.34 13.0858 65.624 11.6273C66.2127 10.9465 66.9442 10.4038 67.7664 10.0379C68.5887 9.67196 69.4815 9.49174 70.3813 9.51008C71.2195 9.52112 72.0461 9.70748 72.808 10.0572C73.5698 10.4069 74.2501 10.9122 74.8049 11.5406V9.90158ZM67.0599 16.9214C67.0074 18.1194 67.3942 19.2954 68.1477 20.2283C68.4894 20.6412 68.9199 20.9717 69.4071 21.1952C69.8942 21.4187 70.4255 21.5295 70.9614 21.5191C71.5114 21.5392 72.0591 21.4379 72.5654 21.2222C73.0718 21.0066 73.5244 20.6821 73.8911 20.2716C74.6557 19.3547 75.0536 18.1871 75.008 16.9941C75.0537 15.801 74.6557 14.6332 73.8911 13.7161C73.5313 13.304 73.0844 12.977 72.5827 12.7587C72.081 12.5405 71.5371 12.4364 70.9903 12.4542C70.4561 12.4453 69.9266 12.5552 69.4401 12.776C68.9535 12.9967 68.522 13.3228 68.1769 13.7306C67.4221 14.619 67.024 15.7561 67.0599 16.9214ZM48.12 19.141C47.7017 19.8201 47.1765 20.4272 46.5647 20.9389C45.9725 21.3438 45.2656 21.5472 44.5487 21.5191C44.074 21.5357 43.6009 21.4541 43.1592 21.2794C42.7175 21.1047 42.3166 20.8407 41.9817 20.5038C41.2843 19.7462 40.8827 18.7629 40.8503 17.7337H50.9739L50.9883 16.9646C50.9883 14.6348 50.3888 12.8123 49.1898 11.4972C48.5606 10.8289 47.7938 10.3051 46.9425 9.96205C46.0911 9.61897 45.1754 9.46474 44.2586 9.51001C43.3331 9.47166 42.4103 9.63465 41.554 9.98771C40.6976 10.3408 39.9281 10.8755 39.2985 11.555C38.0157 13.063 37.3523 15.0013 37.4419 16.9792C37.4419 19.2326 38.0802 21.0408 39.3566 22.4038C40.0104 23.0828 40.8011 23.6149 41.6763 23.965C42.5515 24.3151 43.4911 24.4751 44.4328 24.4343C45.1213 24.4396 45.808 24.3616 46.4778 24.202C47.0973 24.0508 47.6894 23.8037 48.2327 23.4696C48.7971 23.117 49.3097 22.6874 49.7555 22.1932C50.1668 21.7364 50.537 21.2442 50.8619 20.7223L48.12 19.141ZM41.5321 13.9773C41.7286 13.665 41.9762 13.3879 42.2645 13.1576C42.5492 12.9308 42.8704 12.7542 43.2145 12.6353C43.5739 12.5126 43.9514 12.4514 44.3311 12.4541C46.0716 12.4541 47.169 13.3244 47.6236 15.0648H41.0678C41.1649 14.6803 41.3216 14.3133 41.5321 13.9773Z" fill="white"/>
<path d="M92.4318 12.6881H92.4863C92.915 11.7608 93.6089 10.9813 94.4804 10.4481C95.2652 9.98902 96.1676 9.77056 97.0754 9.81988V11.1584C96.3946 11.1152 95.7128 11.2273 95.0816 11.4861C94.2654 11.8815 93.581 12.5044 93.1109 13.2799C92.6408 14.0554 92.4049 14.9503 92.4318 15.8567V24.0244H91.0933V9.90191H92.4318L92.4318 12.6881Z" fill="white"/>
<path d="M98.3477 17.1134C98.3748 20.5006 99.9047 23.205 103.374 23.205C105.914 23.205 107.089 21.7299 107.662 19.8176H108.946C108.373 22.44 106.515 24.3794 103.374 24.3794C99.2218 24.3794 96.9818 21.32 96.9818 16.9767C96.9818 12.6334 99.413 9.60135 103.264 9.60135C104.633 9.55581 105.966 10.0458 106.98 10.9672C108.537 12.4149 109.055 14.4364 109.028 17.1134H98.3477ZM103.264 10.7487C100.205 10.7487 98.648 13.0432 98.3748 16.0208H107.662C107.58 13.2343 106.379 10.7487 103.264 10.7487Z" fill="white"/>
<path d="M109.129 9.90191H111.314V5.64044H112.652V9.90191H115.22V11.0217H112.652V21.6206C112.652 22.6585 113.062 22.9864 113.991 22.9864C114.36 22.9823 114.723 22.8985 115.056 22.7406H115.138V23.8879C114.685 24.0604 114.203 24.1438 113.718 24.1336C112.27 24.1336 111.314 23.3962 111.314 21.7299V11.0217H109.129V9.90191Z" fill="white"/>
<path d="M125.641 22.3308V21.8391H125.559C124.999 22.6671 124.234 23.3362 123.339 23.7814C122.444 24.2265 121.449 24.4325 120.451 24.3794C117.856 24.3794 115.943 23.0411 115.943 20.4459C115.943 17.0861 118.566 16.4032 121.516 16.1026C124.849 15.7749 125.613 15.6111 125.613 14.2998V13.8081C125.613 11.6775 124.357 10.7487 122.062 10.7487C119.413 10.7487 117.992 11.8413 117.801 13.9173H116.435C116.708 11.1857 118.539 9.60132 122.062 9.60132C125.204 9.60132 126.952 10.9945 126.952 13.8899V22.1941C126.952 22.9591 127.362 23.1776 127.853 23.1776C128.078 23.1664 128.299 23.1203 128.509 23.0411H128.591V24.0244C128.25 24.1837 127.875 24.2586 127.498 24.2429C126.406 24.2429 125.641 23.642 125.641 22.3308ZM125.613 18.9982V16.3758C124.63 16.8676 123.128 17.0588 121.68 17.2226C119.194 17.4958 117.309 17.8235 117.309 20.5006C117.309 22.4947 118.785 23.2594 120.587 23.2594C123.783 23.2594 125.613 21.1288 125.613 18.9982Z" fill="white"/>
<path d="M129.743 9.90191H131.082V24.0244H129.743V9.90191Z" fill="white"/>
<path d="M134.752 12.2784H134.806C135.314 11.4375 136.038 10.7481 136.903 10.2821C137.768 9.81604 138.742 9.59042 139.723 9.62871C142.127 9.62871 144.039 11.1311 144.039 13.9446V24.0244H142.701V14.0811C142.701 11.7593 141.445 10.776 139.478 10.776C136.965 10.776 134.752 12.5516 134.752 14.9008V24.0244H133.413V9.90191H134.752V12.2784Z" fill="white"/>
<path d="M147.026 17.1134C147.054 20.5006 148.584 23.205 152.052 23.205C154.593 23.205 155.768 21.7299 156.341 19.8176H157.625C157.051 22.44 155.194 24.3794 152.052 24.3794C147.901 24.3794 145.661 21.32 145.661 16.9767C145.661 12.6334 148.092 9.60135 151.944 9.60135C153.312 9.55585 154.645 10.0458 155.658 10.9672C157.215 12.4149 157.734 14.4364 157.707 17.1134H147.026ZM151.944 10.7487C148.884 10.7487 147.327 13.0432 147.054 16.0208H156.341C156.26 13.2343 155.057 10.7487 151.944 10.7487Z" fill="white"/>
<path d="M160.779 12.6881H160.833C161.262 11.7608 161.956 10.9814 162.827 10.4481C163.612 9.98901 164.515 9.77056 165.423 9.81988V11.1584C164.742 11.1152 164.06 11.2273 163.429 11.4861C162.612 11.8815 161.928 12.5045 161.458 13.2799C160.988 14.0554 160.752 14.9503 160.779 15.8567V24.0244H159.44V9.90191H160.779V12.6881Z" fill="white"/>
<path d="M165.67 19.7629H167.036C167.227 22.085 168.894 23.2323 171.243 23.2323C173.62 23.2323 175.04 22.0576 175.04 20.2C175.04 18.6705 174.303 18.0694 171.189 17.332C168.293 16.649 166.135 15.8841 166.135 13.3711C166.135 11.0217 168.266 9.60135 170.943 9.60135C174.193 9.60135 175.641 11.3223 175.969 13.6169H174.657C174.466 11.814 173.073 10.776 170.943 10.776C168.648 10.776 167.473 11.8687 167.473 13.3437C167.473 14.9826 168.784 15.447 171.68 16.1299C174.521 16.7855 176.379 17.5505 176.379 20.2273C176.379 22.522 174.549 24.3794 171.243 24.3794C167.556 24.3794 165.807 22.1941 165.67 19.7629Z" fill="white"/>
<path d="M130.412 8.15657C130.857 8.15657 131.218 7.7958 131.218 7.35077C131.218 6.90574 130.857 6.54498 130.412 6.54498C129.967 6.54498 129.607 6.90574 129.607 7.35077C129.607 7.7958 129.967 8.15657 130.412 8.15657Z" fill="white"/>
<path d="M80.5752 9.90482H82.709V10.3252H81.8855V12.5335H81.3942V10.3252H80.5752V9.90482Z" fill="white"/>
<path d="M83.0523 9.90483H83.6988L84.1301 11.1561C84.2327 11.463 84.3598 12.0386 84.3598 12.0386H84.3707C84.3707 12.0386 84.4978 11.4666 84.5968 11.1561L85.0199 9.90483H85.6809V12.5335H85.2251V11.1624C85.2251 10.8764 85.2569 10.3434 85.2569 10.3434H85.2496C85.2496 10.3434 85.1407 10.8274 85.0553 11.0889L84.5577 12.5335H84.1618L83.6606 11.0889C83.5753 10.8274 83.4663 10.3434 83.4663 10.3434H83.459C83.459 10.3434 83.4908 10.8764 83.4908 11.1624V12.5335H83.0522L83.0523 9.90483Z" fill="white"/>
</svg>
```

Natural size: 177 Ã— 28 | viewBox: 0 0 177 28
#### iTero

```svg
<svg width="56" height="28" viewBox="0 0 56 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M49.685 18.5408C49.6872 17.695 49.5215 16.8572 49.1974 16.076C48.8733 15.2947 48.3973 14.5856 47.797 13.9898C46.5492 12.7457 44.8483 12.0608 43.0048 12.0608C41.1628 12.0608 39.4605 12.7457 38.2142 13.9898C37.6158 14.5862 37.1419 15.2957 36.8204 16.0771C36.4989 16.8584 36.336 17.6959 36.3413 18.5408C36.3413 20.2915 36.9783 21.9093 38.1637 23.0978C39.3863 24.324 41.1065 25 43.0048 25C44.9033 25 46.6235 24.324 47.8475 23.0978C49.0314 21.9093 49.685 20.2915 49.685 18.5408ZM46.6844 18.5408C46.6844 20.5247 44.9656 22.2651 43.0048 22.2651C41.0455 22.2651 39.3253 20.5247 39.3253 18.5408C39.3216 18.0438 39.4168 17.5511 39.6056 17.0913C39.7943 16.6316 40.0728 16.2141 40.4246 15.8631C41.1092 15.1792 42.0372 14.795 43.0049 14.795C43.9725 14.795 44.9006 15.1792 45.5851 15.8631C45.9373 16.2139 46.2159 16.6314 46.4046 17.0912C46.5934 17.5509 46.6885 18.0438 46.6844 18.5408ZM31.5254 15.4374H35.1878V12.3275H28.4164V24.7838H31.5254V15.4374ZM16.18 19.7314H25.9441V19.294C25.9441 17.1934 25.3232 15.3892 24.1482 14.0767C22.9836 12.7769 21.3198 12.0608 19.4644 12.0608C17.6388 12.0608 15.9869 12.742 14.8165 13.9794C13.6919 15.1672 13.0725 16.779 13.0725 18.5192C13.0725 20.2217 13.686 21.8112 14.7986 22.9945C16.033 24.3062 17.7606 25 19.7957 25C21.8531 25 23.5495 24.2297 25.1107 22.583L23.1157 20.5841C22.1695 21.6842 21.0138 22.2651 19.7734 22.2651C18.799 22.2651 17.9314 21.9672 17.2645 21.4027C16.7466 20.9643 16.3694 20.383 16.18 19.7314ZM16.1667 17.2179C16.495 16.0102 17.4917 14.795 19.4422 14.795C21.0732 14.795 22.3611 15.7695 22.728 17.2179H16.1667ZM10.5217 9.21817H14.8236V6.10896H3.11068V9.21817H7.4126V24.7838H10.5217V9.21817Z" fill="white"/>
<path d="M31.5254 15.4374H35.1878V12.3275H28.4164V24.7838H31.5254V15.4374Z" fill="white"/>
<path d="M3.10904 12.3275H0V24.7838H3.10904V12.3275Z" fill="white"/>
<path d="M3.10904 3H0V6.10921H3.10904V3Z" fill="white"/>
<path d="M50.6378 12.3236H52.5194V12.6943H51.7932V14.6417H51.36V12.6943H50.6378V12.3236Z" fill="white"/>
<path d="M52.822 12.3236H53.3921L53.7724 13.427C53.8629 13.6976 53.975 14.2053 53.975 14.2053H53.9846C53.9846 14.2053 54.0967 13.7008 54.184 13.427L54.5571 12.3236H55.14V14.6417H54.7381V13.4326C54.7381 13.1804 54.7661 12.7103 54.7661 12.7103H54.7597C54.7597 12.7103 54.6636 13.1371 54.5883 13.3677L54.1496 14.6417H53.8005L53.3585 13.3677C53.2832 13.1371 53.1871 12.7103 53.1871 12.7103H53.1807C53.1807 12.7103 53.2088 13.1804 53.2088 13.4326V14.6417H52.822V12.3236Z" fill="white"/>
</svg>
```

Natural size: 56 Ã— 28 | viewBox: 0 0 56 28
#### iTero + Exocad

```svg
<svg width="128" height="28" viewBox="0 0 128 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M54.4281 0H53.497V28H54.4281V0Z" fill="white"/>
<path d="M72.352 12.3436C72.3118 12.4865 72.2398 12.6184 72.1414 12.7296C72.043 12.8408 71.9208 12.9282 71.7838 12.9855C71.4972 13.1086 71.1876 13.169 70.8758 13.1626H70.8734C70.5475 13.168 70.2251 13.0953 69.9332 12.9504C69.6266 12.7951 69.4575 12.6225 69.4159 12.4287C69.3853 12.2997 69.37 12.1676 69.3704 12.035C69.3636 11.7195 69.46 11.4104 69.6451 11.1548C69.8302 10.8992 70.0937 10.7111 70.3956 10.6191C70.5916 10.5522 70.7974 10.5188 71.0044 10.5202C71.2277 10.5112 71.4499 10.5558 71.6525 10.6503C71.855 10.7448 72.032 10.8864 72.1686 11.0632C72.3265 11.2934 72.4149 11.5641 72.4232 11.8431C72.4223 12.0124 72.3984 12.1808 72.352 12.3436ZM75.1561 12.0276C74.897 11.3124 74.5229 10.6444 74.0483 10.0499C73.6756 9.61005 73.2082 9.26033 72.681 9.02701C72.1538 8.79369 71.5806 8.68284 71.0044 8.70278C70.3954 8.6905 69.7911 8.81143 69.2337 9.05711C68.6763 9.30279 68.1793 9.66728 67.7775 10.1251C66.9012 11.114 66.4384 12.4019 66.4848 13.7224C66.4659 15.0113 66.8699 16.2709 67.6351 17.3083C67.9899 17.8409 68.4717 18.2768 69.037 18.5767C69.6023 18.8767 70.2334 19.0312 70.8734 19.0264H70.8808C71.6617 19.0452 72.44 18.9274 73.1804 18.6782C73.5461 18.5943 73.8731 18.3901 74.109 18.0984C74.3449 17.8066 74.4761 17.4441 74.4815 17.069C74.4878 16.8722 74.4698 16.6753 74.4281 16.4829C74.37 16.321 74.2688 16.1781 74.1354 16.0695C74.0747 16.013 74.0024 15.9703 73.9236 15.9445C73.8448 15.9186 73.7613 15.9101 73.6789 15.9196C73.5213 15.9208 73.3644 15.9419 73.2121 15.9824C72.9563 16.0726 72.7176 16.2052 72.5059 16.3746C72.1585 16.643 71.7872 16.8789 71.3966 17.0794C71.243 17.1324 71.0813 17.1583 70.9189 17.156C70.7028 17.1588 70.4899 17.1035 70.3026 16.9957C70.1153 16.888 69.9604 16.7319 69.8541 16.5438C69.6424 16.1943 69.5364 15.791 69.549 15.3826C69.5592 15.1892 69.6236 15.0026 69.7349 14.844C69.8318 14.6698 69.9797 14.5293 70.1587 14.4415C70.475 14.346 70.8059 14.3088 71.1355 14.3317C71.1938 14.3317 71.7077 14.3648 72.6799 14.435C72.9208 14.4524 73.2215 14.4613 73.577 14.4613H73.5968C73.9578 14.4713 74.3184 14.4306 74.668 14.3406C74.7797 14.3195 74.8838 14.2691 74.9696 14.1946C75.0554 14.12 75.1198 14.0239 75.1561 13.