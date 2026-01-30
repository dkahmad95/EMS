const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;



export const OFFICES_API: CrudApi = {
  CREATE: `${API_BASE_URL}/offices`,
  GET: `${API_BASE_URL}/offices`,
  UPDATE: (id: number) => `${API_BASE_URL}/offices/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/offices/${id}`,
};
