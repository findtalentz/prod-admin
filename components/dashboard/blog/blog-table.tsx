import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BlogType } from "@/types/Blog";
import { Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeleteBlogDialog from "./delete-blog-dialog";

interface Porps {
  blogs: BlogType[];
}
const BlogTable = ({ blogs }: Porps) => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-3">Blogs</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thumbnail</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog._id}>
              <TableCell>
                <Image
                  src={blog.thumbnail}
                  alt={blog.title}
                  width={60}
                  height={60}
                  className="rounded"
                />
              </TableCell>
              <TableCell> {blog.title} </TableCell>
              <TableCell> {blog.category.name} </TableCell>
              <TableCell className="space-x-3">
                <Link
                  href={`/dashboard/blog/${blog._id}`}
                  className={buttonVariants({ variant: "secondary" })}
                >
                  <Edit /> Edit
                </Link>
                <DeleteBlogDialog blogId={blog._id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default BlogTable;
