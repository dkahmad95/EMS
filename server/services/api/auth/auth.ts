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
export const Login = async (data: LoginType): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axios.post(api.AUTH_API.LOGIN(), data);
    if (response.status >= 200 && response.status < 300) {
      if (response.data.accessToken) {
        (await cookies()).set("access_token", response.data.accessToken, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
          domain: process.env.NODE_ENV === "production" ? ".ems-mabarrat.vercel.app" : undefined,
          path: "/",
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          httpOnly: process.env.NODE_ENV === "production" ? true : false,
          maxAge: 60 * 60 * 24,
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
  try {
    const cookieManager = cookies();
    if ((await cookieManager).get("access_token")) {
      (await cookieManager).set("access_token", "", {
        expires: new Date(0),
      });
    }
  } catch (error) {
    // console.error("Logout failed:", error);
    throw new Error(`Logout failed: ${error}`);
  }
};
