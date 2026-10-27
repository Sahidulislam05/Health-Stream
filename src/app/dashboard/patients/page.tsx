"use client";

import { BlockToggle, SearchBox } from "@/components/admin-tools";
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
import { formatDate } from "@/lib/format";
import type { Patient } from "@/lib/types";

export default function PatientManagementPage() {
  const list = useListQuery<Patient>("/user/patients");

  return (
    <RoleGate roles={ADMIN_ROLES}>
      <PageHeader
        title="Patient management"
        action={
          <div className="flex flex-wrap items-end gap-2">
            <SearchBox
              placeholder="Name, email, phone"
              onSearch={(term) => list.setFilter("searchTerm", term)}
            />
            <SelectField
              label="Account"
              id="status"
              value={list.filters.status ?? ""}
              onChange={(event) => list.setFilter("status", event.target.value)}
              options={[
                { value: "", label: "All" },
                { value: "ACTIVE", label: "Active" },
                { value: "BLOCKED", label: "Blocked" },
              ]}
            />
          </div>
        }
      />
      <AsyncState
        loading={list.loading}
        error={list.error}
        empty={!list.data?.length}
        emptyText="No patients match."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Sign-in</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.data?.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.contactNumber || "—"}</TableCell>
                <TableCell>
                  {patient.user?.authProvider === "GOOGLE" ? "Google" : "Email"}
                </TableCell>
                <TableCell>{formatDate(patient.createdAt)}</TableCell>
                <TableCell>
                  {patient.user && <StatusBadge status={patient.user.status} />}
                </TableCell>
                <TableCell>
                  <BlockToggle
                    userId={patient.user?.id}
                    status={patient.user?.status}
                    onChange={list.reload}
                  />
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
