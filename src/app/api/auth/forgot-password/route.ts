import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string };

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required. / ইমেইল প্রদান করা আবশ্যক।" },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    await connectDB();

    const user = await UserModel.findOne({ email: cleanEmail });

    // Always respond with success to avoid email enumeration, but only process if user exists
    if (!user) {
      console.warn(
        `⚠️ [forgot-password] No account exists for: "${cleanEmail}". Email dispatch skipped.`,
      );
      return NextResponse.json({
        ok: true,
        message:
          "If an account exists with that email, a password reset link has been dispatched.",
      });
    }

    // Generate raw cryptographically secure token and hash it for DB storage
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // Token valid for 1 hour
    const expires = new Date(Date.now() + 3600000);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expires;
    await user.save();

    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.AUTH_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";

    const resetUrl = `${baseUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(cleanEmail)}`;

    // Inked Neo-Brutalist HTML Email Template
    const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset • পাসওয়ার্ড রিসেট</title>
</head>
<body style="margin: 0; padding: 28px 12px; background-color: #f5f5f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c1917;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #fffdf7; border: 3px solid #000000; border-radius: 16px; box-shadow: 6px 6px 0px #000000; overflow: hidden; text-align: left;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background-color: #FBBF24; height: 8px; border-bottom: 2px solid #000000;"></td>
          </tr>
          <tr>
            <td style="padding: 28px 28px 16px 28px;">
              <div style="display: inline-block; background-color: #facc15; border: 2px solid #000000; border-radius: 8px; padding: 4px 10px; font-weight: 900; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 2px 2px 0px #000000; margin-bottom: 12px;">
                SECURITY ALERT &bull; নিরাপত্তা সতর্কতা
              </div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 900; color: #1c1917; line-height: 1.3;">
                ⚡ CSRECALL &bull; পাসওয়ার্ড রিসেট
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 28px 28px 28px; font-size: 15px; line-height: 1.6; color: #292524;">
              <p style="margin: 0 0 10px 0; font-weight: 500;">
                You requested a password reset for your CSRecall account. Click the button below to choose a new password.
              </p>
              <p style="margin: 0 0 24px 0; font-weight: 600; color: #44403c;">
                আপনার CSRecall অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তন করতে নিচের বাটনে ক্লিক করুন।
              </p>

              <div style="text-align: center; margin: 28px 0;">
                <a href="${resetUrl}" style="background: #FBBF24; border: 3px solid #000000; border-radius: 12px; box-shadow: 4px 4px 0px #000000; padding: 14px 26px; font-weight: 900; font-size: 14px; color: #000000; text-decoration: none; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px;">
                  RESET PASSWORD / পাসওয়ার্ড রিসেট করুন
                </a>
              </div>

              <div style="background-color: #fafaf9; border: 2px dashed #000000; border-radius: 10px; padding: 14px 16px; margin: 24px 0 0 0;">
                <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #57534e; line-height: 1.5;">
                  ✦ This link is valid for 1 hour. If you didn't request this, ignore this email.
                </p>
                <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #57534e; line-height: 1.5;">
                  ✦ Button not working? Copy and paste this URL into your browser:
                </p>
                <p style="margin: 0; font-size: 11px; word-break: break-all; color: #78716c; font-family: monospace;">
                  ${resetUrl}
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 14px 28px; background-color: #f5f5f4; border-top: 2px solid #000000; font-size: 11px; font-weight: 800; color: #78716c; text-align: center;">
              ⚡ CSRECALL ARCADE &bull; CS INTERVIEW TRAINING ARENA
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Real email dispatch via Nodemailer SMTP
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASSWORD?.trim();
    let emailDispatchFailed = false;

    // Always log reset link to console for debugging/fallback
    console.log(
      `\n=======================================================\n` +
        `🔗 [CSRecall Password Reset Link for ${cleanEmail}]:\n` +
        `   ${resetUrl}\n` +
        `=======================================================\n`,
    );

    if (smtpUser && smtpPass) {
      try {
        const host = process.env.SMTP_HOST || "smtp.gmail.com";
        const port = parseInt(process.env.SMTP_PORT || "587", 10);
        const secure = process.env.SMTP_SECURE === "true" || port === 465;
        const fromEmail =
          process.env.EMAIL_FROM?.trim() || `CSRecall <${smtpUser}>`;

        const transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const info = await transporter.sendMail({
          from: fromEmail,
          to: cleanEmail,
          subject: "⚡ CSRecall Password Reset • পাসওয়ার্ড রিসেট",
          html: emailHtml,
        });

        console.log(
          `✅ [forgot-password] Reset email dispatched via Nodemailer SMTP to ${cleanEmail} (MessageId: ${info.messageId})`,
        );
      } catch (smtpErr) {
        emailDispatchFailed = true;
        console.error("❌ [forgot-password] SMTP dispatch error:", smtpErr);
      }
    } else {
      emailDispatchFailed = true;
      console.warn(
        `\n⚠️ [forgot-password] SMTP_USER or SMTP_PASSWORD is not configured in .env.local! Email dispatch was skipped.\n` +
          `   [DEV RESET URL for ${cleanEmail}]:\n` +
          `   ${resetUrl}\n`,
      );
    }

    if (emailDispatchFailed) {
      return NextResponse.json(
        {
          error:
            "The reset email could not be sent. Please check your SMTP configuration and try again.",
        },
        { status: 503 },
      );
    }

    // Return clean JSON without any dev-link or plain-text reset URL
    return NextResponse.json({
      ok: true,
      message:
        "If an account exists with that email, a password reset link has been dispatched.",
    });
  } catch (error: unknown) {
    console.error("[forgot-password error]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error.",
      },
      { status: 500 },
    );
  }
}
