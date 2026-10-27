"use client";

import { ADMIN_ROLES, RoleGate } from "@/components/dashboard-shell";
import { PaymentsTable } from "@/components/payments-table";

export default function AllPaymentsPage() {
  return (
    <RoleGate roles={ADMIN_ROLES}>
      <PaymentsTable path="/payment/all-payments" showPatient />
    </RoleGate>
  );
}
