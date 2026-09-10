/**
 * Email Service — Nodemailer with Dev Fallback
 * Sends OTP verification emails via SMTP or logs to console in dev mode
 */

import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || "noreply@beevilknievel.in";

const isConfigured = !!(SMTP_HOST && SMTP_USER && SMTP_PASS);

let transporter: nodemailer.Transporter | null = null;
if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

/**
 * Send an email verification OTP
 * In dev mode (no SMTP configured), logs the OTP to console
 */
export async function sendVerificationEmail(
  email: string,
  otp: string
): Promise<{ success: boolean; devMode: boolean }> {
  const htmlBody = `
    <div style="font-family: 'IBM Plex Sans', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 2px solid #14508C; background: #EEF1F4;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; width: 48px; height: 48px; background: #06182E; color: #F2A61C; font-size: 24px; font-weight: bold; line-height: 48px;">B</div>
        <h2 style="margin: 8px 0 0; color: #16212B; font-size: 18px; letter-spacing: 4px; text-transform: uppercase;">Beevil Knievel</h2>
        <p style="margin: 2px 0 0; color: #7A8896; font-size: 10px; letter-spacing: 3px; text-transform: uppercase;">KVIC • National Bee Board • SIH 2026</p>
      </div>
      <hr style="border: 1px solid #DFE5EB; margin: 20px 0;" />
      <p style="color: #16212B; font-size: 14px; margin-bottom: 16px;">Your email verification code:</p>
      <div style="background: #16212B; padding: 20px; text-align: center; margin-bottom: 16px;">
        <span style="color: #F2A61C; font-size: 36px; font-weight: bold; letter-spacing: 12px; font-family: monospace;">${otp}</span>
      </div>
      <p style="color: #7A8896; font-size: 12px; margin-bottom: 4px;">This code expires in <strong>10 minutes</strong>.</p>
      <p style="color: #7A8896; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
      <hr style="border: 1px solid #DFE5EB; margin: 20px 0;" />
      <p style="color: #93A3B3; font-size: 10px; text-align: center; letter-spacing: 2px; text-transform: uppercase;">Blockchain-Verified Honey Provenance</p>
    </div>
  `;

  if (!isConfigured || !transporter) {
    console.log("\n╔══════════════════════════════════════════════════╗");
    console.log("║  📧 DEV MODE — Email Verification OTP           ║");
    console.log(`║  To: ${email.padEnd(42)}║`);
    console.log(`║  OTP: ${otp}                                      ║`);
    console.log("║  (SMTP not configured, OTP logged to console)   ║");
    console.log("╚══════════════════════════════════════════════════╝\n");
    return { success: true, devMode: true };
  }

  try {
    await transporter.sendMail({
      from: `"Beevil Knievel" <${SMTP_FROM}>`,
      to: email,
      subject: "🍯 Beevil Knievel — Email Verification Code",
      html: htmlBody,
    });
    return { success: true, devMode: false };
  } catch (err) {
    console.error("Email send failed:", err);
    return { success: false, devMode: false };
  }
}

/**
 * Send phone OTP via SMS gateway
 * In dev mode (no SMS_API_KEY configured), returns the OTP in the response
 */
export async function sendPhoneOtp(
  phone: string,
  otp: string
): Promise<{ success: boolean; devMode: boolean; devOtp?: string }> {
  const smsApiKey = process.env.SMS_API_KEY;
  const smsProvider = process.env.SMS_PROVIDER || "fast2sms";

  if (!smsApiKey) {
    console.log("\n╔══════════════════════════════════════════════════╗");
    console.log("║  📱 DEV MODE — Phone Verification OTP           ║");
    console.log(`║  To: ${phone.padEnd(42)}║`);
    console.log(`║  OTP: ${otp}                                      ║`);
    console.log("║  (SMS gateway not configured)                   ║");
    console.log("╚══════════════════════════════════════════════════╝\n");
    return { success: true, devMode: true, devOtp: otp };
  }

  try {
    if (smsProvider === "fast2sms") {
      await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: smsApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "otp",
          variables_values: otp,
          numbers: phone.replace(/\D/g, "").slice(-10),
        }),
      });
    }
    return { success: true, devMode: false };
  } catch (err) {
    console.error("SMS send failed:", err);
    return { success: false, devMode: false };
  }
}
