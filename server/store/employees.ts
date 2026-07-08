import { useQuery } from "@tanstack/react-query";
import * as api from "../services/api/employees/employees";

export const useEmployees = (
  officeId?: number | null,
  options: { enabled?: boolean } = { enabled: true },
) => {
  return useQuery({
    queryKey: ["employees", officeId ?? "all"],
    queryFn: () => api.getEmployees(officeId),
    enabled: options.enabled,
  });
};
