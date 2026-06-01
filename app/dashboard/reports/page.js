"use client";
import { useState, useMemo } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { useAttendance } from "@/hooks/useAttendance";
import ReportFilters from "@/components/reports/ReportFilters";
import { exportToPDF, exportToExcel } from "@/utils/exportReport";
import { formatDate, formatTime, getMonthRange } from "@/utils/formatDate";
import { FiFileText, FiDownload, FiTable } from "react-icons/fi";

export default function ReportsPage() {
    const { employees } = useEmployees();
    const monthRange = getMonthRange();

    const [filters, setFilters] = useState({
        employeeId: "",
        startDate: monthRange.start,
        endDate: monthRange.end,
    });

    const { records, loading } = useAttendance();

    const filteredRecords = useMemo(() => {
        return records.filter(rec => {
            const matchEmployee = !filters.employeeId || rec.employeeId === filters.employeeId;
            const matchDate = rec.date >= filters.startDate && rec.date <= filters.endDate;
            return matchEmployee && matchDate;
        });
    }, [records, filters]);

    const totalHours = useMemo(() => {
        return filteredRecords.reduce((sum, rec) => sum + (rec.totalHours || 0), 0).toFixed(1);
    }, [filteredRecords]);

    const columns = [
        { header: "Employee", key: "employeeName" },
        { header: "Date", key: "displayDate" },
        { header: "Check In", key: "displayIn" },
        { header: "Check Out", key: "displayOut" },
        { header: "Hours", key: "totalHours" },
        { header: "Status", key: "status" },
    ];

    const exportData = useMemo(() => {
        return filteredRecords.map(rec => ({
            ...rec,
            displayDate: formatDate(rec.date),
            displayIn: formatTime(rec.checkIn),
            displayOut: formatTime(rec.checkOut),
        }));
    }, [filteredRecords]);

    const handleExportPDF = () => exportToPDF(exportData, columns, "Attendance Report");
    const handleExportExcel = () => exportToExcel(exportData, columns, "Attendance Report");

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <div className="header-title">
                    <div className="icon-badge">
                        <FiTable />
                    </div>
                    <div>
                        <h1>Attendance Reports</h1>
                        <p className="subtitle">Detailed records with export options</p>
                    </div>
                </div>
                <div className="export-actions">
                    <button onClick={handleExportPDF} className="export-btn pdf" title="Export PDF">
                        <FiFileText /> PDF
                    </button>
                    <button onClick={handleExportExcel} className="export-btn excel" title="Export Excel">
                        <FiDownload /> Excel
                    </button>
                </div>
            </div>

            <ReportFilters
                employees={employees}
                filters={filters}
                setFilters={setFilters}
                onApply={() => { }}
            />

            <div className="report-summary glass">
                <div className="summary-item">
                    <span className="label">Total Records:</span>
                    <span className="value">{filteredRecords.length}</span>
                </div>
                <div className="summary-item">
                    <span className="label">Total Hours:</span>
                    <span className="value">{totalHours}h</span>
                </div>
            </div>

            <div className="table-container glass mt-4">
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                {columns.map(col => <th key={col.key}>{col.header}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-muted">Loading reports...</td></tr>
                            ) : filteredRecords.length > 0 ? (
                                filteredRecords.map(rec => (
                                    <tr key={rec.id} className="table-row">
                                        <td className="font-bold">{rec.employeeName}</td>
                                        <td>{formatDate(rec.date)}</td>
                                        <td>{formatTime(rec.checkIn)}</td>
                                        <td>{formatTime(rec.checkOut)}</td>
                                        <td className="font-bold text-primary">{rec.totalHours}h</td>
                                        <td><span className={`status-small ${rec.status.toLowerCase().replace(" ", "-")}`}>{rec.status}</span></td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6" className="p-8 text-center text-muted">No records match the current filters.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .header-title { display: flex; align-items: center; gap: 1.25rem; }
        .icon-badge {
          width: 50px; height: 50px;
          background: rgba(16, 185, 129, 0.1); color: var(--success);
          border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
        }
        h1 { font-size: 1.75rem; font-weight: 700; margin: 0; }
        .subtitle { color: var(--text-muted); font-size: 0.9rem; }
        
        .export-actions { display: flex; gap: 0.75rem; }
        .export-btn {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.6rem 1rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem;
          transition: all 0.2s ease;
        }
        .export-btn.pdf { background: rgba(239, 68, 68, 0.1); color: var(--error); border: 1px solid rgba(239, 68, 68, 0.2); }
        .export-btn.excel { background: rgba(16, 185, 129, 0.1); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.2); }
        .export-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }

        .report-summary { display: flex; gap: 2rem; padding: 1.25rem; margin-bottom: 1.5rem; }
        .summary-item { display: flex; flex-direction: column; gap: 0.25rem; }
        .summary-item .label { color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .summary-item .value { font-size: 1.5rem; font-weight: 700; color: var(--foreground); }

        .mt-4 { margin-top: 1rem; }
        .p-8 { padding: 2rem; }
        .text-center { text-align: center; }
        .font-bold { font-weight: 600; }
        .text-primary { color: var(--primary); }

        .status-small {
          font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
          padding: 0.2rem 0.5rem; border-radius: 4px;
        }
        .present { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .late { background: rgba(245, 158, 11, 0.1); color: var(--warning); }

        .table-wrapper { overflow-x: auto; padding: 1rem; }
        table { width: 100%; border-collapse: collapse; }
        th { padding: 0.75rem 1rem; text-align: left; color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; border-bottom: 1px solid var(--card-border); }
        td { padding: 1rem; border-bottom: 1px solid var(--card-border); font-size: 0.9rem; }
        .table-row:hover { background: rgba(255, 255, 255, 0.02); }
      `}</style>
        </div>
    );
}
