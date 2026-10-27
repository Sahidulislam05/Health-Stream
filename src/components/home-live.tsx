import Link from "next/link";
import { DoctorCard } from "@/components/doctor-card";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { getFeaturedDoctors, getVerifiedDoctorCount } from "@/lib/server-api";

// Real count from the API instead of a made-up marketing number (cached, ISR).
export async function VerifiedDoctorCount() {
  const count = await getVerifiedDoctorCount();
  return <>{count ?? "—"}</>;
}

export async function FeaturedDoctors() {
  const doctors = await getFeaturedDoctors();

  if (!doctors.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Our first doctors are being verified. Check back soon.
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor, index) => (
          <Reveal key={doctor.id} delay={index * 100}>
            <DoctorCard doctor={doctor} />
          </Reveal>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/doctors"
          className={buttonVariants({ variant: "outline" })}
        >
          See all doctors
        </Link>
        <Link href="/doctors?available=today" className={buttonVariants()}>
          Who is available today?
        </Link>
      </div>
    </>
  );
}
