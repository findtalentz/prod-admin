"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { AxiosError } from "axios";
import { Bell, Copy, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

interface Subscriber {
  _id: string;
  email: string;
  createdAt: Date;
}

interface Props {
  subscribers: Subscriber[];
  totalCount: number;
}

export default function SubscriptionTable({ subscribers, totalCount }: Props) {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const filtered = search
    ? subscribers.filter((s) =>
        s.email.toLowerCase().includes(search.toLowerCase())
      )
    : subscribers;

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/subscribes/${deleteId}`);
      toast.success("Subscriber removed");
      setDeleteId(null);
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to remove subscriber");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const copyAllEmails = () => {
    const emails = subscribers.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(emails);
    toast.success(`${subscribers.length} emails copied to clipboard`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Email Subscriptions{" "}
          <Badge variant="secondary" className="text-sm ml-2">
            {totalCount}
          </Badge>
        </h2>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={copyAllEmails}>
            <Copy className="w-4 h-4 mr-1" /> Copy All Emails
          </Button>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="border rounded-2xl">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No subscribers found</p>
            {search && (
              <p className="text-sm mt-1">Try a different search term</p>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subscribed At</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sub, index) => (
                <TableRow key={sub._id}>
                  <TableCell className="text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{sub.email}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(sub.createdAt)}
                  </TableCell>
                  <TableCell>
                    <AlertDialog
                      open={deleteId === sub._id}
                      onOpenChange={(open) =>
                        setDeleteId(open ? sub._id : null)
                      }
                    >
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Remove subscriber?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove {sub.email} from the subscription
                            list.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <Button
                            disabled={isDeleting}
                            onClick={handleDelete}
                            variant="destructive"
                          >
                            {isDeleting ? (
                              <BeatLoader color="#fff" size={8} />
                            ) : (
                              "Remove"
                            )}
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
