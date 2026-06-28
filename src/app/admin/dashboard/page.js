"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminStats, downloadExcel } from "@/lib/api";
import { Users, UserCheck, Download, Loader2, ArrowRight, MessageSquareText } from "lucide-react";
import Link from "next/link";

function StatCard({ title, value, icon: Icon, color, delay }) {
  return (
    <div 
      className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group animate-in slide-in-from-bottom flex flex-col items-center justify-center text-center"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40`} style={{ backgroundColor: color }} />
      <div className="flex flex-col items-center gap-4 relative z-10 w-full">
        <div className="p-3 rounded-xl bg-white/5" style={{ color: color }}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-white/50 text-xs font-semibold tracking-[0.2em] uppercase mb-1">{title}</h3>
          <p className="text-4xl lg:text-5xl font-black font-heading" style={{ color: color }}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingRegex, setDownloadingRegex] = useState(false);
  const [downloadingAttend, setDownloadingAttend] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.replace("/admin/login");
        return;
      }
      const result = await getAdminStats(token);
      
      if (result.success) {
        setStats(result.data);
      } else {
        // Token is invalid or expired — clear it and redirect to login
        if (result.status === 401 || result.status === 403) {
          localStorage.removeItem("adminToken");
          router.replace("/admin/login");
          return;
        }
        setError(result.error || "Failed to load stats");
      }
    } catch (err) {
      setError("Network error loading stats");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (endpoint, filename, setDownloadState) => {
    setDownloadState(true);
    const token = localStorage.getItem("adminToken");
    
    const result = await downloadExcel(endpoint, token, filename);
    
    if (!result.success) {
      alert("Failed to download file: " + result.error);
    }
    setDownloadState(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-[#e62b1e] animate-spin" />
        <p className="text-white/50 text-xs tracking-widest uppercase font-semibold">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-xl text-center max-w-sm">
          <p className="mb-4">{error}</p>
          <button 
            onClick={fetchStats}
            className="text-white text-xs tracking-widest uppercase bg-white/10 px-6 py-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8 md:gap-12 pb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black font-heading uppercase tracking-tight mb-2">
            Overview <span className="text-[#e62b1e]">Statistics</span>
          </h1>
          <p className="text-white/50 text-sm">Real-time tracker for event registrations and attendance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Total Registrations" 
          value={stats?.total_registrations || 0} 
          icon={Users} 
          color="#ffffff" 
          delay={0}
        />
        <StatCard 
          title="Attended" 
          value={stats?.total_attended || 0} 
          icon={UserCheck} 
          color="#10b981" 
          delay={100}
        />
        <StatCard 
          title="Remaining" 
          value={stats?.total_remaining || 0} 
          icon={Users} 
          color="#f59e0b" 
          delay={200}
        />
        <StatCard 
          title="Turnout" 
          value={`${stats?.attendance_percentage || 0}%`} 
          icon={UserCheck} 
          color="#e62b1e" 
          delay={300}
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
              <MessageSquareText className="w-5 h-5 text-[#e62b1e]" />
              Feedback Submissions
            </h2>
            <p className="text-white/40 text-sm mt-1">
              {stats?.total_feedback || 0} entries stored with ratings, comments, and certificate status.
            </p>
          </div>
          <Link
            href="/admin/feedback"
            className="inline-flex items-center justify-center gap-2 bg-[#e62b1e] text-white py-3 px-5 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-[#ff3b2e] transition-colors"
          >
            View All Feedback
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:mt-4">
        {/* Quick Actions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col">
          <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Data Exports</h2>
          
          <div className="flex flex-col gap-4 mt-auto">
            <button 
              onClick={() => handleDownload("/api/admin/download/registered", "Registered_Users.xlsx", setDownloadingRegex)}
              disabled={downloadingRegex}
              className="bg-white/5 border border-white/10 hover:bg-white/10 p-5 rounded-xl flex items-center justify-between transition-colors group text-left w-full"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-2.5 rounded-lg text-white group-hover:bg-white transition-colors group-hover:text-black">
                  {downloadingRegex ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-semibold text-sm tracking-wide text-white">All Registered Users</h3>
                  <p className="text-white/40 text-xs mt-0.5">Download full roster as Excel (.xlsx)</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => handleDownload("/api/admin/download/attended", "Attended_Users.xlsx", setDownloadingAttend)}
              disabled={downloadingAttend}
              className="bg-white/5 border border-white/10 hover:bg-white/10 p-5 rounded-xl flex items-center justify-between transition-colors group text-left w-full"
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#10b981]/20 p-2.5 rounded-lg text-[#10b981] group-hover:bg-[#10b981] transition-colors group-hover:text-black">
                  {downloadingAttend ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-semibold text-sm tracking-wide text-white">Attended Users Only</h3>
                  <p className="text-white/40 text-xs mt-0.5">Download filtered roster as Excel (.xlsx)</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Scanner CTA */}
        <div className="relative bg-[#e62b1e]/10 border border-[#e62b1e]/30 rounded-2xl p-6 md:p-8 flex flex-col overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#e62b1e] rounded-full blur-[100px] opacity-20 pointer-events-none" />
          
          <div className="relative z-10 h-full flex flex-col">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-2 text-[#e62b1e]">QR Code Operations</h2>
            <p className="text-white/60 text-sm mb-8">Scan attendee QR codes at the venue entrance to securely mark them as attended in real-time.</p>
            
            <div className="mt-auto">
              <Link
                href="/admin/scanner"
                className="bg-[#e62b1e] text-white py-4 px-6 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-[#ff3b2e] active:scale-[0.98] transition-all flex items-center justify-between group shadow-[0_0_20px_rgba(230,43,30,0.3)] w-full"
              >
                Launch Scanner
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
