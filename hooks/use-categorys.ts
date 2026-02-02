import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { Category } from "@/types/Category";
import { useQuery } from "@tanstack/react-query";

const useCategorys = () => {
  return useQuery<APIResponse<Category[]>, Error>({
    queryKey: ["categorys"],
    queryFn: () =>
      apiClient
        .get<APIResponse<Category[]>>("/categorys")
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useCategorys;
