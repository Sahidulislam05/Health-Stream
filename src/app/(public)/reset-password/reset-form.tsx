"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard, PASSWORD_HINT } from "@/components/auth-card";
import { Field, PasswordField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useSubmit } from "@/hooks/use-submit";
import { api } from "@/lib/api";

export function ResetForm() {
  const router = useRouter();
  const email = useSearchParams().get("email") ?? "";
  const { pending, run } = useSubmit();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const ok = await run(
      () =>
        api.post("/auth/reset-password", {
          email,
          otp: form.get("otp"),
          newPassword: form.get("newPassword"),
        }),
      "Password changed. Please log in.",
    );
    if (ok) router.replace("/login");
  };

  return (
    <AuthCard
      title="Reset password"
      description={`If ${email || "your email"} has an account, a code is on its way.`}
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
        <PasswordField
          label="New password"
          id="newPassword"
          autoComplete="new-password"
          required
          minLength={8}
          hint={PASSWORD_HINT}
        />
        <Button type="submit" size="lg" disabled={pending || !email}>
          {pending ? "Saving…" : "Reset password"}
        </Button>
      </form>
    </AuthCard>
  );
}
