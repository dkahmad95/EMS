/**
 * Design tokens: the single source of truth for color, radius, motion and type.
 *
 * Consumed by tailwind.config.js (CommonJS `require`), globals.css (mirrored
 * as CSS variables), the MUI theme (app/theme/MuiProvider.tsx) and the charts.
 *
 * Brand swap: change `primary` here and the whole app follows.
 */

const primary = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
  950: '#052e16',
};

/** Supporting hue for KPI accents and charts only, never for primary actions. */
const secondary = {
  50: '#f0fdfa',
  100: '#ccfbf1',
  200: '#99f6e4',
  300: '#5eead4',
  400: '#2dd4bf',
  500: '#14b8a6',
  600: '#0d9488',
  700: '#0f766e',
  800: '#115e59',
  900: '#134e4a',
  950: '#042f2e',
};

const accent = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
  950: '#082f49',
};

const success = {
  50: '#ecfdf5',
  100: '#d1fae5',
  200: '#a7f3d0',
  300: '#6ee7b7',
  400: '#34d399',
  500: '#10b981',
  600: '#059669',
  700: '#047857',
  800: '#065f46',
  900: '#064e3b',
  950: '#022c22',
};

const warning = {
  50: '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b',
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
  950: '#451a03',
};

const danger = {
  50: '#fff1f2',
  100: '#ffe4e6',
  200: '#fecdd3',
  300: '#fda4af',
  400: '#fb7185',
  500: '#f43f5e',
  600: '#e11d48',
  700: '#be123c',
  800: '#9f1239',
  900: '#881337',
  950: '#4c0519',
};

/** Tailwind "gray" (the one neutral used everywhere). */
const gray = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
  950: '#030712',
};

/** One radius scale. md = small controls, lg = inputs/buttons/cards, xl = dialogs, 2xl = shell. */
const radius = { md: 8, lg: 12, xl: 16, '2xl': 24 };

/** Strong ease-out for anything entering or responding; quick ease-in for exits. */
const easing = {
  enter: 'cubic-bezier(0.23, 1, 0.32, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
};

/** Milliseconds. UI motion stays under 300ms. */
const duration = { fast: 150, base: 200, slow: 250 };

const shadow = {
  card: '0 1px 3px rgba(17,24,39,0.08), 0 1px 2px rgba(17,24,39,0.04)',
  cardHover: '0 4px 12px rgba(17,24,39,0.10), 0 2px 4px rgba(17,24,39,0.06)',
  dropdown: '0 10px 24px rgba(17,24,39,0.10), 0 4px 8px rgba(17,24,39,0.06)',
  modal: '0 20px 40px rgba(17,24,39,0.12), 0 8px 16px rgba(17,24,39,0.06)',
};

const font = "var(--font-cairo), 'Cairo', system-ui, sans-serif";

/** Chart series colors (Recharts). */
const chart = {
  series: { USD: primary[600], LBP: accent[600], OTHERS: warning[500] },
  extra: [secondary[500], danger[500], '#8b5cf6'],
  grid: gray[100],
  cursor: primary[50],
  tick: gray[500],
};

module.exports = {
  primary,
  secondary,
  accent,
  success,
  warning,
  danger,
  gray,
  radius,
  easing,
  duration,
  shadow,
  font,
  chart,
};
