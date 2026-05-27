import { useQuery } from "@tanstack/react-query";
import * as api from "../services/api/revenues/revenues";

export const useRevenues = (options: { enabled?: boolean } = { enabled: true }) => {
  return useQuery({
    queryKey: ["revenues"],
    queryFn: () => api.getRevenues(),
    enabled: options.enabled,
  });
};
export const useDashboardRevenues = (options: { enabled?: boolean } = { enabled: true }) => {
  return useQuery({
    queryKey: ["dashboardRevenues"],
    queryFn: () => api.getDashboardRevenues(),
    enabled: options.enabled,
  });
};
