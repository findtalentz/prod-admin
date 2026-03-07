"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import apiClient from "@/services/api-client";
import { Job } from "@/types/Job";
import { AxiosError } from "axios";
import {
  Ban,
  Briefcase,
  DollarSign,
  Eye,
  Search,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

interface Props {
  jobs: Job[];
  totalCount: number;
}

export default function JobTable({ jobs, totalCount }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const filtered = search
    ? jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.author?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
          j.seller?.firstName?.toLowerCase().includes(search.toLowerCase())
      )
    : jobs;

  const handleDelete = async (id: string) => {
    setActionId(id);
    try {
      await apiClient.delete(`/jobs/${id}`);
      toast.success("Job deleted");
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to delete job");
      }
    } finally {
      setActionId(null);
    }
  };

  const handleCancelJob = async (id: string) => {
    setActionId(id);
    try {
      await apiClient.put(`/jobs/${id}`, { status: "CANCELLED" });
      toast.success("Job cancelled");
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to cancel job");
      }
    } finally {
      setActionId(null);
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">No Jobs</h3>
        <p className="text-sm text-muted-foreground mt-2">
          There are no jobs to display.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Jobs{" "}
          <Badge variant="secondary" className="text-sm ml-2">
            {totalCount}
          </Badge>
        </h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="border rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((job) => (
              <TableRow key={job._id}>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {job.title}
                </TableCell>
                <TableCell>
                  {job.author?.firstName} {job.author?.lastName}
                </TableCell>
                <TableCell>
                  {job.seller
                    ? `${job.seller.firstName} ${job.seller.lastName}`
                    : "-"}
                </TableCell>
                <TableCell>${job.budgetAmount?.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(job.status)}>
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDate(job.createdAt as unknown as Date)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => router.push(`/dashboard/jobs/${job._id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {job.status === "IN_PROGRESS" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Job</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cancel job &quot;{job.title}&quot;? The job will be
                              marked as cancelled. Use the Disputes page to
                              issue refunds.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Back</AlertDialogCancel>
                            <AlertDialogAction
                              disabled={actionId === job._id}
                              onClick={() => handleCancelJob(job._id)}
                            >
                              {actionId === job._id ? (
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
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Job</AlertDialogTitle>
                          <AlertDialogDescription>
                            Delete job &quot;{job.title}&quot;? This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            disabled={actionId === job._id}
                            onClick={() => handleDelete(job._id)}
                          >
                            {actionId === job._id ? (
                              <BeatLoader color="#fff" size={8} />
                            ) : (
                              "Delete"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
