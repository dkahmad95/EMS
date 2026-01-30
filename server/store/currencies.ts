import {useQuery} from '@tanstack/react-query';
import * as api from '../services/api/currencies/currencies';

export const useCurrencies = (options: {enabled?: boolean} = {enabled: true}) => {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: () => api.getCurrencies(),
    enabled: options.enabled,
  });
};