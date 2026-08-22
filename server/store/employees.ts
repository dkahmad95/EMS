import { keepPreviousData, useQuery } from "@tanstack/react-query";
import * as api from "../services/api/employees/employees";

/** Paginated employees list (server-side pagination). */
export const useEmployees = (
  params: EmployeeListParams = {},
  options: { enabled?: boolean } = {},
) => {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: () => api.getEmployees(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
};

/** Full employee list (for dropdowns / autocompletes). Returns a plain array. */
export const useAllEmployees = (
  officeId?: number | null,
  options: { enabled?: boolean } = {},
) => {
  return useQuery({
    queryKey: ["employees", { all: true, office_id: officeId ?? null }],
    queryFn: () => api.getEmployees({ all: true, office_id: officeId ?? undefined }),
    select: (res) => res?.data ?? [],
    enabled: options.enabled ?? true,
  });
};
