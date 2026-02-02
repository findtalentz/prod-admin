import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { UserType } from "@/types/User";
import { useQuery } from "@tanstack/react-query";

const useSession = () => {
  return useQuery<APIResponse<UserType>, Error>({
    queryKey: ["session"],
    queryFn: () =>
      apiClient.get<APIResponse<UserType>>("/auth/me").then((res) => res.data),
    staleTime: 60 * 1000,
    retry: 1,
  });
};

export default useSession;
