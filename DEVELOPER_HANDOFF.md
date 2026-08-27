# IBM Z IntelliMagic Vision - Developer Handoff Documentation

## Project Overview

This is a React-based web application for IBM Z IntelliMagic Vision dashboard with an advanced Interval Selection modal system. The application features:

- **Main Dashboard**: Three-column layout with navigation sidebar, main content area, and alerts panel
- **Interval Selection Modal**: Complex time range selection interface with multiple tabs and configurations
- **Nested Modal System**: Support for child modals (Save Combination) over parent modals
- **IBM Carbon Design System**: Uses IBM design principles with IBM Plex Sans font

## Technology Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, Material UI
- **Icons**: Lucide React
- **Typography**: IBM Plex Sans (loaded from Google Fonts)

## Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── App.tsx                          # Main application entry point
│   │   └── components/
│   │       ├── Dashboard.tsx                # Main dashboard component
│   │       ├── SelectionPanel.tsx           # Interval Selection modal
│   │       ├── AdditionalFiltersView.tsx    # Additional Filters tab
│   │       ├── ComparisonView.tsx           # Comparison tab
│   │       ├── ContinuousRangeView.tsx      # Continuous Range tab
│   │       ├── DiscreteRangeView.tsx        # Discrete Range tab
│   │       ├── SaveCombinationModal.tsx     # Save modal (child modal)
│   │       ├── SavedCombinationsView.tsx    # Saved Combinations tab
│   │       ├── ui/                          # Reusable UI components (Radix)
│   │       └── figma/
│   │           └── ImageWithFallback.tsx    # Protected file
│   ├── imports/                             # Figma-imported components
│   │   ├── Button-52-38711.tsx
│   │   ├── Button.tsx
│   │   ├── FooterWrapper.tsx
│   │   ├── Rectangle39.tsx
│   │   └── svg-c0glgoh4zk.ts
│   └── styles/
│       ├── index.css                        # Main CSS entry
│       ├── tailwind.css                     # Tailwind imports
│       ├── theme.css                        # CSS custom properties
│       └── fonts.css                        # Font imports
├── package.json
├── vite.config.ts
└── postcss.config.mjs

```

## Setup Instructions

### Prerequisites

- Node.js 18+ or 20+
- pnpm (recommended) or npm

### Installation

1. **Clone or extract the project files**

2. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Build for production**:
   ```bash
   pnpm build
   # or
   npm run build
   ```

## Key Features & Behaviors

### Dashboard (Dashboard.tsx)

- **Three-column layout**: Left navigation sidebar, main content area, right alerts panel
- **Collapsible sections**: "My Dashboards", "Shared Dashboards", "Reports"
- **Top navigation**: Dashboard, Edit Dashboard, Create Report, Selection, Export
- **Selection button**: Opens the Interval Selection modal
- **Light mode header**: White background with gray text
- **Right toolbar**: AI, Files, Favorites, Settings icons

### Interval Selection Modal (SelectionPanel.tsx)

**Modal Features**:
- Fixed size: 1400px width, viewport-adjusted height
- Centered on screen with dark overlay (50% opacity)
- Preview panel on the right (360px width)
- Seven tabs: Time range, Additional Filters, Comparison, Interest group, Discrete Range, Continuous Range, Saved Combinations

**Default States**:

1. **Time range tab (Default)**:
   - Presets sub-tab selected
   - "All data" quick option selected by default
   - "8 hours" interval selected
   - All other sections empty until user interacts

2. **Comparison tab**:
   - Opens with completely empty fields
   - Requires user input to populate

3. **Interest group tab**:
   - Dropdown shows placeholder "Select interest group"
   - No initial selection
   - Preview panel hides interest group section when empty

4. **Other tabs**:
   - Empty states, waiting for user input

**Preview Panel**:
- Shows live preview of selections
- Hides sections with no data
- Updates dynamically as user makes changes

**State Persistence**:
- Selections are remembered during the session
- State is maintained when switching between tabs

### Nested Modal System

**Save Combination Modal** (SaveCombinationModal.tsx):
- Opens on top of Interval Selection modal
- Parent modal remains visible with 30% black overlay
- Two text inputs: Name (required) and Description
- Save and Cancel buttons with IBM styling

### Styling System

**Colors**:
- Primary Blue: `#0f62fe` (IBM Blue 60)
- Hover Blue: `#0050e6` (IBM Blue 70)
- Background Gray: `#f4f4f4`
- Border Gray: `#e0e0e0`

**Typography**:
- Font Family: IBM Plex Sans (all weights: 300, 400, 500, 600, 700)
- Loaded from Google Fonts in `/src/styles/fonts.css`

**Buttons**:
- Primary: Blue background, white text, 48px height, 16px padding
- Secondary: White background, gray border, blue text
- IBM Carbon Design System footer pattern

## Protected Files

**DO NOT MODIFY**:
- `/src/app/components/figma/ImageWithFallback.tsx`
- `/pnpm-lock.yaml`

## Component Dependencies

### SelectionPanel.tsx Dependencies
```typescript
import { X, ChevronDown, Check, Info } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Button as ShadcnButton } from "./ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
// ... and more
```

### Dashboard.tsx Dependencies
```typescript
import { ChevronDown, ChevronRight, Plus, Search, HelpCircle, 
         Settings, FileText, Edit, FileBarChart, List, Download, 
         Minus, ExternalLink, MoreVertical, Star, Sparkles } from 'lucide-react';
import { SelectionPanel } from './SelectionPanel';
```

## Important Implementation Details

### Time Range Tab State Management

The Time range tab uses complex state management:
```typescript
const [selectedQuickOption, setSelectedQuickOption] = useState<string>('All data');
const [selectedInterval, setSelectedInterval] = useState<string>('8 hours');
const [selectedPresetTab, setSelectedPresetTab] = useState<string>('presets');
```

### Modal Overlay Pattern

Parent modal overlay:
```typescript
<div className="fixed inset-0 bg-[rgba(22,22,22,0.5)] z-40" />
```

Child modal overlay (when Save modal opens):
```typescript
<div className="fixed inset-0 bg-black/30 z-[60]" />
```

### Responsive Considerations

- Dashboard: Optimized for desktop (minimum 1280px recommended)
- Modal: Fixed size, centered, with overflow handling
- Forms: Inputs are full-width within their containers

## Build Output

Production build creates optimized files in `/dist` directory:
- Minified JavaScript bundles
- Optimized CSS
- Asset files

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript required
- CSS Grid and Flexbox support required

## Known Limitations

1. No backend integration (frontend only)
2. No real data persistence (session state only)
3. No authentication system
4. Modal is not mobile-optimized

## Future Enhancement Suggestions

1. Add backend API integration
2. Implement real data persistence (database)
3. Add user authentication
4. Create responsive mobile views
5. Add keyboard shortcuts for modal navigation
6. Implement form validation with error messages
7. Add loading states and error boundaries

## Support & Questions

For questions about the codebase or implementation details, refer to:
- Component files for inline comments
- `/guidelines/Guidelines.md` for additional context

---

**Last Updated**: February 9, 2026
**Version**: 1.0.0
