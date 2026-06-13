# Design System Tokens

## Architecture

```
Primitive tokens (--ds-raw-*)     Implementation palette — never used directly in components
        ↓
Semantic tokens (--ds-*)          What components consume — swap on theme change
        ↓
TypeScript exports (tokens.ts)    Component-facing API: color.primary, space[4], etc.
```

## How theming works

1. **`theme.css`** defines CSS custom properties for `:root` (light) and `.dark` (dark)
2. **`tokens.ts`** exports strings like `'var(--ds-color-primary)'` instead of raw hex
3. Components use tokens via inline styles — dark mode is automatic with zero component changes
4. **`ThemeProvider`** manages the `.dark` class on `<html>` and persists to localStorage

## Token categories

| Category | Prefix | Example |
|---|---|---|
| Surface | `--ds-surface-*` | `--ds-surface-base`, `--ds-surface-raised` |
| Text | `--ds-text-*` | `--ds-text-primary`, `--ds-text-heading` |
| Border | `--ds-border-*` | `--ds-border-default`, `--ds-border-focus` |
| Accent/Brand | `--ds-color-primary*` | `--ds-color-primary`, `--ds-color-primary-hover` |
| Danger | `--ds-color-danger*` | `--ds-color-danger`, `--ds-color-danger-subtle` |
| Success | `--ds-color-success*` | `--ds-color-success`, `--ds-color-success-border` |
| Warning | `--ds-color-warning*` | `--ds-color-warning`, `--ds-color-warning-on` |
| Info | `--ds-color-info*` | `--ds-color-info`, `--ds-color-info-border` |
| Focus | `--ds-focus-ring*` | `--ds-focus-ring`, `--ds-focus-ring-danger` |
| Shadow | `--ds-shadow-*` | `--ds-shadow-sm`, `--ds-shadow-lg` |
| Tag | `--ds-tag-*` | `--ds-tag-red-bg`, `--ds-tag-blue-text` |
| Toggle | `--ds-toggle-*` | `--ds-toggle-on-bg`, `--ds-toggle-knob` |
| Tooltip | `--ds-tooltip-*` | `--ds-tooltip-bg`, `--ds-tooltip-text` |
| Notification | `--ds-notif-*` | `--ds-notif-info-bg`, `--ds-notif-error-icon` |

## Adding a new semantic token

1. **Add the CSS variable** to `theme.css` in both `:root` and `.dark` blocks
2. **Add the TypeScript reference** to `tokens.ts` (e.g., `myToken: 'var(--ds-my-token)'`)
3. **Export** from `index.ts` if it's in a new group
4. **Document contrast ratio** as a comment in `theme.css` for any text-on-surface pairing

## Non-color tokens

| Group | File | Examples |
|---|---|---|
| Spacing | `tokens.ts → space` | `space[1]` = 4px, `space[4]` = 16px (4px grid) |
| Radius | `tokens.ts → radius` | `radius.sm` = 4px, `radius.full` = 9999px |
| Typography | `tokens.ts → font` | `font.size.base` = 14px, `font.weight.semibold` = 600 |
| Shadow | `tokens.ts → shadow` | `shadow.md`, `shadow.focusPrimary` |
| Transition | `tokens.ts → transition` | `transition.fast` = 0.1s, `transition.button` |
| Z-Index | `tokens.ts → zIndex` | `zIndex.modal` = 1050, `zIndex.tooltip` = 1070 |

## Theme switching

```tsx
import { useTheme } from './design-system';

function MyComponent() {
  const { resolvedTheme, toggleTheme, setTheme } = useTheme();
  // resolvedTheme: 'light' | 'dark'
  // setTheme('light' | 'dark' | 'system')
}
```
