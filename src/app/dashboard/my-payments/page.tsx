"use client";

import { RoleGate } from "@/components/dashboard-shell";
import { PaymentsTable } from "@/components/payments-table";

export default function MyPaymentsPage() {
  return (
    <RoleGate roles={["PATIENT"]}>
      <PaymentsTable path="/payment/my-payments" />
    </RoleGate>
  );
}
