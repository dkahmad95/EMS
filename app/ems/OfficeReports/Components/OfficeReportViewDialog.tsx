"use client";

import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/Components/Button";
import { escapeHtml, openPrintWindow } from "@/app/utils/print";

const reportDate = (report: OfficeReport | null): string =>
  report?.date?.split("T")[0] ?? report?.date ?? "";

/** Print a single office report from its row data (RTL window, description pre-wrapped). */
export const printOfficeReport = (report: OfficeReport): void => {
  const fields: [string, string][] = [
    ["التاريخ", reportDate(report)],
    ["الموظف", report.employee?.name ?? "—"],
    ["المكتب", report.employee?.office?.name ?? "—"],
  ];
  const body =
    `<h1>تقرير عمل المكتب</h1>` +
    `<div class="meta"><span>تاريخ الطباعة: <b dir="ltr">${escapeHtml(
      new Date().toLocaleString("en-GB"),
    )}</b></span></div>` +
    `<table><tbody>` +
    fields
      .map(
        ([k, v]) =>
          `<tr><th style="width:120px">${escapeHtml(k)}</th><td dir="auto">${escapeHtml(v)}</td></tr>`,
      )
      .join("") +
    `<tr><th>الوصف</th><td class="pre" dir="auto">${escapeHtml(report.description ?? "")}</td></tr>` +
    `</tbody></table>`;
  openPrintWindow("تقرير عمل المكتب", body);
};

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="mb-0.5 text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-900">{value ?? "—"}</p>
  </div>
);

interface OfficeReportViewDialogProps {
  open: boolean;
  onClose: () => void;
  report: OfficeReport | null;
}

const OfficeReportViewDialog: React.FC<OfficeReportViewDialogProps> = ({
  open,
  onClose,
  report,
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" dir="rtl">
    <DialogTitle className="font-bold text-lg">عرض التقرير</DialogTitle>
    <DialogContent>
      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label="الرقم" value={report?.id ?? "—"} />
        <Field label="التاريخ" value={reportDate(report) || "—"} />
        <Field label="الموظف" value={report?.employee?.name ?? "—"} />
        <Field label="المكتب" value={report?.employee?.office?.name ?? "—"} />
      </div>
      <p className="mb-1 text-xs text-gray-500">الوصف</p>
      <div className="max-h-[50vh] overflow-y-auto whitespace-pre-wrap break-words rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm leading-6 text-gray-800">
        {report?.description || "—"}
      </div>
    </DialogContent>
    <DialogActions className="flex justify-end gap-3 p-4">
      <Button variant="muted" onClick={onClose}>
        إغلاق
      </Button>
      <Button
        variant="primary"
        onClick={() => report && printOfficeReport(report)}
        className="flex items-center gap-2"
      >
        <PrinterIcon className="h-4 w-4" />
        طباعة
      </Button>
    </DialogActions>
  </Dialog>
);

export default OfficeReportViewDialog;
