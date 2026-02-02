import BlogForm from "@/components/dashboard/blog/blog-form";
import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { BlogType } from "@/types/Blog";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function page({ params }: Props) {
  const { id } = await params;
  const { data: blog } = await apiClient.get<APIResponse<BlogType>>(
    `/blog/${id}`
  );
  return (
    <>
      <h2 className="text-2xl font-semibold mb-3">Edit Blog</h2>
      <BlogForm blog={blog.data} />
    </>
  );
}
