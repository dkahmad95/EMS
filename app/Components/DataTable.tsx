'use client';
import React from "react";
import { DataGrid, GridRowParams } from "@mui/x-data-grid";
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
};

const cacheRtl = createCache({
  key: 'data-grid-rtl-demo',
  stylisPlugins: [prefixer, rtlPlugin],
  prepend: true,
});

export default function DataTable({ rows, columns, handleEvent }: DataTableProps) {
  const getRowClassName = (_params: GridRowParams) => "hover:bg-indigo-50/40 transition-colors";

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

  return (
    <div style={{ height: 400, width: "100%" }} className="rounded-xl overflow-hidden border border-gray-200 shadow-card">
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <DataGrid
            rows={rows?.toReversed()}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowDoubleClick={handleEvent}
            getRowClassName={getRowClassName}
          />
        </ThemeProvider>
      </CacheProvider>
    </div>
  );
}
