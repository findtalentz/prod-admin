import DisputeTable from "@/components/dashboard/disputes/dispute-table";
import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { Dispute } from "@/types/Dispute";

export const dynamic = "force-dynamic";

export default async function Disputes() {
  try {
    const { data } = await apiClient.get<APIResponse<Dispute[]>>("/disputes");
    const disputes = data.data || [];

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Disputes</h2>
        <div className="border rounded-2xl p-4">
          <DisputeTable disputes={disputes} />
        </div>
      </div>
    );
  } catch {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Disputes</h2>
        <div className="border rounded-2xl p-8 text-center text-muted-foreground">
          <p className="font-medium">Failed to load disputes</p>
          <p className="text-sm mt-1">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }
}
