"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiBell, FiSettings, FiX, FiCheckCircle, FiInfo, FiAlertCircle } from "react-icons/fi";
import { useFcm } from "@/hooks/useFcm";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const { requestPermission } = useFcm();

  const loadNotifications = () => {
    const history = JSON.parse(localStorage.getItem("notification_history") || "[]");
    setNotifications(history);
  };

  useEffect(() => {
    loadNotifications();
    window.addEventListener("notification_update", loadNotifications);
    return () => window.removeEventListener("notification_update", loadNotifications);
  }, []);

  const markAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem("notification_history", JSON.stringify(updated));
    setNotifications(updated);
  };

  const clearNotifications = () => {
    localStorage.setItem("notification_history", "[]");
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="navbar glass">
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search employees, reports..." />
      </div>

      <div className="navbar-actions">
        <button
          className={`action-btn ${showNotifications ? "active" : ""}`}
          onClick={() => {
            setShowNotifications(!showNotifications);
            if (!showNotifications) markAsRead();
          }}
        >
          <FiBell />
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </button>
        <button className="action-btn">
          <FiSettings />
        </button>
        <div className="divider"></div>
        <div className="profile-preview">
          <img
            src={`https://ui-avatars.com/api/?name=${user?.email || "Admin+User"}&background=fbbf24&color=000`}
            alt="Profile"
            className="navbar-avatar"
          />
        </div>
      </div>

      {showNotifications && (
        <div className="notifications-panel glass animate-fade-in">
          <div className="panel-header">
            <div className="header-title-group">
              <h4>Notifications</h4>
              {notifications.length > 0 && (
                <button className="clear-btn" onClick={clearNotifications}>Clear All</button>
              )}
            </div>
            <button className="close-btn" onClick={() => setShowNotifications(false)}><FiX /></button>
          </div>
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="empty-state">
                <FiBell className="empty-icon" />
                <p>No notifications yet</p>
                <button className="enable-btn" onClick={requestPermission}>
                  Enable Desktop Notifications
                </button>
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className={`notification-item ${notif.read ? "" : "unread"}`}>
                  <div className="notif-icon info">
                    <FiInfo />
                  </div>
                  <div className="notif-content">
                    <p className="notif-text">{notif.title}</p>
                    <p className="notif-body">{notif.body}</p>
                    <p className="notif-time">{new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .navbar {
          height: var(--navbar-height);
          position: fixed;
          top: 24px;
          right: 24px;
          left: calc(var(--sidebar-width) + 24px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 90;
          border-radius: 20px;
          border: 1px solid var(--card-border);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: var(--secondary);
          padding: 0.75rem 1.25rem;
          border-radius: 14px;
          width: 380px;
          border: 1px solid var(--card-border);
          transition: all 0.3s ease;
        }

        .search-bar:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.1);
          width: 420px;
        }

        .search-icon {
          color: var(--text-muted);
          margin-right: 0.75rem;
          font-size: 1.1rem;
        }

        .search-bar input {
          background: none;
          border: none;
          color: var(--foreground);
          font-size: 0.95rem;
          width: 100%;
          font-weight: 500;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .action-btn {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--secondary);
          border-radius: 14px;
          color: var(--text-muted);
          font-size: 1.4rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          border: 1px solid var(--card-border);
        }

        .action-btn:hover, .action-btn.active {
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-2px);
          background: var(--background);
        }

        .badge {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 10px;
          height: 10px;
          background: var(--primary);
          border-radius: 50%;
          border: 2px solid var(--secondary);
        }

        .divider {
          width: 1px;
          height: 28px;
          background: var(--card-border);
          margin: 0 0.25rem;
        }

        .profile-preview {
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .profile-preview:hover {
          transform: scale(1.05);
        }

        .navbar-avatar {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          border: 2px solid var(--primary);
          object-fit: cover;
        }

        .notifications-panel {
          position: absolute;
          top: calc(var(--navbar-height) + 12px);
          right: 0;
          width: 380px;
          max-height: 520px;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          z-index: 1000;
          border-radius: 20px;
          overflow: hidden;
        }

        .panel-header {
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--card-border);
          background: rgba(20, 20, 20, 0.4);
        }

        .header-title-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .clear-btn {
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 600;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          background: rgba(234, 179, 8, 0.1);
          transition: all 0.2s;
        }
        .clear-btn:hover { background: var(--primary); color: #000; }

        .close-btn { color: var(--text-muted); font-size: 1.3rem; transition: color 0.2s; }
        .close-btn:hover { color: var(--error); }

        .empty-state {
          padding: 4rem 2rem;
          text-align: center;
          color: var(--text-muted);
        }
        .empty-icon { font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.3; }
        .enable-btn {
          margin-top: 1.5rem;
          background: var(--primary);
          color: #000;
          padding: 0.6rem 1.25rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          transition: all 0.2s;
        }
        .enable-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(234, 179, 8, 0.3); }

        .notifications-list { display: flex; flex-direction: column; background: transparent; }
        .notification-item {
          padding: 1.25rem 1.5rem;
          display: flex;
          gap: 1.25rem;
          border-bottom: 1px solid var(--card-border);
          transition: all 0.2s;
          cursor: pointer;
        }
        .notification-item:hover { background: rgba(255, 255, 255, 0.03); }
        .notification-item.unread { background: rgba(234, 179, 8, 0.03); border-left: 3px solid var(--primary); }

        .notif-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 1.2rem;
        }
        .notif-icon.info { background: rgba(99, 102, 241, 0.1); color: var(--primary); }

        .notif-text { font-size: 0.95rem; font-weight: 700; margin: 0 0 0.2rem 0; color: var(--foreground); }
        .notif-body { font-size: 0.85rem; margin: 0 0 0.5rem 0; color: var(--text-muted); line-height: 1.4; }
        .notif-time { font-size: 0.75rem; color: var(--text-muted); margin: 0; opacity: 0.7; }
      `}</style>
    </header>
  );
}
