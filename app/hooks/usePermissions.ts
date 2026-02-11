"use client";
import { usePermissionsContext } from "../contexts/PermissionsContext";

export const usePermissions = () => {
  const { decodedToken, currentOfficeId, isLoading, switchOffice } = usePermissionsContext();

  const currentOffice = decodedToken?.offices.find(
    o => o.office_id === currentOfficeId
  );

  const hasPermission = (
    resource: 'employees' | 'revenues' | 'users',
    action: 'create' | 'read' | 'update' | 'delete'
  ): boolean => {
    if (decodedToken?.is_admin) return true;
    return currentOffice?.permissions[resource]?.[action] || false;
  };

  const canAccessDashboard = (): boolean => {
    if (decodedToken?.is_admin) return true;
    return currentOffice?.permissions.dashboard.access || false;
  };

  const canAccessControlPanel = (): boolean => {
    if (decodedToken?.is_admin) return true;
    return currentOffice?.permissions.control_panel.access || false;
  };

  return {
    userId: decodedToken?.sub,
    username: decodedToken?.username,
    isAdmin: decodedToken?.is_admin || false,

    currentOfficeId,
    currentOffice,
    availableOffices: decodedToken?.offices || [],
    officeIds: decodedToken?.office_ids || [],
    switchOffice,

    hasPermission,
    canAccessDashboard,
    canAccessControlPanel,

    isLoading,
  };
};