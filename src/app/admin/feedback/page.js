"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminFeedback } from "@/lib/api";
import { ChevronLeft, ChevronRight, Loader2, MessageSquareText } from "lucide-react";

const PAGE_SIZE = 10;

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={index < rating ? "text-[#e62b1e]" : "text-white/20"}
        >
          ★
        </span>
      ))}
      <span className="text-white/50 text-xs ml-1">({rating}/5)</span>
    </div>
  );
}

function CertificateBadge({ sent }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide uppercase ${
        sent
          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
          : "bg-red-500/15 text-red-400 border border-red-500/20"
      }`}
    >
      {sent ? "Sent" : "Failed"}
    </span>
  );
}

export default function AdminFeedbackPage() {
  const router = useRouter();
  const [feedbackRows, setFeedbackRows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedback = useCallback(async (requestedPage = 1) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.replace("/admin/login");
        return;
      }

      const result = await getAdminFeedback(token, {
        page: requestedPage,
        limit: PAGE_SIZE,
      });

      if (!result.success) {
        if (result.status === 401 || result.status === 403) {
          localStorage.removeItem("adminToken");
          router.replace("/admin/login");
          return;
        }
        setError(result.error || "Failed to load feedback");
        return;
      }

      setFeedbackRows(result.data.feedback || []);
      setPage(result.data.page || requestedPage);
      setTotalPages(result.data.total_pages || 1);
      setTotalFeedback(result.data.total_feedback || 0);
    } catch {
      setError("Network error loading feedback");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchFeedback(page);
  }, [fetchFeedback, page]);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    setPage(nextPage);
  };

  if (loading && feedbackRows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-[#e62b1e] animate-spin" />
        <p className="text-white/50 text-xs tracking-widest uppercase font-semibold">
          Loading Feedback...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-xl text-center max-w-sm">
          <p className="mb-4">{error}</p>
          <button
            onClick={() => fetchFeedback(page)}
            className="text-white text-xs tracking-widest uppercase bg-white/10 px-6 py-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8 pb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black font-heading uppercase tracking-tight mb-2">
            Feedback <span className="text-[#e62b1e]">Submissions</span>
          </h1>
          <p className="text-white/50 text-sm">
            All OC feedback entries stored in Supabase with certificate delivery status.
          </p>
        </div>
        <div className="text-white/50 text-xs tracking-widest uppercase font-semibold">
          {totalFeedback} total records
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
          <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-[#e62b1e]" />
            Submission Log
          </h2>
          <div className="text-white/40 text-sm">
            Page {page} of {totalPages}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-white/60 uppercase tracking-widest text-xs">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Rating</th>
                <th className="px-4 py-3 font-semibold">Feedback</th>
                <th className="px-4 py-3 font-semibold">Recipient</th>
                <th className="px-4 py-3 font-semibold">Certificate</th>
                <th className="px-4 py-3 font-semibold">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {feedbackRows.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-white/40 text-center" colSpan={8}>
                    No feedback submissions found yet.
                  </td>
                </tr>
              ) : (
                feedbackRows.map((row) => (
                  <tr
                    key={row.id || `${row.email}-${row.created_at}`}
                    className="border-t border-white/10 align-top hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-4 text-white whitespace-nowrap">{row.name || "-"}</td>
                    <td className="px-4 py-4 text-white/70">{row.email || "-"}</td>
                    <td className="px-4 py-4 text-white/70 whitespace-nowrap">{row.phone || "-"}</td>
                    <td className="px-4 py-4">
                      <RatingStars rating={Number(row.rating) || 0} />
                    </td>
                    <td className="px-4 py-4 text-white/70 max-w-sm">
                      <p className="whitespace-pre-wrap break-words">{row.feedback || "-"}</p>
                    </td>
                    <td className="px-4 py-4 text-white/70">
                      <div className="font-medium text-white">{row.recipient_name || "-"}</div>
                      <div className="text-white/40 text-xs mt-1">{row.recipient_role || "-"}</div>
                      <div className="text-white/30 text-xs mt-1 capitalize">
                        matched by {row.match_type || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <CertificateBadge sent={row.certificate_sent} />
                    </td>
                    <td className="px-4 py-4 text-white/50 whitespace-nowrap">
                      {row.created_at
                        ? new Date(row.created_at).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                          })
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-white/10">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm font-semibold tracking-wide uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                const isActive = pageNumber === page;

                if (
                  totalPages > 7 &&
                  pageNumber !== 1 &&
                  pageNumber !== totalPages &&
                  Math.abs(pageNumber - page) > 1
                ) {
                  if (pageNumber === 2 || pageNumber === totalPages - 1) {
                    return (
                      <span key={pageNumber} className="text-white/30 px-1">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={loading}
                    className={`min-w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-[#e62b1e] text-white"
                        : "border border-white/10 text-white/60 hover:bg-white/5"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages || loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm font-semibold tracking-wide uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
