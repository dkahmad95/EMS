"use client";
import { useMemo } from "react";
import type { GridColDef, GridPaginationModel, GridRenderCellParams } from "@mui/x-data-grid";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import DataTable from "@/app/Components/DataTable";
import { fmtNum } from "../utils/chartTheme";
import { formatDateDisplay } from "../utils/date";

type Props = {
  rows: DashboardRevenueRow[];
  total: number;
  loading?: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (m: GridPaginationModel) => void;
};

const CURRENCY_BADGE: Record<string, string> = {
  USD: "badge badge-success",
  LBP: "badge bg-sky-50 text-sky-700 border border-sky-200",
  OTHERS: "badge badge-warning",
};

export default function RevenuesTable({
  rows,
  total,
  loading = false,
  paginationModel,
  onPaginationModelChange,
}: Props) {
  const columns = useMemo<GridColDef<DashboardRevenueRow>[]>(
    () => [
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
    ],
    [],
  );

  return (
    <section className="card p-5" aria-label="سجل الإيرادات">
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-50 text-secondary-600">
            <TableCellsIcon className="h-4 w-4" aria-hidden="true" />
          </span>
          سجل الإيرادات
        </h2>
        <span className="badge badge-gray tabular-nums" title="إجمالي السجلات">
          {fmtNum(total, 0)} سجل
        </span>
      </header>
      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        rowCount={total}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[25, 50, 100, 200]}
        height={640}
        checkboxSelection={false}
      />
    </section>
  );
}
