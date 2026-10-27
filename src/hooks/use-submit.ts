"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { errorMessage } from "@/lib/api";

// Runs a write with a pending flag; failures become an error toast.
// After any successful write every cached read is marked stale (not refetched):
// the current page reloads its own list, other pages refetch when next opened.
export function useSubmit() {
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(false);

  const run = async <T>(action: () => Promise<T>, successMessage?: string) => {
    setPending(true);
    try {
      const result = await action();
      await queryClient.invalidateQueries({ refetchType: "none" });
      if (successMessage) toast.success(successMessage);
      return result;
    } catch (error) {
      toast.error(errorMessage(error));
      return undefined;
    } finally {
      setPending(false);
    }
  };

  return { pending, run };
}
