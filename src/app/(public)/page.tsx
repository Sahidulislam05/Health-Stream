import {
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  Clock,
  FileText,
  HeartPulse,
  Lock,
  RotateCcw,
  Stethoscope,
  Video,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { FeaturedDoctors, VerifiedDoctorCount } from "@/components/home-live";
import {
  CtaBanner,
  FaqList,
  IconGrid,
  NumberedSteps,
  Section,
  SectionHeading,
} from "@/components/marketing";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { FAQS, PATIENT_STEPS, SPECIALTIES } from "@/lib/content";

const FEATURES = [
  {
    icon: BadgeCheck,
    title: "Verified doctors only",
    text: "Every doctor's BMDC license and documents are checked by our team before they can consult.",
  },
  {
    icon: CalendarCheck,
    title: "Same-day appointments",
    text: "See who is available today and book a slot in minutes — no waiting room, no travel.",
  },
  {
    icon: Wallet,
    title: "Pay with bKash",
    text: "Secure bKash checkout with an invoice in your inbox the moment you pay.",
  },
  {
    icon: RotateCcw,
    title: "Fair refunds",
    text: "Cancel more than 1 hour before your session and get your money back automatically.",
  },
  {
    icon: FileText,
    title: "Digital prescriptions",
    text: "A clear PDF prescription, emailed to you and always available in your dashboard.",
  },
  {
    icon: Lock,
    title: "Private by design",
    text: "Email-verified accounts, secure sessions, and records only you, your doctor and our admins can see.",
  },
];

const TRUST = [
  { value: <VerifiedDoctorCount />, label: "Verified doctors" },
  { value: "20 min", label: "Per consultation" },
  { value: "1 hour", label: "Refund window" },
  { value: "bKash", label: "Secure payment" },
];

function HeroCard() {
  return (
    <div className="relative mx-auto w-full max-w-sm motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-700">
      <div className="absolute -inset-6 -z-10 rounded-full bg-primary/20 blur-3xl" />
      <div className="border bg-card p-5 shadow-xl shadow-primary/10">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center bg-accent text-primary">
            <Stethoscope className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-medium">Your consultation</p>
            <p className="text-xs text-muted-foreground">Cardiology · Today</p>
          </div>
          <span className="ml-auto bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            Confirmed
          </span>
        </div>
        <dl className="mt-5 grid grid-cols-3 gap-3 border-y py-4 text-center">
          <div>
            <dt className="text-[10px] text-muted-foreground uppercase">
              Serial
            </dt>
            <dd className="font-heading text-xl font-semibold">#3</dd>
          </div>
          <div>
            <dt className="text-[10px] text-muted-foreground uppercase">
              Join at
            </dt>
            <dd className="font-heading text-xl font-semibold">3:40</dd>
          </div>
          <div>
            <dt className="text-[10px] text-muted-foreground uppercase">
              Slot
            </dt>
            <dd className="font-heading text-xl font-semibold">20m</dd>
          </div>
        </dl>
        <div className="mt-4 flex items-center gap-2 bg-primary px-3 py-2.5 text-sm text-primary-foreground">
          <Video className="size-4" aria-hidden /> Join video call
        </div>
      </div>
      <div className="absolute -bottom-6 -left-4 flex items-center gap-2 border bg-card px-3 py-2 text-xs shadow-lg motion-safe:animate-bounce motion-safe:[animation-duration:3s]">
        <CheckCircle2 className="size-4 text-primary" aria-hidden />
        Paid via bKash
      </div>
      <div className="absolute -top-5 -right-3 flex items-center gap-2 border bg-card px-3 py-2 text-xs shadow-lg">
        <FileText className="size-4 text-primary" aria-hidden />
        Prescription emailed
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-b from-accent to-background" />
        <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_65%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-4 py-16 md:py-24 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 border bg-background/70 px-3 py-1 text-xs font-medium text-primary motion-safe:animate-in motion-safe:fade-in">
              <HeartPulse className="size-3.5" aria-hidden /> Online
              consultation · Bangladesh
            </p>
            <h1 className="mt-5 font-heading text-4xl font-semibold text-balance md:text-6xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
              See a verified doctor <span className="text-primary">today</span>,
              from wherever you are.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground text-pretty motion-safe:animate-in motion-safe:fade-in motion-safe:duration-1000">
              Book a same-day video consultation, pay with bKash and get your
              prescription by email — in a few minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-2 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-1000">
              <Link
                href="/doctors?available=today"
                className={buttonVariants({
                  size: "lg",
                  className: "h-11 px-5 text-sm",
                })}
              >
                Find a doctor available today
              </Link>
              <Link
                href="/how-it-works"
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                  className: "h-11 px-5 text-sm",
                })}
              >
                How it works
              </Link>
            </div>
            <ul className="mt-8 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {[
                "BMDC-verified doctors",
                "Refund if you cancel 1 hour early",
                "20-minute dedicated slot",
                "PDF prescription by email",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <HeroCard />
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 px-4 md:grid-cols-4">
          {TRUST.map((item, index) => (
            <Reveal
              key={item.label}
              delay={index * 80}
              className="flex flex-col-reverse border-l py-8 pl-5 first:border-l-0 max-md:[&:nth-child(3)]:border-l-0"
            >
              <dd className="font-heading text-3xl font-semibold text-primary">
                {item.value}
              </dd>
              <dt className="mt-1 text-sm text-muted-foreground">
                {item.label}
              </dt>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Specialties */}
      <Section>
        <SectionHeading
          eyebrow="Specialties"
          title="Care for every part of your health"
          description="From a fever to a follow-up with your cardiologist — find the right specialist."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SPECIALTIES.map((specialty, index) => (
            <Reveal key={specialty} delay={index * 40}>
              <Link
                href={`/doctors?q=${encodeURIComponent(specialty)}`}
                className="flex h-full items-center gap-2 border bg-card px-4 py-4 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                <Stethoscope className="size-4 text-primary" aria-hidden />
                {specialty}
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section muted>
        <SectionHeading
          eyebrow="How it works"
          title="From symptoms to prescription in four steps"
        />
        <NumberedSteps steps={PATIENT_STEPS} />
      </Section>

      {/* Doctors */}
      <Section>
        <SectionHeading
          eyebrow="Our doctors"
          title="Experienced doctors, ready to help"
          description="Every profile shows qualifications, experience and the consultation fee up front."
        />
        <FeaturedDoctors />
      </Section>

      {/* Features */}
      <Section muted>
        <SectionHeading
          eyebrow="Why HealthStream"
          title="Healthcare that respects your time and money"
          center
        />
        <IconGrid items={FEATURES} />
      </Section>

      {/* For doctors */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="For doctors"
            title="Run your online practice without the admin work"
            description="Publish a schedule, and we handle booking, payment, serial numbers, invoices and prescription delivery."
          />
          <Reveal className="grid gap-3">
            {[
              { icon: Clock, text: "Choose your own 3–8 hour window, any day" },
              {
                icon: Wallet,
                text: "Patients pay before they join — no chasing fees",
              },
              {
                icon: FileText,
                text: "Write a prescription; we turn it into a PDF and email it",
              },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 border p-4 text-sm"
              >
                <item.icon className="size-5 text-primary" aria-hidden />
                {item.text}
              </div>
            ))}
            <Link
              href="/for-doctors"
              className={buttonVariants({ className: "mt-2 w-fit" })}
            >
              Learn more for doctors
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* FAQ */}
      <Section muted>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, answered"
            description="Can't find what you need? Our team is a message away."
          />
          <Reveal>
            <FaqList items={FAQS.flatMap((group) => group.items).slice(0, 5)} />
            <Link
              href="/faq"
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              See all questions →
            </Link>
          </Reveal>
        </div>
      </Section>

      <CtaBanner
        title="Feeling unwell? Talk to a doctor today."
        description="Create a free account in a minute and book the next open slot."
        primary={{ href: "/register", label: "Create free account" }}
        secondary={{
          href: "/doctors?available=today",
          label: "Browse doctors",
        }}
      />
    </>
  );
}
