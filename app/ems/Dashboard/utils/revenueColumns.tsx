"use client";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { fmtNum } from "./chartTheme";
import { formatDateDisplay } from "./date";

const CURRENCY_BADGE: Record<string, string> = {
  USD: "badge badge-success",
  LBP: "badge bg-accent-50 text-accent-700 border border-accent-200",
  OTHERS: "badge badge-warning",
};

/**
 * Column definitions for dashboard revenue rows (سجل الإيرادات table and the
 * office / employee drill-down dialog). Call once per component (memoize).
 */
export const buildRevenueColumns = (): GridColDef<DashboardRevenueRow>[] => [
  {
    field: "date",
    headerName: "التاريخ",
    width: 120,
    sortable: false,
    renderCell: (p: GridRenderCellParams<DashboardRevenueRow>) => (
      <span className="tabular-nums" dir="ltr">
        {formatDateDisplay(p.row.date)}
      </span>
    ),
  },
  {
    field: "employee",
    headerName: "الموظف",
    minWidth: 150,
    flex: 0.8,
    sortable: false,
    valueGetter: (_v, row) => row.employee?.name ?? "—",
  },
  {
    field: "office",
    headerName: "المكتب",
    minWidth: 130,
    flex: 0.7,
    sortable: false,
    valueGetter: (_v, row) => row.office?.name ?? "—",
  },
  {
    field: "destination",
    headerName: "الوجهة",
    minWidth: 130,
    flex: 0.7,
    sortable: false,
    valueGetter: (_v, row) => row.destination?.name ?? "—",
  },
  {
    field: "currency",
    headerName: "العملة",
    width: 130,
    sortable: false,
    renderCell: (p: GridRenderCellParams<DashboardRevenueRow>) => {
      const c = p.row.currency;
      const type = (c?.currency_type as unknown as string) ?? "OTHERS";
      return (
        <span className={CURRENCY_BADGE[type] ?? "badge badge-gray"} title={c?.code ?? ""}>
          {c?.name ?? "—"}
        </span>
      );
    },
  },
  {
    field: "display_amount",
    headerName: "المبلغ",
    width: 150,
    sortable: false,
    align: "left",
    headerAlign: "left",
    renderCell: (p: GridRenderCellParams<DashboardRevenueRow>) => {
      const r = p.row;
      const isOther = (r.currency?.currency_type as unknown as string) === "OTHERS";
      const isLbp = (r.currency?.currency_type as unknown as string) === "LBP";
      return (
        <div className="flex h-full flex-col justify-center leading-tight" dir="ltr">
          <span className="font-semibold text-gray-900 tabular-nums">
            {fmtNum(r.display_amount, isLbp ? 0 : 2)}
          </span>
          {isOther && (
            <span className="text-[11px] text-gray-500 tabular-nums">
              {fmtNum(r.revenue_amount)} {r.currency?.code ?? ""}
            </span>
          )}
        </div>
      );
    },
  },
  {
    field: "receipts_count",
    headerName: "عدد الإيصالات",
    width: 120,
    sortable: false,
    align: "center",
    headerAlign: "center",
    valueGetter: (_v, row) => row.receipts_count ?? 1,
  },
  {
    field: "notes",
    headerName: "ملاحظات",
    flex: 1,
    minWidth: 160,
    sortable: false,
    renderCell: (p: GridRenderCellParams<DashboardRevenueRow>) => (
      <span className="truncate text-gray-600" title={p.row.notes ?? ""}>
        {p.row.notes || "—"}
      </span>
    ),
  },
];
