// Marketing copy. Every claim here maps to a real rule in the PRD / API — keep it that way.

export const SPECIALTIES = [
  "Medicine",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Gynecology",
  "Dermatology",
  "Psychiatry",
  "ENT",
  "Orthopedics",
  "Gastroenterology",
  "Endocrinology",
  "Pulmonology",
];

export const PATIENT_STEPS = [
  {
    title: "Find a doctor for today",
    text: "Browse verified doctors and see who has open slots today.",
  },
  {
    title: "Pay with bKash",
    text: "Pay the consultation fee upfront. Your slot, serial number and joining time are confirmed instantly.",
  },
  {
    title: "Join the video call",
    text: "Use the meeting link at your joining time. Each patient gets a 20-minute slot.",
  },
  {
    title: "Get your prescription",
    text: "Your doctor sends a PDF prescription straight to your email after the visit.",
  },
];

export const DOCTOR_STEPS = [
  {
    title: "Apply online",
    text: "Share your BMDC license, qualifications and CV. Verify your email with a code.",
  },
  {
    title: "Get verified",
    text: "Our team reviews your application. Once approved, your login details arrive by email.",
  },
  {
    title: "Publish your schedule",
    text: "Pick a day, a 3–8 hour window and your video link. We split it into 20-minute slots.",
  },
  {
    title: "Consult & prescribe",
    text: "Start each consultation, mark it complete and send a PDF prescription in a minute.",
  },
];

export const FAQS: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "Booking",
    items: [
      {
        q: "Can I book a doctor for a future day?",
        a: "No. HealthStream is built for same-day care: you see today's schedules and can book until a session starts.",
      },
      {
        q: "How long is a consultation?",
        a: "Every booked slot is 20 minutes. Your serial number decides your joining time, shown on your invoice and in your dashboard.",
      },
      {
        q: "Where do I find the video link?",
        a: "After payment, the link appears on your appointment in the dashboard and in your invoice email.",
      },
    ],
  },
  {
    group: "Payments & refunds",
    items: [
      {
        q: "How do I pay?",
        a: "With bKash, before the consultation. The fee is set by each doctor and shown before you book.",
      },
      {
        q: "Can I get a refund?",
        a: "Yes, if you cancel more than 1 hour before the session starts. Later cancellations are allowed but not refunded.",
      },
      {
        q: "My payment failed. What now?",
        a: "Your appointment stays pending. Open it from My appointments and pay again before the session starts.",
      },
    ],
  },
  {
    group: "Accounts & privacy",
    items: [
      {
        q: "Can I sign up with Google?",
        a: "Yes, patients can use Google or email. If you started with Google you can set a password later and use both.",
      },
      {
        q: "Who can see my prescription?",
        a: "Only you, the doctor who wrote it, and platform admins.",
      },
    ],
  },
  {
    group: "For doctors",
    items: [
      {
        q: "How are doctors verified?",
        a: "Every application is reviewed by an admin, including the BMDC license number and documents, before the doctor can log in.",
      },
      {
        q: "Can I change my schedule after publishing?",
        a: "The meeting link can change any time. The time window locks once someone books, and the date locks once you publish.",
      },
    ],
  },
];
