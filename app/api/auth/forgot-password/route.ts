import { handleForgotPassword } from "@gablura/auth-next/api";
import { mongoDataStore } from "@/lib/auth/data-store";
import nodemailer from "nodemailer";

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

async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL;
  const from = process.env.EMAIL_FROM;
  if (!baseUrl) throw new Error("Missing NEXTAUTH_URL");
  if (!from) throw new Error("Missing EMAIL_FROM");

  const url = `${baseUrl}/reset-password?token=${token}`;

  const transporter = createTransporter();
  await transporter.sendMail({
    from,
    to: email,
    subject: "Reset your password - Gablura",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #18181b;">Reset your password</h2>
        <p style="color: #52525b; line-height: 1.6;">
          Click the link below to reset your password. This link expires in 1 hour.
        </p>
        <a href="${url}" style="display: inline-block; background: #6366f1; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; margin-top: 16px;">
          Reset password
        </a>
        <p style="color: #a1a1aa; font-size: 13px; margin-top: 24px;">
          If you didn't request a password reset, you can ignore this email.
        </p>
      </div>
    `,
  });
}

export async function POST(req: Request) {
  return handleForgotPassword(req, {
    dataStore: mongoDataStore,
    sendPasswordResetEmail,
  });
}
