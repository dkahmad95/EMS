"use server";
import axios from "axios";
import * as api from "../../../routes/revenues";
import { withToken } from "../auth/authRequests";
import { cleanParams } from "../params";

/** Paginated list. Pass `{ all: true }` to get the full list in the same envelope. */
export const getRevenues = async (
  params: RevenueListParams = {},
): Promise<Paginated<Revenue> | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.get(api.REVENUES_API.GET, {
      headers: authHeader,
      withCredentials: true,
      params: cleanParams(params),
    }),
  );

export const getDashboardRevenues = async (
  officeId?: number | null,
): Promise<Revenue[] | null> =>
  withToken((decodedToken, authHeader) =>
    axios.get(api.REVENUES_API.GET_DASHBOARD, {
      headers: authHeader,
      withCredentials: true,
      params: officeId != null ? { office_id: officeId } : undefined,
    }),
  );

export const getRevenue = async (id: number): Promise<Revenue | null> =>
  withToken((decodedToken, authHeader) =>
    axios.get(api.REVENUES_API.GET_ONE(id), {
      headers: authHeader,
      withCredentials: true,
    }),
  );

export const createRevenue = async (data: Revenue): Promise<Revenue | null> =>
  withToken((decodedToken, authHeader) =>
    axios.post(api.REVENUES_API.CREATE, data, {
      headers: authHeader,
      withCredentials: true,
    }),
  );

export const updateRevenue = async (
  id: number,
  data: Partial<Revenue>,
): Promise<Revenue | null> =>
  withToken((decodedToken, authHeader) =>
    axios.patch(api.REVENUES_API.UPDATE(id), data, {
      headers: authHeader,
      withCredentials: true,
    }),
  );

export const deleteRevenue = async (id: number): Promise<any | null> =>
  withToken((decodedToken, authHeader) =>
    axios.delete(api.REVENUES_API.DELETE(id), {
      headers: authHeader,
      withCredentials: true,
    }),
  );
