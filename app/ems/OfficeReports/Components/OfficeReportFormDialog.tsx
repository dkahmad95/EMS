"use client";

import React, { useEffect, useRef, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { PaperClipIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import FormModal from "@/app/Components/FormModal";
import { Button } from "@/app/Components/Button";
import { useAllEmployees } from "@/server/store/employees";
import * as api from "@/server/services/api/officeReports/officeReports";
import {
  ATTACHMENT_ACCEPT,
  ATTACHMENTS_MAX_PER_REPORT,
  attachmentError,
  formatFileSize,
  uploadAttachment,
} from "../attachments";

interface OfficeReportFormDialogProps {
  open: boolean;
  onClose: () => void;
  selectedReport: OfficeReport | null;
}

const DESCRIPTION_MAX = 10000;

/** Server Actions mask error text in production — show the backend message only when it survives. */
const showApiError = (err: unknown, fallback: string) => {
  const m = err instanceof Error ? err.message : "";
  const usable =
    m && m.length < 300 && m !== "Invalid or expired token" && !/^An error occurred/i.test(m);
  message.error(usable ? m : fallback);
};

const AttachmentRow = ({
  name,
  size,
  isNew = false,
  disabled,
  onRemove,
}: {
  name: string;
  size: number;
  isNew?: boolean;
  disabled: boolean;
  onRemove: () => void;
}) => (
  <li className="flex items-center gap-2 px-3 py-2 text-sm">
    <span className="min-w-0 flex-1 truncate text-gray-800" dir="auto" title={name}>
      {name}
    </span>
    {isNew && <span className="badge bg-primary-50 text-primary-700">جديد</span>}
    <span className="shrink-0 text-xs text-gray-500 tabular-nums" dir="ltr">
      {formatFileSize(size)}
    </span>
    <button
      type="button"
      onClick={onRemove}
      disabled={disabled}
      aria-label={`إزالة ${name}`}
      className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <XMarkIcon className="h-4 w-4" aria-hidden="true" />
    </button>
  </li>
);

const emptyForm = () => ({
  employeeId: null as number | null,
  date: "",
  description: "",
});

const OfficeReportFormDialog: React.FC<OfficeReportFormDialogProps> = ({
  open,
  onClose,
  selectedReport,
}) => {
  const queryClient = useQueryClient();
  const isEditing = selectedReport !== null;

  const { data: employeeList } = useAllEmployees();

  const [form, setForm] = useState(emptyForm());
  // Attachments are applied on save: new files are uploaded, removed ones deleted.
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [removedIds, setRemovedIds] = useState<number[]>([]);
  const [savingFiles, setSavingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const keptAttachments = (selectedReport?.attachments ?? []).filter(
    (a) => !removedIds.includes(a.id),
  );
  const attachmentCount = keptAttachments.length + newFiles.length;

  const handlePickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow picking the same file again
    const accepted: File[] = [];
    for (const file of picked) {
      const error = attachmentError(file);
      if (error) {
        message.error(error);
      } else if (attachmentCount + accepted.length >= ATTACHMENTS_MAX_PER_REPORT) {
        message.error(`الحد الأقصى ${ATTACHMENTS_MAX_PER_REPORT} مرفقات لكل تقرير`);
        break;
      } else {
        accepted.push(file);
      }
    }
    if (accepted.length) setNewFiles((p) => [...p, ...accepted]);
  };

  useEffect(() => {
    if (!open) return;
    setNewFiles([]);
    setRemovedIds([]);
    if (selectedReport) {
      setForm({
        employeeId: selectedReport.employee_id,
        date: selectedReport.date?.split("T")[0] ?? selectedReport.date ?? "",
        description: selectedReport.description ?? "",
      });
    } else {
      setForm(emptyForm());
    }
  }, [open, selectedReport]);

  const { mutateAsync: createReport, isPending: isCreating } = useMutation({
    mutationFn: (data: api.OfficeReportPayload) => api.createOfficeReport(data),
    onError: (err: unknown) => {
      showApiError(err, "حدث خطأ أثناء إضافة التقرير.");
    },
  });

  const { mutateAsync: updateReport, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<api.OfficeReportPayload> }) =>
      api.updateOfficeReport(id, data),
    onError: (err: unknown) => {
      showApiError(err, "حدث خطأ أثناء تحديث التقرير.");
    },
  });

  const isPending = isCreating || isUpdating || savingFiles;

  const isFormValid =
    form.employeeId !== null && form.date !== "" && form.description.trim() !== "";

  const handleSave = async () => {
    if (!isFormValid) return;

    const payload: api.OfficeReportPayload = {
      employee_id: form.employeeId!,
      date: form.date,
      description: form.description.trim(),
    };

    let reportId: number | undefined;
    try {
      const saved =
        isEditing && selectedReport?.id
          ? await updateReport({ id: selectedReport.id, data: payload })
          : await createReport(payload);
      reportId = saved?.id ?? selectedReport?.id;
    } catch {
      return; // the mutation's onError already showed the message
    }

    // The report is saved; now apply the attachment changes to it.
    let attachmentsOk = true;
    if (reportId != null && (newFiles.length || removedIds.length)) {
      setSavingFiles(true);
      try {
        for (const id of removedIds) await api.deleteOfficeReportAttachment(reportId, id);
        for (const file of newFiles) await uploadAttachment(reportId, file);
      } catch {
        attachmentsOk = false;
      } finally {
        setSavingFiles(false);
      }
    }

    queryClient.invalidateQueries({ queryKey: ["officeReports"] });
    if (attachmentsOk) {
      message.success(isEditing ? "تم تحديث التقرير بنجاح" : "تم إضافة التقرير بنجاح");
    } else {
      message.warning("تم حفظ التقرير، لكن تعذر حفظ بعض المرفقات. عدّل التقرير لإعادة المحاولة.");
    }
    onClose();
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={isEditing ? "تعديل تقرير" : "إضافة تقرير"}
      onConfirm={handleSave}
      isLoading={isPending}
      confirmLabel={isEditing ? "تحديث" : "إضافة"}
      size="md"
    >
      <Autocomplete
        options={employeeList ?? []}
        getOptionLabel={(option) => option.name}
        value={employeeList?.find((e) => e.id === form.employeeId) ?? null}
        onChange={(_, val) => setForm((p) => ({ ...p, employeeId: val?.id ?? null }))}
        renderInput={(params) => (
          <TextField {...params} label="اسم الموظف" size="small" required />
        )}
        fullWidth
      />

      <TextField
        type="date"
        label="التاريخ"
        value={form.date}
        onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
        slotProps={{ inputLabel: { shrink: true } }}
        fullWidth
        size="small"
        required
      />

      <TextField
        label="الوصف"
        value={form.description}
        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
        fullWidth
        size="small"
        multiline
        rows={4}
        required
        slotProps={{ htmlInput: { maxLength: DESCRIPTION_MAX } }}
        helperText={`${form.description.length.toLocaleString("en-US")} / ${DESCRIPTION_MAX.toLocaleString("en-US")}`}
      />

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-gray-900">
            المرفقات
            <span className="ms-1.5 text-xs font-normal text-gray-500 tabular-nums">
              {attachmentCount} / {ATTACHMENTS_MAX_PER_REPORT}
            </span>
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={isPending || attachmentCount >= ATTACHMENTS_MAX_PER_REPORT}
            onClick={() => fileInputRef.current?.click()}
          >
            <PaperClipIcon className="h-4 w-4" aria-hidden="true" />
            إضافة ملف
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            accept={ATTACHMENT_ACCEPT}
            onChange={handlePickFiles}
          />
        </div>

        {attachmentCount === 0 ? (
          <p className="text-xs text-gray-500">صور، PDF، Word أو Excel — حتى 10 MB للملف.</p>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
            {keptAttachments.map((a) => (
              <AttachmentRow
                key={`saved-${a.id}`}
                name={a.file_name}
                size={a.size}
                disabled={isPending}
                onRemove={() => setRemovedIds((p) => [...p, a.id])}
              />
            ))}
            {newFiles.map((f, i) => (
              <AttachmentRow
                key={`new-${i}-${f.name}`}
                name={f.name}
                size={f.size}
                isNew
                disabled={isPending}
                onRemove={() => setNewFiles((p) => p.filter((_, idx) => idx !== i))}
              />
            ))}
          </ul>
        )}
      </div>
    </FormModal>
  );
};

export default OfficeReportFormDialog;
