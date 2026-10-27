
export const API_URL = "/api/v1";

export type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: Meta;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

type Options = { method?: string; body?: unknown };

const send = (path: string, { method = "GET", body }: Options) =>
  fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers:
      body && !(body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : undefined,
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

// One refresh shared by every request that hit 401 at the same time.
let refreshing: Promise<boolean> | null = null;
const refreshSession = () => {
  refreshing ??= send("/auth/refresh-token", { method: "POST" })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
};

export async function request<T>(
  path: string,
  options: Options = {},
): Promise<ApiResponse<T>> {
  let res = await send(path, options);

  if (
    res.status === 401 &&
    path !== "/auth/refresh-token" &&
    (await refreshSession())
  ) {
    res = await send(path, options);
  }

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    throw new ApiError(
      json?.message ?? "Something went wrong. Please try again.",
      res.status,
    );
  }

  return json;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export const errorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
