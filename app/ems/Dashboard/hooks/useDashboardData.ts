"use client";
import { useMemo } from "react";
import { useServerTable } from "@/app/hooks/useServerTable";
import { useDashboardRevenues } from "@/server/store/revenues";
import { useAllCollections } from "@/server/store/collections";
import { useAllFreezedCollections } from "@/server/store/freezedCollections";
import { useAllEmployees } from "@/server/store/employees";
import { useDashboardCurrencies } from "@/server/store/currencies";
import { useDestinations } from "@/server/store/destinations";
import { useTokenOffices } from "@/app/hooks/useTokenOffices";
import type { DashboardFiltersApi } from "./useDashboardFilters";
import type { DashboardCurrency } from "../types";

const EMPTY_ROWS: DashboardRevenueRow[] = [];

/**
 * All server data for the dashboard:
 *  - `allQ`  → full filtered set (KPIs + charts)           GET /revenues/dashboard?all=true
 *  - `pageQ` → current table page                          GET /revenues/dashboard?page&limit
 *  - collections / freezed collections (office+employee+date filters only)
 *  - lookup lists for the filter bar
 */
export function useDashboardData(
  f: DashboardFiltersApi,
  currentOfficeId: number | null | undefined,
) {
  const { apiParams, paramsKey, collectionParams } = f;

  const allParams = useMemo<DashboardRevenueParams>(
    () => ({ ...apiParams, all: true }),
    [apiParams],
  );
  const allQ = useDashboardRevenues(allParams);

  const table = useServerTable({ pageSize: 25, resetDeps: [paramsKey] });
  const pageParams = useMemo<DashboardRevenueParams>(
    () => ({ ...apiParams, page: table.params.page, limit: table.params.limit }),
    [apiParams, table.params.page, table.params.limit],
  );
  const pageQ = useDashboardRevenues(pageParams);

  const collectionsQ = useAllCollections(collectionParams);
  const freezedQ = useAllFreezedCollections(collectionParams);

  const employeesQ = useAllEmployees(currentOfficeId);
  const currenciesQ = useDashboardCurrencies();
  const destinationsQ = useDestinations();
  const { data: offices } = useTokenOffices();

  const rows = allQ.data?.data ?? EMPTY_ROWS;
  const meta = allQ.data?.meta ?? { lbp_rate: null };
  const total = allQ.data?.total ?? rows.length;

  return {
    // full set
    rows,
    meta,
    total,
    allLoading: allQ.isLoading,
    allFetching: allQ.isFetching,
    allError: allQ.isError,
    // table page
    table,
    pageRows: pageQ.data?.data ?? EMPTY_ROWS,
    pageTotal: pageQ.data?.total ?? total,
    pageLoading: pageQ.isLoading,
    pageFetching: pageQ.isFetching,
    // collections
    collections: collectionsQ.data ?? [],
    collectionsLoading: collectionsQ.isLoading,
    freezed: freezedQ.data ?? [],
    freezedLoading: freezedQ.isLoading,
    // lookups
    employees: employeesQ.data ?? [],
    currencies: (currenciesQ.data ?? []) as unknown as DashboardCurrency[],
    destinations: destinationsQ.data ?? [],
    offices,
  };
}

export type DashboardData = ReturnType<typeof useDashboardData>;
