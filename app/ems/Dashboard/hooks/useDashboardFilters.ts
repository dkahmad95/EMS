"use client";
import { useCallback, useMemo, useState } from "react";
import { useDebouncedValue } from "@/app/hooks/useDebouncedValue";
import type { AmountMode, DashboardFilters } from "../types";
import { todayLocal } from "../utils/date";

export const makeDefaultFilters = (): DashboardFilters => ({
  employee_ids: [],
  office_ids: [],
  destination_ids: [],
  currency_types: [],
  date_from: todayLocal(),
  date_to: todayLocal(),
  amount_mode: "gt",
  amount_min: "",
  amount_max: "",
});

export type CollectionFilterParams = {
  office_id?: number;
  office_ids?: string;
  employee_ids?: string;
  date_from?: string;
  date_to?: string;
};

/** number[] -> "1,2,3" | undefined (arrays travel as comma-separated strings). */
const joinIds = (ids: readonly (number | string)[]) =>
  ids.length > 0 ? ids.join(",") : undefined;

/**
 * Owns the dashboard filter state and derives the API params sent to
 * GET /revenues/dashboard (+ the subset used by /collections and /freezed-collections).
 * Multi-select filters are arrays; amount inputs are debounced (400ms) before hitting the API.
 * Office rule: selected office_ids win; otherwise the Office Switcher's currentOfficeId applies.
 */
export function useDashboardFilters(currentOfficeId: number | null | undefined) {
  const [filters, setFilters] = useState<DashboardFilters>(makeDefaultFilters);

  const debouncedMin = useDebouncedValue(filters.amount_min, 400);
  const debouncedMax = useDebouncedValue(filters.amount_max, 400);

  const patch = useCallback(
    (p: Partial<DashboardFilters>) => setFilters((prev) => ({ ...prev, ...p })),
    [],
  );

  const reset = useCallback(() => setFilters(makeDefaultFilters()), []);

  const setRange = useCallback(
    (from: string, to: string) => setFilters((prev) => ({ ...prev, date_from: from, date_to: to })),
    [],
  );

  const setAmountMode = useCallback(
    (mode: AmountMode) =>
      setFilters((prev) => ({
        ...prev,
        amount_mode: mode,
        // drop the bound that the new mode doesn't use
        amount_min: mode === "lt" ? "" : prev.amount_min,
        amount_max: mode === "gt" ? "" : prev.amount_max,
      })),
    [],
  );

  /** Only meaningful in "between" mode: min > max -> don't send amounts. */
  const isAmountInvalid = useMemo(() => {
    if (filters.amount_mode !== "between") return false;
    if (filters.amount_min === "" || filters.amount_max === "") return false;
    return Number(filters.amount_min) > Number(filters.amount_max);
  }, [filters.amount_mode, filters.amount_min, filters.amount_max]);

  // Office scope shared by the revenues + collections queries
  const officeParams = useMemo(
    () =>
      filters.office_ids.length > 0
        ? { office_ids: joinIds(filters.office_ids) }
        : { office_id: currentOfficeId ?? undefined },
    [filters.office_ids, currentOfficeId],
  );

  const apiParams = useMemo<DashboardRevenueParams>(() => {
    const mode = filters.amount_mode;
    const min = debouncedMin;
    const max = debouncedMax;
    const invalid =
      mode === "between" && min !== "" && max !== "" && Number(min) > Number(max);
    return {
      ...officeParams,
      employee_ids: joinIds(filters.employee_ids),
      destination_ids: joinIds(filters.destination_ids),
      currency_types: joinIds(filters.currency_types),
      date_from: filters.date_from || undefined,
      date_to: filters.date_to || undefined,
      // guard "" BEFORE Number() — cleanParams keeps 0, and Number("") === 0
      amount_min: !invalid && mode !== "lt" && min !== "" ? Number(min) : undefined,
      amount_max: !invalid && mode !== "gt" && max !== "" ? Number(max) : undefined,
    };
  }, [
    officeParams,
    filters.employee_ids,
    filters.destination_ids,
    filters.currency_types,
    filters.date_from,
    filters.date_to,
    filters.amount_mode,
    debouncedMin,
    debouncedMax,
  ]);

  const paramsKey = useMemo(() => JSON.stringify(apiParams), [apiParams]);

  const collectionParams = useMemo<CollectionFilterParams>(
    () => ({
      ...officeParams,
      employee_ids: joinIds(filters.employee_ids),
      date_from: filters.date_from || undefined,
      date_to: filters.date_to || undefined,
    }),
    [officeParams, filters.employee_ids, filters.date_from, filters.date_to],
  );

  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.employee_ids.length) n++;
    if (filters.office_ids.length) n++;
    if (filters.destination_ids.length) n++;
    if (filters.currency_types.length) n++;
    if (filters.date_from || filters.date_to) n++;
    if (filters.amount_min !== "" || filters.amount_max !== "") n++;
    return n;
  }, [filters]);

  return {
    filters,
    setFilters,
    patch,
    reset,
    setRange,
    setAmountMode,
    isAmountInvalid,
    apiParams,
    paramsKey,
    collectionParams,
    activeCount,
  };
}

export type DashboardFiltersApi = ReturnType<typeof useDashboardFilters>;
