"use server";
import axios from "axios";
import * as api from "../../../routes/users";
import { withToken } from "../auth/authRequests";
import { cleanParams } from "../params";

/** Paginated list. Pass `{ all: true }` to get the full list in the same envelope. */
export const getUsers = async (
  params: UserListParams = {},
): Promise<Paginated<User> | null> =>
  withToken((decodedToken, authHeader) =>
    axios.get(api.USERS_API.GET, {
      headers: authHeader,
      withCredentials: true,
      params: cleanParams(params),
    }),
  );

export const createUser = async (data: CreateUserRequest): Promise<User | null> =>
  withToken((decodedToken, authHeader) =>
    axios.post(
      api.USERS_API.CREATE,
      data,
      {
        headers: authHeader,
        withCredentials: true,
      },
    ),
  );

export const updateUser = async (id: number, data: UpdateUserRequest): Promise<User | null> =>
  withToken((decodedToken, authHeader) =>
    axios.patch(
      api.USERS_API.UPDATE(id),
      data,
      {
        headers: authHeader,
        withCredentials: true,
      },
    ),
  );

export const deleteUser = async (id: number): Promise<any | null> =>
  withToken((decodedToken, authHeader) =>
    axios.delete(api.USERS_API.DELETE(id), {
      headers: authHeader,
      withCredentials: true,
    }),
  );