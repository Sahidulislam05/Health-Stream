"use client";

import { Search } from "lucide-react";
import { DEMO_DISABLED_MESSAGE } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsDemo } from "@/hooks/use-auth";
import { useSubmit } from "@/hooks/use-submit";
import { api } from "@/lib/api";
import type { UserStatus } from "@/lib/types";

// Block / unblock any account. The API decides who may act on whom.
export function BlockToggle({
  userId,
  status,
  onChange,
}: {
  userId?: string;
  status?: UserStatus;
  onChange: () => void;
}) {
  const { pending, run } = useSubmit();
  const isDemo = useIsDemo();
  if (!userId || !status) return null;

  const isBlocked = status === "BLOCKED";

  const toggle = async () => {
    if (
      !isBlocked &&
      !window.confirm("Block this account? They will be logged out everywhere.")
    )
      return;
    const ok = await run(
      () =>
        api.patch(`/user/${userId}/status`, {
          status: isBlocked ? "ACTIVE" : "BLOCKED",
        }),
      isBlocked ? "Account unblocked." : "Account blocked.",
    );
    if (ok) onChange();
  };

  return (
    <Button
      size="sm"
      variant={isBlocked ? "outline" : "destructive"}
      onClick={toggle}
      disabled={pending || isDemo}
      title={isDemo ? DEMO_DISABLED_MESSAGE : undefined}
    >
      {isBlocked ? "Unblock" : "Block"}
    </Button>
  );
}

export function SearchBox({
  onSearch,
  placeholder,
}: {
  onSearch: (term: string) => void;
  placeholder: string;
}) {
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(String(new FormData(event.currentTarget).get("q")).trim());
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input
        name="q"
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-56"
      />
      <Button type="submit" variant="outline" aria-label="Search">
        <Search />
      </Button>
    </form>
  );
}
