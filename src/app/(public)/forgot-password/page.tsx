"use client";

import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { Field } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useSubmit } from "@/hooks/use-submit";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { pending, run } = useSubmit();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email"));
    const ok = await run(() => api.post("/auth/forgot-password", { email }));
    if (ok) router.push(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <AuthCard
      title="Forgot password"
      description="We will email you a code to reset it."
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <Field
          label="Email"
          id="email"
          type="email"
          autoComplete="email"
          required
        />
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Sending…" : "Send code"}
        </Button>
      </form>
    </AuthCard>
  );
}
