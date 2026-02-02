import BlogTable from "@/components/dashboard/blog/blog-table";
import { buttonVariants } from "@/components/ui/button";
import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { BlogType } from "@/types/Blog";
import Link from "next/link";

export default async function BlogPage() {
  const { data: blogs } = await apiClient.get<APIResponse<BlogType[]>>("/blog");
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div />
        <div>
          <Link className={buttonVariants()} href="/dashboard/blog/new">
            New Blog
          </Link>
        </div>
      </div>
      <BlogTable blogs={blogs.data} />
    </div>
  );
}

export const dynamic = "force-dynamic";
