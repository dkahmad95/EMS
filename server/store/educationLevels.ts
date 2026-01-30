import {useQuery} from '@tanstack/react-query';
import * as api from '../services/api/educationLevels/educationLevels';

export const useEducationLevels = (options: {enabled?: boolean} = {enabled: true}) => {
  return useQuery({
    queryKey: ['educationLevels'],
    queryFn: () => api.getEducationLevels(),
    enabled: options.enabled,
  });
};
