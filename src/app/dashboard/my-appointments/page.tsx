import { Suspense } from "react";
import { MyAppointments } from "./appointments-list";

export default function MyAppointmentsPage() {
  return (
    <Suspense>
      <MyAppointments />
    </Suspense>
  );
}
