import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookSlots } from "@/components/book-slots";
import { DoctorAvatar } from "@/components/doctor-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import { getDoctor, getPrerenderedDoctorIds } from "@/lib/server-api";

// Prebuild the most experienced doctors; every other profile is built on its first visit (ISR).
// Cache Components needs at least one param, so a placeholder stands in when the API has none.
export async function generateStaticParams() {
  const ids = await getPrerenderedDoctorIds();
  return ids.length
    ? ids.map((doctorId) => ({ doctorId }))
    : [{ doctorId: "__placeholder__" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/doctors/[doctorId]">): Promise<Metadata> {
  const doctor = await getDoctor((await params).doctorId);
  if (!doctor) return { title: "Doctor not found" };
  return {
    title: `Dr. ${doctor.name} — ${doctor.specialization}`,
    description: `${doctor.qualifications}, ${doctor.experienceYears} years of experience. Book a same-day video consultation.`,
  };
}

async function DoctorDetails({ params }: PageProps<"/doctors/[doctorId]">) {
  const { doctorId } = await params;
  const doctor = await getDoctor(doctorId);
  if (!doctor) notFound();

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_320px]">
      <section>
        <div className="flex gap-4">
          <DoctorAvatar doctor={doctor} size={88} />
          <div>
            <h1 className="font-heading text-2xl font-semibold">
              Dr. {doctor.name}
            </h1>
            <p className="text-sm text-primary">{doctor.specialization}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {doctor.qualifications}
            </p>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">Experience</dt>
            <dd>{doctor.experienceYears} years</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Consultation fee</dt>
            <dd>{formatMoney(doctor.consultationFee)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">BMDC license</dt>
            <dd>{doctor.licenseNumber}</dd>
          </div>
        </dl>
        {doctor.bio && (
          <p className="mt-6 text-sm leading-relaxed whitespace-pre-line">
            {doctor.bio}
          </p>
        )}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Book for today</CardTitle>
        </CardHeader>
        <CardContent>
          <BookSlots doctorId={doctor.id} fee={doctor.consultationFee} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function DoctorPage(props: PageProps<"/doctors/[doctorId]">) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Suspense
        fallback={
          <div className="h-64 animate-pulse bg-muted" aria-busy="true" />
        }
      >
        <DoctorDetails {...props} />
      </Suspense>
    </div>
  );
}
