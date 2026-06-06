import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();

    // Silently accept bot submissions caught by the hidden form field.
    if (body.website) {
      return NextResponse.json({
        message: "You are on the FITT FOX waitlist.",
      });
    }

    if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    const sharedSecret = process.env.NOTIFY_SHARED_SECRET;

    if (!appsScriptUrl || !sharedSecret) {
      console.error("Notify service environment variables are not configured.");
      return NextResponse.json(
        { message: "Waitlist signup is temporarily unavailable." },
        { status: 503 },
      );
    }

    const appsScriptResponse = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        secret: sharedSecret,
        source: "fittfox-website",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    const result = await appsScriptResponse.json();

    if (!appsScriptResponse.ok || !result.ok) {
      console.error("Google Apps Script notify request failed:", result);
      return NextResponse.json(
        { message: "We could not add you right now. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      message: result.duplicate
        ? "You are already on the FITT FOX waitlist."
        : "Welcome to FITT FOX. Please check your inbox!",
    });
  } catch (error) {
    console.error("Notify API error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
