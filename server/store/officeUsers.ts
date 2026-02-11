import { useQuery } from '@tanstack/react-query';
import * as api from '../services/api/officeUsers/officeUsers';

export const useOfficeUsersById = (userId: number, options: { enabled?: boolean } = { enabled: true }) => {
  return useQuery({
    queryKey: ['officeUserById', userId],
    queryFn: () => api.getOfficeUserByUserId(userId),
    enabled: options.enabled,
  });
};
