import { api } from "@/lib/api";

type Signature = {
  timestamp: number;
  folder: string;
  allowed_formats: string;
  cloudName: string;
  apiKey: string;
  maxBytes: number;
  signature: string;
};

const SIGNATURE_PATHS = {
  doctorDocument: "/upload/doctor-document-signature",
  profileImage: "/upload/profile-image-signature",
} as const;

// Uploads straight from the browser to Cloudinary with a short-lived signature from the API,
// so large files never pass through our servers. Returns the Cloudinary public ID; the API
// re-checks the file (folder, format, size) before saving it.
export async function uploadFile(
  kind: keyof typeof SIGNATURE_PATHS,
  file: File,
) {
  const { data: sig } = await api.get<Signature>(SIGNATURE_PATHS[kind]);

  if (file.size > sig.maxBytes) {
    throw new Error(
      `"${file.name}" is larger than ${sig.maxBytes / 1024 / 1024} MB.`,
    );
  }

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", sig.apiKey);
  body.append("timestamp", String(sig.timestamp));
  body.append("signature", sig.signature);
  body.append("folder", sig.folder);
  body.append("allowed_formats", sig.allowed_formats);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body },
  );
  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.public_id) {
    throw new Error(json?.error?.message ?? `Could not upload "${file.name}".`);
  }

  return json.public_id as string;
}
