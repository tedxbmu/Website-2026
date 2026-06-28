"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard, ScanLine, MessageSquareText } from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("adminToken");
    
    if (!token && pathname !== "/admin/login") {
      router.push("/admin/login");
    } else if (token) {
      setIsAuthenticated(true);
      if (pathname === "/admin" || pathname === "/admin/login") {
        router.push("/admin/dashboard");
      }
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    router.push("/admin/login");
  };

  // Prevent hydration mismatch flashes
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#e62b1e]/30 flex flex-col pt-24 md:pt-32">
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#e62b1e]/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Admin Navbar */}
      {isAuthenticated && (
        <header className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-xl border-b border-white/10 mt-16 md:mt-0 pt-4 md:pt-0">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin/dashboard" className="text-white font-black tracking-tight text-xl uppercase">
                <span className="text-[#e62b1e]">Admin</span>Portal
              </Link>
              <nav className="hidden md:flex items-center gap-4">
                <Link 
                  href="/admin/dashboard" 
                  className={`text-sm tracking-widest uppercase font-semibold transition-colors flex items-center gap-2 ${pathname === "/admin/dashboard" ? "text-[#e62b1e]" : "text-white/60 hover:text-white"}`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link 
                  href="/admin/scanner" 
                  className={`text-sm tracking-widest uppercase font-semibold transition-colors flex items-center gap-2 ${pathname === "/admin/scanner" ? "text-[#e62b1e]" : "text-white/60 hover:text-white"}`}
                >
                  <ScanLine className="w-4 h-4" />
                  Scanner
                </Link>
                <Link 
                  href="/admin/feedback" 
                  className={`text-sm tracking-widest uppercase font-semibold transition-colors flex items-center gap-2 ${pathname === "/admin/feedback" ? "text-[#e62b1e]" : "text-white/60 hover:text-white"}`}
                >
                  <MessageSquareText className="w-4 h-4" />
                  Feedback
                </Link>
              </nav>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-white/60 hover:text-[#e62b1e] text-sm tracking-widest uppercase font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
          {/* Mobile bottom nav equivalent could go here if needed */}
        </header>
      )}

      {/* Mobile-only secondary nav if authenticated */}
      {isAuthenticated && (
        <div className="md:hidden flex border-b border-white/10 mt-16 bg-black z-30 relative px-4 text-xs font-semibold tracking-widest uppercase">
          <Link 
            href="/admin/dashboard" 
            className={`flex-1 py-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${pathname === "/admin/dashboard" ? "border-[#e62b1e] text-[#e62b1e]" : "border-transparent text-white/50"}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link 
            href="/admin/scanner" 
            className={`flex-1 py-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${pathname === "/admin/scanner" ? "border-[#e62b1e] text-[#e62b1e]" : "border-transparent text-white/50"}`}
          >
            <ScanLine className="w-4 h-4" />
            Scanner
          </Link>
          <Link 
            href="/admin/feedback" 
            className={`flex-1 py-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${pathname === "/admin/feedback" ? "border-[#e62b1e] text-[#e62b1e]" : "border-transparent text-white/50"}`}
          >
            <MessageSquareText className="w-4 h-4" />
            Feedback
          </Link>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 relative z-10 p-6 md:p-8 w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
