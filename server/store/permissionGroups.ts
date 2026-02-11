import {useQuery} from '@tanstack/react-query';
import * as api from '../services/api/permissionGroups/permissionGroups';

export const usePermissionGroups = (options: {enabled?: boolean} = {enabled: true}) => {
  return useQuery({
    queryKey: ['permissionGroups'],
    queryFn: () => api.getPermissionGroups(),
    enabled: options.enabled,
  });
};
