# 🏗️ Dental Application - Folder Structure

## Complete Project Organization

```
dental-app/
│
├── src/
│   ├── app/
│   │   ├── 📄 App.tsx                          # Entry point - renders DentalWorkspace
│   │   ├── 📖 README.md                        # Documentation for code organization
│   │   │
│   │   ├── 📁 types/                           # Type Definitions
│   │   │   └── dental.ts                       # All TypeScript interfaces & types
│   │   │       ├── WizardStep
│   │   │       ├── ToothId, JawView
│   │   │       ├── HeaderNavigationProps
│   │   │       ├── JawNavigationProps
│   │   │       ├── MarginPanelProps
│   │   │       ├── TrimPanelProps
│   │   │       └── PrepEditPanelProps
│   │   │
│   │   ├── 📁 constants/                       # Application Constants
│   │   │   └── theme.ts                        # Colors, sizes, spacing
│   │   │       ├── COLORS (iTero blue #009ace)
│   │   │       ├── SIZES (panel: 420px)
│   │   │       └── SPACING
│   │   │
│   │   ├── 📁 components/                      # React Components
│   │   │   │
│   │   │   ├── 📁 header/                      # Header Navigation Feature
│   │   │   │   ├── HeaderNavigation.tsx        # Main header container
│   │   │   │   ├── Logo.tsx                    # iTero logo component
│   │   │   │   ├── WizardSteps.tsx             # Info→Scan→View→Send steps
│   │   │   │   ├── NavigationIcons.tsx         # Lock, battery, notification, settings
│   │   │   │   └── index.ts                    # Barrel export
│   │   │   │
│   │   │   ├── 📁 jaw/                         # Jaw Navigation Feature
│   │   │   │   └── index.ts                    # Barrel export
│   │   │   │
│   │   │   ├── 📁 panels/                      # Panel Controls Feature
│   │   │   │   ├── MarginPanel.tsx             # Margin line tool (420px)
│   │   │   │   ├── TrimPanel.tsx               # Trim tool (420px)
│   │   │   │   ├── PrepEditPanel.tsx           # Prep review tool (420px)
│   │   │   │   └── index.ts                    # Barrel export
│   │   │   │
│   │   │   ├── JawNavigation.tsx               # Interactive dental chart
│   │   │   │
│   │   │   ├── 📁 figma/                       # Protected Figma components
│   │   │   │   └── ImageWithFallback.tsx       # DO NOT MODIFY
│   │   │   │
│   │   │   └── 📁 ui/                          # Shared UI components
│   │   │
│   │   └── 📁 pages/                           # Page Components
│   │       └── DentalWorkspace.tsx             # Main workspace page
│   │
│   ├── imports/                                # Figma-generated assets (SVGs, images)
│   └── styles/                                 # Global styles & theme CSS
│
└── package.json
```

## 🎯 Import Pattern Examples

### Importing Components
```typescript
// ✅ Header
import { HeaderNavigation } from '@/app/components/header';

// ✅ Panels
import { MarginPanel, TrimPanel, PrepEditPanel } from '@/app/components/panels';

// ✅ Jaw Navigation
import JawNavigation from '@/app/components/JawNavigation';

// ✅ Types
import type { WizardStep, MarginPanelProps } from '@/app/types/dental';

// ✅ Constants
import { COLORS, SIZES } from '@/app/constants/theme';
```

## 📊 Component Hierarchy

```
App.tsx
└── DentalWorkspace.tsx
    ├── HeaderNavigation
    │   ├── Logo
    │   ├── WizardSteps
    │   └── NavigationIcons
    │
    ├── MarginPanel (conditional)
    │
    ├── JawNavigation
    │   ├── UpperArch
    │   ├── LowerArch
    │   └── JawSelector
    │
    ├── TrimPanel (conditional)
    │
    └── PrepEditPanel (conditional)
```

## 🔄 Data Flow

```
DentalWorkspace (State Container)
    │
    ├─► currentStep: WizardStep
    │   └─► HeaderNavigation
    │       └─► WizardSteps
    │
    ├─► selectedTooth: string | null
    │   ├─► JawNavigation (emits)
    │   └─► MarginPanel (consumes)
    │
    └─► panel visibility states
        ├─► showMarginPanel
        ├─► showTrimPanel
        └─► showPrepEditPanel
```

## 🎨 Styling System

```
Tailwind v4
├── Base styles in /src/styles/theme.css
├── Inline Tailwind classes for overrides
└── Constants in /src/app/constants/theme.ts
    ├── Primary color: #009ace (iTero blue)
    ├── Panel width: 420px
    └── Header height: 72px
```

## 📝 File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `HeaderNavigation.tsx` |
| Types | camelCase | `dental.ts` |
| Constants | camelCase | `theme.ts` |
| Folders | lowercase | `components/`, `panels/` |
| Barrel exports | lowercase | `index.ts` |

## 🚀 Quick Reference

### Adding a New Component
1. Choose feature folder (`header/`, `jaw/`, `panels/`)
2. Create `ComponentName.tsx`
3. Add types to `/types/dental.ts`
4. Export in `index.ts`
5. Import using barrel export

### Adding a New Panel
1. Create in `/components/panels/NewPanel.tsx`
2. Add interface to `/types/dental.ts`
3. Export in `/components/panels/index.ts`
4. Use 420px width & iTero blue (#009ace)

### Modifying Types
1. Edit `/types/dental.ts` only
2. Types propagate automatically
3. TypeScript catches breaking changes

---

**Benefits of This Structure:**

✅ **Clear Separation**: Each feature has its own folder  
✅ **Type Safety**: Centralized type definitions  
✅ **Easy Navigation**: Logical grouping in Cursor  
✅ **Scalable**: Easy to add new features  
✅ **Maintainable**: Clean imports with barrel exports  
✅ **Self-Documenting**: Folder names describe contents  

---

**Last Updated**: January 2025
