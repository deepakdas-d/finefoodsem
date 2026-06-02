"use client";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only redirect if we are mounted, not loading, no user is found
    if (mounted && !loading && !user) {
      router.replace("/login");
    }
  }, [mounted, user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111] text-[#ffd700]">
        <div className="animate-pulse">Verifying Authentication...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-content animate-fade-in">
          {children}
        </main>
      </div>

      <style jsx global>{`
        .dashboard-wrapper {
          display: flex;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
          margin-left: var(--sidebar-width);
          padding: 20px;
          padding-top: calc(var(--navbar-height) + 40px);
          min-height: 100vh;
          position: relative;
        }

        .page-content {
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}
