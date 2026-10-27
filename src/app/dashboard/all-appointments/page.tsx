"use client";

import { ADMIN_ROLES, RoleGate } from "@/components/dashboard-shell";
import {
  APPOINTMENT_STATUS_OPTIONS,
  AsyncState,
  PageHeader,
  Pagination,
  SelectField,
  StatusBadge,
} from "@/components/shared";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListQuery } from "@/hooks/use-list-query";
import { formatDate, formatMoney, formatTime } from "@/lib/format";
import type { Appointment } from "@/lib/types";

export default function AllAppointmentsPage() {
  const list = useListQuery<Appointment>("/appointment/all-appointments");

  return (
    <RoleGate roles={ADMIN_ROLES}>
      <PageHeader
        title="All appointments"
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
        emptyText="No appointments."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Joining</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.data?.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  {appointment.patient?.name}
                  <p className="text-xs text-muted-foreground">
                    {appointment.patient?.email}
                  </p>
                </TableCell>
                <TableCell>
                  {appointment.doctor?.name}
                  <p className="text-xs text-muted-foreground">
                    {appointment.doctor?.specialization}
                  </p>
                </TableCell>
                <TableCell>
                  {appointment.schedule &&
                    formatDate(appointment.schedule.startDateTime)}
                </TableCell>
                <TableCell>
                  {appointment.joiningTime
                    ? `${formatTime(appointment.joiningTime)} · #${appointment.serialNumber}`
                    : "—"}
                </TableCell>
                <TableCell>
                  {appointment.payment ? (
                    <>
                      {formatMoney(appointment.payment.amount)}{" "}
                      <StatusBadge status={appointment.payment.status} />
                    </>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={appointment.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AsyncState>
      <Pagination meta={list.meta} onPage={list.setPage} />
    </RoleGate>
  );
}
