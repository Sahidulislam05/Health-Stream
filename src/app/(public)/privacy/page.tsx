import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What HealthStream stores, why, and who can see it.",
};

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy"
      description="What we store about you, why we need it, and who can see it."
      sections={[
        {
          heading: "What we store",
          body: (
            <ul className="grid list-disc gap-1 pl-5">
              <li>
                Account: name, email, optional phone number and profile photo.
              </li>
              <li>
                Password: stored only as a one-way hash, never in plain text.
              </li>
              <li>Appointments: doctor, schedule, serial number and status.</li>
              <li>
                Payments: amount, status and bKash transaction IDs. We never see
                your bKash PIN.
              </li>
              <li>Prescriptions: the PDF your doctor writes for you.</li>
              <li>
                Doctors additionally: license number, qualifications, CV and
                certificates.
              </li>
            </ul>
          ),
        },
        {
          heading: "Who can see it",
          body: (
            <p>
              Your appointments and prescriptions are visible to you, the doctor
              you booked, and HealthStream admins who run the platform. Public
              doctor pages show only professional details — never contact
              information or documents.
            </p>
          ),
        },
        {
          heading: "Email",
          body: (
            <p>
              We email you verification codes, invoices, prescriptions and
              account notices. We do not send marketing email.
            </p>
          ),
        },
        {
          heading: "Security",
          body: (
            <p>
              Sessions use secure, httpOnly cookies. Accounts are verified by
              email, sign-in attempts are rate limited, and blocked accounts are
              signed out immediately.
            </p>
          ),
        },
        {
          heading: "Questions",
          body: (
            <p>
              To ask about your data, use the{" "}
              <Link href="/contact" className="text-primary hover:underline">
                contact form
              </Link>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
