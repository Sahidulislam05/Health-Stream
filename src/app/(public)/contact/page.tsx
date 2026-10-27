import { CircleHelp, Mail, Siren } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section } from "@/components/marketing";
import { Reveal } from "@/components/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about a booking, payment or joining as a doctor? Send us a message.",
};

const CHANNELS = [
  {
    icon: Mail,
    title: "Email reply",
    text: "We answer every message by email, to the address you give us.",
  },
  {
    icon: CircleHelp,
    title: "Quick answers",
    text: (
      <>
        Most questions about refunds and booking are answered in the{" "}
        <Link href="/faq" className="text-primary hover:underline">
          FAQ
        </Link>
        .
      </>
    ),
  },
  {
    icon: Siren,
    title: "Emergency?",
    text: "HealthStream is not for emergencies. Call 999 or go to the nearest hospital.",
    warn: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We're here to help"
        description="Questions about a booking, a payment, or joining as a doctor? Send us a message."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <Card>
              <CardContent className="p-6">
                <ContactForm />
              </CardContent>
            </Card>
          </Reveal>
          <div className="grid content-start gap-4">
            {CHANNELS.map((channel, index) => (
              <Reveal key={channel.title} delay={index * 100}>
                <div
                  className={
                    channel.warn
                      ? "flex gap-4 border border-warning-foreground/30 bg-warning p-5 text-warning-foreground"
                      : "flex gap-4 border p-5"
                  }
                >
                  <channel.icon
                    className={
                      channel.warn
                        ? "size-5 shrink-0"
                        : "size-5 shrink-0 text-primary"
                    }
                    aria-hidden
                  />
                  <div>
                    <h2 className="font-medium">{channel.title}</h2>
                    <p
                      className={
                        channel.warn
                          ? "mt-1 text-sm"
                          : "mt-1 text-sm text-muted-foreground"
                      }
                    >
                      {channel.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
