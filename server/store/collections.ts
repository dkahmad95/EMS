import { useQuery } from "@tanstack/react-query";
import * as api from "../services/api/collections/collections";

export const useCollections = (options: { enabled?: boolean } = { enabled: true }) => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: () => api.getCollections(),
    enabled: options.enabled,
  });
};
