"use server";
import axios from "axios";
import * as api from "../../../routes/employees";
import { withToken } from "../auth/authRequests";

export const getEmployees = async (): Promise<Employee[] | null> =>
  withToken((decodedToken, authHeader) =>
    axios.get(api.EMPLOYEES_API.GET, {
      headers: authHeader,
      withCredentials: true,
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
    console.log(data)

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
