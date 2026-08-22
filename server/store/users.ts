import { keepPreviousData, useQuery } from "@tanstack/react-query";
import * as api from "../services/api/users/users";

/** Paginated users list (server-side pagination). */
export const useUsers = (
  params: UserListParams = {},
  options: { enabled?: boolean } = {},
) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => api.getUsers(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
};
