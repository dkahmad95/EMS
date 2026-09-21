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
    return null;
  }

  try {
    const { payload } = (await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))) as {
      payload: DecodedToken;
    }; 
    const decodedToken = payload as DecodedToken;

    const authHeader = {
      Authorization: `Bearer ${token}`,
    };
    return (await callback(decodedToken, authHeader)).data;
  } catch (error: any) {
    // An axios error carries the backend's message — rethrow it instead of mislabeling
    // every failure as a token problem. (Next.js masks the text in production.)
    const apiMsg = error?.response?.data?.message;
    if (apiMsg) {
      throw new Error(Array.isArray(apiMsg) ? apiMsg.join("، ") : String(apiMsg));
    }
    if (error?.response || error?.request) {
      throw new Error("تعذر تنفيذ الطلب");
    }
    throw new Error("Invalid or expired token");
  }
};
