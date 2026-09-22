"use client";
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { ChevronDownIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { usePermissions } from "@/app/hooks/usePermissions";
import { Button } from "@/app/Components/Button";
import { escapeHtml, openPrintWindow } from "@/app/utils/print";
import type { ChartDatum, SeriesDef } from "../types";
import { fmtNum } from "../utils/chartTheme";
import { formatDateDisplay } from "../utils/date";
import { useChartData } from "../hooks/useChartData";
import { DAILY_REPORT_CSS, buildDailyOfficeReportHtml } from "../print/dailyOfficeReport";

type Charts = ReturnType<typeof useChartData>;

type ReportKind = "daily" | "employee" | "office" | "destination" | "currency" | "time" | "log";

const REPORTS: { kind: ReportKind; label: string }[] = [
  { kind: "daily", label: "تقرير عمل يومي (المكاتب)" },
  { kind: "employee", label: "الإيرادات حسب الموظف" },
  { kind: "office", label: "الإيرادات حسب المكتب" },
  { kind: "destination", label: "الإيرادات حسب الوجهة" },
  { kind: "currency", label: "الإيرادات حسب العملة" },
  { kind: "time", label: "الإيرادات مع مرور الوقت" },
  { kind: "log", label: "سجل الإيرادات" },
];

type Props = {
  charts: Charts;
  /** full filtered row set (all=true) — the log prints ALL of these */
  rows: DashboardRevenueRow[];
  collections: Collection[];
  freezed: Collection[];
  employees: Employee[];
  offices: { id: number; name: string }[];
  /** offices pinned by the filter / switcher for the daily report; null = all with data */
  officeIds: number[] | null;
  dateFrom: string;
  dateTo: string;
  lbpRate: number | null;
  /** names of offices chosen in the dashboard filter (overrides the switcher name) */
  selectedOffices?: string[];
  loading?: boolean;
};

/** Table for the by-category / by-time reports: one column per currency series (USD units). */
const aggTable = (data: ChartDatum[], series: SeriesDef[], firstCol: string): string => {
  const head =
    `<tr><th>${escapeHtml(firstCol)}</th>` +
    series.map((s) => `<th>${escapeHtml(s.label)} ($)</th>`).join("") +
    `<th>المجموع ($)</th></tr>`;
  const body = data
    .map(
      (d) =>
        `<tr><td dir="auto">${escapeHtml(d.name)}</td>` +
        series.map((s) => `<td class="num">${fmtNum(Number(d[s.key]) || 0)}</td>`).join("") +
        `<td class="num">${fmtNum(d.total)}</td></tr>`,
    )
    .join("");
  const totals = series.map((s) => data.reduce((a, d) => a + (Number(d[s.key]) || 0), 0));
  const grand = data.reduce((a, d) => a + d.total, 0);
  const foot =
    `<tr><td>الإجمالي</td>` +
    totals.map((t) => `<td class="num">${fmtNum(t)}</td>`).join("") +
    `<td class="num">${fmtNum(grand)}</td></tr>`;
  return `<table><thead>${head}</thead><tbody>${body}</tbody><tfoot>${foot}</tfoot></table>`;
};

/** Full revenue log (mirrors the on-screen سجل الإيرادات columns). */
const logTable = (rows: DashboardRevenueRow[]): string => {
  const head =
    `<tr><th>#</th><th>التاريخ</th><th>الموظف</th><th>المكتب</th><th>الوجهة</th>` +
    `<th>العملة</th><th>المبلغ</th><th>المبلغ المعتمد</th><th>ملاحظات</th></tr>`;
  const body = rows
    .map((r, i) => {
      const type = (r.currency?.currency_type as unknown as string) ?? "OTHERS";
      const digits = type === "LBP" ? 0 : 2;
      return (
        `<tr><td class="num">${i + 1}</td>` +
        `<td class="num">${escapeHtml(formatDateDisplay(r.date))}</td>` +
        `<td dir="auto">${escapeHtml(r.employee?.name ?? "—")}</td>` +
        `<td dir="auto">${escapeHtml(r.office?.name ?? "—")}</td>` +
        `<td dir="auto">${escapeHtml(r.destination?.name ?? "—")}</td>` +
        `<td dir="auto">${escapeHtml(r.currency?.name ?? "—")}</td>` +
        `<td class="num">${fmtNum(r.revenue_amount, digits)} ${escapeHtml(r.currency?.code ?? "")}</td>` +
        `<td class="num">${fmtNum(r.display_amount, digits)}</td>` +
        `<td dir="auto">${escapeHtml(r.notes ?? "")}</td></tr>`
      );
    })
    .join("");
  const totalUsd = rows.reduce((a, r) => a + (Number(r.chart_amount) || 0), 0);
  const foot =
    `<tr><td colspan="6">الإجمالي (بالدولار)</td>` +
    `<td class="num" colspan="2">${fmtNum(totalUsd)} $</td><td></td></tr>`;
  return `<table><thead>${head}</thead><tbody>${body}</tbody><tfoot>${foot}</tfoot></table>`;
};

export default function PrintReportMenu({
  charts,
  rows,
  collections,
  freezed,
  employees,
  offices,
  officeIds,
  dateFrom,
  dateTo,
  lbpRate,
  selectedOffices = [],
  loading = false,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { availableOffices, currentOfficeId, username } = usePermissions();

  // same resolution as DashboardHeader's office chip
  const switcherName =
    currentOfficeId == null
      ? "جميع المكاتب"
      : availableOffices.find((o) => o.office_id === currentOfficeId)?.office_name ?? "المكتب الحالي";
  const officeName =
    selectedOffices.length === 0
      ? switcherName
      : selectedOffices.length === 1
        ? selectedOffices[0]
        : selectedOffices.join("، ");

  const rangeText =
    dateFrom && dateTo
      ? dateFrom === dateTo
        ? formatDateDisplay(dateFrom)
        : `${formatDateDisplay(dateFrom)} — ${formatDateDisplay(dateTo)}`
      : dateFrom
        ? `من ${formatDateDisplay(dateFrom)}`
        : dateTo
          ? `حتى ${formatDateDisplay(dateTo)}`
          : "كل الفترات";

  const metaHtml = (): string => {
    const parts = [
      `الفترة: <b dir="ltr">${escapeHtml(rangeText)}</b>`,
      `المكتب: <b>${escapeHtml(officeName)}</b>`,
      lbpRate != null && lbpRate > 0
        ? `سعر الصرف: <b dir="ltr">1 $ = ${fmtNum(lbpRate, 0)} ل.ل</b>`
        : "",
      `عدد السجلات: <b>${fmtNum(rows.length, 0)}</b>`,
      `تاريخ الطباعة: <b dir="ltr">${escapeHtml(new Date().toLocaleString("en-GB"))}</b>`,
    ].filter(Boolean);
    return `<div class="meta">${parts.map((p) => `<span>${p}</span>`).join("")}</div>`;
  };

  const handlePrint = (kind: ReportKind) => {
    setAnchorEl(null);
    const label = REPORTS.find((r) => r.kind === kind)?.label ?? "";
    if (kind === "daily") {
      const html = buildDailyOfficeReportHtml({
        rows,
        collections,
        freezed,
        employees,
        offices,
        officeIds,
        dateFrom,
        dateTo,
        username: username ?? "",
      });
      openPrintWindow(label, html, DAILY_REPORT_CSS);
      return;
    }
    let table = "";
    let extraCss = "";
    switch (kind) {
      case "employee":
        table = aggTable(charts.byEmployee.data, charts.byEmployee.series, "الموظف");
        break;
      case "office":
        table = aggTable(charts.byOffice.data, charts.byOffice.series, "المكتب");
        break;
      case "destination":
        table = aggTable(charts.byDestination.data, charts.byDestination.series, "الوجهة");
        break;
      case "currency":
        table = aggTable(charts.byCurrency.data, charts.byCurrency.series, "العملة");
        break;
      case "time":
        table = aggTable(charts.byTime.data, charts.byTime.series, "الفترة");
        break;
      case "log":
        table = logTable(rows);
        extraCss = "@page { size: A4 landscape; }";
        break;
    }
    openPrintWindow(label, `<h1>${escapeHtml(label)}</h1>${metaHtml()}${table}`, extraCss);
  };

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        disabled={loading}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        className="flex items-center gap-1.5"
        aria-haspopup="menu"
        aria-expanded={anchorEl ? "true" : undefined}
      >
        <PrinterIcon className="h-4 w-4" aria-hidden="true" />
        طباعة تقرير
        <ChevronDownIcon className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        dir="rtl"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {REPORTS.map((r) => (
          <MenuItem key={r.kind} onClick={() => handlePrint(r.kind)} className="text-sm">
            {r.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
