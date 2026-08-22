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

export const useDashboardRevenues = (
  officeId?: number | null,
  options: { enabled?: boolean } = { enabled: true },
) => {
  return useQuery({
    queryKey: ["dashboardRevenues", officeId ?? "all"],
    queryFn: () => api.getDashboardRevenues(officeId),
    enabled: options.enabled,
  });
};
