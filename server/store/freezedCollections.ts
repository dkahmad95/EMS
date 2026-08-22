import { keepPreviousData, useQuery } from "@tanstack/react-query";
import * as api from "../services/api/freezedCollections/freezedCollections";

/** Paginated freezed collections list (server-side pagination). */
export const useFreezedCollections = (
  params: FreezedCollectionListParams = {},
  options: { enabled?: boolean } = {},
) => {
  return useQuery({
    queryKey: ["freezedCollections", params],
    queryFn: () => api.getFreezedCollections(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
};

/** Full freezed collections list (dashboard aggregates). Accepts the same filters as the list
 *  (office_id, employee_id, date_from, date_to, collection_type). Returns a plain array. */
export const useAllFreezedCollections = (
  params: Omit<FreezedCollectionListParams, "all" | "page" | "limit"> = {},
  options: { enabled?: boolean } = {},
) => {
  return useQuery({
    queryKey: ["freezedCollections", { all: true, ...params }],
    queryFn: () => api.getFreezedCollections({ ...params, all: true }),
    select: (res) => res?.data ?? [],
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
};
