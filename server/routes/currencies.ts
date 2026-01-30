const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;



export const CURRENCIES_API: CrudApi = {
  CREATE: `${API_BASE_URL}/currencies`,
  GET: `${API_BASE_URL}/currencies`,
  UPDATE: (id: number) => `${API_BASE_URL}/currencies/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/currencies/${id}`,
};
