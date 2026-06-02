"use client";
import { useState } from "react";
import { FiSearch, FiBell, FiSettings, FiX } from "react-icons/fi";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="navbar glass">
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search employees, reports..." />
      </div>

      <div className="navbar-actions">
        <button
          className={`action-btn ${showNotifications ? "active" : ""}`}
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <FiBell />
          <span className="badge"></span>
        </button>
        <button className="action-btn">
          <FiSettings />
        </button>
        <div className="divider"></div>
        <div className="profile-preview">
          <img
            src={`https://ui-avatars.com/api/?name=Admin+User&background=fbbf24&color=000`}
            alt="Profile"
            className="navbar-avatar"
          />
        </div>
      </div>

      {showNotifications && (
        <div className="notifications-panel glass animate-fade-in">
          <div className="panel-header">
            <h4>Notifications</h4>
            <button onClick={() => setShowNotifications(false)}><FiX /></button>
          </div>
          <div className="notifications-list">
            <div className="notification-item">
              <div className="notif-icon info">!</div>
              <div className="notif-content">
                <p className="notif-text">Welcome to <strong>FineFoods EM</strong></p>
                <p className="notif-time">Just now</p>
              </div>
            </div>
            <div className="notification-item unread">
              <div className="notif-icon warning">W</div>
              <div className="notif-content">
                <p className="notif-text">Check-out missing for 3 employees</p>
                <p className="notif-time">2 hours ago</p>
              </div>
            </div>
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
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--card-border);
          background: var(--card-bg);
        }

        .panel-header h4 { margin: 0; font-size: 1.2rem; font-weight: 700; color: var(--foreground); }
        .panel-header button { color: var(--text-muted); font-size: 1.3rem; transition: color 0.2s; }
        .panel-header button:hover { color: var(--error); }

        .notifications-list { display: flex; flex-direction: column; background: var(--card-bg); }
        .notification-item {
          padding: 1.25rem 1.5rem;
          display: flex;
          gap: 1.25rem;
          border-bottom: 1px solid var(--card-border);
          transition: all 0.2s;
          cursor: pointer;
        }
        .notification-item:hover { background: var(--secondary); }
        .notification-item.unread { background: rgba(234, 179, 8, 0.05); }

        .notif-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          flex-shrink: 0;
          font-size: 1.1rem;
        }
        .notif-icon.info { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
        .notif-icon.warning { background: rgba(234, 179, 8, 0.15); color: var(--primary); }

        .notif-text { font-size: 0.95rem; margin: 0 0 0.4rem 0; color: var(--foreground); line-height: 1.4; }
        .notif-text strong { color: var(--primary); }
        .notif-time { font-size: 0.8rem; color: var(--text-muted); margin: 0; font-weight: 500; }
      `}</style>
    </header>
  );
}
