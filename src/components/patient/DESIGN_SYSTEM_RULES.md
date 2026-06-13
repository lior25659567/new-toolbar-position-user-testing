# Design System Rules

These rules apply to **every component in the patient flow** (Orders, Treatments, wizards, summary panels, etc.) and to anything we ship that touches the design system.

> **Why this file exists.** Hard-coded styles drift away from the system over time. New screens stop matching the old ones. Theme switches (light/dark) break. Re-skins become impossible. Following these rules keeps the patient flow visually consistent with the rest of the product.

---

## 0. Hard rules — read before changing anything

These are **non-negotiable**. Violations of these rules require a Slack/PR conversation before merging. They override personal preference, "it looks better this way," and "I just need a small custom version."

1. **Use design-system components only.** If a primitive ships in [src/design-system/](../../design-system/), import it and use it. Do not write a parallel implementation, even a "small" one.
2. **Never invent a new component without explicit approval.** If you think you need one (e.g. a header step indicator that doesn't match `<Stepper>`, a custom card variant, a new modal pattern), **stop and ask first** — file a design-system request before coding. Anything new ships from `design-system/`, never from a feature folder.
3. **Never modify a design-system component without explicit approval.** Don't edit files inside `src/design-system/`. Don't fork a primitive into a feature folder to "tweak" it. Don't override its internals via class hacks or `!important`. If a primitive can't do what you need, that's a design-system change request — file it and wait for approval.
4. **Use design tokens for every visual value.** Border radius, color, spacing, shadow, transition, z-index, font size, font weight, line height, letter spacing — all from tokens. No hex codes, no off-token pixel values, no `fontWeight: 600`. Full token tables are in §2.
5. **The design system never uses `fontWeight: 600` or `700`.** Maximum weight is `500`. Hierarchy comes from size, not weight.

If you're tempted to break one of these rules, leave the diff alone and post in #design-system or tag the design-system owners on the PR. The cost of pausing to ask is low; the cost of a one-off custom component is years of drift.

---

## 1. Always use Design System components — never reinvent

If a component exists in [src/design-system/](../../design-system/), use it. Do not build a parallel implementation, even a "small" one.

### Components available

| Need | Use | Source |
|------|-----|--------|
| Button — primary action | `<PrimaryButton size={36 \| 44 \| 60}>` | [PrimaryButton.tsx](../../design-system/PrimaryButton.tsx) |
| Button — secondary action | `<SecondaryButton size={36 \| 44 \| 60}>` | [SecondaryButton.tsx](../../design-system/SecondaryButton.tsx) |
| Button — destructive | `<WarningButton>` | [WarningButton.tsx](../../design-system/WarningButton.tsx) |
| Button — text/link | `<LinkButton>` / `<GhostButton>` | [LinkButton.tsx](../../design-system/LinkButton.tsx) |
| Icon-only button | `<IconButton size="sm" \| "md" \| "lg" aria-label="…">` | [IconButton.tsx](../../design-system/IconButton.tsx) |
| Input — text | `<TextInput label="…" />` / `<TextArea>` | [TextInput.tsx](../../design-system/TextInput.tsx) |
| Input — dropdown | `<DropdownList options=… value=… onChange=… />` | [DropdownList.tsx](../../design-system/DropdownList.tsx) |
| Input — search | `<SearchInput onSearch=… />` | [SearchInput.tsx](../../design-system/SearchInput.tsx) |
| Input — number | `<NumberInput>` | [NumberInput.tsx](../../design-system/NumberInput.tsx) |
| Input — date | `<DatePicker>` | [DatePicker.tsx](../../design-system/DatePicker.tsx) |
| Checkbox / Radio / Toggle | `<Checkbox>` / `<RadioGroup><RadioItem/></RadioGroup>` / `<Toggle>` | [Checkbox.tsx](../../design-system/Checkbox.tsx), [Radio.tsx](../../design-system/Radio.tsx), [Toggle.tsx](../../design-system/Toggle.tsx) |
| Tabs | `<Tabs items=… activeId=… onChange=…>` | [Tabs.tsx](../../design-system/Tabs.tsx) |
| Stepper | `<Stepper steps=… activeStep=…>` | [Stepper.tsx](../../design-system/Stepper.tsx) |
| Status pill | `<Tag color="blue\|green\|red\|orange\|purple\|magenta">` | [Tag.tsx](../../design-system/Tag.tsx) |
| Progress bar | `<ProgressBar value={0–100}>` | [ProgressBar.tsx](../../design-system/ProgressBar.tsx) |
| Modal | `<Modal open onClose title>` | [Modal.tsx](../../design-system/Modal.tsx) |
| Toast / inline alert | `<Notification type="info\|success\|warning\|error" title>` | [Notification.tsx](../../design-system/Notification.tsx) |
| Tooltip | `<Tooltip content>` | [Tooltip.tsx](../../design-system/Tooltip.tsx) |
| Avatar (initials/photo) | `<Avatar name size="xs\|sm\|md\|lg" />` | [Kit.tsx](../../design-system/Kit.tsx) |
| Card | `<Card>` | [Kit.tsx](../../design-system/Kit.tsx) |
| Accordion | `<Accordion items=…>` | [Kit.tsx](../../design-system/Kit.tsx) |
| Icon | `<Icon name="…" size={16\|18\|20\|24} color=…/>` | [Icon.tsx](../../design-system/Icon.tsx) |

### Banned in patient flow code

```tsx
// ❌ Never write a raw <button> for a primary/secondary action.
<button onClick={…}>Save</button>

// ❌ Never recreate dropdowns / popovers from scratch.
<select>...</select>

// ❌ Never build a custom toast/alert div.
<div style={{ background: 'green', … }}>Saved!</div>

// ❌ Never build a custom avatar circle.
<span style={{ borderRadius: '50%', background: '#E8F4F8', … }}>SS</span>

// ❌ Never build a custom step indicator. Use <Stepper>.
<nav>{steps.map(s => <button>… {s.label} …</button>)}</nav>

// ❌ Never build a custom modal/overlay. Use <Modal>.
<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)' }}>…</div>

// ❌ Never build a custom progress bar. Use <ProgressBar>.
<div style={{ height: 4, background: '#E5E7EB' }}><div style={{ width: '40%', background: 'blue' }}/></div>
```

```tsx
// ✅ Use the system primitive instead.
<PrimaryButton size={36} onClick={…}>Save</PrimaryButton>
<DropdownList options={…} value={…} onChange={…} />
<Notification type="success" title="Saved" />
<Avatar name="SS" size="sm" />
<Stepper steps={['Service', 'Details', 'Files', 'Summary']} activeStep={1} orientation="horizontal" />
<Modal open={open} onClose={…} title="…">…</Modal>
<ProgressBar value={40} />
```

### When a primitive doesn't exist

> **Default behavior: stop and ask.** Do not build the new component yourself.

The design system is the single source of truth for visual primitives. Spinning up a new pattern in a feature folder splinters the UI and creates components that drift from the rest of the product. Before adding anything new:

1. **Search the codebase** — there's a real chance it already exists in `src/design-system/` or `src/info/components/` (e.g. `ToothChart`, `ProcedureCard`, `CaseSummaryPanel`). Check first.
2. **If nothing exists, ask first.** Tag the design-system owners (or post in #design-system). Describe the use case, attach the spec or screenshot. Wait for the OK.
3. **Only after approval**, decide together where the new piece lives:
   - **In `design-system/`** if it's reusable across the product (the default, and what owners will usually choose).
   - **In the feature folder** only as an intentional one-off, with the owners' sign-off documented in the PR.
4. Whatever you build still uses design tokens only (see §2). No hard-coded values, ever.

**Example of what NOT to do:** building a "header step indicator" in `CreateOrderWizard.tsx` because `<Stepper>` from `design-system/` doesn't visually match a Figma. The right move is to use `<Stepper>` as-is *or* file a request to extend it. Not to ship a custom one in a feature folder.

---

## 2. Always use Design Tokens — never hard-coded values

All visual values come from CSS variables exposed in [theme.css](../../design-system/theme.css) and re-exported from [tokens.ts](../../design-system/tokens.ts). The full list is below — **do not invent values outside this set.**

### Border radius

| Token | Value | When to use |
|-------|-------|-------------|
| `var(--ads-radius-xs)` | 2px | Hairline accents (active step underline, status dots, thin progress bars) |
| `var(--ads-radius-sm)` | 4px | Buttons, inputs, small chips, hoverable rows |
| `var(--ads-radius-md)` | 8px | Cards, panels, modals, illustration tiles |
| `var(--ads-radius-pill)` | 28px | Pill-shaped controls |
| `var(--ads-radius-full)` | 9999px | Circles (avatars, dots, fully rounded progress bars) |

```tsx
// ❌ Off-token
<div style={{ borderRadius: 12 }} />     // 12px is not a token
<div style={{ borderRadius: 6 }} />      // 6px is not a token
<div style={{ borderRadius: '50%' }} />  // use --ads-radius-full

// ✅ On-token
<div style={{ borderRadius: 'var(--ads-radius-md)' }} />   // 8px card
<div style={{ borderRadius: 'var(--ads-radius-sm)' }} />   // 4px button
<div style={{ borderRadius: 'var(--ads-radius-full)' }} /> // circle
```

If a design calls for a radius that isn't in the table, **snap to the nearest token** rather than hard-coding the off-spec value. (e.g. a 10px corner becomes 8px.)

### Color

Always reference the `--ads-*` CSS variable. Do not paste hex codes.

| Surface | Token |
|---------|-------|
| Page background | `var(--ads-bg-page)` |
| Card / surface | `var(--ads-bg-surface)` |
| Muted hover background | `var(--ads-bg-muted)` |
| Subtle background | `var(--ads-bg-subtle)` |
| Inverse (dark on light theme) | `var(--ads-bg-inverse)` |

| Text | Token |
|------|-------|
| Primary | `var(--ads-text-primary)` |
| Muted | `var(--ads-text-muted)` |
| Subtle | `var(--ads-text-subtle)` |
| Disabled | `var(--ads-text-disabled)` |
| Placeholder | `var(--ads-text-placeholder)` |
| Label | `var(--ads-text-label)` |
| On-primary (text on blue) | `var(--ads-text-on-primary)` |

| Border | Token |
|--------|-------|
| Subtle | `var(--ads-border-subtle)` |
| Default | `var(--ads-border-default)` |
| Strong | `var(--ads-border-strong)` |

| Accent | Token |
|--------|-------|
| Primary action | `var(--ads-blue-500)` |
| Hover | `var(--ads-blue-550)` |
| Pressed | `var(--ads-blue-600)` / `--ads-blue-700` |

| Status | Token |
|--------|-------|
| Success | `var(--ads-success-500)` (`-600` for darker) |
| Warning | `var(--ads-warning-500)` |
| Error / danger | `var(--ads-error-500)` / `var(--ads-danger-500)` |
| Info | `var(--ads-info-500)` |

```tsx
// ❌ Off-token
<span style={{ color: '#007BA3', backgroundColor: '#E8F4F8' }}>SS</span>
<div style={{ borderColor: '#E5E7EB' }} />

// ✅ On-token
<span style={{ color: 'var(--ads-blue-500)', backgroundColor: 'var(--ads-blue-50)' }}>SS</span>
<div style={{ borderColor: 'var(--ads-border-subtle)' }} />
```

For mixing alpha on a token color, use `color-mix()` against the token, not a hex with opacity:

```tsx
// ✅ Tinted blue on the page background
backgroundColor: 'color-mix(in srgb, var(--ads-blue-500) 6%, transparent)',
```

### Spacing

The system uses an 8-step scale (with intermediate values). Prefer multiples from this set: `0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64`. Use `space[…]` from [tokens.ts](../../design-system/tokens.ts) when the value is dynamic; literal pixel values are OK when they come from this set.

### Shadows

| Token | When to use |
|-------|-------------|
| `var(--ads-shadow-sm)` | Subtle card elevation |
| `var(--ads-shadow-md)` | Floating panels, popovers |
| `var(--ads-shadow-lg)` | Modals, large overlays |

```tsx
// ❌ Off-token
boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.04)';

// ✅ On-token
boxShadow: 'var(--ads-shadow-sm)';
```

### Transitions

| Token | Use |
|-------|-----|
| `var(--ads-duration-fast)` (120ms) | Micro-interactions, hover, focus |
| `var(--ads-duration-base)` (180ms) | Card transitions, fade-in/out |
| `var(--ads-ease-standard)` | The single ease curve we use everywhere |

```tsx
// ❌ Off-token
transition: 'all 150ms ease-in-out';

// ✅ On-token
transition: 'background-color var(--ads-duration-fast) var(--ads-ease-standard)';
```

### Z-index

Never invent z-index numbers. Use the `zIndex` constants from [tokens.ts](../../design-system/tokens.ts):

```tsx
import { zIndex } from '../../design-system/tokens';

style={{ zIndex: zIndex.modal }}    // 1050
style={{ zIndex: zIndex.popover }}  // 1060
style={{ zIndex: zIndex.tooltip }}  // 1070
```

### Typography

All visual text in the patient flow must use one of the design-system sizes and weights below. Anything else (16px, 22px, 13.5px, 15px, weight 600 …) is off-token and gets bounced.

#### Font sizes — exhaustive list

From `font.size` in [tokens.ts](../../design-system/tokens.ts):

| Token | px | Use for |
|-------|----|---------|
| `2xs` | 11px | Section captions / uppercase labels (`STEP 1 OF 4`) |
| `xs`  | 12px | Helper text, fine print, tag content, subtle captions |
| `sm`  | 13px | Body label / value text in dense lists, summary rows |
| `base`| 14px | Default body, button labels, table cells, card titles |
| `md`  | 17px | Sub-section heads inside a card (`Service provider`) |
| `lg`  | 20px | Panel titles (`Order summary`) |
| `xl`  | 24px | Page sub-headers |
| `2xl` | 28px | Step / page titles (`Select service`) — **most dominant** |
| `3xl` | 44px | Marketing-scale headlines only — **don't use in product UI** |

#### Font weights — only these three exist

| Token | px | Use for |
|-------|----|---------|
| `regular` | 400 | Body, value text, descriptions |
| `medium`  | 500 | All headings, buttons, emphasized labels |
| `light`   | 300 | Decorative numerals only — almost never |

> **Never use `fontWeight: 600` or `fontWeight: 700`.** The design system collapses `semibold` and `bold` to `500` because the brand never goes heavier than medium. Headings are differentiated by **size**, not weight.

```tsx
// ❌ Off-token
<h1 style={{ fontSize: 22, fontWeight: 600 }}>Order summary</h1>
<div style={{ fontSize: 16 }}>New order</div>
<span style={{ fontSize: 13.5 }}>Some value</span>

// ✅ On-token
<h1 style={{ fontSize: 28, fontWeight: 500 }}>Select service</h1>     // 2xl - page H1
<h2 style={{ fontSize: 20, fontWeight: 500 }}>Order summary</h2>      // lg  - panel H2
<h3 style={{ fontSize: 17, fontWeight: 500 }}>Service provider</h3>   // md  - section H3
<span style={{ fontSize: 14 }}>New order</span>                       // base body
<span style={{ fontSize: 13 }}>13.04.2026</span>                      // sm caption
<span style={{ fontSize: 12 }}>Helper text</span>                     // xs helper
```

#### Hierarchy rule for any new screen

There must be exactly **one** `2xl` (28px) heading per screen — the page/step title. Everything else descends:

```
28px / medium  →  Step or page title           (one per screen)
20px / medium  →  Side-panel title             (Order summary, Treatment summary)
17px / medium  →  Sub-section heading inside a card
14px / medium  →  Card titles, button labels, primary body
13px / regular →  Captions, list-row values
12px / regular →  Helper text, fine print
11px / medium  →  Uppercase eyebrow labels (`STEP 1 OF 4`)
```

#### Line height

Pair font sizes with these line heights — they come from `font.lineHeight`:

| Size  | Pair with |
|-------|-----------|
| 28px  | `36px` (≈ snug 1.28) |
| 24px  | `32px` |
| 20px  | `28px` |
| 17px  | `24px` |
| 14px  | `20px` |
| 13px  | `18px` |
| 12px  | `16px` |
| 11px  | `16px` |

#### Letter spacing — use only `font.tracking` values

| Token | em | Use for |
|-------|----|---------|
| `tighter` | `-0.03em` | Display only |
| `tight`   | `-0.02em` | Large display headings |
| `snug`    | `-0.015em` | Page / panel titles ≥ 17px |
| `normal`  | `0em` | Body, default |
| `wide`    | `0.05em` | Uppercase eyebrow labels (`SERVICE DETAILS`) |

Don't invent values like `-0.005em`, `-0.01em`, `0.04em`, etc. — round to the nearest token above.

#### Font family

Always use `var(--ads-font-sans)` — never inline a font stack like `'Roboto, sans-serif'`.

---

## 3. Theme support

All tokens above resolve correctly in light **and** dark mode automatically. Hard-coded values (hex, rgb) do not — they break theme switching. This is the practical reason for the rules above, not just consistency.

To verify dark mode: toggle via `useTheme()` from [ThemeProvider.tsx](../../design-system/ThemeProvider.tsx) and confirm every surface still reads correctly.

---

## 4. Pre-merge checklist

Before opening a PR that touches the patient flow:

- [ ] **No hard-coded radii.** Search for `borderRadius: ` and check every match resolves to one of the 5 token values above (or `'50%'` is converted to `var(--ads-radius-full)`).
- [ ] **No hex colors** in `style={{}}` blocks (`#xxx`, `rgb(...)`). Search the diff for `#` followed by hex digits and `rgb(`. Anything found needs to become a CSS variable or a `color-mix()` over a variable.
- [ ] **No hand-rolled buttons / dropdowns / avatars / toasts.** Every interactive primitive in the diff comes from `design-system/`.
- [ ] **No literal box shadows.** All shadows use `var(--ads-shadow-*)`.
- [ ] **No literal transitions.** All transitions use `var(--ads-duration-*)` + `var(--ads-ease-standard)`.
- [ ] **No literal z-index.** All z-index values use `zIndex.*` from `tokens.ts`.
- [ ] **Font sizes are token-only.** Search the diff for `fontSize:` and confirm every value is in `{11, 12, 13, 14, 17, 20, 24, 28, 44}`. (Anything else is off-token.)
- [ ] **No `fontWeight: 600` or `700`.** Max weight in this system is `500`. Differentiate hierarchy with size, not weight.
- [ ] **One `28px` heading per screen.** That's the page/step title. Side panels use `20px`, sub-sections `17px`.
- [ ] **No new components in feature folders.** If you added a new visual primitive (custom stepper, custom modal, custom card variant, etc.), it must come from `design-system/` — file a DS request and link it in the PR.
- [ ] **No edits inside `src/design-system/`** unless the PR is explicitly a design-system PR with sign-off from the DS owners.
- [ ] `npm run build` passes.
- [ ] Toggle dark mode — every surface still legible.

---

## 5. Quick grep commands

Run these before pushing — they should return empty (or only intentional exceptions you can justify):

```bash
# Any non-token border radius
grep -rnE 'borderRadius: ?[0-9]' src/components/patient/ src/components/shared/

# Any hex colors
grep -rnE '#[0-9a-fA-F]{3,8}' src/components/patient/ src/components/shared/

# Any rgb()/rgba() literals
grep -rnE 'rgba?\(' src/components/patient/ src/components/shared/

# Raw <button> elements (likely should be a DS button)
grep -rnE '<button( |\n)' src/components/patient/

# Off-token font sizes (anything other than 11, 12, 13, 14, 17, 20, 24, 28, 44)
grep -rnE 'fontSize: ?(15|16|18|19|21|22|23|25|26|27|13\.5|[0-9]+\.[0-9])' src/components/patient/ src/components/shared/

# Off-token font weights (only 300/400/500 are allowed)
grep -rnE 'fontWeight: ?(600|700|800|900)' src/components/patient/ src/components/shared/

# Off-token letter spacing (only -0.03, -0.02, -0.015, 0, 0.05 are allowed)
grep -rnE "letterSpacing: '-?0\\.0(05|01|04|06)" src/components/patient/ src/components/shared/
```
