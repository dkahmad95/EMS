"use server";
import axios from "axios";
import * as api from "../../../routes/officeReports";
import { withToken } from "../auth/authRequests";
import { cleanParams } from "../params";

export type OfficeReportPayload = {
  date: string;
  employee_id: number;
  description: string;
};

/** Paginated list of office reports (server-side pagination / search / filters). */
export const getOfficeReports = async (
  params: OfficeReportListParams = {},
): Promise<Paginated<OfficeReport> | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.get(api.OFFICE_REPORTS_API.GET, {
      headers: authHeader,
      withCredentials: true,
      params: cleanParams(params),
    }),
  );

export const getOfficeReport = async (id: number): Promise<OfficeReport | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.get(api.OFFICE_REPORTS_API.GET_ONE(id), {
      headers: authHeader,
      withCredentials: true,
    }),
  );

export const createOfficeReport = async (
  data: OfficeReportPayload,
): Promise<OfficeReport | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.post(api.OFFICE_REPORTS_API.CREATE, data, {
      headers: authHeader,
      withCredentials: true,
    }),
  );

export const updateOfficeReport = async (
  id: number,
  data: Partial<OfficeReportPayload>,
): Promise<OfficeReport | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.patch(api.OFFICE_REPORTS_API.UPDATE(id), data, {
      headers: authHeader,
      withCredentials: true,
    }),
  );

export const deleteOfficeReport = async (
  id: number,
): Promise<{ message: string } | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.delete(api.OFFICE_REPORTS_API.DELETE(id), {
      headers: authHeader,
      withCredentials: true,
    }),
  );

// ── Attachments (Neon Object Storage) ──
// The file itself never passes through here: the browser PUTs it straight to the signed URL.

export type AttachmentUploadTarget = {
  key: string;
  url: string;
  headers: Record<string, string>;
};

/** Step 1: get a short-lived upload URL for one file. */
export const presignOfficeReportAttachment = async (
  reportId: number,
  data: { file_name: string; content_type: string; size: number },
): Promise<AttachmentUploadTarget | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.post(api.OFFICE_REPORTS_API.ATTACHMENT_PRESIGN(reportId), data, {
      headers: authHeader,
      withCredentials: true,
    }),
  );

/** Step 2: record the uploaded file on the report. */
export const confirmOfficeReportAttachment = async (
  reportId: number,
  data: { key: string; file_name: string },
): Promise<OfficeReportAttachment | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.post(api.OFFICE_REPORTS_API.ATTACHMENT_CONFIRM(reportId), data, {
      headers: authHeader,
      withCredentials: true,
    }),
  );

/** Short-lived URL to view / download an attachment. */
export const getOfficeReportAttachmentUrl = async (
  reportId: number,
  attachmentId: number,
): Promise<{ url: string } | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.get(api.OFFICE_REPORTS_API.ATTACHMENT_URL(reportId, attachmentId), {
      headers: authHeader,
      withCredentials: true,
    }),
  );

export const deleteOfficeReportAttachment = async (
  reportId: number,
  attachmentId: number,
): Promise<{ message: string } | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.delete(api.OFFICE_REPORTS_API.ATTACHMENT_DELETE(reportId, attachmentId), {
      headers: authHeader,
      withCredentials: true,
    }),
  );
