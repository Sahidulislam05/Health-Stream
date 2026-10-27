import type { Metadata } from "next";
import {
  CtaBanner,
  NumberedSteps,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/marketing";
import { Reveal } from "@/components/reveal";
import { DOCTOR_STEPS, PATIENT_STEPS } from "@/lib/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Booking, payment, consultation and refunds on HealthStream, step by step.",
};

// Example day for a 3:00–9:00 PM schedule, matching the real booking and refund rules.
const TIMELINE = [
  {
    time: "Morning",
    title: "Schedule is live",
    text: "The doctor's published schedule for today appears in search.",
  },
  {
    time: "Before 2:00 PM",
    title: "Cancel for a full refund",
    text: "More than 1 hour before the start, cancelling refunds your bKash payment.",
    tone: "good",
  },
  {
    time: "2:00 – 3:00 PM",
    title: "No refund window",
    text: "You can still cancel, but the fee is not refunded.",
    tone: "warn",
  },
  {
    time: "3:00 PM",
    title: "Bookings close",
    text: "The session starts and disappears from search. Booked patients join by serial.",
  },
  {
    time: "3:00 – 9:00 PM",
    title: "Consultations",
    text: "Serial 1 joins at 3:00, serial 2 at 3:20, and so on — 20 minutes each.",
  },
  {
    time: "After your visit",
    title: "Prescription",
    text: "The doctor marks the visit complete and sends a PDF prescription to your email.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Simple for patients. Simple for doctors."
        description="Here is exactly what happens from the moment you search to the moment your prescription lands in your inbox."
      />

      <Section>
        <SectionHeading
          eyebrow="For patients"
          title="Book, pay, join, recover"
        />
        <NumberedSteps steps={PATIENT_STEPS} />
      </Section>

      <Section muted>
        <SectionHeading
          eyebrow="A day on HealthStream"
          title="Example: a 3:00 – 9:00 PM schedule"
          description="Times and rules below are the ones the platform enforces."
        />
        <ol className="relative grid gap-6 border-l-2 border-primary/30 pl-6">
          {TIMELINE.map((item, index) => (
            <li key={item.title}>
              <Reveal delay={index * 60} className="relative">
                <span
                  className={cn(
                    "absolute top-1.5 -left-[31px] size-3 rounded-full border-2 border-background bg-primary",
                    item.tone === "warn" && "bg-warning-foreground",
                  )}
                />
                <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                  {item.time}
                </p>
                <h3 className="mt-1 font-medium">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.text}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="For doctors"
          title="From application to first patient"
        />
        <NumberedSteps steps={DOCTOR_STEPS} />
      </Section>

      <CtaBanner
        title="Try it today"
        description="Create a free account and book the next open slot."
        primary={{ href: "/register", label: "Get started" }}
        secondary={{ href: "/faq", label: "Read the FAQ" }}
      />
    </>
  );
}
