const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;


export const USERS_API: CrudApi = {
  CREATE: `${API_BASE_URL}/users`,
  GET: `${API_BASE_URL}/users`,
  UPDATE: (id: number) => `${API_BASE_URL}/users/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/users/${id}`,
};