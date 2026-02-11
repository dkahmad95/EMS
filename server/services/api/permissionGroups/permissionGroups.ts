"use server";
import axios from "axios";
import * as api from "../../../routes/permissionGroups";
import { withToken } from "../auth/authRequests";

export const getPermissionGroups = async (): Promise<PermissionGroup[] | null> =>
  withToken((decodedToken, authHeader) =>
    axios.get(api.PERMISSION_GROUPS_API.GET, {
      headers: authHeader,
      withCredentials: true,
    }),
  );

export const createPermissionGroup = async (data: PermissionGroup): Promise<PermissionGroup | null> =>
  withToken((decodedToken, authHeader) =>
    axios.post(
      api.PERMISSION_GROUPS_API.CREATE,
      data,
      {
        headers: authHeader,
        withCredentials: true,
      },
    ),
  );

export const updatePermissionGroup = async (id: number, data: PermissionGroup): Promise<PermissionGroup | null> =>
  withToken((decodedToken, authHeader) =>
    axios.patch(
      api.PERMISSION_GROUPS_API.UPDATE(id),
      data,
      {
        headers: authHeader,
        withCredentials: true,
      },
    ),
  );

export const deletePermissionGroup = async (id: number): Promise<any | null> =>
  withToken((decodedToken, authHeader) =>
    axios.delete(api.PERMISSION_GROUPS_API.DELETE(id), {
      headers: authHeader,
      withCredentials: true,
    }),
  );