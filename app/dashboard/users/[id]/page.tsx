import { Badge } from "@/components/ui/badge";
import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { UserType } from "@/types/User";
import Image from "next/image";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;
  const { data } = await apiClient.get<APIResponse<UserType>>(`/users/${id}`);
  const user = data.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/users"
          className="text-sm text-muted-foreground hover:underline"
        >
          &larr; Back to Users
        </Link>
      </div>

      <div className="border rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-6">
          <Image
            src={user.image}
            alt={user.firstName}
            width={100}
            height={100}
            className="rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex gap-2 mt-2">
              <Badge>{user.role}</Badge>
              <Badge variant={user.emailStatus === "VERIFIED" ? "default" : "secondary"}>
                Email: {user.emailStatus}
              </Badge>
              <Badge variant={user.identityStatus === "VERIFIED" ? "default" : "secondary"}>
                Identity: {user.identityStatus}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-semibold">{user.location || "N/A"}</p>
          </div>
          <div className="border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="font-semibold">${user.balance}</p>
          </div>
          <div className="border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Total Earnings</p>
            <p className="font-semibold">${user.totalEarning}</p>
          </div>
          <div className="border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Total Spend</p>
            <p className="font-semibold">${user.totalSpend}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
