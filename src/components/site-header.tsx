"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { href: "/doctors", label: "Find doctors" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-doctors", label: "For doctors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function NavItems({
  active,
  onNavigate,
  className,
}: {
  active: string | null;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <ul className={className}>
      {NAV_LINKS.map((link) => {
        const isActive = active?.startsWith(link.href) ?? false;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "block px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                isActive && "font-medium text-primary",
              )}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

// usePathname suspends while prerendering, so links render without highlight until it resolves.
function ActiveNavItems(props: {
  onNavigate?: () => void;
  className?: string;
}) {
  return <NavItems active={usePathname()} {...props} />;
}

function NavLinks(props: { onNavigate?: () => void; className?: string }) {
  return (
    <Suspense fallback={<NavItems active={null} {...props} />}>
      <ActiveNavItems {...props} />
    </Suspense>
  );
}

function AccountButtons({ onNavigate }: { onNavigate?: () => void }) {
  const { user, status } = useAuth();

  if (status === "authenticated" && user) {
    return (
      <Link href="/dashboard" onClick={onNavigate} className={buttonVariants()}>
        Dashboard
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/login"
        onClick={onNavigate}
        className={buttonVariants({ variant: "ghost" })}
      >
        Log in
      </Link>
      <Link href="/register" onClick={onNavigate} className={buttonVariants()}>
        Book a doctor
      </Link>
    </>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav aria-label="Main" className="max-lg:hidden">
          <NavLinks className="flex items-center gap-1" />
        </nav>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 max-sm:hidden">
            <AccountButtons />
          </div>
          <button
            type="button"
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
              className: "lg:hidden",
            })}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t bg-background px-4 pb-4 lg:hidden motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2"
        >
          <NavLinks onNavigate={close} className="grid py-2" />
          <div className="flex flex-wrap gap-2 sm:hidden">
            <AccountButtons onNavigate={close} />
          </div>
        </nav>
      )}
    </header>
  );
}
