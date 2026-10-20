import { keepPreviousData, useQuery } from "@tanstack/react-query";
import * as api from "../services/api/officeReports/officeReports";

/** Paginated office reports list (server-side pagination). */
export const useOfficeReports = (
  params: OfficeReportListParams = {},
  options: { enabled?: boolean } = {},
) => {
  return useQuery({
    queryKey: ["officeReports", params],
    queryFn: () => api.getOfficeReports(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
};

/** Full office-reports list (dashboard print). Same filters as the list
 *  (office_id / office_ids, employee_id / employee_ids, date_from, date_to). Plain array. */
export const useAllOfficeReports = (
  params: Omit<OfficeReportListParams, "all" | "page" | "limit"> = {},
  options: { enabled?: boolean } = {},
) => {
  return useQuery({
    queryKey: ["officeReports", { all: true, ...params }],
    queryFn: () => api.getOfficeReports({ ...params, all: true }),
    select: (res) => res?.data ?? [],
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
};

export const useOfficeReport = (id: number | null, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ["officeReports", id],
    queryFn: () => api.getOfficeReport(id as number),
    enabled: (options.enabled ?? true) && id != null,
  });
};
