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
  FiFileText,
  FiChevronsLeft,
  FiChevronsRight,
  FiBell
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

  },
  // {
  //   name: "Settings",
  //   path: "/dashboard/settings",
  //   icon: <FiSettings />
  // },
];

export default function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
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
    if (isCollapsed) return; // Don't expand if collapsed
    const newExpanded = {};
    menuItems.forEach(item => {
      if (item.submenu) {
        const isChildActive = item.submenu.some(sub => pathname === sub.path);
        if (isChildActive) {
          newExpanded[item.name] = true;
        }
      }
    });
    setExpandedItems(newExpanded);
  }, [pathname, isCollapsed]);

  const toggleSubmenu = (name) => {
    if (isCollapsed) return;
    setExpandedItems(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <>
      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isMobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-image-wrapper">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="logo-img"
              />
            </div>
            {!isCollapsed && (
              <div className="logo-text-group">
                <span className="logo-text">FineFoods</span>
                <span className="logo-tagline">Management</span>
              </div>
            )}
          </div>
          <button className="collapse-toggle-desktop" onClick={onToggleCollapse} aria-label="Toggle Sidebar">
            {isCollapsed ? <FiChevronsRight /> : <FiChevronsLeft />}
          </button>
          <button className="mobile-close" onClick={onCloseMobile} aria-label="Close Menu">
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            {!isCollapsed && <p className="section-label">Main Menu</p>}
            <ul className="menu-list">
              {menuItems.map((item) => {
                const hasSubmenu = !!item.submenu;
                const isExpanded = expandedItems[item.name];
                const isActive = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path));

                return (
                  <li key={item.name} className="menu-item-outer">
                    {hasSubmenu ? (
                      <div
                        className={`nav-link ${isActive ? "active-parent" : ""} ${isCollapsed ? "centered" : ""}`}
                        onClick={() => toggleSubmenu(item.name)}
                        title={isCollapsed ? item.name : ""}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        {!isCollapsed && <span className="nav-label">{item.name}</span>}
                        {!isCollapsed && (
                          <span className={`submenu-arrow ${isExpanded ? "rotated" : ""}`}>
                            <FiChevronRight />
                          </span>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.path}
                        className={`nav-link ${isActive ? "active" : ""} ${isCollapsed ? "centered" : ""}`}
                        onClick={onCloseMobile}
                        title={isCollapsed ? item.name : ""}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        {!isCollapsed && <span className="nav-label">{item.name}</span>}
                      </Link>
                    )}

                    {hasSubmenu && isExpanded && !isCollapsed && (
                      <ul className="submenu-list">
                        {item.submenu.map((sub) => {
                          const isSubActive = pathname === sub.path;
                          return (
                            <li key={sub.path}>
                              <Link
                                href={sub.path}
                                className={`sub-link ${isSubActive ? "active" : ""}`}
                                onClick={onCloseMobile}
                              >
                                <span className={`sub-indicator ${isSubActive ? "active" : ""}`} />
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
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className={`user-card ${isCollapsed ? "collapsed" : ""}`}>
            <div className="user-profile-info">
              <div className="avatar-wrapper">
                <div className="avatar">
                  {user?.photoURL ? (
                    <Image src={user.photoURL} alt="User" width={32} height={32} />
                  ) : (
                    <FiUser />
                  )}
                </div>
                <span className="status-indicator"></span>
              </div>
              {!isCollapsed && (
                <div className="user-details">
                  <p className="user-name">{user?.displayName || "Admin User"}</p>
                  <p className="user-role">Administrator</p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button onClick={handleLogout} className="logout-btn-premium" title="Logout">
                <FiLogOut />
              </button>
            )}
          </div>

          {isCollapsed && (
            <button onClick={handleLogout} className="logout-btn-collapsed" title="Logout">
              <FiLogOut />
            </button>
          )}
        </div>
      </aside>

      {isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={onCloseMobile}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 999,
            backdropFilter: "blur(8px)",
            animation: "fadeIn 0.4s ease"
          }}
        />
      )}

      <style jsx>{`
          .sidebar {
            width: 280px;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            display: flex;
            flex-direction: column;
            z-index: 1000;
            background: var(--card-bg);
            border-right: 1px solid var(--card-border);
            transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1), transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.05);
            overflow-x: hidden;
          }

          .sidebar.collapsed {
            width: 88px;
          }

          .sidebar-header {
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 1.5rem;
            margin-bottom: 0.5rem;
            position: relative;
          }

          .sidebar.collapsed .sidebar-header {
            padding: 0;
            justify-content: center;
          }

          .sidebar.collapsed .logo-container {
            gap: 0;
            justify-content: center;
          }

          .logo-container {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .logo-image-wrapper {
            width: 42px;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            background: linear-gradient(135deg, var(--primary) 0%, #f59e0b 100%);
            box-shadow: 0 4px 12px rgba(234, 179, 8, 0.3);
            padding: 8px;
          }

          .logo-img {
            filter: brightness(0) invert(1);
          }

          .logo-text-group {
            display: flex;
            flex-direction: column;
          }

          .logo-text {
            font-size: 1.15rem;
            font-weight: 800;
            color: var(--foreground);
            letter-spacing: -0.5px;
            line-height: 1.1;
          }

          .logo-tagline {
            font-size: 0.7rem;
            color: var(--text-muted);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .collapse-toggle-desktop {
            color: var(--text-muted);
            font-size: 1.25rem;
            padding: 8px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            background: transparent;
            border: 1px solid transparent;
          }

          .collapse-toggle-desktop:hover {
            background: var(--secondary);
            color: var(--primary);
            border-color: var(--card-border);
          }

          .sidebar.collapsed .collapse-toggle-desktop {
            position: absolute;
            right: -12px;
            top: 50%;
            transform: translateY(-50%);
            background: var(--primary);
            color: #000;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            font-size: 0.9rem;
            box-shadow: 0 2px 8px rgba(234, 179, 8, 0.4);
            border: 2px solid var(--card-bg);
            z-index: 10;
            padding: 0;
            opacity: 0;
          }

          .sidebar:hover .collapse-toggle-desktop {
            opacity: 1;
          }

          .mobile-close {
            display: none;
          }

          .sidebar-nav {
            flex: 1;
            overflow-y: auto;
            padding: 0.5rem 1rem;
            scrollbar-width: thin;
            scrollbar-color: var(--card-border) transparent;
          }

          .sidebar-nav::-webkit-scrollbar {
            width: 5px;
          }

          .sidebar-nav::-webkit-scrollbar-thumb {
            background-color: var(--card-border);
            border-radius: 10px;
          }

          .nav-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .section-label {
            font-size: 0.7rem;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 1.5px;
            padding: 0 0.75rem;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
          }

          .menu-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .nav-link {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 14px 18px;
            color: var(--text-muted);
            border-radius: 12px;
            transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
            cursor: pointer;
            font-weight: 500;
            text-decoration: none;
            position: relative;
            overflow: hidden;
            margin: 0 4px;
            border: 1px solid transparent;
          }

          .nav-link:hover {
            color: var(--foreground);
            background: var(--secondary);
            border-color: var(--card-border);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }

          .nav-link.active, .nav-link.active-parent {
            background: var(--primary);
            color: #000;
            font-weight: 700;
            box-shadow: 0 8px 16px rgba(234, 179, 8, 0.25);
            border-color: var(--primary);
          }

          .nav-link.active .nav-icon, .nav-link.active-parent .nav-icon {
            color: #000;
          }

          .nav-link.centered {
            justify-content: center;
            padding: 16px;
            margin: 0 -4px;
            gap: 0;
          }

          .nav-icon {
            font-size: 1.35rem;
            display: flex;
            align-items: center;
            transition: transform 0.3s ease;
          }

          .nav-link:hover .nav-icon {
            transform: scale(1.1);
          }

          .nav-label {
            flex: 1;
            font-size: 0.95rem;
            white-space: nowrap;
            opacity: 1;
            transition: opacity 0.2s ease;
          }

          .sidebar.collapsed .nav-label {
            display: none;
          }

          .submenu-arrow {
            font-size: 0.9rem;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0.6;
          }

          .submenu-arrow.rotated {
            transform: rotate(90deg);
          }

          .submenu-list {
            margin: 8px 0 12px 24px;
            padding-left: 20px;
            border-left: 2px solid var(--card-border);
            display: flex;
            flex-direction: column;
            gap: 8px;
            animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .sub-link {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 12px 16px;
            color: var(--text-muted);
            font-size: 0.9rem;
            border-radius: 10px;
            transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
            text-decoration: none;
            position: relative;
            border: 1px solid transparent;
            margin-right: 4px;
          }

          .sub-indicator {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--card-border);
            transition: all 0.3s ease;
          }

          .sub-indicator.active {
            background: var(--primary);
            box-shadow: 0 0 10px var(--primary);
            transform: scale(1.2);
          }

          .sub-link:hover {
            color: var(--foreground);
            background: var(--secondary);
          }

          .sub-link.active {
            color: var(--foreground);
            font-weight: 600;
            background: var(--secondary);
          }

          .sidebar-footer {
            padding: 1.25rem 1rem;
            border-top: 1px solid var(--card-border);
            background: linear-gradient(to top, var(--card-bg) 80%, transparent);
          }

          .user-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px;
            background: var(--secondary);
            border-radius: 16px;
            border: 1px solid var(--card-border);
            transition: all 0.3s ease;
          }

          .user-card.collapsed {
            background: transparent;
            border: none;
            padding: 0;
            justify-content: center;
            display: flex;
          }

          .user-profile-info {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .avatar-wrapper {
            position: relative;
          }

          .avatar {
            width: 40px;
            height: 40px;
            background: var(--card-bg);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary);
            font-size: 1.25rem;
            border: 1px solid var(--card-border);
            flex-shrink: 0;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }

          .status-indicator {
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 12px;
            height: 12px;
            background: #10b981;
            border: 2px solid var(--secondary);
            border-radius: 50%;
          }

          .user-details {
            overflow: hidden;
            max-width: 110px;
          }

          .user-name {
            font-size: 0.9rem;
            font-weight: 700;
            color: var(--foreground);
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .user-role {
            font-size: 0.75rem;
            color: var(--text-muted);
            margin: 0;
            font-weight: 500;
          }

          .logout-btn-premium {
            background: var(--card-bg);
            color: var(--error);
            border: 1px solid var(--card-border);
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .logout-btn-premium:hover {
            background: var(--error);
            color: white;
            border-color: var(--error);
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
          }

          .logout-btn-collapsed {
             width: 48px;
             height: 48px;
             border-radius: 14px;
             background: var(--secondary);
             color: var(--error);
             display: flex;
             align-items: center;
             justify-content: center;
             font-size: 1.4rem;
             margin: 8px auto 0;
             transition: all 0.2s;
             border: 1px solid var(--card-border);
          }

          .logout-btn-collapsed:hover {
             background: var(--error);
             color: white;
             border-color: var(--error);
          }

          @media (max-width: 1024px) {
            .sidebar {
              transform: translateX(-100%);
              width: 300px !important;
              box-shadow: 20px 0 50px rgba(0,0,0,0.2);
            }
            .sidebar.mobile-open {
              transform: translateX(0);
            }
            .sidebar.collapsed {
              width: 300px !important;
            }
            .collapse-toggle-desktop {
              display: none;
            }
            .mobile-close {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 36px;
              height: 36px;
              border-radius: 10px;
              background: var(--secondary);
              color: var(--foreground);
              border: 1px solid var(--card-border);
            }
          }

        `}</style>
    </>
  );
}
