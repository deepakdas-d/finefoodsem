"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AttendanceForm from "@/components/attendance/AttendanceForm";
import { getAttendanceById, updateAttendance } from "@/lib/attendanceService";
import { useEmployees } from "@/hooks/useEmployees";
import { FiArrowLeft, FiEdit3 } from "react-icons/fi";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

export default function EditAttendancePage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToast } = useToast();
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const { employees, loading: employeesLoading } = useEmployees();

    useEffect(() => {
        async function loadRecord() {
            try {
                const data = await getAttendanceById(id);
                if (data) {
                    setRecord(data);
                } else {
                    router.push("/dashboard/attendance");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadRecord();
    }, [id, router]);

    const handleSubmit = async (data) => {
        try {
            await updateAttendance(id, data);
            router.push("/dashboard/attendance");
        } catch (err) {
            addToast(err.message || "Failed to update attendance", "error");
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
                        <FiEdit3 />
                    </div>
                    <div>
                        <h1>Edit Record</h1>
                        <p className="subtitle">Update attendance details for {record?.employeeName}</p>
                    </div>
                </div>
            </div>

            {loading || employeesLoading ? (
                <div className="loader">Fulfilling request...</div>
            ) : (
                <AttendanceForm
                    employees={employees}
                    initialData={record}
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
