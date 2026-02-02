"use server";

import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { UserType } from "@/types/User";

export default async function getSession(): Promise<UserType | null> {
  try {
    const { data } = await apiClient.get<APIResponse<UserType>>("/auth/me");
    return data ? data.data : null;
  } catch (error) {
    return null;
  }
}
