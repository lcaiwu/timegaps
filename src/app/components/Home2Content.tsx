import { useState, useMemo, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { ChevronDown, BarChart3, Grid3X3, ChevronDownIcon, X, SlidersHorizontal, Eye, EyeOff, TrendingUp, Activity } from 'lucide-react';
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ReferenceArea, Customized,
} from 'recharts';
import type { ActiveSelection } from './Dashboard';

// Inline SVG icon components — replaces broken localhost:3845 asset URLs

// Chevron right (›) — sidebar nav arrow
const IconChevronRight = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
    <path d="M3.98828 7.97675L6.64719 5.31784L3.98828 2.65894" stroke="#525252" strokeWidth="0.886" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Chevron down (˅) — expanded nav arrow
const IconChevronDown = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
    <path d="M2.66016 3.98853L5.31906 6.64743L7.97797 3.98853" stroke="#525252" strokeWidth="0.886" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Collapse (◁▷) — toolbar button
const IconCollapse = ({ size = 12, color = '#4a5565' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
    <path d="M10.5625 3.3606L6.48186 7.44128L4.08146 5.04088L0.960938 8.1614" stroke={color} strokeWidth="0.96" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Collected (bookmark) icon
const IconCollected = ({ size = 14, color = '#161616' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 11.52 11.52" fill="none" style={{ flexShrink: 0 }}>
    <path d="M9.11957 10.0816L5.759 8.16131L2.39844 10.0816V2.40035C2.39844 2.1457 2.4996 1.90148 2.67966 1.72141C2.85973 1.54135 3.10395 1.44019 3.3586 1.44019H8.1594C8.41405 1.44019 8.65828 1.54135 8.83834 1.72141C9.01841 1.90148 9.11957 2.1457 9.11957 2.40035V10.0816Z" stroke={color} strokeWidth="0.96" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Dashboard (grid) icon
const IconDashboard = ({ size = 14, color = '#161616' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 12.41 12.41" fill="none" style={{ flexShrink: 0 }}>
    <path d="M1.55078 4.65308H10.857" stroke={color} strokeWidth="1.034" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.55078 7.75513H10.857" stroke={color} strokeWidth="1.034" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.65234 1.55103V10.8572" stroke={color} strokeWidth="1.034" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.75391 1.55103V10.8572" stroke={color} strokeWidth="1.034" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.82294 1.55103H2.5848C2.01373 1.55103 1.55078 2.01397 1.55078 2.58505V9.82318C1.55078 10.3943 2.01373 10.8572 2.5848 10.8572H9.82294C10.394 10.8572 10.857 10.3943 10.857 9.82318V2.58505C10.857 2.01397 10.394 1.55103 9.82294 1.55103Z" stroke={color} strokeWidth="1.034" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Favorites (star) icon
const IconFavorites = ({ size = 14, color = '#161616' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 11.52 11.52" fill="none" style={{ flexShrink: 0 }}>
    <path d="M5.53457 1.10178C5.55561 1.05927 5.58811 1.02349 5.6284 0.998477C5.6687 0.973461 5.71518 0.960205 5.76261 0.960205C5.81004 0.960205 5.85652 0.973461 5.89681 0.998477C5.93711 1.02349 5.96961 1.05927 5.99065 1.10178L7.09963 3.34808C7.17269 3.49592 7.28053 3.62384 7.41391 3.72084C7.54728 3.81783 7.70219 3.88102 7.86536 3.90497L10.3455 4.26791C10.3925 4.27472 10.4366 4.29454 10.4729 4.32513C10.5092 4.35573 10.5363 4.39587 10.5509 4.44103C10.5656 4.48619 10.5674 4.53455 10.556 4.58065C10.5446 4.62675 10.5206 4.66875 10.4866 4.7019L8.69302 6.44844C8.57474 6.5637 8.48624 6.70599 8.43514 6.86305C8.38404 7.0201 8.37187 7.18723 8.39969 7.35003L8.82312 9.81764C8.83142 9.86461 8.82634 9.91297 8.80848 9.95719C8.79061 10.0014 8.76068 10.0397 8.72209 10.0678C8.68349 10.0958 8.6378 10.1124 8.59022 10.1157C8.54264 10.119 8.49508 10.1089 8.45298 10.0865L6.23597 8.92085C6.08989 8.84415 5.92736 8.80407 5.76237 8.80407C5.59737 8.80407 5.43485 8.84415 5.28877 8.92085L3.07224 10.0865C3.03015 10.1088 2.98265 10.1188 2.93515 10.1154C2.88765 10.112 2.84205 10.0954 2.80353 10.0674C2.76502 10.0394 2.73514 10.0011 2.71729 9.95697C2.69944 9.91282 2.69434 9.86455 2.70257 9.81764L3.12552 7.35051C3.15346 7.18763 3.14136 7.0204 3.09026 6.86325C3.03915 6.70609 2.95059 6.56373 2.8322 6.44844L1.03861 4.70238C1.00433 4.66927 0.980041 4.6272 0.968505 4.58096C0.956968 4.53472 0.958651 4.48616 0.973361 4.44083C0.988072 4.3955 1.01522 4.35521 1.05171 4.32455C1.0882 4.29389 1.13257 4.2741 1.17976 4.26743L3.65937 3.90497C3.82273 3.8812 3.97785 3.8181 4.11141 3.72109C4.24497 3.62408 4.35295 3.49607 4.42606 3.34808L5.53457 1.10178Z" stroke={color} strokeWidth="0.96" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Edit (pencil + square) icon
const IconEdit = ({ size = 14, color = 'white' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 11.52 11.52" fill="none" style={{ flexShrink: 0 }}>
    <path d="M5.76213 1.44019H2.40157C2.14692 1.44019 1.9027 1.54135 1.72263 1.72141C1.54257 1.90148 1.44141 2.1457 1.44141 2.40035V9.12147C1.44141 9.37612 1.54257 9.62035 1.72263 9.80041C1.9027 9.98048 2.14692 10.0816 2.40157 10.0816H9.12269C9.37735 10.0816 9.62157 9.98048 9.80163 9.80041C9.9817 9.62035 10.0829 9.37612 10.0829 9.12147V5.76091" stroke={color} strokeWidth="0.96" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.8226 1.25995C9.01359 1.06897 9.27262 0.96167 9.54272 0.96167C9.81282 0.96167 10.0719 1.06897 10.2628 1.25995C10.4538 1.45094 10.5611 1.70998 10.5611 1.98007C10.5611 2.25017 10.4538 2.50921 10.2628 2.7002L5.93588 7.02764C5.82188 7.14154 5.68105 7.22491 5.52637 7.27008L4.1471 7.67335C4.10579 7.6854 4.062 7.68612 4.02031 7.67544C3.97863 7.66476 3.94058 7.64307 3.91015 7.61265C3.87972 7.58222 3.85803 7.54417 3.84735 7.50248C3.83667 7.4608 3.8374 7.41701 3.84945 7.3757L4.25271 5.99643C4.29809 5.84187 4.38163 5.70121 4.49563 5.5874L8.8226 1.25995Z" stroke={color} strokeWidth="0.96" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Default graph (login state) — Figma node 630:21585 ──────────────────────
// Hourly intraday data: 12:00 PM – 7:00 PM (5-min intervals)
// Matches the Figma design: blue actual, blue expected (no gaps), green dashed ±2SD, light-blue bands

const DEFAULT_EXPECTED_BASE = 1_600_000;
const DEFAULT_SD_BASE = 230_000;

function buildHourlyData() {
  type RawPoint = {
    time: string;
    actual: number | null;    // null = system failure; line breaks here
    failureDot: number | null; // 0 at one point per null run for the dot marker
    expected: number;
    sd2Upper: number; sd2Lower: number;
    sd1Upper: number; sd1Lower: number;
    bandOuterBase: number; bandOuterHeight: number;
    bandInnerBase: number; bandInnerHeight: number;
  };
  const points: RawPoint[] = [];

  // 12:00 PM to 7:00 PM → 420 minutes, every 5 min = 85 points
  for (let m = 0; m <= 420; m += 5) {
    const hour = 12 + Math.floor(m / 60);
    const min  = m % 60;
    const h12  = hour > 12 ? hour - 12 : hour;
    const label = `${h12}:${String(min).padStart(2, '0')} PM`;

    // Gentle rising arc peaking ~3:00 PM then falling
    const t   = m / 420;
    const arc = Math.sin(t * Math.PI);
    const exp = DEFAULT_EXPECTED_BASE + arc * 320_000;

    const sd = DEFAULT_SD_BASE + m * 100;

    // Actual: expected + noise, with null gaps for system outage segments
    const noise = Math.sin(m * 0.18 + 1.3) * 180_000 + Math.cos(m * 0.09) * 80_000;
    const isNull =
      (m >= 5   && m <= 10)  ||
      m === 25               ||
      (m >= 105 && m <= 115) ||
      (m >= 210 && m <= 230) ||
      (m >= 305 && m <= 315) ||
      m === 385;

    const actual = isNull ? null : Math.max(0, Math.round(exp + noise));

    const sd2U = Math.round(exp + 2 * sd);
    const sd2L = Math.max(0, Math.round(exp - 2 * sd));
    const sd1U = Math.round(exp + sd);
    const sd1L = Math.max(0, Math.round(exp - sd));

    points.push({
      time: label,
      actual,
      failureDot: null, // filled in below
      expected: Math.round(exp),
      sd2Upper: sd2U, sd2Lower: sd2L,
      sd1Upper: sd1U, sd1Lower: sd1L,
      bandOuterBase: sd2L, bandOuterHeight: sd2U - sd2L,
      bandInnerBase: sd1L, bandInnerHeight: sd1U - sd1L,
    });
  }

  // Place failureDot=0 (x-axis) at the point just before and just after each null run
  const n = points.length;
  let i = 0;
  while (i < n) {
    if (points[i].actual !== null) { i++; continue; }
    let runEnd = i;
    while (runEnd < n && points[runEnd].actual === null) runEnd++;
    // point just before the gap
    if (i > 0) points[i - 1].failureDot = 0;
    // point just after the gap
    if (runEnd < n) points[runEnd].failureDot = 0;
    i = runEnd;
  }

  return points;
}

// Compute contiguous null runs from hourly data as outage regions { x1, x2 }
function hourlyOutageRegions(data: ReturnType<typeof buildHourlyData>) {
  const regions: { x1: string; x2: string }[] = [];
  let start: string | null = null;
  let last: string | null = null;
  for (const p of data) {
    if (p.actual === null) {
      if (start === null) start = p.time;
      last = p.time;
    } else {
      if (start !== null && last !== null) {
        regions.push({ x1: start, x2: last });
        start = null;
        last = null;
      }
    }
  }
  if (start !== null && last !== null) regions.push({ x1: start, x2: last });
  return regions;
}

const hourlyData = buildHourlyData();
const outageRegions = hourlyOutageRegions(hourlyData);

// Today's date formatted as M/D/YYYY for the tooltip header
const TODAY_LABEL = (() => {
  const n = new Date();
  return `${n.getMonth() + 1}/${n.getDate()}/${n.getFullYear()}`;
})();

function DefaultTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  const fmtGP = (v: number | null) =>
    v === null
      ? (d.failureDot === 0 ? '0 Getpages' : 'System failure')
      : `${v.toLocaleString()} Getpages`;

  const sdRange = `${d.sd2Lower.toLocaleString()} - ${d.sd2Upper.toLocaleString()}`;

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 4,
        boxShadow: '0px 4px 10px rgba(0,0,0,0.25)',
        padding: '4px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        fontSize: 13,
        lineHeight: '19.5px',
        letterSpacing: '-0.325px',
        whiteSpace: 'nowrap',
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      {/* Header: date + time */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, fontWeight: 500, color: '#000000' }}>
        <span>{TODAY_LABEL}</span>
        <span>{d.time}</span>
      </div>
      {/* Actual */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
        <span style={{ color: '#000000' }}>Actual</span>
        <span style={{ color: d.actual === null ? '#da1e28' : '#6f6f6f', fontWeight: d.actual === null ? 600 : 400 }}>
          {fmtGP(d.actual)}
        </span>
      </div>
      {/* Expected */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
        <span style={{ color: '#000000' }}>Expected</span>
        <span style={{ color: '#6f6f6f' }}>{fmtGP(d.expected)}</span>
      </div>
      {/* ±2 SD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
        <span style={{ color: '#000000' }}>+/-2 SD</span>
        <span style={{ color: '#6f6f6f' }}>{sdRange}</span>
      </div>
    </div>
  );
}

const fmtDefaultY = (v: number) => {
  if (v === 0) return '0k';
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  return `${(v / 1_000).toFixed(0)}k`;
};

function DefaultGraph({ zoomRange }: { zoomRange: [number, number] }) {
  const visibleData = hourlyData.slice(zoomRange[0], zoomRange[1] + 1);

  const xTick = ({ x, y, payload }: any) => {
    // Only render whole-hour ticks: "12:00 PM", "1:00 PM" … "7:00 PM"
    if (!payload.value.endsWith(':00 PM')) return <g />;
    return (
      <text x={x} y={y + 10} textAnchor="middle" fontSize={10} fontFamily="'IBM Plex Sans', sans-serif" fill="#6b7280">
        {payload.value}
      </text>
    );
  };

  const yTick = ({ x, y, payload }: any) => (
    <text x={x - 4} y={y} textAnchor="end" dominantBaseline="middle" fontSize={10} fontFamily="Inter, sans-serif" fill="#6b7280">
      {fmtDefaultY(payload.value)}
    </text>
  );

  const visibleOutageRegions = hourlyOutageRegions(visibleData);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={visibleData} margin={{ top: 10, right: 16, left: 48, bottom: 24 }}>
        <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#e5e7eb" strokeOpacity={0.8} />

        <XAxis
          dataKey="time"
          tick={xTick}
          interval={0}
          axisLine={{ stroke: '#e5e7eb' }}
          tickLine={false}
          height={32}
        />
        <YAxis
          tick={yTick}
          width={48}
          domain={[0, 2_800_000]}
          ticks={[0, 200_000, 400_000, 600_000, 800_000, 1_000_000, 1_200_000, 1_400_000, 1_600_000, 1_800_000, 2_000_000, 2_200_000, 2_400_000, 2_600_000, 2_800_000]}
          axisLine={false}
          tickLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
        />
        <Tooltip
          content={<DefaultTooltip />}
          cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 2' }}
        />

        <ReferenceLine y={0} stroke="#d1d5db" strokeWidth={1} />

        {/* ±2 SD outer band — light blue fill */}
        <Area name="band-outer-base" dataKey="bandOuterBase" stackId="dg-outer" stroke="none" fill="#ffffff" fillOpacity={0.6} legendType="none" isAnimationActive={false} />
        <Area name="band-outer-fill" dataKey="bandOuterHeight" stackId="dg-outer" stroke="none" fill="#dbeafe" fillOpacity={0.85} legendType="none" isAnimationActive={false} />

        {/* +2 SD upper boundary — red dashed */}
        <Line name="sd2-upper" dataKey="sd2Upper" stroke="#da1e28" strokeWidth={1} strokeDasharray="5 3" dot={false} activeDot={false} legendType="none" isAnimationActive={false} type="linear" />
        {/* -2 SD lower boundary — green dashed */}
        <Line name="sd2-lower" dataKey="sd2Lower" stroke="#15803d" strokeWidth={1} strokeDasharray="5 3" dot={false} activeDot={false} legendType="none" isAnimationActive={false} type="linear" />

        {/* Expected — yellow solid, always connected (no gaps) */}
        <Line name="expected" dataKey="expected" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={false} legendType="none" isAnimationActive={false} type="monotone" connectNulls />

        {/* Actual — red line, breaks cleanly at each failure gap */}
        <Line
          dataKey="actual"
          stroke="#0056e1"
          strokeWidth={2}
          legendType="none"
          isAnimationActive={false}
          type="linear"
          connectNulls={false}
          dot={false}
          activeDot={{ r: 4, fill: '#4b5563', stroke: '#ffffff', strokeWidth: 1.5 }}
        />

        {/* System failure bands */}
        {visibleOutageRegions.map((r, i) => (
          <ReferenceArea
            key={`outage-${i}`}
            x1={r.x1}
            x2={r.x2}
            fill="#fca5a5"
            fillOpacity={0.35}
            stroke="none"
          />
        ))}

        {/* Failure dots — rendered after bands so they appear on top */}
        <Line
          dataKey="failureDot"
          stroke="none"
          legendType="none"
          isAnimationActive={false}
          connectNulls={false}
          activeDot={(props: any) => {
            const { cx, cy, payload } = props;
            if (payload?.failureDot === null || cx == null || cy == null) return <g />;
            return <circle cx={cx} cy={cy} r={5} fill="#0056e1" stroke="#ffffff" strokeWidth={1.5} />;
          }}
          dot={(props: any) => {
            const { cx, cy, payload } = props;
            if (payload?.failureDot === null || cx == null || cy == null) return <g />;
            return (
              <circle
                key={`fd-${cx}`}
                cx={cx}
                cy={cy}
                r={4}
                fill="#0056e1"
                stroke="#0056e1"
                strokeWidth={0}
              />
            );
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}


// ─── Year graph (Current Year selection) — Figma node 746:16221 ──────────────
// Daily data: Aug 4 2025 – Aug 3 2026 (365 days)
// Dense daily points give a fragmented, realistic look; zoom reveals per-day detail.

const YEAR_EXPECTED_BASE = 1_700_000;
const YEAR_SD_BASE = 320_000;

// Current year: Jan 1 → today (dynamic)
const _YEAR_ANCHOR = new Date(new Date().getFullYear(), 0, 1); // Jan 1 of current year
const _YEAR_TODAY  = new Date();
// Total days inclusive: day 0 = Jan 1, last day = today
const _YEAR_TOTAL  = Math.floor(
  (_YEAR_TODAY.getTime() - _YEAR_ANCHOR.getTime()) / 86400000
) + 1;

// Outage windows as [startDay, endDay] inclusive (0-based from Jan 1 of current year).
// Spread across ~240 days (Jan–Aug), mix of wide and narrow, well spaced.
const YEAR_OUTAGE_WINDOWS: [number, number][] = [
  [12,  14],  // narrow – mid Jan
  [38,  43],  // wide   – early Feb
  [71,  72],  // narrow – mid Mar
  [95, 101],  // wide   – early Apr
  [128, 129], // narrow – early May
  [152, 157], // wide   – early Jun
  [183, 184], // narrow – early Jul
  [205, 210], // wide   – late Jul
  [228, 229], // narrow – mid Aug
];

// Build a Set for O(1) lookup
const OUTAGE_DAY_SET = new Set<number>();
for (const [s, e] of YEAR_OUTAGE_WINDOWS) {
  for (let d = s; d <= e; d++) OUTAGE_DAY_SET.add(d);
}

function buildYearData() {
  type YearPoint = {
    date: string;
    weekStart: string;
    monthLabel: string;       // e.g. "Jan '26" — used in tooltip
    axisMonth: string | null; // "M/YYYY" on the 1st of each month, null otherwise
    actual: number | null;
    failureDot: number | null;
    expected: number;
    sd2Upper: number;
    sd2Lower: number;
    bandOuterBase: number;
    bandOuterHeight: number;
  };

  const points: YearPoint[] = [];
  const ANCHOR    = _YEAR_ANCHOR;
  const TOTAL_DAYS = _YEAR_TOTAL;

  for (let day = 0; day < TOTAL_DAYS; day++) {
    const d = new Date(ANCHOR.getFullYear(), ANCHOR.getMonth(), ANCHOR.getDate() + day);

    const monthLabel = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      .replace(' ', " '"); // e.g. "Jan '26"

    // axisMonth: "M/YYYY" only on the 1st day of each calendar month
    const axisMonth = d.getDate() === 1 ? `${d.getMonth() + 1}/${d.getFullYear()}` : null;

    const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const t = day / Math.max(1, TOTAL_DAYS - 1);
    const expectedCurve = YEAR_EXPECTED_BASE
      + Math.sin(t * Math.PI * 0.6) * 200_000
      + t * 100_000;
    const expected = Math.round(expectedCurve);

    const sd = YEAR_SD_BASE + day * 60;
    const sd2U = Math.round(expected + 2 * sd);
    const sd2L = Math.max(0, Math.round(expected - 2 * sd));

    const noise = Math.sin(day * 0.31 + 1.3) * 340_000
                + Math.cos(day * 0.17 + 0.8) * 160_000
                + Math.sin(day * 0.07 + 2.1) * 80_000;

    const isOutage = OUTAGE_DAY_SET.has(day);
    const actual = isOutage ? null : Math.max(0, Math.round(expected + noise));

    points.push({
      date: dateLabel,
      weekStart: dateLabel,
      monthLabel,
      axisMonth,
      actual,
      failureDot: null,
      expected,
      sd2Upper: sd2U,
      sd2Lower: sd2L,
      bandOuterBase: sd2L,
      bandOuterHeight: sd2U - sd2L,
    });
  }

  // Annotation dots — irregular positions across the full range, not evenly spaced
  const DOT_DAYS = [3, 19, 32, 51, 63, 84, 92, 107, 118, 135, 147, 161, 172, 188, 200, 214, 224, 233];
  for (const day of DOT_DAYS) {
    if (day < points.length && points[day].actual !== null) {
      points[day].failureDot = 0;
    }
  }

  return points;
}

const yearData = buildYearData();

function YearTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  const fmtGP = (v: number | null) =>
    v === null
      ? 'No data'
      : `${v.toLocaleString()} Getpages`;
  // Failure-dot points sit at the x-axis (y=0) — show 0 Getpages for Current
  const currentLabel = d.failureDot === 0 ? '0 Getpages' : fmtGP(d.actual);
  const isSystemFailure = d.actual === null && d.failureDot !== 0;
  const sdRange = `${d.sd2Lower.toLocaleString()} - ${d.sd2Upper.toLocaleString()}`;

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 4,
        boxShadow: '0px 4px 10px rgba(0,0,0,0.25)',
        padding: '4px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        fontSize: 13,
        lineHeight: '19.5px',
        letterSpacing: '-0.325px',
        whiteSpace: 'nowrap',
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, fontWeight: 500, color: '#000000' }}>
        <span>{d.weekStart ?? d.monthLabel}</span>
        <span style={{ color: '#6b7280', fontWeight: 400, fontSize: 11 }}>
          {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
        <span style={{ color: '#000000' }}>Current</span>
        <span style={{ color: isSystemFailure ? '#da1e28' : '#6f6f6f', fontWeight: isSystemFailure ? 600 : 400 }}>
          {isSystemFailure ? 'System failure' : currentLabel}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
        <span style={{ color: '#000000' }}>Expected</span>
        <span style={{ color: '#6f6f6f' }}>{fmtGP(d.expected)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
        <span style={{ color: '#000000' }}>+/-2 SD</span>
        <span style={{ color: '#6f6f6f' }}>{sdRange}</span>
      </div>
    </div>
  );
}

const fmtYearY = (v: number) => {
  if (v === 0) return '0k';
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  return `${(v / 1_000).toFixed(0)}k`;
};

// ─── Zoom/pan bar ─────────────────────────────────────────────────────────────
// Generic — works for both hourlyData and yearData via a normalised ZoomItem shape
interface ZoomItem {
  label: string;       // displayed at ends of the axis
  value: number;       // bar height
  isOutage: boolean;   // colour outage bars pink
}

function ZoomBar({
  items,
  zoomRange,
  onZoomChange,
}: {
  items: ZoomItem[];
  zoomRange: [number, number];
  onZoomChange: (r: [number, number]) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    type: 'left' | 'right' | 'pan';
    startX: number;
    startRange: [number, number];
  } | null>(null);

  const n = items.length;
  const [si, ei] = zoomRange;
  const lPct = (si / (n - 1)) * 100;
  const rPct = (ei / (n - 1)) * 100;

  const maxVal = Math.max(1, ...items.map(d => d.value));

  const startDrag = useCallback(
    (type: 'left' | 'right' | 'pan') => (ev: React.MouseEvent) => {
      ev.preventDefault();
      dragState.current = { type, startX: ev.clientX, startRange: [si, ei] };
    },
    [si, ei],
  );

  useEffect(() => {
    const onMove = (ev: MouseEvent) => {
      const ds = dragState.current;
      if (!ds || !containerRef.current) return;
      const w = containerRef.current.getBoundingClientRect().width;
      const dIdx = Math.round(((ev.clientX - ds.startX) / w) * (n - 1));
      const [os, oe] = ds.startRange;
      if (ds.type === 'left') {
        onZoomChange([Math.max(0, Math.min(os + dIdx, oe - 1)), oe]);
      } else if (ds.type === 'right') {
        onZoomChange([os, Math.max(os + 1, Math.min(oe + dIdx, n - 1))]);
      } else {
        const span = oe - os;
        const ns = Math.max(0, Math.min(os + dIdx, n - 1 - span));
        onZoomChange([ns, ns + span]);
      }
    };
    const onUp = () => { dragState.current = null; };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [n, onZoomChange]);

  return (
    <div className="w-full mt-2 pl-[48px] pr-[16px]" style={{ userSelect: 'none' }}>
      {/* Label row */}
      <div className="w-full flex items-center justify-between mb-1">
        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-medium">
          Zoom · drag handles or band to pan
        </span>
        <span className="text-[9px] text-[#4178be] font-medium">
          {items[si]?.label} – {items[ei]?.label}&nbsp;·&nbsp;{ei - si + 1} of {n}
        </span>
      </div>

      {/* Track */}
      <div ref={containerRef} className="relative w-full h-[48px] rounded border border-gray-200 bg-gray-50 overflow-hidden">
        {/* Mini bar silhouette */}
        <div className="absolute inset-0 flex items-end">
          {items.map((d, i) => {
            const h = Math.max(2, Math.round((d.value / maxVal) * 42));
            const inSel = i >= si && i <= ei;
            const col = d.isOutage ? '#fca5a5' : inSel ? '#4178be' : '#d1d5db';
            return (
              <div key={i} className="flex-1 flex items-end" style={{ minWidth: 1 }}>
                <div style={{ height: h, width: '100%', backgroundColor: col, opacity: inSel ? 1 : 0.45 }} />
              </div>
            );
          })}
        </div>

        {/* Dim overlay — left unselected */}
        <div className="absolute inset-y-0 left-0 bg-white/55 pointer-events-none" style={{ width: `${lPct}%` }} />
        {/* Dim overlay — right unselected */}
        <div className="absolute inset-y-0 right-0 bg-white/55 pointer-events-none" style={{ width: `${100 - rPct}%` }} />

        {/* Selection band — drag to pan */}
        <div
          className="absolute inset-y-0 border-2 border-[#4178be] rounded cursor-grab active:cursor-grabbing"
          style={{ left: `${lPct}%`, width: `${rPct - lPct}%` }}
          onMouseDown={startDrag('pan')}
        />

        {/* Left resize handle */}
        <div
          className="absolute inset-y-0 flex items-center justify-center cursor-ew-resize z-10"
          style={{ left: `${lPct}%`, width: 14, marginLeft: -7 }}
          onMouseDown={startDrag('left')}
        >
          <div className="w-[3px] h-7 rounded-full bg-[#4178be] shadow-sm" />
        </div>

        {/* Right resize handle */}
        <div
          className="absolute inset-y-0 flex items-center justify-center cursor-ew-resize z-10"
          style={{ left: `${rPct}%`, width: 14, marginLeft: -7 }}
          onMouseDown={startDrag('right')}
        >
          <div className="w-[3px] h-7 rounded-full bg-[#4178be] shadow-sm" />
        </div>
      </div>

      {/* Full-range axis labels */}
      <div className="relative w-full h-4 mt-0.5 text-[8px] text-gray-400 select-none">
        <span className="absolute left-0">{items[0]?.label}</span>
        <span className="absolute right-0">{items[n - 1]?.label}</span>
      </div>
    </div>
  );
}

// ─── Year graph (with zoom support) ──────────────────────────────────────────
function YearGraph({ zoomRange, onZoomChange }: {
  zoomRange: [number, number];
  onZoomChange: (r: [number, number]) => void;
}) {
  const visibleData = yearData.slice(zoomRange[0], zoomRange[1] + 1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const xTick = ({ x, y, payload }: any) => {
    // Only render on the 1st of each calendar month (axisMonth is non-null)
    const point = visibleData.find(p => p.date === payload.value);
    if (!point?.axisMonth) return <g />;
    return (
      <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fontFamily="'IBM Plex Sans', sans-serif" fill="#6b7280">
        {point.axisMonth}
      </text>
    );
  };

  const yTick = ({ x, y, payload }: any) => (
    <text x={x - 4} y={y} textAnchor="end" dominantBaseline="middle" fontSize={10} fontFamily="'IBM Plex Sans', sans-serif" fill="#6b7280">
      {fmtYearY(payload.value)}
    </text>
  );

  // Derive outage regions directly from null actual values in the visible slice.
  // This ensures red bands precisely match where the line breaks.
  type Region = { x1: string; x2: string };
  const outageRegions: Region[] = [];
  let regionStart: string | null = null;
  let regionLast: string | null = null;
  for (let i = 0; i < visibleData.length; i++) {
    const p = visibleData[i];
    if (p.actual === null) {
      if (regionStart === null) regionStart = p.date;
      regionLast = p.date;
    } else {
      if (regionStart !== null && regionLast !== null) {
        outageRegions.push({ x1: regionStart, x2: regionLast });
        regionStart = null;
        regionLast = null;
      }
    }
  }
  if (regionStart !== null && regionLast !== null) {
    outageRegions.push({ x1: regionStart, x2: regionLast });
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={visibleData}
        margin={{ top: 10, right: 16, left: 48, bottom: 28 }}
        onMouseMove={(state: any) => {
          if (state.activeTooltipIndex != null) setHoveredIndex(state.activeTooltipIndex);
        }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#e5e7eb" strokeOpacity={0.8} />

        <XAxis
          dataKey="date"
          tick={xTick}
          interval={0}
          axisLine={{ stroke: '#e5e7eb' }}
          tickLine={false}
          height={36}
        />
        <YAxis
          tick={yTick}
          width={52}
          domain={[0, 2_800_000]}
          ticks={[0, 200_000, 400_000, 600_000, 800_000, 1_000_000, 1_200_000, 1_400_000, 1_600_000, 1_800_000, 2_000_000, 2_200_000, 2_400_000, 2_600_000, 2_800_000]}
          axisLine={false}
          tickLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
        />
        <Tooltip
          isAnimationActive={false}
          cursor={{ stroke: '#0056e1', strokeWidth: 1, strokeDasharray: '4 2' }}
          active={hoveredIndex !== null}
          payload={hoveredIndex !== null ? [{ payload: visibleData[hoveredIndex] }] : []}
          content={<YearTooltip />}
        />

        <ReferenceLine y={0} stroke="#d1d5db" strokeWidth={1} />

        {/* ±2 SD outer band — light blue fill (behind lines) */}
        <Area name="band-outer-base" dataKey="bandOuterBase" stackId="yr-outer" stroke="none" fill="#ffffff" fillOpacity={0.6} legendType="none" isAnimationActive={false} />
        <Area name="band-outer-fill" dataKey="bandOuterHeight" stackId="yr-outer" stroke="none" fill="#dbeafe" fillOpacity={0.85} legendType="none" isAnimationActive={false} />

        {/* +2 SD upper boundary — red dashed */}
        <Line name="sd2-upper" dataKey="sd2Upper" stroke="#da1e28" strokeWidth={1} strokeDasharray="5 3" dot={false} activeDot={false} legendType="none" isAnimationActive={false} type="monotone" connectNulls />
        {/* -2 SD lower boundary — green dashed */}
        <Line name="sd2-lower" dataKey="sd2Lower" stroke="#15803d" strokeWidth={1} strokeDasharray="5 3" dot={false} activeDot={false} legendType="none" isAnimationActive={false} type="monotone" connectNulls />

        {/* Expected — yellow solid, always connected (no gaps) */}
        <Line name="expected" dataKey="expected" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={false} legendType="none" isAnimationActive={false} type="monotone" connectNulls />

        {/* Actual — blue line, breaks cleanly at each outage gap */}
        <Line
          dataKey="actual"
          stroke="#0056e1"
          strokeWidth={2}
          legendType="none"
          isAnimationActive={false}
          type="monotone"
          connectNulls={false}
          dot={false}
          activeDot={{ r: 4, fill: '#4b5563', stroke: '#ffffff', strokeWidth: 1.5 }}
        />

        {/* Failure dots — boundary markers at gap edges */}
        <Line
          dataKey="failureDot"
          stroke="none"
          legendType="none"
          isAnimationActive={false}
          connectNulls={false}
          activeDot={(props: any) => {
            const { cx, cy, payload } = props;
            if (payload?.failureDot === null || cx == null || cy == null) return <g />;
            return <circle cx={cx} cy={cy} r={5} fill="#0056e1" stroke="#ffffff" strokeWidth={1.5} />;
          }}
          dot={(props: any) => {
            const { cx, cy, payload } = props;
            if (payload?.failureDot === null || cx == null || cy == null) return <g />;
            return (
              <circle
                key={`yfd-${cx}`}
                cx={cx}
                cy={cy}
                r={4}
                fill="#0056e1"
                stroke="#0056e1"
                strokeWidth={0}
              />
            );
          }}
        />

        {/* Outage bands — rendered LAST so they paint over all lines */}
        {outageRegions.map((r, i) => (
          <ReferenceArea
            key={`outage-${i}`}
            x1={r.x1}
            x2={r.x2}
            fill="#fca5a5"
            fillOpacity={0.45}
            stroke="#f87171"
            strokeWidth={0.5}
            strokeOpacity={0.6}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}


// ─── Daily graph (Current Week / Previous Week / Current Month) ───────────────
// Generates one point per calendar day between startDate and endDate (inclusive).

function buildDailyData(startDate: Date, endDate: Date) {
  const EXPECTED_BASE = 1_600_000;
  const SD_BASE = 230_000;
  const points: {
    date: string;
    actual: number | null;
    failureDot: number | null;
    expected: number;
    sd2Upper: number; sd2Lower: number;
    bandOuterBase: number; bandOuterHeight: number;
  }[] = [];

  let day = 0;
  const cur = new Date(startDate);
  while (cur <= endDate) {
    // M/D format (e.g. "8/18")
    const mLabel = `${cur.getMonth() + 1}/${cur.getDate()}`;

    const t = day / Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 86400000));
    const arc = Math.sin(t * Math.PI);
    const exp = EXPECTED_BASE + arc * 300_000;
    const sd = SD_BASE + day * 800;
    const noise = Math.sin(day * 0.6 + 1.3) * 220_000 + Math.cos(day * 0.35) * 90_000;
    const sd2U = Math.round(exp + 2 * sd);
    const sd2L = Math.max(0, Math.round(exp - 2 * sd));

    points.push({
      date: mLabel,
      actual: Math.max(0, Math.round(exp + noise)),
      failureDot: null,
      expected: Math.round(exp),
      sd2Upper: sd2U, sd2Lower: sd2L,
      bandOuterBase: sd2L, bandOuterHeight: sd2U - sd2L,
    });

    cur.setDate(cur.getDate() + 1);
    day++;
  }
  return points;
}

function DailyGraph({ data, zoomRange }: { data: ReturnType<typeof buildDailyData>; zoomRange: [number, number] }) {
  const visibleData = data.slice(zoomRange[0], zoomRange[1] + 1);

  const xTick = ({ x, y, payload }: any) => (
    <text x={x} y={y + 10} textAnchor="middle" fontSize={10} fontFamily="'IBM Plex Sans', sans-serif" fill="#6b7280">
      {payload.value}
    </text>
  );

  const yTick = ({ x, y, payload }: any) => (
    <text x={x - 4} y={y} textAnchor="end" dominantBaseline="middle" fontSize={10} fontFamily="'IBM Plex Sans', sans-serif" fill="#6b7280">
      {fmtDefaultY(payload.value)}
    </text>
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={visibleData} margin={{ top: 10, right: 16, left: 48, bottom: 24 }}>
        <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#e5e7eb" strokeOpacity={0.8} />
        <XAxis
          dataKey="date"
          tick={xTick}
          interval={0}
          axisLine={{ stroke: '#e5e7eb' }}
          tickLine={false}
          height={32}
        />
        <YAxis
          tick={yTick}
          width={48}
          domain={[0, 2_800_000]}
          ticks={[0, 400_000, 800_000, 1_200_000, 1_600_000, 2_000_000, 2_400_000, 2_800_000]}
          axisLine={false}
          tickLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
        />
        <Tooltip
          content={<DefaultTooltip />}
          cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 2' }}
        />
        <ReferenceLine y={0} stroke="#d1d5db" strokeWidth={1} />
        <Area name="band-outer-base" dataKey="bandOuterBase" stackId="dg-outer" stroke="none" fill="#ffffff" fillOpacity={0.6} legendType="none" isAnimationActive={false} />
        <Area name="band-outer-fill" dataKey="bandOuterHeight" stackId="dg-outer" stroke="none" fill="#dbeafe" fillOpacity={0.85} legendType="none" isAnimationActive={false} />
        <Line name="sd2-upper" dataKey="sd2Upper" stroke="#da1e28" strokeWidth={1} strokeDasharray="5 3" dot={false} activeDot={false} legendType="none" isAnimationActive={false} type="linear" />
        <Line name="sd2-lower" dataKey="sd2Lower" stroke="#15803d" strokeWidth={1} strokeDasharray="5 3" dot={false} activeDot={false} legendType="none" isAnimationActive={false} type="linear" />
        <Line name="expected" dataKey="expected" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={false} legendType="none" isAnimationActive={false} type="monotone" connectNulls />
        <Line
          dataKey="actual"
          stroke="#0056e1"
          strokeWidth={2}
          legendType="none"
          isAnimationActive={false}
          type="linear"
          connectNulls={false}
          dot={false}
          activeDot={{ r: 4, fill: '#4b5563', stroke: '#ffffff', strokeWidth: 1.5 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}


// ─── Getpages time-series data (daily, 90 days) ───────────────────────────────
const EXPECTED_BASE = 2_080_000;
const SD_BASE = 200_000;
const TOTAL_DAYS = 90;

function buildLineData(startDateStr: string, seed: number) {
  const start = new Date(startDateStr);
  return Array.from({ length: TOTAL_DAYS }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);                          // daily cadence
    const label = d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
    const exp = EXPECTED_BASE - i * 1100 + Math.sin(i / 10 + seed) * 130000;
    const sd = SD_BASE + i * 400;
    const noise = Math.sin(i * 0.8 + seed * 1.3) * 120000 + Math.cos(i * 0.5 + seed) * 70000;
    const actual = Math.round(exp + noise);
    const sd2U = Math.round(exp + 2 * sd);
    const sd2L = Math.round(Math.max(50000, exp - 2 * sd));
    const sd1U = Math.round(exp + sd);
    const sd1L = Math.round(Math.max(50000, exp - sd));
    return {
      date: label,
      actual,
      expected: Math.round(exp),
      sd2Upper: sd2U, sd2Lower: sd2L,
      sd1Upper: sd1U, sd1Lower: sd1L,
      bandOuterBase: sd2L, bandOuterHeight: sd2U - sd2L,
      bandInnerBase: sd1L, bandInnerHeight: sd1U - sd1L,
    };
  });
}

// ─── Extreme gap scenario (~70% of days affected) ────────────────────────────
// Mirrors a heavy filtering selection: M-F 9a-2p + 4p-8p included,
// every 3rd Tue/Wed excluded, plus 5 outage windows across the 90-day span.
type GapType = 'zero' | 'outage' | 'filtered' | null;

const GAP_MAP: Record<number, GapType> = {
  // ── zeros: isolated days where the system reported exactly 0 (21 days) ──
  1:'zero', 4:'zero', 9:'zero', 13:'zero', 17:'zero', 20:'zero',
  25:'zero', 28:'zero', 34:'zero', 38:'zero', 40:'zero',
  46:'zero', 51:'zero', 55:'zero', 58:'zero', 61:'zero',
  66:'zero', 70:'zero', 74:'zero', 80:'zero', 86:'zero',

  // ── outages: collector down, no telemetry (5 clusters = 22 days) ──
  // cluster 1: days 6–9
  6:'outage', 7:'outage', 8:'outage',
  // cluster 2: days 18–23
  18:'outage', 19:'outage', 21:'outage', 22:'outage', 23:'outage',
  // cluster 3: days 35–40
  35:'outage', 36:'outage', 37:'outage', 39:'outage',
  // cluster 4: days 56–62
  56:'outage', 57:'outage', 59:'outage', 60:'outage', 62:'outage',
  // cluster 5: days 77–83
  77:'outage', 78:'outage', 79:'outage', 81:'outage', 82:'outage', 83:'outage',

  // ── filtered: data exists but excluded by time rules (5 windows = 27 days) ──
  // window 1: days 10–15 (first Tue/Wed exclusion block)
  10:'filtered', 11:'filtered', 12:'filtered', 14:'filtered', 15:'filtered', 16:'filtered',
  // window 2: days 26–32
  26:'filtered', 27:'filtered', 29:'filtered', 30:'filtered', 31:'filtered', 32:'filtered',
  // window 3: days 43–48
  43:'filtered', 44:'filtered', 45:'filtered', 47:'filtered', 48:'filtered',
  // window 4: days 63–69
  63:'filtered', 64:'filtered', 65:'filtered', 67:'filtered', 68:'filtered', 69:'filtered',
  // window 5: days 84–89
  84:'filtered', 85:'filtered', 87:'filtered', 88:'filtered', 89:'filtered',
};

function applyGaps(data: ReturnType<typeof buildLineData>) {
  return data.map((p, i) => {
    const gt = GAP_MAP[i] ?? null;
    if (gt === 'zero')    return { ...p, actual: 0, gapType: gt };
    if (gt === 'outage')  return { ...p, actual: null as unknown as number, gapType: gt };
    if (gt === 'filtered') return { ...p, actual: null as unknown as number, gapType: gt };
    return { ...p, gapType: null as GapType };
  });
}

// Compute contiguous regions for overlay shading
function gapRegions(data: ReturnType<typeof applyGaps>, type: GapType) {
  const regions: { x1: string; x2: string }[] = [];
  let start: string | null = null;
  data.forEach((p, i) => {
    if (p.gapType === type) {
      if (!start) start = p.date;
      if (i === data.length - 1 || data[i + 1]?.gapType !== type) {
        regions.push({ x1: start, x2: p.date });
        start = null;
      }
    }
  });
  return regions;
}

const lineChartData = applyGaps(buildLineData('2024-06-22', 0.7));
const comparisonLineData = buildLineData('2023-06-22', 1.9).map(p => ({ ...p, gapType: null as GapType }));
// outageRegions not used in chart (outages render as bare line gaps)
const filteredRegions = gapRegions(lineChartData, 'filtered');

// ─── Thumbnails / nav trees ──────────────────────────────────────────────────
const reportThumbnails = [
  { id: 'transport-class', label: 'Transport Class', active: false },
  { id: 'maxmsg-1', label: 'MAXMSG', active: true, highlighted: true },
  { id: 'maxmsg-2', label: 'MAXMSG', active: false },
  { id: 'paths', label: 'Paths', active: false },
  { id: 'messages', label: 'Messages', active: false },
  { id: 'rejected-req', label: 'Rejected Req', active: false },
  { id: 'path-busy', label: 'Path Busy', active: false },
  { id: 'big-msgs', label: 'Big Msgs', active: false },
  { id: 'small-msgs', label: 'Small Msgs', active: false },
  { id: 'oversized-msgs', label: 'Oversized Msgs', active: false },
];

const navigationTree = [
  { id: 'tel', label: 'TEL', expandable: true, level: 0 },
  { id: 'workshop', label: 'Workshop', expandable: true, level: 0 },
  { id: 'wsc', label: 'WSC', expandable: true, level: 0 },
  { id: 'wsc-db2', label: 'WSC Db2 Health Check', expandable: true, level: 0 },
  { id: 'wsc-mq', label: 'WSC MQ Health Check', expandable: true, level: 0 },
  { id: 'zacademy', label: 'zAcademy', expandable: true, level: 0 },
  { id: 'ungrouped', label: 'Ungrouped', expandable: true, level: 0 },
];

const reportItems = [
  { id: 'health', label: 'Health and Overview', expandable: true },
  { id: 'applications', label: 'Applications', expandable: true },
  { id: 'disk', label: 'Disk Storage', expandable: true },
  { id: 'systems', label: 'Systems', expandable: true },
];

const xcfSubItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'usage-by-system', label: 'Usage by System', active: true },
  { id: 'inbound-data', label: 'Inbound Data' },
  { id: 'outbound-data', label: 'Outbound Data' },
  { id: 'path-bucket', label: 'Path and Bucket Analysis' },
  { id: 'path-usage', label: 'Path Usage' },
  { id: 'members', label: 'Members' },
];

const bottomNavItems = [
  { id: 'rating', label: 'Rating by Time', expandable: true },
  { id: 'zos-connect', label: 'z/OS Connect', expandable: true },
  { id: 'db2', label: 'Db2', expandable: true },
  { id: 'cics', label: 'CICS', expandable: true },
  { id: 'tcpip', label: 'TCP/IP', expandable: true },
  { id: 'mq', label: 'MQ', expandable: true },
];

// ─── Custom tooltip ──────────────────────────────────────────────────────────
function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const isBelow2SD = d.actual < d.sd2Lower;
  const isAbove2SD = d.actual > d.sd2Upper;
  const anomaly = isBelow2SD || isAbove2SD;
  return (
    <div
      className="bg-white border border-gray-400 rounded shadow-xl"
      style={{ minWidth: 220, fontSize: 12, lineHeight: 1.6 }}
    >
      <div className="px-3 py-1.5 bg-gray-700 text-white rounded-t font-semibold text-[11px]">
        {d.date}
      </div>
      <div className="px-3 py-2 space-y-0.5">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Expected value</span>
          <span className="font-medium text-gray-900">{d.expected.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Current</span>
          <span style={{ fontWeight: 600, color: d.actual === null ? '#da1e28' : '#111827' }}>
            {d.actual === null ? 'System failure' : d.actual === 0 ? '0 Getpages' : `${d.actual.toLocaleString()} Getpages`}
          </span>
        </div>
        <div className="border-t border-gray-100 pt-1 mt-1">
          <div className="text-gray-400 text-[10px] mb-0.5">±2 std dev range</div>
          <div className="text-gray-700">
            {d.sd2Lower.toLocaleString()} &ndash; {d.sd2Upper.toLocaleString()}
          </div>
        </div>
        {anomaly && (
          <div className="text-orange-600 text-[11px] font-semibold pt-0.5">
            ⚠ Outside ±2 std deviation
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Legend info icon ─────────────────────────────────────────────────────────
function LegendInfoIcon({ tip }: { tip: string }) {
  return (
    <div className="relative group flex items-center shrink-0 ml-[3px]">
      <svg
        width="13" height="13" viewBox="0 0 13 13" fill="none"
        className="cursor-default text-[#8c9db0]"
        aria-label={tip}
      >
        <circle cx="6.5" cy="6.5" r="6" stroke="currentColor" strokeWidth="1" />
        <text x="6.5" y="10" textAnchor="middle" fontSize="8.5" fill="currentColor" fontFamily="IBM Plex Sans, sans-serif" fontWeight="600">i</text>
      </svg>
      <div
        className="pointer-events-none absolute bottom-full mb-2 z-50 hidden group-hover:block"
        style={{ right: '-8px' }}
      >
        <div
          style={{
            background: '#1c2a38',
            color: '#ffffff',
            fontSize: 12,
            lineHeight: '18px',
            padding: '8px 10px',
            borderRadius: 4,
            width: 200,
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            fontFamily: "'IBM Plex Sans', sans-serif",
          }}
        >
          {tip}
        </div>
        {/* caret */}
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 10,
          width: 0, height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '6px solid #1c2a38',
        }} />
      </div>
    </div>
  );
}

// ─── Legend items ─────────────────────────────────────────────────────────────
function ChartLegend({ showPattern }: { showPattern?: boolean }) {
  return (
    <div className="bg-white border border-[#e5e7eb] flex flex-col gap-[4px] items-start px-[9px] py-[5px] rounded-[4px]">

      {/* Actual value — blue solid line */}
      <div className="flex gap-[6px] items-center w-full">
        <div className="bg-[#0056e1] h-[2px] shrink-0 w-[16px]" />
        <span className="font-['IBM_Plex_Sans'] text-[14px] leading-[normal] text-[#525252] whitespace-nowrap">
          Actual value
        </span>
        <LegendInfoIcon tip="Measured Getpages count at each time point" />
      </div>

      {/* Expected value — yellow solid line */}
      <div className="flex gap-[6px] items-center w-full">
        <div className="bg-[#f59e0b] h-[2px] shrink-0 w-[16px]" />
        <span className="font-['IBM_Plex_Sans'] text-[14px] leading-[normal] text-[#525252] whitespace-nowrap">
          Expected value
        </span>
        <LegendInfoIcon tip="Baseline forecast derived from historical patterns" />
      </div>

      {/* +2 STD — dashed red line (SVG for accurate dash rendering) */}
      <div className="flex gap-[6px] items-center w-full">
        <svg width="16" height="8" viewBox="0 0 16 8" className="shrink-0">
          <line x1="0" y1="4" x2="16" y2="4" stroke="#da1e28" strokeWidth="1.5" strokeDasharray="3 2" />
        </svg>
        <span className="font-['IBM_Plex_Sans'] text-[14px] leading-[15px] text-[#364153] whitespace-nowrap">
          +2 STD
        </span>
        <LegendInfoIcon tip="Upper control limit: +2 standard deviations above expected" />
      </div>

      {/* -2 STD — dashed green line (SVG for accurate dash rendering) */}
      <div className="flex gap-[6px] items-center w-full">
        <svg width="16" height="8" viewBox="0 0 16 8" className="shrink-0">
          <line x1="0" y1="4" x2="16" y2="4" stroke="#15803d" strokeWidth="1.5" strokeDasharray="3 2" />
        </svg>
        <span className="font-['IBM_Plex_Sans'] text-[14px] leading-[15px] text-[#364153] whitespace-nowrap">
          -2 STD
        </span>
        <LegendInfoIcon tip="Lower control limit: −2 standard deviations below expected" />
      </div>

      {/* ±2 STD — light blue swatch */}
      <div className="flex gap-[6px] items-center w-full">
        <div className="bg-[#b9cef1] opacity-40 rounded-[1px] shrink-0 size-[16px]" />
        <span className="font-['IBM_Plex_Sans'] text-[14px] leading-[15px] text-[#364153] whitespace-nowrap">
          ±2 STD
        </span>
        <LegendInfoIcon tip="Shaded region between the ±2 standard deviation bounds" />
      </div>

      {/* Null — blue filled dot (Figma node 773:18724) */}
      <div className="flex gap-[6px] items-center w-full">
        <div className="flex items-center justify-center shrink-0 w-[18px] h-[6px]">
          <div className="rounded-full" style={{ width: 6, height: 6, backgroundColor: '#0056e1' }} />
        </div>
        <span className="font-['IBM_Plex_Sans'] text-[14px] leading-[15px] text-[#364153] whitespace-nowrap">
          Null
        </span>
        <LegendInfoIcon tip="A recorded value of 0 — no data was processed at this time" />
      </div>

      {/* System failure — pink/red bordered rectangle swatch (Figma node 773:18729) */}
      <div className="flex gap-[12px] items-center px-[4px] w-full">
        <div
          className="shrink-0"
          style={{
            width: 5, height: 14,
            backgroundColor: 'rgba(254,242,242,0.9)',
            border: '1px solid #fca5a5',
          }}
        />
        <span className="font-['IBM_Plex_Sans'] text-[14px] leading-[15px] text-[#364153] whitespace-nowrap">
          System failure
        </span>
        <LegendInfoIcon tip="Data collection was interrupted — the system was unavailable" />
      </div>

      {/* Moving average — purple (only shown when pattern mode active) */}
      {showPattern && (
        <div className="flex gap-[6px] items-center w-full">
          <div className="bg-[#7c3aed] h-[2px] shrink-0 w-[16px]" />
          <span className="font-['IBM_Plex_Sans'] text-[14px] leading-[15px] text-[#364153] whitespace-nowrap">
            Moving average
          </span>
          <LegendInfoIcon tip="Smoothed trend line calculated from a rolling window of data points" />
        </div>
      )}

    </div>
  );
}

// ─── Data processing ──────────────────────────────────────────────────────────
type ZeroMode = 'show' | 'interpolate' | 'remove';
type OutageMode = 'show' | 'remove';
type PatternMode = 'none' | 'moving-avg';

type RawPoint = ReturnType<typeof applyGaps>[number];

function processData(
  raw: RawPoint[],
  zeroMode: ZeroMode,
  outageMode: OutageMode,
  winStart: number,
  winEnd: number,
  smoothing: number,
  patternMode: PatternMode,
) {
  // 1. Handle zeros
  let data: (RawPoint & { movingAvg: number | null })[] = raw.map((p, i, arr) => {
    if (p.gapType !== 'zero') return { ...p, movingAvg: null };
    if (zeroMode === 'remove') return { ...p, actual: null as unknown as number, movingAvg: null };
    if (zeroMode === 'interpolate') {
      let prev: number | null = null, next: number | null = null;
      for (let j = i - 1; j >= 0; j--) { const v = arr[j].actual; if (v && v > 0) { prev = v; break; } }
      for (let j = i + 1; j < arr.length; j++) { const v = arr[j].actual; if (v && v > 0) { next = v; break; } }
      const interp = prev !== null && next !== null ? Math.round((prev + next) / 2) : prev ?? next ?? 0;
      return { ...p, actual: interp, gapType: null, movingAvg: null };
    }
    return { ...p, movingAvg: null };
  });

  // 2. Handle outages: remove collapses those points out of the dataset entirely
  if (outageMode === 'remove') {
    data = data.filter(p => p.gapType !== 'outage');
  }

  // 3. Slice to time window
  data = data.slice(winStart, winEnd + 1);

  // 4. Compute moving average (skips nulls and zeros unless interpolated)
  if (patternMode === 'moving-avg') {
    const half = Math.floor(smoothing / 2);
    data = data.map((p, i) => {
      const lo = Math.max(0, i - half), hi = Math.min(data.length - 1, i + half);
      const vals = data.slice(lo, hi + 1)
        .map(d => d.actual)
        .filter((v): v is number => typeof v === 'number' && v > 0);
      const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
      return { ...p, movingAvg: avg };
    });
  }

  return data;
}

// ─── Controls panel ───────────────────────────────────────────────────────────
interface DataControlsProps {
  zeroMode: ZeroMode; setZeroMode: (v: ZeroMode) => void;
  outageMode: OutageMode; setOutageMode: (v: OutageMode) => void;
  patternMode: PatternMode; setPatternMode: (v: PatternMode) => void;
  smoothing: number; setSmoothing: (v: number) => void;
  winStart: number; setWinStart: (v: number) => void;
  winEnd: number; setWinEnd: (v: number) => void;
  totalPoints: number;
  dateLabels: string[];
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-0.5 rounded text-[11px] border transition-colors ${
        active
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}

function DataControls({
  zeroMode, setZeroMode, outageMode, setOutageMode,
  patternMode, setPatternMode, smoothing, setSmoothing,
  winStart, setWinStart, winEnd, setWinEnd,
  totalPoints, dateLabels,
}: DataControlsProps) {
  return (
    <div className="border border-gray-200 rounded-lg bg-gray-50 px-3 py-2.5 mb-3 text-xs space-y-2.5">
      {/* Row 1: data filters */}
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500 font-medium w-14">Zeros</span>
          <div className="flex gap-1">
            <Chip label="Show" active={zeroMode === 'show'} onClick={() => setZeroMode('show')} />
            <Chip label="Interpolate" active={zeroMode === 'interpolate'} onClick={() => setZeroMode('interpolate')} />
            <Chip label="Remove" active={zeroMode === 'remove'} onClick={() => setZeroMode('remove')} />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500 font-medium w-14">Outage</span>
          <div className="flex gap-1">
            <Chip label="Show" active={outageMode === 'show'} onClick={() => setOutageMode('show')} />
            <Chip label="Remove" active={outageMode === 'remove'} onClick={() => setOutageMode('remove')} />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500 font-medium w-14">Pattern</span>
          <div className="flex gap-1">
            <Chip label="None" active={patternMode === 'none'} onClick={() => setPatternMode('none')} />
            <Chip label="Moving avg" active={patternMode === 'moving-avg'} onClick={() => setPatternMode('moving-avg')} />
          </div>
          {patternMode === 'moving-avg' && (
            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-gray-400">Smooth</span>
              <input
                type="range" min={2} max={12} step={1} value={smoothing}
                onChange={e => setSmoothing(+e.target.value)}
                className="w-20 accent-violet-600 h-1"
              />
              <span className="text-gray-600 w-8">{smoothing}wk</span>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: time window */}
      <div className="flex items-center gap-3">
        <span className="text-gray-500 font-medium w-14 flex-shrink-0">Window</span>
        <div className="flex flex-col flex-1 gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 w-20 text-right truncate">{dateLabels[winStart]}</span>
            <div className="flex-1 relative flex flex-col gap-1">
              {/* Start slider */}
              <input
                type="range" min={0} max={totalPoints - 1} step={1} value={winStart}
                onChange={e => {
                  const v = Math.min(+e.target.value, winEnd - 1);
                  setWinStart(v);
                }}
                className="w-full accent-blue-600 h-1"
              />
              {/* End slider */}
              <input
                type="range" min={0} max={totalPoints - 1} step={1} value={winEnd}
                onChange={e => {
                  const v = Math.max(+e.target.value, winStart + 1);
                  setWinEnd(v);
                }}
                className="w-full accent-blue-400 h-1"
              />
            </div>
            <span className="text-gray-400 w-20 truncate">{dateLabels[winEnd]}</span>
          </div>
          <div className="text-center text-gray-400" style={{ fontSize: 10 }}>
            {winEnd - winStart + 1} days shown — top slider = start, bottom slider = end
          </div>
        </div>
      </div>
      {/* Row 3: gap summary for the current window */}
      <div className="flex items-center gap-3 pt-1 border-t border-gray-200 flex-wrap">
        <span className="text-gray-400">In window:</span>
        {(() => {
          const slice = lineChartData.slice(winStart, winEnd + 1);
          const zeros    = slice.filter(p => p.gapType === 'zero').length;
          const outages  = slice.filter(p => p.gapType === 'outage').length;
          const filtered = slice.filter(p => p.gapType === 'filtered').length;
          const total    = winEnd - winStart + 1;
          const pct = (n: number) => ((n / total) * 100).toFixed(0);
          return (
            <>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                <span className="text-gray-600">{zeros} zeros ({pct(zeros)}%)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-gray-400" />
                <span className="text-gray-600">{outages} outage wks ({pct(outages)}%)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-gray-600">{filtered} filtered wks ({pct(filtered)}%)</span>
              </span>
              <span className="text-gray-400 ml-auto">
                {zeros + outages + filtered} of {total} weeks have gaps ({pct(zeros + outages + filtered)}%)
              </span>
            </>
          );
        })()}
      </div>
    </div>
  );
}

// ─── Reusable line chart ──────────────────────────────────────────────────────
type LineInterpolation = 'linear' | 'monotone' | 'stepBefore' | 'step';

interface ChartVisualProps {
  lineWidth?: number;
  lineType?: LineInterpolation;
  showActual?: boolean;
  showExpected?: boolean;
  showSDBands?: boolean;
  fillOpacity?: number;
}

function GetpagesChart({ data, margin, showPattern, showOverlays = true, visual = {} }: {
  data: ReturnType<typeof processData>;
  margin?: object;
  showPattern: boolean;
  showOverlays?: boolean;
  visual?: ChartVisualProps;
}) {
  const {
    lineWidth = 2,
    lineType = 'linear',
    showActual = true,
    showExpected = true,
    showSDBands = true,
    fillOpacity = 0.85,
  } = visual;

  // Y-axis formatter: finer granularity matching Figma (0k, 200k…2.8M)
  const fmt = (v: number) => {
    if (v === 0) return '0k';
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    return `${(v / 1_000).toFixed(0)}k`;
  };

  // Custom X-axis tick: no rotation, centered, IBM Plex Sans
  const XTick = ({ x, y, payload }: any) => (
    <text
      x={x} y={y + 10}
      textAnchor="middle"
      fontSize={10}
      fontFamily="'IBM Plex Sans', sans-serif"
      fill="#6b7280"
    >
      {payload.value}
    </text>
  );

  // Custom Y-axis tick: right-aligned, Inter style
  const YTick = ({ x, y, payload }: any) => (
    <text
      x={x - 4} y={y}
      textAnchor="end"
      dominantBaseline="middle"
      fontSize={10}
      fontFamily="Inter, sans-serif"
      fill="#6b7280"
    >
      {fmt(payload.value)}
    </text>
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 16, left: 48, bottom: 24, ...margin }}>
        {/* Figma: dotted horizontal grid only, #e5e7eb */}
        <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#e5e7eb" strokeOpacity={0.8} />

        <XAxis
          dataKey="date"
          tick={<XTick />}
          interval={4}
          axisLine={{ stroke: '#e5e7eb' }}
          tickLine={{ stroke: '#e5e7eb' }}
          height={32}
        />
        <YAxis
          tick={<YTick />}
          width={48}
          domain={[0, 'auto']}
          axisLine={false}
          tickLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 2' }}
        />

        {/* Zero baseline */}
        <ReferenceLine y={0} stroke="#d1d5db" strokeWidth={1} />

        {/* Filtered regions (hatch pattern — keep for data fidelity) */}
        <Customized component={() => (
          <defs>
            <pattern id="filtered-hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45 0 0)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#ea580c" strokeWidth="1.5" opacity="0.35" />
            </pattern>
          </defs>
        ) as any} />
        {showOverlays && filteredRegions.map((r, i) => (
          <ReferenceArea key={`flt-${i}`} x1={r.x1} x2={r.x2} fill="url(#filtered-hatch)" fillOpacity={1}
            label={{ value: '⊘', position: 'top', fontSize: 8, fill: '#ea580c' }} />
        ))}

        {/* ±2 SD outer band — shaded fill between bounds */}
        {showSDBands && <Area name="band-outer-base" dataKey="bandOuterBase" stackId="outer" stroke="none" fill="#ffffff" fillOpacity={0.6} legendType="none" isAnimationActive={false} />}
        {showSDBands && <Area name="band-outer-fill" dataKey="bandOuterHeight" stackId="outer" stroke="none" fill="#fef9c3" fillOpacity={fillOpacity} legendType="none" isAnimationActive={false} />}

        {/* +2 SD upper boundary — red dashed */}
        {showSDBands && <Line name="sd2-upper" dataKey="sd2Upper" stroke="#da1e28" strokeWidth={1} strokeDasharray="5 3" dot={false} legendType="none" isAnimationActive={false} type={lineType} />}
        {/* -2 SD lower boundary — green dashed */}
        {showSDBands && <Line name="sd2-lower" dataKey="sd2Lower" stroke="#15803d" strokeWidth={1} strokeDasharray="5 3" dot={false} legendType="none" isAnimationActive={false} type={lineType} />}

        {/* Expected — yellow solid, always connected (no gaps) */}
        {showExpected && <Line name="expected" dataKey="expected" stroke="#f59e0b" strokeWidth={lineWidth} dot={false} legendType="none" isAnimationActive={false} type={lineType} connectNulls />}

        {/* Moving average */}
        {showPattern && (
          <Line name="moving-avg" dataKey="movingAvg" stroke="#7c3aed" strokeWidth={lineWidth + 0.5}
            dot={false} legendType="none" isAnimationActive={false} connectNulls={false} strokeLinejoin="round" type={lineType} />
        )}

        {/* Actual — blue solid line */}
        {showActual && <Line
          dataKey="actual"
          stroke="#0056e1"
          strokeWidth={lineWidth}
          legendType="none"
          isAnimationActive={false}
          type={lineType}
          connectNulls={false}
          activeDot={{ r: 4, fill: '#4b5563', stroke: '#ffffff', strokeWidth: 1.5 }}
          dot={(props: any) => {
            const { cx, cy, payload } = props;
            if (payload.actual !== 0) return <g key={`dot-${payload.date}`} />;
            return (
              <g key={`zero-${payload.date}`}>
                <circle cx={cx} cy={cy} r={4} fill="#fff" stroke="#0056e1" strokeWidth={2} />
              </g>
            );
          }}
        />}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ─── Graph Edit Panel (Grafana-style right drawer) ────────────────────────────
interface GraphEditPanelProps extends DataControlsProps, ChartVisualProps {
  isOpen: boolean;
  onClose: () => void;
  setLineWidth: (v: number) => void;
  setLineType: (v: LineInterpolation) => void;
  setShowActual: (v: boolean) => void;
  setShowExpected: (v: boolean) => void;
  setShowSDBands: (v: boolean) => void;
  setFillOpacity: (v: number) => void;
}

function PanelSection({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wide hover:bg-gray-50"
      >
        <span className="flex items-center gap-2">{icon}{title}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && <div className="px-4 pb-4 pt-1 space-y-3">{children}</div>}
    </div>
  );
}

function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded text-[11px] border transition-colors ${
        active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}

function SeriesToggleRow({ label, color, active, onToggle }: { label: string; color: string; active: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
        <span className="text-xs text-gray-700">{label}</span>
      </div>
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border transition-colors ${
          active ? 'text-blue-600 border-blue-300 bg-blue-50' : 'text-gray-400 border-gray-200 bg-gray-50'
        }`}
      >
        {active ? <Eye size={10} /> : <EyeOff size={10} />}
        {active ? 'On' : 'Off'}
      </button>
    </div>
  );
}

function GraphEditPanel({
  isOpen, onClose,
  // data controls
  zeroMode, setZeroMode, outageMode, setOutageMode,
  patternMode, setPatternMode, smoothing, setSmoothing,
  winStart, setWinStart, winEnd, setWinEnd,
  totalPoints, dateLabels,
  // visual controls
  lineWidth = 2, setLineWidth,
  lineType = 'linear', setLineType,
  showActual = true, setShowActual,
  showExpected = true, setShowExpected,
  showSDBands = true, setShowSDBands,
  fillOpacity = 0.85, setFillOpacity,
}: GraphEditPanelProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="absolute inset-0 z-20" onClick={onClose} />
      )}

      {/* Panel */}
      <div
        className={`absolute top-0 right-0 h-full z-30 bg-white border-l border-gray-200 shadow-xl flex flex-col transition-all duration-200 ${
          isOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 pointer-events-none overflow-hidden'
        }`}
        style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-gray-500" />
            <span className="text-sm font-semibold text-gray-800">Edit panel</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* Graph style */}
          <PanelSection title="Graph style" icon={<Activity size={12} />}>
            <div>
              <div className="text-[11px] text-gray-500 mb-2">Line interpolation</div>
              <div className="flex gap-1.5">
                {([
                  {
                    type: 'linear' as LineInterpolation,
                    label: 'Linear',
                    icon: (
                      <svg width="28" height="16" viewBox="0 0 28 16">
                        <polyline points="2,13 10,7 18,9 26,3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
                      </svg>
                    ),
                  },
                  {
                    type: 'monotone' as LineInterpolation,
                    label: 'Smooth',
                    icon: (
                      <svg width="28" height="16" viewBox="0 0 28 16">
                        <path d="M2,13 C6,13 8,3 14,5 C20,7 22,3 26,3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    ),
                  },
                  {
                    type: 'stepBefore' as LineInterpolation,
                    label: 'Step before',
                    icon: (
                      <svg width="28" height="16" viewBox="0 0 28 16">
                        <polyline points="2,13 2,8 10,8 10,5 18,5 18,3 26,3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
                      </svg>
                    ),
                  },
                  {
                    type: 'step' as LineInterpolation,
                    label: 'Step after',
                    icon: (
                      <svg width="28" height="16" viewBox="0 0 28 16">
                        <polyline points="2,13 10,13 10,8 18,8 18,5 26,5 26,3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
                      </svg>
                    ),
                  },
                ]).map(({ type, label, icon }) => (
                  <button
                    key={type}
                    onClick={() => setLineType(type)}
                    title={label}
                    className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded border transition-colors ${
                      lineType === type
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {icon}
                    <span style={{ fontSize: 9 }} className="leading-none">{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-gray-500">Line width</span>
                <span className="text-[11px] text-gray-700 font-medium">{lineWidth}px</span>
              </div>
              <input type="range" min={1} max={5} step={0.5} value={lineWidth}
                onChange={e => setLineWidth(+e.target.value)}
                className="w-full accent-blue-600" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-gray-500">Fill opacity</span>
                <span className="text-[11px] text-gray-700 font-medium">{Math.round(fillOpacity * 100)}%</span>
              </div>
              <input type="range" min={0} max={1} step={0.05} value={fillOpacity}
                onChange={e => setFillOpacity(+e.target.value)}
                className="w-full accent-blue-600" />
            </div>
          </PanelSection>

          {/* Series visibility */}
          <PanelSection title="Series" icon={<Eye size={12} />}>
            <SeriesToggleRow label="Actual value" color="#0056e1" active={showActual} onToggle={() => setShowActual(!showActual)} />
            <SeriesToggleRow label="Expected value" color="#f59e0b" active={showExpected} onToggle={() => setShowExpected(!showExpected)} />
            <SeriesToggleRow label="±SD bands" color="#16a34a" active={showSDBands} onToggle={() => setShowSDBands(!showSDBands)} />
          </PanelSection>

          {/* Data gaps */}
          <PanelSection title="Data gaps" icon={<TrendingUp size={12} />}>
            <div>
              <div className="text-[11px] text-gray-500 mb-1.5">Zero values</div>
              <div className="flex gap-1 flex-wrap">
                <ToggleChip label="Show" active={zeroMode === 'show'} onClick={() => setZeroMode('show')} />
                <ToggleChip label="Interpolate" active={zeroMode === 'interpolate'} onClick={() => setZeroMode('interpolate')} />
                <ToggleChip label="Remove" active={zeroMode === 'remove'} onClick={() => setZeroMode('remove')} />
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                {zeroMode === 'show' && 'Hollow circles mark zero-value data points.'}
                {zeroMode === 'interpolate' && 'Zeros are filled with a linear estimate between neighbors.'}
                {zeroMode === 'remove' && 'Zero-value points create a gap in the line.'}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500 mb-1.5">Outage periods</div>
              <div className="flex gap-1">
                <ToggleChip label="Show shading" active={outageMode === 'show'} onClick={() => setOutageMode('show')} />
                <ToggleChip label="Collapse" active={outageMode === 'remove'} onClick={() => setOutageMode('remove')} />
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                {outageMode === 'show' && 'Outage periods shown as grey shaded regions.'}
                {outageMode === 'remove' && 'Outage days removed — line continues without gap.'}
              </div>
            </div>
          </PanelSection>

          {/* Trend & Pattern */}
          <PanelSection title="Trend & Pattern" icon={<TrendingUp size={12} />}>
            <div>
              <div className="text-[11px] text-gray-500 mb-1.5">Overlay</div>
              <div className="flex gap-1">
                <ToggleChip label="None" active={patternMode === 'none'} onClick={() => setPatternMode('none')} />
                <ToggleChip label="Moving avg" active={patternMode === 'moving-avg'} onClick={() => setPatternMode('moving-avg')} />
              </div>
            </div>
            {patternMode === 'moving-avg' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-gray-500">Smoothing window</span>
                  <span className="text-[11px] text-gray-700 font-medium">{smoothing} days</span>
                </div>
                <input type="range" min={2} max={20} step={1} value={smoothing}
                  onChange={e => setSmoothing(+e.target.value)}
                  className="w-full accent-violet-600" />
              </div>
            )}
          </PanelSection>

          {/* Time window */}
          <PanelSection title="Time window" icon={<SlidersHorizontal size={12} />}>
            <div className="text-[10px] text-gray-400 mb-1">
              Showing {winEnd - winStart + 1} of {totalPoints} days
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-gray-500">Start</span>
                <span className="text-[11px] text-blue-600 font-medium">{dateLabels[winStart]}</span>
              </div>
              <input type="range" min={0} max={totalPoints - 1} step={1} value={winStart}
                onChange={e => setWinStart(Math.min(+e.target.value, winEnd - 1))}
                className="w-full accent-blue-600" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-gray-500">End</span>
                <span className="text-[11px] text-blue-600 font-medium">{dateLabels[winEnd]}</span>
              </div>
              <input type="range" min={0} max={totalPoints - 1} step={1} value={winEnd}
                onChange={e => setWinEnd(Math.max(+e.target.value, winStart + 1))}
                className="w-full accent-blue-400" />
            </div>
            {/* Gap summary */}
            <div className="pt-2 border-t border-gray-100 space-y-1">
              {(() => {
                const slice = lineChartData.slice(winStart, winEnd + 1);
                const zeros    = slice.filter(p => p.gapType === 'zero').length;
                const outages  = slice.filter(p => p.gapType === 'outage').length;
                const filtered = slice.filter(p => p.gapType === 'filtered').length;
                const total    = winEnd - winStart + 1;
                const pct = (n: number) => ((n / total) * 100).toFixed(0);
                return (
                  <>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Zeros</span>
                      <span className="text-gray-600">{zeros} days ({pct(zeros)}%)</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />Outages</span>
                      <span className="text-gray-600">{outages} days ({pct(outages)}%)</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />Filtered</span>
                      <span className="text-gray-600">{filtered} days ({pct(filtered)}%)</span>
                    </div>
                    <div className="text-[10px] text-gray-400 pt-1">
                      {zeros + outages + filtered} of {total} days have gaps ({pct(zeros + outages + filtered)}%)
                    </div>
                  </>
                );
              })()}
            </div>
          </PanelSection>

        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition-colors"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Home2ContentProps {
  activeSelection?: ActiveSelection;
  onOpenSelection?: () => void;
}

export function Home2Content({ activeSelection, onOpenSelection }: Home2ContentProps) {
  const [activeChartTab, setActiveChartTab] = useState<'chart' | 'grid'>('chart');
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);
  const [defaultZoomRange, setDefaultZoomRange] = useState<[number, number]>([0, hourlyData.length - 1]);
  const [yearZoomRange, setYearZoomRange] = useState<[number, number]>(() => [0, yearData.length - 1]);
  const [cwZoomRange,   setCwZoomRange]   = useState<[number, number]>([0, 6]);
  const [pwZoomRange,   setPwZoomRange]   = useState<[number, number]>([0, 6]);
  const [cmZoomRange,   setCmZoomRange]   = useState<[number, number]>(() => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    return [0, lastDay - 1];
  });

  // Data controls
  const [zeroMode, setZeroMode] = useState<ZeroMode>('show');
  const [outageMode, setOutageMode] = useState<OutageMode>('show');
  const [patternMode, setPatternMode] = useState<PatternMode>('none');
  const [smoothing, setSmoothing] = useState(4);
  const [winStart, setWinStart] = useState(0);
  const [winEnd, setWinEnd] = useState(lineChartData.length - 1);

  // Visual controls
  const [lineWidth, setLineWidth] = useState(2);
  const [lineType, setLineType] = useState<LineInterpolation>('linear');
  const [showActual, setShowActual] = useState(true);
  const [showExpected, setShowExpected] = useState(true);
  const [showSDBands, setShowSDBands] = useState(true);
  const [fillOpacity, setFillOpacity] = useState(0.85);

  const processedData = useMemo(
    () => processData(lineChartData, zeroMode, outageMode, winStart, winEnd, smoothing, patternMode),
    [zeroMode, outageMode, winStart, winEnd, smoothing, patternMode],
  );

  const dateLabels = lineChartData.map(p => p.date);
  const hasComparison = !!activeSelection?.comparison;

  // ── Daily data for quick-select week / month ranges ────────────────────────
  const _today = new Date();
  // Current week: Monday–Sunday of the current week
  const _cwMon = new Date(_today);
  _cwMon.setDate(_today.getDate() - ((_today.getDay() + 6) % 7)); // Monday
  const _cwSun = new Date(_cwMon);
  _cwSun.setDate(_cwMon.getDate() + 6); // Sunday

  // Previous week: Monday–Sunday of the prior week
  const _pwMon = new Date(_cwMon);
  _pwMon.setDate(_cwMon.getDate() - 7);
  const _pwSun = new Date(_pwMon);
  _pwSun.setDate(_pwMon.getDate() + 6);

  // Current month: 1st through last day of current month
  const _cmStart = new Date(_today.getFullYear(), _today.getMonth(), 1);
  const _cmEnd = new Date(_today.getFullYear(), _today.getMonth() + 1, 0);

  const currentWeekData = useMemo(() => buildDailyData(_cwMon, _cwSun), []);
  const previousWeekData = useMemo(() => buildDailyData(_pwMon, _pwSun), []);
  const currentMonthData = useMemo(() => buildDailyData(_cmStart, _cmEnd), []);

  const label = activeSelection?.timeRangeLabel ?? '';

  // Helper: format a Date as MM/dd/yyyy to match SelectionPanel's format() output
  const _fmt = (d: Date) =>
    `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;

  // Current year label: "01/01/YYYY - MM/DD/YYYY"
  const _yearStart = new Date(_today.getFullYear(), 0, 1);
  const isCurrentYear = label.startsWith(_fmt(_yearStart));

  // Current week label starts with the Monday of this week
  const isCurrentWeek = label.startsWith(_fmt(_cwMon));

  // Previous week label starts with the Monday of last week
  const isPreviousWeek = label.startsWith(_fmt(_pwMon));

  // Current month label starts with the 1st of this month (and is not a week)
  const isCurrentMonth = label.startsWith(_fmt(_cmStart)) && !isCurrentWeek;

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Navigation Sidebar — Figma node 610:30683 */}
      <aside
        className="overflow-y-auto flex-shrink-0 bg-white"
        style={{ width: 192, minWidth: 180, borderRight: '1px solid #d1d5dc' }}
      >
        <div className="py-1">
          {/* Navigation header */}
          <div
            className="text-white px-3 py-1.5 text-sm font-medium"
            style={{ backgroundColor: '#4178be', fontSize: 14, fontWeight: 500, lineHeight: '20px' }}
          >
            Navigation
          </div>

          {navigationTree.map(item => (
            <div key={item.id} className="flex items-center gap-1 px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer">
              <IconChevronRight size={12} />
              <span style={{ color: '#0a0a0a', fontSize: 14, lineHeight: '20px' }}>{item.label}</span>
            </div>
          ))}

          <div className="mt-1">
            {/* Reports section heading */}
            <div className="px-2 py-1 flex items-center gap-1">
              <span style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', lineHeight: '20px' }}>Reports</span>
            </div>

            {reportItems.map(item => (
              <div key={item.id} className="flex items-center gap-1 px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer">
                <IconChevronRight size={12} />
                <span style={{ color: '#0a0a0a', fontSize: 14, lineHeight: '20px' }}>{item.label}</span>
              </div>
            ))}

            {/* CF and XCF expandable */}
            <div>
              <div className="flex items-center gap-1 px-3 py-1 text-sm cursor-pointer">
                <IconChevronDown size={12} />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', lineHeight: '20px' }}>CF and XCF</span>
              </div>

              <div className="ml-4">
                {['Health Insights', 'Change Detection', 'Coupling Facility'].map(label => (
                  <div key={label} className="flex items-center gap-1 px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer">
                    <IconChevronRight size={12} />
                    <span style={{ color: '#0a0a0a', fontSize: 14, lineHeight: '20px' }}>{label}</span>
                  </div>
                ))}

                {/* XCF expandable */}
                <div>
                  <div className="flex items-center gap-1 px-3 py-1 text-sm cursor-pointer">
                    <IconChevronDown size={12} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', lineHeight: '20px' }}>XCF</span>
                  </div>
                  <div className="ml-4">
                    {xcfSubItems.map(sub => (
                      <div
                        key={sub.id}
                        className="cursor-pointer"
                        style={{
                          padding: '4px 12px',
                          fontSize: 14,
                          lineHeight: '20px',
                          color: '#0a0a0a',
                          fontWeight: sub.active ? 600 : 400,
                          backgroundColor: sub.active ? '#eff6ff' : undefined,
                          borderLeft: sub.active ? '2px solid #155dfc' : undefined,
                          paddingLeft: sub.active ? 14 : 12,
                        }}
                      >
                        {sub.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {bottomNavItems.map(item => (
              <div key={item.id} className="flex items-center gap-1 px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer">
                <IconChevronRight size={12} />
                <span style={{ color: '#0a0a0a', fontSize: 14, lineHeight: '20px' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="w-1.5 bg-gray-200 hover:bg-blue-400 cursor-col-resize flex-shrink-0" />

      {/* Main Content Area */}
      <main className="flex-1 bg-white overflow-y-auto flex flex-col min-w-0 relative">
        {/* Report Preview Thumbnails */}
        <div className="border-b border-gray-200 px-4 py-2 bg-gray-50">
          <div className="text-sm font-semibold mb-2">Previews report set Usage by System</div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {reportThumbnails.map(thumb => (
              <div key={thumb.id} className="flex flex-col items-center flex-shrink-0 cursor-pointer">
                <div
                  className={`w-16 h-12 border rounded flex items-center justify-center mb-1 ${
                    thumb.highlighted ? 'border-red-500 border-2 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                >
                  <BarChart3 size={20} className={thumb.highlighted ? 'text-red-500' : 'text-blue-400'} />
                </div>
                <span className={`text-[10px] text-center leading-tight ${thumb.highlighted ? 'font-semibold text-red-600' : 'text-gray-600'}`}>
                  {thumb.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="px-4 py-2 text-sm text-blue-600 border-b border-gray-200 bg-white">
          <span className="hover:underline cursor-pointer">Db2</span>
          <span className="text-gray-400 mx-1">&gt;</span>
          <span className="hover:underline cursor-pointer">Statistics</span>
          <span className="text-gray-400 mx-1">&gt;</span>
          <span className="hover:underline cursor-pointer">DB Statistics</span>
          <span className="text-gray-400 mx-1">&gt;</span>
          <span className="text-gray-900 font-medium">Getpages Change Over Time</span>
        </div>

        {/* Report Header — Figma node 610:30894 */}
        <div className="pl-9 pr-4 py-3 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 400, color: '#101828', lineHeight: '28px', marginBottom: 4 }}>
                Getpages Change Over Time
              </h1>
              <p style={{ fontSize: 14, color: '#525252', lineHeight: '20px' }}>for DB2 Data Sharing Group DB2H</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1">
                <IconCollected size={14} />
                Collected
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1">
                <IconDashboard size={14} />
                Dashboard
                <ChevronDownIcon size={12} />
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1">
                <IconFavorites size={14} />
                Favorites
              </button>
              <button
                onClick={() => setIsEditPanelOpen(o => !o)}
                className={`px-3 py-1.5 text-sm rounded flex items-center gap-1.5 transition-colors ${
                  isEditPanelOpen
                    ? 'bg-blue-700 text-white ring-2 ring-blue-400'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <IconEdit size={14} color="white" />
                Edit report
              </button>
            </div>
          </div>

          {/* Description + Selection info — Figma node 610:30958: justify-between row */}
          <div className="mt-3 flex items-start justify-between gap-4">

            {/* Left: Description block — Figma node 781:9724 */}
            <div
              className="flex flex-col flex-1 min-w-0"
              style={{ gap: 4, backgroundColor: '#ffffff', padding: '8px 0', borderRadius: 3.656, alignItems: 'flex-start' }}
            >
              <p style={{ fontSize: 14, fontWeight: 500, color: '#161616', lineHeight: 'normal' }}>
                Description
              </p>
              <div style={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
                {!isCurrentWeek && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1 }}
                    fill="#da1e28"
                    aria-label="Warning"
                  >
                    <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm-.75 4h1.5v4.5h-1.5V5zM8 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                  </svg>
                )}
                <p style={{ fontSize: 14, fontWeight: 400, color: '#161616', lineHeight: 'normal', flex: 1 }}>
                  {isCurrentWeek
                    ? 'This report shows the Getpages metric over time for Db2 Data Sharing Group DB0H, including expected values and normal variation ranges.'
                    : 'Some telemetry data is missing due to a network maintenance outage. This report shows the Getpages metric over time for Db2 Data Sharing Group DB0H, including expected values and normal variation ranges. Values outside these ranges suggest unusual activity.'}
                </p>
              </div>
            </div>

            {/* Right: Selection info card — node 610:30964 */}
            <div
              onClick={onOpenSelection}
              className="cursor-pointer hover:bg-blue-100 transition-colors flex-shrink-0"
              style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #0f62fe',
                borderRadius: 4,
                padding: 8,
                display: 'flex',
                gap: 32,
                alignItems: 'flex-start',
              }}
            >
              {/* Left column: date + rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: 267 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 400, color: '#000000', letterSpacing: '-0.325px', lineHeight: 'normal' }}>
                    {activeSelection ? activeSelection.timeRangeLabel : '08/26/2026'}
                  </p>
                  {activeSelection?.daysOfWeekFull && (
                    <p style={{ fontSize: 12, fontWeight: 400, color: '#525252', letterSpacing: '-0.2px', lineHeight: 'normal' }}>
                      {activeSelection.daysOfWeekFull}
                    </p>
                  )}
                  {activeSelection?.endOfMonthSummary && (
                    <p style={{ fontSize: 12, fontWeight: 400, color: '#525252', letterSpacing: '-0.2px', lineHeight: 'normal' }}>
                      {activeSelection.endOfMonthSummary}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Interest Groups row */}
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <p style={{ fontSize: 14, fontWeight: 400, color: '#000000', letterSpacing: '-0.325px', lineHeight: 'normal', whiteSpace: 'nowrap' }}>
                      Interest Groups
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 400, color: '#525252', letterSpacing: '-0.325px', lineHeight: 'normal', whiteSpace: 'nowrap' }}>
                      {activeSelection
                        ? `${activeSelection.interestGroup}${activeSelection.sysplexes ? `, ${activeSelection.sysplexes}` : ''}`
                        : 'IGT, All sysplexes'}
                    </p>
                  </div>
                  {/* Interval row */}
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <p style={{ fontSize: 14, fontWeight: 400, color: '#000000', letterSpacing: '-0.325px', lineHeight: 'normal', whiteSpace: 'nowrap' }}>
                      Interval
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 400, color: '#525252', letterSpacing: '-0.325px', lineHeight: 'normal', whiteSpace: 'nowrap' }}>
                      {activeSelection?.reportingInterval ?? 'Hourly'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: days/time */}
              <p style={{ fontSize: 14, fontWeight: 400, color: '#161616', letterSpacing: '-0.325px', lineHeight: 'normal', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {activeSelection?.days ?? 'Mon-Fri'}
              </p>

              {/* Comparison row (optional) — kept for feature parity */}
              {hasComparison && activeSelection?.comparison && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <p style={{ fontSize: 14, fontWeight: 400, color: '#000000', letterSpacing: '-0.325px', lineHeight: 'normal', whiteSpace: 'nowrap' }}>
                    Compare to
                  </p>
                  <p style={{ fontSize: 14, color: '#525252', letterSpacing: '-0.325px', lineHeight: 'normal', whiteSpace: 'nowrap' }}>
                    {activeSelection.comparison.label}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Tabs */}
        <div className="border-b border-[#e5e7eb] flex items-center pb-px pl-[16px] pr-[16px]">
          {/* Chart tab */}
          <button
            onClick={() => setActiveChartTab('chart')}
            className={`flex items-center gap-[6px] border-b-2 pt-[8px] pb-[10px] px-[16px] font-['IBM_Plex_Sans'] text-[14px] leading-[20px] font-medium transition-colors ${
              activeChartTab === 'chart'
                ? 'bg-[#f0fdf4] border-[#00a63e] text-[#008236]'
                : 'border-transparent text-[#4a5565] hover:text-[#101828] bg-transparent'
            }`}
          >
            <BarChart3 size={14} />
            Chart
          </button>
          {/* Grid tab */}
          <button
            onClick={() => setActiveChartTab('grid')}
            className={`flex items-center gap-[6px] border-b-2 pt-[8px] pb-[10px] px-[16px] font-['IBM_Plex_Sans'] text-[14px] leading-[20px] font-medium transition-colors ${
              activeChartTab === 'grid'
                ? 'bg-[#f0fdf4] border-[#00a63e] text-[#008236]'
                : 'border-transparent text-[#4a5565] hover:text-[#101828] bg-transparent'
            }`}
          >
            <Grid3X3 size={14} />
            Grid
          </button>
        </div>

        {/* Chart Content */}
        <div className="flex-1 px-4 py-4 min-h-0">
          {activeChartTab === 'chart' && (
            <div className="h-full flex flex-col">
              {/* Toolbar — Figma node 630:1760 */}
              <div className="flex items-center justify-end gap-[8px] pb-[8px]">
                <button
                  onClick={() => setIsLegendCollapsed(v => !v)}
                  className="flex items-center gap-[4px] rounded-[4px] px-[9px] py-[5px] transition-colors"
                  style={{
                    backgroundColor: isLegendCollapsed ? '#e0e7ff' : '#ffffff',
                    border: isLegendCollapsed ? '1px solid #155dfc' : '1px solid #d1d5dc',
                    color: isLegendCollapsed ? '#155dfc' : '#4a5565',
                  }}
                >
                  <IconCollapse size={12} color={isLegendCollapsed ? '#155dfc' : '#4a5565'} />
                  <span
                    className="font-['IBM_Plex_Sans'] text-[14px] leading-[16px] font-medium whitespace-nowrap"
                    style={{ color: isLegendCollapsed ? '#155dfc' : '#4a5565' }}
                  >
                    Collapse
                  </span>
                </button>
              </div>

              {hasComparison && activeSelection?.comparison ? (
                <div className="flex gap-4 flex-1 min-h-[380px]">
                  {/* Left: Comparison period */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="text-xs text-center text-gray-700 mb-1">
                      {activeSelection.comparison.comparisonRangeLabel}{' '}
                      <span className="font-semibold text-gray-900">({activeSelection.comparison.label})</span>
                    </div>
                    <div className="flex-1">
                      <GetpagesChart data={processData(comparisonLineData, zeroMode, outageMode, 0, comparisonLineData.length - 1, smoothing, patternMode)} showPattern={patternMode !== 'none'} visual={{ lineWidth, lineType, showActual, showExpected, showSDBands, fillOpacity }} />
                    </div>
                  </div>

                  {/* Right: Main period */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="text-xs text-center text-gray-700 mb-1">
                      {activeSelection.comparison.mainRangeLabel}{' '}
                      <span className="font-semibold text-gray-900">({activeSelection.timeRangeLabel})</span>
                    </div>
                    <div className="flex-1 flex items-start gap-[8px]">
                      <div className="flex-1 min-w-0">
                        <GetpagesChart data={processedData} showPattern={patternMode !== 'none'} visual={{ lineWidth, lineType, showActual, showExpected, showSDBands, fillOpacity }} />
                      </div>
                      <ChartLegend />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-[8px] p-[20px]">
                  {/* LineChart column */}
                  {/* LineChart column — Figma node 773:18484 "Default Graph": relative size-full */}
                  <div className="flex flex-1 flex-col min-w-0">
                    {/* % Service Time label */}
                    <div className="flex w-full justify-end pr-[8px] shrink-0">
                      <span className="font-['IBM_Plex_Sans'] text-[12px] leading-[16px] text-[#99a1af] text-right">
                        % Service Time
                      </span>
                    </div>
                    {/* Chart surface — Figma node 773:18484: relative size-full */}
                    <div className="relative w-full h-[320px]">
                      {isCurrentYear
                        ? <YearGraph zoomRange={yearZoomRange} onZoomChange={setYearZoomRange} />
                        : isCurrentWeek
                          ? <DailyGraph data={currentWeekData} zoomRange={cwZoomRange} />
                          : isPreviousWeek
                            ? <DailyGraph data={previousWeekData} zoomRange={pwZoomRange} />
                            : isCurrentMonth
                              ? <DailyGraph data={currentMonthData} zoomRange={cmZoomRange} />
                              : <DefaultGraph zoomRange={defaultZoomRange} />}
                    </div>
                    {/* Zoom/pan bar — always visible below the chart */}
                    {isCurrentYear ? (
                      <ZoomBar
                        items={yearData.map(d => ({ label: d.axisMonth ?? `${new Date(d.date).getMonth() + 1}/${new Date(d.date).getFullYear()}`, value: d.expected, isOutage: d.actual === null }))}
                        zoomRange={yearZoomRange}
                        onZoomChange={setYearZoomRange}
                      />
                    ) : isCurrentWeek ? (
                      <ZoomBar
                        items={currentWeekData.map(d => ({ label: d.date, value: d.expected, isOutage: false }))}
                        zoomRange={cwZoomRange}
                        onZoomChange={setCwZoomRange}
                      />
                    ) : isPreviousWeek ? (
                      <ZoomBar
                        items={previousWeekData.map(d => ({ label: d.date, value: d.expected, isOutage: false }))}
                        zoomRange={pwZoomRange}
                        onZoomChange={setPwZoomRange}
                      />
                    ) : isCurrentMonth ? (
                      <ZoomBar
                        items={currentMonthData.map(d => ({ label: d.date, value: d.expected, isOutage: false }))}
                        zoomRange={cmZoomRange}
                        onZoomChange={setCmZoomRange}
                      />
                    ) : (
                      <ZoomBar
                        items={hourlyData.map(d => ({ label: d.time, value: d.expected, isOutage: d.actual === null }))}
                        zoomRange={defaultZoomRange}
                        onZoomChange={setDefaultZoomRange}
                      />
                    )}
                  </div>
                  {/* Legend — hidden when collapsed */}
                  {!isLegendCollapsed && (
                    <div className="shrink-0">
                      <ChartLegend showPattern={patternMode !== 'none'} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeChartTab === 'grid' && (() => {

            // ── Shared cell renderer ──────────────────────────────────────────
            const thStyle: React.CSSProperties = {
              border: '1px solid #d1d5dc',
              padding: '7px 11.5px',
              fontWeight: 700,
              lineHeight: '20px',
              whiteSpace: 'nowrap',
            };
            const baseCellStyle: React.CSSProperties = {
              border: '1px solid #d1d5dc',
              padding: '5px 11.5px',
              lineHeight: '20px',
              whiteSpace: 'nowrap',
            };
            const renderCell = (val: number | null, isOutage: boolean) => {
              if (isOutage) return <span style={{ color: '#99a1af', fontStyle: 'italic' }}>—</span>;
              if (val === 0) return <span>0</span>;
              return <span style={{ color: '#99a1af', fontStyle: 'italic' }}>{val!.toLocaleString()}</span>;
            };

            if (isCurrentYear) {
              // ── Daily grid — one row per day from yearData ────────────────
              type DayRow = {
                date: string;
                monthLabel: string;
                db1: number | null;
                db2: number | null;
                db3: number | null;
                total: number | null;
                outage: boolean;
              };
              const dayRows: DayRow[] = yearData.map(p => {
                const isOutage = p.actual === null;
                if (isOutage) {
                  return { date: p.date, monthLabel: p.monthLabel, db1: null, db2: null, db3: null, total: null, outage: true };
                }
                const total = p.actual!;
                const db1 = Math.round(total * 0.355);
                const db2 = Math.round(total * 0.395);
                const db3 = total - db1 - db2;
                return { date: p.date, monthLabel: p.monthLabel, db1, db2, db3, total, outage: false };
              });

              // Group into months for the sticky month label column
              let lastMonth = '';

              return (
                <div className="overflow-auto p-[20px]">
                  <table className="border-collapse" style={{ fontSize: 13, color: '#0a0a0a', fontFamily: "'IBM Plex Sans', sans-serif" }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f3f4f6', height: 37 }}>
                        <th style={{ ...thStyle, textAlign: 'left', width: 100 }}>Month</th>
                        <th style={{ ...thStyle, textAlign: 'left', width: 130 }}>Date</th>
                        <th style={{ ...thStyle, textAlign: 'right', width: 210 }}>DB0H01 Getpages</th>
                        <th style={{ ...thStyle, textAlign: 'right', width: 210 }}>DB0H02 Getpages</th>
                        <th style={{ ...thStyle, textAlign: 'right', width: 210 }}>DB0H03 Getpages</th>
                        <th style={{ ...thStyle, textAlign: 'right', width: 180 }}>Total Getpages</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayRows.map((row, i) => {
                        const isOutage = row.outage;
                        const rowBg = isOutage ? '#fef2f2' : (i % 2 === 1 ? '#f9fafb' : '#ffffff');
                        const showMonth = row.monthLabel !== lastMonth;
                        if (showMonth) lastMonth = row.monthLabel;
                        return (
                          <tr key={row.date} style={{ height: 30, backgroundColor: rowBg }}>
                            <td style={{ ...baseCellStyle, fontWeight: 600, color: showMonth ? '#0a0a0a' : 'transparent', fontSize: 12 }}>
                              {row.monthLabel}
                            </td>
                            <td style={{ ...baseCellStyle, color: isOutage ? '#da1e28' : '#374151', fontWeight: isOutage ? 600 : 400 }}>
                              {isOutage ? <span>⚠ {row.date}</span> : row.date}
                            </td>
                            <td style={{ ...baseCellStyle, textAlign: 'right' }}>{renderCell(row.db1, isOutage)}</td>
                            <td style={{ ...baseCellStyle, textAlign: 'right' }}>{renderCell(row.db2, isOutage)}</td>
                            <td style={{ ...baseCellStyle, textAlign: 'right' }}>{renderCell(row.db3, isOutage)}</td>
                            <td style={{ ...baseCellStyle, textAlign: 'right', fontWeight: isOutage ? 400 : 500 }}>{renderCell(row.total, isOutage)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            }

            // ── Hourly grid (default / non-current-year intervals) ────────────
            const hourlyRows: { hour: string; db1: number | null; db2: number | null; db3: number | null; total: number | null; outage: boolean }[] = [
              { hour: '00:00', db1: 2840,  db2: 3120,  db3: 1890,  total: 7850,  outage: false },
              { hour: '01:00', db1: null,  db2: null,  db3: null,  total: null,  outage: true  },
              { hour: '02:00', db1: 980,   db2: 1120,  db3: 720,   total: 2820,  outage: false },
              { hour: '03:00', db1: null,  db2: null,  db3: null,  total: null,  outage: true  },
              { hour: '04:00', db1: 890,   db2: 960,   db3: 590,   total: 2440,  outage: false },
              { hour: '05:00', db1: null,  db2: null,  db3: null,  total: null,  outage: true  },
              { hour: '06:00', db1: 0,     db2: 0,     db3: 0,     total: 0,     outage: false },
              { hour: '07:00', db1: 5680,  db2: 6240,  db3: 3920,  total: 15840, outage: false },
              { hour: '08:00', db1: 8920,  db2: 9780,  db3: 6140,  total: 24840, outage: false },
              { hour: '09:00', db1: 11200, db2: 12400, db3: 7800,  total: 31400, outage: false },
              { hour: '10:00', db1: 12840, db2: 14200, db3: 8920,  total: 35960, outage: false },
              { hour: '11:00', db1: 13200, db2: 14680, db3: 9200,  total: 37080, outage: false },
              { hour: '12:00', db1: 11800, db2: 13100, db3: 8280,  total: 33180, outage: false },
              { hour: '13:00', db1: 12400, db2: 13600, db3: 8560,  total: 34560, outage: false },
              { hour: '14:00', db1: 11600, db2: 12800, db3: 8040,  total: 32440, outage: false },
              { hour: '15:00', db1: 10800, db2: 11960, db3: 7520,  total: 30280, outage: false },
              { hour: '16:00', db1: 9800,  db2: 10840, db3: 6820,  total: 27460, outage: false },
              { hour: '17:00', db1: 0,     db2: 0,     db3: 0,     total: 0,     outage: false },
              { hour: '18:00', db1: 5400,  db2: 5960,  db3: 3740,  total: 15100, outage: false },
              { hour: '19:00', db1: 4200,  db2: 4620,  db3: 2900,  total: 11720, outage: false },
              { hour: '20:00', db1: 3600,  db2: 3980,  db3: 2500,  total: 10080, outage: false },
              { hour: '21:00', db1: null,  db2: null,  db3: null,  total: null,  outage: true  },
              { hour: '22:00', db1: 2960,  db2: 3260,  db3: 2050,  total: 8270,  outage: false },
              { hour: '23:00', db1: 2680,  db2: 2960,  db3: 1860,  total: 7500,  outage: false },
            ];
            return (
              <div className="overflow-auto p-[20px]">
                <table className="border-collapse" style={{ fontSize: 14, color: '#0a0a0a', fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6', height: 37 }}>
                      <th style={{ ...thStyle, textAlign: 'left', width: 117 }}>Hour</th>
                      <th style={{ ...thStyle, textAlign: 'right', width: 254 }}>DB0H01 Getpages</th>
                      <th style={{ ...thStyle, textAlign: 'right', width: 254 }}>DB0H02 Getpages</th>
                      <th style={{ ...thStyle, textAlign: 'right', width: 254 }}>DB0H03 Getpages</th>
                      <th style={{ ...thStyle, textAlign: 'right', width: 216 }}>Total Getpages</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hourlyRows.map((row, i) => {
                      const isOutage = row.outage;
                      const rowBg = isOutage ? '#fef2f2' : (i % 2 === 1 ? '#f9fafb' : '#ffffff');
                      return (
                        <tr key={row.hour} style={{ height: 33, backgroundColor: rowBg }}>
                          <td style={{ ...baseCellStyle, fontFamily: 'Menlo, monospace' }}>{row.hour}</td>
                          <td style={{ ...baseCellStyle, textAlign: 'right' }}>{renderCell(row.db1, isOutage)}</td>
                          <td style={{ ...baseCellStyle, textAlign: 'right' }}>{renderCell(row.db2, isOutage)}</td>
                          <td style={{ ...baseCellStyle, textAlign: 'right' }}>{renderCell(row.db3, isOutage)}</td>
                          <td style={{ ...baseCellStyle, textAlign: 'right', fontWeight: isOutage ? 400 : 500 }}>{renderCell(row.total, isOutage)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })()}

        </div>

        {/* Graph Edit Panel */}
        <GraphEditPanel
          isOpen={isEditPanelOpen}
          onClose={() => setIsEditPanelOpen(false)}
          zeroMode={zeroMode} setZeroMode={setZeroMode}
          outageMode={outageMode} setOutageMode={setOutageMode}
          patternMode={patternMode} setPatternMode={setPatternMode}
          smoothing={smoothing} setSmoothing={setSmoothing}
          winStart={winStart} setWinStart={setWinStart}
          winEnd={winEnd} setWinEnd={setWinEnd}
          totalPoints={lineChartData.length}
          dateLabels={dateLabels}
          lineWidth={lineWidth} setLineWidth={setLineWidth}
          lineType={lineType} setLineType={setLineType}
          showActual={showActual} setShowActual={setShowActual}
          showExpected={showExpected} setShowExpected={setShowExpected}
          showSDBands={showSDBands} setShowSDBands={setShowSDBands}
          fillOpacity={fillOpacity} setFillOpacity={setFillOpacity}
        />
      </main>

    </div>
  );
}
