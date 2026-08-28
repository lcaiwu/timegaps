import { Info, Plus, Minus, Calendar, ChevronDown, X, Clock, Filter, GitCompare, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, startOfWeek, endOfWeek, subWeeks, startOfMonth, startOfYear, subMonths, endOfMonth, differenceInDays, addDays, subDays, addMonths, addYears, subYears } from 'date-fns';
import 'react-day-picker/dist/style.css';
import { ContinuousRangeView } from '@/app/components/ContinuousRangeView';
import { DiscreteRangeView } from '@/app/components/DiscreteRangeView';
import { AdditionalFiltersView } from '@/app/components/AdditionalFiltersView';
import { ComparisonView } from '@/app/components/ComparisonView';
import { SavedCombinationsView, type SavedCombination } from '@/app/components/SavedCombinationsView';
import { SaveCombinationModal } from '@/app/components/SaveCombinationModal';
import type { ActiveSelection } from './Dashboard';

type SelectionTabType = 'time-range' | 'additional-filters' | 'comparisons' | 'saved-combinations';

interface SelectionPanelProps {
  onClose?: () => void;
  onApply?: (selection: ActiveSelection) => void;
  activeTab?: SelectionTabType;
  setActiveTab?: (tab: SelectionTabType) => void;
}

export function SelectionPanel({ onClose, onApply, activeTab: externalActiveTab, setActiveTab: externalSetActiveTab }: SelectionPanelProps = {}) {
  const [internalActiveTab, setInternalActiveTab] = useState<SelectionTabType>('time-range');
  const activeTab = externalActiveTab ?? internalActiveTab;
  const setActiveTab = externalSetActiveTab ?? setInternalActiveTab;
  const [timeRangeType, setTimeRangeType] = useState<'presets' | 'continuous' | 'discrete'>('presets');
  const [singleDate, setSingleDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedQuickOption, setSelectedQuickOption] = useState<string>('All data');
  const [showNumberDropdown, setShowNumberDropdown] = useState(false);
  const [relativeNumber, setRelativeNumber] = useState('8');
  const [relativeUnit, setRelativeUnit] = useState('days');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [dayQuickSelect, setDayQuickSelect] = useState<string | null>(null);
  const [endOfMonthOptions, setEndOfMonthOptions] = useState({
    firstDay: { enabled: false, value: 0 },
    firstWeekday: { enabled: false, value: 0 },
    lastDay: { enabled: false, value: 0 },
    lastWeekday: { enabled: false, value: 0 }
  });
  
  // Time range state
  const [timeRanges, setTimeRanges] = useState<Array<{ from: string; to: string }>>([]);
  const [newTimeRange, setNewTimeRange] = useState({ from: '00:00', to: '00:00' });
  const [showTimePicker, setShowTimePicker] = useState<{ field: 'from' | 'to' | null }>({ field: null });
  const [isTimeRangeExpanded, setIsTimeRangeExpanded] = useState(true);
  const [timeErrorMessage, setTimeErrorMessage] = useState('');

  // Continuous range state (lifted from ContinuousRangeView)
  const [continuousDateTimeRanges, setContinuousDateTimeRanges] = useState<Array<{
    fromDate: string;
    fromTime: string;
    toDate: string;
    toTime: string;
  }>>([]);
  const [continuousSelectedDays, setContinuousSelectedDays] = useState<string[]>([]);
  const [continuousEndOfMonthOptions, setContinuousEndOfMonthOptions] = useState({
    firstDay: { enabled: false, value: 0 },
    firstWeekday: { enabled: false, value: 0 },
    lastDay: { enabled: false, value: 0 },
    lastWeekday: { enabled: false, value: 0 }
  });

  // Discrete range state
  const [discreteDateRanges, setDiscreteDateRanges] = useState<Array<{
    fromDate: string;
    toDate: string;
  }>>([]);
  const [discreteTimeRanges, setDiscreteTimeRanges] = useState<Array<{
    fromTime: string;
    toTime: string;
  }>>([]);
  const [discreteSelectedDays, setDiscreteSelectedDays] = useState<string[]>([]);
  const [discreteEndOfMonthOptions, setDiscreteEndOfMonthOptions] = useState({
    firstDay: { enabled: false, value: 0 },
    firstWeekday: { enabled: false, value: 0 },
    lastDay: { enabled: false, value: 0 },
    lastWeekday: { enabled: false, value: 0 }
  });

  // Additional filters state
  const [selectedSysplex, setSelectedSysplex] = useState<string[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const [selectedInterestGroup, setSelectedInterestGroup] = useState<string>('IGT (Default)');
  const [selectedReportingInterval, setSelectedReportingInterval] = useState<string>('Default (Measurement)');
  const [isAdditionalFiltersExpanded, setIsAdditionalFiltersExpanded] = useState(true);
  
  // Comparison state
  const [comparisonMode, setComparisonMode] = useState<'none' | 'relative' | 'absolute'>('none');
  const [comparisonRelativeNumber, setComparisonRelativeNumber] = useState('');
  const [comparisonRelativeUnit, setComparisonRelativeUnit] = useState('');
  const [absoluteFromDate, setAbsoluteFromDate] = useState<Date | undefined>(undefined);
  const [absoluteToDate, setAbsoluteToDate] = useState<Date | undefined>(undefined);
  const [isComparisonExpanded, setIsComparisonExpanded] = useState(true);
  
  // Saved combinations state
  const [selectedSavedCombination, setSelectedSavedCombination] = useState<string | null>(null);
  const [highlightedCombinationId, setHighlightedCombinationId] = useState<string | null>(null);
  const [savedCombinations, setSavedCombinations] = useState<SavedCombination[]>([
    {
      id: '1',
      name: 'Morning Shift Analytics',
      description: 'Filter configuration for analyzing morning shift performance data across all production systems. Includes weekday patterns and hourly breakdowns for operational insights.',
      savedOn: '01/15/2026',
      filterData: {
        timeRangeType: 'discrete',
        selectedQuickOption: 'Previous month',
        relativeNumber: '8',
        relativeUnit: 'hours',
        singleDate: undefined,
        continuousDateTimeRanges: [],
        continuousSelectedDays: [],
        continuousEndOfMonthOptions: {
          firstDay: { enabled: false, value: 0 },
          firstWeekday: { enabled: false, value: 0 },
          lastDay: { enabled: false, value: 0 },
          lastWeekday: { enabled: false, value: 0 }
        },
        discreteDateRanges: [{ fromDate: '01/01/2026', toDate: '01/31/2026' }],
        discreteTimeRanges: [
          { fromTime: '06:00', toTime: '09:00' },
          { fromTime: '09:00', toTime: '12:00' }
        ],
        discreteSelectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        discreteEndOfMonthOptions: {
          firstDay: { enabled: false, value: 0 },
          firstWeekday: { enabled: false, value: 0 },
          lastDay: { enabled: false, value: 0 },
          lastWeekday: { enabled: false, value: 0 }
        },
        selectedSysplex: ['SYSA', 'SYSB'],
        selectedShifts: ['Morning'],
        selectedInterestGroup: 'IGT (default)',
        selectedReportingInterval: 'Hourly',
        comparisonMode: 'relative',
        comparisonRelativeNumber: '04',
        comparisonRelativeUnit: 'Weeks earlier',
        absoluteFromDate: undefined,
        absoluteToDate: undefined
      }
    },
    {
      id: '2',
      name: 'Weekend Report Filter',
      description: 'Comprehensive weekend data analysis setup focusing on reduced staff periods. Captures Saturday and Sunday metrics with emphasis on automated processes.',
      savedOn: '01/20/2026',
      filterData: {
        timeRangeType: 'continuous',
        selectedQuickOption: 'Previous month',
        relativeNumber: '8',
        relativeUnit: 'hours',
        singleDate: undefined,
        continuousDateTimeRanges: [
          { fromDate: '01/01/2026', fromTime: '00:00', toDate: '01/31/2026', toTime: '23:59' }
        ],
        continuousSelectedDays: ['Saturday', 'Sunday'],
        continuousEndOfMonthOptions: {
          firstDay: { enabled: false, value: 0 },
          firstWeekday: { enabled: false, value: 0 },
          lastDay: { enabled: false, value: 0 },
          lastWeekday: { enabled: false, value: 0 }
        },
        discreteDateRanges: [],
        discreteTimeRanges: [],
        discreteSelectedDays: [],
        discreteEndOfMonthOptions: {
          firstDay: { enabled: false, value: 0 },
          firstWeekday: { enabled: false, value: 0 },
          lastDay: { enabled: false, value: 0 },
          lastWeekday: { enabled: false, value: 0 }
        },
        selectedSysplex: [],
        selectedShifts: [],
        selectedInterestGroup: 'IGT (default)',
        selectedReportingInterval: '15 minutes',
        comparisonMode: 'relative',
        comparisonRelativeNumber: '01',
        comparisonRelativeUnit: 'Weeks earlier',
        absoluteFromDate: undefined,
        absoluteToDate: undefined
      }
    },
    {
      id: '3',
      name: 'Monthly Billing Cycle',
      description: 'Standard monthly billing period configuration aligned with fiscal calendar. Tracks full month data ranges with end-of-month processing windows included.',
      savedOn: '02/01/2026',
      filterData: {
        timeRangeType: 'presets',
        selectedQuickOption: 'Previous billing month',
        relativeNumber: '1',
        relativeUnit: 'months',
        singleDate: undefined,
        continuousDateTimeRanges: [],
        continuousSelectedDays: [],
        continuousEndOfMonthOptions: {
          firstDay: { enabled: false, value: 0 },
          firstWeekday: { enabled: false, value: 0 },
          lastDay: { enabled: false, value: 0 },
          lastWeekday: { enabled: false, value: 0 }
        },
        discreteDateRanges: [],
        discreteTimeRanges: [],
        discreteSelectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        discreteEndOfMonthOptions: {
          firstDay: { enabled: true, value: 1 },
          firstWeekday: { enabled: false, value: 0 },
          lastDay: { enabled: true, value: 2 },
          lastWeekday: { enabled: false, value: 0 }
        },
        selectedSysplex: ['SYSA', 'SYSB', 'SYSC'],
        selectedShifts: [],
        selectedInterestGroup: 'Billing Group',
        selectedReportingInterval: 'Daily',
        comparisonMode: 'relative',
        comparisonRelativeNumber: '01',
        comparisonRelativeUnit: 'Months earlier',
        absoluteFromDate: undefined,
        absoluteToDate: undefined
      }
    },
    {
      id: '4',
      name: 'Peak Hours Analysis',
      description: 'Time range filter optimized for high-traffic periods between 2 PM and 6 PM. Designed for capacity planning and performance monitoring during business peak times.',
      savedOn: '02/03/2026',
      filterData: {
        timeRangeType: 'discrete',
        selectedQuickOption: 'Previous month',
        relativeNumber: '8',
        relativeUnit: 'hours',
        singleDate: undefined,
        continuousDateTimeRanges: [],
        continuousSelectedDays: [],
        continuousEndOfMonthOptions: {
          firstDay: { enabled: false, value: 0 },
          firstWeekday: { enabled: false, value: 0 },
          lastDay: { enabled: false, value: 0 },
          lastWeekday: { enabled: false, value: 0 }
        },
        discreteDateRanges: [{ fromDate: '01/15/2026', toDate: '02/05/2026' }],
        discreteTimeRanges: [
          { fromTime: '14:00', toTime: '18:00' }
        ],
        discreteSelectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        discreteEndOfMonthOptions: {
          firstDay: { enabled: false, value: 0 },
          firstWeekday: { enabled: false, value: 0 },
          lastDay: { enabled: false, value: 0 },
          lastWeekday: { enabled: false, value: 0 }
        },
        selectedSysplex: ['SYSA'],
        selectedShifts: ['Afternoon'],
        selectedInterestGroup: 'Performance Group',
        selectedReportingInterval: '15 minutes',
        comparisonMode: 'relative',
        comparisonRelativeNumber: '01',
        comparisonRelativeUnit: 'Weeks earlier',
        absoluteFromDate: undefined,
        absoluteToDate: undefined
      }
    },
    {
      id: '5',
      name: 'Quarterly Review Set',
      description: 'Quarterly performance review filter spanning three-month periods. Includes comparison settings for year-over-year trend analysis and strategic planning.',
      savedOn: '02/05/2026',
      filterData: {
        timeRangeType: 'continuous',
        selectedQuickOption: 'Previous month',
        relativeNumber: '3',
        relativeUnit: 'months',
        singleDate: undefined,
        continuousDateTimeRanges: [
          { fromDate: '10/01/2025', fromTime: '00:00', toDate: '12/31/2025', toTime: '23:59' }
        ],
        continuousSelectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        continuousEndOfMonthOptions: {
          firstDay: { enabled: true, value: 1 },
          firstWeekday: { enabled: false, value: 0 },
          lastDay: { enabled: true, value: 1 },
          lastWeekday: { enabled: false, value: 0 }
        },
        discreteDateRanges: [],
        discreteTimeRanges: [],
        discreteSelectedDays: [],
        discreteEndOfMonthOptions: {
          firstDay: { enabled: false, value: 0 },
          firstWeekday: { enabled: false, value: 0 },
          lastDay: { enabled: false, value: 0 },
          lastWeekday: { enabled: false, value: 0 }
        },
        selectedSysplex: ['SYSA', 'SYSB', 'SYSC', 'SYSD'],
        selectedShifts: ['Morning', 'Afternoon', 'Night'],
        selectedInterestGroup: 'Executive Review',
        selectedReportingInterval: 'Weekly',
        comparisonMode: 'relative',
        comparisonRelativeNumber: '12',
        comparisonRelativeUnit: 'Months earlier',
        absoluteFromDate: undefined,
        absoluteToDate: undefined
      }
    }
  ]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  
  // Calculate date ranges
  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const currentWeekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday
  const previousWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
  const previousWeekEnd = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
  const currentMonthStart = startOfMonth(today);
  const currentYearStart = startOfYear(today);
  // Billing month: 2nd of one month through 1st of next month
  // e.g., January billing month = Jan 2 - Feb 1
  const todayDate = today.getDate();
  // Current billing month: if today >= 2nd, we're in this month's billing period
  const currentBillingMonthStart = todayDate >= 2
    ? new Date(today.getFullYear(), today.getMonth(), 2)
    : new Date(today.getFullYear(), today.getMonth() - 1, 2);
  const currentBillingMonthEnd = todayDate >= 2
    ? new Date(today.getFullYear(), today.getMonth() + 1, 1)
    : new Date(today.getFullYear(), today.getMonth(), 1);
  // Previous billing month: the billing month before the current one
  const previousBillingMonthStart = todayDate >= 2
    ? new Date(today.getFullYear(), today.getMonth() - 1, 2)
    : new Date(today.getFullYear(), today.getMonth() - 2, 2);
  const previousBillingMonthEnd = todayDate >= 2
    ? new Date(today.getFullYear(), today.getMonth(), 1)
    : new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const numberOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '15', '20', '24', '30'];

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
      
      // Ensure minimum value of 0
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

  const addTimeRange = () => {
    if (newTimeRange.from && newTimeRange.to) {
      if (newTimeRange.from < newTimeRange.to) {
        setTimeRanges([...timeRanges, { from: newTimeRange.from, to: newTimeRange.to }]);
        setNewTimeRange({ from: '00:00', to: '00:00' });
        setTimeErrorMessage('');
      } else {
        setTimeErrorMessage('End time must be after start time.');
      }
    }
  };

  const removeTimeRange = (index: number) => {
    setTimeRanges(timeRanges.filter((_, i) => i !== index));
  };

  // Build an ActiveSelection from current state for the info box
  const buildActiveSelection = (): ActiveSelection => {
    // Build time range label — resolved to concrete dates where possible
    let timeRangeLabel = '';
    if (timeRangeType === 'presets') {
      if (selectedQuickOption === 'All data') {
        timeRangeLabel = 'All data';
      } else if (selectedQuickOption === 'Specific date' || selectedQuickOption === 'Single date') {
        timeRangeLabel = singleDate ? format(singleDate, 'MM/dd/yyyy') : 'No date selected';
      } else if (selectedQuickOption === 'Today') {
        timeRangeLabel = format(today, 'MM/dd/yyyy');
      } else if (selectedQuickOption === 'Yesterday') {
        const yesterday = subDays(today, 1);
        timeRangeLabel = format(yesterday, 'MM/dd/yyyy');
      } else if (selectedQuickOption === 'Current week') {
        timeRangeLabel = `${format(currentWeekStart, 'MM/dd/yyyy')} - ${format(today, 'MM/dd/yyyy')}`;
      } else if (selectedQuickOption === 'Current month') {
        timeRangeLabel = `${format(currentMonthStart, 'MM/dd/yyyy')} - ${format(today, 'MM/dd/yyyy')}`;
      } else if (selectedQuickOption === 'Current year') {
        timeRangeLabel = `${format(currentYearStart, 'MM/dd/yyyy')} - ${format(today, 'MM/dd/yyyy')}`;
      } else if (selectedQuickOption === 'Previous week') {
        timeRangeLabel = `${format(previousWeekStart, 'MM/dd/yyyy')} - ${format(previousWeekEnd, 'MM/dd/yyyy')}`;
      } else if (selectedQuickOption === 'Previous month') {
        timeRangeLabel = `${format(startOfMonth(subMonths(today, 1)), 'MM/dd/yyyy')} - ${format(endOfMonth(subMonths(today, 1)), 'MM/dd/yyyy')}`;
      } else if (selectedQuickOption === 'Previous year') {
        const prevYearStart = new Date(today.getFullYear() - 1, 0, 1);
        const prevYearEnd = new Date(today.getFullYear() - 1, 11, 31);
        timeRangeLabel = `${format(prevYearStart, 'MM/dd/yyyy')} - ${format(prevYearEnd, 'MM/dd/yyyy')}`;
      } else if (selectedQuickOption === 'Last week') {
        timeRangeLabel = `${format(subWeeks(today, 1), 'MM/dd/yyyy')} - ${format(today, 'MM/dd/yyyy')}`;
      } else if (selectedQuickOption === 'Last month') {
        timeRangeLabel = `${format(subMonths(today, 1), 'MM/dd/yyyy')} - ${format(today, 'MM/dd/yyyy')}`;
      } else if (selectedQuickOption === 'Last year') {
        timeRangeLabel = `${format(subYears(today, 1), 'MM/dd/yyyy')} - ${format(today, 'MM/dd/yyyy')}`;
      } else if (selectedQuickOption === 'Relative') {
        timeRangeLabel = `Last ${relativeNumber} ${relativeUnit}`;
      } else {
        timeRangeLabel = selectedQuickOption;
      }
    } else if (timeRangeType === 'continuous') {
      if (continuousDateTimeRanges.length > 0) {
        const r = continuousDateTimeRanges[0];
        timeRangeLabel = `${r.fromDate} ${r.fromTime} - ${r.toDate} ${r.toTime}`;
        if (continuousDateTimeRanges.length > 1) {
          timeRangeLabel += ` (+${continuousDateTimeRanges.length - 1} more)`;
        }
      } else {
        timeRangeLabel = 'Continuous range (not set)';
      }
    } else if (timeRangeType === 'discrete') {
      if (discreteDateRanges.length > 0) {
        const r = discreteDateRanges[0];
        timeRangeLabel = `${r.fromDate} - ${r.toDate}`;
        if (discreteDateRanges.length > 1) {
          timeRangeLabel += ` (+${discreteDateRanges.length - 1} more)`;
        }
      } else {
        timeRangeLabel = 'Discrete range (not set)';
      }
    }

    // Build days label (compact, for the right side)
    const shortDays: Record<string, string> = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };
    let activeDays: string[] = [];
    if (timeRangeType === 'continuous') activeDays = continuousSelectedDays;
    else if (timeRangeType === 'discrete') activeDays = discreteSelectedDays;
    else activeDays = selectedDays;

    let daysLabel = '';
    if (activeDays.length === 0 || activeDays.length === 7) {
      daysLabel = '';
    } else if (activeDays.length === 5 && !activeDays.includes('Saturday') && !activeDays.includes('Sunday')) {
      daysLabel = 'Mon-Fri';
    } else if (activeDays.length === 2 && activeDays.includes('Saturday') && activeDays.includes('Sunday')) {
      daysLabel = 'Sat-Sun';
    } else {
      daysLabel = activeDays.map(d => shortDays[d] || d).join(', ');
    }

    // Full days-of-week label for the summary top-left (only when a non-default selection)
    const daysOfWeekFull = activeDays.length > 0 && activeDays.length < 7
      ? activeDays.map(d => shortDays[d] || d).join(', ')
      : undefined;

    // End-of-month options summary
    const activeEom = timeRangeType === 'continuous'
      ? continuousEndOfMonthOptions
      : timeRangeType === 'discrete'
        ? discreteEndOfMonthOptions
        : endOfMonthOptions;
    const eomParts: string[] = [];
    if (activeEom.firstDay.enabled && activeEom.firstDay.value > 0)
      eomParts.push(`First day(s) of the month: ${activeEom.firstDay.value}`);
    if (activeEom.firstWeekday.enabled && activeEom.firstWeekday.value > 0)
      eomParts.push(`First weekday(s) of the month: ${activeEom.firstWeekday.value}`);
    if (activeEom.lastDay.enabled && activeEom.lastDay.value > 0)
      eomParts.push(`Last day(s) of the month: ${activeEom.lastDay.value}`);
    if (activeEom.lastWeekday.enabled && activeEom.lastWeekday.value > 0)
      eomParts.push(`Last weekday(s) of the month: ${activeEom.lastWeekday.value}`);
    const endOfMonthSummary = eomParts.length > 0 ? eomParts.join(', ') : undefined;

    // Interest group
    const ig = selectedInterestGroup.replace(' (Default)', '').replace(' (default)', '');

    // Sysplexes
    const sysplexLabel = selectedSysplex.length === 0 ? 'All sysplexes' : selectedSysplex.join(', ');

    // Shifts
    const shiftsLabel = selectedShifts.length === 0 ? 'All shifts' : selectedShifts.join(', ');

    // Reporting interval
    const riLabel = selectedReportingInterval.replace('Default (Measurement)', 'Measurement');

    // Comparison
    let comparison: ActiveSelection['comparison'] = undefined;
    if (comparisonMode !== 'none') {
      let compLabel = '';
      if (comparisonMode === 'relative' && comparisonRelativeNumber && comparisonRelativeUnit) {
        compLabel = `${comparisonRelativeNumber} ${comparisonRelativeUnit}`;
      } else if (comparisonMode === 'absolute') {
        if (absoluteFromDate && absoluteToDate) {
          compLabel = `${format(absoluteFromDate, 'M/d/yyyy')} - ${format(absoluteToDate, 'M/d/yyyy')}`;
        } else {
          compLabel = 'Absolute range';
        }
      }

      // Build concrete date range labels
      let mainRangeLabel = timeRangeLabel;
      let comparisonRangeLabel = timeRangeLabel;

      if (timeRangeType === 'presets') {
        const now = new Date();
        let mainFrom: Date | null = null;
        let mainTo: Date | null = null;

        if (selectedQuickOption === 'Last year') {
          mainFrom = subYears(now, 1);
          mainTo = now;
        } else if (selectedQuickOption === 'Last month') {
          mainFrom = subMonths(now, 1);
          mainTo = now;
        } else if (selectedQuickOption === 'Last week') {
          mainFrom = subWeeks(now, 1);
          mainTo = now;
        } else if (selectedQuickOption === 'Previous month') {
          mainFrom = startOfMonth(subMonths(now, 1));
          mainTo = endOfMonth(subMonths(now, 1));
        } else if (selectedQuickOption === 'All data') {
          mainFrom = new Date(2024, 0, 1);
          mainTo = now;
        } else {
          const num = parseInt(relativeNumber) || 1;
          if (relativeUnit === 'days') mainFrom = subDays(now, num);
          else if (relativeUnit === 'weeks') mainFrom = subWeeks(now, num);
          else if (relativeUnit === 'months') mainFrom = subMonths(now, num);
          else if (relativeUnit === 'years') mainFrom = subYears(now, num);
          else mainFrom = subDays(now, num);
          mainTo = now;
        }

        if (mainFrom && mainTo) {
          mainRangeLabel = `${format(mainFrom, 'M/d/yyyy h:mm aa')} - ${format(mainTo, 'M/d/yyyy h:mm aa')}`;

          if (comparisonMode === 'relative' && comparisonRelativeNumber && comparisonRelativeUnit) {
            const compNum = parseInt(comparisonRelativeNumber) || 1;
            let offset = 0;
            const unit = comparisonRelativeUnit.toLowerCase();
            if (unit.includes('day')) offset = compNum;
            else if (unit.includes('week')) offset = compNum * 7;
            else if (unit.includes('month')) offset = compNum * 30;
            else if (unit.includes('year')) offset = compNum * 365;
            else offset = compNum * 7;

            const compFrom = subDays(mainFrom, offset);
            const compTo = subDays(mainTo, offset);
            comparisonRangeLabel = `${format(compFrom, 'M/d/yyyy h:mm aa')} - ${format(compTo, 'M/d/yyyy h:mm aa')}`;
          }
        }
      }

      if (compLabel) {
        comparison = {
          mode: comparisonMode as 'relative' | 'absolute',
          label: compLabel,
          comparisonRangeLabel,
          mainRangeLabel,
        };
      }
    }

    return {
      timeRangeLabel,
      interestGroup: ig,
      sysplexes: sysplexLabel,
      shifts: shiftsLabel,
      reportingInterval: riLabel,
      days: daysLabel,
      daysOfWeekFull,
      endOfMonthSummary,
      comparison,
    };
  };

  const handleApply = () => {
    if (onApply) {
      onApply(buildActiveSelection());
    }
  };

  // Handler for saving a combination
  const handleSaveCombination = (name: string, description: string, applyImmediately: boolean) => {
    const newCombination: SavedCombination = {
      id: Date.now().toString(),
      name,
      description,
      savedOn: format(new Date(), 'MM/dd/yyyy'),
      filterData: {
        timeRangeType,
        // Presets state
        selectedQuickOption,
        relativeNumber,
        relativeUnit,
        singleDate,
        // Continuous state
        continuousDateTimeRanges,
        continuousSelectedDays,
        continuousEndOfMonthOptions,
        // Discrete state
        discreteDateRanges,
        discreteTimeRanges,
        discreteSelectedDays,
        discreteEndOfMonthOptions,
        // Additional filters
        selectedSysplex,
        selectedShifts,
        selectedInterestGroup,
        selectedReportingInterval,
        // Comparison
        comparisonMode,
        comparisonRelativeNumber,
        comparisonRelativeUnit,
        absoluteFromDate,
        absoluteToDate
      }
    };

    setSavedCombinations([newCombination, ...savedCombinations]);
    setShowSaveModal(false);
    
    // Navigate to saved combinations tab and highlight the new one
    setActiveTab('saved-combinations');
    setSelectedSavedCombination(newCombination.id);
    setHighlightedCombinationId(newCombination.id);
    
    // Clear highlight after animation
    setTimeout(() => {
      setHighlightedCombinationId(null);
    }, 3000);
    
    if (applyImmediately) {
      handleApply();
    }
  };

  // Handler for selecting a saved combination
  const handleSelectSavedCombination = (id: string) => {
    setSelectedSavedCombination(id);
    
    // Find and load the saved combination data
    const combination = savedCombinations.find(c => c.id === id);
    if (combination?.filterData) {
      const data = combination.filterData;
      
      // Restore all state from saved data
      setTimeRangeType(data.timeRangeType);
      setSelectedQuickOption(data.selectedQuickOption || 'Previous month');
      setRelativeNumber(data.relativeNumber || '8');
      setRelativeUnit(data.relativeUnit || 'hours');
      setSingleDate(data.singleDate);
      
      setContinuousDateTimeRanges(data.continuousDateTimeRanges || []);
      setContinuousSelectedDays(data.continuousSelectedDays || []);
      setContinuousEndOfMonthOptions(data.continuousEndOfMonthOptions || {
        firstDay: { enabled: false, value: 0 },
        firstWeekday: { enabled: false, value: 0 },
        lastDay: { enabled: false, value: 0 },
        lastWeekday: { enabled: false, value: 0 }
      });
      
      setDiscreteDateRanges(data.discreteDateRanges || []);
      setDiscreteTimeRanges(data.discreteTimeRanges || []);
      setDiscreteSelectedDays(data.discreteSelectedDays || []);
      setDiscreteEndOfMonthOptions(data.discreteEndOfMonthOptions || {
        firstDay: { enabled: false, value: 0 },
        firstWeekday: { enabled: false, value: 0 },
        lastDay: { enabled: false, value: 0 },
        lastWeekday: { enabled: false, value: 0 }
      });
      
      setSelectedSysplex(data.selectedSysplex || []);
      setSelectedShifts(data.selectedShifts || []);
      setSelectedInterestGroup(data.selectedInterestGroup || 'IGT (default)');
      setSelectedReportingInterval(data.selectedReportingInterval || 'Hourly');
      
      setComparisonMode(data.comparisonMode || 'none');
      setComparisonRelativeNumber(data.comparisonRelativeNumber || '08');
      setComparisonRelativeUnit(data.comparisonRelativeUnit || 'Weeks earlier');
      setAbsoluteFromDate(data.absoluteFromDate);
      setAbsoluteToDate(data.absoluteToDate);
    }
  };

  // Calculate the duration of the selected time range in days
  const calculateTimeRangeDuration = (): number => {
    if (timeRangeType === 'presets') {
      switch (selectedQuickOption) {
        case 'Today':
        case 'Yesterday':
        case 'Single date':
          return 1;
        case 'Current week':
          return differenceInDays(today, currentWeekStart) + 1;
        case 'Previous week':
          return 7;
        case 'Current billing month':
          return differenceInDays(today, currentBillingMonthStart) + 1;
        case 'Previous month':
          return differenceInDays(endOfMonth(subMonths(today, 1)), startOfMonth(subMonths(today, 1))) + 1;
        case 'Previous billing month':
          return differenceInDays(previousBillingMonthEnd, previousBillingMonthStart) + 1;
        case 'Current month':
          return differenceInDays(today, currentMonthStart) + 1;
        case 'Current year':
          return differenceInDays(today, currentYearStart) + 1;
        case 'Previous year':
          return 365;
        default:
          return 30; // Default to month
      }
    } else if (timeRangeType === 'discrete' && discreteDateRanges.length > 0) {
      // Calculate from first discrete range
      const firstRange = discreteDateRanges[0];
      if (firstRange.fromDate && firstRange.toDate) {
        try {
          const fromParts = firstRange.fromDate.split('/');
          const toParts = firstRange.toDate.split('/');
          const from = new Date(parseInt(fromParts[2]), parseInt(fromParts[0]) - 1, parseInt(fromParts[1]));
          const to = new Date(parseInt(toParts[2]), parseInt(toParts[0]) - 1, parseInt(toParts[1]));
          return differenceInDays(to, from) + 1;
        } catch (e) {
          return 30; // Default
        }
      }
    } else if (timeRangeType === 'continuous' && continuousDateTimeRanges.length > 0) {
      // Calculate from first continuous range
      const firstRange = continuousDateTimeRanges[0];
      if (firstRange.fromDate && firstRange.toDate) {
        try {
          const fromParts = firstRange.fromDate.split('/');
          const toParts = firstRange.toDate.split('/');
          const from = new Date(parseInt(fromParts[2]), parseInt(fromParts[0]) - 1, parseInt(fromParts[1]));
          const to = new Date(parseInt(toParts[2]), parseInt(toParts[0]) - 1, parseInt(toParts[1]));
          return differenceInDays(to, from) + 1;
        } catch (e) {
          return 30; // Default
        }
      }
    }
    return 30; // Default to month if nothing is selected
  };

  // Check if multiple time ranges are selected (for disabling absolute comparison)
  const hasMultipleTimeRanges = (): boolean => {
    if (timeRangeType === 'continuous') {
      return continuousDateTimeRanges.length > 1;
    } else if (timeRangeType === 'discrete') {
      return discreteDateRanges.length > 1;
    }
    return false;
  };

  // Calculate total count of all tags in the filters preview
  const calculateTotalTagCount = () => {
    let count = 0;
    
    // Time range type: always 1
    count += 1;
    
    if (timeRangeType === 'presets') {
      // Quick select: 1 if present
      if (selectedQuickOption) {
        count += 1;
      }
      
      // Days of the week
      count += selectedDays.length;
      
      // End of month options
      if (endOfMonthOptions.firstDay.enabled) count += 1;
      if (endOfMonthOptions.firstWeekday.enabled) count += 1;
      if (endOfMonthOptions.lastDay.enabled) count += 1;
      if (endOfMonthOptions.lastWeekday.enabled) count += 1;
      
      // Time ranges
      count += timeRanges.length;
    } else if (timeRangeType === 'continuous') {
      // Select date range(s)
      count += continuousDateTimeRanges.length;
      
      // Days of the week
      count += continuousSelectedDays.length;
      
      // End of month options
      if (continuousEndOfMonthOptions.firstDay.enabled) count += 1;
      if (continuousEndOfMonthOptions.firstWeekday.enabled) count += 1;
      if (continuousEndOfMonthOptions.lastDay.enabled) count += 1;
      if (continuousEndOfMonthOptions.lastWeekday.enabled) count += 1;
    } else if (timeRangeType === 'discrete') {
      // Select date range(s)
      count += discreteDateRanges.length;
      
      // Days of the week
      count += discreteSelectedDays.length;
      
      // End of month options
      if (discreteEndOfMonthOptions.firstDay.enabled) count += 1;
      if (discreteEndOfMonthOptions.firstWeekday.enabled) count += 1;
      if (discreteEndOfMonthOptions.lastDay.enabled) count += 1;
      if (discreteEndOfMonthOptions.lastWeekday.enabled) count += 1;
      
      // Time ranges
      count += discreteTimeRanges.length;
    }
    
    return count;
  };

  // Calculate count for Time range accordion only (excluding Time range type tag)
  const calculateTimeRangeAccordionCount = () => {
    let count = 0;
    
    if (timeRangeType === 'presets') {
      // Quick select: 1 if present
      if (selectedQuickOption) {
        count += 1;
      }
      
      // Days of the week
      count += selectedDays.length;
      
      // End of month options
      if (endOfMonthOptions.firstDay.enabled) count += 1;
      if (endOfMonthOptions.firstWeekday.enabled) count += 1;
      if (endOfMonthOptions.lastDay.enabled) count += 1;
      if (endOfMonthOptions.lastWeekday.enabled) count += 1;
      
      // Time ranges
      count += timeRanges.length;
    } else if (timeRangeType === 'continuous') {
      // Select date range(s)
      count += continuousDateTimeRanges.length;
      
      // Days of the week
      count += continuousSelectedDays.length;
      
      // End of month options
      if (continuousEndOfMonthOptions.firstDay.enabled) count += 1;
      if (continuousEndOfMonthOptions.firstWeekday.enabled) count += 1;
      if (continuousEndOfMonthOptions.lastDay.enabled) count += 1;
      if (continuousEndOfMonthOptions.lastWeekday.enabled) count += 1;
    } else if (timeRangeType === 'discrete') {
      // Select date range(s)
      count += discreteDateRanges.length;
      
      // Days of the week
      count += discreteSelectedDays.length;
      
      // End of month options
      if (discreteEndOfMonthOptions.firstDay.enabled) count += 1;
      if (discreteEndOfMonthOptions.firstWeekday.enabled) count += 1;
      if (discreteEndOfMonthOptions.lastDay.enabled) count += 1;
      if (discreteEndOfMonthOptions.lastWeekday.enabled) count += 1;
      
      // Time ranges
      count += discreteTimeRanges.length;
    }
    
    return count;
  };

  const totalTagCount = calculateTotalTagCount();
  const timeRangeAccordionCount = calculateTimeRangeAccordionCount();

  // Calculate count for Additional filters accordion
  const calculateAdditionalFiltersCount = () => {
    let count = 0;
    count += selectedSysplex.length;
    count += selectedShifts.length;
    // Only count interest group if it has a value
    if (selectedInterestGroup) count += 1;
    // Reporting interval always has a value
    count += 1; // Reporting interval
    return count;
  };

  const additionalFiltersCount = calculateAdditionalFiltersCount();

  // Calculate count for Comparison accordion
  const calculateComparisonCount = () => {
    if (comparisonMode === 'relative' && comparisonRelativeNumber) {
      return 1;
    } else if (comparisonMode === 'absolute' && (absoluteFromDate || absoluteToDate)) {
      return absoluteFromDate && absoluteToDate ? 2 : 1;
    }
    return 0;
  };

  const comparisonCount = calculateComparisonCount();

  const handleTimeInput = (value: string, field: 'from' | 'to') => {
    // Clear error when user starts editing
    if (timeErrorMessage) {
      setTimeErrorMessage('');
    }
    
    // Remove any non-numeric characters except colon
    let cleaned = value.replace(/[^\d:]/g, '');
    
    // Remove any colons
    let digitsOnly = cleaned.replace(/:/g, '');
    
    // Limit to 4 digits
    if (digitsOnly.length > 4) {
      digitsOnly = digitsOnly.slice(0, 4);
    }
    
    // Format as HH:MM with validation
    let formatted = '';
    if (digitsOnly.length >= 1) {
      let hours = digitsOnly.slice(0, 2);
      
      // Validate hours (00-23)
      if (hours.length === 2) {
        const hoursNum = parseInt(hours, 10);
        if (hoursNum > 23) {
          hours = '23';
        }
      }
      
      formatted = hours;
      
      if (digitsOnly.length >= 3) {
        let minutes = digitsOnly.slice(2, 4);
        
        // Validate minutes (00-59)
        if (minutes.length === 2) {
          const minutesNum = parseInt(minutes, 10);
          if (minutesNum > 59) {
            minutes = '59';
          }
        }
        
        formatted += ':' + minutes;
      }
    }
    
    setNewTimeRange({ ...newTimeRange, [field]: formatted });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-[1200px] flex flex-col overflow-hidden" style={{ height: '900px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl mb-1">Interval Selection</h1>
          <p className="text-sm text-gray-600">Configure time ranges and filters for your data analysis</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('time-range')}
          className={`px-4 py-3 text-sm flex items-center gap-2 ml-6 ${
            activeTab === 'time-range' 
              ? 'font-semibold border-b-2 border-blue-600 -mb-px' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Time range
          <Clock size={14} className="text-gray-400" />
        </button>
        <button 
          onClick={() => setActiveTab('additional-filters')}
          className={`px-4 py-3 text-sm flex items-center gap-2 ${
            activeTab === 'additional-filters' 
              ? 'font-semibold border-b-2 border-blue-600 -mb-px' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Additional filters
          <Filter size={14} className="text-gray-400" />
        </button>
        <button 
          onClick={() => setActiveTab('comparisons')}
          className={`px-4 py-3 text-sm flex items-center gap-2 ${
            activeTab === 'comparisons' 
              ? 'font-semibold border-b-2 border-blue-600 -mb-px' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Comparisons
          <GitCompare size={14} className="text-gray-400" />
        </button>
        <button 
          onClick={() => setActiveTab('saved-combinations')}
          className={`px-4 py-3 text-sm flex items-center gap-2 ${
            activeTab === 'saved-combinations' 
              ? 'font-semibold border-b-2 border-blue-600 -mb-px' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Saved combinations
          <Bookmark size={14} className="text-gray-400" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 border-r border-gray-200">
          {activeTab === 'time-range' && (
            <>
              {/* Radio Group - Presets/Continuous/Discrete */}
              <div className="sticky top-0 bg-white z-10 py-5 mb-6 border-b border-gray-200">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer" onClick={() => setTimeRangeType('presets')}>
                <div className={`w-5 h-5 rounded-full border-2 ${timeRangeType === 'presets' ? 'border-black flex items-center justify-center' : 'border-gray-400'}`}>
                  {timeRangeType === 'presets' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                </div>
                <span className="text-sm">Presets</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer" onClick={() => setTimeRangeType('continuous')}>
                <div className={`w-5 h-5 rounded-full border-2 ${timeRangeType === 'continuous' ? 'border-black flex items-center justify-center' : 'border-gray-400'}`}>
                  {timeRangeType === 'continuous' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                </div>
                <span className="text-sm">Continuous range(s)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer" onClick={() => setTimeRangeType('discrete')}>
                <div className={`w-5 h-5 rounded-full border-2 ${timeRangeType === 'discrete' ? 'border-black flex items-center justify-center' : 'border-gray-400'}`}>
                  {timeRangeType === 'discrete' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                </div>
                <span className="text-sm">Discrete range(s)</span>
              </label>
            </div>
          </div>

          {/* Conditional content based on timeRangeType */}
          {timeRangeType === 'presets' && (
            <>
              {/* Quick Select */}
              <div className="mb-6">
                <h3 className="text-sm mb-3">Quick select</h3>
                <div className="grid grid-cols-4 gap-x-8 gap-y-3">
                  {/* Column 1 */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedQuickOption('All data')}>
                      <div className={`w-5 h-5 rounded-full border-2 ${selectedQuickOption === 'All data' ? 'border-black flex items-center justify-center' : 'border-gray-400'}`}>
                        {selectedQuickOption === 'All data' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                      </div>
                      <span className="text-xs">All data</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedQuickOption('Today')}>
                      <div className={`w-5 h-5 rounded-full border-2 ${selectedQuickOption === 'Today' ? 'border-black flex items-center justify-center' : 'border-gray-400'}`}>
                        {selectedQuickOption === 'Today' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                      </div>
                      <span className="text-xs">Today</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedQuickOption('Yesterday')}>
                      <div className={`w-5 h-5 rounded-full border-2 ${selectedQuickOption === 'Yesterday' ? 'border-black flex items-center justify-center' : 'border-gray-400'}`}>
                        {selectedQuickOption === 'Yesterday' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                      </div>
                      <span className="text-xs">Yesterday</span>
                    </label>
                  </div>
                  
                  {/* Column 2 */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedQuickOption('Current week')}>
                      <div className={`w-5 h-5 rounded-full border-2 ${selectedQuickOption === 'Current week' ? 'border-black flex items-center justify-center' : 'border-gray-400'}`}>
                        {selectedQuickOption === 'Current week' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                      </div>
                      <span className="text-xs">Current week</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedQuickOption('Current month')}>
                      <div className={`w-5 h-5 rounded-full border-2 ${selectedQuickOption === 'Current month' ? 'border-black flex items-center justify-center' : 'border-gray-400'}`}>
                        {selectedQuickOption === 'Current month' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                      </div>
                      <span className="text-xs">Current month</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedQuickOption('Current billing month')}>
                      <div className={`w-5 h-5 rounded-full border-2 ${selectedQuickOption === 'Current billing month' ? 'border-black flex items-center justify-center' : 'border-gray-400'}`}>
                        {selectedQuickOption === 'Current billing month' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                      </div>
                      <span className="text-xs">Current billing month</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedQuickOption('Current year')}>
                      <div className={`w-5 h-5 rounded-full border-2 ${selectedQuickOption === 'Current year' ? 'border-black flex items-center justify-center' : 'border-gray-400'}`}>
                        {selectedQuickOption === 'Current year' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                      </div>
                      <span className="text-xs">Current year</span>
                    </label>
                  </div>
                  
                  {/* Column 3 */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedQuickOption('Previous week')}>
                      <div className={`w-5 h-5 rounded-full border-2 ${selectedQuickOption === 'Previous week' ? 'border-black flex items-center justify-center' : 'border-gray-400'}`}>
                        {selectedQuickOption === 'Previous week' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                      </div>
                      <span className="text-xs">Previous week</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedQuickOption('Previous month')}>
                      <div className={`w-5 h-5 rounded-full border-2 ${selectedQuickOption === 'Previous month' ? 'border-black flex items-center justify-center' : 'border-gray-400'}`}>
                        {selectedQuickOption === 'Previous month' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                      </div>
                      <span className="text-xs">Previous month</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedQuickOption('Previous billing month')}>
                      <div className={`w-5 h-5 rounded-full border-2 ${selectedQuickOption === 'Previous billing month' ? 'border-black flex items-center justify-center' : 'border-gray-400'}`}>
                        {selectedQuickOption === 'Previous billing month' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                      </div>
                      <span className="text-xs">Previous billing month</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedQuickOption('Previous year')}>
                      <div className={`w-5 h-5 rounded-full border-2 ${selectedQuickOption === 'Previous year' ? 'border-black flex items-center justify-center' : 'border-gray-400'}`}>
                        {selectedQuickOption === 'Previous year' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                      </div>
                      <span className="text-xs">Previous year</span>
                    </label>
                  </div>
                  
                  {/* Column 4 - Relative */}
                  <div className="col-span-1">
                    <div className="col-span-1">
                      <label className="flex items-center gap-2 cursor-pointer mb-3" onClick={() => {
                        setSelectedQuickOption('Single date');
                        setShowCalendar(true);
                      }}>
                        <div className={`w-5 h-5 rounded-full border-2 ${selectedQuickOption === 'Single date' ? 'border-black flex items-center justify-center' : 'border-gray-400'}`}>
                          {selectedQuickOption === 'Single date' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                        </div>
                        <span className="text-xs">Single date</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="mm/dd/yyyy"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          value={singleDate ? format(singleDate, 'MM/dd/yyyy') : ''}
                          readOnly
                          onClick={() => setShowCalendar(true)}
                        />
                        <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        
                        {/* Calendar Popup */}
                        {showCalendar && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowCalendar(false)} />
                            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                              <style>{`
                                .rdp-day_disabled {
                                  position: relative;
                                  cursor: not-allowed;
                                }
                                .rdp-day_disabled:hover::after {
                                  content: 'Future dates cannot be selected';
                                  position: absolute;
                                  bottom: 100%;
                                  left: 50%;
                                  transform: translateX(-50%);
                                  background-color: #1f2937;
                                  color: white;
                                  padding: 6px 12px;
                                  border-radius: 6px;
                                  font-size: 12px;
                                  white-space: nowrap;
                                  margin-bottom: 8px;
                                  z-index: 1000;
                                  pointer-events: none;
                                }
                                .rdp-day_disabled:hover::before {
                                  content: '';
                                  position: absolute;
                                  bottom: 100%;
                                  left: 50%;
                                  transform: translateX(-50%);
                                  border: 6px solid transparent;
                                  border-top-color: #1f2937;
                                  margin-bottom: 2px;
                                  z-index: 1000;
                                  pointer-events: none;
                                }
                              `}</style>
                              <DayPicker
                                mode="single"
                                selected={singleDate}
                                onSelect={setSingleDate}
                                onDayClick={() => setShowCalendar(false)}
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
                    <label className="flex items-center gap-2 cursor-pointer mb-3 mt-4" onClick={() => setSelectedQuickOption('Relative')}>
                      <div className={`w-5 h-5 rounded-full border-2 ${selectedQuickOption === 'Relative' ? 'border-black flex items-center justify-center' : 'border-gray-400'}`}>
                        {selectedQuickOption === 'Relative' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                      </div>
                      <span className="text-xs">Relative</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm appearance-none bg-white"
                          onMouseDown={() => setSelectedQuickOption('Relative')}
                        >
                          <option>Last</option>
                        </select>
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={relativeNumber}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Only allow numbers
                            if (value === '' || /^\d+$/.test(value)) {
                              setRelativeNumber(value);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          onClick={() => {
                            setSelectedQuickOption('Relative');
                            setShowNumberDropdown(!showNumberDropdown);
                          }}
                        />
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        
                        {/* Number Dropdown */}
                        {showNumberDropdown && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowNumberDropdown(false)} />
                            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20 w-full max-h-48 overflow-y-auto">
                              <ul className="w-full">
                                {numberOptions.map((option) => (
                                  <li
                                    key={option}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                                    onClick={() => {
                                      setRelativeNumber(option);
                                      setShowNumberDropdown(false);
                                    }}
                                  >
                                    {option}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="relative flex-1">
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm appearance-none bg-white"
                          value={relativeUnit}
                          onMouseDown={() => setSelectedQuickOption('Relative')}
                          onChange={(e) => setRelativeUnit(e.target.value)}
                        >
                          <option>hours</option>
                          <option>days</option>
                          <option>weeks</option>
                          <option>months</option>
                          <option>years</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
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

              {/* Select time ranges(s) */}
              <div className="mb-6">
                <h3 className="text-sm mb-3">Select time ranges(s)</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">From</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={newTimeRange.from}
                          onChange={(e) => handleTimeInput(e.target.value, 'from')}
                          className="w-24 pl-3 pr-9 py-2 border border-gray-300 rounded text-sm text-center"
                          placeholder="hh:mm"
                        />
                        <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">To</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={newTimeRange.to}
                          onChange={(e) => handleTimeInput(e.target.value, 'to')}
                          className={`w-24 pl-3 pr-9 py-2 border rounded text-sm text-center ${
                            timeErrorMessage
                              ? 'border-red-500 text-red-600 bg-red-50 hover:border-red-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-500'
                              : 'border-gray-300 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                          }`}
                          placeholder="hh:mm"
                        />
                        <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                      </div>
                    </div>
                    <button 
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 mt-5"
                      onClick={addTimeRange}
                    >
                      Add
                      <Plus size={14} />
                    </button>
                  </div>
                  {timeRanges.map((range, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">From</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={range.from}
                            className="w-24 pl-3 pr-9 py-2 border border-gray-300 rounded text-sm text-center"
                            readOnly
                          />
                          <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">To</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={range.to}
                            className="w-24 pl-3 pr-9 py-2 border border-gray-300 rounded text-sm text-center"
                            readOnly
                          />
                          <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                        </div>
                      </div>
                      <button 
                        className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1 mt-5"
                        onClick={() => removeTimeRange(index)}
                      >
                        Remove
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 3L11 11M3 11L11 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                {timeErrorMessage && <p className="text-red-500 text-xs mt-2">{timeErrorMessage}</p>}
              </div>
            </>
          )}

          {timeRangeType === 'continuous' && (
            <ContinuousRangeView
              dateTimeRanges={continuousDateTimeRanges}
              setDateTimeRanges={setContinuousDateTimeRanges}
              selectedDays={continuousSelectedDays}
              setSelectedDays={setContinuousSelectedDays}
              endOfMonthOptions={continuousEndOfMonthOptions}
              setEndOfMonthOptions={setContinuousEndOfMonthOptions}
            />
          )}

          {timeRangeType === 'discrete' && (
            <DiscreteRangeView
              dateRanges={discreteDateRanges}
              setDateRanges={setDiscreteDateRanges}
              timeRanges={discreteTimeRanges}
              setTimeRanges={setDiscreteTimeRanges}
              selectedDays={discreteSelectedDays}
              setSelectedDays={setDiscreteSelectedDays}
              endOfMonthOptions={discreteEndOfMonthOptions}
              setEndOfMonthOptions={setDiscreteEndOfMonthOptions}
            />
          )}
            </>
          )}

          {activeTab === 'additional-filters' && (
            <div className="py-5">
              <AdditionalFiltersView 
                selectedSysplex={selectedSysplex}
                setSelectedSysplex={setSelectedSysplex}
                selectedShifts={selectedShifts}
                setSelectedShifts={setSelectedShifts}
                selectedInterestGroup={selectedInterestGroup}
                setSelectedInterestGroup={setSelectedInterestGroup}
                selectedReportingInterval={selectedReportingInterval}
                setSelectedReportingInterval={setSelectedReportingInterval}
              />
            </div>
          )}

          {activeTab === 'comparisons' && (
            <ComparisonView 
              comparisonMode={comparisonMode}
              setComparisonMode={setComparisonMode}
              relativeNumber={comparisonRelativeNumber}
              setRelativeNumber={setComparisonRelativeNumber}
              relativeUnit={comparisonRelativeUnit}
              setRelativeUnit={setComparisonRelativeUnit}
              absoluteFromDate={absoluteFromDate}
              setAbsoluteFromDate={setAbsoluteFromDate}
              absoluteToDate={absoluteToDate}
              setAbsoluteToDate={setAbsoluteToDate}
              timeRangeDurationInDays={calculateTimeRangeDuration()}
              hasMultipleRanges={hasMultipleTimeRanges()}
            />
          )}

          {activeTab === 'saved-combinations' && (
            <SavedCombinationsView
              selectedCombinationId={selectedSavedCombination}
              onSelectCombination={handleSelectSavedCombination}
              savedCombinations={savedCombinations}
              highlightedCombinationId={highlightedCombinationId}
            />
          )}
        </div>

        {/* Right Panel - Filters Preview */}
        <div className="w-80 bg-gray-50 p-3 overflow-y-auto">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-300">
            <h2 className="text-sm font-medium">Filters preview</h2>
            <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">{(totalTagCount + additionalFiltersCount + comparisonCount).toString().padStart(2, '0')}</span>
          </div>

          {/* Time range section */}
          <div>
            <button 
              className="w-full text-left mb-4"
              onClick={() => setIsTimeRangeExpanded(!isTimeRangeExpanded)}
            >
              <div className="flex items-start gap-2 mb-2">
                <ChevronDown 
                  size={16} 
                  className={`text-gray-600 transition-transform mt-0.5 ${isTimeRangeExpanded ? '' : '-rotate-90'}`} 
                />
                <span className="text-sm">Time range</span>
              </div>
              <p className="text-xs text-gray-500 ml-6">Total additions: {timeRangeAccordionCount.toString().padStart(2, '0')}</p>
            </button>

            {/* Divider */}
            {isTimeRangeExpanded && (
              <div className="border-t border-gray-300 mb-4"></div>
            )}

            {/* Expanded content with white background */}
            {isTimeRangeExpanded && (
              <div className="bg-white p-3 rounded">
                {/* Time range type */}
                <div className="mb-6">
                  <h3 className="text-xs font-medium mb-3">Time range type:</h3>
                  <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {timeRangeType === 'presets' && 'Presets'}
                    {timeRangeType === 'continuous' && 'Continuous range(s)'}
                    {timeRangeType === 'discrete' && 'Discrete range(s)'}
                  </span>
                </div>

                {/* Quick select OR Select date range(s) */}
                {timeRangeType === 'presets' ? (
                  <div className="mb-6">
                    <h3 className="text-xs font-medium mb-3">Quick select:</h3>
                    <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {selectedQuickOption === 'Previous month' && `Previous month (${format(startOfMonth(subMonths(today, 1)), 'MM/dd/yyyy')} - ${format(endOfMonth(subMonths(today, 1)), 'MM/dd/yyyy')})`}
                      {selectedQuickOption === 'All data' && 'All data'}
                      {selectedQuickOption === 'Today' && `Today (${format(today, 'MM/dd/yyyy')})`}
                      {selectedQuickOption === 'Yesterday' && `Yesterday (${format(new Date(Date.now() - 86400000), 'MM/dd/yyyy')})`}
                      {selectedQuickOption === 'Current week' && `Current week (${format(currentWeekStart, 'MM/dd/yyyy')} - ${format(today, 'MM/dd/yyyy')})`}
                      {selectedQuickOption === 'Current month' && `Current month (${format(currentMonthStart, 'MM/dd/yyyy')} - ${format(today, 'MM/dd/yyyy')})`}
                      {selectedQuickOption === 'Current billing month' && `Current billing month (${format(currentBillingMonthStart, 'MM/dd/yyyy')} - ${format(currentBillingMonthEnd, 'MM/dd/yyyy')})`}
                      {selectedQuickOption === 'Current year' && `Current year (${format(currentYearStart, 'MM/dd/yyyy')} - ${format(today, 'MM/dd/yyyy')})`}
                      {selectedQuickOption === 'Previous week' && `Previous week (${format(previousWeekStart, 'MM/dd/yyyy')} - ${format(previousWeekEnd, 'MM/dd/yyyy')})`}
                      {selectedQuickOption === 'Previous billing month' && `Previous billing month (${format(previousBillingMonthStart, 'MM/dd/yyyy')} - ${format(previousBillingMonthEnd, 'MM/dd/yyyy')})`}
                      {selectedQuickOption === 'Previous year' && `Previous year (${today.getFullYear() - 1})`}
                      {selectedQuickOption === 'Single date' && singleDate && `Single date (${format(singleDate, 'MM/dd/yyyy')})`}
                      {selectedQuickOption === 'Single date' && !singleDate && 'Single date'}
                      {selectedQuickOption === 'Relative' && `Relative: Last ${relativeNumber} ${relativeUnit}`}
                    </span>
                  </div>
                ) : timeRangeType === 'continuous' && continuousDateTimeRanges.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="text-xs font-medium mb-3">Select date range(s):</h3>
                    <div className="flex flex-wrap gap-2">
                      {continuousDateTimeRanges.map((range, index) => (
                        <span key={index} className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {range.fromDate} {range.fromTime} - {range.toDate} {range.toTime}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : timeRangeType === 'discrete' && discreteDateRanges.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="text-xs font-medium mb-3">Select date range(s):</h3>
                    <div className="flex flex-wrap gap-2">
                      {discreteDateRanges.map((range, index) => (
                        <span key={index} className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {range.fromDate} - {range.toDate}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Day(s) of the week */}
                {timeRangeType === 'presets' && selectedDays.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-medium mb-3">Day(s) of the week:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDays.map(day => (
                        <span key={day} className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {timeRangeType === 'continuous' && continuousSelectedDays.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-medium mb-3">Day(s) of the week:</h3>
                    <div className="flex flex-wrap gap-2">
                      {continuousSelectedDays.map(day => (
                        <span key={day} className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {timeRangeType === 'discrete' && discreteSelectedDays.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-medium mb-3">Day(s) of the week:</h3>
                    <div className="flex flex-wrap gap-2">
                      {discreteSelectedDays.map(day => (
                        <span key={day} className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* End of month day(s) */}
                {timeRangeType === 'presets' && (endOfMonthOptions.firstDay.enabled || endOfMonthOptions.firstWeekday.enabled || endOfMonthOptions.lastDay.enabled || endOfMonthOptions.lastWeekday.enabled) && (
                  <div className="mb-6">
                    <h3 className="text-xs font-medium mb-3">End of month day(s):</h3>
                    <div className="flex flex-wrap gap-2">
                      {endOfMonthOptions.firstDay.enabled && (
                        <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          First day(s) of the month: {endOfMonthOptions.firstDay.value.toString().padStart(2, '0')}
                        </span>
                      )}
                      {endOfMonthOptions.firstWeekday.enabled && (
                        <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          First weekday(s) of the month: {endOfMonthOptions.firstWeekday.value}
                        </span>
                      )}
                      {endOfMonthOptions.lastDay.enabled && (
                        <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          Last day(s) of the month: {endOfMonthOptions.lastDay.value}
                        </span>
                      )}
                      {endOfMonthOptions.lastWeekday.enabled && (
                        <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          Last weekday(s) of the month: {endOfMonthOptions.lastWeekday.value}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {timeRangeType === 'continuous' && (continuousEndOfMonthOptions.firstDay.enabled || continuousEndOfMonthOptions.firstWeekday.enabled || continuousEndOfMonthOptions.lastDay.enabled || continuousEndOfMonthOptions.lastWeekday.enabled) && (
                  <div className="mb-6">
                    <h3 className="text-xs font-medium mb-3">End of month day(s):</h3>
                    <div className="flex flex-wrap gap-2">
                      {continuousEndOfMonthOptions.firstDay.enabled && (
                        <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          First day(s) of the month: {continuousEndOfMonthOptions.firstDay.value.toString().padStart(2, '0')}
                        </span>
                      )}
                      {continuousEndOfMonthOptions.firstWeekday.enabled && (
                        <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          First weekday(s) of the month: {continuousEndOfMonthOptions.firstWeekday.value}
                        </span>
                      )}
                      {continuousEndOfMonthOptions.lastDay.enabled && (
                        <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          Last day(s) of the month: {continuousEndOfMonthOptions.lastDay.value}
                        </span>
                      )}
                      {continuousEndOfMonthOptions.lastWeekday.enabled && (
                        <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          Last weekday(s) of the month: {continuousEndOfMonthOptions.lastWeekday.value}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {timeRangeType === 'discrete' && (discreteEndOfMonthOptions.firstDay.enabled || discreteEndOfMonthOptions.firstWeekday.enabled || discreteEndOfMonthOptions.lastDay.enabled || discreteEndOfMonthOptions.lastWeekday.enabled) && (
                  <div className="mb-6">
                    <h3 className="text-xs font-medium mb-3">End of month day(s):</h3>
                    <div className="flex flex-wrap gap-2">
                      {discreteEndOfMonthOptions.firstDay.enabled && (
                        <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          First day(s) of the month: {discreteEndOfMonthOptions.firstDay.value.toString().padStart(2, '0')}
                        </span>
                      )}
                      {discreteEndOfMonthOptions.firstWeekday.enabled && (
                        <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          First weekday(s) of the month: {discreteEndOfMonthOptions.firstWeekday.value}
                        </span>
                      )}
                      {discreteEndOfMonthOptions.lastDay.enabled && (
                        <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          Last day(s) of the month: {discreteEndOfMonthOptions.lastDay.value}
                        </span>
                      )}
                      {discreteEndOfMonthOptions.lastWeekday.enabled && (
                        <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          Last weekday(s) of the month: {discreteEndOfMonthOptions.lastWeekday.value}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Select time ranges(s) - for presets and discrete */}
                {timeRangeType === 'presets' && (
                  <div className="mb-0">
                    <h3 className="text-xs font-medium mb-3">Select time ranges(s):</h3>
                    <div className="flex flex-wrap gap-2">
                      {timeRanges.map((range, index) => (
                        <span key={index} className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {range.from} - {range.to}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {timeRangeType === 'discrete' && discreteTimeRanges.length > 0 && (
                  <div className="mb-0">
                    <h3 className="text-xs font-medium mb-3">Select time range(s):</h3>
                    <div className="flex flex-wrap gap-2">
                      {discreteTimeRanges.map((range, index) => (
                        <span key={index} className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {range.fromTime} - {range.toTime}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Divider between accordions */}
          <div className="border-t border-gray-300 my-6"></div>

          {/* Additional filters section */}
          <div>
              <button 
                className="w-full text-left mb-4"
                onClick={() => setIsAdditionalFiltersExpanded(!isAdditionalFiltersExpanded)}
              >
                <div className="flex items-start gap-2 mb-2">
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-600 transition-transform mt-0.5 ${isAdditionalFiltersExpanded ? '' : '-rotate-90'}`} 
                  />
                  <span className="text-sm">Additional filter</span>
                </div>
                <p className="text-xs text-gray-500 ml-6">Total additions: {additionalFiltersCount.toString().padStart(2, '0')}</p>
              </button>

              {/* Divider */}
              {isAdditionalFiltersExpanded && (
                <div className="border-t border-gray-300 mb-4"></div>
              )}

              {/* Expanded content with white background */}
              {isAdditionalFiltersExpanded && (
                <div className="bg-white p-3 rounded">
                  {/* Sysplex */}
                  {selectedSysplex.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xs font-medium mb-3">Sysplex:</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedSysplex.map((item, index) => (
                          <span key={index} className="inline-block px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Shifts */}
                  {selectedShifts.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xs font-medium mb-3">Shifts:</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedShifts.map((item, index) => (
                          <span key={index} className="inline-block px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interest group */}
                  {selectedInterestGroup && (
                    <div className="mb-6">
                      <h3 className="text-xs font-medium mb-3">Interest group:</h3>
                      <span className="inline-block px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs">
                        {selectedInterestGroup}
                      </span>
                    </div>
                  )}

                  {/* Reporting interval */}
                  <div className="mb-0">
                    <h3 className="text-xs font-medium mb-3">Reporting interval:</h3>
                    <span className="inline-block px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs">
                      {selectedReportingInterval}
                    </span>
                  </div>
                </div>
              )}
          </div>

          {/* Comparison section - only shown if there's a selection */}
          {comparisonCount > 0 && (
            <>
              {/* Divider between accordions */}
              <div className="border-t border-gray-300 my-6"></div>

              <div>
                <button 
                  className="w-full text-left mb-4"
                  onClick={() => setIsComparisonExpanded(!isComparisonExpanded)}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <ChevronDown 
                      size={16} 
                      className={`text-gray-600 transition-transform mt-0.5 ${isComparisonExpanded ? '' : '-rotate-90'}`} 
                    />
                    <span className="text-sm">Comparison</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-6">Total additions: {comparisonCount.toString().padStart(2, '0')}</p>
                </button>

                {/* Divider */}
                {isComparisonExpanded && (
                  <div className="border-t border-gray-300 mb-4"></div>
                )}

                {/* Expanded content with white background */}
                {isComparisonExpanded && (
                  <div className="bg-white p-3 rounded">
                    {/* Compare to */}
                    <div className="mb-0">
                      <h3 className="text-xs font-medium mb-3">Compare to:</h3>
                      {comparisonMode === 'relative' && comparisonRelativeNumber && (
                        <span className="inline-block px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                          Relative: {comparisonRelativeNumber} {comparisonRelativeUnit}
                        </span>
                      )}
                      {comparisonMode === 'absolute' && (absoluteFromDate || absoluteToDate) && (
                        <span className="inline-block px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                          Absolute: {absoluteFromDate ? format(absoluteFromDate, 'MM/dd/yyyy') : '...'} - {absoluteToDate ? format(absoluteToDate, 'MM/dd/yyyy') : '...'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#f4f4f4] border-t border-[#c6c6c6] h-[80px] flex items-center">
        <div className="flex items-center justify-between w-full px-4 h-full">
          {activeTab === 'saved-combinations' ? (
            <>
              <div className="flex-1 h-full flex items-center">
                <button onClick={onClose} className="px-4 text-[#0f62fe] hover:text-[#0353e9] text-sm font-['IBM_Plex_Sans',sans-serif] tracking-[0.16px]">
                  Cancel
                </button>
              </div>
              <div className="flex gap-px h-full">
                <button className="px-4 text-[#da1e28] hover:text-[#ba1b23] text-sm font-['IBM_Plex_Sans',sans-serif] tracking-[0.16px] w-[232px]">
                  Delete
                </button>
                <button className="bg-[#393939] text-white text-sm font-['IBM_Plex_Sans',sans-serif] tracking-[0.16px] hover:bg-[#4c4c4c] w-[232px]">
                  Edit
                </button>
                <button onClick={handleApply} className="bg-[#0f62fe] text-white text-sm font-['IBM_Plex_Sans',sans-serif] tracking-[0.16px] hover:bg-[#0353e9] w-[232px]">
                  Apply
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 h-full flex items-center">
                <button onClick={onClose} className="px-4 text-[#0f62fe] hover:text-[#0353e9] text-sm font-['IBM_Plex_Sans',sans-serif] tracking-[0.16px]">
                  Cancel
                </button>
              </div>
              <div className="flex gap-px h-full">
                <button 
                  onClick={() => setShowSaveModal(true)}
                  className="bg-[#393939] text-white text-sm font-['IBM_Plex_Sans',sans-serif] tracking-[0.16px] hover:bg-[#4c4c4c] w-[232px]"
                >
                  Save and apply
                </button>
                <button onClick={handleApply} className="bg-[#0f62fe] text-white text-sm font-['IBM_Plex_Sans',sans-serif] tracking-[0.16px] hover:bg-[#0353e9] w-[232px]">
                  Apply
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Overlay that appears when child modal is open */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40" />
      )}

      {/* Save Combination Modal */}
      <SaveCombinationModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveCombination}
        previewContent={
          <div className="p-3">
            {/* Time range accordion */}
            <div className="mb-6">
              <button 
                className="w-full text-left mb-4"
                onClick={() => setIsTimeRangeExpanded(!isTimeRangeExpanded)}
              >
                <div className="flex items-start gap-2 mb-2">
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-600 transition-transform mt-0.5 ${isTimeRangeExpanded ? '' : '-rotate-90'}`} 
                  />
                  <span className="text-sm">Time range</span>
                </div>
                <p className="text-xs text-gray-500 ml-6">Total additions: {timeRangeAccordionCount.toString().padStart(2, '0')}</p>
              </button>

              {isTimeRangeExpanded && (
                <>
                  <div className="border-t border-gray-300 mb-4"></div>
                  <div className="bg-white p-3 rounded">
                    {/* Time range type */}
                    <div className="mb-6">
                      <h3 className="text-xs font-medium mb-3">Time range type:</h3>
                      <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs capitalize">
                        {timeRangeType === 'discrete' ? 'discrete ranges' : timeRangeType}
                      </span>
                    </div>

                    {/* Display relevant preview based on type */}
                    {timeRangeType === 'discrete' && discreteDateRanges.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xs font-medium mb-3">Select date range(s)</h3>
                        <div className="flex flex-wrap gap-2">
                          {discreteDateRanges.map((range, index) => (
                            <span key={index} className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {range.fromDate} to {range.toDate}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {discreteSelectedDays.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xs font-medium mb-3">Day(s) of the week:</h3>
                        <div className="flex flex-wrap gap-2">
                          {discreteSelectedDays.map((day, index) => (
                            <span key={index} className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {discreteTimeRanges.length > 0 && (
                      <div className="mb-0">
                        <h3 className="text-xs font-medium mb-3">Select time range(s)</h3>
                        <div className="flex flex-wrap gap-2">
                          {discreteTimeRanges.map((range, index) => (
                            <span key={index} className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {range.fromTime} to {range.toTime}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Additional filters accordion */}
            {additionalFiltersCount > 0 && (
              <>
                <div className="border-t border-gray-300 mb-6"></div>
                <div className="mb-6">
                  <button 
                    className="w-full text-left mb-4"
                    onClick={() => setIsAdditionalFiltersExpanded(!isAdditionalFiltersExpanded)}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <ChevronDown 
                        size={16} 
                        className={`text-gray-600 transition-transform mt-0.5 ${isAdditionalFiltersExpanded ? '' : '-rotate-90'}`} 
                      />
                      <span className="text-sm">Additional Filters</span>
                    </div>
                    <p className="text-xs text-gray-500 ml-6">Total additions: {additionalFiltersCount.toString().padStart(2, '0')}</p>
                  </button>

                  {isAdditionalFiltersExpanded && (
                    <>
                      <div className="border-t border-gray-300 mb-4"></div>
                      <div className="bg-white p-3 rounded">
                        {selectedSysplex.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-xs font-medium mb-3">Sysplex:</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedSysplex.map((item, index) => (
                                <span key={index} className="inline-block px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedShifts.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-xs font-medium mb-3">Shifts:</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedShifts.map((item, index) => (
                                <span key={index} className="inline-block px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedInterestGroup && (
                          <div className="mb-6">
                            <h3 className="text-xs font-medium mb-3">Interest group:</h3>
                            <span className="inline-block px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs">
                              {selectedInterestGroup}
                            </span>
                          </div>
                        )}

                        <div className="mb-0">
                          <h3 className="text-xs font-medium mb-3">Reporting interval:</h3>
                          <span className="inline-block px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs">
                            {selectedReportingInterval}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Comparisons accordion */}
            {comparisonCount > 0 && (
              <>
                <div className="border-t border-gray-300 mb-6"></div>
                <div>
                  <button 
                    className="w-full text-left mb-4"
                    onClick={() => setIsComparisonExpanded(!isComparisonExpanded)}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <ChevronDown 
                        size={16} 
                        className={`text-gray-600 transition-transform mt-0.5 ${isComparisonExpanded ? '' : '-rotate-90'}`} 
                      />
                      <span className="text-sm">Comparisons</span>
                    </div>
                    <p className="text-xs text-gray-500 ml-6">Total additions: {comparisonCount.toString().padStart(2, '0')}</p>
                  </button>

                  {isComparisonExpanded && (
                    <>
                      <div className="border-t border-gray-300 mb-4"></div>
                      <div className="bg-white p-3 rounded">
                        <div className="mb-0">
                          <h3 className="text-xs font-medium mb-3">Compare to:</h3>
                          {comparisonMode === 'relative' && comparisonRelativeNumber && (
                            <span className="inline-block px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                              Relative: {comparisonRelativeNumber} {comparisonRelativeUnit}
                            </span>
                          )}
                          {comparisonMode === 'absolute' && (absoluteFromDate || absoluteToDate) && (
                            <span className="inline-block px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                              Absolute: {absoluteFromDate ? format(absoluteFromDate, 'MM/dd/yyyy') : '...'} - {absoluteToDate ? format(absoluteToDate, 'MM/dd/yyyy') : '...'}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        }
      />
    </div>
  );
}