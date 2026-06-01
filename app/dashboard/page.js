"use client";
import { useEmployees } from "@/hooks/useEmployees";
import { useAttendance } from "@/hooks/useAttendance";
import { FiUsers, FiClock, FiActivity, FiUserPlus } from "react-icons/fi";
import Link from "next/link";
import { getTodayStr, formatDate } from "@/utils/formatDate";

export default function DashboardPage() {
    const { employees, loading: empLoading } = useEmployees();
    const { records, loading: attLoading } = useAttendance();
    const today = getTodayStr();

    const presentToday = records.filter(r => r.date === today).length;
    const totalHoursToday = records
        .filter(r => r.date === today)
        .reduce((sum, r) => sum + (r.totalHours || 0), 0);

    const recentRecords = records.slice(0, 5);

    const stats = [
        {
            label: "Total Employees",
            value: empLoading ? "..." : employees.length,
            icon: <FiUsers />,
            color: "blue",
            link: "/dashboard/employees"
        },
        {
            label: "Present Today",
            value: attLoading ? "..." : presentToday,
            icon: <FiActivity />,
            color: "green",
            link: "/dashboard/attendance"
        },
        {
            label: "Total Hours Today",
            value: attLoading ? "..." : `${totalHoursToday.toFixed(1)}h`,
            icon: <FiClock />,
            color: "purple",
            link: "/dashboard/reports"
        },
    ];

    return (
        <div className="dashboard-container animate-fade-in">
            <div className="welcome-section">
                <h1>Welcome back, <span className="text-gradient">Admin</span></h1>
                <p className="subtitle">Here's what's happening with your workforce today.</p>
            </div>

            <div className="stats-grid">
                {stats.map((stat, i) => (
                    <Link href={stat.link} key={i}>
                        <div className={`stat-card glass hover-scale color-${stat.color}`}>
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-info">
                                <p className="stat-label">{stat.label}</p>
                                <h2 className="stat-value">{stat.value}</h2>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="recent-activity glass">
                    <div className="card-header">
                        <h3>Recent Attendance</h3>
                        <Link href="/dashboard/attendance" className="view-all">View All</Link>
                    </div>
                    <div className="activity-list">
                        {attLoading ? (
                            <div className="p-4">Loading stats...</div>
                        ) : recentRecords.length > 0 ? (
                            recentRecords.map((rec) => (
                                <div key={rec.id} className="activity-item">
                                    <div className="activity-icon">
                                        {rec.employeeName.charAt(0)}
                                    </div>
                                    <div className="activity-details">
                                        <p className="activity-user">{rec.employeeName}</p>
                                        <p className="activity-time">{formatDate(rec.date)} • {rec.checkIn} - {rec.checkOut}</p>
                                    </div>
                                    <div className="activity-meta">
                                        <span className="activity-hours">{rec.totalHours}h</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="empty-msg">No recent activity recorded.</p>
                        )}
                    </div>
                </div>

                <div className="quick-actions glass">
                    <h3>Quick Actions</h3>
                    <div className="action-buttons">
                        <Link href="/dashboard/employees/add" className="q-btn btn-primary">
                            <FiUserPlus /> Add Employee
                        </Link>
                        <Link href="/dashboard/attendance/add" className="q-btn btn-secondary">
                            <FiClock /> Record Time
                        </Link>
                        <Link href="/dashboard/reports" className="q-btn btn-outline">
                            <FiActivity /> View Reports
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .dashboard-container { display: flex; flex-direction: column; gap: 2.5rem; }
        .welcome-section h1 { font-size: 2.2rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -1px; }
        .text-gradient { background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { color: var(--text-muted); font-size: 1rem; }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .stat-card { padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-scale:hover { transform: translateY(-5px); border-color: var(--primary); }
        
        .stat-icon { width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; transition: background 0.3s ease; }
        .stat-label { color: var(--text-muted); font-size: 0.95rem; font-weight: 500; margin-bottom: 0.25rem; }
        .stat-value { font-size: 1.75rem; font-weight: 800; margin: 0; }

        .color-blue .stat-icon { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .color-green .stat-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .color-purple .stat-icon { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }

        .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
        .recent-activity { padding: 1.5rem; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .view-all { font-size: 0.85rem; color: var(--primary); font-weight: 600; }
        
        .activity-list { display: flex; flex-direction: column; gap: 1.25rem; }
        .activity-item { display: flex; align-items: center; gap: 1rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--card-border); }
        .activity-item:last-child { border-bottom: none; padding-bottom: 0; }
        
        .activity-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--secondary); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--primary); }
        .activity-user { font-weight: 600; font-size: 1rem; margin: 0; }
        .activity-time { font-size: 0.85rem; color: var(--text-muted); margin: 0; }
        .activity-hours { background: rgba(255, 255, 255, 0.05); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600; }

        .quick-actions { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .action-buttons { display: flex; flex-direction: column; gap: 1rem; }
        .q-btn { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border-radius: 12px; font-weight: 600; transition: all 0.2s ease; }
        .btn-primary { background: var(--primary); color: white; }
        .btn-secondary { background: var(--secondary); color: var(--foreground); }
        .btn-outline { border: 1px solid var(--card-border); color: var(--text-muted); }
        .q-btn:hover { filter: brightness(1.1); transform: translateX(5px); }

        @media (max-width: 1024px) {
          .dashboard-grid { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    );
}
