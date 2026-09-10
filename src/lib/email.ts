import nodemailer from "nodemailer";

interface SendVerificationEmailOptions {
  email: string;
  name?: string;
  token: string;
  baseUrl: string;
}

export interface SendVerificationEmailResult {
  ok: boolean;
  error?: string;
  verifyUrl: string;
  isConfigurationError?: boolean;
}

export async function sendVerificationEmail({
  email,
  name,
  token,
  baseUrl,
}: SendVerificationEmailOptions): Promise<SendVerificationEmailResult> {
  const cleanEmail = email.trim().toLowerCase();
  const verifyUrl = `${baseUrl}/verify-email?token=${token}&email=${encodeURIComponent(cleanEmail)}`;

  // Log verification link to server console for easy testing and development fallback
  console.log(
    `\n=======================================================\n` +
      `🔗 [CSRecall Verification Link for ${cleanEmail}]:\n` +
      `   ${verifyUrl}\n` +
      `=======================================================\n`,
  );

  const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email • ইমেইল ভেরিফিকেশন</title>
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
                VERIFY ACCOUNT &bull; অ্যাকাউন্ট ভেরিফিকেশন
              </div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 900; color: #1c1917; line-height: 1.3;">
                ⚡ CSRECALL &bull; আপনার অ্যাকাউন্ট ভেরিফাই করুন
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 28px 28px 28px; font-size: 15px; line-height: 1.6; color: #292524;">
              <p style="margin: 0 0 10px 0; font-weight: 500;">
                ${name ? `Hi <strong>${name}</strong>, welcome` : "Welcome"} to CSRecall! To activate your account and start your CS interview preparation, please confirm your email address.
              </p>
              <p style="margin: 0 0 24px 0; font-weight: 600; color: #44403c;">
                CSRecall-এ স্বাগতম! আপনার অ্যাকাউন্টটি সক্রিয় করতে এবং ইন্টারভিউ প্রস্তুতি শুরু করতে নিচের বাটনে ক্লিক করে ইমেইল ভেরিফাই করুন।
              </p>

              <div style="text-align: center; margin: 28px 0;">
                <a href="${verifyUrl}" style="background: #FBBF24; border: 3px solid #000000; border-radius: 12px; box-shadow: 4px 4px 0px #000000; padding: 14px 26px; font-weight: 900; font-size: 14px; color: #000000; text-decoration: none; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px;">
                  VERIFY EMAIL / ইমেইল নিশ্চিত করুন &rarr;
                </a>
              </div>

              <div style="background-color: #fafaf9; border: 2px dashed #000000; border-radius: 10px; padding: 14px 16px; margin: 24px 0 0 0;">
                <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #57534e; line-height: 1.5;">
                  ✦ This link is valid for 24 hours. / এই লিংকটির মেয়াদ ২৪ ঘণ্টা।
                </p>
                <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #57534e; line-height: 1.5;">
                  ✦ If the button above doesn't work, copy and paste this link into your browser:
                </p>
                <p style="margin: 0; font-size: 11px; word-break: break-all; color: #78716c; font-family: monospace;">
                  ${verifyUrl}
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

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();

  // If SMTP credentials are not configured, log clear fallback warning and return fallback
  if (!user || !pass) {
    console.warn(
      `⚠️ [email-verification] SMTP_USER or SMTP_PASSWORD is not configured in environment variables.\n` +
        `   [DEV VERIFY URL for ${cleanEmail}]: ${verifyUrl}\n`,
    );
    return {
      ok: false,
      error:
        "SMTP credentials not configured. Please configure SMTP_USER and SMTP_PASSWORD.",
      verifyUrl,
      isConfigurationError: true,
    };
  }

  const fromEmail = process.env.EMAIL_FROM?.trim() || `CSRecall <${user}>`;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: fromEmail,
      to: cleanEmail,
      subject: "⚡ CSRecall Account Verification • ইমেইল ভেরিফিকেশন",
      html: emailHtml,
    });

    console.log(
      `✅ [email-verification] Verification email dispatched via Nodemailer SMTP to ${cleanEmail} (MessageId: ${info.messageId})`,
    );
    return { ok: true, verifyUrl };
  } catch (err: unknown) {
    let safeErrorMessage = "Failed to dispatch verification email via SMTP.";

    if (err instanceof Error) {
      const rawMessage = err.message || "";
      if (
        rawMessage.includes("EAUTH") ||
        rawMessage.includes("Invalid login") ||
        rawMessage.includes("Username and Password not accepted")
      ) {
        safeErrorMessage =
          "SMTP authentication failed. If using Gmail, make sure 2-Step Verification is ON and a Gmail App Password is used instead of your regular password.";
      } else if (
        rawMessage.includes("ETIMEDOUT") ||
        rawMessage.includes("ECONNREFUSED") ||
        rawMessage.includes("ENOTFOUND")
      ) {
        safeErrorMessage =
          "Could not reach SMTP server. Please verify SMTP_HOST and SMTP_PORT settings.";
      } else {
        // Redact any accidental credential leak from the error message
        safeErrorMessage = rawMessage
          .replace(
            new RegExp(pass.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"),
            "[REDACTED]",
          )
          .replace(
            new RegExp(user.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"),
            "[REDACTED_USER]",
          );
      }
    }

    console.error(
      "❌ [email-verification] Nodemailer dispatch failed:",
      safeErrorMessage,
    );

    return {
      ok: false,
      error: safeErrorMessage,
      verifyUrl,
    };
  }
}
