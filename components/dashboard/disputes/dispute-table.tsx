"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Dispute } from "@/types/Dispute";
import { AxiosError } from "axios";
import { Ban, DollarSign, Scale, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const statusOptions = ["open", "in_progress", "resolved", "closed"];

function getStatusVariant(status: string) {
  switch (status) {
    case "open":
      return "destructive" as const;
    case "in_progress":
      return "secondary" as const;
    case "resolved":
      return "default" as const;
    case "closed":
      return "outline" as const;
    default:
      return "outline" as const;
  }
}

interface Props {
  disputes: Dispute[];
}

export default function DisputeTable({ disputes }: Props) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (dispute: Dispute, newStatus: string) => {
    setUpdatingId(dispute._id);
    try {
      await apiClient.put(`/disputes/${dispute._id}`, {
        title: dispute.title,
        type: dispute.type,
        description: dispute.description,
        job: dispute.job?._id,
        evidence: dispute.evidence || "",
        status: newStatus,
      });
      toast.success("Dispute updated");
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update dispute");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancelJob = async (id: string) => {
    try {
      await apiClient.post(`/disputes/${id}/cancel`);
      toast.success("Job cancelled");
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to cancel job");
      }
    }
  };

  const handleRefundJob = async (id: string) => {
    try {
      await apiClient.post(`/disputes/${id}/refund`);
      toast.success("Job refunded");
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to refund job");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/disputes/${id}`);
      toast.success("Dispute deleted");
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to delete dispute");
      }
    }
  };

  if (disputes.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">
          No Disputes
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          There are no disputes to display.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Job</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {disputes.map((dispute) => (
          <TableRow key={dispute._id}>
            <TableCell className="font-medium max-w-[200px] truncate">
              {dispute.title}
            </TableCell>
            <TableCell>
              {dispute.user?.firstName} {dispute.user?.lastName}
            </TableCell>
            <TableCell className="max-w-[150px] truncate">
              {dispute.job?.title || "-"}
            </TableCell>
            <TableCell className="capitalize">{dispute.type}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(dispute.status)}>
                {dispute.status.replace("_", " ")}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(dispute.createdAt as unknown as Date)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Select
                  value={dispute.status}
                  onValueChange={(v) => handleStatusChange(dispute, v)}
                  disabled={updatingId === dispute._id}
                >
                  <SelectTrigger className="w-[130px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(dispute.status === "open" || dispute.status === "in_progress") && (
                  <>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
                          <Ban className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Job</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cancel the job associated with dispute &quot;{dispute.title}&quot;? The job will be marked as cancelled and both parties will be notified.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Back</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancelJob(dispute._id)}
                          >
                            Cancel Job
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                          <DollarSign className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Refund Client</AlertDialogTitle>
                          <AlertDialogDescription>
                            Refund the client for dispute &quot;{dispute.title}&quot;? The held balance will be removed, the client will be credited, the job will be cancelled, and the dispute will be resolved.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Back</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRefundJob(dispute._id)}
                          >
                            Refund
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Dispute</AlertDialogTitle>
                      <AlertDialogDescription>
                        Delete dispute &quot;{dispute.title}&quot;? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(dispute._id)}
                      >
                        Delete
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
  );
}
