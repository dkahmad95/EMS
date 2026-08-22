import type { CategoryKey, ChartDatum, Period, SeriesDef, SeriesKey } from "../types";
import { SERIES_COLOR, SERIES_DEFAULT_LABEL, SERIES_ORDER } from "./chartTheme";
import { addDays, bucketKey, daysBetween, formatBucketLabel } from "./date";

const seriesKeyOf = (r: DashboardRevenueRow): SeriesKey => {
  const t = r.currency?.currency_type as SeriesKey | undefined;
  return t && SERIES_ORDER.includes(t) ? t : "OTHERS";
};

const makeDatum = (name: string, key: string): ChartDatum => ({ name, key, total: 0, raw: {} });

const addToDatum = (d: ChartDatum, s: SeriesKey, r: DashboardRevenueRow) => {
  const chart = Number(r.chart_amount) || 0;
  const raw = Number(r.revenue_amount) || 0;
  d[s] = ((d[s] as number | undefined) ?? 0) + chart;
  d.raw[s] = (d.raw[s] ?? 0) + raw;
  d.total += chart;
};

/** Build the ordered SeriesDef[] for the series keys that actually appear. */
const buildSeries = (labels: Map<SeriesKey, string>, seen: Set<SeriesKey>): SeriesDef[] =>
  SERIES_ORDER.filter((k) => seen.has(k)).map((k) => ({
    key: k,
    label: labels.get(k) ?? SERIES_DEFAULT_LABEL[k],
    color: SERIES_COLOR[k],
  }));

/** Ensure every datum has an explicit 0 for every series (stable bars + tooltips). */
const zeroFillSeries = (data: ChartDatum[], series: SeriesDef[]) => {
  for (const d of data) {
    for (const s of series) {
      if (d[s.key] === undefined) d[s.key] = 0;
      if (d.raw[s.key] === undefined) d.raw[s.key] = 0;
    }
  }
  return data;
};

const categoryName = (r: DashboardRevenueRow, by: CategoryKey): string => {
  switch (by) {
    case "employee":
      return r.employee?.name ?? "—";
    case "office":
      return r.office?.name ?? "—";
    case "destination":
      return r.destination?.name ?? "—";
    case "currency":
      return r.currency?.name ?? r.chart_series ?? "—";
  }
};

/** Sum of chart_amount per category, split by currency_type series. Sorted by total desc. */
export const groupByCategory = (
  rows: DashboardRevenueRow[],
  by: CategoryKey,
): { data: ChartDatum[]; series: SeriesDef[] } => {
  const map = new Map<string, ChartDatum>();
  const labels = new Map<SeriesKey, string>();
  const seen = new Set<SeriesKey>();

  for (const r of rows) {
    const name = categoryName(r, by);
    const s = seriesKeyOf(r);
    seen.add(s);
    if (!labels.has(s) && r.chart_series) labels.set(s, r.chart_series);
    let d = map.get(name);
    if (!d) {
      d = makeDatum(name, name);
      map.set(name, d);
    }
    addToDatum(d, s, r);
  }

  const series = buildSeries(labels, seen);
  const data = zeroFillSeries(
    Array.from(map.values()).sort((a, b) => b.total - a.total),
    series,
  );
  return { data, series };
};

/**
 * Sum of chart_amount per time bucket, split by currency_type series.
 * Buckets are sorted asc by ISO key. When `period === 'daily'` and the range is ≤ 31 days,
 * missing days are zero-filled so the axis is continuous.
 */
export const groupByTime = (
  rows: DashboardRevenueRow[],
  period: Period,
  from?: string,
  to?: string,
): { data: ChartDatum[]; series: SeriesDef[] } => {
  const map = new Map<string, ChartDatum>();
  const labels = new Map<SeriesKey, string>();
  const seen = new Set<SeriesKey>();

  for (const r of rows) {
    const key = bucketKey(r.date, period);
    if (!key) continue;
    const s = seriesKeyOf(r);
    seen.add(s);
    if (!labels.has(s) && r.chart_series) labels.set(s, r.chart_series);
    let d = map.get(key);
    if (!d) {
      d = makeDatum(formatBucketLabel(key, period), key);
      map.set(key, d);
    }
    addToDatum(d, s, r);
  }

  if (period === "daily" && from && to && from <= to) {
    const span = daysBetween(from, to);
    if (span >= 0 && span <= 31) {
      for (let i = 0; i <= span; i++) {
        const key = addDays(from, i);
        if (!map.has(key)) map.set(key, makeDatum(formatBucketLabel(key, period), key));
      }
    }
  }

  const series = buildSeries(labels, seen);
  const data = zeroFillSeries(
    Array.from(map.values()).sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0)),
    series,
  );
  return { data, series };
};

export type CurrencyTotals = Record<SeriesKey, { total: number; count: number }>;

/** KPI totals per currency_type using display_amount (OTHERS already ÷ rate). */
export const sumByCurrencyType = (rows: DashboardRevenueRow[]): CurrencyTotals => {
  const out: CurrencyTotals = {
    USD: { total: 0, count: 0 },
    LBP: { total: 0, count: 0 },
    OTHERS: { total: 0, count: 0 },
  };
  for (const r of rows) {
    const s = seriesKeyOf(r);
    out[s].total += Number(r.display_amount) || 0;
    out[s].count += 1;
  }
  return out;
};

/** Number of revenue records per destination, sorted desc. */
export const countByDestination = (
  rows: DashboardRevenueRow[],
): { name: string; count: number }[] => {
  const map = new Map<string, number>();
  for (const r of rows) {
    const name = r.destination?.name ?? "—";
    map.set(name, (map.get(name) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

export type CollectionTotals = { SPONSORSHIP: number; BOX: number };

/** Sum of `count` per collection_type (works for Collection and FreezedCollection). */
export const sumCollections = (cols: Collection[] | undefined | null): CollectionTotals => {
  const out: CollectionTotals = { SPONSORSHIP: 0, BOX: 0 };
  for (const c of cols ?? []) {
    const n = Number(c.count) || 0;
    // CollectionType is an ambient enum (types.d.ts) → compare as plain strings at runtime
    const t = c.collection_type as unknown as string;
    if (t === "SPONSORSHIP") out.SPONSORSHIP += n;
    else if (t === "BOX") out.BOX += n;
  }
  return out;
};
