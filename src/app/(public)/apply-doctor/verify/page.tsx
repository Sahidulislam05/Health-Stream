"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";
import { OtpForm } from "@/components/otp-form";
import { api } from "@/lib/api";

export default function VerifyDoctorEmailPage() {
  const router = useRouter();

  const verify = async (email: string, otp: string) => {
    await api.post("/doctor/apply-as-doctor/verify-email", { email, otp });
    toast.success(
      "Email verified. We will email you once your application is reviewed.",
    );
    router.replace("/");
  };

  return (
    <Suspense>
      <OtpForm title="Verify your doctor application" onVerify={verify} />
    </Suspense>
  );
}
