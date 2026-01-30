const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

interface Api {
  LOGIN: () => string;
}

export const AUTH_API: Api = {
  LOGIN: () => `${API_BASE_URL}/auth/login`,
};
