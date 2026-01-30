const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;



export const GOVERNORATES_API: CrudApi = {
  CREATE: `${API_BASE_URL}/governorates`,
  GET: `${API_BASE_URL}/governorates`,
  UPDATE: (id: number) => `${API_BASE_URL}/governorates/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/governorates/${id}`,
};
