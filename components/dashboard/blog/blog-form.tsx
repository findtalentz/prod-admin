"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { storage } from "@/firebase";
import useBlogCategorys from "@/hooks/useBlogCategorys";
import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { BlogType } from "@/types/Blog";
import { joiResolver } from "@hookform/resolvers/joi";
import MDEditor from "@uiw/react-md-editor";
import { AxiosError } from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Joi from "joi";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import rehypeSanitize from "rehype-sanitize";

type FormData = {
  title: string;
  body: string;
  category: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  featured: boolean;
};

const BlogSchema = Joi.object({
  title: Joi.string().min(5).max(120).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 5 characters long",
    "string.max": "Title cannot exceed 120 characters",
  }),
  thumbnail: Joi.string().uri().allow("").optional().messages({
    "string.uri": "Thumbnail must be a valid URL",
  }),
  body: Joi.string().min(300).max(20000).required().messages({
    "string.empty": "Blog content is required",
    "string.min": "Blog content must be at least 300 characters",
    "string.max": "Blog content cannot exceed 20,000 characters",
  }),
  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Category must be a valid ObjectId",
      "any.required": "Category is required",
    }),
  tags: Joi.array().items(Joi.string().max(30)).optional(),
  status: Joi.string().valid("draft", "published", "archived").default("draft"),
  featured: Joi.boolean().default(false),
});

interface Props {
  blog?: BlogType;
}

const BlogForm = ({ blog }: Props) => {
  const [isLoading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(blog?.thumbnail ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const [tagsInput, setTagsInput] = useState("");
  const { data: categories } = useBlogCategorys();

  const form = useForm<FormData>({
    resolver: joiResolver(BlogSchema),
    defaultValues: {
      title: blog?.title ?? "",
      body: blog?.body ?? "",
      category: blog?.category._id ?? "",
      tags: blog?.tags ?? [],
      status: blog?.status ?? "draft",
      featured: blog?.featured ?? false,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploading(true);

    try {
      const storageRef = ref(
        storage,
        `blog/thumbnails/${Date.now()}_${file.name}`
      );
      await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setThumbnail(downloadURL);
      toast.success("Thumbnail uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload thumbnail");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setThumbnail("");
  };

  const handleAddTag = () => {
    if (!tagsInput.trim()) return;

    const currentTags = form.getValues("tags") || [];
    const newTag = tagsInput.trim();

    // Validate tag length
    if (newTag.length > 30) {
      toast.error("Tag cannot exceed 30 characters");
      return;
    }

    // Avoid duplicates
    if (!currentTags.includes(newTag)) {
      const updatedTags = [...currentTags, newTag];
      form.setValue("tags", updatedTags);
    }

    setTagsInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    const updatedTags = currentTags.filter((tag) => tag !== tagToRemove);
    form.setValue("tags", updatedTags);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  async function onSubmit(values: FormData) {
    setLoading(true);
    try {
      if (blog) {
        const { data } = await apiClient.put<APIResponse<string>>(
          `/blog/${blog._id}`,
          {
            ...values,
            thumbnail: thumbnail || undefined,
          }
        );
        toast.success(data.message);
      } else {
        const { data } = await apiClient.post<APIResponse<string>>("/blog", {
          ...values,
          thumbnail: thumbnail || undefined,
        });
        toast.success(data.message);
      }
      form.reset();
      setThumbnail("");
      setTagsInput("");
      router.refresh();
      window.location.href = "/dashboard/blog";
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create blog");
      }
    } finally {
      setLoading(false);
    }
  }

  if (!categories) return <div>Loading categories...</div>;

  return (
    <div className="w-full space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter blog title (5-120 characters)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Field */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.data.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Thumbnail Upload */}
          <div className="space-y-4">
            <FormLabel>Thumbnail Image</FormLabel>
            {thumbnail ? (
              <div className="relative group max-w-[400px]">
                <div className="relative aspect-video border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                  <Image
                    src={thumbnail}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video max-w-[400px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                <input
                  onChange={handleImageUpload}
                  className="hidden"
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                />
                <div className="flex flex-col items-center justify-center gap-3 text-center p-6">
                  {isUploading ? (
                    <BeatLoader size={8} />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="font-medium">
                          <span className="text-primary">Click to upload</span>
                          or drag and drop
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Recommended: 1200x630 pixels
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </label>
            )}
          </div>

          {/* Tags Field */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag (max 30 characters)"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        maxLength={30}
                      />
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>
                    {field.value && field.value.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((tag, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-sm"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status Field */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Featured Field */}
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Featured Post</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Feature this post on the homepage
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Body Field - Blog Content */}
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blog Content</FormLabel>
                <FormControl>
                  <div
                    data-color-mode="light"
                    className="border rounded-lg overflow-hidden"
                  >
                    <MDEditor
                      value={field.value}
                      onChange={field.onChange}
                      previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                      }}
                      height={400}
                      textareaProps={{
                        placeholder:
                          "Write your blog content here (minimum 300 characters)...",
                      }}
                    />
                  </div>
                </FormControl>
                <div className="text-sm text-muted-foreground mt-2">
                  {field.value?.length || 0} / 20000 characters
                  {field.value && field.value.length < 300 && (
                    <span className="text-destructive ml-2">
                      Minimum 300 characters required
                    </span>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isLoading}
            className="w-full"
            type="submit"
            size="lg"
          >
            {isLoading ? <BeatLoader size={8} color="#ffffff" /> : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BlogForm;
