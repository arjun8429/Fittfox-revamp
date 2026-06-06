import { NextResponse } from "next/server";
import { resolve4, resolve6, resolveMx } from "node:dns/promises";
import { validateEmailAddress } from "@/utils/emailValidation";

export const runtime = "nodejs";

function withTimeout(promise, milliseconds = 3000) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error("DNS lookup timed out")),
      milliseconds,
    );
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

async function domainCanReceiveEmail(domain) {
  try {
    const records = await withTimeout(resolveMx(domain));
    if (records.some((record) => record.exchange && record.exchange !== ".")) {
      return true;
    }
  } catch (error) {
    if (!["ENODATA", "ENOTFOUND"].includes(error.code)) return true;
  }

  try {
    const records = await withTimeout(Promise.any([resolve4(domain), resolve6(domain)]));
    return records.length > 0;
  } catch {
    return false;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = validateEmailAddress(body.email);

    // Silently accept bot submissions caught by the hidden form field.
    if (body.website) {
      return NextResponse.json({
        message: "You are on the FITT FOX waitlist.",
      });
    }

    if (validation.error) {
      return NextResponse.json(
        { message: validation.error },
        { status: 400 },
      );
    }

    if (!(await domainCanReceiveEmail(validation.domain))) {
      return NextResponse.json(
        { message: "Please use an email domain that can receive messages." },
        { status: 400 },
      );
    }

    const email = validation.email;
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
