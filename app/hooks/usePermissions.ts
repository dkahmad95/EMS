"use client";

import { useState, useEffect } from "react";
import { decodeJwt } from "jose";

export const usePermissions = () => {
  const [currentOfficeId, setCurrentOfficeId] = useState<number | null>(null);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const decodeToken = () => {
      try {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(c => c.trim().startsWith('access_token='));

        if (!tokenCookie) {
          setIsLoading(false);
          return;
        }

        const token = tokenCookie.split('=')[1];
        const decoded = decodeJwt(token) as DecodedToken;
        setDecodedToken(decoded);

        const savedOfficeId = localStorage.getItem('currentOfficeId');
        if (savedOfficeId && decoded.office_ids.includes(Number(savedOfficeId))) {
          setCurrentOfficeId(Number(savedOfficeId));
        } else if (decoded.office_ids.length > 0) {
          setCurrentOfficeId(decoded.office_ids[0]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to decode token:', error);
        setIsLoading(false);
      }
    };

    decodeToken();
  }, [decodedToken]);

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

  const switchOffice = (officeId: number) => {
    if (decodedToken?.office_ids.includes(officeId) || decodedToken?.is_admin) {
      setCurrentOfficeId(officeId);
      localStorage.setItem('currentOfficeId', String(officeId));
    }
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