import { Calendar, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, addDays, subDays } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface ComparisonViewProps {
  comparisonMode: 'none' | 'relative' | 'absolute';
  setComparisonMode: (mode: 'none' | 'relative' | 'absolute') => void;
  relativeNumber: string;
  setRelativeNumber: (value: string) => void;
  relativeUnit: string;
  setRelativeUnit: (value: string) => void;
  absoluteFromDate: Date | undefined;
  setAbsoluteFromDate: (date: Date | undefined) => void;
  absoluteToDate: Date | undefined;
  setAbsoluteToDate: (date: Date | undefined) => void;
  timeRangeDurationInDays: number;
  hasMultipleRanges: boolean;
}

export function ComparisonView({
  comparisonMode,
  setComparisonMode,
  relativeNumber,
  setRelativeNumber,
  relativeUnit,
  setRelativeUnit,
  absoluteFromDate,
  setAbsoluteFromDate,
  absoluteToDate,
  setAbsoluteToDate,
  timeRangeDurationInDays,
  hasMultipleRanges
}: ComparisonViewProps) {
  const [showAbsoluteFromCalendar, setShowAbsoluteFromCalendar] = useState(false);
  const [showAbsoluteToCalendar, setShowAbsoluteToCalendar] = useState(false);

  // Switch to relative mode if multiple ranges are detected
  useEffect(() => {
    if (hasMultipleRanges && comparisonMode === 'absolute') {
      setComparisonMode('relative');
    }
  }, [hasMultipleRanges, comparisonMode, setComparisonMode]);

  return (
    <div className="py-5">
      {/* None/Relative/Absolute Radio Buttons */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer mb-4" onClick={() => setComparisonMode('none')}>
          <div className={`w-5 h-5 rounded-full border-2 ${comparisonMode === 'none' ? 'border-black flex items-center justify-center' : 'border-gray-400'}`}>
            {comparisonMode === 'none' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
          </div>
          <span className="text-sm">None</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer mb-4" onClick={() => setComparisonMode('relative')}>
          <div className={`w-5 h-5 rounded-full border-2 ${comparisonMode === 'relative' ? 'border-black flex items-center justify-center' : 'border-gray-400'}`}>
            {comparisonMode === 'relative' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
          </div>
          <span className="text-sm">Relative</span>
        </label>

        <div className="flex gap-4 max-w-md ml-7 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={relativeNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  setRelativeNumber(value);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
              placeholder="08"
            />
          </div>
          <div className="flex-1 relative">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm appearance-none bg-gray-50 pr-8"
              value={relativeUnit}
              onChange={(e) => setRelativeUnit(e.target.value)}
            >
              <option value="" disabled>Select unit</option>
              <option>Days earlier</option>
              <option>Weeks earlier</option>
              <option>Months earlier</option>
              <option>Years earlier</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer" onClick={() => !hasMultipleRanges && setComparisonMode('absolute')}>
          <div className={`w-5 h-5 rounded-full border-2 ${comparisonMode === 'absolute' ? 'border-black flex items-center justify-center' : hasMultipleRanges ? 'border-gray-300 bg-gray-100' : 'border-gray-400'}`}>
            {comparisonMode === 'absolute' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
          </div>
          <span className={`text-sm ${hasMultipleRanges ? 'text-gray-400' : ''}`}>Absolute</span>
        </label>

        <div className="ml-7 mt-4">
          <div className="flex gap-4 mb-3 max-w-md">
            <div className="flex-1">
              <label className="text-xs text-gray-600 block mb-2">From</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded text-sm bg-gray-50 ${hasMultipleRanges ? 'cursor-not-allowed opacity-50' : ''}`}
                  value={absoluteFromDate ? format(absoluteFromDate, 'MM/dd/yyyy') : ''}
                  readOnly
                  onClick={() => !hasMultipleRanges && setShowAbsoluteFromCalendar(true)}
                  disabled={hasMultipleRanges}
                />
                <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                
                {showAbsoluteFromCalendar && !hasMultipleRanges && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowAbsoluteFromCalendar(false)} />
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                      <DayPicker
                        mode="single"
                        selected={absoluteFromDate}
                        onSelect={(date) => {
                          setAbsoluteFromDate(date);
                          // Auto-calculate the "To" date based on time range duration
                          if (date) {
                            const calculatedToDate = addDays(date, timeRangeDurationInDays - 1);
                            const today = new Date();
                            // If calculated date is in the future, cap it at today
                            const toDate = calculatedToDate > today ? today : calculatedToDate;
                            setAbsoluteToDate(toDate);
                          }
                          setShowAbsoluteFromCalendar(false);
                        }}
                        captionLayout="dropdown-buttons"
                        fromYear={2000}
                        toYear={2030}
                        disabled={{ after: new Date() }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-600 block mb-2">To</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded text-sm bg-gray-50 ${hasMultipleRanges ? 'cursor-not-allowed opacity-50' : ''}`}
                  value={absoluteToDate ? format(absoluteToDate, 'MM/dd/yyyy') : ''}
                  readOnly
                  onClick={() => !hasMultipleRanges && setShowAbsoluteToCalendar(true)}
                  disabled={hasMultipleRanges}
                />
                <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                
                {showAbsoluteToCalendar && !hasMultipleRanges && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowAbsoluteToCalendar(false)} />
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                      <DayPicker
                        mode="single"
                        selected={absoluteToDate}
                        onSelect={(date) => {
                          setAbsoluteToDate(date);
                          // Auto-calculate the "From" date based on time range duration
                          if (date) {
                            const fromDate = subDays(date, timeRangeDurationInDays - 1);
                            setAbsoluteFromDate(fromDate);
                          }
                          setShowAbsoluteToCalendar(false);
                        }}
                        captionLayout="dropdown-buttons"
                        fromYear={2000}
                        toYear={2030}
                        disabled={{ after: new Date() }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 max-w-md">
            {hasMultipleRanges 
              ? 'Absolute comparison is disabled when multiple time ranges are selected. Please use the relative option or select a single time range.'
              : 'Selecting one date auto-adjusts the other based on the chosen time range.'}
          </p>
        </div>
      </div>
    </div>
  );
}