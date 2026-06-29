"use client";

import { useState } from "react";
import { Loader2, Send, Star } from "lucide-react";
import { submitFeedback } from "@/lib/api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  rating: 0,
  feedback: "",
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = (phone) => {
  const digits = phone.replace(/[\s\-().+]/g, "");
  return /^\d{10,13}$/.test(digits);
};

export default function FeedbackPage() {
  const [form, setForm] = useState(initialForm);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const shownRating = hoverRating || form.rating;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.feedback.trim()) {
      return "All fields are required.";
    }

    if (!validateEmail(form.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (!validatePhone(form.phone.trim())) {
      return "Please enter a valid 10-digit phone number.";
    }

    if (!form.rating) {
      return "Please select a rating.";
    }

    if (form.feedback.trim().length < 10) {
      return "Feedback must be at least 10 characters long.";
    }

    if (form.feedback.trim().length > 3000) {
      return "Feedback is too long. Keep it under 3000 characters.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    const result = await submitFeedback({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      rating: form.rating,
      feedback: form.feedback.trim(),
    });

    setSubmitting(false);

    if (!result.success) {
      setError(result.error || "Unable to submit feedback right now. Please try again.");
      return;
    }

    setSuccess("Your response has been recorded successfully.");
    setForm(initialForm);
  };

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-24 px-4 relative selection:bg-[#e62b1e]/30">
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[520px] bg-[#e62b1e]/10 blur-[150px] rounded-full pointer-events-none" />

      <section className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 items-start">
        <div className="pt-4 lg:pt-12">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-[#e62b1e]" />
            <span className="text-[#e62b1e] text-[10px] md:text-xs tracking-[0.4em] uppercase font-light">
              TEDxBMU
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-heading uppercase tracking-tight leading-none">
            <span className="text-white">Share Your </span>
            <span className="text-[#e62b1e]">Feedback</span>
          </h1>

          <p className="mt-5 text-white/55 text-sm md:text-base leading-7 max-w-md">
            Share your thoughts about TEDxBMU 2026. We value your feedback.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-8 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.45)]">
          {success ? (
            <div className="min-h-[460px] flex flex-col items-center justify-center text-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#e62b1e]/20 border border-[#e62b1e]/40 flex items-center justify-center">
                <Send className="w-7 h-7 text-[#e62b1e]" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black font-heading uppercase">
                  Thank You!
                </h2>
                <p className="mt-3 text-white/50 text-sm max-w-sm">
                  Thank you for submitting your feedback! Your response has been recorded successfully.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSuccess("")}
                className="mt-3 text-[#e62b1e] text-sm underline underline-offset-4"
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/25 text-red-300 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-white/60 text-xs font-semibold tracking-wide uppercase">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                    placeholder="eg. Mehul Vig"
                    className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#e62b1e]/60 focus:ring-1 focus:ring-[#e62b1e]/50 transition-all"
                    disabled={submitting}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-white/60 text-xs font-semibold tracking-wide uppercase">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(event) => handleChange("phone", event.target.value)}
                    placeholder="eg. +91 987xxxxxxx"
                    className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#e62b1e]/60 focus:ring-1 focus:ring-[#e62b1e]/50 transition-all"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-white/60 text-xs font-semibold tracking-wide uppercase">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  placeholder="eg. mehul@example.com"
                  className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#e62b1e]/60 focus:ring-1 focus:ring-[#e62b1e]/50 transition-all"
                  disabled={submitting}
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-white/60 text-xs font-semibold tracking-wide uppercase">
                  Rating
                </span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleChange("rating", value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      disabled={submitting}
                      className="w-11 h-11 rounded-lg border border-white/10 bg-black/40 flex items-center justify-center transition-all hover:border-[#e62b1e]/60 disabled:opacity-60"
                      aria-label={`${value} star rating`}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          value <= shownRating
                            ? "fill-[#e62b1e] text-[#e62b1e]"
                            : "text-white/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="feedback" className="text-white/60 text-xs font-semibold tracking-wide uppercase">
                  Feedback
                </label>
                <textarea
                  id="feedback"
                  value={form.feedback}
                  onChange={(event) => handleChange("feedback", event.target.value)}
                  placeholder="Tell us what worked well and what we can improve..."
                  rows={8}
                  className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#e62b1e]/60 focus:ring-1 focus:ring-[#e62b1e]/50 transition-all resize-none"
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full bg-[#e62b1e] text-white font-bold tracking-wide uppercase py-4 rounded-lg hover:bg-[#ff3b2e] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(230,43,30,0.32)] hover:shadow-[0_0_36px_rgba(230,43,30,0.48)] disabled:opacity-70 disabled:pointer-events-none"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
