"use client";
import { useMemo } from "react";
import type { GridPaginationModel } from "@mui/x-data-grid";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import DataTable from "@/app/Components/DataTable";
import { fmtNum } from "../utils/chartTheme";
import { buildRevenueColumns } from "../utils/revenueColumns";

type Props = {
  rows: DashboardRevenueRow[];
  total: number;
  loading?: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (m: GridPaginationModel) => void;
};

export default function RevenuesTable({
  rows,
  total,
  loading = false,
  paginationModel,
  onPaginationModelChange,
}: Props) {
  const columns = useMemo(() => buildRevenueColumns(), []);

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
