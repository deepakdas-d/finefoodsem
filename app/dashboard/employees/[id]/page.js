"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EmployeeForm from "@/components/employees/EmployeeForm";
import { getEmployeeById, updateEmployee } from "@/lib/employeeService";
import { FiArrowLeft, FiEdit3 } from "react-icons/fi";
import Link from "next/link";

export default function EditEmployeePage() {
    const { id } = useParams();
    const router = useRouter();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEmployee() {
            try {
                const data = await getEmployeeById(id);
                if (data) {
                    setEmployee(data);
                } else {
                    router.push("/dashboard/employees");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadEmployee();
    }, [id, router]);

    const handleSubmit = async (data) => {
        try {
            await updateEmployee(id, data);
            router.push("/dashboard/employees");
        } catch (err) {
            alert("Failed to update employee: " + err.message);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <Link href="/dashboard/employees" className="back-link">
                    <FiArrowLeft /> Back to Directory
                </Link>
                <div className="header-title">
                    <div className="icon-badge">
                        <FiEdit3 />
                    </div>
                    <div>
                        <h1>Edit Employee</h1>
                        <p className="subtitle">Modify {employee?.name || "employee"}'s profile information</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="loader">Loading employee data...</div>
            ) : (
                <EmployeeForm
                    initialData={employee}
                    onSubmit={handleSubmit}
                    onCancel={() => router.push("/dashboard/employees")}
                />
            )}

            <style jsx>{`
        .page-header {
          margin-bottom: 2.5rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .back-link:hover {
          color: var(--primary);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .icon-badge {
          width: 50px;
          height: 50px;
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        h1 {
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0;
        }

        .subtitle {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin: 0;
        }

        .loader {
          text-align: center;
          padding: 4rem;
          color: var(--text-muted);
          border: 1px dashed var(--card-border);
          border-radius: 12px;
        }
      `}</style>
        </div>
    );
}
