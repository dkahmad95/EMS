import {useQuery} from '@tanstack/react-query';
import * as api from '../services/api/offices/offices';

export const useOffices = (options: {enabled?: boolean} = {enabled: true}) => {
  return useQuery({
    queryKey: ['offices'],
    queryFn: () => api.getOffices(),
    enabled: options.enabled,
  });
};
