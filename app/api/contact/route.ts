import { NextRequest, NextResponse } from "next/server";
import { getStory } from "@/lib/storyblok";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character] || character);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (origin && siteUrl && new URL(origin).host !== new URL(siteUrl).host) {
    return NextResponse.json({ error: "Unable to submit this form." }, { status: 403 });
  }

  let body: { name?: string; email?: string; subject?: string; message?: string; website?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  // Quietly accept honeypot submissions without sending email.
  if (body.website) return NextResponse.json({ success: true });

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();

  if (!name || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      !["Swimming lessons", "Joining Tritons", "Timetable and sessions", "Events and activities", "Something else"].includes(subject) ||
      message.length < 10 || message.length > 5000) {
    return NextResponse.json({ error: "Please complete all fields with valid details. Your message must be at least 10 characters." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    return NextResponse.json({ error: "The contact form is not configured yet. Please use the contact details on this page instead." }, { status: 503 });
  }

  const settings = (await getStory("site-settings"))?.content || {};
  const recipient = String(settings.contactEmail || "").trim();
  if (!recipient) {
    return NextResponse.json({ error: "The contact email has not been added to Site Settings yet." }, { status: 503 });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br />");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: email,
        subject: `Website enquiry: ${subject}`,
        html: `<h2>New Tritons website enquiry</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Enquiry type:</strong> ${safeSubject}</p><p><strong>Message:</strong><br />${safeMessage}</p>`,
        text: `New Tritons website enquiry\n\nName: ${name}\nEmail: ${email}\nEnquiry type: ${subject}\n\nMessage:\n${message}`,
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      return NextResponse.json({ error: "We couldn't send your message just now. Please try again later." }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "We couldn't send your message just now. Please try again later." }, { status: 502 });
  }
}
