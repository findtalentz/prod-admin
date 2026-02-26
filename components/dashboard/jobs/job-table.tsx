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
import { Briefcase, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function getStatusVariant(status: string) {
  switch (status) {
    case "OPEN":
      return "secondary" as const;
    case "IN_PROGRESS":
      return "default" as const;
    case "COMPLETED":
      return "outline" as const;
    default:
      return "outline" as const;
  }
}

interface Props {
  jobs: Job[];
}

export default function JobTable({ jobs }: Props) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Seller</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow
            key={job._id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => router.push(`/dashboard/jobs/${job._id}`)}
          >
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
            <TableCell>{job.category?.name || "-"}</TableCell>
            <TableCell>${job.budgetAmount?.toLocaleString()}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(job.status)}>
                {job.status}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(job.createdAt as unknown as Date)}</TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
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
                      Delete job &quot;{job.title}&quot;? This action cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(job._id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
