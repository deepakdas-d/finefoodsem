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
          border-right: 1px solid var(--card-border);
          border-radius: 0;
        }

        .logo-container {
          padding: 2rem 1.5rem;
          display: flex;
          items-center: center;
          gap: 0.75rem;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: white;
          font-size: 1.1rem;
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .logo-text small {
          color: var(--primary);
          font-size: 0.7rem;
          font-weight: 400;
          margin-left: 1px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          margin: 0.25rem 0.75rem;
          color: var(--text-muted);
          transition: all 0.3s ease;
          border-radius: 10px;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--foreground);
        }

        .nav-link.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .nav-icon {
          font-size: 1.25rem;
          display: flex;
          align-items: center;
        }

        .nav-label {
          font-size: 0.95rem;
          font-weight: 500;
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--card-border);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          border: 1px solid var(--card-border);
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0;
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin: 0;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-muted);
          font-size: 0.9rem;
          padding: 0.5rem;
          transition: color 0.3s ease;
        }

        .logout-btn:hover {
          color: var(--error);
        }
      `}</style>
        </aside>
    );
}
