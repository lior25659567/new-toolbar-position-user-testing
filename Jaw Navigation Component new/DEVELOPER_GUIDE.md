# 👨‍💻 Developer Guide - Dental Application

## Quick Start for Cursor IDE

This guide helps you navigate and work with the reorganized codebase efficiently in Cursor.

## 📂 Where to Find Things

### Working with Header Components
**Location**: `/src/app/components/header/`

```typescript
// Import the main header
import { HeaderNavigation } from '@/app/components/header';

// Or import specific subcomponents
import { Logo, WizardSteps, NavigationIcons } from '@/app/components/header';
```

**Files**:
- `HeaderNavigation.tsx` - Main container
- `Logo.tsx` - iTero branding
- `WizardSteps.tsx` - Info → Scan → View → Send navigation
- `NavigationIcons.tsx` - Lock, battery, notifications, settings

### Working with Panels
**Location**: `/src/app/components/panels/`

```typescript
// Import all panels at once
import { MarginPanel, TrimPanel, PrepEditPanel } from '@/app/components/panels';
```

**Files**:
- `MarginPanel.tsx` - Margin line detection (420px width)
- `TrimPanel.tsx` - Scan trimming tool (420px width)
- `PrepEditPanel.tsx` - Prep review tool (420px width)

### Working with Jaw Navigation
**Location**: `/src/app/components/JawNavigation.tsx`

```typescript
import JawNavigation from '@/app/components/JawNavigation';
```

### Working with Types
**Location**: `/src/app/types/dental.ts`

```typescript
import type { 
  WizardStep, 
  ToothId, 
  JawView,
  MarginPanelProps,
  // ... etc
} from '@/app/types/dental';
```

### Working with Constants
**Location**: `/src/app/constants/theme.ts`

```typescript
import { COLORS, SIZES, SPACING } from '@/app/constants/theme';

// Usage
backgroundColor: COLORS.primary,  // #009ace
width: SIZES.panelWidth,          // 420px
```

### Working with Pages
**Location**: `/src/app/pages/DentalWorkspace.tsx`

This is the main workspace that combines all components.

## 🛠️ Common Tasks

### Task 1: Add a New Panel

**Step 1**: Create the component file
```bash
# Create file at: /src/app/components/panels/MyNewPanel.tsx
```

**Step 2**: Add the interface to types
```typescript
// File: /src/app/types/dental.ts

export interface MyNewPanelProps {
  onAction: () => void;
  isActive: boolean;
  // ... more props
}
```

**Step 3**: Create the component
```typescript
// File: /src/app/components/panels/MyNewPanel.tsx

import type { MyNewPanelProps } from '@/app/types/dental';

export function MyNewPanel({ onAction, isActive }: MyNewPanelProps) {
  return (
    <div className="bg-white flex flex-col items-start relative rounded-[16px] w-[420px] shadow-lg">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <h2 className="text-[20px] font-semibold text-gray-800">My New Tool</h2>
      </div>
      
      {/* Content */}
      <div className="w-full px-6 py-8 flex flex-col gap-4">
        <button 
          onClick={onAction}
          className="w-full h-16 bg-[#009ace] hover:bg-[#0088b8] text-white rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-lg"
        >
          Action Button
        </button>
      </div>
    </div>
  );
}
```

**Step 4**: Export from index
```typescript
// File: /src/app/components/panels/index.ts

export { MarginPanel } from './MarginPanel';
export { TrimPanel } from './TrimPanel';
export { PrepEditPanel } from './PrepEditPanel';
export { MyNewPanel } from './MyNewPanel';  // Add this line
```

**Step 5**: Use in DentalWorkspace
```typescript
// File: /src/app/pages/DentalWorkspace.tsx

import { MarginPanel, TrimPanel, PrepEditPanel, MyNewPanel } from '@/app/components/panels';

// ... in the component
<MyNewPanel 
  onAction={() => console.log('Action clicked')}
  isActive={true}
/>
```

### Task 2: Modify a Type

**Step 1**: Open the types file
```bash
/src/app/types/dental.ts
```

**Step 2**: Modify or add types
```typescript
// Add a new property
export interface MarginPanelProps {
  selectedTooth: string;
  jawType: string;
  isAdvancedMode?: boolean;  // ← New optional property
  // ... rest
}
```

**Step 3**: TypeScript will show errors where you need to update
Use Cursor's TypeScript support to find all usages.

### Task 3: Update Colors/Styling

**Step 1**: Check the theme constants
```typescript
// File: /src/app/constants/theme.ts

export const COLORS = {
  primary: '#009ace',  // ← Modify here
  // ...
};
```

**Step 2**: Use in components
```typescript
import { COLORS } from '@/app/constants/theme';

<button className="bg-[#009ace]">  {/* Or use COLORS.primary in inline styles */}
```

### Task 4: Add a Header Icon

**Step 1**: Open NavigationIcons component
```bash
/src/app/components/header/NavigationIcons.tsx
```

**Step 2**: Add new icon function
```typescript
function MyNewIcon() {
  return (
    <div className="content-stretch flex items-center overflow-clip p-[14px] relative shrink-0 cursor-pointer hover:bg-gray-100 rounded-[4px] transition-colors">
      {/* Your SVG here */}
    </div>
  );
}
```

**Step 3**: Add to NavigationIcons export
```typescript
export function NavigationIcons() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0">
      <Icon />
      <Icon1 />
      <Icon2 />
      <Icon3 />
      <MyNewIcon />  {/* ← Add here */}
    </div>
  );
}
```

## 🔍 Using Cursor Effectively

### Find All Usages
1. Right-click on any component/type
2. Select "Find All References"
3. See everywhere it's used

### Go to Definition
1. Cmd/Ctrl + Click on any import
2. Jump directly to the definition

### Rename Symbol
1. Right-click on component/type name
2. Select "Rename Symbol"
3. Updates everywhere automatically

### Search in Files
1. Cmd/Ctrl + Shift + F
2. Search for component names, props, etc.
3. Filter by file type (*.tsx, *.ts)

## 📋 Cheat Sheet

### Import Patterns
```typescript
// Components
import { HeaderNavigation } from '@/app/components/header';
import { MarginPanel } from '@/app/components/panels';
import JawNavigation from '@/app/components/JawNavigation';

// Types
import type { WizardStep, MarginPanelProps } from '@/app/types/dental';

// Constants
import { COLORS, SIZES } from '@/app/constants/theme';

// Pages
import DentalWorkspace from '@/app/pages/DentalWorkspace';
```

### Panel Template
```typescript
export function MyPanel({ onAction }: MyPanelProps) {
  return (
    <div className="bg-white flex flex-col items-start relative rounded-[16px] w-[420px] shadow-lg">
      {/* Header with drag handle */}
      <div className="w-full flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <div className="flex flex-col gap-[3px]">
            <div className="flex gap-[3px]">
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            </div>
            <div className="flex gap-[3px]">
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            </div>
          </div>
          <h2 className="text-[20px] font-semibold text-gray-800">Panel Title</h2>
        </div>
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      {/* Content */}
      <div className="w-full px-6 py-8 flex flex-col gap-4">
        {/* Your content here */}
      </div>
    </div>
  );
}
```

### Button Styles
```typescript
// Primary Action (iTero Blue)
className="w-full h-16 bg-[#009ace] hover:bg-[#0088b8] text-white rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-lg"

// Secondary Action
className="h-20 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors"
```

## 🐛 Troubleshooting

### Import Error
**Problem**: `Cannot find module '@/app/components/...'`  
**Solution**: Make sure you're using `@` alias, not relative paths

### Type Error
**Problem**: `Property doesn't exist on type...`  
**Solution**: Check `/src/app/types/dental.ts` for the correct interface

### Component Not Rendering
**Problem**: Component imported but not showing  
**Solution**: Check if it's conditionally rendered in DentalWorkspace

### Styling Issues
**Problem**: Custom styles not applying  
**Solution**: Check if Tailwind classes are correct, check theme.css for base styles

## 📚 Best Practices

1. **Always use TypeScript types** - Import from `/types/dental.ts`
2. **Use absolute imports** - `@/app/...` not `../../...`
3. **Export through index.ts** - Keep barrel exports clean
4. **Consistent panel width** - All panels should be 420px
5. **Use iTero blue** - Primary actions should be #009ace
6. **Document complex logic** - Add comments for future maintainers
7. **Keep components focused** - One responsibility per component

## 🎯 Key Files to Know

| File | Purpose | When to Edit |
|------|---------|--------------|
| `/src/app/types/dental.ts` | All TypeScript types | Adding/modifying component props |
| `/src/app/constants/theme.ts` | Colors, sizes, spacing | Changing theme values |
| `/src/app/pages/DentalWorkspace.tsx` | Main workspace | Adding panels, managing state |
| `/src/app/components/panels/index.ts` | Panel exports | After creating new panel |
| `/src/app/components/header/index.ts` | Header exports | After creating new header component |

---

**Need Help?**
- See `/src/app/README.md` for detailed documentation
- See `/STRUCTURE.md` for folder structure visualization
- Check component files for inline documentation

**Happy Coding! 🚀**
