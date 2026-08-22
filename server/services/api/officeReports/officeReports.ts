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
