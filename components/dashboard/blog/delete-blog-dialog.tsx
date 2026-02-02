"use client";
import { queryClient } from "@/app/query-client-provider";
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
import { Button } from "@/components/ui/button";
import apiClient from "@/services/api-client";
import { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

interface Props {
  blogId: string;
}

export default function DeleteBlogDialog({ blogId }: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    setLoading(true);
    try {
      await apiClient.delete(`/blog/${blogId}`);
      router.refresh();
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return toast.error(error.response.data.message);
      }
      return toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your blog
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button
            disabled={isLoading}
            onClick={onDelete}
            variant="destructive"
            className="cursor-pointer bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? <BeatLoader color="#fff" /> : "Continue"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
