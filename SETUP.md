# Quick Setup Guide

## Step 1: Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

## Step 2: Start Development Server

```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev
```

The application will be available at `http://localhost:5173`

## Step 3: Build for Production

```bash
# Using pnpm
pnpm build

# Or using npm
npm run build
```

Output will be in the `/dist` folder.

## File Structure Overview

### Core Application Files (Must Include)

```
src/
├── app/
│   ├── App.tsx                          # ✅ Main entry point
│   └── components/
│       ├── Dashboard.tsx                # ✅ Main dashboard
│       ├── SelectionPanel.tsx           # ✅ Interval Selection modal
│       ├── AdditionalFiltersView.tsx    # ✅ Tab component
│       ├── ComparisonView.tsx           # ✅ Tab component
│       ├── ContinuousRangeView.tsx      # ✅ Tab component
│       ├── DiscreteRangeView.tsx        # ✅ Tab component
│       ├── SaveCombinationModal.tsx     # ✅ Child modal
│       ├── SavedCombinationsView.tsx    # ✅ Tab component
│       ├── figma/
│       │   └── ImageWithFallback.tsx    # ✅ Protected utility
│       └── ui/                          # ✅ All UI components folder
│           ├── accordion.tsx
│           ├── alert-dialog.tsx
│           ├── alert.tsx
│           ├── aspect-ratio.tsx
│           ├── avatar.tsx
│           ├── badge.tsx
│           ├── breadcrumb.tsx
│           ├── button.tsx
│           ├── calendar.tsx
│           ├── card.tsx
│           ├── carousel.tsx
│           ├── chart.tsx
│           ├── checkbox.tsx
│           ├── collapsible.tsx
│           ├── command.tsx
│           ├── context-menu.tsx
│           ├── dialog.tsx
│           ├── drawer.tsx
│           ├── dropdown-menu.tsx
│           ├── form.tsx
│           ├── hover-card.tsx
│           ├── input-otp.tsx
│           ├── input.tsx
│           ├── label.tsx
│           ├── menubar.tsx
│           ├── navigation-menu.tsx
│           ├── pagination.tsx
│           ├── popover.tsx
│           ├── progress.tsx
│           ├── radio-group.tsx
│           ├── resizable.tsx
│           ├── scroll-area.tsx
│           ├── select.tsx
│           ├── separator.tsx
│           ├── sheet.tsx
│           ├── sidebar.tsx
│           ├── skeleton.tsx
│           ├── slider.tsx
│           ├── sonner.tsx
│           ├── switch.tsx
│           ├── table.tsx
│           ├── tabs.tsx
│           ├── textarea.tsx
│           ├── toggle-group.tsx
│           ├── toggle.tsx
│           ├── tooltip.tsx
│           ├── use-mobile.ts
│           └── utils.ts
├── imports/                             # ✅ Figma imports
│   ├── Button-52-38711.tsx
│   ├── Button.tsx
│   ├── FooterWrapper.tsx
│   ├── Rectangle39.tsx
│   └── svg-c0glgoh4zk.ts
└── styles/                              # ✅ All styles
    ├── index.css
    ├── tailwind.css
    ├── theme.css
    └── fonts.css
```

### Configuration Files (Must Include)

```
/
├── package.json            # ✅ Dependencies
├── vite.config.ts         # ✅ Vite configuration
└── postcss.config.mjs     # ✅ PostCSS configuration
```

## Environment Requirements

- **Node.js**: 18.x or 20.x
- **Package Manager**: pnpm (preferred) or npm
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

## Troubleshooting

### Issue: Dependencies won't install
**Solution**: Clear cache and try again
```bash
# pnpm
pnpm store prune
pnpm install

# npm
npm cache clean --force
npm install
```

### Issue: Port 5173 already in use
**Solution**: Kill the process or use a different port
```bash
# Kill process on port 5173 (Mac/Linux)
lsof -ti:5173 | xargs kill

# Or specify a different port
vite --port 3000
```

### Issue: Build fails
**Solution**: Check Node.js version
```bash
node --version  # Should be 18.x or 20.x
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Start dev server
3. ✅ Open browser to http://localhost:5173
4. ✅ Click "Selection" in top navigation to open the modal
5. ✅ Test all tabs and interactions

## Additional Resources

- **Developer Handoff Doc**: `/DEVELOPER_HANDOFF.md` - Complete technical documentation
- **Component Files**: All components have inline comments
- **Vite Documentation**: https://vitejs.dev/
- **React Documentation**: https://react.dev/
- **Tailwind CSS v4**: https://tailwindcss.com/docs
