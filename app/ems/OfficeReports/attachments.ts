import * as api from "@/server/services/api/officeReports/officeReports";

/** Keep in sync with the backend (office-reports/dto/attachment.dto.ts). */
export const ATTACHMENT_MAX_SIZE = 10 * 1024 * 1024; // 10 MB
export const ATTACHMENTS_MAX_PER_REPORT = 10;
export const ATTACHMENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
export const ATTACHMENT_ACCEPT = ATTACHMENT_TYPES.join(",");

export const formatFileSize = (bytes: number): string =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/** Why a picked file can't be attached, or null when it is fine. */
export const attachmentError = (file: File): string | null => {
  if (!ATTACHMENT_TYPES.includes(file.type)) return `نوع الملف غير مسموح: ${file.name}`;
  if (file.size > ATTACHMENT_MAX_SIZE) return `حجم الملف يتجاوز 10 MB: ${file.name}`;
  if (file.size === 0) return `الملف فارغ: ${file.name}`;
  return null;
};

/** Upload one file: signed URL from the API, PUT straight to storage, then record it. */
export const uploadAttachment = async (reportId: number, file: File): Promise<void> => {
  const target = await api.presignOfficeReportAttachment(reportId, {
    file_name: file.name,
    content_type: file.type,
    size: file.size,
  });
  if (!target) throw new Error("تعذر تجهيز رفع الملف");

  const res = await fetch(target.url, { method: "PUT", body: file, headers: target.headers });
  if (!res.ok) throw new Error(`تعذر رفع الملف: ${file.name}`);

  await api.confirmOfficeReportAttachment(reportId, { key: target.key, file_name: file.name });
};

/**
 * Open an attachment in a new tab. The tab is opened before the signed URL is fetched,
 * otherwise the browser's popup blocker would stop it.
 */
export const openAttachment = async (reportId: number, attachmentId: number): Promise<boolean> => {
  const tab = window.open("", "_blank");
  try {
    const res = await api.getOfficeReportAttachmentUrl(reportId, attachmentId);
    if (!res?.url) throw new Error("no url");
    if (tab) tab.location.href = res.url;
    else window.location.href = res.url;
    return true;
  } catch {
    tab?.close();
    return false;
  }
};
