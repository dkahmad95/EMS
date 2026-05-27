const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

interface UsersApi {
  CREATE: string;
  GET: string;
  UPDATE: (id: number) => string;
  DELETE: (id: number) => string;
}

export const USERS_API: UsersApi = {
  CREATE: `${API_BASE_URL}/users`,
  GET: `${API_BASE_URL}/users`,
  UPDATE: (id: number) => `${API_BASE_URL}/users/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/users/${id}`,
};