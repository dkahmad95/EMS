"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { GridPaginationModel } from "@mui/x-data-grid";
import { useDebouncedValue } from "./useDebouncedValue";

type Options = {
  pageSize?: number;
  /** Any values that should reset the table to the first page when they change (e.g. currentOfficeId, filters). */
  resetDeps?: unknown[];
};

/**
 * Holds server-side table state (DataGrid 0-based pagination model + debounced search)
 * and exposes the 1-based `params` expected by the paginated API.
 *
 * const table = useServerTable({ resetDeps: [currentOfficeId] });
 * const { data } = useEmployees({ ...table.params, office_id: currentOfficeId });
 * <DataTable rows={data?.data ?? []} rowCount={data?.total}
 *            paginationModel={table.paginationModel}
 *            onPaginationModelChange={table.setPaginationModel} />
 */
export function useServerTable({ pageSize = 10, resetDeps = [] }: Options = {}) {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const search = useDebouncedValue(searchTerm.trim(), 400);

  const resetPage = useCallback(
    () => setPaginationModel((m) => (m.page === 0 ? m : { ...m, page: 0 })),
    [],
  );

  // New search or external filter change -> back to first page
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { resetPage(); }, [search, resetPage, ...resetDeps]);

  const params = useMemo(
    () => ({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      search: search || undefined,
    }),
    [paginationModel.page, paginationModel.pageSize, search],
  );

  return {
    paginationModel,
    setPaginationModel,
    searchTerm,
    setSearchTerm,
    search,
    params,
    resetPage,
  };
}
