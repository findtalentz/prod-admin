"use server";

import { Session } from "@/types/Session";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

const getSessionFromToken = async (): Promise<{
  session: Session;
  token: string;
} | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if (!token) return null;
    const session = jwtDecode<Session>(token.value);
    return { session, token: token.value };
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

export default getSessionFromToken;
