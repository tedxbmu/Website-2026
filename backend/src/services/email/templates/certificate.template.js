const escapeHtml = (text) => {
  if (!text) return "";
  return text
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatContributionLine = (designation) => {
  const safeDesignation = escapeHtml(designation || "Organising Committee");

  if (!designation) {
    return `We appreciate your contribution as a member of the <strong>${safeDesignation}</strong> for TEDxBMU 2026.`;
  }

  const normalized = designation.trim().toLowerCase();

  // Roles that imply being part of a team
  if (normalized.endsWith("team") || normalized === "social media and marketing") {
    const roleText = normalized.endsWith("team") ? safeDesignation : `${safeDesignation} team`;
    return `We appreciate your contribution as part of the <strong>${roleText}</strong> for TEDxBMU 2026.`;
  }

  // Leads, Licensees, Presidents
  if (
    normalized.endsWith("lead") ||
    normalized.endsWith("licensee") ||
    normalized.endsWith("president")
  ) {
    return `We appreciate your contribution as <strong>${safeDesignation}</strong> for TEDxBMU 2026.`;
  }

  // Fallback
  return `We appreciate your contribution as a member of the <strong>${safeDesignation}</strong> for TEDxBMU 2026.`;
};

const generateCertificateEmail = ({ name, designation }) => {
  const safeName = escapeHtml(name);
  const contributionLine = formatContributionLine(designation);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your TEDxBMU Certificate</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f4f4f4;color:#222;">
  <table role="presentation" style="width:100%;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:36px 16px;">
        <table role="presentation" style="width:600px;max-width:100%;background:#fff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background:#e62b1e;padding:28px;text-align:center;color:#fff;">
              <h1 style="margin:0;font-size:30px;letter-spacing:.02em;">TEDxBMU</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;">
              <h2 style="margin:0 0 16px;color:#111;font-size:24px;">Hi ${safeName},</h2>
              <p style="margin:0 0 16px;line-height:1.6;color:#444;font-size:16px;">
                Thank you for sharing your feedback with TEDxBMU. Your certificate of appreciation is attached to this email.
              </p>
              <p style="margin:0 0 22px;line-height:1.6;color:#444;font-size:16px;">
                ${contributionLine}
              </p>
              <p style="margin:0;line-height:1.6;color:#444;font-size:16px;">
                Warm regards,<br />
                <strong>Team TEDxBMU</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f8f8f8;padding:20px 28px;text-align:center;color:#888;font-size:12px;">
              TEDxBMU 2026
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

const generateCertificateEmailText = ({ name, designation }) => {
  const roleLabel = designation || "Organising Committee";
  const normalized = roleLabel.trim().toLowerCase();
  let contributionLine = `We appreciate your contribution as a member of the ${roleLabel} for TEDxBMU 2026.`;

  if (normalized.endsWith("team") || normalized === "social media and marketing") {
    const roleText = normalized.endsWith("team") ? roleLabel : `${roleLabel} team`;
    contributionLine = `We appreciate your contribution as part of the ${roleText} for TEDxBMU 2026.`;
  } else if (
    normalized.endsWith("lead") ||
    normalized.endsWith("licensee") ||
    normalized.endsWith("president")
  ) {
    contributionLine = `We appreciate your contribution as ${roleLabel} for TEDxBMU 2026.`;
  }

  return `
Hi ${name},

Thank you for sharing your feedback with TEDxBMU. Your certificate of appreciation is attached to this email.

${contributionLine}

Warm regards,
Team TEDxBMU
`.trim();
};

module.exports = {
  generateCertificateEmail,
  generateCertificateEmailText,
};
