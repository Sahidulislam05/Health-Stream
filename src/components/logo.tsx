import { HeartPulse } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-heading text-base font-semibold"
    >
      <HeartPulse className="size-5 text-primary" aria-hidden />
      HealthStream
    </Link>
  );
}
