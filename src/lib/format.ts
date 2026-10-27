// Every "today" rule in the product uses Bangladesh time, so display uses it too.
const TIME_ZONE = "Asia/Dhaka";

export const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: TIME_ZONE,
  }).format(new Date(value));

export const formatTime = (value: string | Date) =>
  new Intl.DateTimeFormat("en-GB", {
    timeStyle: "short",
    timeZone: TIME_ZONE,
  }).format(new Date(value));

export const formatDateTime = (value: string | Date) =>
  `${formatDate(value)}, ${formatTime(value)}`;

export const formatMoney = (value: string | number | null | undefined) =>
  value == null ? "—" : `৳${Number(value).toLocaleString("en-US")}`;

// Bangladesh is UTC+6 all year (no DST), so date + time inputs map to an exact instant
// no matter which time zone the browser is in.
export const dhakaIso = (date: string, time: string) =>
  new Date(`${date}T${time}:00+06:00`).toISOString();

export const toDateInput = (value: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(
    new Date(value),
  );

export const toTimeInput = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(value));
