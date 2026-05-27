"use server";
import axios from "axios";
import * as api from "../../../routes/collections";
import { withToken } from "../auth/authRequests";

export const getCollections = async (): Promise<Collection[] | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.get(api.COLLECTIONS_API.GET, {
      headers: authHeader,
      withCredentials: true,
    }),
  );

export const getCollection = async (id: number): Promise<Collection | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.get(api.COLLECTIONS_API.GET_ONE(id), {
      headers: authHeader,
      withCredentials: true,
    }),
  );

export const createCollection = async (data: Omit<Collection, "id" | "employee" | "office" | "employeeName" | "officeName" | "userName" | "created_at" | "updated_at">): Promise<Collection | null> =>
  withToken((_decodedToken, authHeader) => {
    const data1 = {
      ...data,
      user_id: _decodedToken.sub,
    }
    return axios.post(api.COLLECTIONS_API.CREATE, data1, {
      headers: authHeader,
      withCredentials: true,
    })
  }

  );

export const updateCollection = async (
  id: number,
  data: Partial<Collection>,
): Promise<Collection | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.patch(api.COLLECTIONS_API.UPDATE(id), data, {
      headers: authHeader,
      withCredentials: true,
    }),
  );

export const deleteCollection = async (id: number): Promise<{ message: string } | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.delete(api.COLLECTIONS_API.DELETE(id), {
      headers: authHeader,
      withCredentials: true,
    }),
  );
