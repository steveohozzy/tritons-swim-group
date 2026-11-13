import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const STORYBLOK_SPACE_ID = "296464284958100";

export async function POST(request: NextRequest) {
  const secret = process.env.STORYBLOK_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ revalidated: false, message: "Webhook secret is not configured." }, { status: 500 });
  }

  const suppliedSecret = request.nextUrl.searchParams.get("secret") || "";
  const suppliedBuffer = Buffer.from(suppliedSecret);
  const secretBuffer = Buffer.from(secret);
  if (suppliedBuffer.length !== secretBuffer.length || !timingSafeEqual(suppliedBuffer, secretBuffer)) {
    return NextResponse.json({ revalidated: false, message: "Invalid webhook secret." }, { status: 401 });
  }

  let payload: { action?: string; space_id?: string | number; full_slug?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ revalidated: false, message: "Invalid JSON payload." }, { status: 400 });
  }

  if (String(payload.space_id) !== STORYBLOK_SPACE_ID) {
    return NextResponse.json({ revalidated: false, message: "Unexpected Storyblok space." }, { status: 403 });
  }

  const action = String(payload.action || "");
  if (!action.startsWith("story.") && !action.startsWith("asset.")) {
    return NextResponse.json({ revalidated: false, message: "Unsupported webhook action." }, { status: 400 });
  }

  revalidatePath("/", "layout");

  return NextResponse.json({
    revalidated: true,
    action,
    path: "/",
    message: "Tritons pages will refresh with the latest published Storyblok content on their next visit.",
  });
}
