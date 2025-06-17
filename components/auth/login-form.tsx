"use client";

import { useState, useTransition } from "react";
import type * as z from "zod";
import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
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
import { login } from "@/actions/login";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import Link from "next/link";
import { FaExclamation } from "react-icons/fa";

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
  const [twoFactorMail, setTwoFactorMail] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "addyyy118@gmail.com",
      password: "Hello@18",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const data = await login(values);
        if (!data) return;

        if (data?.error) {
          form.reset();
          setError(data?.error);
        }

        if (data?.success) {
          form.reset();
          setSuccess(data?.success);
        }

        if (data?.twoFactor) {
          setTwoFactorMail(values.email);
          setShowTwoFactor(true);
        } else if (data?.success) {
          router.push(DEFAULT_LOGIN_REDIRECT);
        }

        if (data?.twoFactor && data?.success) {
          router.push(DEFAULT_LOGIN_REDIRECT);
        }
      } catch {
        setError("Something went wrong");
      }
    });
  };

  return (
    <CardWrapper
      headerLablel="Welcome back!"
      backButtonLabel={
        !showTwoFactor ? "Don't have an account?" : "Create a new account?"
      }
      backButtonHref="/register"
      showSocial={!showTwoFactor}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            {/* 2fa inputs */}
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[#ffffff] font-medium text-xs leading-relaxed flex flex-col items-start space-y-1.5">
                      <span>
                        The two factor authentication code has been sent to{" "}
                        <span className="text-[#cccccc] font-semibold">
                          {twoFactorMail}
                        </span>
                      </span>
                      <div className="flex items-center gap-2 text-[#888888] text-xs">
                        <FaExclamation size={10} />
                        <p>The 2FA code sent will expire in 5 minutes</p>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="000000"
                        type="text"
                        disabled={isPending}
                        className="text-center text-lg tracking-widest"
                      />
                    </FormControl>
                    <FormMessage className="text-[#ef4444] text-xs" />
                  </FormItem>
                )}
              />
            )}

            {/* normal login inputs */}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#ffffff] font-medium text-xs">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="john.doe@example.com"
                          type="email"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage className="text-[#ef4444] text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#ffffff] font-medium text-xs">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your password"
                          type="password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <div className="flex justify-end">
                        <Button
                          variant="link"
                          size="sm"
                          asChild
                          className="px-0 font-normal text-[#888888] hover:text-[#ffffff] transition-smooth h-auto text-xs"
                        >
                          <Link
                            href="/reset"
                            className="focus-ring rounded px-1 py-0.5"
                          >
                            Forgot Password?
                          </Link>
                        </Button>
                      </div>
                      <FormMessage className="text-[#ef4444] text-xs" />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <div className="space-y-3">
            <FormError message={error || urlError} />
            <FormSuccess message={success} />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#ffffff] hover:bg-[#cccccc] text-[#000000] font-semibold transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#000000]/30 border-t-[#000000] rounded-full animate-spin"></div>
                  {!showTwoFactor ? "Signing in..." : "Confirming..."}
                </div>
              ) : !showTwoFactor ? (
                "Sign In"
              ) : (
                "Confirm Code"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
