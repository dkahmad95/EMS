const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;



export const DISTRICTS_API: CrudApi = {
  CREATE: `${API_BASE_URL}/districts`,
  GET: `${API_BASE_URL}/districts`,
  UPDATE: (id: number) => `${API_BASE_URL}/districts/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/districts/${id}`,
};
