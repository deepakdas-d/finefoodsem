"use client";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Listen for custom trigger to toggle sidebar from navbar if needed
    const handleToggle = () => setIsMobileOpen(prev => !prev);
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  useEffect(() => {
    // Only redirect if we are mounted, not loading, no user is found
    if (mounted && !loading && !user) {
      router.replace("/login");
    }
  }, [mounted, user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#020617] text-[#facc15]">
        <div className="animate-pulse">Verifying Authentication...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={`dashboard-wrapper ${isSidebarCollapsed ? "collapsed" : ""} ${isMobileOpen ? "mobile-open" : ""}`}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />
      <div className="main-content">
        <Navbar onMenuClick={() => setIsMobileOpen(true)} />
        <main className="page-content animate-fade-in">
          {children}
        </main>
      </div>

      <style jsx global>{`
        .dashboard-wrapper {
          display: flex;
          min-height: 100vh;
          background: var(--background);
        }

        .main-content {
          flex: 1;
          margin-left: var(--sidebar-width);
          padding: 24px;
          padding-top: calc(var(--navbar-height) + 32px);
          min-height: 100vh;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
        }

        .dashboard-wrapper.collapsed .main-content {
          margin-left: var(--sidebar-collapsed-width);
        }

        .page-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .main-content {
            margin-left: 0 !important;
            padding: 16px;
            padding-top: calc(var(--navbar-height) + 24px);
          }
        }
      `}</style>
    </div>
  );
}
