import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Minus, ExternalLink, MoreVertical, Settings, FileText, FileBarChart, Star, Sparkles } from 'lucide-react';

export function Home1Content() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    myDashboards: true,
    sharedDashboards: false,
    reports: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 bg-[#f5f5f5] border-r border-gray-300 overflow-y-auto">
        <div className="p-2">
          <div className="bg-[#4178be] text-white px-3 py-2 mb-2 rounded font-medium text-sm">
            Navigation
          </div>

          {/* My Dashboards Section */}
          <div className="mb-2">
            <button
              onClick={() => toggleSection('myDashboards')}
              className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-gray-200 rounded text-sm"
            >
              <div className="flex items-center gap-2">
                <FileText size={14} />
                <span className="font-medium">My Dashboards</span>
              </div>
              <div className="flex items-center gap-1">
                <div 
                  className="p-0.5 hover:bg-gray-300 rounded cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <Plus size={12} />
                </div>
                {expandedSections.myDashboards ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </div>
            </button>
            {expandedSections.myDashboards && (
              <div className="ml-6 mt-1">
                <div className="px-2 py-1.5 text-sm hover:bg-gray-200 rounded cursor-pointer">
                  My Dashboard
                </div>
              </div>
            )}
          </div>

          {/* Shared Dashboards Section */}
          <div className="mb-2">
            <button
              onClick={() => toggleSection('sharedDashboards')}
              className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-gray-200 rounded text-sm"
            >
              <div className="flex items-center gap-2">
                <FileText size={14} />
                <span className="font-medium">Shared Dashboards</span>
              </div>
              {expandedSections.sharedDashboards ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>

          {/* Reports Section */}
          <div className="mb-2">
            <button
              onClick={() => toggleSection('reports')}
              className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-gray-200 rounded text-sm"
            >
              <div className="flex items-center gap-2">
                <FileBarChart size={14} />
                <span className="font-medium">Reports</span>
              </div>
              {expandedSections.reports ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {expandedSections.reports && (
              <div className="ml-6 mt-1 space-y-0.5">
                {['Health and Overview', 'Applications', 'Disk Storage', 'Systems', 'CF and XCF', 'z/OS Connect', 'Db2', 'CICS', 'TCP/IP', 'MQ', 'IMS', 'Jobs and Data Sets', 'FICON Directors', 'Tape Storage'].map(item => (
                  <div key={item} className="flex items-center gap-1 px-2 py-1.5 text-sm hover:bg-gray-200 rounded cursor-pointer">
                    <ChevronRight size={12} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#e8e8e8] p-4 overflow-y-auto flex gap-4">
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 max-w-7xl">
            {/* Project Summary Panel */}
            <div className="bg-white border border-gray-300 rounded shadow-sm">
              <div className="border-b border-gray-300 px-4 py-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Project Summary</h2>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded"><Minus size={14} className="text-gray-600" /></button>
                  <button className="p-1 hover:bg-gray-100 rounded"><Settings size={14} className="text-gray-600" /></button>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-2xl font-normal mb-4">aidemo</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-2">DETAIL RANGE</div>
                    <div className="text-sm">5/18/2025 12:00 AM - 6/22/2025 12:00 AM</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-2">YEARLY RANGE</div>
                    <div className="text-sm">5/18/2025 12:00 AM - 6/22/2025 11:59 PM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Favorites Panel */}
            <div className="bg-white border border-gray-300 rounded shadow-sm">
              <div className="border-b border-gray-300 px-4 py-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Favorites</h2>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded"><ExternalLink size={14} className="text-gray-600" /></button>
                  <button className="p-1 hover:bg-gray-100 rounded"><Minus size={14} className="text-gray-600" /></button>
                  <button className="p-1 hover:bg-gray-100 rounded"><MoreVertical size={14} className="text-gray-600" /></button>
                </div>
              </div>
              <div className="p-4">
                <div className="text-center py-8 text-gray-500 text-sm">
                  Go to a report to add it to this collection
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Report History (Last 20)</div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded"><ExternalLink size={12} className="text-gray-600" /></button>
                      <button className="p-1 hover:bg-gray-100 rounded"><Minus size={12} className="text-gray-600" /></button>
                      <button className="p-1 hover:bg-gray-100 rounded"><MoreVertical size={12} className="text-gray-600" /></button>
                    </div>
                  </div>
                  <div className="text-center py-6 text-gray-500 text-sm">
                    No reports in this collection
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="w-64 bg-white border border-gray-300 rounded shadow-sm h-fit">
          <div className="border-b border-gray-300 px-4 py-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Alerts</h2>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-gray-100 rounded"><Minus size={14} className="text-gray-600" /></button>
              <button className="p-1 hover:bg-gray-100 rounded"><Settings size={14} className="text-gray-600" /></button>
            </div>
          </div>
          <div className="p-4">
            <div className="text-center py-8 text-gray-500 text-sm">
              No alerts to display
            </div>
          </div>
        </aside>
      </main>

      {/* Right Icon Toolbar */}
      <div className="w-12 bg-[#f5f5f5] border-l border-gray-300 flex flex-col items-center py-4 gap-6">
        <button className="p-2 hover:bg-gray-200 rounded flex flex-col items-center gap-1 text-gray-700">
          <Sparkles size={18} />
          <span className="text-[10px] font-medium">AI</span>
        </button>
        <button className="p-2 hover:bg-gray-200 rounded text-gray-700"><FileText size={18} /></button>
        <button className="p-2 hover:bg-gray-200 rounded text-gray-700"><Star size={18} /></button>
        <button className="p-2 hover:bg-gray-200 rounded text-gray-700"><Settings size={18} /></button>
      </div>
    </div>
  );
}
