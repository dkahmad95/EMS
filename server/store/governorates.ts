import {useQuery} from '@tanstack/react-query';
import * as api from '../services/api/governorates/governorates';

export const useGovernorates = (options: {enabled?: boolean} = {enabled: true}) => {
  return useQuery({
    queryKey: ['governorates'],
    queryFn: () => api.getGovernorates(),
    enabled: options.enabled,
  });
};
