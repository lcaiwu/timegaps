# IBM Z IntelliMagic Vision - Interval Selection Interface
## Comprehensive UX Design Handoff Documentation

**Designer**: [Your Name]  
**Date**: February 11, 2026  
**Project**: IBM Z IntelliMagic Vision - Time Range Selection Interface  
**Design System**: IBM Carbon Design System  
**Font**: IBM Plex Sans (entire application)  
**Version**: Stage 01 - Pixel-Perfect Recreation

---

## 1. SCREENS/PAGES & USER FLOW

### 1.1 Application Structure

The application consists of **2 main screens**:

#### **Screen 1: Dashboard (Home Page)**
- **Route**: `/` (root)
- **Component**: `Dashboard.tsx`
- **Purpose**: Main landing page showing IBM Z IntelliMagic Vision dashboard with three-column layout
- **State**: Always visible as the base application layer

#### **Screen 2: Interval Selection Modal (Overlay)**
- **Route**: N/A (Modal overlay)
- **Component**: `SelectionPanel.tsx`
- **Purpose**: Complex time range and filter selection interface
- **State**: Opens on top of dashboard, dismissible

#### **Screen 3: Save Combination Modal (Nested Modal)**
- **Route**: N/A (Nested modal overlay)
- **Component**: `SaveCombinationModal.tsx`
- **Purpose**: Save current filter configuration with name and description
- **State**: Opens on top of Interval Selection Modal with 30% black overlay on parent modal

---

### 1.2 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│ USER JOURNEY MAP                                                 │
└─────────────────────────────────────────────────────────────────┘

1. APPLICATION LAUNCH
   └─> User lands on Dashboard screen
       └─> Sees three-column layout:
           • Left: Navigation sidebar with collapsible sections
           • Center: Main content area with charts
           • Right: Details panel

2. OPEN INTERVAL SELECTION
   └─> User clicks "Selection" button in top navigation
       └─> Interval Selection Modal opens (overlay)
           └─> Dashboard remains visible but inactive behind modal
           └─> Modal shows "Time range" tab by default
               └─> Presets subtab is selected
               └─> "All data" is selected in quick select
               └─> "8 hours" is also selected in quick select
               └─> All other sections are empty

3. CONFIGURE TIME RANGE (PRESETS TAB)
   └─> User interacts with Presets tab:
       A. SELECT PRESET OPTION
          └─> Click radio button (All data, Previous month, etc.)
              └─> Selection updates immediately
              └─> Preview panel on right updates in real-time
       
       B. SELECT QUICK OPTIONS
          └─> Click quick select buttons (8 hours, 1 day, etc.)
              └─> Multiple selections allowed
              └─> Visual toggle state (blue background when selected)
              └─> Preview panel updates
       
       C. SELECT DATE (SINGLE DATE)
          └─> Click "Single date" radio button
              └─> Click input field showing "mm/dd/yyyy"
              └─> Calendar picker opens below input
              └─> User selects date
              └─> Calendar closes
              └─> Selected date appears in input field
              └─> Preview panel updates
       
       D. CONFIGURE DAYS OF WEEK
          └─> Scroll to "Days of the week" section
              └─> Click individual day checkboxes OR
              └─> Click "Weekdays" or "All days" quick select buttons
              └─> Selected days highlighted
              └─> Preview panel updates
       
       E. CONFIGURE END OF MONTH OPTIONS
          └─> Scroll to "End of month" section
              └─> Check "First day of the month" checkbox
                  └─> Number input field activates
                  └─> User enters offset days (0-31)
              └─> Repeat for other end of month options
              └─> Preview panel updates
       
       F. CONFIGURE TIME RANGES
          └─> Scroll to "Time range" section
              └─> Click expand/collapse chevron (if collapsed)
              └─> Click "+" button to add time range
              └─> Two time inputs appear (From, To)
              └─> Click time input field
                  └─> Dropdown with hour options (00-23) opens
                  └─> User selects hour
                  └─> Minute field becomes active
                  └─> User enters minutes (00-59)
              └─> Repeat for "To" time
              └─> Click "+" to add more time ranges
              └─> Click "-" to remove time ranges
              └─> Preview panel updates

4. CONFIGURE TIME RANGE (CONTINUOUS TAB)
   └─> User clicks "Continuous" subtab
       └─> Screen shows empty continuous range configuration
       └─> User clicks "+" button in "Date and time range" section
           └─> Row appears with 4 fields: From Date, From Time, To Date, To Time
           └─> User fills in date/time values
           └─> Repeats to add multiple continuous ranges
       └─> User configures Days of the week (same as Presets)
       └─> User configures End of month options (same as Presets)
       └─> Preview panel updates with continuous range data

5. CONFIGURE TIME RANGE (DISCRETE TAB)
   └─> User clicks "Discrete" subtab
       └─> Screen shows empty discrete range configuration
       └─> User adds date ranges (From Date, To Date)
       └─> User adds time ranges (From Time, To Time)
       └─> User configures Days of the week
       └─> User configures End of month options
       └─> Preview panel updates with discrete range data

6. CONFIGURE ADDITIONAL FILTERS
   └─> User clicks "Additional filters" tab
       └─> Screen shows filter options:
           A. SYSPLEX SELECTION
              └─> User checks "All Sysplexes" OR
              └─> User checks individual sysplex checkboxes (SYSA, SYSB, SYSC, SYSD)
              └─> Preview panel updates showing selected sysplexes
           
           B. SHIFTS SELECTION
              └─> User checks "All Shifts" OR
              └─> User checks individual shift checkboxes (Morning, Day, Evening, Night)
              └─> Preview panel updates showing selected shifts
           
           C. INTEREST GROUP SELECTION
              └─> User clicks "Select interest group" dropdown
                  └─> Dropdown opens with options: IGT (default), IGT-A, IGT-B, IGT-C
                  └─> User selects option
                  └─> Dropdown closes
                  └─> Selected value appears in dropdown
              └─> If user selects an interest group:
                  └─> Preview panel shows "Interest group" section
              └─> If user clears selection:
                  └─> Preview panel hides "Interest group" section entirely
           
           D. REPORTING INTERVAL SELECTION
              └─> User clicks "Hourly" dropdown (default)
                  └─> Dropdown opens with options: Hourly, Daily, Weekly, Monthly
                  └─> User selects option
                  └─> Dropdown closes
                  └─> Preview panel updates showing selected interval

7. CONFIGURE COMPARISONS
   └─> User clicks "Comparison" tab
       └─> Screen shows EMPTY comparison fields (no default values)
       
       A. RELATIVE COMPARISON
          └─> "Relative" radio button is pre-selected (default)
          └─> User enters number in first input field
              └─> Field accepts 2-digit numeric values
          └─> User clicks "Select" dropdown (empty by default)
              └─> Dropdown opens with options:
                  • Hours earlier
                  • Days earlier
                  • Weeks earlier
                  • Months earlier
                  • Years earlier
              └─> User selects option
              └─> Dropdown closes
          └─> Preview panel updates showing comparison configuration
       
       B. ABSOLUTE COMPARISON
          └─> User clicks "Absolute" radio button
              └─> Two date input fields appear (From, To)
              └─> Both fields show "mm/dd/yyyy" placeholder
          └─> User clicks "From" date field
              └─> Calendar picker opens
              └─> User selects start date
              └─> Calendar closes
          └─> User clicks "To" date field
              └─> Calendar picker opens
              └─> User selects end date
              └─> Calendar closes
          └─> Preview panel updates showing absolute date range

8. VIEW SAVED COMBINATIONS
   └─> User clicks "Saved combinations" tab
       └─> Screen shows list of saved filter combinations (if any exist)
       └─> Each combination displays:
           • Combination name (bold)
           • Description text (smaller, gray)
           • "Saved on: [date]" metadata
       └─> User clicks on a saved combination
           └─> Selection highlights (blue background)
           └─> Preview panel shows "Saved combination" section
               └─> Displays selected combination name
       └─> User can click different combinations to preview them

9. SAVE CURRENT COMBINATION
   └─> User has configured filters in any tab
   └─> User clicks "Save as combination" button in modal footer
       └─> Save Combination Modal opens (nested modal)
       └─> Parent Interval Selection Modal darkens (30% black overlay)
       └─> Parent modal remains visible for context
       
       A. FILL IN SAVE FORM
          └─> User clicks "Combination name" input field
              └─> User types name (required field)
          └─> User clicks "Description" textarea (optional)
              └─> User types multi-line description
          └─> User sees character counter: "0 / 256"
              └─> Counter updates as user types
              └─> Limit enforced at 256 characters
       
       B. CONFIRM OR CANCEL
          └─> User clicks "Save" button
              └─> Validation occurs:
                  • If name is empty → Show error state
                  • If name is filled → Save combination
              └─> Nested modal closes
              └─> Parent modal overlay removes
              └─> User returns to Interval Selection Modal
              └─> Success state (new combination appears in Saved Combinations tab)
          
          OR
          
          └─> User clicks "Cancel" button OR clicks X button
              └─> Nested modal closes without saving
              └─> Parent modal overlay removes
              └─> User returns to previous state

10. APPLY SELECTIONS
    └─> User clicks "Apply" button in modal footer
        └─> All selected filters/configurations are applied
        └─> Interval Selection Modal closes
        └─> User returns to Dashboard
        └─> Dashboard data updates based on applied filters

11. CANCEL/CLOSE MODAL
    └─> User clicks "Cancel" button in footer OR
    └─> User clicks X button in top-right corner of modal
        └─> Interval Selection Modal closes without applying changes
        └─> User returns to Dashboard
        └─> No changes applied to filters
```

---

### 1.3 Key Interactions Summary

| Action | Trigger | Result | Preview Panel Update |
|--------|---------|--------|---------------------|
| Open Selection Modal | Click "Selection" in nav | Modal opens over dashboard | Shows current/default selections |
| Select Preset Option | Click radio button | Option selected, others deselected | Updates "Quick select" section |
| Toggle Quick Select | Click button | Button toggles on/off (blue/white) | Updates "Quick select" list |
| Select Single Date | Click date input → pick date | Date appears in input field | Shows selected date |
| Add Time Range | Click + button | New time range row appears | Adds time range to list |
| Remove Time Range | Click - button | Time range row removed | Removes time range from list |
| Select Days | Check day checkbox | Day selected/deselected | Updates "Days" list |
| Quick Select Days | Click "Weekdays" button | Mon-Fri auto-selected | Updates "Days" list |
| Toggle End of Month | Check checkbox | Number input activates | Shows offset configuration |
| Switch to Continuous | Click "Continuous" tab | Shows continuous range UI | Updates with continuous data |
| Switch to Discrete | Click "Discrete" tab | Shows discrete range UI | Updates with discrete data |
| Select Sysplex | Check sysplex checkbox | Sysplex selected | Updates "Sysplex" list |
| Select Interest Group | Select from dropdown | Value selected | Shows/hides section based on selection |
| Configure Comparison | Enter values in Comparison tab | Comparison configured | Shows comparison details |
| Load Saved Combination | Click saved combination item | All filters load from saved state | Updates all preview sections |
| Save Combination | Fill form + click Save | New combination saved | N/A (nested modal) |
| Apply Filters | Click "Apply" button | Modal closes, filters applied to dashboard | N/A (modal closed) |
| Cancel Changes | Click "Cancel" or X | Modal closes, no changes saved | N/A (modal closed) |

---

## 2. CONTENT & DATA REQUIREMENTS

### 2.1 Dashboard Screen Content

#### Top Navigation Bar Content
```
Left Section:
  - App Title: "IBM Z IntelliMagic Vision for z/OS"
  - Navigation Items:
    • Dashboard (with FileText icon)
    • Edit Dashboard (with Edit icon)
    • Create Report (with FileBarChart icon)
    • Selection (with List icon) ← TRIGGERS MODAL
    • Export (with Download icon)

Right Section:
  - Search Input: Placeholder "Search chart"
  - Options Button (with Settings icon)
  - Help Button (with HelpCircle icon)
```

#### Left Sidebar Navigation Content
```
Navigation Header: "Navigation" (blue background)

Expandable Sections:
1. My Dashboards (expanded by default)
   - Icons: FileText, Plus (add), Minus (collapse), ChevronDown/Right (expand)
   - Subsections:
     • Overview (with Star icon - favorited)
     • Performance Analysis
     • System Metrics
     • Workload (with Star icon - favorited)
     • Custom View 1

2. Shared Dashboards (collapsed by default)
   - Icons: FileText, Plus, Minus, ChevronRight
   - Subsections: (not shown when collapsed)
     • Team Reports
     • Executive Summary
     • Monthly Review

3. Reports (expanded by default)
   - Icons: FileBarChart, Plus, Minus, ChevronDown
   - Subsections:
     • Weekly Performance
     • Monthly Summary
     • Quarterly Analysis
```

#### Center Content Area
```
Section 1: "Charts and Graphs"
  - Sparkles icon (AI features)
  - 4 placeholder chart cards in 2x2 grid
  - Each card shows: Chart placeholder, MoreVertical menu icon

Section 2: "Data Tables"
  - 2 placeholder table cards side by side
  - Each card shows: Table placeholder, MoreVertical menu icon
```

#### Right Details Panel
```
Header: "Details Panel"
  - Info icon
  - ExternalLink icon

Content:
  - Placeholder text: "Select a chart or item to view details"
  - Additional descriptive text
```

---

### 2.2 Interval Selection Modal Content

#### Modal Header
```
Title: "Interval selection"
Close Button: X icon (top-right corner)
```

#### Tab Navigation
```
Tabs (Horizontal):
1. Time range (default active)
2. Additional filters
3. Comparison
4. Saved combinations

Each tab shows:
  - Icon (Clock, Filter, GitCompare, Bookmark respectively)
  - Text label
  - Blue bottom border when active
```

#### Time Range Tab - Presets Subtab Content

**Subtabs (Horizontal, below main tabs):**
```
- Presets (default active)
- Continuous
- Discrete
```

**Quick Select Section:**
```
Radio Button Options:
  ○ All data (default selected)
  ○ Previous month
  ○ Single date
    └─> Input field: "mm/dd/yyyy" placeholder
        └─> Calendar icon on right
  ○ Relative
    └─> Number input: "8" (default)
    └─> Dropdown: "hours" (default)
        Options: hours, days, weeks, months, years
```

**Quick Select Buttons:**
```
Preset Time Buttons (toggle on/off):
  [8 hours] ← selected by default (blue background)
  [1 day] [1 week] [1 month] [3 months] [6 months] [1 year]
  
State: Blue background (#0f62fe) = selected
       White background = unselected
```

**Days of the Week Section:**
```
Checkboxes (7 days):
  □ Monday  □ Tuesday  □ Wednesday  □ Thursday
  □ Friday  □ Saturday  □ Sunday

Quick Select Buttons:
  [Weekdays] [All days]
  
States:
  - Unchecked = not selected
  - Checked = blue checkmark
  - Quick select buttons auto-check corresponding days
```

**End of Month Options:**
```
4 Checkbox Groups (each with number input):

□ First day of the month
  └─> Number input (0-31) - disabled until checked
  
□ First weekday of the month
  └─> Number input (0-31) - disabled until checked
  
□ Last day of the month
  └─> Number input (0-31) - disabled until checked
  
□ Last weekday of the month
  └─> Number input (0-31) - disabled until checked

Info icon with tooltip explaining offsets
```

**Time Range Section (Collapsible):**
```
Header: "Time range" with ChevronDown/ChevronRight icon
  [+] button to add new time range

Expanded State:
  Default: Empty (no time ranges)
  
  When user clicks [+]:
    From: [00]:[00] dropdown selectors
    To:   [00]:[00] dropdown selectors
    [-] button to remove
  
  Multiple time ranges can be added

Hour Dropdown Options: 00, 01, 02, ... 23
Minute Input: 00-59

Error Validation:
  - "From" time must be before "To" time
  - Error message appears below invalid range in red text
```

---

#### Time Range Tab - Continuous Subtab Content

```
Date and Time Range Section:
  [+] button to add new continuous range
  
  Default: Empty (no ranges)
  
  When user clicks [+]:
    From: [mm/dd/yyyy] [00:00] (date input + time input)
    To:   [mm/dd/yyyy] [23:59] (date input + time input)
    [-] button to remove
  
  Multiple continuous ranges can be added

Days of the Week: (same as Presets subtab)
End of Month Options: (same as Presets subtab)
```

---

#### Time Range Tab - Discrete Subtab Content

```
Date Range Section:
  [+] button to add new date range
  
  Default: Empty (no date ranges)
  
  When user clicks [+]:
    From: [mm/dd/yyyy]
    To:   [mm/dd/yyyy]
    [-] button to remove

Time Range Section:
  [+] button to add new time range
  
  Default: Empty (no time ranges)
  
  When user clicks [+]:
    From: [00:00]
    To:   [23:59]
    [-] button to remove

Days of the Week: (same as Presets subtab)
End of Month Options: (same as Presets subtab)
```

---

#### Additional Filters Tab Content

```
Sysplex Selection:
  □ All Sysplexes
  □ SYSA
  □ SYSB
  □ SYSC
  □ SYSD
  
  Info icon with tooltip

Shifts:
  □ All Shifts
  □ Morning (6am - 2pm)
  □ Day (8am - 4pm)
  □ Evening (4pm - 12am)
  □ Night (12am - 8am)
  
  Info icon with tooltip

Interest group:
  Dropdown: "Select interest group" (placeholder, no default selection)
  Options:
    - IGT (default)
    - IGT-A
    - IGT-B
    - IGT-C
  
  Info icon with tooltip

Reporting interval:
  Dropdown: "Hourly" (default selected)
  Options:
    - Hourly
    - Daily
    - Weekly
    - Monthly
  
  Info icon with tooltip
```

---

#### Comparison Tab Content

```
**DEFAULT STATE: COMPLETELY EMPTY FIELDS**

Radio Button Options:
  ● Relative (default selected)
  ○ Absolute

Relative Mode (when selected):
  Number Input: [__] (2-digit, empty by default)
  Dropdown: "Select" (empty placeholder by default)
  
  Dropdown Options:
    - Hours earlier
    - Days earlier
    - Weeks earlier
    - Months earlier
    - Years earlier

Absolute Mode (when selected):
  From: [mm/dd/yyyy] (empty)
  To:   [mm/dd/yyyy] (empty)
  
  Both fields open calendar pickers on click

Info icon with tooltip explaining comparison
```

---

#### Saved Combinations Tab Content

```
**Sample Data Structure:**

Combination 1:
  Name: "Morning Shift Analytics"
  Description: "Filter configuration for analyzing morning shift performance data across all production systems. Includes weekday patterns and hourly breakdowns for operational insights."
  Metadata: "Saved on: 01/15/2026"
  
Combination 2:
  Name: "Weekend Report Filter"
  Description: "Comprehensive weekend data analysis setup focusing on reduced staff periods. Captures Saturday and Sunday metrics with emphasis on automated processes."
  Metadata: "Saved on: 01/20/2026"

Combination 3:
  Name: "Production Hours Only"
  Description: "Business hours filter excluding nights and weekends. Optimized for standard operational reporting during peak activity periods."
  Metadata: "Saved on: 01/22/2026"

Combination 4:
  Name: "Monthly Comparison Set"
  Description: "Month-over-month comparison configuration with automatic date adjustments. Useful for tracking performance trends and identifying seasonal patterns."
  Metadata: "Saved on: 02/01/2026"

Visual States:
  - Unselected: White background
  - Selected: Blue background (#e0e8f5)
  - Hover: Light gray background (#f4f4f4)
```

---

#### Preview Panel (Right Side) Content

**Default State (Time Range - Presets - "All data"):**
```
Quick select:
  • All data
  • 8 hours

(All other sections hidden)
```

**Example: User has configured filters**
```
Quick select:
  • Previous month
  • 1 week

Days:
  • Monday
  • Tuesday
  • Wednesday
  • Thursday
  • Friday

End of month:
  • First day of the month, 0 days offset

Time range:
  • 06:00 - 09:00
  • 09:00 - 12:00

Sysplex:
  • SYSA
  • SYSB

Shifts:
  • Morning (6am - 2pm)

Interest group:
  • IGT (default)
  
Reporting interval:
  • Hourly

Comparison:
  • 04 Weeks earlier

(Interest group section only appears if user has selected a group)
(If no interest group selected, this entire section is hidden)
```

---

#### Modal Footer Content

```
Left Side:
  [Save as combination] button
    - Secondary button style
    - Bookmark icon
    - Opens nested Save Combination Modal

Right Side:
  [Cancel] button
    - Secondary/ghost button style
    - X icon
    - Closes modal without saving
  
  [Apply] button
    - Primary button style
    - Blue background (#0f62fe)
    - Checkmark icon
    - Applies filters and closes modal
```

---

### 2.3 Save Combination Modal Content

```
Modal Header:
  Title: "Save selection combination"
  Close Button: X icon (top-right)

Form Fields:
  1. Combination name *
     - Text input (required)
     - Placeholder: "Enter combination name"
     - Error state if empty on save attempt
  
  2. Description
     - Textarea (optional)
     - Placeholder: "Add a description (optional)"
     - Character counter: "0 / 256"
     - Max length: 256 characters

Modal Footer:
  [Cancel] button (left side)
    - Secondary button
    - X icon
  
  [Save] button (right side)
    - Primary button
    - Blue background
    - Checkmark icon
    - Validates required fields
```

---

## 3. COMPONENT NEEDS (IBM CARBON DESIGN SYSTEM)

### 3.1 Carbon Components Used

| Component | Purpose | Location | Props/Variations |
|-----------|---------|----------|------------------|
| **Button** | Primary actions | Throughout modal footers | Primary, Secondary, Ghost variants |
| **Button** | Icon buttons | Navigation, modal headers | Icon-only with hover states |
| **TextInput** | Text entry | Save modal, time inputs | Standard, with placeholder |
| **TextArea** | Multi-line text | Save modal description | With character counter |
| **Checkbox** | Multi-select options | Days, sysplexes, shifts, end of month | Standard checkboxes |
| **RadioButton** | Single select | Quick select options, comparison mode | Standard radio groups |
| **Dropdown** | Single select from list | Interest group, reporting interval, time units | Standard dropdown |
| **DatePicker** | Calendar selection | Single date, absolute comparison | react-day-picker integration |
| **Tabs** | Content organization | Main tabs, time range subtabs | Horizontal tabs |
| **Modal** | Overlay dialogs | Interval selection, save combination | Large modal, nested modal |
| **NumberInput** | Numeric values | End of month offsets, relative comparison | 0-31 range, 2-digit |
| **Tooltip** | Help text | Info icons throughout | Icon trigger, hover to show |
| **Accordion/Collapsible** | Expandable sections | Time range section, dashboard sidebar | ChevronDown/Right icons |
| **Tag/Chip** | Selected items display | Preview panel lists | Read-only, blue styling |
| **Toggle Button** | Multi-select buttons | Quick select time buttons | Blue when selected |
| **Search Input** | Text search | Dashboard header | With search icon |
| **Sidebar** | Navigation panel | Dashboard left side | Collapsible sections |
| **Header** | Top navigation | Dashboard top | Fixed position |

---

### 3.2 Specific Component Interactions

#### 3.2.1 Button Interactions

**Primary Button ("Apply" button):**
```css
Background: #0f62fe (IBM Blue 60)
Text Color: #ffffff (White)
Font: IBM Plex Sans, 14px, 400 weight
Padding: 11px 16px
Height: 40px (Carbon Medium size)
Border Radius: 0 (Carbon default)
Icon: Checkmark icon on left side
Hover: Background darkens to #0353e9
Active: Background darkens further
Focus: Blue outline ring
```

**Secondary Button ("Save as combination", "Cancel"):**
```css
Background: Transparent
Border: 1px solid #8d8d8d
Text Color: #161616
Font: IBM Plex Sans, 14px, 400 weight
Padding: 11px 16px
Height: 40px
Icon: Yes (Bookmark for Save, X for Cancel)
Hover: Background #e8e8e8
```

**Icon Button (X close, +/- buttons):**
```css
Background: Transparent
Size: 32px × 32px
Icon Size: 16px
Hover: Background #e8e8e8, circular
Focus: Blue outline ring
```

---

#### 3.2.2 Input Field Interactions

**Text Input:**
```
Default State:
  - Border: 1px solid #8d8d8d
  - Background: #ffffff
  - Placeholder: Gray (#6f6f6f)
  - Height: 40px
  - Font: IBM Plex Sans, 14px

Focus State:
  - Border: 2px solid #0f62fe
  - Outline: None

Error State:
  - Border: 2px solid #da1e28 (IBM Red)
  - Error message below in red
  - Icon: Error icon on right

Disabled State:
  - Background: #f4f4f4
  - Border: 1px solid #c6c6c6
  - Cursor: not-allowed
```

**Time Input (Hours/Minutes):**
```
Type: Dropdown select for hours
      Number input for minutes

Hours: 00-23 in dropdown
Minutes: 00-59 text input

Format: HH:MM (24-hour)
Separator: Colon (:)

Validation:
  - Minutes must be 00-59
  - "From" time must be before "To" time
  - Error message appears below range if invalid
```

**Date Input:**
```
Format: mm/dd/yyyy
Placeholder: "mm/dd/yyyy"
Icon: Calendar icon on right side

Click Behavior:
  - Opens react-day-picker calendar below input
  - Calendar shows current month
  - User selects date
  - Calendar closes automatically
  - Selected date fills input

Calendar Styling:
  - Selected date: Blue background
  - Today: Blue outline
  - Hover: Light gray background
```

---

#### 3.2.3 Checkbox Interactions

```
Unchecked State:
  - Empty square box
  - Border: 1px solid #8d8d8d
  - Size: 16px × 16px

Checked State:
  - Blue background (#0f62fe)
  - White checkmark icon
  - Border: None

Indeterminate State:
  - Blue background
  - White minus icon (for "All" checkboxes when some children selected)

Hover:
  - Unchecked: Border color darkens
  - Checked: Background darkens

Disabled:
  - Gray background
  - Gray checkmark
  - Cursor: not-allowed

Label:
  - Font: IBM Plex Sans, 14px
  - Color: #161616
  - Clickable (toggles checkbox)
  - Padding left: 8px from checkbox
```

---

#### 3.2.4 Radio Button Interactions

```
Unselected State:
  - Empty circle
  - Border: 1px solid #8d8d8d
  - Size: 16px diameter

Selected State:
  - Blue outer circle (#0f62fe)
  - White inner dot (6px diameter)

Hover:
  - Border color darkens (unselected)
  - Outer circle darkens (selected)

Label:
  - Font: IBM Plex Sans, 14px
  - Color: #161616
  - Clickable (selects radio)
  - Padding left: 8px from radio

Group Behavior:
  - Only one radio selected at a time
  - Selecting new radio deselects others
  - Cannot deselect by clicking selected radio
```

---

#### 3.2.5 Dropdown Interactions

```
Closed State:
  - Border: 1px solid #8d8d8d
  - Background: #ffffff
  - Height: 40px
  - Selected value or placeholder shown
  - ChevronDown icon on right

Open State:
  - Border: 2px solid #0f62fe
  - Dropdown menu appears below input
  - Menu background: #ffffff
  - Menu border: 1px solid #e0e0e0
  - Shadow: 0 2px 6px rgba(0, 0, 0, 0.3)

Options:
  - Font: IBM Plex Sans, 14px
  - Padding: 11px 16px
  - Hover: Light gray background (#e8e8e8)
  - Selected: Blue background (#e0e8f5)

Max Height: 300px (scrollable if more options)

Click Outside: Closes dropdown
Escape Key: Closes dropdown
Enter Key: Selects highlighted option
Arrow Keys: Navigate options
```

---

#### 3.2.6 Tab Interactions

**Main Tabs (Time range, Additional filters, Comparison, Saved combinations):**
```
Default Tab:
  - Background: Transparent
  - Text Color: #525252
  - Font: IBM Plex Sans, 14px, 400 weight
  - Icon: 16px on left
  - Padding: 12px 16px
  - Border Bottom: 2px solid transparent

Active Tab:
  - Text Color: #0f62fe (IBM Blue)
  - Border Bottom: 2px solid #0f62fe

Hover (inactive tabs):
  - Background: #f4f4f4
  - Text Color: #161616

Click Behavior:
  - Switches active tab
  - Shows corresponding content panel
  - Updates preview panel
```

**Subtabs (Presets, Continuous, Discrete):**
```
Same styling as main tabs
Nested under Time range tab
Only visible when Time range tab is active
```

---

#### 3.2.7 Modal Interactions

**Main Modal (Interval Selection):**
```
Overlay:
  - Background: rgba(0, 0, 0, 0.5)
  - Covers entire dashboard
  - Click overlay: Does NOT close modal (must use Cancel or X)

Modal Container:
  - Width: 1200px (fixed)
  - Height: Auto (max 90vh, scrollable)
  - Background: #ffffff
  - Border Radius: 0 (Carbon default)
  - Shadow: 0 4px 8px rgba(0, 0, 0, 0.3)
  - Position: Centered on screen

Layout:
  - Header: Fixed at top
  - Content: Two-column (form on left, preview on right)
  - Footer: Fixed at bottom
  - Scrollable: Content area only

Close Actions:
  1. Click X button in header
  2. Click Cancel button in footer
  3. Click Apply button (saves and closes)
  
  Note: ESC key does NOT close modal
  Note: Click outside does NOT close modal
```

**Nested Modal (Save Combination):**
```
Parent Modal Behavior:
  - Remains visible
  - Darkened with 30% black overlay: rgba(0, 0, 0, 0.3)
  - Positioned behind nested modal
  - Still readable for context

Nested Modal:
  - Width: 600px
  - Height: Auto
  - Background: #ffffff
  - Position: Centered over parent modal
  - Z-index: Higher than parent
  - Shadow: 0 4px 12px rgba(0, 0, 0, 0.5)

Close Actions:
  1. Click X button
  2. Click Cancel button
  3. Click Save button (validates and closes if valid)
  
  Result: Nested modal closes, parent modal overlay removed
```

---

#### 3.2.8 Preview Panel Interactions

```
Position: Right side of modal, fixed width
Width: 300px
Background: #f4f4f4
Border Left: 1px solid #e0e0e0
Padding: 16px
Scrollable: Yes (if content exceeds modal height)

Content Updates:
  - Real-time: Updates immediately when user changes any selection
  - Sections: Show/hide based on user selections
  
Example: If no interest group selected
  → "Interest group" section is completely hidden
  
Example: If user selects "Morning" shift
  → "Shifts:" section shows "Morning (6am - 2pm)"

Section Headers:
  - Font: IBM Plex Sans, 12px, bold
  - Color: #525252
  - Margin bottom: 8px

List Items:
  - Font: IBM Plex Sans, 14px, 400 weight
  - Color: #161616
  - Bullet: •
  - Line height: 1.5
```

---

### 3.3 Navigation Structure

```
Dashboard Navigation:
┌─────────────────────────────────────────────────────────────┐
│ IBM Z IntelliMagic Vision for z/OS                          │
├─────────────────────────────────────────────────────────────┤
│ [Dashboard] [Edit Dashboard] [Create Report]                │
│ [Selection] ← Opens Modal                                   │
│ [Export]                                                     │
│                                              [Search] [Opt] │
└─────────────────────────────────────────────────────────────┘

Modal Navigation:
┌─────────────────────────────────────────────────────────────┐
│ Interval selection                                      [X] │
├─────────────────────────────────────────────────────────────┤
│ [Time range] [Additional filters] [Comparison]              │
│ [Saved combinations]                                        │
│   │                                                          │
│   └─> [Presets] [Continuous] [Discrete] ← Subtabs          │
│                                                              │
│ (Content area)                           │ Preview Panel    │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ [Save as combination]          [Cancel] [Apply]             │
└─────────────────────────────────────────────────────────────┘

Breadcrumb: None (modal is temporary overlay, not navigational)
```

---

## 4. VISUAL SPECIFICATIONS

### 4.1 Layout & Grid Structure

#### Dashboard Layout
```
┌────────────────────────────────────────────────────────────────┐
│  Header (48px height)                                          │
├──────────┬───────────────────────────────────┬─────────────────┤
│          │                                   │                 │
│  Left    │         Center Content            │  Right Details  │
│  Sidebar │         Main Area                 │  Panel          │
│  256px   │         Flex-grow                 │  320px          │
│          │                                   │                 │
│          │                                   │                 │
│          │                                   │                 │
└──────────┴───────────────────────────────────┴─────────────────┘

Grid System: 
  - Total width: 100vw
  - Left sidebar: Fixed 256px
  - Right panel: Fixed 320px
  - Center: Flexible (fills remaining space)
  - Gap between columns: 0 (borders provide separation)
```

#### Modal Layout
```
┌────────────────────────────────────────────────────────────────┐
│  Modal Header (56px height)                                [X] │
├────────────────────────────────────────────────────────────────┤
│  Tabs (48px height)                                            │
├──────────────────────────────────────────┬─────────────────────┤
│                                          │                     │
│  Form Content Area                       │  Preview Panel      │
│  (Left Column)                           │  (Right Column)     │
│  870px                                   │  300px              │
│                                          │                     │
│  Scrollable                              │  Scrollable         │
│                                          │                     │
│                                          │                     │
├──────────────────────────────────────────┴─────────────────────┤
│  Footer (64px height)                                          │
│  [Save as combination]          [Cancel] [Apply]               │
└────────────────────────────────────────────────────────────────┘

Modal Dimensions:
  - Width: 1200px (fixed)
  - Height: Auto (max 90vh)
  - Max height content: calc(90vh - 56px header - 48px tabs - 64px footer)
```

#### Spacing System (IBM Carbon Grid)
```
Token           Value   Usage
──────────────────────────────────────────────────
spacing-01      2px     Micro spacing
spacing-02      4px     Tight element spacing
spacing-03      8px     Small element spacing
spacing-04      12px    Default between related elements
spacing-05      16px    Section spacing, padding
spacing-06      24px    Large section spacing
spacing-07      32px    Extra large spacing
spacing-08      40px    Maximum spacing

Applied to:
  - Form field spacing: 16px (spacing-05)
  - Section spacing: 24px (spacing-06)
  - Modal padding: 24px (spacing-06)
  - Button spacing: 8px (spacing-03)
  - Label to input: 8px (spacing-03)
```

---

### 4.2 Theme Preference

**Theme: Light Mode (Default and Only)**

```css
Color Tokens:

Background Colors:
  --background-primary: #ffffff (main backgrounds)
  --background-secondary: #f4f4f4 (sidebar, preview panel)
  --background-tertiary: #e8e8e8 (hover states)

Text Colors:
  --text-primary: #161616 (main text)
  --text-secondary: #525252 (secondary text, labels)
  --text-placeholder: #6f6f6f (placeholders)
  --text-disabled: #c6c6c6 (disabled text)

Border Colors:
  --border-strong: #8d8d8d (input borders)
  --border-subtle: #e0e0e0 (dividers, panel borders)
  --border-disabled: #c6c6c6 (disabled borders)

Interactive Colors:
  --interactive-primary: #0f62fe (IBM Blue 60)
  --interactive-hover: #0353e9 (IBM Blue 70)
  --interactive-active: #002d9c (IBM Blue 80)
  --interactive-light: #e0e8f5 (Light blue backgrounds)

Semantic Colors:
  --error: #da1e28 (error states)
  --success: #24a148 (success states)
  --warning: #f1c21b (warning states)
  --info: #0f62fe (info states)

Dashboard Specific:
  --nav-header-bg: #4178be (Navigation header blue)
  --nav-sidebar-bg: #f5f5f5 (Sidebar light gray)
  --header-bg: #ffffff (Top header white)
  --header-border: #e0e0e0 (Header bottom border)
```

---

### 4.3 Typography System

**Font Family: IBM Plex Sans (entire application)**

```
Font Import (from /src/styles/fonts.css):
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');

Type Scale:

Modal Title:
  Font: IBM Plex Sans
  Size: 20px
  Weight: 400
  Line Height: 28px
  Color: #161616

Tab Label:
  Font: IBM Plex Sans
  Size: 14px
  Weight: 400
  Line Height: 20px
  Color: #525252 (inactive), #0f62fe (active)

Section Header:
  Font: IBM Plex Sans
  Size: 14px
  Weight: 600
  Line Height: 20px
  Color: #161616

Body Text / Labels:
  Font: IBM Plex Sans
  Size: 14px
  Weight: 400
  Line Height: 20px
  Color: #161616

Helper Text / Descriptions:
  Font: IBM Plex Sans
  Size: 12px
  Weight: 400
  Line Height: 16px
  Color: #6f6f6f

Button Text:
  Font: IBM Plex Sans
  Size: 14px
  Weight: 400
  Line Height: 20px
  Color: #ffffff (primary), #161616 (secondary)

Input Text:
  Font: IBM Plex Sans
  Size: 14px
  Weight: 400
  Line Height: 20px
  Color: #161616

Placeholder Text:
  Font: IBM Plex Sans
  Size: 14px
  Weight: 400
  Line Height: 20px
  Color: #6f6f6f

Preview Panel Headers:
  Font: IBM Plex Sans
  Size: 12px
  Weight: 700
  Line Height: 16px
  Color: #525252

Preview Panel Items:
  Font: IBM Plex Sans
  Size: 14px
  Weight: 400
  Line Height: 22px
  Color: #161616

Character Counter:
  Font: IBM Plex Sans
  Size: 12px
  Weight: 400
  Line Height: 16px
  Color: #6f6f6f
  Position: Right-aligned

Error Message:
  Font: IBM Plex Sans
  Size: 12px
  Weight: 400
  Line Height: 16px
  Color: #da1e28
```

---

### 4.4 Custom Styling Needs

**Quick Select Toggle Buttons:**
```css
Default (Unselected):
  background: #ffffff
  border: 1px solid #8d8d8d
  color: #161616
  padding: 8px 16px
  border-radius: 4px
  font: IBM Plex Sans, 14px, 400
  
Selected:
  background: #0f62fe
  border: 1px solid #0f62fe
  color: #ffffff
  
Hover (Unselected):
  background: #e8e8e8
  border: 1px solid #525252
  
Hover (Selected):
  background: #0353e9
```

**Collapsible Section Headers:**
```css
Header:
  display: flex
  justify-content: space-between
  align-items: center
  padding: 8px 0
  cursor: pointer
  
Icon (ChevronDown/ChevronRight):
  size: 16px
  color: #161616
  transition: transform 0.2s ease
  
Expanded: ChevronDown icon
Collapsed: ChevronRight icon
```

**Preview Panel Section:**
```css
Background: #f4f4f4
Padding: 16px
Border-left: 1px solid #e0e0e0

Section:
  margin-bottom: 16px
  
Header:
  font-weight: 700
  font-size: 12px
  color: #525252
  margin-bottom: 8px
  text-transform: uppercase
  
List:
  list-style: none
  padding-left: 16px
  
List Item:
  position: relative
  padding-left: 16px
  line-height: 1.5
  
  &::before:
    content: "•"
    position: absolute
    left: 0
    color: #161616
```

**Time Input Dropdown:**
```css
Container:
  display: flex
  gap: 4px
  align-items: center
  
Hour Dropdown:
  width: 60px
  height: 40px
  
Separator (:):
  font-size: 16px
  font-weight: 700
  color: #161616
  
Minute Input:
  width: 60px
  height: 40px
```

**Calendar Picker (react-day-picker) Custom Styling:**
```css
.rdp {
  --rdp-accent-color: #0f62fe;
  --rdp-background-color: #e0e8f5;
  font-family: 'IBM Plex Sans', sans-serif;
}

.rdp-day_selected {
  background-color: #0f62fe;
  color: white;
}

.rdp-day_today {
  border: 1px solid #0f62fe;
}

.rdp-day:hover {
  background-color: #e8e8e8;
}
```

**Nested Modal Overlay Effect:**
```css
Parent Modal (when nested modal open):
  position: relative
  
Parent Modal Overlay:
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  background: rgba(0, 0, 0, 0.3)
  z-index: 1
  pointer-events: auto
  
Nested Modal:
  z-index: 2
  position: fixed
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
```

---

## 5. INTERACTION DETAILS

### 5.1 Button Click Actions

| Button | Location | Click Action | Result |
|--------|----------|--------------|--------|
| **Selection** | Dashboard top nav | Opens Interval Selection Modal | Modal appears, dashboard darkened |
| **X** (close) | Modal header | Closes modal without saving | Returns to dashboard, no changes applied |
| **Cancel** | Modal footer | Closes modal without saving | Returns to dashboard, no changes applied |
| **Apply** | Modal footer | Applies all selections and closes modal | Dashboard updates with filters, modal closes |
| **Save as combination** | Modal footer | Opens Save Combination nested modal | Nested modal appears, parent modal darkened |
| **+** (Add time range) | Time range section | Adds new time range row | New From/To time inputs appear |
| **-** (Remove time range) | Time range row | Removes time range row | Row deleted, preview panel updates |
| **+** (Add date/time range) | Continuous/Discrete tabs | Adds new range row | New input fields appear |
| **-** (Remove range) | Range row | Removes range row | Row deleted |
| **Weekdays** | Days section | Auto-selects Mon-Fri | All weekday checkboxes checked |
| **All days** | Days section | Auto-selects all 7 days | All day checkboxes checked |
| **Quick select buttons** | Presets tab | Toggles selection | Button background toggles blue/white |
| **Save** | Save Combination modal | Validates and saves | If valid: saves combination, closes nested modal. If invalid: shows error |
| **Cancel** | Save Combination modal | Closes without saving | Nested modal closes, parent overlay removed |

---

### 5.2 Form Validation Rules

#### Save Combination Modal

**Combination Name Field:**
```
Required: Yes
Min Length: 1 character
Max Length: None specified
Validation Trigger: On Save button click

Error States:
  - If empty on Save click:
    → Show red border on input
    → Show error message: "Combination name is required"
    → Prevent modal from closing
    → Focus returns to name field
  
  - If filled:
    → Save proceeds
    → New combination added to list
    → Modal closes successfully
```

**Description Field:**
```
Required: No (optional)
Min Length: 0
Max Length: 256 characters
Character Counter: Shown as "X / 256"
Validation: Real-time character count

Error States:
  - If over 256 characters:
    → Counter turns red
    → Input border turns red
    → Cannot type more characters
    → Save button disabled
```

---

#### Time Range Validation

**Time Range (From/To):**
```
Rule: "From" time must be BEFORE "To" time

Validation Trigger: On blur (when user leaves field)

Error States:
  - If From >= To:
    → Red border on both time inputs
    → Error message below: "Start time must be before end time"
    → Preview panel does NOT show this time range
    → Apply button remains enabled (other fields may be valid)
  
  - If From < To:
    → Normal borders
    → No error message
    → Time range appears in preview panel

Example Error:
  From: 14:00
  To: 09:00
  → ERROR: "Start time must be before end time"

Example Valid:
  From: 09:00
  To: 17:00
  → No error
```

**Time Format Validation:**
```
Hours: Must be 00-23
Minutes: Must be 00-59

Validation: Real-time on input

Error States:
  - If minutes > 59:
    → Automatically corrects to 59
  - If minutes < 0:
    → Automatically corrects to 00
  - If non-numeric entered:
    → Ignores input, keeps previous value
```

---

#### Date Range Validation

**Continuous Range (From Date/Time to To Date/Time):**
```
Rule: "From" date+time must be BEFORE "To" date+time

Validation: On blur

Error States:
  - If From date+time >= To date+time:
    → Red border on all four fields (From Date, From Time, To Date, To Time)
    → Error message: "Start date/time must be before end date/time"
    → Range not shown in preview
  
Example Error:
  From Date: 01/15/2026, From Time: 14:00
  To Date: 01/15/2026, To Time: 09:00
  → ERROR

Example Valid:
  From Date: 01/15/2026, From Time: 09:00
  To Date: 01/15/2026, To Time: 17:00
  → No error
```

**Discrete Date Range:**
```
Rule: "From" date must be ON OR BEFORE "To" date

Validation: On blur

Error States:
  - If From date > To date:
    → Red border on both date inputs
    → Error message: "Start date must be on or before end date"
  
  - Same date allowed (From = To)
    → No error
```

---

#### Comparison Tab Validation

**Relative Comparison:**
```
Number Field:
  - Required: Yes (if Relative is selected)
  - Format: 2 digits (01-99)
  - Validation: On blur
  
Dropdown:
  - Required: Yes (if Relative is selected)
  - Must select a unit (hours/days/weeks/months/years earlier)

Error States:
  - If number empty but unit selected:
    → Red border on number field
    → Error message: "Please enter a number"
  
  - If unit not selected but number entered:
    → Red border on dropdown
    → Error message: "Please select a time unit"
  
  - If both empty:
    → No error (comparison is optional)
```

**Absolute Comparison:**
```
Date Fields:
  - Required: No (comparison is optional)
  - If one date selected, the other is NOT required
  - No validation between dates (any range allowed)

Error States:
  - No specific error states
  - If user selects dates and applies, they are stored
```

---

### 5.3 Success States

#### Filter Application Success
```
Trigger: User clicks "Apply" button

Sequence:
  1. All selections validated
  2. Modal closes with fade-out animation (0.2s)
  3. Overlay fades out (0.2s)
  4. Dashboard reappears
  5. (In production, dashboard data would refresh based on filters)

Visual Feedback:
  - No explicit "success" notification
  - Modal closing indicates successful application
  - User is returned to clean dashboard state
```

#### Save Combination Success
```
Trigger: User clicks "Save" in Save Combination modal (with valid data)

Sequence:
  1. Form validates (name not empty, description ≤ 256 chars)
  2. New combination object created with:
     - Unique ID
     - User-entered name
     - User-entered description
     - Current date as "Saved on" date
     - Complete filter configuration snapshot
  3. Combination added to savedCombinations list
  4. Nested modal closes
  5. Parent modal overlay removed
  6. User sees Interval Selection modal again

Visual Feedback:
  - No explicit success message
  - Modal closing indicates success
  - User can navigate to "Saved combinations" tab to verify
```

#### Load Saved Combination Success
```
Trigger: User clicks on a saved combination in Saved Combinations tab

Sequence:
  1. Saved combination selected (blue background)
  2. Preview panel updates to show "Saved combination" section
  3. Preview shows combination name

Note: 
  - At this stage (Stage 01), loading does NOT apply the filters
  - It only shows the selection in the preview panel
  - User would still need to click "Apply" to apply filters
  - (Future: Could auto-populate fields with saved values)
```

---

### 5.4 Error States

#### Time Range Error Example
```
User Action:
  1. User clicks + button to add time range
  2. User sets From: 18:00
  3. User sets To: 09:00
  4. User tabs out of To field

Result:
  ┌──────────────────────────────────────────────────┐
  │ Time range                                   [-] │
  ├──────────────────────────────────────────────────┤
  │ From: [18]:[00] ▼    To: [09]:[00] ▼            │
  │       ──────────         ──────────               │
  │       Red border         Red border               │
  │                                                   │
  │ ⚠ Start time must be before end time             │
  │   (Red text)                                      │
  └──────────────────────────────────────────────────┘

Preview Panel:
  • Does NOT show this time range
  • Shows all other valid selections
```

#### Save Combination Error Example
```
User Action:
  1. User clicks "Save as combination"
  2. Nested modal opens
  3. User leaves "Combination name" field empty
  4. User clicks "Save" button

Result:
  ┌──────────────────────────────────────────────────┐
  │ Save selection combination                   [X] │
  ├──────────────────────────────────────────────────┤
  │ Combination name *                               │
  │ ┌──────────────────────────────────────────────┐ │
  │ │                                              │ │
  │ └──────────────────────────────────────────────┘ │
  │   Red border                                     │
  │ ⚠ Combination name is required                   │
  │   (Red text)                                      │
  │                                                   │
  │ Description (optional)                           │
  │ ┌──────────────────────────────────────────────┐ │
  │ │                                              │ │
  │ │                                              │ │
  │ └──────────────────────────────────────────────┘ │
  │                                        0 / 256   │
  ├──────────────────────────────────────────────────┤
  │ [Cancel]                              [Save]     │
  └──────────────────────────────────────────────────┘

Behavior:
  • Modal does NOT close
  • Focus moves to name field
  • User must enter name to proceed
```

---

### 5.5 Loading States

**Note: Stage 01 is a static prototype with no actual data loading.**

**If implementing loading states (future):**

```
Modal Opening:
  - Fade-in animation: 0.2s
  - Content loads immediately (no spinner)

Calendar Picker Opening:
  - Appears immediately (no loading)
  - Current month shown instantly

Dropdown Opening:
  - Options appear immediately (no loading)
  - No lazy loading of options

Apply Button Click:
  - (In production) Would show:
    └─> Apply button changes to loading state
    └─> Spinner icon replaces checkmark
    └─> Button text: "Applying..."
    └─> Button disabled during process
    └─> Duration: 0.5-2s (depending on backend)
    └─> On complete: Modal closes

Save Combination:
  - (In production) Would show:
    └─> Save button loading state
    └─> Spinner icon
    └─> Button text: "Saving..."
    └─> Duration: 0.2-0.5s
    └─> On complete: Modal closes
```

---

## 6. VISUAL REFERENCE GUIDE

### 6.1 Component Dimensions Reference

```
┌─────────────────────────────────────────────────────────────────┐
│ COMPONENT SIZING REFERENCE                                      │
└─────────────────────────────────────────────────────────────────┘

Buttons:
  Primary/Secondary Height: 40px
  Icon Button: 32px × 32px
  Padding Horizontal: 16px
  Icon Size: 16px
  Icon + Text Gap: 8px

Inputs:
  Text Input Height: 40px
  Dropdown Height: 40px
  Date Picker Height: 40px
  Time Input Height: 40px
  Number Input Height: 40px
  Textarea Min Height: 80px

Checkboxes & Radios:
  Checkbox Size: 16px × 16px
  Radio Size: 16px diameter
  Label Gap: 8px

Tabs:
  Tab Height: 48px
  Tab Horizontal Padding: 16px
  Active Border Bottom: 2px

Modal:
  Header Height: 56px
  Footer Height: 64px
  Tabs Height: 48px
  Content Padding: 24px
  Preview Panel Width: 300px

Dashboard:
  Header Height: 48px
  Sidebar Width: 256px
  Details Panel Width: 320px

Icons:
  Small Icons (inline): 14px
  Medium Icons (buttons, nav): 16px
  Large Icons (headers): 20px
```

---

### 6.2 State Color Reference

```
┌─────────────────────────────────────────────────────────────────┐
│ INTERACTIVE STATE COLORS                                        │
└─────────────────────────────────────────────────────────────────┘

Default State:
  Button (Primary): #0f62fe
  Button (Secondary): Transparent, border #8d8d8d
  Input Border: #8d8d8d
  Checkbox/Radio Border: #8d8d8d

Hover State:
  Button (Primary): #0353e9
  Button (Secondary): Background #e8e8e8
  Input Border: #0f62fe
  Checkbox/Radio Border: #0f62fe

Focus State:
  All Interactive Elements: 2px outline #0f62fe, offset 2px

Active State:
  Button (Primary): #002d9c
  Checkbox: #0f62fe background, white checkmark
  Radio: #0f62fe circle, white center dot
  Tab: #0f62fe text, #0f62fe 2px bottom border

Disabled State:
  Button: #c6c6c6 background, #8d8d8d text
  Input: #f4f4f4 background, #c6c6c6 border
  Checkbox/Radio: #c6c6c6 background

Error State:
  Input Border: #da1e28 (2px)
  Text: #da1e28
  Icon: #da1e28

Success State:
  (Not used in this interface currently)
  Color: #24a148
```

---

### 6.3 Spacing Reference Map

```
┌─────────────────────────────────────────────────────────────────┐
│ SPACING MAP                                                     │
└─────────────────────────────────────────────────────────────────┘

Form Sections:
  Between sections: 24px (spacing-06)
  Between related fields: 16px (spacing-05)
  Label to input: 8px (spacing-03)
  Input to helper text: 4px (spacing-02)

Modal Structure:
  Modal padding: 24px
  Header padding: 16px 24px
  Footer padding: 16px 24px
  Content horizontal padding: 24px
  Content vertical padding: 16px

Button Groups:
  Between buttons: 8px (spacing-03)
  Inside button (text to edge): 16px
  Icon to text: 8px

Lists:
  Between list items: 8px
  Bullet to text: 16px
  Section header to list: 8px

Preview Panel:
  Panel padding: 16px
  Section margin bottom: 16px
  Header to items: 8px
  Between items: 4px

Dashboard:
  Sidebar padding: 8px
  Nav item padding: 12px
  Section spacing: 8px
  Expandable section padding: 8px 12px
```

---

## 7. TECHNICAL SPECIFICATIONS

### 7.1 Component File Structure

```
src/
├── app/
│   ├── App.tsx                          # Entry point, renders Dashboard
│   └── components/
│       ├── Dashboard.tsx                 # Main dashboard with 3-column layout
│       ├── SelectionPanel.tsx            # Main interval selection modal
│       ├── ContinuousRangeView.tsx       # Continuous range tab content
│       ├── DiscreteRangeView.tsx         # Discrete range tab content
│       ├── AdditionalFiltersView.tsx     # Additional filters tab content
│       ├── ComparisonView.tsx            # Comparison tab content
│       ├── SavedCombinationsView.tsx     # Saved combinations tab content
│       ├── SaveCombinationModal.tsx      # Nested save modal
│       └── ui/                           # Reusable UI components (if any)
├── styles/
│   ├── fonts.css                         # IBM Plex Sans font imports
│   └── theme.css                         # CSS custom properties/tokens
└── package.json                          # Dependencies
```

---

### 7.2 Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "lucide-react": "latest",              // Icons
    "react-day-picker": "latest",          // Calendar date picker
    "date-fns": "latest",                  // Date manipulation utilities
    "@tailwindcss/forms": "latest"         // Tailwind form plugin
  }
}
```

---

### 7.3 State Management Structure

```typescript
// SelectionPanel.tsx maintains all state

State Variables:
- activeTab: 'time-range' | 'additional-filters' | 'comparisons' | 'saved-combinations'
- timeRangeType: 'presets' | 'continuous' | 'discrete'
- selectedQuickOption: string ('All data' | 'Previous month' | 'Single date' | 'Relative')
- relativeNumber: string (e.g., '8')
- relativeUnit: string (e.g., 'hours')
- singleDate: Date | undefined
- timeRanges: Array<{ from: string; to: string }>
- selectedDays: string[] (e.g., ['Monday', 'Tuesday'])
- endOfMonthOptions: object with firstDay, firstWeekday, lastDay, lastWeekday
- continuousDateTimeRanges: Array<{ fromDate, fromTime, toDate, toTime }>
- discreteDateRanges: Array<{ fromDate, toDate }>
- discreteTimeRanges: Array<{ fromTime, toTime }>
- selectedSysplex: string[]
- selectedShifts: string[]
- selectedInterestGroup: string
- selectedReportingInterval: string
- comparisonMode: 'relative' | 'absolute'
- comparisonRelativeNumber: string
- comparisonRelativeUnit: string
- absoluteFromDate: Date | undefined
- absoluteToDate: Date | undefined
- savedCombinations: SavedCombination[]
- selectedSavedCombination: string | null
- isSaveCombinationModalOpen: boolean

All child components receive:
- Current state values as props
- Setter functions as props
- Update functions to modify state

Preview panel:
- Reads all state variables
- Dynamically renders sections based on state
- Updates in real-time when state changes
```

---

### 7.4 Data Models

```typescript
// SavedCombination Interface
interface SavedCombination {
  id: string;                    // Unique identifier
  name: string;                  // User-provided name
  description: string;           // Optional description
  savedOn: string;               // Date saved (format: MM/DD/YYYY)
  filterData: {                  // Complete snapshot of all filter state
    timeRangeType: 'presets' | 'continuous' | 'discrete';
    selectedQuickOption: string;
    relativeNumber: string;
    relativeUnit: string;
    singleDate: Date | undefined;
    continuousDateTimeRanges: Array<{
      fromDate: string;
      fromTime: string;
      toDate: string;
      toTime: string;
    }>;
    continuousSelectedDays: string[];
    continuousEndOfMonthOptions: EndOfMonthOptions;
    discreteDateRanges: Array<{
      fromDate: string;
      toDate: string;
    }>;
    discreteTimeRanges: Array<{
      fromTime: string;
      toTime: string;
    }>;
    discreteSelectedDays: string[];
    discreteEndOfMonthOptions: EndOfMonthOptions;
    selectedSysplex: string[];
    selectedShifts: string[];
    selectedInterestGroup: string;
    selectedReportingInterval: string;
    comparisonMode: 'relative' | 'absolute';
    comparisonRelativeNumber: string;
    comparisonRelativeUnit: string;
    absoluteFromDate: Date | undefined;
    absoluteToDate: Date | undefined;
  };
}

// End of Month Options Interface
interface EndOfMonthOptions {
  firstDay: {
    enabled: boolean;
    value: number;              // 0-31
  };
  firstWeekday: {
    enabled: boolean;
    value: number;
  };
  lastDay: {
    enabled: boolean;
    value: number;
  };
  lastWeekday: {
    enabled: boolean;
    value: number;
  };
}
```

---

## 8. ACCESSIBILITY REQUIREMENTS

### 8.1 Keyboard Navigation

```
Tab Order:
  1. Dashboard navigation buttons (left to right)
  2. Search input
  3. Options button
  4. Help button
  5. (When modal opens)
  6. Modal X close button
  7. Tab navigation (Time range, Additional filters, etc.)
  8. All interactive elements in active tab (top to bottom, left to right)
  9. Preview panel (focusable if scrollable)
  10. Save as combination button
  11. Cancel button
  12. Apply button

Keyboard Shortcuts:
  - Tab: Move to next focusable element
  - Shift+Tab: Move to previous focusable element
  - Enter/Space: Activate button, checkbox, radio, dropdown
  - Arrow Keys: Navigate dropdown options, calendar dates
  - Escape: Close dropdown, close calendar picker
  - (Note: Escape does NOT close modal)

Focus Management:
  - When modal opens: Focus moves to modal (first tab or close button)
  - When modal closes: Focus returns to "Selection" button that opened it
  - When nested modal opens: Focus moves to nested modal
  - When nested modal closes: Focus returns to parent modal
  - When dropdown opens: Focus on first option
  - When calendar opens: Focus on selected date or today

Focus Indicators:
  - All interactive elements show visible focus ring
  - Focus ring: 2px solid #0f62fe, 2px offset from element
  - Focus ring visible on keyboard navigation only (not mouse click)
```

---

### 8.2 Screen Reader Support

```
ARIA Labels:
  - Modal: aria-label="Interval selection"
  - Nested Modal: aria-label="Save selection combination"
  - Close buttons: aria-label="Close" or "Close modal"
  - Icon-only buttons: aria-label describing action (e.g., "Add time range")
  - Checkboxes: aria-label matching visible label
  - Radios: aria-label matching visible label
  - Dropdowns: aria-label matching visible label

ARIA Roles:
  - Modal: role="dialog" aria-modal="true"
  - Tabs: role="tablist", role="tab", role="tabpanel"
  - Buttons: role="button" (implicit from <button> element)
  - Checkboxes: role="checkbox" (implicit)
  - Radios: role="radio" (implicit)

ARIA States:
  - aria-expanded: true/false for collapsible sections, dropdowns
  - aria-selected: true/false for tabs, saved combinations
  - aria-checked: true/false for checkboxes
  - aria-invalid: true when validation error present
  - aria-required: true for required fields (e.g., combination name)
  - aria-describedby: points to error message or helper text ID

Live Regions:
  - Preview panel: aria-live="polite" (announces updates to screen readers)
  - Error messages: aria-live="assertive" (announces immediately)

Alt Text:
  - All icons used for meaning have aria-label
  - Decorative icons: aria-hidden="true"
```

---

### 8.3 Color Contrast Requirements

```
WCAG 2.1 Level AA Compliance:

Text Contrast:
  - Primary text (#161616) on white (#ffffff): 16.13:1 ✓ AAA
  - Secondary text (#525252) on white: 7.44:1 ✓ AA
  - Placeholder text (#6f6f6f) on white: 5.17:1 ✓ AA
  - Button text (white) on primary blue (#0f62fe): 4.58:1 ✓ AA
  - Error text (#da1e28) on white: 6.66:1 ✓ AA

Interactive Elements:
  - Focus indicator (#0f62fe): 3.07:1 against white background ✓
  - Checkbox border (#8d8d8d): 2.49:1 ✓
  - Active tab border (#0f62fe): 3.07:1 ✓

Non-Text Contrast:
  - Icon buttons: 3:1 minimum (follows IBM Carbon standards)
  - Border contrast: Borders visible against backgrounds

Special Cases:
  - Blue selected buttons (#0f62fe) with white text: Pass AA
  - Preview panel (#f4f4f4) with dark text: Pass AA
  - Navigation header (#4178be) with white text: Pass AA

Note: All color combinations follow IBM Carbon Design System
      accessibility standards
```

---

## 9. RESPONSIVE BEHAVIOR (if applicable)

**Note: This prototype is designed for desktop only (1200px+ screens)**

**If responsive behavior needed (future):**

```
Breakpoints:
  - Desktop: 1200px and above (current design)
  - Tablet: 768px - 1199px (not implemented)
  - Mobile: < 768px (not implemented)

Modal Responsive Adjustments (if implementing):
  Desktop (1200px+):
    - Modal width: 1200px fixed
    - Two-column layout (form + preview)
  
  Tablet (768px - 1199px):
    - Modal width: 90vw
    - Two-column layout maintained
    - Preview panel: 250px width
  
  Mobile (< 768px):
    - Modal width: 100vw (full screen)
    - Single column layout
    - Preview panel: Collapsible bottom sheet or separate tab
    - Footer buttons: Stack vertically
    - Time inputs: Simplified to native mobile time pickers

Dashboard Responsive Adjustments:
  Desktop:
    - Three-column layout as designed
  
  Tablet:
    - Left sidebar: Collapsible drawer
    - Right panel: Collapsible drawer
    - Center content: Full width when panels collapsed
  
  Mobile:
    - Single column layout
    - Hamburger menu for navigation
    - Bottom sheet for details panel
```

---

## 10. EDGE CASES & SPECIAL SCENARIOS

### 10.1 Empty States

```
Scenario: No saved combinations exist
Location: Saved Combinations tab
Display:
  ┌──────────────────────────────────────────────────────┐
  │                                                      │
  │              📋 No saved combinations                │
  │                                                      │
  │   You haven't saved any filter combinations yet.    │
  │   Configure filters and click "Save as combination" │
  │   to create one.                                     │
  │                                                      │
  └──────────────────────────────────────────────────────┘

Scenario: No time ranges added
Location: Presets tab, Time range section
Display:
  - Section shows header "Time range" with [+] button
  - No input fields shown
  - Preview panel does NOT show "Time range" section

Scenario: No filters selected in Additional Filters tab
Location: Additional filters tab
Display:
  - All checkboxes unchecked
  - Interest group: "Select interest group" placeholder
  - Reporting interval: "Hourly" (default)
  - Preview panel shows ONLY "Reporting interval: Hourly"
```

---

### 10.2 Maximum Limits

```
Time Ranges:
  - Maximum allowed: No hard limit (UI supports adding unlimited ranges)
  - Recommended: Display warning if > 10 ranges for performance

Date/Time Ranges (Continuous):
  - Maximum allowed: No hard limit
  - Recommended: Display warning if > 5 ranges

Saved Combinations:
  - Maximum allowed: No hard limit
  - Storage: Local state (not persisted across sessions in Stage 01)
  - Recommended: Implement pagination if > 20 combinations

Text Input Limits:
  - Combination name: No maximum (recommended: 100 characters)
  - Description: 256 characters (enforced)
  - Search input: No maximum

Selection Limits:
  - Sysplex: Can select all 4 (or "All Sysplexes")
  - Shifts: Can select all 4 (or "All Shifts")
  - Days: Can select all 7 days
  - Quick select buttons: Can select multiple simultaneously
```

---

### 10.3 Conflict Scenarios

```
Scenario: User selects "All data" + specific time ranges
Behavior:
  - Both selections allowed
  - Preview shows both in list
  - Backend logic (future) determines precedence
  - UI does NOT prevent this combination

Scenario: User selects "All Sysplexes" + specific sysplex
Behavior:
  - Checking "All Sysplexes" checks all individual checkboxes
  - Unchecking one individual unchecks "All Sysplexes"
  - "All Sysplexes" becomes indeterminate if 1-3 selected
  - Preview shows either "All Sysplexes" or individual list

Scenario: User has unsaved changes and clicks X to close
Behavior:
  - Stage 01: Modal closes immediately, changes lost
  - Future: Show confirmation dialog:
    "You have unsaved changes. Are you sure you want to close?"
    [Cancel] [Close anyway]

Scenario: User tries to save combination with duplicate name
Behavior:
  - Stage 01: Allows duplicate names (no validation)
  - Future: Show warning or auto-append number (e.g., "Name (2)")

Scenario: User loads saved combination then modifies it
Behavior:
  - Selection remains highlighted in Saved Combinations tab
  - Preview panel updates with new changes
  - Original saved combination is NOT modified
  - User can save as new combination or apply modified version
```

---

## 11. SUMMARY CHECKLIST

### For Development Handoff:

- [ ] All screens/pages identified and documented
- [ ] Complete user journey mapped from entry to exit
- [ ] All interactive elements documented with click actions
- [ ] Content requirements specified (text, data, placeholders)
- [ ] Carbon components identified with variants
- [ ] Layout grid structure defined with dimensions
- [ ] Color tokens documented with hex values
- [ ] Typography scale defined with IBM Plex Sans
- [ ] Spacing system applied with Carbon tokens
- [ ] Button states documented (default, hover, focus, active, disabled)
- [ ] Input field states documented with validation rules
- [ ] Form validation rules specified with error messages
- [ ] Success and error states defined
- [ ] Loading states documented (even if not implemented)
- [ ] Keyboard navigation flow defined
- [ ] ARIA labels and roles specified
- [ ] Color contrast verified (WCAG AA)
- [ ] Edge cases and empty states documented
- [ ] State management structure outlined
- [ ] Data models/interfaces defined
- [ ] File structure organized
- [ ] Dependencies listed

---

## 12. APPENDIX: SAMPLE DATA

### Sample Saved Combinations (4 default examples)

```json
[
  {
    "id": "1",
    "name": "Morning Shift Analytics",
    "description": "Filter configuration for analyzing morning shift performance data across all production systems. Includes weekday patterns and hourly breakdowns for operational insights.",
    "savedOn": "01/15/2026"
  },
  {
    "id": "2",
    "name": "Weekend Report Filter",
    "description": "Comprehensive weekend data analysis setup focusing on reduced staff periods. Captures Saturday and Sunday metrics with emphasis on automated processes.",
    "savedOn": "01/20/2026"
  },
  {
    "id": "3",
    "name": "Production Hours Only",
    "description": "Business hours filter excluding nights and weekends. Optimized for standard operational reporting during peak activity periods.",
    "savedOn": "01/22/2026"
  },
  {
    "id": "4",
    "name": "Monthly Comparison Set",
    "description": "Month-over-month comparison configuration with automatic date adjustments. Useful for tracking performance trends and identifying seasonal patterns.",
    "savedOn": "02/01/2026"
  }
]
```

### Sample Dropdown Options

```json
{
  "interestGroups": [
    "IGT (default)",
    "IGT-A",
    "IGT-B",
    "IGT-C"
  ],
  "reportingIntervals": [
    "Hourly",
    "Daily",
    "Weekly",
    "Monthly"
  ],
  "relativeUnits": [
    "hours",
    "days",
    "weeks",
    "months",
    "years"
  ],
  "comparisonUnits": [
    "Hours earlier",
    "Days earlier",
    "Weeks earlier",
    "Months earlier",
    "Years earlier"
  ]
}
```

### Sample Sysplex Names

```json
["SYSA", "SYSB", "SYSC", "SYSD"]
```

### Sample Shift Times

```json
[
  { "name": "Morning", "time": "6am - 2pm" },
  { "name": "Day", "time": "8am - 4pm" },
  { "name": "Evening", "time": "4pm - 12am" },
  { "name": "Night", "time": "12am - 8am" }
]
```

---

## END OF DOCUMENT

**Last Updated**: February 11, 2026  
**Stage**: 01 - Pixel-Perfect Recreation  
**Status**: Design Locked - Ready for Development  

For questions or clarifications, contact the UX design team.
