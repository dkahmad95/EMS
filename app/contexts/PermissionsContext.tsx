"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PermissionsContextType {
  decodedToken: DecodedToken | null;
  currentOfficeId: number | null; // null = all offices (for multi-office users)
  isLoading: boolean;
  switchOffice: (officeId: number | null) => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ 
  children, 
  initialToken 
}: { 
  children: ReactNode;
  initialToken: DecodedToken | null;
}) {
  const [decodedToken] = useState<DecodedToken | null>(initialToken);
  const [currentOfficeId, setCurrentOfficeId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasAllOfficesAccess = !!decodedToken && (decodedToken.is_admin || decodedToken.office_id == null);

  const isAllowedOffice = (officeId: number) =>
    decodedToken?.offices?.some((o) => o.office_id === officeId) ?? false;

  useEffect(() => {
    if (decodedToken) {
      // Validate the saved selection against the token's offices so a stale
      // value from a previous login can never leak into this session.
      const saved = localStorage.getItem('currentOfficeId');
      if (saved === 'all' && hasAllOfficesAccess) {
        setCurrentOfficeId(null);
      } else if (saved && saved !== 'all' && isAllowedOffice(Number(saved))) {
        setCurrentOfficeId(Number(saved));
      } else if (decodedToken.office_id != null) {
        setCurrentOfficeId(decodedToken.office_id);
      } else {
        setCurrentOfficeId(null); // all offices
      }
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedToken]);

  const switchOffice = (officeId: number | null) => {
    if (officeId === null) {
      if (!hasAllOfficesAccess) return;
      setCurrentOfficeId(null);
      localStorage.setItem('currentOfficeId', 'all');
      return;
    }
    if (isAllowedOffice(officeId)) {
      setCurrentOfficeId(officeId);
      localStorage.setItem('currentOfficeId', String(officeId));
    }
  };

  return (
    <PermissionsContext.Provider 
      value={{ 
        decodedToken, 
        currentOfficeId, 
        isLoading,
        switchOffice 
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissionsContext() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissionsContext must be used with in the permissionsProvider');
  }
  return context;
}