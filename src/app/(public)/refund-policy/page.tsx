import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: "Refund policy",
  description: "When HealthStream refunds a consultation fee and how.",
};

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      title="Refund policy"
      description="Simple rule: cancel more than 1 hour before the session starts and you get your money back."
      sections={[
        {
          heading: "When you get a refund",
          body: (
            <p>
              If you cancel a paid appointment more than 1 hour before the
              doctor's session starts, the full consultation fee is refunded to
              the bKash account you paid with.
            </p>
          ),
        },
        {
          heading: "When you don't",
          body: (
            <p>
              From 1 hour before the session starts — including during or after
              the session — you can still cancel, but the fee is not refunded.
              The doctor has held that time for you.
            </p>
          ),
        },
        {
          heading: "Example",
          body: (
            <p>
              For a 3:00 – 9:00 PM session, cancelling before 2:00 PM is
              refunded. Cancelling at 2:00 PM or later is not.
            </p>
          ),
        },
        {
          heading: "Unpaid or failed payments",
          body: (
            <p>
              If a payment fails or you leave bKash checkout, nothing is
              charged. Your appointment stays pending and you can pay again or
              cancel from{" "}
              <Link
                href="/dashboard/my-appointments"
                className="text-primary hover:underline"
              >
                My appointments
              </Link>
              .
            </p>
          ),
        },
        {
          heading: "Problems with a refund",
          body: (
            <p>
              If a refund fails, the cancellation is not saved, so you can try
              again. If it keeps failing,{" "}
              <Link href="/contact" className="text-primary hover:underline">
                contact us
              </Link>{" "}
              with your bKash transaction ID.
            </p>
          ),
        },
      ]}
    />
  );
}
