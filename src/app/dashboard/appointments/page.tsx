"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { RoleGate } from "@/components/dashboard-shell";
import {
  APPOINTMENT_STATUS_OPTIONS,
  AsyncState,
  Field,
  PageHeader,
  Pagination,
  SelectField,
  StatusBadge,
} from "@/components/shared";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useListQuery } from "@/hooks/use-list-query";
import { useSubmit } from "@/hooks/use-submit";
import { api } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/format";
import type { Appointment } from "@/lib/types";

const NEXT_STATUS = {
  CONFIRMED: { status: "ONGOING", label: "Start consultation" },
  ONGOING: { status: "COMPLETED", label: "Mark completed" },
} as const;

type Medicine = {
  key: string;
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
};

const emptyMedicine = (): Medicine => ({
  key: crypto.randomUUID(),
  name: "",
  dosage: "",
  duration: "",
  instructions: "",
});

function PrescriptionForm({
  appointmentId,
  onSaved,
}: {
  appointmentId: string;
  onSaved: () => void;
}) {
  const [medicines, setMedicines] = useState<Medicine[]>([emptyMedicine()]);
  const { pending, run } = useSubmit();

  const update = (key: string, field: keyof Medicine, value: string) =>
    setMedicines((list) =>
      list.map((medicine) =>
        medicine.key === key ? { ...medicine, [field]: value } : medicine,
      ),
    );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const findings = String(new FormData(event.currentTarget).get("findings"));
    const ok = await run(
      () =>
        api.post("/prescription/create-prescription", {
          appointmentId,
          findings,
          medicines: medicines.map(
            ({ name, dosage, duration, instructions }) => ({
              name,
              dosage,
              duration,
              instructions: instructions.trim() || undefined,
            }),
          ),
        }),
      "Prescription sent to the patient's email.",
    );
    if (ok) onSaved();
  };

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-4 border-t pt-4">
      <div className="grid gap-1.5">
        <Label htmlFor={`findings-${appointmentId}`}>Key findings</Label>
        <Textarea
          id={`findings-${appointmentId}`}
          name="findings"
          rows={3}
          minLength={5}
          required
        />
      </div>
      <fieldset className="grid gap-3">
        <legend className="mb-2 text-xs font-medium">Medicines</legend>
        {medicines.map((medicine, index) => (
          <div
            key={medicine.key}
            className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] sm:items-end"
          >
            {(["name", "dosage", "duration", "instructions"] as const).map(
              (field) => (
                <Field
                  key={field}
                  id={`${field}-${medicine.key}`}
                  label={`${index + 1}. ${field === "dosage" ? "Dosage (e.g. 1+0+1)" : field[0].toUpperCase() + field.slice(1)}`}
                  value={medicine[field]}
                  onChange={(event) =>
                    update(medicine.key, field, event.target.value)
                  }
                  required={field !== "instructions"}
                />
              ),
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Remove medicine ${index + 1}`}
              disabled={medicines.length === 1}
              onClick={() =>
                setMedicines((list) =>
                  list.filter((item) => item.key !== medicine.key),
                )
              }
            >
              <Trash2 />
            </Button>
          </div>
        ))}
      </fieldset>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setMedicines((list) => [...list, emptyMedicine()])}
        >
          <Plus /> Add medicine
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send prescription"}
        </Button>
      </div>
    </form>
  );
}

function DoctorAppointmentCard({
  appointment,
  onChange,
}: {
  appointment: Appointment;
  onChange: () => void;
}) {
  const [writing, setWriting] = useState(false);
  const { pending, run } = useSubmit();
  const next = NEXT_STATUS[appointment.status as keyof typeof NEXT_STATUS];

  const advance = async () => {
    if (!next) return;
    const ok = await run(() =>
      api.patch(`/appointment/update-status/${appointment.id}`, {
        status: next.status,
      }),
    );
    if (ok) onChange();
  };

  return (
    <Card>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="grid gap-1 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{appointment.patient?.name}</span>
              <StatusBadge status={appointment.status} />
            </div>
            <p className="text-xs text-muted-foreground">
              {appointment.schedule &&
                formatDate(appointment.schedule.startDateTime)}
              {appointment.joiningTime &&
                ` · ${formatTime(appointment.joiningTime)} · Serial #${appointment.serialNumber}`}
              {appointment.patient?.contactNumber &&
                ` · ${appointment.patient.contactNumber}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {next && (
              <Button onClick={advance} disabled={pending}>
                {next.label}
              </Button>
            )}
            {appointment.status === "COMPLETED" &&
              (appointment.prescriptionUrl ? (
                <a
                  href={appointment.prescriptionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "outline" })}
                >
                  View prescription
                </a>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setWriting(!writing)}
                  aria-expanded={writing}
                >
                  {writing ? "Close" : "Write prescription"}
                </Button>
              ))}
          </div>
        </div>
        {writing && !appointment.prescriptionUrl && (
          <PrescriptionForm
            appointmentId={appointment.id}
            onSaved={() => {
              setWriting(false);
              onChange();
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default function DoctorAppointmentsPage() {
  const list = useListQuery<Appointment>("/appointment/doctor-appointments", {
    sortBy: "joiningTime",
    sortOrder: "asc",
  });

  return (
    <RoleGate roles={["DOCTOR"]}>
      <PageHeader
        title="Appointments"
        description="Start each consultation at the patient's joining time, then complete it to write a prescription."
        action={
          <SelectField
            label="Status"
            id="status"
            options={APPOINTMENT_STATUS_OPTIONS}
            value={list.filters.status ?? ""}
            onChange={(event) => list.setFilter("status", event.target.value)}
          />
        }
      />
      <AsyncState
        loading={list.loading}
        error={list.error}
        empty={!list.data?.length}
        emptyText="No appointments yet."
      >
        <div className="grid gap-3">
          {list.data?.map((appointment) => (
            <DoctorAppointmentCard
              key={appointment.id}
              appointment={appointment}
              onChange={list.reload}
            />
          ))}
        </div>
      </AsyncState>
      <Pagination meta={list.meta} onPage={list.setPage} />
    </RoleGate>
  );
}
