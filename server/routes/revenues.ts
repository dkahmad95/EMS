const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

export const REVENUES_API = {
  CREATE: `${API_BASE_URL}/revenues`,
  GET: `${API_BASE_URL}/revenues`,
  GET_ONE: (id: number) => `${API_BASE_URL}/revenues/${id}`,
  UPDATE: (id: number) => `${API_BASE_URL}/revenues/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/revenues/${id}`,
};
