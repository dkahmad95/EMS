const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

interface OfficeUsersApi {
  GET_BY_USER: (userId: number) => string;
  BULK_ASSIGN: string;
}

export const OFFICE_USERS_API: OfficeUsersApi = {
  GET_BY_USER: (userId: number) => `${API_BASE_URL}/office-users/user/${userId}`,
  BULK_ASSIGN: `${API_BASE_URL}/office-users/bulk-assign`,
};