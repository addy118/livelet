"use client";

import { useEffect, useState, useTransition } from "react";
import type * as z from "zod";
import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPassSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "@/components/form-success";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { newPass } from "@/actions/new-pass";

export const NewPassForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPassSchema>>({
    resolver: zodResolver(NewPassSchema),
  });

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(undefined);
        setSuccess(undefined);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const onSubmit = (values: z.infer<typeof NewPassSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      newPass(values, token).then((data) => {
        if (!data) return;

        setError(data?.error);
        setSuccess(data?.success);

        if (data?.success) {
          router.push(DEFAULT_LOGIN_REDIRECT);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLablel="Create new password"
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#ffffff] font-medium text-xs">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Create a strong password"
                      type="password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage className="text-[#ef4444] text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-3">
            <FormError message={error} />
            <FormSuccess message={success} />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#ffffff] hover:bg-[#cccccc] text-[#000000] font-semibold transition-smooth focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#000000]/30 border-t-[#000000] rounded-full animate-spin"></div>
                  Updating password...
                </div>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
