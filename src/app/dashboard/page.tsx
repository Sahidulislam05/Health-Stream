"use client";

import { AsyncState, PageHeader, StatCard } from "@/components/shared";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { formatMoney } from "@/lib/format";
import type { Role } from "@/lib/types";

type Stats = Record<string, number>;

type Analytics = {
  path: string;
  cards: [key: string, label: string, money?: boolean][];
};

const ADMIN_ANALYTICS: Analytics = {
  path: "/analytics/admin-analytics",
  cards: [
    ["totalPendingDoctorApplications", "Pending doctor applications"],
    ["totalApprovedDoctors", "Approved doctors"],
    ["totalPatients", "Patients"],
    ["totalAppointments", "Appointments"],
    ["totalCompletedAppointments", "Completed"],
    ["totalCancelledAppointments", "Cancelled"],
    ["totalRevenue", "Net revenue", true],
    ["totalRefunded", "Refunded", true],
  ],
};

const ANALYTICS: Record<Role, Analytics> = {
  PATIENT: {
    path: "/analytics/patient-analytics",
    cards: [
      ["upcomingAppointments", "Upcoming"],
      ["completedAppointments", "Completed"],
      ["cancelledAppointments", "Cancelled"],
      ["totalAppointments", "All appointments"],
      ["totalAmountSpent", "Total paid", true],
      ["totalRefunded", "Refunded", true],
    ],
  },
  DOCTOR: {
    path: "/analytics/doctor-analytics",
    cards: [
      ["upcomingAppointments", "Upcoming"],
      ["ongoingAppointments", "Ongoing"],
      ["completedAppointments", "Completed"],
      ["cancelledAppointments", "Cancelled"],
      ["publishedSchedules", "Published schedules"],
      ["totalSchedules", "All schedules"],
      ["totalDoctorEarnings", "Net earnings", true],
      ["totalDoctorRefunded", "Refunded", true],
    ],
  },
  ADMIN: ADMIN_ANALYTICS,
  SUPER_ADMIN: ADMIN_ANALYTICS,
};

export default function OverviewPage() {
  const user = useAuth((state) => state.user);
  const config = user ? ANALYTICS[user.role] : null;
  const { data, loading, error } = useApi<Stats>(config?.path ?? null);

  return (
    <>
      <PageHeader
        title={`Hello, ${user?.name ?? ""}`}
        description="Here is what is happening on your account."
      />
      <AsyncState loading={loading} error={error}>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {config?.cards.map(([key, label, money]) => (
            <StatCard
              key={key}
              label={label}
              value={money ? formatMoney(data?.[key] ?? 0) : (data?.[key] ?? 0)}
            />
          ))}
        </div>
      </AsyncState>
    </>
  );
}
