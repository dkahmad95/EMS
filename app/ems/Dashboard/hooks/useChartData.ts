"use client";
import { useMemo } from "react";
import type { Period } from "../types";
import { countByDestination, groupByCategory, groupByTime, sumByCurrencyType } from "../utils/aggregate";

/** Memoized aggregations over the full filtered row set. */
export function useChartData(
  rows: DashboardRevenueRow[],
  period: Period,
  from?: string,
  to?: string,
) {
  const byEmployee = useMemo(() => groupByCategory(rows, "employee"), [rows]);
  const byOffice = useMemo(() => groupByCategory(rows, "office"), [rows]);
  const byDestination = useMemo(() => groupByCategory(rows, "destination"), [rows]);
  const byCurrency = useMemo(() => groupByCategory(rows, "currency"), [rows]);
  const byTime = useMemo(() => groupByTime(rows, period, from, to), [rows, period, from, to]);
  const currencyTotals = useMemo(() => sumByCurrencyType(rows), [rows]);
  const destinationCounts = useMemo(() => countByDestination(rows), [rows]);

  return { byEmployee, byOffice, byDestination, byCurrency, byTime, currencyTotals, destinationCounts };
}
