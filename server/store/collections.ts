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

/** Full collections list (dashboard aggregates). Returns a plain array. */
export const useAllCollections = (
  officeId?: number | null,
  options: { enabled?: boolean } = {},
) => {
  return useQuery({
    queryKey: ["collections", { all: true, office_id: officeId ?? null }],
    queryFn: () => api.getCollections({ all: true, office_id: officeId ?? undefined }),
    select: (res) => res?.data ?? [],
    enabled: options.enabled ?? true,
  });
};
