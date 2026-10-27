"use client";

import { UserRound } from "lucide-react";
import {
  ChangePasswordForm,
  SetPasswordForm,
} from "@/components/password-forms";
import { DemoLockNote, Field, PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, useIsDemo } from "@/hooks/use-auth";
import { useSubmit } from "@/hooks/use-submit";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import type { User } from "@/lib/types";
import { uploadFile } from "@/lib/upload";

function ProfileImage({ user }: { user: User }) {
  const isDemo = useIsDemo();
  const loadUser = useAuth((state) => state.loadUser);
  const { pending, run } = useSubmit();

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const ok = await run(async () => {
      const publicId = await uploadFile("profileImage", file);
      return api.patch("/user/profile-image", { publicId });
    }, "Photo updated.");
    if (ok) loadUser();
  };

  return (
    <div className="flex items-center gap-4">
      {user.imageUrl ? (
        // biome-ignore lint/performance/noImgElement: Cloudinary URL
        <img src={user.imageUrl} alt="" className="size-20 object-cover" />
      ) : (
        <span className="flex size-20 items-center justify-center bg-accent text-primary">
          <UserRound className="size-8" aria-hidden />
        </span>
      )}
      <div className="grid gap-1.5">
        <Label htmlFor="profileImage">
          {pending ? "Uploading…" : "Change photo (JPG, PNG, WEBP · max 5 MB)"}
        </Label>
        <input
          id="profileImage"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onChange}
          disabled={pending || isDemo}
          className="text-xs"
        />
        {isDemo && <DemoLockNote />}
      </div>
    </div>
  );
}

function DoctorProfileForm({ user }: { user: User }) {
  const isDemo = useIsDemo();
  const loadUser = useAuth((state) => state.loadUser);
  const { pending, run } = useSubmit();
  const doctor = user.doctor;
  if (!doctor) return null;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (key: string) =>
      String(form.get(key) ?? "").trim() || undefined;
    const fee = text("consultationFee");
    const ok = await run(
      () =>
        api.patch("/doctor/update-my-profile", {
          address: text("address"),
          contactNumber: text("contactNumber"),
          bio: text("bio"),
          consultationFee: fee ? Number(fee) : undefined,
        }),
      "Profile saved.",
    );
    if (ok) loadUser();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Practice details</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-xs text-muted-foreground">
          {doctor.specialization} · {doctor.qualifications} · License{" "}
          {doctor.licenseNumber}
        </p>
        <fieldset disabled={isDemo} className="grid gap-3">
          {isDemo && <DemoLockNote />}
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Consultation fee (BDT)"
              id="consultationFee"
              type="number"
              min={0}
              defaultValue={
                doctor.consultationFee ? Number(doctor.consultationFee) : ""
              }
              hint={
                doctor.consultationFee
                  ? `Current: ${formatMoney(doctor.consultationFee)}`
                  : "Patients cannot book until you set a fee."
              }
            />
            <Field
              label="Phone"
              id="contactNumber"
              type="tel"
              defaultValue={doctor.contactNumber ?? ""}
            />
            <div className="sm:col-span-2">
              <Field
                label="Address"
                id="address"
                defaultValue={doctor.address ?? ""}
              />
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                rows={4}
                maxLength={1000}
                defaultValue={doctor.bio ?? ""}
              />
            </div>
            <Button type="submit" disabled={pending} className="w-fit">
              {pending ? "Saving…" : "Save"}
            </Button>
          </form>
        </fieldset>
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  const user = useAuth((state) => state.user);
  if (!user) return null;

  const isGooglePatient =
    user.role === "PATIENT" && user.authProvider === "GOOGLE";

  return (
    <>
      <PageHeader title="Profile" />
      <div className="grid gap-6">
        <Card>
          <CardContent className="grid gap-6">
            <ProfileImage user={user} />
            <dl className="grid gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted-foreground">Name</dt>
                <dd>{user.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Email</dt>
                <dd className="break-all">{user.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Role</dt>
                <dd>{user.role.replace("_", " ")}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {user.role === "DOCTOR" && <DoctorProfileForm user={user} />}

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            {isGooglePatient && (
              <div>
                <p className="mb-3 text-xs text-muted-foreground">
                  Signed up with Google? Set a password to also log in with your
                  email.
                </p>
                <SetPasswordForm />
              </div>
            )}
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
