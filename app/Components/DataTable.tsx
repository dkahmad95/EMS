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
    return "cursor-pointer";
  };

   const existingTheme = useTheme();

  const theme =useMemo(
    () =>
      createTheme({}, arSD, existingTheme, {
        direction: "rtl", // RTL layout
      }),
    [existingTheme]
  );
  return (
    <div style={{ height: 400, width: "100%" }}>
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
        getRowClassName={getRowClassName} // Add cursor pointer to row
      />     </ThemeProvider>
    </CacheProvider>
    </div>
  );
}