/**
 * Email Service
 * Production-ready email sending with error handling, retries, and logging
 * Uses Nodemailer with SMTP
 */

const { getEmailConfig } = require("./email.config");
const {
  generateTicketEmail,
  generateTicketEmailText,
} = require("./templates/ticket.template");
const {
  generateCertificateEmail,
  generateCertificateEmailText,
} = require("./templates/certificate.template");

/**
 * Email Service Logger
 */
class EmailLogger {
  static log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      service: "EmailService",
      message,
      ...meta,
    };

    if (level === "error") {
      console.error(JSON.stringify(logData));
    } else {
      console.log(JSON.stringify(logData));
    }
  }

  static info(message, meta) {
    this.log("info", message, meta);
  }

  static error(message, meta) {
    this.log("error", message, meta);
  }

  static warn(message, meta) {
    this.log("warn", message, meta);
  }
}

/**
 * Custom Email Error
 */
class EmailError extends Error {
  constructor(message, code, originalError = null) {
    super(message);
    this.name = "EmailError";
    this.code = code;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Email Service Class
 */
class EmailService {
  constructor() {
    try {
      this.config = getEmailConfig();
      this.transporter = this.config.getClient();
      EmailLogger.info("Email service initialized successfully");
    } catch (error) {
      EmailLogger.error("Failed to initialize email service", {
        error: error.message,
      });
      throw new EmailError(
        "Email service initialization failed",
        "INIT_ERROR",
        error
      );
    }
  }

  /**
   * Validate email address format
   * @private
   * @param {string} email
   * @returns {boolean}
   */
  _validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate ticket email parameters
   * @private
   * @param {Object} params
   * @throws {EmailError}
   */
  _validateTicketParams(params) {
    const { to, name, ticketId, qrCodeUrl, college } = params;

    const errors = [];

    if (!to || !this._validateEmail(to)) {
      errors.push("Invalid recipient email address");
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      errors.push("Invalid or missing name");
    }

    if (!ticketId || typeof ticketId !== "string") {
      errors.push("Invalid or missing ticket ID");
    }

    if (!qrCodeUrl || !qrCodeUrl.startsWith("http")) {
      errors.push("Invalid or missing QR code URL");
    }

    if (!college || typeof college !== "string" || college.trim().length === 0) {
      errors.push("Invalid or missing college name");
    }

    if (errors.length > 0) {
      throw new EmailError(
        `Validation failed: ${errors.join(", ")}`,
        "VALIDATION_ERROR"
      );
    }
  }

  /**
   * Validate certificate email parameters
   * @private
   * @param {Object} params
   * @throws {EmailError}
   */
  _validateCertificateParams(params) {
    const { to, name, designation, certificatePath, certificateBuffer } = params;

    const errors = [];

    if (!to || !this._validateEmail(to)) {
      errors.push("Invalid recipient email address");
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      errors.push("Invalid or missing name");
    }

    if (!designation || typeof designation !== "string" || designation.trim().length === 0) {
      errors.push("Invalid or missing designation");
    }

    if (
      !certificateBuffer &&
      (!certificatePath || typeof certificatePath !== "string")
    ) {
      errors.push("Invalid or missing certificate attachment");
    }

    if (errors.length > 0) {
      throw new EmailError(
        `Validation failed: ${errors.join(", ")}`,
        "VALIDATION_ERROR"
      );
    }
  }

  /**
   * Send email with retry logic
   * @private
   * @param {Object} mailOptions - Nodemailer mail options
   * @param {number} retries
   * @returns {Promise<Object>}
   */
  async _sendWithRetry(mailOptions, retries = 2) {
    let lastError = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        if (attempt > 0) {
          EmailLogger.info(`Retry attempt ${attempt}/${retries}`, {
            to: mailOptions.to,
          });
          // Exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }

        const info = await this.transporter.sendMail(mailOptions);

        EmailLogger.info("Email sent successfully", {
          to: mailOptions.to,
          messageId: info.messageId,
          attempt: attempt + 1,
        });

        return info;
      } catch (error) {
        lastError = error;
        EmailLogger.warn(`Email send attempt ${attempt + 1} failed`, {
          to: mailOptions.to,
          error: error.message,
        });
      }
    }

    throw lastError;
  }

  /**
   * Send ticket email to user
   * @param {Object} params
   * @param {string} params.to - Recipient email
   * @param {string} params.name - Recipient name
   * @param {string} params.ticketId - Unique ticket ID
   * @param {string} params.qrCodeUrl - Public URL to QR code
   * @param {string} params.college - College name
   * @returns {Promise<{success: boolean, emailId: string|null, error: string|null}>}
   */
  async sendTicketEmail({ to, name, ticketId, qrCodeUrl, college }) {
    const startTime = Date.now();

    try {
      // Validate parameters
      this._validateTicketParams({ to, name, ticketId, qrCodeUrl, college });

      EmailLogger.info("Sending ticket email", {
        to,
        ticketId,
      });

      // Generate email content
      const htmlContent = generateTicketEmail({
        name,
        ticketId,
        qrCodeUrl,
        college,
      });

      const textContent = generateTicketEmailText({
        name,
        ticketId,
        qrCodeUrl,
        college,
      });

      // Prepare mail options for Nodemailer
      const mailOptions = {
        from: this.config.getFromAddress(),
        to: to,
        subject: "🎟 Your TEDxBMU 2026 Event Ticket",
        html: htmlContent,
        text: textContent,
      };

      // Send with retry
      const info = await this._sendWithRetry(mailOptions);

      const duration = Date.now() - startTime;

      EmailLogger.info("Ticket email sent successfully", {
        to,
        ticketId,
        messageId: info.messageId,
        duration: `${duration}ms`,
      });

      return {
        success: true,
        emailId: info.messageId || null,
        error: null,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      EmailLogger.error("Failed to send ticket email", {
        to,
        ticketId,
        error: error.message,
        code: error.code,
        duration: `${duration}ms`,
      });

      // Determine error type and message
      let errorMessage = "Failed to send email";
      let errorCode = "SEND_ERROR";

      if (error instanceof EmailError) {
        errorMessage = error.message;
        errorCode = error.code;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        emailId: null,
        error: errorMessage,
        code: errorCode,
      };
    }
  }

  /**
   * Send certificate email to user
   * @param {Object} params
   * @param {string} params.to - Recipient email
   * @param {string} params.name - Recipient name
   * @param {string} params.designation - OC contribution designation
   * @param {Buffer} params.certificateBuffer - Certificate file buffer
   * @param {string} params.certificatePath - Local path to certificate file, for dev fallback
   * @param {string} params.certificateFile - Certificate filename
   * @returns {Promise<{success: boolean, emailId: string|null, error: string|null}>}
   */
  async sendCertificateEmail({
    to,
    name,
    designation,
    certificateBuffer,
    certificatePath,
    certificateFile,
  }) {
    const startTime = Date.now();

    try {
      this._validateCertificateParams({
        to,
        name,
        designation,
        certificateBuffer,
        certificatePath,
      });

      EmailLogger.info("Sending certificate email", {
        to,
        designation,
        certificateFile,
      });

      const htmlContent = generateCertificateEmail({ name, designation });
      const textContent = generateCertificateEmailText({ name, designation });

      const attachmentFilename = certificateFile?.toLowerCase().endsWith(".pdf")
        ? `TEDxBMU 2026 Certificate - ${name}.pdf`
        : certificateFile || "TEDxBMU 2026 Certificate.pdf";

      const attachment = {
        filename: attachmentFilename,
        contentType: certificateFile?.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : "application/octet-stream",
        ...(certificateBuffer
          ? { content: certificateBuffer }
          : { path: certificatePath }),
      };

      const mailOptions = {
        from: this.config.getFromAddress(),
        to,
        subject: "Your TEDxBMU Certificate of Appreciation",
        html: htmlContent,
        text: textContent,
        attachments: [attachment],
      };

      const info = await this._sendWithRetry(mailOptions);
      const duration = Date.now() - startTime;

      EmailLogger.info("Certificate email sent successfully", {
        to,
        designation,
        messageId: info.messageId,
        duration: `${duration}ms`,
      });

      return {
        success: true,
        emailId: info.messageId || null,
        error: null,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      EmailLogger.error("Failed to send certificate email", {
        to,
        designation,
        error: error.message,
        code: error.code,
        duration: `${duration}ms`,
      });

      let errorMessage = "Failed to send certificate email";
      let errorCode = "SEND_ERROR";

      if (error instanceof EmailError) {
        errorMessage = error.message;
        errorCode = error.code;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        emailId: null,
        error: errorMessage,
        code: errorCode,
      };
    }
  }

  /**
   * Verify SMTP connection (health check)
   * @returns {Promise<void>}
   */
  async verifyConnection() {
    await this.config.verifyConnection();
  }

  /**
   * Health check for email service
   * @returns {Promise<{healthy: boolean, message: string}>}
   */
  async healthCheck() {
    try {
      const from = this.config.getFromAddress();
      await this.verifyConnection();

      EmailLogger.info("Email service health check passed");

      return {
        healthy: true,
        message: "Email service is operational",
        from,
      };
    } catch (error) {
      EmailLogger.error("Email service health check failed", {
        error: error.message,
      });

      return {
        healthy: false,
        message: error.message,
      };
    }
  }
}

// Singleton instance
let emailServiceInstance = null;

/**
 * Get email service instance
 * @returns {EmailService}
 */
const getEmailService = () => {
  if (!emailServiceInstance) {
    emailServiceInstance = new EmailService();
  }
  return emailServiceInstance;
};

module.exports = {
  getEmailService,
  EmailError,
};
