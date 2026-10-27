"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";
import { OtpForm } from "@/components/otp-form";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";

export default function VerifyEmailPage() {
  const router = useRouter();
  const loadUser = useAuth((state) => state.loadUser);

  const verify = async (email: string, otp: string) => {
    await api.post("/auth/verify-email", { email, otp });
    toast.success("Welcome to HealthStream!");
    await loadUser();
    router.replace("/dashboard");
  };

  return (
    <Suspense>
      <OtpForm title="Verify your email" onVerify={verify} />
    </Suspense>
  );
}
