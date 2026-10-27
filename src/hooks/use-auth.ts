"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError, api } from "@/lib/api";
import type { User } from "@/lib/types";

const ME_KEY = ["auth", "me"];

// Guests get null instead of an error, so "not logged in" is a normal state.
const fetchMe = async (): Promise<User | null> => {
  try {
    return (await api.get<User>("/auth/me")).data;
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      return null;
    }
    throw error;
  }
};

const meQuery = {
  queryKey: ME_KEY,
  queryFn: fetchMe,
  staleTime: 5 * 60 * 1000,
};

export type AuthState = {
  user: User | null;
  status: "loading" | "authenticated" | "guest";
  loadUser: () => Promise<User | null>;
  logout: () => Promise<void>;
};

// The signed-in user lives in the TanStack cache (server state), not in a client store.
export function useAuth(): AuthState;
export function useAuth<T>(select: (state: AuthState) => T): T;
export function useAuth<T>(select?: (state: AuthState) => T) {
  const queryClient = useQueryClient();
  const me = useQuery(meQuery);

  const state: AuthState = {
    user: me.data ?? null,
    status: me.isPending ? "loading" : me.data ? "authenticated" : "guest",
    loadUser: () => queryClient.fetchQuery({ ...meQuery, staleTime: 0 }),
    logout: async () => {
      await api.post("/auth/logout").catch(() => {});
      // Drop every cached private response. The `me` query itself is kept (set to null)
      // so components already watching it switch to "guest" immediately.
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "auth",
      });
      queryClient.setQueryData(ME_KEY, null);
    },
  };

  return select ? select(state) : state;
}

// Shared demo accounts: some actions are refused by the API (403), so the UI disables them too.
export const useIsDemo = () => useAuth((state) => Boolean(state.user?.isDemo));
