"use client";

import AppleLogin from "@/components/auth/appleLogin";
import GoogleLogin from "@/components/auth/googleLogin";
import CustomLink from "@/components/customLink";
import Logo from "@/components/logo";
import { useSearchParams } from "next/navigation";

const Auth = () => {
  const searchParams = useSearchParams();

  const paymentId = searchParams.get("payment_id") || "";

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center text-center overflow-hidden px-6 lg:px-0">
      <div className="w-full flex flex-col items-center gap-3 lg:max-w-[420px] rounded-xl p-8 bg-muted">
        <Logo size="lg" className="mb-8" />
        <GoogleLogin signInTextPrefix="Sign in with" paymentId={paymentId} />
      </div>
      <div className="w-full flex flex-row justify-end lg:max-w-[420px] mt-1 gap-1 text-xs text-foreground font-extralight">
        <CustomLink
          href="/privacy"
          className="text-sky-600 underline dark:text-accent"
          target="_blank"
          about="Privacy"
        >
          Privacy
        </CustomLink>
        •
        <CustomLink
          href="/tos"
          className="text-sky-600 underline dark:text-accent"
          target="_blank"
          about="Terms of Service"
        >
          Terms of Service
        </CustomLink>
      </div>
    </div>
  );
};

export default Auth;
