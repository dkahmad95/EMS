"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { arSA } from "@mui/material/locale";
import { arSD } from "@mui/x-data-grid/locales";
import { prefixer } from "stylis";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import type {} from "@mui/x-data-grid/themeAugmentation";
import tokens from "./tokens";

const { primary, gray, danger, radius, easing, duration, font, shadow } = tokens;

/**
 * One MUI theme for the whole app, built from app/theme/tokens.js.
 * RTL is handled once here through the emotion cache (stylis rtl plugin).
 */
const theme = createTheme(
  {
    direction: "rtl",
    palette: {
      primary: { main: primary[600], light: primary[400], dark: primary[700], contrastText: "#ffffff" },
      error: { main: danger[600], light: danger[400], dark: danger[700] },
      grey: gray,
      divider: gray[200],
      text: { primary: gray[900], secondary: gray[500], disabled: gray[400] },
      background: { default: gray[50], paper: "#ffffff" },
    },
    shape: { borderRadius: radius.lg },
    typography: {
      fontFamily: font,
      button: { textTransform: "none", fontWeight: 600 },
    },
    transitions: {
      duration: {
        shortest: duration.fast,
        shorter: duration.fast,
        short: duration.base,
        standard: duration.base,
        complex: duration.slow,
        enteringScreen: duration.base,
        leavingScreen: duration.fast,
      },
      easing: {
        easeOut: easing.enter,
        easeIn: easing.exit,
        easeInOut: "cubic-bezier(0.77, 0, 0.175, 1)",
        sharp: easing.exit,
      },
    },
    components: {
      MuiButtonBase: {
        defaultProps: { disableRipple: true },
      },
      MuiTextField: {
        defaultProps: { size: "small" },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
            backgroundColor: "#ffffff",
            transition: `box-shadow ${duration.fast}ms ${easing.enter}`,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: gray[300],
              transition: `border-color ${duration.fast}ms ${easing.enter}`,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: gray[400] },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: primary[500],
              borderWidth: 2,
            },
            "&.Mui-focused": { boxShadow: `0 0 0 3px ${primary[100]}` },
            "&.Mui-error .MuiOutlinedInput-notchedOutline": { borderColor: danger[400] },
            "&.Mui-error.Mui-focused": { boxShadow: `0 0 0 3px ${danger[100]}` },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            "&.Mui-focused": { color: primary[700] },
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: { marginInline: 2 },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          paper: {
            borderRadius: radius.lg,
            boxShadow: shadow.dropdown,
            border: `1px solid ${gray[200]}`,
          },
          option: {
            '&[aria-selected="true"]': { backgroundColor: `${primary[50]} !important` },
            "&.Mui-focused": { backgroundColor: gray[100] },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: radius.lg,
            boxShadow: shadow.dropdown,
            border: `1px solid ${gray[200]}`,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: radius.md,
            marginInline: 4,
            "&.Mui-selected": { backgroundColor: primary[50] },
            "&.Mui-selected:hover": { backgroundColor: primary[100] },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 999, fontWeight: 500 },
          colorPrimary: { backgroundColor: primary[50], color: primary[700] },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: radius.xl,
            boxShadow: shadow.modal,
            border: `1px solid ${gray[200]}`,
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(17, 24, 39, 0.45)",
            "&.MuiBackdrop-invisible": { backgroundColor: "transparent" },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: gray[300],
            "&.Mui-checked": { color: primary[600] },
            "&.MuiCheckbox-indeterminate": { color: primary[600] },
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          root: { color: gray[500] },
          select: { "&:focus": { backgroundColor: "transparent" } },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: `1px solid ${gray[200]}`,
            borderRadius: radius.lg,
            backgroundColor: "#ffffff",
            "--DataGrid-rowBorderColor": gray[100],
            // Keyboard focus stays visible; mouse clicks do not paint an outline.
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": { outline: "none" },
            "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-cell:focus-visible, & .MuiDataGrid-columnHeader:focus-visible": {
              outline: `2px solid ${primary[500]}`,
              outlineOffset: -2,
            },
          },
          columnHeaders: {
            backgroundColor: gray[50],
            borderBottom: `2px solid ${gray[200]}`,
          },
          columnHeader: {
            fontWeight: 600,
            color: gray[600],
            backgroundColor: gray[50],
          },
          columnHeaderTitle: { fontWeight: 600 },
          row: {
            transition: `background-color ${duration.fast}ms ${easing.enter}`,
            "&:hover": { backgroundColor: primary[50] },
            "&.Mui-selected": {
              backgroundColor: primary[50],
              "&:hover": { backgroundColor: primary[100] },
            },
          },
          cell: {
            borderBottom: `1px solid ${gray[100]}`,
            color: gray[900],
          },
          footerContainer: {
            borderTop: `2px solid ${gray[200]}`,
            backgroundColor: gray[50],
          },
        },
      },
    },
  },
  arSA,
  arSD
);

export function MuiProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider
      options={{ key: "mui", stylisPlugins: [prefixer, rtlPlugin], prepend: true }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
}

export { theme };
