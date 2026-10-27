"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard, PASSWORD_HINT } from "@/components/auth-card";
import { Field, PasswordField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useSubmit } from "@/hooks/use-submit";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { pending, run } = useSubmit();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const contactNumber = String(form.get("contactNumber") || "");
    const ok = await run(
      () =>
        api.post("/auth/register", {
          name: form.get("name"),
          email,
          password: form.get("password"),
          patient: contactNumber ? { contactNumber } : undefined,
        }),
      "We sent a 6-digit code to your email.",
    );
    if (ok) router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  };

  return (
    <AuthCard
      title="Create your patient account"
      description="Doctors apply separately."
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <Field
          label="Full name"
          id="name"
          autoComplete="name"
          required
          minLength={3}
          maxLength={50}
        />
        <Field
          label="Email"
          id="email"
          type="email"
          autoComplete="email"
          required
        />
        <Field
          label="Phone (optional)"
          id="contactNumber"
          type="tel"
          autoComplete="tel"
        />
        <PasswordField
          label="Password"
          id="password"
          autoComplete="new-password"
          required
          minLength={8}
          hint={PASSWORD_HINT}
        />
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Sending code…" : "Sign up"}
        </Button>
      </form>
      <p className="mt-4 text-xs">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
