"use client";

import { SlotList } from "@/components/book-slots";
import { RoleGate } from "@/components/dashboard-shell";
import { DoctorAvatar } from "@/components/doctor-card";
import { AsyncState, PageHeader, Pagination } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { useListQuery } from "@/hooks/use-list-query";
import { formatMoney } from "@/lib/format";
import type { Doctor } from "@/lib/types";

// Signed-in booking: the API answers for this user (demo patients see demo doctors only),
// so this list is read live instead of from the shared public page cache.
export default function BookDoctorPage() {
  const list = useListQuery<Doctor>("/doctor/public/available-today");

  return (
    <RoleGate roles={["PATIENT"]}>
      <PageHeader
        title="Book a doctor"
        description="Doctors with open slots today. Bookings close when a session starts."
      />
      <AsyncState
        loading={list.loading}
        error={list.error}
        empty={!list.data?.length}
        emptyText="No doctor has open slots right now. Check again later today."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {list.data?.map((doctor) => (
            <Card key={doctor.id}>
              <CardContent className="grid gap-4">
                <div className="flex gap-3">
                  <DoctorAvatar doctor={doctor} />
                  <div>
                    <p className="font-medium">Dr. {doctor.name}</p>
                    <p className="text-xs text-primary">
                      {doctor.specialization}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {doctor.qualifications} · {doctor.experienceYears} yrs ·{" "}
                      {formatMoney(doctor.consultationFee)}
                    </p>
                  </div>
                </div>
                <SlotList
                  schedules={doctor.schedules ?? []}
                  fee={doctor.consultationFee}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </AsyncState>
      <Pagination meta={list.meta} onPage={list.setPage} />
    </RoleGate>
  );
}
