"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/utils";
import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { Job } from "@/types/Job";
import { AxiosError } from "axios";
import { Ban, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

function getStatusVariant(status: string) {
  switch (status) {
    case "OPEN":
      return "secondary" as const;
    case "IN_PROGRESS":
      return "default" as const;
    case "COMPLETED":
      return "outline" as const;
    case "CANCELLED":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    apiClient
      .get<APIResponse<Job>>(`/jobs/${id}`)
      .then(({ data }) => setJob(data.data))
      .catch(() => toast.error("Failed to load job"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancelJob = async () => {
    setActionLoading(true);
    try {
      await apiClient.put(`/jobs/${id}`, { status: "CANCELLED" });
      toast.success("Job cancelled");
      setJob((prev) => (prev ? { ...prev, status: "CANCELLED" } : prev));
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to cancel job");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await apiClient.delete(`/jobs/${id}`);
      toast.success("Job deleted");
      router.push("/dashboard/jobs");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to delete job");
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <BeatLoader color="#6366f1" size={12} />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/jobs"
          className="text-sm text-muted-foreground hover:underline"
        >
          &larr; Back to Jobs
        </Link>
        <div className="border rounded-2xl p-8 text-center text-muted-foreground">
          <p className="font-medium">Job not found</p>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-3">
            <Badge variant={getStatusVariant(job.status)}>{job.status}</Badge>

            {job.status === "IN_PROGRESS" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-orange-600 border-orange-600 hover:bg-orange-50"
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Cancel Job
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Job</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cancel this job? The job will be marked as cancelled and
                      both parties will be notified. Use the Disputes page to
                      issue refunds.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Back</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={actionLoading}
                      onClick={handleCancelJob}
                    >
                      {actionLoading ? (
                        <BeatLoader color="#fff" size={8} />
                      ) : (
                        "Cancel Job"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Job</AlertDialogTitle>
                  <AlertDialogDescription>
                    Delete this job permanently? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={actionLoading}
                    onClick={handleDelete}
                  >
                    {actionLoading ? (
                      <BeatLoader color="#fff" size={8} />
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
            <p className="font-semibold">
              ${job.budgetAmount?.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-2">Description</p>
          <p className="whitespace-pre-line">
            {job.description || "No description provided"}
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-2">Location</p>
          <p>{job.location || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}
