import { useQuery } from "@tanstack/react-query";
import * as api from "../services/api/employees/employees";

export const useEmployees = (options: { enabled?: boolean } = { enabled: true }) => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: () => api.getEmployees(),
    enabled: options.enabled,
  });
};
