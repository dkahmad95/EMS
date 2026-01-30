"use server";
import { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET mana bl env variable");
}

export const withToken = async <T>(
  callback: (decodedToken: DecodedToken, authHeader: { Authorization: string }) => Promise<AxiosResponse<T>>,
): Promise<T | null> => {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    // return early if no token exists
    return null;
  }

  try {
    const { payload } = (await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))) as {
      payload: DecodedToken;
    }; // use secret key from env
    const decodedToken = payload as DecodedToken;

    const authHeader = {
      Authorization: `Bearer ${token}`,
    };
    return (await callback(decodedToken, authHeader)).data;
  } catch (error: any) {
    // console.error('Token verification failed:', error);
    throw new Error("Invalid or expired token");
  }
};
