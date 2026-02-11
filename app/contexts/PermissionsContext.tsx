"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PermissionsContextType {
  decodedToken: DecodedToken | null;
  currentOfficeId: number | null;
  isLoading: boolean;
  switchOffice: (officeId: number) => void;
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

  useEffect(() => {
    if (decodedToken) {
      const savedOfficeId = localStorage.getItem('currentOfficeId');
      if (savedOfficeId && decodedToken.office_ids.includes(Number(savedOfficeId))) {
        setCurrentOfficeId(Number(savedOfficeId));
      } else if (decodedToken.office_ids.length > 0) {
        setCurrentOfficeId(decodedToken.office_ids[0]);
      }
    }
    setIsLoading(false);
  }, [decodedToken]);

  const switchOffice = (officeId: number) => {
    if (decodedToken?.office_ids.includes(officeId) || decodedToken?.is_admin) {
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