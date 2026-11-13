const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

export const OFFICE_REPORTS_API = {
  CREATE:  `${API_BASE_URL}/office-reports`,
  GET:     `${API_BASE_URL}/office-reports`,
  GET_ONE: (id: number) => `${API_BASE_URL}/office-reports/${id}`,
  UPDATE:  (id: number) => `${API_BASE_URL}/office-reports/${id}`,
  DELETE:  (id: number) => `${API_BASE_URL}/office-reports/${id}`,
  ATTACHMENT_PRESIGN: (id: number) => `${API_BASE_URL}/office-reports/${id}/attachments/presign`,
  ATTACHMENT_CONFIRM: (id: number) => `${API_BASE_URL}/office-reports/${id}/attachments`,
  ATTACHMENT_URL: (id: number, attachmentId: number) =>
    `${API_BASE_URL}/office-reports/${id}/attachments/${attachmentId}/url`,
  ATTACHMENT_DELETE: (id: number, attachmentId: number) =>
    `${API_BASE_URL}/office-reports/${id}/attachments/${attachmentId}`,
};
