"use client";
import { FiEdit2, FiTrash2, FiClock, FiCalendar } from "react-icons/fi";
import Link from "next/link";
import { formatDate, formatTime } from "@/utils/formatDate";

export default function AttendanceTable({ records, onDelete }) {
    return (
        <div className="table-container glass animate-fade-in">
            <div className="table-header">
                <h3>Attendance Logs</h3>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Date</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Hours</th>
                            <th>Status</th>
                            <th className="actions-cell">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length > 0 ? (
                            records.map((rec) => (
                                <tr key={rec.id} className="table-row">
                                    <td className="name-bold">{rec.employeeName}</td>
                                    <td>
                                        <div className="date-flex">
                                            <FiCalendar className="icon-muted" />
                                            {formatDate(rec.date)}
                                        </div>
                                    </td>
                                    <td>{formatTime(rec.checkIn)}</td>
                                    <td>{formatTime(rec.checkOut)}</td>
                                    <td>
                                        <div className="hours-badge">
                                            <FiClock className="icon-xs" />
                                            {rec.totalHours} hrs
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${rec.status.toLowerCase().replace(" ", "-")}`}>
                                            {rec.status}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <div className="action-btns">
                                            <Link href={`/dashboard/attendance/${rec.id}`} className="edit-btn">
                                                <FiEdit2 />
                                            </Link>
                                            <button onClick={() => onDelete(rec.id)} className="delete-btn">
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="empty-state">No attendance records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
        .table-container {
          padding: 1.5rem;
          margin-top: 1.5rem;
        }

        .table-header {
          margin-bottom: 1.5rem;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        th {
          padding: 1rem;
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.85rem;
          text-transform: uppercase;
          border-bottom: 1px solid var(--card-border);
        }

        td {
          padding: 1rem;
          border-bottom: 1px solid var(--card-border);
          font-size: 0.9rem;
        }

        .name-bold {
          font-weight: 600;
        }

        .date-flex {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .icon-muted {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .hours-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          font-weight: 600;
          color: var(--foreground);
        }

        .icon-xs {
          font-size: 0.8rem;
          color: var(--primary);
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.present { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .status-badge.late { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .status-badge.overtime { background: rgba(99, 102, 241, 0.1); color: var(--primary); }
        .status-badge.half-day { background: rgba(239, 68, 68, 0.1); color: var(--error); }

        .actions-cell { text-align: right; }
        .action-btns { display: flex; justify-content: flex-end; gap: 0.5rem; }
        
        .edit-btn, .delete-btn {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 6px; transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.05); color: var(--text-muted);
        }

        .edit-btn:hover { color: var(--primary); background: rgba(99, 102, 241, 0.1); }
        .delete-btn:hover { color: var(--error); background: rgba(239, 68, 68, 0.1); }

        .empty-state { text-align: center; padding: 3rem; color: var(--text-muted); }
      `}</style>
        </div>
    );
}
