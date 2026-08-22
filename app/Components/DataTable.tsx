'use client';
import React, { useRef } from "react";
import { DataGrid, GridRowParams, GridPaginationModel } from "@mui/x-data-grid";
import { prefixer } from "stylis";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, useTheme, createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { arSD } from "@mui/x-data-grid/locales";
import createCache from "@emotion/cache";

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

const cacheRtl = createCache({
  key: 'data-grid-rtl-demo',
  stylisPlugins: [prefixer, rtlPlugin],
  prepend: true,
});

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
  const getRowClassName = (_params: GridRowParams) => "hover:bg-indigo-50/40 transition-colors";

  const isServer = !!paginationModel && !!onPaginationModelChange;

  // MUI warns if rowCount flips to undefined while a new page is loading; keep the last known total.
  const rowCountRef = useRef(rowCount ?? 0);
  if (rowCount !== undefined) rowCountRef.current = rowCount;

  const existingTheme = useTheme();

  const theme = useMemo(
    () =>
      createTheme({}, arSD, existingTheme, {
        direction: "rtl",
        typography: {
          fontFamily: "'Cairo', system-ui, sans-serif",
        },
        palette: {
          primary: {
            main:  '#4f46e5',
            light: '#818cf8',
            dark:  '#3730a3',
          },
          secondary: {
            main:  '#7c3aed',
            light: '#a78bfa',
            dark:  '#5b21b6',
          },
        },
        components: {
          MuiDataGrid: {
            styleOverrides: {
              root: {
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                fontFamily: "'Cairo', system-ui, sans-serif",
                '& .MuiDataGrid-cell:focus': { outline: 'none' },
                '& .MuiDataGrid-cell:focus-within': { outline: 'none' },
              },
              columnHeaders: {
                backgroundColor: '#f9fafb',
                borderBottom: '2px solid #e5e7eb',
                '& .MuiDataGrid-columnHeader': {
                  fontWeight: 600,
                  color: '#4b5563',
                  fontFamily: "'Cairo', system-ui, sans-serif",
                  '&:focus': { outline: 'none' },
                  '&:focus-within': { outline: 'none' },
                },
              },
              row: {
                '&:hover': { backgroundColor: '#eef2ff' },
                '&.Mui-selected': {
                  backgroundColor: '#eef2ff',
                  '&:hover': { backgroundColor: '#e0e7ff' },
                },
              },
              cell: {
                borderBottom: '1px solid #f3f4f6',
                color: '#111827',
                fontFamily: "'Cairo', system-ui, sans-serif",
              },
              footerContainer: {
                borderTop: '2px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                fontFamily: "'Cairo', system-ui, sans-serif",
              },
            },
          },
          MuiCheckbox: {
            styleOverrides: {
              root: {
                color: '#d1d5db',
                '&.Mui-checked': { color: '#4f46e5' },
              },
            },
          },
          MuiTablePagination: {
            styleOverrides: {
              root: {
                color: '#6b7280',
                fontFamily: "'Cairo', system-ui, sans-serif",
              },
              select: { '&:focus': { backgroundColor: 'transparent' } },
            },
          },
        },
      }),
    [existingTheme]
  );

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
        "rounded-xl overflow-hidden border border-gray-200 shadow-card",
        fullHeight ? "flex-1 min-h-0" : "",
        className ?? "",
      ].join(" ")}
    >
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <DataGrid
            rows={rows ?? []}
            columns={columns}
            loading={loading}
            {...paginationProps}
            keepNonExistentRowsSelected
            checkboxSelection={checkboxSelection}
            disableRowSelectionOnClick
            onRowDoubleClick={handleEvent}
            getRowClassName={getRowClassName}
          />
        </ThemeProvider>
      </CacheProvider>
    </div>
  );
}
