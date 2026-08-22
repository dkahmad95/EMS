import type { SeriesKey } from "../types";

/** Series palette from the Tailwind tokens (primary-600 / accent-600 / warning-500). */
export const SERIES_COLOR: Record<SeriesKey, string> = {
  USD: "#16a34a",
  LBP: "#0284c7",
  OTHERS: "#f59e0b",
};

export const SERIES_ORDER: SeriesKey[] = ["USD", "LBP", "OTHERS"];

/** Fallback colors for any series beyond the three currency types. */
export const EXTRA_COLORS = ["#14b8a6", "#f43f5e", "#8b5cf6"];

/** Default Arabic labels when the API hasn't supplied a `chart_series` yet. */
export const SERIES_DEFAULT_LABEL: Record<SeriesKey, string> = {
  USD: "دولار",
  LBP: "لورال",
  OTHERS: "عملات أخرى",
};

/** Unit suffix shown next to KPI totals (display_amount). */
export const SERIES_UNIT: Record<SeriesKey, string> = {
  USD: "$",
  LBP: "ل.ل",
  OTHERS: "$ (محوّل)",
};

export const GRID = "#f3f4f6";
export const CURSOR = "#f0fdf4";
export const TICK = { fill: "#6b7280", fontSize: 11, fontFamily: "Cairo, sans-serif" } as const;

/** 1,234,567.89 (Latin digits). */
export const fmtNum = (v: number | null | undefined, maxFraction = 2): string =>
  Number(v ?? 0).toLocaleString("en-US", { maximumFractionDigits: maxFraction });

/** 12.5K / 1.2M for axis ticks. */
export const fmtCompact = (v: number): string => {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  const trim = (n: number) => {
    const s = n.toFixed(1);
    return s.endsWith(".0") ? s.slice(0, -2) : s;
  };
  if (abs >= 1_000_000_000) return `${sign}${trim(abs / 1_000_000_000)}B`;
  if (abs >= 1_000_000) return `${sign}${trim(abs / 1_000_000)}M`;
  if (abs >= 1_000) return `${sign}${trim(abs / 1_000)}K`;
  return fmtNum(v, 0);
};

/** Truncate long category labels for the X axis. */
export const truncateLabel = (s: string, max = 12): string =>
  s.length > max ? `${s.slice(0, max - 1)}…` : s;
