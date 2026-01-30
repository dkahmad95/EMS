import {useQuery} from '@tanstack/react-query';
import * as api from '../services/api/jobTitles/jobTitles';

export const useJobTitles = (options: {enabled?: boolean} = {enabled: true}) => {
  return useQuery({
    queryKey: ['jobTitles'],
    queryFn: () => api.getJobTitles(),
    enabled: options.enabled,
  });
};
