"use client";

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
import { formatDate, formatDateTime, formatMoney } from "@/lib/format";
import type { Payment } from "@/lib/types";

const PAYMENT_STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "PAID", label: "Paid" },
  { value: "UNPAID", label: "Unpaid" },
  { value: "REFUNDED", label: "Refunded" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
];

// Patients see their own payments; admins see everyone's and can filter by status.
export function PaymentsTable({
  path,
  showPatient,
}: {
  path: string;
  showPatient?: boolean;
}) {
  const list = useListQuery<Payment>(path);

  return (
    <>
      <PageHeader
        title="Payments"
        action={
          showPatient && (
            <SelectField
              label="Status"
              id="status"
              options={PAYMENT_STATUS_OPTIONS}
              value={list.filters.status ?? ""}
              onChange={(event) => list.setFilter("status", event.target.value)}
            />
          )
        }
      />
      <AsyncState
        loading={list.loading}
        error={list.error}
        empty={!list.data?.length}
        emptyText="No payments yet."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Created</TableHead>
              {showPatient && <TableHead>Patient</TableHead>}
              <TableHead>Doctor</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>bKash TrxID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.data?.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{formatDateTime(payment.createdAt)}</TableCell>
                {showPatient && (
                  <TableCell>{payment.appointment?.patient?.name}</TableCell>
                )}
                <TableCell>{payment.appointment?.doctor?.name}</TableCell>
                <TableCell>
                  {payment.appointment?.schedule
                    ? formatDate(payment.appointment.schedule.startDateTime)
                    : "—"}
                </TableCell>
                <TableCell>
                  {formatMoney(payment.amount)}
                  {payment.refundAmount && (
                    <span className="block text-xs text-muted-foreground">
                      refunded {formatMoney(payment.refundAmount)}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={payment.status} />
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {payment.bkashTrxId ?? "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AsyncState>
      <Pagination meta={list.meta} onPage={list.setPage} />
    </>
  );
}
