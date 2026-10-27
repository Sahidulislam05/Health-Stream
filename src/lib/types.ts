export type Role = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";
export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";
export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED";
export type PaymentStatus =
  | "UNPAID"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";
export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ScheduleStatus = "DRAFT" | "PUBLISHED";

export type Doctor = {
  id: string;
  userId?: string;
  name: string;
  email?: string;
  specialization: string;
  licenseNumber: string;
  qualifications: string;
  experienceYears: number;
  bio: string | null;
  address?: string | null;
  contactNumber?: string | null;
  consultationFee: string | null;
  verificationStatus?: VerificationStatus;
  rejectionReason?: string | null;
  resume?: string | null;
  createdAt: string;
  user?: {
    id?: string;
    imageUrl: string;
    status?: UserStatus;
    emailVerified?: boolean;
  };
  schedules?: Schedule[];
};

export type Patient = {
  id: string;
  name: string;
  email: string;
  contactNumber: string | null;
  address: string | null;
  createdAt: string;
  user?: {
    id: string;
    status: UserStatus;
    imageUrl: string;
    authProvider: string;
  };
};

export type Admin = {
  id: string;
  name: string;
  email: string;
  personalEmail: string;
  contactNumber: string | null;
  createdAt: string;
  user: { id: string; role: Role; status: UserStatus; imageUrl: string };
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  imageUrl: string;
  authProvider: "GOOGLE" | "CREDENTIAL";
  needPasswordChange: boolean;
  isDemo: boolean;
  createdAt: string;
  patient: Patient | null;
  doctor: Doctor | null;
  admin: Admin | null;
};

export type Schedule = {
  id: string;
  startDateTime: string;
  endDateTime: string;
  totalSlots: number;
  availableSlots: number;
  meetingLink?: string;
  status?: ScheduleStatus;
  doctorId?: string;
  doctor?: { id: string; name: string; email: string; specialization: string };
  appointments?: Appointment[];
  _count?: { appointments: number };
};

export type Payment = {
  id: string;
  status: PaymentStatus;
  amount: string;
  currency: string;
  bkashTrxId: string | null;
  paidAt: string | null;
  refundAmount: string | null;
  refundedAt: string | null;
  createdAt: string;
  appointment?: Appointment;
};

export type Appointment = {
  id: string;
  status: AppointmentStatus;
  serialNumber: number | null;
  joiningTime: string | null;
  prescriptionUrl: string | null;
  createdAt: string;
  patient?: {
    id: string;
    name: string;
    email: string;
    contactNumber?: string | null;
  };
  doctor?: { id: string; name: string; specialization: string };
  schedule?: Schedule;
  payment?: Payment | null;
};
