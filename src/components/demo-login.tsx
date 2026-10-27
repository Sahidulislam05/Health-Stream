"use client";

import { ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { useSubmit } from "@/hooks/use-submit";
import { api } from "@/lib/api";

const ROLES = [
  { role: "PATIENT", label: "Patient", icon: UserRound },
  { role: "DOCTOR", label: "Doctor", icon: Stethoscope },
  { role: "ADMIN", label: "Admin", icon: ShieldCheck },
] as const;

// One-click sign-in to shared demo accounts. Shown only when the API has demo mode on;
// the API signs in without any password reaching the browser.
export function DemoLogin({ onSuccess }: { onSuccess: () => void }) {
  const { data } = useApi<{ enabled: boolean }>("/auth/demo");
  const { pending, run } = useSubmit();

  if (!data?.enabled) return null;

  const signIn = async (role: (typeof ROLES)[number]["role"]) => {
    const ok = await run(() => api.post("/auth/demo-login", { role }));
    if (ok) onSuccess();
  };

  return (
    <section
      aria-labelledby="demo-login-title"
      className="border border-dashed p-4"
    >
      <h2 id="demo-login-title" className="text-sm font-medium">
        Explore with a demo account
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Shared accounts with sample data, reset every night. Payments use bKash
        sandbox.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {ROLES.map(({ role, label, icon: Icon }) => (
          <Button
            key={role}
            variant="outline"
            disabled={pending}
            onClick={() => signIn(role)}
            className="h-auto flex-col gap-1 py-3"
          >
            <Icon className="size-5 text-primary" aria-hidden />
            {label}
          </Button>
        ))}
      </div>
    </section>
  );
}
