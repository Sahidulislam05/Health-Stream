// Server-side reads of public, non-personal API data, cached by Next (ISR).
// Never call these for anything behind login: the cache is shared by every visitor.
import { cacheLife, cacheTag } from "next/cache";
import type { Meta } from "@/lib/api";
import type { Doctor } from "@/lib/types";

const API_ORIGIN = process.env.API_ORIGIN ?? "http://localhost:5000";

type ListResult<T> = { data: T[]; meta: Meta };

const EMPTY_LIST = {
  data: [],
  meta: { page: 1, limit: 0, total: 0, totalPages: 0 },
};

// No cookies are sent, so the API answers as an anonymous visitor (real doctors only).
const getJson = async <T>(path: string): Promise<T | null> => {
  const res = await fetch(`${API_ORIGIN}/api/v1${path}`, {
    signal: AbortSignal.timeout(10_000),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${res.status} for ${path}`);
  return (await res.json()).data ?? null;
};

const getList = async <T>(path: string): Promise<ListResult<T>> => {
  const res = await fetch(`${API_ORIGIN}/api/v1${path}`, {
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`API ${res.status} for ${path}`);
  const json = await res.json();
  return { data: json.data, meta: json.meta };
};

export type DoctorSearch = {
  q?: string;
  page?: number;
  availableToday?: boolean;
};

export async function getPublicDoctors({
  q = "",
  page = 1,
  availableToday = false,
}: DoctorSearch): Promise<ListResult<Doctor>> {
  "use cache";
  cacheTag("doctors");

  const params = new URLSearchParams({ page: String(page), limit: "12" });
  if (q) params.set("searchTerm", q);
  const path = availableToday
    ? "/doctor/public/available-today"
    : "/doctor/public/all-doctors";

  try {
    const result = await getList<Doctor>(`${path}?${params}`);
    // "Available today" depends on the clock and live slots, so it stays fresh.
    if (availableToday) cacheLife("seconds");
    else cacheLife("minutes");
    return result;
  } catch (error) {
    // API down (or mid-deploy): show an empty state briefly instead of failing the page or build.
    console.error("getPublicDoctors failed:", error);
    cacheLife("seconds");
    return EMPTY_LIST;
  }
}

export async function getDoctor(doctorId: string): Promise<Doctor | null> {
  "use cache";
  cacheTag("doctors", `doctor:${doctorId}`);

  try {
    const doctor = await getJson<Doctor>(
      `/doctor/public/${encodeURIComponent(doctorId)}`,
    );
    cacheLife("hours");
    return doctor;
  } catch (error) {
    console.error("getDoctor failed:", error);
    cacheLife("seconds");
    return null;
  }
}

export async function getVerifiedDoctorCount(): Promise<number | null> {
  "use cache";
  cacheTag("doctors");

  try {
    const { meta } = await getList<Doctor>(
      "/doctor/public/all-doctors?limit=1",
    );
    cacheLife("hours");
    return meta.total;
  } catch (error) {
    console.error("getVerifiedDoctorCount failed:", error);
    cacheLife("seconds");
    return null;
  }
}

export async function getFeaturedDoctors(): Promise<Doctor[]> {
  "use cache";
  cacheTag("doctors");

  try {
    const { data } = await getList<Doctor>(
      "/doctor/public/all-doctors?limit=3&sortBy=experienceYears",
    );
    cacheLife("hours");
    return data;
  } catch (error) {
    console.error("getFeaturedDoctors failed:", error);
    cacheLife("seconds");
    return [];
  }
}

// Doctor pages prebuilt at deploy time; the rest are built on first visit (ISR).
export async function getPrerenderedDoctorIds(): Promise<string[]> {
  "use cache";

  try {
    const { data } = await getList<Doctor>(
      "/doctor/public/all-doctors?limit=20&sortBy=experienceYears",
    );
    cacheLife("hours");
    return data.map((doctor) => doctor.id);
  } catch (error) {
    console.error("getPrerenderedDoctorIds failed:", error);
    cacheLife("seconds");
    return [];
  }
}
