import type { Metadata } from "next";
import { CtaBanner, FaqList, PageHero, Section } from "@/components/marketing";
import { Reveal } from "@/components/reveal";
import { FAQS } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about booking, payments, refunds, accounts and joining as a doctor.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Everything about booking, paying, refunds and your account."
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[200px_1fr]">
          <nav
            aria-label="FAQ topics"
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <ul className="flex flex-wrap gap-2 lg:grid">
              {FAQS.map((group) => (
                <li key={group.group}>
                  <a
                    href={`#${group.group.toLowerCase().replace(/\W+/g, "-")}`}
                    className="block border px-3 py-2 text-sm hover:border-primary hover:text-primary"
                  >
                    {group.group}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="grid gap-12">
            {FAQS.map((group) => (
              <Reveal key={group.group}>
                <section
                  id={group.group.toLowerCase().replace(/\W+/g, "-")}
                  className="scroll-mt-24"
                >
                  <h2 className="mb-4 font-heading text-xl font-semibold">
                    {group.group}
                  </h2>
                  <FaqList items={group.items} />
                </section>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
      <CtaBanner
        title="Still have a question?"
        description="Send us a message and our team will reply by email."
        primary={{ href: "/contact", label: "Contact us" }}
      />
    </>
  );
}
