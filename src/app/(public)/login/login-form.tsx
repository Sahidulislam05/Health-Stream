"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { DemoLogin } from "@/components/demo-login";
import { GoogleLogin } from "@/components/google-login";
import { Field, PasswordField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSubmit } from "@/hooks/use-submit";
import { api } from "@/lib/api";

// Only same-site paths are allowed as a post-login redirect.
const safeNext = (next: string | null) =>
  next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

export function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const loadUser = useAuth((state) => state.loadUser);
  const { pending, run } = useSubmit();

  const finishLogin = async () => {
    const user = await loadUser();
    router.replace(
      user?.needPasswordChange ? "/dashboard/change-password" : next,
    );
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const ok = await run(() =>
      api.post("/auth/login", {
        email: form.get("email"),
        password: form.get("password"),
      }),
    );
    if (ok) await finishLogin();
  };

  return (
    <AuthCard
      title="Log in"
      description="Patients, doctors and admins all log in here."
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <Field
          label="Email"
          id="email"
          type="email"
          autoComplete="email"
          required
        />
        <PasswordField
          label="Password"
          id="password"
          autoComplete="current-password"
          required
        />
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Logging in…" : "Log in"}
        </Button>
      </form>
      <div className="mt-4 grid gap-3">
        <GoogleLogin onSuccess={finishLogin} />
        <DemoLogin onSuccess={finishLogin} />
        <div className="flex justify-between text-xs">
          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot password?
          </Link>
          <Link href="/register" className="text-primary hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
