import {useQuery} from '@tanstack/react-query';
import * as api from '../services/api/cities/cities';

export const useCities = (options: {enabled?: boolean} = {enabled: true}) => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: () => api.getCities(),
    enabled: options.enabled,
  });
};
