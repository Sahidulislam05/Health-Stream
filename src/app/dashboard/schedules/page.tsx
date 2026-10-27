"use client";

import { useState } from "react";
import { RoleGate } from "@/components/dashboard-shell";
import {
  AsyncState,
  DEMO_DISABLED_MESSAGE,
  Field,
  PageHeader,
  Pagination,
  StatusBadge,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsDemo } from "@/hooks/use-auth";
import { useListQuery } from "@/hooks/use-list-query";
import { useSubmit } from "@/hooks/use-submit";
import { api } from "@/lib/api";
import {
  dhakaIso,
  formatDate,
  formatTime,
  toDateInput,
  toTimeInput,
} from "@/lib/format";
import type { Schedule } from "@/lib/types";

// Create and edit share one form: a schedule is one day, 3–8 hours, split into 20-minute slots.
function ScheduleForm({
  schedule,
  onSaved,
}: {
  schedule?: Schedule;
  onSaved: () => void;
}) {
  const { pending, run } = useSubmit();
  const isBooked = schedule
    ? schedule.availableSlots !== schedule.totalSlots
    : false;
  const isPublished = schedule?.status === "PUBLISHED";
  const idPrefix = schedule?.id ?? "new";

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const date = String(form.get("date"));
    const body = {
      startDateTime: dhakaIso(date, String(form.get("startTime"))),
      endDateTime: dhakaIso(date, String(form.get("endTime"))),
      meetingLink: String(form.get("meetingLink")).trim(),
    };
    const ok = await run(
      () =>
        schedule
          ? api.patch(
              `/schedule/update-schedule/${schedule.id}`,
              isBooked ? { meetingLink: body.meetingLink } : body,
            )
          : api.post("/schedule/create-schedule", body),
      schedule
        ? "Schedule updated."
        : "Draft schedule created. Publish it when ready.",
    );
    if (!ok) return;
    if (!schedule) formElement.reset();
    onSaved();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 sm:grid-cols-4 sm:items-end"
    >
      <Field
        label="Date"
        id={`${idPrefix}-date`}
        name="date"
        type="date"
        required
        disabled={isPublished}
        defaultValue={schedule ? toDateInput(schedule.startDateTime) : ""}
      />
      <Field
        label="Start"
        id={`${idPrefix}-startTime`}
        name="startTime"
        type="time"
        required
        disabled={isBooked}
        defaultValue={schedule ? toTimeInput(schedule.startDateTime) : ""}
      />
      <Field
        label="End"
        id={`${idPrefix}-endTime`}
        name="endTime"
        type="time"
        required
        disabled={isBooked}
        defaultValue={schedule ? toTimeInput(schedule.endDateTime) : ""}
      />
      <Field
        label="Video call link"
        id={`${idPrefix}-meetingLink`}
        name="meetingLink"
        type="url"
        placeholder="https://meet.google.com/…"
        required
        defaultValue={schedule?.meetingLink ?? ""}
      />
      {/* Disabled inputs are not submitted, so locked values are sent as hidden fields. */}
      {isPublished && schedule && (
        <input
          type="hidden"
          name="date"
          value={toDateInput(schedule.startDateTime)}
        />
      )}
      {isBooked && schedule && (
        <>
          <input
            type="hidden"
            name="startTime"
            value={toTimeInput(schedule.startDateTime)}
          />
          <input
            type="hidden"
            name="endTime"
            value={toTimeInput(schedule.endDateTime)}
          />
        </>
      )}
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : schedule ? "Save changes" : "Create draft"}
      </Button>
      {schedule && (isPublished || isBooked) && (
        <p className="text-xs text-muted-foreground sm:col-span-3">
          {isBooked
            ? "Time is locked because patients have booked."
            : "Date is locked after publishing."}
        </p>
      )}
    </form>
  );
}

function ScheduleRow({
  schedule,
  onChange,
}: {
  schedule: Schedule;
  onChange: () => void;
}) {
  const isDemo = useIsDemo();
  const [editing, setEditing] = useState(false);
  const { pending, run } = useSubmit();
  const booked = schedule.totalSlots - schedule.availableSlots;

  const publish = async () => {
    const ok = await run(
      () => api.patch(`/schedule/publish-schedule/${schedule.id}`),
      "Published. Patients can now book it today.",
    );
    if (ok) onChange();
  };

  const remove = async () => {
    if (!window.confirm("Delete this schedule?")) return;
    const ok = await run(
      () => api.delete(`/schedule/${schedule.id}`),
      "Schedule deleted.",
    );
    if (ok) onChange();
  };

  return (
    <>
      <TableRow>
        <TableCell>{formatDate(schedule.startDateTime)}</TableCell>
        <TableCell>
          {formatTime(schedule.startDateTime)} –{" "}
          {formatTime(schedule.endDateTime)}
        </TableCell>
        <TableCell>
          {booked} / {schedule.totalSlots} booked
        </TableCell>
        <TableCell>
          <StatusBadge status={schedule.status ?? "DRAFT"} />
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {schedule.status === "DRAFT" && (
              <Button size="sm" onClick={publish} disabled={pending}>
                Publish
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditing(!editing)}
              aria-expanded={editing}
            >
              {editing ? "Close" : "Edit"}
            </Button>
            {booked === 0 && (
              <Button
                size="sm"
                variant="destructive"
                onClick={remove}
                disabled={pending || isDemo}
                title={isDemo ? DEMO_DISABLED_MESSAGE : undefined}
              >
                Delete
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
      {editing && (
        <TableRow>
          <TableCell colSpan={5} className="bg-muted/40 whitespace-normal">
            <ScheduleForm
              schedule={schedule}
              onSaved={() => {
                setEditing(false);
                onChange();
              }}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function SchedulesPage() {
  const list = useListQuery<Schedule>("/schedule/my-schedules", {
    sortBy: "startDateTime",
  });

  return (
    <RoleGate roles={["DOCTOR"]}>
      <PageHeader
        title="Schedules"
        description="Patients only see today's published schedules, until each one starts."
      />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>New schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleForm onSaved={list.reload} />
        </CardContent>
      </Card>
      <AsyncState
        loading={list.loading}
        error={list.error}
        empty={!list.data?.length}
        emptyText="No schedules yet."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Slots</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.data?.map((schedule) => (
              <ScheduleRow
                key={schedule.id}
                schedule={schedule}
                onChange={list.reload}
              />
            ))}
          </TableBody>
        </Table>
      </AsyncState>
      <Pagination meta={list.meta} onPage={list.setPage} />
    </RoleGate>
  );
}
