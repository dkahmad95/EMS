const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

export const OFFICE_REPORTS_API = {
  CREATE:  `${API_BASE_URL}/office-reports`,
  GET:     `${API_BASE_URL}/office-reports`,
  GET_ONE: (id: number) => `${API_BASE_URL}/office-reports/${id}`,
  UPDATE:  (id: number) => `${API_BASE_URL}/office-reports/${id}`,
  DELETE:  (id: number) => `${API_BASE_URL}/office-reports/${id}`,
};
