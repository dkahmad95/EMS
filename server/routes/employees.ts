const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

export const EMPLOYEES_API = {
  CREATE: `${API_BASE_URL}/employees`,
  GET: `${API_BASE_URL}/employees`,
  GET_ONE: (id: number) => `${API_BASE_URL}/employees/${id}`,
  UPDATE: (id: number) => `${API_BASE_URL}/employees/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/employees/${id}`,
};
