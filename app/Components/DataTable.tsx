'use client';
import React, { useRef } from "react";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";

type DataTableProps = {
  rows: any[];
  columns: any[];
  handleEvent?: any;
  /** Shows the DataGrid loading overlay (use react-query `isFetching`). */
  loading?: boolean;
  /** Page-size menu. Defaults to [25, 50, 100, 200] everywhere. */
  pageSizeOptions?: number[];
  /** Fill the parent's remaining flex height (parent must be `flex flex-col min-h-0`). */
  fullHeight?: boolean;
  /** Fixed height when not fullHeight (default 400). */
  height?: number | string;
  checkboxSelection?: boolean;
  className?: string;
  // ---- Server-side pagination (provide all three to enable) ----
  /** Total number of rows on the server (`total` from the paginated envelope). */
  rowCount?: number;
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
};

/**
 * Thin wrapper around MUI DataGrid. Theme, RTL and locale come from
 * app/theme/MuiProvider.tsx; this file only owns layout and pagination.
 */
export default function DataTable({
  rows,
  columns,
  handleEvent,
  loading = false,
  pageSizeOptions,
  fullHeight = false,
  height = 400,
  checkboxSelection = true,
  className,
  rowCount,
  paginationModel,
  onPaginationModelChange,
}: DataTableProps) {
  const isServer = !!paginationModel && !!onPaginationModelChange;

  // MUI warns if rowCount flips to undefined while a new page is loading; keep the last known total.
  const rowCountRef = useRef(rowCount ?? 0);
  if (rowCount !== undefined) rowCountRef.current = rowCount;

  const PAGE_SIZES = pageSizeOptions ?? [25, 50, 100, 200];

  const paginationProps = isServer
    ? {
        paginationMode: "server" as const,
        rowCount: rowCountRef.current,
        paginationModel,
        onPaginationModelChange,
        pageSizeOptions: PAGE_SIZES,
      }
    : {
        paginationMode: "client" as const,
        initialState: { pagination: { paginationModel: { page: 0, pageSize: PAGE_SIZES[0] } } },
        pageSizeOptions: PAGE_SIZES,
      };

  return (
    <div
      style={fullHeight ? { minHeight: 320, width: "100%" } : { height, width: "100%" }}
      className={[
        "rounded-lg overflow-hidden border border-gray-200 shadow-card bg-white",
        fullHeight ? "flex-1 min-h-0" : "",
        className ?? "",
      ].join(" ")}
    >
      <DataGrid
        rows={rows ?? []}
        columns={columns}
        loading={loading}
        {...paginationProps}
        keepNonExistentRowsSelected
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick
        onRowDoubleClick={handleEvent}
      />
    </div>
  );
}
