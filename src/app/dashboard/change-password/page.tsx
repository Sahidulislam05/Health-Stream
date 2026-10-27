"use client";

import { useRouter } from "next/navigation";
import { ChangePasswordForm } from "@/components/password-forms";
import { PageHeader } from "@/components/shared";
import { useAuth } from "@/hooks/use-auth";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, loadUser } = useAuth();

  const onDone = async () => {
    await loadUser();
    router.replace("/dashboard");
  };

  return (
    <>
      <PageHeader
        title="Change your password"
        description={
          user?.needPasswordChange
            ? "Your account was created with a temporary password. Choose your own before you continue."
            : undefined
        }
      />
      <ChangePasswordForm onDone={onDone} />
    </>
  );
}
