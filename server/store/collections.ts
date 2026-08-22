import { keepPreviousData, useQuery } from "@tanstack/react-query";
import * as api from "../services/api/collections/collections";

/** Paginated collections list (server-side pagination). */
export const useCollections = (
  params: CollectionListParams = {},
  options: { enabled?: boolean } = {},
) => {
  return useQuery({
    queryKey: ["collections", params],
    queryFn: () => api.getCollections(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
};

/** Full collections list (dashboard aggregates). Accepts the same filters as the list
 *  (office_id, employee_id, date_from, date_to, collection_type). Returns a plain array. */
export const useAllCollections = (
  params: Omit<CollectionListParams, "all" | "page" | "limit"> = {},
  options: { enabled?: boolean } = {},
) => {
  return useQuery({
    queryKey: ["collections", { all: true, ...params }],
    queryFn: () => api.getCollections({ ...params, all: true }),
    select: (res) => res?.data ?? [],
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
};
