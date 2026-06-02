"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiUsers,
  FiClock,
  FiPieChart,
  FiSettings,
  FiLogOut,
  FiUser,
  FiChevronDown,
  FiChevronRight,
  FiMenu,
  FiX,
  FiList,
  FiPlusSquare,
  FiCalendar,
  FiFileText
} from "react-icons/fi";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FiHome />
  },
  {
    name: "Employees",
    path: "/dashboard/employees",
    icon: <FiUsers />,
    submenu: [
      { name: "Employee List", path: "/dashboard/employees", icon: <FiList /> },
      { name: "Add Employee", path: "/dashboard/employees/add", icon: <FiPlusSquare /> },
    ]
  },
  {
    name: "Attendance",
    path: "/dashboard/attendance",
    icon: <FiClock />,
    submenu: [
      { name: "Daily Attendance", path: "/dashboard/attendance/add", icon: <FiCalendar /> },
      { name: "Attendance History", path: "/dashboard/attendance", icon: <FiList /> },
    ]
  },
  {
    name: "Reports",
    path: "/dashboard/reports",
    icon: <FiPieChart />,
    submenu: [
      { name: "Employee Reports", path: "/dashboard/reports/employees", icon: <FiFileText /> },
      { name: "Attendance Reports", path: "/dashboard/reports/attendance", icon: <FiFileText /> },
    ]
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: <FiSettings />
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Auto-expand parents based on pathname
  useEffect(() => {
    const newExpanded = { ...expandedItems };
    menuItems.forEach(item => {
      if (item.submenu) {
        const isChildActive = item.submenu.some(sub => pathname === sub.path);
        if (isChildActive) {
          newExpanded[item.name] = true;
        }
      }
    });
    setExpandedItems(newExpanded);
  }, [pathname]);

  const toggleSubmenu = (name) => {
    setExpandedItems(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button className="mobile-toggle" onClick={toggleSidebar}>
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-image-wrapper">
              <Image
                src="/logo.png"
                alt="FineFoods Logo"
                width={44}
                height={44}
                className="logo-img"
              />
            </div>
            <div className="logo-text-group">
              <span className="logo-text">FineFoods</span>
              <span className="logo-tagline">Management System</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="menu-list">
            {menuItems.map((item) => {
              const hasSubmenu = !!item.submenu;
              const isExpanded = expandedItems[item.name];
              const isActive = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path));

              return (
                <li key={item.name} className="menu-item-container">
                  {hasSubmenu ? (
                    <div
                      className={`nav-link ${isActive ? "active-parent" : ""}`}
                      onClick={() => toggleSubmenu(item.name)}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.name}</span>
                      <span className="submenu-arrow">
                        {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                      </span>
                    </div>
                  ) : (
                    <Link href={item.path} className={`nav-link ${isActive ? "active" : ""}`} onClick={() => setIsOpen(false)}>
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.name}</span>
                    </Link>
                  )}

                  {hasSubmenu && isExpanded && (
                    <ul className="submenu-list">
                      {item.submenu.map((sub) => {
                        const isSubActive = pathname === sub.path;
                        return (
                          <li key={sub.path}>
                            <Link
                              href={sub.path}
                              className={`sub-link ${isSubActive ? "active" : ""}`}
                              onClick={() => setIsOpen(false)}
                            >
                              <span className="sub-icon">{sub.icon}</span>
                              <span className="sub-label">{sub.name}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-mini">
            <div className="avatar">
              <FiUser />
            </div>
            <div className="user-info">
              <p className="user-name">{user?.displayName || "Admin User"}</p>
              <p className="user-role">{user?.email || "Administrator"}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut />
            <span>Logout</span>
          </button>
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
            z-index: 1000;
            background: var(--card-bg);
            border-right: 1px solid var(--card-border);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .sidebar-header {
            padding: 2rem 1.5rem;
            border-bottom: 1px solid var(--card-border);
            margin-bottom: 1rem;
          }

          .logo-container {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .logo-image-wrapper {
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            overflow: hidden;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(234, 179, 8, 0.2);
          }

          .logo-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .logo-text-group {
            display: flex;
            flex-direction: column;
          }

          .logo-text {
            font-size: 1.25rem;
            font-weight: 800;
            color: var(--foreground);
            line-height: 1;
            letter-spacing: -0.5px;
          }

          .logo-tagline {
            font-size: 0.75rem;
            color: var(--text-muted);
            font-weight: 500;
            margin-top: 2px;
          }

          .sidebar-nav {
            flex: 1;
            overflow-y: auto;
            padding: 0 1rem;
          }

          .sidebar-nav::-webkit-scrollbar {
            width: 4px;
          }

          .menu-list {
            padding: 0;
            margin: 0;
          }

          .menu-item-container {
            margin-bottom: 4px;
          }

          .nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            color: var(--text-muted);
            border-radius: 10px;
            transition: all 0.2s ease;
            cursor: pointer;
            font-weight: 500;
          }

          .nav-link:hover {
            background: var(--secondary);
            color: var(--foreground);
          }

          .nav-link.active, .nav-link.active-parent {
            background: var(--primary);
            color: #000;
            font-weight: 600;
          }

          .nav-icon {
            font-size: 1.25rem;
            display: flex;
            align-items: center;
          }

          .nav-label {
            flex: 1;
            font-size: 0.95rem;
          }

          .submenu-arrow {
            font-size: 0.8rem;
            opacity: 0.7;
          }

          .submenu-list {
            padding-left: 20px;
            margin: 4px 0 8px 0;
            border-left: 1px dashed var(--card-border);
            margin-left: 26px;
          }

          .sub-link {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 16px;
            color: var(--text-muted);
            font-size: 0.875rem;
            border-radius: 8px;
            transition: all 0.2s ease;
          }

          .sub-link:hover {
            color: var(--foreground);
            background: var(--secondary);
          }

          .sub-link.active {
            color: var(--primary);
            font-weight: 600;
          }

          .sub-icon {
            font-size: 1rem;
          }

          .sidebar-footer {
            padding: 1.5rem;
            border-top: 1px solid var(--card-border);
            background: rgba(0,0,0,0.02);
          }

          .user-profile-mini {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 1.25rem;
          }

          .avatar {
            width: 38px;
            height: 38px;
            background: var(--secondary);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary);
            font-size: 1.2rem;
            border: 1px solid var(--card-border);
          }

          .user-name {
            font-size: 0.9rem;
            font-weight: 700;
            color: var(--foreground);
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
            gap: 10px;
            padding: 10px 16px;
            color: var(--error);
            border-radius: 10px;
            font-size: 0.9rem;
            font-weight: 600;
            transition: all 0.2s ease;
          }

          .logout-btn:hover {
            background: rgba(239, 68, 68, 0.1);
          }

          .mobile-toggle {
            display: none;
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 2000;
            width: 40px;
            height: 40px;
            background: var(--primary);
            color: #000;
            border-radius: 8px;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          @media (max-width: 1024px) {
            .sidebar {
              transform: translateX(-100%);
            }
            .sidebar.open {
              transform: translateX(0);
            }
            .mobile-toggle {
              display: flex;
            }
          }
        `}</style>
      </aside>

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
            backdropFilter: "blur(4px)"
          }}
        />
      )}
    </>
  );
}
