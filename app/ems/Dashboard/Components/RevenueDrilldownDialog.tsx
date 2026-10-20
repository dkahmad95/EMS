"use client";
import { useMemo } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Button } from "@/app/Components/Button";
import DataTable from "@/app/Components/DataTable";
import { sumByCurrencyType } from "../utils/aggregate";
import { fmtNum } from "../utils/chartTheme";
import { formatDateDisplay } from "../utils/date";
import { buildRevenueColumns } from "../utils/revenueColumns";

export type DrillTarget = { kind: "office" | "employee"; id: number; name: string };

type Props = {
  target: DrillTarget | null;
  /** already filtered to the target (subset of the dashboard's full row set) */
  rows: DashboardRevenueRow[];
  dateFrom: string;
  dateTo: string;
  onClose: () => void;
};

const rangeText = (from: string, to: string): string =>
  from && to
    ? from === to
      ? formatDateDisplay(from)
      : `${formatDateDisplay(from)} - ${formatDateDisplay(to)}`
    : from
      ? `من ${formatDateDisplay(from)}`
      : to
        ? `حتى ${formatDateDisplay(to)}`
        : "كل الفترات";

/** Popup opened by clicking a bar in the by-office / by-employee charts: that group's rows. */
export default function RevenueDrilldownDialog({ target, rows, dateFrom, dateTo, onClose }: Props) {
  // hide the column that would repeat the dialog title on every row
  const columns = useMemo(
    () => buildRevenueColumns().filter((c) => c.field !== target?.kind),
    [target?.kind],
  );
  const totals = useMemo(() => sumByCurrencyType(rows), [rows]);
  const usd = totals.USD.total + totals.OTHERS.total;

  const title = !target
    ? ""
    : target.kind === "office"
      ? `إيرادات المكتب: ${target.name}`
      : `إيرادات الموظف: ${target.name}`;

  return (
    <Dialog open={!!target} onClose={onClose} fullWidth maxWidth="lg" dir="rtl">
      <DialogTitle className="font-bold text-lg">{title}</DialogTitle>
      <DialogContent>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="badge badge-gray tabular-nums" dir="ltr">
            {rangeText(dateFrom, dateTo)}
          </span>
          <span className="badge badge-gray tabular-nums">{fmtNum(rows.length, 0)} سجل</span>
          <span className="badge badge-success tabular-nums" dir="ltr">
            {fmtNum(usd, 2)} $
          </span>
          {totals.LBP.total > 0 && (
            <span
              className="badge bg-sky-50 text-sky-700 border border-sky-200 tabular-nums"
              dir="ltr"
            >
              {fmtNum(totals.LBP.total, 0)} ل.ل
            </span>
          )}
        </div>
        <DataTable rows={rows} columns={columns} height={480} checkboxSelection={false} />
      </DialogContent>
      <DialogActions className="flex justify-end gap-3 p-4">
        <Button variant="muted" onClick={onClose}>
          إغلاق
        </Button>
      </DialogActions>
    </Dialog>
  );
}
