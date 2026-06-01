"use client";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }) {
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
