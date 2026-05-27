const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

export const COLLECTIONS_API = {
  CREATE:  `${API_BASE_URL}/collections`,
  GET:     `${API_BASE_URL}/collections`,
  GET_ONE: (id: number) => `${API_BASE_URL}/collections/${id}`,
  UPDATE:  (id: number) => `${API_BASE_URL}/collections/${id}`,
  DELETE:  (id: number) => `${API_BASE_URL}/collections/${id}`,
};
