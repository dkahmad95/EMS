"use server";
import axios from "axios";
import * as api from "../../../routes/officeUsers";
import { withToken } from "../auth/authRequests";

export const getOfficeUserByUserId = async (userId: number): Promise<OfficeUserByUserId | null> =>
  withToken((decodedToken, authHeader) =>
    axios.get(api.OFFICE_USERS_API.GET_BY_USER(userId), {
      headers: authHeader,
      withCredentials: true,
    }),
  );

export const bulkAssignOffices = async (data: AssignOfficesRequest): Promise<OfficeUser[] | null> =>
  withToken((decodedToken, authHeader) =>
    axios.post(
      api.OFFICE_USERS_API.BULK_ASSIGN,
      data,
      {
        headers: authHeader,
        withCredentials: true,
      },
    ),
  );