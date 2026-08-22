"use server";
import axios, { AxiosResponse } from "axios";
import * as api from "../../../routes/auth";
import { cookies } from "next/headers";
import { withToken } from "./authRequests";

class ApiError extends Error {
  constructor(public status: number, message?: string) {
    super(message);
    this.name = "ApiError";
  }
}
// Shared cookie attributes — deletion only matches the original cookie when
// path/domain (and the other attributes) are identical to those used at login.
const accessCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    domain: isProd ? ".ems-mabarrat.vercel.app" : undefined,
    path: "/",
    secure: isProd,
    sameSite: (isProd ? "none" : "strict") as "none" | "strict",
    httpOnly: isProd,
  };
};

export const Login = async (data: LoginType): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axios.post(api.AUTH_API.LOGIN(), data);
    if (response.status >= 200 && response.status < 300) {
      if (response.data.accessToken) {
        (await cookies()).set("access_token", response.data.accessToken, {
          ...accessCookieOptions(),
          expires: new Date(Date.now() + 1000 * 60 * 60 * 12),
          maxAge: 60 * 60 * 12,
        });
      }
      return response.data;
    } else {
      throw new ApiError(response.status, "Failed to login");
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(error.response?.status || 500, error.message);
    } else {
      throw new ApiError(500, "An unexpected error occurred");
    }
  }
};

export const Logout = async () => {
  // Best-effort server-side logout; never block clearing the cookie on its outcome.
  try {
    await withToken((_token, authHeader) =>
      axios.post(api.AUTH_API.LOGOUT(), {}, { headers: authHeader, withCredentials: true }),
    );
  } catch {
    /* ignore — cookie is cleared regardless */
  }

  // Expire the cookie with the SAME path/domain/attributes used at login so the
  // browser actually deletes it (plain `expires` without path/domain won't match in prod).
  (await cookies()).set("access_token", "", {
    ...accessCookieOptions(),
    expires: new Date(0),
    maxAge: 0,
  });
};
