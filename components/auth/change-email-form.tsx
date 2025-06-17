"use client";
import React, { useCallback, useEffect, useState } from "react";
import { CardWrapper } from "./card-wrapper";
import { BeatLoader } from "react-spinners";
import { useRouter, useSearchParams } from "next/navigation";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";
import { emailChange } from "@/actions/email-change";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession } from "next-auth/react";

export const ChangeEmailForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const user = useCurrentUser();

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(undefined);
        setSuccess(undefined);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("Missing token.");
      return;
    }

    try {
      if (!user) return null;
      const data = await emailChange(token, user);

      if (data?.error) {
        setError(data?.error);
      }

      if (data?.success) {
        await update();
        setSuccess(data?.success);
        router.push("/settings");
      }
    } catch {
      setError("Something went wrong.");
    }
  }, [token, user, update, router]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLablel="Confirming your verification"
      backButtonHref="/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};
