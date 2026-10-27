import Link from "next/link";
import { Logo } from "@/components/logo";

const columns = [
  {
    title: "Patients",
    links: [
      { href: "/doctors", label: "Find a doctor" },
      { href: "/doctors?available=today", label: "Available today" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/register", label: "Create an account" },
    ],
  },
  {
    title: "Doctors",
    links: [
      { href: "/for-doctors", label: "Why HealthStream" },
      { href: "/apply-doctor", label: "Apply to join" },
      { href: "/login", label: "Doctor login" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/refund-policy", label: "Refund policy" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="grid content-start gap-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Same-day video consultations with verified doctors in Bangladesh.
            Pay with bKash, get your prescription by email.
          </p>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-xs font-semibold tracking-wide uppercase">
              {column.title}
            </h2>
            <ul className="mt-3 grid gap-2 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground">
          © HealthStream. HealthStream is not for emergencies — in an emergency
          call 999.
        </p>
      </div>
    </footer>
  );
}
