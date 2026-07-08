"use client";
import { useMemo } from "react";
import { usePermissions } from "./usePermissions";

// Offices the current user can act on, read from the JWT, in the same
// { id, name } shape as useOffices() so form dropdowns can use it as a
// drop-in replacement without needing the control_panel-guarded /offices API.
export const useTokenOffices = () => {
  const { availableOffices } = usePermissions();

  const data = useMemo(
    () => availableOffices.map((o) => ({ id: o.office_id, name: o.office_name })),
    [availableOffices]
  );

  return { data };
};
