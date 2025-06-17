import { CardWrapper } from "@/components/auth/card-wrapper";
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const AuthError = () => {
  return (
    <CardWrapper
      headerLablel="Oops! Something went wrong!"
      backButtonHref="/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex items-center justify-center">
        <FaExclamationTriangle className="text-destructive" />
      </div>
    </CardWrapper>
  );
};

export default AuthError;
