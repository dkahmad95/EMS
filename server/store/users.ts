import {useQuery} from '@tanstack/react-query';
import * as api from '../services/api/users/users';

export const useUsers = (options: {enabled?: boolean} = {enabled: true}) => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers(),
    enabled: options.enabled,
  });
};
