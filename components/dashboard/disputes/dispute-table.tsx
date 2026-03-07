"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { Ban, DollarSign, Eye, Scale, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

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
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const filtered = search
    ? disputes.filter(
        (d) =>
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
          d.job?.title?.toLowerCase().includes(search.toLowerCase())
      )
    : disputes;

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
    setActionId(id);
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
    } finally {
      setActionId(null);
    }
  };

  const handleRefundJob = async (id: string) => {
    setActionId(id);
    try {
      await apiClient.post(`/disputes/${id}/refund`);
      toast.success("Refund issued successfully");
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to refund job");
      }
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionId(id);
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
    } finally {
      setActionId(null);
    }
  };

  if (disputes.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-lg">
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {disputes.length} dispute{disputes.length !== 1 ? "s" : ""}
          </Badge>
          <Badge variant="destructive" className="text-sm">
            {disputes.filter((d) => d.status === "open").length} open
          </Badge>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search disputes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

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
          {filtered.map((dispute) => (
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
              <TableCell>
                {formatDate(dispute.createdAt as unknown as Date)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {/* View details */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>{dispute.title}</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Status
                          </p>
                          <Badge variant={getStatusVariant(dispute.status)}>
                            {dispute.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Filed by
                          </p>
                          <p className="font-medium">
                            {dispute.user?.firstName} {dispute.user?.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Job</p>
                          <p className="font-medium">
                            {dispute.job?.title || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Type</p>
                          <p className="font-medium capitalize">
                            {dispute.type}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Description
                          </p>
                          <p className="whitespace-pre-line text-sm">
                            {dispute.description}
                          </p>
                        </div>
                        {dispute.evidence && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Evidence
                            </p>
                            <p className="whitespace-pre-line text-sm">
                              {dispute.evidence}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Created
                          </p>
                          <p className="text-sm">
                            {formatDate(
                              dispute.createdAt as unknown as Date
                            )}
                          </p>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Status dropdown */}
                  <Select
                    value={dispute.status}
                    onValueChange={(v) => handleStatusChange(dispute, v)}
                    disabled={updatingId === dispute._id}
                  >
                    <SelectTrigger className="w-[120px] h-8">
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

                  {/* Cancel & Refund - only for actionable disputes */}
                  {(dispute.status === "open" ||
                    dispute.status === "in_progress") && (
                    <>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
                            title="Cancel Job"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Job</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cancel the job associated with dispute &quot;
                              {dispute.title}&quot;? The job will be marked as
                              cancelled and both parties will be notified. No
                              refund will be issued — use the Refund button for
                              that.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Back</AlertDialogCancel>
                            <AlertDialogAction
                              disabled={actionId === dispute._id}
                              onClick={() => handleCancelJob(dispute._id)}
                            >
                              {actionId === dispute._id ? (
                                <BeatLoader color="#fff" size={8} />
                              ) : (
                                "Cancel Job"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            title="Refund Client"
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Refund Client</AlertDialogTitle>
                            <AlertDialogDescription>
                              Refund the client for dispute &quot;
                              {dispute.title}&quot;? This will:
                              <br />
                              <br />
                              &bull; Remove the seller&apos;s held/pending
                              balance
                              <br />
                              &bull; Attempt Stripe refund to the original
                              payment method
                              <br />
                              &bull; Fall back to wallet credit if Stripe refund
                              fails
                              <br />
                              &bull; Cancel the job and resolve the dispute
                              <br />
                              &bull; Reverse earning/spending stats
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Back</AlertDialogCancel>
                            <AlertDialogAction
                              disabled={actionId === dispute._id}
                              onClick={() => handleRefundJob(dispute._id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {actionId === dispute._id ? (
                                <BeatLoader color="#fff" size={8} />
                              ) : (
                                "Refund"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}

                  {/* Delete */}
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
                          Delete dispute &quot;{dispute.title}&quot;? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          disabled={actionId === dispute._id}
                          onClick={() => handleDelete(dispute._id)}
                        >
                          {actionId === dispute._id ? (
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
  );
}
