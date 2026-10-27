"use client";

import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Loader2,
  LogOut,
  type LucideIcon,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui";

type NavItem = { href: string; label: string; icon: LucideIcon };

const ADMIN_NAV: NavItem[] = [
  { href: "/dashboard/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/dashboard/patients", label: "Patients", icon: Users },
  { href: "/dashboard/admins", label: "Admins", icon: ShieldCheck },
  { href: "/dashboard/all-schedules", label: "Schedules", icon: CalendarDays },
  {
    href: "/dashboard/all-appointments",
    label: "Appointments",
    icon: ClipboardList,
  },
  { href: "/dashboard/all-payments", label: "Payments", icon: CreditCard },
];

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  PATIENT: [
    {
      href: "/dashboard/my-appointments",
      label: "My appointments",
      icon: ClipboardList,
    },
    { href: "/dashboard/my-payments", label: "My payments", icon: CreditCard },
    { href: "/dashboard/book", label: "Book a doctor", icon: Search },
  ],
  DOCTOR: [
    { href: "/dashboard/schedules", label: "Schedules", icon: CalendarDays },
    {
      href: "/dashboard/appointments",
      label: "Appointments",
      icon: ClipboardList,
    },
  ],
  ADMIN: ADMIN_NAV,
  SUPER_ADMIN: ADMIN_NAV,
};

const CHANGE_PASSWORD_PATH = "/dashboard/change-password";

// Shared demo accounts: say so once per tab session (dismissal kept in the Zustand UI store).
function DemoNotice() {
  const { demoNoticeDismissed, dismissDemoNotice } = useUiStore();
  if (demoNoticeDismissed) return null;
  return (
    <aside
      aria-label="Demo account notice"
      className="mb-6 flex items-start justify-between gap-3 border border-warning-foreground/30 bg-warning px-4 py-3 text-sm text-warning-foreground"
    >
      <p>
        You are using a <strong>shared demo account</strong>. Delete and
        account-changing actions are disabled, payments use bKash sandbox, and
        data resets every night.
      </p>
      <button
        type="button"
        onClick={dismissDemoNotice}
        aria-label="Dismiss demo notice"
        className="shrink-0 hover:opacity-70"
      >
        <X className="size-4" />
      </button>
    </aside>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const { user, status, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const mustChangePassword =
    Boolean(user?.needPasswordChange) && pathname !== CHANGE_PASSWORD_PATH;

  useEffect(() => {
    if (status === "guest")
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    else if (mustChangePassword) router.replace(CHANGE_PASSWORD_PATH);
  }, [status, mustChangePassword, pathname, router]);

  if (status !== "authenticated" || !user || mustChangePassword) {
    // The page still renders (hidden): its data loads in parallel with the session check,
    // and Next can prerender the segment. The API authorizes every request anyway.
    return (
      <>
        <div
          className="flex flex-1 items-center justify-center text-sm text-muted-foreground"
          aria-live="polite"
        >
          <Loader2 className="mr-2 size-4 animate-spin" /> Loading your
          dashboard…
        </div>
        <div hidden>{children}</div>
      </>
    );
  }

  const nav: NavItem[] = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    ...NAV_BY_ROLE[user.role],
    { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  ];

  const onLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="border-b md:w-60 md:shrink-0 md:border-r md:border-b-0">
        <div className="flex h-14 items-center px-4">
          <Logo />
        </div>
        <nav
          aria-label="Dashboard"
          className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:overflow-visible"
        >
          {nav.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2 px-3 py-2 text-sm hover:bg-muted",
                  active && "bg-accent font-medium text-primary",
                )}
              >
                <item.icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-end gap-3 border-b px-4 text-sm">
          <span className="truncate text-muted-foreground">
            {user.name} · {user.role.replace("_", " ").toLowerCase()}
          </span>
          <Button variant="outline" onClick={onLogout}>
            <LogOut /> Log out
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-8">
          {user.isDemo && <DemoNotice />}
          {children}
        </main>
      </div>
    </div>
  );
}

// Hides a page from roles that cannot use it (the API enforces this too).
export function RoleGate({
  roles,
  children,
}: {
  roles: Role[];
  children: ReactNode;
}) {
  const user = useAuth((state) => state.user);
  if (!user || !roles.includes(user.role)) {
    return (
      <p className="text-sm text-muted-foreground">
        You do not have access to this page.
      </p>
    );
  }
  return children;
}

export const ADMIN_ROLES: Role[] = ["ADMIN", "SUPER_ADMIN"];
