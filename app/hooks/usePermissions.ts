"use client";
import { usePermissionsContext } from "../contexts/PermissionsContext";

export const usePermissions = () => {
  const { decodedToken, currentOfficeId, isLoading, switchOffice } = usePermissionsContext();


  const hasPermission = (
    resource: 'employees' | 'revenues' | 'users' | 'collections',
    action: 'create' | 'read' | 'update' | 'delete'
  ): boolean => {
    if (decodedToken?.is_admin) return true;
    return decodedToken?.permissions[resource]?.[action] || false;
  };

  const canAccessDashboard = (): boolean => {
    if (decodedToken?.is_admin) return true;
    return decodedToken?.permissions.dashboard.access || false;
  };

  const canAccessControlPanel = (): boolean => {
    if (decodedToken?.is_admin) return true;
    return decodedToken?.permissions.control_panel.access || false;
  };

  return {
    userId: decodedToken?.sub,
    username: decodedToken?.username,
    isAdmin: decodedToken?.is_admin || false,
    currentOfficeId,
    availableOffices: decodedToken?.offices || [],
    officeIds: decodedToken?.office_ids || [],
    switchOffice,
    hasPermission,
    canAccessDashboard,
    canAccessControlPanel,

    isLoading,
  };
};