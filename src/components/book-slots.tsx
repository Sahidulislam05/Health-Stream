"use client";

import { usePathname, useRouter } from "next/navigation";
import { AsyncState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { useSubmit } from "@/hooks/use-submit";
import { api } from "@/lib/api";
import { formatDate, formatMoney, formatTime } from "@/lib/format";
import type { Schedule } from "@/lib/types";

// Today's bookable sessions for one doctor, with "Book & pay" (redirects to bKash).
export function SlotList({
  schedules,
  fee,
}: {
  schedules: Schedule[];
  fee: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, status } = useAuth();
  const { pending, run } = useSubmit();
  const canBook = status !== "authenticated" || user?.role === "PATIENT";

  const book = async (scheduleId: string) => {
    if (status !== "authenticated") {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    const res = await run(() =>
      api.post<{ paymentUrl: string }>("/appointment/book-appointment", {
        scheduleId,
      }),
    );
    // Hand over to bKash; it redirects back to /dashboard/my-appointments.
    if (res) window.location.href = res.data.paymentUrl;
  };

  return (
    <>
      <ul className="grid gap-3">
        {schedules.map((schedule) => (
          <li key={schedule.id} className="border p-3 text-sm">
            <p className="font-medium">
              {formatTime(schedule.startDateTime)} –{" "}
              {formatTime(schedule.endDateTime)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(schedule.startDateTime)} · {schedule.availableSlots}{" "}
              of {schedule.totalSlots} slots left
            </p>
            <Button
              className="mt-3 w-full"
              disabled={pending || !canBook}
              onClick={() => book(schedule.id)}
            >
              {pending ? "Opening bKash…" : `Book & pay ${formatMoney(fee)}`}
            </Button>
          </li>
        ))}
      </ul>
      {!canBook && (
        <p className="mt-3 text-xs text-muted-foreground">
          Only patient accounts can book.
        </p>
      )}
    </>
  );
}

// Slots change with every booking, so they are always read live (never from the page cache).
export function BookSlots({
  doctorId,
  fee,
}: {
  doctorId: string;
  fee: string | null;
}) {
  const { data, loading, error } = useApi<Schedule[]>(
    `/schedule/todays-schedule?doctorId=${doctorId}`,
  );

  return (
    <AsyncState
      loading={loading}
      error={error}
      empty={!data?.length}
      emptyText="No open slots today. Bookings close when a session starts."
    >
      <SlotList schedules={data ?? []} fee={fee} />
    </AsyncState>
  );
}
