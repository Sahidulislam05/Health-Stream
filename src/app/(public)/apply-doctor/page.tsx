"use client";

import { useRouter } from "next/navigation";
import { Field } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmit } from "@/hooks/use-submit";
import { api } from "@/lib/api";
import { uploadFile } from "@/lib/upload";

// Optional text fields are left out when empty so the API's min-length rules don't reject "".
const optional = (value: FormDataEntryValue | null) =>
  String(value ?? "").trim() ? String(value).trim() : undefined;

export default function ApplyDoctorPage() {
  const router = useRouter();
  const { pending, run } = useSubmit();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim();
    const fee = optional(form.get("consultationFee"));

    const resume = form.get("resume");
    const certificates = form
      .getAll("additionalFiles")
      .filter((file): file is File => file instanceof File && file.size > 0);

    const ok = await run(async () => {
      // Files go straight to Cloudinary; the API only receives their IDs.
      const [resumePublicId, ...additionalFilePublicIds] = await Promise.all([
        resume instanceof File && resume.size
          ? uploadFile("doctorDocument", resume)
          : null,
        ...certificates.map((file) => uploadFile("doctorDocument", file)),
      ]);

      return api.post("/doctor/apply-as-doctor", {
        user: { name: form.get("name"), email },
        doctor: {
          specialization: form.get("specialization"),
          licenseNumber: form.get("licenseNumber"),
          qualifications: form.get("qualifications"),
          experienceYears: Number(form.get("experienceYears")),
          consultationFee: fee ? Number(fee) : undefined,
          contactNumber: optional(form.get("contactNumber")),
          address: optional(form.get("address")),
          bio: optional(form.get("bio")),
        },
        resumePublicId: resumePublicId ?? undefined,
        additionalFilePublicIds: additionalFilePublicIds.filter(Boolean),
      });
    }, "Application received. Check your email for a code.");
    if (ok)
      router.push(`/apply-doctor/verify?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Apply as a doctor</CardTitle>
          <CardDescription>
            Verify your email within an hour, then our team reviews your
            application. Once approved, you get your login password by email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              id="name"
              autoComplete="name"
              required
              minLength={2}
            />
            <Field
              label="Email"
              id="email"
              type="email"
              autoComplete="email"
              required
            />
            <Field
              label="Specialization"
              id="specialization"
              placeholder="e.g. Cardiology"
              required
            />
            <Field
              label="BMDC license number"
              id="licenseNumber"
              required
              minLength={3}
            />
            <Field
              label="Qualifications"
              id="qualifications"
              placeholder="e.g. MBBS, FCPS"
              required
            />
            <Field
              label="Years of experience"
              id="experienceYears"
              type="number"
              min={0}
              step={1}
              required
            />
            <Field
              label="Consultation fee (BDT)"
              id="consultationFee"
              type="number"
              min={0}
              step="1"
            />
            <Field
              label="Phone"
              id="contactNumber"
              type="tel"
              autoComplete="tel"
            />
            <div className="sm:col-span-2">
              <Field
                label="Address"
                id="address"
                autoComplete="street-address"
              />
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="bio">Short bio</Label>
              <Textarea id="bio" name="bio" maxLength={1000} rows={3} />
            </div>
            <Field
              label="CV / resume (PDF or image, max 5 MB)"
              id="resume"
              type="file"
              accept=".pdf,image/*"
            />
            <Field
              label="Certificates (up to 10)"
              id="additionalFiles"
              type="file"
              accept=".pdf,image/*"
              multiple
            />
            <Button
              type="submit"
              size="lg"
              disabled={pending}
              className="sm:col-span-2"
            >
              {pending ? "Submitting…" : "Submit application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
