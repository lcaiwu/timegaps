import { Plus, Minus, Calendar, Trash2, Clock } from 'lucide-react';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface DateTimeRange {
  fromDate: string;
  fromTime: string;
  toDate: string;
  toTime: string;
}

interface ContinuousRangeViewProps {
  dateTimeRanges: DateTimeRange[];
  setDateTimeRanges: React.Dispatch<React.SetStateAction<DateTimeRange[]>>;
  selectedDays: string[];
  setSelectedDays: React.Dispatch<React.SetStateAction<string[]>>;
  endOfMonthOptions: {
    firstDay: { enabled: boolean; value: number };
    firstWeekday: { enabled: boolean; value: number };
    lastDay: { enabled: boolean; value: number };
    lastWeekday: { enabled: boolean; value: number };
  };
  setEndOfMonthOptions: React.Dispatch<React.SetStateAction<{
    firstDay: { enabled: boolean; value: number };
    firstWeekday: { enabled: boolean; value: number };
    lastDay: { enabled: boolean; value: number };
    lastWeekday: { enabled: boolean; value: number };
  }>>;
}

type CalendarField = 'newFromDate' | 'newToDate' | `range${number}FromDate` | `range${number}ToDate` | null;
type TimeField = 'newFromTime' | 'newToTime' | `range${number}FromTime` | `range${number}ToTime` | null;

export function ContinuousRangeView({
  dateTimeRanges,
  setDateTimeRanges,
  selectedDays,
  setSelectedDays,
  endOfMonthOptions,
  setEndOfMonthOptions
}: ContinuousRangeViewProps) {
  const [newDateTimeRange, setNewDateTimeRange] = useState<DateTimeRange>({
    fromDate: '',
    fromTime: '00:00',
    toDate: '',
    toTime: '00:00'
  });
  
  const [showCalendar, setShowCalendar] = useState<CalendarField>(null);
  const [showTimePicker, setShowTimePicker] = useState<TimeField>(null);
  const [dayQuickSelect, setDayQuickSelect] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [rangeErrors, setRangeErrors] = useState<Record<number, string>>({});
  
  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const weekends = ['Saturday', 'Sunday'];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
    setDayQuickSelect(null);
  };

  const handleDayQuickSelect = (option: 'all' | 'weekdays' | 'weekends') => {
    if (dayQuickSelect === option) {
      setDayQuickSelect(null);
      setSelectedDays([]);
    } else {
      setDayQuickSelect(option);
      if (option === 'all') {
        setSelectedDays(allDays);
      } else if (option === 'weekdays') {
        setSelectedDays(weekdays);
      } else if (option === 'weekends') {
        setSelectedDays(weekends);
      }
    }
  };

  const toggleEndOfMonthOption = (option: 'firstDay' | 'firstWeekday' | 'lastDay' | 'lastWeekday') => {
    setEndOfMonthOptions(prev => ({
      ...prev,
      [option]: {
        ...prev[option],
        enabled: !prev[option].enabled
      }
    }));
  };

  const adjustEndOfMonthValue = (option: 'firstDay' | 'firstWeekday' | 'lastDay' | 'lastWeekday', increment: boolean) => {
    setEndOfMonthOptions(prev => {
      const currentValue = prev[option].value;
      let newValue = increment ? currentValue + 1 : currentValue - 1;
      
      if (newValue < 0) newValue = 0;
      
      return {
        ...prev,
        [option]: {
          ...prev[option],
          value: newValue
        }
      };
    });
  };

  const addDateTimeRange = () => {
    // Clear any previous error
    setErrorMessage('');
    setRangeErrors({});
    
    // Validate that BOTH dates are filled (not just one)
    if (!newDateTimeRange.fromDate || !newDateTimeRange.toDate) {
      return;
    }
    
    // Check if from and to dates are the same
    const isSameDate = newDateTimeRange.fromDate === newDateTimeRange.toDate;
    
    // If same date, check if times are different
    if (isSameDate && newDateTimeRange.fromTime === newDateTimeRange.toTime) {
      setErrorMessage('From and To times cannot be the same. Please enter a different time.');
      return;
    }
    
    // Add new range at the beginning (top) of the array
    setDateTimeRanges([{ ...newDateTimeRange }, ...dateTimeRanges]);
    setNewDateTimeRange({
      fromDate: '',
      fromTime: '00:00',
      toDate: '',
      toTime: '00:00'
    });
  };

  const removeDateTimeRange = (index: number) => {
    setDateTimeRanges(dateTimeRanges.filter((_, i) => i !== index));
  };

  const updateDateTimeRange = (index: number, field: keyof DateTimeRange, value: string) => {
    const updatedRanges = [...dateTimeRanges];
    updatedRanges[index] = { ...updatedRanges[index], [field]: value };
    setDateTimeRanges(updatedRanges);
    
    // Validate if same date and same time after update
    const updatedRange = updatedRanges[index];
    const isSameDate = updatedRange.fromDate === updatedRange.toDate;
    if (isSameDate && updatedRange.fromTime === updatedRange.toTime) {
      setRangeErrors({ ...rangeErrors, [index]: 'From and To times cannot be the same. Please enter a different time.' });
    } else {
      // Clear error for this range if it exists
      const newErrors = { ...rangeErrors };
      delete newErrors[index];
      setRangeErrors(newErrors);
    }
  };

  const handleDateSelect = (date: Date | undefined, field: CalendarField) => {
    if (!date) return;
    const formattedDate = format(date, 'MM/dd/yyyy');
    
    if (field === 'newFromDate') {
      setNewDateTimeRange({ ...newDateTimeRange, fromDate: formattedDate });
    } else if (field === 'newToDate') {
      setNewDateTimeRange({ ...newDateTimeRange, toDate: formattedDate });
    } else if (field?.startsWith('range')) {
      const match = field.match(/range(\d+)(FromDate|ToDate)/);
      if (match) {
        const index = parseInt(match[1]);
        const dateField = match[2] === 'FromDate' ? 'fromDate' : 'toDate';
        updateDateTimeRange(index, dateField, formattedDate);
      }
    }
    setShowCalendar(null);
  };

  const handleTimeInput = (value: string, field: TimeField) => {
    // Clear error immediately when user starts editing the 'To' time field
    if (field === 'newToTime') {
      setErrorMessage('');
    } else if (field?.startsWith('range') && field.includes('ToTime')) {
      const match = field.match(/range(\d+)ToTime/);
      if (match) {
        const index = parseInt(match[1]);
        const newErrors = { ...rangeErrors };
        delete newErrors[index];
        setRangeErrors(newErrors);
      }
    }
    
    let cleaned = value.replace(/[^\d:]/g, '');
    let digitsOnly = cleaned.replace(/:/g, '');
    
    if (digitsOnly.length > 4) {
      digitsOnly = digitsOnly.slice(0, 4);
    }
    
    let formatted = '';
    if (digitsOnly.length >= 1) {
      let hours = digitsOnly.slice(0, 2);
      
      if (hours.length === 2) {
        const hoursNum = parseInt(hours, 10);
        if (hoursNum > 23) {
          hours = '23';
        }
      }
      
      formatted = hours;
      
      if (digitsOnly.length >= 3) {
        let minutes = digitsOnly.slice(2, 4);
        
        if (minutes.length === 2) {
          const minutesNum = parseInt(minutes, 10);
          if (minutesNum > 59) {
            minutes = '59';
          }
        }
        
        formatted += ':' + minutes;
      }
    }
    
    if (field === 'newFromTime') {
      setNewDateTimeRange({ ...newDateTimeRange, fromTime: formatted });
    } else if (field === 'newToTime') {
      const updatedRange = { ...newDateTimeRange, toTime: formatted };
      setNewDateTimeRange(updatedRange);
      
      // Re-validate after setting the new value
      const isSameDate = updatedRange.fromDate === updatedRange.toDate;
      if (isSameDate && updatedRange.fromTime === formatted) {
        setErrorMessage('From and To times cannot be the same. Please enter a different time.');
      }
    } else if (field?.startsWith('range')) {
      const match = field.match(/range(\d+)(FromTime|ToTime)/);
      if (match) {
        const index = parseInt(match[1]);
        const timeField = match[2] === 'FromTime' ? 'fromTime' : 'toTime';
        updateDateTimeRange(index, timeField, formatted);
      }
    }
  };

  return (
    <>
      {/* Select date range(s) */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-4">Select date range(s)</h3>
        <div className="space-y-4">
          {/* New range row */}
          <div className="flex items-end gap-4">
            <div>
              <label className="text-xs text-gray-600 block mb-1">From</label>
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    value={newDateTimeRange.fromDate}
                    readOnly
                    onClick={() => setShowCalendar('newFromDate')}
                    className="w-40 px-3 py-2 border border-gray-300 rounded text-sm cursor-pointer hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                  {showCalendar === 'newFromDate' && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowCalendar(null)} />
                      <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                        <DayPicker
                          mode="single"
                          selected={newDateTimeRange.fromDate ? new Date(newDateTimeRange.fromDate) : undefined}
                          onSelect={(date) => handleDateSelect(date, 'newFromDate')}
                          captionLayout="dropdown-buttons"
                          fromYear={2000}
                          toYear={2030}
                          disabled={{ after: new Date() }}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="hh:mm"
                    value={newDateTimeRange.fromTime}
                    onChange={(e) => handleTimeInput(e.target.value, 'newFromTime')}
                    className="w-24 pl-3 pr-9 py-2 border border-gray-300 rounded text-sm text-center hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">To</label>
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    value={newDateTimeRange.toDate}
                    readOnly
                    onClick={() => setShowCalendar('newToDate')}
                    className="w-40 px-3 py-2 border border-gray-300 rounded text-sm cursor-pointer hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                  {showCalendar === 'newToDate' && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowCalendar(null)} />
                      <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                        <DayPicker
                          mode="single"
                          selected={newDateTimeRange.toDate ? new Date(newDateTimeRange.toDate) : undefined}
                          onSelect={(date) => handleDateSelect(date, 'newToDate')}
                          captionLayout="dropdown-buttons"
                          fromYear={2000}
                          toYear={2030}
                          disabled={{ after: new Date() }}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="hh:mm"
                    value={newDateTimeRange.toTime}
                    onChange={(e) => handleTimeInput(e.target.value, 'newToTime')}
                    className={`w-24 pl-3 pr-9 py-2 border rounded text-sm text-center ${
                      errorMessage 
                        ? 'border-red-500 text-red-600 bg-red-50 hover:border-red-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-500' 
                        : 'hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 border-gray-300'
                    }`}
                  />
                  <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </div>
            </div>
            <button 
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 pb-2 transition-colors"
              onClick={addDateTimeRange}
            >
              Add
              <Plus size={14} />
            </button>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded px-3 py-2">
              {errorMessage}
            </div>
          )}

          {/* Existing ranges */}
          {dateTimeRanges.map((range, index) => (
            <div key={index}>
              <div className="flex items-end gap-4">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">From</label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={range.fromDate}
                        readOnly
                        onClick={() => setShowCalendar(`range${index}FromDate` as CalendarField)}
                        className="w-40 px-3 py-2 border border-gray-300 rounded text-sm bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                      {showCalendar === `range${index}FromDate` && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowCalendar(null)} />
                          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                            <DayPicker
                              mode="single"
                              selected={range.fromDate ? new Date(range.fromDate) : undefined}
                              onSelect={(date) => handleDateSelect(date, `range${index}FromDate` as CalendarField)}
                              captionLayout="dropdown-buttons"
                              fromYear={2000}
                              toYear={2030}
                              disabled={{ after: new Date() }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={range.fromTime}
                        onChange={(e) => handleTimeInput(e.target.value, `range${index}FromTime` as TimeField)}
                        className="w-24 pl-3 pr-9 py-2 border border-gray-300 rounded text-sm text-center bg-white hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">To</label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={range.toDate}
                        readOnly
                        onClick={() => setShowCalendar(`range${index}ToDate` as CalendarField)}
                        className="w-40 px-3 py-2 border border-gray-300 rounded text-sm bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                      {showCalendar === `range${index}ToDate` && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowCalendar(null)} />
                          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                            <DayPicker
                              mode="single"
                              selected={range.toDate ? new Date(range.toDate) : undefined}
                              onSelect={(date) => handleDateSelect(date, `range${index}ToDate` as CalendarField)}
                              captionLayout="dropdown-buttons"
                              fromYear={2000}
                              toYear={2030}
                              disabled={{ after: new Date() }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={range.toTime}
                        onChange={(e) => handleTimeInput(e.target.value, `range${index}ToTime` as TimeField)}
                        className={`w-24 pl-3 pr-9 py-2 border rounded text-sm text-center bg-white ${
                          rangeErrors[index]
                            ? 'border-red-500 text-red-600 bg-red-50 hover:border-red-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-500'
                            : 'border-gray-300 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        }`}
                      />
                      <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                    </div>
                  </div>
                </div>
                <button 
                  className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1 pb-2 transition-colors"
                  onClick={() => removeDateTimeRange(index)}
                >
                  Remove
                  <Trash2 size={14} />
                </button>
              </div>
              {/* Error message for this range */}
              {rangeErrors[index] && (
                <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded px-3 py-2 mt-2">
                  {rangeErrors[index]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Day(s) of the week */}
      <div className="mb-6">
        <h3 className="text-sm mb-3">Day(s) of the week</h3>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2 cursor-pointer" onClick={() => handleDayQuickSelect('all')}>
            <div className={`w-4 h-4 border-2 ${dayQuickSelect === 'all' ? 'border-black bg-black' : 'border-gray-400'} rounded ${dayQuickSelect === 'all' ? 'flex items-center justify-center' : ''}`}>
              {dayQuickSelect === 'all' && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="text-xs">All days</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer" onClick={() => handleDayQuickSelect('weekdays')}>
            <div className={`w-4 h-4 border-2 ${dayQuickSelect === 'weekdays' ? 'border-black bg-black' : 'border-gray-400'} rounded ${dayQuickSelect === 'weekdays' ? 'flex items-center justify-center' : ''}`}>
              {dayQuickSelect === 'weekdays' && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="text-xs">Weekdays</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer" onClick={() => handleDayQuickSelect('weekends')}>
            <div className={`w-4 h-4 border-2 ${dayQuickSelect === 'weekends' ? 'border-black bg-black' : 'border-gray-400'} rounded ${dayQuickSelect === 'weekends' ? 'flex items-center justify-center' : ''}`}>
              {dayQuickSelect === 'weekends' && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="text-xs">Weekends</span>
          </label>
        </div>
        <div className="flex gap-4">
          {allDays.map((day) => (
            <label key={day} className="flex items-center gap-2 cursor-pointer" onClick={() => toggleDay(day)}>
              <div className={`w-4 h-4 border-2 ${selectedDays.includes(day) ? 'border-black bg-black' : 'border-gray-400'} rounded ${selectedDays.includes(day) ? 'flex items-center justify-center' : ''}`}>
                {selectedDays.includes(day) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-xs">{day}</span>
            </label>
          ))}
        </div>
      </div>

      {/* End of month day(s) */}
      <div className="mb-6">
        <h3 className="text-sm mb-3">End of month day(s)</h3>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-2" onClick={() => toggleEndOfMonthOption('firstDay')}>
              <div className={`w-4 h-4 border-2 ${endOfMonthOptions.firstDay.enabled ? 'border-black bg-black' : 'border-gray-400'} rounded ${endOfMonthOptions.firstDay.enabled ? 'flex items-center justify-center' : ''}`}>
                {endOfMonthOptions.firstDay.enabled && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-xs">First day(s) of the month</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={endOfMonthOptions.firstDay.value.toString()}
                className="w-20 px-3 py-2 border border-gray-300 rounded text-sm text-center"
                readOnly
              />
              <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50" onClick={() => adjustEndOfMonthValue('firstDay', false)}>
                <Minus size={14} />
              </button>
              <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50" onClick={() => adjustEndOfMonthValue('firstDay', true)}>
                <Plus size={14} />
              </button>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-2" onClick={() => toggleEndOfMonthOption('firstWeekday')}>
              <div className={`w-4 h-4 border-2 ${endOfMonthOptions.firstWeekday.enabled ? 'border-black bg-black' : 'border-gray-400'} rounded ${endOfMonthOptions.firstWeekday.enabled ? 'flex items-center justify-center' : ''}`}>
                {endOfMonthOptions.firstWeekday.enabled && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-xs whitespace-nowrap">First weekday(s) of the month</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={endOfMonthOptions.firstWeekday.value.toString()}
                className="w-20 px-3 py-2 border border-gray-300 rounded text-sm text-center"
                readOnly
              />
              <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50" onClick={() => adjustEndOfMonthValue('firstWeekday', false)}>
                <Minus size={14} />
              </button>
              <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50" onClick={() => adjustEndOfMonthValue('firstWeekday', true)}>
                <Plus size={14} />
              </button>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-2" onClick={() => toggleEndOfMonthOption('lastDay')}>
              <div className={`w-4 h-4 border-2 ${endOfMonthOptions.lastDay.enabled ? 'border-black bg-black' : 'border-gray-400'} rounded ${endOfMonthOptions.lastDay.enabled ? 'flex items-center justify-center' : ''}`}>
                {endOfMonthOptions.lastDay.enabled && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-xs">Last day(s) of the month</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={endOfMonthOptions.lastDay.value.toString()}
                className="w-20 px-3 py-2 border border-gray-300 rounded text-sm text-center"
                readOnly
              />
              <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50" onClick={() => adjustEndOfMonthValue('lastDay', false)}>
                <Minus size={14} />
              </button>
              <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50" onClick={() => adjustEndOfMonthValue('lastDay', true)}>
                <Plus size={14} />
              </button>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-2" onClick={() => toggleEndOfMonthOption('lastWeekday')}>
              <div className={`w-4 h-4 border-2 ${endOfMonthOptions.lastWeekday.enabled ? 'border-black bg-black' : 'border-gray-400'} rounded flex items-center justify-center`}>
                {endOfMonthOptions.lastWeekday.enabled && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-xs whitespace-nowrap">Last weekday(s) of the month</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={endOfMonthOptions.lastWeekday.value.toString()}
                className="w-20 px-3 py-2 border border-gray-300 rounded text-sm text-center"
                readOnly
              />
              <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50" onClick={() => adjustEndOfMonthValue('lastWeekday', false)}>
                <Minus size={14} />
              </button>
              <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50" onClick={() => adjustEndOfMonthValue('lastWeekday', true)}>
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}