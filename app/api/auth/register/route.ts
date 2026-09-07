import { mongoDataStore } from "@/lib/auth/data-store";
import argon2 from "argon2";
import nodemailer from "nodemailer";
import crypto from "crypto";

function createTransporter() {
  const { EMAIL_SERVER_HOST, EMAIL_SERVER_PORT, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD } = process.env;
  if (!EMAIL_SERVER_HOST || !EMAIL_SERVER_PORT || !EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD) {
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const existing = await mongoDataStore.findUserByEmail(normalizedEmail);
    if (existing) {
      return Response.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    // Create user
    const hashedPassword = await argon2.hash(password);
    const result = await mongoDataStore.createUser({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });
    console.log("User created:", result.id);

    // Create verification token
    const verificationToken = crypto.randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await mongoDataStore.createVerificationToken({
      identifier: normalizedEmail,
      token: verificationToken,
      expires,
    });
    console.log("Verification token created:", verificationToken, "for:", normalizedEmail);

    // Send email (non-blocking)
    try {
      const baseUrl = process.env.NEXTAUTH_URL;
      const from = process.env.EMAIL_FROM;
      if (baseUrl && from) {
        const url = `${baseUrl}/verify-email?token=${verificationToken}`;
        const transporter = createTransporter();
        await transporter.sendMail({
          from,
          to: normalizedEmail,
          subject: "Verify your email - Gablura",
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
              <h2 style="color: #18181b;">Verify your email</h2>
              <p style="color: #52525b; line-height: 1.6;">
                Click the link below to verify your email address. This link expires in 24 hours.
              </p>
              <a href="${url}" style="display: inline-block; background: #6366f1; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; margin-top: 16px;">
                Verify email
              </a>
              <p style="color: #a1a1aa; font-size: 13px; margin-top: 24px;">
                If you didn't create an account, you can ignore this email.
              </p>
            </div>
          `,
        });
        console.log("Verification email sent to:", normalizedEmail);
      }
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
    }

    return Response.json({ message: "Registration successful" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
