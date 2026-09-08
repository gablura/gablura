"use server";

import nodemailer from "nodemailer";
import { getDb } from "@/lib/mongodb";
import { contactSchema } from "../schemas/contact.schema";

// --- Rate limiting (in-memory) ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

// Clean stale entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap) {
    if (now > value.resetAt) rateLimitMap.delete(key);
  }
}, 60 * 60 * 1000);

// --- Email transporter ---
function createTransporter() {
  const {
    EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD,
  } = process.env;

  if (
    !EMAIL_SERVER_HOST ||
    !EMAIL_SERVER_PORT ||
    !EMAIL_SERVER_USER ||
    !EMAIL_SERVER_PASSWORD
  ) {
    throw new Error("Missing email environment variables");
  }

  return nodemailer.createTransport({
    host: EMAIL_SERVER_HOST,
    port: Number(EMAIL_SERVER_PORT),
    secure: Number(EMAIL_SERVER_PORT) === 465,
    auth: { user: EMAIL_SERVER_USER, pass: EMAIL_SERVER_PASSWORD },
    tls: { rejectUnauthorized: process.env.NODE_ENV === "production" },
  });
}

export type ContactFormState = {
  success: boolean;
  error: string | null;
  fieldErrors?: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
};

export async function sendMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  };

  // Validate
  const result = contactSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: ContactFormState["fieldErrors"] = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof typeof fieldErrors;
      if (field) fieldErrors[field] = issue.message;
    }
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  const { name, email, subject, message } = result.data;

  // Rate limit (use email as identifier)
  const ip = email.toLowerCase();
  if (!checkRateLimit(ip)) {
    return {
      success: false,
      error: "Too many messages. Please try again later.",
    };
  }

  try {
    // Save to database
    const db = await getDb();
    await db.collection("messages").insertOne({
      name,
      email: email.toLowerCase(),
      subject,
      message,
      read: false,
      createdAt: new Date(),
    });

    // Send email notifications (non-blocking)
    try {
      const from = process.env.EMAIL_FROM;
      const to = "gabluraorg@gmail.com";

      if (from) {
        const transporter = createTransporter();

        // Team notification
        await transporter.sendMail({
          from,
          to,
          subject: `New Contact: ${subject}`,
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
              <h2 style="color: #18181b; margin-bottom: 8px;">New Contact Message</h2>
              <p style="color: #52525b; line-height: 1.6; margin-bottom: 24px;">
                You received a new message from the contact form.
              </p>
              <div style="background: #fafafa; border: 1px solid #e8e8ec; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                <p style="color: #71717a; font-size: 12px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.05em;">From</p>
                <p style="color: #18181b; margin: 0; font-weight: 500;">${name} &lt;${email}&gt;</p>
              </div>
              <div style="background: #fafafa; border: 1px solid #e8e8ec; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                <p style="color: #71717a; font-size: 12px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.05em;">Subject</p>
                <p style="color: #18181b; margin: 0; font-weight: 500;">${subject}</p>
              </div>
              <div style="background: #fafafa; border: 1px solid #e8e8ec; border-radius: 8px; padding: 16px;">
                <p style="color: #71717a; font-size: 12px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
                <p style="color: #18181b; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
          `,
        });

        // Auto-reply to sender
        await transporter.sendMail({
          from,
          to: email,
          subject: "We received your message — Gablura",
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
              <h2 style="color: #18181b; margin-bottom: 8px;">Message received</h2>
              <p style="color: #52525b; line-height: 1.6;">
                Hi ${name}, thank you for reaching out. We've received your message and will get back to you within 24-48 hours.
              </p>
              <div style="background: #fafafa; border: 1px solid #e8e8ec; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <p style="color: #71717a; font-size: 12px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.05em;">Your message</p>
                <p style="color: #18181b; margin: 0; font-weight: 500;">${subject}</p>
                <p style="color: #52525b; margin: 8px 0 0 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
              <p style="color: #a1a1aa; font-size: 13px; margin-top: 24px;">
                If you didn't send this message, you can ignore this email.
              </p>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error("Failed to send contact email:", emailError);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
