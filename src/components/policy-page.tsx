import type { ReactNode } from "react";
import { PageHero, Section } from "@/components/marketing";

// Readable long-form layout for policy pages.
export function PolicyPage({
  title,
  description,
  sections,
}: {
  title: string;
  description: string;
  sections: { heading: string; body: ReactNode }[];
}) {
  return (
    <>
      <PageHero eyebrow="Policy" title={title} description={description} />
      <Section>
        <div className="grid max-w-3xl gap-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-heading text-lg font-semibold">
                {section.heading}
              </h2>
              <div className="mt-3 grid gap-3 text-sm leading-relaxed text-muted-foreground">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
