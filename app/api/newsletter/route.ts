import { NextResponse } from "next/server";
import { withConnection } from "@/lib/db";

type NewsletterPayload = {
  email?: string;
};

export async function POST(req: Request) {
  let body: NewsletterPayload;

  try {
    body = (await req.json()) as NewsletterPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const email = body.email?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 },
    );
  }

  const emailRegex =
    // Basic, conservative email validation
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  try {
    await withConnection(async (conn) => {
      // Assumes `newsletter_subscribers` table with UNIQUE(email)
      await conn.execute(
        `INSERT INTO newsletter_subscribers (email, created_at)
         VALUES (?, NOW())
         ON DUPLICATE KEY UPDATE created_at = created_at`,
        [email],
      );
    });
  } catch (err) {
    console.error("Failed to save newsletter subscriber", err);
    return NextResponse.json(
      { error: "Failed to save subscription. Please try again later." },
      { status: 500 },
    );
  }

  // Optional: send a "thank you" email via Resend if configured.
  // This uses the HTTP API directly, so no extra dependency is required.
  if (process.env.RESEND_API_KEY && process.env.NEWSLETTER_FROM_EMAIL) {
    const from = process.env.NEWSLETTER_FROM_EMAIL;
    const subject =
      process.env.NEWSLETTER_THANK_YOU_SUBJECT ??
      "Thanks for subscribing to our newsletter";
    const text =
      process.env.NEWSLETTER_THANK_YOU_TEXT ??
      "Thank you for subscribing to our newsletter. You'll be the first to know about new drops and updates.";

    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: email,
          subject,
          text,
        }),
      });
    } catch (err) {
      // We intentionally swallow Resend errors so the subscription
      // itself still succeeds.
      console.error("Failed to send Resend thank-you email", err);
    }
  }

  return NextResponse.json({ success: true });
}

