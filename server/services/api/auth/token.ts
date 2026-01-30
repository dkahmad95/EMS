"use server";
import {cookies} from "next/headers";

//z function to get the token
const getToken = async (): Promise<string | null> => {
  return (await cookies()).get("access_token")?.value || null;
};

export {getToken};
