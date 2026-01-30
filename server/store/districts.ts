import {useQuery} from '@tanstack/react-query';
import * as api from '../services/api/districts/districts';

export const useDistricts = (options: {enabled?: boolean} = {enabled: true}) => {
  return useQuery({
    queryKey: ['districts'],
    queryFn: () => api.getDistricts(),
    enabled: options.enabled,
  });
};
