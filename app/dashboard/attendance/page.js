"use client";
import { useAttendance } from "@/hooks/useAttendance";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import { deleteAttendance } from "@/lib/attendanceService";
import Link from "next/link";
import { FiPlus, FiClock } from "react-icons/fi";

export default function AttendancePage() {
    const { records, loading, error, refetch } = useAttendance();

    const handleDelete = async (id) => {
        if (window.confirm("Delete this attendance record?")) {
            try {
                await deleteAttendance(id);
                refetch();
            } catch (err) {
                alert("Delete failed: " + err.message);
            }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="header-title">
                    <div className="icon-badge">
                        <FiClock />
                    </div>
                    <div>
                        <h1>Attendance</h1>
                        <p className="subtitle">Daily check-in/out logs and hours</p>
                    </div>
                </div>
                <Link href="/dashboard/attendance/add" className="add-btn">
                    <FiPlus /> Record Attendance
                </Link>
            </div>

            {loading ? (
                <div className="loader">Syncing records...</div>
            ) : error ? (
                <div className="error-state">Sync Error: {error}</div>
            ) : (
                <AttendanceTable records={records} onDelete={handleDelete} />
            )}

            <style jsx>{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .header-title { display: flex; align-items: center; gap: 1.25rem; }
        .icon-badge {
          width: 50px; height: 50px;
          background: rgba(99, 102, 241, 0.1); color: var(--primary);
          border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
        }
        h1 { font-size: 1.75rem; font-weight: 700; margin: 0; }
        .subtitle { color: var(--text-muted); font-size: 0.9rem; margin: 0; }
        
        .add-btn {
          display: flex; align-items: center; gap: 0.5rem;
          background: var(--primary); color: white;
          padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 600;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); transition: all 0.3s ease;
        }
        .add-btn:hover { background: var(--primary-hover); transform: translateY(-2px); }
        .loader { text-align: center; padding: 4rem; color: var(--text-muted); }
      `}</style>
        </div>
    );
}
