"use client";
import AttendanceForm from "@/components/attendance/AttendanceForm";
import { addAttendance } from "@/lib/attendanceService";
import { useEmployees } from "@/hooks/useEmployees";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiPlusCircle } from "react-icons/fi";
import Link from "next/link";

export default function AddAttendancePage() {
    const router = useRouter();
    const { employees, loading: employeesLoading } = useEmployees();

    const handleSubmit = async (data) => {
        try {
            await addAttendance(data);
            router.push("/dashboard/attendance");
        } catch (err) {
            alert("Failed to save: " + err.message);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <Link href="/dashboard/attendance" className="back-link">
                    <FiArrowLeft /> Back to Logs
                </Link>
                <div className="header-title">
                    <div className="icon-badge">
                        <FiPlusCircle />
                    </div>
                    <div>
                        <h1>New Record</h1>
                        <p className="subtitle">Enter manual attendance for an employee</p>
                    </div>
                </div>
            </div>

            {employeesLoading ? (
                <div className="loader">Loading employee list...</div>
            ) : (
                <AttendanceForm
                    employees={employees}
                    onSubmit={handleSubmit}
                    onCancel={() => router.push("/dashboard/attendance")}
                />
            )}

            <style jsx>{`
        .page-header { margin-bottom: 2.5rem; }
        .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text-muted); margin-bottom: 1.5rem; }
        .header-title { display: flex; align-items: center; gap: 1.25rem; }
        .icon-badge {
          width: 50px; height: 50px;
          background: rgba(99, 102, 241, 0.1); color: var(--primary);
          border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
        }
        h1 { font-size: 1.75rem; font-weight: 700; margin: 0; }
        .loader { text-align: center; padding: 4rem; color: var(--text-muted); }
      `}</style>
        </div>
    );
}
