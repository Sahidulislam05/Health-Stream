import {
  CalendarClock,
  ClipboardCheck,
  FileText,
  Link2,
  Wallet,
  Wallet2,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CtaBanner,
  FaqList,
  IconGrid,
  NumberedSteps,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/marketing";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { DOCTOR_STEPS, FAQS } from "@/lib/content";

export const metadata: Metadata = {
  title: "For doctors",
  description:
    "Run an online practice on HealthStream: your schedule, your fee, no admin work.",
};

const BENEFITS = [
  {
    icon: CalendarClock,
    title: "Your schedule",
    text: "Publish one window per day, 3 to 8 hours long. We split it into 20-minute slots.",
  },
  {
    icon: Wallet,
    title: "Your fee, paid upfront",
    text: "Set your consultation fee. Patients pay with bKash before they can join.",
  },
  {
    icon: Link2,
    title: "Your video tool",
    text: "Use Google Meet, Zoom or any link you like — every patient gets it automatically.",
  },
  {
    icon: ClipboardCheck,
    title: "Ordered queue",
    text: "Each patient gets a serial number and joining time, so your session runs on time.",
  },
  {
    icon: FileText,
    title: "Prescriptions in a minute",
    text: "Write findings and medicines; a PDF goes to the patient's email instantly.",
  },
  {
    icon: Wallet2,
    title: "Clear earnings",
    text: "Your dashboard shows appointments, completed visits and net earnings after refunds.",
  },
];

const REQUIREMENTS = [
  "A valid BMDC license number",
  "Your qualifications and years of experience",
  "A CV or resume (PDF or image, up to 5 MB)",
  "Optional certificates (up to 10 files)",
];

export default function ForDoctorsPage() {
  const doctorFaqs =
    FAQS.find((group) => group.group === "For doctors")?.items ?? [];

  return (
    <>
      <PageHero
        eyebrow="For doctors"
        title="See more patients. Do less paperwork."
        description="HealthStream handles booking, payment, queues, invoices and prescription delivery, so your time goes to patients."
      >
        <Link href="/apply-doctor" className={buttonVariants({ size: "lg" })}>
          Apply to join
        </Link>
        <Link
          href="/login"
          className={buttonVariants({ size: "lg", variant: "outline" })}
        >
          Doctor login
        </Link>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Benefits"
          title="Everything an online practice needs"
        />
        <IconGrid items={BENEFITS} />
      </Section>

      <Section muted>
        <SectionHeading
          eyebrow="Joining"
          title="Four steps to your first consultation"
        />
        <NumberedSteps steps={DOCTOR_STEPS} />
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Before you apply"
              title="What you will need"
            />
            <Reveal>
              <ul className="grid gap-3">
                {REQUIREMENTS.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 border p-4 text-sm"
                  >
                    <ClipboardCheck
                      className="size-4 text-primary"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div>
            <SectionHeading eyebrow="Questions" title="Doctor FAQ" />
            <Reveal>
              <FaqList items={doctorFaqs} />
            </Reveal>
          </div>
        </div>
      </Section>

      <CtaBanner
        title="Ready to consult online?"
        description="Applying takes about five minutes."
        primary={{ href: "/apply-doctor", label: "Start your application" }}
        secondary={{ href: "/contact", label: "Ask us a question" }}
      />
    </>
  );
}
