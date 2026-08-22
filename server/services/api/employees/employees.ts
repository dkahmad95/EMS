"use server";
import axios from "axios";
import * as api from "../../../routes/employees";
import { withToken } from "../auth/authRequests";
import { cleanParams } from "../params";

/** Paginated list. Pass `{ all: true }` to get the full list (dropdowns). */
export const getEmployees = async (
  params: EmployeeListParams = {},
): Promise<Paginated<Employee> | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.get(api.EMPLOYEES_API.GET, {
      headers: authHeader,
      withCredentials: true,
      params: cleanParams(params),
    }),
  );

export const getEmployee = async (id: number): Promise<Employee | null> =>
  withToken((decodedToken, authHeader) =>
    axios.get(api.EMPLOYEES_API.GET_ONE(id), {
      headers: authHeader,
      withCredentials: true,
    }),
  );

export const createEmployee = async (data: Employee): Promise<Employee | null> =>
  withToken((decodedToken, authHeader) => {
    return axios.post(api.EMPLOYEES_API.CREATE, data, {
      headers: authHeader,
      withCredentials: true,
    });
  }

  );

export const updateEmployee = async (
  id: number,
  data: Partial<Employee>,
): Promise<Employee | null> =>
  withToken((decodedToken, authHeader) =>
    axios.patch(api.EMPLOYEES_API.UPDATE(id), data, {
      headers: authHeader,
      withCredentials: true,
    }),
  );

export const deleteEmployee = async (id: number): Promise<any | null> =>
  withToken((decodedToken, authHeader) =>
    axios.delete(api.EMPLOYEES_API.DELETE(id), {
      headers: authHeader,
      withCredentials: true,
    }),
  );
