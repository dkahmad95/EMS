const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;



export const EDUCATION_LEVELS_API: CrudApi = {
  CREATE: `${API_BASE_URL}/education-levels`,
  GET: `${API_BASE_URL}/education-levels`,
  UPDATE: (id: number) => `${API_BASE_URL}/education-levels/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/education-levels/${id}`,
};
