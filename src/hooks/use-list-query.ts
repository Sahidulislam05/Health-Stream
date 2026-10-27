"use client";

import { useState } from "react";
import { useApi } from "@/hooks/use-api";

// Paginated, filterable list endpoint. Changing a filter resets to page 1.
export function useListQuery<T>(
  basePath: string | null,
  initialFilters: Record<string, string> = {},
) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialFilters);

  const params = new URLSearchParams({ page: String(page), limit: "10" });
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }

  const result = useApi<T[]>(basePath ? `${basePath}?${params}` : null);

  const setFilter = (key: string, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  return { ...result, filters, setFilter, setPage };
}
