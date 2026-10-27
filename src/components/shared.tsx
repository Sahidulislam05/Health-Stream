"use client";

import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Meta } from "@/lib/api";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-heading text-xl font-semibold">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// Loading, error and empty states for anything driven by useApi.
export function AsyncState({
  loading,
  error,
  empty,
  emptyText = "Nothing here yet.",
  children,
}: {
  loading: boolean;
  error: string | null;
  empty?: boolean;
  emptyText?: string;
  children: ReactNode;
}) {
  if (loading) {
    // Skeleton rows keep the layout steady while data loads.
    return (
      <div className="grid gap-3 py-4" aria-busy="true" aria-live="polite">
        <span className="sr-only">Loading…</span>
        {[0, 1, 2].map((row) => (
          <div key={row} className="h-14 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <p className="py-10 text-sm text-destructive" role="alert">
        {error}
      </p>
    );
  }
  if (empty) {
    return <p className="py-10 text-sm text-muted-foreground">{emptyText}</p>;
  }
  return children;
}

const statusTone: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  CONFIRMED: "default",
  PAID: "default",
  APPROVED: "default",
  ACTIVE: "default",
  PUBLISHED: "default",
  ONGOING: "secondary",
  COMPLETED: "secondary",
  PENDING: "outline",
  UNPAID: "outline",
  DRAFT: "outline",
  REFUNDED: "secondary",
  CANCELLED: "destructive",
  FAILED: "destructive",
  REJECTED: "destructive",
  BLOCKED: "destructive",
};

// Amber marks "waiting on someone" so it stands apart from done (teal) and failed (red).
const waitingStatuses = new Set(["PENDING", "UNPAID"]);

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant={statusTone[status] ?? "outline"}
      className={
        waitingStatuses.has(status)
          ? "border-transparent bg-warning text-warning-foreground"
          : undefined
      }
    >
      {status.replace("_", " ")}
    </Badge>
  );
}

export function Field({
  label,
  id,
  hint,
  ...props
}: { label: string; id: string; hint?: string } & React.ComponentProps<
  typeof Input
>) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} {...props} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

// Password input with a show/hide toggle; keeps the browser's password manager hints.
export function PasswordField({
  label,
  id,
  hint,
  ...props
}: { label: string; id: string; hint?: string } & Omit<
  React.ComponentProps<typeof Input>,
  "type"
>) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          className="pr-9"
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          aria-controls={id}
          className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export const DEMO_DISABLED_MESSAGE = "Disabled in demo mode";

export function DemoLockNote() {
  return (
    <p className="text-xs text-warning-foreground">
      {DEMO_DISABLED_MESSAGE} — shared demo accounts cannot change this.
    </p>
  );
}

export function StatCard({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <Card>
      <CardContent>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}

export function Pagination({
  meta,
  onPage,
}: {
  meta?: Meta;
  onPage: (page: number) => void;
}) {
  if (!meta || meta.totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-end gap-2 text-xs">
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Previous page"
        disabled={meta.page <= 1}
        onClick={() => onPage(meta.page - 1)}
      >
        <ChevronLeft />
      </Button>
      <span>
        Page {meta.page} of {meta.totalPages}
      </span>
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Next page"
        disabled={meta.page >= meta.totalPages}
        onClick={() => onPage(meta.page + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

export function SelectField({
  label,
  id,
  options,
  ...props
}: {
  label: string;
  id: string;
  options: { value: string; label: string }[];
} & React.ComponentProps<"select">) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={id}
        className="h-8 border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 dark:bg-input/30"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export const APPOINTMENT_STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending payment" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];
