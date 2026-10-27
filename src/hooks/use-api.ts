"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { errorMessage, request } from "@/lib/api";

// Query key from the REST path: "/appointment/my-appointments?page=2" ->
// ["appointment", "my-appointments", { page: "2" }], so a whole module can be invalidated by prefix.
export const apiQueryKey = (path: string) => {
  const [pathname, search = ""] = path.split("?");
  return [
    ...pathname.split("/").filter(Boolean),
    Object.fromEntries(new URLSearchParams(search)),
  ];
};

// Loads a GET endpoint through the shared TanStack cache; pass null to skip.
export function useApi<T>(path: string | null) {
  const query = useQuery({
    queryKey: path ? apiQueryKey(path) : ["disabled"],
    queryFn: () => request<T>(path as string),
    enabled: Boolean(path),
    placeholderData: keepPreviousData,
  });

  return {
    data: query.data?.data ?? null,
    meta: query.data?.meta,
    error: query.error ? errorMessage(query.error) : null,
    loading: query.isPending && Boolean(path),
    reload: query.refetch,
  };
}
