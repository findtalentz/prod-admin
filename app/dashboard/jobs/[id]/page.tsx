import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { Job } from "@/types/Job";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const { data } = await apiClient.get<APIResponse<Job>>(`/jobs/${id}`);
  const job = data.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/jobs"
          className="text-sm text-muted-foreground hover:underline"
        >
          &larr; Back to Jobs
        </Link>
      </div>

      <div className="border rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{job.title}</h2>
            <p className="text-muted-foreground">
              Created {formatDate(job.createdAt as unknown as Date)}
            </p>
          </div>
          <Badge
            variant={
              job.status === "OPEN"
                ? "secondary"
                : job.status === "IN_PROGRESS"
                ? "default"
                : "outline"
            }
          >
            {job.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Author</p>
            <p className="font-semibold">
              {job.author?.firstName} {job.author?.lastName}
            </p>
          </div>
          <div className="border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Seller</p>
            <p className="font-semibold">
              {job.seller
                ? `${job.seller.firstName} ${job.seller.lastName}`
                : "Not assigned"}
            </p>
          </div>
          <div className="border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Category</p>
            <p className="font-semibold">{job.category?.name || "N/A"}</p>
          </div>
          <div className="border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Budget</p>
            <p className="font-semibold">${job.budgetAmount?.toLocaleString()}</p>
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-2">Description</p>
          <p className="whitespace-pre-line">{job.description || "No description provided"}</p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-2">Location</p>
          <p>{job.location || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}
