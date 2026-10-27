import { ChevronDown, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  muted,
}: {
  children: ReactNode;
  className?: string;
  muted?: boolean;
}) {
  return (
    <section className={cn(muted && "bg-accent/50", className)}>
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  center,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={cn("mb-10 max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 font-heading text-2xl font-semibold text-balance md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-muted-foreground text-pretty">{description}</p>
      )}
    </Reveal>
  );
}

// Hero band for inner pages (About, FAQ, …).
export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b bg-accent/50">
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase motion-safe:animate-in motion-safe:fade-in">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl font-heading text-3xl font-semibold text-balance md:text-5xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-700">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground text-pretty md:text-lg motion-safe:animate-in motion-safe:fade-in motion-safe:duration-1000">
          {description}
        </p>
        {children && (
          <div className="mt-8 flex flex-wrap gap-2">{children}</div>
        )}
      </div>
    </section>
  );
}

export type IconItem = { icon: LucideIcon; title: string; text: string };

export function IconGrid({
  items,
  columns = 3,
}: {
  items: IconItem[];
  columns?: 2 | 3 | 4;
}) {
  const grid = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };
  return (
    <div className={cn("grid gap-4", grid[columns])}>
      {items.map((item, index) => (
        <Reveal key={item.title} delay={index * 80}>
          <div className="group h-full border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <span className="flex size-10 items-center justify-center bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <item.icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-4 font-medium">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function NumberedSteps({
  steps,
}: {
  steps: { title: string; text: string }[];
}) {
  return (
    <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step.title}>
          <Reveal
            delay={index * 100}
            className="h-full border-t-2 border-primary pt-5"
          >
            <span className="font-heading text-4xl font-semibold text-primary/25">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 font-medium">{step.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

export function CtaBanner({
  title,
  description,
  primary,
  secondary,
}: {
  title: string;
  description: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <Reveal>
        <div className="relative overflow-hidden bg-primary px-6 py-12 text-primary-foreground md:px-12">
          <div className="absolute -top-24 -right-24 size-72 rounded-full bg-white/10 blur-2xl motion-safe:animate-pulse" />
          <div className="relative max-w-2xl">
            <h2 className="font-heading text-2xl font-semibold text-balance md:text-3xl">
              {title}
            </h2>
            <p className="mt-3 text-primary-foreground/80">{description}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              <Link
                href={primary.href}
                className={buttonVariants({
                  size: "lg",
                  variant: "secondary",
                })}
              >
                {primary.label}
              </Link>
              {secondary && (
                <Link
                  href={secondary.href}
                  className={buttonVariants({
                    size: "lg",
                    variant: "ghost",
                    className:
                      "text-primary-foreground hover:bg-white/10 hover:text-primary-foreground",
                  })}
                >
                  {secondary.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// Native <details> keeps the FAQ keyboard- and screen-reader-friendly with no JS.
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y border-y">
      {items.map((item) => (
        <details key={item.q} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
            {item.q}
            <ChevronDown
              className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
