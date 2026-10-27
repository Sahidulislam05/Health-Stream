import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard-shell";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <Suspense>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
