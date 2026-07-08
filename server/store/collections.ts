import { useQuery } from "@tanstack/react-query";
import * as api from "../services/api/collections/collections";

export const useCollections = (
  officeId?: number | null,
  options: { enabled?: boolean } = { enabled: true },
) => {
  return useQuery({
    queryKey: ["collections", officeId ?? "all"],
    queryFn: () => api.getCollections(officeId),
    enabled: options.enabled,
  });
};
