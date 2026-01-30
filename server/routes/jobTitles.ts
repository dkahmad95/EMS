const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;



export const JOB_TITLES_API: CrudApi = {
  CREATE: `${API_BASE_URL}/job-titles`,
  GET: `${API_BASE_URL}/job-titles`,
  UPDATE: (id: number) => `${API_BASE_URL}/job-titles/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/job-titles/${id}`,
};
