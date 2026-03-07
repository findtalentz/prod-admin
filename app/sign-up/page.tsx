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
import APIClient from "@/services/api-client";
import Joi from "joi";
import Cookies from "@/node_modules/@types/js-cookie";
import { useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";

const formSchema = Joi.object({
  firstName: Joi.string().min(1).max(255).label("First Name"),
  lastName: Joi.string().min(1).max(255).label("Last Name"),
  email: Joi.string().min(5).max(255).email().label("Email"),
  password: Joi.string().min(8).max(20).label("Password"),
});

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

import { APIResponse } from "@/types/APIResponse";
import { joiResolver } from "@hookform/resolvers/joi";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [isLoading, setLoading] = useState(false);
  const form = useForm<FormData>({
    resolver: joiResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const res = await APIClient.post<APIResponse<string>>(
        "/auth/sign-up/admin",
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        },
      );
      toast.success(res.data.message);
      Cookies.set("token", res.data.data, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      form.reset();
      window.location.href = "/dashboard";
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return toast.error(error.response.data.message);
      }
      toast.error("Oops! Something went wrong. Please try again.");
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
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="text" placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="text" placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
              {isLoading ? <BeatLoader /> : "Sign Up"}
            </Button>
          </form>
        </Form>
        <p className="text-center text-gray-400">
          Already have an account?
          <Link href="/log-in" className="text-primary font-medium ms-1">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
