import SubscriptionTable from "@/components/dashboard/subscriptions/subscription-table";
import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";

interface Subscriber {
  _id: string;
  email: string;
  createdAt: Date;
}

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  try {
    const { data } = await apiClient.get<APIResponse<Subscriber[]>>(
      "/subscribes"
    );
    const subscribers = data.data || [];
    const totalCount = data.count || subscribers.length;

    return (
      <SubscriptionTable subscribers={subscribers} totalCount={totalCount} />
    );
  } catch {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Email Subscriptions</h2>
        <div className="border rounded-2xl p-8 text-center text-muted-foreground">
          <p className="font-medium">Failed to load subscriptions</p>
          <p className="text-sm mt-1">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }
}
