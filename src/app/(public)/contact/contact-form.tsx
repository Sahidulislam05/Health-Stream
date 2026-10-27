"use client";

import { Send } from "lucide-react";
import { Field, SelectField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useSubmit } from "@/hooks/use-submit";
import { api } from "@/lib/api";

const TOPICS = [
  { value: "PATIENT", label: "Booking or appointment" },
  { value: "PAYMENT", label: "Payment or refund" },
  { value: "DOCTOR", label: "Joining as a doctor" },
  { value: "OTHER", label: "Something else" },
];

export function ContactForm() {
  const user = useAuth((state) => state.user);
  const { pending, run } = useSubmit();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const ok = await run(
      () =>
        api.post("/contact", {
          name: form.get("name"),
          email: form.get("email"),
          topic: form.get("topic"),
          message: form.get("message"),
        }),
      "Message sent. We will reply by email.",
    );
    if (ok) formElement.reset();
  };

  return (
    // key: remount once the user loads so defaultValues pick up their details
    <form
      key={user?.id ?? "guest"}
      onSubmit={onSubmit}
      className="grid gap-4 sm:grid-cols-2"
    >
      <Field
        label="Your name"
        id="name"
        autoComplete="name"
        required
        minLength={2}
        maxLength={80}
        defaultValue={user?.name}
      />
      <Field
        label="Email"
        id="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={user?.email}
      />
      <div className="sm:col-span-2">
        <SelectField label="Topic" id="topic" options={TOPICS} />
      </div>
      <div className="grid gap-1.5 sm:col-span-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={6}
          minLength={10}
          maxLength={2000}
          required
          placeholder="For payment issues, include your bKash transaction ID."
        />
      </div>
      <Button type="submit" size="lg" disabled={pending} className="w-fit">
        <Send /> {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
