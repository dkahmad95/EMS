"use server";
import axios from "axios";
import * as api from "../../../routes/freezedCollections";
import { withToken } from "../auth/authRequests";
import { cleanParams } from "../params";

/** Paginated list. Pass `{ all: true }` to get the full list in the same envelope. */
export const getFreezedCollections = async (
  params: FreezedCollectionListParams = {},
): Promise<Paginated<FreezedCollection> | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.get(api.FREEZED_COLLECTIONS_API.GET, {
      headers: authHeader,
      withCredentials: true,
      params: cleanParams(params),
    }),
  );

export const getFreezedCollection = async (id: number): Promise<FreezedCollection | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.get(api.FREEZED_COLLECTIONS_API.GET_ONE(id), {
      headers: authHeader,
      withCredentials: true,
    }),
  );

export const createFreezedCollection = async (data: Omit<FreezedCollection, "id" | "employee" | "office" | "employeeName" | "officeName" | "userName" | "created_at" | "updated_at">): Promise<FreezedCollection | null> =>
  withToken((_decodedToken, authHeader) => {
    const data1 = {
      ...data,
      user_id: _decodedToken.sub,
    }
    return axios.post(api.FREEZED_COLLECTIONS_API.CREATE, data1, {
      headers: authHeader,
      withCredentials: true,
    })
  }

  );

export const updateFreezedCollection = async (
  id: number,
  data: Partial<FreezedCollection>,
): Promise<FreezedCollection | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.patch(api.FREEZED_COLLECTIONS_API.UPDATE(id), data, {
      headers: authHeader,
      withCredentials: true,
    }),
  );

export const deleteFreezedCollection = async (id: number): Promise<{ message: string } | null> =>
  withToken((_decodedToken, authHeader) =>
    axios.delete(api.FREEZED_COLLECTIONS_API.DELETE(id), {
      headers: authHeader,
      withCredentials: true,
    }),
  );
