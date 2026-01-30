'use client';
import React from "react";
import { DataGrid, GridRowParams } from "@mui/x-data-grid";
import { prefixer } from "stylis";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { arSD } from "@mui/x-data-grid/locales";
import createCache from "@emotion/cache";

type DataTableProps = {
  rows: any[];
  columns: any[];
  handleEvent?: any;
};

// Create rtl cache
const cacheRtl = createCache({
  key: 'data-grid-rtl-demo',
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function DataTable({
  rows,
  columns,
  handleEvent,
}: DataTableProps) {
  const getRowClassName = (params: GridRowParams) => {
    return "cursor-pointer hover:bg-primary-50 transition-colors";
  };

  const existingTheme = useTheme();

  const theme = useMemo(
    () =>
      createTheme({}, arSD, existingTheme, {
        direction: "rtl",
        palette: {
          primary: {
            main: '#6366f1',
            light: '#818cf8',
            dark: '#4f46e5',
          },
          secondary: {
            main: '#a855f7',
            light: '#c084fc',
            dark: '#9333ea',
          },
        },
        components: {
          MuiDataGrid: {
            styleOverrides: {
              root: {
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-cell:focus-within': {
                  outline: 'none',
                },
              },
              columnHeaders: {
                backgroundColor: '#f8fafc',
                borderBottom: '2px solid #e2e8f0',
                '& .MuiDataGrid-columnHeader': {
                  fontWeight: 600,
                  color: '#475569',
                  '&:focus': {
                    outline: 'none',
                  },
                  '&:focus-within': {
                    outline: 'none',
                  },
                },
              },
              row: {
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
                '&.Mui-selected': {
                  backgroundColor: '#eef2ff',
                  '&:hover': {
                    backgroundColor: '#e0e7ff',
                  },
                },
              },
              cell: {
                borderBottom: '1px solid #f1f5f9',
                color: '#1e293b',
              },
              footerContainer: {
                borderTop: '2px solid #e2e8f0',
                backgroundColor: '#f8fafc',
              },
            },
          },
          MuiCheckbox: {
            styleOverrides: {
              root: {
                color: '#94a3b8',
                '&.Mui-checked': {
                  color: '#6366f1',
                },
              },
            },
          },
          MuiTablePagination: {
            styleOverrides: {
              root: {
                color: '#64748b',
              },
              select: {
                '&:focus': {
                  backgroundColor: 'transparent',
                },
              },
            },
          },
        },
      }),
    [existingTheme]
  );

  return (
    <div style={{ height: 400, width: "100%" }} className="shadow-soft rounded-xl overflow-hidden">
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <DataGrid
            rows={rows?.toReversed()}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            onRowDoubleClick={handleEvent}
            getRowClassName={getRowClassName}
          />
        </ThemeProvider>
      </CacheProvider>
    </div>
  );
}
