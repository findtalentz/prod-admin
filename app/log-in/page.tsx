"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Joi from "joi";
import { useForm } from "react-hook-form";

const formSchema = Joi.object({
  email: Joi.string().min(5).max(255).email().label("Email"),
  password: Joi.string().min(8).max(20).label("password"),
});

type FormData = {
  email: string;
  password: string;
};

import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { joiResolver } from "@hookform/resolvers/joi";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
export default function LoginPage() {
  const [isLoading, setLoading] = useState(false);
  const form = useForm<FormData>({
    resolver: joiResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormData) {
    setLoading(true);
    try {
      const { data } = await apiClient.post<APIResponse<string>>(
        "/auth/log-in",
        values
      );
      form.reset();
      toast.success(data.message);
      Cookies.set("token", data.data, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      window.location.href = "/dashboard";
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <div className="w-[450px] flex flex-col gap-8 items-center justify-center rounded-2xl py-6 px-4">
        <Image src="/logo1.png" alt="logo" width={100} height={100} />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} className="w-full" type="submit">
              {isLoading ? <BeatLoader /> : "Log In"}
            </Button>
          </form>
        </Form>
        <p className="text-center text-gray-400">
          Don&apos;t have any account?
          <Link href="/sign-up" className="text-primary font-medium ms-1">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
