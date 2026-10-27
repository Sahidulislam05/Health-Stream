"use client";

import { useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { Field } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useSubmit } from "@/hooks/use-submit";

// Shared by patient email verification and doctor application verification.
export function OtpForm({
  title,
  onVerify,
}: {
  title: string;
  onVerify: (email: string, otp: string) => Promise<unknown>;
}) {
  const email = useSearchParams().get("email") ?? "";
  const { pending, run } = useSubmit();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const otp = String(new FormData(event.currentTarget).get("otp"));
    await run(() => onVerify(email, otp));
  };

  return (
    <AuthCard
      title={title}
      description={`Enter the 6-digit code sent to ${email || "your email"}.`}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <Field
          label="Code"
          id="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          required
        />
        <Button type="submit" size="lg" disabled={pending || !email}>
          {pending ? "Verifying…" : "Verify"}
        </Button>
      </form>
    </AuthCard>
  );
}
