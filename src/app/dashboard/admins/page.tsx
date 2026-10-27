"use client";

import { BlockToggle, SearchBox } from "@/components/admin-tools";
import { ADMIN_ROLES, RoleGate } from "@/components/dashboard-shell";
import {
  AsyncState,
  DemoLockNote,
  Field,
  PageHeader,
  Pagination,
  SelectField,
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
import { useAuth, useIsDemo } from "@/hooks/use-auth";
import { useListQuery } from "@/hooks/use-list-query";
import { useSubmit } from "@/hooks/use-submit";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Admin } from "@/lib/types";

function CreateAdminForm({
  isSuperAdmin,
  onCreated,
}: {
  isSuperAdmin: boolean;
  onCreated: () => void;
}) {
  const isDemo = useIsDemo();
  const { pending, run } = useSubmit();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const contactNumber = String(form.get("contactNumber") ?? "").trim();
    const ok = await run(
      () =>
        api.post("/admin/create-admin", {
          name: form.get("name"),
          email: form.get("email"),
          personalEmail: form.get("personalEmail"),
          contactNumber: contactNumber || undefined,
          role: form.get("role") ?? "ADMIN",
        }),
      "Account created. Login details were sent to the personal email.",
    );
    if (ok) {
      formElement.reset();
      onCreated();
    }
  };

  return (
    <fieldset disabled={isDemo} className="grid gap-3">
      {isDemo && <DemoLockNote />}
      <form
        onSubmit={onSubmit}
        className="grid gap-4 sm:grid-cols-3 sm:items-end"
      >
        <Field
          label="Full name"
          id="name"
          required
          minLength={3}
          maxLength={50}
        />
        <Field
          label="Organization email (login)"
          id="email"
          type="email"
          required
        />
        <Field
          label="Personal email (gets the password)"
          id="personalEmail"
          type="email"
          required
        />
        <Field label="Phone (optional)" id="contactNumber" type="tel" />
        {isSuperAdmin && (
          <SelectField
            label="Role"
            id="role"
            options={[
              { value: "ADMIN", label: "Admin" },
              { value: "SUPER_ADMIN", label: "Super Admin" },
            ]}
          />
        )}
        <Button type="submit" disabled={pending} className="w-fit">
          {pending ? "Creating…" : "Create account"}
        </Button>
      </form>
    </fieldset>
  );
}

export default function AdminManagementPage() {
  const user = useAuth((state) => state.user);
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const list = useListQuery<Admin>("/admin/all-admins");

  return (
    <RoleGate roles={ADMIN_ROLES}>
      <PageHeader
        title="Admin management"
        description={
          isSuperAdmin
            ? undefined
            : "Only a Super Admin can create Super Admins or block admins."
        }
        action={
          <SearchBox
            placeholder="Name or email"
            onSearch={(term) => list.setFilter("searchTerm", term)}
          />
        }
      />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>New admin</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateAdminForm
            isSuperAdmin={isSuperAdmin}
            onCreated={list.reload}
          />
        </CardContent>
      </Card>
      <AsyncState
        loading={list.loading}
        error={list.error}
        empty={!list.data?.length}
        emptyText="No admins found."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Login email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              {isSuperAdmin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.data?.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.user.role.replace("_", " ")}</TableCell>
                <TableCell>{formatDate(admin.createdAt)}</TableCell>
                <TableCell>
                  <StatusBadge status={admin.user.status} />
                </TableCell>
                {isSuperAdmin && (
                  <TableCell>
                    {admin.user.id !== user?.id && (
                      <BlockToggle
                        userId={admin.user.id}
                        status={admin.user.status}
                        onChange={list.reload}
                      />
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AsyncState>
      <Pagination meta={list.meta} onPage={list.setPage} />
    </RoleGate>
  );
}
