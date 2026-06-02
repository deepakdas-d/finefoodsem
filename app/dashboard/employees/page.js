"use client";
import { useEmployees } from "@/hooks/useEmployees";
import EmployeeTable from "@/components/employees/EmployeeTable";
import { deleteEmployee } from "@/lib/employeeService";
import Link from "next/link";
import { FiPlus, FiUsers, FiTrash2 } from "react-icons/fi";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { useState } from "react";

export default function EmployeesPage() {
  const { employees, loading, error, refetch } = useEmployees();
  const { addToast } = useToast();
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteEmployee(deleteId);
      addToast("Employee deleted successfully", "success");
      setDeleteId(null);
      refetch();
    } catch (err) {
      addToast(err.message || "Failed to delete employee", "error");
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
        <EmployeeTable employees={employees} onDelete={(id) => setDeleteId(id)} />
      )}

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Deletion"
        footer={
          <>
            <button className="secondary-btn" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="delete-btn" onClick={handleDelete}>
              <FiTrash2 /> Delete Employee
            </button>
          </>
        }
      >
        <p>Are you sure you want to remove this employee? This action is permanent and cannot be undone.</p>
      </Modal>

      <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        @media (max-width: 640px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .add-btn {
            width: 100%;
            justify-content: center;
          }
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

        .secondary-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          background: var(--secondary);
          color: var(--foreground);
          font-weight: 600;
        }

        .delete-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          background: var(--error);
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
