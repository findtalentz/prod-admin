import DisputeTable from "@/components/dashboard/disputes/dispute-table";
import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { Dispute } from "@/types/Dispute";

export const dynamic = "force-dynamic";

export default async function Disputes() {
  const { data } = await apiClient.get<APIResponse<Dispute[]>>("/disputes");
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Disputes</h2>
      <div className="border rounded-2xl p-4">
        <DisputeTable disputes={data.data} />
      </div>
    </div>
  );
}
