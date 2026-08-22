import { keepPreviousData, useQuery } from "@tanstack/react-query";
import * as api from "../services/api/revenues/revenues";

/** Paginated revenues list (server-side pagination). */
export const useRevenues = (
  params: RevenueListParams = {},
  options: { enabled?: boolean } = {},
) => {
  return useQuery({
    queryKey: ["revenues", params],
    queryFn: () => api.getRevenues(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
};

/**
 * Dashboard revenues (server-side filters). Use `{ ...filters, all: true }` for KPIs/charts
 * and `{ ...filters, page, limit }` for the table. Key prefix "dashboardRevenues" is
 * invalidated by revenue mutations.
 */
export const useDashboardRevenues = (
  params: DashboardRevenueParams = {},
  options: { enabled?: boolean } = {},
) => {
  return useQuery({
    queryKey: ["dashboardRevenues", params],
    queryFn: () => api.getDashboardRevenues(params),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    enabled: options.enabled ?? true,
  });
};
