"use client";
import { FiSearch, FiBell, FiSettings } from "react-icons/fi";

export default function Navbar() {
    return (
        <header className="navbar glass">
            <div className="search-bar">
                <FiSearch className="search-icon" />
                <input type="text" placeholder="Search anything..." />
            </div>

            <div className="navbar-actions">
                <button className="action-btn">
                    <FiBell />
                    <span className="badge"></span>
                </button>
                <button className="action-btn">
                    <FiSettings />
                </button>
                <div className="divider"></div>
                <div className="profile-preview">
                    <img
                        src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff"
                        alt="Profile"
                        className="navbar-avatar"
                    />
                </div>
            </div>

            <style jsx>{`
        .navbar {
          height: var(--navbar-height);
          position: fixed;
          top: 20px;
          right: 20px;
          left: calc(var(--sidebar-width) + 20px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          z-index: 90;
          border-radius: 16px;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.5rem 1rem;
          border-radius: 12px;
          width: 300px;
          border: 1px solid var(--card-border);
        }

        .search-icon {
          color: var(--text-muted);
          margin-right: 0.75rem;
        }

        .search-bar input {
          background: none;
          border: none;
          color: var(--foreground);
          font-size: 0.9rem;
          width: 100%;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .action-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          color: var(--text-muted);
          font-size: 1.25rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--foreground);
        }

        .badge {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 50%;
          border: 2px solid var(--secondary);
        }

        .divider {
          width: 1px;
          height: 24px;
          background: var(--card-border);
          margin: 0 0.5rem;
        }

        .navbar-avatar {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 2px solid var(--primary);
        }
      `}</style>
        </header>
    );
}
