import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { Suspense } from "react";
import { DoctorCard } from "@/components/doctor-card";
import { PageHeader } from "@/components/shared";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPublicDoctors } from "@/lib/server-api";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Find a doctor",
  description:
    "Search verified doctors by name or specialty and see who is available today.",
};

type DoctorFilters = { q: string; page: number; availableToday: boolean };

const toHref = ({ q, page, availableToday }: DoctorFilters) => {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (availableToday) params.set("available", "today");
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/doctors?${query}` : "/doctors";
};

// Filters live in the URL: shareable, back-button safe, and rendered on the server from cache.
async function DoctorResults({ searchParams }: PageProps<"/doctors">) {
  const params = await searchParams;
  const search: DoctorFilters = {
    q: typeof params.q === "string" ? params.q.trim().slice(0, 80) : "",
    page: Math.max(Number(params.page) || 1, 1),
    availableToday: params.available === "today",
  };
  const { data, meta } = await getPublicDoctors(search);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Form action="/doctors" className="flex flex-1 gap-2">
          <Input
            name="q"
            defaultValue={search.q}
            placeholder="Name or specialization"
            aria-label="Search doctors"
            className="max-w-sm"
          />
          {search.availableToday && (
            <input type="hidden" name="available" value="today" />
          )}
          <button
            type="submit"
            aria-label="Search"
            className={buttonVariants({ variant: "outline" })}
          >
            <Search />
          </button>
        </Form>
        <nav aria-label="Filter doctors" className="flex">
          {[
            { label: "All doctors", availableToday: false },
            { label: "Available today", availableToday: true },
          ].map((option) => {
            const active = search.availableToday === option.availableToday;
            return (
              <Link
                key={option.label}
                href={toHref({
                  ...search,
                  page: 1,
                  availableToday: option.availableToday,
                })}
                aria-current={active ? "page" : undefined}
                className={buttonVariants({
                  variant: active ? "default" : "outline",
                })}
              >
                {option.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {data.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-sm text-muted-foreground">
          {search.availableToday
            ? "No doctor has open slots right now. Check again later today."
            : "No doctors found."}
        </p>
      )}

      {meta.totalPages > 1 && (
        <nav
          aria-label="Pages"
          className="mt-6 flex items-center justify-end gap-2 text-xs"
        >
          <Link
            href={toHref({ ...search, page: meta.page - 1 })}
            aria-label="Previous page"
            aria-disabled={meta.page <= 1}
            className={cn(
              buttonVariants({ variant: "outline", size: "icon-sm" }),
              meta.page <= 1 && "pointer-events-none opacity-50",
            )}
          >
            <ChevronLeft />
          </Link>
          <span>
            Page {meta.page} of {meta.totalPages}
          </span>
          <Link
            href={toHref({ ...search, page: meta.page + 1 })}
            aria-label="Next page"
            aria-disabled={meta.page >= meta.totalPages}
            className={cn(
              buttonVariants({ variant: "outline", size: "icon-sm" }),
              meta.page >= meta.totalPages && "pointer-events-none opacity-50",
            )}
          >
            <ChevronRight />
          </Link>
        </nav>
      )}
    </>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {[0, 1, 2, 3, 4, 5].map((key) => (
        <div key={key} className="h-28 animate-pulse bg-muted" />
      ))}
    </div>
  );
}

export default function DoctorsPage(props: PageProps<"/doctors">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        title="Find a doctor"
        description="All doctors are verified by our team before they can consult."
      />
      <Suspense fallback={<ResultsSkeleton />}>
        <DoctorResults {...props} />
      </Suspense>
    </div>
  );
}
