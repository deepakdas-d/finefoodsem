"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUsers,
  FiClock,
  FiPieChart,
  FiLogOut,
  FiUser
} from "react-icons/fi";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
  { name: "Employees", path: "/dashboard/employees", icon: <FiUsers /> },
  { name: "Attendance", path: "/dashboard/attendance", icon: <FiClock /> },
  { name: "Reports", path: "/dashboard/reports", icon: <FiPieChart /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar glass-dark">
      <div className="logo-container">
        <div className="logo-icon">FF</div>
        <span className="logo-text">FineFoods<small>EM</small></span>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path));
            return (
              <li key={item.path}>
                <Link href={item.path} className={`nav-link ${isActive ? "active" : ""}`}>
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">
            <FiUser />
          </div>
          <div className="user-info">
            <p className="user-name">Admin User</p>
            <p className="user-role">Administrator</p>
          </div>
        </div>
        <Link href="/login" className="logout-btn">
          <FiLogOut />
          <span>Logout</span>
        </Link>
      </div>

      <style jsx>{`
        .sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          z-index: 100;
          background: var(--background);
          border-right: 1px solid var(--card-border);
          transition: all 0.3s ease;
        }

        .logo-container {
          padding: 2.5rem 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          width: 42px;
          height: 42px;
          background: var(--primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: #000;
          font-size: 1.3rem;
          box-shadow: 0 8px 20px rgba(234, 179, 8, 0.2);
        }

        .logo-text {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: var(--foreground);
        }

        .logo-text small {
          color: var(--primary);
          font-size: 0.85rem;
          font-weight: 700;
          margin-left: 2px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0.5rem 1.25rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 1.1rem;
          padding: 1rem 1.25rem;
          margin-bottom: 0.6rem;
          color: var(--text-muted);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 14px;
          font-weight: 500;
        }

        .nav-link:hover {
          background: var(--secondary);
          color: var(--foreground);
          transform: translateX(4px);
        }

        .nav-link.active {
          background: var(--primary);
          color: #000;
          font-weight: 700;
          box-shadow: 0 10px 15px -3px rgba(234, 179, 8, 0.2);
        }

        .nav-icon {
          font-size: 1.5rem;
          display: flex;
          align-items: center;
        }

        .nav-label {
          font-size: 1rem;
        }

        .sidebar-footer {
          padding: 2rem 1.5rem;
          border-top: 1px solid var(--card-border);
          background: rgba(0, 0, 0, 0.02);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 0.5rem;
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          border: 1px solid var(--card-border);
          font-size: 1.4rem;
        }

        .user-name {
          font-size: 1rem;
          font-weight: 700;
          margin: 0;
          color: var(--foreground);
        }

        .user-role {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin: 0;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--text-muted);
          font-size: 1rem;
          padding: 0.9rem 1.25rem;
          border-radius: 14px;
          transition: all 0.3s ease;
          width: 100%;
          font-weight: 600;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
          transform: translateY(-2px);
        }
      `}</style>
    </aside>
  );
}
