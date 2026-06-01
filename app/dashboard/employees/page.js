"use client";
import { useEmployees } from "@/hooks/useEmployees";
import EmployeeTable from "@/components/employees/EmployeeTable";
import { deleteEmployee } from "@/lib/employeeService";
import Link from "next/link";
import { FiPlus, FiUsers } from "react-icons/fi";

export default function EmployeesPage() {
    const { employees, loading, error, refetch } = useEmployees();

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await deleteEmployee(id);
                refetch();
            } catch (err) {
                alert("Failed to delete employee: " + err.message);
            }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="header-title">
                    <div className="icon-badge">
                        <FiUsers />
                    </div>
                    <div>
                        <h1>Employees</h1>
                        <p className="subtitle">Manage your workforce directory</p>
                    </div>
                </div>
                <Link href="/dashboard/employees/add" className="add-btn">
                    <FiPlus /> Add Employee
                </Link>
            </div>

            {loading ? (
                <div className="loader">Loading employees...</div>
            ) : error ? (
                <div className="error-state">Error: {error}</div>
            ) : (
                <EmployeeTable employees={employees} onDelete={handleDelete} />
            )}

            <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
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

        .add-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--primary);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .add-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
        }

        .loader {
          text-align: center;
          padding: 4rem;
          color: var(--text-muted);
          border: 1px dashed var(--card-border);
          border-radius: 12px;
        }

        .error-state {
          padding: 2rem;
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
          border-radius: 12px;
        }
      `}</style>
        </div>
    );
}
