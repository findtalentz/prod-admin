import JobTable from "@/components/dashboard/jobs/job-table";
import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { Job } from "@/types/Job";

export const dynamic = "force-dynamic";

export default async function Jobs() {
  try {
    const { data } = await apiClient.get<APIResponse<Job[]>>("/jobs", {
      params: { pageSize: 200 },
    });
    const jobs = data.data || [];
    const totalCount = data.count || jobs.length;

    return <JobTable jobs={jobs} totalCount={totalCount} />;
  } catch {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Jobs</h2>
        <div className="border rounded-2xl p-8 text-center text-muted-foreground">
          <p className="font-medium">Failed to load jobs</p>
          <p className="text-sm mt-1">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }
}
