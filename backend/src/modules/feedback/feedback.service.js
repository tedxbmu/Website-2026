const supabase = require("../../config/db");
const { syncToGoogleSheet } = require("../../../utils/syncToGoogleSheet");
const { getEmailService } = require("../../services/email");
const { findCertificateRecipient } = require("./certificateRecipients");
const { getCertificateBuffer } = require("./certificateStorage");

/**
 * Save feedback to Supabase, regardless of certificate availability.
 * Optional certificate fields are stored when available.
 */
const saveFeedbackSubmission = async ({
  name,
  email,
  phone,
  rating,
  feedback,
  recipient,
  emailResult,
}) => {
  const row = {
    name,
    email,
    phone,
    rating,
    feedback,
    recipient_name: recipient ? recipient.name : null,
    recipient_role: recipient ? (recipient.designation || "Organising Committee") : null,
    match_type: recipient ? recipient.matchType : null,
    certificate_file: recipient ? recipient.certificateFile : null,
    certificate_sent: emailResult ? emailResult.success : false,
    certificate_email_id: emailResult ? (emailResult.emailId || null) : null,
  };

  try {
    const { error } = await supabase.from("feedback_submissions").insert([row]);

    if (error) {
      console.error("[FEEDBACK] Feedback DB insert failed:", error.message || error);
    }
  } catch (err) {
    console.error("[FEEDBACK] Feedback DB insert exception:", err.message || err);
  }

  return row;
};

/**
 * Attempt to send the certificate email for a matched recipient.
 * This is a best-effort operation; errors are logged but never thrown.
 *
 * @returns {{ success: boolean, emailId: string|null, error: string|null }}
 */
const trySendCertificateEmail = async ({ email, name, recipient }) => {
  let certificateBuffer;

  try {
    certificateBuffer = await getCertificateBuffer(recipient.certificateFile);
  } catch (err) {
    console.error(
      `[FEEDBACK] Certificate file fetch failed for "${recipient.certificateFile}":`,
      err.message || err
    );
    return { success: false, emailId: null, error: "Certificate file not available" };
  }

  const emailService = getEmailService();
  const emailResult = await emailService.sendCertificateEmail({
    to: email,
    name: recipient.name,
    designation: recipient.designation || "Organising Committee",
    certificateBuffer,
    certificateFile: recipient.certificateFile,
  });

  if (!emailResult.success) {
    console.error(
      `[FEEDBACK] Certificate email failed for ${email}:`,
      emailResult.error
    );
  } else {
    console.log(`[FEEDBACK] Certificate email sent to ${email} (${recipient.name})`);
  }

  return emailResult;
};

/**
 * Process a feedback submission.
 *
 * Feedback is always recorded in the database and Google Sheet.
 * Certificate email is sent only when a matching recipient is found;
 * failure to find a recipient or send the email does NOT block feedback.
 */
const processFeedback = async ({ name, email, phone, rating, feedback }) => {
  // 1. Try to find a matching certificate recipient (optional)
  const recipient = findCertificateRecipient({ email, name });

  if (!recipient) {
    console.log(
      `[FEEDBACK] No certificate mapping found for email="${email}" name="${name}". Saving feedback without certificate.`
    );
  }

  // 2. Try to send certificate email (best-effort, never blocks feedback)
  let emailResult = null;
  if (recipient) {
    emailResult = await trySendCertificateEmail({ email, name, recipient });
  }

  // 3. Always save feedback to the database
  const savedRow = await saveFeedbackSubmission({
    name,
    email,
    phone,
    rating,
    feedback,
    recipient,
    emailResult,
  });

  // 4. Sync to Google Sheet (best-effort)
  try {
    await syncToGoogleSheet({
      ...savedRow,
      created_at: savedRow.created_at || new Date().toISOString(),
    });
  } catch (err) {
    console.error("[FEEDBACK] Google Sheet sync failed:", err.message || err);
  }

  return {
    feedbackSaved: true,
    recipient: recipient ? recipient.name : null,
    designation: recipient ? (recipient.designation || "Organising Committee") : null,
    matchType: recipient ? recipient.matchType : null,
    certificateSent: emailResult ? emailResult.success : false,
  };
};

module.exports = {
  processFeedback,
};
