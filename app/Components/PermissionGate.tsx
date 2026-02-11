"use client";

import { usePermissions } from "../hooks/usePermissions";
import { ReactNode } from "react";

interface PermissionGateProps {
  resource: 'employees' | 'revenues' | 'users';
  action: 'create' | 'read' | 'update' | 'delete';
  children: ReactNode;
  fallback?: ReactNode;
}

export default function PermissionGate({ 
  resource, 
  action, 
  children, 
  fallback = null 
}: PermissionGateProps) {
  const { hasPermission, isLoading } = usePermissions();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}