# IBM Z IntelliMagic Vision Dashboard

A React-based web application featuring a comprehensive dashboard and advanced Interval Selection modal system.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

Visit `http://localhost:5173` after starting the dev server.

## 📚 Documentation

**Start here:** 
1. **[SETUP.md](./SETUP.md)** - Quick setup guide and installation
2. **[DEVELOPER_HANDOFF.md](./DEVELOPER_HANDOFF.md)** - Complete technical documentation
3. **[FILE_EXPORT_CHECKLIST.md](./FILE_EXPORT_CHECKLIST.md)** - File inventory and verification
4. **[CODE_REFERENCE.md](./CODE_REFERENCE.md)** - Configuration code reference
5. **[EXPORT_SUMMARY.md](./EXPORT_SUMMARY.md)** - Export package overview

## 🎯 Key Features

- **Dashboard**: Three-column layout with navigation, content, and alerts
- **Interval Selection Modal**: Complex time range selection with 7 tabs
- **Nested Modals**: Save Combination modal over parent modal
- **IBM Design**: Carbon Design System with IBM Plex Sans font
- **Responsive**: Desktop-optimized interface

## 🛠️ Tech Stack

- React 18.3.1
- TypeScript
- Vite 6.3.5
- Tailwind CSS v4
- Radix UI + Material UI
- Lucide React icons

## 📁 Project Structure

```
src/
├── app/
│   ├── App.tsx                    # Main entry
│   └── components/
│       ├── Dashboard.tsx          # Main dashboard
│       ├── SelectionPanel.tsx     # Interval Selection modal
│       ├── [7 more components]    # Tab views
│       ├── ui/                    # 47 UI components
│       └── figma/                 # Utilities
├── imports/                       # Figma imports (5 files)
└── styles/                        # CSS files (4 files)
```

## ✅ Testing the Application

1. Start the dev server
2. Click **"Selection"** in the top navigation
3. Test all 7 tabs in the modal
4. Click **"Save combination"** to test the child modal

## 📦 Build Output

Production build creates optimized files in `/dist`:
```bash
pnpm build
```

## 🔧 Requirements

- Node.js 18.x or 20.x
- pnpm (recommended) or npm
- Modern browser (Chrome, Firefox, Safari, Edge)

## 🆘 Troubleshooting

See **[SETUP.md](./SETUP.md)** troubleshooting section for common issues.

## 📄 License

Private - Not for public distribution

---

**Version**: 1.0.0  
**Last Updated**: February 9, 2026  

For detailed documentation, see **[DEVELOPER_HANDOFF.md](./DEVELOPER_HANDOFF.md)**
