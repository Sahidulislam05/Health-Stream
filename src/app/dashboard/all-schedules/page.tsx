"use client";

import { SearchBox } from "@/components/admin-tools";
import { ADMIN_ROLES, RoleGate } from "@/components/dashboard-shell";
import {
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
import { formatDate, formatTime } from "@/lib/format";
import type { Schedule } from "@/lib/types";

export default function AllSchedulesPage() {
  const list = useListQuery<Schedule>("/schedule/all-schedules", {
    sortBy: "startDateTime",
  });

  return (
    <RoleGate roles={ADMIN_ROLES}>
      <PageHeader
        title="All schedules"
        action={
          <div className="flex flex-wrap items-end gap-2">
            <SearchBox
              placeholder="Doctor name or email"
              onSearch={(term) => list.setFilter("searchTerm", term)}
            />
            <SelectField
              label="Status"
              id="status"
              value={list.filters.status ?? ""}
              onChange={(event) => list.setFilter("status", event.target.value)}
              options={[
                { value: "", label: "All" },
                { value: "DRAFT", label: "Draft" },
                { value: "PUBLISHED", label: "Published" },
              ]}
            />
          </div>
        }
      />
      <AsyncState
        loading={list.loading}
        error={list.error}
        empty={!list.data?.length}
        emptyText="No schedules."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Slots booked</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.data?.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>
                  {schedule.doctor?.name}
                  <p className="text-xs text-muted-foreground">
                    {schedule.doctor?.specialization}
                  </p>
                </TableCell>
                <TableCell>{formatDate(schedule.startDateTime)}</TableCell>
                <TableCell>
                  {formatTime(schedule.startDateTime)} –{" "}
                  {formatTime(schedule.endDateTime)}
                </TableCell>
                <TableCell>
                  {schedule.totalSlots - schedule.availableSlots} /{" "}
                  {schedule.totalSlots}
                </TableCell>
                <TableCell>
                  <StatusBadge status={schedule.status ?? "DRAFT"} />
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
