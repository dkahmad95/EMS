import {useQuery} from '@tanstack/react-query';
import * as api from '../services/api/destinations/destinations';

export const useDestinations = (options: {enabled?: boolean} = {enabled: true}) => {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: () => api.getDestinations(),
    enabled: options.enabled,
  });
};
