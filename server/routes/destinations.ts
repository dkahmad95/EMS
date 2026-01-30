const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;



export const DESTINATIONS_API: CrudApi = {
  CREATE: `${API_BASE_URL}/revenue-destinations`,
  GET: `${API_BASE_URL}/revenue-destinations`,
  UPDATE: (id: number) => `${API_BASE_URL}/revenue-destinations/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/revenue-destinations/${id}`,
};
