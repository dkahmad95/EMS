const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;


export const PERMISSION_GROUPS_API: CrudApi = {
  CREATE: `${API_BASE_URL}/permission-groups`,
  GET: `${API_BASE_URL}/permission-groups`,
  UPDATE: (id: number) => `${API_BASE_URL}/permission-groups/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/permission-groups/${id}`,
};