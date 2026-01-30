const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;



export const CITIES_API: CrudApi = {
  CREATE: `${API_BASE_URL}/cites`,
  GET: `${API_BASE_URL}/cites`,
  UPDATE: (id: number) => `${API_BASE_URL}/cites/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/cites/${id}`,
};
