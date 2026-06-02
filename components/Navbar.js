"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiBell, FiSettings, FiX, FiCheckCircle, FiInfo, FiAlertCircle, FiSun, FiMoon, FiMenu, FiUser } from "react-icons/fi";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeContext";
import { useFcm } from "@/hooks/useFcm";
import { useSearch } from "@/components/SearchContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { requestPermission } = useFcm();
  const { searchQuery, setSearchQuery, searchResults } = useSearch();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("default");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-bar")) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    await requestPermission();
    setPermissionStatus(Notification.permission);
  };

  const loadNotifications = () => {
    const history = JSON.parse(localStorage.getItem("notification_history") || "[]");
    setNotifications(history);
  };

  useEffect(() => {
    loadNotifications();
    const handleUpdate = () => loadNotifications();
    window.addEventListener("notification_update", handleUpdate);
    return () => window.removeEventListener("notification_update", handleUpdate);
  }, []);

  const markAsRead = (id) => {
    const history = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem("notification_history", JSON.stringify(history));
    loadNotifications();
  };

  const clearNotifications = () => {
    localStorage.setItem("notification_history", "[]");
    loadNotifications();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="navbar glass">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <FiMenu />
        </button>
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search everything..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
          />

          {showSearchResults && searchQuery.trim() && (
            <div className="search-results-dropdown glass animate-fade-in shadow-xl">
              <div className="search-results-header">
                <span>Search and Navigation</span>
                <button onClick={() => setShowSearchResults(false)}><FiX /></button>
              </div>
              <div className="results-list">
                {searchResults.length > 0 ? (
                  searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      className="result-item"
                      onClick={() => {
                        router.push(result.path);
                        setShowSearchResults(false);
                      }}
                    >
                      <div className={`result-icon ${result.type}`}>
                        {result.type === 'nav' ? <FiMenu /> : <FiUser />}
                      </div>
                      <div className="result-info">
                        <span className="result-name">{result.name}</span>
                        {result.subtitle && <span className="result-subtitle">{result.subtitle}</span>}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="no-results">No results found for "{searchQuery}"</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="navbar-right">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>

        <div className="notification-wrapper">
          <button
            className="navbar-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FiBell />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown glass animate-fade-in">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                {notifications.length > 0 && (
                  <button className="clear-btn" onClick={clearNotifications}>Clear All</button>
                )}
              </div>

              {permissionStatus !== "granted" && (
                <div className="permission-prompt">
                  <p>Enable real-time notifications</p>
                  <button className="enable-btn" onClick={handleEnableNotifications}>
                    Enable
                  </button>
                </div>
              )}

              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div className="empty-notifications">
                    <FiBell className="empty-icon" />
                    <p>No new notifications</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`} onClick={() => markAsRead(n.id)}>
                      <div className="notification-info">
                        <p className="notification-title">{n.title}</p>
                        <p className="notification-body">{n.body}</p>
                        <span className="notification-time">
                          {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {!n.read && <div className="unread-dot" />}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="user-nav">
          <div className="user-avatar">
            {user?.displayName?.[0] || user?.email?.[0] || 'A'}
          </div>
          <div className="user-meta">
            <span className="user-name">{user?.displayName || "Admin"}</span>
            <span className="user-status">Online</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          height: var(--navbar-height);
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          z-index: 900;
          background: var(--card-bg);
          border-bottom: 1px solid var(--card-border);
          transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        :global(.dashboard-wrapper:not(.collapsed)) .navbar {
          left: var(--sidebar-width);
        }

        :global(.dashboard-wrapper.collapsed) .navbar {
          left: var(--sidebar-collapsed-width);
        }

        @media (max-width: 1024px) {
          .navbar {
            left: 0 !important;
            padding: 0 16px;
          }
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .mobile-menu-btn {
          display: none;
          font-size: 1.5rem;
          color: var(--foreground);
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: var(--secondary);
          transition: all 0.2s;
        }

        .mobile-menu-btn:hover {
          background: var(--primary);
          color: #000;
        }

        @media (max-width: 1024px) {
          .mobile-menu-btn {
            display: flex;
          }
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: var(--secondary);
          padding: 8px 16px;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          transition: all 0.2s;
          border: 1px solid transparent;
          position: relative;
        }

        .search-results-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          left: 0;
          right: 0;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          z-index: 1000;
          overflow: hidden;
          max-height: 400px;
          display: flex;
          flex-direction: column;
        }

        .search-results-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--card-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: rgba(255, 255, 255, 0.02);
        }

        .results-list {
          overflow-y: auto;
          padding: 8px;
        }

        .result-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          transition: all 0.2s;
          text-align: left;
          background: transparent;
        }

        .result-item:hover {
          background: var(--secondary);
          transform: translateX(4px);
        }

        .result-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .result-icon.nav {
          background: rgba(234, 179, 8, 0.1);
          color: var(--primary);
        }

        .result-icon.employee {
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
        }

        .result-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .result-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--foreground);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .result-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .no-results {
          padding: 24px;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        @media (max-width: 640px) {
          .search-bar {
            display: none;
          }
        }

        .search-bar:focus-within {
          border-color: var(--primary);
          background: var(--card-bg);
          box-shadow: 0 0 0 4px rgba(234, 179, 8, 0.1);
        }

        .search-icon {
          color: var(--text-muted);
          margin-right: 12px;
          font-size: 1.1rem;
        }

        .search-bar input {
          background: none;
          border: none;
          color: var(--foreground);
          width: 100%;
          font-size: 0.95rem;
          outline: none;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .theme-toggle-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: var(--foreground);
          background: var(--secondary);
          font-size: 1.2rem;
          transition: all 0.2s;
        }

        .theme-toggle-btn:hover {
          background: var(--primary);
          color: #000;
        }

        .navbar-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: var(--foreground);
          position: relative;
          background: var(--secondary);
          font-size: 1.2rem;
          transition: all 0.2s;
        }

        .navbar-btn:hover {
          background: var(--secondary);
          color: var(--primary);
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--error);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid var(--card-bg);
        }

        .notification-wrapper {
          position: relative;
        }

        .notifications-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 320px;
          max-height: 480px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          background: var(--card-bg);
          border-radius: 12px;
          border: 1px solid var(--card-border);
        }

        @media (max-width: 640px) {
          .notifications-dropdown {
            position: fixed;
            top: var(--navbar-height);
            left: 16px;
            right: 16px;
            width: auto;
          }
        }

        .dropdown-header {
          padding: 16px;
          border-bottom: 1px solid var(--card-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dropdown-header h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
        }

        .clear-btn {
          font-size: 0.8rem;
          color: var(--primary);
          font-weight: 600;
        }

        .permission-prompt {
          padding: 12px 16px;
          background: rgba(234, 179, 8, 0.1);
          border-bottom: 1px solid var(--card-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .permission-prompt p {
          font-size: 0.8rem;
          margin: 0;
          color: var(--foreground);
          font-weight: 500;
        }

        .enable-btn {
          background: var(--primary);
          color: #000;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          transition: all 0.2s;
        }

        .enable-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .notifications-list {
          overflow-y: auto;
          flex: 1;
        }

        .empty-notifications {
          padding: 40px 20px;
          text-align: center;
          color: var(--text-muted);
        }

        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
          opacity: 0.3;
        }

        .notification-item {
          padding: 16px;
          border-bottom: 1px solid var(--card-border);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          cursor: pointer;
          transition: background 0.2s;
        }

        .notification-item:hover {
          background: var(--secondary);
        }

        .notification-item.unread {
          background: rgba(234, 179, 8, 0.05);
        }

        .notification-info {
          flex: 1;
        }

        .notification-title {
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 4px;
          color: var(--foreground);
        }

        .notification-body {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 6px;
          line-height: 1.4;
        }

        .notification-time {
          font-size: 0.75rem;
          color: var(--text-muted);
          opacity: 0.7;
        }

        .unread-dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
          margin-left: 12px;
        }

        .user-nav {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-left: 12px;
          border-left: 1px solid var(--card-border);
        }

        @media (max-width: 640px) {
          .user-meta {
            display: none;
          }
          .user-nav {
            border: none;
            padding: 0;
          }
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: var(--primary);
          color: #000;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .user-meta {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--foreground);
          line-height: 1.2;
        }

        .user-status {
          font-size: 0.7rem;
          color: var(--success);
          font-weight: 600;
        }
      `}</style>
    </header>
  );
}
