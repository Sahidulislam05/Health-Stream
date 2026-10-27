"use client";

import { BlockToggle, SearchBox } from "@/components/admin-tools";
import { ADMIN_ROLES, RoleGate } from "@/components/dashboard-shell";
import {
  AsyncState,
  DEMO_DISABLED_MESSAGE,
  PageHeader,
  Pagination,
  SelectField,
  StatusBadge,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
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
import { formatDate, formatMoney } from "@/lib/format";
import type { Doctor } from "@/lib/types";

function ReviewButtons({
  doctor,
  onChange,
}: {
  doctor: Doctor;
  onChange: () => void;
}) {
  const isDemo = useIsDemo();
  const { pending, run } = useSubmit();

  const review = async (verificationStatus: "APPROVED" | "REJECTED") => {
    let rejectionReason: string | undefined;
    if (verificationStatus === "REJECTED") {
      rejectionReason = window
        .prompt("Reason for rejection (sent to the applicant):")
        ?.trim();
      if (!rejectionReason) return;
    }
    const ok = await run(
      () =>
        api.post("/doctor/approve-doctor", {
          doctorId: doctor.id,
          verificationStatus,
          rejectionReason,
        }),
      verificationStatus === "APPROVED"
        ? "Approved. Login details were emailed to the doctor."
        : "Application rejected.",
    );
    if (ok) onChange();
  };

  if (!doctor.user?.emailVerified) {
    return (
      <span className="text-xs text-muted-foreground">
        Waiting for email verification
      </span>
    );
  }

  return (
    <>
      <Button
        size="sm"
        onClick={() => review("APPROVED")}
        disabled={pending || isDemo}
        title={isDemo ? DEMO_DISABLED_MESSAGE : undefined}
      >
        Approve
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => review("REJECTED")}
        disabled={pending || isDemo}
        title={isDemo ? DEMO_DISABLED_MESSAGE : undefined}
      >
        Reject
      </Button>
    </>
  );
}

export default function DoctorManagementPage() {
  const list = useListQuery<Doctor>("/doctor/all-doctors", {
    verificationStatus: "PENDING",
  });

  return (
    <RoleGate roles={ADMIN_ROLES}>
      <PageHeader
        title="Doctor management"
        description="Review applications and block or unblock doctors."
        action={
          <div className="flex flex-wrap items-end gap-2">
            <SearchBox
              placeholder="Name, email, license"
              onSearch={(term) => list.setFilter("searchTerm", term)}
            />
            <SelectField
              label="Application"
              id="verificationStatus"
              value={list.filters.verificationStatus ?? ""}
              onChange={(event) =>
                list.setFilter("verificationStatus", event.target.value)
              }
              options={[
                { value: "", label: "All" },
                { value: "PENDING", label: "Pending" },
                { value: "APPROVED", label: "Approved" },
                { value: "REJECTED", label: "Rejected" },
              ]}
            />
          </div>
        }
      />
      <AsyncState
        loading={list.loading}
        error={list.error}
        empty={!list.data?.length}
        emptyText="No doctors match."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.data?.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>
                  <p className="font-medium">{doctor.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doctor.email}
                  </p>
                </TableCell>
                <TableCell>
                  {doctor.specialization}
                  <p className="text-xs text-muted-foreground">
                    {doctor.qualifications} · {doctor.experienceYears} yrs
                  </p>
                </TableCell>
                <TableCell>
                  {doctor.licenseNumber}
                  {doctor.resume && (
                    <a
                      href={doctor.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-primary hover:underline"
                    >
                      Resume
                    </a>
                  )}
                </TableCell>
                <TableCell>{formatMoney(doctor.consultationFee)}</TableCell>
                <TableCell>{formatDate(doctor.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <StatusBadge
                      status={doctor.verificationStatus ?? "PENDING"}
                    />
                    {doctor.user?.status === "BLOCKED" && (
                      <StatusBadge status="BLOCKED" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {doctor.verificationStatus === "PENDING" && (
                      <ReviewButtons doctor={doctor} onChange={list.reload} />
                    )}
                    {doctor.verificationStatus === "APPROVED" && (
                      <BlockToggle
                        userId={doctor.user?.id}
                        status={doctor.user?.status}
                        onChange={list.reload}
                      />
                    )}
                  </div>
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
