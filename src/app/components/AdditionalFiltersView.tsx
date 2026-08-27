import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

interface AdditionalFiltersViewProps {
  selectedSysplex: string[];
  setSelectedSysplex: React.Dispatch<React.SetStateAction<string[]>>;
  selectedShifts: string[];
  setSelectedShifts: React.Dispatch<React.SetStateAction<string[]>>;
  selectedInterestGroup: string;
  setSelectedInterestGroup: React.Dispatch<React.SetStateAction<string>>;
  selectedReportingInterval: string;
  setSelectedReportingInterval: React.Dispatch<React.SetStateAction<string>>;
}

export function AdditionalFiltersView({
  selectedSysplex,
  setSelectedSysplex,
  selectedShifts,
  setSelectedShifts,
  selectedInterestGroup,
  setSelectedInterestGroup,
  selectedReportingInterval,
  setSelectedReportingInterval
}: AdditionalFiltersViewProps) {
  const [showSysplexDropdown, setShowSysplexDropdown] = useState(false);
  const [showShiftsDropdown, setShowShiftsDropdown] = useState(false);
  const [showInterestGroupDropdown, setShowInterestGroupDropdown] = useState(false);
  const [showReportingIntervalDropdown, setShowReportingIntervalDropdown] = useState(false);

  const sysplexOptions = [
    'All',
    'Lorem ipsum',
    'Dolor sit amet',
    'Consectetur adipiscing',
    'Elit sed do',
    'Eiusmod tempor',
    'Incididunt ut labore'
  ];

  const shiftsOptions = ['All', 'Day', 'Night', 'Prime', 'Off-prime', 'Weekend'];
  const interestGroupOptions = ['IGT (Default)', 'Lorem', 'Ipsum', 'Dolor', 'Sit amet', 'Consectetur'];
  const reportingIntervalOptions = ['Default', 'Measurement', '15 minutes', 'Hour', 'Day', 'Month'];

  const toggleSysplexOption = (option: string) => {
    if (selectedSysplex.includes(option)) {
      setSelectedSysplex(selectedSysplex.filter(s => s !== option));
    } else {
      setSelectedSysplex([...selectedSysplex, option]);
    }
  };

  const toggleShiftsOption = (option: string) => {
    if (selectedShifts.includes(option)) {
      setSelectedShifts(selectedShifts.filter(s => s !== option));
    } else {
      setSelectedShifts([...selectedShifts, option]);
    }
  };

  const removeSysplexItem = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSysplex(selectedSysplex.filter(s => s !== option));
  };

  const removeShiftsItem = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedShifts(selectedShifts.filter(s => s !== option));
  };

  return (
    <>
      {/* Row 1: Three dropdowns */}
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-4">
          {/* Sysplex Dropdown */}
          <div>
            <label className="text-xs text-gray-600 block mb-1">Sysplex</label>
            <div className="relative">
              <button
                onClick={() => setShowSysplexDropdown(!showSysplexDropdown)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-left bg-white hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 flex items-center gap-2"
              >
                {selectedSysplex.length > 0 ? (
                  <div className="flex items-center gap-2 flex-1">
                    <span className="bg-gray-800 text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                      {selectedSysplex.length}
                      <X size={12} className="cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSysplex([]);
                      }} />
                    </span>
                    <span className="text-gray-900">Option</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Select sysplex</span>
                )}
                <ChevronDown size={16} className="ml-auto text-gray-400" />
              </button>
              {showSysplexDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSysplexDropdown(false)} />
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-20 max-h-60 overflow-y-auto">
                    {sysplexOptions.map((option) => (
                      <div
                        key={option}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                        onClick={() => {
                          if (option === 'All') {
                            const allOther = sysplexOptions.filter(o => o !== 'All');
                            const allSelected = allOther.every(o => selectedSysplex.includes(o));
                            if (allSelected) {
                              setSelectedSysplex([]);
                            } else {
                              setSelectedSysplex([...sysplexOptions]);
                            }
                          } else {
                            toggleSysplexOption(option);
                          }
                        }}
                      >
                        <div className={`w-4 h-4 border-2 ${
                          option === 'All'
                            ? (sysplexOptions.filter(o => o !== 'All').every(o => selectedSysplex.includes(o)) ? 'border-black bg-black' : 'border-gray-400')
                            : (selectedSysplex.includes(option) ? 'border-black bg-black' : 'border-gray-400')
                        } rounded ${
                          option === 'All'
                            ? (sysplexOptions.filter(o => o !== 'All').every(o => selectedSysplex.includes(o)) ? 'flex items-center justify-center' : '')
                            : (selectedSysplex.includes(option) ? 'flex items-center justify-center' : '')
                        }`}>
                          {(option === 'All'
                            ? sysplexOptions.filter(o => o !== 'All').every(o => selectedSysplex.includes(o))
                            : selectedSysplex.includes(option)
                          ) && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span className="text-sm">{option}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Shifts Dropdown */}
          <div>
            <label className="text-xs text-gray-600 block mb-1">Shifts</label>
            <div className="relative">
              <button
                onClick={() => setShowShiftsDropdown(!showShiftsDropdown)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-left bg-white hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 flex items-center gap-2"
              >
                {selectedShifts.length > 0 ? (
                  <div className="flex items-center gap-2 flex-1">
                    <span className="bg-gray-800 text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                      {selectedShifts.length}
                      <X size={12} className="cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedShifts([]);
                      }} />
                    </span>
                    <span className="text-gray-900">Option</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Select shifts</span>
                )}
                <ChevronDown size={16} className="ml-auto text-gray-400" />
              </button>
              {showShiftsDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowShiftsDropdown(false)} />
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-20 max-h-60 overflow-y-auto">
                    {shiftsOptions.map((option) => (
                      <div
                        key={option}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                        onClick={() => {
                          if (option === 'All') {
                            const allOther = shiftsOptions.filter(o => o !== 'All');
                            const allSelected = allOther.every(o => selectedShifts.includes(o));
                            if (allSelected) {
                              setSelectedShifts([]);
                            } else {
                              setSelectedShifts([...shiftsOptions]);
                            }
                          } else {
                            toggleShiftsOption(option);
                          }
                        }}
                      >
                        <div className={`w-4 h-4 border-2 ${
                          option === 'All'
                            ? (shiftsOptions.filter(o => o !== 'All').every(o => selectedShifts.includes(o)) ? 'border-black bg-black' : 'border-gray-400')
                            : (selectedShifts.includes(option) ? 'border-black bg-black' : 'border-gray-400')
                        } rounded ${
                          option === 'All'
                            ? (shiftsOptions.filter(o => o !== 'All').every(o => selectedShifts.includes(o)) ? 'flex items-center justify-center' : '')
                            : (selectedShifts.includes(option) ? 'flex items-center justify-center' : '')
                        }`}>
                          {(option === 'All'
                            ? shiftsOptions.filter(o => o !== 'All').every(o => selectedShifts.includes(o))
                            : selectedShifts.includes(option)
                          ) && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span className="text-sm">{option}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Interest Group Dropdown */}
          <div>
            <label className="text-xs text-gray-600 block mb-1">Interest group</label>
            <div className="relative">
              <button
                onClick={() => setShowInterestGroupDropdown(!showInterestGroupDropdown)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-left bg-white hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 flex items-center justify-between"
              >
                <span className={selectedInterestGroup ? "text-gray-900" : "text-gray-400"}>
                  {selectedInterestGroup || 'Select interest group'}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>
              {showInterestGroupDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowInterestGroupDropdown(false)} />
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-20 max-h-60 overflow-y-auto">
                    {interestGroupOptions.map((option) => (
                      <div
                        key={option}
                        className={`px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm ${
                          selectedInterestGroup === option ? 'bg-blue-50 text-blue-600' : ''
                        }`}
                        onClick={() => {
                          setSelectedInterestGroup(option);
                          setShowInterestGroupDropdown(false);
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-6" />

      {/* Row 2: Reporting Interval */}
      <div className="mb-6">
        <label className="text-xs text-gray-600 block mb-1">Reporting interval</label>
        <div className="relative" style={{ maxWidth: '232px' }}>
          <button
            onClick={() => setShowReportingIntervalDropdown(!showReportingIntervalDropdown)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-left bg-gray-50 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 flex items-center justify-between"
          >
            <span className="text-gray-900">{selectedReportingInterval}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
          {showReportingIntervalDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowReportingIntervalDropdown(false)} />
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-20 max-h-60 overflow-y-auto">
                {reportingIntervalOptions.map((option) => (
                  <div
                    key={option}
                    className={`px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm ${
                      selectedReportingInterval === option ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                    onClick={() => {
                      setSelectedReportingInterval(option);
                      setShowReportingIntervalDropdown(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}