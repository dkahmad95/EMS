import { useQuery } from "@tanstack/react-query";
import * as api from "../services/api/revenues/revenues";

export const useRevenues = (
  officeId?: number | null,
  options: { enabled?: boolean } = { enabled: true },
) => {
  return useQuery({
    queryKey: ["revenues", officeId ?? "all"],
    queryFn: () => api.getRevenues(officeId),
    enabled: options.enabled,
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
