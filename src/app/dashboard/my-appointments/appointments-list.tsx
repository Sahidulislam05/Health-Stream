"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { RoleGate } from "@/components/dashboard-shell";
import {
  APPOINTMENT_STATUS_OPTIONS,
  AsyncState,
  PageHeader,
  Pagination,
  SelectField,
  StatusBadge,
} from "@/components/shared";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useListQuery } from "@/hooks/use-list-query";
import { useSubmit } from "@/hooks/use-submit";
import { api } from "@/lib/api";
import { formatDate, formatMoney, formatTime } from "@/lib/format";
import type { Appointment } from "@/lib/types";

const PAYMENT_RESULT: Record<string, () => void> = {
  success: () =>
    toast.success(
      "Payment received. Your invoice is on its way to your email.",
    ),
  failure: () =>
    toast.error("Payment failed. You can try again from the appointment."),
  cancel: () =>
    toast.info(
      "Payment cancelled. You can pay later before the session starts.",
    ),
};

const isRefundable = (appointment: Appointment) =>
  appointment.payment?.status === "PAID" &&
  appointment.schedule != null &&
  new Date(appointment.schedule.startDateTime).getTime() - Date.now() >
    60 * 60 * 1000;

function AppointmentCard({
  appointment,
  onChange,
}: {
  appointment: Appointment;
  onChange: () => void;
}) {
  const { pending, run } = useSubmit();
  const schedule = appointment.schedule;

  const pay = async () => {
    const res = await run(() =>
      api.post<{ paymentUrl: string }>("/appointment/pay-appointment", {
        appointmentId: appointment.id,
      }),
    );
    if (res) window.location.href = res.data.paymentUrl;
  };

  const cancel = async () => {
    const refundNote = isRefundable(appointment)
      ? "You will get a full refund."
      : appointment.payment?.status === "PAID"
        ? "It is less than 1 hour before the session, so there is NO refund."
        : "";
    if (!window.confirm(`Cancel this appointment? ${refundNote}`)) return;
    const ok = await run(
      () =>
        api.post("/appointment/cancel-appointment", {
          appointmentId: appointment.id,
        }),
      "Appointment cancelled.",
    );
    if (ok) onChange();
  };

  const canJoin =
    appointment.status === "CONFIRMED" || appointment.status === "ONGOING";

  return (
    <Card>
      <CardContent className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="grid gap-1 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">Dr. {appointment.doctor?.name}</span>
            <span className="text-xs text-primary">
              {appointment.doctor?.specialization}
            </span>
            <StatusBadge status={appointment.status} />
          </div>
          {schedule && (
            <p className="text-xs text-muted-foreground">
              {formatDate(schedule.startDateTime)} ·{" "}
              {appointment.joiningTime
                ? `Join at ${formatTime(appointment.joiningTime)} · Serial #${appointment.serialNumber}`
                : `Session ${formatTime(schedule.startDateTime)} – ${formatTime(schedule.endDateTime)}`}
            </p>
          )}
          {appointment.payment && (
            <p className="text-xs text-muted-foreground">
              {formatMoney(appointment.payment.amount)} · payment{" "}
              {appointment.payment.status.toLowerCase()}
              {appointment.payment.bkashTrxId &&
                ` · TrxID ${appointment.payment.bkashTrxId}`}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {canJoin && schedule?.meetingLink && (
            <a
              href={schedule.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants()}
            >
              Join call
            </a>
          )}
          {appointment.prescriptionUrl && (
            <a
              href={appointment.prescriptionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              Prescription
            </a>
          )}
          {appointment.status === "PENDING" && (
            <Button onClick={pay} disabled={pending}>
              Pay now
            </Button>
          )}
          {(appointment.status === "PENDING" ||
            appointment.status === "CONFIRMED") && (
            <Button variant="destructive" onClick={cancel} disabled={pending}>
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MyAppointments() {
  const paymentStatus = useSearchParams().get("status");
  const list = useListQuery<Appointment>("/appointment/my-appointments");

  // bKash sends the patient back here with ?status=success|failure|cancel.
  useEffect(() => {
    if (paymentStatus) PAYMENT_RESULT[paymentStatus]?.();
  }, [paymentStatus]);

  return (
    <RoleGate roles={["PATIENT"]}>
      <PageHeader
        title="My appointments"
        description="Cancel more than 1 hour before the session starts for a full refund."
        action={
          <SelectField
            label="Status"
            id="status"
            options={APPOINTMENT_STATUS_OPTIONS}
            value={list.filters.status ?? ""}
            onChange={(event) => list.setFilter("status", event.target.value)}
          />
        }
      />
      <AsyncState
        loading={list.loading}
        error={list.error}
        empty={!list.data?.length}
        emptyText="No appointments yet."
      >
        <div className="grid gap-3">
          {list.data?.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onChange={list.reload}
            />
          ))}
        </div>
      </AsyncState>
      <Pagination meta={list.meta} onPage={list.setPage} />
    </RoleGate>
  );
}
