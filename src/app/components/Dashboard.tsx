import { useState } from 'react';
import type React from 'react';
import { SelectionPanel } from './SelectionPanel';
import { Home1Content } from './Home1Content';
import { Home2Content } from './Home2Content';

// Inline SVG icons — replaces broken localhost:3845 asset URLs

// Dashboard icon (grid squares)
const IcoDashboard = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <rect x="1" y="1" width="5" height="5" rx="0.5" stroke="#101828" strokeWidth="1.1" strokeLinejoin="round" />
    <rect x="8" y="1" width="5" height="5" rx="0.5" stroke="#101828" strokeWidth="1.1" strokeLinejoin="round" />
    <rect x="1" y="8" width="5" height="5" rx="0.5" stroke="#101828" strokeWidth="1.1" strokeLinejoin="round" />
    <rect x="8" y="8" width="5" height="5" rx="0.5" stroke="#101828" strokeWidth="1.1" strokeLinejoin="round" />
  </svg>
);

// Edit Dashboard icon (pencil)
const IcoEdit = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M2 10.5V12h1.5l4.83-4.83-1.5-1.5L2 10.5zM12.71 3.04a1 1 0 0 0 0-1.41L11.37.29a1 1 0 0 0-1.41 0L8.74 1.51l2.83 2.83 1.14-1.3z" fill="#101828" />
    <path d="M1.5 9.83V11.5H3.17L9.5 5.17 7.83 3.5 1.5 9.83z" stroke="#101828" strokeWidth="0.8" fill="none" />
    <path d="M10.76 1.24a1 1 0 0 1 1.41 0l.59.59a1 1 0 0 1 0 1.41L11.5 4.5 9.5 2.5l1.26-1.26z" fill="#101828" />
    <path d="M1.5 10V12H3.5L10.5 5 8.5 3 1.5 10z" fill="#101828" />
  </svg>
);

// Create Report icon (document with lines)
const IcoReport = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M8.5 1H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5L8.5 1z" stroke="#101828" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.5 1v3.5H12" stroke="#101828" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 7h5M4.5 9.5h5M4.5 5h2" stroke="#101828" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

// Selection icon (list with pointer)
const IcoSelection = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M1.5 3.5h11M1.5 7h7M1.5 10.5h5" stroke="#101828" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M9 9l4 4M9 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="#101828" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Filter icon (funnel)
const IcoFilter = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M1.5 2.5h11l-4 5v4l-3-1.5V7.5l-4-5z" stroke="#101828" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Export icon (arrow up from tray)
const IcoExport = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M7 1v8M4 4l3-3 3 3" stroke="#101828" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 9.5V12a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V9.5" stroke="#101828" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

// Search icon (magnifying glass)
const IcoSearch = ({ s = 14, color = '#6b7280' }: { s?: number; color?: string }) => (
  <svg width={s} height={s} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="6" cy="6" r="4" stroke={color} strokeWidth="1.1" />
    <path d="M9.5 9.5L12.5 12.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

// Options icon (sliders / settings gear)
const IcoOptions = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="7" cy="7" r="2" stroke="#101828" strokeWidth="1.1" />
    <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.93 2.93l1.06 1.06M10.01 10.01l1.06 1.06M2.93 11.07l1.06-1.06M10.01 3.99l1.06-1.06" stroke="#101828" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

// Help icon (circle with ?)
const IcoHelp = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="7" cy="7" r="5.5" stroke="#101828" strokeWidth="1.1" />
    <path d="M5.5 5.5a1.5 1.5 0 0 1 3 0c0 1-1.5 1.5-1.5 2.5" stroke="#101828" strokeWidth="1.1" strokeLinecap="round" />
    <circle cx="7" cy="10" r="0.6" fill="#101828" />
  </svg>
);

export type HomeView = 'home1' | 'home2';

export interface ActiveSelection {
  timeRangeLabel: string;
  interestGroup: string;
  sysplexes: string;
  shifts: string;
  reportingInterval: string;
  days: string;
  comparison?: {
    mode: 'relative' | 'absolute';
    label: string;
    comparisonRangeLabel: string;
    mainRangeLabel: string;
  };
}

const defaultSelection: ActiveSelection = {
  timeRangeLabel: '08/26/2026',
  interestGroup: 'IGT',
  sysplexes: 'All sysplexes',
  shifts: 'All shifts',
  reportingInterval: 'Hour',
  days: 'Thu',
};

export function Dashboard() {
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [activeHome, setActiveHome] = useState<HomeView>('home2');
  const [activeSelection, setActiveSelection] = useState<ActiveSelection>(defaultSelection);
  const [selectionActiveTab, setSelectionActiveTab] = useState<'time-range' | 'additional-filters' | 'comparisons' | 'saved-combinations'>('time-range');

  const handleApplySelection = (selection: ActiveSelection) => {
    setActiveSelection(selection);
    setIsSelectionModalOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-white" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      {/* Top Header — Figma node 610:30610 */}
      <header
        className="h-12 flex items-center px-4 border-b flex-nowrap min-w-0 flex-shrink-0"
        style={{ backgroundColor: '#ffffff', borderBottomColor: '#e5e7eb' }}
      >
        <div className="flex items-center flex-nowrap min-w-0 w-full" style={{ gap: 16 }}>
          {/* Product name */}
          <span
            className="whitespace-nowrap flex-shrink-0"
            style={{ fontSize: 14, fontWeight: 500, color: '#101828', lineHeight: '20px' }}
          >
            IBM Z IntelliMagic Vision for z/OS
          </span>

          {/* Nav buttons */}
          <nav className="flex items-center flex-shrink-0" style={{ gap: 2 }}>
            {([
              { ico: <IcoDashboard />,  label: 'Dashboard',      onClick: undefined },
              { ico: <IcoEdit />,       label: 'Edit Dashboard', onClick: undefined },
              { ico: <IcoReport />,     label: 'Create Report',  onClick: undefined },
              { ico: <IcoSelection />,  label: 'Selection',      onClick: () => setIsSelectionModalOpen(true) },
              { ico: <IcoFilter />,     label: 'Filter',         onClick: undefined },
              { ico: <IcoExport />,     label: 'Export',         onClick: undefined },
            ] as { ico: React.ReactNode; label: string; onClick: (() => void) | undefined }[]).map(({ ico, label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="flex items-center rounded whitespace-nowrap hover:bg-gray-100 transition-colors"
                style={{ gap: 4, padding: '6px 8px' }}
              >
                {ico}
                <span style={{ fontSize: 14, fontWeight: 500, color: '#101828', lineHeight: '20px' }}>{label}</span>
              </button>
            ))}
          </nav>

          {/* Right side: search + options + help */}
          <div className="flex items-center ml-auto flex-shrink-0" style={{ gap: 8 }}>
            <div className="relative" style={{ width: 192, height: 30 }}>
              <input
                type="text"
                placeholder="Search chart"
                className="w-full h-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 4,
                  paddingLeft: 13,
                  paddingRight: 33,
                  fontSize: 14,
                  color: '#101828',
                  fontFamily: "'IBM Plex Sans', sans-serif",
                }}
              />
              <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                <IcoSearch s={14} color="#6b7280" />
              </span>
            </div>
            {([
              { ico: <IcoOptions />, label: 'Options' },
              { ico: <IcoHelp />,    label: 'Help' },
            ] as { ico: React.ReactNode; label: string }[]).map(({ ico, label }) => (
              <button
                key={label}
                className="flex items-center rounded whitespace-nowrap hover:bg-gray-100 transition-colors"
                style={{ gap: 4, padding: '4px 8px' }}
              >
                {ico}
                <span style={{ fontSize: 14, fontWeight: 500, color: '#101828', lineHeight: '20px' }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content Area - switches between Home 1 and Home 2 */}
      {activeHome === 'home1' ? <Home1Content /> : <Home2Content activeSelection={activeSelection} onOpenSelection={() => setIsSelectionModalOpen(true)} />}

      {/* Selection Modal */}
      {isSelectionModalOpen && (
        <>
          <div className="fixed inset-0 bg-[rgba(22,22,22,0.5)] z-40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <SelectionPanel onClose={() => setIsSelectionModalOpen(false)} onApply={handleApplySelection} activeTab={selectionActiveTab} setActiveTab={setSelectionActiveTab} />
          </div>
        </>
      )}
    </div>
  );
}