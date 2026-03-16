import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ── Rate limiter ──────────────────────────────────────────────────────────────
const RATE_LIMIT = 2;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const rateLimitMap = new Map<string, number[]>();

function getIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

function checkRateLimit(ip: string): { allowed: true } | { allowed: false; retryAfterMs: number } {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= RATE_LIMIT) {
    const oldest = Math.min(...timestamps);
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - oldest) };
  }

  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return { allowed: true };
}

// ── Input limits ──────────────────────────────────────────────────────────────
const MAX_NAME = 100;
const MAX_EMAIL = 254; // RFC 5321
const MAX_MESSAGE = 5000;

/** Strip CR/LF to prevent email header injection */
function sanitize(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n]/g, " ").trim();
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const rateCheck = checkRateLimit(getIp(req));
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "rate_limited", retryAfterMs: rateCheck.retryAfterMs },
      { status: 429 }
    );
  }

  const { name, email, message } = body as Record<string, unknown>;

  const safeName = sanitize(name).slice(0, MAX_NAME);
  const safeEmail = sanitize(email).slice(0, MAX_EMAIL);
  const safeMessage = sanitize(message).slice(0, MAX_MESSAGE);

  if (!safeMessage) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: "valronnpersonal@gmail.com",
      subject: `Відгук від ${safeName || "анонім"}`,
      text: `Від: ${safeName || "—"}\nEmail: ${safeEmail || "—"}\n\n${safeMessage}`,
    });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
