import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const LandingPage = () => {
  console.log("landing page");
  return (
    <div className="space-y-6 text-center">
      <h1
        className={cn(
          "text-6xl font-semibold text-white drop-shadow-md",
          font.className
        )}
      >
        Livelet
      </h1>
      <p className="text-gray-300">A collaborative code environment service</p>
      <div>
        <LoginButton>
          <Button variant="secondary" size="lg">
            Sign in
          </Button>
        </LoginButton>
      </div>
    </div>
  );
};
