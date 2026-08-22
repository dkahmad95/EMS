const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

export const FREEZED_COLLECTIONS_API = {
  CREATE:  `${API_BASE_URL}/freezed-collections`,
  GET:     `${API_BASE_URL}/freezed-collections`,
  GET_ONE: (id: number) => `${API_BASE_URL}/freezed-collections/${id}`,
  UPDATE:  (id: number) => `${API_BASE_URL}/freezed-collections/${id}`,
  DELETE:  (id: number) => `${API_BASE_URL}/freezed-collections/${id}`,
};
