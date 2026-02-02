import UserTable from "@/components/dashboard/users/user-table";
import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { UserType } from "@/types/User";

export default async function Users() {
  const { data } = await apiClient.get<APIResponse<UserType[]>>("/users");
  return (
    <div>
      <UserTable users={data.data} />
    </div>
  );
}

export const dynamic = "force-dynamic";
