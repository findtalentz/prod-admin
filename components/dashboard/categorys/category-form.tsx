"use client";

import { queryClient } from "@/app/query-client-provider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { storage } from "@/firebase";
import apiClient from "@/services/api-client";
import { useCategoryStore } from "@/store";
import { APIResponse } from "@/types/APIResponse";
import { joiResolver } from "@hookform/resolvers/joi";
import { AxiosError } from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Joi from "joi";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

type FromData = {
  name: string;
  type: string;
  image: string;
};

const formSchema = Joi.object({
  name: Joi.string().min(1).max(255).required().label("Name"),
  type: Joi.string()
    .min(1)
    .max(255)
    .valid("BLOG", "JOB")
    .required()
    .label("Type"),
});

const CategoryForm = () => {
  const selectedCategory = useCategoryStore((s) => s.category);
  const clearCategory = useCategoryStore((s) => s.clearCategory);
  const [isLoading, setLoading] = useState(false);
  const [image, setImage] = useState(selectedCategory?.image ?? "");
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FromData>({
    resolver: joiResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
    },
  });
  useEffect(() => {
    if (selectedCategory) {
      form.reset({
        name: selectedCategory.name,
        type: selectedCategory.type,
      });
      setImage(selectedCategory.image);
    } else {
      form.reset({
        name: "",
        type: "",
      });
      setImage("");
    }
  }, [selectedCategory, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const storageRef = ref(
        storage,
        `portfolio/thumbnails/${Date.now()}_${file.name}`
      );
      await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setImage(downloadURL);
      toast.success("Thumbnail uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload thumbnail");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImage("");
  };

  async function onSubmit(values: FromData) {
    if (!image) return;
    setLoading(true);
    try {
      if (selectedCategory) {
        const { data } = await apiClient.put<APIResponse<string>>(
          `/categories/${selectedCategory._id}`,
          {
            ...values,
            image,
          }
        );
        toast.success(data.message);
        clearCategory();
      } else {
        const { data } = await apiClient.post<APIResponse<string>>(
          "/categories",
          {
            ...values,
            image,
          }
        );
        toast.success(data.message);
      }
      form.reset();
      setImage("");
      queryClient.invalidateQueries({ queryKey: ["categorys"] });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full md:max-w-[450px] space-y-8">
      <h2 className="font-medium text-2xl">Create Category</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Category Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Category Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BLOG">Blog</SelectItem>
                      <SelectItem value="JOB">Job</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            {image ? (
              <div className="relative group">
                <div className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                  <Image
                    src={image}
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
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
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
                          <span className="text-primary">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </label>
            )}
          </div>

          <Button
            disabled={isLoading || !image}
            className="w-full"
            type="submit"
          >
            {isLoading ? <BeatLoader /> : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CategoryForm;
