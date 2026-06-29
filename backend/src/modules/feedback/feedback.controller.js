const feedbackService = require("./feedback.service");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone) => {
  const digits = phone.replace(/[\s\-().+]/g, "");
  return /^\d{10,13}$/.test(digits);
};

const submitFeedback = async (req, res) => {
  try {
    const { name, email, phone, rating, feedback } = req.body;

    if (!name || !email || !phone || rating === undefined || !feedback) {
      return res.status(400).json({
        message: "All fields are required: name, email, phone, rating, feedback",
      });
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof phone !== "string" ||
      typeof feedback !== "string"
    ) {
      return res.status(400).json({
        message: "Name, email, phone, and feedback must be strings",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanFeedback = feedback.trim();
    const cleanRating = Number(rating);

    if (!cleanName || !cleanEmail || !cleanPhone || !cleanFeedback) {
      return res.status(400).json({
        message: "Fields cannot be empty or whitespace-only",
      });
    }

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({
        message: "Invalid email address format",
      });
    }

    if (!isValidPhone(cleanPhone)) {
      return res.status(400).json({
        message: "Invalid phone number. Please provide a valid 10-digit number.",
      });
    }

    if (!Number.isInteger(cleanRating) || cleanRating < 1 || cleanRating > 5) {
      return res.status(400).json({
        message: "Rating must be a number from 1 to 5",
      });
    }

    if (cleanFeedback.length < 10) {
      return res.status(400).json({
        message: "Feedback must be at least 10 characters long",
      });
    }

    if (cleanFeedback.length > 3000) {
      return res.status(400).json({
        message: "Feedback is too long. Keep it under 3000 characters.",
      });
    }

    // processFeedback never throws for missing certificates – feedback is always recorded
    const result = await feedbackService.processFeedback({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      rating: cleanRating,
      feedback: cleanFeedback,
    });

    return res.status(201).json({
      message: "Feedback submitted successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return res.status(500).json({
      message: "Internal server error",
      debug: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  submitFeedback,
};
