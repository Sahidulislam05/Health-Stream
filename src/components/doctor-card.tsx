import { UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import type { Doctor } from "@/lib/types";

export function DoctorAvatar({
  doctor,
  size = 48,
}: {
  doctor: Doctor;
  size?: number;
}) {
  return doctor.user?.imageUrl ? (
    <Image
      src={doctor.user.imageUrl}
      alt=""
      width={size}
      height={size}
      className="shrink-0 object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      className="flex shrink-0 items-center justify-center bg-accent text-primary"
      style={{ width: size, height: size }}
    >
      <UserRound className="size-1/2" aria-hidden />
    </span>
  );
}

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const openSlots = doctor.schedules?.reduce(
    (sum, schedule) => sum + schedule.availableSlots,
    0,
  );

  return (
    <Card className="relative transition-colors hover:border-primary">
      <CardContent className="flex gap-3">
        <DoctorAvatar doctor={doctor} />
        <div className="min-w-0 flex-1">
          <Link
            href={`/doctors/${doctor.id}`}
            className="font-medium after:absolute after:inset-0 hover:underline"
          >
            Dr. {doctor.name}
          </Link>
          <p className="text-xs text-primary">{doctor.specialization}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {doctor.qualifications} · {doctor.experienceYears} yrs experience
          </p>
          <div className="mt-2 flex justify-between text-xs">
            <span className="font-medium">
              {formatMoney(doctor.consultationFee)}
            </span>
            {openSlots != null && (
              <span className="text-muted-foreground">
                {openSlots} slots left today
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
