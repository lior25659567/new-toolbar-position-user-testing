# Dental Application - Code Organization

This document explains the organization and structure of the dental application codebase.

## 📁 Folder Structure

```
/src/app/
├── types/              # TypeScript type definitions
│   └── dental.ts       # Dental-related types and interfaces
├── constants/          # Application constants
│   └── theme.ts        # Theme colors, sizes, and spacing
├── components/         # React components organized by feature
│   ├── header/         # Header navigation components
│   │   ├── HeaderNavigation.tsx    # Main header component
│   │   ├── Logo.tsx                # iTero logo
│   │   ├── WizardSteps.tsx         # Step navigation UI
│   │   ├── NavigationIcons.tsx     # Right side icons
│   │   └── index.ts                # Barrel exports
│   ├── jaw/            # Jaw navigation components
│   │   ├── JawNavigation.tsx       # Main jaw component
│   │   └── index.ts                # Barrel exports
│   ├── panels/         # Panel components
│   │   ├── MarginPanel.tsx         # Margin line controls
│   │   ├── TrimPanel.tsx           # Trim tool controls
│   │   ├── PrepEditPanel.tsx       # Prep review controls
│   │   └── index.ts                # Barrel exports
│   └── figma/          # Figma-generated components (protected)
├── pages/              # Page components
│   └── DentalWorkspace.tsx         # Main workspace page
└── App.tsx             # Application entry point

```

## 🎯 Key Principles

### 1. **Feature-Based Organization**
Components are grouped by feature/domain rather than by type:
- Header components in `/header`
- Jaw navigation in `/jaw`
- Panels in `/panels`

### 2. **Centralized Types**
All TypeScript types and interfaces are defined in `/types/dental.ts` for:
- Better type reusability
- Single source of truth
- Easier refactoring

### 3. **Barrel Exports**
Each component folder has an `index.ts` file that re-exports components:
```typescript
// Clean imports
import { HeaderNavigation } from '@/app/components/header';
import { MarginPanel, TrimPanel } from '@/app/components/panels';
```

### 4. **Consistent Naming**
- Component files: `PascalCase.tsx`
- Type files: `camelCase.ts`
- Folders: `lowercase`

## 🔧 Component Details

### Header Navigation (`/components/header/`)
**Purpose**: Top navigation bar with branding and wizard steps

**Components**:
- `HeaderNavigation.tsx` - Main container orchestrating all header elements
- `Logo.tsx` - iTero logo SVG component
- `WizardSteps.tsx` - Info → Scan → View → Send navigation
- `NavigationIcons.tsx` - Lock, battery, notifications, settings icons

**Usage**:
```typescript
import { HeaderNavigation } from '@/app/components/header';

<HeaderNavigation 
  currentStep="scan"
  patientName="Patient: Mina Y."
  onStepChange={(step) => console.log(step)}
/>
```

### Jaw Navigation (`/components/jaw/`)
**Purpose**: Interactive dental chart with tooth selection

**Components**:
- `JawNavigation.tsx` - Renders upper/lower arches with tooth elements

**Usage**:
```typescript
import JawNavigation from '@/app/components/JawNavigation';

<JawNavigation 
  onToothSelect={(toothId) => console.log(toothId)}
/>
```

### Panels (`/components/panels/`)
**Purpose**: Floating control panels for dental tools

**Components**:
- `MarginPanel.tsx` - Margin line detection and drawing (420px width)
- `TrimPanel.tsx` - Scan trimming controls (420px width)
- `PrepEditPanel.tsx` - Prep review and editing (420px width)

**Usage**:
```typescript
import { MarginPanel, TrimPanel, PrepEditPanel } from '@/app/components/panels';

<MarginPanel
  selectedTooth="11"
  jawType="Upper Jaw"
  onDetect={() => {}}
  onManual={() => {}}
  // ... other handlers
/>
```

## 📝 Type System

All types are centralized in `/types/dental.ts`:

```typescript
// Wizard navigation
export type WizardStep = 'info' | 'scan' | 'view' | 'send';

// Tooth and jaw
export type ToothId = string;
export type JawView = 'upper' | 'lower' | 'bite';

// Component props
export interface HeaderNavigationProps { /* ... */ }
export interface MarginPanelProps { /* ... */ }
// ...and more
```

## 🎨 Theme System

Theme constants in `/constants/theme.ts`:

```typescript
export const COLORS = {
  primary: '#009ace',        // iTero blue
  primaryHover: '#0088b8',
  // ...
};

export const SIZES = {
  panelWidth: '420px',
  headerHeight: '72px',
};
```

## 📄 Pages

### DentalWorkspace (`/pages/DentalWorkspace.tsx`)
**Purpose**: Main workspace combining all dental components

**Responsibilities**:
- State management for tooth selection
- Panel visibility control
- Event handler coordination
- Layout composition

## 🚀 Development Workflow

### Adding a New Component

1. **Determine the feature domain** (header, jaw, panel, etc.)
2. **Create the component file** in the appropriate folder
3. **Define types** in `/types/dental.ts` if needed
4. **Export from index.ts** in that folder
5. **Import using the barrel export**:
   ```typescript
   import { MyComponent } from '@/app/components/feature';
   ```

### Adding a New Panel

1. Create `MyPanel.tsx` in `/components/panels/`
2. Add interface to `/types/dental.ts`:
   ```typescript
   export interface MyPanelProps {
     // props
   }
   ```
3. Export from `/components/panels/index.ts`:
   ```typescript
   export { MyPanel } from './MyPanel';
   ```
4. Use consistent 420px width and iTero blue (#009ace)

### Modifying Types

1. Update `/types/dental.ts` - single source of truth
2. Types automatically propagate to all components
3. TypeScript will catch any breaking changes

## 🔍 Import Paths

Always use absolute imports with the `@` alias:

```typescript
// ✅ Good
import { MarginPanel } from '@/app/components/panels';
import type { WizardStep } from '@/app/types/dental';
import { COLORS } from '@/app/constants/theme';

// ❌ Avoid
import { MarginPanel } from '../../components/panels/MarginPanel';
```

## 🎯 Best Practices

1. **Keep components focused** - Each component has a single responsibility
2. **Use types** - Import types from `/types/dental.ts`
3. **Consistent styling** - Use iTero blue (#009ace) for primary actions
4. **Panel dimensions** - All panels are 420px wide
5. **Barrel exports** - Always export through `index.ts` files
6. **Documentation** - Add comments for complex logic

## 📦 Component Dependencies

```
DentalWorkspace
├── HeaderNavigation
│   ├── Logo
│   ├── WizardSteps
│   └── NavigationIcons
├── JawNavigation
└── Panels
    ├── MarginPanel
    ├── TrimPanel
    └── PrepEditPanel
```

## 🔐 Protected Files

Do not modify these system files:
- `/src/app/components/figma/ImageWithFallback.tsx`
- Any files in `/src/imports/` (Figma assets)

## 📚 Additional Resources

- **Vite Alias**: `@` maps to `/src`
- **Tailwind**: v4 with custom theme in `/src/styles/theme.css`
- **SVG Assets**: Imported from `/src/imports/` using absolute paths

---

**Last Updated**: January 2025
**Maintainer**: Dental App Team
