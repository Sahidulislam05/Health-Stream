import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

// Called by the API after doctor data changes (approve, profile update, block) so cached
// public pages refresh now instead of waiting for their cacheLife.
const TAG_PATTERN = /^(doctors|doctor:[0-9a-f-]{36})$/;

const isAuthorized = (header: string | null) => {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || !header) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(header);
  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
};

export async function POST(request: NextRequest) {
  if (!isAuthorized(request.headers.get("authorization"))) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  const tags: unknown = body?.tags;

  if (
    !Array.isArray(tags) ||
    tags.length === 0 ||
    tags.length > 10 ||
    !tags.every((tag) => typeof tag === "string" && TAG_PATTERN.test(tag))
  ) {
    return Response.json(
      { success: false, message: "Invalid tags" },
      { status: 400 },
    );
  }

  // "max": serve the old page while the new one renders in the background.
  for (const tag of tags) revalidateTag(tag, "max");

  return Response.json({ success: true, revalidated: tags });
}
