"use client";

import React from "react";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { DialogShell } from "@/app/Components/FormModal";
import { Button } from "@/app/Components/Button";
import { escapeHtml, openPrintWindow } from "@/app/utils/print";
import { FORM_HEADER_CSS, formHeaderHtml } from "@/app/ems/Dashboard/print/formHeader";

const reportDate = (report: OfficeReport | null): string =>
  report?.date?.split("T")[0] ?? report?.date ?? "";

/** Print a single office report from its row data (organisation header, description pre-wrapped). */
export const printOfficeReport = (report: OfficeReport): void => {
  const body =
    formHeaderHtml({
      title: "تقرير عمل المكتب",
      meta: [
        { label: "التاريخ", value: reportDate(report), ltr: true },
        { label: "الموظف", value: report.employee?.name ?? "—" },
        { label: "المكتب", value: report.employee?.office?.name ?? "—" },
        { label: "تاريخ الطباعة", value: new Date().toLocaleString("en-GB"), ltr: true },
      ],
    }) +
    `<table><tbody><tr><th style="width:120px">الوصف</th>` +
    `<td class="pre" dir="auto">${escapeHtml(report.description ?? "")}</td></tr></tbody></table>`;
  openPrintWindow("تقرير عمل المكتب", body, FORM_HEADER_CSS);
};

const Field = ({ label, value, ltr = false }: { label: string; value: React.ReactNode; ltr?: boolean }) => (
  <div>
    <p className="mb-0.5 text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-900" dir={ltr ? "ltr" : undefined}>
      {value ?? "—"}
    </p>
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
  <DialogShell
    open={open}
    onClose={onClose}
    title="عرض التقرير"
    size="md"
    footer={
      <>
        <Button variant="muted" onClick={onClose}>
          إغلاق
        </Button>
        <Button variant="primary" onClick={() => report && printOfficeReport(report)}>
          <PrinterIcon className="h-4 w-4" aria-hidden="true" />
          طباعة
        </Button>
      </>
    }
  >
    <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <Field label="الرقم" value={report?.id ?? "—"} ltr />
      <Field label="التاريخ" value={reportDate(report) || "—"} ltr />
      <Field label="الموظف" value={report?.employee?.name ?? "—"} />
      <Field label="المكتب" value={report?.employee?.office?.name ?? "—"} />
    </div>
    <p className="mb-1 text-xs text-gray-500">الوصف</p>
    <div className="max-h-[50vh] overflow-y-auto whitespace-pre-wrap break-words rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm leading-6 text-gray-800">
      {report?.description || "—"}
    </div>
  </DialogShell>
);

export default OfficeReportViewDialog;
