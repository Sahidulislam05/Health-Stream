"use client";

import { PASSWORD_HINT } from "@/components/auth-card";
import { DemoLockNote, PasswordField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useIsDemo } from "@/hooks/use-auth";
import { useSubmit } from "@/hooks/use-submit";
import { api } from "@/lib/api";

export function ChangePasswordForm({ onDone }: { onDone?: () => void }) {
  const isDemo = useIsDemo();
  const { pending, run } = useSubmit();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const ok = await run(
      () =>
        api.post("/auth/change-password", {
          currentPassword: form.get("currentPassword"),
          newPassword: form.get("newPassword"),
        }),
      "Password changed.",
    );
    if (ok) {
      formElement.reset();
      onDone?.();
    }
  };

  return (
    <fieldset disabled={isDemo} className="grid gap-3">
      {isDemo && <DemoLockNote />}
      <form onSubmit={onSubmit} className="grid max-w-sm gap-4">
        <PasswordField
          label="Current password"
          id="currentPassword"
          autoComplete="current-password"
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
        <Button type="submit" disabled={pending} className="w-fit">
          {pending ? "Saving…" : "Change password"}
        </Button>
      </form>
    </fieldset>
  );
}

// For patients who joined with Google and have no password yet.
export function SetPasswordForm() {
  const isDemo = useIsDemo();
  const { pending, run } = useSubmit();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const ok = await run(
      () =>
        api.post("/auth/set-password", {
          password: new FormData(formElement).get("password"),
        }),
      "Password set. You can now also log in with email and password.",
    );
    if (ok) formElement.reset();
  };

  return (
    <fieldset disabled={isDemo} className="grid gap-3">
      {isDemo && <DemoLockNote />}
      <form onSubmit={onSubmit} className="grid max-w-sm gap-4">
        <PasswordField
          label="New password"
          id="password"
          autoComplete="new-password"
          required
          minLength={8}
          hint={PASSWORD_HINT}
        />
        <Button type="submit" disabled={pending} className="w-fit">
          {pending ? "Saving…" : "Set password"}
        </Button>
      </form>
    </fieldset>
  );
}
