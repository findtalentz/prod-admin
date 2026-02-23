import JobTable from "@/components/dashboard/jobs/job-table";
import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { Job } from "@/types/Job";

export const dynamic = "force-dynamic";

export default async function Jobs() {
  const { data } = await apiClient.get<APIResponse<Job[]>>("/jobs");
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Jobs</h2>
      <div className="border rounded-2xl p-4">
        <JobTable jobs={data.data} />
      </div>
    </div>
  );
}
