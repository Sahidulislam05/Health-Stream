import {
  BadgeCheck,
  Eye,
  HandHeart,
  MapPin,
  ShieldCheck,
  Timer,
} from "lucide-react";
import type { Metadata } from "next";
import {
  CtaBanner,
  IconGrid,
  NumberedSteps,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/marketing";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Why we built HealthStream and how we keep online consultations safe.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Safety first",
    text: "No doctor consults on HealthStream until an admin has reviewed their license and documents.",
  },
  {
    icon: Eye,
    title: "Nothing hidden",
    text: "Fees, refund rules and joining times are shown before you pay — never after.",
  },
  {
    icon: Timer,
    title: "Respect for time",
    text: "Serial numbers and fixed 20-minute slots mean you know exactly when to join.",
  },
  {
    icon: HandHeart,
    title: "Care, not paperwork",
    text: "Doctors focus on patients; invoices, reminders and prescriptions are handled for them.",
  },
];

const VERIFICATION = [
  {
    title: "Application",
    text: "The doctor submits their BMDC license number, qualifications, experience and CV.",
  },
  {
    title: "Email check",
    text: "They confirm their email with a one-time code. Unverified applications expire.",
  },
  {
    title: "Admin review",
    text: "Our team checks the documents and approves or rejects with a written reason.",
  },
  {
    title: "Ongoing oversight",
    text: "Admins can block any account at any time if something is not right.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Making a doctor's visit as easy as a phone call"
        description="HealthStream connects patients across Bangladesh with verified doctors for same-day video consultations — paid, scheduled and prescribed in one place."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="The problem"
            title="Seeing a doctor shouldn't cost you a day"
          />
          <Reveal className="grid gap-4 text-muted-foreground">
            <p>
              For many people, a short consultation means travel, long queues
              and lost working hours — and often no clear idea of when they will
              actually be seen.
            </p>
            <p>
              HealthStream gives every patient a fixed serial number and joining
              time, a doctor whose credentials have been checked, and a
              prescription they can keep. Doctors get a simple way to run an
              online practice without handling payments themselves.
            </p>
            <p className="flex items-center gap-2 text-sm">
              <MapPin className="size-4 text-primary" aria-hidden /> Built for
              Bangladesh: bKash payments, BDT pricing, Dhaka time.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section muted>
        <SectionHeading eyebrow="Our values" title="What we stand for" />
        <IconGrid items={VALUES} columns={4} />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Doctor verification"
          title="How a doctor joins HealthStream"
          description="Four checks stand between an application and a patient."
        />
        <NumberedSteps steps={VERIFICATION} />
        <Reveal className="mt-10 flex items-center gap-3 border-l-4 border-primary bg-accent/50 p-5 text-sm">
          <BadgeCheck className="size-5 shrink-0 text-primary" aria-hidden />
          Only approved doctors appear in search, and only they can publish
          schedules.
        </Reveal>
      </Section>

      <CtaBanner
        title="Ready to see a doctor?"
        description="Browse verified doctors and book a slot for today."
        primary={{ href: "/doctors", label: "Find a doctor" }}
        secondary={{ href: "/contact", label: "Talk to us" }}
      />
    </>
  );
}
